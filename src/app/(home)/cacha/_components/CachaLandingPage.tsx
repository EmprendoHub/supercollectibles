"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import RegistrationModal from "./RegistrationModal";
import CachaIcon from "./CachaIcon";
import Link from "next/link";

const CachaLandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-500 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Event Info */}
          <div className="text-white space-y-6 text-center lg:text-left">
            <div className="space-y-2">
              <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                EVENTO EXCLUSIVO
              </div>
              <h1 className="text-4xl md:text-6xl font-bold  text-white bg-black p-4">
                MEET & GREET
              </h1>
              <h2 className="text-2xl md:text-4xl font-bold text-pink-300 pl-4">
                CON CACHA
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <CachaIcon name="music" size={24} />
                </div>
                <span className="text-xl p-2 font-bold bg-yellow-500 text-black uppercase">
                  Música by LLOVET
                </span>
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <CachaIcon name="tshirt" size={24} />
                </div>
                <span className="text-xl p-2 font-bold bg-blue-500 uppercase ">
                  Drop oficial de merch
                </span>
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <div className="w-12 h-12 bg-purple-700 rounded-full flex items-center justify-center">
                  <CachaIcon name="ticket" size={24} />
                </div>
                <span className="text-xl p-2 font-bold bg-fuchsia-600 uppercase">
                  Acceso GRATIS con registro
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => setIsModalOpen(true)}
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                REGÍSTRATE GRATIS
              </Button>

              <p className="text-pink-200 text-sm">
                *Cupos limitados - Regístrate ahora
              </p>
            </div>
          </div>

          {/* Right Column - Cacha Image/Avatar */}
          <div className="flex flex-col items-center gap-y-2 justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 p-1">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                  {/* Placeholder for Cacha's photo */}
                  <div className="w-full h-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-white text-6xl font-bold">
                    <Image
                      src="/images/cacha-influencer.jpeg"
                      alt="Cacha"
                      width={500}
                      height={500}
                    />
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-black rounded-full flex items-center justify-center text-2xl animate-bounce">
                <Image
                  src="/logos/Super-Collectibles-Icono-Del-Sitio.png"
                  alt="Cacha"
                  width={150}
                  height={150}
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-pink-400 rounded-full flex items-center justify-center text-xl animate-pulse">
                <CachaIcon name="heart" size={36} />
              </div>
            </div>
            <Link href="https://www.instagram.com/cacha.oficial">
              <a className="text-pink-200 text-4xl font-bold ml-4 mt-2">
                @cacha.oficial
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section className="relative z-10 py-16 px-4 bg-black/80">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Detalles del Evento
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <CachaIcon name="calendar" size={48} />
                </div>
                <h4 className="font-bold text-lg mb-2">Fecha</h4>
                <p className="text-pink-200">Próximamente</p>
                <p className="text-sm text-gray-300">
                  Sábado 01 de Noviembre a las 2:00 PM
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <CachaIcon name="location" size={48} />
                </div>
                <h4 className="font-bold text-lg mb-2">Ubicación</h4>
                <p className="text-pink-200">Guadalajara</p>
                <p className="text-sm text-gray-300">
                  Centro Magno - Av. Ignacio L Vallarta 2425, Arcos Vallarta,
                  44130 Guadalajara, Jal.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <CachaIcon name="party" size={48} />
                </div>
                <h4 className="font-bold text-lg mb-2">Experiencia</h4>
                <p className="text-pink-200">Meet & Greet</p>
                <p className="text-sm text-gray-300">Fotos, autógrafos y más</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 py-16 px-4 text-center bg-gradient-to-br from-purple-900 via-pink-800 to-purple-500">
        <div className="max-w-2xl mx-auto space-y-6">
          <h3 className="text-3xl font-bold text-white">
            ¿Listo para conocer a Cacha?
          </h3>
          <p className="text-xl text-pink-200">
            No te pierdas esta oportunidad única. Regístrate ahora y asegura tu
            lugar.
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            REGÍSTRATE AHORA
          </Button>
        </div>
      </section>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default CachaLandingPage;
