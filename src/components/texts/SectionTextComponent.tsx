"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const SectionTextComponent = ({
  title,
  paraOne,
  paraTwo = "",
  btnText = "Catalog",
  btnUrl = "/catalog",
}: {
  title: string;
  paraOne: string;
  paraTwo: string;
  btnText: string;
  btnUrl: string;
}) => {
  return (
    <div className="mx-auto">
      <div className="flex h-full flex-col gap-y-6 justify-center">
        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-5xl lg:text-2xl font-bold font-raleway text-blueDark uppercase tracking-widest "
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-base font-poppins text-gray-700"
        >
          {paraOne}
        </motion.p>
        <motion.p
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="text-base font-poppins text-gray-700"
        >
          {paraTwo}
        </motion.p>
        {/* button */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex gap-x-4 mt-2 justify-center"
        >
          <Link href={btnUrl}>
            <p className="py-3 px-8 rounded-full bg-greenLight text-white hover:bg-background hover:text-white duration-700 text-sm uppercase font-semibold w-full">
              {btnText}
            </p>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default SectionTextComponent;
