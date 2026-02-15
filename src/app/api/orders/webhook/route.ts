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
import nodemailer from "nodemailer";
import enviaService from "@/lib/envia";

// Use test mode for localhost, live mode for production
const isLocalhost =
  process.env.NEXTAUTH_URL?.includes("localhost") ||
  process.env.NODE_ENV === "development";
const stripeKey = isLocalhost
  ? process.env.STRIPE_SECRET_TEST_KEY!
  : process.env.STRIPE_SECRET_KEY!;
const webhookSecret = isLocalhost
  ? process.env.STRIPE_WEBHOOK_TEST_SECRET!
  : process.env.STRIPE_WEBHOOK_SECRET!;

const stripe = new Stripe(stripeKey);

// Create shipment with Envía.com
async function createShipmentWithEnvia(order: any) {
  try {
    // Parse shippingInfo
    let shippingInfo = order.shippingInfo;
    if (typeof shippingInfo === "string") {
      try {
        shippingInfo = JSON.parse(shippingInfo);
      } catch (e) {
        console.error("Error parsing shippingInfo:", e);
        return null;
      }
    }

    // Get carrier and service IDs from the selected shipping method
    const carrierId = shippingInfo?.shippingMethod?.carrier;
    const serviceId = shippingInfo?.shippingMethod?.service;

    console.log("🔍 Shipping method details:", {
      shippingMethod: shippingInfo?.shippingMethod,
      carrierId,
      serviceId,
    });

    if (!carrierId || !serviceId) {
      console.warn("⚠️ Missing carrier or service ID, cannot create shipment");
      console.log(
        "Available shippingInfo:",
        JSON.stringify(shippingInfo, null, 2),
      );
      return null;
    }

    // Prepare origin address
    const origin = {
      name: "Super Collectibles Mx",
      company: "Super Collectibles Mx",
      street: process.env.WAREHOUSE_ADDRESS || "Av. Principal",
      number: process.env.WAREHOUSE_NUMBER || "123",
      district: process.env.WAREHOUSE_DISTRICT || "Centro",
      city: process.env.WAREHOUSE_CITY || "Ciudad de México",
      state: process.env.WAREHOUSE_STATE || "CDMX",
      postal_code: process.env.WAREHOUSE_ZIP || "01000",
      country: "MX",
      phone: process.env.WAREHOUSE_PHONE || "+525512345678",
      email: process.env.WAREHOUSE_EMAIL || "envios@supercollectibles.mx",
    };

    // Prepare destination address
    const destination = {
      name: order.customerName || "Cliente",
      street: shippingInfo?.street || "",
      number: shippingInfo?.number || "S/N",
      district: shippingInfo?.district || shippingInfo?.address2 || "",
      city: shippingInfo?.city || "",
      state: shippingInfo?.province || shippingInfo?.state || "",
      postal_code: shippingInfo?.zip_code || shippingInfo?.zipCode || "",
      country: shippingInfo?.country || "MX",
      phone: shippingInfo?.phone || order.phone || "",
      email: order.email || "",
    };

    // Prepare packages from order items
    const packages = order.orderItems.map((item: any) => ({
      weight: item.weight || 0.5,
      length: item.length || 15,
      width: item.width || 15,
      height: item.height || 10,
      declared_value: item.price * item.quantity,
      content: item.name || "Producto coleccionable",
      type: "box",
      quantity: item.quantity || 1,
    }));

    // Create shipment request
    const shipmentRequest = {
      origin,
      destination,
      packages,
      shipment: {
        type: 1,
        carrier: carrierId,
        service: serviceId,
      },
    };

    console.log("📦 Creating shipment with Envía.com:", shipmentRequest);

    // Create the shipment
    const shipment = await enviaService.createShipment(shipmentRequest);

    console.log("✅ Shipment created successfully:", shipment);

    return shipment;
  } catch (error) {
    console.error("❌ Error creating shipment with Envía.com:", error);
    return null;
  }
}

// Email sending function
async function sendOrderConfirmationEmails(order: any, paymentDetails: any) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GOOGLE_MAIL,
      pass: process.env.GOOGLE_MAIL_PASS,
    },
  });

  // Format order items for email
  const orderItemsHTML = order.orderItems
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.color || "-"} / ${item.size || "-"}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${item.price.toFixed(2)} MXN</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${(item.price * item.quantity).toFixed(2)} MXN</td>
    </tr>
  `,
    )
    .join("");

  const totalOrderAmount = order.orderItems.reduce(
    (acc: any, item: any) => acc + item.quantity * item.price,
    0,
  );
  const shippingCost = order.ship_cost || 0;
  const totalWithShipping = totalOrderAmount + shippingCost;

  // Parse shippingInfo - it might be a string or an object
  let shippingInfo = order.shippingInfo;
  if (typeof shippingInfo === "string") {
    try {
      shippingInfo = JSON.parse(shippingInfo);
    } catch (e) {
      console.error("Error parsing shippingInfo:", e);
      shippingInfo = {};
    }
  }

  // Extract address fields (handling both Address model fields and embedded object)
  const street = shippingInfo?.street || "";
  const city = shippingInfo?.city || "";
  const province = shippingInfo?.province || shippingInfo?.state || "";
  const zipCode = shippingInfo?.zip_code || shippingInfo?.zipCode || "";
  const country = shippingInfo?.country || "México";
  const phone = shippingInfo?.phone || order.phone || "";
  const carrier =
    shippingInfo?.carrier || shippingInfo?.shippingMethod?.carrier || "";
  const service =
    shippingInfo?.service ||
    shippingInfo?.shippingMethod?.service ||
    shippingInfo?.shippingMethod?.serviceName ||
    "";
  const estimatedDays =
    shippingInfo?.estimatedDays ||
    shippingInfo?.shippingMethod?.estimatedDays ||
    0;
  const trackingNumber = order.trackingNumber || "Pendiente";
  const labelUrl = order.labelUrl || "";

  // Email to sales team
  const salesEmailHTML = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .order-details { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background-color: #4CAF50; color: white; padding: 10px; text-align: left; }
        .total-row { font-weight: bold; background-color: #f0f0f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Nuevo Pedido Pagado</h1>
        </div>
        <div class="content">
          <div class="order-details">
            <h2>Detalles del Pedido: ${order._id}</h2>
            <p><strong>Cliente:</strong> ${order.customerName}</p>
            <p><strong>Email:</strong> ${order.email}</p>
            <p><strong>Teléfono:</strong> ${order.phone || "No proporcionado"}</p>
            <p><strong>Fecha:</strong> ${new Date(order.createdAt).toLocaleString("es-MX")}</p>
            <p><strong>Estado:</strong> ${order.orderStatus}</p>
            <p><strong>Método de Pago:</strong> ${paymentDetails.method}</p>
            <p><strong>Referencia:</strong> ${paymentDetails.reference}</p>
          </div>

          <h3>Artículos del Pedido:</h3>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Variante</th>
                <th style="text-align: center;">Cant.</th>
                <th style="text-align: right;">Precio</th>
                <th style="text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHTML}
              <tr class="total-row">
                <td colspan="4" style="padding: 8px; text-align: right;">Subtotal:</td>
                <td style="padding: 8px; text-align: right;">$${totalOrderAmount.toFixed(2)} MXN</td>
              </tr>
              <tr class="total-row">
                <td colspan="4" style="padding: 8px; text-align: right;">Envío:</td>
                <td style="padding: 8px; text-align: right;">$${shippingCost.toFixed(2)} MXN</td>
              </tr>
              <tr class="total-row" style="background-color: #4CAF50; color: white;">
                <td colspan="4" style="padding: 8px; text-align: right;">Total Pagado:</td>
                <td style="padding: 8px; text-align: right;">$${totalWithShipping.toFixed(2)} MXN</td>
              </tr>
            </tbody>
          </table>

          <div class="order-details">
            <h3>Dirección de Envío:</h3>
            <p>${street}</p>
            <p>${city}, ${province} ${zipCode}</p>
            <p>${country}</p>
            ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ""}
            <p><strong>Método de envío:</strong> ${carrier} - ${service}</p>
            ${trackingNumber !== "Pendiente" ? `<p><strong>Número de rastreo:</strong> ${trackingNumber}</p>` : ""}
            ${labelUrl ? `<p><strong>Etiqueta de envío:</strong> <a href="${labelUrl}" target="_blank">Descargar</a></p>` : ""}
          </div>

          <p style="margin-top: 20px; color: #666;">
            <strong>SuperCollectibles.com.mx</strong><br>
            Equipo de Ventas
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Email to customer
  const customerEmailHTML = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .order-details { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background-color: #4CAF50; color: white; padding: 10px; text-align: left; }
        .total-row { font-weight: bold; background-color: #f0f0f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Gracias por tu compra!</h1>
        </div>
        <div class="content">
          <p>Estimado/a ${order.customerName},</p>
          <p>Hemos recibido tu pago exitosamente. Tu pedido está siendo procesado y lo enviaremos pronto.</p>

          <div class="order-details">
            <h2>Detalles del Pedido: ${order._id}</h2>
            <p><strong>Fecha:</strong> ${new Date(order.createdAt).toLocaleString("es-MX")}</p>
            <p><strong>Estado:</strong> ${order.orderStatus}</p>
          </div>

          <h3>Artículos del Pedido:</h3>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Variante</th>
                <th style="text-align: center;">Cant.</th>
                <th style="text-align: right;">Precio</th>
                <th style="text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHTML}
              <tr class="total-row">
                <td colspan="4" style="padding: 8px; text-align: right;">Subtotal:</td>
                <td style="padding: 8px; text-align: right;">$${totalOrderAmount.toFixed(2)} MXN</td>
              </tr>
              <tr class="total-row">
                <td colspan="4" style="padding: 8px; text-align: right;">Envío:</td>
                <td style="padding: 8px; text-align: right;">$${shippingCost.toFixed(2)} MXN</td>
              </tr>
              <tr class="total-row" style="background-color: #4CAF50; color: white;">
                <td colspan="4" style="padding: 8px; text-align: right;">Total Pagado:</td>
                <td style="padding: 8px; text-align: right;">$${totalWithShipping.toFixed(2)} MXN</td>
              </tr>
            </tbody>
          </table>

          <div class="order-details">
            <h3>Dirección de Envío:</h3>
            <p>${street}</p>
            <p>${city}, ${province} ${zipCode}</p>
            <p>${country}</p>
            ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ""}
            <p><strong>Método de envío:</strong> ${carrier} - ${service}</p>
            <p><strong>Tiempo estimado:</strong> ${estimatedDays} días hábiles</p>
            ${trackingNumber !== "Pendiente" ? `<p><strong>Número de rastreo:</strong> ${trackingNumber}</p>` : ""}
            ${labelUrl ? `<p><strong>Rastrea tu pedido:</strong> <a href="https://supercollectibles.com.mx/rastreo/${trackingNumber}" target="_blank">Ver rastreo</a></p>` : ""}
          </div>

          <p style="margin-top: 20px;">
            Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.
          </p>

          <p style="color: #666;">
            <strong>SuperCollectibles.com.mx</strong><br>
            ¡Gracias por tu preferencia!
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    // Send email to sales team
    await transporter.sendMail({
      from: process.env.GOOGLE_MAIL,
      to: "supercollectiblesc12@gmail.com",
      subject: `Nuevo Pedido Pagado - ${order._id}`,
      html: salesEmailHTML,
    });

    // Send email to customer
    await transporter.sendMail({
      from: process.env.GOOGLE_MAIL,
      to: order.email,
      subject: `Confirmación de Pedido - SuperCollectibles`,
      html: customerEmailHTML,
    });

    console.log("Confirmation emails sent successfully");
  } catch (error) {
    console.error("Error sending confirmation emails:", error);
  }
}

export async function POST(req: any, res: any) {
  try {
    await dbConnect();

    // Access the value of stripe-signature from the headers
    const signature = await req.headers.get("stripe-signature");
    const rawBody = await req.text();
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );

    const session: any = event.data.object;

    // Payment confirmed
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      // get all the details from stripe checkout to create new order
      const payIntentId = session?.payment_intent;

      const paymentIntent: any =
        await stripe?.paymentIntents.retrieve(payIntentId);

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
          variation._id.equals(variationId),
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
        paymentIntent.payment_method,
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
            paymentTransactionData,
          );

          await newPaymentTransaction.save();
        } catch (error) {
          console.log("Payment transaction error:", error);
        }
      }

      let payAmount = currentOrder.paymentInfo.amountPaid + newPaymentAmount;
      // Use reduce to sum up the 'total' field for order items
      const totalOrderAmount = currentOrder.orderItems.reduce(
        (acc: any, orderItem: any) =>
          acc + orderItem.quantity * orderItem.price,
        0,
      );

      // Add shipping cost to total amount
      const totalWithShipping =
        totalOrderAmount + (currentOrder.ship_cost || 0);

      if (payAmount >= totalWithShipping) {
        currentOrder.orderStatus = "Procesando";
        currentOrder.paymentInfo.status = "Paid";

        // Create shipment with Envía.com
        const shipment = await createShipmentWithEnvia(currentOrder);

        if (shipment) {
          currentOrder.trackingNumber = shipment.tracking_number;
          currentOrder.labelUrl = shipment.label_url;
          currentOrder.shippingCarrier = shipment.carrier_name;
          currentOrder.shippingService = shipment.service_name;
          currentOrder.estimatedDelivery = shipment.estimated_delivery;
          console.log(`✅ Tracking number: ${shipment.tracking_number}`);
          console.log(`📄 Label URL: ${shipment.label_url}`);
        }

        // Send confirmation emails
        await sendOrderConfirmationEmails(currentOrder, {
          method: paymentIntent.payment_method_types[0],
          reference: payReference,
        });

        if (session?.metadata?.referralID) {
          const referralLink = await ReferralLink.findOne({
            _id: session?.metadata?.referralID,
          });

          const affiliate = await Affiliate.findOne(referralLink.affiliateId);
          const affiliateId = await affiliate?._id.toString();
          const timestamp = cstDateTime(); // Current timestamp
          //transfer amount to affiliate
          const transfer = await stripe.transfers.create({
            amount: totalWithShipping * 0.1 * 100,
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

      if (payAmount < totalWithShipping) {
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
      currentOrder.paymentInfo.paymentIntent = paymentIntent.id;

      await currentOrder.save();

      return NextResponse.json(
        {
          success: true,
        },
        { status: 201 },
      );
    }

    // Return response for unhandled event types
    return NextResponse.json(
      {
        success: true,
        message: "Event type not handled",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Webhook error:", error);
    return NextResponse.json(
      {
        error: "Error al Pagar el pedido con stripe Pedido",
      },
      { status: 500 },
    );
  }
}
