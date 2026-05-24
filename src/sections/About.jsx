import React from "react";
import { Cpu, Eye, Radio, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Card from "../components/Card";

export default function About({ profileData }) {
  const { aboutText } = profileData || {};

  const specializations = [
    {
      icon: <Cpu className="text-coffee" size={24} />,
      title: "Embedded Firmware",
      desc: "Writing efficient, low-overhead code in Embedded C for ARM Cortex, STM32, and ESP32 architectures."
    },
    {
      icon: <Zap className="text-coffee" size={24} />,
      title: "PCB & Circuit Design",
      desc: "Developing multi-layer schematic layouts, analyzing signal integrity, and fabricating PCBs in Altium Designer."
    },
    {
      icon: <Radio className="text-coffee" size={24} />,
      title: "IoT Systems",
      desc: "Deploying telemetry grids using wireless communication protocols like MQTT, LoRa, and BLE."
    },
    {
      icon: <Eye className="text-coffee" size={24} />,
      title: "DSP & Simulation",
      desc: "Modeling numerical signal filtering systems, analyzing FFT responses, and compiling designs in MATLAB."
    }
  ];

  return (
    <section id="about" className="py-24 px-6 bg-cream/35">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-coffee text-3xl md:text-4xl mb-4">
            About Me
          </h2>
          <div className="w-16 h-1 bg-coffee-light mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Narrative Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <h3 className="font-serif font-semibold text-coffee text-2xl mb-4">
              Bridging Hardware & Software Complexity
            </h3>
            <p className="font-sans font-normal text-coffee/95 text-base leading-relaxed">
              {aboutText || "I am an Electronics and Communication Engineering undergraduate interested in low-level embedded software, PCB layout creation, and digital signal modeling. I love translating block diagrams into physical, operating prototypes."}
            </p>
            <p className="font-sans font-light text-coffee-light text-base leading-relaxed">
              My engineering philosophy revolves around building robust, low-power hardware systems. Whether it is matching trace impedances on a high-speed PCB, optimizing interrupt service routines in MCU firmware, or analyzing sensor frequencies, I enjoy the meticulous challenge of high-performance electronics.
            </p>
          </motion.div>

          {/* Core Focus Specializations */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {specializations.map((spec, idx) => (
              <Card
                key={idx}
                delay={idx * 0.1}
                className="flex flex-col gap-4 text-left border border-latte/20 hover:border-coffee-light/35"
              >
                <div className="w-12 h-12 rounded-2xl bg-latte/50 flex items-center justify-center shadow-sm">
                  {spec.icon}
                </div>
                <div>
                  <h4 className="font-sans font-semibold text-coffee text-lg mb-1.5">
                    {spec.title}
                  </h4>
                  <p className="font-sans font-light text-coffee-light text-sm leading-relaxed">
                    {spec.desc}
                  </p>
                </div>
              </Card>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
