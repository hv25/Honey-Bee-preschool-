import React, { useState } from "react";
import { HelpCircle, ChevronDown, Search, ArrowRight, Shield, BookOpen, ClipboardList } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "registration" | "curriculum" | "safety";
}

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<"all" | "registration" | "curriculum" | "safety">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const faqData: FAQItem[] = [
    {
      id: "reg-1",
      question: "What is the age group requirement for admissions?",
      answer: "We welcome children from 6 months up to 10 years of age. Our daycare/afterschool programs cater to ages 6 months to 10 years, while our specialized tuition programs are designed for school-going kids in Grades 1 to 10.",
      category: "registration"
    },
    {
      id: "reg-2",
      question: "What documents are required to complete the registration?",
      answer: "Parents must submit a completed registration form, a copy of the child's birth certificate, up-to-date pediatric immunization records, passport-sized photographs of the child and parents, and photocopy of government-issued IDs of authorized guardians.",
      category: "registration"
    },
    {
      id: "reg-3",
      question: "Do you offer flexible part-time daycare schedules?",
      answer: "Yes, we support our working parents with highly flexible schedule options. This includes full-day care (8:00 AM - 6:30 PM), half-day care (morning or afternoon sessions), and customizable daily/weekly drop-in models.",
      category: "registration"
    },
    {
      id: "reg-4",
      question: "Can we schedule a school tour before registering?",
      answer: "We highly encourage tours! You can easily schedule an on-site visit by clicking our 'Book a Tour' button. Tours are hosted daily with our principal, allowing you to inspect facilities, meet caregivers, and review hygiene logs.",
      category: "registration"
    },
    {
      id: "curr-1",
      question: "What kind of curriculum or learning methodology do you follow?",
      answer: "We follow a progressive, activity-based curriculum focused on natural sensory triggers, phonetic reading stories, math spatial coordinates, and social bonding. It combines independent exploration with guided cognitive drills to prepare kids for primary schooling.",
      category: "curriculum"
    },
    {
      id: "curr-2",
      question: "How do you handle children with varying learning paces?",
      answer: "Our classes have a low child-to-teacher ratio, allowing our educators to tailor lessons. In our Tuition Centre, we design personalized worksheets and learning grids to make sure kids can learn without pressure.",
      category: "curriculum"
    },
    {
      id: "curr-3",
      question: "Do you assist children with school homework during daycare?",
      answer: "Absolutely. In our Afterschool Daycare and Tuition programs, our qualified educators dedicate dedicated quiet hours to guide children through their daily school homework assignments, ensuring everything is complete and clear.",
      category: "curriculum"
    },
    {
      id: "curr-4",
      question: "Are enrichment programs (like speech or motor training) integrated?",
      answer: "Yes, our daily schedules are packed with enrichment slots including creative speech sessions, motor development play in our cushioned soft-play arenas, spatial reading, and active physical exercises.",
      category: "curriculum"
    },
    {
      id: "safe-1",
      question: "What safety and security measures are in place?",
      answer: "Safety is our absolute priority. Our campus features 24/7 CCTV surveillance throughout all zones, single-point secured digital entry gates, and biometric check-ins. Children are released strictly to pre-authorized parent/guardian profiles.",
      category: "safety"
    },
    {
      id: "safe-2",
      question: "What is your child-to-teacher ratio?",
      answer: "We maintain highly strict ratios. For our nursery and toddler bays, we keep a 4:1 ratio. For older preschool groups and our general daycare and tuition classrooms, we keep a comfortable ratio of 8:1 to ensure focused eye-contact and physical protection.",
      category: "safety"
    },
    {
      id: "safe-3",
      question: "Are caregivers and teachers certified in first aid?",
      answer: "Yes! Every single teacher, nurse, nanny, and administrative member of the Honey Bees team undergoes mandatory certification in pediatric CPR, choking prevention, and emergency first aid, refreshed annually.",
      category: "safety"
    },
    {
      id: "safe-4",
      question: "What is the sanitization routine of playrooms and toys?",
      answer: "We follow strict clinical hygiene schedules. All indoor arenas, toys, cushioned pads, and learning materials are thoroughly sanitized three times daily using child-safe, non-toxic organic cleansers. Air filtration units run continuously.",
      category: "safety"
    }
  ];

  const filteredFaqs = faqData.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const categories = [
    { id: "all", label: "All Questions", icon: <HelpCircle size={14} /> },
    { id: "registration", label: "Registration & Fees", icon: <ClipboardList size={14} /> },
    { id: "curriculum", label: "Curriculum & Philosophy", icon: <BookOpen size={14} /> },
    { id: "safety", label: "Campus Safety & Hygiene", icon: <Shield size={14} /> }
  ];

  return (
    <section id="faq-section" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-800/80 transition-colors duration-350">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="bg-yellow-100 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-[10px] font-extrabold tracking-widest px-3 py-1.5 rounded-full uppercase inline-flex items-center gap-1">
            <span>✨</span> parent knowledge base
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight mt-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
            Have queries about daycare slots, our sensory play methodology, security protocols, or enrollment steps? Find comprehensive answers curated by our directors below.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-10" id="faq-search-wrapper">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            id="faq-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. hygiene, age, fee...)"
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-4 flex items-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Switches */}
        <div className="flex flex-wrap justify-center gap-2 mb-10" id="faq-category-filters">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`faq-btn-${cat.id}`}
              onClick={() => {
                setActiveCategory(cat.id as any);
                setExpandedId(null);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-yellow-400 text-slate-900 shadow-xs"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white shadow-3xs"
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* FAQ Accordions */}
        <div className="space-y-4" id="faq-accordion-list">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = expandedId === faq.id;
                return (
                  <motion.div
                    layout
                    key={faq.id}
                    id={`faq-item-${faq.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className={`bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-300 ${
                      isOpen
                        ? "border-yellow-350 dark:border-yellow-400/40 shadow-xs ring-1 ring-yellow-400/10"
                        : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-3xs"
                    }`}
                  >
                    <button
                      onClick={() => toggleExpand(faq.id)}
                      className="w-full px-5 py-4 sm:py-5 flex items-center justify-between gap-4 text-left cursor-pointer focus:outline-hidden"
                      aria-expanded={isOpen}
                    >
                      <span className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                        {faq.question}
                      </span>
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                          isOpen
                            ? "bg-yellow-400 text-slate-900 rotate-180"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        <ChevronDown size={14} />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <div className="px-5 pb-5 sm:pb-6 text-slate-500 dark:text-slate-350 text-xs leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-4">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl"
              >
                <p className="text-slate-400 dark:text-slate-500 text-xs">
                  No matches found for "{searchQuery}". Try searching for other terms like "fees", "hygiene", or "age".
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA Banner */}
        <div className="mt-12 bg-linear-to-r from-amber-400/10 to-yellow-400/10 dark:from-yellow-950/20 dark:to-amber-950/20 border border-amber-200/50 dark:border-yellow-900/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6" id="faq-cta-banner">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-display font-extrabold text-sm sm:text-base text-slate-950 dark:text-yellow-100">
              Still have questions about daycare?
            </h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              Chat with Beatrice, our advanced AI assistant, or book a live campus walkthrough.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={() => {
                const btn = document.getElementById("btn-chatbot-float-trigger");
                if (btn) btn.click();
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-850 dark:bg-yellow-400 dark:hover:bg-yellow-500 text-white dark:text-slate-950 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Ask Beatrice AI
            </button>
            <a
              href="#contact"
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all shadow-3xs flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-750"
            >
              <span>Get in Touch</span>
              <ArrowRight size={12} />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
