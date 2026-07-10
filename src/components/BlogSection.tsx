import React, { useState } from "react";
import { BookOpen, Calendar, User, ArrowRight, Star, Heart, Sparkles, Filter } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BlogArticle } from "../types";

export default function BlogSection() {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);

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

  const events = [
    {
      title: "Annual Honeycomb Splash Fest",
      date: "Saturday, July 25th",
      time: "10:00 AM - 1:00 PM",
      desc: "Water slides, splashing games, sensory cups, and ice-creams in our outdoor gardens! Parents welcome.",
    },
    {
      title: "Monsoon Storytelling Circle",
      date: "Friday, August 7th",
      time: "11:00 AM - 12:30 PM",
      desc: "Interactive puppet theatre, rain songs, and leafy umbrella painting inside the safe cushioned play arena.",
    }
  ];

  return (
    <section id="blog" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">
            Insights & Highlights
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Honey Bees Parenting Guides & News
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Stay updated with educational tips from child psychologists, fun DIY coordination games, and details about upcoming festival events inside our school hive.
          </p>
        </div>

        {/* Core Layout Split */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column Blog posts lists */}
          <div className="lg:col-span-8 space-y-8">
            <h3 className="font-display font-extrabold text-xl text-slate-950 flex items-center gap-2">
              <BookOpen size={20} className="text-yellow-500" /> Parenting & Early Childhood Blogs
            </h3>

            <div className="space-y-6">
              {blogs.map((post) => (
                <div
                  key={post.id}
                  className="bg-slate-50 border border-slate-150 p-6 rounded-[28px] shadow-2xs hover:shadow-sm hover:bg-white hover:border-yellow-250 transition-all cursor-pointer group flex flex-col md:flex-row gap-6"
                  onClick={() => setSelectedArticle(post)}
                >
                  {/* Photo Placeholder Graphic */}
                  <div className="bg-slate-900 w-full md:w-48 shrink-0 aspect-video md:aspect-square rounded-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden">
                    <span className="text-4xl">🧸🎨📘</span>
                  </div>

                  <div className="space-y-3 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex flex-wrap gap-2 items-center text-[10px] font-bold text-slate-400">
                        <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-orange-600 font-mono font-bold uppercase tracking-wider">
                          {post.category}
                        </span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h4 className="font-display font-black text-lg text-slate-950 group-hover:text-orange-600 transition-colors mt-2">
                        {post.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-sans font-normal mt-1.5">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-yellow-400 text-[10px] font-bold rounded-full flex items-center justify-center text-slate-900">
                          {post.author[0]}
                        </div>
                        <span className="text-[11px] text-slate-600 font-medium">{post.author}</span>
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
          <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-6 rounded-[32px] shadow-xs space-y-6">
            <h3 className="font-display font-extrabold text-lg text-slate-950 flex items-center gap-2">
              📅 Upcoming Events
            </h3>

            <div className="space-y-4">
              {events.map((evt, idx) => (
                <div key={idx} className="bg-white border border-slate-150 p-4 rounded-2xl space-y-2">
                  <span className="bg-yellow-100 text-yellow-800 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                    {evt.date}
                  </span>
                  <h4 className="font-display font-bold text-sm text-slate-900 pt-1">
                    {evt.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal font-sans">
                    {evt.desc}
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono">Time: {evt.time}</div>
                </div>
              ))}
            </div>

            {/* Newsletter form */}
            <div className="bg-yellow-400/10 border border-yellow-300/20 rounded-2xl p-4 text-center space-y-3">
              <span className="text-2xl">📬</span>
              <h4 className="font-display font-bold text-sm text-slate-900">Weekly Prospectus & Tips</h4>
              <p className="text-[11px] text-slate-500 font-sans">
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
                  className="flex-1 bg-white border border-slate-200 text-[11px] px-3 py-2 rounded-xl focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-bold px-3 py-2 rounded-xl transition-all cursor-pointer"
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
                className="bg-white rounded-[32px] p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-6 border border-yellow-200 cursor-default"
              >
                <div className="space-y-2">
                  <div className="flex gap-2 items-center text-xs font-bold text-slate-400">
                    <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded">{selectedArticle.category}</span>
                    <span>•</span>
                    <span>{selectedArticle.readTime}</span>
                    <span>•</span>
                    <span>{selectedArticle.date}</span>
                  </div>
                  <h3 className="font-display font-black text-2xl text-slate-950 leading-tight">
                    {selectedArticle.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans italic font-medium">
                    Written by {selectedArticle.author}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl aspect-video flex flex-col items-center justify-center relative overflow-hidden">
                  <span className="text-7xl block animate-bounce">📚✍️🎨</span>
                </div>

                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans space-y-4 whitespace-pre-line">
                  {selectedArticle.content}
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                  >
                    Done Reading
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
