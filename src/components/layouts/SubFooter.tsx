import React from "react";
import ColFooterTextComponent from "../texts/ColFooterTextComponent";
import Image from "next/image";

const SubFooter = () => {
  return (
    <div className="w-full h-full  relative flex flex-row  maxsm:flex-col-reverse justify-center items-end px-40 maxlg:px-10 maxsm:pt-10">
      <div className="w-full  h-full relative z-[1] flex justify-end pr-20 maxmd:pr-5">
        <Image
          src={"/images/footer_image.webp"}
          width={700}
          height={700}
          alt="Centro de Especialidades"
          className="object-cover w-[600px] h-full relative bottom-0 z-[1]"
        />
        <div className="bg-blue-950 w-[400px] h-[400px] rounded-tl-full rounded-tr-full rounded-br-full absolute bottom-0 z-0" />
      </div>

      <div className="w-full relative z-[1]">
        <ColFooterTextComponent
          pretitle={"Atención médica profesional y confiable"}
          title={"Central Médica de Especialidades"}
          subtitle={
            "Agradece su estancia y su preferencia, deseando siempre su bienestar"
          }
          btnUrl={`/acerca`}
          btnText={"Saber Mas"}
        />
      </div>
      <div className="w-full h-[300px] maxmd:h-[370px] bg-gray-300 absolute bottom-0 left-0 z-0" />
    </div>
  );
};

export default SubFooter;
