import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Bee {
  id: number;
  startX: number;
  startY: number;
  speed: number;
  delay: number;
  size: number;
}

export default function FlyingBees() {
  const [bees, setBees] = useState<Bee[]>([]);
  const [clickedBeeId, setClickedBeeId] = useState<number | null>(null);

  // Initialize a few busy bees with randomized entry coordinates & flight paces
  useEffect(() => {
    const initialBees: Bee[] = [
      { id: 1, startX: -50, startY: 15, speed: 14, delay: 0, size: 36 },
      { id: 2, startX: -60, startY: 45, speed: 18, delay: 5, size: 28 },
      { id: 3, startX: -50, startY: 75, speed: 16, delay: 10, size: 32 },
    ];
    setBees(initialBees);
  }, []);

  const handleBeeClick = (id: number) => {
    setClickedBeeId(id);
    setTimeout(() => {
      setClickedBeeId(null);
    }, 1200); // Duration of loop/spin animation
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden select-none">
      <AnimatePresence>
        {bees.map((bee) => {
          const isClicked = clickedBeeId === bee.id;

          return (
            <motion.div
              key={bee.id}
              className="absolute pointer-events-auto cursor-pointer"
              style={{
                top: `${bee.startY}%`,
                width: `${bee.size}px`,
                height: `${bee.size}px`,
              }}
              initial={{ left: "-100px", opacity: 0 }}
              animate={{
                left: "110%",
                opacity: [0, 1, 1, 0],
                // Delightful sinus flight wave tracking path
                y: [0, -35, 35, -20, 40, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: bee.speed,
                delay: bee.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              onClick={() => handleBeeClick(bee.id)}
            >
              {/* Spinning/stunting animation on click */}
              <motion.div
                animate={isClicked ? { rotate: 360, scale: [1, 1.4, 1] } : {}}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="relative w-full h-full"
              >
                {/* Honey bee illustration */}
                <div className="w-full h-full relative">
                  {/* Vibrating wings */}
                  <div
                    className="absolute w-2.5 h-4 bg-sky-200/80 dark:bg-sky-100/90 rounded-full border border-sky-300 origin-bottom"
                    style={{
                      top: "-6px",
                      left: "30%",
                      transform: "rotate(-15deg)",
                      animation: "bee-wing-flutter 0.05s linear infinite alternate",
                    }}
                  />
                  <div
                    className="absolute w-2.5 h-4 bg-sky-200/80 dark:bg-sky-100/90 rounded-full border border-sky-300 origin-bottom"
                    style={{
                      top: "-8px",
                      left: "45%",
                      transform: "rotate(15deg)",
                      animation: "bee-wing-flutter-delayed 0.05s linear infinite alternate",
                    }}
                  />

                  {/* Bee Body: golden & charcoal stripes */}
                  <div className="w-full h-full rounded-full bg-yellow-400 border border-amber-500 flex items-center justify-between overflow-hidden relative shadow-sm">
                    {/* Stripes */}
                    <div className="absolute inset-y-0 left-1/4 w-1.5 bg-slate-900" />
                    <div className="absolute inset-y-0 left-1/2 w-1.5 bg-slate-900" />
                    <div className="absolute inset-y-0 right-1/4 w-1.5 bg-slate-900" />

                    {/* Cute smiling face */}
                    <div className="absolute right-1 top-1.5 flex flex-col gap-0.5 z-10">
                      <div className="w-1 h-1 bg-slate-950 rounded-full" />
                    </div>
                  </div>

                  {/* Little Stinger */}
                  <div
                    className="absolute bg-slate-900 origin-right"
                    style={{
                      left: "-3px",
                      top: "40%",
                      width: "4px",
                      height: "3px",
                      clipPath: "polygon(100% 50%, 0% 0%, 0% 100%)",
                    }}
                  />

                  {/* Click tooltip bubble hint */}
                  {!isClicked && (
                    <span className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 text-[8px] font-black uppercase text-amber-600 px-1 py-0.2 rounded border border-amber-100 shadow-xs opacity-0 hover:opacity-100 transition-opacity">
                      Click!
                    </span>
                  )}
                  {isClicked && (
                    <span className="absolute -top-7 -right-8 bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-md z-20">
                      YAY! 🍯
                    </span>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <style>{`
        @keyframes bee-wing-flutter {
          0% { transform: scaleY(1) rotate(-15deg); }
          100% { transform: scaleY(0.3) rotate(-15deg); }
        }
        @keyframes bee-wing-flutter-delayed {
          0% { transform: scaleY(0.3) rotate(15deg); }
          100% { transform: scaleY(1) rotate(15deg); }
        }
      `}</style>
    </div>
  );
}
