"use client";
import React, { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import WhiteLogoComponent from "../layouts/WhiteLogoComponent";

const navLinks = [
  { title: "Inicio", url: "/" },
  { title: "Tienda", url: "/tienda" },
  { title: "Nosotros", url: "/acerca" },
  { title: "Contacto", url: "/contacto" },
  { title: "Ayuda", url: "/ayuda" },
];

const MobileMenuComponent = () => {
  const [open, setOpen] = useState(false);
  const toggleMobileMenu = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const menuVariants = {
    initial: {
      x: "-100%",
    },
    animate: {
      x: "-10%",
      transition: {
        duration: 0.5,
        ease: [0.12, 0, 0.39, 0],
      },
    },
    exit: {
      x: "-100%",
      transition: {
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
          <>
            {/* Blurred Overlay */}
            <motion.div
              onClick={toggleMobileMenu}
              className="fixed inset-0 z-[998] bg-black bg-opacity-50 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
            <motion.div
              variants={menuVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed z-[999] left-0 top-0 w-full min-h-screen bg-background text-white p-10  origin-top"
            >
              <div className="flex h-full flex-col place-items-center ">
                <div onClick={toggleMobileMenu}>
                  <WhiteLogoComponent className="w-[100px] mb-5" />
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileMenuComponent;

const mobileNavLinksVariants = {
  initial: {
    x: "-100%",
    transition: {
      duration: 0.5,
      ease: [0.37, 0, 0.63, 1],
    },
  },
  open: {
    x: 0,
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
      className="text-2xl uppercase text-foreground"
    >
      <Link href={href} onClick={toggleMobileMenu}>
        {title}
      </Link>
    </motion.div>
  );
};
