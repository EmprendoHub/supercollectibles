"use client";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const ColFooterTextComponent = ({
  pretitle,
  title,
  subtitle,
  btnText,
  btnUrl = "/catalog",
}: {
  pretitle: string;
  title: string;
  subtitle: string;
  btnText: string;
  btnUrl: string;
}) => {
  return (
    <div>
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-lg  maxsm:text-sm tracking-normal uppercase"
      >
        {pretitle}
      </motion.p>
      <motion.h2
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="text-2xl text-greenLight maxsm:text-xl tracking-normal uppercase"
      >
        {title}{" "}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-lg maxmd:text-sm pt-2 tracking-widest text-gray-500"
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9 }}
        className="py-10"
      >
        <Link
          href={btnUrl}
          className="pt-3 uppercase text-lg rounded-full px-6 py-3 bg-greenLight drop-shadow-sm text-white duration-300"
        >
          {btnText}
        </Link>
      </motion.div>
    </div>
  );
};

export default ColFooterTextComponent;
