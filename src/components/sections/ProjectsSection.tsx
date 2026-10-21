"use client";

import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative py-24 px-6 md:px-12 bg-[#0d0d0e] text-white border-t border-neutral-800/60 font-mono select-none"
    >
      <div className="max-w-[1400px] mx-auto space-y-16">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800/60 pb-6"
        >
          <div className="space-y-3">
            <div className="text-xs tracking-[0.2em] font-semibold text-[#eab308]">
              03 // SELECTED WORK[cite: 7]
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight uppercase text-white">
              Projects That Do <span className="text-[#eab308]">More</span>[cite: 7]
            </h2>
          </div>
          <div className="text-xs text-neutral-400 tracking-wider">
            DEPLOYED_PROD // REPOSITORIES 2024-2025[cite: 7]
          </div>
        </motion.div>

        {/* Project 1: Featured Case Study (Neural Kinetics) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-8 rounded-xl border border-neutral-800/80 bg-[#121214] hover:border-[#eab308]/40 transition-all duration-300"
        >
          {/* Left: Mockup / Interface Screen */}
          <div className="lg:col-span-7 relative rounded-lg overflow-hidden border border-neutral-800 bg-[#09090a] p-4 flex flex-col justify-between group">
            <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded bg-black/80 border border-neutral-800 text-[10px] text-[#eab308] tracking-widest backdrop-blur-md">
              ● FEATURED CASE STUDY[cite: 7]
            </div>
            
            {/* Simulated UI Window */}
            <div className="my-10 space-y-4">
              <div className="text-xs text-neutral-400 font-bold">SYNTHESIS: AI Creative Platform[cite: 7]</div>
              <div className="w-full h-[240px] md:h-[300px] rounded border border-neutral-800 bg-neutral-950 flex items-center justify-center relative overflow-hidden">
                {/* Visual Neural Network Simulation Lines */}
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative z-10 text-center space-y-2">
                  <div className="w-16 h-16 mx-auto rounded-full border border-[#eab308]/50 flex items-center justify-center animate-pulse text-[#eab308]">
                    ⚡
                  </div>
                  <div className="text-[11px] text-[#eab308] tracking-widest">RUNNING NEURAL MESH V2.4</div>
                </div>
              </div>
            </div>

            {/* Bottom Telemetry Bar */}
            <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[10px] text-neutral-400">
              <span>PIPELINE: PYTORCH + ONNX_WEB[cite: 7]</span>
              <span className="text-[#eab308]">LATENCY: 12ms[cite: 7]</span>
            </div>
          </div>

          {/* Right: Description & Meta */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-xs text-[#eab308] tracking-widest">
                001 // AI COMPUTE RUNTIME[cite: 7]
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
                Neural Kinetics: AI Synthesis Platform[cite: 7]
              </h3>
              <p className="text-neutral-400 text-sm font-sans leading-relaxed">
                A real-time neural latent explorer that synthesizes 3D parametric shapes from text prompts directly inside the browser using client-side WebGL compilation and WebGPU fallbacks. Features distributed WebSocket job orchestration for heavy neural weights.[cite: 7]
              </p>

              {/* Tech Badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                {["NEXT.JS 15", "WEBGL 2.0", "PYTORCH", "FASTAPI", "TAILWIND"].map((tech, i) => (
                  <span key={i} className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 font-bold">
                    {tech}[cite: 7]
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4 border-t border-neutral-800/60">
              <a
                href="#"
                className="px-5 py-2.5 rounded bg-[#eab308] hover:bg-[#facc15] text-black font-extrabold text-xs tracking-wider transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] flex items-center gap-2 active:scale-95"
              >
                LIVE DEMO →[cite: 7]
              </a>
              <a
                href="#"
                className="px-5 py-2.5 rounded border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white font-semibold text-xs tracking-wider transition-all flex items-center gap-2 active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#eab308]" />
                SOURCE (GITHUB)[cite: 7]
              </a>
            </div>
          </div>
        </motion.div>

        {/* Bottom Two Grid Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Project 2: Aether 3D */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="p-6 rounded-xl border border-neutral-800/80 bg-[#121214] hover:border-[#eab308]/40 transition-all duration-300 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#eab308] tracking-widest">002 // COMMERCE[cite: 8]</span>
                <span className="text-emerald-400 font-bold">60 FPS CONFIRMED[cite: 8]</span>
              </div>

              {/* Mockup Preview */}
              <div className="w-full h-[200px] rounded border border-neutral-800 bg-neutral-950 flex items-center justify-center relative overflow-hidden group">
                <div className="text-center space-y-1">
                  <div className="text-2xl">🪙</div>
                  <div className="text-[11px] text-neutral-400">INTERACTIVE 3D VIEW[cite: 8]</div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white uppercase">
                Aether 3D: Spatial Commerce Engine[cite: 8]
              </h3>
              <p className="text-neutral-400 text-xs font-sans leading-relaxed">
                Ultra-photorealistic 3D product configurator engine supporting dynamic glTF texture streaming, custom environment maps, and seamless headless Shopify integration.[cite: 8]
              </p>

              <div className="flex flex-wrap gap-2">
                {["Three.js", "R3F", "TypeScript", "GLSL"].map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-400">
                    {t}[cite: 8]
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800/60 flex items-center justify-between">
              <a href="#" className="text-xs font-bold text-[#eab308] hover:underline flex items-center gap-1.5">
                VIEW CASE STUDY →[cite: 8]
              </a>
              <ExternalLink className="w-4 h-4 text-neutral-500" />
            </div>
          </motion.div>

          {/* Project 3: Hyperion Fintech */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="p-6 rounded-xl border border-neutral-800/80 bg-[#121214] hover:border-[#eab308]/40 transition-all duration-300 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#eab308] tracking-widest">003 // FINTECH[cite: 8]</span>
                <span className="text-[#eab308] font-bold">148K MSG/SEC[cite: 8]</span>
              </div>

              {/* Mockup Preview */}
              <div className="w-full h-[200px] rounded border border-neutral-800 bg-neutral-950 flex items-center justify-center relative overflow-hidden">
                <div className="text-center space-y-1">
                  <div className="text-2xl">📈</div>
                  <div className="text-[11px] text-neutral-400">RUST // HIGH THROUGHPUT[cite: 8]</div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white uppercase">
                Hyperion: High-Throughput Engine[cite: 8]
              </h3>
              <p className="text-neutral-400 text-xs font-sans leading-relaxed">
                Low-latency order routing analytics dashboard written with Rust WebAssembly modules, multiplexed WebSockets, and TimescaleDB backplane for sub-millisecond metric updates.[cite: 8]
              </p>

              <div className="flex flex-wrap gap-2">
                {["Rust WASM", "TimescaleDB", "React 19", "WebSockets"].map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-400">
                    {t}[cite: 8]
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800/60 flex items-center justify-between">
              <a href="#" className="text-xs font-bold text-[#eab308] hover:underline flex items-center gap-1.5">
                VIEW CASE STUDY →[cite: 8]
              </a>
              <ExternalLink className="w-4 h-4 text-neutral-500" />
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}