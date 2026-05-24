import React, { useState, useEffect } from "react";
import { Menu, X, Settings } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Me" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "activities", label: "Activities" },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" }
];

export default function Navbar({ onOpenAdmin }) {
  const { activeTab, setActiveTab, data } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const name = data?.profile?.name || "Siddharth Sharma";
  
  // Extract initials (e.g., "Siddharth Sharma" -> "SS")
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Extract first name (e.g., "Siddharth")
  const firstName = name.split(" ")[0];

  // Scroll detection to highlight sections & change navbar padding
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Find which section is currently on screen
      const scrollPosition = window.scrollY + 120;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveTab(item.id);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setActiveTab]);

  const handleNavClick = (id) => {
    setIsOpen(false);
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // height of floating navbar
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 glass-nav shadow-sm border-b border-coffee/10"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Dynamic Logo */}
        <div
          onClick={() => handleNavClick("home")}
          className="cursor-pointer group flex items-center gap-1.5"
        >
          <span className="w-8 h-8 rounded-full bg-coffee flex items-center justify-center text-cream-light font-bold text-sm transition-transform duration-300 group-hover:rotate-12">
            {initials}
          </span>
          <span className="font-serif font-bold text-coffee text-xl tracking-tight">
            {firstName}<span className="font-sans font-light text-coffee-light">.ECE</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === item.id
                  ? "bg-coffee text-cream-light shadow-sm"
                  : "text-coffee/80 hover:text-coffee hover:bg-latte/40"
              }`}
            >
              {item.id === "activities" ? "Activities" : item.label}
            </button>
          ))}

          {/* Admin Dashboard shortcut icon */}
          <button
            onClick={onOpenAdmin}
            title="Open Admin Dashboard"
            className="ml-3 p-1.5 rounded-full text-coffee-light hover:text-coffee hover:bg-latte/40 transition-colors duration-200 cursor-pointer"
          >
            <Settings size={18} className="animate-spin-slow hover:animate-none" />
          </button>
        </div>

        {/* Mobile menu trigger buttons */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={onOpenAdmin}
            className="p-1.5 rounded-full text-coffee-light hover:text-coffee transition-colors cursor-pointer"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-full text-coffee hover:bg-latte/40 transition-colors cursor-pointer"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 py-6 px-6 glass-nav border-b border-coffee/15 flex flex-col gap-3 shadow-lg animate-fade-in">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full py-3 px-4 rounded-xl text-left text-base font-medium transition-all cursor-pointer ${
                activeTab === item.id
                  ? "bg-gradient-coffee text-cream-light shadow-md"
                  : "text-coffee/80 hover:text-coffee hover:bg-latte/30"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
