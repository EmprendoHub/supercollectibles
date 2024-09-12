"use client";
import React, { useState } from "react";
import MainMenuComponent from "./MainMenuComponent";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import LogoComponent from "../layouts/LogoComponent";
import { BsFacebook, BsInstagram, BsWhatsapp } from "react-icons/bs";
import { ModeToggle } from "../ui/mode-toggle";
import GlobalSearch from "../layouts/GlobalSearch";

const MotionHeaderComponent = () => {
  const [hidden, setHidden] = useState(true);
  const { scrollY } = useScroll();

  // useMotionValueEvent(scrollY, "change", (latest) => {
  //   const previous: any = scrollY.getPrevious();
  //   if (latest > previous && latest > 300) {
  //     setHidden(false);
  //   } else {
  //     setHidden(true);
  //   }
  // });

  return (
    <motion.div
      variants={{ hidden: { y: 0 }, visible: { y: "-100%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="header-class bg-black text-slate-100 shadow-sm text-xl sticky top-0 z-[50]  w-full mx-auto"
    >
      <div className="flex flex-row justify-center items-center w-full py-2 gap-x-3 maxmd:hidden ">
        {/* Logo  */}
        <div className=" object-contain justify-center">
          <LogoComponent className="w-[100px]" />
        </div>
        <GlobalSearch className={""} />
        <div className="flex fle-row items-center justify-center gap-x-4">
          <div className="flex items-center justify-center gap-x-4">
            <ModeToggle />
            <motion.a
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              href="https://www.instagram.com/supercars_jewelry"
              target="_blank"
            >
              <span className="socialLink">
                <BsInstagram className="text-base" />
              </span>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              href="https://www.facebook.com/MxSuperCollectibles"
              target="_blank"
            >
              <span className="socialLink">
                <BsFacebook className="text-base" />
              </span>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              href="tel:332-218-9963"
              target="_blank"
            >
              <span className="socialLink">
                <BsWhatsapp className="text-base" />
              </span>
            </motion.a>
          </div>
        </div>
      </div>
      <MainMenuComponent className={""} />
    </motion.div>
  );
};

export default MotionHeaderComponent;
