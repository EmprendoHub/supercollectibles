"use client";

import React, { useState, useRef } from "react";
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
} from "lucide-react";
import Swal from "sweetalert2";

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
  const [scanInterval, setScanInterval] = useState<NodeJS.Timeout | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    confirmados: 0,
    asistieron: 0,
    pendientes: 0,
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Esperar a que el video esté listo y reproducirlo
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current
              .play()
              .then(() => {
                setIsScanning(true);
                // Iniciar el escaneo automático cada segundo
                const interval = setInterval(scanForQR, 1000);
                setScanInterval(interval);
              })
              .catch((error) => {
                console.error("Error playing video:", error);
                Swal.fire(
                  "Error",
                  "No se pudo reproducir el video de la cámara",
                  "error"
                );
              });
          }
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      Swal.fire("Error", "No se pudo acceder a la cámara", "error");
    }
  };

  const scanForQR = () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Aquí podrías integrar una librería de detección de QR como jsqr
    // Por ahora, la funcionalidad principal es manual
  };

  const stopCamera = () => {
    if (scanInterval) {
      clearInterval(scanInterval);
      setScanInterval(null);
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsScanning(false);
    }
  };

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
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🎫 Escáner QR - Evento Cacha
        </h1>
        <p className="text-gray-600">
          Escanea los códigos QR o ingresa manualmente para verificar el acceso
          al evento
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
                className="relative bg-black rounded-lg overflow-hidden"
                style={{ aspectRatio: "4/3" }}
              >
                {isScanning ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: "scaleX(-1)" }} // Efecto espejo para mejor UX
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    <div className="text-center">
                      <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Presiona iniciar para usar la cámara</p>
                    </div>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />

                {/* Overlay para ayudar con el enfoque del QR */}
                {isScanning && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white border-dashed rounded-lg opacity-50"></div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {!isScanning ? (
                  <Button onClick={startCamera} className="flex-1">
                    <Camera className="w-4 h-4 mr-2" />
                    Iniciar Cámara
                  </Button>
                ) : (
                  <Button
                    onClick={stopCamera}
                    variant="outline"
                    className="flex-1"
                  >
                    <CameraOff className="w-4 h-4 mr-2" />
                    Detener Cámara
                  </Button>
                )}
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
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
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
                  <UserCheck className="w-4 h-4 mr-2" />✅ Marcar como Asistente
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
  );
};

export default QRScannerPage;
