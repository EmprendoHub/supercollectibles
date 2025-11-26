"use client";
import { useState } from "react";
import { FaFileExcel } from "react-icons/fa";
import { exportProductsToTikTok } from "@/app/_actions";
import Swal from "sweetalert2";

interface ExportToTikTokButtonProps {
  selectedProductIds: string[];
  onExportComplete?: () => void;
}

export default function ExportToTikTokButton({
  selectedProductIds,
  onExportComplete,
}: ExportToTikTokButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (selectedProductIds.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Por favor selecciona al menos un producto",
        icon: "error",
        confirmButtonColor: "#d33",
      });
      return;
    }

    setIsExporting(true);

    try {
      // Show loading alert
      Swal.fire({
        title: "Procesando...",
        html: `
          <div class="flex flex-col items-center gap-4">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p>Optimizando productos con IA...</p>
            <p class="text-sm text-muted-foreground">Esto puede tardar unos minutos</p>
          </div>
        `,
        allowOutsideClick: false,
        showConfirmButton: false,
      });

      // Call the server action
      const result = await exportProductsToTikTok(selectedProductIds);

      if (result.success && result.fileData) {
        // Close loading alert
        Swal.close();

        // Convert base64 to blob
        const byteCharacters = atob(result.fileData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = result.fileName || "tiktok-products.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        // Show success message
        Swal.fire({
          title: "¡Éxito!",
          html: `
            <p>Se exportaron ${result.productsProcessed} producto(s)</p>
            <p class="text-sm text-muted-foreground mt-2">
              Los títulos y descripciones fueron optimizados con IA para SEO
            </p>
          `,
          icon: "success",
          confirmButtonColor: "#228B22",
        });

        // Call completion callback
        if (onExportComplete) {
          onExportComplete();
        }
      } else {
        // Show error message
        Swal.fire({
          title: "Error",
          text: result.error || "Error al exportar productos",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error: any) {
      console.error("Export error:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Error inesperado al exportar",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || selectedProductIds.length === 0}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all
        ${
          isExporting || selectedProductIds.length === 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
        }
      `}
      aria-label="Exportar a TikTok Shop"
    >
      <FaFileExcel className={isExporting ? "animate-pulse" : ""} />
      {isExporting ? (
        <span>Exportando...</span>
      ) : (
        <span>Exportar a TikTok Shop ({selectedProductIds.length})</span>
      )}
    </button>
  );
}
