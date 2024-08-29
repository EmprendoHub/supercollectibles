import { cstDateTime } from "@/backend/helpers";
import Affiliate from "@/backend/models/Affiliate";
import Order from "@/backend/models/Order";
import Payment from "@/backend/models/Payment";
import Product from "@/backend/models/Product";
import ReferralEvent from "@/backend/models/ReferralEvent";
import ReferralLink from "@/backend/models/ReferralLink";
import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: any, res: any) {
  try {
    await dbConnect();

    // Access the value of stripe-signature from the headers
    const signature = await req.headers.get("stripe-signature");
    const rawBody = await req.text();
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    const session: any = event.data.object;

    // Payment confirmed
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      // get all the details from stripe checkout to create new order
      const payIntentId = session?.payment_intent;

      const paymentIntent: any = await stripe?.paymentIntents.retrieve(
        payIntentId
      );

      const currentOrder = await Order.findOne({
        _id: session?.metadata?.order,
      });

      currentOrder?.orderItems.forEach(async (item: any) => {
        const productId = item.product.toString();
        const variationId = item.variation;
        // Find the product by its _id and update its stock
        const product = await Product.findOne({ _id: productId });
        // Find the product variation
        const variation = product.variations.find((variation: any) =>
          variation._id.equals(variationId)
        );
        if (variation) {
          // Decrement the quantity
          variation.stock -= item.quantity; // Decrease the quantity by 1
          product.stock -= item.quantity; // Decrease the quantity by 1

          // Save the updated product
          await product.save();
        } else {
          console.log("Product not found");
        }
      });

      const paymentMethod: any = await stripe.paymentMethods.retrieve(
        paymentIntent.payment_method
      );

      let newPaymentAmount;
      let payReference;
      if (paymentIntent.payment_method_types[0] === "customer_balance") {
        payReference = "transfer";
      } else if (paymentIntent.payment_method_types[0] === "oxxo") {
        payReference = paymentIntent.next_action.oxxo_display_details.number;
      } else if (paymentIntent.payment_method_types[0] === "card") {
        payReference =
          paymentMethod.card.brand + `****${paymentMethod.card.last4}`;
      }

      if (session.payment_status === "unpaid") {
        newPaymentAmount = 0;
      } else {
        newPaymentAmount = session.amount_total / 100;
        let paymentTransactionData = {
          type: "online",
          paymentIntent: paymentIntent.id,
          amount: newPaymentAmount,
          reference: payReference,
          pay_date: new Date(paymentIntent.created * 1000),
          method: paymentIntent.payment_method_types[0],
          order: currentOrder?._id,
          user: currentOrder?.user,
        };
        try {
          const newPaymentTransaction = await new Payment(
            paymentTransactionData
          );

          await newPaymentTransaction.save();
        } catch (error) {
          console.log("deberror", error);
        }
      }

      let payAmount = currentOrder.paymentInfo.amountPaid + newPaymentAmount;
      // Use reduce to sum up the 'total' field
      const totalOrderAmount = currentOrder.orderItems.reduce(
        (acc: any, orderItem: any) =>
          acc + orderItem.quantity * orderItem.price,
        0
      );

      if (payAmount >= totalOrderAmount) {
        currentOrder.orderStatus = "Procesando";
        currentOrder.paymentInfo.status = "Paid";
        if (session?.metadata?.referralID) {
          const referralLink = await ReferralLink.findOne({
            _id: session?.metadata?.referralID,
          });

          const affiliate = await Affiliate.findOne(referralLink.affiliateId);
          const affiliateId = await affiliate?._id.toString();
          const timestamp = cstDateTime(); // Current timestamp
          //transfer amount to affiliate
          const transfer = await stripe.transfers.create({
            amount: totalOrderAmount * 0.1 * 100,
            currency: "mxn",
            destination: affiliate?.stripe_id,
            source_transaction: paymentIntent?.latest_charge,
          });
          // Create a ReferralEvent object
          const newReferralEvent = await ReferralEvent.create({
            referralLinkId: { _id: session?.metadata?.referralID },
            eventType: "AffiliatePurchase",
            affiliateId: { _id: affiliateId },
            ipAddress: "234.234.235.77",
            userAgent: "user-agent",
            timestamp: timestamp,
          });
          await newReferralEvent.save();
          referralLink.clickCount = referralLink.clickCount + 1;
          await referralLink.save();
        }
      }

      if (payAmount < totalOrderAmount) {
        currentOrder.orderStatus = "Apartado";
        if (session?.metadata?.referralID) {
          const referralLink = await ReferralLink.findOne({
            _id: session?.metadata?.referralID,
          });
          const affiliate = await Affiliate.findOne(referralLink.affiliateId);
          const affiliateId = await affiliate?._id.toString();
          const timestamp = cstDateTime(); // Current timestamp
          // Create a ReferralEvent object
          const newReferralEvent = await ReferralEvent.create({
            referralLinkId: { _id: session?.metadata?.referralID },
            eventType: "AffiliateLayaway",
            affiliateId: { _id: affiliateId },
            ipAddress: "234.234.235.77",
            userAgent: "user-agent",
            timestamp: timestamp,
          });
          await newReferralEvent.save();
          referralLink.clickCount = referralLink.clickCount + 1;
          await referralLink.save();
        }
      }

      currentOrder.paymentInfo.amountPaid = payAmount;

      await currentOrder.save();
      return NextResponse.json(
        {
          success: true,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Error al Pagar el pedido con stripe Pedido",
      },
      { status: 500 }
    );
  }
}
