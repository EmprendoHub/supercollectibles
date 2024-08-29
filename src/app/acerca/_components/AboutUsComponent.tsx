"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import SectionTextComponent from "@/components/texts/SectionTextComponent";
import CardTextComponent from "./CardTextComponent";
import HeroTextComponent from "@/components/texts/HeroTextComponent";
// Placeholder images
import InnerSectionTextComponent from "@/components/texts/InnerSectionTextComponent";
import HeroColTextComponent from "@/components/texts/HeroColTextComponent";

const AboutUsComponent = () => {
  return (
    <div>
      <section className="min-h-[700px] flex flex-row maxsm:flex-col justify-center items-center relative overflow-hidden bg-foreground">
        <div className="container mx-auto flex justify-center items-center text-center p-5 sm:py-20 text-white dark:text-background z-10">
          <HeroColTextComponent
            pretitle={"CONOCE A"}
            title={"Super Collectibles MX"}
            subtitle={
              "Tu principal destino para muebles minimalistas de diseño excepcional imagen de producto"
            }
            word={""}
            className={""}
          />
        </div>
      </section>
      <section className=" text-center py-12 mt-20 w-[70%] maxmd:w-[90%] p-5 mx-auto">
        <div className="container mx-auto">
          <InnerSectionTextComponent
            title={"Experiencia Personalizada"}
            paraOne={
              "En Super Collectibles MX, nos especializamos en crear sillas, bancos y mesas que personifican la elegancia minimalista, combinando funcionalidad pura con un estilo sofisticado. Cada pieza es una obra de arte, diseñada para enriquecer tu espacio con líneas limpias y una estética atemporal."
            }
            paraTwo={""}
            btnText={""}
            btnUrl={""}
          />
        </div>
      </section>
      <section className=" text-center py-12 mb-20 mx-auto">
        <div className="container mx-auto">
          <h3 className="text-4xl maxmd:text-2xl font-semibold font-raleway  mb-5">
            {"¿Por Qué Elegir Super Collectibles MX?"}
          </h3>
          <p className="text-gray-500 font-raleway ">
            {"En Super Collectibles MX nos dedicamos a brindar:"}
          </p>

          <div className="flex maxmd:flex-col items-center justify-center gap-4 mt-5">
            <div className="w-full bg-foreground rounded-lg px-3 py-4 shadow-md">
              <Image
                src={"/icons/Coach_purser_example.webp"}
                width={800}
                height={800}
                alt="Icon"
                className="mx-auto mb-4 w-40 h-40 rounded-sm "
              />

              <CardTextComponent
                title={"Diseño Minimalista"}
                paraOne={
                  "Nuestros productos están diseñados con un enfoque minimalista, asegurando que cada pieza no solo sea funcional sino también estéticamente agradable. Con Super Collectibles MX, menos es definitivamente más."
                }
                paraTwo={""}
                btnText={""}
                btnUrl={""}
              />
              <div className="mt-10" />
            </div>

            <div className="w-full bg-foreground  rounded-sm px-3 py-4  shadow-md">
              <Image
                src={"/icons/Coach_purser_example.webp"}
                width={800}
                height={800}
                alt="Icon"
                className="mx-auto mb-4 w-40 h-40 rounded-sm"
              />

              <CardTextComponent
                title={"Atención Personalizada"}
                paraOne={
                  "Entendemos que cada espacio es único. Por eso, estamos aquí para ayudarte a seleccionar los muebles perfectos que se adapten a tu estilo. Nuestro equipo está dedicado a brindarte una experiencia inigualable."
                }
                paraTwo={""}
                btnText={""}
                btnUrl={""}
              />
              <div className="mt-10" />
            </div>

            <div className="w-full bg-foreground  rounded-sm  px-3 py-4  shadow-md">
              <Image
                src={"/icons/Coach_purser_example.webp"}
                width={800}
                height={800}
                alt="Icon"
                className="mx-auto mb-4 w-40 h-40 rounded-sm"
              />

              <CardTextComponent
                title={"Calidad Superior"}
                paraOne={
                  "Comprometidos con la excelencia, cada artículo de nuestro catálogo está fabricado con materiales de alta calidad, asegurando durabilidad y resistencia. Nuestros muebles están construidos para durar."
                }
                paraTwo={""}
                btnText={""}
                btnUrl={""}
              />
              <div className="mt-10" />
            </div>
          </div>
        </div>
      </section>
      <div className="flex flex-row w-[80%] maxmd:w-full maxmd:flex-col items-center mx-auto my-20 px-1">
        <section className="text-center w-1/2 maxmd:w-full">
          <div className="container mx-auto px-6 maxsm:px-3">
            <SectionTextComponent
              title={"Nuestra Misión"}
              paraOne={
                "Nuestra misión en Super Collectibles MX es simple: transformar espacios con muebles minimistas que inspiren serenidad y belleza."
              }
              paraTwo={
                "Creemos en el poder del diseño minimalista para crear ambientes que reflejen tranquilidad y simplicidad elegante."
              }
              btnText={"Contactar"}
              btnUrl={`/contacto`}
            />
          </div>
        </section>

        <section className=" text-center w-1/2 maxmd:w-full maxmd:mt-5">
          {/* Image */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="flex gap-x-4 mt-2 justify-center"
          >
            <div className="bg-white rounded-lg p-4 shadow-md">
              <Image
                src={"/icons/Coach_purser_example.webp"}
                width={1080}
                height={1080}
                alt="Super Collectibles MX"
                className="mx-auto mb-4 w-full h-full"
              />
            </div>
          </motion.div>
        </section>
      </div>

      <section className="min-h-[900px] flex flex-row maxsm:flex-col justify-center items-center relative">
        <div className="container mx-auto flex justify-center items-center text-center p-5 sm:py-20 bg-foreground z-10">
          <HeroTextComponent
            title={"Una Experiencia de Compra Excepcional"}
            subtitle={
              "En Super Collectibles MX, valoramos la importancia de una experiencia de compra sin complicaciones."
            }
            btnText={"Visitar Tienda"}
            btnUrl={`/tienda`}
          />
        </div>
      </section>
    </div>
  );
};

export default AboutUsComponent;
