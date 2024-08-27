"use client";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const SectionTextColorComponent = ({
  pretitle,
  title,
  subtitle,
  btnText,
  btnUrl = "/servicios",
  className,
}: {
  pretitle: string;
  title: string;
  subtitle: string;
  btnText: string;
  btnUrl: string;
  className: string;
}) => {
  return (
    <div className="text-center">
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-base text-greenLight maxsm:text-sm tracking-widest uppercase"
      >
        {pretitle}
      </motion.p>
      <motion.h2
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="text-6xl text-blueDark maxmd:text-4xl font-raleway font-black tracking-normal uppercase"
      >
        {title}{" "}
      </motion.h2>
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-lg maxmd:text-sm pt-3 tracking-widest text-blueDark"
      >
        {subtitle}
      </motion.p>
      {btnText && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9 }}
          className="py-5"
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

export default SectionTextColorComponent;
