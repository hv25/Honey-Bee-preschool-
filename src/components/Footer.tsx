import React from "react";
import { Mail, Phone, MapPin, Award, ShieldAlert, CheckCircle } from "lucide-react";

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  // SEO Schema Markup Object for Preschool Business
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Preschool",
    "name": "Honey Bees Pre-School, Daycare and Tuition centre",
    "image": "https://honeybeespreschool.com/hero-kids.png",
    "@id": "https://honeybeespreschool.com/#school",
    "url": "https://honeybeespreschool.com",
    "telephone": "086883 30502",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Honeycomb Lane",
      "addressLocality": "Sweetwater Valley",
      "postalCode": "SW 4567",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 37.774929,
      "longitude": -122.419416
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "08:00",
      "closes": "18:30"
    },
    "sameAs": [
      "https://facebook.com/honeybeespreschool",
      "https://instagram.com/honeybeespreschool"
    ]
  };

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-8 border-t border-slate-900 font-sans">
      {/* Injecting Local SEO Schema dynamically into the page body */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-slate-900">
          
          {/* Logo & Slogan Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 text-slate-950 rounded-xl flex items-center justify-center text-xl font-bold border border-yellow-300">
                🐝
              </div>
              <span className="font-display font-black text-lg tracking-tight text-white">
                Honey Bees
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Honey Bees provides a premium, nursery-crafted, play-based early learning environment for prospective young scholars. We shape logic, fine-motor coordination, and spatial logic.
            </p>
            <div className="flex gap-2.5">
              <span className="bg-slate-900 border border-slate-800 text-[9px] font-bold text-slate-400 px-2.5 py-1.5 rounded-lg uppercase">
                🛡️ Certified Care
              </span>
              <span className="bg-slate-900 border border-slate-800 text-[9px] font-bold text-slate-400 px-2.5 py-1.5 rounded-lg uppercase">
                🛡️ CCTV Verified
              </span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h4 className="font-display font-extrabold text-sm text-yellow-400 uppercase tracking-widest">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <button onClick={() => setActiveTab("home")} className="hover:text-yellow-400 transition-colors text-left block w-full cursor-pointer">
                  Preschool Homepage
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("about")} className="hover:text-yellow-400 transition-colors text-left block w-full cursor-pointer">
                  Why Honey Bees
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("programs")} className="hover:text-yellow-400 transition-colors text-left block w-full cursor-pointer">
                  Our Nursery Classes
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("facilities")} className="hover:text-yellow-400 transition-colors text-left block w-full cursor-pointer">
                  Kids Foam Play Arena
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("admissions")} className="hover:text-yellow-400 transition-colors text-left block w-full cursor-pointer">
                  Enrollment Inquiry
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("dashboards")} className="hover:text-yellow-400 transition-colors text-left block w-full cursor-pointer text-yellow-500 font-bold">
                  Parent / Teacher Portal Dashboard 🔒
                </button>
              </li>
            </ul>
          </div>

          {/* Core Contacts info */}
          <div className="space-y-4">
            <h4 className="font-display font-extrabold text-sm text-yellow-400 uppercase tracking-widest">
              Honeycomb Contacts
            </h4>
            <ul className="space-y-3.5 text-xs text-slate-400">
              <li className="flex gap-2.5 items-start">
                <MapPin size={14} className="text-yellow-400 shrink-0 mt-0.5" />
                <a
                  href="https://maps.app.goo.gl/WgdtDjTyXkW9z62X9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-400 transition-colors"
                >
                  123 Honeycomb Lane, Sweetwater Valley, SW 4567.
                </a>
              </li>
              <li className="flex gap-2.5 items-center">
                <Phone size={14} className="text-yellow-400 shrink-0" />
                <span>086883 30502</span>
              </li>
              <li className="flex gap-2.5 items-center">
                <Mail size={14} className="text-yellow-400 shrink-0" />
                <span className="font-mono">hello@honeybeespreschool.com</span>
              </li>
            </ul>
          </div>

          {/* Careers & SEO details column */}
          <div className="space-y-4">
            <h4 className="font-display font-extrabold text-sm text-yellow-400 uppercase tracking-widest">
              Careers & Jobs
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              We are actively looking for certified early educators and CPR-trained diaper caregivers to join our hive!
            </p>
            <button
              onClick={() => {
                alert("Our Careers page is active! Please dispatch your curriculum vitae (CV/Resume) to careers@honeybeespreschool.com with subject: 'Preschool Teacher Application'.");
              }}
              className="bg-slate-900 border border-slate-850 hover:bg-slate-800 text-yellow-400 text-xs font-bold px-4 py-2 rounded-xl transition-all w-full text-center cursor-pointer"
            >
              Apply as Preschool Teacher
            </button>
          </div>

        </div>

        {/* Lower footer copyright */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
          <p>© 2026 Honey Bees Pre-School, Daycare and Tuition centre. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-yellow-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-yellow-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-yellow-400 cursor-pointer">WCAG 2.2 Compliant</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
