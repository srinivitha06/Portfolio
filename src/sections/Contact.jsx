import React, { useState } from "react";
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import Card from "../components/Card";
import confetti from "canvas-confetti";

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

const Linkedin = ({ size = 20, className = "" }) => (
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
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Contact({ contactData }) {
  const { email, linkedin, github } = contactData || {};
  const { submitMessage } = usePortfolio();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ submitting: false, success: false, error: "Please fill in all required fields." });
      return;
    }

    setStatus({ submitting: true, success: false, error: "" });

    try {
      const response = await submitMessage(
        formData.name,
        formData.email,
        formData.subject || "No Subject",
        formData.message
      );

      if (response.success) {
        setStatus({ submitting: false, success: true, error: "" });
        setFormData({ name: "", email: "", subject: "", message: "" });
        
        // Trigger success spark!
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#5C3D2E", "#A98467"]
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#5C3D2E", "#A98467"]
        });
      } else {
        setStatus({ submitting: false, success: false, error: response.error || "Failed to deliver message." });
      }
    } catch (err) {
      setStatus({ submitting: false, success: false, error: "An unexpected error occurred." });
    }
  };

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-coffee text-3xl md:text-4xl mb-4">
            Get In Touch
          </h2>
          <div className="w-16 h-1 bg-coffee-light mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Social Channels / Metadata */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="text-left space-y-6">
              <h3 className="font-serif font-semibold text-coffee text-2xl">
                Let's discuss hardware & code!
              </h3>
              <p className="font-sans font-light text-coffee-light text-base leading-relaxed">
                Whether you're looking for an ECE intern for embedded systems research, have questions about my PCB design pipelines, or want to collaborate on a hardware project, I'm always excited to connect!
              </p>
            </div>

            {/* Visual Icons List */}
            <div className="space-y-4 pt-6 border-t border-latte/30">
              
              {/* Email */}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-cream/40 border border-coffee/5 hover:bg-latte/40 transition-colors group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-latte/50 flex items-center justify-center text-coffee shadow-inner group-hover:scale-105 transition-transform">
                    <Mail size={20} />
                  </div>
                  <div className="text-left">
                    <span className="block text-[11px] font-semibold text-coffee-light tracking-wider uppercase">Email</span>
                    <span className="font-sans font-semibold text-coffee text-sm sm:text-base break-all">{email}</span>
                  </div>
                </a>
              )}

              {/* LinkedIn */}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-cream/40 border border-coffee/5 hover:bg-latte/40 transition-colors group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-latte/50 flex items-center justify-center text-coffee shadow-inner group-hover:scale-105 transition-transform">
                    <Linkedin size={20} />
                  </div>
                  <div className="text-left">
                    <span className="block text-[11px] font-semibold text-coffee-light tracking-wider uppercase">LinkedIn</span>
                    <span className="font-sans font-semibold text-coffee text-sm sm:text-base">Connect on LinkedIn</span>
                  </div>
                </a>
              )}

              {/* GitHub */}
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-cream/40 border border-coffee/5 hover:bg-latte/40 transition-colors group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-latte/50 flex items-center justify-center text-coffee shadow-inner group-hover:scale-105 transition-transform">
                    <Github size={20} />
                  </div>
                  <div className="text-left">
                    <span className="block text-[11px] font-semibold text-coffee-light tracking-wider uppercase">GitHub</span>
                    <span className="font-sans font-semibold text-coffee text-sm sm:text-base">Explore repositories</span>
                  </div>
                </a>
              )}

            </div>
          </div>

          {/* Elegant Contact Form */}
          <div className="lg:col-span-7 flex">
            <Card className="w-full border border-latte/30 p-8 flex flex-col justify-between bg-cream-light/60">
              
              {status.success ? (
                // Success State View
                <div className="flex-1 flex flex-col items-center justify-center py-10 text-center space-y-4">
                  <CheckCircle size={56} className="text-coffee animate-bounce" />
                  <h3 className="font-serif font-bold text-coffee text-2xl">
                    Message Delivered!
                  </h3>
                  <p className="font-sans font-light text-coffee-light text-sm max-w-sm">
                    Thank you for reaching out! I've received your submission and will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setStatus({ submitting: false, success: false, error: "" })}
                    className="mt-4 px-5 py-2 rounded-full border border-coffee/20 text-coffee hover:bg-latte/30 transition-colors font-medium text-xs cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                // Contact Form View
                <form onSubmit={handleFormSubmit} className="space-y-5 text-left w-full">
                  
                  {/* Row: Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-coffee-light uppercase tracking-wider">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 rounded-2xl border border-coffee/15 bg-cream-light/40 focus:bg-cream-light focus:outline-none focus:ring-1 focus:ring-coffee focus:border-coffee text-sm transition-all shadow-inner text-coffee"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-coffee-light uppercase tracking-wider">
                        Your Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-2.5 rounded-2xl border border-coffee/15 bg-cream-light/40 focus:bg-cream-light focus:outline-none focus:ring-1 focus:ring-coffee focus:border-coffee text-sm transition-all shadow-inner text-coffee"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-coffee-light uppercase tracking-wider">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Collaboration opportunity..."
                      className="w-full px-4 py-2.5 rounded-2xl border border-coffee/15 bg-cream-light/40 focus:bg-cream-light focus:outline-none focus:ring-1 focus:ring-coffee focus:border-coffee text-sm transition-all shadow-inner text-coffee"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-coffee-light uppercase tracking-wider">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Hi Siddharth, I would love to talk about..."
                      className="w-full px-4 py-3 rounded-2xl border border-coffee/15 bg-cream-light/40 focus:bg-cream-light focus:outline-none focus:ring-1 focus:ring-coffee focus:border-coffee text-sm transition-all shadow-inner resize-none text-coffee"
                    />
                  </div>

                  {/* Error Notification */}
                  {status.error && (
                    <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
                      <AlertCircle size={16} />
                      <span>{status.error}</span>
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={status.submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-coffee text-cream-light font-medium py-3 px-7 rounded-full shadow-md hover:shadow-lg hover:bg-coffee-dark transform hover:-translate-y-0.5 active:translate-y-0 disabled:translate-y-0 disabled:opacity-75 transition-all cursor-pointer text-sm sm:text-base"
                  >
                    {status.submitting ? "Sending..." : "Send Message"}
                    <Send size={16} />
                  </button>

                </form>
              )}

            </Card>
          </div>

        </div>

      </div>
    </section>
  );
}
