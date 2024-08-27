"use client";
import React from "react";
import { motion } from "framer-motion";

const SvgRightMotion = () => {
  return (
    <>
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="w-[45%]  h-[45%]  bg-[#55BECA] bg-opacity-60 rounded-tl-[40%] rounded-br-[40%] absolute bottom-0 z-10"
      ></motion.div>
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-[55%] h-[55%]  bg-[#55BECA] bg-opacity-60 absolute -bottom-5 -right-5 z-[1]"
      ></motion.div>
    </>
  );
};

export default SvgRightMotion;
