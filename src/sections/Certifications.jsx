import React, { useState } from "react";
import { FileText, Calendar, ExternalLink, ShieldCheck } from "lucide-react";
import Card from "../components/Card";
import Modal from "../components/Modal";

export default function Certifications({ certificationsData }) {
  const certs = certificationsData || [];
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState("");

  const handleOpenPdf = (pdfUrl, title) => {
    if (!pdfUrl) return;
    setSelectedPdf(pdfUrl);
    setSelectedTitle(title);
  };

  return (
    <section id="certifications" className="py-24 px-6 bg-cream/35">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-coffee text-3xl md:text-4xl mb-4">
            Certifications
          </h2>
          <div className="w-16 h-1 bg-coffee-light mx-auto rounded-full" />
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certs.map((cert, idx) => (
            <Card
              key={cert.id || idx}
              delay={idx * 0.1}
              className="flex flex-col justify-between text-left border border-latte/30 relative overflow-hidden"
            >
              <div>
                {/* Visual Certificate Stamp */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-latte/50 flex items-center justify-center shadow-inner">
                    <ShieldCheck size={22} className="text-coffee" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-coffee-light tracking-wider uppercase bg-cream border border-coffee/5 px-2.5 py-0.5 rounded-lg shadow-sm">
                    <Calendar size={10} />
                    {cert.issueDate}
                  </span>
                </div>

                {/* Title & Issuer */}
                <h3 className="font-serif font-semibold text-coffee text-lg mb-1 leading-snug">
                  {cert.title}
                </h3>
                <h4 className="font-sans font-medium text-coffee-light text-sm mb-4">
                  {cert.issuer}
                </h4>

                {/* Description */}
                <p className="font-sans font-light text-coffee/95 text-xs sm:text-sm leading-relaxed mb-6">
                  {cert.description}
                </p>
              </div>

              {/* PDF/Credential trigger button */}
              <div className="pt-4 border-t border-latte/30 mt-auto flex items-center justify-between">
                {cert.credentialUrl ? (
                  <button
                    onClick={() => handleOpenPdf(cert.credentialUrl, cert.title)}
                    className="inline-flex items-center gap-1.5 text-coffee hover:text-coffee-light text-sm font-semibold cursor-pointer"
                  >
                    <FileText size={16} />
                    View Certificate PDF
                  </button>
                ) : (
                  <span className="text-coffee-light/40 text-xs italic">
                    No attachment provided
                  </span>
                )}
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded-full hover:bg-latte/40 text-coffee-light hover:text-coffee transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>

            </Card>
          ))}
        </div>

        {/* Embedded PDF Viewer Modal */}
        <Modal
          isOpen={!!selectedPdf}
          onClose={() => setSelectedPdf(null)}
          title={selectedTitle}
          size="lg"
        >
          {selectedPdf && (
            <div className="w-full h-[65vh] rounded-2xl overflow-hidden border border-coffee/10 bg-latte/10 flex flex-col shadow-inner">
              
              {/* PDF iframe frame */}
              <iframe
                src={`${selectedPdf}#toolbar=0`}
                title={selectedTitle}
                className="w-full flex-1"
                type="application/pdf"
              />

              {/* Direct access button */}
              <div className="p-3 bg-cream/80 border-t border-coffee/5 flex justify-end">
                <a
                  href={selectedPdf}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-coffee text-cream-light font-medium py-1.5 px-4 rounded-xl text-xs shadow-sm hover:shadow-md cursor-pointer inline-flex items-center gap-1"
                >
                  <ExternalLink size={12} />
                  Open Full PDF Window
                </a>
              </div>
            </div>
          )}
        </Modal>

      </div>
    </section>
  );
}
