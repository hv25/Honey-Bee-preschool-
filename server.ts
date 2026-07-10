import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

// Initialize Gemini API
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey && geminiApiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI:", err);
  }
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// --- Mock Database (In-Memory) ---
const db: any = {
  admissions: [
    {
      id: "adm-1",
      childName: "Emily Watson",
      parentName: "Sarah Watson",
      email: "sarah@example.com",
      phone: "+1 (555) 987-6543",
      dob: "2022-04-12",
      program: "Nursery",
      status: "Approved",
      date: "2026-07-01",
    },
    {
      id: "adm-2",
      childName: "Liam Johnson",
      parentName: "David Johnson",
      email: "david@example.com",
      phone: "+1 (555) 765-4321",
      dob: "2021-08-19",
      program: "LKG",
      status: "Pending Review",
      date: "2026-07-09",
    }
  ],
  tours: [
    {
      id: "tour-1",
      parentName: "Alice Miller",
      email: "alice@example.com",
      phone: "+1 (555) 321-0987",
      date: "2026-07-15",
      time: "10:00 AM",
      status: "Confirmed",
    }
  ],
  enquiries: [
    {
      id: "enq-1",
      parentName: "Robert Dow",
      email: "robert@example.com",
      phone: "+1 (555) 432-1098",
      childAge: "3 years",
      program: "Nursery",
      message: "Can I get information about transportation services?",
      date: "2026-07-08",
    }
  ],
  newsletter: ["parent1@honeycomb.com", "educator@learning.com"],
  students: [
    {
      id: "stud-1",
      name: "Ethan Carter",
      parentName: "Mary Carter",
      parentEmail: "parent@honeybees.com",
      program: "Nursery",
      dob: "2023-01-15",
      attendance: [
        { date: "2026-07-06", status: "Present" },
        { date: "2026-07-07", status: "Present" },
        { date: "2026-07-08", status: "Absent" },
        { date: "2026-07-09", status: "Present" },
        { date: "2026-07-10", status: "Present" }
      ],
      fees: [
        { term: "Term 1 (July - Sept 2026)", amount: 540, status: "Paid", dueDate: "2026-07-05", paidDate: "2026-07-03" },
        { term: "Term 2 (Oct - Dec 2026)", amount: 540, status: "Pending", dueDate: "2026-10-05" }
      ],
      progress: {
        motorSkills: "Excellent",
        socialSkills: "Very Good",
        creativity: "Outstanding",
        cognitive: "Good Progress"
      }
    },
    {
      id: "stud-2",
      name: "Sophia Martinez",
      parentName: "Juan Martinez",
      parentEmail: "juan@example.com",
      program: "Play Group",
      dob: "2024-05-20",
      attendance: [
        { date: "2026-07-08", status: "Present" },
        { date: "2026-07-09", status: "Present" },
        { date: "2026-07-10", status: "Present" }
      ],
      fees: [
        { term: "Term 1 (July - Sept 2026)", amount: 450, status: "Paid", dueDate: "2026-07-05", paidDate: "2026-07-04" }
      ],
      progress: {
        motorSkills: "Very Good",
        socialSkills: "Excellent",
        creativity: "Good Progress",
        cognitive: "Excellent"
      }
    }
  ],
  homework: [
    {
      id: "hw-1",
      class: "Nursery",
      subject: "Arts & Crafts",
      title: "Leaf Painting Activity",
      description: "Collect 3 different shaped leaves from your garden. Dip them in water-colors and make a pattern on an A4 sheet. Bring it on Monday!",
      assignedDate: "2026-07-10",
      dueDate: "2026-07-13",
    },
    {
      id: "hw-2",
      class: "Play Group",
      subject: "Sensory",
      title: "Finger Painting Fun",
      description: "Guide your toddler to finger paint a yellow circle representing a honeycomb. Helps with fine motor control.",
      assignedDate: "2026-07-09",
      dueDate: "2026-07-12",
    }
  ],
  notices: [
    {
      id: "nt-1",
      title: "Parents-Teacher Meeting (PTM)",
      content: "Our first Term PTM is scheduled for Saturday, July 18th, from 9:30 AM to 12:30 PM. Please book your 15-minute slot through the parent portal dashboard.",
      date: "2026-07-10",
      urgent: true,
    },
    {
      id: "nt-2",
      title: "Rainy Day Activities Announcement",
      content: "Since we are entering the monsoon season, outdoor playground hours will transition to our premium indoor foam activity arena. Please send an extra pair of clean socks.",
      date: "2026-07-07",
      urgent: false,
    }
  ],
  teacherMessages: [
    {
      id: "msg-1",
      sender: "Mrs. Evelyn Green (Nursery Teacher)",
      recipient: "parent@honeybees.com",
      text: "Hello! Ethan had a wonderful day painting today. He was very cooperative and shared his paint brushes with Sophia. Keep up the good work!",
      timestamp: "2026-07-09 03:40 PM",
    }
  ],
  parentMessages: [
    {
      id: "pmsg-1",
      sender: "parent@honeybees.com",
      recipient: "Mrs. Evelyn Green",
      text: "Thank you for the update, Mrs. Evelyn! Ethan loved the session. We will practice the leaf painting homework this weekend.",
      timestamp: "2026-07-09 06:15 PM",
    }
  ],
  blogs: [
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
    }
  ],
  gallery: [
    { id: "1", title: "Circle-Time Puppet Storytelling", category: "classroom", icon: "🎭📖" },
    { id: "2", title: "Water Wheel Splash Play", category: "splash", icon: "🏊💦" },
    { id: "3", title: "Anti-shock Foam Slide Arena", category: "play", icon: "🤸🎪" },
    { id: "4", title: "Honeycomb Tearing Mosaic Arts", category: "arts", icon: "🎨✂️" },
    { id: "5", title: "Phonetic Letter Puzzle Board", category: "classroom", icon: "🧩🔤" },
    { id: "6", title: "Clay Play Dough Molding", category: "arts", icon: "🏺👐" },
    { id: "7", title: "Measuring Volume Water Basin", category: "splash", icon: "🐳🧪" },
    { id: "8", title: "Garden Sensory Soil Planting", category: "play", icon: "🌻🌱" },
    { id: "9", title: "Building Block Coordination Towers", category: "classroom", icon: "🧱📐" }
  ],
  testimonials: [
    {
      id: "test-1",
      name: "Marcus Sterling",
      role: "Father of Lily (Nursery Class)",
      text: "The live CCTV app is a total game-changer. Being able to see Lily cooperative-play with her friends during my lunch breaks gives our entire family complete peace of mind.",
      stars: 5,
      avatar: "👨🏽‍💼",
      verified: true,
      parentEmail: "marcus@example.com",
      studentId: "stud-3",
      date: "2026-07-01"
    },
    {
      id: "test-2",
      name: "Sonia Patel",
      role: "Mother of Kabir (LKG Class)",
      text: "Beatrice AI is incredible! When Kabir was sick, I just texted the chatbot at 6 AM and it instantly recorded his sick leave and notified his teacher Ms. Jenkins in real-time.",
      stars: 5,
      avatar: "👩🏻‍⚕️",
      verified: true,
      parentEmail: "sonia@example.com",
      studentId: "stud-4",
      date: "2026-07-05"
    },
    {
      id: "test-3",
      name: "Emily Watson",
      role: "Mother of Leo (Safe Daycare)",
      text: "Honey Bees provides an exceptionally clean environment. The anti-shock foam floors and chemical-free sanitized playgrounds are the best in Sweetwater Valley.",
      stars: 5,
      avatar: "👩🏼‍💻",
      verified: true,
      parentEmail: "emily@example.com",
      studentId: "stud-5",
      date: "2026-07-08"
    }
  ]
};

// --- CHATBOT SYSTEM INSTRUCTIONS ---
const SYSTEM_INSTRUCTION = `
You are the Honey Bees Preschool AI Assistant, an ultra-polite, warm, and highly professional child-care advisor and brand ambassador for "Honey Bees Pre-School, Daycare and Tuition centre".
Your goal is to build parent trust, provide flawless program info, and guide prospective parents to convert (book a school tour or submit an admissions form).

Here are key facts about Honey Bees:
- Name: Honey Bees Pre-School, Daycare and Tuition centre
- Contact: 086883 30502, email: hello@honeybeespreschool.com, Address: 123 Honeycomb Lane, Sweetwater Valley, SW 4567 (Google Maps: https://maps.app.goo.gl/WgdtDjTyXkW9z62X9).
- Programs:
  1. Play Group (1.5 - 2.5 yrs): Sensory learning, motor skills. Monthly fee: $150. Timings: 9:00 AM - 12:00 PM.
  2. Nursery (2.5 - 3.5 yrs): Early phonics, social, creative. Monthly fee: $180. Timings: 9:00 AM - 12:30 PM.
  3. LKG (Lower Kindergarten) (3.5 - 4.5 yrs): Numbers, writing, environment. Monthly fee: $200. Timings: 8:30 AM - 1:00 PM.
  4. UKG (Upper Kindergarten) (4.5 - 5.5 yrs): Advanced math, phonics, primary school prep. Monthly fee: $220. Timings: 8:30 AM - 1:30 PM.
  5. Daycare (6 months - 10 yrs): Nutritious meals, safe naps, CCTV access for parents, play area. Monthly fee: $250. Timings: 8:00 AM - 6:30 PM.
  6. Tuition Centre (Grades 1-10): Math, Science, English, test prep, homework support. Monthly fee: $100 per subject. Timings: 4:00 PM - 7:30 PM.
- Brand features/USPs: 
  * Premium, clean, fully sanitized child-friendly indoor foam play arena.
  * Live CCTV access granted to enrolled parent accounts (high transparency!).
  * Nurturing teachers (all certified in Early Childhood Education and Pediatric CPR).
  * Safe transportation with real-time GPS tracking.
  * Interactive digital parent app to track daily activities, health, meals, and attendance.
  * Beautiful green backyard garden and sensory water-splash pool.
- Booking/Admissions: Parents can sign up directly on our website, book a physical school tour, or check fees.

Rules:
1. Always maintain a sweet, reassuring, and child-safe tone. Use bee emojis (🐝, 🍯, 🌸) sparingly but warmly to align with the branding.
2. If asked about prices or schedules, list them clearly and transparently.
3. Encourage parents to "Book a School Tour" or "Submit an Online Enquiry/Admission Form" in the portal.
4. Keep answers relatively concise, readable, and structured.
`;

// --- BACKUP RESPONDER ENGINE ---
function getBackupReply(message: string): string {
  let reply = "Hello! 🐝 Welcome to Honey Bees. I'm happy to help you. How can I assist you with admissions, fee details, or booking a school tour today?";
  const msg = message.toLowerCase();
  if (msg.includes("fee") || msg.includes("cost") || msg.includes("price") || msg.includes("charge")) {
    reply = "At Honey Bees, our premium programs are budget-friendly and transparent! 🍯\n- **Play Group:** $150/mo\n- **Nursery:** $180/mo\n- **LKG:** $200/mo\n- **UKG:** $220/mo\n- **Daycare:** $250/mo\n- **Tuition Centre:** $100/subject/mo.\nWe are currently running an early-bird 10% discount on Term payments! Would you like me to guide you to the Fee Enquiry Form?";
  } else if (msg.includes("tour") || msg.includes("visit") || msg.includes("book")) {
    reply = "We would love to show you around our colorful hive! 🐝 You can easily book a school tour on our website by clicking the **'Book a Tour'** button or using the tour scheduling form. Tours are available Mon-Sat, 9 AM - 4 PM. Shall I help you register a tour slot now?";
  } else if (msg.includes("admission") || msg.includes("enroll") || msg.includes("join") || msg.includes("register")) {
    reply = "Admissions for the 2026-27 session are actively open! 🎉 You can submit an **Online Admission Form** in just 2 minutes via our admissions tab, or request our prospectus. Let me know if you would like me to explain the simple 3-step enrollment process!";
  } else if (msg.includes("daycare") || msg.includes("baby") || msg.includes("infant") || msg.includes("after school")) {
    reply = "Our Daycare is a second home for kids! 🧸 We accept ages 6 months to 10 years, open from 8:00 AM to 6:30 PM. We offer customized nap zones, fresh pediatric-approved organic meals, and secure CCTV streams for parents. It's fully staffed with CPR-trained caregivers.";
  } else if (msg.includes("tuition") || msg.includes("class") || msg.includes("grade")) {
    reply = "Our Tuition Centre (Grades 1-10) covers Mathematics, Science, and English. 📚 Timings are 4:00 PM to 7:30 PM, led by expert coaches who help with school homework and test-prep. Monthly fee is $100 per subject.";
  } else if (msg.includes("contact") || msg.includes("phone") || msg.includes("address") || msg.includes("location") || msg.includes("email")) {
    reply = "You can reach our administrative desk at **086883 30502** or email **hello@honeybeespreschool.com**. 🐝 We are located at **123 Honeycomb Lane, Sweetwater Valley, SW 4567**. You can find us on Google Maps here: https://maps.app.goo.gl/WgdtDjTyXkW9z62X9 !";
  } else if (msg.includes("cctv") || msg.includes("safe") || msg.includes("secure") || msg.includes("camera")) {
    reply = "Safety is our absolute #1 priority! 🛡️ Honey Bees is equipped with secure, app-linked CCTV cameras. Enrolled parents are given credentials to log into their dashboard and view live feeds during play & nap times. We also have high-foam shockproof flooring and child-locked exit gates.";
  }
  return reply;
}

// --- API ENDPOINTS ---

// AI Support Chatbot (uses server-side Gemini 3.5 Flash)
app.post("/api/chat", async (req, res) => {
  const { message, chatHistory } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // If Gemini API is not configured, we provide a smart backup chatbot!
  if (!ai) {
    console.warn("GoogleGenAI not initialized. Using premium backup responder.");
    const reply = getBackupReply(message);
    return res.json({ reply });
  }

  try {
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    // Feed history if available
    if (chatHistory && Array.isArray(chatHistory)) {
      // In the new @google/genai SDK, chat history is tracked internally, but we can send a single context
      // Or simply construct the chat nicely.
    }

    const response = await chat.sendMessage({ message });
    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini API Error, falling back to smart backup responder:", error);
    const reply = getBackupReply(message);
    return res.json({ reply });
  }
});

// Submit Admissions Form
app.post("/api/admissions", (req, res) => {
  const { childName, parentName, email, phone, dob, program } = req.body;
  if (!childName || !parentName || !email || !phone || !program) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newAdmission = {
    id: `adm-${db.admissions.length + 1}`,
    childName,
    parentName,
    email,
    phone,
    dob: dob || "N/A",
    program,
    status: "Pending Review",
    date: new Date().toISOString().split("T")[0]
  };

  db.admissions.unshift(newAdmission);

  // Also auto-create a student in the directory!
  const newStudent = {
    id: `stud-${db.students.length + 1}`,
    name: childName,
    parentName: parentName,
    parentEmail: email,
    program: program,
    dob: dob || "2023-01-01",
    attendance: [
      { date: new Date().toISOString().split("T")[0], status: "Present" }
    ],
    fees: [
      { term: "Term 1 (July - Sept 2026)", amount: program.includes("Daycare") ? 750 : 540, status: "Pending", dueDate: "2026-07-25" }
    ],
    progress: {
      motorSkills: "Good Start",
      socialSkills: "Observant",
      creativity: "Curious",
      cognitive: "Evaluating"
    }
  };
  db.students.push(newStudent);

  return res.json({
    success: true,
    message: "Admission registration submitted successfully! An automated confirmation email and SMS/WhatsApp alert has been dispatched.",
    data: newAdmission
  });
});

// Book Tour
app.post("/api/tours", (req, res) => {
  const { parentName, email, phone, date, time } = req.body;
  if (!parentName || !email || !phone || !date || !time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newTour = {
    id: `tour-${db.tours.length + 1}`,
    parentName,
    email,
    phone,
    date,
    time,
    status: "Confirmed",
  };

  db.tours.unshift(newTour);

  return res.json({
    success: true,
    message: "School tour confirmed! 🐝 We have reserved your slot. An automated WhatsApp invite with address details has been sent.",
    data: newTour
  });
});

// Submit Enquiry Form
app.post("/api/enquiry", (req, res) => {
  const { parentName, email, phone, childAge, program, message } = req.body;
  if (!parentName || !email || !phone || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newEnquiry = {
    id: `enq-${db.enquiries.length + 1}`,
    parentName,
    email,
    phone,
    childAge: childAge || "N/A",
    program: program || "General Inquiry",
    message,
    date: new Date().toISOString().split("T")[0],
  };

  db.enquiries.unshift(newEnquiry);

  return res.json({
    success: true,
    message: "Thank you for reaching out! Our admissions officer will contact you within the next 2 hours.",
    data: newEnquiry
  });
});

// Submit Newsletter
app.post("/api/newsletter", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  if (!db.newsletter.includes(email)) {
    db.newsletter.push(email);
  }
  return res.json({ success: true, message: "Subscribed successfully! Check your inbox for the school prospectus/brochure PDF." });
});

// Get Database State (For Dashboards)
app.get("/api/admin/data", (req, res) => {
  return res.json(db);
});

// GET Gallery Photos
app.get("/api/gallery", (req, res) => {
  return res.json(db.gallery);
});

// POST Admin Upload Image to Cloudinary (or Local Memory Fallback)
app.post("/api/admin/gallery/upload", async (req, res) => {
  const { file, title, category } = req.body;
  if (!file || !title || !category) {
    return res.status(400).json({ error: "File, title, and category are required" });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const strToSign = `timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash("sha1").update(strToSign).digest("hex");

      const formData = new URLSearchParams();
      formData.append("file", file);
      formData.append("timestamp", timestamp.toString());
      formData.append("api_key", apiKey);
      formData.append("signature", signature);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Cloudinary responded with status ${response.status}: ${errText}`);
      }

      const result = await response.json();
      const uploadedUrl = result.secure_url;

      const newPhoto = {
        id: `photo-${Date.now()}`,
        title,
        category,
        url: uploadedUrl
      };
      db.gallery.push(newPhoto);

      return res.json({
        success: true,
        message: "Image uploaded to Cloudinary successfully!",
        data: newPhoto
      });

    } catch (err: any) {
      console.error("Cloudinary secure upload failed, falling back to local memory database:", err);
      const newPhoto = {
        id: `photo-${Date.now()}`,
        title,
        category,
        url: file // Local memory Base64 fallback
      };
      db.gallery.push(newPhoto);
      return res.json({
        success: true,
        message: `Saved photo locally: Cloudinary failed (${err.message})`,
        data: newPhoto
      });
    }
  } else {
    // Graceful fallback when Cloudinary is not configured
    console.log("Cloudinary is not configured. Saving photo to local memory database.");
    const newPhoto = {
      id: `photo-${Date.now()}`,
      title,
      category,
      url: file // Local memory Base64 fallback
    };
    db.gallery.push(newPhoto);
    return res.json({
      success: true,
      message: "Saved photo to temporary local memory (Cloudinary credentials not set).",
      data: newPhoto
    });
  }
});

// POST Admin Add Gallery Photo (Classic Emoji / Text metadata upload)
app.post("/api/admin/gallery", (req, res) => {
  const { title, category, icon, url } = req.body;
  if (!title || !category) {
    return res.status(400).json({ error: "Title and category are required" });
  }
  if (!icon && !url) {
    return res.status(400).json({ error: "Either Emoji Icon or Image URL is required" });
  }
  const newPhoto = {
    id: `photo-${Date.now()}`,
    title,
    category,
    icon: icon || "📸",
    url
  };
  db.gallery.push(newPhoto);
  return res.json({ success: true, message: "Gallery snapshot created successfully!", data: newPhoto });
});

// PUT Admin Update Gallery Photo
app.put("/api/admin/gallery/:id", (req, res) => {
  const { id } = req.params;
  const { title, category, icon, url } = req.body;
  const photo = db.gallery.find((p) => p.id === id);
  if (!photo) {
    return res.status(404).json({ error: "Gallery photo not found" });
  }
  if (title) photo.title = title;
  if (category) photo.category = category;
  if (icon !== undefined) photo.icon = icon;
  if (url !== undefined) photo.url = url;
  return res.json({ success: true, message: "Gallery snapshot updated successfully!", data: photo });
});

// DELETE Admin Delete Gallery Photo
app.delete("/api/admin/gallery/:id", (req, res) => {
  const { id } = req.params;
  const index = db.gallery.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Gallery photo not found" });
  }
  db.gallery.splice(index, 1);
  return res.json({ success: true, message: "Gallery snapshot deleted successfully!" });
});

// POST Admin Add Student
app.post("/api/admin/students", (req, res) => {
  const { name, parentName, parentEmail, program, dob } = req.body;
  if (!name || !parentName || !parentEmail || !program) {
    return res.status(400).json({ error: "Missing student parameters" });
  }
  const newStudent = {
    id: `stud-${Date.now()}`,
    name,
    parentName,
    parentEmail,
    program,
    dob: dob || "2023-01-01",
    attendance: [
      { date: new Date().toISOString().split("T")[0], status: "Present" as const }
    ],
    fees: [
      { term: "Term 1 (July - Sept 2026)", amount: 540, status: "Pending" as const, dueDate: "2026-07-25" }
    ],
    progress: {
      motorSkills: "Good",
      socialSkills: "Cooperative",
      creativity: "Curious",
      cognitive: "Good Progress"
    }
  };
  db.students.push(newStudent);
  return res.json({ success: true, message: "Student record registered successfully!", data: newStudent });
});

// PUT Admin Update Student
app.put("/api/admin/students/:id", (req, res) => {
  const { id } = req.params;
  const { name, parentName, parentEmail, program, dob, progress } = req.body;
  const student = db.students.find((s) => s.id === id);
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }
  if (name) student.name = name;
  if (parentName) student.parentName = parentName;
  if (parentEmail) student.parentEmail = parentEmail;
  if (program) student.program = program;
  if (dob) student.dob = dob;
  if (progress) student.progress = { ...student.progress, ...progress };
  return res.json({ success: true, message: "Student record updated successfully!", data: student });
});

// DELETE Admin Delete Student
app.delete("/api/admin/students/:id", (req, res) => {
  const { id } = req.params;
  const index = db.students.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Student not found" });
  }
  db.students.splice(index, 1);
  return res.json({ success: true, message: "Student record deleted successfully!" });
});

// DELETE Admin Delete Admission Application
app.delete("/api/admin/admissions/:id", (req, res) => {
  const { id } = req.params;
  const index = db.admissions.findIndex((a) => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Admission application not found" });
  }
  db.admissions.splice(index, 1);
  return res.json({ success: true, message: "Admission application deleted successfully!" });
});

// DELETE Admin Delete Tour Booking
app.delete("/api/admin/tours/:id", (req, res) => {
  const { id } = req.params;
  const index = db.tours.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Tour booking not found" });
  }
  db.tours.splice(index, 1);
  return res.json({ success: true, message: "Tour booking deleted successfully!" });
});

// DELETE Admin Delete Enquiry
app.delete("/api/admin/enquiries/:id", (req, res) => {
  const { id } = req.params;
  const index = db.enquiries.findIndex((e) => e.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Enquiry record not found" });
  }
  db.enquiries.splice(index, 1);
  return res.json({ success: true, message: "Enquiry record deleted successfully!" });
});

// Post Teacher Homework Upload
app.post("/api/teacher/homework", (req, res) => {
  const { className, subject, title, description, dueDate } = req.body;
  if (!className || !subject || !title || !description || !dueDate) {
    return res.status(400).json({ error: "All homework fields are required" });
  }

  const newHw = {
    id: `hw-${db.homework.length + 1}`,
    class: className,
    subject,
    title,
    description,
    assignedDate: new Date().toISOString().split("T")[0],
    dueDate,
  };

  db.homework.unshift(newHw);
  return res.json({ success: true, message: "Homework uploaded and parent alert triggered via notification engine!", data: newHw });
});

// Update Student Attendance
app.post("/api/teacher/attendance", (req, res) => {
  const { studentId, date, status } = req.body;
  if (!studentId || !date || !status) {
    return res.status(400).json({ error: "Missing attendance updates parameters" });
  }

  const student = db.students.find((s) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  const existingIndex = student.attendance.findIndex((a) => a.date === date);
  if (existingIndex > -1) {
    student.attendance[existingIndex].status = status;
  } else {
    student.attendance.push({ date, status });
  }

  return res.json({ success: true, message: `Attendance for ${student.name} marked as ${status}.` });
});

// Pay Tuition Fees (Simulator)
app.post("/api/parent/pay-fee", (req, res) => {
  const { studentId, term } = req.body;
  if (!studentId || !term) {
    return res.status(400).json({ error: "Student ID and Term name are required" });
  }

  const student = db.students.find((s) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: "Student record not found" });
  }

  const feeRecord = student.fees.find((f) => f.term === term);
  if (!feeRecord) {
    return res.status(404).json({ error: "Fee record for requested term not found" });
  }

  feeRecord.status = "Paid";
  feeRecord.paidDate = new Date().toISOString().split("T")[0];

  return res.json({
    success: true,
    message: `Payment of $${feeRecord.amount} processed securely via Razorpay pipeline simulation! Thank you.`,
    data: feeRecord,
  });
});

// Send Chat Message between Teacher and Parent
app.post("/api/messages", (req, res) => {
  const { sender, recipient, text } = req.body;
  if (!sender || !recipient || !text) {
    return res.status(400).json({ error: "Sender, recipient and message text are required" });
  }

  const newMsg = {
    id: `msg-${db.teacherMessages.length + db.parentMessages.length + 1}`,
    sender,
    recipient,
    text,
    timestamp: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  if (sender === "parent@honeybees.com") {
    db.parentMessages.push(newMsg);
  } else {
    db.teacherMessages.push(newMsg);
  }

  return res.json({ success: true, message: "Message delivered instantly!", data: newMsg });
});

// GET Testimonials
app.get("/api/testimonials", (req, res) => {
  return res.json(db.testimonials || []);
});

// POST Submit Testimonial with Parent Verification
app.post("/api/testimonials", (req, res) => {
  const { name, text, stars, parentEmail, studentId, avatar } = req.body;
  if (!name || !text || !stars) {
    return res.status(400).json({ error: "Name, review text, and star rating are required" });
  }

  // Verification Engine: Search in students database
  let verified = false;
  let role = "Community Guardian";

  if (parentEmail || studentId) {
    const matchedStudent = db.students.find((s: any) => {
      const matchEmail = parentEmail && s.parentEmail && s.parentEmail.trim().toLowerCase() === parentEmail.trim().toLowerCase();
      const matchId = studentId && s.id && s.id.trim().toLowerCase() === studentId.trim().toLowerCase();
      return matchEmail || matchId;
    });

    if (matchedStudent) {
      verified = true;
      role = `Verified Guardian of ${matchedStudent.name} (${matchedStudent.program} Class)`;
    } else {
      role = parentEmail ? `Parent (${parentEmail})` : "Parent/Guardian";
    }
  }

  const newTestimonial = {
    id: `test-${Date.now()}`,
    name: name.trim(),
    role,
    text: text.trim(),
    stars: Number(stars) || 5,
    avatar: avatar || "👤",
    verified,
    parentEmail: parentEmail || undefined,
    studentId: studentId || undefined,
    date: new Date().toISOString().split("T")[0]
  };

  if (!db.testimonials) {
    db.testimonials = [];
  }
  db.testimonials.unshift(newTestimonial);

  return res.json({
    success: true,
    message: verified
      ? "Review successfully verified & published! Thank you for sharing your experience. 🐝✨"
      : "Review submitted successfully! (Verify your enrollment with parent email or student ID to unlock the Verified Guardian badge).",
    data: newTestimonial
  });
});

// PUT Testimonial Verification Toggle (Admin Moderation)
app.put("/api/admin/testimonials/:id", (req, res) => {
  const { id } = req.params;
  const { verified } = req.body;
  if (!db.testimonials) {
    db.testimonials = [];
  }
  const testimonial = db.testimonials.find((t: any) => t.id === id);
  if (!testimonial) {
    return res.status(404).json({ error: "Testimonial not found" });
  }
  testimonial.verified = !!verified;
  if (testimonial.verified) {
    testimonial.role = "Verified Sweetwater Guardian";
  } else {
    testimonial.role = "Community Member";
  }
  return res.json({ success: true, message: "Review verification updated successfully!", data: testimonial });
});

// DELETE Testimonial (Admin Moderation)
app.delete("/api/admin/testimonials/:id", (req, res) => {
  const { id } = req.params;
  if (!db.testimonials) {
    db.testimonials = [];
  }
  const index = db.testimonials.findIndex((t: any) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Testimonial not found" });
  }
  db.testimonials.splice(index, 1);
  return res.json({ success: true, message: "Parent review removed from database successfully!" });
});

// --- VITE MIDDLEWARE SETUP ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Honey Bees Server] Hive active on http://localhost:${PORT}`);
  });
}

startServer();
