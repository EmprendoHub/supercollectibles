import DivUpMotion from "@/components/images/DivUpMotion";
import SectionLayoutComponet from "@/components/layouts/SectionLayoutComponet";
import HeroColTextComponent from "@/components/texts/HeroColTextComponent";
import Link from "next/link";
import React from "react";

const serviciosMedicos = [
  {
    title: "Compra de Tarjetas Únicas",
    text: "Le encontramos un nuevo hogar a tus coleccionables mas especiales",
    imgUrl: "/contacto",
    imgSrc: "/images/Main_cover_image02.jpeg",
  },
  {
    title: "Garantía de Autenticidad",
    text: "Cada artículo es verificado para garantizar que estás adquiriendo piezas genuinas.",
    imgUrl: "/tienda",
    imgSrc: "/images/OIG_02.jpeg",
  },
  {
    title: "Compras Seguras y Fáciles",
    text: "Nuestro proceso de compra es sencillo, seguro y rápido, permitiéndote adquirir lo que necesitas sin complicaciones.",
    imgUrl: "/servicios",
    imgSrc: "/images/placeholder_02.jpeg",
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
            pretitle={"Amplia Selección"}
            title={"¿Por Qué  "}
            word={"Elegirnos?"}
            subtitle={
              "Disponemos de un catálogo extenso con tarjetas y artículos coleccionables cuidadosamente seleccionados, asegurando calidad y autenticidad en cada producto."
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
                text={servicio?.text}
                divDuration={1}
              />
            ))}
          </div>
        </div>
        <Link
          href={"/tienda"}
          className="border-b border-b-gray-400 mt-20 tracking-widest font-raleway font-black"
        >
          Explorar La Tienda
        </Link>
      </SectionLayoutComponet>
    </>
  );
};

export default SectionOneComponent;
