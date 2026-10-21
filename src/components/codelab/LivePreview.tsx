'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface LivePreviewProps {
  code?: string;
  width?: number;
  onWidthChange?: (newWidth: number) => void;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  code = '',
  width = 480,
  onWidthChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [fps, setFps] = useState(60);
  const [verticesCount, setVerticesCount] = useState(2562);
  const [isResizing, setIsResizing] = useState(false);
  const [coords, setCoords] = useState('[0.00, 0.00, +6.20]');

  // Resizable Handle Dragging Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(260, Math.min(800, window.innerWidth - moveEvent.clientX));
      if (onWidthChange) onWidthChange(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Three.js High-Fidelity 3D Viewport Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 6.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Beautiful 3D Object Group (Main Wireframe + Inner Core + Particles)
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Outer Neon Wireframe Shape
    const outerGeo = new THREE.IcosahedronGeometry(2.6, 3);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0xf5e642,
      wireframe: true,
      roughness: 0.1,
      metalness: 0.9,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    mainGroup.add(outerMesh);

    // Inner Glowing Solid Core
    const innerGeo = new THREE.IcosahedronGeometry(1.4, 2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xf5e642,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerMesh);

    // Surrounding Quantum Particles
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 200;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.03,
      color: 0xf5e642,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // 3. Lighting
    const pointLight = new THREE.PointLight(0xf5e642, 4, 20);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    setVerticesCount(outerGeo.attributes.position.count * 3);

    // 4. Mouse Rotation Interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;
      setCoords(`[${mouseX.toFixed(2)}, ${mouseY.toFixed(2)}, +6.20]`);
    };
    container.addEventListener('mousemove', handleMouseMove);

    // 5. Animation Loop
    let animationFrameId: number;
    let lastTime = performance.now();
    let frames = 0;

    const animate = () => {
      const now = performance.now();
      frames++;
      if (now - lastTime >= 1000) {
        setFps(Math.round((frames * 1000) / (now - lastTime)));
        frames = 0;
        lastTime = now;
      }

      // Smooth Rotations
      outerMesh.rotation.x += 0.004;
      outerMesh.rotation.y += 0.007;

      innerMesh.rotation.x -= 0.008;
      innerMesh.rotation.y -= 0.005;

      particles.rotation.y += 0.002;

      // Mouse Parallax Effect
      mainGroup.rotation.y += (mouseX * 0.5 - mainGroup.rotation.y) * 0.05;
      mainGroup.rotation.x += (-mouseY * 0.5 - mainGroup.rotation.x) * 0.05;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 6. Handle Panel Resize & Canvas Adjustments
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [code]);

  return (
    <div
      style={{ width: `${width}px` }}
      className="bg-[#08080a] border-l border-[#1c1e24] relative flex flex-col justify-between p-3 select-none shrink-0 h-full overflow-hidden"
    >
      {/* Resizable Left Border Drag Handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`absolute top-0 left-0 w-2 h-full cursor-col-resize hover:bg-[#f5e642]/60 transition-all z-30 ${
          isResizing ? 'bg-[#f5e642]' : 'bg-transparent'
        }`}
        title="Drag left to widen live preview"
      />

      {/* Top Overlay HUD Stats */}
      <div className="flex items-center justify-between text-[10px] font-mono z-10">
        <div className="flex items-center gap-2 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold tracking-wider">3D LIVE VIEWPORT</span>
          <span className="text-neutral-600">•</span>
          <span>{fps} FPS</span>
        </div>
        <div className="text-right text-neutral-500 font-mono leading-tight">
          <div>CANVAS: {width}px</div>
          <div>VERTICES: {verticesCount.toLocaleString()}</div>
        </div>
      </div>

      {/* Three.js Render Mount */}
      <div
        ref={mountRef}
        className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing my-1"
      />

      {/* Bottom Status Info */}
      <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500 z-10 border-t border-[#1a1c23] pt-1.5">
        <span className="text-[#f5e642] font-semibold">WEBGL 2.0 • THREE.JS</span>
        <span>COORD: {coords}</span>
      </div>
    </div>
  );
};