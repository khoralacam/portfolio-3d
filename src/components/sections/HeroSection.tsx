"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/animations/gsapConfig";
import Hero3DCanvas from "@/components/canvas/Hero3DCanvas";
import { ArrowRight, Terminal } from "lucide-react";

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-anim", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-[calc(100vh-80px)] w-full flex items-center justify-center px-6 pt-10 pb-16 bg-[#0a0a0a] text-white overflow-hidden font-mono"
    >
      <div className="max-w-[1500px] w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Content */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* System Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-neutral-800 bg-neutral-900/60 text-xs text-neutral-400 hero-anim">
            <span className="w-2 h-2 rounded-full bg-[#eab308] animate-pulse" />
            <span className="tracking-widest">SYSTEM STATUS: OPERATIONAL // INDEPENDENT DEVELOPER</span>[cite: 4]
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05] hero-anim">
            I BUILD DIGITAL <br />
            <span className="text-[#eab308]">EXPERIENCES</span> <br />
            & 3D WORLDS[cite: 4]
          </h1>

          {/* Description Paragraph */}
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed font-sans hero-anim">
            Senior Full Stack Architect engineering low-latency distributed microservices, GPU-accelerated WebGL environments, and responsive speculative user interfaces. Merging deep compute with spatial sensory graphics.[cite: 4]
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-2 hero-anim">
            <a
              href="#projects"
              className="px-6 py-3 rounded-md bg-[#eab308] hover:bg-[#facc15] text-black font-extrabold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(234,179,8,0.35)] flex items-center gap-2 active:scale-95"
            >
              EXPLORE MY WORK →[cite: 4]
            </a>
            <a
              href="#codelab"
              className="px-6 py-3 rounded-md border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-800 text-white font-semibold text-xs tracking-wider transition-all flex items-center gap-2 active:scale-95"
            >
              <Terminal className="w-4 h-4 text-[#eab308]" />
              ENTER 3D PLAYGROUND[cite: 4]
            </a>
          </div>

          {/* Bottom Specs Footer */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-neutral-900 text-xs hero-anim">
            <div>
              <p className="text-neutral-500 text-[10px]">ARCH</p>
              <p className="font-bold text-white tracking-wider mt-0.5">HYBRID 3D</p>[cite: 4]
            </div>
            <div>
              <p className="text-neutral-500 text-[10px]">ENGINE</p>
              <p className="font-bold text-[#eab308] tracking-wider mt-0.5">WEBGL 2.0</p>[cite: 4]
            </div>
            <div>
              <p className="text-neutral-500 text-[10px]">PIPELINE</p>
              <p className="font-bold text-white tracking-wider mt-0.5">NEXT.JS 15</p>[cite: 4]
            </div>
          </div>

        </div>

        {/* Right Column: Three.js Holographic Viewport Frame */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="relative w-full h-[480px] sm:h-[520px] rounded-xl border border-neutral-800 bg-neutral-950/80 p-4 flex flex-col justify-between shadow-2xl backdrop-blur-xl">
            
            {/* Top Viewport Header */}
            <div className="flex items-center justify-between text-[11px] text-neutral-400 border-b border-neutral-900 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-neutral-200">RENDER: DYNAMIC_BUFFER</span>[cite: 4]
              </div>
              <span className="text-[#eab308]">LAT 37.7749° N // LNG 122.4194° W</span>[cite: 4]
            </div>

            {/* Three.js Canvas Container */}
            <div className="flex-1 w-full my-2">
              <Hero3DCanvas />
            </div>

            {/* Bottom Viewport Footer */}
            <div className="pt-3 border-t border-neutral-900 text-[10px] text-neutral-500 flex items-center justify-between">
              <span>VIEWPORT 01 // 3D PORTRAIT[cite: 4]</span>
              <span className="text-[#eab308]">FPS: 60.00</span>[cite: 4]
            </div>
            <div className="text-[9px] text-neutral-600 mt-1">
              [REPLACEABLE PERSONAL PORTRAIT MODULE // GLSL SHADER READY][cite: 4]
            </div>

          </div>
        </div>

      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-6 hidden xl:flex items-center gap-2 text-[10px] text-neutral-500">
        <span className="w-1.5 h-1.5 rounded-full bg-[#eab308] animate-bounce" />
        <span>SCROLL TO INITIALIZE RUNTIME</span>[cite: 4]
      </div>
    </section>
  );
}