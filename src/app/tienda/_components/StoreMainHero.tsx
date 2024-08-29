"use client";
import Image from "next/image";
import React from "react";

const StoreMainHero = () => {
  return (
    <section className="w-full px-28 maxmd:px-5 flex flex-col items-center justify-center h-auto mt-5">
      <div className="relative w-full  h-full">
        <div className=" w-full h-full ">
          <Image
            src={`/covers/Store_Image_header.png`}
            alt="img"
            width={1920}
            height={1080}
            className="rounded-lg object-bottom w-full h-full"
          />
        </div>
      </div>
    </section>
  );
};

export default StoreMainHero;
