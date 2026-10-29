"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "@/animations/gsapConfig";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "HOME", href: "#home" },
  { name: "VISION", href: "#vision" },
  { name: "STACK", href: "#stack" },
  { name: "PROJECTS", href: "#projects" },
  { name: "CODE LAB", href: "#codelab" },
  { name: "AI VISION", href: "#aivision" },
  { name: "3D GAMES", href: "#games" },
];

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("HOME");
  const [timeString, setTimeString] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Live UTC-7 SF Clock Logic
 useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      
      // India (IST) time format karne ke liye
      const indiaTimeStr = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // 24-hour format ke liye (agar 12-hour chahiye toh true kar dein)
      }).format(now);

      setTimeString(indiaTimeStr);
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // GSAP Initial Entrance Sequence
  useEffect(() => {
    if (!navContainerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(navContainerRef.current, {
        y: -30,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4 px-6 bg-slate-950/80 backdrop-blur-md border-b border-neutral-900/80">
      <div
        ref={navContainerRef}
        className="max-w-[1500px] mx-auto flex items-center justify-between gap-4 font-mono text-xs tracking-wider"
      >
        {/* 1. Left Logo Section */}
        <a href="#home" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-md bg-[#eab308] text-black font-extrabold flex items-center justify-center text-sm shadow-[0_0_15px_rgba(234,179,8,0.4)] group-hover:scale-105 transition-transform">
            Nk
          </div>
          <div className="flex items-center gap-1.5 font-bold text-white text-sm">
            <span>Naushad</span>
            <span className="text-[#eab308]">//</span>
            <span className="text-[#eab308]"></span>
          </div>
        </a>

        {/* 2. Availability Status Badge (Hidden on mobile/tablet) */}
        <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-800 bg-neutral-950/60 text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-[#eab308] animate-pulse" />
          <span>AVAILABLE FOR PROJECTS • WORLDWIDE</span>
        </div>

        {/* 3. Center Navigation Capsule (Desktop Only) */}
        <nav className="hidden lg:flex items-center gap-1 px-2 py-1.5 rounded-full border border-neutral-800/80 bg-neutral-900/40 backdrop-blur-xl">
          {navItems.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setActiveTab(item.name)}
                className={`relative px-3.5 py-1.5 rounded-full transition-colors duration-200 text-[11px] font-semibold whitespace-nowrap ${
                  isActive ? "text-[#eab308]" : "text-neutral-400 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeGlowTab"
                    className="absolute inset-0 rounded-full bg-[#eab308]/10 border border-[#eab308]/30 shadow-[0_0_12px_rgba(234,179,8,0.25)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.name}</span>
              </a>
            );
          })}
        </nav>

        {/* 4. Live SF Time Badge (Hidden on small mobile) */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-800 bg-neutral-950/60 text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-neutral-300">TM</span>
          <span className="font-bold text-[#eab308] min-w-[65px]">
            {timeString || "11:04:33"}
          </span>
          <span className="text-[10px] text-neutral-500">IST / UTC+5:30</span>
        </div>

        {/* Right Side Actions Container */}
        <div className="flex items-center gap-3">
          {/* 5. Right Action Button */}
          <a
            href="#contact"
            className="hidden sm:inline-block px-5 py-2 rounded-md bg-[#eab308] hover:bg-[#facc15] text-black font-extrabold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(234,179,8,0.35)] hover:shadow-[0_0_25px_rgba(234,179,8,0.55)] active:scale-95"
          >
            CONNECT →
          </a>

          {/* 6. Mobile Menu Hamburger Toggle Button (Visible on tablet & mobile) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border border-neutral-800 bg-neutral-950 text-neutral-300 hover:text-[#eab308] transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Dropdown Navigation Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="lg:hidden absolute top-full left-0 right-0 bg-slate-950/95 border-b border-neutral-800 px-6 py-6 space-y-4 shadow-2xl backdrop-blur-xl"
        >
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    setActiveTab(item.name);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-xs font-semibold py-2 px-3 rounded-md transition-colors ${
                    isActive
                      ? "bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/30"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900/50"
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-neutral-800 flex flex-col sm:hidden gap-3">
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-md bg-[#eab308] text-black font-extrabold text-xs text-center tracking-wider shadow-[0_0_20px_rgba(234,179,8,0.35)]"
            >
              CONNECT →
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
}