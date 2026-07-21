import React from "react";
import { Sparkles, Calendar, ArrowRight, ShieldCheck, Heart, Award } from "lucide-react";
import { motion } from "motion/react";
import InteractiveHive from "./effects/InteractiveHive";
import BloomingFlowers from "./effects/BloomingFlowers";

interface HeroProps {
  onBookTourClick: () => void;
  onExploreProgramsClick: () => void;
}

export default function Hero({ onBookTourClick, onExploreProgramsClick }: HeroProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center bg-gradient-to-b from-yellow-50/50 via-white to-sky-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden py-12 md:py-20 transition-colors duration-350">
      {/* Abstract Background Blur Blobs */}
      <div className="absolute top-1/4 left-1/10 w-72 h-72 bg-yellow-200/40 dark:bg-yellow-500/10 rounded-full filter blur-3xl animate-blob-bounce pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-sky-200/40 dark:bg-sky-500/10 rounded-full filter blur-3xl animate-blob-bounce animation-delay-2000 pointer-events-none" />
      <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-orange-200/20 dark:bg-orange-500/5 rounded-full filter blur-3xl animate-blob-bounce animation-delay-4000 pointer-events-none" />

      {/* Interactive Honeycomb Hive Background */}
      <InteractiveHive />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 border border-orange-150 dark:border-orange-900/30 px-4 py-2 rounded-full shadow-xs mx-auto lg:mx-0"
            >
              <Sparkles size={14} className="text-orange-500" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-700 dark:text-orange-300 font-sans">
                Accepting Admissions for 2026 - 2027
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-slate-950 dark:text-white leading-tight"
            >
              Where Little Wings <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                Learn, Play & Fly
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-slate-600 dark:text-slate-300 font-sans text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              Honey Bees provides a premium, nursery-crafted, play-based early learning ecosystem. 
              We blend professional care with structured Kindergarten classes, safe daycare, and grades 1-10 tuition.
            </motion.p>

            {/* Core USPs bullets */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="grid sm:grid-cols-2 gap-4 pt-2 text-left max-w-xl mx-auto lg:mx-0"
            >
              <div className="flex gap-2.5 items-start bg-white/70 dark:bg-slate-900/50 backdrop-blur-xs p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <Heart className="text-orange-500 shrink-0 mt-0.5" size={16} />
                <div>
                  <h5 className="text-xs font-extrabold text-slate-850 dark:text-slate-200">Certified Care</h5>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">CPR-trained teachers</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start bg-white/70 dark:bg-slate-900/50 backdrop-blur-xs p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <Award className="text-sky-500 shrink-0 mt-0.5" size={16} />
                <div>
                  <h5 className="text-xs font-extrabold text-slate-850 dark:text-slate-200">Premium Arena</h5>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Sanitized foam playgrounds</p>
                </div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-3"
            >
              <button
                id="hero-btn-book-tour"
                onClick={onBookTourClick}
                className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-slate-900 font-display font-black text-sm px-8 py-4 rounded-2xl transition-all shadow-lg shadow-yellow-100 dark:shadow-none hover:shadow-orange-100 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar size={16} />
                Book a School Tour
              </button>
              <button
                id="hero-btn-explore"
                onClick={onExploreProgramsClick}
                className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-2 border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-100 font-display font-extrabold text-sm px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Explore Programs
                <ArrowRight size={15} />
              </button>
            </motion.div>
          </div>

          {/* Right Visual Image Mock Column */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none"
            >
              {/* Outer decorative honeycomb pattern */}
              <div className="absolute -top-10 -left-10 text-9xl text-yellow-200/30 font-display select-none pointer-events-none">
                ⬢⬢⬢
              </div>
              <div className="absolute -bottom-10 -right-10 text-9xl text-sky-200/40 font-display select-none pointer-events-none">
                ⬢⬢
              </div>

              {/* Main Styled Photo Card (Polished UI replacement since real photography uses relative paths) */}
              <div className="bg-gradient-to-tr from-yellow-350 to-orange-350 p-3 rounded-[38px] shadow-2xl relative z-10 border border-white/60">
                <div className="bg-slate-900 rounded-[30px] overflow-hidden aspect-square flex flex-col justify-between p-6 relative">
                  {/* Backdrop glowing sun */}
                  <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-yellow-400/20 rounded-full filter blur-xl pointer-events-none" />

                  {/* Top indicators */}
                  <div className="flex justify-between items-center z-10 w-full">
                    <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-extrabold tracking-widest px-3 py-1 rounded-full uppercase">
                      🍯 Lawsons Bay Hive
                    </span>
                    <span className="bg-emerald-400 text-slate-900 text-[10px] font-black px-2.5 py-1 rounded-lg">
                      100% Sanitized
                    </span>
                  </div>

                  {/* Graphic kids artwork representing preschool focus */}
                  <div className="text-center space-y-4 my-auto z-10 flex flex-col items-center py-6">
                    <span className="text-7xl block animate-bounce">🧒🏽🐝👧🏼</span>
                    <p className="text-white font-display font-extrabold text-2xl tracking-tight leading-tight px-4">
                      Where Curious Little Minds Turn Into Scholars
                    </p>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="text-yellow-400 text-sm">★</span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Float badge */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 flex justify-between items-center z-10 text-left w-full">
                    <div>
                      <span className="text-slate-400 text-[9px] font-semibold block">COOPERATIVE PLAY</span>
                      <span className="text-xs font-bold text-white block mt-0.5">Social Emotional Intelligence</span>
                    </div>
                    <span className="text-xl">🎨</span>
                  </div>
                </div>
              </div>

              {/* Overlay Stat card 1 - Trust */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-900 p-4.5 rounded-2xl shadow-xl z-20 flex items-center gap-3.5 border border-slate-100 dark:border-slate-800 max-w-[190px] animate-blob-bounce">
                <div className="bg-yellow-100 dark:bg-yellow-950/40 p-2.5 rounded-xl text-yellow-600 dark:text-yellow-400 font-bold text-sm">
                  ★ 4.9
                </div>
                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-snug">
                  Rated by <br />
                  <strong className="text-yellow-600 dark:text-yellow-400">500+ Local Guardians</strong>
                </p>
              </div>

              {/* Overlay Stat card 2 - Ratio */}
              <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-900 p-4.5 rounded-2xl shadow-xl z-20 flex items-center gap-3 border border-slate-150 dark:border-slate-800 max-w-[180px] animate-blob-bounce [animation-delay:3s]">
                <div className="bg-sky-100 dark:bg-sky-950/40 p-2.5 rounded-xl text-sky-600 dark:text-sky-400 font-bold text-xs leading-none">
                  1:8
                </div>
                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-snug">
                  Teacher-to-Child <br />
                  <strong className="text-sky-600 dark:text-sky-400">Nurture Ratio</strong>
                </p>
              </div>

            </motion.div>
          </div>

        </div>

        {/* Ambient Decorative Blooming Flowers */}
        <div className="absolute bottom-4 left-6 hidden lg:block">
          <BloomingFlowers color="#f43f5e" size={72} />
        </div>
        <div className="absolute bottom-4 right-12 hidden lg:block">
          <BloomingFlowers color="#fb923c" size={64} />
        </div>

      </div>
    </section>
  );
}
