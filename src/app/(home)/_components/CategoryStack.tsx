"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const CategoryStack = () => {
  return (
    <div
      className={`maxmd:w-full maxlg:w-[80%] w-[70%] h-auto relative flex flex-col justify-center items-center mt-10 mx-auto overflow-x-hidden`}
    >
      <div className="w-full h-20 absolute z-0 -top-10 bg-gradient-to-t from-black via-black to-black/30 blur-sm" />
      <div className="w-full h-20 absolute z-0 -top-5 bg-gradient-to-b from-black via-black to-black/30 blur-sm" />

      {/* Updated Image Component */}
      <div className="flex px-2 gap-3 flex-col items-center justify-center w-full h-auto z-[1]">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9 }}
          className="relative w-full h-auto "
        >
          <Image
            alt="Super Collectibles Mx"
            src="/covers/Group3.webp"
            width={1920}
            height={400}
            className="object-cover rounded-[5px]"
          />
        </motion.div>

        <div className="flex maxsm:flex-col relative gap-3 items-center justify-center w-full h-full">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full h-auto "
          >
            <Image
              alt="Super Collectibles Mx"
              src="/covers/Group1.webp"
              width={1920}
              height={400}
              className="object-cover rounded-[5px]"
            />
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full h-auto"
          >
            <Image
              alt="Super Collectibles Mx"
              src="/covers/Group2.webp"
              width={1920}
              height={400}
              className="object-cover rounded-[5px]"
            />
          </motion.div>
        </div>
        <div className="flex maxsm:flex-col relative gap-3 items-center justify-center w-full h-full">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="relative w-full h-30"
          >
            <Image
              alt="Super Collectibles Mx"
              src="/covers/Group4.webp"
              width={1920}
              height={400}
              className="object-cover rounded-[5px]"
            />
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="relative w-full h-30"
          >
            <Image
              alt="Super Collectibles Mx"
              src="/covers/Group5.webp"
              width={1920}
              height={400}
              className="object-cover rounded-[5px]"
            />
          </motion.div>
        </div>
        <div className="flex maxsm:flex-col relative gap-3 items-center justify-center w-full h-full">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="relative w-full h-30"
          >
            <Image
              alt="Super Collectibles Mx"
              src="/covers/Group6.webp"
              width={1920}
              height={400}
              quality={100}
              className="object-cover  rounded-[5px]"
            />
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="relative w-full h-30"
          >
            <Image
              alt="Super Collectibles Mx"
              src="/covers/Group7.webp"
              width={1920}
              height={400}
              quality={100}
              className="object-cover rounded-[5px]"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CategoryStack;
