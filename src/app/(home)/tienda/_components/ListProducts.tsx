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
    <section className="flex w-full flex-col justify-center items-center maxlg:px-20 maxmd:px-5  px-32 gap-8 maxsm:gap-4 ">
      <MobileFilterComponet
        allBrands={allBrands}
        allCategories={allCategories}
      />
      <div className=" mx-auto flex justify-center items-center w-full">
        <div className="flex maxmd:flex-col flex-row  w-full">
          <div className=" maxmd:w-full justify-center items-center gap-x-5">
            <main className=" grid grid-cols-4 maxlg:grid-cols-3 maxmd:grid-cols-2 maxsm:grid-cols-2 gap-8 maxsm:gap-4">
              {products?.map((product: any, index: number) => (
                <ProductCard item={product} key={index} />
              ))}
            </main>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ListProducts;
