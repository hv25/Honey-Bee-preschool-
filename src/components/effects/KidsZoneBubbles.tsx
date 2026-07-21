import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  drift: number;
}

export default function KidsZoneBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [popScore, setPopScore] = useState(0);

  // Initialize bubbles
  useEffect(() => {
    const createBubble = () => {
      const colors = [
        "rgba(14, 165, 233, 0.3)",  // Sky
        "rgba(244, 63, 94, 0.3)",   // Rose
        "rgba(168, 85, 247, 0.3)",  // Purple
        "rgba(234, 179, 8, 0.3)",   // Yellow
        "rgba(34, 197, 94, 0.3)"    // Green
      ];
      
      const newBubble: Bubble = {
        id: Date.now() + Math.random(),
        x: Math.random() * 85 + 5, // percentage
        y: 105, // start below viewport
        size: Math.random() * 45 + 25, // diameter
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 8 + 6, // float up duration
        drift: Math.random() * 20 - 10 // side-to-side wobble
      };

      setBubbles((prev) => [...prev.slice(-30), newBubble]);
    };

    // Spawn initial bubbles
    for (let i = 0; i < 8; i++) {
      setTimeout(createBubble, i * 600);
    }

    const interval = setInterval(createBubble, 1400);
    return () => clearInterval(interval);
  }, []);

  const popBubble = (id: number) => {
    setPopScore((prev) => prev + 1);
    setBubbles((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 select-none">
      {/* 1. Playful pop scoreboard */}
      <div className="absolute top-4 left-4 bg-white/80 dark:bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-yellow-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-yellow-400 flex items-center gap-1.5 shadow-sm pointer-events-auto">
        <span>🫧 Pop Count:</span>
        <motion.span 
          key={popScore}
          initial={{ scale: 0.6, y: -5 }}
          animate={{ scale: 1, y: 0 }}
          className="font-black bg-yellow-400 dark:bg-yellow-500/20 text-slate-900 dark:text-yellow-400 px-2 py-0.5 rounded-md font-mono"
        >
          {popScore}
        </motion.span>
      </div>

      {/* 2. Floating glassy bubble list */}
      <AnimatePresence>
        {bubbles.map((b) => (
          <motion.div
            key={b.id}
            className="absolute pointer-events-auto cursor-pointer rounded-full"
            style={{
              left: `${b.x}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              backgroundColor: b.color,
              backdropFilter: "blur(1px)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              boxShadow: "inset -4px -4px 10px rgba(0,0,0,0.05), inset 4px 4px 10px rgba(255,255,255,0.4)",
            }}
            initial={{ y: "110vh", opacity: 0 }}
            animate={{
              y: "-10vh",
              opacity: [0, 1, 1, 0],
              x: [0, b.drift, -b.drift, b.drift, 0],
            }}
            exit={{
              scale: 1.4,
              opacity: 0,
              transition: { duration: 0.15 }
            }}
            transition={{
              y: { duration: b.speed, ease: "linear" },
              opacity: { duration: b.speed, ease: "linear" },
              x: { duration: b.speed, ease: "easeInOut", repeat: Infinity }
            }}
            onMouseEnter={() => popBubble(b.id)}
            onClick={() => popBubble(b.id)}
          >
            {/* Bubble shine reflection */}
            <div className="absolute top-[15%] left-[15%] w-[25%] h-[25%] bg-white rounded-full opacity-60" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
