"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface LoadingScreenProps {
  onComplete?: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fillTextRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.style.overflow = "hidden";

    if (prefersReducedMotion) {
      document.body.style.overflow = "";
      setIsFinished(true);
      if (onComplete) onComplete();
      return;
    }

    const counterObj = { value: 1 };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          setIsFinished(true);
          if (onComplete) onComplete();
        },
      });

      // Initial Cinematic Setup
      gsap.set(progressBarRef.current, { scaleX: 0 });
      gsap.set(wrapperRef.current, { scale: 0.96, opacity: 0 });
      if (fillTextRef.current) {
        fillTextRef.current.style.clipPath = "polygon(0 0, 0% 0, 0% 100%, 0 100%)";
      }

      // Professional Cinematic Timeline
      tl.to(wrapperRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
      })
      .to(
        counterObj,
        {
          value: 100,
          duration: 2.8,
          ease: "power3.inOut", // Smooth high-end easing
          onUpdate: () => {
            const currentVal = counterObj.value;
            const formattedVal = Math.floor(currentVal).toString().padStart(2, "0");

            // Direct 60FPS DOM mutation for butter-smooth fill
            if (fillTextRef.current) {
              fillTextRef.current.style.clipPath = `polygon(0 0, ${currentVal}% 0, ${currentVal}% 100%, 0 100%)`;
            }
            if (counterRef.current) {
              counterRef.current.innerText = `${formattedVal}%`;
            }
          },
        },
        "-=0.2"
      )
      .to(
        progressBarRef.current,
        {
          scaleX: 1,
          duration: 2.8,
          ease: "power3.inOut",
        },
        "<"
      )
      // Elegant pause at 100% completion
      .to({}, { duration: 0.3 })
      // High-end cinematic fade out & scale up exit
      .to(wrapperRef.current, {
        scale: 1.04,
        opacity: 0,
        filter: "blur(10px)",
        duration: 0.7,
        ease: "power2.inOut",
      })
      .to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
        },
        "<"
      );
    }, containerRef);

    return () => {
      document.body.style.overflow = "";
      ctx.revert();
    };
  }, [onComplete]);

  if (isFinished) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col justify-between bg-[#050505] p-6 sm:p-12 md:p-16 select-none overflow-hidden"
    >
      {/* Top Header System Info */}
      <div className="flex items-center justify-between text-xs tracking-[0.2em] font-mono text-neutral-500 uppercase">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFD600] animate-pulse" />
          SYS.08 // SECURE_INIT
        </span>
        <span>KHORALACAM © 2026</span>
      </div>

      {/* Main Center Content Wrapper */}
      <div ref={wrapperRef} className="flex flex-col items-center justify-center my-auto gap-3">
        {/* Typography Container */}
        <div className="relative flex items-center justify-center">
          {/* Background Dim Base Text */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[130px] font-black tracking-tighter text-neutral-800 uppercase text-center font-sans">
            KHORALACAM
          </h1>

          {/* Foreground Electric Yellow Text with Laser Clip Sweep */}
          <div
            ref={fillTextRef}
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: "polygon(0 0, 0% 0, 0% 100%, 0 100%)" }}
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[130px] font-black tracking-tighter text-[#FFD600] uppercase text-center font-sans drop-shadow-[0_0_35px_rgba(255,214,0,0.4)]">
              KHORALACAM
            </h1>
          </div>

          {/* Leading Light Edge Flare Effect */}
          <div 
            className="absolute top-0 bottom-0 w-4 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 pointer-events-none mix-blend-screen"
            style={{
              // This flare follows the progress bar visually if needed, or we keep it clean
            }}
          />
        </div>

        {/* Loading Counter & Precision Progress Bar */}
        <div className="w-full max-w-lg flex flex-col items-center gap-2.5 mt-3">
          <div className="flex items-center justify-between w-full font-mono text-xs text-neutral-400 px-1">
            <span className="uppercase tracking-[0.25em] text-[10px] text-neutral-500">
              SYNCHRONIZING MODULES...
            </span>
            <span
              ref={counterRef}
              className="text-2xl sm:text-3xl font-bold text-[#FF3030] tracking-tight tabular-nums drop-shadow-[0_0_15px_rgba(255,48,48,0.5)]"
            >
              01%
            </span>
          </div>

          {/* Precision Thin Progress Bar */}
          <div className="w-full h-[2px] bg-neutral-900 overflow-hidden relative rounded-full">
            <div
              ref={progressBarRef}
              className="absolute inset-0 bg-gradient-to-r from-[#FFD600] to-[#fff] origin-left shadow-[0_0_15px_#FFD600]"
            />
          </div>
        </div>
      </div>

      {/* Bottom Footer Agency Tag */}
      <div className="flex justify-between items-center text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
        <span>CREATIVE PORTFOLIO</span>
        <span>SECURE CONNECTION</span>
      </div>
    </div>
  );
}