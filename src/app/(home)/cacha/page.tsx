import React from "react";
import CachaLandingPage from "./_components/CachaLandingPage";

export const metadata = {
  title: "Cacha Meet & Greet en Super Collectibles Mx",
  description:
    "Únete al evento exclusivo Meet & Greet con Cacha. Música by LLOVET, drop oficial de merch y acceso gratis con registro. ¡No te lo pierdas!",
};

const CachaPage = async () => {
  return (
    <main className="min-h-screen">
      <CachaLandingPage />
    </main>
  );
};

export default CachaPage;
