"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-secondary/30 via-background to-secondary/40 px-6 ">
      <motion.div
        className="  flex flex-col gap-10 w-full max-w-4xl mx-auto    md:text-left bg-gradient-to-tr from-[#0088dd] to-[#0064b8] py-6 rounded-t-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex gap-2 items-center justify-center max-w-4xl w-full mx-auto">
          <Image
            src="icon.png"
            alt="logo"
            width={501}
            height={498}
            className="  w-20 "
          />
          <div className="text-white  ">
            <div className="border-white border-b pb-1 w-max pr-3">
              <h5 className="font-normal">Higher Secondary</h5>
              <h4 className="text-2xl font-semibold">Student&apos;s Gala</h4>
            </div>
            <p className="text-sm md:text-base text-white mt-1">
              <span className="font-cooper">SSF</span> Malappuram West District
            </p>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
