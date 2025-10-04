"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  CameraOff,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  RotateCcw,
} from "lucide-react";
import Swal from "sweetalert2";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";

interface RegistrationData {
  _id: string;
  nombre: string;
  email: string;
  telefono: string;
  edad: number;
  estado: "pendiente" | "confirmado" | "asistio" | "cancelado";
  codigoConfirmacion: string;
  fechaRegistro: string;
  fechaConfirmacion?: string;
  mensaje?: string;
}

const QRScannerPage = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [scannedData, setScannedData] = useState<RegistrationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    confirmados: 0,
    asistieron: 0,
    pendientes: 0,
  });
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerElementRef = useRef<HTMLDivElement>(null);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, []);

  // Initialize scanner with html5-qrcode
  const startScanner = useCallback(() => {
    if (!scannerElementRef.current) return;

    try {
      console.log("� Iniciando escáner QR con html5-qrcode...");
      setError(null);
      setIsScanning(true);

      // Configure supported formats for QR and barcode scanning
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.CODE_93,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
        ],
      };

      // Success callback - when QR code is detected
      const onScanSuccess = (decodedText: string) => {
        console.log("✅ Código escaneado:", decodedText);

        // Search for the registration with this code
        searchByCode(decodedText);

        // Stop scanner after successful scan
        stopScanner();
      };

      // Error callback
      const onScanError = (errorMessage: string) => {
        // Don't log every frame error, only actual errors
        if (
          !errorMessage.includes(
            "No MultiFormat Readers were able to detect the code"
          ) &&
          !errorMessage.includes("NotFoundException")
        ) {
          console.warn("Scan error:", errorMessage);
        }
      };

      scannerRef.current = new Html5QrcodeScanner(
        "qr-scanner-container",
        config,
        false
      );

      scannerRef.current.render(onScanSuccess, onScanError);
      setHasPermission(true);
      console.log("✅ Escáner QR iniciado correctamente");
    } catch (err) {
      console.error("❌ Error starting scanner:", err);
      setError(
        "No se pudo iniciar el escáner. Verifique los permisos de cámara."
      );
      setHasPermission(false);
      setIsScanning(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stop scanner
  const stopScanner = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
      console.log("🛑 Escáner detenido");
    }
    setIsScanning(false);
  }, []);

  const searchByCode = async (code: string) => {
    if (!code.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/cacha?search=${encodeURIComponent(code)}`
      );
      const data = await response.json();

      if (data.success && data.data.length > 0) {
        const registration = data.data.find(
          (reg: RegistrationData) => reg.codigoConfirmacion === code
        );

        if (registration) {
          setScannedData(registration);
        } else {
          Swal.fire(
            "No encontrado",
            "No se encontró ningún registro con este código",
            "warning"
          );
          setScannedData(null);
        }
      } else {
        Swal.fire(
          "No encontrado",
          "No se encontró ningún registro con este código",
          "warning"
        );
        setScannedData(null);
      }
    } catch (error) {
      console.error("Error searching registration:", error);
      Swal.fire("Error", "Error al buscar el registro", "error");
    } finally {
      setLoading(false);
    }
  };

  const markAsAttended = async (id: string) => {
    try {
      const response = await fetch(`/api/cacha/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: "asistio" }),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: "¡Acceso Confirmado!",
          text: "El participante ha sido marcado como asistente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        // Actualizar el estado local
        if (scannedData) {
          setScannedData({ ...scannedData, estado: "asistio" });
        }

        // Limpiar después de un momento
        setTimeout(() => {
          setScannedData(null);
          setManualCode("");
        }, 2000);
      } else {
        Swal.fire(
          "Error",
          data.message || "Error al marcar asistencia",
          "error"
        );
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      Swal.fire("Error", "Error al procesar la solicitud", "error");
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "confirmado":
        return "bg-blue-500";
      case "asistio":
        return "bg-green-500";
      case "pendiente":
        return "bg-yellow-500";
      case "cancelado":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case "confirmado":
        return <CheckCircle className="w-4 h-4" />;
      case "asistio":
        return <UserCheck className="w-4 h-4" />;
      case "pendiente":
        return <Clock className="w-4 h-4" />;
      case "cancelado":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <>
      <style jsx global>{`
        .qr-scanner-container video {
          object-fit: cover !important;
          border-radius: 8px;
        }

        .qr-scanner-container #qr-shaded-region {
          border-radius: 8px;
        }

        .qr-scanner-container #qr-scanning-region {
          border-radius: 8px;
        }

        #html5-qrcode-button-camera-permission,
        #html5-qrcode-button-camera-start {
          background-color: #3b82f6 !important;
          color: white !important;
          border: none !important;
          padding: 8px 16px !important;
          border-radius: 6px !important;
          font-size: 14px !important;
        }

        #html5-qrcode-button-camera-stop {
          background-color: #ef4444 !important;
          color: white !important;
          border: none !important;
          padding: 8px 16px !important;
          border-radius: 6px !important;
          font-size: 14px !important;
        }
      `}</style>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-200 mb-2">
            🎫 Escáner QR - Evento Cacha
          </h1>
          <p className="text-gray-400">
            Escanea los códigos QR o ingresa manualmente para verificar el
            acceso al evento
          </p>
        </div>

        {/* Scanner Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Camera Scanner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Escáner de Cámara
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div
                  className="relative rounded-lg overflow-hidden border-2 border-gray-300"
                  style={{ aspectRatio: "4/3", minHeight: "300px" }}
                >
                  {isScanning ? (
                    <div
                      id="qr-scanner-container"
                      ref={scannerElementRef}
                      className="w-full h-full qr-scanner-container"
                      style={
                        {
                          "--qr-border-color": "#ffffff",
                          "--qr-scanner-border-color": "#ffffff",
                          "--qr-text-color": "#ffffff",
                        } as React.CSSProperties
                      }
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white bg-black">
                      <div className="text-center">
                        <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Presiona iniciar para usar la cámara</p>
                      </div>
                    </div>
                  )}

                  {/* Permission / Error States */}
                  {(hasPermission === false || error) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                      <Card className="w-full max-w-md mx-4">
                        <CardContent className="p-6 text-center">
                          <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <h3 className="text-lg font-semibold mb-2">
                            {error
                              ? "Error de Cámara"
                              : "Acceso a la Cámara Requerido"}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {error ||
                              "Por favor permita el acceso a la cámara para escanear códigos QR"}
                          </p>
                          <Button onClick={startScanner} className="w-full">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reintentar
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Overlay para ayudar con el enfoque del QR */}
                  {isScanning && !error && hasPermission && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white border-dashed rounded-lg opacity-50"></div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {!isScanning ? (
                    <Button onClick={startScanner} className="flex-1">
                      <Camera className="w-4 h-4 mr-2" />
                      Iniciar Escáner QR
                    </Button>
                  ) : (
                    <Button
                      onClick={stopScanner}
                      variant="outline"
                      className="flex-1"
                    >
                      <CameraOff className="w-4 h-4 mr-2" />
                      Detener Escáner
                    </Button>
                  )}
                </div>

                {/* Debug info mejorada */}
                <div className="bg-gray-100 p-3 rounded text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Estado:</span>
                    <span
                      className={isScanning ? "text-green-600" : "text-red-600"}
                    >
                      {isScanning ? "🟢 Escaneando" : "⚫ Detenido"}
                    </span>
                  </div>
                  {scannerRef.current && (
                    <div className="text-blue-600">📹 Escáner QR conectado</div>
                  )}
                  {hasPermission === true && (
                    <div className="text-green-600">
                      ✅ Permisos de cámara otorgados
                    </div>
                  )}
                  {hasPermission === false && (
                    <div className="text-red-600">
                      ❌ Permisos de cámara denegados
                    </div>
                  )}
                  {error && (
                    <div className="text-red-600">� Error: {error}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    Escáner QR avanzado con html5-qrcode
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manual Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Búsqueda Manual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Código de Confirmación
                  </label>
                  <Input
                    value={manualCode}
                    onChange={(e) =>
                      setManualCode(e.target.value.toUpperCase())
                    }
                    placeholder="Ej: CACHA-ABC123"
                    className="font-mono"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        searchByCode(manualCode);
                      }
                    }}
                  />
                </div>

                <Button
                  onClick={() => searchByCode(manualCode)}
                  disabled={loading || !manualCode.trim()}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Buscar Registro
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        {scannedData && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>📋 Información del Participante</span>
                <Badge
                  className={`${getStatusColor(scannedData.estado)} text-white`}
                >
                  {getStatusIcon(scannedData.estado)}
                  <span className="ml-1 capitalize">{scannedData.estado}</span>
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Nombre</p>
                  <p className="font-semibold">{scannedData.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{scannedData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="font-semibold">{scannedData.telefono}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Edad</p>
                  <p className="font-semibold">{scannedData.edad} años</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Código</p>
                  <p className="font-mono font-semibold">
                    {scannedData.codigoConfirmacion}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha de Registro</p>
                  <p className="font-semibold">
                    {new Date(scannedData.fechaRegistro).toLocaleDateString(
                      "es-MX"
                    )}
                  </p>
                </div>
              </div>

              {scannedData.mensaje && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Mensaje para Cacha</p>
                  <p className="italic bg-gray-50 p-2 rounded">
                    &ldquo;{scannedData.mensaje}&rdquo;
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                {scannedData.estado === "confirmado" && (
                  <Button
                    onClick={() => markAsAttended(scannedData._id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <UserCheck className="w-4 h-4 mr-2" />✅ Marcar como
                    Asistente
                  </Button>
                )}

                {scannedData.estado === "asistio" && (
                  <div className="flex items-center text-green-600 font-semibold">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Ya registró su asistencia
                  </div>
                )}

                {scannedData.estado === "pendiente" && (
                  <div className="flex items-center text-yellow-600 font-semibold">
                    <Clock className="w-5 h-5 mr-2" />
                    Registro pendiente de confirmación
                  </div>
                )}

                {scannedData.estado === "cancelado" && (
                  <div className="flex items-center text-red-600 font-semibold">
                    <XCircle className="w-5 h-5 mr-2" />
                    Registro cancelado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>📖 Instrucciones de Uso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-600">1.</span>
                <span>
                  Usa la cámara para escanear el código QR del participante o
                  ingresa manualmente el código
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-600">2.</span>
                <span>
                  Verifica que el estado sea &ldquo;Confirmado&rdquo; antes de
                  permitir el acceso
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-600">3.</span>
                <span>
                  Presiona &ldquo;Marcar como Asistente&rdquo; para registrar la
                  asistencia al evento
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-600">4.</span>
                <span>
                  Los registros &ldquo;Pendientes&rdquo; o
                  &ldquo;Cancelados&rdquo; no deben tener acceso al evento
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default QRScannerPage;
