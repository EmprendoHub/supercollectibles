"use client";
import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import MiniProductCard from "./MiniProductCard";

const HeaderProducts = ({ editorsProducts }: { editorsProducts: any }) => {
  return (
    <div className="relative  h-full pb-20 pt-5 group">
      <Carousel
        className="w-[800px] maxmd:w-[95%] mx-auto "
        opts={{
          align: "center",
          slidesToScroll: 3,
        }}
      >
        <h3 className="mb-3 text-semibold text-sm">Lo mas vendido</h3>
        <CarouselContent className="-ml-1 ">
          {editorsProducts.slice(0, 20).map((product: any, index: any) => (
            <CarouselItem
              key={index}
              className="pl-1 basis-1/5 maxmd:basis-1/4 maxsm:basis-1/3"
            >
              <MiniProductCard item={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default HeaderProducts;
