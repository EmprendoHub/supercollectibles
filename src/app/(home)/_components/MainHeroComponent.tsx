import React from "react";
import ColTextComponent from "@/components/texts/ColTextComponent";
import ImageRightMotion from "@/components/images/ImageRightMotion";

const MainHeroComponent = () => {
  return (
    <>
      <div className="w-full bg-blue-950 px-10 maxmd:px-0  ">
        <div className="bg-background min-h-full relative flex flex-row maxmd:flex-col z-[5] justify-center items-center  ">
          <div className="w-1/3 maxmd:w-full flex flex-col gap-y-5  maxmd:p-10 maxsm:pt-20">
            <ColTextComponent
              pretitle={"Bienvenido a la"}
              title={"Central Medica de Especialidades"}
              subtitle={
                "Donde la salud y el bienestar son nuestra prioridad. Nos enorgullece ofrecer atención médica excepcional con distinción, calidad y un fuerte sentido humanitario. Comprometidos con su salud, buscamos lograr y preservar un alto reconocimiento social. En la Central Medica de Especialidades, su bienestar es nuestra misión."
              }
              btnUrl={`/acerca`}
              btnText={"Saber Mas"}
            />
          </div>
          <div className="w-2/3 maxmd:w-full h-full p-0 relative ">
            <ImageRightMotion
              imgSrc={"/images/doctor-holding-patient-medium-shot-1.webp"}
              imgWidth={1000}
              imgHeight={1000}
              imgAlt={"Hospital de Especialidades"}
              className={"w-full h-full object-cover"}
            />
          </div>
          <div className=" h-[100px] bg-gradient-to-b from-transparent to-white absolute bottom-0 right-0 w-full " />
        </div>
        <div className="bg-nackground h-[600px] absolute bottom-0 right-0 w-full z-0" />
      </div>
    </>
  );
};

export default MainHeroComponent;
