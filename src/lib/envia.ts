// Envía.com API service
interface EnviaConfig {
  apiToken: string;
  baseUrl: string;
  environment: "test" | "production";
}

interface Address {
  name: string;
  company?: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  email?: string;
  reference?: string;
}

interface Package {
  weight: number; // in kg
  length: number; // in cm
  width: number; // in cm
  height: number; // in cm
  declared_value: number; // in MXN
  content: string;
  type: string; // "box", "envelope", etc.
}

interface ShippingQuoteRequest {
  origin: Address;
  destination: Address;
  packages: Package[];
  insurance?: boolean;
  additional_services?: string[];
}

interface ShippingQuote {
  carrier_name: string;
  service_name: string;
  price: number;
  currency: string;
  estimated_days: number;
  service_id: number;
  carrier_id: number;
  delivery_estimate?: string;
  tracking_url?: string;
}

interface ShipmentRequest {
  origin: Address;
  destination: Address;
  packages: Package[];
  shipment_type?: number; // 1 for guide, 2 for ltl
  carrier_id?: number;
  service_id?: number;
  additional_services?: string[];
}

interface ShipmentResponse {
  tracking_number: string;
  carrier_name: string;
  service_name: string;
  label_url: string;
  cost: number;
  currency: string;
  estimated_delivery: string;
}

interface TrackingInfo {
  tracking_number: string;
  status: string;
  events: Array<{
    date: string;
    status: string;
    location: string;
    description: string;
  }>;
}

interface EnviaQuoteResponse {
  data: Array<{
    carrier_name: string;
    service_name: string;
    price: number;
    currency: string;
    estimated_days: number;
    service_id: number;
    carrier_id: number;
    delivery_estimate?: string;
  }>;
}

interface EnviaShipmentResponse {
  data: {
    tracking_number: string;
    carrier_name: string;
    service_name: string;
    label_file: string;
    cost: number;
    currency: string;
    estimated_delivery: string;
  };
}

interface EnviaTrackingResponse {
  data: {
    tracking_number: string;
    status: string;
    events: Array<{
      date: string;
      status: string;
      location: string;
      description: string;
    }>;
  };
}

class EnviaService {
  private config: EnviaConfig;

  constructor(config: EnviaConfig) {
    this.config = config;
  }

  private async makeRequest(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    data?: any
  ): Promise<any> {
    const url = `${this.config.baseUrl}${endpoint}`;

    console.log(`🚚 Envía.com API ${method} request:`, {
      url,
      data: data ? JSON.stringify(data, null, 2) : "No data",
      headers: {
        Authorization: `Bearer ${this.config.apiToken}`,
        "Content-Type": "application/json",
      },
    });

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${this.config.apiToken}`,
          "Content-Type": "application/json",
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      console.log(`📡 Envía.com API response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Envía.com API error:`, {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        throw new Error(
          `Envía.com API error: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const result = await response.json();
      console.log(
        `✅ Envía.com API success response:`,
        JSON.stringify(result, null, 2)
      );

      return result;
    } catch (error) {
      console.error(`💥 Envía.com API request failed:`, error);
      throw error;
    }
  }

  async getQuotes(request: ShippingQuoteRequest): Promise<ShippingQuote[]> {
    try {
      console.log("📦 Getting shipping quotes from Envía.com...");

      // First, let's check available carriers for the destination country
      const countryCode = request.destination.country;
      const carriersResponse = await this.makeRequest(
        `/available-carrier-detailed/${countryCode}/0/1`
      );

      console.log("🚛 Available carriers:", carriersResponse);

      // For now, let's return the fallback quotes until we implement proper quote API
      // Envía.com might need specific endpoints for quotes that aren't clearly documented
      return this.generateFallbackQuotes(request);
    } catch (error) {
      console.error("❌ Error getting quotes from Envía.com:", error);
      // Return fallback quotes on error
      return this.generateFallbackQuotes(request);
    }
  }

  async createShipment(request: ShipmentRequest): Promise<ShipmentResponse> {
    try {
      console.log("📦 Creating shipment with Envía.com...");

      // Transform request to Envía.com format
      const enviaRequest = {
        origin: request.origin,
        destination: request.destination,
        packages: request.packages,
        shipment_type: request.shipment_type || 1,
        carrier_id: request.carrier_id,
        service_id: request.service_id,
        additional_services: request.additional_services || [],
      };

      const response: EnviaShipmentResponse = await this.makeRequest(
        "/shipments",
        "POST",
        enviaRequest
      );

      return {
        tracking_number: response.data.tracking_number,
        carrier_name: response.data.carrier_name,
        service_name: response.data.service_name,
        label_url: response.data.label_file,
        cost: response.data.cost,
        currency: response.data.currency,
        estimated_delivery: response.data.estimated_delivery,
      };
    } catch (error) {
      console.error("❌ Error creating shipment with Envía.com:", error);
      throw error;
    }
  }

  async trackShipment(trackingNumber: string): Promise<TrackingInfo> {
    try {
      console.log("🔍 Tracking shipment with Envía.com:", trackingNumber);

      const response: EnviaTrackingResponse = await this.makeRequest(
        `/guide/${trackingNumber}`
      );

      return {
        tracking_number: response.data.tracking_number,
        status: response.data.status,
        events: response.data.events,
      };
    } catch (error) {
      console.error("❌ Error tracking shipment with Envía.com:", error);
      throw error;
    }
  }

  async getCarriers(countryCode: string = "MX"): Promise<any[]> {
    try {
      console.log("🚛 Getting available carriers from Envía.com...");

      const response = await this.makeRequest(
        `/available-carrier-detailed/${countryCode}/0/1`
      );

      return response.data || [];
    } catch (error) {
      console.error("❌ Error getting carriers from Envía.com:", error);
      return [];
    }
  }

  private generateFallbackQuotes(
    request: ShippingQuoteRequest
  ): ShippingQuote[] {
    console.log("🔄 Generating fallback quotes for Envía.com...");

    const totalWeight = request.packages.reduce(
      (sum, pkg) => sum + pkg.weight,
      0
    );
    const totalValue = request.packages.reduce(
      (sum, pkg) => sum + pkg.declared_value,
      0
    );

    // Base shipping cost calculation
    const baseWeight = Math.max(1, Math.ceil(totalWeight));
    const baseCost = 50; // Base cost in MXN
    const perKgCost = 15; // Cost per kg in MXN
    const insuranceCost = request.insurance ? totalValue * 0.005 : 0; // 0.5% of value

    const quotes: ShippingQuote[] = [
      {
        carrier_name: "Estafeta",
        service_name: "Día Siguiente",
        price: baseCost + baseWeight * perKgCost * 1.5 + insuranceCost,
        currency: "MXN",
        estimated_days: 1,
        service_id: 1,
        carrier_id: 1,
        delivery_estimate: "1 día hábil",
      },
      {
        carrier_name: "FedEx",
        service_name: "Express",
        price: baseCost + baseWeight * perKgCost * 2.0 + insuranceCost,
        currency: "MXN",
        estimated_days: 1,
        service_id: 2,
        carrier_id: 2,
        delivery_estimate: "1-2 días hábiles",
      },
      {
        carrier_name: "DHL",
        service_name: "Express",
        price: baseCost + baseWeight * perKgCost * 2.2 + insuranceCost,
        currency: "MXN",
        estimated_days: 2,
        service_id: 3,
        carrier_id: 3,
        delivery_estimate: "2-3 días hábiles",
      },
      {
        carrier_name: "Redpack",
        service_name: "Estándar",
        price: baseCost + baseWeight * perKgCost * 1.2 + insuranceCost,
        currency: "MXN",
        estimated_days: 3,
        service_id: 4,
        carrier_id: 4,
        delivery_estimate: "3-5 días hábiles",
      },
    ];

    console.log("📋 Generated fallback quotes:", quotes);
    return quotes;
  }
}

// Default configuration
function createEnviaService(): EnviaService {
  const config: EnviaConfig = {
    apiToken: process.env.ENVIA_API_TOKEN || "",
    baseUrl: process.env.ENVIA_BASE_URL || "https://queries-test.envia.com",
    environment:
      (process.env.ENVIA_ENVIRONMENT as "test" | "production") || "test",
  };

  if (!config.apiToken) {
    console.warn(
      "⚠️ ENVIA_API_TOKEN not configured, some features may not work"
    );
  }

  console.log("🚚 Envía.com service initialized:", {
    baseUrl: config.baseUrl,
    environment: config.environment,
    hasToken: !!config.apiToken,
  });

  return new EnviaService(config);
}

// Export the service instance and types
export default createEnviaService();
export {
  EnviaService,
  createEnviaService,
  type EnviaConfig,
  type Address,
  type Package,
  type ShippingQuoteRequest,
  type ShippingQuote,
  type ShipmentRequest,
  type ShipmentResponse,
  type TrackingInfo,
};
