import React, { useEffect, useState } from "react";
import { Star, Quote, ShieldCheck, Plus, Check, Sparkles, User, Mail, FileText, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  stars: number;
  avatar: string;
  verified: boolean;
  date: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [stars, setStars] = useState(5);
  const [avatar, setAvatar] = useState("👩🏼‍💻");
  const [parentEmail, setParentEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const avatars = ["👩🏼‍💻", "👨🏽‍💼", "👩🏻‍⚕️", "👨🏽‍🌾", "👩🏽‍🎨", "👨🏼‍🚀", "👵🏼", "👴🏾", "👩‍👦", "👨‍👦"];

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials");
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (err) {
      console.error("Error fetching testimonials:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      setStatusMessage({ type: "error", text: "Please fill in your name and review text." });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          text,
          stars,
          avatar,
          parentEmail: parentEmail.trim() || undefined,
          studentId: studentId.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: "success", text: data.message });
        // Reset form
        setName("");
        setText("");
        setStars(5);
        setParentEmail("");
        setStudentId("");
        // Refresh testimonials list
        fetchTestimonials();
        // Close form after a short delay
        setTimeout(() => {
          setIsFormOpen(false);
          setStatusMessage(null);
        }, 3500);
      } else {
        setStatusMessage({ type: "error", text: data.error || "Failed to submit review." });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: "error", text: "An error occurred while publishing your review." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-yellow-50/40 border-t border-yellow-100" id="parent-testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-yellow-600 uppercase tracking-widest bg-yellow-50 border border-yellow-200/60 px-3.5 py-1.5 rounded-full shadow-2xs">
            <ShieldCheck size={13} className="text-yellow-600" />
            Parent Verification
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Hear From Our Sweetwater Guardians
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Read authentic, system-verified reviews from real mothers and fathers of the Honey Bees family. Only parents with matched records earn the prestigious gold badge.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-full text-xs shadow-lg transition-all cursor-pointer hover:shadow-yellow-300/10 active:scale-95"
              id="write-review-btn"
            >
              {isFormOpen ? "Close Review Form" : "✍️ Share Your Experience"}
            </button>
          </div>
        </div>

        {/* Share Review Form Panel */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-16 max-w-2xl mx-auto"
            >
              <div className="bg-white border-2 border-yellow-200 rounded-[32px] p-6 sm:p-8 shadow-xl relative">
                <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-yellow-400 text-slate-900 px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-md flex items-center gap-1">
                  <Sparkles size={11} /> Live verification
                </div>

                <h3 className="font-display font-black text-xl text-slate-900 mb-2">
                  Publish Your Sweetwater Guardian Review
                </h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  Provide your child's enrolled details (e.g. Student ID: <code className="bg-slate-100 px-1 py-0.5 rounded text-yellow-600 font-mono text-[10px]">stud-1</code> or parent email) to gain instant **Verified Parent** status with an interactive gold badge on your review.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {statusMessage && (
                    <div
                      className={`p-4 rounded-2xl text-xs font-semibold border ${
                        statusMessage.type === "success"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-rose-50 border-rose-200 text-rose-700"
                      }`}
                    >
                      {statusMessage.text}
                    </div>
                  )}

                  {/* Rating Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                      Select Rating Stars
                    </label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setStars(star)}
                          className="text-2xl transition-transform hover:scale-110 cursor-pointer"
                          title={`${star} Stars`}
                        >
                          <Star
                            size={26}
                            className={star <= stars ? "fill-yellow-400 text-yellow-400" : "text-slate-250"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Avatar Picker */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                      Choose Your Guardian Avatar
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {avatars.map((av) => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => setAvatar(av)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all cursor-pointer ${
                            avatar === av
                              ? "bg-yellow-400 border-2 border-slate-900 scale-110 shadow-md shadow-yellow-400/25"
                              : "bg-slate-100 hover:bg-slate-200 border border-slate-200"
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Fields */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                        Your Name
                      </label>
                      <div className="relative">
                        <User size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Mary Carter"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 pl-10 font-sans focus:outline-none focus:border-yellow-400 focus:bg-white text-xs font-semibold"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                        Review Content
                      </label>
                      <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Share your child's developmental highlights..."
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 font-sans focus:outline-none focus:border-yellow-400 focus:bg-white text-xs"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Verification inputs */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150 space-y-3.5">
                    <div className="flex items-center gap-1.5 text-slate-700 font-display font-bold text-xs">
                      <ShieldCheck size={15} className="text-yellow-600 animate-pulse" />
                      Secure Parent Verification Gate
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Provide at least one credential matching your student's dashboard profile (from Parent Portal) to secure your verified shield.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="block text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
                          Parent Email (Matched Profile)
                        </label>
                        <div className="relative">
                          <Mail size={12} className="absolute left-3 top-3 text-slate-400" />
                          <input
                            type="email"
                            value={parentEmail}
                            onChange={(e) => setParentEmail(e.target.value)}
                            placeholder="e.g. parent@honeybees.com"
                            className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg p-2.5 pl-8 font-sans focus:outline-none focus:border-yellow-400 text-[11px]"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
                          Student ID (e.g., stud-1)
                        </label>
                        <div className="relative">
                          <FileText size={12} className="absolute left-3 top-3 text-slate-400" />
                          <input
                            type="text"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            placeholder="e.g. stud-1"
                            className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg p-2.5 pl-8 font-sans focus:outline-none focus:border-yellow-400 text-[11px]"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full font-bold py-3 rounded-2xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSubmitting
                        ? "bg-slate-400 text-slate-250 cursor-not-allowed"
                        : "bg-slate-950 hover:bg-slate-900 text-white shadow-lg active:scale-[0.99]"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 border-t-transparent animate-spin" />
                        Validating credentials & saving...
                      </>
                    ) : (
                      "Publish Verifiable Guardian Review"
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Testimonials Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <span className="w-8 h-8 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin" />
            <span className="text-slate-400 text-xs font-mono">Securing live review pipeline...</span>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="bg-white border border-slate-150 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
            <div className="text-4xl">🐝</div>
            <h4 className="font-display font-bold text-slate-900 text-base">No Guardian reviews published yet</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Be the very first Sweetwater Guardian to share your child's milestone progress! Click the write review button above.
            </p>
          </div>
        ) : (
          /* Testimonials grid */
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((test) => (
              <motion.div
                key={test.id}
                whileHover={{ y: -5 }}
                className="bg-white border border-slate-150 p-6 rounded-[28px] shadow-2xs hover:shadow-md transition-all relative flex flex-col justify-between group hover:border-yellow-300/60"
              >
                {/* Quote watermark */}
                <div className="absolute top-6 right-6 text-slate-200 select-none group-hover:text-yellow-250 transition-colors duration-300">
                  <Quote size={20} />
                </div>

                <div className="space-y-4">
                  {/* Stars & Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: test.stars }).map((_, i) => (
                        <Star key={i} size={13} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    {test.verified ? (
                      <span className="inline-flex items-center gap-1 text-[8.5px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full select-none shadow-3xs">
                        <Check size={9} className="stroke-[3]" /> Verified Guardian
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[8px] font-extrabold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full select-none">
                        Community Member
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-sans italic">
                    "{test.text}"
                  </p>
                </div>

                <div className="flex gap-3 items-center pt-4 mt-6 border-t border-slate-100">
                  <div className="w-9 h-9 bg-yellow-100 rounded-full flex items-center justify-center text-lg shadow-3xs">
                    {test.avatar}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900 truncate">
                      {test.name}
                    </h4>
                    <span className="text-[9px] text-slate-400 font-medium block mt-0.5 truncate max-w-full font-mono">
                      {test.role}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
