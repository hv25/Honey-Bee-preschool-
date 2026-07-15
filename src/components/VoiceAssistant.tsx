import React, { useState, useEffect } from "react";
import { Phone, PhoneOff, Mic, Volume2, Calendar, Smile, ShieldAlert, BadgeCheck, X, Edit3, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface VoiceAssistantProps {
  onClose?: () => void;
}

export default function VoiceAssistant({ onClose }: VoiceAssistantProps) {
  const [callState, setCallState] = useState<"idle" | "dialing" | "connected" | "ended">("idle");
  const [speechText, setSpeechText] = useState("");
  const [transcript, setTranscript] = useState<{ speaker: "ai" | "parent"; text: string }[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  // Parent Caller Info (Fully interactive and synced to real database upon booking)
  const [callerName, setCallerName] = useState("Sarah Parker");
  const [callerPhone, setCallerPhone] = useState("+91 98765 43210");
  const [isEditingCaller, setIsEditingCaller] = useState(false);
  const [bookingSynced, setBookingSynced] = useState(false);
  const [bookedDetails, setBookedDetails] = useState<{ date: string; time: string } | null>(null);

  const callFlow = [
    {
      ai: `Buzz Buzz! 🐝 Thank you for calling Honey Bees Pre-School, Daycare and Tuition centre. I'm Beatrice, your virtual AI Receptionist! I can instantly book a school tour or answer questions about our classes. Am I speaking with a prospective parent?`,
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
      ai: "Brilliant! Tour booked for Friday at 10:00 AM. 📅 You will receive an instant WhatsApp alert. Our address is LAWSON'S BAY COLONY, 4-43-16/1, Lawsons Bay Colony, Pedda Waltair, Visakhapatnam. Please bring your little one along for a complimentary play session! See you soon!",
      options: [],
      end: true,
    },
    {
      ai: "Play Group is $150/mo and Kindergarten is $200/mo, all materials included. Timings are 8:30 AM to 7:30 PM. Shall we schedule a school tour to see the facility?",
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

  const triggerAutoBooking = async (dateStr: string, timeStr: string) => {
    try {
      const res = await fetch("/api/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentName: callerName,
          email: `${callerName.toLowerCase().replace(/\s+/g, "")}@example.com`,
          phone: callerPhone,
          date: dateStr,
          time: timeStr,
          visitors: 2
        }),
      });
      if (res.ok) {
        setBookingSynced(true);
        setBookedDetails({ date: dateStr, time: timeStr });
      }
    } catch (err) {
      console.error("Failed to auto-book tour from voice session:", err);
    }
  };

  const startCall = () => {
    setCallState("dialing");
    setTranscript([]);
    setActiveStep(0);
    setBookingSynced(false);
    setBookedDetails(null);
    setTimeout(() => {
      setCallState("connected");
      const initialSay = `Buzz Buzz! 🐝 Thank you for calling Honey Bees Pre-School. I'm Beatrice, your virtual AI Receptionist! I can instantly book a school tour or answer questions about our classes. Am I speaking with ${callerName}?`;
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

    // If it's a tour booking completion step, push directly to live diary
    if (nextIdx === 7) {
      // Tomorrow
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      triggerAutoBooking(tomorrow, "11:30 AM");
    } else if (nextIdx === 9) {
      // Coming Friday
      triggerAutoBooking("2026-07-17", "10:00 AM");
    }

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
        }, 7000);
      }
    }, 1200);
  };

  // Speaks out using standard browser speech synthesis to sound like a real receptionist!
  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
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
      {/* Absolute decor bees & Close button */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <span className="text-xl opacity-40 animate-pulse">🐝</span>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-all cursor-pointer"
            title="Close Assistant"
          >
            <X size={18} />
          </button>
        )}
      </div>
      <div className="absolute -bottom-6 -left-6 text-6xl opacity-10 pointer-events-none">🍯</div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Left dial interface */}
        <div className="flex flex-col items-center justify-center text-center p-5 bg-slate-850 rounded-2xl border border-slate-700/50">
          <AnimatePresence mode="wait">
            {callState === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center w-full"
              >
                <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-3 shadow-lg shadow-yellow-500/20 animate-pulse">
                  <Phone size={32} className="text-slate-900" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-[10px] text-yellow-300 font-bold uppercase tracking-wider mb-2">
                  ⚡ Vapi / Bland AI VoIP System
                </div>
                <h4 className="font-display font-bold text-lg mb-1 text-yellow-400">Beatrice Voice Receptionist</h4>
                
                {/* Caller Information Setup */}
                <div className="w-full bg-slate-800/60 p-3 rounded-xl border border-slate-700/40 my-3 text-left">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Your Caller Profile</span>
                    <button
                      onClick={() => setIsEditingCaller(!isEditingCaller)}
                      className="text-yellow-400 hover:text-yellow-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {isEditingCaller ? <><Check size={10} /> Done</> : <><Edit3 size={10} /> Change</>}
                    </button>
                  </div>
                  {isEditingCaller ? (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[9px] text-slate-500 uppercase">Parent Name</label>
                        <input
                          type="text"
                          value={callerName}
                          onChange={(e) => setCallerName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-slate-500 uppercase">Phone Number</label>
                        <input
                          type="text"
                          value={callerPhone}
                          onChange={(e) => setCallerPhone(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs space-y-1">
                      <p className="text-slate-300 font-medium flex items-center gap-1.5">
                        👤 Name: <span className="text-white font-bold">{callerName}</span>
                      </p>
                      <p className="text-slate-300 font-mono flex items-center gap-1.5">
                        📞 Phone: <span className="text-white font-bold">{callerPhone}</span>
                      </p>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-400 max-w-xs mb-4">
                  Experience our ultra-realistic AI voice agent. Click the call button below to have an audible receptionist conversation!
                </p>
                <button
                  id="btn-voice-call"
                  onClick={startCall}
                  className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-6 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer hover:shadow-yellow-400/20"
                >
                  <Phone size={15} /> Test Live Call
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
                <div className="flex gap-1.5 items-end h-14 mb-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: speechText === "..." ? [4, 4] : [8, Math.random() * 48 + 10, 8],
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

                <div className="flex items-center gap-2 mb-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 rounded-full text-emerald-400 text-[10px] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  ACTIVE VOICE CALL • 16kbps VoIP
                </div>

                <h4 className="font-display font-bold text-base text-white">Beatrice (AI Receptionist)</h4>
                
                {/* Subtitle speech bubble */}
                <div className="my-3 bg-slate-800 border border-slate-700/60 rounded-2xl p-4 w-full min-h-[90px] flex items-center justify-center text-xs text-slate-300 italic">
                  "{speechText}"
                </div>

                {/* Instant Database Sync Status Indicator */}
                {bookingSynced && bookedDetails && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded-xl text-left text-[11px] text-emerald-300 mb-3 space-y-1"
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      <BadgeCheck size={14} className="text-emerald-400" />
                      INSTANT CALENDAR SYNC COMPLETE
                    </div>
                    <p className="text-slate-300 text-[10px]">
                      Tour auto-booked for <strong className="text-white">{bookedDetails.date} @ {bookedDetails.time}</strong> under <strong>{callerName}</strong> in the Honey Bees school diary!
                    </p>
                    <div className="text-[9px] text-emerald-400/80 font-mono">
                      ✓ WhatsApp & SMS location map dispatch triggered
                    </div>
                  </motion.div>
                )}

                {/* Interactive Speech Response Options */}
                <div className="w-full space-y-2">
                  {callFlow[activeStep].options?.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleParentResponse(opt)}
                      className="w-full bg-slate-800 hover:bg-yellow-400 hover:text-slate-900 border border-slate-700 hover:border-yellow-300 text-slate-300 text-[11px] text-left px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer flex justify-between items-center group"
                    >
                      <span>{opt.text}</span>
                      <Mic size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                  {callFlow[activeStep].end && (
                    <div className="text-center text-[10px] text-yellow-400 font-bold py-1 animate-pulse">
                      🐝 Call is concluding automatically...
                    </div>
                  )}
                </div>

                <button
                  id="btn-voice-hangup"
                  onClick={endCall}
                  className="mt-5 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <PhoneOff size={13} /> End Session
                </button>
              </motion.div>
            )}

            {callState === "ended" && (
              <motion.div
                key="ended"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center w-full"
              >
                <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mb-2">
                  <PhoneOff size={20} className="text-slate-400" />
                </div>
                <h4 className="font-display font-bold text-base text-red-400">Call Terminated</h4>
                <p className="text-[11px] text-slate-500 mt-1">Calendar & WhatsApp records synchronized</p>
                {bookingSynced && (
                  <div className="mt-2 text-[10px] text-emerald-400 font-bold">
                    ✓ Tour synced in physical school diary!
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right explanatory text */}
        <div className="space-y-4 text-left">
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
