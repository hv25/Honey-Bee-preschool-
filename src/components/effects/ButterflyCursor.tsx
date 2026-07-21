import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface Particle {
  id: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
}

export default function ButterflyCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastPosition = useRef({ x: 0, y: 0 });

  // Spring values for butterly movement
  const butterflyX = useMotionValue(-100);
  const butterflyY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 120, mass: 0.8 };
  const smoothX = useSpring(butterflyX, springConfig);
  const smoothY = useSpring(butterflyY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      butterflyX.set(e.clientX - 16);
      butterflyY.set(e.clientY - 16);

      // Spawn trail particles when cursor moves significantly
      const dist = Math.hypot(e.clientX - lastPosition.current.x, e.clientY - lastPosition.current.y);
      if (dist > 18) {
        setParticles((prev) => [
          ...prev.slice(-15), // keep last 15 particles
          {
            id: Date.now() + Math.random(),
            x: e.clientX,
            y: e.clientY + (window.scrollY || 0),
            scale: Math.random() * 0.8 + 0.4,
            opacity: 1,
          },
        ]);
        lastPosition.current = { x: e.clientX, y: e.clientY };
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [butterflyX, butterflyY]);

  // Fade and clean up particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({ ...p, opacity: p.opacity - 0.08, scale: p.scale - 0.04 }))
          .filter((p) => p.opacity > 0)
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* 1. Golden Glitter Sparkles Trail */}
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute bg-gradient-to-r from-yellow-300 to-amber-400 rounded-full blur-[1px]"
            style={{
              left: p.x,
              top: p.y - (window.scrollY || 0),
              width: `${10 * p.scale}px`,
              height: `${10 * p.scale}px`,
              opacity: p.opacity,
              transform: "translate(-50%, -50%)",
              transition: "opacity 0.05s ease, transform 0.05s ease",
            }}
          />
        ))}
      </div>

      {/* 2. Floating 3D Butterfly */}
      <motion.div
        className="pointer-events-none fixed z-50 w-8 h-8"
        style={{
          left: smoothX,
          top: smoothY,
        }}
      >
        <div className="relative w-full h-full animate-pulse">
          {/* Wings Wrapper with 3D Flapping animation */}
          <div className="flex items-center justify-center w-full h-full relative perspective-[400px]">
            {/* Left Wing */}
            <div
              className="absolute right-1/2 w-4 h-6 origin-right bg-gradient-to-l from-orange-400 to-yellow-300 rounded-l-full shadow-md shadow-orange-500/20"
              style={{
                animation: "wing-flap-left 0.18s ease-in-out infinite alternate",
              }}
            >
              {/* Patterns */}
              <div className="w-1.5 h-1.5 bg-white/70 rounded-full absolute top-1 left-1 blur-[0.5px]" />
              <div className="w-1 h-1 bg-amber-600 rounded-full absolute bottom-1.5 left-2" />
            </div>

            {/* Butterfly Center Body */}
            <div className="w-1 h-5 bg-amber-950 rounded-full z-10 relative shadow-sm" />

            {/* Right Wing */}
            <div
              className="absolute left-1/2 w-4 h-6 origin-left bg-gradient-to-r from-orange-400 to-yellow-300 rounded-r-full shadow-md shadow-orange-500/20"
              style={{
                animation: "wing-flap-right 0.18s ease-in-out infinite alternate",
              }}
            >
              {/* Patterns */}
              <div className="w-1.5 h-1.5 bg-white/70 rounded-full absolute top-1 right-1 blur-[0.5px]" />
              <div className="w-1 h-1 bg-amber-600 rounded-full absolute bottom-1.5 right-2" />
            </div>
          </div>
        </div>

        {/* Global Flap Animations inside scope */}
        <style>{`
          @keyframes wing-flap-left {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(70deg); }
          }
          @keyframes wing-flap-right {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(-70deg); }
          }
        `}</style>
      </motion.div>
    </>
  );
}
