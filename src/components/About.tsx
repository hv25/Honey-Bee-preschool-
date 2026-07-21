import React from "react";
import { ShieldCheck, BookOpen, Award } from "lucide-react";
import { motion } from "motion/react";
import AnimatedCounter from "./effects/AnimatedCounter";

export default function About() {
  const coreValues = [
    {
      icon: <ShieldCheck className="text-emerald-500" size={24} />,
      title: "100% Secure & CCTV Monitored",
      desc: "Every room is equipped with secure live CCTV stream monitoring.",
    },
    {
      icon: <Award className="text-yellow-600" size={24} />,
      title: "Certified Early Educators",
      desc: "Our teaching crew consists of highly trained early childhood education experts, certified in pediatric first aid & CPR.",
    },
    {
      icon: <BookOpen className="text-sky-500" size={24} />,
      title: "Play-Based Curriculum",
      desc: "We follow a progressive, activity-based methodology that shapes logic, spatial coordinates, fine motor dexterity, and cooperative speech.",
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
      },
    },
  };

  return (
    <section id="about-us" className="py-16 md:py-24 bg-white dark:bg-slate-900 transition-colors duration-350">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        
        {/* Top Header */}
        <motion.div
          variants={itemVariants}
          className="text-center max-w-3xl mx-auto space-y-3 mb-16"
        >
          <span className="text-xs font-bold text-orange-500 dark:text-orange-300 uppercase tracking-widest bg-orange-50 dark:bg-orange-950/40 px-3 py-1 rounded-full">
            Our Foundation
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
            Why Lawsons Bay Parents Trust Our Hive
          </h2>
          <p className="text-slate-500 dark:text-slate-350 font-sans text-sm sm:text-base leading-relaxed">
            Honey Bees isn't just a daycare. We are a premier developmental springboard designed to wire early cognitive logic, inspire motor creativity, and foster warm peer interactions.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreValues.map((val, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl transition-all shadow-xs hover:shadow-md hover:bg-white dark:hover:bg-slate-800"
            >
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3.5 rounded-2xl w-fit shadow-xs mb-5">
                {val.icon}
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-2">
                {val.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                {val.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Learning Methodology block */}
        <motion.div
          variants={itemVariants}
          className="mt-20 bg-gradient-to-br from-yellow-500 to-orange-400 rounded-[36px] p-8 md:p-12 text-white relative overflow-hidden shadow-xl"
        >
          <div className="absolute top-0 right-0 text-[180px] opacity-10 leading-none select-none font-display pointer-events-none">
            🐝
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[10px] uppercase font-black bg-white/20 px-3 py-1 rounded-full tracking-widest">
                Our Learning Methodology
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3.5xl tracking-tight leading-tight">
                The Honey Bees Play-First Curriculum Model
              </h3>
              <p className="text-xs sm:text-sm text-yellow-50/90 leading-relaxed max-w-2xl">
                We believe that children learn best when they don't know they are learning. 
                Our pedagogy maps core math, phonics, and environmental sciences into sensory, tactile game mechanics. 
                Rather than memorization, we teach kids to observe, touch, ask, and paint.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 pt-4 text-xs font-semibold">
                <div className="flex gap-2.5 items-center">
                  <span className="bg-white/20 p-1 rounded-full">✓</span>
                  <span>Sensory tactile mathematics blocks</span>
                </div>
                <div className="flex gap-2.5 items-center">
                  <span className="bg-white/20 p-1 rounded-full">✓</span>
                  <span>Phonics through interactive puppet theatre</span>
                </div>
                <div className="flex gap-2.5 items-center">
                  <span className="bg-white/20 p-1 rounded-full">✓</span>
                  <span>Nature-crafts and environmental care</span>
                </div>
                <div className="flex gap-2.5 items-center">
                  <span className="bg-white/20 p-1 rounded-full">✓</span>
                  <span>Social-sharing circle board mechanics</span>
                </div>
              </div>
            </div>

            {/* Simulated interactive stat counter */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-display font-black block">
                  <AnimatedCounter value={1} />:<AnimatedCounter value={8} />
                </div>
                <span className="text-[10px] uppercase text-yellow-100 block tracking-wide mt-1">Nurture Ratio</span>
              </div>
              <div>
                <div className="text-3xl font-display font-black block">
                  <AnimatedCounter value={100} suffix="%" />
                </div>
                <span className="text-[10px] uppercase text-yellow-100 block tracking-wide mt-1">CPR Certified</span>
              </div>
              <div className="border-t border-white/10 pt-4 col-span-2">
                <span className="text-xs font-bold text-white block">Accredited Early Childhood Curriculum</span>
                <span className="text-[10px] text-yellow-50/70 block mt-1">WCAG 2.2 Accessible Portal</span>
              </div>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}
