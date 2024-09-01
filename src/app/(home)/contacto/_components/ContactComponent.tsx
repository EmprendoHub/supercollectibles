import React from "react";
import ContactUsComponent from "./ContactUsComponent";
import IconListSectionComponent from "./IconListSectionComponent";
import HeroColTextComponent from "@/components/texts/HeroColTextComponent";

const ContactComponent = () => {
  return (
    <>
      <div>
        <section className="relative min-h-[700px] flex flex-row maxsm:flex-col justify-center items-center  bg-background text-foreground">
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
          <div className="min-h-[100%] absolute z-[1] min-w-[100%] top-0 left-0 bg-black bg-opacity-40" />
        </section>

        <section className="bg-card py-12 px-20 maxmd:px-5 ">
          <div className="w-full flex flex-row maxmd:flex-col justify-center items-start">
            <div className="w-1/3 maxmd:w-full  text-lg text-muted ">
              <IconListSectionComponent
                mainTitle={"Información de Contacto"}
                textTitleOne={"Números"}
                textTitleTwo={"Manda un mensaje"}
                textTitleThree={"Sucursal Sahuayo"}
                textTwo={"Escríbenos tus dudas"}
                textThree={"Platiquemos en persona"}
                phoneLinkOne={"tel:3532464146"}
                phoneLinkTextOne={"(+52)353-246-4146"}
                linkTwo={"mailto:mxsupercollectibles@gmail.com"}
                linkThree={"https://maps.app.goo.gl/8122sB7xggByVweT8"}
                linkTwoText={"mxsupercollectibles@gmail.com"}
                textAddressThree={"Calle Via Láctea 715"}
                textAddressBThree={"Col. La Gloria del Colli"}
                textAddressCThree={"Zapopan, Jalisco  45010"}
                linkThreeText={"Ver en mapa"}
              />
            </div>

            <div className="w-2/3 maxmd:w-full pb-10 pl-5 maxmd:pl-1  flex flex-col justify-start items-start">
              <div className="w-[100%] px-3map-class pt-5">
                <iframe
                  className="border-none  rounded-xl"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3734.524914504522!2d-100.43439992149202!3d20.607450352989762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d35aa2df5bee21%3A0xf672fc00850bd530!2s2%20de%20Abril%20305%2C%20Felipe%20Carrillo%20Puerto%2C%2076138%20Santiago%20de%20Quer%C3%A9taro%2C%20Qro.!5e0!3m2!1ses-419!2smx!4v1712712012822!5m2!1ses-419!2smx"
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
