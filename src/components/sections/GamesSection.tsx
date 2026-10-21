"use client";

import { motion } from "framer-motion";
import { Gamepad2, Layers } from "lucide-react";

export default function GamesSection() {
  return (
    <section
      id="games"
      className="relative py-24 px-6 md:px-12 bg-[#0d0d0e] text-white border-t border-neutral-800/60 font-mono select-none"
    >
      <div className="max-w-[1400px] mx-auto space-y-12">
        
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
              06 // REAL-TIME GRAPHICS[cite: 9]
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight uppercase text-white">
              3D Games & Experiments[cite: 9]
            </h2>
          </div>
          <div className="text-xs text-neutral-400 tracking-wider">
            PHYSICS: CANNON-ES // AUDIO: WEB AUDIO SYNTH[cite: 9]
          </div>
        </motion.div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: CYBER RUNNER 3D */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="p-6 rounded-xl border border-neutral-800/80 bg-[#121214] hover:border-[#eab308]/40 transition-all duration-300 flex flex-col justify-between space-y-6 shadow-2xl"
          >
            <div className="space-y-5">
              
              {/* Graphic Screen Canvas Placeholder */}
              <div className="relative w-full h-[240px] md:h-[280px] rounded-lg overflow-hidden border border-neutral-800 bg-[#08080a] flex items-center justify-center group">
                
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded bg-black/80 border border-neutral-800 text-[10px] text-[#eab308] tracking-widest backdrop-blur-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#eab308] animate-ping" />
                  <span>WEBGL MINI-GAME[cite: 9]</span>
                </div>

                <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded bg-black/80 border border-neutral-800 text-[10px] text-[#eab308] tracking-widest backdrop-blur-md">
                  PHYSICS: 120Hz TICK[cite: 9]
                </div>

                {/* Cyberpunk Sci-Fi Tunnel Visual Simulation */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#eab30820_0%,transparent_70%)]" />
                <div className="relative z-10 text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full border-2 border-[#eab308] flex items-center justify-center text-[#eab308] shadow-[0_0_20px_rgba(234,179,8,0.5)] group-hover:scale-110 transition-transform">
                    <Gamepad2 className="w-8 h-8" />
                  </div>
                  <div className="text-xs font-bold text-[#eab308] tracking-widest">
                    [NEON TUNNEL RUNNER READY]
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                  CYBER RUNNER 3D[cite: 9]
                </h3>
                <p className="text-neutral-400 text-xs md:text-sm font-sans leading-relaxed">
                  An infinite voxel-based high speed obstacle avoider built in vanilla Three.js and custom instanced transforms with real-time procedural synth soundtrack.[cite: 9]
                </p>
              </div>

            </div>

            {/* Bottom Controls & Button */}
            <div className="pt-4 border-t border-neutral-800/60 flex items-center justify-between">
              <a
                href="#"
                className="px-5 py-2.5 rounded bg-[#eab308] hover:bg-[#facc15] text-black font-extrabold text-xs tracking-wider transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] flex items-center gap-2 active:scale-95"
              >
                <Gamepad2 className="w-4 h-4 fill-black" />
                LAUNCH SIMULATION[cite: 9]
              </a>
              <span className="text-[10px] text-neutral-500 font-bold tracking-widest">
                W, A, S, D CONTROL[cite: 9]
              </span>
            </div>
          </motion.div>

          {/* Card 2: ZERO-G PHYSICS SANDBOX */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="p-6 rounded-xl border border-neutral-800/80 bg-[#121214] hover:border-[#eab308]/40 transition-all duration-300 flex flex-col justify-between space-y-6 shadow-2xl"
          >
            <div className="space-y-5">
              
              {/* Graphic Screen Canvas Placeholder */}
              <div className="relative w-full h-[240px] md:h-[280px] rounded-lg overflow-hidden border border-neutral-800 bg-[#08080a] flex items-center justify-center group">
                
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded bg-black/80 border border-neutral-800 text-[10px] text-emerald-400 tracking-widest backdrop-blur-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>RIGID BODY LAB[cite: 9]</span>
                </div>

                <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded bg-black/80 border border-neutral-800 text-[10px] text-emerald-400 tracking-widest backdrop-blur-md">
                  COLLIDERS: 500+ ACTIVE[cite: 9]
                </div>

                {/* Physics Orbs / Colliders Simulation Visual */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#10b98115_0%,transparent_70%)]" />
                <div className="relative z-10 text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full border-2 border-[#eab308] flex items-center justify-center text-[#eab308] shadow-[0_0_20px_rgba(234,179,8,0.5)] group-hover:scale-110 transition-transform">
                    <Layers className="w-8 h-8" />
                  </div>
                  <div className="text-xs font-bold text-neutral-300 tracking-widest">
                    [ZERO-GRAVITY SIMULATOR]
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                  ZERO-G PHYSICS SANDBOX[cite: 9]
                </h3>
                <p className="text-neutral-400 text-xs md:text-sm font-sans leading-relaxed">
                  Spatial force simulator exploring gravity wells, inverse kinematic constraints, and spring collision elasticity directly in the browser viewport.[cite: 9]
                </p>
              </div>

            </div>

            {/* Bottom Controls & Button */}
            <div className="pt-4 border-t border-neutral-800/60 flex items-center justify-between">
              <a
                href="#"
                className="px-5 py-2.5 rounded border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-semibold text-xs tracking-wider transition-all flex items-center gap-2 active:scale-95"
              >
                <Layers className="w-4 h-4 text-[#eab308]" />
                OPEN SANDBOX[cite: 9]
              </a>
              <span className="text-[10px] text-neutral-500 font-bold tracking-widest">
                RAYCAST DRAG[cite: 9]
              </span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}