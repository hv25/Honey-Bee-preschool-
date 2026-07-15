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
      "streetAddress": "LAWSON'S BAY COLONY, 4-43-16/1, Lawsons Bay Colony, Pedda Waltair",
      "addressLocality": "Visakhapatnam",
      "postalCode": "530017",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 17.7291,
      "longitude": 83.3377
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "08:30",
        "closes": "19:30"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Saturday"
        ],
        "opens": "08:30",
        "closes": "19:00"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/share/1BGwc75YUc/",
      "https://www.instagram.com/honey.bees.preschool?igsh=dTY0eG82cjFubnI5"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-900">
          
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
            <div className="flex gap-2.5 flex-wrap">
              <span className="bg-slate-900 border border-slate-800 text-[9px] font-bold text-slate-400 px-2.5 py-1.5 rounded-lg uppercase">
                🛡️ Certified Care
              </span>
              <span className="bg-slate-900 border border-slate-800 text-[9px] font-bold text-slate-400 px-2.5 py-1.5 rounded-lg uppercase">
                🛡️ CCTV Verified
              </span>
            </div>
            <div className="pt-2">
              <span className="text-[10px] font-extrabold text-yellow-400 uppercase tracking-wider block mb-2">
                Follow Our Hive
              </span>
              <div className="flex gap-2">
                <a
                  href="https://www.facebook.com/share/1BGwc75YUc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-yellow-400 hover:border-yellow-400 transition-all hover:scale-105"
                  title="Facebook Page"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/honey.bees.preschool?igsh=dTY0eG82cjFubnI5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-yellow-400 hover:border-yellow-400 transition-all hover:scale-105"
                  title="Instagram Page"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
              </div>
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

          {/* Operating Hours Column */}
          <div className="space-y-4">
            <h4 className="font-display font-extrabold text-sm text-yellow-400 uppercase tracking-widest">
              Hours
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex flex-col border-b border-slate-900 pb-2">
                <span className="font-semibold text-slate-300">Mon - Fri</span>
                <span className="text-white font-mono mt-0.5">8:30 am – 7:30 pm</span>
              </li>
              <li className="flex flex-col border-b border-slate-900 pb-2">
                <span className="font-semibold text-slate-300">Saturday</span>
                <span className="text-white font-mono mt-0.5">8:30 am – 7:00 pm</span>
              </li>
              <li className="flex flex-col">
                <span className="font-semibold text-slate-300">Sunday</span>
                <span className="text-rose-400 font-semibold mt-0.5">Closed</span>
              </li>
            </ul>
          </div>

          {/* Core Contacts info */}
          <div className="space-y-4">
            <h4 className="font-display font-extrabold text-sm text-yellow-400 uppercase tracking-widest">
              HoneyBee Contacts
            </h4>
            <ul className="space-y-3.5 text-xs text-slate-400">
              <li className="flex gap-2.5 items-start">
                <MapPin size={14} className="text-yellow-400 shrink-0 mt-0.5" />
                <a
                  href="https://maps.app.goo.gl/d4nKq85KkAVRvKiP7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-400 transition-colors break-all font-mono"
                >
                  https://maps.app.goo.gl/d4nKq85KkAVRvKiP7
                </a>
              </li>
              <li className="flex gap-2.5 items-center">
                <Phone size={14} className="text-yellow-400 shrink-0" />
                <span>086883 30502</span>
              </li>
              <li className="flex gap-2.5 items-center">
                <Mail size={14} className="text-yellow-400 shrink-0" />
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=hello@honeybeespreschool.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono hover:text-yellow-400 hover:underline transition-colors inline-flex items-center gap-1.5"
                  title="Compose email on Gmail"
                >
                  hello@honeybeespreschool.com
                  <span className="text-[9px] bg-yellow-400/15 text-yellow-300 px-1 py-0.5 rounded font-sans font-bold">Gmail</span>
                </a>
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
