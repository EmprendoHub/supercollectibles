import React from "react";
import ColTextComponent from "@/components/texts/ColTextComponent";
import ImageRightMotion from "@/components/images/ImageRightMotion";
import Image from "next/image";
import LogoComponent from "@/components/layouts/LogoComponent";

const MainHeroComponent = () => {
  return (
    <div
      className={`min-w-full min-h-screen relative flex flex-col justify-center items-center`}
    >
      {/* overlay */}
      <div className="h-full flex flex-wrap bg-black bg-opacity-85 w-full absolute bottom-0 right-0 z-[1]" />
      <div className="absolute flex flex-col items-center justify-center z-20 w-full  px-5">
        <ColTextComponent
          pretitle={"Bienvenido a"}
          title={"Super Collectibles Mx"}
          subtitle={
            "En Super Collectibles Mx, entendemos la pasión que impulsa a los coleccionistas. Ya sea que busques la carta rara de Pokémon que falta en tu colección, las tarjetas de béisbol que inmortalizan a tus jugadores favoritos, o artículos exclusivos de Magic: The Gathering, estás en el lugar indicado"
          }
          btnUrl={`/acerca`}
          btnText={"Saber Mas"}
        />
      </div>

      {/* Updated Image Component */}
      <div className="absolute inset-0 z-0">
        <Image
          alt="Super Collectibles Mx"
          src="/covers/Main_cover_image_01.jpeg"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          quality={100}
        />
      </div>
    </div>
  );
};

export default MainHeroComponent;
