"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Globe, Cpu, Server, Database, Container, Zap, Palette, BrainCircuit, GitBranch } from "lucide-react";

// "DEVELOPER TOOLS" hata diya gaya hai aur "VERSION CONTROL" add kiya hai
const categories = ["ALL", "FRONTEND", "BACKEND", "DATABASES", "3D & CREATIVE", "DEVOPS & INFRASTRUCTURE", "VERSION CONTROL", "AI & WORKFLOW"];

const techItems = [
  {
    title: "HTML5 & CSS3",
    description: "Semantic markup, responsive layouts & modern styling",
    category: "FRONTEND",
    tier: "CORE // WEB FUNDAMENTALS",
    icon: Code2,
  },
  {
    title: "JavaScript & TypeScript",
    description: "Modern JavaScript, type safety & maintainable code",
    category: "FRONTEND",
    tier: "CORE // DEVELOPMENT",
    icon: Globe,
  },
  {
    title: "React & Next.js",
    description: "Reusable components, routing & modern React applications",
    category: "FRONTEND",
    tier: "CORE // UI ENGINEERING",
    icon: Cpu,
  },
  {
    title: "Docker & Kubernetes",
    description: "Containerization, container orchestration & deployment workflows",
    category: "DEVOPS & INFRASTRUCTURE",
    tier: "DEVOPS // CONTAINERIZATION",
    icon: Container,
  },
  {
    title: "Node.js & Express.js",
    description: "REST APIs, backend logic & server-side development",
    category: "BACKEND",
    tier: "CORE // SERVER ENGINEERING",
    icon: Server,
  },
  {
    title: "MongoDB & PostgreSQL",
    description: "Document databases, relational data & SQL fundamentals",
    category: "DATABASES",
    tier: "DEVELOPMENT // DATA LAYER",
    icon: Database,
  },
  {
    title: "Git & GitHub",
    description: "Version control, repository management & collaboration",
    category: "VERSION CONTROL",
    tier: "CORE // VERSION CONTROL",
    icon: GitBranch,
  },
  {
    title: "Three.js, GSAP & Motion",
    description: "Interactive 3D scenes, animation timelines & motion design",
    category: "3D & CREATIVE",
    tier: "CREATIVE // INTERACTIVE WEB",
    icon: Zap,
  },
  {
    title: "Tailwind CSS",
    description: "Responsive UI, utility-first styling & dark theme design",
    category: "FRONTEND",
    tier: "UI // DESIGN SYSTEMS",
    icon: Palette,
  },
  {
    title: "AI-Assisted Development",
    description: "AI coding tools for implementation, debugging & iteration",
    category: "AI & WORKFLOW",
    tier: "AI // DEVELOPMENT WORKFLOW",
    icon: BrainCircuit,
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
                  className={`px-3 py-1.5 rounded-md text-[11px] font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
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

        {/* Tech Grid Matrix with key={selectedCategory} for proper re-render */}
        <motion.div 
          key={selectedCategory}
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08
              }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {filteredItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
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