import MidSectionLayoutComponet from "@/components/layouts/MidSectionLayoutComponet";
import ColTextColorComponent from "@/components/texts/ColTextColorComponent";
import Image from "next/image";
import React from "react";

const SectionFourComponent = () => {
  return (
    <MidSectionLayoutComponet
      className={"bg-card items-center justify-center flex w-full"}
    >
      <div className="w-full px-40 maxmd:px-0 mx-auto relative">
        <div className="grid grid-cols-2 maxmd:grid-cols-1 items-center">
          <div className="maxmd:order-2 relative flex justify-center items-center w-full h-full">
            <Image
              src={"/images/cirujano-operacion.png"}
              width={2000}
              height={2000}
              alt="Servicios Medicos"
              className="z-10 relative w-full h-full  object-cover"
            />
            <Image
              src={"/images/play_video_icon.png"}
              width={70}
              height={70}
              alt="play"
              className="absolute z-20"
            />
          </div>
          <div className="bg-blue-950 h-full p-20 maxmd:p-10 text-white">
            {" "}
            <ColTextColorComponent
              pretitle={"Información de"}
              title={"Contacto"}
              subtitle={
                "Usted nos podrá localizar en Carretera Nacional Sur sin numero, colonia Noria de Montes, en la Ciudad de Sahuayo, Michoacan, a solo 300 metros de Bodega Aurrera."
              }
              addressOne={"Carretera Nacional Sur"}
              addressTwo={"Sahuayo de Morelos, Mich. 59000"}
              tel={"353-532-2847"}
              email={"cme_sahuayo@yahoo.com.mx"}
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
