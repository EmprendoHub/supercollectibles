import React from "react";
import BoxesSectionTitle from "@/components/texts/BoxesSectionTitle";
import Image from "next/image";
import EmailForm from "./EmailForm";
import { getCookiesName } from "@/backend/helpers";
import { cookies } from "next/headers";
import GoogleCaptchaWrapper from "@/components/layouts/GoogleCaptchaWrapper";

const ContactUsComponent = ({
  contactTitle,
  contactSubTitle,
}: {
  contactTitle: string;
  contactSubTitle: string;
}) => {
  //set cookies
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  const nextAuthSessionToken = nextCookies.get(cookieName);
  const cookie = `${cookieName}=${nextAuthSessionToken?.value}`;
  return (
    <div className="flex flex-row maxmd:flex-col py-20 w-[90%] justify-center items-center mx-auto">
      <div className="w-full maxmd:w-full z-10  maxmd:px-5 maxsm:px-1">
        <div className=" pb-20 w-full">
          <h2>
            <BoxesSectionTitle
              className="mb-5 text-xl text-black"
              title={contactTitle}
              subtitle={contactSubTitle}
            />
          </h2>
          <GoogleCaptchaWrapper>
            <EmailForm cookie={cookie} />
          </GoogleCaptchaWrapper>
        </div>
      </div>
      <div className="w-1/2 maxmd:w-full z-10 justify-center mx-auto items-center flex">
        <Image
          src={"/icons/Coach_purser_example.webp"}
          width={800}
          height={800}
          alt="Contactar al equipo de Global Stoel"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default ContactUsComponent;
