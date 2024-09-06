"use client";
import React, { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import WhiteLogoComponent from "../layouts/WhiteLogoComponent";
import { BsFacebook, BsInstagram } from "react-icons/bs";
import { AiFillPhone } from "react-icons/ai";

const navLinks = [
  { title: "Inicio", url: "/" },
  { title: "Tienda", url: "/tienda" },
  { title: "Nosotros", url: "/acerca" },
  { title: "Contacto", url: "/contacto" },
  { title: "Vender", url: "/vender" },
  { title: "Ayuda", url: "/ayuda" },
];

const MobileMenuComponent = () => {
  const [open, setOpen] = useState(false);
  const toggleMobileMenu = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const menuVariants = {
    initial: {
      scaleY: 0,
    },
    animate: {
      scaleY: 1,
      transition: {
        duration: 0.5,
        ease: [0.12, 0, 0.39, 0],
      },
    },
    exit: {
      scaleY: 0,
      transition: {
        delay: 0.5,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const containerVariants = {
    initial: {
      transition: {
        staggerChildren: 0.09,
        staggerDirection: -1,
      },
    },
    open: {
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.09,
        staggerDirection: 1,
      },
    },
  };

  return (
    <>
      <nav>
        {/*Mobile Navigation*/}
        <div
          onClick={toggleMobileMenu}
          className="hidden maxmd:flex maxmd:flex-row items-center justify-center gap-x-2 text-white cursor-pointer text-sm"
        >
          <AiOutlineMenu size={18} />
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            variants={menuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed z-[999] left-0 top-0 w-full min-h-screen bg-background text-white p-10  origin-top"
          >
            <div className="flex h-full flex-col">
              <div className="flex  h-full justify-between items-center pb-5">
                <WhiteLogoComponent className="w-[80px]" />
                <p
                  onClick={toggleMobileMenu}
                  className="cursor-pointer text-md text-white"
                >
                  <AiOutlineClose />
                </p>
              </div>
              <motion.div
                variants={containerVariants}
                initial="initial"
                animate="open"
                exit="initial"
                className="flex flex-col h-full justify-center font-raleway font-black tracking-wider items-center gap-y-10"
              >
                {navLinks?.map((link, index) => {
                  return (
                    <div key={index} className="overflow-hidden">
                      <MobileNavLink
                        title={link.title}
                        href={link.url}
                        toggleMobileMenu={toggleMobileMenu}
                      />
                    </div>
                  );
                })}
              </motion.div>
            </div>
            {/* Contact Links */}
            <div className="flex fle-row items-center justify-center gap-x-4 pt-10">
              <Link
                href={"tel:3322189963"}
                className=" flex flex-row justify-between items-center gap-x-2 cursor-pointer"
              >
                <span>
                  <AiFillPhone className="text-2xl maxsm:text-base text-greenLight border border-white rounded-full p-1 h-8 maxsm:h-5 w-8 maxsm:w-5 " />{" "}
                </span>
                <span className="text-base maxsm:text-sm">332-218-9963</span>
              </Link>
              <Link
                href={"tel:3322189963"}
                className="maxmd:hidden flex flex-row justify-between items-center gap-x-2 cursor-pointer"
              >
                <span className="text-base">332-218-9963</span>
              </Link>
              <div className="flex items-center gap-x-4">
                <motion.a
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  href="https://www.instagram.com/cme.shy/"
                  target="_blank"
                >
                  <span className="socialLink">
                    <BsInstagram className="text-2xl maxsm:text-base" />
                  </span>
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  href="https://www.facebook.com/Hospital-Central-Medica-De-Especialidades-100067982783316/"
                  target="_blank"
                >
                  <span className="socialLink">
                    <BsFacebook className="text-xl maxsm:text-base" />
                  </span>
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileMenuComponent;

const mobileNavLinksVariants = {
  initial: {
    y: "30vh",
    transition: {
      duration: 0.5,
      ease: [0.37, 0, 0.63, 1],
    },
  },
  open: {
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0, 0.35, 0.45, 1],
    },
  },
};

const MobileNavLink = ({
  title,
  href,
  toggleMobileMenu,
}: {
  title: string;
  href: string;
  toggleMobileMenu: any;
}) => {
  return (
    <motion.div
      variants={mobileNavLinksVariants}
      className="text-4xl uppercase"
    >
      <Link href={href} onClick={toggleMobileMenu}>
        {title}
      </Link>
    </motion.div>
  );
};
