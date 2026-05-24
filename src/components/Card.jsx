import React from "react";
import { motion } from "framer-motion";

export default function Card({ children, className = "", delay = 0, hoverable = true }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: delay
      }
    }
  };

  const hoverEffect = hoverable
    ? {
        y: -6,
        scale: 1.015,
        boxShadow: "0 20px 25px -5px rgba(92, 61, 46, 0.08), 0 10px 10px -5px rgba(92, 61, 46, 0.04)",
        borderColor: "rgba(169, 132, 103, 0.4)",
        transition: { type: "spring", stiffness: 400, damping: 20 }
      }
    : {};

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      whileHover={hoverEffect}
      variants={cardVariants}
      className={`glass-card border border-coffee/5 p-6 rounded-3xl shadow-sm transition-colors duration-300 hover:bg-cream-light/80 ${className}`}
    >
      {children}
    </motion.div>
  );
}
