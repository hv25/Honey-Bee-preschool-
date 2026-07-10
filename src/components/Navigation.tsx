import React, { useState } from "react";
import { Menu, X, Phone, Calendar, LogIn, Award } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onBookTourClick: () => void;
}

export default function Navigation({ activeTab, setActiveTab, onBookTourClick }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About Us" },
    { id: "programs", label: "Programs" },
    { id: "facilities", label: "Facilities" },
    { id: "playroom", label: "Learn & Play 🧸" },
    { id: "gallery", label: "Gallery" },
    { id: "events", label: "Events" },
    { id: "blog", label: "Blog" },
    { id: "admissions", label: "Admissions" },
    { id: "contact", label: "Contact Us" },
    { id: "dashboards", label: "Portals Dashboard", highlight: true }
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-yellow-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick("home")}>
            <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 via-amber-400 to-orange-400 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-yellow-300">
              🐝
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-xl tracking-tight text-slate-900 leading-none">
                  Honey Bees
                </span>
                <span className="text-[10px] font-extrabold uppercase bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded leading-none">
                  PREMIUM
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide mt-1 font-sans font-medium uppercase">
                Pre-School, Daycare and Tuition centre
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === item.id
                    ? item.highlight
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-yellow-50 text-yellow-700"
                    : item.highlight
                    ? "bg-slate-100 text-slate-800 hover:bg-slate-200"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Call / Book Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:08688330502"
              className="text-slate-700 hover:text-yellow-600 font-sans font-bold text-xs flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-50 transition-all"
            >
              <Phone size={14} className="text-yellow-500" />
              086883 30502
            </a>
            <button
              id="nav-btn-book-tour"
              onClick={onBookTourClick}
              className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-4 py-2.5 rounded-xl font-display font-extrabold text-xs transition-all shadow-sm hover:shadow-yellow-100 flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar size={13} />
              Book a Tour
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onBookTourClick}
              className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 p-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center cursor-pointer"
              aria-label="Book a Tour"
            >
              <Calendar size={15} />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-slate-50 border border-slate-200 text-slate-700 p-2.5 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-100 bg-white overflow-hidden shadow-inner"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all block cursor-pointer ${
                    activeTab === item.id
                      ? item.highlight
                        ? "bg-slate-900 text-white"
                        : "bg-yellow-50 text-yellow-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:08688330502"
                  className="bg-slate-50 border border-slate-200 text-slate-700 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Phone size={14} className="text-yellow-500" />
                  Call: 086883 30502
                </a>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onBookTourClick();
                  }}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 py-3 rounded-xl font-display font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar size={14} />
                  Schedule School Tour
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
