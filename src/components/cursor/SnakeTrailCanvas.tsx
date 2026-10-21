"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface SnakeCanvasProps {
  isClicking: boolean;
  isHovering: boolean;
  isTyping: boolean;
  isInputActive: boolean;
}

function SnakeScene({ isClicking, isHovering, isTyping, isInputActive }: SnakeCanvasProps) {
  const { viewport } = useThree();
  const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const smoothMouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const speedRef = useRef(0);

  const numPoints = 35;
  const historyRef = useRef<THREE.Vector3[]>(
    Array.from({ length: numPoints }, () => new THREE.Vector3(0, 0, 0))
  );

  const tubeMeshRef = useRef<THREE.Mesh>(null);
  const headMeshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Custom Requested Color Palette: Red, Yellow, Green, White, Magenta, Teal
  const colors = useMemo(
    () => [
      new THREE.Color("#FF0000"), // Red
      new THREE.Color("#FFD600"), // Yellow
      new THREE.Color("#00FF00"), // Green
      new THREE.Color("#FFFFFF"), // White
      new THREE.Color("#FF00FF"), // Magenta
      new THREE.Color("#008080"), // Teal
    ],
    []
  );

  const currentColor = useRef(new THREE.Color("#FFD600"));

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - mousePos.current.x;
      const dy = e.clientY - mousePos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      speedRef.current = Math.min(25, dist * 0.4);

      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const particleCount = 20;
  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(particleCount * 3);
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, [particleCount]);

  const particleVelocities = useRef<THREE.Vector3[]>(
    Array.from({ length: particleCount }, () => new THREE.Vector3())
  );

  useFrame((state) => {
    if (isInputActive) return;

    // Smooth color change every 20 seconds across requested colors
    const elapsedTime = state.clock.getElapsedTime();
    const cycleDuration = 20; // 20 Seconds per color phase
    const totalColors = colors.length;
    
    const currentIndex = Math.floor(elapsedTime / cycleDuration) % totalColors;
    const nextIndex = (currentIndex + 1) % totalColors;
    const progress = (elapsedTime % cycleDuration) / cycleDuration;

    // Smoothly interpolate current color to next color
    currentColor.current.lerpColors(colors[currentIndex], colors[nextIndex], progress);

    smoothMouse.current.x += (mousePos.current.x - smoothMouse.current.x) * 0.25;
    smoothMouse.current.y += (mousePos.current.y - smoothMouse.current.y) * 0.25;
    speedRef.current *= 0.9;

    const targetX = (smoothMouse.current.x / window.innerWidth) * viewport.width - viewport.width / 2;
    const targetY = -(smoothMouse.current.y / window.innerHeight) * viewport.height + viewport.height / 2;

    const history = historyRef.current;
    history.pop();
    history.unshift(new THREE.Vector3(targetX, targetY, 0));

    // Update Head Position and Color
    if (headMeshRef.current) {
      headMeshRef.current.position.set(targetX, targetY, 0);
      const targetScale = isClicking ? 0.6 : isHovering ? 1.5 : 1.0;
      headMeshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
      
      const headMat = headMeshRef.current.material as THREE.MeshBasicMaterial;
      headMat.color.copy(currentColor.current);
    }

    // Update Tube Mesh Geometry and Color
    if (history.length >= 4 && tubeMeshRef.current) {
      const curve = new THREE.CatmullRomCurve3(history);
      curve.tension = 0.4;

      const tubularSegments = 32;
      const radialSegments = 8;
      const baseRadius = 0.08;

      const oldGeo = tubeMeshRef.current.geometry;
      const newGeo = new THREE.TubeGeometry(curve, tubularSegments, baseRadius, radialSegments, false);

      const posAttr = newGeo.attributes.position;
      const vertex = new THREE.Vector3();

      for (let i = 0; i <= tubularSegments; i++) {
        const ratio = i / tubularSegments; // 0 (Head) to 1 (Tail)
        const thickness = Math.sin(ratio * Math.PI); // Thin at ends, thick in middle
        const currentRadiusScale = Math.max(0.12, thickness);

        const curvePoint = curve.getPointAt(ratio);

        for (let j = 0; j <= radialSegments; j++) {
          const vertexIndex = i * (radialSegments + 1) + j;
          vertex.fromBufferAttribute(posAttr, vertexIndex);

          const dir = vertex.clone().sub(curvePoint);
          dir.multiplyScalar(currentRadiusScale);
          vertex.copy(curvePoint).add(dir);

          posAttr.setXYZ(vertexIndex, vertex.x, vertex.y, vertex.z);
        }
      }
      posAttr.needsUpdate = true;

      tubeMeshRef.current.geometry = newGeo;
      oldGeo.dispose();

      const tubeMat = tubeMeshRef.current.material as THREE.MeshBasicMaterial;
      tubeMat.color.copy(currentColor.current);
    }

    // Particle Burst System Updates
    if (particlesRef.current) {
      const pGeo = particlesRef.current.geometry;
      const pAttr = pGeo.attributes.position;
      const vels = particleVelocities.current;

      const pMat = particlesRef.current.material as THREE.PointsMaterial;
      pMat.color.copy(currentColor.current);

      if (isClicking || isTyping) {
        for (let i = 0; i < particleCount; i++) {
          pAttr.setXYZ(i, targetX, targetY, 0);
          const angle = Math.random() * Math.PI * 2;
          const spd = 0.04 + Math.random() * 0.1;
          vels[i].set(Math.cos(angle) * spd, Math.sin(angle) * spd, 0);
        }
      }

      for (let i = 0; i < particleCount; i++) {
        const x = pAttr.getX(i) + vels[i].x;
        const y = pAttr.getY(i) + vels[i].y;
        const z = pAttr.getZ(i) + vels[i].z;
        pAttr.setXYZ(i, x, y, z);
        vels[i].multiplyScalar(0.9);
      }
      pAttr.needsUpdate = true;
    }
  });

  if (isInputActive) return null;

  return (
    <>
      {/* Snake Body Tube */}
      <mesh ref={tubeMeshRef}>
        <tubeGeometry args={[new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3()]), 32, 0.08, 8, false]} />
        <meshBasicMaterial transparent opacity={0.85} />
      </mesh>

      {/* Snake Head */}
      <mesh ref={headMeshRef}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial transparent opacity={0.95} />
      </mesh>

      {/* Particle Burst System */}
      <points ref={particlesRef} geometry={particleGeo}>
        <pointsMaterial size={0.05} transparent opacity={0.8} />
      </points>
    </>
  );
}

export default function SnakeTrailCanvas(props: any) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <Canvas
        style={{ pointerEvents: "none" }}
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <SnakeScene {...props} />
      </Canvas>
    </div>
  );
}