"use client";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const ColTextColorComponent = ({
  pretitle,
  title,
  subtitle,
  btnText,
  btnUrl = "/contacto",
  addressOne,
  addressTwo,
  tel,
  email,
}: {
  pretitle: string;
  title: string;
  subtitle: string;
  btnText: string;
  btnUrl: string;
  addressOne: string;
  addressTwo: string;
  tel: string;
  email: string;
}) => {
  return (
    <div>
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-xl text-white maxsm:text-md tracking-widest uppercase"
      >
        {pretitle}
      </motion.p>
      <motion.h2
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="text-6xl text-blueLight maxsm:text-4xl font-raleway font-black tracking-normal uppercase"
      >
        {title}{" "}
      </motion.h2>
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-md maxmd:text-sm pt-3 tracking-widest "
      >
        {subtitle}
      </motion.p>
      <motion.ul
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9 }}
        className="text-lg  maxmd:text-md maxsm:text-sm pt-3 tracking-widest "
      >
        <li>{addressOne}</li>
        <li>{addressTwo}</li>
        <li>{tel}</li>
        <li>{email}</li>
      </motion.ul>
      {btnText && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="py-10"
        >
          <Link
            href={btnUrl}
            className="pt-3 uppercase text-lg rounded-full px-6 py-3 bg-greenLight drop-shadow-sm text-white duration-300"
          >
            {btnText}
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default ColTextColorComponent;
