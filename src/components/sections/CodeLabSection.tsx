"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, RotateCw, ExternalLink, Terminal } from "lucide-react";

const codeFiles: Record<string, { name: string; code: string[] }> = {
  "kernel.ts": {
    name: "kernel.ts",
    code: [
      "import { ShaderMesh, Vector3 } from '@speculative/core';",
      "// Low-latency particle field kernel initialization",
      "export const initFluidField = (resolution: number) => {",
      "  const buffer = new Float32Array(resolution * 3);",
      "  const computeWeights = (step: number) => {",
      "    return Math.sin(step * 0.05) * 2.44;",
      "  };",
      "  return new ShaderMesh({ buffer, latencyTarget: 0.016 });",
      "};",
      "// System compiled successfully in 14ms",
      "● Runtime: 0 errors, 0 warnings.",
    ],
  },
  "raymarch.frag": {
    name: "raymarch.frag",
    code: [
      "#version 300 es",
      "precision highp float;",
      "uniform vec2 u_resolution;",
      "uniform float u_time;",
      "out vec4 fragColor;",
      "// Distance estimator for procedural signed fields",
      "float map(vec3 p) {",
      "  return length(p) - 1.2 + sin(u_time * 2.0) * 0.1;",
      "}",
      "void main() {",
      "  fragColor = vec4(0.91, 0.70, 0.03, 1.0);",
      "}",
    ],
  },
  "tokens.css": {
    name: "tokens.css",
    code: [
      ":root {",
      "  --sys-bg: #0d0d0e;",
      "  --sys-accent: #eab308;",
      "  --sys-border: rgba(255, 255, 255, 0.1);",
      "  --sys-font: 'JetBrains Mono', monospace;",
      "}",
      "body {",
      "  background-color: var(--sys-bg);",
      "  color: #ffffff;",
      "  selection-background: var(--sys-accent);",
      "}",
    ],
  },
};

export default function CodeLabSection() {
  const [activeTab, setActiveTab] = useState("kernel.ts");
  const [isExecuting, setIsExecuting] = useState(false);

  const handleRunExecution = () => {
    setIsExecuting(true);
    setTimeout(() => setIsExecuting(false), 800);
  };

  return (
    <section
      id="codelab"
      className="relative py-24 px-6 md:px-12 bg-[#0d0d0e] text-white border-t border-neutral-800/60 font-mono select-none"
    >
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div className="space-y-3">
            <div className="text-xs tracking-[0.2em] font-semibold text-[#eab308]">
              04 // BROWSER-BASED IDE
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight uppercase text-white">
              Code Lab Workbench
            </h2>
          </div>
          <div>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-4 py-2 rounded border border-neutral-800 bg-[#141416] hover:bg-neutral-800 text-xs text-neutral-300 font-semibold tracking-wider transition-all"
            >
              FULLSCREEN LAB <ExternalLink className="w-3.5 h-3.5 text-[#eab308]" />
            </a>
          </div>
        </motion.div>

        {/* IDE Window Box */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="rounded-xl border border-neutral-800/80 bg-[#121214] overflow-hidden shadow-2xl"
        >
          {/* Top IDE Navigation Bar */}
          <div className="bg-[#18181b] border-b border-neutral-800/80 px-4 py-3 flex flex-wrap items-center justify-between gap-4">
            
            {/* Window Controls & File Tabs */}
            <div className="flex items-center gap-6">
              {/* Traffic Lights */}
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
              </div>

              {/* File Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto">
                {Object.keys(codeFiles).map((filename) => {
                  const isActive = activeTab === filename;
                  return (
                    <button
                      key={filename}
                      onClick={() => setActiveTab(filename)}
                      className={`px-3 py-1.5 rounded-t text-xs flex items-center gap-2 transition-all ${
                        isActive
                          ? "bg-[#121214] text-[#eab308] border-t-2 border-[#eab308]"
                          : "text-neutral-400 hover:text-white bg-transparent"
                      }`}
                    >
                      <span className="text-[10px] text-[#eab308]">⚡</span>
                      {filename}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Run Execution Button */}
            <button
              onClick={handleRunExecution}
              className="px-4 py-1.5 rounded bg-[#eab308] hover:bg-[#facc15] text-black font-extrabold text-xs tracking-wider transition-all flex items-center gap-2 active:scale-95 shadow-[0_0_15px_rgba(234,179,8,0.25)]"
            >
              <Play className={`w-3.5 h-3.5 fill-black ${isExecuting ? "animate-spin" : ""}`} />
              RUN EXECUTION
            </button>
          </div>

          {/* IDE Main Split View (Code Editor + Live Preview Canvas) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
            
            {/* Left: Code Editor Area */}
            <div className="lg:col-span-7 p-6 bg-[#0d0d0e] border-r border-neutral-800/80 overflow-x-auto">
              <div className="space-y-1 font-mono text-xs leading-relaxed">
                {codeFiles[activeTab].code.map((line, idx) => {
                  const lineNo = String(idx + 1).padStart(2, "0");
                  let textColor = "text-neutral-300";
                  if (line.startsWith("import") || line.startsWith("export") || line.startsWith("void")) {
                    textColor = "text-yellow-200 font-bold";
                  } else if (line.startsWith("//")) {
                    textColor = "text-neutral-500 italic";
                  } else if (line.includes("Math.sin") || line.includes("ShaderMesh")) {
                    textColor = "text-[#eab308]";
                  }

                  return (
                    <div key={idx} className="flex items-start gap-4">
                      <span className="text-neutral-600 select-none w-6 text-right">{lineNo}</span>
                      <span className={textColor}>{line}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Live Preview / Virtual Framebuffer Canvas */}
            <div className="lg:col-span-5 p-6 bg-[#101012] flex flex-col justify-between">
              
              {/* Preview Header */}
              <div className="flex items-center justify-between text-[11px] text-neutral-400 border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>PREVIEW: VIRTUAL_FRAMEBUFFER</span>
                </div>
                <span className="text-neutral-500">1200x800 px</span>
              </div>

              {/* Sine Wave Animated Graphic Simulation */}
              <div className="flex-1 my-6 flex items-center justify-center relative overflow-hidden rounded border border-neutral-800/60 bg-[#0a0a0c]">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:20px_20px]" />
                
                {/* SVG Sine Wave Graph */}
                <svg className="w-full h-32 px-4 relative z-10" viewBox="0 0 400 100" fill="none">
                  <path
                    d="M 0 50 Q 100 10, 200 50 T 400 50"
                    stroke="#eab308"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.4"
                  />
                  <motion.path
                    animate={{ pathLength: [0, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    d="M 0 50 Q 100 10, 200 50 T 400 50"
                    stroke="#eab308"
                    strokeWidth="2.5"
                  />
                  {/* Glowing Node Point */}
                  <circle cx="280" cy="62" r="4" className="fill-[#eab308] animate-ping" />
                  <circle cx="280" cy="62" r="3" className="fill-[#eab308]" />
                </svg>
              </div>

              {/* Preview Footer / Status */}
              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-[10px]">
                <span className="text-neutral-500">OUTPUT: STATE_ACTIVE</span>
                <span className="text-[#eab308] font-bold">RETURN: 200 OK</span>
              </div>

            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}