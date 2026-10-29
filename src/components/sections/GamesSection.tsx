"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Layers, Sparkles, Minimize2 } from "lucide-react";
import GameLabSection from "@/components/games/GamesLasSection"; // Aapka games lab component

export default function GamesSection() {
  const [isFullScreenLabOpen, setIsFullScreenLabOpen] = useState(false);

  // Agar user ne Fullscreen Lab open kiya hai, toh sirf Clean Overlay dikhega (No Navbar/Footer)
  if (isFullScreenLabOpen) {
    return (
      <div className="fixed inset-0 z-50 w-screen h-screen bg-[#0d0d0e] overflow-y-auto flex flex-col font-mono text-white">
        
        {/* Top Minimal Bar with Exit Button */}
        <div className="bg-[#12141a] px-6 py-4 border-b border-neutral-800 flex items-center justify-between shrink-0 sticky top-0 z-50">
          <div className="text-xs text-[#eab308] font-bold tracking-wider uppercase">
            3D GAMES & EXPERIMENTS // FULLSCREEN MODE
          </div>
          <button
            onClick={() => setIsFullScreenLabOpen(false)}
            className="px-3.5 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs rounded transition cursor-pointer font-bold flex items-center gap-1.5"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            EXIT FULLSCREEN
          </button>
        </div>

        {/* Main Fullscreen Games Section Content */}
        <div className="flex-1">
          <GameLabSection />
        </div>
        
      </div>
    );
  }

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
              06 // REAL-TIME GRAPHICS
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight uppercase text-white">
              3D Games & Experiments
            </h2>
          </div>
          <div className="text-xs text-neutral-400 tracking-wider">
            PHYSICS: CANNON-ES // AUDIO: WEB AUDIO SYNTH
          </div>
        </motion.div>

        {/* 2-Column Grid with Both Cards */}
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
              <div className="relative w-full h-[240px] md:h-[280px] rounded-lg overflow-hidden border border-neutral-800 bg-[#08080a] flex items-center justify-center group">
                <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded bg-black/80 border border-neutral-800 text-[10px] text-[#eab308] tracking-widest backdrop-blur-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#eab308] animate-ping" />
                  <span>WEBGL MINI-GAME</span>
                </div>
                <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded bg-black/80 border border-neutral-800 text-[10px] text-[#eab308] tracking-widest backdrop-blur-md">
                  PHYSICS: 120Hz TICK
                </div>
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

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                  CYBER RUNNER 3D
                </h3>
                <p className="text-neutral-400 text-xs md:text-sm font-sans leading-relaxed">
                  An infinite voxel-based high speed obstacle avoider built in vanilla Three.js and custom instanced transforms with real-time procedural synth soundtrack.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800/60 flex items-center justify-between">
              <button
                onClick={() => setIsFullScreenLabOpen(true)}
                className="px-5 py-2.5 rounded bg-[#eab308] hover:bg-[#facc15] text-black font-extrabold text-xs tracking-wider transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4 fill-black" />
                LAUNCH SIMULATION
              </button>
              <span className="text-[10px] text-neutral-500 font-bold tracking-widest">
                W, A, S, D CONTROL
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
              <div className="relative w-full h-[240px] md:h-[280px] rounded-lg overflow-hidden border border-neutral-800 bg-[#08080a] flex items-center justify-center group">
                <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded bg-black/80 border border-neutral-800 text-[10px] text-emerald-400 tracking-widest backdrop-blur-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>RIGID BODY LAB</span>
                </div>
                <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded bg-black/80 border border-neutral-800 text-[10px] text-emerald-400 tracking-widest backdrop-blur-md">
                  COLLIDERS: 500+ ACTIVE
                </div>
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

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                  ZERO-G PHYSICS SANDBOX
                </h3>
                <p className="text-neutral-400 text-xs md:text-sm font-sans leading-relaxed">
                  Spatial force simulator exploring gravity wells, inverse kinematic constraints, and spring collision elasticity directly in the browser viewport.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800/60 flex items-center justify-between">
              <button
                onClick={() => setIsFullScreenLabOpen(true)}
                className="px-5 py-2.5 rounded border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-semibold text-xs tracking-wider transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-[#eab308]" />
                OPEN SANDBOX
              </button>
              <span className="text-[10px] text-neutral-500 font-bold tracking-widest">
                RAYCAST DRAG
              </span>
            </div>
          </motion.div>

        </div>

        {/* --- LARGE YELLOW BUTTON: OPENS FULLSCREEN GAMES LAB --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="pt-6 flex justify-center"
        >
          <button
            onClick={() => setIsFullScreenLabOpen(true)}
            className="w-full max-w-2xl py-5 rounded-xl bg-[#eab308] hover:bg-[#facc15] text-black font-black text-sm md:text-base tracking-[0.2em] transition-all shadow-[0_0_30px_rgba(234,179,8,0.4)] flex items-center justify-center gap-3 active:scale-95 cursor-pointer uppercase"
          >
            <Sparkles className="w-5 h-5 fill-black" />
            MORE PLAY // MORE GAMES (FULLSCREEN LAB)
          </button>
        </motion.div>

      </div>
    </section>
  );
}