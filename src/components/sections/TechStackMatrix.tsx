"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Globe, Cpu, Server, Database, Container, Zap, Palette } from "lucide-react";

const categories = ["ALL", "FRONTEND", "BACKEND", "DATABASES", "3D & CREATIVE", "DEVOPS"];

const techItems = [
  {
    title: "TypeScript",
    description: "Strict type safety & compiler AST",
    category: "FRONTEND",
    tier: "98% // ARCHITECT",
    icon: Code2,
  },
  {
    title: "React 19 & Next.js 15",
    description: "RSC, Turbopack, Edge Middleware",
    category: "FRONTEND",
    tier: "95% // PRODUCTION",
    icon: Globe,
  },
  {
    title: "Three.js & R3F",
    description: "Custom GLSL shaders, instanced meshes",
    category: "3D & CREATIVE",
    tier: "92% // EXPERIMENTAL",
    icon: Cpu,
  },
  {
    title: "Node.js & Go Runtimes",
    description: "High-concurrency streaming, gRPC",
    category: "BACKEND",
    tier: "98% // ENTERPRISE",
    icon: Server,
  },
  {
    title: "PostgreSQL & Redis",
    description: "Complex query planning & cache locks",
    category: "DATABASES",
    tier: "94% // SCALE",
    icon: Database,
  },
  {
    title: "Docker & Kubernetes",
    description: "OCI builds, autoscaling, ingress control",
    category: "DEVOPS",
    tier: "88% // DEPLOYED",
    icon: Container,
  },
  {
    title: "GSAP & Web Animations",
    description: "Kinetic timelines, SVG morphing",
    category: "3D & CREATIVE",
    tier: "96% // MASTER",
    icon: Zap,
  },
  {
    title: "Tailwind & CSS Tokens",
    description: "Atomic architecture, dark mode token sets",
    category: "FRONTEND",
    tier: "99% // EXPONENT",
    icon: Palette,
  },
];

export default function TechStackMatrix() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const filteredItems = selectedCategory === "ALL" 
    ? techItems 
    : techItems.filter(item => item.category === selectedCategory);

  return (
    <section
      id="stack"
      className="relative py-24 px-6 md:px-12 bg-[#0d0d0e] text-white border-t border-neutral-800/60 font-mono select-none"
    >
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* Top Header & Category Filter Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="space-y-3">
            <div className="text-xs tracking-[0.2em] font-semibold text-[#eab308]">
              02 // CORE RUNTIME
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight uppercase text-white">
              Tech Stack Matrix
            </h2>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 bg-[#121214] p-1.5 rounded-lg border border-neutral-800">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-semibold tracking-wider transition-all duration-200 ${
                    isActive
                      ? "bg-[#eab308] text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tech Grid Matrix with Framer Motion */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {filteredItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                }}
                className="p-6 rounded-lg border border-neutral-800/80 bg-[#121214] hover:border-[#eab308]/50 transition-all duration-300 group flex flex-col justify-between space-y-6"
              >
                {/* Card Top */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-md bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#eab308] group-hover:scale-110 transition-transform">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-neutral-500 tracking-wider">
                      {item.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#eab308] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-neutral-400 text-xs font-sans mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Card Bottom / Mastery Level */}
                <div className="pt-4 border-t border-neutral-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-500">MASTERY</span>
                  <span className="font-bold text-[#eab308]">{item.tier}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}