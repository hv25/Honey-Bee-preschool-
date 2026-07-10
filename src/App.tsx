import React, { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import About from "./components/About";
import ProgramsSection from "./components/ProgramsSection";
import FacilitiesSection from "./components/FacilitiesSection";
import GallerySection from "./components/GallerySection";
import AdmissionsSection from "./components/AdmissionsSection";
import ContactSection from "./components/ContactSection";
import BlogSection from "./components/BlogSection";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import VoiceAssistant from "./components/VoiceAssistant";
import Dashboards from "./components/Dashboards";
import Playroom from "./components/Playroom";
import { MessageSquare, Volume2, Sparkles, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [admissionFormType, setAdmissionFormType] = useState<"admission" | "tour">("admission");
  const [selectedEnquiryProgram, setSelectedEnquiryProgram] = useState<string>("Nursery");

  // Floating AI assist states
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

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
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col justify-between selection:bg-yellow-200 selection:text-slate-900">
      
      {/* Upper Navigation bar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onBookTourClick={handleBookTour}
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
              <ProgramsSection onEnquireClick={handleEnquireProgram} />
              <FacilitiesSection />
              <Testimonials />
              <GallerySection />
              <BlogSection />
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
              <ProgramsSection onEnquireClick={handleEnquireProgram} />
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
              />
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
          <AnimatePresence>
            {isVoiceOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute bottom-16 right-0 w-80 sm:w-96"
              >
                <VoiceAssistant onClose={() => setIsVoiceOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>
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

    </div>
  );
}
