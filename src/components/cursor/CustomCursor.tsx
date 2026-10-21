"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SnakeTrailCanvas = dynamic(() => import("./SnakeTrailCanvas"), { ssr: false });

export default function CustomCursor() {
  const [isClient, setIsClient] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isInputActive, setIsInputActive] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Check for touch device, coarse pointer (phones/tablets), or small screens (iPad width < 1024px)
    const isTouchDevice = 
      window.matchMedia("(pointer: coarse)").matches || 
      window.matchMedia("(hover: none)").matches ||
      window.innerWidth < 1024; // Tablets and phones below 1024px width

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isTouchDevice || prefersReducedMotion) {
      setIsEnabled(false);
      return;
    }
    
    setIsEnabled(true);

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 150);
      }
    };

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        setIsInputActive(true);
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        setIsInputActive(false);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], .project-card")) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], .project-card")) {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  if (!isClient || !isEnabled) return null;

  return (
    <SnakeTrailCanvas
      isClicking={isClicking}
      isHovering={isHovering}
      isTyping={isTyping}
      isInputActive={isInputActive}
    />
  );
}