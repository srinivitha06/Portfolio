import React from "react";
import { FileText, Download, ExternalLink } from "lucide-react";
import confetti from "canvas-confetti";
import Card from "../components/Card";

export default function ResumeSection({ resumeUrl }) {
  const handleResumeDownload = () => {
    // Sparkle effect
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.8 },
      colors: ["#5C3D2E", "#A98467", "#E8D8CE", "#F5EFEB"]
    });
  };

  return (
    <section id="resume" className="py-24 px-6 bg-cream/35">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-coffee text-3xl md:text-4xl mb-4">
            Curriculum Vitae
          </h2>
          <div className="w-16 h-1 bg-coffee-light mx-auto rounded-full" />
        </div>

        <Card className="border border-latte/30 p-8 flex flex-col items-center bg-cream-light/60">
          
          <div className="w-16 h-16 rounded-2xl bg-latte/50 flex items-center justify-center shadow-inner mb-6 animate-pulse-slow">
            <FileText size={32} className="text-coffee" />
          </div>

          <h3 className="font-serif font-bold text-coffee text-2xl mb-2 text-center">
            Review My Academic & Professional Track
          </h3>
          <p className="font-sans font-light text-coffee-light text-sm sm:text-base text-center max-w-xl mb-8 leading-relaxed">
            Interested in my technical capabilities, project background, and ECE credentials? Click below to instantly download my complete resume or preview it inline.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <a
              href={resumeUrl || "#"}
              download
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleResumeDownload}
              className="inline-flex items-center justify-center gap-2 bg-gradient-coffee text-cream-light font-medium py-2.5 px-6 rounded-full shadow-md hover:shadow-lg hover:bg-coffee-dark transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer text-sm sm:text-base"
            >
              <Download size={16} />
              Download Resume PDF
            </a>
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-coffee/20 bg-cream-light/80 text-coffee font-semibold py-2.5 px-6 rounded-full hover:bg-latte/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-sm sm:text-base"
              >
                Open Resume in New Tab
                <ExternalLink size={16} className="text-coffee-light" />
              </a>
            )}
          </div>

          {/* Responsive Embedded Iframe Preview */}
          {resumeUrl ? (
            <div className="w-full h-[650px] rounded-2xl overflow-hidden border border-coffee/10 bg-latte/15 shadow-inner">
              <iframe
                src={`${resumeUrl}#toolbar=0`}
                title="Resume Preview"
                className="w-full h-full"
                type="application/pdf"
              />
            </div>
          ) : (
            <div className="w-full h-40 rounded-2xl border-2 border-dashed border-latte flex flex-col items-center justify-center text-coffee-light">
              <span className="text-sm italic">Resume preview file has not been loaded.</span>
            </div>
          )}

        </Card>

      </div>
    </section>
  );
}
