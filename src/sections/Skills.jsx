import React from "react";
import { motion } from "framer-motion";
import Card from "../components/Card";

export default function Skills({ skillsData }) {
  const categories = skillsData || [];

  return (
    <section id="skills" className="py-24 px-6 bg-cream/35">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-coffee text-3xl md:text-4xl mb-4">
            Technical Skills
          </h2>
          <div className="w-16 h-1 bg-coffee-light mx-auto rounded-full" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, idx) => (
            <Card
              key={cat.id || idx}
              delay={idx * 0.1}
              hoverable={false}
              className="border border-latte/30 text-left bg-cream-light/40"
            >
              {/* Category Header */}
              <h3 className="font-serif font-bold text-coffee text-xl mb-6 pb-2 border-b border-latte/40">
                {cat.category}
              </h3>

              {/* Skills Progress Grid */}
              <div className="space-y-5">
                {cat.items.map((skill, sIdx) => (
                  <div key={sIdx} className="space-y-1.5">
                    
                    {/* Label & Score */}
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-sans font-semibold text-coffee/90">
                        {skill.name}
                      </span>
                      <span className="font-mono font-medium text-coffee-light">
                        {skill.level}%
                      </span>
                    </div>

                    {/* Progress Slider */}
                    <div className="w-full h-2 rounded-full bg-latte/40 overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true, margin: "-20px" }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: sIdx * 0.05 }}
                        className="h-full bg-gradient-coffee rounded-full"
                      />
                    </div>

                  </div>
                ))}
              </div>

            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}
