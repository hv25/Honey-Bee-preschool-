import React from "react";
import { ShieldCheck, Sparkles, BookOpen, Clock, Heart, Award } from "lucide-react";
import { motion } from "motion/react";

export default function About() {
  const coreValues = [
    {
      icon: <ShieldCheck className="text-emerald-500" size={24} />,
      title: "100% Secure & CCTV Monitored",
      desc: "Every room is equipped with secure live CCTV stream feeds so parents can check in on their kids anytime during work hours.",
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
    },
    {
      icon: <Heart className="text-rose-500" size={24} />,
      title: "Holistic Social Care",
      desc: "Our core curriculum places immense emphasis on emotion-regulation, sharing, positive reinforcement, and high-trust peer bonding.",
    },
    {
      icon: <Sparkles className="text-purple-500" size={24} />,
      title: "Premium Indoor Arenas",
      desc: "Anti-shock foam flooring, sensory sandpits, fully cushioned soft-corners, and pediatric-approved toys for safe play.",
    },
    {
      icon: <Clock className="text-orange-500" size={24} />,
      title: "Extended Hours & Meals",
      desc: "Our daycare runs till 6:30 PM with nutritious pediatric dietician-approved organic meals served warm daily.",
    }
  ];

  return (
    <section id="about-us" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">
            Our Foundation
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Why Sweetwater Parents Trust Our Hive
          </h2>
          <p className="text-slate-500 font-sans text-sm sm:text-base leading-relaxed">
            Honey Bees isn't just a daycare. We are a premier developmental springboard designed to wire early cognitive logic, inspire motor creativity, and foster warm peer interactions.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreValues.map((val, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="bg-slate-50 border border-slate-100 p-6 rounded-3xl transition-all shadow-xs hover:shadow-md hover:bg-white"
            >
              <div className="bg-white border border-slate-100 p-3.5 rounded-2xl w-fit shadow-xs mb-5">
                {val.icon}
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 mb-2">
                {val.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                {val.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Learning Methodology block */}
        <div className="mt-20 bg-gradient-to-br from-yellow-500 to-orange-400 rounded-[36px] p-8 md:p-12 text-white relative overflow-hidden shadow-xl">
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
                <span className="text-3xl font-display font-black block">1:8</span>
                <span className="text-[10px] uppercase text-yellow-100 block tracking-wide mt-1">Nurture Ratio</span>
              </div>
              <div>
                <span className="text-3xl font-display font-black block">100%</span>
                <span className="text-[10px] uppercase text-yellow-100 block tracking-wide mt-1">CPR Certified</span>
              </div>
              <div className="border-t border-white/10 pt-4 col-span-2">
                <span className="text-xs font-bold text-white block">Accredited Early Childhood Curriculum</span>
                <span className="text-[10px] text-yellow-50/70 block mt-1">WCAG 2.2 Accessible Portal</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
