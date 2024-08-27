import DivUpMotion from "@/components/images/DivUpMotion";
import SectionLayoutComponet from "@/components/layouts/SectionLayoutComponet";
import HeroColTextComponent from "@/components/texts/HeroColTextComponent";
import Link from "next/link";
import React from "react";

const serviciosMedicos = [
  {
    title: "Servicio de Cardióloga",
    imgUrl: "/servicios",
    imgSrc: "/images/Hospital_de_Especialidades_Cardiologo.webp",
  },
  {
    title: "Servicio de Ginecología",
    imgUrl: "/servicios",
    imgSrc: "/images/Hospital_de_Especialidades_Ginecologia.webp",
  },
  {
    title: "Servicio de Medicina General",
    imgUrl: "/servicios",
    imgSrc: "/images/doctor-talking-with-patients-2.png",
  },
];

const SectionOneComponent = () => {
  return (
    <>
      <SectionLayoutComponet
        className={
          "bg-nackground maxmd:px-5 pb-24 mx-auto text-center  min-h-screen w-full "
        }
      >
        <div className=" pt-40 w-[80%] maxsm:w-full mx-auto text-center pb-20">
          <HeroColTextComponent
            className={"text-center"}
            pretitle={"Central Medica de Especialidades"}
            title={"Especialistas Médicos de "}
            word={"Excelencia"}
            subtitle={
              "Descubre un equipo de especialistas médicos altamente calificados, comprometidos con tu salud y bienestar."
            }
          />
          <div className="flex flex-row maxmd:flex-col gap-6 maxmd:gap-24 justify-center items-center mt-10">
            {serviciosMedicos?.map((servicio, index) => (
              <DivUpMotion
                key={index}
                divIndex={index}
                divClassName={`relative flex justify-center bg-gray-300 h-[350px] w-[500px] maxsm:w-full rounded-2xl`}
                imgSrc={servicio?.imgSrc}
                imgWidth={1000}
                imgHeight={1000}
                imgAlt="Servicio Medico"
                imgClassName="object-cover w-full h-full rounded-2xl"
                title={servicio?.title}
                divDuration={1}
              />
            ))}
          </div>
        </div>
        <Link
          href={"/especialidades"}
          className="border-b border-b-gray-400 mt-20 tracking-widest font-raleway font-black"
        >
          Explorar Especialidades Medicas
        </Link>
      </SectionLayoutComponet>
    </>
  );
};

export default SectionOneComponent;
