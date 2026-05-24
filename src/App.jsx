import React, { useState } from "react";
import { PortfolioProvider, usePortfolio } from "./context/PortfolioContext";
import Navbar from "./components/Navbar";
import Home from "./sections/Home";
import About from "./sections/About";
import Education from "./sections/Education";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Certifications from "./sections/Certifications";
import Activities from "./sections/Activities";
import ResumeSection from "./sections/ResumeSection";
import Contact from "./sections/Contact";
import Modal from "./components/Modal";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";

function PortfolioApp() {
  const { data, loading } = usePortfolio();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-cream-light flex flex-col items-center justify-center gap-4">
        {/* Elegant ECE microchip loading spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-latte border-t-coffee animate-spin" />
        </div>
        <span className="font-serif italic text-coffee text-sm font-semibold tracking-wide animate-pulse">
          Initializing ECE Portfolio Circuits...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-light text-coffee selection:bg-latte/60 selection:text-coffee">
      {/* Floating Navbar */}
      <Navbar onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Main Content Sections */}
      <main className="pt-20">
        <Home profileData={data.profile} />
        <About profileData={data.profile} />
        <Education educationData={data.education} />
        <Skills skillsData={data.skills} />
        <Projects projectsData={data.projects} />
        <Certifications certificationsData={data.certifications} />
        <Activities activitiesData={data.activities} />
        <ResumeSection resumeUrl={data.profile.resumeUrl} />
        <Contact contactData={data.profile} />
      </main>

      {/* Modern Footer */}
      <footer className="py-12 px-6 border-t border-latte/45 bg-cream/20 text-center text-sm text-coffee-light space-y-2">
        <p className="font-serif italic font-semibold text-coffee">
          "The best way to predict the future is to design the circuits for it."
        </p>
        <p className="font-sans font-light">
          © {new Date().getFullYear()} {data.profile.name || "Siddharth Sharma"}. All rights reserved.
        </p>
        <p className="text-[10px] text-coffee-light/60">
          Designed with React, Tailwind CSS, & Framer Motion.
        </p>
      </footer>

      {/* Admin Panel Modal Overlay */}
      <Modal
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          // Keep logged in status for convenience while editing
        }}
        title={isAdminLoggedIn ? "Visual Database Workspace" : "Admin Authentication"}
        size={isAdminLoggedIn ? "lg" : "md"}
      >
        {isAdminLoggedIn ? (
          <AdminDashboard onClose={() => setIsAdminOpen(false)} />
        ) : (
          <AdminLogin onLoginSuccess={() => setIsAdminLoggedIn(true)} />
        )}
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioApp />
    </PortfolioProvider>
  );
}
