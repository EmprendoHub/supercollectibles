import React from "react";
import Link from "next/link";
import MobileMenuComponent from "./MobileMenuComponent";

const CustomLink = ({
  href,
  title,
  className = "",
}: {
  href: string;
  title: string;
  className: string;
}) => {
  return (
    <Link href={href} className={`${className} relative group`}>
      <span
        className={`h-[1px] inline-block bg-gradient-to-r from-white to-green-300 group-hover:w-full transition-[width] ease duration-300 absolute left-0 top-0 w-0`}
      >
        &nbsp;
      </span>
      <span className="pb-5">{title}</span>
      <span
        className={`h-[1px] inline-block bg-gradient-to-r from-white to-green-300 group-hover:w-full transition-[width] ease duration-300 absolute left-0 bottom-0 w-0`}
      >
        &nbsp;
      </span>
    </Link>
  );
};

const MainMenuComponent = ({ className }: { className: string }) => {
  return (
    <nav className={`${className} menu-class bg-blue-950`}>
      {/*Mobile Navigation*/}
      <MobileMenuComponent />
      {/* Navigation*/}
      <nav className="maxsm:hidden m-0 flex flex-row py-2.5 px-5 items-center justify-center gap-x-16 maxmd:gap-x-5 text-base maxmd:text-sm font-ubuntu font-light tracking-[4px] maxmd:tracking-wide text-white no-underline uppercase">
        <CustomLink href={`/`} title={"Inicio"} className={""} />
        <CustomLink href={`/medicos`} title={"medicos"} className={""} />
        <CustomLink
          href={`/especialidades`}
          title={"especialidades"}
          className={""}
        />
        <CustomLink href={`/servicios`} title={"Servicios"} className={""} />
        <CustomLink href={`/acerca`} title={"acerca"} className="uppercase  " />
        <CustomLink href={`/contacto`} title={"contacto"} className={""} />
      </nav>
    </nav>
  );
};

export default MainMenuComponent;
