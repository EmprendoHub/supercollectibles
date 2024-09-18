"use client";
import React, { useEffect } from "react";
import ProductCard from "@/app/(home)/producto/_components/ProductCard";
import MobileFilterComponet from "./MobileFilterComponet";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ListProducts = ({
  products,
  allBrands,
  allCategories,
  filteredProductsCount,
  per_page,
  start,
  end,
}: {
  products: any;
  allBrands: any;
  allCategories: any;
  filteredProductsCount: number;
  per_page?: any;
  start?: any;
  end?: any;
}) => {
  const { data: session }: any = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session?.user?.role === "manager") {
      router.push("/admin");
    }
    // eslint-disable-next-line
  }, [session?.user?.role]);

  return (
    <section className="flex w-[780px] flex-col justify-center items-center gap-8 maxsm:gap-4 maxmd:w-[95%] ">
      <MobileFilterComponet
        allBrands={allBrands}
        allCategories={allCategories}
      />
      <div className="relative w-[800px] maxmd:w-[95%] mx-auto">
        <div className=" grid grid-cols-5 maxlg:grid-cols-5 maxmd:grid-cols-4 maxsm:grid-cols-3 gap-8 maxsm:gap-4">
          {products?.map((product: any, index: number) => (
            <ProductCard item={product} key={index} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ListProducts;
