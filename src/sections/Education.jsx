import React from "react";
import { GraduationCap, Calendar, Award } from "lucide-react";
import { motion } from "framer-motion";
import Card from "../components/Card";

export default function Education({ educationData }) {
  const items = educationData || [];

  return (
    <section id="education" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="font-serif font-bold text-coffee text-3xl md:text-4xl mb-4">
            Education
          </h2>
          <div className="w-16 h-1 bg-coffee-light mx-auto rounded-full" />
        </div>

        {/* Timeline Path */}
        <div className="relative border-l-2 border-latte/70 ml-4 md:ml-32 space-y-16 py-4">
          
          {items.map((edu, idx) => (
            <div key={edu.id || idx} className="relative group">
              
              {/* Timeline dot */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-coffee border-4 border-cream-light group-hover:scale-125 transition-transform duration-300 shadow-sm" />

              {/* Sidebar Period badge for large screen */}
              <div className="hidden md:block absolute -left-32 top-0 w-24 text-right">
                <span className="font-sans font-medium text-coffee text-sm tracking-wider">
                  {edu.period}
                </span>
              </div>

              {/* Timeline Card */}
              <div className="ml-8 md:ml-10">
                <Card
                  delay={idx * 0.15}
                  className="relative overflow-hidden border border-latte/30 hover:border-coffee-light/30 text-left"
                >
                  {/* Decorative background cap */}
                  <GraduationCap
                    size={110}
                    className="absolute right-[-15px] bottom-[-20px] text-latte/15 rotate-12 pointer-events-none select-none"
                  />

                  {/* Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <div>
                      <span className="md:hidden inline-flex items-center gap-1 text-xs font-semibold text-coffee-light mb-1">
                        <Calendar size={12} />
                        {edu.period}
                      </span>
                      <h3 className="font-serif font-bold text-coffee text-lg sm:text-xl">
                        {edu.degree}
                      </h3>
                      <h4 className="font-sans font-medium text-coffee-light text-sm sm:text-base">
                        {edu.institution}
                      </h4>
                    </div>

                    {/* Grade indicator */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-latte/40 text-coffee border border-coffee/5 font-semibold text-xs sm:text-sm">
                      <Award size={14} className="text-coffee-light" />
                      {edu.grade}
                    </div>
                  </div>

                  {/* Details paragraph */}
                  <p className="font-sans font-light text-coffee/90 text-sm sm:text-base leading-relaxed max-w-2xl relative z-10">
                    {edu.details}
                  </p>
                </Card>
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
