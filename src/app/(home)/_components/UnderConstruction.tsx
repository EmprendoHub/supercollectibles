import React from "react";
import LogoComponent from "@/components/layouts/LogoComponent";
import Image from "next/image";
const UnderConstruction = () => {
  return (
    <div
      className={`min-w-full min-h-screen relative flex flex-col justify-center items-center `}
    >
      {/* overlay */}
      <div className="h-full flex flex-wrap bg-black bg-opacity-85 w-full absolute bottom-0 right-0 z-[1]" />
      <div className="absolute flex flex-col items-center justify-center z-20 w-full">
        <LogoComponent />
        <p className="text-4xl text-white font-black">¡Muy Pronto!</p>
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

export default UnderConstruction;
