import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const CLEANED_IMAGES_DIR =
  "/mnt/3TB/CLIENTES/SuperCollectiblesMx/2025/NEW PSA/cleaned_images";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Reconstruct the file path from the URL segments
    const filePath = path.join(CLEANED_IMAGES_DIR, ...params.path);

    console.log(`🖼️  Image request: ${request.url}`);
    console.log(`📁 Reconstructed path: ${filePath}`);
    console.log(`📋 URL params:`, params.path);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Image not found: ${filePath}`);

      // Let's also check what files DO exist in that directory
      const directory = path.dirname(filePath);
      const fileName = path.basename(filePath);

      console.log(`📂 Directory: ${directory}`);
      console.log(`📄 Looking for: ${fileName}`);

      if (fs.existsSync(directory)) {
        const availableFiles = fs
          .readdirSync(directory)
          .filter((f) => f.toLowerCase().endsWith(".png"))
          .slice(0, 10); // Show first 10 files

        console.log(
          `📋 Available files in directory (first 10):`,
          availableFiles
        );

        // Try to find similar files
        const similarFiles = availableFiles.filter(
          (f) =>
            f.toLowerCase().includes("eustass") ||
            f.toLowerCase().includes("captain") ||
            f.toLowerCase().includes("kid") ||
            f.toLowerCase().includes("st10013")
        );

        console.log(`🔍 Similar files found:`, similarFiles);
      } else {
        console.log(`❌ Directory doesn't exist: ${directory}`);
      }

      return new NextResponse("Image not found", { status: 404 });
    }

    // Read the file
    const fileBuffer = fs.readFileSync(filePath);

    if (!fileBuffer || fileBuffer.length === 0) {
      console.log(`❌ File is empty or couldn't be read: ${filePath}`);
      return new NextResponse("Empty file", { status: 404 });
    }

    console.log(
      `✅ Successfully read file: ${filePath} (${fileBuffer.length} bytes)`
    );

    // Determine content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    let contentType = "image/jpeg"; // default

    switch (ext) {
      case ".png":
        contentType = "image/png";
        break;
      case ".jpg":
      case ".jpeg":
        contentType = "image/jpeg";
        break;
      case ".gif":
        contentType = "image/gif";
        break;
      case ".webp":
        contentType = "image/webp";
        break;
    }

    // Convert Buffer to Uint8Array which is compatible with NextResponse
    const uint8Array = new Uint8Array(fileBuffer);

    // Return the image with proper headers
    return new NextResponse(uint8Array, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000", // Cache for 1 year
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
