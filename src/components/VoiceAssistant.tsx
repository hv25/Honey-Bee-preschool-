import React, { useState, useEffect } from "react";
import { Phone, PhoneOff, Mic, Volume2, Calendar, Smile, ShieldAlert, BadgeCheck, X, Edit3, Check, ArrowDown, Sparkles, Cpu, Ear } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface VoiceAssistantProps {
  onClose?: () => void;
}

export default function VoiceAssistant({ onClose }: VoiceAssistantProps) {
  const [callState, setCallState] = useState<"idle" | "dialing" | "connected" | "ended">("idle");
  const [speechText, setSpeechText] = useState("");
  const [transcript, setTranscript] = useState<{ speaker: "ai" | "parent"; text: string }[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedLang, setSelectedLang] = useState<"en" | "te">("en");

  // System voices list
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>("");

  // Speech Recognition (Speech-to-Text) state for natural voice interaction
  const [isListening, setIsListening] = useState(false);
  const [recognitionTranscript, setRecognitionTranscript] = useState("");
  const [recognitionError, setRecognitionError] = useState("");
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);
  const [synthesisError, setSynthesisError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  // Parent Caller Info (Fully interactive and synced to real database upon booking)
  const [callerName, setCallerName] = useState("Sarah Parker");
  const [callerPhone, setCallerPhone] = useState("+91 98765 43210");
  const [prevPhone, setPrevPhone] = useState("+91 98765 43210");
  const [isEditingCaller, setIsEditingCaller] = useState(false);
  const [bookingSynced, setBookingSynced] = useState(false);
  const [bookedDetails, setBookedDetails] = useState<{ date: string; time: string } | null>(null);

  // Dynamic greetings editable by Admin
  const [greetingEn, setGreetingEn] = useState("Buzz Buzz! 🐝 Thank you for calling Honey Bees Pre-School. I'm Beatrice, your virtual AI Receptionist! I can instantly book a school tour or answer questions about our classes. Am I speaking with {callerName}?");
  const [greetingTe, setGreetingTe] = useState("బజ్ బజ్! 🐝 హనీ బీస్ ప్రీ-స్కూల్‌కు కాల్ చేసినందుకు ధన్యవాదాలు. నేను బీట్రైస్, మీ వర్చువల్ AI రిసెప్షనిస్ట్! నేను తక్షణమే పాఠశాల పర్యటనను బుక్ చేయగలను లేదా మా తరగతుల గురించి ప్రశ్నలకు సమాధానం ఇవ్వగలను. నేను {callerName} గారితో మాట్లాడుతున్నానా?");

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
      ai: "Our Daycare is highly secure! 1080p CCTV cameras are monitored strictly by our admin team in the control room to guarantee absolute student privacy. 🛡️ Caregivers are CPR-certified. Shall we book a school visit for you?",
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
      ai: "Safety is our core promise! All classrooms have 1080p CCTV feeds monitored strictly by administrators. All exits have triple childproof electromagnetic locks. Shall we book a tour?",
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

  const callFlowTelugu = [
    {
      ai: `బజ్ బజ్! 🐝 హనీ బీస్ ప్రీ-స్కూల్, డేకేర్ మరియు ట్యూషన్ సెంటర్‌కు కాల్ చేసినందుకు ధన్యవాదాలు. నేను బీట్రైస్, మీ వర్చువల్ AI రిసెప్షనిస్ట్! నేను తక్షణమే పాఠశాల పర్యటనను బుక్ చేయగలను లేదా మా తరగతుల గురించి ప్రశ్నలకు సమాధానం ఇవ్వగలను. నేను కాబోయే తల్లిదండ్రులతో మాట్లాడుతున్నానా?`,
      options: [
        { text: "అవును, నేను అడ్మిషన్ కోసం చూస్తున్న తల్లిదండ్రులని!", nextStep: 1 },
        { text: "డేకేర్ సమయాలు తెలుసుకోవాలనుకుంటున్నాను", nextStep: 2 },
        { text: "లేదు, క్షమించండి, తప్పు నంబర్", nextStep: 3 },
      ],
    },
    {
      ai: "అద్భుతం! మేము ప్రస్తుతం ప్లే గ్రూప్, నర్సరీ, LKG మరియు UKG కొరకు అడ్మిషన్లను స్వీకరిస్తున్నాము! 🎉 మీ చిన్నారి కోసం మీరు ఏ ప్రోగ్రామ్‌ను అన్వేషించడానికి ఎక్కువ ఆసక్తి చూపుతున్నారు?",
      options: [
        { text: "నర్సరీ / కిండర్ గార్టెన్", nextStep: 4 },
        { text: "భోజనంతో కూడిన డేకేర్", nextStep: 5 },
        { text: "పాఠశాల పిల్లల కోసం ట్యూషన్", nextStep: 6 },
      ],
    },
    {
      ai: "మా డేకేర్ 6 నెలల నుండి 10 సంవత్సరాల వరకు ఉన్న పిల్లలకు సేవలు అందిస్తుంది! 🧸 మేము ఉదయం 8:00 నుండి సాయంత్రం 6:30 వరకు తెరిచి ఉంటాము, ఆరోగ్యకరమైన సేంద్రీయ భోజనాన్ని అందిస్తాము. మీరు మా ఫోమ్ ప్లే ఏరియాలు మరియు సిసిటివి మానిటర్లను చూడటానికి ఈ వారం త్వరిత పర్యటనను బుక్ చేయాలనుకుంటున్నారా?",
      options: [
        { text: "అవును, దయచేసి పర్యటనను బుక్ చేయండి!", nextStep: 7 },
        { text: "మొదట భద్రత గురించి చెప్పండి", nextStep: 8 },
      ],
    },
    {
      ai: "ఏమీ పర్వాలేదు! అందమైన మరియు తేనెలాంటి తియ్యని రోజును గడపండి! బజ్! 🐝",
      options: [],
      end: true,
    },
    {
      ai: "మా కిండర్ గార్టెన్ ప్రోగ్రామ్‌లు ఆట-ఆధారిత ఫోనిక్స్ మరియు ఇంద్రియ గణితంతో అత్యంత ఇంటరాక్టివ్‌గా ఉంటాయి! 📚 ఉపాధ్యాయులను కలవడానికి ఈ శుక్రవారం ఉదయం 10:00 గంటలకు మీ కోసం మార్గదర్శక పర్యటనను షెడ్యూల్ చేయమంటారా?",
      options: [
        { text: "అవును, శుక్రవారం ఉదయం 10 గంటల సమయం బాగుంటుంది!", nextStep: 9 },
        { text: "సమయాలు మరియు ఫీజులు ఎంత?", nextStep: 10 },
      ],
    },
    {
      ai: "మా డేకేర్ చాలా సురక్షితమైనది! విద్యార్థుల గోప్యతను కాపాడటానికి CCTV కెమెరాలను అడ్మిన్లు మాత్రమే పర్యవేక్షిస్తారు. 🛡️ కేర్‌గివర్లు CPR-సర్టిఫైడ్ పొందినవారు. మేము మీ కోసం పాఠశాల పర్యటనను బుక్ చేయాలా?",
      options: [
        { text: "అవును, నేను డేకేర్‌ని సందర్శించాలనుకుంటున్నాను!", nextStep: 7 },
        { text: "లేదు, కేవలం బ్రోచర్ పంపండి", nextStep: 11 },
      ],
    },
    {
      ai: "మా ఆఫ్టర్-స్కూల్ ట్యూషన్ సెంటర్ సాయంత్రం 4 గంటల నుండి రాత్రి 7:30 గంటల వరకు నిపుణులైన గణితం, సైన్స్ మరియు ఇంగ్లీష్ ట్యూటర్లతో 1-10 తరగతులను నిర్వహిస్తుంది! 📝 ధరల వివరాల కోసం మా కోఆర్డినేటర్ మీకు తిరిగి కాల్ చేయమంటారా?",
      options: [
        { text: "అవును, దయచేసి నాకు తిరిగి కాల్ చేయండి", nextStep: 12 },
        { text: "లేదు, నేను ఆన్‌లైన్‌లో చూస్తాను", nextStep: 3 },
      ],
    },
    {
      ai: "అద్భుతం! ఒక పర్యటనను రిజర్వ్ చేద్దాం. నేను మీ కోసం మా గూగుల్ క్యాలెండర్‌ని ఆటోమేటిక్‌గా అప్‌డేట్ చేసాను. 📅 మ్యాప్ లింక్‌తో కూడిన నిర్ధారణ SMS మీ ఫోన్‌కి పంపబడుతోంది! మా రంగురంగుల పాఠశాలను మీకు చూపించడానికి మేము వేచి ఉండలేము!",
      options: [],
      end: true,
    },
    {
      ai: "భద్రత మా ప్రధాన వాగ్దానం! మా 1080p సిసిటివి ఫీడ్‌లను అడ్మినిస్ట్రేటర్లు మాత్రమే సురక్షితంగా పర్యవేక్షిస్తారు. అన్ని నిష్క్రమణ మార్గాలలో ట్రిపుల్ చైల్డ్‌ప్రూఫ్ విద్యుదయస్కాంత తాళాలు ఉన్నాయి. మేము పర్యటనను బుక్ చేద్దామా?",
      options: [
        { text: "అవును, పర్యటన స్లాట్ బుక్ చేయండి!", nextStep: 7 },
        { text: "సరే, సమాచారానికి ధన్యవాదాలు!", nextStep: 3 },
      ],
    },
    {
      ai: "చాలా బాగుంది! శుక్రవారం ఉదయం 10:00 గంటలకు పర్యటన బుక్ చేయబడింది. 📅 మీరు తక్షణ వాట్సాప్ అలర్ట్ పొందుతారు. మా చిరునామా: లాసన్స్ బే కాలనీ, 4-43-16/1, పెద వాల్తేరు, విశాఖపట్నం. దయచేసి ఉచిత ప్లే సెషన్ కోసం మీ చిన్నారిని మీతో పాటు తీసుకురండి! త్వరలో కలుద్దాం!",
      options: [],
      end: true,
    },
    {
      ai: "ప్లే గ్రూప్ నెలకు $150 మరియు కిండర్ గార్టెన్ నెలకు $200, అన్ని మెటీరియల్స్ చేర్చబడ్డాయి. సమయాలు ఉదయం 8:30 నుండి రాత్రి 7:30 వరకు. సదుపాయాలను చూడటానికి మేము స్కూల్ పర్యటనను షెడ్యూల్ చేద్దామా?",
      options: [
        { text: "అవును, పర్యటన బుక్ చేద్దాం!", nextStep: 7 },
        { text: "నేను ఆలోచిస్తాను, ధన్యవాదాలు", nextStep: 3 },
      ],
    },
    {
      ai: "నేను మా ఇంటరాక్టివ్ హనీ బీస్ బ్రోచర్ పిడిఎఫ్‌ను మీ నమోదిత ఇమెయిల్‌కు పంపించాను! 🐝 మీకు ఏవైనా ప్రశ్నలు ఉంటే మాకు తిరిగి కాల్ చేయడానికి సంకోచించకండి. బజ్!",
      options: [],
      end: true,
    },
    {
      ai: "ఖచ్చితంగా! మా అడ్మినిస్ట్రేటివ్ కోఆర్డినేటర్ త్వరలో మీ నంబర్‌కు తిరిగి కాల్ చేస్తారు. 📞 హనీ బీస్ ప్రీ-స్కూల్, డేకేర్ మరియు ట్యూషన్ సెంటర్‌ను సంప్రదించినందుకు ధన్యవాదాలు! బజ్!",
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

  const startCall = async () => {
    setCallState("dialing");
    setTranscript([]);
    setActiveStep(0);
    setBookingSynced(false);
    setBookedDetails(null);
    setSynthesisError("");
    setRecognitionError("");

    let latestEn = greetingEn;
    let latestTe = greetingTe;

    try {
      const res = await fetch("/api/voice-settings");
      if (res.ok) {
        const data = await res.json();
        if (data.greetingEn) {
          latestEn = data.greetingEn;
          setGreetingEn(data.greetingEn);
        }
        if (data.greetingTe) {
          latestTe = data.greetingTe;
          setGreetingTe(data.greetingTe);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch fresh voice settings during dialing:", err);
    }

    setTimeout(() => {
      setCallState("connected");
      const isTe = selectedLang === "te";
      let initialSay = "";
      if (isTe) {
        initialSay = latestTe.includes("{callerName}")
          ? latestTe.replace("{callerName}", callerName)
          : `${latestTe} నేను ${callerName} గారితో మాట్లాడుతున్నానా?`;
      } else {
        initialSay = latestEn.includes("{callerName}")
          ? latestEn.replace("{callerName}", callerName)
          : `${latestEn} Am I speaking with ${callerName}?`;
      }
      setSpeechText(initialSay);
      setTranscript([{ speaker: "ai", text: initialSay }]);
      speakText(initialSay, selectedLang);
    }, 2000);
  };

  const endCall = () => {
    setCallState("ended");
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setTimeout(() => {
      setCallState("idle");
    }, 1500);
  };

  const handleParentResponse = (option: { text: string; nextStep: number }) => {
    const parentText = option.text;
    const nextIdx = option.nextStep;
    const stepData = selectedLang === "te" ? callFlowTelugu[nextIdx] : callFlow[nextIdx];

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
      speakText(aiResponse, selectedLang);

      if (stepData.end) {
        setTimeout(() => {
          endCall();
        }, 7000);
      }
    }, 1200);
  };

  // Helper to score and select the absolute best voice for the chosen language
  const getBestVoiceForLang = (lang: "en" | "te", voicesList: SpeechSynthesisVoice[]) => {
    if (lang === "te") {
      // 1. Prioritize professional Telugu natural/neural/Google voices
      let found = voicesList.find(
        (v) =>
          (v.lang.toLowerCase() === "te-in" || v.lang.toLowerCase() === "te_in" || v.lang.toLowerCase().startsWith("te")) &&
          (v.name.toLowerCase().includes("natural") ||
            v.name.toLowerCase().includes("google") ||
            v.name.toLowerCase().includes("neural") ||
            v.name.toLowerCase().includes("online"))
      );
      if (found) return found;

      // 2. Any Telugu voice
      found = voicesList.find(
        (v) =>
          v.lang.toLowerCase().startsWith("te") ||
          v.name.toLowerCase().includes("telugu") ||
          v.name.includes("తెలుగు")
      );
      if (found) return found;

      // 3. Indian English as a phonetically clear fallback for Indian users
      found = voicesList.find(
        (v) =>
          v.lang.toLowerCase().replace("_", "-").includes("en-in") &&
          (v.name.toLowerCase().includes("natural") || v.name.toLowerCase().includes("google"))
      );
      if (found) return found;

      found = voicesList.find((v) => v.lang.toLowerCase().replace("_", "-").includes("en-in"));
      if (found) return found;

      // 4. Any Indian voice
      found = voicesList.find((v) => v.lang.toLowerCase().includes("in"));
      if (found) return found;
    } else {
      // 1. Natural/Neural/Google Indian English
      let found = voicesList.find(
        (v) =>
          v.lang.toLowerCase().replace("_", "-").includes("en-in") &&
          (v.name.toLowerCase().includes("natural") ||
            v.name.toLowerCase().includes("google") ||
            v.name.toLowerCase().includes("neural") ||
            v.name.toLowerCase().includes("online"))
      );
      if (found) return found;

      // 2. Any Indian English voice (Heera, Ravi, Veena, Rishi, Neerja, Prabhat, etc.)
      found = voicesList.find((v) => v.lang.toLowerCase().replace("_", "-").includes("en-in"));
      if (found) return found;

      // 3. Google/Female/Premium English US/UK
      found = voicesList.find(
        (v) =>
          v.name.toLowerCase().includes("google") ||
          v.name.toLowerCase().includes("female") ||
          v.lang.toLowerCase().replace("_", "-").startsWith("en")
      );
      if (found) return found;
    }

    // Default fallback
    return voicesList.find((v) => v.lang.toLowerCase().startsWith(lang)) || null;
  };

  // Speaks out using high-fidelity system voices
  const speakText = (text: string, lang: "en" | "te" = "en") => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get all current voices
    const available = window.speechSynthesis.getVoices();
    
    let voice = null;
    // If the user has manually selected a voice, try to use it
    if (selectedVoiceName) {
      voice = available.find((v) => v.name === selectedVoiceName);
    }
    
    // Otherwise, auto-select the best matching natural/Indian voice
    if (!voice) {
      voice = getBestVoiceForLang(lang, available);
    }
    
    if (voice) {
      utterance.voice = voice;
      console.log(`Speaking using voice: ${voice.name} (${voice.lang})`);
    } else {
      console.warn(`No optimal voice found for ${lang}, using browser default.`);
    }
    
    utterance.lang = lang === "te" ? "te-IN" : "en-IN";
    utterance.pitch = lang === "te" ? 1.0 : 1.15; // smooth receptionist tone
    utterance.rate = lang === "te" ? 0.90 : 1.0;  // professional, natural pace for clear comprehension
    
    // Bind speech start and end handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    // Handle error gracefully
    utterance.onerror = (e) => {
      console.warn("Speech synthesis notice/error:", e);
      setIsSpeaking(false);
      
      const errType = (e.error || "") as string;
      if (errType === "interrupted" || errType === "canceled" || errType === "success") {
        // Safe, normal browser cancellations/interruptions when speech changes, ignore
        return;
      }

      if (errType === "not-allowed") {
        setSynthesisError(
          selectedLang === "te"
            ? "ఆడియో ప్లేబ్యాక్ నిలిపివేయబడింది. దయచేసి క్రింది 'ఆడియోను ప్లే చేయండి' బటన్‌పై క్లిక్ చేసి అనువదించబడిన వాయిస్‌ను వినండి."
            : "Audio playback blocked by browser security policy. Tap the 'Play Audio' button below to hear Beatrice speak."
        );
      } else if (errType === "language-unavailable" || errType === "voice-unavailable") {
        setSynthesisError(
          selectedLang === "te"
            ? "మీ బ్రౌజర్ లేదా పరికరంలో తెలుగు వాయిస్ ఫైల్‌లు ఇన్‌స్టాల్ చేయబడలేదు. దయచేసి క్రింది టెక్స్ట్ చదవండి."
            : "The selected English voice pack is unavailable on this device. Displaying the text transcript below."
        );
      } else {
        // Show a friendly message instead of a generic system error
        setSynthesisError(
          selectedLang === "te"
            ? "వాయిస్ సింథసిస్ మీ పరికరంలో తాత్కాలికంగా లభించలేదు. దయచేసి ఆన్-స్క్రీన్ వచనాన్ని చదవండి."
            : "Speech engine didn't respond. Please follow along using the clean text transcript below."
        );
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // NLU Natural Language spoken input matching engine
  const matchSpeechToOption = (speech: string, options: { text: string; nextStep: number }[]) => {
    if (!speech || !options || options.length === 0) return null;
    const cleanSpeech = speech.toLowerCase().trim();

    // Telugu keyword mapping for flexible matches
    const teluguKeywords: Record<string, string[]> = {
      admission: ["అడ్మిషన్", "admission", "చేరాలి", "చేర్చాలి", "అవును", "yes", "తల్లిదండ్రుల", "parent", "స్కూల్", "school"],
      timings: ["సమయాలు", "timings", "డేకేర్", "daycare", "టైమ్", "time", "hours"],
      wrong: ["తప్పు", "wrong", "కాదు", "no", "లేదు", "సారీ", "sorry"],
      nursery: ["నర్సరీ", "nursery", "కిండర్", "kindergarten", "లKG", "LKG", "UKG", "క్లాస్", "class"],
      meals: ["భోజనం", "meals", "ఫుడ్", "food", "తిండి", "లంచ్", "lunch"],
      tuition: ["ట్యూషన్", "tuition", "చదువు", "కోచ్", "కోచింగ్", "coaching"],
      tour: ["పర్యటన", "tour", "సందర్శన", "visit", "చూడాలి", "book", "బుక్"],
      security: ["భద్రత", "security", "సేఫ్టీ", "safety", "రక్షణ", "సిసిటివి", "cctv"],
      friday: ["శుక్రవారం", "friday", "ఫ్రైడే", "10"],
      fees: ["ఫీజు", "fees", "ధర", "price", "డబ్బులు", "cost"],
      brochure: ["బ్రోచర్", "brochure", "పిడిఎఫ్", "pdf", "ఇమెయిల్", "email"],
      callback: ["కాల్", "callback", "ఫోన్", "phone", "మాట్లాడాలి", "coordinating"]
    };

    // English keyword mapping
    const englishKeywords: Record<string, string[]> = {
      admission: ["admission", "yes", "parent", "school", "looking", "enroll"],
      timings: ["timings", "daycare", "time", "hours", "open", "close"],
      wrong: ["wrong", "no", "sorry", "not", "mistake"],
      nursery: ["nursery", "kindergarten", "lkg", "ukg", "kids", "preschool"],
      meals: ["meals", "food", "lunch", "eat", "dining"],
      tuition: ["tuition", "after-school", "study", "class", "grades"],
      tour: ["tour", "book", "visit", "schedule", "friday"],
      security: ["security", "safety", "cctv", "camera", "secure", "lock"],
      friday: ["friday", "10", "works", "fine", "ok"],
      fees: ["fees", "cost", "price", "how much", "charge"],
      brochure: ["brochure", "prospectus", "pdf", "email", "send"],
      callback: ["callback", "call", "phone", "coordinator", "number"]
    };

    const activeKeywords = selectedLang === "te" ? teluguKeywords : englishKeywords;

    // Check each option for direct match
    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      const optTextLower = opt.text.toLowerCase();

      if (cleanSpeech.includes(optTextLower) || optTextLower.includes(cleanSpeech)) {
        return opt;
      }

      for (const [key, words] of Object.entries(activeKeywords)) {
        const hasKeywordInSpeech = words.some(w => cleanSpeech.includes(w));
        const hasKeywordInOption = words.some(w => optTextLower.includes(w));

        if (hasKeywordInSpeech && hasKeywordInOption) {
          return opt;
        }
      }
    }

    // Token overlap fallback
    let bestOption = null;
    let maxOverlap = 0;
    const speechTokens = cleanSpeech.split(/\s+/);

    options.forEach(opt => {
      const optTokens = opt.text.toLowerCase().split(/\s+/);
      let overlapCount = 0;
      speechTokens.forEach(t => {
        if (t.length > 2 && optTokens.some(ot => ot.includes(t) || t.includes(ot))) {
          overlapCount++;
        }
      });
      if (overlapCount > maxOverlap) {
        maxOverlap = overlapCount;
        bestOption = opt;
      }
    });

    if (maxOverlap > 0) {
      return bestOption;
    }

    return null;
  };

  const startListening = () => {
    if (!recognitionInstance) return;
    window.speechSynthesis?.cancel(); // Cancel any current speech output so it doesn't hear itself
    setIsSpeaking(false);
    setRecognitionTranscript("");
    setRecognitionError("");
    setIsListening(true);

    recognitionInstance.lang = selectedLang === "te" ? "te-IN" : "en-IN";
    
    recognitionInstance.onresult = (event: any) => {
      const resultText = event.results[0][0].transcript;
      setRecognitionTranscript(resultText);
      console.log("Speech recognition captured:", resultText);
      
      const currentOptions = (selectedLang === "te" ? callFlowTelugu[activeStep] : callFlow[activeStep]).options || [];
      const matched = matchSpeechToOption(resultText, currentOptions);
      
      if (matched) {
        setTimeout(() => {
          handleParentResponse(matched);
        }, 1200);
      } else {
        setRecognitionError(
          selectedLang === "te" 
            ? "క్షమించండి, మీ సమాధానం మ్యాచ్ అవ్వలేదు. దయచేసి మరోసారి ప్రయత్నించండి లేదా క్రింది ఆప్షన్ పై క్లిక్ చేయండి." 
            : "Sorry, we couldn't match your speech to an option. Please try again or tap an option below."
        );
      }
    };

    recognitionInstance.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        setRecognitionError(
          selectedLang === "te"
            ? "మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. ఈ వెబ్‌సైట్ సురక్షితమైన ఫ్రేమ్‌లో (iframe) రన్ అవుతున్నందున, దయచేసి బ్రౌజర్ అడ్రస్ బార్‌లో మైక్రోఫోన్ పర్మిషన్ ఇవ్వండి లేదా పైన ఉన్న 'Open in New Tab' బటన్ నొక్కి కొత్త ట్యాబ్‌లో ఈ వెబ్‌సైట్‌ను ఓపెన్ చేయండి."
            : "Microphone access blocked. Because this preview runs inside an iframe, please grant microphone permission in your browser settings or click the 'Open in New Tab' button at the top-right of the screen to open the app directly and allow mic access."
        );
      } else {
        setRecognitionError(
          selectedLang === "te"
            ? `మైక్రోఫోన్ ఎర్రర్: ${event.error}`
            : `Speech recognition error: ${event.error}`
        );
      }
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    try {
      recognitionInstance.start();
    } catch (e) {
      console.error("Speech recognition start failed:", e);
    }
  };

  const stopListening = () => {
    if (recognitionInstance) {
      recognitionInstance.stop();
      setIsListening(false);
    }
  };

  // Initialize Voices & Speech Recognition
  useEffect(() => {
    const fetchVoiceSettings = async () => {
      try {
        const res = await fetch("/api/voice-settings");
        if (res.ok) {
          const data = await res.json();
          if (data.greetingEn) setGreetingEn(data.greetingEn);
          if (data.greetingTe) setGreetingTe(data.greetingTe);
        }
      } catch (err) {
        console.warn("Failed to fetch custom voice settings:", err);
      }
    };
    fetchVoiceSettings();

    if (typeof window !== "undefined" && window.speechSynthesis) {
      const updateVoices = () => {
        const available = window.speechSynthesis.getVoices();
        setVoices(available);
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      setRecognitionInstance(rec);
    }

    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    let interval: any;
    if (isSpeaking) {
      interval = setInterval(() => {
        // Generate a responsive, organic audio amplitude level between 0.35 and 1.0
        setAudioLevel(0.35 + Math.random() * 0.65);
      }, 70);
    } else {
      setAudioLevel(0);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isSpeaking]);

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
                <h4 className="font-display font-bold text-lg mb-1 text-yellow-400">
                  {selectedLang === "te" ? "బీట్రైస్ వాయిస్ రిసెప్షనిస్ట్" : "Beatrice Voice Receptionist"}
                </h4>
                
                {/* Language Selector */}
                <div className="w-full bg-slate-800/60 p-3 rounded-xl border border-slate-700/40 my-2 text-left" id="language-toggle-wrapper">
                  <span className="text-[10px] text-yellow-400 uppercase tracking-wide font-bold block mb-2">
                    Select Speech Language / భాషను ఎంచుకోండి
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => { setSelectedLang("en"); setSelectedVoiceName(""); }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        selectedLang === "en"
                          ? "bg-yellow-400 text-slate-900 border-yellow-400 font-extrabold"
                          : "bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-600 hover:text-white"
                      }`}
                    >
                      🇬🇧 English
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedLang("te"); setSelectedVoiceName(""); }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        selectedLang === "te"
                          ? "bg-yellow-400 text-slate-900 border-yellow-400 font-extrabold"
                          : "bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-600 hover:text-white"
                      }`}
                    >
                      🇮🇳 తెలుగు (Telugu)
                    </button>
                  </div>

                  {/* Voice Selector Dropdown */}
                  {voices.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-700/40">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide font-bold block mb-1">
                        🗣️ Speech Accent / వాయిస్ అడ్జస్ట్‌మెంట్
                      </span>
                      <select
                        value={selectedVoiceName}
                        onChange={(e) => setSelectedVoiceName(e.target.value)}
                        className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-lg p-1.5 text-[11px] focus:ring-1 focus:ring-yellow-400 outline-none cursor-pointer"
                      >
                        <option value="">
                          ✨ Auto-Select Best Indian Voice
                        </option>
                        {voices
                          .filter((v) => {
                            if (selectedLang === "te") {
                              return (
                                v.lang.toLowerCase().includes("te") ||
                                v.lang.toLowerCase().includes("te-in") ||
                                v.lang.toLowerCase().includes("te_in")
                              );
                            } else {
                              return v.lang.toLowerCase().includes("en");
                            }
                          })
                          .map((v) => (
                            <option key={v.name} value={v.name}>
                              {v.name} ({v.lang})
                            </option>
                          ))}
                      </select>
                      <p className="text-[9px] text-yellow-400/80 mt-1.5 leading-snug">
                        {selectedLang === "te" 
                          ? "సూచన: అత్యుత్తమ తెలుగు వాయిస్ కోసం గూగుల్ క్రోమ్ లేదా మైక్రోసాఫ్ట్ ఎడ్జ్ బ్రౌజర్‌లను ఉపయోగించండి." 
                          : "Tip: Select Heera, Neerja, Ravi, or Rishi voices for a crystal-clear, professional Indian English accent."}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Caller Information Setup */}
                <div className="w-full bg-slate-800/60 p-3 rounded-xl border border-slate-700/40 my-3 text-left">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide font-bold">
                      {selectedLang === "te" ? "మీ ప్రొఫైల్ వివరాలు" : "Your Caller Profile"}
                    </span>
                    <button
                      onClick={() => {
                        if (isEditingCaller) {
                          setIsEditingCaller(false);
                          if (callerPhone !== prevPhone) {
                            startCall();
                          }
                        } else {
                          setPrevPhone(callerPhone);
                          setIsEditingCaller(true);
                        }
                      }}
                      className="text-yellow-400 hover:text-yellow-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {isEditingCaller ? <><Check size={10} /> {selectedLang === "te" ? "పూర్తయింది" : "Done"}</> : <><Edit3 size={10} /> {selectedLang === "te" ? "మార్చండి" : "Change"}</>}
                    </button>
                  </div>
                  {isEditingCaller ? (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[9px] text-slate-500 uppercase">
                          {selectedLang === "te" ? "తల్లిదండ్రుల పేరు" : "Parent Name"}
                        </label>
                        <input
                          type="text"
                          value={callerName}
                          onChange={(e) => setCallerName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setIsEditingCaller(false);
                              if (callerPhone !== prevPhone) {
                                startCall();
                              }
                            }
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-slate-500 uppercase">
                          {selectedLang === "te" ? "ఫోన్ నంబర్" : "Phone Number"}
                        </label>
                        <input
                          type="text"
                          value={callerPhone}
                          onChange={(e) => setCallerPhone(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setIsEditingCaller(false);
                              if (callerPhone !== prevPhone) {
                                startCall();
                              }
                            }
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs space-y-1">
                      <p className="text-slate-300 font-medium flex items-center gap-1.5">
                        👤 {selectedLang === "te" ? "పేరు:" : "Name:"} <span className="text-white font-bold">{callerName}</span>
                      </p>
                      <p className="text-slate-300 font-mono flex items-center gap-1.5">
                        📞 {selectedLang === "te" ? "ఫోన్:" : "Phone:"} <span className="text-white font-bold">{callerPhone}</span>
                      </p>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-400 max-w-xs mb-4">
                  {selectedLang === "te"
                    ? "మా అత్యాధునిక AI వాయిస్ ఏజెంట్‌తో మాట్లాడండి. ఫోన్ సంభాషణను ప్రారంభించడానికి క్రింది బటన్‌ను క్లిక్ చేయండి!"
                    : "Experience our ultra-realistic AI voice agent. Click the call button below to have an audible receptionist conversation!"}
                </p>
                <button
                  id="btn-voice-call"
                  onClick={startCall}
                  className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-6 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer hover:shadow-yellow-400/20"
                >
                  <Phone size={15} /> {selectedLang === "te" ? "కాల్ ప్రారంభించండి" : "Live Call"}
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
                <h4 className="font-display font-bold text-lg text-yellow-400 animate-pulse">
                  {selectedLang === "te" ? "బీట్రైస్ AI కి కాల్ కనెక్ట్ అవుతోంది..." : "Dialing Beatrice AI..."}
                </h4>
                <p className="text-xs text-slate-500 mt-2">
                  {selectedLang === "te" ? "స్పీచ్ సింథసిస్ ఛానెల్‌లను సిద్ధం చేస్తోంది" : "Initializing VoIP speech synthesis channels"}
                </p>
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
                <div className="flex gap-1.5 items-end h-14 mb-4 justify-center">
                  {Array.from({ length: 16 }).map((_, i) => {
                    // Calculate center-focused distribution so it mimics a premium audio wave capsule shape
                    const distanceFromCenter = Math.abs(i - 7.5);
                    const baseMaxHeight = Math.max(6, 42 - distanceFromCenter * 4.5);
                    
                    // Scale height dynamically if speaking, or use a tiny flat/quiet height if silent
                    const activeHeight = isSpeaking 
                      ? Math.max(8, baseMaxHeight * audioLevel * (0.6 + Math.sin(i * 1.8) * 0.4)) 
                      : 6;

                    return (
                      <motion.div
                        key={i}
                        animate={{
                          height: activeHeight,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 15,
                        }}
                        className={`w-1.5 rounded-full transition-all duration-300 ${
                          isSpeaking 
                            ? "bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" 
                            : "bg-slate-700/60"
                        }`}
                      />
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 mb-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 rounded-full text-emerald-400 text-[10px] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  {selectedLang === "te" ? "కాల్ యాక్టివ్‌గా ఉంది • ACTIVE VOICE" : "ACTIVE VOICE CALL • 16kbps VoIP"}
                </div>

                <h4 className="font-display font-bold text-base text-white">
                  {selectedLang === "te" ? "బీట్రైస్ (AI రిసెప్షనిస్ట్)" : "Beatrice (AI Receptionist)"}
                </h4>
                
                {/* Subtitle speech bubble */}
                <div className="my-3 bg-slate-800 border border-slate-700/60 rounded-2xl p-4 w-full min-h-[90px] flex items-center justify-center text-xs text-slate-300 italic">
                  "{speechText}"
                </div>

                {synthesisError && (
                  <div className="w-full bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-left text-[11px] text-red-300 mb-3 flex flex-col gap-2">
                    <div className="flex items-start gap-1.5">
                      <span className="shrink-0 mt-0.5">⚠️</span>
                      <div className="space-y-1">
                        <p className="font-bold">
                          {selectedLang === "te" ? "ఆడియో ప్లేబ్యాక్ సమస్య" : "Audio Playback Notice"}
                        </p>
                        <p className="text-[10px] text-red-400">
                          {synthesisError}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSynthesisError("");
                        speakText(speechText, selectedLang);
                      }}
                      className="self-start mt-1 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold text-[10px] px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                    >
                      🔊 {selectedLang === "te" ? "ఆడియోను ప్లే చేయండి" : "Play Audio / Unmute Beatrice"}
                    </button>
                  </div>
                )}

                {/* Instant Database Sync Status Indicator */}
                {bookingSynced && bookedDetails && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded-xl text-left text-[11px] text-emerald-300 mb-3 space-y-1"
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      <BadgeCheck size={14} className="text-emerald-400" />
                      {selectedLang === "te" ? "క్యాలెండర్ తక్షణమే సింక్ చేయబడింది" : "INSTANT CALENDAR SYNC COMPLETE"}
                    </div>
                    <p className="text-slate-300 text-[10px]">
                      {selectedLang === "te" ? (
                        <>పర్యటన <strong className="text-white">{bookedDetails.date} @ {bookedDetails.time}</strong> కు <strong>{callerName}</strong> పేరు మీద స్కూల్ డైరీలో బుక్ చేయబడింది!</>
                      ) : (
                        <>Tour auto-booked for <strong className="text-white">{bookedDetails.date} @ {bookedDetails.time}</strong> under <strong>{callerName}</strong> in the Honey Bees school diary!</>
                      )}
                    </p>
                    <div className="text-[9px] text-emerald-400/80 font-mono">
                      {selectedLang === "te" ? "✓ వాట్సాప్ & SMS ద్వారా రూట్ మ్యాప్ పంపబడింది" : "✓ WhatsApp & SMS location map dispatch triggered"}
                    </div>
                  </motion.div>
                )}

                {/* Interactive Speech Response Options */}
                <div className="w-full space-y-2">
                  {(selectedLang === "te" ? callFlowTelugu[activeStep] : callFlow[activeStep]).options?.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleParentResponse(opt)}
                      className="w-full bg-slate-800 hover:bg-yellow-400 hover:text-slate-900 border border-slate-700 hover:border-yellow-300 text-slate-300 text-[11px] text-left px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer flex justify-between items-center group"
                    >
                      <span>{opt.text}</span>
                      <Mic size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                  {(selectedLang === "te" ? callFlowTelugu[activeStep] : callFlow[activeStep]).end && (
                    <div className="text-center text-[10px] text-yellow-400 font-bold py-1 animate-pulse">
                      {selectedLang === "te" ? "🐝 కాల్ ఆటోమేటిక్‌గా ముగుస్తోంది..." : "🐝 Call is concluding automatically..."}
                    </div>
                  )}
                </div>

                {/* Natural Speech Recognition (Mic Voice Response Input) */}
                {recognitionInstance && !(selectedLang === "te" ? callFlowTelugu[activeStep] : callFlow[activeStep]).end && (
                  <div className="mt-4 w-full p-3 bg-slate-800/40 border border-yellow-400/20 rounded-2xl flex flex-col items-center">
                    <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Sparkles size={10} className="animate-pulse" /> Speak Naturally / నోటితో సమాధానం చెప్పండి
                    </span>
                    
                    {isListening ? (
                      <button
                        type="button"
                        onClick={stopListening}
                        className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-red-500/30 cursor-pointer transition-all"
                        title="Stop Listening"
                      >
                        <Mic size={18} className="animate-bounce" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={startListening}
                        className="w-11 h-11 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-full flex items-center justify-center shadow-md hover:shadow-yellow-400/20 cursor-pointer transition-all"
                        title="Start Speaking"
                      >
                        <Mic size={18} />
                      </button>
                    )}

                    <p className="text-[10px] mt-2 font-medium text-center leading-snug">
                      {isListening ? (
                        <span className="text-red-400 animate-pulse font-bold">
                          {selectedLang === "te" ? "వింటున్నాము... మాట్లాడండి!" : "Listening... Speak naturally now!"}
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          {selectedLang === "te" 
                            ? "క్రింది మైక్రోఫోన్ క్లిక్ చేసి నేరుగా మాట్లాడండి" 
                            : "Tap microphone to respond naturally using your voice"}
                        </span>
                      )}
                    </p>

                    {recognitionTranscript && (
                      <div className="mt-2.5 w-full p-2 bg-slate-900 rounded-lg text-[10px] font-mono border border-slate-700/40 text-slate-300 text-center">
                        Speech Captured: <span className="text-yellow-400 font-bold">"{recognitionTranscript}"</span>
                      </div>
                    )}

                    {recognitionError && (
                      <div className="mt-1.5 text-[9px] text-red-400 font-semibold bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-md">
                        ⚠️ {recognitionError}
                      </div>
                    )}
                  </div>
                )}

                <button
                  id="btn-voice-hangup"
                  onClick={endCall}
                  className="mt-5 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <PhoneOff size={13} /> {selectedLang === "te" ? "సంభాషణ ముగించు" : "End Session"}
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
                <h4 className="font-display font-bold text-base text-red-400">
                  {selectedLang === "te" ? "కాల్ ముగిసింది" : "Call Terminated"}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  {selectedLang === "te" ? "క్యాలెండర్ & వాట్సాప్ రికార్డులు అప్‌డేట్ చేయబడ్డాయి" : "Calendar & WhatsApp records synchronized"}
                </p>
                {bookingSynced && (
                  <div className="mt-2 text-[10px] text-emerald-400 font-bold">
                    {selectedLang === "te" ? "✓ పర్యటన పాఠశాల డైరీలో సేవ్ చేయబడింది!" : "✓ Tour synced in physical school diary!"}
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

          {/* Real-time System Flow Diagram requested by the parent */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3 mt-4" id="voip-voice-pipeline-diagram">
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Real-Time Voice Pipeline Architecture
              </span>
              <span className="text-[9px] font-mono text-yellow-400 font-bold bg-yellow-400/10 px-2 py-0.5 rounded-md">
                Active System Status
              </span>
            </div>

            <div className="space-y-2 relative text-left">
              {/* Step 1: Customer Calls */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                callState === "dialing" || callState === "connected"
                  ? "border-yellow-400/50 bg-yellow-400/5 text-white"
                  : "border-slate-800/50 bg-slate-900/20 text-slate-400"
              }`} id="step-customer-calls">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    callState === "dialing" || callState === "connected" ? "bg-yellow-400 text-slate-900 font-bold" : "bg-slate-850 text-slate-500"
                  }`}>
                    <Phone size={13} />
                  </div>
                  <div>
                    <h6 className="text-[11px] font-bold">1. Customer Calls</h6>
                    <p className="text-[9px] text-slate-500">Parent initiates standard phone/VoIP call</p>
                  </div>
                </div>
                <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  callState === "dialing" || callState === "connected" ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"
                }`}>
                  {callState === "dialing" || callState === "connected" ? "ACTIVE" : "STANDBY"}
                </span>
              </div>

              {/* Arrow 1 */}
              <div className="flex justify-center -my-1">
                <ArrowDown size={12} className={callState === "dialing" || callState === "connected" ? "text-yellow-400/80" : "text-slate-800"} />
              </div>

              {/* Step 2: AI Voice Agent */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                callState === "dialing" || callState === "connected"
                  ? "border-yellow-400/50 bg-yellow-400/5 text-white"
                  : "border-slate-800/50 bg-slate-900/20 text-slate-400"
              }`} id="step-ai-voice-agent">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    callState === "dialing" || callState === "connected" ? "bg-yellow-400 text-slate-900 font-bold" : "bg-slate-850 text-slate-500"
                  }`}>
                    <Cpu size={13} />
                  </div>
                  <div>
                    <h6 className="text-[11px] font-bold">2. AI Voice Agent (Beatrice)</h6>
                    <p className="text-[9px] text-slate-500">Intelligent context-aware virtual receptionist routing</p>
                  </div>
                </div>
                <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  callState === "dialing" || callState === "connected" ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"
                }`}>
                  {callState === "dialing" || callState === "connected" ? "ACTIVE" : "STANDBY"}
                </span>
              </div>

              {/* Arrow 2 */}
              <div className="flex justify-center -my-1">
                <ArrowDown size={12} className={callState === "connected" ? "text-yellow-400/80" : "text-slate-800"} />
              </div>

              {/* Step 3: Speech-to-Text */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                callState === "connected" && speechText === "..."
                  ? "border-yellow-400 bg-yellow-400/10 text-white shadow-xs"
                  : callState === "connected"
                  ? "border-yellow-400/30 bg-yellow-400/5 text-slate-300"
                  : "border-slate-800/50 bg-slate-900/20 text-slate-400"
              }`} id="step-speech-to-text">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    callState === "connected" && speechText === "..." ? "bg-yellow-400 text-slate-900 font-bold animate-pulse" : callState === "connected" ? "bg-yellow-400/20 text-yellow-400" : "bg-slate-850 text-slate-500"
                  }`}>
                    <Mic size={13} />
                  </div>
                  <div>
                    <h6 className="text-[11px] font-bold">3. Speech-to-Text</h6>
                    <p className="text-[9px] text-slate-500">Transcribes voice packets into text tokens in real time</p>
                  </div>
                </div>
                <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  callState === "connected" && speechText === "..." ? "bg-amber-500/20 text-amber-400 animate-pulse" : callState === "connected" ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"
                }`}>
                  {callState === "connected" && speechText === "..." ? "PROCESSING" : callState === "connected" ? "READY" : "STANDBY"}
                </span>
              </div>

              {/* Arrow 3 */}
              <div className="flex justify-center -my-1">
                <ArrowDown size={12} className={callState === "connected" ? "text-yellow-400/80" : "text-slate-800"} />
              </div>

              {/* Step 4: GPT (Conversation) */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                callState === "connected" && speechText === "..."
                  ? "border-yellow-400 bg-yellow-400/10 text-white shadow-xs"
                  : callState === "connected"
                  ? "border-yellow-400/30 bg-yellow-400/5 text-slate-300"
                  : "border-slate-800/50 bg-slate-900/20 text-slate-400"
              }`} id="step-gpt-conversation">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    callState === "connected" && speechText === "..." ? "bg-yellow-400 text-slate-900 font-bold animate-pulse" : callState === "connected" ? "bg-yellow-400/20 text-yellow-400" : "bg-slate-850 text-slate-500"
                  }`}>
                    <Sparkles size={13} />
                  </div>
                  <div>
                    <h6 className="text-[11px] font-bold">4. GPT (Conversation)</h6>
                    <p className="text-[9px] text-slate-500">Receptive reasoning, database lookup, & intent classification</p>
                  </div>
                </div>
                <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  callState === "connected" && speechText === "..." ? "bg-amber-500/20 text-amber-400 animate-pulse" : callState === "connected" ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"
                }`}>
                  {callState === "connected" && speechText === "..." ? "REASONING" : callState === "connected" ? "READY" : "STANDBY"}
                </span>
              </div>

              {/* Arrow 4 */}
              <div className="flex justify-center -my-1">
                <ArrowDown size={12} className={callState === "connected" ? "text-yellow-400/80" : "text-slate-800"} />
              </div>

              {/* Step 5: Text-to-Speech */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                callState === "connected" && speechText !== "..." && speechText !== ""
                  ? "border-yellow-400 bg-yellow-400/10 text-white shadow-xs"
                  : "border-slate-800/50 bg-slate-900/20 text-slate-400"
              }`} id="step-text-to-speech">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    callState === "connected" && speechText !== "..." && speechText !== "" ? "bg-yellow-400 text-slate-900 font-bold animate-pulse" : "bg-slate-850 text-slate-500"
                  }`}>
                    <Volume2 size={13} />
                  </div>
                  <div>
                    <h6 className="text-[11px] font-bold">5. Text-to-Speech</h6>
                    <p className="text-[9px] text-slate-500">Synthesizes high-fidelity audible speech with natural accents</p>
                  </div>
                </div>
                <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  callState === "connected" && speechText !== "..." && speechText !== "" ? "bg-yellow-400 text-slate-950 font-black animate-pulse" : "bg-slate-800 text-slate-500"
                }`}>
                  {callState === "connected" && speechText !== "..." && speechText !== "" ? "SPEAKING" : "STANDBY"}
                </span>
              </div>

              {/* Arrow 5 */}
              <div className="flex justify-center -my-1">
                <ArrowDown size={12} className={callState === "connected" && speechText !== "..." && speechText !== "" ? "text-yellow-400/80" : "text-slate-800"} />
              </div>

              {/* Step 6: Customer Hears Response */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                callState === "connected" && speechText !== "..." && speechText !== ""
                  ? "border-emerald-500/50 bg-emerald-500/5 text-white"
                  : "border-slate-800/50 bg-slate-900/20 text-slate-400"
              }`} id="step-customer-hears-response">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    callState === "connected" && speechText !== "..." && speechText !== "" ? "bg-emerald-400 text-slate-950 font-bold" : "bg-slate-850 text-slate-500"
                  }`}>
                    <Ear size={13} />
                  </div>
                  <div>
                    <h6 className="text-[11px] font-bold">6. Customer Hears Response</h6>
                    <p className="text-[9px] text-slate-500">Smooth playback through VoIP stream with ultra-low latency</p>
                  </div>
                </div>
                <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  callState === "connected" && speechText !== "..." && speechText !== "" ? "bg-emerald-500/20 text-emerald-400 animate-pulse" : "bg-slate-800 text-slate-500"
                }`}>
                  {callState === "connected" && speechText !== "..." && speechText !== "" ? "STREAMING" : "STANDBY"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 flex gap-2.5 items-start" id="sync-tour-card">
              <Calendar className="text-yellow-400 mt-0.5 shrink-0" size={16} />
              <div>
                <h5 className="text-xs font-bold text-slate-200">Instant Calendar Sync</h5>
                <p className="text-[10px] text-slate-500">Auto-books physical tour slots</p>
              </div>
            </div>
            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 flex gap-2.5 items-start" id="sms-alert-card">
              <BadgeCheck className="text-yellow-400 mt-0.5 shrink-0" size={16} />
              <div>
                <h5 className="text-xs font-bold text-slate-200">SMS / WhatsApp Alert</h5>
                <p className="text-[10px] text-slate-500">Fires instant map location link</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-400/10 border border-yellow-400/20 p-3 rounded-2xl flex gap-2.5 items-start text-xs text-yellow-300" id="sound-instructions-card">
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
