import React, { useState } from "react";
import { Clock, Users, DollarSign, ArrowRight, HelpCircle, Heart, Star, BookOpen, Smile, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProgramsSectionProps {
  onEnquireClick: (programName: string) => void;
}

export default function ProgramsSection({ onEnquireClick }: ProgramsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<"preschool" | "afterschool">("preschool");

  const programs = [
    {
      id: "pg",
      name: "Play Group",
      category: "preschool",
      age: "1.5 - 2.5 Years",
      fee: 150,
      time: "9:00 AM - 12:00 PM",
      desc: "An introduction to social circles. Focuses on motor actions, sensory touch, shared toys, and simple nursery songs.",
      color: "border-yellow-250 bg-yellow-50/30 text-yellow-700",
      icon: "🎨",
      points: ["Sensory and tactile textures", "Gross and fine motor actions", "Social sharing and music loops"],
    },
    {
      id: "ns",
      name: "Nursery",
      category: "preschool",
      age: "2.5 - 3.5 Years",
      fee: 180,
      time: "9:00 AM - 12:30 PM",
      desc: "Builds early phonics and conversation logic. Features painting mosaics, storytelling puppets, and basic count scales.",
      color: "border-orange-250 bg-orange-50/30 text-orange-700",
      icon: "🧸",
      points: ["Early letter phonics", "Pencil grasp and mosaic arts", "Storytelling puppet sessions"],
    },
    {
      id: "lkg",
      name: "LKG (Lower Kindergarten)",
      category: "preschool",
      age: "3.5 - 4.5 Years",
      fee: 200,
      time: "8:30 AM - 1:00 PM",
      desc: "Develops writing foundations, environmental nature studies, introductory reading blocks, and music rhythm dances.",
      color: "border-sky-250 bg-sky-50/30 text-sky-700",
      icon: "📚",
      points: ["Sentence construction keys", "Addition and subtraction blocks", "Environmental nature labs"],
    },
    {
      id: "ukg",
      name: "UKG (Upper Kindergarten)",
      category: "preschool",
      age: "4.5 - 5.5 Years",
      fee: 220,
      time: "8:30 AM - 1:30 PM",
      desc: "Primary school readiness curriculum. Focuses on phonic reading, advanced arithmetic, science labs, and spatial coordinates.",
      color: "border-emerald-250 bg-emerald-50/30 text-emerald-700",
      icon: "📝",
      points: ["Phonetic story reading", "Math spatial coordinates", "Primary school prep drills"],
    },
    {
      id: "dc",
      name: "Safe Daycare",
      category: "afterschool",
      age: "6 Months - 10 Years",
      fee: 250,
      time: "8:00 AM - 6:30 PM",
      desc: "A warm, sanitized secondary home. Offers organic pediatric meals, soft sleep bays, homework assistance, and safe play.",
      color: "border-rose-250 bg-rose-50/30 text-rose-700",
      icon: "🏡",
      points: ["Nutritious warm meals", "Live CCTV camera links", "CPR trained dedicated care"],
    },
    {
      id: "tc",
      name: "Tuition Centre",
      category: "afterschool",
      age: "Grades 1 - 10",
      fee: 100,
      time: "4:00 PM - 7:30 PM",
      desc: "Focuses on Mathematics, Sciences, and English. Homework guidance, test prep drills, and personalized worksheet coaches.",
      color: "border-purple-250 bg-purple-50/30 text-purple-700",
      icon: "🎓",
      points: ["Expert Math and Science coaching", "Personalized worksheet grids", "Weekly test-prep assessments"],
    }
  ];

  const filtered = programs.filter((p) => p.category === activeCategory);

  return (
    <section id="programs" className="py-16 md:py-24 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-widest bg-sky-50 px-3 py-1 rounded-full">
            Our Curriculum Grids
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Nurturing Programs Structured for Growth
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            From toddlers making their first friends to secondary school scholars mastering physics, we have customized environments optimized to build deep trust and confidence.
          </p>

          {/* Tab Filter Button Switch */}
          <div className="inline-flex bg-white border border-slate-200 rounded-2xl p-1 shadow-sm mt-4">
            <button
              onClick={() => setActiveCategory("preschool")}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === "preschool" ? "bg-yellow-400 text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🐝 Pre-School & Kindergarten
            </button>
            <button
              onClick={() => setActiveCategory("afterschool")}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === "afterschool" ? "bg-sky-500 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🏡 Daycare & Tuition Centre
            </button>
          </div>
        </div>

        {/* Dynamic Programs List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((prog) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                key={prog.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs hover:shadow-md hover:border-yellow-200 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top program title with icon badge */}
                  <div className="flex justify-between items-start">
                    <span className="text-4xl leading-none">{prog.icon}</span>
                    <span className="bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-mono px-2.5 py-1 rounded-full font-bold">
                      Age: {prog.age}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-extrabold text-lg text-slate-900">
                      {prog.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-sans">
                      {prog.desc}
                    </p>
                  </div>

                  {/* Bullet Highlights */}
                  <ul className="space-y-2 pt-2 border-t border-slate-100">
                    {prog.points.map((p, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-center gap-2">
                        <span className="text-emerald-500">✓</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing Schedule block and trigger */}
                <div className="pt-6 mt-6 border-t border-slate-100 space-y-4">
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Monthly Tuition</span>
                      <span className="text-xl font-display font-black text-slate-900">${prog.fee} <span className="text-xs font-medium text-slate-400">/ mo</span></span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Daily Timing</span>
                      <span className="text-xs font-mono font-bold text-slate-700 block mt-0.5">{prog.time}</span>
                    </div>
                  </div>

                  <button
                    id={`btn-enq-${prog.id}`}
                    onClick={() => onEnquireClick(prog.name)}
                    className="w-full bg-slate-150 hover:bg-yellow-400 hover:text-slate-900 text-slate-700 py-3 rounded-2xl text-xs font-bold font-sans transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Fee & Admission Enquiry
                    <ArrowRight size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Free-prospectus download float bar */}
        <div className="mt-16 bg-white border border-slate-200 rounded-[30px] p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
          <div className="flex items-center gap-4 text-left">
            <div className="bg-yellow-50 p-3 rounded-2xl text-2xl text-yellow-600 leading-none">
              📁
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-slate-900">Download Our 2026 Interactive Prospectus</h4>
              <p className="text-xs text-slate-500 mt-1 font-sans">
                Get full details on early curricula, healthy food menus, teacher backgrounds, and term timelines.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              alert("Prospectus and Brochure PDF has been dispatched! Please check your downloads folder for 'Honeybees_Prospectus_2026.pdf'.");
            }}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-2xl text-xs font-bold font-sans transition-all flex items-center gap-2 cursor-pointer shadow-sm w-full md:w-auto justify-center"
          >
            Download Prospectus (PDF)
          </button>
        </div>

      </div>
    </section>
  );
}
