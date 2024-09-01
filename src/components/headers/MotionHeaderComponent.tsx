"use client";
import React, { useState } from "react";
import MainMenuComponent from "./MainMenuComponent";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import LogoComponent from "../layouts/LogoComponent";
import Link from "next/link";
import { BsFacebook, BsInstagram, BsWhatsapp } from "react-icons/bs";
import { ModeToggle } from "../ui/mode-toggle";
import { FaWhatsappSquare } from "react-icons/fa";

const MotionHeaderComponent = () => {
  const [hidden, setHidden] = useState(true);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous: any = scrollY.getPrevious();
    if (latest > previous && latest > 300) {
      setHidden(false);
    } else {
      setHidden(true);
    }
  });

  return (
    <motion.div
      variants={{ hidden: { y: 0 }, visible: { y: "-100%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="header-class bg-black text-slate-100 shadow-sm text-xl sticky top-0 z-[50]  w-full mx-auto"
    >
      <div className="w-full flex flex-row justify-between items-center maxlg:px-20 maxmd:px-5  px-32 py-2">
        {/* Logo  */}
        <div className=" object-contain justify-center">
          <LogoComponent className="w-[100px]" />
        </div>
        <div className="flex fle-row items-center justify-center gap-x-4">
          <div className="flex items-center justify-center gap-x-4">
            <ModeToggle />
            <motion.a
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              href="https://www.instagram.com/cme.shy/"
              target="_blank"
            >
              <span className="socialLink">
                <BsInstagram className="text-lg maxsm:text-base" />
              </span>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              href="https://www.facebook.com/Hospital-Central-Medica-De-Especialidades-100067982783316/"
              target="_blank"
            >
              <span className="socialLink">
                <BsFacebook className="text-lg maxsm:text-base" />
              </span>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              href="tel:3535322847"
              target="_blank"
            >
              <span className="socialLink">
                <BsWhatsapp className="text-lg maxsm:text-base" />
              </span>
            </motion.a>
          </div>
        </div>
      </div>
      <MainMenuComponent
        className={
          "relative self-stretch flex flex-row items-center justify-center py-3 mx-auto pl-5 maxsm:pl-1  px-20 maxmd:px-2"
        }
      />
    </motion.div>
  );
};

export default MotionHeaderComponent;
