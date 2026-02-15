import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import {
  calculateShippingQuotes,
  getShippingCalculationDetails,
  type CartItem,
} from "@/lib/shippingRates";

/**
 * API Route para obtener cotizaciones de envío
 *
 * Este endpoint calcula el costo de envío usando tarifas predeterminadas
 * basadas en el peso y dimensiones de los productos en el carrito.
 *
 * Las tarifas se calculan localmente sin conexión a Envia.com para
 * mayor rapidez y control de precios.
 *
 * Nota: La creación de guías de envío y tracking todavía usan Envia.com
 * (ver /api/shipping/create y /api/shipping/tracking)
 */

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(options);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "No autorizado" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { destination, items, origin } = body;
    console.log("items", items);

    if (!destination || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Datos de envío incompletos" },
        { status: 400 },
      );
    }

    console.log(
      "🚚 Calculando cotizaciones de envío con tarifas predeterminadas",
    );

    // Convertir items del carrito al formato esperado
    const cartItems: CartItem[] = items.map((item: any) => ({
      weight: item.weight || 0.5, // peso en kg
      dimensions: item.dimensions || {
        length: item.length || 15,
        width: item.width || 15,
        height: item.height || 10,
      },
      quantity: item.quantity || 1,
      price: item.price || 0,
      title: item.title || item.name || "Producto",
    }));

    // Calcular cotizaciones usando el nuevo sistema de tarifas
    const quotes = calculateShippingQuotes(cartItems);

    // Obtener detalles del cálculo para logging
    const calculationDetails = getShippingCalculationDetails(cartItems);
    console.log("📦 Detalles del cálculo de envío:", calculationDetails);

    return NextResponse.json({
      success: true,
      quotes,
      count: quotes.length,
      details: calculationDetails, // Información adicional para debugging
    });
  } catch (error: any) {
    console.error("❌ Error calculando cotizaciones de envío:", error);

    // Fallback con opciones de envío estáticas si hay algún error
    const fallbackQuotes = [
      {
        id: "standard",
        carrier: "Envío ",
        service: "standard",
        serviceName: "Envío ",
        price: 199,
        currency: "MXN",
        estimatedDays: 2,
        guaranteed: false,
        description: "Envío  - Entrega en 2-3 días hábiles",
        displayPrice: "$199.00 MXN",
        weightCategory: "1 kg - 25 × 20 × 10 cm",
      },
    ];

    return NextResponse.json({
      success: true,
      quotes: fallbackQuotes,
      count: fallbackQuotes.length,
      fallback: true,
      error: error.message,
    });
  }
}
