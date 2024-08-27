import React from "react";
import SectionOneComponent from "./_components/SectionOneComponent";
import SectionTwoComponent from "./_components/SectionTwoComponent";
import SectionFourComponent from "./_components/SectionFourComponent";
import MainHeroComponent from "./_components/MainHeroComponent";
import TestimonialComponent from "./_components/TestimonialComponent";

const HomeComponent = () => {
  return (
    <div className="w-full ">
      <div className="w-full">
        <MainHeroComponent />
      </div>
      <SectionOneComponent />
      <SectionTwoComponent />
      <TestimonialComponent />
      <SectionFourComponent />
    </div>
  );
};

export default HomeComponent;
