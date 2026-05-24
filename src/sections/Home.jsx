import React from "react";
import { motion } from "framer-motion";
import { Download, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

export default function Home({ profileData }) {
  const { name, tagline, subTagline, profileImage, resumeUrl } = profileData || {};

  const handleResumeDownload = () => {
    // Trigger confetti celebrating candidate discovery!
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.8 },
      colors: ["#5C3D2E", "#A98467", "#E8D8CE", "#F5EFEB"]
    });
  };

  const handleContactScroll = () => {
    const el = document.getElementById("contact");
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section id="home" className="min-h-[92vh] flex items-center justify-center py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
        
        {/* Texts */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1"
        >
          {/* Welcome Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-latte/40 border border-coffee/5 text-coffee font-medium text-xs tracking-wider uppercase mb-6 shadow-sm">
            ⚡ Welcome to my portfolio
          </div>

          {/* Heading */}
          <h1 className="font-serif font-bold text-coffee text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] mb-6">
            Hi, I am <span className="text-gradient font-extrabold">{name || "Siddharth Sharma"}</span>
          </h1>

          {/* Professional Tagline */}
          <h2 className="font-sans font-semibold text-coffee/90 text-lg sm:text-xl md:text-2xl mb-4 max-w-xl">
            {tagline || "Electronics & Communication Engineering Undergraduate"}
          </h2>

          {/* Subtext */}
          <p className="font-sans font-light text-coffee-light text-base md:text-lg leading-relaxed mb-8 max-w-xl">
            {subTagline || "Designing reliable hardware architectures, programming low-level microcontrollers, and deploying scalable IoT monitoring grids."}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a
              href={resumeUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleResumeDownload}
              className="inline-flex items-center justify-center gap-2 bg-gradient-coffee text-cream-light font-medium py-3 px-7 rounded-full shadow-md hover:shadow-lg hover:bg-coffee-dark transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <Download size={18} />
              Download Resume
            </a>
            <button
              onClick={handleContactScroll}
              className="inline-flex items-center justify-center gap-2 border border-coffee/20 bg-cream/30 text-coffee font-semibold py-3 px-7 rounded-full hover:bg-latte/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-sm"
            >
              Contact Me
              <ArrowRight size={18} className="text-coffee-light" />
            </button>
          </div>
        </motion.div>

        {/* ECE Profile Image Layout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="lg:col-span-5 flex justify-center order-1 lg:order-2"
        >
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96">
            
            {/* Background rotating gears / orbital traces */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-latte/50 animate-spin-slow" />
            <div className="absolute inset-4 rounded-full border border-coffee/5 animate-pulse-slow" />

            {/* Glowing coffee-beige backplate */}
            <div className="absolute inset-6 rounded-full bg-gradient-accent opacity-30 blur-2xl animate-pulse" />

            {/* Beautiful visual layout of profile image */}
            <div className="absolute inset-8 rounded-full border border-coffee/10 p-2 bg-cream-light/60 backdrop-blur-sm shadow-inner flex items-center justify-center overflow-hidden animate-float">
              <img
                src={profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80"}
                alt={name || "Siddharth Sharma"}
                className="w-full h-full object-cover rounded-full select-none"
              />
            </div>
            
            {/* Embedded Microchip Overlay Badge */}
            <div className="absolute bottom-6 right-6 bg-cream border border-coffee/15 shadow-md px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5 animate-float delay-1000">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
              <span className="font-mono text-xs font-semibold text-coffee tracking-wider">STM32_ACTIVE</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
