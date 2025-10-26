"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Clock, Shield, AlertCircle } from "lucide-react";

interface ShippingQuote {
  id: string;
  carrier: string;
  service: string;
  serviceName: string;
  price: number;
  currency: string;
  estimatedDays: number;
  guaranteed: boolean;
  description: string;
  displayPrice: string;
  serviceId?: number; // Para Envía.com
  carrierId?: number; // Para Envía.com
}

interface ShippingOptionsProps {
  onShippingSelect: (quote: ShippingQuote) => void;
  selectedShipping?: ShippingQuote | null;
}

const ShippingOptions: React.FC<ShippingOptionsProps> = ({
  onShippingSelect,
  selectedShipping,
}) => {
  const [quotes, setQuotes] = useState<ShippingQuote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fallback, setFallback] = useState(false);

  // Obtener datos del carrito y dirección del Redux store
  const cartState = useSelector((state: any) => state.compras);

  const cartItems = useMemo(() => {
    return cartState?.productsData || [];
  }, [cartState?.productsData]);

  const shippingInfo = useMemo(() => {
    return cartState?.shippingInfo;
  }, [cartState?.shippingInfo]);

  // Verificar si el estado está disponible (redux-persist hidratación)
  const isStateReady = cartState !== undefined;
  const fetchShippingQuotes = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/shipping/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination: shippingInfo,
          items: cartItems,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setQuotes(data.quotes);
        setFallback(data.fallback || false);

        // Seleccionar automáticamente la primera opción si no hay ninguna seleccionada
        if (!selectedShipping && data.quotes.length > 0) {
          onShippingSelect(data.quotes[0]);
        }
      } else {
        setError(data.message || "Error al obtener cotizaciones de envío");
      }
    } catch (err: any) {
      console.error("Error fetching shipping quotes:", err);
      setError("Error de conexión al obtener cotizaciones");
    } finally {
      setLoading(false);
    }
  }, [shippingInfo, cartItems, selectedShipping, onShippingSelect]);

  useEffect(() => {
    if (shippingInfo && cartItems.length > 0) {
      fetchShippingQuotes();
    }
  }, [shippingInfo, cartItems, fetchShippingQuotes]);

  const handleShippingSelect = (quote: ShippingQuote) => {
    onShippingSelect(quote);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Opciones de Envío
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Calculando costos de envío...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Opciones de Envío
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
          <Button onClick={fetchShippingQuotes} variant="outline">
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="w-5 h-5" />
          Opciones de Envío
          {fallback && (
            <Badge variant="outline" className="text-yellow-600">
              Cotización Estimada
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-blue-400 text-gray-700 ${
                selectedShipping?.id === quote.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  : "border-gray-200"
              }`}
              onClick={() => handleShippingSelect(quote)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={selectedShipping?.id === quote.id}
                    onChange={() => handleShippingSelect(quote)}
                    className="h-4 w-4"
                  />
                  <div>
                    <div className="font-semibold text-sm">
                      {quote.serviceName}
                    </div>
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Entrega en {quote.estimatedDays} días
                      {quote.guaranteed && (
                        <>
                          <Shield className="w-3 h-3 text-green-600 ml-1" />
                          <span className="text-green-600">Garantizado</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{quote.displayPrice}</div>
                  <div className="text-xs text-gray-500">{quote.carrier}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {fallback && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">
                Cotizaciones estimadas. Los costos finales pueden variar.
              </span>
            </div>
          </div>
        )}

        {!shippingInfo && (
          <div className="text-center py-4 text-gray-500">
            <Truck className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>
              Selecciona una dirección de envío para ver las opciones
              disponibles
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShippingOptions;
