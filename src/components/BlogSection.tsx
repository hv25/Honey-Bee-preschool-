import React, { useState, useEffect } from "react";
import { BookOpen, Calendar, User, ArrowRight, Star, Heart, Sparkles, Filter, Info, Bell, X, CheckCircle, Mail, Phone, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BlogArticle, UpcomingEvent } from "../types";

export default function BlogSection() {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [selectedEventForNotification, setSelectedEventForNotification] = useState<UpcomingEvent | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [parentNameInput, setParentNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscriptionSuccessMessage, setSubscriptionSuccessMessage] = useState<string | null>(null);
  const [subscriptionErrorMessage, setSubscriptionErrorMessage] = useState<string | null>(null);

  const handleSubscribeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventForNotification) return;

    setSubscribing(true);
    setSubscriptionErrorMessage(null);
    setSubscriptionSuccessMessage(null);

    try {
      const res = await fetch("/api/events/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEventForNotification.id,
          email: emailInput,
          parentName: parentNameInput,
          phone: phoneInput,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubscriptionSuccessMessage(data.message || `Successfully subscribed!`);
      } else {
        setSubscriptionErrorMessage(data.error || "Failed to subscribe. Please try again.");
      }
    } catch (err) {
      setSubscriptionErrorMessage("Network error connecting to subscription service. Please try again.");
    } finally {
      setSubscribing(false);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setEvents(data);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch upcoming events:", err);
      }
    };
    fetchEvents();
    const interval = setInterval(fetchEvents, 5000);
    return () => clearInterval(interval);
  }, []);

  const blogs: BlogArticle[] = [
    {
      id: "blog-1",
      title: "Why Play-Based Learning is Crucial for Preschoolers",
      excerpt: "Explore how game mechanics, toy handling, and group games wire the young brain for advanced logic and deep social empathy.",
      content: "Early childhood educators agree that play is a child's work. At Honey Bees, our play-based curriculum is designed to stimulate critical thinking, spatial reasoning, and cooperative behavior. Research shows that children who participate in active sensory play show higher cognitive development in mathematics and phonics once they reach primary school. We focus on low-guided free play, outdoor exploration, and structured circle games.",
      author: "Dr. Amanda Rose (Child Psychologist)",
      date: "2026-07-05",
      category: "Parenting",
      readTime: "4 min read"
    },
    {
      id: "blog-2",
      title: "5 Simple Activities to Boost Fine Motor Skills at Home",
      excerpt: "Simple DIY activities using everyday household objects like clothespins, clay, and dry pasta to accelerate finger dexterity.",
      content: "Fine motor skills are essential for pencil grip, buttoning shirts, and feed-independence. Here are 5 quick play ideas: 1) Playdough shaping, 2) Threading dry pasta through shoelaces, 3) Clothespin clipping boards, 4) Tearing colorful tissue paper for mosaics, 5) Sorting colorful dry beans. Doing these for just 10 minutes a day can drastically improve manual coordination.",
      author: "Evelyn Green (Head Preschool Coach)",
      date: "2026-07-01",
      category: "DIY Activities",
      readTime: "3 min read"
    },
    {
      id: "blog-3",
      title: "Establishing a Stress-Free Morning School Routine",
      excerpt: "Struggling with morning drop-offs? Here is a simple, structured 4-step evening routine to make mornings quiet, calm, and sweet.",
      content: "Drop-off tears are normal but manageable. Establishing a sweet evening-prep routine can completely change morning flows. Lay out uniforms the night before, pack school bags together, and ensure a strict, relaxing 8 PM sleep time. On waking, turn drop-off into a friendly adventure rather than a sudden separation. A positive high-five ritual at the school gates guarantees a cheerful morning.",
      author: "Mary Carter (Senior Administrator)",
      date: "2026-06-25",
      category: "Parenting Guides",
      readTime: "5 min read"
    }
  ];

  return (
    <section id="blog" className="py-16 md:py-24 bg-white dark:bg-slate-950 transition-colors duration-350">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold text-orange-500 dark:text-orange-400 uppercase tracking-widest bg-orange-50 dark:bg-orange-950/40 px-3 py-1 rounded-full">
            Insights & Highlights
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
            Honey Bees Parenting Guides & News
          </h2>
          <p className="text-slate-500 dark:text-slate-350 text-xs sm:text-sm leading-relaxed">
            Stay updated with educational tips from child psychologists, fun DIY coordination games, and details about upcoming festival events inside our school hive.
          </p>
        </div>

        {/* Core Layout Split */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column Blog posts lists */}
          <div className="lg:col-span-8 space-y-8">
            <h3 className="font-display font-extrabold text-xl text-slate-950 dark:text-white flex items-center gap-2">
              <BookOpen size={20} className="text-yellow-500" /> Parenting & Early Childhood Blogs
            </h3>

            <div className="space-y-6">
              {blogs.map((post) => (
                <div
                  key={post.id}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-6 rounded-[28px] shadow-2xs hover:shadow-sm hover:bg-white dark:hover:bg-slate-850 hover:border-yellow-250 dark:hover:border-yellow-400/40 transition-all cursor-pointer group flex flex-col md:flex-row gap-6"
                  onClick={() => setSelectedArticle(post)}
                >
                  {/* Photo Placeholder Graphic */}
                  <div className="bg-slate-900 w-full md:w-48 shrink-0 aspect-video md:aspect-square rounded-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden">
                    <span className="text-4xl">🧸🎨📘</span>
                  </div>

                  <div className="space-y-3 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex flex-wrap gap-2 items-center text-[10px] font-bold text-slate-400 dark:text-slate-500">
                        <span className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded text-orange-600 dark:text-orange-400 font-mono font-bold uppercase tracking-wider">
                          {post.category}
                        </span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h4 className="font-display font-black text-lg text-slate-950 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors mt-2">
                        {post.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans font-normal mt-1.5">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-yellow-400 text-[10px] font-bold rounded-full flex items-center justify-center text-slate-900">
                          {post.author[0]}
                        </div>
                        <span className="text-[11px] text-slate-600 dark:text-slate-350 font-medium">{post.author}</span>
                      </div>
                      <span className="text-xs font-bold text-orange-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read Guide <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column School Events */}
          <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[32px] shadow-xs space-y-6">
            <h3 className="font-display font-extrabold text-lg text-slate-950 dark:text-white flex items-center gap-2">
              📅 Upcoming Events
            </h3>

            <div className="space-y-4">
              {events.length === 0 ? (
                <div className="bg-white dark:bg-slate-850 border border-slate-150 dark:border-slate-800 p-6 rounded-2xl text-center space-y-2">
                  <span className="text-xl">🐝</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                    Awaiting brand new honeycomb events! Check back soon.
                  </p>
                </div>
              ) : (
                events.map((evt, idx) => (
                  <motion.div
                    key={evt.id || idx}
                    className="bg-white dark:bg-slate-850 border border-slate-150 dark:border-slate-800 p-4 rounded-2xl space-y-2 cursor-pointer transition-colors duration-200 hover:border-yellow-400/40 hover:shadow-md"
                    whileHover={{
                      y: -4,
                      scale: 1.02,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <span className="bg-yellow-100 dark:bg-yellow-950/40 text-yellow-800 dark:text-yellow-400 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                      {evt.date}
                    </span>
                    <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white pt-1">
                      {evt.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-sans">
                      {evt.desc}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                      <span className="text-[11px] text-slate-900 dark:text-slate-100 font-mono font-bold">Time: {evt.time}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEventForNotification(evt);
                        }}
                        className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-3xs"
                      >
                        <Bell size={10} className="animate-bounce" /> Notify Me
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Newsletter form */}
            <div className="bg-yellow-400/10 dark:bg-yellow-450/5 border border-yellow-300/20 dark:border-yellow-900/10 rounded-2xl p-4 text-center space-y-3">
              <span className="text-2xl">📬</span>
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">Weekly Prospectus & Tips</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                Subscribe to receive seasonal worksheets, nutrition plans, and local school drop-off calendars.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Successfully subscribed to Honey Bees Weekly Newsletter! Check hello@honeybeespreschool.com for details.");
                }}
                className="flex gap-1.5 pt-1"
              >
                <input
                  type="email"
                  placeholder="parent@example.com"
                  className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 text-slate-900 dark:text-white text-[11px] px-3 py-2 rounded-xl focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="bg-slate-900 dark:bg-slate-750 text-white hover:bg-slate-800 dark:hover:bg-slate-650 text-[10px] font-bold px-3 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Lightbox reader for expanded blog articles */}
        <AnimatePresence>
          {selectedArticle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-pointer"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-900 rounded-[32px] p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-6 border border-yellow-200 dark:border-yellow-900/30 cursor-default"
              >
                <div className="space-y-2">
                  <div className="flex gap-2 items-center text-xs font-bold text-slate-400 dark:text-slate-500">
                    <span className="bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded">{selectedArticle.category}</span>
                    <span>•</span>
                    <span>{selectedArticle.readTime}</span>
                    <span>•</span>
                    <span>{selectedArticle.date}</span>
                  </div>
                  <h3 className="font-display font-black text-2xl text-slate-950 dark:text-white leading-tight">
                    {selectedArticle.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-sans italic font-medium">
                    Written by {selectedArticle.author}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl aspect-video flex flex-col items-center justify-center relative overflow-hidden">
                  <span className="text-7xl block animate-bounce">📚✍️🎨</span>
                </div>

                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans space-y-4 whitespace-pre-line">
                  {selectedArticle.content}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                  >
                    Done Reading
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Event Notification subscription modal */}
        <AnimatePresence>
          {selectedEventForNotification && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden"
              >
                {/* Close Button */}
                <button
                  onClick={() => {
                    setSelectedEventForNotification(null);
                    setSubscriptionSuccessMessage(null);
                    setSubscriptionErrorMessage(null);
                    setEmailInput("");
                    setParentNameInput("");
                    setPhoneInput("");
                  }}
                  className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center"
                >
                  <X size={18} />
                </button>

                {subscriptionSuccessMessage ? (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl">
                      <CheckCircle size={36} />
                    </div>
                    <h4 className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
                      Subscription Confirmed!
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans px-4">
                      {subscriptionSuccessMessage}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedEventForNotification(null);
                        setSubscriptionSuccessMessage(null);
                        setEmailInput("");
                        setParentNameInput("");
                        setPhoneInput("");
                      }}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-sans font-bold text-xs py-3 rounded-xl shadow-xs transition-all cursor-pointer mt-4"
                    >
                      Back to Events
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-bold font-mono text-[10px] uppercase tracking-wider">
                      <Bell size={14} className="animate-pulse" /> Reminder Subscription
                    </div>

                    <div>
                      <h4 className="font-display font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                        {selectedEventForNotification.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-sans">
                        {selectedEventForNotification.desc}
                      </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-150 dark:border-slate-800 space-y-1 text-[11px] font-sans">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Date:</span>
                        <span className="font-bold text-slate-700 dark:text-slate-200">{selectedEventForNotification.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Time:</span>
                        <span className="font-bold text-slate-700 dark:text-slate-200">{selectedEventForNotification.time}</span>
                      </div>
                    </div>

                    {subscriptionErrorMessage && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[11px] text-red-500 font-sans text-center">
                        ⚠️ {subscriptionErrorMessage}
                      </div>
                    )}

                    <form onSubmit={handleSubscribeSubmit} className="space-y-3 pt-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                          Parent's Name
                        </label>
                        <div className="relative">
                          <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={parentNameInput}
                            onChange={(e) => setParentNameInput(e.target.value)}
                            placeholder="e.g. Sarah Jenkins"
                            className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl py-2.5 pl-9 pr-4 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-yellow-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="email"
                            required
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder="e.g. parent@example.com"
                            className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl py-2.5 pl-9 pr-4 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-yellow-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                          Contact Phone (Optional)
                        </label>
                        <div className="relative">
                          <Phone size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="tel"
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value)}
                            placeholder="e.g. +91 98765 43210"
                            className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl py-2.5 pl-9 pr-4 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-yellow-400"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={subscribing}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-sans font-bold text-xs py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
                      >
                        {subscribing ? (
                          <>
                            <Loader2 size={13} className="animate-spin" /> Subscribing...
                          </>
                        ) : (
                          <>
                            <Bell size={13} /> Subscribe to Reminders
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
