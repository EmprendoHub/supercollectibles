import MidSectionLayoutComponet from "@/components/layouts/MidSectionLayoutComponet";
import ColTextColorComponent from "@/components/texts/ColTextColorComponent";
import Image from "next/image";
import React from "react";

const SectionFourComponent = () => {
  return (
    <MidSectionLayoutComponet
      className={"bg-black items-center justify-center flex w-full"}
    >
      <div className="w-full px-20 maxmd:px-0 mx-auto relative">
        <div className="grid grid-cols-2 maxmd:grid-cols-1 items-center">
          <div className="maxmd:order-2 relative flex justify-center items-center w-full h-auto">
            <Image
              src={"/images/OIG1.jpeg"}
              width={1080}
              height={1080}
              alt="Servicios para coleccionistas"
              className="z-10 relative w-full h-full  object-cover "
            />
            <Image
              src={"/images/play_video_icon.png"}
              width={70}
              height={70}
              alt="play"
              className="absolute z-20"
            />
          </div>
          <div className="bg-background  h-auto p-10 maxmd:p-10">
            {" "}
            <ColTextColorComponent
              pretitle={"Información de"}
              title={"Contacto"}
              subtitle={""}
              addressOne={"Plaza Patria"}
              addressTwo={"Zapopan, Jalisco, 44950"}
              tel={"333-532-2847"}
              email={"mxsupercollectibles@gmail.com"}
              btnUrl="/contacto"
              btnText={"Contactar"}
            />
          </div>
        </div>
      </div>
    </MidSectionLayoutComponet>
  );
};

export default SectionFourComponent;
