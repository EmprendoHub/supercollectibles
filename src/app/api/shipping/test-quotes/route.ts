import { NextRequest, NextResponse } from "next/server";
import enviaService from "@/lib/envia";

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { destination, items, origin } = body;

    if (!destination || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Datos de envío incompletos" },
        { status: 400 }
      );
    }

    // Configurar dirección de origen (tu almacén/tienda)
    const defaultOrigin = origin || {
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

    // Convertir items del carrito a paquetes para Envía.com
    const packages = items.map((item: any) => ({
      weight: (item.weight || 500) / 1000, // peso en kg (convertir de gramos)
      length: item.length || 20, // largo en cm
      width: item.width || 15, // ancho en cm
      height: item.height || 10, // alto en cm
      declared_value: item.price * item.quantity, // valor en MXN
      content: item.title || item.name || "Producto coleccionable",
      type: "box", // tipo de paquete
    }));

    // Preparar request para Envía.com
    const quoteRequest = {
      origin: defaultOrigin,
      destination: {
        name:
          destination.name ||
          `${destination.first_name} ${destination.last_name}`,
        street: destination.street || destination.address1,
        number: destination.number || "S/N",
        district: destination.district || destination.address2 || "",
        city: destination.city,
        state: destination.province || destination.state,
        postal_code: destination.zip_code || destination.zip,
        country: destination.country || "MX",
        phone: destination.phone || "",
        email: "test@example.com",
      },
      packages,
      insurance: true, // Incluir seguro
    };

    console.log(
      "🚚 Solicitando cotizaciones de envío con Envía.com (TEST):",
      quoteRequest
    );

    const quotes = await enviaService.getQuotes(quoteRequest);

    // Procesar y formatear las cotizaciones
    const formattedQuotes = quotes.map((quote: any) => ({
      id: `${quote.carrier_name}-${quote.service_name}`,
      carrier: quote.carrier_name,
      service: quote.service_name,
      serviceName: quote.service_name,
      price: quote.price,
      currency: quote.currency,
      estimatedDays: quote.estimated_days,
      guaranteed: quote.estimated_days <= 2,
      description: `${quote.service_name} - Entrega en ${quote.estimated_days} días`,
      displayPrice: `$${quote.price.toFixed(2)} ${quote.currency}`,
      serviceId: quote.service_id,
      carrierId: quote.carrier_id,
    }));

    return NextResponse.json({
      success: true,
      quotes: formattedQuotes,
      count: formattedQuotes.length,
      environment: "TEST",
    });
  } catch (error: any) {
    console.error("❌ Error obteniendo cotizaciones de envío (TEST):", error);

    // Fallback con opciones de envío estáticas si la API falla
    const fallbackQuotes = [
      {
        id: "standard",
        carrier: "Standard",
        service: "standard",
        serviceName: "Envío Estándar",
        price: 150,
        currency: "MXN",
        estimatedDays: 5,
        guaranteed: false,
        description: "Envío Estándar - Entrega en 3-5 días hábiles",
        displayPrice: "$150.00 MXN",
      },
      {
        id: "express",
        carrier: "Express",
        service: "express",
        serviceName: "Envío Express",
        price: 300,
        currency: "MXN",
        estimatedDays: 2,
        guaranteed: true,
        description: "Envío Express - Entrega en 1-2 días hábiles",
        displayPrice: "$300.00 MXN",
      },
    ];

    return NextResponse.json({
      success: true,
      quotes: fallbackQuotes,
      count: fallbackQuotes.length,
      fallback: true,
      error: error.message,
      environment: "TEST",
    });
  }
}
