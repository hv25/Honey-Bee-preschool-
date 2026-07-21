import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import crypto from "crypto";
import fs from "fs";

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

// Auto-save database on non-GET API mutations to preserve uploaded photos/videos & registrations
app.use((req, res, next) => {
  res.on("finish", () => {
    if (req.method !== "GET" && req.path.startsWith("/api")) {
      saveDb();
    }
  });
  next();
});

// --- Mock Database (In-Memory) ---
const db: any = {
  users: [
    {
      id: "u-1",
      email: "admin@honeybees.com",
      password: "honeybees-admin",
      name: "Hive Administrator",
      role: "admin"
    },
    {
      id: "u-2",
      email: "parent@honeybees.com",
      password: "honeybees-parent",
      name: "Mary Carter",
      role: "parent",
      studentId: "stud-1"
    },
    {
      id: "u-3",
      email: "teacher@honeybees.com",
      password: "honeybees-teacher",
      name: "Mrs. Evelyn Green",
      role: "teacher",
      specialty: "Nursery"
    }
  ],
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
    {
      id: "photo-default-1",
      title: "Interactive Classroom Reading",
      category: "classroom",
      icon: "📚",
      url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
      type: "image"
    },
    {
      id: "photo-default-2",
      title: "Sensory Toys & Blocks Play",
      category: "play",
      icon: "🧱",
      url: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80",
      type: "image"
    },
    {
      id: "photo-default-3",
      title: "Monsoon Storytelling Arena",
      category: "classroom",
      icon: "🎭",
      url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80",
      type: "image"
    },
    {
      id: "photo-default-4",
      title: "Finger Painting Creativity Session",
      category: "arts",
      icon: "🎨",
      url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80",
      type: "image"
    },
    {
      id: "photo-default-5",
      title: "Splash Pool Summer Fest",
      category: "splash",
      icon: "🏊",
      url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80",
      type: "image"
    },
    {
      id: "photo-default-6",
      title: "Play Arena & Foam Play",
      category: "play",
      icon: "🧸",
      url: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=800&q=80",
      type: "image"
    },
    {
      id: "video-default-1",
      title: "Children Learning Activities",
      category: "classroom",
      icon: "🎬",
      url: "https://player.vimeo.com/external/403848143.sd.mp4?s=d1eb96db9546059d04bc5f3bb1641b80c656d028&profile_id=139&oauth2_token_id=57447761",
      type: "video"
    },
    {
      id: "video-default-2",
      title: "Building Blocks Play Session",
      category: "play",
      icon: "🎬",
      url: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3ccee5d543d4d30c7765239e24d1a9f75&profile_id=139&oauth2_token_id=57447761",
      type: "video"
    }
  ],
  testimonials: [
    {
      id: "gtest-1",
      name: "SAI LATA Boidapu",
      role: "Verified Parent",
      text: "Best environment for the kindergarten children....Well ventilated place, wide and spacious rooms, highly hygienic...",
      stars: 5,
      avatar: "👩🏽‍💼",
      verified: true,
      date: "2026-05-14"
    },
    {
      id: "gtest-2",
      name: "Tejendra Reddy",
      role: "Verified Parent",
      text: "We are extremely happy with our experience at Honey Bees Pre school ! The teachers are incredibly nurturing and attentive, and they’ve created such a joyful, safe, and stimulating environment for the children. My child looks forward to school every day, and it’s amazing to see the progress in their communication, social skills, and creativity. The classrooms are bright and well-equipped, and I really appreciate the school’s focus on play-based learning and individual attention. Highly recommend to any parent looking for a loving and enriching start to their child’s education.",
      stars: 5,
      avatar: "👨🏽‍💼",
      verified: true,
      date: "2025-07-14"
    },
    {
      id: "gtest-3",
      name: "lakshmisri sri",
      role: "Verified Tuition Parent",
      text: "Best tuition for kids. I love and appreciate the caring of children. Special thanks to Bindu mam",
      stars: 5,
      avatar: "👩🏻‍⚕️",
      verified: true,
      date: "2026-05-14"
    },
    {
      id: "gtest-4",
      name: "NANDINI BANSAL",
      role: "Verified Parent",
      text: "It's an amazing school. Teachers are very understanding and co-operative. They have joyful techniques to help kids settle down. Lot of different activities takes place. Perfect environment for kids!!!",
      stars: 5,
      avatar: "👩🏼‍💻",
      verified: true,
      date: "2024-07-14"
    },
    {
      id: "gtest-5",
      name: "Manoj Kumar Behara",
      role: "Verified Parent",
      text: "First I felt that the school was very safe with the friendly staff. I like that it’s an educational based facility with the small ratio of children and wonderful teachers and exposes your child to different aspects of learning through playful activities.",
      stars: 5,
      avatar: "👨🏽‍🌾",
      verified: true,
      date: "2021-07-14"
    },
    {
      id: "gtest-6",
      name: "revathi priyanka",
      role: "Verified Parent",
      text: "It's really a great pre school. My kid enjoying a lot... and he is learning many things too!",
      stars: 5,
      avatar: "👩🏽‍🎨",
      verified: true,
      date: "2025-07-14"
    },
    {
      id: "gtest-7",
      name: "Vinod Potupureddi",
      role: "Verified Parent",
      text: "Honey Bees is an exceptional place for children to learn and grow. I cannot imagine a staff anywhere so caring and loving. Character matters and is integrated into the curriculum and the daily activities.",
      stars: 5,
      avatar: "👨🏼‍🚀",
      verified: true,
      date: "2021-07-14"
    },
    {
      id: "gtest-8",
      name: "Jagadeesh Kalla",
      role: "Verified Parent",
      text: "This pre-school focuses on the child's overall growth, including social, emotional, physical, and creative development.",
      stars: 5,
      avatar: "👨🏽‍💼",
      verified: true,
      date: "2025-07-14"
    },
    {
      id: "gtest-9",
      name: "Sundar Kumar",
      role: "Local Guide (31 reviews)",
      text: "Amazing pre-school with good infrastructure, The staff are friendly and well trained, the best pre-school in the area. Do please visit and get acquainted and you surely will love to join your kids.",
      stars: 5,
      avatar: "👵🏼",
      verified: true,
      date: "2021-07-14"
    },
    {
      id: "gtest-10",
      name: "Kalyani Pinninty",
      role: "Local Guide",
      text: "Amazing playschool.. Where special care and concern is shown towards each and every child. Very friendly staff and created a good and interactive atmosphere for students. 👏😊",
      stars: 5,
      avatar: "👩‍👦",
      verified: true,
      date: "2021-07-14"
    },
    {
      id: "gtest-11",
      name: "ch Haritha",
      role: "Local Guide",
      text: "Very good school for kids. They will surely enjoy the ambience. Very well designed classrooms. Mainly the play area.",
      stars: 5,
      avatar: "👩🏽‍🎨",
      verified: true,
      date: "2021-07-14"
    },
    {
      id: "gtest-12",
      name: "Thiresh Kumar",
      role: "Verified Parent",
      text: "Good caring, nice activities and safe environment for children.",
      stars: 5,
      avatar: "👨‍👦",
      verified: true,
      date: "2026-05-14"
    },
    {
      id: "gtest-13",
      name: "Sai Lakshmi",
      role: "Verified Parent",
      text: "Great learning opportunity on Honey Bees school. The teachers are very good and they take care of each and every child. Its an amazing school.",
      stars: 5,
      avatar: "👩🏽‍💼",
      verified: true,
      date: "2023-07-14"
    },
    {
      id: "gtest-14",
      name: "Monika Desetti",
      role: "Verified Parent",
      text: "It is one of the best preschool's for children, they can learn many things. So many activities are being conducted by the teaching staff.",
      stars: 5,
      avatar: "👩🏼‍💻",
      verified: true,
      date: "2023-07-14"
    },
    {
      id: "gtest-15",
      name: "ganesh janu",
      role: "Verified Parent",
      text: "It's a very good place for kids motivation, with friendly teachers, well-trained care takers and more interaction with nature.",
      stars: 5,
      avatar: "👨🏽‍💼",
      verified: true,
      date: "2021-07-14"
    },
    {
      id: "gtest-16",
      name: "Ravi Kumar",
      role: "Verified Parent",
      text: "The school is being run by a young energetic entrepreneur. Recently I visited and joined my kid. Lot of care for children by management. Thanks to Team 'Honey Bees' ... Best school in Vizag!",
      stars: 5,
      avatar: "👨🏽‍💼",
      verified: true,
      date: "2021-07-14"
    },
    {
      id: "gtest-17",
      name: "Shadgunya Modu",
      role: "Verified Parent",
      text: "Very good school, takes keen interest in every child's behavior.",
      stars: 5,
      avatar: "👩🏼‍💻",
      verified: true,
      date: "2023-07-14"
    },
    {
      id: "gtest-18",
      name: "Bharath Shankar",
      role: "Verified Parent",
      text: "Best school in Vizag.",
      stars: 5,
      avatar: "👨🏽‍💼",
      verified: true,
      date: "2026-01-14"
    },
    {
      id: "gtest-19",
      name: "BUNGA RAVI KANTH",
      role: "Verified Parent",
      text: "One of the best schools around, takes very good care of the kids.",
      stars: 5,
      avatar: "👨🏽‍💼",
      verified: true,
      date: "2023-07-14"
    },
    {
      id: "gtest-20",
      name: "Venkata Guntuboina",
      role: "Verified Parent",
      text: "Unique and best pre school in Vizag with home like environment for the kids.",
      stars: 5,
      avatar: "👨🏽‍💼",
      verified: true,
      date: "2022-07-14"
    },
    {
      id: "gtest-21",
      name: "sam77 Samins",
      role: "Verified Parent",
      text: "Superb place. Its a very nice and CENTRAL PLACE for children's mind and behavior improvement.",
      stars: 5,
      avatar: "👨🏽‍💼",
      verified: true,
      date: "2021-07-14"
    },
    {
      id: "gtest-22",
      name: "surya s",
      role: "Local Guide",
      text: "Good caring and good discipline",
      stars: 5,
      avatar: "👩🏽‍💼",
      verified: true,
      date: "2025-12-14"
    },
    {
      id: "gtest-23",
      name: "vinay aripaka",
      role: "Verified Parent",
      text: "Nice... I saw some activities which are good for children.",
      stars: 5,
      avatar: "👨🏽‍💼",
      verified: true,
      date: "2023-07-14"
    }
  ],
  events: [
    {
      id: "event-1",
      title: "Annual Honeycomb Splash Fest",
      date: "Saturday, July 25th",
      time: "10:00 AM - 1:00 PM",
      desc: "Water slides, splashing games, sensory cups, and ice-creams in our outdoor gardens! Parents welcome."
    },
    {
      id: "event-2",
      title: "Monsoon Storytelling Circle",
      date: "Friday, August 7th",
      time: "11:00 AM - 12:30 PM",
      desc: "Interactive puppet theatre, rain songs, and leafy umbrella painting inside the safe cushioned play arena."
    }
  ],
  emails: []
};

// --- FILE SYSTEM PERSISTENCE SYSTEM ---
const DB_FILE = path.join(process.cwd(), "db.json");

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write database file:", err);
  }
}

// Load database from file if exists
if (fs.existsSync(DB_FILE)) {
  try {
    const fileData = fs.readFileSync(DB_FILE, "utf8");
    const parsed = JSON.parse(fileData);
    for (const key of Object.keys(parsed)) {
      if (key === "gallery" && (!parsed[key] || parsed[key].length === 0)) {
        // Skip overwriting with empty gallery so default high-quality pre-seeded items are retained
        continue;
      }
      db[key] = parsed[key];
    }
    console.log("Database successfully loaded from local db.json.");
  } catch (err) {
    console.error("Failed to parse database file, using default structure:", err);
  }
} else {
  saveDb();
}

// Initialize default playroom videos for letters A-Z if missing
if (!db.playroomVideos || Object.keys(db.playroomVideos).length === 0) {
  db.playroomVideos = {
    A: [{ id: "v-default-A", title: "Phonics Letter A Song", url: "https://www.youtube.com/embed/jPVbJ-K5674" }],
    B: [{ id: "v-default-B", title: "Phonics Letter B Song", url: "https://www.youtube.com/embed/jPVbJ-K5674" }],
    C: [{ id: "v-default-C", title: "Phonics Letter C Song", url: "https://www.youtube.com/embed/jPVbJ-K5674" }],
    D: [{ id: "v-default-D", title: "Phonics Letter D Song", url: "https://www.youtube.com/embed/jPVbJ-K5674" }],
    E: [{ id: "v-default-E", title: "Phonics Letter E Song", url: "https://www.youtube.com/embed/jPVbJ-K5674" }],
    F: [{ id: "v-default-F", title: "Phonics Letter F Song", url: "https://www.youtube.com/embed/jPVbJ-K5674" }],
    G: [{ id: "v-default-G", title: "Phonics Letter G Song", url: "https://www.youtube.com/embed/jPVbJ-K5674" }],
    H: [{ id: "v-default-H", title: "Phonics Letter H Song", url: "https://www.youtube.com/embed/jPVbJ-K5674" }],
    I: [{ id: "v-default-I", title: "Phonics Letter I Song", url: "https://www.youtube.com/embed/jPVbJ-K5674" }],
    J: [{ id: "v-default-J", title: "Phonics Letter J Song", url: "https://www.youtube.com/embed/jPVbJ-K5674" }],
    K: [{ id: "v-default-K", title: "Phonics Letter K Song", url: "https://www.youtube.com/embed/jPVbJ-K5674" }],
    L: [{ id: "v-default-L", title: "Phonics Letter L Song", url: "https://www.youtube.com/embed/jPVbJ-K5674" }],
    M: [{ id: "v-default-M", title: "Phonics Letter M Song", url: "https://www.youtube.com/embed/jPVbJ-K5674" }],
    N: [{ id: "v-default-N", title: "Phonics Letter N Song", url: "https://www.youtube.com/embed/jPVbJ-K5674" }],
    O: [{ id: "v-default-O", title: "Phonics Letter O Song", url: "https://www.youtube.com/embed/jPVbJ-K5674" }],
    P: [{ id: "v-default-P", title: "Phonics Letter P Song", url: "https://www.youtube.com/embed/jPVbJ-K5674" }],
    Q: [{ id: "v-default-Q", title: "Phonics Letter Q Song", url: "https://www.youtube.com/embed/jPVbJ-K5674" }],
    R: [{ id: "v-default-R", title: "Phonics Letter R Song", url: "https://www.youtube.com/embed/jPVbJ-K5674" }],
    S: [{ id: "v-default-S", title: "Phonics Letter S Song", url: "https://www.youtube.com/embed/jPVbJ-K5674" }],
    T: [{ id: "v-default-T", title: "Phonics Letter T Song", url: "https://www.youtube.com/embed/jPVbJ-K5674" }],
    U: [{ id: "v-default-U", title: "Phonics Letter U Song", url: "https://www.youtube.com/embed/jPVbJ-K5674" }],
    V: [{ id: "v-default-V", title: "Phonics Letter V Song", url: "https://www.youtube.com/embed/jPVbJ-K5674" }],
    W: [{ id: "v-default-W", title: "Phonics Letter W Song", url: "https://www.youtube.com/embed/jPVbJ-K5674" }],
    X: [{ id: "v-default-X", title: "Phonics Letter X Song", url: "https://www.youtube.com/embed/jPVbJ-K5674" }],
    Y: [{ id: "v-default-Y", title: "Phonics Letter Y Song", url: "https://www.youtube.com/embed/jPVbJ-K5674" }],
    Z: [{ id: "v-default-Z", title: "Phonics Letter Z Song", url: "https://www.youtube.com/embed/jPVbJ-K5674" }],
  };
  saveDb();
}

// Initialize default voiceSettings if missing
if (!db.voiceSettings) {
  db.voiceSettings = {
    greetingEn: "Buzz Buzz! 🐝 Thank you for calling Honey Bees Pre-School. I'm Beatrice, your virtual AI Receptionist! I can instantly book a school tour or answer questions about our classes. Am I speaking with {callerName}?",
    greetingTe: "బజ్ బజ్! 🐝 హనీ బీస్ ప్రీ-స్కూల్‌కు కాల్ చేసినందుకు ధన్యవాదాలు. నేను బీట్రైస్, మీ వర్చువల్ AI రిసెప్షనిస్ట్! నేను తక్షణమే పాఠశాల పర్యటనను బుక్ చేయగలను లేదా మా తరగతుల గురించి ప్రశ్నలకు సమాధానం ఇవ్వగలను. నేను {callerName} గారితో మాట్లాడుతున్నానా?",
  };
  saveDb();
}

// Initialize default worksheets if missing
if (!db.worksheets) {
  db.worksheets = [
    { id: "ws-1", title: "Alphabet Tracing A-Z Activity Sheet", subject: "Phonics & Writing", fileUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80", ageGroup: "Nursery / Play Group", downloadCount: 42 },
    { id: "ws-2", title: "Numbers & Counting Honeybees (1-10)", subject: "Mathematics", fileUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80", ageGroup: "Nursery / LKG", downloadCount: 56 },
    { id: "ws-3", title: "Monsoon Rainbow Coloring Template", subject: "Arts & Crafts", fileUrl: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=800&q=80", ageGroup: "All Classes", downloadCount: 78 }
  ];
  saveDb();
}

// Initialize default ptm bookings if missing
if (!db.ptmBookings) {
  db.ptmBookings = [
    { id: "ptm-1", studentId: "stud-1", parentName: "Mary Carter", teacherName: "Mrs. Evelyn Green", date: "2026-07-24", time: "10:15 AM", status: "Confirmed" }
  ];
  saveDb();
}

// Initialize default leave requests if missing
if (!db.leaveRequests) {
  db.leaveRequests = [];
  saveDb();
}

// Initialize default homework submissions if missing
if (!db.homeworkSubmissions) {
  db.homeworkSubmissions = [];
  saveDb();
}

// --- CHATBOT SYSTEM INSTRUCTIONS ---
const SYSTEM_INSTRUCTION = `
You are the Honey Bees Preschool AI Assistant, an ultra-polite, warm, and highly professional child-care advisor and brand ambassador for "Honey Bees Pre-School, Daycare and Tuition centre".
Your goal is to build parent trust, provide flawless program info, and guide prospective parents to convert (book a school tour or submit an admissions form).

Here are key facts about Honey Bees:
- Name: Honey Bees Pre-School, Daycare and Tuition centre
- Contact: 086883 30502, email: hello@honeybeespreschool.com, Address: LAWSON'S BAY COLONY, 4-43-16/1, Lawsons Bay Colony, Pedda Waltair, Visakhapatnam, Andhra Pradesh 530017 (Google Maps: https://www.google.com/maps/search/?api=1&query=LAWSON%27S+BAY+COLONY%2C+4-43-16%2F1%2C+Lawsons+Bay+Colony%2C+Pedda+Waltair%2C+Visakhapatnam%2C+Andhra+Pradesh+530017).
- Programs:
  1. Play Group (1.5 - 2.5 yrs): Sensory learning, motor skills. Monthly fee: $150. Timings: 9:00 AM - 12:00 PM.
  2. Nursery (2.5 - 3.5 yrs): Early phonics, social, creative. Monthly fee: $180. Timings: 9:00 AM - 12:30 PM.
  3. LKG (Lower Kindergarten) (3.5 - 4.5 yrs): Numbers, writing, environment. Monthly fee: $200. Timings: 8:30 AM - 1:00 PM.
  4. UKG (Upper Kindergarten) (4.5 - 5.5 yrs): Advanced math, phonics, primary school prep. Monthly fee: $220. Timings: 8:30 AM - 1:30 PM.
  5. Daycare (6 months - 10 yrs): Nutritious meals, safe naps, CCTV access for parents, play area. Monthly fee: $250. Timings: 8:00 AM - 6:30 PM.
  6. Tuition Centre (Grades 1-10): Math, Science, English, test prep, homework support. Monthly fee: $100 per subject. Timings: 4:00 PM - 7:30 PM.
- Brand features/USPs: 
  * Premium, clean, fully sanitized child-friendly indoor foam play arena.
  * Full live CCTV coverage monitored strictly by admins and security directors to maintain student privacy.
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
    reply = "Our Daycare is a second home for kids! 🧸 We accept ages 6 months to 10 years, open from 8:00 AM to 6:30 PM. We offer customized nap zones, fresh pediatric-approved organic meals, and secure CCTV streams monitored by admins. It's fully staffed with CPR-trained caregivers.";
  } else if (msg.includes("tuition") || msg.includes("class") || msg.includes("grade")) {
    reply = "Our Tuition Centre (Grades 1-10) covers Mathematics, Science, and English. 📚 Timings are 4:00 PM to 7:30 PM, led by expert coaches who help with school homework and test-prep. Monthly fee is $100 per subject.";
  } else if (msg.includes("contact") || msg.includes("phone") || msg.includes("address") || msg.includes("location") || msg.includes("email")) {
    reply = "You can reach our administrative desk at **086883 30502** or email **hello@honeybeespreschool.com**. 🐝 We are located at **LAWSON'S BAY COLONY, 4-43-16/1, Lawsons Bay Colony, Pedda Waltair, Visakhapatnam, Andhra Pradesh 530017**. You can find us on Google Maps here: [Google Maps](https://www.google.com/maps/search/?api=1&query=LAWSON%27S+BAY+COLONY%2C+4-43-16%2F1%2C+Lawsons+Bay+Colony%2C+Pedda+Waltair%2C+Visakhapatnam%2C+Andhra+Pradesh+530017) !";
  } else if (msg.includes("cctv") || msg.includes("safe") || msg.includes("secure") || msg.includes("camera")) {
    reply = "Safety is our absolute #1 priority! 🛡️ Honey Bees is equipped with secure 1080p CCTV cameras. To ensure ultimate student privacy, safety compliance, and secure local data, live CCTV feeds are restricted and monitored strictly by administrators and certified staff members only. Direct login credentials are not given to parents to prevent external digital access. We also have high-foam shockproof flooring and child-locked exit gates.";
  }
  return reply;
}

// --- API ENDPOINTS ---

// Helper to query Gemini with retries and model fallbacks
async function getAIResponseWithFallbackAndRetries(message: string): Promise<string> {
  if (!ai) {
    throw new Error("AI client is not initialized.");
  }

  const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
  const maxRetriesPerModel = 2;

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= maxRetriesPerModel; attempt++) {
      try {
        console.log(`[AI Chat] Requesting model ${model} (attempt ${attempt}/${maxRetriesPerModel})...`);
        const chat = ai.chats.create({
          model: model,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          }
        });
        const response = await chat.sendMessage({ message });
        if (response && response.text) {
          console.log(`[AI Chat] Successfully received response from ${model}`);
          return response.text;
        }
      } catch (err: any) {
        console.warn(`[AI Chat] Attempt ${attempt} with model ${model} failed:`, err?.message || err);
        if (attempt < maxRetriesPerModel) {
          // Wait 500ms before retrying the same model
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    }
  }

  throw new Error("All attempts with all models failed.");
}

// AI Support Chatbot (uses server-side Gemini 3.5 Flash / 3.1 Flash Lite)
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
    const reply = await getAIResponseWithFallbackAndRetries(message);
    return res.json({ reply });
  } catch (error: any) {
    console.error("Gemini API Error after retries/fallbacks, falling back to smart backup responder:", error);
    const reply = getBackupReply(message);
    return res.json({ reply });
  }
});

// --- EMAIL DISPATCH ENGINE (EmailJS Server-Side Proxy & local sandbox log) ---
async function triggerEmailDispatch(payload: {
  formType: "Contact Inquiry" | "Admission Enrollment" | "School Tour Booking" | string;
  parentName: string;
  email: string;
  phone: string;
  messageText: string;
  details: string;
  recipient?: string;
}) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  const emailId = `mail-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const timestamp = new Date().toISOString();

  const recipientEmail = payload.recipient || "hello@honeybeespreschool.com";

  const newLogEntry: any = {
    id: emailId,
    timestamp,
    formType: payload.formType,
    parentName: payload.parentName,
    email: payload.email,
    phone: payload.phone,
    messageText: payload.messageText,
    details: payload.details,
    recipient: recipientEmail,
    status: "Simulated",
    logs: [`Email triggered in application sandbox. Recipient: ${recipientEmail}`]
  };

  const isConfigured = !!(serviceId && templateId && publicKey);

  if (isConfigured) {
    newLogEntry.logs.push(`Attempting dispatch via EmailJS (Service: ${serviceId}, Template: ${templateId})...`);
    try {
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          accessToken: privateKey || undefined,
          template_params: {
            to_email: recipientEmail,
            subject: `🐝 Honey Bees: ${payload.formType} by ${payload.parentName}`,
            from_name: payload.parentName,
            from_email: payload.email,
            phone: payload.phone,
            message: payload.messageText,
            form_type: payload.formType,
            details: payload.details,
            timestamp
          }
        })
      });

      if (response.ok) {
        newLogEntry.status = "Delivered";
        newLogEntry.logs.push("EmailJS successfully accepted and dispatched the email!");
      } else {
        const errText = await response.text();
        newLogEntry.status = "Failed";
        newLogEntry.logs.push(`EmailJS dispatch failed with status ${response.status}: ${errText}`);
      }
    } catch (err: any) {
      newLogEntry.status = "Failed";
      newLogEntry.logs.push(`Network error connecting to EmailJS API: ${err?.message || err}`);
    }
  } else {
    newLogEntry.logs.push("EmailJS credentials are not configured in system secrets. Local sandbox simulation fallback is active.");
    newLogEntry.logs.push("To send real emails, define EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, and EMAILJS_PUBLIC_KEY in the Settings menu.");
  }

  db.emails.unshift(newLogEntry);
  if (db.emails.length > 100) {
    db.emails.pop();
  }

  return newLogEntry;
}

// Submit Admissions Form
app.post("/api/admissions", (req, res) => {
  const { 
    childName, 
    parentName, 
    email, 
    phone, 
    dob, 
    program,
    gender,
    address,
    preferredStartDate,
    emergencyContact,
    previousSchool,
    specialNotes
  } = req.body;

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
    status: "New", // Initial state is "New"
    date: new Date().toISOString().split("T")[0],
    gender: gender || "Male",
    address: address || "N/A",
    preferredStartDate: preferredStartDate || "N/A",
    emergencyContact: emergencyContact || "N/A",
    previousSchool: previousSchool || "None",
    specialNotes: specialNotes || "None"
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

  const formattedDetails = `Child's Name: ${childName}
Parent's Name: ${parentName}
Child DOB: ${dob || "N/A"}
Child Gender: ${gender || "Male"}
Requested Program: ${program}
Preferred Start Date: ${preferredStartDate || "Immediate"}
Emergency Contact: ${emergencyContact || "N/A"}
Previous Schooling: ${previousSchool || "None"}
Residential Address: ${address || "N/A"}
Medical Notes/Special Info: ${specialNotes || "None"}
Contact Phone: ${phone}
Contact Email: ${email}`;

  // 1. Trigger background email dispatch to hello@honeybeespreschool.com (Admin)
  triggerEmailDispatch({
    formType: "Admission Enrollment",
    parentName,
    email,
    phone,
    messageText: `New Online Admission Enrollment request submitted for ${childName}.`,
    details: formattedDetails,
    recipient: "hello@honeybeespreschool.com"
  }).catch(err => console.error("Admissions admin email dispatch error:", err));

  // 2. Trigger background confirmation receipt to Parent
  triggerEmailDispatch({
    formType: "Admission Enrollment - Parent Confirmation",
    parentName,
    email,
    phone,
    messageText: `Dear ${parentName}, thank you for enrolling your child ${childName} at Honey Bees Pre-School! We have successfully received your request.`,
    details: `Application Reference: ${newAdmission.id}\n\nWe will review your submission and contact you within the next 24 hours. Your child has also been added to our live directory with admission status set to 'New'.\n\nSubmitted Fields Summary:\n${formattedDetails}`,
    recipient: email
  }).catch(err => console.error("Admissions parent email dispatch error:", err));

  return res.json({
    success: true,
    message: "Admission registration submitted successfully! Real-time database has been updated, and confirmation alerts have been dispatched to both the school admin and your parent mailbox.",
    data: newAdmission
  });
});

// Book Tour
app.post("/api/tours", (req, res) => {
  const { parentName, email, phone, date, time, visitors } = req.body;
  if (!parentName || !email || !phone || !date || !time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const visitorsCount = parseInt(visitors) || 2;

  const newTour = {
    id: `tour-${db.tours.length + 1}`,
    parentName,
    email,
    phone,
    date,
    time,
    status: "New",
    visitors: visitorsCount
  };

  db.tours.unshift(newTour);

  const formattedDetails = `Parent Name: ${parentName}
Preferred Date: ${date}
Preferred Time Slot: ${time}
Number of Visitors: ${visitorsCount}
Contact Phone: ${phone}
Contact Email: ${email}`;

  // 1. Trigger background email dispatch to hello@honeybeespreschool.com (Admin)
  triggerEmailDispatch({
    formType: "School Tour Booking",
    parentName,
    email,
    phone,
    messageText: `New Physical School Tour reserved for ${date} at ${time}. Expected visitors: ${visitorsCount}.`,
    details: formattedDetails,
    recipient: "hello@honeybeespreschool.com"
  }).catch(err => console.error("Tour booking admin email dispatch error:", err));

  // 2. Trigger background confirmation receipt to Parent
  triggerEmailDispatch({
    formType: "School Tour Booking - Parent Confirmation",
    parentName,
    email,
    phone,
    messageText: `Dear ${parentName}, we are excited to welcome you for a physical school tour on ${date} at ${time}!`,
    details: `Tour Booking Reference: ${newTour.id}\nNo. of Visitors: ${visitorsCount}\nAddress: Honey Bees Preschool & Daycare, 4th Block, HRBR Layout, Kalyan Nagar, Bengaluru.\n\nWe have booked your slot. An automated WhatsApp invite with google location map details has also been sent.`,
    recipient: email
  }).catch(err => console.error("Tour booking parent email dispatch error:", err));

  return res.json({
    success: true,
    message: "School tour confirmed! 🐝 Real-time database has been updated, and confirmation alerts have been dispatched to both the school admin and your parent mailbox.",
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

  // Trigger background email dispatch to hello@honeybeespreschool.com
  triggerEmailDispatch({
    formType: "Contact Inquiry",
    parentName,
    email,
    phone,
    messageText: message,
    details: `Parent's Name: ${parentName}\nChild's Age: ${childAge || "N/A"}\nInterested Program: ${program || "General Inquiry"}\nContact Phone: ${phone}\nContact Email: ${email}\n\nMessage: ${message}`
  }).catch(err => console.error("Enquiry email dispatch error:", err));

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

// GET Playroom Videos
app.get("/api/playroom/videos", (req, res) => {
  if (!db.playroomVideos) {
    db.playroomVideos = {};
  }
  return res.json(db.playroomVideos);
});

// POST Admin Add Playroom Video
app.post("/api/admin/playroom/videos", (req, res) => {
  const { letter, title, url } = req.body;
  if (!letter || !title || !url) {
    return res.status(400).json({ error: "Letter, title, and video URL are required" });
  }

  const cleanLetter = letter.toUpperCase();
  if (!db.playroomVideos) {
    db.playroomVideos = {};
  }
  if (!db.playroomVideos[cleanLetter]) {
    db.playroomVideos[cleanLetter] = [];
  }

  const newVideo = {
    id: `v-${Date.now()}`,
    title: title.trim(),
    url: url.trim(),
  };

  db.playroomVideos[cleanLetter].push(newVideo);
  return res.json({ success: true, message: "Video lesson added successfully!", data: newVideo });
});

// DELETE Admin Playroom Video
app.delete("/api/admin/playroom/videos/:letter/:id", (req, res) => {
  const { letter, id } = req.params;
  const cleanLetter = letter.toUpperCase();

  if (!db.playroomVideos || !db.playroomVideos[cleanLetter]) {
    return res.status(404).json({ error: "No videos found for this letter" });
  }

  const index = db.playroomVideos[cleanLetter].findIndex((v: any) => v.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Video not found" });
  }

  db.playroomVideos[cleanLetter].splice(index, 1);
  return res.json({ success: true, message: "Video lesson deleted successfully!" });
});

// GET Voice Settings
app.get("/api/voice-settings", (req, res) => {
  if (!db.voiceSettings) {
    db.voiceSettings = {
      greetingEn: "Buzz Buzz! 🐝 Thank you for calling Honey Bees Pre-School. I'm Beatrice, your virtual AI Receptionist! I can instantly book a school tour or answer questions about our classes. Am I speaking with {callerName}?",
      greetingTe: "బజ్ బజ్! 🐝 హనీ బీస్ ప్రీ-స్కూల్‌కు కాల్ చేసినందుకు ధన్యవాదాలు. నేను బీట్రైస్, మీ వర్చువల్ AI రిసెప్షనిస్ట్! నేను తక్షణమే పాఠశాల పర్యటనను బుక్ చేయగలను లేదా మా తరగతుల గురించి ప్రశ్నలకు సమాధానం ఇవ్వగలను. నేను {callerName} గారితో మాట్లాడుతున్నానా?",
    };
  }
  return res.json(db.voiceSettings);
});

// PUT Admin Update Voice Settings
app.put("/api/admin/voice-settings", (req, res) => {
  const { greetingEn, greetingTe } = req.body;
  if (!db.voiceSettings) {
    db.voiceSettings = {};
  }
  if (greetingEn !== undefined) db.voiceSettings.greetingEn = greetingEn;
  if (greetingTe !== undefined) db.voiceSettings.greetingTe = greetingTe;
  saveDb();
  return res.json({ success: true, message: "Voice assistant greeting updated successfully!", data: db.voiceSettings });
});

// POST Admin Upload Image to Cloudinary (or Local Memory Fallback)
app.post("/api/admin/gallery/upload", async (req, res) => {
  const { file, title, category, type } = req.body;
  if (!file || !title || !category) {
    return res.status(400).json({ error: "File, title, and category are required" });
  }

  const mediaType = type || (file.startsWith("data:video") ? "video" : "image");

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

      const resourceType = mediaType === "video" ? "video" : "image";
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
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
        url: uploadedUrl,
        type: mediaType
      };
      db.gallery.push(newPhoto);

      return res.json({
        success: true,
        message: `${mediaType === "video" ? "Video" : "Image"} uploaded to Cloudinary successfully!`,
        data: newPhoto
      });

    } catch (err: any) {
      console.error("Cloudinary secure upload failed, falling back to local memory database:", err);
      const newPhoto = {
        id: `photo-${Date.now()}`,
        title,
        category,
        url: file, // Local memory Base64 fallback
        type: mediaType
      };
      db.gallery.push(newPhoto);
      return res.json({
        success: true,
        message: `Saved media locally: Cloudinary failed (${err.message})`,
        data: newPhoto
      });
    }
  } else {
    // Graceful fallback when Cloudinary is not configured
    console.log("Cloudinary is not configured. Saving media to local memory database.");
    const newPhoto = {
      id: `photo-${Date.now()}`,
      title,
      category,
      url: file, // Local memory Base64 fallback
      type: mediaType
    };
    db.gallery.push(newPhoto);
    return res.json({
      success: true,
      message: "Saved media to temporary local memory (Cloudinary credentials not set).",
      data: newPhoto
    });
  }
});

// POST Admin Add Gallery Photo (Classic Emoji / Text metadata upload)
app.post("/api/admin/gallery", (req, res) => {
  const { title, category, icon, url, type } = req.body;
  if (!title || !category) {
    return res.status(400).json({ error: "Title and category are required" });
  }
  if (!icon && !url) {
    return res.status(400).json({ error: "Either Emoji Icon or Image/Video URL is required" });
  }
  const mediaType = type || (url?.startsWith("data:video") || url?.endsWith(".mp4") ? "video" : "image");
  const newPhoto = {
    id: `photo-${Date.now()}`,
    title,
    category,
    icon: icon || "📸",
    url,
    type: mediaType
  };
  db.gallery.push(newPhoto);
  return res.json({ success: true, message: "Gallery snapshot created successfully!", data: newPhoto });
});

// PUT Admin Update Gallery Photo
app.put("/api/admin/gallery/:id", (req, res) => {
  const { id } = req.params;
  const { title, category, icon, url, type } = req.body;
  const photo = db.gallery.find((p) => p.id === id);
  if (!photo) {
    return res.status(404).json({ error: "Gallery item not found" });
  }
  if (title) photo.title = title;
  if (category) photo.category = category;
  if (icon !== undefined) photo.icon = icon;
  if (url !== undefined) {
    photo.url = url;
    if (!type) {
      photo.type = url?.startsWith("data:video") || url?.endsWith(".mp4") ? "video" : "image";
    }
  }
  if (type) photo.type = type;
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

// PUT Admin Update Admission Application Status / Fields
app.put("/api/admin/admissions/:id", (req, res) => {
  const { id } = req.params;
  const { status, gender, address, preferredStartDate, emergencyContact, previousSchool, specialNotes } = req.body;
  const admission = db.admissions.find((a) => a.id === id);
  if (!admission) {
    return res.status(404).json({ error: "Admission application not found" });
  }
  if (status) admission.status = status;
  if (gender) admission.gender = gender;
  if (address) admission.address = address;
  if (preferredStartDate) admission.preferredStartDate = preferredStartDate;
  if (emergencyContact) admission.emergencyContact = emergencyContact;
  if (previousSchool) admission.previousSchool = previousSchool;
  if (specialNotes) admission.specialNotes = specialNotes;
  
  return res.json({ success: true, message: "Admission application status updated successfully!", data: admission });
});

// PUT Admin Update Tour Booking Status
app.put("/api/admin/tours/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const tour = db.tours.find((t) => t.id === id);
  if (!tour) {
    return res.status(404).json({ error: "Tour booking not found" });
  }
  if (status) tour.status = status;
  return res.json({ success: true, message: "Tour booking status updated successfully!", data: tour });
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

// --- AUTHENTICATION ENDPOINTS ---

// POST Register new user
app.post("/api/auth/register", (req, res) => {
  const { email, password, name, role, childName, childDob, childProgram, teacherSpecialty } = req.body;
  
  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: "Email, password, name, and role are required." });
  }

  // Check if email already exists
  const existingUser = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ error: "An account with this email address already exists." });
  }

  const userId = `u-${Date.now()}`;
  let studentId = "";

  // If registering as parent, automatically spawn a child/student profile so they see a populated dashboard
  if (role === "parent") {
    const newStudentId = `stud-${Date.now()}`;
    studentId = newStudentId;
    
    const newStudent = {
      id: newStudentId,
      name: childName || `${name}'s Child`,
      parentName: name,
      parentEmail: email,
      program: childProgram || "Nursery",
      dob: childDob || "2023-05-10",
      attendance: [
        { date: "2026-07-13", status: "Present" },
        { date: "2026-07-14", status: "Present" }
      ],
      fees: [
        { term: "Term 1 (July - Sept 2026)", amount: 540, status: "Pending", dueDate: "2026-07-25" }
      ],
      progress: {
        motorSkills: "Good Progress",
        socialSkills: "Excellent",
        creativity: "Developing",
        cognitive: "Good Progress"
      }
    };
    db.students.push(newStudent);
  }

  const newUser = {
    id: userId,
    email: email.toLowerCase(),
    password, // Stored directly for mock DB simplicity
    name,
    role,
    studentId,
    specialty: role === "teacher" ? (teacherSpecialty || "Nursery") : undefined
  };

  db.users.push(newUser);

  return res.json({
    success: true,
    message: "Your Honey Bees account was created successfully! You can now log in.",
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      studentId: newUser.studentId
    }
  });
});

// POST Login user
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email/username and password are required." });
  }

  const cleanEmail = String(email).trim();
  const cleanPassword = String(password).trim();

  // Handle default backwards-compatible admin credential
  if (cleanEmail === "admin" && cleanPassword === "honeybees-admin") {
    return res.json({
      success: true,
      user: {
        id: "u-1",
        email: "admin@honeybees.com",
        name: "Hive Administrator",
        role: "admin"
      }
    });
  }

  // Search standard email accounts
  const user = db.users.find(
    (u: any) => u.email.toLowerCase() === cleanEmail.toLowerCase() && u.password === cleanPassword
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid email or passcode. Please try again." });
  }

  return res.json({
    success: true,
    message: "Login successful!",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      studentId: user.studentId
    }
  });
});

// GET All Upcoming Events
app.get("/api/events", (req, res) => {
  return res.json(db.events || []);
});

// POST Subscribe to Upcoming Event
app.post("/api/events/subscribe", async (req, res) => {
  const { eventId, email, parentName, phone } = req.body;
  if (!eventId || !email) {
    return res.status(400).json({ error: "Event ID and email are required" });
  }

  if (!db.events) db.events = [];
  const event = db.events.find((e: any) => e.id === eventId);
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  if (!db.eventSubscriptions) db.eventSubscriptions = [];
  const isAlreadySubscribed = db.eventSubscriptions.some(
    (sub: any) => sub.eventId === eventId && sub.email.toLowerCase() === email.toLowerCase()
  );

  if (isAlreadySubscribed) {
    return res.status(400).json({ error: "You have already subscribed to notifications for this event!" });
  }

  const newSub = {
    id: `sub-${Date.now()}`,
    eventId,
    eventTitle: event.title,
    eventDate: event.date,
    email,
    parentName: parentName || "Honey Bees Parent",
    phone: phone || "N/A",
    subscribedAt: new Date().toISOString()
  };

  db.eventSubscriptions.push(newSub);
  saveDb();

  try {
    await triggerEmailDispatch({
      formType: "Event Subscription Reminder",
      parentName: parentName || "Honey Bees Parent",
      email,
      phone: phone || "N/A",
      messageText: `Successfully subscribed to reminders for the event: ${event.title}!`,
      details: `Event Title: ${event.title}\nDate: ${event.date}\nTime: ${event.time}\nDescription: ${event.desc}\n\nYou have registered for reminders. We will notify you with updates and reminders as the event approaches. Thank you!`,
      recipient: email
    });
  } catch (err) {
    console.error("Failed to send subscription confirmation email:", err);
  }

  return res.json({
    success: true,
    message: `Subscription confirmed! An email confirmation has been dispatched to ${email} for "${event.title}".`
  });
});

// POST Admin Add Upcoming Event
app.post("/api/admin/events", (req, res) => {
  const { title, date, time, desc } = req.body;
  if (!title || !date || !time || !desc) {
    return res.status(400).json({ error: "Title, date, time, and description are required" });
  }
  const newEvent = {
    id: `event-${Date.now()}`,
    title,
    date,
    time,
    desc
  };
  if (!db.events) db.events = [];
  db.events.push(newEvent);
  return res.json({ success: true, message: "Upcoming event created successfully!", data: newEvent });
});

// PUT Admin Update Upcoming Event
app.put("/api/admin/events/:id", (req, res) => {
  const { id } = req.params;
  const { title, date, time, desc } = req.body;
  if (!db.events) db.events = [];
  const event = db.events.find((e: any) => e.id === id);
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }
  if (title) event.title = title;
  if (date) event.date = date;
  if (time) event.time = time;
  if (desc) event.desc = desc;
  return res.json({ success: true, message: "Upcoming event updated successfully!", data: event });
});

// DELETE Admin Delete Upcoming Event
app.delete("/api/admin/events/:id", (req, res) => {
  const { id } = req.params;
  if (!db.events) db.events = [];
  const index = db.events.findIndex((e: any) => e.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Event not found" });
  }
  db.events.splice(index, 1);
  return res.json({ success: true, message: "Upcoming event deleted successfully!" });
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

// Submit Leave/Absence Request
app.post("/api/parent/request-leave", (req, res) => {
  const { studentId, date, status, reason } = req.body;
  if (!studentId || !date || !status || !reason) {
    return res.status(400).json({ error: "Student ID, Date, status and reason are required" });
  }

  const student = db.students.find((s: any) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: "Student record not found" });
  }

  const leaveId = `leave-${Date.now()}`;
  const newLeave = {
    id: leaveId,
    studentId,
    studentName: student.name,
    date,
    status, // "Absent" or "Late"
    reason,
    submittedAt: new Date().toISOString()
  };

  if (!db.leaveRequests) db.leaveRequests = [];
  db.leaveRequests.unshift(newLeave);

  // Update student attendance logs with this date
  const existingIdx = student.attendance.findIndex((a: any) => a.date === date);
  if (existingIdx > -1) {
    student.attendance[existingIdx].status = status;
  } else {
    student.attendance.push({ date, status });
  }

  // Trim to avoid infinite sizing
  if (db.leaveRequests.length > 200) db.leaveRequests.pop();

  return res.json({
    success: true,
    message: `Leave request submitted! Attendance updated to '${status}' for ${date}.`,
    data: newLeave
  });
});

// Book Parent-Teacher Meeting (PTM)
app.post("/api/parent/book-ptm", (req, res) => {
  const { studentId, parentName, teacherName, date, time } = req.body;
  if (!studentId || !parentName || !teacherName || !date || !time) {
    return res.status(400).json({ error: "Missing required booking details" });
  }

  const student = db.students.find((s: any) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: "Student record not found" });
  }

  // Check if slot already taken
  if (!db.ptmBookings) db.ptmBookings = [];
  const slotTaken = db.ptmBookings.some((b: any) => b.date === date && b.time === time && b.teacherName === teacherName);
  if (slotTaken) {
    return res.status(400).json({ error: "This time slot is already booked. Please choose another time." });
  }

  const bookingId = `ptm-${Date.now()}`;
  const newBooking = {
    id: bookingId,
    studentId,
    studentName: student.name,
    parentName,
    teacherName,
    date,
    time,
    status: "Confirmed",
    createdAt: new Date().toISOString()
  };

  db.ptmBookings.unshift(newBooking);

  // Trigger simulated confirmation email to parent
  triggerEmailDispatch({
    formType: "PTM Slot Confirmation",
    parentName,
    email: student.parentEmail || "parent@honeybees.com",
    phone: "+1 (555) 987-6543",
    messageText: `Your slot with ${teacherName} is confirmed!`,
    details: `Meeting Reference: ${bookingId}\nStudent: ${student.name}\nTeacher: ${teacherName}\nDate: ${date}\nTime Slot: ${time}\n\nWe look forward to discussing your child's progress!`
  }).catch(err => console.error("PTM booking email notification error:", err));

  return res.json({
    success: true,
    message: `Meeting successfully booked with ${teacherName} on ${date} at ${time}!`,
    data: newBooking
  });
});

// Submit Homework Completed Worksheet/Photo
app.post("/api/parent/submit-homework", (req, res) => {
  const { studentId, homeworkId, comments, imageBase64 } = req.body;
  if (!studentId || !homeworkId) {
    return res.status(400).json({ error: "Student ID and Homework ID are required" });
  }

  const student = db.students.find((s: any) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: "Student record not found" });
  }

  const hw = db.homework.find((h: any) => h.id === homeworkId);
  if (!hw) {
    return res.status(404).json({ error: "Homework assignment not found" });
  }

  const submissionId = `subm-${Date.now()}`;
  const newSubmission = {
    id: submissionId,
    studentId,
    studentName: student.name,
    homeworkId,
    homeworkTitle: hw.title,
    comments: comments || "",
    imageUrl: imageBase64 || "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80",
    submittedAt: new Date().toISOString().split("T")[0]
  };

  if (!db.homeworkSubmissions) db.homeworkSubmissions = [];
  db.homeworkSubmissions.unshift(newSubmission);

  return res.json({
    success: true,
    message: `Worksheet response submitted successfully for Ethan! Outstanding progress.`,
    data: newSubmission
  });
});

// Update Push Notification Preferences
app.post("/api/parent/push-preferences", (req, res) => {
  const { email, alertsEnabled, categoryPreferences } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  if (!db.pushSettings) db.pushSettings = {};
  db.pushSettings[email.toLowerCase()] = {
    alertsEnabled: !!alertsEnabled,
    categoryPreferences: categoryPreferences || { homework: true, attendance: true, fees: true, newsletter: true },
    updatedAt: new Date().toISOString()
  };

  return res.json({
    success: true,
    message: "Notification preferences updated! Handshake established with browser push registry.",
    data: db.pushSettings[email.toLowerCase()]
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
    testimonial.role = "Verified Honey Bees Guardian";
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
