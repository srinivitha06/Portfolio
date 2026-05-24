import React from "react";
import { Trophy, Calendar, Star } from "lucide-react";
import Card from "../components/Card";

export default function Activities({ activitiesData }) {
  const activities = activitiesData || [];

  return (
    <section id="activities" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-coffee text-3xl md:text-4xl mb-4">
            Competitions & Activities
          </h2>
          <div className="w-16 h-1 bg-coffee-light mx-auto rounded-full" />
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {activities.map((act, idx) => (
            <Card
              key={act.id || idx}
              delay={idx * 0.1}
              className="flex flex-col justify-between text-left border border-latte/30 relative overflow-hidden"
            >
              <div>
                
                {/* Achievement / Role header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-latte/50 flex items-center justify-center shadow-inner">
                    <Trophy size={20} className="text-coffee" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-coffee-light tracking-wider bg-cream border border-coffee/5 px-2.5 py-0.5 rounded-lg shadow-sm">
                    <Calendar size={10} />
                    {act.period}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif font-bold text-coffee text-lg mb-1 leading-snug">
                  {act.title}
                </h3>
                
                {/* Role / Rank */}
                <h4 className="font-sans font-semibold text-coffee-light text-sm mb-4 inline-flex items-center gap-1">
                  <Star size={13} className="text-coffee-light fill-latte" />
                  {act.role}
                </h4>

                {/* Description */}
                <p className="font-sans font-light text-coffee/95 text-xs sm:text-sm leading-relaxed mb-6">
                  {act.description}
                </p>

              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}
