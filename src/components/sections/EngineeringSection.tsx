"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Cpu, Layers, FileText } from "lucide-react";

export default function EngineeringSection() {
  return (
    <section
      id="vision"
      className="relative py-24 px-6 md:px-12 bg-[#0d0d0e] text-white border-t border-neutral-800/60 font-mono select-none"
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Heading & Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7 space-y-7"
        >
          {/* Section Tag */}
          <div className="text-xs tracking-[0.2em] font-semibold text-[#eab308]">
         01 // ENGINEERING & VISION
          </div>

          {/* Main Title */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] uppercase text-white">
            BUILDING DIGITAL EXPERIENCES AT THE<br />
             INTERSECTION OF  <br />
             CODE , AI & 3D.
          </h2>

          {/* Paragraph 1 */}
          <p className="text-neutral-400 text-sm md:text-[15px] leading-relaxed font-sans">
           I build modern web applications and immersive digital experiences by combining full-stack development, AI-assisted workflows, and interactive 3D graphics.
          </p>

          {/* Paragraph 2 */}
          <p className="text-neutral-400 text-sm md:text-[15px] leading-relaxed font-sans">
           My approach blends thoughtful UI design, practical engineering, and creative experimentation to turn ideas into engaging, functional products.
          </p>

          {/* Download Button */}
          <div className="pt-2">
            <a
              href="#"
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-md border border-neutral-800 bg-[#141416] hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold tracking-wider transition-all duration-200 active:scale-95 group"
            >
              <FileText className="w-4 h-4 text-neutral-400 group-hover:text-[#eab308] transition-colors" />
              <span>DOWNLOAD CURRICULUM VITAE (PDF)</span>
              <span className="text-[#eab308] text-sm">↗</span>
            </a>
          </div>
        </motion.div>

        {/* Right Column: 3 Stat Cards with Staggered Motion */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          className="lg:col-span-5 space-y-4"
        >
          {/* Card 1 */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 30 },
              show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="p-6 rounded-lg border border-neutral-800/80 bg-[#121214] hover:border-[#eab308]/40 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-4xl md:text-5xl font-black text-[#eab308] tracking-tight">
                 AI + FULL STACK
                </div>
                <div className="text-sm font-bold text-white mt-2">
                 Development Workflow
                </div>
              </div>
              <div className="text-neutral-500 group-hover:text-[#eab308] transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-neutral-400 text-xs font-sans mt-3 leading-relaxed">
             Building applications with modern web technologies and AI-assisted development.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 30 },
              show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="p-6 rounded-lg border border-neutral-800/80 bg-[#121214] hover:border-[#eab308]/40 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-4xl md:text-5xl font-black text-[#eab308] tracking-tight">
                REAL-TIME 3D
                </div>
                <div className="text-sm font-bold text-white mt-2">
                 Interactive Experiences
                </div>
              </div>
              <div className="text-neutral-500 group-hover:text-[#eab308] transition-colors">
                <Cpu className="w-5 h-5" />
              </div>
            </div>
            <p className="text-neutral-400 text-xs font-sans mt-3 leading-relaxed">
             Exploring immersive browser-based graphics using Three.js and WebGL where applicable.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 30 },
              show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="p-6 rounded-lg border border-neutral-800/80 bg-[#121214] hover:border-[#eab308]/40 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-4xl md:text-5xl font-black text-[#eab308] tracking-tight">
                MODERN WEB
                </div>
                <div className="text-sm font-bold text-white mt-2">
                 Full-Stack Development
                </div>
              </div>
              <div className="text-neutral-500 group-hover:text-[#eab308] transition-colors">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <p className="text-neutral-400 text-xs font-sans mt-3 leading-relaxed">
              Designing and building responsive interfaces and practical web applications.
            </p>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}