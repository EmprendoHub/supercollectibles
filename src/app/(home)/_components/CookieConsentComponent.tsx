"use client";
import Link from "next/link";
import { hasCookie, setCookie } from "cookies-next";
import React, { useEffect, useState } from "react";

export default function CookieConsentComponent() {
  const [showConsent, setShowConsent] = useState(true);
  useEffect(() => {
    setShowConsent(hasCookie("localConsent"));
  }, []);

  const giveCookieConsent = () => {
    setShowConsent(true);
    setCookie("localConsent", "true", {});
  };

  if (showConsent) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-slate-700 bg-opacity-50 z-[5000]">
      <div className="fixed z-[99] left-0 bottom-0 w-full bg-gray-200 p-10 maxsm:p-5 flex flex-row maxmd:flex-col justify-between items-center text-blueDark h-[150px]">
        <p className="text-lg maxsm:text-xs">
          Utilizamos cookies para mejorar su experiencia de usuario. Al utilizar
          nuestro sitio web, acepta nuestro uso de cookies.{" "}
          <Link href={"/politica-privacidad"}>Más información...</Link>
        </p>
        <button
          className="w-[250px] maxsm:w-[100px] py-3 bg-greenLight text-white flex justify-center items-center cursor-pointer"
          onClick={() => giveCookieConsent()}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
