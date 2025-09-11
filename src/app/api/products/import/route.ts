import { NextResponse } from "next/server";
import csv from "csv-parser";
import fs from "fs";
import path from "path";

// Path where renamed images live
const CLEANED_IMAGES_DIR =
  "/mnt/3TB/CLIENTES/SuperCollectiblesMx/2025/NEW PSA/cleaned_images";

// Function to clean names exactly like the Python script
function clean_name(name: string): string {
  // Remove all special characters except letters, numbers, and spaces
  let cleaned = name.replace(/[^a-zA-Z0-9 ]/g, "");
  // Replace multiple spaces with single underscore
  cleaned = cleaned.replace(/\s+/g, "_");
  // Remove leading/trailing underscores
  cleaned = cleaned.trim().replace(/^_+|_+$/g, "");
  return cleaned;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json(
        { error: "CSV file is required" },
        { status: 400 }
      );
    }

    // Save uploaded CSV temporarily
    const tempPath = path.join("/tmp", file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.promises.writeFile(tempPath, buffer);

    // Parse CSV
    const products: any[] = [];
    await new Promise<void>((resolve, reject) => {
      interface ProductImage {
        url: string;
      }

      interface ProductVariation {
        title: string;
        stock: number;
        price: number;
        image: string;
      }

      interface Product {
        asin: string;
        title: string;
        description: string;
        price: number;
        stock: number;
        category: string;
        linea: string;
        gender: string;
        brand: string;
        images: ProductImage[];
        variations: ProductVariation[];
      }

      interface CsvRow {
        [key: string]: string;
        Código: string;
        Producto: string;
        Precio: string;
        Existencia: string;
        Categoria: string;
        Ubicacion: string;
        Genero: string;
        Marca: string;
      }

      fs.createReadStream(tempPath)
        .pipe(csv({ separator: "," }))
        .on("data", (row: CsvRow) => {
          const asin: string = row["Código"];
          const title: string = row["Producto"];
          const description: string = row["Producto"];
          const priceString = (row["Precio"] || "0").replace(/[$,]/g, "");
          const price: number = parseFloat(priceString);
          const stock: number = parseFloat(row["Existencia"] || "0");
          const category: string = row["Categoria"];
          const linea: string = row["Ubicacion"];
          const gender: string = row["Genero"];
          const brand: string = row["Marca"];

          // Find product images using the same clean_name logic as Python script
          let images: ProductImage[] = [];

          const categoryFolder = path.join(CLEANED_IMAGES_DIR, category);
          if (fs.existsSync(categoryFolder)) {
            try {
              const files = fs.readdirSync(categoryFolder);
              console.log(`\n🔍 Looking for images for: "${title}"`);
              console.log(`Category folder: ${categoryFolder}`);

              // Clean the product name exactly like the Python script does
              const cleanedProductName = clean_name(title);
              console.log(
                `🧹 Cleaned product name: "${title}" → "${cleanedProductName}"`
              );

              // Look for files that start with the cleaned product name + underscore + number
              const matchingFiles = files.filter((file) => {
                if (!file.toLowerCase().endsWith(".png")) return false;

                const fileName = file.replace(/\.[^/.]+$/, ""); // Remove extension

                // PRIMARY METHOD: Exact pattern match (this should be 99% of matches)
                const expectedPattern = new RegExp(
                  `^${cleanedProductName.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                  )}_\\d{2}$`
                );
                const isExactMatch = expectedPattern.test(fileName);

                console.log(`  Checking: ${fileName}`);
                console.log(
                  `  Expected exact pattern: ${cleanedProductName}_XX`
                );
                console.log(`  Exact match: ${isExactMatch}`);

                if (isExactMatch) {
                  return true;
                }

                // FALLBACK METHOD: Only for very specific cases where naming might have minor differences
                // This should be extremely rare and very strict
                const fileNameLower = fileName.toLowerCase();
                const cleanedLower = cleanedProductName.toLowerCase();

                // Only try partial matching if:
                // 1. The filename starts with most of the cleaned product name (first 70% of characters)
                // 2. AND the filename doesn't have obvious different identifiers

                const minPrefixLength = Math.floor(cleanedLower.length * 0.7);
                const productPrefix = cleanedLower.substring(
                  0,
                  minPrefixLength
                );
                const startsWithPrefix =
                  fileNameLower.startsWith(productPrefix);

                console.log(`  Product prefix (70%): "${productPrefix}"`);
                console.log(`  File starts with prefix: ${startsWithPrefix}`);

                if (!startsWithPrefix) {
                  console.log(
                    `  ❌ Partial match: File doesn't start with product prefix`
                  );
                  return false;
                }

                // Check for obvious mismatches in the filename
                const suspiciousPatterns = [
                  /\d{4}_[A-Z]+_/, // Year_COMPANY_ pattern (like 2023_POKEMON_)
                  /_JP_|_EN_|_JPN_/, // Language indicators
                  /_PSA_\d+/, // PSA grading (when our product doesn't specify PSA)
                  /_SPECIAL_|_ILLUSTRATION_|_RARE_/, // Special card types
                  /_SV\d+|_PAF_|_BS_VOL_/, // Specific set codes
                ];

                const hasSuspiciousPattern = suspiciousPatterns.some(
                  (pattern) => pattern.test(fileNameLower)
                );

                if (hasSuspiciousPattern) {
                  console.log(
                    `  ❌ Partial match: File has suspicious patterns indicating different product`
                  );
                  return false;
                }

                // If we get here, it might be a valid partial match
                // But require very high similarity
                const similarity = calculateStringSimilarity(
                  cleanedLower,
                  fileNameLower
                );
                const isPartialMatch = similarity >= 0.85; // Very high threshold

                console.log(
                  `  String similarity: ${Math.round(similarity * 100)}%`
                );
                console.log(`  Partial match (≥85%): ${isPartialMatch}`);

                return isPartialMatch;
              });

              // Convert matching files to image objects
              images = matchingFiles.map((file) => ({
                url: `cleaned_images/${category}/${file}`,
              }));

              console.log(
                `✅ Found ${images.length} matching images:`,
                matchingFiles
              );
            } catch (err) {
              console.error(
                `Error reading category folder ${categoryFolder}:`,
                err
              );
            }
          } else {
            console.log(`❌ Category folder does not exist: ${categoryFolder}`);
          }

          // Default variation
          const variations: ProductVariation[] = [
            {
              title: title,
              stock: stock,
              price: price,
              image: images.length > 0 ? images[0].url : "",
            },
          ];

          const product: Product = {
            asin,
            title,
            description,
            price,
            stock,
            category,
            linea,
            gender,
            brand,
            images,
            variations,
          };

          products.push(product);
        })
        .on("end", () => resolve())
        .on("error", reject);
    });

    // Clean up temp file
    try {
      await fs.promises.unlink(tempPath);
    } catch (err) {
      console.warn("Could not delete temp file:", err);
    }

    return NextResponse.json({ success: true, products });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error parsing CSV" }, { status: 500 });
  }
}

// Helper function to calculate string similarity
function calculateStringSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

// Levenshtein distance calculation
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
}
