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
            01 // ARCHITECTURE & VISION[cite: 5]
          </div>

          {/* Main Title */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] uppercase text-white">
            Engineering at the <br />
            Intersection of Code & <br />
            Sculpture.[cite: 5]
          </h2>

          {/* Paragraph 1 */}
          <p className="text-neutral-400 text-sm md:text-[15px] leading-relaxed font-sans">
            With 8+ years developing mission-critical production distributed systems, I view the web as an infinite digital sculpture canvas. I believe that modern web applications should not only meet the highest thresholds of low-latency throughput and reliability, but also provoke visceral delight through real-time 3D geometry and surgical micro-interactions.[cite: 5]
          </p>

          {/* Paragraph 2 */}
          <p className="text-neutral-400 text-sm md:text-[15px] leading-relaxed font-sans">
            My workflow combines the structural rigor of compiled systems (Rust, Go, TypeScript) with modern browser GPU pipelines (WebGL, Three.js, WGSL). Whether scaling high-throughput WebSockets for algorithmic execution or authoring fragment shaders that react to audio frequencies, I construct end-to-end coherence.[cite: 5]
          </p>

          {/* Download Button */}
          <div className="pt-2">
            <a
              href="#"
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-md border border-neutral-800 bg-[#141416] hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold tracking-wider transition-all duration-200 active:scale-95 group"
            >
              <FileText className="w-4 h-4 text-neutral-400 group-hover:text-[#eab308] transition-colors" />
              <span>DOWNLOAD CURRICULUM VITAE (PDF)</span>[cite: 5]
              <span className="text-[#eab308] text-sm">↗</span>[cite: 5]
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
                  99.98%[cite: 5]
                </div>
                <div className="text-sm font-bold text-white mt-2">
                  SLA Reliability[cite: 5]
                </div>
              </div>
              <div className="text-neutral-500 group-hover:text-[#eab308] transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-neutral-400 text-xs font-sans mt-3 leading-relaxed">
              Zero-downtime containerized microservices across fault-tolerant clusters.[cite: 5]
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
                  60 FPS[cite: 5]
                </div>
                <div className="text-sm font-bold text-white mt-2">
                  WebGL 3D Runtime[cite: 5]
                </div>
              </div>
              <div className="text-neutral-500 group-hover:text-[#eab308] transition-colors">
                <Cpu className="w-5 h-5" />
              </div>
            </div>
            <p className="text-neutral-400 text-xs font-sans mt-3 leading-relaxed">
              Strict draw-call budgeting and frustum culling for fluid spatial experiences.[cite: 5]
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
                  8+ YRS[cite: 5]
                </div>
                <div className="text-sm font-bold text-white mt-2">
                  Crafting Systems[cite: 5]
                </div>
              </div>
              <div className="text-neutral-500 group-hover:text-[#eab308] transition-colors">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <p className="text-neutral-400 text-xs font-sans mt-3 leading-relaxed">
              Evolving full-stack engineering practices from monoliths to edge runtimes.[cite: 5]
            </p>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}