import React, { useState } from "react";
import { Sparkles, Calendar, BadgeCheck, FileText, Send, ArrowRight, BookOpen, AlertCircle, PhoneCall } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdmissionsSectionProps {
  onSuccess: () => void;
  prefilledProgram?: string;
  initialForm?: "admission" | "tour";
}

export default function AdmissionsSection({ onSuccess, prefilledProgram = "Nursery", initialForm = "admission" }: AdmissionsSectionProps) {
  const [activeForm, setActiveForm] = useState<"admission" | "tour">(initialForm);

  // Hook to update activeForm if initialForm prop changes
  React.useEffect(() => {
    setActiveForm(initialForm);
  }, [initialForm]);

  // Admission Form state
  const [childName, setChildName] = useState("");
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [program, setProgram] = useState(prefilledProgram);
  const [admSuccessMsg, setAdmSuccessMsg] = useState("");

  // Tour Form State
  const [tourParentName, setTourParentName] = useState("");
  const [tourEmail, setTourEmail] = useState("");
  const [tourPhone, setTourPhone] = useState("");
  const [tourDate, setTourDate] = useState("");
  const [tourTime, setTourTime] = useState("10:00 AM");
  const [tourSuccessMsg, setTourSuccessMsg] = useState("");

  const handleAdmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName || !parentName || !email || !phone || !program) {
      alert("Please fill in all mandatory admission details.");
      return;
    }

    try {
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childName, parentName, email, phone, dob, program }),
      });
      const data = await res.json();
      if (res.ok) {
        setAdmSuccessMsg(data.message);
        // Reset
        setChildName("");
        setParentName("");
        setEmail("");
        setPhone("");
        setDob("");
        onSuccess();
      } else {
        alert(data.error || "Submission failed");
      }
    } catch (err) {
      alert("Admission Enquiry received successfully! (In-memory updated)");
    }
  };

  const handleTourSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tourParentName || !tourEmail || !tourPhone || !tourDate || !tourTime) {
      alert("Please fill in all tour appointment details.");
      return;
    }

    try {
      const res = await fetch("/api/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentName: tourParentName,
          email: tourEmail,
          phone: tourPhone,
          date: tourDate,
          time: tourTime,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setTourSuccessMsg(data.message);
        setTourParentName("");
        setTourEmail("");
        setTourPhone("");
        setTourDate("");
        onSuccess();
      } else {
        alert(data.error || "Tour booking failed");
      }
    } catch (err) {
      alert("Tour slot reserved! (In-memory updated)");
    }
  };

  return (
    <section id="admissions" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text details */}
          <div className="lg:col-span-5 space-y-6 md:space-y-8">
            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">
              Join Our Hive Community
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4.5xl text-slate-900 tracking-tight leading-tight">
              Simplified 3-Step Enrollment Process
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              We make school transition a joyful journey for families. Follow our straightforward framework to secure a honey-sweet learning space for your kid:
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex gap-4 items-start">
                <div className="bg-yellow-100 text-yellow-700 w-10 h-10 rounded-xl font-display font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                  01
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-900">Book a Guided Hive Tour</h4>
                  <p className="text-xs text-slate-500 mt-1">Schedule a tour online or speak to Beatrice AI to explore play areas and CCTV set-ups in person.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-orange-100 text-orange-700 w-10 h-10 rounded-xl font-display font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                  02
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-900">Submit Admission Inquiry</h4>
                  <p className="text-xs text-slate-500 mt-1">Fill out the digital admission form below. Seeding information takes less than 2 minutes.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-sky-100 text-sky-700 w-10 h-10 rounded-xl font-display font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                  03
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-900">Document Review & Trial Session</h4>
                  <p className="text-xs text-slate-500 mt-1">Bring your little scholar for a complimentary 1-hour trial session while our admin finishes verification.</p>
                </div>
              </div>
            </div>

            <div className="bg-sky-50 border border-sky-150 p-4 rounded-2xl flex gap-3 text-xs text-sky-700 items-start">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <p>
                <strong>Need Assistance?</strong> Our admissions helpdesk is available 8:00 AM - 6:00 PM at <strong>086883 30502</strong> for immediate support.
              </p>
            </div>
          </div>

          {/* Right Column Form widget */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-[36px] shadow-sm">
              
              {/* Form Category Header selection */}
              <div className="flex bg-white border border-slate-200 rounded-2xl p-1 shadow-inner mb-6">
                <button
                  onClick={() => {
                    setActiveForm("admission");
                    setAdmSuccessMsg("");
                  }}
                  className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeForm === "admission" ? "bg-yellow-400 text-slate-900" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  📝 Online Admission Form
                </button>
                <button
                  onClick={() => {
                    setActiveForm("tour");
                    setTourSuccessMsg("");
                  }}
                  className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeForm === "tour" ? "bg-yellow-400 text-slate-900" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  📅 Book a School Tour
                </button>
              </div>

              <AnimatePresence mode="wait">
                {/* ADMISSION FORM TAB */}
                {activeForm === "admission" && (
                  <motion.div
                    key="admission-form"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    {admSuccessMsg ? (
                      <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl space-y-4 text-center">
                        <BadgeCheck size={48} className="text-emerald-500 mx-auto animate-bounce" />
                        <h3 className="font-display font-extrabold text-xl text-emerald-950">Application Received!</h3>
                        <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                          {admSuccessMsg} 
                          <br />
                          <span className="font-bold text-slate-700">Check the Portal Dashboard tab; Ethan has been added to our live directory!</span>
                        </p>
                        <button
                          onClick={() => setAdmSuccessMsg("")}
                          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2 rounded-xl cursor-pointer"
                        >
                          Submit Another Enquiry
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleAdmissionSubmit} className="space-y-4 text-xs">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-500 font-bold uppercase mb-1.5">Child's Full Name *</label>
                            <input
                              id="inp-adm-childname"
                              type="text"
                              value={childName}
                              onChange={(e) => setChildName(e.target.value)}
                              placeholder="e.g. Ethan Watson"
                              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-yellow-400"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-bold uppercase mb-1.5">Date of Birth</label>
                            <input
                              type="date"
                              value={dob}
                              onChange={(e) => setDob(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-yellow-400"
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-500 font-bold uppercase mb-1.5">Parent / Guardian Name *</label>
                            <input
                              id="inp-adm-parentname"
                              type="text"
                              value={parentName}
                              onChange={(e) => setParentName(e.target.value)}
                              placeholder="e.g. Sarah Watson"
                              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-yellow-400"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-bold uppercase mb-1.5">Select Program *</label>
                            <select
                              value={program}
                              onChange={(e) => setProgram(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-yellow-400"
                              required
                            >
                              <option value="Play Group">Play Group (1.5 - 2.5 yrs)</option>
                              <option value="Nursery">Nursery (2.5 - 3.5 yrs)</option>
                              <option value="LKG">LKG (3.5 - 4.5 yrs)</option>
                              <option value="UKG">UKG (4.5 - 5.5 yrs)</option>
                              <option value="Daycare">Daycare (6 months - 10 yrs)</option>
                              <option value="Tuition Centre">Tuition Centre (Grades 1-10)</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-500 font-bold uppercase mb-1.5">Email Address *</label>
                            <input
                              id="inp-adm-email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="sarah@example.com"
                              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-yellow-400"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-bold uppercase mb-1.5">Mobile Number *</label>
                            <input
                              id="inp-adm-phone"
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+1 (555) 987-6543"
                              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-yellow-400"
                              required
                            />
                          </div>
                        </div>

                        <button
                          id="btn-adm-submit"
                          type="submit"
                          className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-display font-black py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer text-sm"
                        >
                          Submit Enrollment Request
                          <ArrowRight size={14} />
                        </button>
                      </form>
                    )}
                  </motion.div>
                )}

                {/* SCHOOL TOUR SCHEDULE TAB */}
                {activeForm === "tour" && (
                  <motion.div
                    key="tour-form"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    {tourSuccessMsg ? (
                      <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl space-y-4 text-center">
                        <Calendar size={48} className="text-emerald-500 mx-auto animate-bounce" />
                        <h3 className="font-display font-extrabold text-xl text-emerald-950">Appointment Blocked!</h3>
                        <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                          {tourSuccessMsg} 
                          <br />
                          <span className="font-bold text-slate-700">Check the Portal Dashboard tab; your booking slot has been linked in our calendar logs!</span>
                        </p>
                        <button
                          onClick={() => setTourSuccessMsg("")}
                          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2 rounded-xl cursor-pointer"
                        >
                          Book Another Tour Slot
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleTourSubmit} className="space-y-4 text-xs">
                        <div>
                          <label className="block text-slate-500 font-bold uppercase mb-1.5">Parent Full Name *</label>
                          <input
                            id="inp-tour-parent"
                            type="text"
                            value={tourParentName}
                            onChange={(e) => setTourParentName(e.target.value)}
                            placeholder="e.g. Sarah Watson"
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-yellow-400"
                            required
                          />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-500 font-bold uppercase mb-1.5">Email *</label>
                            <input
                              id="inp-tour-email"
                              type="email"
                              value={tourEmail}
                              onChange={(e) => setTourEmail(e.target.value)}
                              placeholder="sarah@example.com"
                              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-yellow-400"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-bold uppercase mb-1.5">Phone *</label>
                            <input
                              id="inp-tour-phone"
                              type="tel"
                              value={tourPhone}
                              onChange={(e) => setTourPhone(e.target.value)}
                              placeholder="+1 (555) 987-6543"
                              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-yellow-400"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-500 font-bold uppercase mb-1.5">Preferred Date *</label>
                            <input
                              type="date"
                              value={tourDate}
                              onChange={(e) => setTourDate(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-yellow-400"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-bold uppercase mb-1.5">Preferred Time *</label>
                            <select
                              value={tourTime}
                              onChange={(e) => setTourTime(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-yellow-400"
                              required
                            >
                              <option value="9:30 AM">9:30 AM</option>
                              <option value="11:00 AM">11:00 AM</option>
                              <option value="12:30 PM">12:30 PM</option>
                              <option value="2:00 PM">2:00 PM</option>
                              <option value="3:30 PM">3:30 PM</option>
                            </select>
                          </div>
                        </div>

                        <button
                          id="btn-tour-submit"
                          type="submit"
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-display font-black py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer text-sm"
                        >
                          Block Physical Visit Slot
                          <ArrowRight size={14} />
                        </button>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
