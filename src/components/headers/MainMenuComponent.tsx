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
        className={`h-[1px] inline-block bg-gradient-to-r from-stone-900 to-red-500 group-hover:w-full transition-[width] ease duration-300 absolute left-0 top-0 w-0`}
      >
        &nbsp;
      </span>
      <span className="pb-5">{title}</span>
      <span
        className={`h-[1px] inline-block bg-gradient-to-r from-stone-900 to-red-500 group-hover:w-full transition-[width] ease duration-300 absolute left-0 bottom-0 w-0`}
      >
        &nbsp;
      </span>
    </Link>
  );
};

const MainMenuComponent = ({ className }: { className: string }) => {
  return (
    <nav className={`${className} menu-class bg-primary`}>
      {/*Mobile Navigation*/}
      <MobileMenuComponent />
      {/* Navigation*/}
      <nav className="maxsm:hidden m-0 flex flex-row px-5 items-center justify-center gap-x-16 maxmd:gap-x-5 text-xs font-ubuntu font-light tracking-[4px] maxmd:tracking-wide text-white no-underline uppercase">
        <CustomLink href={`/`} title={"Inicio"} className={""} />

        <CustomLink href={`/tienda`} title={"Tienda"} className={""} />
        <CustomLink
          href={`/acerca`}
          title={"nosotros"}
          className="uppercase  "
        />
        <CustomLink href={`/contacto`} title={"contacto"} className={""} />
      </nav>
    </nav>
  );
};

export default MainMenuComponent;
