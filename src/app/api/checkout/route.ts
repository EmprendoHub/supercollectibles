import { cstDateTime } from "@/backend/helpers";
import Affiliate from "@/backend/models/Affiliate";
import Order from "@/backend/models/Order";
import Product from "@/backend/models/Product";
import ReferralLink from "@/backend/models/ReferralLink";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Stripe from "stripe";

async function getCartItems(items: any) {
  try {
    return new Promise((resolve, reject) => {
      let cartItems = [];

      items?.forEach(async (item: any) => {
        const variationId = item.variation;
        const product = await Product.findOne({
          "variations._id": variationId,
        });

        const variation = product.variations.find((variation: any) =>
          variation._id.equals(item.variation)
        );
        // Check if there is enough stock
        if (variation.stock < item.quantity) {
          console.log("Insufficient stock");
          return;
        }

        cartItems.push({
          product: { _id: item.product },
          variation: variationId,
          name: item.title.replace(/[^\w\s]/gi, ""),
          description: item.title.replace(/[^\w\s]/gi, ""),
          color: item.color,
          size: item.size,
          price: item.price,
          quantity: item.quantity,
          image: item.image[0].url,
        });

        if (cartItems.length === items?.length) {
          resolve(cartItems);
        }
      });
    });
  } catch (error) {
    console.log("erro", error);
  }
}

const calculateTotalAmount = (items: any) => {
  // Assuming each item has a 'price' and 'quantity' property
  return items.reduce(
    (total: any, item: any) => total + item.price * item.quantity,
    0
  );
};

export const POST = async (request: any) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const mongoSession = await mongoose.startSession();
  const reqBody = await request.json();
  const { items, email, user, shipping, affiliateInfo, payType } =
    await reqBody;

  try {
    mongoSession.startTransaction();

    let affiliate: any;
    if (affiliateInfo) {
      const affiliateLink = await ReferralLink.findOne({ _id: affiliateInfo });
      affiliate = await Affiliate.findOne({
        _id: affiliateLink.affiliateId,
      }).lean();
    }

    const existingCustomers = await stripe.customers.list({
      email: user.email,
    });
    let customerId;

    if (existingCustomers.data.length > 0) {
      // Customer already exists, use the first customer found
      const existingCustomer = existingCustomers.data[0];
      customerId = existingCustomer.id;
    } else {
      // Customer doesn't exist, create a new customer
      const newCustomer = await stripe.customers.create({
        email: user.email,
      });

      customerId = newCustomer.id;
    }

    // Calculate total amount based on items
    let totalAmount = await calculateTotalAmount(items);

    let pay_method_options: any[] = ["card", "oxxo"];

    if (totalAmount < 10000) {
      pay_method_options = ["card", "oxxo"];
    } else {
      pay_method_options = ["card"];
    }

    let session;

    const shippingInfo = JSON.stringify(shipping);
    const ship_cost = 0;
    const date = cstDateTime();
    const paymentInfo = {
      id: "pending",
      status: "pending",
      amountPaid: 0,
      taxPaid: 0,
      paymentIntent: "pending",
    };

    const order_items = await getCartItems(items);
    console.log(items);
    const line_items = await items.map((item: any) => {
      return {
        price_data: {
          currency: "mxn",
          unit_amount: item.price * 100,
          product_data: {
            name: item.title,
            description: item.description,
            images: [item.image[0].url],
            metadata: {
              productId: item.product,
              variationId: item._id,
              color: item.color,
              size: item.size,
            },
          },
        },
        quantity: item.quantity,
      };
    });

    console.log(line_items[0].price_data.product_data);

    const orderData = {
      user: user._id,
      phone: user?.phone,
      email: user?.email,
      customerName: user?.name,
      ship_cost,
      createdAt: date,
      shippingInfo: shipping,
      paymentInfo,
      branch: "WWW",
      orderItems: order_items,
      orderStatus: "Pendiente",
      layaway: false,
      affiliateId: affiliate?._id.toString() || "",
    };

    const newOrder = await new Order(orderData).save({ session: mongoSession });

    // Intentionally cause an error by attempting to insert a document with missing required fields
    //await new Customer({}).save({ session: mongoSession });

    session = await stripe.checkout.sessions.create({
      payment_method_types: pay_method_options,
      mode: "payment",
      customer: customerId,
      payment_method_options: {
        oxxo: {
          expires_after_days: 5,
        },
        customer_balance: {
          funding_type: "bank_transfer",
          bank_transfer: {
            type: "mx_bank_transfer",
          },
        },
      },
      locale: "es-419",
      success_url: `${process.env.NEXTAUTH_URL}/perfil/pedidos?pedido_exitoso=true`,
      cancel_url: `${
        process.env.NEXTAUTH_URL
      }/cancelado?id=${newOrder._id.toString()}`,
      client_reference_id: user?._id,
      metadata: {
        shippingInfo,
        layaway: "false",
        order: newOrder._id.toString(),
        referralID: affiliateInfo,
      },
      shipping_options: [
        {
          shipping_rate: "shr_1Pt0n4IWvmM2ObRMhsFB7mxR",
        },
      ],
      line_items,
    });

    await mongoSession.commitTransaction();
    mongoSession.endSession();

    return NextResponse.json({
      message: "Connection is active",
      success: true,
      id: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.log("error", error);

    await mongoSession.abortTransaction();
    mongoSession.endSession();
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
