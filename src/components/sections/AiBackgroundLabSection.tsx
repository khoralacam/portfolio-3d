"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, ArrowRight } from "lucide-react";

export default function AiBackgroundLabSection() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleRunModel = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 1000);
  };

  return (
    <section
      id="ailab"
      className="relative py-24 px-6 md:px-12 bg-[#0d0d0e] text-white border-t border-neutral-800/60 font-mono select-none"
    >
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="space-y-3">
            <div className="text-xs tracking-[0.2em] font-semibold text-[#eab308]">
              05 // COMPUTER VISION
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight uppercase text-white">
              AI Background Lab[cite: 8]
            </h2>
          </div>
          <p className="text-neutral-400 text-xs font-sans max-w-md leading-relaxed">
            Client-side deep neural network inference for semantic human segmentation and instant alpha channel extraction without cloud roundtrips.[cite: 8]
          </p>
        </motion.div>

        {/* Interactive Lab Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Image Before/After Comparison Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-8 relative rounded-xl border border-neutral-800/80 bg-[#121214] p-4 md:p-6 overflow-hidden shadow-2xl"
          >
            {/* Transparent Grid Pattern Background */}
            <div className="relative w-full h-[360px] md:h-[420px] rounded-lg overflow-hidden bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:12px_12px] bg-[#08080a] flex items-center justify-center">
              
              {/* Badges */}
              <div className="absolute top-3 left-3 z-30 px-2.5 py-1 rounded bg-black/80 border border-neutral-800 text-[10px] text-neutral-300 tracking-wider">
                SOURCE RAW (RGB)[cite: 8]
              </div>
              <div className="absolute top-3 right-3 z-30 px-2.5 py-1 rounded bg-black/80 border border-[#eab308]/40 text-[10px] text-[#eab308] tracking-wider">
                REMBG V2 (MATTE ALPHA)[cite: 8]
              </div>

              {/* Interactive Comparison Canvas Area */}
              <div
                className="relative w-full h-full cursor-ew-resize select-none overflow-hidden"
                onMouseMove={handleSliderMove}
              >
                {/* Image Layer 1: Background Removed / Transparency (Matte) */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="w-full max-w-[500px] h-[320px] rounded-lg bg-gradient-to-r from-neutral-900 to-neutral-950 border border-neutral-800 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#eab30810_1px,transparent_1px),linear-gradient(to_bottom,#eab30810_1px,transparent_1px)] bg-[size:16px_16px]" />
                    <div className="relative z-10 text-center space-y-2">
                      <div className="text-4xl">👩‍💻</div>
                      <div className="text-xs text-[#eab308] font-bold tracking-widest uppercase">
                        [ALPHA CHANNEL EXTRACTED]
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Layer 2: Raw Full Source Image (Clipped by Slider) */}
                <div
                  className="absolute inset-0 p-4 overflow-hidden border-r-2 border-[#eab308]"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <div className="w-full max-w-[500px] h-[320px] rounded-lg bg-neutral-900 border border-neutral-700 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-black" />
                    <div className="relative z-10 text-center space-y-2">
                      <div className="text-4xl">👩‍💻</div>
                      <div className="text-xs text-neutral-300 font-bold tracking-widest uppercase">
                        [RAW SCENE WITH BACKGROUND]
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Divider Handle Slider Icon */}
                <div
                  className="absolute top-0 bottom-0 z-20 w-0.5 bg-[#eab308] flex items-center justify-center"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="w-7 h-7 rounded-full bg-[#eab308] border-2 border-black flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.6)] text-black text-[10px] font-black">
                    ↔
                  </div>
                </div>
              </div>

              {/* Bottom Right Corner Peel Accent */}
              <div className="absolute bottom-0 right-0 w-12 h-12 bg-neutral-200 [clip-path:polygon(100%_0,0_100%,100%_100%)] opacity-90" />
            </div>
          </motion.div>

          {/* Right Column: Model Parameters & Execution Console */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-4 p-6 rounded-xl border border-neutral-800/80 bg-[#121214] space-y-6 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <span className="text-xs font-bold tracking-widest text-neutral-300">
                MODEL PARAMETERS[cite: 8]
              </span>
              <span className="text-xs font-bold text-[#eab308] tracking-widest">
                ONNX WEB[cite: 8]
              </span>
            </div>

            {/* Parameter Bars */}
            <div className="space-y-5 text-xs">
              
              {/* Segmentation Confidence */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] text-neutral-400">
                  <span>SEGMENTATION CONFIDENCE[cite: 8]</span>
                </div>
                <div className="w-full h-2 rounded bg-neutral-900 border border-neutral-800 overflow-hidden">
                  <div className="h-full bg-[#eab308] w-[94%]" />
                </div>
              </div>

              {/* Threshold */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-neutral-400">THRESHOLD[cite: 8]</span>
                  <span className="text-white font-bold">0.94 / 1.0[cite: 8]</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded overflow-hidden">
                  <div className="h-full bg-[#eab308] w-[94%]" />
                </div>
              </div>

              {/* Edge Feather Radius */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-neutral-400">EDGE FEATHER RADIUS[cite: 8]</span>
                </div>
                <div className="w-full h-2 rounded bg-neutral-900 border border-neutral-800 overflow-hidden">
                  <div className="h-full bg-emerald-400 w-[45%]" />
                </div>
              </div>

              {/* Matte Blend */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-neutral-400">MATTE BLEND[cite: 8]</span>
                  <span className="text-white font-bold">1.4 PX[cite: 8]</span>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-neutral-800">
              <button
                onClick={handleRunModel}
                className="w-full py-3 rounded bg-[#eab308] hover:bg-[#facc15] text-black font-extrabold text-xs tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
              >
                <Cpu className={`w-4 h-4 text-black ${isProcessing ? "animate-spin" : ""}`} />
                RUN MODEL (REMBG V2)[cite: 8]
              </button>

              <a
                href="#"
                className="w-full py-2.5 rounded text-neutral-400 hover:text-white text-[11px] font-semibold tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                LAUNCH BATCH LAB STUDIO →[cite: 8]
              </a>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}