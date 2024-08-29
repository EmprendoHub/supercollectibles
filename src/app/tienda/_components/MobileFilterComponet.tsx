"use client";
import styles from "./filterstyle.module.css";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import FilterMenuComponent from "./FilterMenuComponent";
import { CiShare2 } from "react-icons/ci";
import { toast } from "@/components/ui/use-toast";

const MobileFilterComponet = ({
  allBrands,
  allCategories,
}: {
  allBrands: any;
  allCategories: any;
}) => {
  const [isActive, SetIsActive] = useState(false);
  const pathname = usePathname();

  const copyToClipboard = () => {
    const url = location.href;
    navigator.clipboard.writeText(url);
    toast({ title: "El enlace se copió correctamente en su portapapeles." });
  };

  useEffect(() => {
    if (isActive) SetIsActive(false);
    // eslint-disable-next-line
  }, [pathname]);

  return (
    <div className=" w-full mb-5 text-muted">
      <div
        className={`mt-5 p-3 border border-muted rounded-md text-center w-full justify-between flex mx-auto `}
      >
        <div
          className={`${styles.header} burger-class flex flex-row justify-between t items-center w-full`}
        >
          <div
            className="flex flex-row items-center gap-x-2 cursor-pointer"
            onClick={copyToClipboard}
          >
            <CiShare2 className="text-base text-primary" />
          </div>
          <div
            onClick={() => {
              SetIsActive(!isActive);
            }}
            className={`${styles.button} text-xs`}
          >
            Filtrar
            <div
              className={`${styles.burger} ${
                isActive ? styles.burgerActive : ""
              }`}
            ></div>
          </div>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {isActive && (
          <FilterMenuComponent
            allBrands={allBrands}
            allCategories={allCategories}
            SetIsActive={SetIsActive}
            isActive={isActive}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileFilterComponet;
