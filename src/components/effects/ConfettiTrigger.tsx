import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  angle: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
}

interface ConfettiTriggerProps {
  active: boolean;
  onComplete?: () => void;
}

export default function ConfettiTrigger({ active, onComplete }: ConfettiTriggerProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!active) return;

    const colors = [
      "#facc15", // yellow-400
      "#fb923c", // orange-400
      "#38bdf8", // sky-400
      "#f43f5e", // rose-500
      "#34d399", // emerald-400
      "#a78bfa"  // purple-400
    ];

    // Initialize 80 confetti pieces with explosive angles and velocities
    const initialPieces: ConfettiPiece[] = Array.from({ length: 80 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 6;
      return {
        id: i,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2.5,
        size: Math.random() * 12 + 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed - 4, // upward boost
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 15 - 7
      };
    });

    setPieces(initialPieces);

    // Gravity and physics animation loops
    let animationFrameId: number;
    let ticks = 0;

    const updatePhysics = () => {
      ticks += 1;
      setPieces((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.speedX,
            y: p.y + p.speedY,
            speedY: p.speedY + 0.35, // gravity pulls down
            speedX: p.speedX * 0.98, // air resistance
            rotation: p.rotation + p.rotationSpeed
          }))
          .filter((p) => p.y < window.innerHeight + 50 && p.x > -50 && p.x < window.innerWidth + 50)
      );

      if (ticks < 150) {
        animationFrameId = requestAnimationFrame(updatePhysics);
      } else {
        if (onComplete) onComplete();
      }
    };

    animationFrameId = requestAnimationFrame(updatePhysics);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[80] overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: p.x,
            top: p.y,
            width: `${p.size}px`,
            height: `${p.size * 0.5}px`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? "2px" : "50%",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        />
      ))}
    </div>
  );
}
