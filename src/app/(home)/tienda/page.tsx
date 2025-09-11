import { Suspense } from "react";
import dbConnect from "@/lib/db";
import Product from "@/backend/models/Product";

import ListProducts from "./_components/ListProducts";

export const metadata = {
  title: "Tienda - SuperCollectibles",
  description: "Explora nuestra colección de cartas coleccionables",
};

async function getStoreData() {
  await dbConnect();

  const products = await Product.find({
    "availability.online": true,
  })
    .select("_id title slug price images category brand gender variations")
    .lean();

  // Get unique values for filters
  const allCategories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );
  const allBrands = Array.from(
    new Set(products.map((p) => p.brand).filter(Boolean))
  );
  const allGenders = Array.from(
    new Set(products.map((p) => p.gender).filter(Boolean))
  );

  // Get price range
  interface ProductVariation {
    price: number;
    [key: string]: any;
  }

  interface StoreProduct {
    _id: string;
    title: string;
    slug: string;
    price: number;
    images: string[];
    category?: string;
    brand?: string;
    gender?: string;
    variations?: ProductVariation[];
    [key: string]: any;
  }

  const productsTyped = products as unknown as StoreProduct[];

  const prices: number[] = productsTyped.flatMap(
    (p) =>
      p.variations?.map((v) => v.price).filter((price) => price != null) || []
  );
  const minPrice = Math.min(...prices) || 0;
  const maxPrice = Math.max(...prices) || 1000;

  return {
    products: JSON.parse(JSON.stringify(products)),
    allCategories: allCategories.sort(),
    allBrands: allBrands.sort(),
    allGenders: allGenders.sort(),
    priceRange: { min: minPrice, max: maxPrice },
  };
}

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    search?: string;
    category?: string;
    brand?: string;
    gender?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}) {
  const { products, allCategories, allBrands, allGenders, priceRange } =
    await getStoreData();

  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<div>Cargando productos...</div>}>
        <ListProducts
          products={products}
          allCategories={allCategories}
          allBrands={allBrands}
          allGenders={allGenders}
          priceRange={priceRange}
          searchParams={searchParams}
          filteredProductsCount={products.length}
        />
      </Suspense>
    </main>
  );
}
