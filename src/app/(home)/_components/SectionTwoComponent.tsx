import SvgRightMotion from "@/components/images/SvgRightMotion";
import SectionLayoutComponet from "@/components/layouts/SectionLayoutComponet";
import ColTextComponent from "@/components/texts/ColTextComponent";
import Image from "next/image";
import React from "react";

const SectionTwoComponent = () => {
  return (
    <>
      <SectionLayoutComponet
        className={"bg-secondary flex justify-center   min-h-screen w-full "}
      >
        <div className="w-full px-40 maxmd:px-10 mx-auto relative">
          <div className="grid grid-cols-2 maxmd:grid-cols-1  items-center">
            <div className=" maxmd:my-20 maxsm:my-5 pr-10">
              {" "}
              <ColTextComponent
                pretitle={"Amplia Selección"}
                title={"¡Comienza Ahora! "}
                subtitle={
                  "Explora nuestra colección o vende tus tesoros coleccionables hoy mismo"
                }
                btnUrl={`/tienda`}
                btnText={"Explora Nuestra Colección"}
              />
            </div>
            <div className="relative">
              <Image
                src={"/images/square_collection_image.webp"}
                width={1000}
                height={1000}
                alt="Servicios Medicos"
                className="z-10 relative"
              />
              <SvgRightMotion />
            </div>
          </div>
        </div>
      </SectionLayoutComponet>
    </>
  );
};

export default SectionTwoComponent;
