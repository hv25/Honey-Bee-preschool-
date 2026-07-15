import React, { useState } from "react";
import { 
  X, 
  Download, 
  Printer, 
  Share2, 
  FileText, 
  Calendar, 
  BookOpen, 
  Check, 
  Sparkles, 
  ArrowRight,
  Shield,
  Clock,
  Heart,
  Smile,
  Coffee,
  GraduationCap,
  MapPin,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyClick: () => void;
  onBookTourClick: () => void;
}

// Beautiful landscape/portrait printable HTML generator for the school brochure
const generateBrochurePrintHTML = () => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Honey Bees - School Brochure Prospectus</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@500;700;800;900&display=swap');
    
    @page {
      size: A4 portrait;
      margin: 1.5cm;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      color: #1e293b;
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      line-height: 1.5;
      -webkit-print-color-adjust: exact;
    }
    
    .page-break {
      page-break-after: always;
    }
    
    /* Cover Page */
    .cover-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      padding: 3cm 0;
      box-sizing: border-box;
      background: radial-gradient(circle at 10% 20%, rgba(254, 243, 199, 0.4) 0%, rgba(255, 255, 255, 1) 90%);
      border: 12px double #f59e0b;
      position: relative;
    }

    .cover-honeycomb {
      position: absolute;
      top: 1cm;
      right: 1cm;
      font-size: 4cm;
      opacity: 0.1;
    }
    
    .cover-badge {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 14px;
      background-color: #fef3c7;
      color: #d97706;
      padding: 6px 16px;
      border-radius: 50px;
      text-transform: uppercase;
      letter-spacing: 2px;
      display: inline-block;
    }
    
    .cover-title {
      font-family: 'Outfit', sans-serif;
      font-size: 48px;
      font-weight: 900;
      color: #78350f;
      margin: 20px 0 10px 0;
      line-height: 1.1;
    }
    
    .cover-subtitle {
      font-family: 'Outfit', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: #d97706;
      text-transform: uppercase;
      letter-spacing: 3px;
    }
    
    .cover-tagline {
      font-size: 14px;
      color: #475569;
      max-width: 500px;
      margin: 15px auto 0 auto;
    }
    
    .cover-footer {
      border-top: 2px solid #f3f4f6;
      padding-top: 30px;
      width: 80%;
    }
    
    .cover-phone {
      font-weight: 800;
      color: #1e293b;
      font-size: 16px;
    }
    
    .cover-web {
      color: #64748b;
      font-size: 12px;
      margin-top: 4px;
    }
    
    /* Content Pages */
    .content-page {
      padding: 1cm 0;
      box-sizing: border-box;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #fbbf24;
      padding-bottom: 12px;
      margin-bottom: 30px;
    }
    
    .page-header-logo {
      font-family: 'Outfit', sans-serif;
      font-weight: 900;
      font-size: 16px;
      color: #78350f;
    }
    
    .page-header-tag {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #92400e;
      font-weight: bold;
    }
    
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }
    
    .section-title {
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 800;
      color: #78350f;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .text-block p {
      font-size: 12px;
      color: #334155;
      margin-bottom: 12px;
      line-height: 1.6;
    }
    
    .highlight-box {
      background-color: #fffbeb;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      border-radius: 0 12px 12px 0;
      margin: 15px 0;
    }
    
    .highlight-box-title {
      font-weight: bold;
      font-size: 12px;
      color: #92400e;
      margin-bottom: 4px;
    }
    
    .highlight-box-desc {
      font-size: 11px;
      color: #78350f;
    }
    
    /* Tables/Lists */
    .program-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 15px;
      margin-bottom: 15px;
      background-color: #fafafa;
    }
    
    .program-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .program-card-title {
      font-weight: bold;
      font-size: 13px;
      color: #1e293b;
    }
    
    .program-card-timing {
      font-size: 10px;
      font-weight: bold;
      color: #d97706;
      background-color: #fef3c7;
      padding: 2px 8px;
      border-radius: 4px;
    }
    
    .program-card-desc {
      font-size: 11px;
      color: #475569;
    }

    .menu-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-top: 15px;
    }

    .menu-item {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 10px;
      border-radius: 8px;
    }

    .menu-item-day {
      font-weight: bold;
      font-size: 11px;
      color: #1e293b;
    }

    .menu-item-food {
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }
    
    .footer-note {
      text-align: center;
      font-size: 10px;
      color: #94a3b8;
      border-top: 1px solid #f1f5f9;
      padding-top: 15px;
      margin-top: 40px;
    }
    
    /* Action floating controls */
    .print-controls {
      display: flex;
      gap: 15px;
      justify-content: center;
      position: fixed;
      top: 15px;
      right: 15px;
      z-index: 1000;
      background-color: rgba(255, 255, 255, 0.9);
      padding: 10px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      backdrop-filter: blur(4px);
    }
    
    .print-btn {
      background-color: #fbbf24;
      color: #0f172a;
      border: none;
      font-weight: 800;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-family: 'Outfit', sans-serif;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    
    .print-btn:hover {
      background-color: #f59e0b;
      transform: scale(1.05);
    }
    
    @media print {
      body {
        background-color: #ffffff;
      }
      .print-controls {
        display: none !important;
      }
      .cover-container {
        height: 100vh;
        border-width: 12px;
        page-break-after: always;
      }
    }
  </style>
</head>
<body>

  <div class="print-controls">
    <button class="print-btn" onclick="window.print()">🖨️ Print Brochure</button>
    <button class="print-btn" style="background-color: #e2e8f0; color: #475569;" onclick="window.close()">❌ Close</button>
  </div>

  <!-- PAGE 1: COVER -->
  <div class="cover-container">
    <div class="cover-honeycomb">🐝</div>
    <div>
      <span class="cover-badge">Admissions 100% Open</span>
      <h1 class="cover-title">HONEY BEES</h1>
      <div class="cover-subtitle">Pre-School, Daycare & Tuition Centre</div>
      <p class="cover-tagline">
        Where curiosity meets premium education, creative exploration, and absolute child safety under our interactive Beatrice AI pipeline.
      </p>
    </div>
    
    <div class="cover-footer">
      <div class="cover-phone">📞 086883 30502</div>
      <div class="cover-web">Lawsons Bay Colony, Visakhapatnam | honeybeesplayroom.com</div>
    </div>
  </div>

  <!-- PAGE 2: ABOUT, PROGRAMS & CURRICULUM -->
  <div class="content-page page-break">
    <div class="page-header">
      <span class="page-header-logo">🐝 Honey Bees Preschool</span>
      <span class="page-header-tag">About & Programs</span>
    </div>
    
    <div class="grid-2">
      <div class="text-block">
        <h2 class="section-title">🌟 About Honey Bees</h2>
        <p>
          Founded on progressive early childhood principles, Honey Bees is Visakhapatnam's premium preschool and daycare ecosystem. We nurture intellectual curiosity through balanced structured learning and sensory sandbox play.
        </p>
        <p>
          Our hallmark integration is <strong>Beatrice AI systems</strong>, providing interactive story reading, dynamic feedback loops, and automated milestone tracking to create the safest and most transparent daycare experience.
        </p>
        
        <div class="highlight-box">
          <div class="highlight-box-title">🔒 Absolute Parent Safety Guarantee</div>
          <div class="highlight-box-desc">
            All families receive secured parent portal credentials to access 1080p high-definition live streams of preschool playrooms anytime during operational hours.
          </div>
        </div>
      </div>
      
      <div>
        <h2 class="section-title">🎓 Programs & Age Groups</h2>
        
        <div class="program-card">
          <div class="program-card-header">
            <span class="program-card-title">🐝 Play Group (1.5 - 2.5 Years)</span>
            <span class="program-card-timing">8:30 AM - 7:30 PM</span>
          </div>
          <p class="program-card-desc">Social integration focusing on tactile play, motor actions, sharing loops, and interactive sensory songs.</p>
        </div>

        <div class="program-card">
          <div class="program-card-header">
            <span class="program-card-title">🧸 Nursery (2.5 - 3.5 Years)</span>
            <span class="program-card-timing">8:30 AM - 7:30 PM</span>
          </div>
          <p class="program-card-desc">Early phonic blocks, sentence building, coloring grids, puppet-guided conversations, and count scales.</p>
        </div>

        <div class="program-card">
          <div class="program-card-header">
            <span class="program-card-title">📚 LKG (3.5 - 4.5 Years)</span>
            <span class="program-card-timing">8:30 AM - 7:30 PM</span>
          </div>
          <p class="program-card-desc">Phonic spelling foundations, primary reading, counting, basic addition, and environmental nature studies.</p>
        </div>

        <div class="program-card">
          <div class="program-card-header">
            <span class="program-card-title">📝 UKG (4.5 - 5.5 Years)</span>
            <span class="program-card-timing">8:30 AM - 7:30 PM</span>
          </div>
          <p class="program-card-desc">Advanced primary school preparation focusing on phonic stories, coordinate math, science labs, and spatial blocks.</p>
        </div>
      </div>
    </div>
    
    <div class="footer-note">Page 2 | Honey Bees Official Prospectus 2026</div>
  </div>

  <!-- PAGE 3: CURRICULUM, MENU & TEACHERS -->
  <div class="content-page page-break">
    <div class="page-header">
      <span class="page-header-logo">🐝 Honey Bees Preschool</span>
      <span class="page-header-tag">Curriculum, Food & Staff</span>
    </div>
    
    <div class="grid-2">
      <div class="text-block">
        <h2 class="section-title">📚 Curriculum & Approach</h2>
        <p>
          We utilize a dual-structured approach combining the child-centered exploration of the <strong>Montessori</strong> method with structured preschool phonic readiness.
        </p>
        <p>
          Our <strong>Activity-Based Learning (ABL)</strong> framework centers fine motor practices, active vocabulary spelling games, and native language introductions (including a structured Telugu language playroom).
        </p>
        
        <h2 class="section-title">🍎 Organic Food Menu</h2>
        <p>
          Nutritious pediatric menus are designed by certified childhood nutritionists. All food is freshly cooked on-site in our fully organic sanitary kitchen.
        </p>
        <div class="menu-grid">
          <div class="menu-item">
            <div class="menu-item-day">Monday & Wednesday</div>
            <div class="menu-item-food">Fresh organic fruit bowls, honey-oat purees, and pure filtered spring water.</div>
          </div>
          <div class="menu-item">
            <div class="menu-item-day">Tuesday & Thursday</div>
            <div class="menu-item-food">Steamed vegetable purees, ragi porridge, and fresh carrot apple extract.</div>
          </div>
        </div>
      </div>
      
      <div>
        <h2 class="section-title">👩‍🏫 Experienced Educators</h2>
        <p>
          Our team is comprised of highly qualified teachers and licensed childcare mentors passionate about early growth:
        </p>
        
        <div style="margin-top:15px; space-y: 10px;">
          <div style="margin-bottom:12px;">
            <strong style="font-size:12px; color:#1e293b; display:block;">Director Beatrice, Ph.D.</strong>
            <span style="font-size:11px; color:#64748b;">Preschool Director of Beatrice Labs, 15+ years in cognitive childhood development.</span>
          </div>
          <div style="margin-bottom:12px;">
            <strong style="font-size:12px; color:#1e293b; display:block;">Miss Shalini, M.Ed.</strong>
            <span style="font-size:11px; color:#64748b;">Lead Nursery Educator, certified Montessori sensory specialist.</span>
          </div>
          <div style="margin-bottom:12px;">
            <strong style="font-size:12px; color:#1e293b; display:block;">Dr. Aaron, Psy.D.</strong>
            <span style="font-size:11px; color:#64748b;">Advisory Pediatric Psychologist, specializing in active child-safety behavior.</span>
          </div>
        </div>

        <h2 class="section-title" style="margin-top:25px;">🏫 Safe & Modern Facilities</h2>
        <p>
          Our premises are structured around ultimate physical protection:
        </p>
        <ul style="font-size: 11px; color: #475569; padding-left: 20px; line-height: 1.7;">
          <li>Triple Childproof electromagnetic entry gates.</li>
          <li>All-organic allergen-free soft mats and timber furniture.</li>
          <li>Interactive Tracing Slates and Multi-sensory Sandbox.</li>
          <li>A clean, fully indoor high-ventilation air purifier network.</li>
        </ul>
      </div>
    </div>
    
    <div class="footer-note">Page 3 | Honey Bees Official Prospectus 2026</div>
  </div>

  <!-- PAGE 4: ROUTINE, PROCESS & CONTACT -->
  <div class="content-page">
    <div class="page-header">
      <span class="page-header-logo">🐝 Honey Bees Preschool</span>
      <span class="page-header-tag">Admissions & Contact</span>
    </div>
    
    <div class="grid-2">
      <div class="text-block">
        <h2 class="section-title">📅 Daily Routine</h2>
        <p>
          Our daily schedule ensures a balanced rhythm of structured instruction, cognitive tasks, and creative rest:
        </p>
        <table style="width:100%; border-collapse: collapse; font-size: 11px; color: #475569; text-align: left; margin-top: 10px;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <th style="padding: 6px 0; font-weight: bold; color: #1e293b;">Time</th>
            <th style="padding: 6px 0; font-weight: bold; color: #1e293b;">Activity</th>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 6px 0;">08:30 AM</td>
            <td style="padding: 6px 0;">Arrival & Morning Circle Prayers</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 6px 0;">09:15 AM</td>
            <td style="padding: 6px 0;">Literacy & Phonics Tracing Slate Session</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 6px 0;">10:30 AM</td>
            <td style="padding: 6px 0;">Healthy Fruit Bowl & Social Rest Time</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 6px 0;">11:15 AM</td>
            <td style="padding: 6px 0;">Cognitive Memory Flip & Magic Sandbox Doodles</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 6px 0;">01:30 PM</td>
            <td style="padding: 6px 0;">Healthy Steamed Veggie Lunch & Guided Nap</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 6px 0;">04:00 PM</td>
            <td style="padding: 6px 0;">Vocabulary Games, Story Telling & Playtime</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 6px 0;">06:30 PM</td>
            <td style="padding: 6px 0;">Sunset Rest & Dismissal Preparation</td>
          </tr>
        </table>
      </div>
      
      <div class="text-block">
        <h2 class="section-title">💰 Tuition & Admissions</h2>
        <p>
          We believe premium education should be value-packed.
        </p>
        <p>
          <strong>Tuition fees:</strong> Our Preschool Programs (Play Group, Nursery, LKG, UKG) are structured with full-day coverage (8:30 AM to 7:30 PM) for parent peace of mind. Full fee schedules and active discount slots are provided directly upon physical school tour or official parent register.
        </p>
        
        <div class="highlight-box" style="background-color: #f0fdf4; border-left-color: #22c55e;">
          <div class="highlight-box-title" style="color: #15803d;">📝 4-Step Simple Admission Process</div>
          <div style="font-size:10px; color:#166534; line-height:1.5; margin-top:4px;">
            1. Book physical school tour or file online application<br>
            2. Child interactive session with director Beatrice<br>
            3. Setup security parent credentials & medical file<br>
            4. Lock seat and buzz in!
          </div>
        </div>

        <h2 class="section-title" style="margin-top: 20px;">📞 Connect with Us</h2>
        <p style="font-size: 11px; margin-bottom: 5px;">
          <strong>Address:</strong> Lawsons Bay Colony, Opp. AU Playground, Visakhapatnam, AP, 530017
        </p>
        <p style="font-size: 11px; margin-bottom: 5px;">
          <strong>Direct Line:</strong> 086883 30502
        </p>
        <p style="font-size: 11px;">
          <strong>Email:</strong> admissions@honeybeesplayroom.com
        </p>
      </div>
    </div>
    
    <div class="footer-note">Page 4 | Honey Bees Official Prospectus 2026</div>
  </div>

</body>
</html>
`;
};

// Beautiful content templates for interactive booklet preview
const BROCHURE_PAGES = [
  {
    title: "🌟 About Honey Bees",
    icon: <Smile className="text-amber-500 w-5 h-5" />,
    color: "from-amber-500/10 to-amber-600/5 border-amber-500/20",
    content: (
      <div className="space-y-4">
        <p className="text-xs text-slate-350 leading-relaxed">
          Founded on progressive early childhood principles, Honey Bees is Visakhapatnam's premium preschool and daycare ecosystem. We nurture intellectual curiosity through a balanced mixture of structured early education and play-based discovery.
        </p>
        <p className="text-xs text-slate-350 leading-relaxed">
          Our hallmark feature is the custom-tailored <strong>Beatrice Learning Engine</strong>. Beatrice provides voice-guided play prompts, interactive tracing slates, real-time feedback loops, and persistent progress logging so parents are always aware of child success.
        </p>
        <div className="bg-slate-800/80 border border-slate-700/50 p-3.5 rounded-2xl flex items-start gap-3">
          <Shield className="text-amber-400 w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-slate-200">100% Parent Safety Guarantee</h5>
            <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
              Every parent gets dedicated portal access to watch live 1080p high-definition camera feeds of playrooms and daycare sleeping bays during active hours.
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "🎓 Programs & Age Groups",
    icon: <GraduationCap className="text-sky-400 w-5 h-5" />,
    color: "from-sky-500/10 to-sky-600/5 border-sky-500/20",
    content: (
      <div className="space-y-3">
        <p className="text-xs text-slate-350 leading-relaxed">
          Four tailored levels structured beautifully with extended timings for modern working parents:
        </p>
        <div className="space-y-2.5">
          <div className="bg-slate-800/40 border border-slate-700/40 p-2.5 rounded-xl flex justify-between items-center">
            <div>
              <h5 className="text-[11px] font-black text-slate-200">🎨 Play Group (1.5 - 2.5 Years)</h5>
              <p className="text-[10px] text-slate-400 mt-0.5">Focus: Sensory actions, toys sharing, and motor nursery loops.</p>
            </div>
            <span className="text-[9px] font-bold text-sky-400 bg-sky-950/40 px-2 py-1 rounded">8:30 AM - 7:30 PM</span>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/40 p-2.5 rounded-xl flex justify-between items-center">
            <div>
              <h5 className="text-[11px] font-black text-slate-200">🧸 Nursery (2.5 - 3.5 Years)</h5>
              <p className="text-[10px] text-slate-400 mt-0.5">Focus: Phonics blocks, storytelling puppets, count scales.</p>
            </div>
            <span className="text-[9px] font-bold text-sky-400 bg-sky-950/40 px-2 py-1 rounded">8:30 AM - 7:30 PM</span>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/40 p-2.5 rounded-xl flex justify-between items-center">
            <div>
              <h5 className="text-[11px] font-black text-slate-200">📚 LKG (3.5 - 4.5 Years)</h5>
              <p className="text-[10px] text-slate-400 mt-0.5">Focus: Writing foundations, nature labs, music rhythm dances.</p>
            </div>
            <span className="text-[9px] font-bold text-sky-400 bg-sky-950/40 px-2 py-1 rounded">8:30 AM - 7:30 PM</span>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/40 p-2.5 rounded-xl flex justify-between items-center">
            <div>
              <h5 className="text-[11px] font-black text-slate-200">📝 UKG (4.5 - 5.5 Years)</h5>
              <p className="text-[10px] text-slate-400 mt-0.5">Focus: Primary preparation, phonetic stories, science labs.</p>
            </div>
            <span className="text-[9px] font-bold text-sky-400 bg-sky-950/40 px-2 py-1 rounded">8:30 AM - 7:30 PM</span>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "📚 Curriculum & Approach",
    icon: <BookOpen className="text-emerald-400 w-5 h-5" />,
    color: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20",
    content: (
      <div className="space-y-3.5">
        <p className="text-xs text-slate-350 leading-relaxed">
          We combine the hands-on, child-centered discovery philosophy of the <strong>Montessori</strong> system with rigorous school phonic benchmarks.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-750">
            <h6 className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider">Early Literacy</h6>
            <p className="text-[10px] text-slate-400 mt-1">Multi-sensory phonics tracking and word building templates.</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-750">
            <h6 className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider">Concept Maths</h6>
            <p className="text-[10px] text-slate-400 mt-1">Introduction to spatial coordinates, weights, and logic scales.</p>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 italic">
          "Educating the mind without educating the heart is no education at all." — Beatrice Learning Systems
        </p>
      </div>
    )
  },
  {
    title: "🧩 Activity-Based Learning",
    icon: <Sparkles className="text-purple-400 w-5 h-5" />,
    color: "from-purple-500/10 to-purple-600/5 border-purple-500/20",
    content: (
      <div className="space-y-3">
        <p className="text-xs text-slate-350 leading-relaxed">
          Children learn best by actively interacting with tactile materials. Our playroom zones are fully fitted for activity-driven education:
        </p>
        <ul className="space-y-2 text-[11px] text-slate-400 list-disc list-inside">
          <li><strong className="text-slate-300">Magic Sandbox:</strong> Doodling, forming geometric shapes, and practicing letters in tactile sand.</li>
          <li><strong className="text-slate-300">Fine Motor Stations:</strong> Paper tearing mosaics, puppet-guided theatres, and building blocks.</li>
          <li><strong className="text-slate-300">Telugu Zone:</strong> Early sound recognition for native scripts and Telugu vowel tracing.</li>
          <li><strong className="text-slate-300">Memory flip panels:</strong> Cognitive cards to boost spatial recall and memory.</li>
        </ul>
      </div>
    )
  },
  {
    title: "🍎 Healthy Food Menu",
    icon: <Coffee className="text-rose-400 w-5 h-5" />,
    color: "from-rose-500/10 to-rose-600/5 border-rose-500/20",
    content: (
      <div className="space-y-3">
        <p className="text-xs text-slate-350 leading-relaxed">
          Fueling tiny bodies with pure organic nutrients is core to child energy and focus:
        </p>
        <div className="space-y-2">
          <div className="bg-rose-950/20 border border-rose-900/30 p-3 rounded-xl">
            <h6 className="text-[11px] font-bold text-rose-300">🍏 Morning Snack Bowl</h6>
            <p className="text-[10px] text-slate-400 mt-1">Freshly chopped organic papaya, banana, apple purees, and pure honey-toasted oats.</p>
          </div>
          <div className="bg-rose-950/20 border border-rose-900/30 p-3 rounded-xl">
            <h6 className="text-[11px] font-bold text-rose-300">🍲 Steamed Puree Lunch</h6>
            <p className="text-[10px] text-slate-400 mt-1">Pureed carrots, sweet potatoes, organic green lentils, soft steamed idli, and filtered spring water.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "🏫 Safe & Modern Facilities",
    icon: <Shield className="text-yellow-400 w-5 h-5" />,
    color: "from-yellow-500/10 to-yellow-600/5 border-yellow-500/20",
    content: (
      <div className="space-y-3">
        <p className="text-xs text-slate-350 leading-relaxed">
          Physical safety underpins every learning second at Honey Bees:
        </p>
        <div className="grid grid-cols-2 gap-3 text-[10px] text-slate-450 font-medium">
          <div className="bg-slate-800/30 p-2.5 border border-slate-700/30 rounded-lg">
            🚨 Triple-locked childproof electromagnetic escape exits.
          </div>
          <div className="bg-slate-800/30 p-2.5 border border-slate-700/30 rounded-lg">
            📹 HD CCTV 1080p feeds linked securely to parents.
          </div>
          <div className="bg-slate-800/30 p-2.5 border border-slate-700/30 rounded-lg">
            🌱 Air Purifiers active throughout the facility.
          </div>
          <div className="bg-slate-800/30 p-2.5 border border-slate-700/30 rounded-lg">
            🧸 Allergen-free rubber foam padded mats and safe toys.
          </div>
        </div>
      </div>
    )
  },
  {
    title: "📅 Daily Routine",
    icon: <Clock className="text-orange-400 w-5 h-5" />,
    color: "from-orange-500/10 to-orange-600/5 border-orange-500/20",
    content: (
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[11px] border-b border-slate-800 pb-1.5 text-slate-400">
          <span>08:30 AM - 09:15 AM</span>
          <strong className="text-slate-200">Morning circles & Prayers</strong>
        </div>
        <div className="flex items-center justify-between text-[11px] border-b border-slate-800 pb-1.5 text-slate-400">
          <span>09:15 AM - 10:30 AM</span>
          <strong className="text-slate-200">Phonics Tracing slate</strong>
        </div>
        <div className="flex items-center justify-between text-[11px] border-b border-slate-800 pb-1.5 text-slate-400">
          <span>10:30 AM - 11:15 AM</span>
          <strong className="text-slate-200">Organic Fruits break</strong>
        </div>
        <div className="flex items-center justify-between text-[11px] border-b border-slate-800 pb-1.5 text-slate-400">
          <span>11:15 AM - 01:30 PM</span>
          <strong className="text-slate-200">Magic sandbox & doodling</strong>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>01:30 PM - 03:00 PM</span>
          <strong className="text-slate-200">Veggie lunch & resting naps</strong>
        </div>
      </div>
    )
  },
  {
    title: "💰 Tuition & Admissions",
    icon: <FileText className="text-indigo-400 w-5 h-5" />,
    color: "from-indigo-500/10 to-indigo-600/5 border-indigo-500/20",
    content: (
      <div className="space-y-3">
        <p className="text-xs text-slate-350 leading-relaxed">
          Our preschool schedules are completely customized with maximum daycare duration (8:30 AM - 7:30 PM) for parental ease. Complete schedules and group discounts are provided upon school tour.
        </p>
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
          <h6 className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Fast 4-Step admission</h6>
          <div className="text-[9px] text-slate-400 space-y-1">
            <p>1. Online form registration or tour reservation</p>
            <p>2. Physical interaction with pediatric experts</p>
            <p>3. Medical documentation file handover</p>
            <p>4. Tuition locks & active playroom entrance!</p>
          </div>
        </div>
      </div>
    )
  }
];

export default function BrochureModal({ isOpen, onClose, onApplyClick, onBookTourClick }: BrochureModalProps) {
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  if (!isOpen) return null;

  // Handle local print dispatch
  const handlePrint = () => {
    const htmlContent = generateBrochurePrintHTML();
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 500);
    }
  };

  // Handle simulated brochure download
  const handleDownload = () => {
    setDownloadSuccess(true);
    
    // Create a dummy text file as the PDF representation to trigger actual browser download stream
    const brochureTextContent = `====================================================
HONEY BEES PRE-SCHOOL, DAYCARE & TUITION CENTRE
====================================================
Visakhapatnam's premium early-childhood playroom ecosystem.
Direct Admissions Line: 086883 30502

WHAT'S INSIDE OUR PROSPECTUS:
1. About Honey Bees Preschool
2. Extended timings for modern working parents: 8:30 AM to 7:30 PM
3. Dual-philosophy Montessori curriculum
4. Interactive Beatrice AI Tracing Slate pipeline
5. Full HD CCTV 1080p security access
6. Organic pediatric nutrition plan
7. Step-by-step admissions enrollment process

Please present this downloaded voucher during your scheduled physical school tour to redeem a free sandbox doodler kit!
Thank you for joining the Honey Bees family.`;

    const blob = new Blob([brochureTextContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Honeybees_Prospectus_2026.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setDownloadSuccess(false);
    }, 3000);
  };

  // Handle custom brochure sharing link
  const handleShare = () => {
    setShareSuccess(true);
    const brochureLink = `${window.location.origin}/?tab=programs&brochure=open`;
    navigator.clipboard.writeText(brochureLink);

    setTimeout(() => {
      setShareSuccess(false);
    }, 3000);
  };

  const currentPage = BROCHURE_PAGES[activePageIndex];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="bg-slate-900 border-2 border-amber-400/40 w-full max-w-4xl rounded-[36px] shadow-2xl relative overflow-hidden flex flex-col md:flex-row h-auto md:h-[650px]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-2 rounded-2xl transition-all cursor-pointer"
            aria-label="Close Brochure"
          >
            <X size={16} />
          </button>

          {/* LEFT: Brochure Controls and Navigation Sidebar */}
          <div className="w-full md:w-80 bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-800/80 p-6 flex flex-col justify-between shrink-0 h-auto md:h-full">
            <div className="space-y-6">
              {/* Header Info */}
              <div className="space-y-1.5 text-left">
                <span className="text-[10px] font-black bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full uppercase tracking-widest font-mono border border-amber-500/20">
                  📄 Digital Brochure
                </span>
                <h3 className="font-display font-black text-xl text-white tracking-tight mt-3">
                  Honey Bees Prospectus
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">
                  Visakhapatnam's premium learning centre
                </p>
              </div>

              {/* Page Selection Menu */}
              <div className="space-y-1 max-h-48 md:max-h-72 overflow-y-auto pr-1">
                {BROCHURE_PAGES.map((page, index) => (
                  <button
                    key={page.title}
                    onClick={() => setActivePageIndex(index)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 ${
                      activePageIndex === index
                        ? "bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/10"
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <span className="text-sm shrink-0 leading-none">
                      {activePageIndex === index ? "🐝" : "📄"}
                    </span>
                    <span className="truncate">{page.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Option Blocks */}
            <div className="pt-4 border-t border-slate-800/60 mt-4 space-y-2.5">
              <button
                onClick={() => {
                  onClose();
                  onApplyClick();
                }}
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-display font-black text-[11px] py-3 px-4 rounded-xl cursor-pointer transition-all hover:scale-102 active:scale-98 flex items-center justify-center gap-1.5"
              >
                📝 Apply for Admission
                <ArrowRight size={12} />
              </button>
              
              <button
                onClick={() => {
                  onClose();
                  onBookTourClick();
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-sans font-bold text-[11px] py-3 px-4 rounded-xl border border-slate-800 cursor-pointer transition-all hover:scale-102 active:scale-98 flex items-center justify-center gap-1.5"
              >
                📅 Book a School Tour
              </button>
            </div>
          </div>

          {/* RIGHT: Active Page Content Reader with interactive options */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between h-auto md:h-full bg-slate-900/40 relative overflow-y-auto">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Booklet content viewer */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-4 text-left">
                <span className="p-2 bg-slate-800/60 rounded-xl block shrink-0">
                  {currentPage.icon}
                </span>
                <div>
                  <h4 className="font-display font-black text-white text-sm">
                    {currentPage.title}
                  </h4>
                  <p className="text-[9px] text-amber-500 font-mono tracking-widest uppercase">
                    Interactive Booklet Page {activePageIndex + 1} of {BROCHURE_PAGES.length}
                  </p>
                </div>
              </div>

              {/* Active Slide content */}
              <div className="min-h-[180px] md:min-h-[220px] text-left">
                {currentPage.content}
              </div>
            </div>

            {/* Action Bar for user-requested brochure options */}
            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={handleDownload}
                  className="bg-slate-800/60 hover:bg-slate-800 text-slate-200 hover:text-white px-4 py-3 rounded-xl text-[11px] font-bold font-sans transition-all flex items-center justify-center gap-2 cursor-pointer shadow-3xs"
                >
                  {downloadSuccess ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      Downloaded!
                    </>
                  ) : (
                    <>
                      <Download size={14} className="text-amber-400" />
                      Download PDF
                    </>
                  )}
                </button>

                <button
                  onClick={handlePrint}
                  className="bg-slate-800/60 hover:bg-slate-800 text-slate-200 hover:text-white px-4 py-3 rounded-xl text-[11px] font-bold font-sans transition-all flex items-center justify-center gap-2 cursor-pointer shadow-3xs"
                >
                  <Printer size={14} className="text-amber-400" />
                  Print Brochure
                </button>

                <button
                  onClick={handleShare}
                  className="bg-slate-800/60 hover:bg-slate-800 text-slate-200 hover:text-white px-4 py-3 rounded-xl text-[11px] font-bold font-sans transition-all flex items-center justify-center gap-2 cursor-pointer shadow-3xs"
                >
                  {shareSuccess ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <Share2 size={14} className="text-amber-400" />
                      Share Link
                    </>
                  )}
                </button>
              </div>

              <p className="text-[9px] text-slate-500 text-center mt-4 font-mono font-medium leading-relaxed">
                📍 Visakhapatnam Premium Early Childhood Center • 📞 Contact: 086883 30502
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
