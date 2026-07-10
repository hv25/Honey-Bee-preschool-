import React from "react";
import { Sparkles, Check, Heart, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";

export default function FacilitiesSection() {
  const facilities = [
    {
      title: "Cushioned Indoor Foam Arena",
      icon: "🤸",
      desc: "An fully air-conditioned active play environment lined with medical-grade, shock-absorbent safety foam blocks. Includes slides, sensory tubes, and climbing grids.",
      tag: "100% Sanitized Daily",
    },
    {
      title: "Interactive Reading Corner",
      icon: "📚",
      desc: "A warm, quiet library corner loaded with age-appropriate picture books, talking phonetic devices, and beanbags designed to instil early reading values.",
      tag: "Early Phonics Focus",
    },
    {
      title: "Green Backyard Garden Playground",
      icon: "🌳",
      desc: "Secure organic gardens where kids can feel actual grass, plant flowers, observe butterflies, and play sensory games safely in natural ventilation.",
      tag: "Physical Development",
    },
    {
      title: "Kid Splash Pool & Water Play",
      icon: "🏊",
      desc: "An extremely safe, shallow water splash playpool. Designed to trigger early coordination with floating measuring cups, waterwheels, and water jets.",
      tag: "Tactile Sensory Coordination",
    },
    {
      title: "Sanitized Kids Safe Pantry",
      icon: "🍎",
      desc: "Highly hygienic pantry where our CPR-certified culinary staff prep warm, healthy organic baby-meals. Free from refined sugars, rich in protein.",
      tag: "Organic Nutritional Diet",
    },
    {
      title: "Fully-Equipped Sick Bay",
      icon: "🩺",
      desc: "A soft, reassuring medical rest corner equipped with child-sized beds, temperature grids, nebulizers, and pediatric first-aid supplies.",
      tag: "Pediatric First Aid Ready",
    }
  ];

  return (
    <section id="facilities" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">
            Our Sweet Hive Tour
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Premium Child-Safe Facilities
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Every square inch of Honey Bees is customized with soft rounded corners, anti-slip carpets, and strict pediatric hygiene grids. We design environments that promote worry-free explore play.
          </p>
        </div>

        {/* Facilities Grid list */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((fac, idx) => (
            <motion.div
              whileHover={{ y: -5 }}
              key={idx}
              className="bg-slate-50 border border-slate-150 p-6 rounded-3xl flex flex-col justify-between shadow-xs hover:shadow-md transition-all group hover:bg-white hover:border-yellow-250"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-4xl leading-none">{fac.icon}</span>
                  <span className="bg-orange-50 border border-orange-100 text-orange-700 text-[9px] font-bold font-mono px-2.5 py-1 rounded-full uppercase">
                    {fac.tag}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-extrabold text-base text-slate-900 group-hover:text-orange-600 transition-colors">
                    {fac.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed font-sans font-normal">
                    {fac.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-400 font-sans font-bold">
                <Check size={12} className="text-emerald-500 shrink-0" />
                <span>Standard compliance check passed</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Triple Safety Promise Badge */}
        <div className="mt-16 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white border border-slate-700 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
          <div className="flex items-center gap-4 text-left">
            <div className="bg-white/10 p-3 rounded-2xl text-2xl leading-none text-yellow-400 animate-pulse">
              🛡️
            </div>
            <div>
              <h4 className="font-display font-extrabold text-base text-white">Our 3-Fold Safety Guarantee</h4>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Triple security: Live app-linked CCTV + Magnetic safety gates + CPR-certified teachers on guard.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto justify-start md:justify-end">
            <span className="bg-slate-800 border border-slate-700 text-yellow-400 text-[10px] font-bold font-mono px-3 py-1.5 rounded-xl uppercase">
              🔒 RFID Kid Locks
            </span>
            <span className="bg-slate-800 border border-slate-700 text-yellow-400 text-[10px] font-bold font-mono px-3 py-1.5 rounded-xl uppercase">
              📹 Dual CCTV Check
            </span>
            <span className="bg-slate-800 border border-slate-700 text-yellow-400 text-[10px] font-bold font-mono px-3 py-1.5 rounded-xl uppercase">
              🩹 pediatric First Aid
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
