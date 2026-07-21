import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

interface Firefly {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export default function Fireflies() {
  const [fireflies, setFireflies] = useState<Firefly[]>([]);

  useEffect(() => {
    // Generate 15 fireflies distributed across the screen height & width
    const items: Firefly[] = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 95,
      y: Math.random() * 90 + 5,
      size: Math.random() * 4 + 2, // size in px
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 4
    }));
    setBehaviors(items);
  }, []);

  const setBehaviors = (items: Firefly[]) => {
    setFireflies(items);
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-15 overflow-hidden select-none">
      {fireflies.map((f) => (
        <motion.div
          key={f.id}
          className="absolute rounded-full bg-yellow-300 shadow-[0_0_8px_4px_rgba(234,179,8,0.5)]"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
          }}
          animate={{
            y: [0, -40, 20, -10, 0],
            x: [0, 30, -20, 15, 0],
            opacity: [0, 0.8, 0.2, 0.9, 0],
          }}
          transition={{
            duration: f.duration,
            delay: f.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
