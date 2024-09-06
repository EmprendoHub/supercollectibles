"use client";
import * as React from "react";
import { SLIDER_IMAGES, SLIDER_FOOTER_CARDS } from "@/backend/data/constants";
import EmblaCarousel from "./EmblaCarousel";
import CarouselFooter from "./CarouselFooter";
import { EmblaOptionsType } from "embla-carousel";

const OPTIONS: EmblaOptionsType = { loop: true };

const HomeHeader = () => {
  return (
    <div className=" w-full home-header h-fit">
      <EmblaCarousel slides={SLIDER_IMAGES} options={OPTIONS} />
    </div>
  );
};

export default HomeHeader;
