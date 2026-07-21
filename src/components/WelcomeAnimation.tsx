import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, VolumeX, Sparkles, X, RotateCw, Eye } from "lucide-react";

interface Butterfly {
  id: number;
  type: "butterfly" | "bee";
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  wingSpeed: number;
  angle: number;
  targetX: number;
  targetY: number;
}

interface WelcomeAnimationProps {
  onComplete: () => void;
  reduceMotionDefault?: boolean;
}

export default function WelcomeAnimation({ onComplete, reduceMotionDefault = false }: WelcomeAnimationProps) {
  const [reduceMotion, setReduceMotion] = useState(reduceMotionDefault);
  const [isMuted, setIsMuted] = useState(true);
  const [showMbeeSpeech, setShowMbeeSpeech] = useState(false);
  const [animationTime, setAnimationTime] = useState(5); // 5 seconds duration
  const [hasStarted, setHasStarted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Sound synthesizer using Web Audio API
  const playMagicalChime = () => {
    if (isMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Play a happy pentatonic cascade: C5, D5, E5, G5, A5, C6
      const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
      const now = ctx.currentTime;

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Warm triangle wave for chime/xylophone feel
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + index * 0.12);

        // Exponential decay envelope
        gain.gain.setValueAtTime(0.15, now + index * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.12 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.12);
        osc.stop(now + index * 0.12 + 0.6);
      });
    } catch (e) {
      console.warn("Web Audio API not supported or blocked", e);
    }
  };

  // Sound generator for the Honey Bee "buzz"
  const playBeeBuzz = () => {
    if (isMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Sawtooth or triangle for buzzy sound
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, now); // base low frequency buzz
      // Add frequency modulation (vibrato) to sound realistic
      osc.frequency.linearRampToValueAtTime(140, now + 0.1);
      osc.frequency.linearRampToValueAtTime(120, now + 0.2);
      osc.frequency.linearRampToValueAtTime(130, now + 0.3);

      // Low pass filter to keep it soft
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(300, now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      // ignore silently
    }
  };

  // Initialize butterflies
  const [butterflies, setButterflies] = useState<Butterfly[]>([]);
  const butterfliesRef = useRef<Butterfly[]>([]);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

  useEffect(() => {
    // Generate flying bees and butterflies at center of screen (emerging from flower)
    const initialButterflies: Butterfly[] = Array.from({ length: 12 }).map((_, i) => {
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const startX = screenW / 2;
      const startY = screenH / 2 + 100; // near the flower box
      const colors = [
        "rgba(244, 63, 94, 0.95)",  // Pink
        "rgba(251, 191, 36, 0.95)", // Gold/Yellow
        "rgba(56, 189, 248, 0.95)", // Sky Blue
        "rgba(168, 85, 247, 0.95)", // Purple
        "rgba(34, 197, 94, 0.95)",  // Green
        "rgba(249, 115, 22, 0.95)",  // Orange
      ];

      // 8 honey bees (even indices) and 4 butterflies (odd indices)
      const type = i % 3 === 0 ? "butterfly" : "bee";

      return {
        id: i,
        type,
        x: startX + (Math.random() - 0.5) * 40,
        y: startY + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 6,
        vy: -2 - Math.random() * 4, // Fly upwards initially
        size: type === "bee" ? 36 + Math.random() * 10 : 38 + Math.random() * 16,
        color: colors[i % colors.length],
        wingSpeed: type === "bee" ? 22 + Math.random() * 8 : 15 + Math.random() * 10,
        angle: Math.random() * Math.PI * 2,
        targetX: Math.random() * screenW,
        targetY: Math.random() * screenH * 0.7,
      };
    });

    setButterflies(initialButterflies);
    butterfliesRef.current = initialButterflies;
    setHasStarted(true);

    // Show Bee mascot speech bubble after 1.2s
    const speechTimer = setTimeout(() => {
      setShowMbeeSpeech(true);
      playBeeBuzz();
    }, 1200);

    // Countdown timer for automatic transition
    const interval = setInterval(() => {
      setAnimationTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(speechTimer);
      clearInterval(interval);
    };
  }, []);

  // Dedicated effect to handle completion side effects when the countdown hits 0 safely
  useEffect(() => {
    if (animationTime === 0) {
      const handle = setTimeout(() => {
        onComplete();
      }, 0);
      return () => clearTimeout(handle);
    }
  }, [animationTime, onComplete]);

  // Frame simulation loop for Butterfly flight & physics
  useEffect(() => {
    if (reduceMotion) return;

    const updatePhysics = () => {
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const mouse = mouseRef.current;

      const updated = butterfliesRef.current.map((bf) => {
        // Dynamic target updating occasionally
        if (Math.random() < 0.02) {
          bf.targetX = Math.random() * screenW;
          bf.targetY = Math.random() * screenH * 0.75;
        }

        // Vector steering toward target
        const dx = bf.targetX - bf.x;
        const dy = bf.targetY - bf.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 10) {
          bf.vx += (dx / dist) * 0.12;
          bf.vy += (dy / dist) * 0.12;
        }

        // Mouse avoidance physics
        const mdx = bf.x - mouse.x;
        const mdy = bf.y - mouse.y;
        const mdist = Math.hypot(mdx, mdy);
        if (mdist < 140) {
          const force = (140 - mdist) / 140;
          bf.vx += (mdx / mdist) * force * 3.5;
          bf.vy += (mdy / mdist) * force * 3.5;

          // Set new quick escape target
          bf.targetX = bf.x + (mdx / mdist) * 300;
          bf.targetY = bf.y + (mdy / mdist) * 300;
        }

        // Apply friction/drag
        bf.vx *= 0.96;
        bf.vy *= 0.96;

        // Apply velocities
        bf.x += bf.vx;
        bf.y += bf.vy;

        // Visual flight angle
        bf.angle = Math.atan2(bf.vy, bf.vx);

        // Enforce boundary safety
        const pad = 40;
        if (bf.x < pad) { bf.x = pad; bf.vx *= -1; }
        if (bf.x > screenW - pad) { bf.x = screenW - pad; bf.vx *= -1; }
        if (bf.y < pad) { bf.y = pad; bf.vy *= -1; }
        if (bf.y > screenH - pad) { bf.y = screenH - pad; bf.vy *= -1; }

        return bf;
      });

      butterfliesRef.current = updated;
      setButterflies([...updated]);
      requestRef.current = requestAnimationFrame(updatePhysics);
    };

    requestRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [reduceMotion]);

  // Handle pointer tracking
  const handlePointerMove = (e: React.PointerEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  // Play chime sound whenever user toggles mute state on
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      // Delay slightly to allow state to update
      setTimeout(() => playMagicalChime(), 50);
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="fixed inset-0 z-[100] overflow-hidden bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 select-none flex flex-col items-center justify-between p-6 transition-colors duration-500"
    >
      {/* Sparkles / Sunshine overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Sun Ray Glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-amber-200/30 dark:bg-yellow-500/10 blur-[120px] animate-pulse" />

        {/* Clouds drifting */}
        {!reduceMotion && (
          <>
            <motion.div
              initial={{ x: "-20%" }}
              animate={{ x: "120%" }}
              transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
              className="absolute top-[12%] text-white/40 dark:text-slate-800/20 text-6xl opacity-75"
            >
              ☁️
            </motion.div>
            <motion.div
              initial={{ x: "120%" }}
              animate={{ x: "-20%" }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute top-[25%] text-white/30 dark:text-slate-800/20 text-8xl opacity-60"
            >
              ☁️
            </motion.div>
          </>
        )}
      </div>

      {/* Top Bar Controls */}
      <div className="w-full flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={handleMuteToggle}
            className="p-3 rounded-full bg-white/75 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center cursor-pointer"
            title={isMuted ? "Unmute Magic Sounds" : "Mute Sounds"}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="text-yellow-500 animate-bounce" />}
          </button>
          
          <button
            onClick={() => setReduceMotion(!reduceMotion)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold border backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer ${
              reduceMotion 
                ? "bg-yellow-400 text-slate-900 border-yellow-300"
                : "bg-white/75 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800"
            }`}
          >
            <Eye size={12} />
            {reduceMotion ? "Animations Off" : "Standard Mode"}
          </button>
        </div>

        {/* Skip Button and Countdown */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono font-extrabold text-slate-500 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded-md">
            Entering in {animationTime}s
          </span>
          <button
            onClick={onComplete}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-display font-black text-xs transition-all shadow-lg hover:shadow-yellow-400/20 active:scale-95 cursor-pointer"
          >
            Skip Magic <X size={14} />
          </button>
        </div>
      </div>

      {/* Center Welcome Deck */}
      <div className="flex-1 flex flex-col items-center justify-center text-center relative max-w-lg z-10 px-4">
        {/* Rainbow glowing beautifully */}
        <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[350px] sm:w-[480px] h-[200px] pointer-events-none opacity-85 dark:opacity-40">
          <svg viewBox="0 0 100 50" className="w-full h-full">
            <defs>
              <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(239, 68, 68, 0)" />
                <stop offset="15%" stopColor="rgba(239, 68, 68, 0.7)" />
                <stop offset="30%" stopColor="rgba(249, 115, 22, 0.7)" stopOpacity="0.7" />
                <stop offset="45%" stopColor="rgba(234, 179, 8, 0.7)" stopOpacity="0.7" />
                <stop offset="60%" stopColor="rgba(34, 197, 94, 0.7)" stopOpacity="0.7" />
                <stop offset="75%" stopColor="rgba(59, 130, 246, 0.7)" stopOpacity="0.7" />
                <stop offset="90%" stopColor="rgba(168, 85, 247, 0.7)" stopOpacity="0.7" />
                <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
              </linearGradient>
            </defs>
            <path
              d="M 5,50 A 45,45 0 0,1 95,50"
              fill="none"
              stroke="url(#rainbowGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              className="animate-[pulse_4s_infinite]"
            />
          </svg>
        </div>

        {/* Central School Logo Container (Butterflies emerge from here) */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, delay: 0.2 }}
          className="relative bg-white dark:bg-slate-900 border-2 border-yellow-400 p-8 rounded-[48px] shadow-2xl flex flex-col items-center gap-4 max-w-sm mb-12"
        >
          {/* Sparkles rotating background */}
          <div className="absolute inset-0 rounded-[48px] overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-200/20 dark:bg-yellow-500/5 rounded-full blur-xl animate-pulse" />
          </div>

          <div className="w-20 h-20 rounded-full bg-yellow-100 dark:bg-yellow-950/50 flex items-center justify-center border-2 border-yellow-400 shadow-inner relative">
            <span className="text-4xl">🐝</span>
            {/* Spinning/pulsing halo */}
            <span className="absolute inset-0 rounded-full border border-dashed border-yellow-400 animate-[spin_12s_linear_infinite]" />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-600 dark:text-yellow-400 font-mono block mb-1">
              Welcome to early learning
            </span>
            <h2 className="font-display font-black text-2xl text-slate-900 dark:text-white tracking-tight leading-none">
              Honey Bees
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 font-sans font-medium">
              Pre-School & Kindergarten Academy
            </p>
          </div>

          <div className="flex gap-1.5 items-center bg-yellow-50 dark:bg-yellow-950/30 px-3 py-1.5 rounded-full border border-yellow-200/50 dark:border-yellow-900/40">
            <Sparkles size={11} className="text-yellow-500 animate-spin" />
            <span className="text-[9px] font-extrabold text-yellow-700 dark:text-yellow-300 font-sans tracking-wide">
              DISCOVER MAGICAL DISCOVERY
            </span>
          </div>
        </motion.div>
      </div>

      {/* Bouncing Honey Bee Mascot & Speech Bubble */}
      <AnimatePresence>
        {showMbeeSpeech && (
          <motion.div
            initial={{ x: -150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -150, opacity: 0 }}
            transition={{ type: "spring", damping: 14 }}
            className="absolute bottom-28 left-6 sm:left-12 z-20 flex items-end gap-3 pointer-events-auto"
          >
            {/* Bouncing Bee Mascot SVG */}
            <div 
              onClick={() => { playBeeBuzz(); playMagicalChime(); }}
              className="w-20 h-20 relative cursor-pointer active:scale-95 transition-transform"
              title="Click me for a buzz!"
            >
              {/* Flapping wings */}
              <div className="absolute top-1 left-3 w-7 h-5 bg-sky-200/80 rounded-full border border-sky-300 origin-bottom-right rotate-[-20deg] animate-[ping_0.2s_infinite]" />
              <div className="absolute top-1 right-3 w-7 h-5 bg-sky-200/80 rounded-full border border-sky-300 origin-bottom-left rotate-[20deg] animate-[ping_0.18s_infinite]" />
              
              {/* Smiling Bee Body */}
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                {/* Yellow body */}
                <ellipse cx="50" cy="55" rx="35" ry="28" fill="#FBBF24" />
                {/* Black stripes */}
                <path d="M 40,28 Q 38,55 40,82 M 50,27 Q 48,55 50,83 M 60,28 Q 58,55 60,82" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" fill="none" />
                {/* Cheerful face */}
                <circle cx="70" cy="50" r="4.5" fill="#1E293B" />
                <circle cx="73" cy="56" r="3" fill="#F43F5E" /> {/* blush */}
                <path d="M 68,60 Q 72,64 74,60" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
                {/* Antennae */}
                <path d="M 60,30 Q 68,15 72,18" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
                <circle cx="72" cy="18" r="3" fill="#1E293B" />
              </svg>
            </div>

            {/* Speech bubble */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-[11px] font-sans font-extrabold px-4 py-3 rounded-2xl rounded-bl-none border border-yellow-400 dark:border-yellow-500 shadow-md max-w-[180px] sm:max-w-[220px]"
            >
              <p className="leading-tight">
                Buzz Buzz! 🐝 Welcome to Honey Bees! Tap me or pointer near the butterflies to play! 🌸
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swaying Garden Flowers at the bottom */}
      <div className="w-full h-24 relative flex items-end justify-center gap-12 sm:gap-20 overflow-visible z-10 border-t border-yellow-200/20 pointer-events-none">
        {/* Flower 1 */}
        <div className="flex flex-col items-center justify-end h-full">
          <div className="w-10 h-10 relative animate-[bounce_4s_infinite_ease-in-out] origin-bottom">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Petals */}
              <circle cx="50" cy="25" r="18" fill="#F43F5E" />
              <circle cx="25" cy="50" r="18" fill="#F43F5E" />
              <circle cx="75" cy="50" r="18" fill="#F43F5E" />
              <circle cx="50" cy="75" r="18" fill="#F43F5E" />
              {/* Center */}
              <circle cx="50" cy="50" r="16" fill="#FBBF24" />
            </svg>
          </div>
          <div className="w-1.5 h-12 bg-emerald-500 rounded-full" />
        </div>

        {/* Flower 2 (Centerpiece - butterflies emerge around here) */}
        <div className="flex flex-col items-center justify-end h-full relative">
          <div className="w-14 h-14 relative animate-[bounce_3s_infinite_ease-in-out_0.5s] origin-bottom">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Sunflower design */}
              <path d="M 50,50 L 50,10 L 50,50 L 90,50 L 50,50 L 50,90 L 50,50 L 10,50 L 50,50 L 22,22 L 50,50 L 78,78 L 50,50 L 78,22 L 50,50 L 22,78 Z" stroke="#FBBF24" strokeWidth="14" strokeLinecap="round" />
              <circle cx="50" cy="50" r="20" fill="#78350F" />
            </svg>
          </div>
          <div className="w-2 h-14 bg-emerald-500 rounded-full" />
        </div>

        {/* Flower 3 */}
        <div className="flex flex-col items-center justify-end h-full">
          <div className="w-11 h-11 relative animate-[bounce_5.2s_infinite_ease-in-out_0.2s] origin-bottom">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Tulip design */}
              <path d="M 25,75 C 10,40 40,20 50,45 C 60,20 90,40 75,75 Z" fill="#A855F7" />
              <path d="M 35,75 C 35,45 65,45 65,75 Z" fill="#C084FC" />
            </svg>
          </div>
          <div className="w-1.5 h-10 bg-emerald-500 rounded-full" />
        </div>
      </div>

      {/* Flying Bees & Butterflies Elements (Absolutely Positioned and Animated) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-25">
        {butterflies.map((bf) => {
          // Calculate wings flapping using simple CSS
          return (
            <div
              key={bf.id}
              style={{
                position: "absolute",
                left: bf.x,
                top: bf.y,
                width: bf.size,
                height: bf.size,
                transform: `translate(-50%, -50%) rotate(${bf.angle + Math.PI/2}rad)`,
                transition: reduceMotion ? "all 0.1s ease-out" : "none",
              }}
              className="pointer-events-auto"
            >
              <div 
                style={{
                  width: "100%",
                  height: "100%",
                  perspective: "200px",
                }}
                className="relative flex items-center justify-center cursor-pointer"
              >
                {bf.type === "bee" ? (
                  <>
                    {/* Left wing of Bee */}
                    <div
                      style={{
                        position: "absolute",
                        right: "48%",
                        width: "44%",
                        height: "70%",
                        transformOrigin: "right center",
                        animation: reduceMotion ? "none" : `flap-left ${1 / bf.wingSpeed}s infinite ease-in-out alternate`,
                      }}
                    >
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Cute translucent white/sky-blue wings */}
                        <path d="M 100,50 C 70,10 10,20 20,50 C 30,70 80,75 100,50 Z" fill="rgba(186, 230, 253, 0.75)" stroke="rgba(125, 211, 252, 0.9)" strokeWidth="3" />
                      </svg>
                    </div>

                    {/* Right wing of Bee */}
                    <div
                      style={{
                        position: "absolute",
                        left: "48%",
                        width: "44%",
                        height: "70%",
                        transformOrigin: "left center",
                        animation: reduceMotion ? "none" : `flap-right ${1 / bf.wingSpeed}s infinite ease-in-out alternate`,
                      }}
                    >
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <path d="M 0,50 C 30,10 90,20 80,50 C 70,70 20,75 0,50 Z" fill="rgba(186, 230, 253, 0.75)" stroke="rgba(125, 211, 252, 0.9)" strokeWidth="3" />
                      </svg>
                    </div>

                    {/* Cute fat bee body */}
                    <div className="absolute w-[45%] h-[80%] z-10">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Stinger at the bottom/back */}
                        <path d="M 50,85 L 45,98 L 55,98 Z" fill="#1E293B" />
                        {/* Chubby yellow body */}
                        <ellipse cx="50" cy="50" rx="30" ry="40" fill="#FBBF24" />
                        {/* Black stripes */}
                        <ellipse cx="50" cy="30" rx="27" ry="6" fill="#1E293B" />
                        <ellipse cx="50" cy="50" rx="30" ry="7" fill="#1E293B" />
                        <ellipse cx="50" cy="70" rx="26" ry="6" fill="#1E293B" />
                        {/* Head */}
                        <circle cx="50" cy="18" r="14" fill="#1E293B" />
                        {/* Antennas */}
                        <path d="M 45,10 Q 38,0 35,2" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                        <path d="M 55,10 Q 62,0 65,2" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                        {/* Antenna tips */}
                        <circle cx="35" cy="2" r="2.5" fill="#1E293B" />
                        <circle cx="65" cy="2" r="2.5" fill="#1E293B" />
                        {/* Big happy eyes */}
                        <circle cx="44" cy="16" r="3" fill="#FFF" />
                        <circle cx="56" cy="16" r="3" fill="#FFF" />
                        <circle cx="44" cy="16" r="1.5" fill="#000" />
                        <circle cx="56" cy="16" r="1.5" fill="#000" />
                      </svg>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Left wing */}
                    <div
                      style={{
                        position: "absolute",
                        right: "50%",
                        width: "48%",
                        height: "90%",
                        transformOrigin: "right center",
                        animation: reduceMotion ? "none" : `flap-left ${1 / bf.wingSpeed}s infinite ease-in-out alternate`,
                      }}
                    >
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Upper Wing */}
                        <path d="M 100,50 C 70,5 20,5 30,50 C 40,75 80,75 100,50 Z" fill={bf.color} />
                        {/* Lower Wing */}
                        <path d="M 100,50 C 80,75 40,100 50,75 C 60,60 90,55 100,50 Z" fill={bf.color} opacity="0.85" />
                        {/* Wing decorative circle */}
                        <circle cx="65" cy="40" r="10" fill="#FFF" opacity="0.6" />
                        <circle cx="65" cy="40" r="5" fill="#1E293B" opacity="0.7" />
                      </svg>
                    </div>

                    {/* Right wing */}
                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        width: "48%",
                        height: "90%",
                        transformOrigin: "left center",
                        animation: reduceMotion ? "none" : `flap-right ${1 / bf.wingSpeed}s infinite ease-in-out alternate`,
                      }}
                    >
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Upper Wing */}
                        <path d="M 0,50 C 30,5 80,5 70,50 C 60,75 20,75 0,50 Z" fill={bf.color} />
                        {/* Lower Wing */}
                        <path d="M 0,50 C 20,75 60,100 50,75 C 40,60 10,55 0,50 Z" fill={bf.color} opacity="0.85" />
                        {/* Wing decorative circle */}
                        <circle cx="35" cy="40" r="10" fill="#FFF" opacity="0.6" />
                        <circle cx="35" cy="40" r="5" fill="#1E293B" opacity="0.7" />
                      </svg>
                    </div>

                    {/* Central Body & Antennae */}
                    <svg viewBox="0 0 20 100" className="absolute w-[15%] h-[80%] z-10">
                      {/* Body */}
                      <ellipse cx="10" cy="50" rx="4" ry="30" fill="#1E293B" />
                      {/* Head */}
                      <circle cx="10" cy="18" r="6" fill="#1E293B" />
                      {/* Antennae */}
                      <path d="M 8,14 Q 2,2 0,5" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                      <path d="M 12,14 Q 18,2 20,5" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                    </svg>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Injection of Tailwind Custom keyframe styles for standard wing-flapping */}
      <style>{`
        @keyframes flap-left {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(74deg); }
        }
        @keyframes flap-right {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(-74deg); }
        }
      `}</style>
    </div>
  );
}
