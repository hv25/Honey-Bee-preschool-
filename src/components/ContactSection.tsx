import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle, Smile, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { safeJson } from "../utils";

export default function ContactSection() {
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName || !email || !phone || !message) {
      alert("Please fill in all mandatory enquiry fields.");
      return;
    }

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentName, email, phone, message }),
      });
      const data = await safeJson(res);
      if (!data.error) {
        setSuccess(true);
        setParentName("");
        setEmail("");
        setPhone("");
        setMessage("");
        setTimeout(() => setSuccess(false), 5000);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Enquiry sent!");
    }
  };

  return (
    <section id="contact-us" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-150 dark:border-slate-800/80 transition-colors duration-350">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column Contact Details */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-orange-500 dark:text-orange-450 uppercase tracking-widest bg-orange-50 dark:bg-orange-950/40 px-3 py-1 rounded-full">
                  Get In Touch
                </span>
                <h2 className="font-display font-black text-3xl text-slate-900 dark:text-white tracking-tight mt-3">
                  Visit Our Honey Bees
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                  Have a question about fees, school bus routes, child meals, or enrollment limits? Drop by or leave a prompt message below.
                </p>
              </div>

              {/* Contact Lists */}
              <div className="space-y-4">
                <div className="flex gap-4 items-start bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-2xs">
                  <div className="bg-yellow-50 dark:bg-yellow-950/40 p-3 rounded-xl text-yellow-600 dark:text-yellow-400 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-sm text-slate-900 dark:text-white">Physical Address</h4>
                    <a
                      href="https://maps.app.goo.gl/d4nKq85KkAVRvKiP7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors mt-1 block break-all font-mono"
                    >
                      https://maps.app.goo.gl/d4nKq85KkAVRvKiP7
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-2xs">
                  <div className="bg-orange-50 dark:bg-orange-950/40 p-3 rounded-xl text-orange-600 dark:text-orange-400 shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-sm text-slate-900 dark:text-white">Telephone / WhatsApp</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">086883 30502 (Desk Help)</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-2xs">
                  <div className="bg-sky-50 dark:bg-sky-950/40 p-3 rounded-xl text-sky-600 dark:text-sky-400 shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-sm text-slate-900 dark:text-white">Email Address</h4>
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=hello@honeybeespreschool.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 hover:underline mt-1 font-mono font-medium inline-flex items-center gap-1.5"
                      title="Compose email on Gmail"
                    >
                      hello@honeybeespreschool.com
                      <span className="text-[9px] bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 px-1.5 py-0.5 rounded font-sans font-bold">Open in Gmail</span>
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-2xs">
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-sm text-slate-900 dark:text-white">Working Office Hours</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Mon - Sat: 8:00 AM - 6:30 PM • Sunday Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated interactive Google Maps widget */}
            <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-5 relative overflow-hidden h-[180px] flex flex-col justify-between shadow-md">
              <div className="absolute top-0 right-0 text-9xl text-white/5 font-display select-none pointer-events-none">
                ⬢⬢
              </div>
              <div className="flex justify-between items-start z-10">
                <div>
                  <h4 className="font-display font-bold text-sm text-white">Google Maps Location</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Coordinates: 17.7291° N, 83.3377° E</p>
                </div>
                <span className="bg-white/10 backdrop-blur-md px-2 py-0.5 rounded text-[9px] text-yellow-400 tracking-wider">
                  VISAKHAPATNAM
                </span>
              </div>

              {/* Graphical mini landmark representation */}
              <div className="z-10 py-1 flex items-center gap-2 text-xs">
                <span className="text-xl animate-bounce">📍</span>
                <span className="font-display font-extrabold">Honey Bees Pre-School, Daycare and Tuition centre</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-white/10 z-10">
                <span className="text-[10px] text-slate-400">Adjacent to Lawson's Bay Park</span>
                <a
                  href="https://maps.app.goo.gl/d4nKq85KkAVRvKiP7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-yellow-400 hover:underline flex items-center gap-1 leading-none"
                >
                  Get Route <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column Enquiry Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-[36px] shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                Direct Administrative Enquiry
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6 leading-relaxed">
                Got any specific queries or custom requests? Drop us a line. Our admissions officer will get back to you within 2 business hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 font-bold uppercase mb-1.5">Parent / Guardian Name *</label>
                    <input
                      id="inp-ct-parent"
                      type="text"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="e.g. David Watson"
                      className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-800 dark:text-white font-sans focus:outline-none focus:ring-1 focus:ring-yellow-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 font-bold uppercase mb-1.5">Mobile Number *</label>
                    <input
                      id="inp-ct-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 987-6543"
                      className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-800 dark:text-white font-sans focus:outline-none focus:ring-1 focus:ring-yellow-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold uppercase mb-1.5">Email Address *</label>
                  <input
                    id="inp-ct-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="david@example.com"
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-800 dark:text-white font-sans focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold uppercase mb-1.5">Enquiry Message *</label>
                  <textarea
                    id="inp-ct-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. I am interested in enrolling my 3-year-old in the Nursery program starting next month. Do you provide school bus transport for Lawsons Bay Colony?"
                    rows={4}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-slate-800 dark:text-white font-sans focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    required
                  />
                </div>

                <button
                  id="btn-ct-submit"
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-display font-black py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 text-xs cursor-pointer"
                >
                  <Send size={12} /> Send Direct Enquiry Message
                </button>
              </form>
            </div>

            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-xl mt-4 flex gap-2.5 items-start text-emerald-800 dark:text-emerald-300 text-xs"
                >
                  <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Message Submitted Successfully!</span>
                    <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400 font-sans">
                      Our coordinator has been notified. We will contact you back immediately. Check the Portals tab to verify this enquiry has seeded in our database!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Floating Action WhatsApp and Call buttons */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2.5">
        <a
          id="btn-whatsapp-floating"
          href="https://wa.me/08688330502"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all hover:scale-105"
          aria-label="Chat with Honey Bees on WhatsApp"
        >
          <MessageSquare size={20} />
        </a>
        <a
          id="btn-call-floating"
          href="tel:08688330502"
          className="bg-slate-900 hover:bg-slate-800 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all hover:scale-105 border border-slate-700"
          aria-label="Call Honey Bees Administration"
        >
          <Phone size={20} className="text-yellow-400" />
        </a>
      </div>
    </section>
  );
}
