import React from "react";
import { motion } from "motion/react";

interface BloomingFlowerProps {
  color?: string;
  size?: number;
  className?: string;
}

export default function BloomingFlowers({ color = "#facc15", size = 64, className = "" }: BloomingFlowerProps) {
  // Petals layout for custom flower rendering
  const petalCount = 8;
  const angles = Array.from({ length: petalCount }).map((_, i) => (i * 360) / petalCount);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`} style={{ width: size, height: size }}>
      {/* 1. Stem and leaves */}
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="absolute inset-0"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-40px" }}
      >
        {/* Animated Stem */}
        <motion.path
          d="M50,90 Q50,70 50,50"
          stroke="#22c55e"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0 },
            visible: { pathLength: 1, transition: { duration: 0.6, ease: "easeOut" } }
          }}
        />

        {/* Left Leaf */}
        <motion.path
          d="M50,75 C35,70 30,60 48,65"
          fill="#16a34a"
          variants={{
            hidden: { scale: 0, opacity: 0 },
            visible: { scale: 1, opacity: 1, transition: { delay: 0.4, duration: 0.4 } }
          }}
        />

        {/* Right Leaf */}
        <motion.path
          d="M50,68 C65,63 70,53 52,58"
          fill="#16a34a"
          variants={{
            hidden: { scale: 0, opacity: 0 },
            visible: { scale: 1, opacity: 1, transition: { delay: 0.5, duration: 0.4 } }
          }}
        />
      </motion.svg>

      {/* 2. Interactive Blooming Petals */}
      <motion.div
        initial="closed"
        whileInView="bloomed"
        viewport={{ once: false, margin: "-45px" }}
        variants={{
          closed: { scale: 0, rotate: -45 },
          bloomed: { 
            scale: 1, 
            rotate: 0,
            transition: { 
              type: "spring", 
              stiffness: 70, 
              damping: 12, 
              delay: 0.3 
            } 
          }
        }}
        whileHover={{ scale: 1.15, rotate: 15 }}
        className="relative flex items-center justify-center z-10 cursor-pointer"
        style={{ width: size * 0.75, height: size * 0.75 }}
      >
        {/* Render overlapping Petals */}
        {angles.map((angle, idx) => (
          <div
            key={idx}
            className="absolute rounded-full opacity-90 shadow-sm"
            style={{
              width: "44%",
              height: "44%",
              backgroundColor: color,
              left: "28%",
              top: "28%",
              transform: `rotate(${angle}deg) translateY(-50%)`,
              border: "1.5px solid rgba(251, 191, 36, 0.4)",
            }}
          />
        ))}

        {/* Inner Golden disk florets / pistil */}
        <div className="absolute w-2/5 h-2/5 bg-orange-500 rounded-full border border-yellow-300 flex items-center justify-center z-20 shadow-inner">
          {/* Smiley Face / Seed patterns */}
          <div className="text-[10px] select-none">☺</div>
        </div>
      </motion.div>
    </div>
  );
}
