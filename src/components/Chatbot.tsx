import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, HelpCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hello! 🐝 Welcome to Honey Bees Pre-School, Daycare and Tuition centre. I'm Barnaby, your virtual AI Guide! Ask me anything about our curriculum, admissions, fees, security, or booking a physical tour! How can I help you today? 🍯",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "What are the admission fees?",
    "Tell me about the Daycare program",
    "How can I book a school tour?",
    "Is CCTV access available for parents?",
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await response.json();
      if (response.ok && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: data.reply,
            timestamp: new Date(),
          },
        ]);
      } else {
        throw new Error(data.error || "Failed reply");
      }
    } catch (error) {
      console.error("Chatbot response error:", error);
      // Reassuring fallback message
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: "bot",
          text: "I apologize, but my connection to the honeycomb is a little busy! 🐝 Generally, our Play Group starts at $150/mo and Nursery is $180/mo. Please feel free to call our administrative desk directly at 086883 30502 or book a school tour!",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        id="btn-chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center cursor-pointer group"
        aria-label="Toggle AI Support Assistant"
      >
        <span className="absolute right-14 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap hidden sm:block shadow-md">
          Ask Barnaby AI Bot 🐝
        </span>
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-window"
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 w-[92vw] sm:w-[420px] h-[600px] bg-white rounded-3xl shadow-2xl z-50 border border-yellow-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 p-4 text-slate-900 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-2xl shadow-sm text-lg animate-bounce">
                  🐝
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg leading-tight flex items-center gap-1.5">
                    Barnaby the Bee
                    <span className="bg-slate-900/10 text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded">
                      AI GUIDE
                    </span>
                  </h3>
                  <p className="text-xs text-slate-800/80 font-medium">
                    Online • Instantly answering questions
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-black/10 p-1.5 rounded-full transition-colors text-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Box */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-yellow-50/20 to-white space-y-4"
            >
              <div className="bg-orange-50/50 border border-orange-100 p-3 rounded-2xl flex gap-2.5 items-start">
                <Sparkles size={16} className="text-orange-500 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  Hi Parent! Ask me about our <strong>curriculum</strong>, <strong>CCTV camera system</strong>, 
                  <strong>tuition timings</strong>, or <strong>fee breakdowns</strong>. Our admissions are 100% open!
                </p>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "bg-slate-900 text-white rounded-br-none"
                        : "bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200"
                    }`}
                  >
                    {/* Preserve line breaks for clean lists */}
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span
                      className={`text-[9px] block mt-1 text-right ${
                        msg.sender === "user" ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}

              {/* Bot Loading State */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-bl-none px-4 py-3.5 border border-slate-200 shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    <span className="text-xs text-slate-500 ml-1 font-sans">Barnaby is typing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Questions list */}
            {messages.length === 1 && (
              <div className="p-3 bg-white border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1 px-1">
                  <HelpCircle size={10} /> Suggested Questions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="text-xs bg-yellow-50 hover:bg-yellow-100/80 border border-yellow-200 text-slate-800 px-2.5 py-1.5 rounded-full transition-all text-left flex items-center gap-1 cursor-pointer"
                    >
                      {q} <ArrowRight size={10} className="text-yellow-600" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Form Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputValue);
              }}
              className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
            >
              <input
                id="inp-chat-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Barnaby about Honey Bees..."
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sans"
              />
              <button
                id="btn-chat-submit"
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
