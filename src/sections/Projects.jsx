import React, { useState } from "react";
import { ExternalLink, Code } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../components/Card";

const Github = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Projects({ projectsData }) {
  const projects = projectsData || [];
  const [selectedFilter, setSelectedFilter] = useState("All");

  // Get unique categories for filtering
  const categories = ["All", ...new Set(projects.map((p) => p.category))];

  const filteredProjects = selectedFilter === "All"
    ? projects
    : projects.filter((p) => p.category === selectedFilter);

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif font-bold text-coffee text-3xl md:text-4xl mb-4">
            Projects
          </h2>
          <div className="w-16 h-1 bg-coffee-light mx-auto rounded-full" />
        </div>

        {/* Dynamic Filters */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-16">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedFilter(cat)}
              className={`px-4.5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 shadow-sm border border-coffee/5 cursor-pointer ${
                selectedFilter === cat
                  ? "bg-gradient-coffee text-cream-light scale-105"
                  : "bg-cream-light text-coffee hover:bg-latte/40 hover:text-coffee"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid with AnimatePresence for transitions */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj, idx) => (
              <motion.div
                key={proj.id || idx}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex"
              >
                <Card
                  hoverable={true}
                  className="flex flex-col w-full border border-latte/20 p-0 overflow-hidden relative"
                >
                  {/* Project Image Panel */}
                  <div className="relative w-full h-56 overflow-hidden bg-latte/20 group">
                    {/* Hover zoom cover */}
                    <img
                      src={proj.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"}
                      alt={proj.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-coffee-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      {proj.githubLink && (
                        <a
                          href={proj.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-cream-light text-coffee flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                          title="View GitHub"
                        >
                          <Github size={20} />
                        </a>
                      )}
                      {proj.demoLink && (
                        <a
                          href={proj.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-cream-light text-coffee flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                          title="View Demo"
                        >
                          <ExternalLink size={20} />
                        </a>
                      )}
                    </div>

                    {/* Small category tag */}
                    <span className="absolute top-4 left-4 bg-cream-light/95 border border-coffee/10 text-coffee text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-lg shadow-sm">
                      {proj.category}
                    </span>
                  </div>

                  {/* Content Block */}
                  <div className="p-6 md:p-7 flex-1 flex flex-col justify-between text-left">
                    <div>
                      {/* Title */}
                      <h3 className="font-serif font-bold text-coffee text-xl mb-3">
                        {proj.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="font-sans font-light text-coffee-light text-sm leading-relaxed mb-6">
                        {proj.description}
                      </p>
                    </div>

                    <div>
                      {/* Tech stack items */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {proj.tags && proj.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-latte/30 border border-coffee/5 text-coffee text-xs font-medium"
                          >
                            <Code size={10} className="text-coffee-light" />
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Links for Mobile (visible inline) */}
                      <div className="flex items-center gap-4 text-sm font-semibold pt-4 border-t border-latte/20">
                        {proj.githubLink && (
                          <a
                            href={proj.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-coffee hover:text-coffee-light transition-colors"
                          >
                            <Github size={16} />
                            Code
                          </a>
                        )}
                        {proj.demoLink && (
                          <a
                            href={proj.demoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-coffee hover:text-coffee-light transition-colors"
                          >
                            <ExternalLink size={16} />
                            Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
