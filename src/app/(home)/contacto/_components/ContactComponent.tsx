import React from "react";
import ContactUsComponent from "./ContactUsComponent";
import IconListSectionComponent from "./IconListSectionComponent";
import HeroColTextComponent from "@/components/texts/HeroColTextComponent";

const ContactComponent = () => {
  return (
    <>
      <div>
        <section className="relative min-h-[400px] flex flex-row maxsm:flex-col justify-center items-center  bg-background text-foreground">
          <div className="relative container mx-auto flex justify-center items-center text-center p-5 sm:py-20 z-10">
            <HeroColTextComponent
              pretitle={"CONTACTO"}
              title={"Super Collectibles Mx"}
              subtitle={"Tienes una duda o propuesta? ponte en contacto."}
              word={""}
              className={""}
            />
          </div>
          {/* overlay */}
          <div className="min-h-[100%] absolute z-[1] min-w-[100%] top-0 left-0 bg-primary" />
        </section>

        <section className="bg-background py-12 px-10 maxmd:px-5 ">
          <div className="w-full flex flex-row maxmd:flex-col justify-center items-start">
            <div className="w-1/2 maxmd:w-full  text-lg text-gray-600 dark:text-gray-300  ">
              <IconListSectionComponent
                mainTitle={"Información de Contacto"}
                textTitleOne={"Números"}
                textTitleTwo={"Manda un mensaje"}
                textTitleThree={"Sucursal Sahuayo"}
                textTwo={"Escríbenos tus dudas"}
                textThree={"Platiquemos en persona"}
                phoneLinkOne={"tel:3322189963"}
                phoneLinkTextOne={"(+52)332-218-9963"}
                linkTwo={"mailto:mxsupercollectibles@gmail.com"}
                linkThree={"https://maps.app.goo.gl/1oD6A45sBwk3PEJS7"}
                linkTwoText={"mxsupercollectibles@gmail.com"}
                textAddressThree={"Av Arcos de Guadalupe 604, R-04"}
                textAddressBThree={"Col. Arcos de Guadalupe"}
                textAddressCThree={"Zapopan Jal 45037"}
                linkThreeText={"Ver en mapa"}
              />
            </div>

            <div className="w-1/2 maxmd:w-full pb-10 pl-5 maxmd:pl-1  flex flex-col justify-start items-start">
              <div className="w-[100%] px-3map-class pt-5">
                <iframe
                  className="border-none  "
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7463.898515534844!2d-103.3831342077016!3d20.712285023435697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428afcb0e3bc80f%3A0x97765dad411eb4dc!2sPlaza%20Patria%2C%20Zapopan%2C%20Jal.!5e0!3m2!1ses-419!2smx!4v1725634818203!5m2!1ses-419!2smx"
                  width="100%"
                  height="450"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        <ContactUsComponent
          contactTitle={"Mándanos un breve mensaje"}
          contactSubTitle={
            "En breve uno de nuestros representantes se comunicara."
          }
        />
      </div>
    </>
  );
};

export default ContactComponent;
