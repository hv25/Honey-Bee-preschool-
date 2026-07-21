import React, { useState } from "react";
import { motion } from "motion/react";

export default function InteractiveHive() {
  // We can render a grid of hexagons. 
  // Let's create an elegant grid layout with SVG
  const cols = 12;
  const rows = 5;

  const hexWidth = 100;
  const hexHeight = 86.6; // sqrt(3) * radius
  const radius = 57.7; // radius of hexagon

  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);

  // SVG points for a clean centered hexagon
  const getPoints = (cx: number, cy: number, r: number) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60 * Math.PI) / 180;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(" ");
  };

  const hexes = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = c * (radius * 1.5) + radius;
      const cy = r * hexHeight + (c % 2 === 1 ? hexHeight / 2 : 0) + hexHeight / 2;
      const key = `${r}-${c}`;
      hexes.push({ key, cx, cy });
    }
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden opacity-25 dark:opacity-[0.14] pointer-events-auto select-none">
      <svg
        width="100%"
        height="100%"
        className="w-full h-full"
        style={{ minWidth: "1200px", minHeight: "500px" }}
      >
        {hexes.map((hex) => {
          const isHovered = hoveredIndex === hex.key;
          return (
            <polygon
              key={hex.key}
              points={getPoints(hex.cx, hex.cy, radius - 3)}
              className="transition-all duration-350 cursor-pointer"
              fill={isHovered ? "rgba(251, 191, 36, 0.35)" : "transparent"}
              stroke={isHovered ? "rgba(245, 158, 11, 0.8)" : "rgba(251, 191, 36, 0.12)"}
              strokeWidth={isHovered ? "2.5" : "1"}
              onMouseEnter={() => setHoveredIndex(hex.key)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                transformOrigin: `${hex.cx}px ${hex.cy}px`,
                transform: isHovered ? "scale(1.05)" : "scale(1)",
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
