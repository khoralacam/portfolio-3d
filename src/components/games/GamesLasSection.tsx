// src/components/games/GamesLasSection.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, Terminal, Cpu, Activity, 
  ExternalLink, Radio, X, Volume2, VolumeX, Maximize2, Shield, Flame, Crown 
} from "lucide-react";

import { ChessNexusShell } from "@/components/games/chess-nexus/layout/ChessNexusShell";
// Fixed folder path spelling from cycber-track to cyber-track
import { CyberTrackShell } from '@/components/games/cycber-track/layout/CyberTrackShell';

const GAMES_DATA = [
  {
    id: "cyber-runner",
    title: "CYBER TRACK: NEON OVERDRIVE",
    tagline: "3D ENDLESS CYBERPUNK RACER",
    version: "v4.2.0",
    badge: "THREE.JS // R3F // WEB AUDIO",
    status: "ACTIVE",
    statusColor: "text-emerald-400",
    dotColor: "bg-emerald-400",
    category: "ARCADE",
    description: "Drive a futuristic interceptor through a procedural cyberpunk city. Dodge traffic, collect red energy cores, unlock skins, and trigger plasma nitro.",
    tags: ["3-LANE 3D RACER", "OBJECT POOLING", "GARAGE & MISSIONS"],
    score: "60 FPS",
    velocity: "420 KM/H",
    metricLabel: "SECTOR",
    metricValue: "NIGHT CITY 01",
  },
  {
    id: "chess-3d",
    title: "CHESS NEXUS: QUANTUM GRANDMASTER",
    tagline: "TACTICAL NEURAL ENGINE",
    version: "v4.0.1",
    badge: "THREE.JS // STOCKFISH WASM",
    status: "ACTIVE",
    statusColor: "text-emerald-400",
    dotColor: "bg-emerald-400",
    category: "ARCADE",
    description: "Play offline AI chess, local 2-player, or real-time online multiplayer in a luxury dark & yellow interface.",
    tags: ["3D BOARD MATRIX", "WASM AI ENGINE", "MOVE HISTORY"],
    score: "2,450 ELO",
    velocity: "18 PLY DEEP",
    metricLabel: "STATUS",
    metricValue: "WHITE TO MOVE",
  },
  
];

export default function GameLabSection() {
  const [activeFilter, setActiveFilter] = useState("ALL (5)");
  const [selectedGameId, setSelectedGameId] = useState("cyber-runner");
  const [isRunning, setIsRunning] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);

  const activeGame = GAMES_DATA.find((g) => g.id === selectedGameId) || GAMES_DATA[0];

  const filteredGames = GAMES_DATA.filter((game) => {
    if (activeFilter.includes("PHYSICS")) return game.category === "PHYSICS";
    if (activeFilter.includes("ARCADE")) return game.category === "ARCADE";
    return true;
  });

  const renderLiveGameEngine = () => {
    if (activeGame.id === "cyber-runner") return <CyberTrackShell />;
    if (activeGame.id === "chess-3d") return <ChessNexusShell />;
    return (
      <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
        SIMULATION ENGINE LOADING...
      </div>
    );
  };

  const hasLiveEngine = activeGame.id === "cyber-runner" || activeGame.id === "chess-3d";

  return (
    <section className="min-h-screen bg-[#0d0d0f] text-neutral-300 font-mono py-12 px-4 md:px-8 select-none relative">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* --- TOP HERO HEADER --- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-[11px] text-neutral-500 tracking-widest uppercase">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
              SECTION 04 // WEBGL 2.0 EXPERIMENTAL LAB
            </span>
            <div className="hidden sm:flex items-center gap-6">
              <span>SHADERS: GLSL ES 3.00</span>
              <span>RENDERED PIPELINE: DEFERRED</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-neutral-800/80 pb-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase">
                LESS TALK. <span className="text-[#f5e642]">MORE PLAY.</span>
              </h1>
              <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
                Real-time interactive 3D simulations, physics experiments, and browser arcade games crafted in Three.js and custom GLSL shaders.
              </p>
            </div>
            <div className="bg-[#141519] border border-neutral-800 px-4 py-2.5 rounded flex items-center gap-4 text-xs">
              <div>
                <div className="text-[10px] text-neutral-500">PIPELINE THROUGHPUT</div>
                <div className="text-white font-bold tracking-wider">120 FPS CAPABLE</div>
              </div>
              <Activity className="text-[#f5e642]" size={18} />
            </div>
          </div>
        </div>

        {/* --- MAIN 3D GAME VIEWPORT HERO --- */}
        <div className="rounded-xl border border-neutral-800 bg-[#121316] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          <div className="bg-[#17181c] px-4 py-2.5 border-b border-neutral-800 flex flex-wrap items-center justify-between text-xs text-neutral-400">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-white font-semibold">VIEWPORT // PRIMARY_CANVAS_03</span>
              <span className="text-neutral-600">|</span>
              <span className="text-[#f5e642]">{activeGame.title}</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-1 bg-[#f5e642] text-black font-extrabold rounded text-[11px] flex items-center gap-1.5 cursor-pointer"
              >
                <Maximize2 size={12} /> FULLSCREEN
              </button>
            </div>
          </div>

          <div className="relative h-[560px] bg-[#0a0a0c] overflow-hidden">
            {hasLiveEngine && isRunning ? (
              renderLiveGameEngine()
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="text-white font-black text-2xl uppercase">{activeGame.title}</div>
                <p className="text-xs text-neutral-400 max-w-md">{activeGame.description}</p>
                <button
                  onClick={() => setIsRunning(true)}
                  className="px-5 py-2.5 bg-[#f5e642] text-black font-extrabold rounded text-xs cursor-pointer"
                >
                  MOUNT INTERACTIVE ENGINE
                </button>
              </div>
            )}
          </div>
        </div>

        {/* --- CARDS GRID --- */}
        <div className="space-y-6 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <h2 className="text-xl md:text-2xl font-extrabold tracking-wider text-white uppercase">
              ARCADE & PHYSICS EXPERIMENTS
            </h2>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              {["ALL (5)", "PHYSICS", "ARCADE"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-2.5 py-1 rounded transition cursor-pointer ${
                    activeFilter === tab ? "bg-[#f5e642] text-black font-bold" : "hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <div 
                key={game.id}
                onClick={() => {
                  setSelectedGameId(game.id);
                  setIsRunning(true);
                }}
                className={`bg-[#121316] border rounded-xl overflow-hidden group transition duration-300 flex flex-col justify-between cursor-pointer ${
                  selectedGameId === game.id ? "border-[#f5e642]" : "border-neutral-800 hover:border-[#f5e642]/50"
                }`}
              >
                <div className="p-4 bg-[#17181c] border-b border-neutral-800 flex items-center justify-between text-[11px]">
                  <span className={`${game.statusColor} font-bold`}>{game.status}</span>
                  <span className="text-[#f5e642] flex items-center gap-1 text-[10px]">
                    PLAY <ExternalLink size={10} />
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="text-white font-bold text-sm">{game.title}</h3>
                  <p className="text-xs text-neutral-400">{game.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- FULLSCREEN MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 md:p-6"
          >
            <div className="w-full max-w-6xl h-[92vh] bg-[#121316] border border-neutral-700 rounded-xl overflow-hidden flex flex-col">
              <div className="bg-[#17181c] px6 py-3 border-b border-neutral-800 flex items-center justify-between">
                <span className="text-white font-bold text-sm">{activeGame.title}</span>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 bg-neutral-800 hover:bg-red-600 text-white rounded cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 relative overflow-hidden">
                {renderLiveGameEngine()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}