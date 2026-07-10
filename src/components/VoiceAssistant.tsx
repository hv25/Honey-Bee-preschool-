import React, { useState, useEffect } from "react";
import { Phone, PhoneOff, Mic, Volume2, Calendar, Smile, ShieldAlert, BadgeCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function VoiceAssistant() {
  const [callState, setCallState] = useState<"idle" | "dialing" | "connected" | "ended">("idle");
  const [speechText, setSpeechText] = useState("");
  const [transcript, setTranscript] = useState<{ speaker: "ai" | "parent"; text: string }[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  const callFlow = [
    {
      ai: "Buzz Buzz! 🐝 Thank you for calling Honey Bees Pre-School, Daycare and Tuition centre. I'm Beatrice, your virtual AI Receptionist! I can instantly book a school tour or answer questions about our classes. Am I speaking with a prospective parent?",
      options: [
        { text: "Yes, I am a parent looking for admission!", nextStep: 1 },
        { text: "Just wanted to know the daycare timings", nextStep: 2 },
        { text: "No, sorry, wrong number", nextStep: 3 },
      ],
    },
    {
      ai: "Wonderful! We are currently accepting admissions for Play Group, Nursery, LKG, and UKG! 🎉 Which program are you most interested in exploring for your little one?",
      options: [
        { text: "Nursery / Kindergarten", nextStep: 4 },
        { text: "Daycare with meals", nextStep: 5 },
        { text: "Tuition for school kids", nextStep: 6 },
      ],
    },
    {
      ai: "Our Daycare serves children from 6 months up to 10 years! 🧸 We're open from 8:00 AM to 6:30 PM, serving healthy organic meals. Would you like me to book a quick physical tour this week so you can see our foam play arenas and CCTV monitors?",
      options: [
        { text: "Yes, please book a tour!", nextStep: 7 },
        { text: "Tell me about security first", nextStep: 8 },
      ],
    },
    {
      ai: "No problem at all! Have a beautiful and honey-sweet day! Buzz! 🐝",
      options: [],
      end: true,
    },
    {
      ai: "Our Kindergarten programs are highly interactive with play-based phonics and sensory mathematics! 📚 Would you like me to schedule a guided tour for you this Friday at 10:00 AM to meet the teachers?",
      options: [
        { text: "Yes, Friday 10 AM works perfectly!", nextStep: 9 },
        { text: "What are the timings and fees?", nextStep: 10 },
      ],
    },
    {
      ai: "Daycare is highly premium here! Enrolled parents get full secure login to our CCTV cameras. 🛡️ Caregivers are CPR-certified. Shall we book a school visit for you?",
      options: [
        { text: "Yes, I'd love to visit the daycare!", nextStep: 7 },
        { text: "No, just send me the brochure", nextStep: 11 },
      ],
    },
    {
      ai: "Our after-school Tuition Centre handles Grades 1-10 with expert math, science, and English tutors from 4 PM - 7:30 PM! 📝 Should I have our coordinator call you back for pricing?",
      options: [
        { text: "Yes, please call me back", nextStep: 12 },
        { text: "No, I'll browse online", nextStep: 3 },
      ],
    },
    {
      ai: "Excellent! Let's reserve a tour. I have automatically updated our Google Calendar for you. 📅 A confirmation SMS with a map link is flying to your phone! We cannot wait to show you our colorful hive!",
      options: [],
      end: true,
    },
    {
      ai: "Safety is our core promise! Enrolled parents receive a secure portal login with live 1080p CCTV feeds. All exits have triple childproof electromagnetic locks. Shall we book a tour?",
      options: [
        { text: "Yes, book a tour slot!", nextStep: 7 },
        { text: "Okay, thank you for the info!", nextStep: 3 },
      ],
    },
    {
      ai: "Brilliant! Tour booked for Friday at 10:00 AM. 📅 You will receive an instant WhatsApp alert. Our address is 123 Honeycomb Lane. Please bring your little one along for a complimentary play session! See you soon!",
      options: [],
      end: true,
    },
    {
      ai: "Play Group is $150/mo and Kindergarten is $200/mo, all materials included. Timings are 9:00 AM to 12:30 PM. Shall we schedule a school tour to see the facility?",
      options: [
        { text: "Yes, let's book a tour!", nextStep: 7 },
        { text: "I'll think about it, thank you", nextStep: 3 },
      ],
    },
    {
      ai: "I've sent our interactive Honey Bees prospectus/brochure PDF to your registered email! 🐝 Feel free to call us back if you have any questions. Buzz!",
      options: [],
      end: true,
    },
    {
      ai: "Perfect! Our administrative coordinator will call you back on your number shortly. 📞 Thank you for contacting Honey Bees Pre-School, Daycare and Tuition centre! Buzz!",
      options: [],
      end: true,
    },
  ];

  const startCall = () => {
    setCallState("dialing");
    setTranscript([]);
    setActiveStep(0);
    setTimeout(() => {
      setCallState("connected");
      const initialSay = callFlow[0].ai;
      setSpeechText(initialSay);
      setTranscript([{ speaker: "ai", text: initialSay }]);
      speakText(initialSay);
    }, 2000);
  };

  const endCall = () => {
    setCallState("ended");
    window.speechSynthesis?.cancel();
    setTimeout(() => {
      setCallState("idle");
    }, 1500);
  };

  const handleParentResponse = (option: { text: string; nextStep: number }) => {
    const parentText = option.text;
    const nextIdx = option.nextStep;
    const stepData = callFlow[nextIdx];

    setTranscript((prev) => [...prev, { speaker: "parent", text: parentText }]);
    setActiveStep(nextIdx);

    // AI is "thinking/typing" slightly
    setSpeechText("...");
    setTimeout(() => {
      const aiResponse = stepData.ai;
      setSpeechText(aiResponse);
      setTranscript((prev) => [...prev, { speaker: "ai", text: aiResponse }]);
      speakText(aiResponse);

      if (stepData.end) {
        setTimeout(() => {
          endCall();
        }, 5000);
      }
    }, 1200);
  };

  // Speaks out using standard browser speech synthesis to sound like a real receptionist!
  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find a pleasant female voice or high pitch
    const voices = window.speechSynthesis.getVoices();
    const sweetVoice = voices.find(
      (v) => v.name.includes("Google US English") || v.name.includes("Female") || v.lang.includes("en-US")
    );
    if (sweetVoice) utterance.voice = sweetVoice;
    utterance.pitch = 1.25; // sweet cute receptionist tone
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border-2 border-yellow-400">
      {/* Absolute decor bees */}
      <div className="absolute top-4 right-4 text-3xl opacity-20">🐝</div>
      <div className="absolute -bottom-6 -left-6 text-6xl opacity-10">🍯</div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Left dial interface */}
        <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-850 rounded-2xl border border-slate-700/50">
          <AnimatePresence mode="wait">
            {callState === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/20 animate-pulse">
                  <Phone size={36} className="text-slate-900" />
                </div>
                <h4 className="font-display font-bold text-xl mb-1 text-yellow-400">Beatrice AI Voice Agent</h4>
                <p className="text-sm text-slate-400 max-w-xs mb-6">
                  Test our state-of-the-art AI Voice Receptionist! Click call to have a friendly real-time voice chat.
                </p>
                <button
                  id="btn-voice-call"
                  onClick={startCall}
                  className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer hover:shadow-yellow-400/20"
                >
                  <Phone size={18} /> Test Live Call
                </button>
              </motion.div>
            )}

            {callState === "dialing" && (
              <motion.div
                key="dialing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center"
              >
                <div className="relative flex items-center justify-center mb-6">
                  <div className="absolute w-24 h-24 bg-yellow-500/10 rounded-full animate-ping" />
                  <div className="absolute w-20 h-20 bg-yellow-500/20 rounded-full animate-ping [animation-delay:0.5s]" />
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center z-10">
                    <Phone size={24} className="text-slate-900 animate-bounce" />
                  </div>
                </div>
                <h4 className="font-display font-bold text-lg text-yellow-400 animate-pulse">Dialing Beatrice AI...</h4>
                <p className="text-xs text-slate-500 mt-2">Initializing VoIP speech synthesis channels</p>
                <button
                  id="btn-voice-cancel"
                  onClick={endCall}
                  className="mt-8 bg-red-500 hover:bg-red-600 text-white p-3.5 rounded-full transition-all cursor-pointer"
                >
                  <PhoneOff size={20} />
                </button>
              </motion.div>
            )}

            {callState === "connected" && (
              <motion.div
                key="connected"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center w-full"
              >
                {/* Active audio visualizer wave */}
                <div className="flex gap-1.5 items-end h-16 mb-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: speechText === "..." ? [4, 4] : [8, Math.random() * 56 + 12, 8],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.6 + i * 0.05,
                        ease: "easeInOut",
                      }}
                      className="w-1.5 bg-yellow-400 rounded-full"
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2 mb-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 rounded-full text-emerald-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  ACTIVE VOICE CALL
                </div>

                <h4 className="font-display font-bold text-lg text-white">Beatrice (AI Receptionist)</h4>
                <span className="text-[10px] text-slate-500">Audio Stream 16kbps PCM Little-Endian</span>

                {/* Subtitle speech bubble */}
                <div className="my-5 bg-slate-800 border border-slate-700/60 rounded-2xl p-4 w-full min-h-[90px] flex items-center justify-center text-sm text-slate-300 italic">
                  "{speechText}"
                </div>

                {/* Interactive Speech Response Options */}
                <div className="w-full space-y-2 mt-2">
                  {callFlow[activeStep].options?.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleParentResponse(opt)}
                      className="w-full bg-slate-800 hover:bg-yellow-400 hover:text-slate-900 border border-slate-700 hover:border-yellow-300 text-slate-300 text-xs text-left px-4 py-2.5 rounded-xl font-medium transition-all cursor-pointer flex justify-between items-center group"
                    >
                      <span>{opt.text}</span>
                      <Mic size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                  {callFlow[activeStep].end && (
                    <div className="text-center text-xs text-yellow-400 font-bold py-2 animate-pulse">
                      🐝 Call is concluding automatically...
                    </div>
                  )}
                </div>

                <button
                  id="btn-voice-hangup"
                  onClick={endCall}
                  className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <PhoneOff size={14} /> End Session
                </button>
              </motion.div>
            )}

            {callState === "ended" && (
              <motion.div
                key="ended"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-3">
                  <PhoneOff size={24} className="text-slate-400" />
                </div>
                <h4 className="font-display font-bold text-lg text-red-400">Call Terminated</h4>
                <p className="text-xs text-slate-500 mt-1">Calendar & WhatsApp records synchronized</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right explanatory text */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-yellow-400 font-display font-semibold text-sm uppercase tracking-wider">
            <Volume2 size={16} /> Instant Admissions Automation
          </div>
          <h3 className="font-display font-extrabold text-2xl sm:text-3xl leading-tight text-white">
            Meet Our 24/7 AI Voice Receptionist
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            By integrating Vapi / Bland AI systems, Honey Bees is the first preschool where parents are never put on hold.
            Prospective parents can talk directly to our receptionist over VoIP, ask about curriculums, and automatically schedule school tours directly in the school diary.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 flex gap-2.5 items-start">
              <Calendar className="text-yellow-400 mt-0.5 shrink-0" size={16} />
              <div>
                <h5 className="text-xs font-bold text-slate-200">Instant Calendar Sync</h5>
                <p className="text-[10px] text-slate-500">Auto-books physical tour slots</p>
              </div>
            </div>
            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 flex gap-2.5 items-start">
              <BadgeCheck className="text-yellow-400 mt-0.5 shrink-0" size={16} />
              <div>
                <h5 className="text-xs font-bold text-slate-200">SMS / WhatsApp Alert</h5>
                <p className="text-[10px] text-slate-500">Fires instant map location link</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-400/10 border border-yellow-400/20 p-3 rounded-2xl flex gap-2.5 items-start text-xs text-yellow-300">
            <Smile size={16} className="shrink-0 mt-0.5" />
            <p>
              <strong>Sound On!</strong> Beatrice uses high-quality HTML5 speech synthesis to answer your options audibly. Give it a try!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
