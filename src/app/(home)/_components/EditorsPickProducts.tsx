"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./slider.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MiniProductCard from "./MiniProductCard";

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div onClick={onClick}>
      <ChevronRight
        size={50}
        className="text-primary bg-slate-100 rounded-full p-1 top-[45%] absolute z-10 cursor-pointer hover:scale-105 -right-6 maxmd:right-1 hover:shadow-gray-600 shadow-gray-600 shadow-sm hover:shadow-lg"
      />
    </div>
  );
}

function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div onClick={onClick}>
      <ChevronLeft
        size={50}
        className="text-primary bg-slate-100 rounded-full p-1  top-[45%] absolute z-10 cursor-pointer hover:scale-105 -left-6 maxmd:left-1 hover:shadow-gray-600 shadow-gray-600 shadow-sm hover:shadow-lg"
      />
    </div>
  );
}

const EditorsSlider = ({ editorsProducts }: { editorsProducts: any }) => {
  const settings = {
    dots: true,
    lazyLoad: "ondemand",
    centerMode: true,
    initialSlide: 0,
    slidesToShow: 6,
    slidesToScroll: 6,
    speed: 1000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    className:
      "center mx-auto flex items-center justify-center max-w-[80vw] maxlg:max-w-[90vw] maxmd:max-w-[100vw]",
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="relative  h-full pb-20 pt-5 group">
      <Slider {...settings}>
        {editorsProducts.slice(0, 20).map((product: any, index: any) => (
          <MiniProductCard item={product} key={index} />
        ))}
      </Slider>
    </div>
  );
};

export default EditorsSlider;
