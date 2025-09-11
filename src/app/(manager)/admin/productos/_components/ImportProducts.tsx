"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

type ProductRow = {
  asin: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  linea: string;
  gender: string;
  brand: string;
  images: { url: string }[];
};

// Image preview component with full-screen modal
const ImagePreview = ({
  images,
  productTitle,
}: {
  images: { url: string }[];
  productTitle: string;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  if (!images || images.length === 0) {
    return (
      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
        No Images
      </div>
    );
  }

  const currentImage = images[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Convert cleaned_images path to a URL that can be displayed
  const getImageUrl = (imagePath: string) => {
    // Convert cleaned_images/Category/filename.png to /api/images/Category/filename.png
    if (imagePath.startsWith("cleaned_images/")) {
      const pathWithoutPrefix = imagePath.replace("cleaned_images/", "");
      return `/api/images/${pathWithoutPrefix}`;
    }

    // Fallback to placeholder
    return "/images/product-placeholder-minimalist.jpg";
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => {
      const newSet = new Set(Array.from(prev));
      newSet.add(index);
      return newSet;
    });
  };

  const getImageSrc = (imagePath: string, index: number) => {
    return imageErrors.has(index)
      ? "/images/product-placeholder-minimalist.jpg"
      : getImageUrl(imagePath);
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Thumbnail grid */}
      <div className="flex gap-1 flex-wrap max-w-32">
        {images.slice(0, 4).map((img, index) => (
          <div
            key={index}
            className={`w-8 h-8 border-2 rounded cursor-pointer overflow-hidden ${
              index === currentImageIndex
                ? "border-blue-500"
                : "border-gray-300"
            }`}
            onClick={() => setCurrentImageIndex(index)}
            title={img.url.split("/").pop()} // Show filename on hover
          >
            <Image
              src={getImageSrc(img.url, index)}
              alt={`${productTitle} ${index + 1}`}
              width={32}
              height={32}
              className="w-full h-full object-cover"
              onError={() => handleImageError(index)}
            />
          </div>
        ))}
        {images.length > 4 && (
          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-xs">
            +{images.length - 4}
          </div>
        )}
      </div>

      {/* Main preview image */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <div className="w-24 h-24 border rounded cursor-pointer overflow-hidden hover:shadow-lg transition-shadow">
            <Image
              src={getImageSrc(currentImage.url, currentImageIndex)}
              alt={`${productTitle} main`}
              width={96}
              height={96}
              className="w-full h-full object-cover"
              onError={() => handleImageError(currentImageIndex)}
            />
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className="relative bg-black">
            {/* Close button */}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Main image */}
            <div className="flex items-center justify-center min-h-[60vh] max-h-[80vh]">
              <Image
                src={getImageSrc(currentImage.url, currentImageIndex)}
                alt={`${productTitle} ${currentImageIndex + 1}`}
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain"
                onError={() => handleImageError(currentImageIndex)}
              />
            </div>

            {/* Image info */}
            <div className="absolute bottom-16 left-4 right-4 text-white text-center">
              <p className="text-sm opacity-75">{productTitle}</p>
              <p className="text-xs opacity-50">
                Image {currentImageIndex + 1} of {images.length}
              </p>
              <p className="text-xs opacity-50 mt-1">
                {currentImage.url.split("/").pop()}
              </p>
              {imageErrors.has(currentImageIndex) && (
                <p className="text-xs text-red-400 mt-1">⚠️ Image not found</p>
              )}
            </div>

            {/* Image thumbnails at bottom */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`w-12 h-12 border-2 rounded overflow-hidden ${
                      index === currentImageIndex
                        ? "border-white"
                        : "border-white/30"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                    title={img.url.split("/").pop()}
                  >
                    <Image
                      src={getImageSrc(img.url, index)}
                      alt={`${productTitle} thumb ${index + 1}`}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(index)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Image count and status */}
      <div className="text-center">
        <span className="text-xs text-gray-500">
          {images.length} image{images.length !== 1 ? "s" : ""}
        </span>
        {imageErrors.size > 0 && (
          <div className="text-xs text-red-500 mt-1">
            ⚠️ {imageErrors.size} missing
          </div>
        )}
      </div>
    </div>
  );
};

export default function ImportProducts() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkValues, setBulkValues] = useState<Partial<ProductRow>>({});
  const [selectAll, setSelectAll] = useState(false);

  // Handle CSV upload
  const onDrop = async (acceptedFiles: File[]) => {
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);

    const res = await fetch("/api/products/import", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      // 1. Only keep products with stock > 0
      let filtered = data.products.filter(
        (p: ProductRow) => Number(p.stock) > 0
      );

      // 2. Keep the cleaned_images paths from the import (they are already correctly formatted)
      filtered = filtered.map((p: ProductRow) => {
        // Use existing images from import or create fallback pattern if none exist
        if (p.images && p.images.length > 0) {
          return p; // Keep existing images from import
        } else {
          // Fallback: create relative paths for cleaned_images
          const safeName = p.title.replace(/[^a-zA-Z0-9]/g, "_");
          return {
            ...p,
            images: [
              {
                url: `cleaned_images/${p.category}/${safeName}_01.png`,
              },
              {
                url: `cleaned_images/${p.category}/${safeName}_02.png`,
              },
            ],
          };
        }
      });

      setProducts(filtered);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // Handle Save
  const handleSave = async () => {
    try {
      const res = await fetch("/api/products/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products }),
      });

      const data = await res.json();

      if (data.success) {
        const message =
          `Products saved successfully!\n\n` +
          `✅ Saved to database: ${data.savedCount} products\n` +
          `❌ Excluded: ${data.excludedCount} products\n\n` +
          `Exclusion reasons:\n` +
          `- No images found\n` +
          `- Too many images (>2)\n` +
          `- Missing image files\n` +
          `- Upload failures`;

        alert(message);

        // Download CSV of excluded products if any exist
        if (data.csvData && data.excludedCount > 0) {
          const shouldDownload = window.confirm(
            `${data.excludedCount} products were excluded. Would you like to download a CSV report?`
          );

          if (shouldDownload) {
            // Create and download CSV file
            const blob = new Blob([data.csvData], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `excluded-products-${
              new Date().toISOString().split("T")[0]
            }.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            console.log(
              `📥 Downloaded CSV report for ${data.excludedCount} excluded products`
            );
          }
        }

        // Update the products list to show only saved products
        setProducts(data.products || []);
      } else {
        alert("Error saving products ❌");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving products ❌");
    }
  };

  // NEW: Handle AI Filtering (only for selected products)
  const handleAIFilter = async () => {
    if (!products.length) {
      alert("No products to filter");
      return;
    }

    if (selected.size === 0) {
      alert("Please select products to filter by checking the checkboxes");
      return;
    }

    // Show current state for selected products only
    const selectedProducts = Array.from(selected).map(
      (index) => products[index]
    );
    const totalImagesBefore = selectedProducts.reduce(
      (total, p) => total + (p.images?.length || 0),
      0
    );
    const productsWithMultipleImages = selectedProducts.filter(
      (p) => p.images && p.images.length >= 2
    ).length;

    const confirmFilter = window.confirm(
      `This will use AI to remove images that don't precisely match the SELECTED products.\n\n` +
        `Selected products state:\n` +
        `- ${selected.size} products selected\n` +
        `- ${totalImagesBefore} total images in selected products\n` +
        `- ${productsWithMultipleImages} selected products with 2+ images (will be filtered)\n\n` +
        `Continue?`
    );

    if (!confirmFilter) return;

    try {
      console.log(
        `🤖 Starting AI filter for ${selected.size} selected products with ${totalImagesBefore} total images`
      );

      const selectedIndices = Array.from(selected);

      const res = await fetch("/api/products/ai-filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products,
          selectedIndices,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const selectedProductsAfter = Array.from(selected).map(
          (index) => data.products[index]
        );
        const totalImagesAfter = selectedProductsAfter.reduce(
          (total: number, p: any) => total + (p.images?.length || 0),
          0
        );
        const removedImages = totalImagesBefore - totalImagesAfter;

        console.log(
          `🤖 AI filter complete: ${totalImagesBefore} → ${totalImagesAfter} images (removed ${removedImages})`
        );

        setProducts(data.products);

        // Clear selection after filtering
        setSelected(new Set());
        setSelectAll(false);

        alert(
          `AI filtering completed for selected products!\n\n` +
            `Results:\n` +
            `- Products processed: ${selected.size}\n` +
            `- Images before: ${totalImagesBefore}\n` +
            `- Images after: ${totalImagesAfter}\n` +
            `- Images removed: ${removedImages}\n` +
            `- Removal rate: ${Math.round(
              (removedImages / totalImagesBefore) * 100
            )}%`
        );
      } else {
        alert("AI filtering failed ❌");
      }
    } catch (error) {
      console.error("AI filtering error:", error);
      alert("AI filtering error ❌");
    }
  };

  // Apply bulk edits to selected rows
  const applyBulkUpdate = () => {
    const newData = [...products];
    selected.forEach((rowIndex) => {
      newData[rowIndex] = { ...newData[rowIndex], ...bulkValues };
    });
    setProducts(newData);
    setBulkValues({});
    alert("Bulk update applied ✅");
  };

  // Toggle select all
  const toggleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelected(new Set(products.map((_, idx) => idx)));
    } else {
      setSelected(new Set());
    }
  };

  // Table columns
  const columns: ColumnDef<ProductRow>[] = [
    {
      id: "select",
      header: () => (
        <Checkbox
          checked={selectAll}
          onCheckedChange={(checked) => toggleSelectAll(checked as boolean)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selected.has(row.index)}
          onCheckedChange={(checked) => {
            const newSel = new Set(selected);
            checked ? newSel.add(row.index) : newSel.delete(row.index);
            setSelected(newSel);
          }}
        />
      ),
    },
    {
      accessorKey: "images",
      header: "Images",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <ImagePreview images={product.images} productTitle={product.title} />
        );
      },
    },
    {
      accessorKey: "asin",
      header: "ASIN",
      cell: (info) => (
        <Input
          value={info.getValue() as string}
          onChange={(e) => {
            const newData = [...products];
            newData[info.row.index].asin = e.target.value;
            setProducts(newData);
          }}
        />
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: (info) => (
        <div className="max-w-xs">
          <Input
            value={info.getValue() as string}
            onChange={(e) => {
              const newData = [...products];
              newData[info.row.index].title = e.target.value;
              setProducts(newData);
            }}
            className="text-sm"
          />
        </div>
      ),
    },
    {
      accessorKey: "brand",
      header: "Brand",
      cell: (info) => (
        <Input
          value={info.getValue() as string}
          onChange={(e) => {
            const newData = [...products];
            newData[info.row.index].brand = e.target.value;
            setProducts(newData);
          }}
        />
      ),
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: (info) => (
        <Input
          value={info.getValue() as string}
          onChange={(e) => {
            const newData = [...products];
            newData[info.row.index].gender = e.target.value;
            setProducts(newData);
          }}
        />
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: (info) => (
        <Input
          type="number"
          value={info.getValue() as number}
          onChange={(e) => {
            const newData = [...products];
            newData[info.row.index].price = parseFloat(e.target.value) || 0;
            setProducts(newData);
          }}
        />
      ),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: (info) => (
        <Input
          type="number"
          value={info.getValue() as number}
          onChange={(e) => {
            const newData = [...products];
            newData[info.row.index].stock = parseInt(e.target.value) || 0;
            setProducts(newData);
          }}
        />
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: (info) => (
        <Input
          value={info.getValue() as string}
          onChange={(e) => {
            const newData = [...products];
            newData[info.row.index].category = e.target.value;
            setProducts(newData);
          }}
        />
      ),
    },
    {
      accessorKey: "linea",
      header: "Linea",
      cell: (info) => (
        <Input
          value={info.getValue() as string}
          onChange={(e) => {
            const newData = [...products];
            newData[info.row.index].linea = e.target.value;
            setProducts(newData);
          }}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4 space-y-4">
      {/* Upload CSV */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        <p className="text-gray-500">
          Drag & drop CSV here, or click to select
        </p>
      </div>

      {/* Action Buttons */}
      {products.length > 0 && (
        <div className="flex gap-2 items-center flex-wrap">
          <Button
            onClick={handleAIFilter}
            variant="outline"
            className="bg-blue-500 hover:bg-blue-600 text-white"
            disabled={selected.size === 0}
          >
            🤖 AI Filter Selected Images (
            {selected.size > 0
              ? `${Array.from(selected).reduce(
                  (total, index) =>
                    total + (products[index].images?.length || 0),
                  0
                )} images in ${selected.size} products`
              : "Select products first"}
            )
          </Button>
          <Button onClick={handleSave}>
            Save to DB ({products.length} products)
          </Button>
          <div className="text-sm text-gray-600">
            Products with images:{" "}
            {products.filter((p) => p.images && p.images.length > 0).length}
          </div>
          {selected.size > 0 && (
            <div className="text-sm text-blue-600">
              {selected.size} products selected for filtering
            </div>
          )}
        </div>
      )}

      {/* Bulk Edit Panel */}
      {selected.size > 0 && (
        <Card>
          <CardContent className="space-y-2">
            <p className="font-semibold">
              Bulk Edit ({selected.size} products selected)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="Category"
                value={bulkValues.category || ""}
                onChange={(e) =>
                  setBulkValues((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
              />
              <Input
                placeholder="Brand"
                value={bulkValues.brand || ""}
                onChange={(e) =>
                  setBulkValues((prev) => ({
                    ...prev,
                    brand: e.target.value,
                  }))
                }
              />
              <Input
                placeholder="Gender"
                value={bulkValues.gender || ""}
                onChange={(e) =>
                  setBulkValues((prev) => ({
                    ...prev,
                    gender: e.target.value,
                  }))
                }
              />
              <Input
                type="number"
                placeholder="Price"
                value={bulkValues.price || ""}
                onChange={(e) =>
                  setBulkValues((prev) => ({
                    ...prev,
                    price: parseFloat(e.target.value) || 0,
                  }))
                }
              />
              <Input
                type="number"
                placeholder="Stock"
                value={bulkValues.stock || ""}
                onChange={(e) =>
                  setBulkValues((prev) => ({
                    ...prev,
                    stock: parseInt(e.target.value) || 0,
                  }))
                }
              />
              <Input
                placeholder="Linea"
                value={bulkValues.linea || ""}
                onChange={(e) =>
                  setBulkValues((prev) => ({
                    ...prev,
                    linea: e.target.value,
                  }))
                }
              />
            </div>
            <Button onClick={applyBulkUpdate}>Apply to Selected</Button>
          </CardContent>
        </Card>
      )}

      {/* Product Table */}
      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="p-2 text-left border-b">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-2 align-top">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
