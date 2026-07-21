import React, { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import About from "./components/About";
import ProgramsSection from "./components/ProgramsSection";
import FacilitiesSection from "./components/FacilitiesSection";
import GallerySection from "./components/GallerySection";
import AdmissionsSection from "./components/AdmissionsSection";
import ContactSection from "./components/ContactSection";
import FAQSection from "./components/FAQSection";
import BlogSection from "./components/BlogSection";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import VoiceAssistant from "./components/VoiceAssistant";
import Dashboards from "./components/Dashboards";
import Playroom from "./components/Playroom";
import BrochureModal from "./components/BrochureModal";
import WelcomeAnimation from "./components/WelcomeAnimation";
import { MessageSquare, Volume2, Sparkles, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ButterflyCursor from "./components/effects/ButterflyCursor";
import FlyingBees from "./components/effects/FlyingBees";
import Fireflies from "./components/effects/Fireflies";
import ConfettiTrigger from "./components/effects/ConfettiTrigger";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isWelcomeActive, setIsWelcomeActive] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("hasSeenWelcome") !== "true";
    }
    return true;
  });
  const [admissionFormType, setAdmissionFormType] = useState<"admission" | "tour">("admission");
  const [selectedEnquiryProgram, setSelectedEnquiryProgram] = useState<string>("Nursery");
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);

  // Auto-open brochure if query parameter is set
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("brochure") === "open") {
        setIsBrochureOpen(true);
      }
    }
  }, []);

  // Global Theme State
  const [theme] = useState<"light" | "dark">("dark");

  // Apply dark class on theme change
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  const toggleTheme = () => {
    // Permanently dark
  };

  // Floating AI assist states
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isConfettiActive, setIsConfettiActive] = useState(false);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  const handleBookTour = () => {
    setSelectedEnquiryProgram("Nursery");
    setAdmissionFormType("tour");
    setActiveTab("admissions");
  };

  const handleEnquireProgram = (programName: string) => {
    setSelectedEnquiryProgram(programName);
    setAdmissionFormType("admission");
    setActiveTab("admissions");
  };

  const handleAdmissionOrTourSuccess = () => {
    console.log("Admission or tour successfully registered!");
    setIsConfettiActive(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans flex flex-col justify-between selection:bg-yellow-200 dark:selection:bg-yellow-800 selection:text-slate-900 dark:selection:text-yellow-100 transition-colors duration-350">
      
      {/* Ambient Interactive Particle Overlays */}
      {theme === "dark" && <Fireflies />}
      {activeTab === "home" && <ButterflyCursor />}
      {activeTab === "home" && <FlyingBees />}
      <ConfettiTrigger active={isConfettiActive} onComplete={() => setIsConfettiActive(false)} />
      
      {/* Magical Welcome Butterfly Animation */}
      <AnimatePresence mode="wait">
        {isWelcomeActive && (
          <motion.div
            key="welcome-animation"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[100]"
          >
            <WelcomeAnimation
              onComplete={() => {
                setTimeout(() => {
                  setIsWelcomeActive(false);
                }, 0);
                if (typeof window !== "undefined") {
                  sessionStorage.setItem("hasSeenWelcome", "true");
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elegant Full-screen Theme Transition Overlay */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className={`pointer-events-none fixed inset-0 z-50 ${
            theme === "dark" ? "bg-slate-950" : "bg-white"
          }`}
        />
      </AnimatePresence>

      {/* Upper Navigation bar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onBookTourClick={handleBookTour}
        onBrochureClick={() => setIsBrochureOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Page Area */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div
              key="home-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Hero
                onBookTourClick={handleBookTour}
                onExploreProgramsClick={() => setActiveTab("programs")}
              />
              <About />
              <ProgramsSection onEnquireClick={handleEnquireProgram} onBrochureClick={() => setIsBrochureOpen(true)} />
              <FacilitiesSection />
              <Testimonials />
              <GallerySection />
              <BlogSection />
              <FAQSection />
              <ContactSection />
            </motion.div>
          )}

          {activeTab === "about" && (
            <motion.div
              key="about-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <About />
              <Testimonials />
            </motion.div>
          )}

          {activeTab === "programs" && (
            <motion.div
              key="programs-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <ProgramsSection onEnquireClick={handleEnquireProgram} onBrochureClick={() => setIsBrochureOpen(true)} />
            </motion.div>
          )}

          {activeTab === "facilities" && (
            <motion.div
              key="facilities-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <FacilitiesSection />
            </motion.div>
          )}

          {activeTab === "gallery" && (
            <motion.div
              key="gallery-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <GallerySection />
            </motion.div>
          )}

          {activeTab === "events" && (
            <motion.div
              key="events-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <BlogSection />
            </motion.div>
          )}

          {activeTab === "blog" && (
            <motion.div
              key="blog-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <BlogSection />
            </motion.div>
          )}

          {activeTab === "admissions" && (
            <motion.div
              key="admissions-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <AdmissionsSection
                initialForm={admissionFormType}
                prefilledProgram={selectedEnquiryProgram}
                onSuccess={handleAdmissionOrTourSuccess}
                onGoToDashboard={() => setActiveTab("dashboards")}
              />
            </motion.div>
          )}

          {activeTab === "faq" && (
            <motion.div
              key="faq-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <FAQSection />
            </motion.div>
          )}

          {activeTab === "contact" && (
            <motion.div
              key="contact-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <ContactSection />
            </motion.div>
          )}

          {activeTab === "playroom" && (
            <motion.div
              key="playroom-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Playroom />
            </motion.div>
          )}

          {activeTab === "dashboards" && (
            <motion.div
              key="dashboards-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Dashboards />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Area */}
      <Footer setActiveTab={setActiveTab} />

      {/* AI Assistance Toggle Buttons - Floating Right */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Voice Assistant Toggler */}
        <div className="relative flex justify-end">
          <button
            id="btn-voice-float-trigger"
            onClick={() => {
              setIsVoiceOpen(!isVoiceOpen);
              if (isChatbotOpen) setIsChatbotOpen(false);
            }}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all cursor-pointer hover:scale-105 border ${
              isVoiceOpen 
                ? "bg-slate-900 text-white border-slate-700" 
                : "bg-sky-500 text-white border-sky-400 hover:bg-sky-600"
            }`}
            aria-label="Toggle Beatrice AI Voice Assistant"
          >
            <Volume2 size={24} className={isVoiceOpen ? "" : "animate-pulse"} />
          </button>
        </div>

        {/* Chatbot Toggler */}
        <div className="relative flex justify-end">
          <AnimatePresence>
            {isChatbotOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute bottom-16 right-0 w-80 sm:w-96"
              >
                <Chatbot onClose={() => setIsChatbotOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>
          <button
            id="btn-chatbot-float-trigger"
            onClick={() => {
              setIsChatbotOpen(!isChatbotOpen);
              if (isVoiceOpen) setIsVoiceOpen(false);
            }}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all cursor-pointer hover:scale-105 border ${
              isChatbotOpen 
                ? "bg-slate-900 text-white border-slate-700" 
                : "bg-yellow-400 text-slate-900 border-yellow-300 hover:bg-yellow-500"
            }`}
            aria-label="Toggle Beatrice AI Text Chatbot"
          >
            <MessageSquare size={24} className={isChatbotOpen ? "" : "animate-bounce"} />
          </button>
        </div>
      </div>

      {/* Floating Left Brochure Bookmark button for desktop */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden md:block">
        <button
          onClick={() => setIsBrochureOpen(true)}
          className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-display font-black text-[11px] py-4 px-3 rounded-r-2xl shadow-xl transition-all cursor-pointer hover:pl-5 flex items-center gap-1.5 [writing-mode:vertical-lr] rotate-180 border-t border-r border-b border-yellow-300"
        >
          <span>📘</span> School Brochure
        </button>
      </div>

      {/* Interactive School Brochure Modal */}
      <BrochureModal
        isOpen={isBrochureOpen}
        onClose={() => setIsBrochureOpen(false)}
        onApplyClick={() => handleEnquireProgram("Nursery")}
        onBookTourClick={handleBookTour}
      />

      {/* 24/7 AI Voice Receptionist Modal */}
      <AnimatePresence>
        {isVoiceOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-[60] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl"
            >
              <VoiceAssistant onClose={() => setIsVoiceOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Left Magical Replay Button */}
      {!isWelcomeActive && (
        <div className="fixed bottom-6 left-6 z-40">
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
            onClick={() => setIsWelcomeActive(true)}
            className="bg-white/95 dark:bg-slate-900/95 hover:bg-yellow-400 dark:hover:bg-yellow-400 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-slate-950 p-3 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 flex items-center gap-1.5 cursor-pointer"
            title="Replay Welcome Magic 🦋"
          >
            <span className="text-base">🦋</span>
            <span className="text-[10px] font-extrabold tracking-wider pr-1.5 hidden sm:inline">REPLAY MAGIC</span>
          </motion.button>
        </div>
      )}

    </div>
  );
}
