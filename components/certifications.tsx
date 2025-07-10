"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const certifications = [
  {
    title: "Android Development Fundamentals",
    issuer: "Udacity",
    year: "2024",
    image: "/ProjectsImage/certification-1.png",
  },
];

export default function CertificationsSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="my-8 w-full flex justify-center">
      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 text-center">
              Honors & Recognition
            </h2>
            <ul className="flex flex-row flex-wrap gap-x-6 gap-y-6 justify-center items-stretch">
              {certifications.map((cert, idx) => (
                <Dialog
                  key={idx}
                  open={openIdx === idx}
                  onOpenChange={(open) => setOpenIdx(open ? idx : null)}
                >
                  <DialogTrigger asChild>
                    <motion.li
                      className="relative w-[20rem] min-w-[16rem] flex-shrink-0 border border-gray-300 rounded-lg shadow-sm hover:border-yellow-500 transition-all flex flex-col justify-end cursor-pointer h-64 overflow-hidden group"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.15 }}
                      viewport={{ once: true, amount: 0.3 }}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-top transition-transform duration-300 group-hover:scale-105"
                        style={{
                          backgroundImage: `url(${cert.image})`,
                          width: "100%",
                        }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-transparent"></div>
                      <div className="relative bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-transparent z-10 p-4 text-center text-white">
                        <div className="font-semibold text-lg text-yellow-300">
                          {cert.title}
                        </div>
                        <div className="text-gray-200">{cert.issuer}</div>
                        <div className="text-sm text-gray-300">{cert.year}</div>
                      </div>
                    </motion.li>
                  </DialogTrigger>
                  <DialogContent className="flex flex-col items-center max-w-2xl w-full p-8 bg-white text-gray-800">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="max-w-lg w-full rounded shadow-lg border border-gray-300 mb-4"
                    />
                    <div className="font-semibold text-lg text-yellow-600 text-center mb-1">
                      {cert.title}
                    </div>
                    <div className="text-gray-700 text-center mb-1">
                      {cert.issuer}
                    </div>
                    <div className="text-sm text-gray-500 text-center">
                      {cert.year}
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
