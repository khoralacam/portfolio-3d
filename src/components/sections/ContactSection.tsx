"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    scope: "Full-Stack Architectural Advisory",
    message: "",
  });
  const [status, setStatus] = useState("");

  const emailText = "alexander@levin-systems.io";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("dispatching...");
    
    // Future backend API endpoint integration here
    setTimeout(() => {
      setStatus("transmission successful");
      setFormData({ name: "", email: "", scope: "Full-Stack Architectural Advisory", message: "" });
      setTimeout(() => setStatus(""), 3000);
    }, 1000);
  };

  return (
    <section
      id="contact"
      className="relative py-24 px-6 md:px-12 bg-[#0d0d0e] text-white border-t border-neutral-800/60 font-mono select-none"
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Title & Direct Protocol */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-5 space-y-8"
        >
          <div className="space-y-3">
            <div className="text-xs tracking-[0.2em] font-semibold text-[#eab308]">
              07 // TRANSMISSION
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase text-white leading-[1.05]">
              HAVE SOMETHING IN <br />
              <span className="text-white">MIND?</span>
            </h2>
          </div>

          <p className="text-neutral-400 text-sm font-sans leading-relaxed">
            Available for select full-stack architecture roles, 3D graphics consulting, or speculative experimental contracts. Reach out directly or dispatch a payload via the telemetry console.
          </p>

          {/* Direct Protocol Box */}
          <div className="space-y-3 pt-2">
            <div className="text-xs text-neutral-500 tracking-widest font-semibold">
              DIRECT PROTOCOL
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-lg border border-neutral-800 bg-[#121214]">
              <span className="text-xs text-neutral-200">{emailText}</span>
              <button
                onClick={handleCopyEmail}
                className="p-2 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                title="Copy Email"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Bottom Security Status Footer */}
          <div className="pt-6 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ENCRYPTION: TLS 1.3 / ECDSA</span>
            </div>
            <span className="text-[#eab308] font-bold">BUFFER: READY</span>
          </div>
        </motion.div>

        {/* Right Column: Send Secure Message Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7 p-6 md:p-8 rounded-xl border border-neutral-800/80 bg-[#121214] shadow-2xl space-y-6"
        >
          {/* Form Header */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4 text-xs">
            <span className="font-bold tracking-widest text-white uppercase">SEND SECURE MESSAGE</span>
            <span className="text-neutral-500">ENDPOINT: POST /v1/inbound</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Name / Identity */}
              <div className="space-y-2">
                <label className="block text-[11px] text-neutral-400 tracking-wider">
                  NAME / IDENTITY *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Elena Rostova"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded bg-[#0a0a0c] border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#eab308] transition-colors"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="block text-[11px] text-neutral-400 tracking-wider">
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  required
                  placeholder="elena@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded bg-[#0a0a0c] border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#eab308] transition-colors"
                />
              </div>

            </div>

            {/* Row 2: Engagement Scope Dropdown */}
            <div className="space-y-2">
              <label className="block text-[11px] text-neutral-400 tracking-wider">
                ENGAGEMENT SCOPE
              </label>
              <select
                value={formData.scope}
                onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                className="w-full px-4 py-3 rounded bg-[#0a0a0c] border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#eab308] transition-colors cursor-pointer"
              >
                <option value="Full-Stack Architectural Advisory">Full-Stack Architectural Advisory</option>
                <option value="3D Graphics & WebGL Engineering">3D Graphics & WebGL Engineering</option>
                <option value="Distributed Systems Consulting">Distributed Systems Consulting</option>
                <option value="Speculative Experimental Contract">Speculative Experimental Contract</option>
              </select>
            </div>

            {/* Row 3: Payload / Specifications Textarea */}
            <div className="space-y-2">
              <label className="block text-[11px] text-neutral-400 tracking-wider">
                PAYLOAD / SPECIFICATIONS *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Detail your project timeline, technical constraints, and mission..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-4 rounded bg-[#0a0a0c] border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#eab308] transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded bg-[#eab308] hover:bg-[#facc15] text-black font-extrabold text-xs tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
              >
                <span>{status ? status.toUpperCase() : "DISPATCH TRANSMISSION ✉"}</span>
              </button>
            </div>

          </form>
        </motion.div>

      </div>
    </section>
  );
}