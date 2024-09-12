"use client";
import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { addLocation } from "@/redux/shoppingSlice";
import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";
import { BsFacebook, BsInstagram } from "react-icons/bs";
import { AiFillPhone } from "react-icons/ai";

export default function LocationConcent() {
  const APIkey = "Enter-your-api-key";

  const [userLocation, setUserLocation] = useState<string | any>(null);
  const [ipAddress, setIpAddress] = useState("");
  console.log(userLocation);
  const getLocation = async () => {
    const location = await axios.get("https://ipapi.co/json");
    setUserLocation(location.data);
    addLocation(location.data);
  };

  // get user IP address
  async function getIpAddress() {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      setIpAddress(data.ip);
      console.log(data.ip);
    } catch (error) {
      console.error(error);
    }
  }

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos: any) {
    var crd = pos.coords;
    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);

    getIpAddress();
    getLocation();
  }

  function errors(err: any) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          console.log(result);
          if (result.state === "granted") {
            //If granted then you can directly call your function here
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "prompt") {
            //If prompt then the user will be asked to give permission
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "denied") {
            //If denied then you have to show instructions to enable location
          }
        });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
    //eslint-disable-next-line
  }, []);

  return (
    <div className="flex items-start maxmd:justify-between maxmd:mt-2 maxmd:w-full ">
      <span className="w-full maxsm:w-fit flex flex-row gap-x-1 items-center cursor-pointer text-[13px]">
        <MapPin size={20} />
        {userLocation ? userLocation.postal : "Ingresa tu ubicacion"}
      </span>
      {/* Contact Links */}
      <div className="w-full flex fle-row items-center justify-end gap-x-2 text-[14px] minmd:hidden">
        <Link
          href={"tel:3322189963"}
          className=" flex flex-row justify-between items-center gap-x-2 cursor-pointer"
        >
          <span>
            <AiFillPhone
              size={24}
              className="border border-white rounded-full p-0.5"
            />
          </span>
          <span>332-218-9963</span>
        </Link>
        <Link
          href={"tel:3322189963"}
          className="maxmd:hidden flex flex-row justify-between items-center gap-x-2 cursor-pointer"
        >
          <span>332-218-9963</span>
        </Link>
        <div className="flex items-center gap-x-4">
          <motion.a
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            href="https://www.instagram.com/supercars_jewelry"
            target="_blank"
          >
            <span className="socialLink">
              <BsInstagram size={20} />
            </span>
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            href="https://www.facebook.com/MxSuperCollectibles"
            target="_blank"
          >
            <span className="socialLink">
              <BsFacebook size={20} />
            </span>
          </motion.a>
        </div>
      </div>
    </div>
  );
}
