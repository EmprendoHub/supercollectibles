"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import WhiteLogoComponent from "./WhiteLogoComponent";

const FooterMenu = () => {
  return (
    <div className="w-full bg-gradient-to-b from-blue-900 to-blue-950 text-gray-100 px-20 maxmd:px-5 py-24 grid xsm:grid-cols-1 maxmd:grid-cols-2 grid-cols-4 gap-10">
      <div className=" flex flex-col justify-start">
        <p className="text-lg">{"Central Médica de Especialidades"}</p>
        <strong>Ubicación:</strong>
        <span className="flex flex-row items-center  text-sm">
          <p className="">{" Carretera Nacional Sur SN, Centro Uno"}</p>
        </span>
        <span className=" text-sm mt-1">
          <p className="">{" 59000 Sahuayo de Morelos, Mich."}</p>
        </span>
        <strong className="mt-2">Teléfonos:</strong>
        <Link
          href={"tel:3535322847"}
          className="flex flex-row items-center text-sm "
        >
          <p className="tracking-widest">{"353 532 2847"}</p>
        </Link>
        <Link
          href={"tel:3535323443"}
          className="flex flex-row items-center text-sm mt-1"
        >
          <p className="tracking-widest">{"353 532 3443"}</p>
        </Link>
        <Link
          href={"tel:3535324691"}
          className="flex flex-row items-center text-sm mt-1"
        >
          <p className=" tracking-widest">{"353 532 4691"}</p>
        </Link>
        <strong className="mt-2">Fax:</strong>
        <span className="flex flex-row items-center text-sm">
          <p className="text-sm tracking-widest">{"353 532 3443"}</p>
        </span>
        <strong className="mt-2">Farmacia:</strong>
        <Link
          href={"tel:3535323421"}
          className="flex flex-row items-center text-sm "
        >
          <p className=" tracking-widest">{"353 532 3421"}</p>
        </Link>
      </div>
      <div>
        <p className="text-lg">{"Atención al paciente"}</p>
        <ul className="text-base font-light mt-2 flex flex-col gap-y-2">
          <Link href={`/`}>
            <motion.li
              whileHover={{ y: -4 }}
              whileTap={{ y: 1 }}
              transition={{ duration: 0.15 }}
              className="hover:text-greenLight cursor-pointer duration-200"
            >
              {"Encuentra un Medico"}
            </motion.li>
          </Link>
          <Link href={`/`}>
            <motion.li
              whileHover={{ y: -4 }}
              whileTap={{ y: 1 }}
              transition={{ duration: 0.15 }}
              className="hover:text-greenLight cursor-pointer duration-200"
            >
              {"Procedimientos Medicos"}
            </motion.li>
          </Link>
          <Link href={`/`}>
            <motion.li
              whileHover={{ y: -4 }}
              whileTap={{ y: 1 }}
              transition={{ duration: 0.15 }}
              className="hover:text-greenLight cursor-pointer duration-200"
            >
              {"Testimonios de Pacientes"}
            </motion.li>
          </Link>
          <Link href={`/`}>
            <motion.li
              whileHover={{ y: -4 }}
              whileTap={{ y: 1 }}
              transition={{ duration: 0.15 }}
              className="hover:text-greenLight cursor-pointer duration-200"
            >
              {"Ubicación"}
            </motion.li>
          </Link>
          <Link href={`/`}>
            <motion.li
              whileHover={{ y: -4 }}
              whileTap={{ y: 1 }}
              transition={{ duration: 0.15 }}
              className="hover:text-greenLight cursor-pointer duration-200"
            >
              {"Area de Pediatría"}
            </motion.li>
          </Link>
          <Link href={`/`}>
            <motion.li
              whileHover={{ y: -4 }}
              whileTap={{ y: 1 }}
              transition={{ duration: 0.15 }}
              className="hover:text-greenLight cursor-pointer duration-200"
            >
              {"Area de Neonatología"}
            </motion.li>
          </Link>
        </ul>
      </div>
      <div>
        <p className="text-lg">{"Servicios Medicos"}</p>
        <ul className="text-base font-light mt-2 flex flex-col gap-y-2">
          <Link href={`/`}>
            <motion.li
              whileHover={{ y: -4 }}
              whileTap={{ y: 1 }}
              transition={{ duration: 0.15 }}
              className="hover:text-greenLight cursor-pointer duration-200"
            >
              {"Hospitalización"}
            </motion.li>
          </Link>
          <Link href={`/`}>
            <motion.li
              whileHover={{ y: -4 }}
              whileTap={{ y: 1 }}
              transition={{ duration: 0.15 }}
              className="hover:text-greenLight  cursor-pointer duration-200"
            >
              {"Endoscopia"}
            </motion.li>
          </Link>
          <Link href={`/`}>
            <motion.li
              whileHover={{ y: -4 }}
              whileTap={{ y: 1 }}
              transition={{ duration: 0.15 }}
              className="hover:text-greenLight  cursor-pointer duration-200"
            >
              {"Tomografía"}
            </motion.li>
          </Link>
          <Link href={`/`}>
            <motion.li
              whileHover={{ y: -4 }}
              whileTap={{ y: 1 }}
              transition={{ duration: 0.15 }}
              className="hover:text-greenLight  cursor-pointer duration-200"
            >
              {"Estudios de Rayos X"}
            </motion.li>
          </Link>
          <Link href={`/`}>
            <motion.li
              whileHover={{ y: -4 }}
              whileTap={{ y: 1 }}
              transition={{ duration: 0.15 }}
              className="hover:text-greenLight  cursor-pointer duration-200"
            >
              {"Ultrasonido"}
            </motion.li>
          </Link>
          <Link href={`/`}>
            <motion.li
              whileHover={{ y: -4 }}
              whileTap={{ y: 1 }}
              transition={{ duration: 0.15 }}
              className="hover:text-greenLight  cursor-pointer duration-200"
            >
              {"Urgencias"}
            </motion.li>
          </Link>
          <Link href={`/`}>
            <motion.li
              whileHover={{ y: -4 }}
              whileTap={{ y: 1 }}
              transition={{ duration: 0.15 }}
              className="hover:text-greenLight  cursor-pointer duration-200"
            >
              {"Hemodiálisis"}
            </motion.li>
          </Link>
          <Link href={`/`}>
            <motion.li
              whileHover={{ y: -4 }}
              whileTap={{ y: 1 }}
              transition={{ duration: 0.15 }}
              className="hover:text-greenLight  cursor-pointer duration-200"
            >
              {"Laboratorio"}
            </motion.li>
          </Link>
        </ul>
      </div>
      <div>
        <p className="text-lg mb-2"> {"Corporativo"}</p>
        <ul className="text-base font-light mt-2 flex flex-col gap-y-2">
          <Link href={`/terminos`}>
            <motion.li
              whileHover={{ y: -4 }}
              whileTap={{ y: 1 }}
              transition={{ duration: 0.15 }}
              className="hover:text-greenLight  cursor-pointer duration-200"
            >
              {"Términos de Uso"}
            </motion.li>
          </Link>
          <Link href={`/politica-privacidad`}>
            <motion.li
              whileHover={{ y: -4 }}
              whileTap={{ y: 1 }}
              transition={{ duration: 0.15 }}
              className="hover:text-greenLight cursor-pointer duration-200"
            >
              {"Política de Privacidad"}
            </motion.li>
          </Link>
          <Link href={`/vision`}>
            <motion.li
              whileHover={{ y: -4 }}
              whileTap={{ y: 1 }}
              transition={{ duration: 0.15 }}
              className="hover:text-greenLight cursor-pointer duration-200"
            >
              {"Vision General"}
            </motion.li>
          </Link>
          <Link href={`/contacto`}>
            <motion.li
              whileHover={{ y: -4 }}
              whileTap={{ y: 1 }}
              transition={{ duration: 0.15 }}
              className="hover:text-greenLight cursor-pointer duration-200"
            >
              {"Contacto"}
            </motion.li>
          </Link>
          <Link href={`/acerca`}>
            <motion.li
              whileHover={{ y: -4 }}
              whileTap={{ y: 1 }}
              transition={{ duration: 0.15 }}
              className="hover:text-greenLight cursor-pointer duration-200"
            >
              {"Acerca de"}
            </motion.li>
          </Link>
          <WhiteLogoComponent />
        </ul>
      </div>
    </div>
  );
};

export default FooterMenu;
