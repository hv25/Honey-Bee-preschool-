import React, { useState, useEffect, useRef } from "react";
import { 
  BookOpen, 
  Sparkles, 
  Music, 
  Video, 
  Gamepad2, 
  Heart, 
  Award, 
  Volume2, 
  PenTool, 
  ChevronRight, 
  Trash2, 
  Download, 
  CheckCircle, 
  RotateCcw, 
  Trophy, 
  UserCheck, 
  Calendar, 
  ArrowRight,
  Plus,
  Play,
  Share2,
  ShieldAlert,
  Printer,
  X,
  FileText,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Search,
  CheckCircle as FileCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types & Constants ---
interface AlphabetLetter {
  letter: string;
  word: string;
  emoji: string;
  videoUrl: string;
  phonetics: string;
}

const ALPHABET_LIST: AlphabetLetter[] = [
  { letter: "A", word: "Apple", emoji: "🍎", videoUrl: "https://www.youtube.com/embed/jPVbJ-K5674", phonetics: "Ah-pul" },
  { letter: "B", word: "Ball", emoji: "⚽", videoUrl: "https://www.youtube.com/embed/jPVbJ-K5674", phonetics: "Bah-l" },
  { letter: "C", word: "Cat", emoji: "🐱", videoUrl: "https://www.youtube.com/embed/jPVbJ-K5674", phonetics: "Cah-t" },
  { letter: "D", word: "Dog", emoji: "🐶", videoUrl: "https://www.youtube.com/embed/jPVbJ-K5674", phonetics: "Doh-g" },
  { letter: "E", word: "Elephant", emoji: "🐘", videoUrl: "https://www.youtube.com/embed/jPVbJ-K5674", phonetics: "Eh-lee-fant" },
  { letter: "F", word: "Fish", emoji: "🐟", videoUrl: "https://www.youtube.com/embed/jPVbJ-K5674", phonetics: "Fih-sh" },
  { letter: "G", word: "Grapes", emoji: "🍇", videoUrl: "https://www.youtube.com/embed/jPVbJ-K5674", phonetics: "Gray-ps" },
  { letter: "H", word: "Honeybee", emoji: "🐝", videoUrl: "https://www.youtube.com/embed/jPVbJ-K5674", phonetics: "Hah-nee-bee" },
  { letter: "I", word: "Icecream", emoji: "🍦", videoUrl: "https://www.youtube.com/embed/jPVbJ-K5674", phonetics: "Ice-creem" },
  { letter: "J", word: "Jug", emoji: "🥛", videoUrl: "https://www.youtube.com/embed/jPVbJ-K5674", phonetics: "Juh-g" },
  { letter: "K", word: "Kite", emoji: "🪁", videoUrl: "https://www.youtube.com/embed/jPVbJ-K5674", phonetics: "Kye-t" },
  { letter: "L", word: "Lion", emoji: "🦁", videoUrl: "https://www.youtube.com/embed/jPVbJ-K5674", phonetics: "Lye-on" },
  { letter: "M", word: "Monkey", emoji: "🐒", videoUrl: "https://www.youtube.com/embed/jPVbJ-K5674", phonetics: "Mung-kee" },
  { letter: "N", word: "Nest", emoji: "🪺", videoUrl: "https://www.youtube.com/embed/jPVbJ-K5674", phonetics: "Neh-st" },
  { letter: "O", word: "Orange", emoji: "🍊", videoUrl: "https://www.youtube.com/embed/jPVbJ-K5674", phonetics: "Oh-range" },
  { letter: "P", word: "Peacock", emoji: "🦚", videoUrl: "https://www.youtube.com/embed/jPVbJ-K5674", phonetics: "Pee-kok" },
  { letter: "Q", word: "Queen", emoji: "👑", videoUrl: "https://www.youtube.com/embed/jPVbJ-K5674", phonetics: "Kwee-n" },
  { letter: "R", word: "Rabbit", emoji: "🐇", videoUrl: "https://www.youtube.com/embed/jPVbJ-K5674", phonetics: "Rah-bit" },
  { letter: "S", word: "Sun", emoji: "☀️", videoUrl: "https://www.youtube.com/embed/jPVbJ-K5674", phonetics: "Suh-n" },
  { letter: "T", word: "Tiger", emoji: "🐯", videoUrl: "https://www.youtube.com/embed/jPVbJ-K5674", phonetics: "Tye-gur" },
  { letter: "U", word: "Umbrella", emoji: "☂️", videoUrl: "https://www.youtube.com/embed/jPVbJ-K5674", phonetics: "Um-brel-lah" },
  { letter: "V", word: "Violin", emoji: "🎻", videoUrl: "https://www.youtube.com/embed/jPVbJ-K5674", phonetics: "Vye-oh-lin" },
  { letter: "W", word: "Watermelon", emoji: "🍉", videoUrl: "https://www.youtube.com/embed/jPVbJ-K5674", phonetics: "Wah-ter-mel-on" },
  { letter: "X", word: "Xylophone", emoji: "🎹", videoUrl: "https://www.youtube.com/embed/jPVbJ-K5674", phonetics: "Zye-loh-fone" },
  { letter: "Y", word: "Yak", emoji: "🐂", videoUrl: "https://www.youtube.com/embed/jPVbJ-K5674", phonetics: "Yah-k" },
  { letter: "Z", word: "Zebra", emoji: "🦓", videoUrl: "https://www.youtube.com/embed/jPVbJ-K5674", phonetics: "Zee-bra" },
];

const LETTER_STROKES: Record<string, string[]> = {
  A: ["M 30 80 L 50 20", "M 50 20 L 70 80", "M 38 55 L 62 55"],
  B: ["M 35 20 L 35 80", "M 35 20 C 60 20, 60 50, 35 50", "M 35 50 C 60 50, 60 80, 35 80"],
  C: ["M 70 30 C 60 20, 35 20, 35 50 C 35 80, 60 80, 70 70"],
  D: ["M 35 20 L 35 80", "M 35 20 C 70 20, 70 80, 35 80"],
  E: ["M 35 20 L 35 80", "M 35 20 L 70 20", "M 35 50 L 60 50", "M 35 80 L 70 80"],
  F: ["M 35 20 L 35 80", "M 35 20 L 70 20", "M 35 50 L 60 50"],
  G: ["M 70 30 C 60 20, 35 20, 35 50 C 35 80, 60 80, 70 80", "M 70 80 L 70 50 L 52 50"],
  H: ["M 30 20 L 30 80", "M 70 20 L 70 80", "M 30 50 L 70 50"],
  I: ["M 50 20 L 50 80", "M 30 20 L 70 20", "M 30 80 L 70 80"],
  J: ["M 35 20 L 65 20", "M 50 20 L 50 70 C 50 85, 30 85, 30 75"],
  K: ["M 35 20 L 35 80", "M 65 25 L 35 50", "M 35 50 L 68 78"],
  L: ["M 35 20 L 35 80", "M 35 80 L 70 80"],
  M: ["M 25 80 L 25 20", "M 25 20 L 50 50", "M 50 50 L 75 20", "M 75 20 L 75 80"],
  N: ["M 30 80 L 30 20", "M 30 20 L 70 80", "M 70 80 L 70 20"],
  O: ["M 50 20 C 30 20, 30 80, 50 80 C 70 80, 70 20, 50 20"],
  P: ["M 35 80 L 35 20", "M 35 20 C 60 20, 60 50, 35 50"],
  Q: ["M 50 20 C 30 20, 30 80, 50 80 C 70 80, 70 20, 50 20", "M 58 58 L 75 75"],
  R: ["M 35 80 L 35 20", "M 35 20 C 60 20, 60 50, 35 50", "M 35 50 L 70 80"],
  S: ["M 68 30 C 65 20, 35 20, 35 45 C 35 60, 65 60, 65 75 C 65 85, 35 85, 32 75"],
  T: ["M 25 20 L 75 20", "M 50 20 L 50 80"],
  U: ["M 30 20 L 30 65 C 30 80, 70 80, 70 65 L 70 20"],
  V: ["M 25 20 L 50 80", "M 50 80 L 75 20"],
  W: ["M 22 20 L 35 80", "M 35 80 L 50 45", "M 50 45 L 65 80", "M 65 80 L 78 20"],
  X: ["M 25 20 L 75 80", "M 75 20 L 25 80"],
  Y: ["M 25 20 L 50 50", "M 75 20 L 50 50", "M 50 50 L 50 80"],
  Z: ["M 25 20 L 75 20", "M 75 20 L 25 80", "M 25 80 L 75 80"],
};

const NUMBER_STROKES: Record<string, string[]> = {
  "0": ["M 50 20 C 30 20, 30 80, 50 80 C 70 80, 70 20, 50 20 Z"],
  "1": ["M 35 35 L 50 20 L 50 80"],
  "2": ["M 30 35 C 30 15, 70 15, 70 45 C 70 65, 30 80, 30 80 L 70 80"],
  "3": ["M 30 25 L 70 25 L 45 50 C 65 50, 70 80, 50 80 C 35 80, 30 70, 30 70"],
  "4": ["M 55 20 L 25 60 L 75 60", "M 55 20 L 55 80"],
  "5": ["M 65 20 L 35 20 L 35 45 C 55 40, 70 55, 60 75 C 50 85, 35 80, 30 75"],
  "6": ["M 60 25 C 30 30, 30 80, 50 80 C 70 80, 70 55, 50 55 C 35 55, 35 80, 50 80"],
  "7": ["M 30 20 L 70 20 L 45 80"],
  "8": ["M 50 50 C 30 50, 30 20, 50 20 C 70 20, 70 50, 50 50", "M 50 50 C 30 50, 30 80, 50 80 C 70 80, 70 50, 50 50"],
  "9": ["M 50 50 C 30 50, 30 20, 50 20 C 70 20, 70 50, 50 50", "M 50 50 L 50 80 C 50 85, 35 85, 30 80"]
};

interface VocabCategory {
  id: string;
  name: string;
  emoji: string;
  items: { name: string; emoji: string; color?: string }[];
}

const VOCAB_CATEGORIES: VocabCategory[] = [
  {
    id: "animals",
    name: "Animals 🦁",
    emoji: "🦁",
    items: [
      { name: "Lion", emoji: "🦁" },
      { name: "Elephant", emoji: "🐘" },
      { name: "Monkey", emoji: "🐒" },
      { name: "Rabbit", emoji: "🐇" },
      { name: "Cow", emoji: "🐄" },
      { name: "Giraffe", emoji: "🦒" },
    ],
  },
  {
    id: "fruits",
    name: "Fruits 🍎",
    emoji: "🍎",
    items: [
      { name: "Apple", emoji: "🍎" },
      { name: "Banana", emoji: "🍌" },
      { name: "Mango", emoji: "🥭" },
      { name: "Strawberry", emoji: "🍓" },
      { name: "Grapes", emoji: "🍇" },
      { name: "Orange", emoji: "🍊" },
    ],
  },
  {
    id: "vegetables",
    name: "Vegetables 🥕",
    emoji: "🥕",
    items: [
      { name: "Carrot", emoji: "🥕" },
      { name: "Potato", emoji: "🥔" },
      { name: "Tomato", emoji: "🍅" },
      { name: "Brinjal", emoji: "🍆" },
      { name: "Broccoli", emoji: "🥦" },
      { name: "Onion", emoji: "🧅" },
    ],
  },
  {
    id: "birds",
    name: "Birds 🦜",
    emoji: "🦜",
    items: [
      { name: "Parrot", emoji: "🦜" },
      { name: "Peacock", emoji: "🦚" },
      { name: "Pigeon", emoji: "🐦" },
      { name: "Duck", emoji: "🦆" },
      { name: "Owl", emoji: "🦉" },
      { name: "Swan", emoji: "🦢" },
    ],
  },
  {
    id: "colors",
    name: "Colors 🎨",
    emoji: "🎨",
    items: [
      { name: "Red", emoji: "🔴", color: "bg-red-500" },
      { name: "Blue", emoji: "🔵", color: "bg-blue-500" },
      { name: "Green", emoji: "🟢", color: "bg-green-500" },
      { name: "Yellow", emoji: "🟡", color: "bg-yellow-400" },
      { name: "Purple", emoji: "🟣", color: "bg-purple-500" },
      { name: "Orange", emoji: "🟠", color: "bg-orange-500" },
    ],
  },
  {
    id: "shapes",
    name: "Shapes 📐",
    emoji: "📐",
    items: [
      { name: "Circle", emoji: "🔴" },
      { name: "Square", emoji: "⏹️" },
      { name: "Triangle", emoji: "🔺" },
      { name: "Star", emoji: "⭐" },
      { name: "Heart", emoji: "❤️" },
      { name: "Oval", emoji: "🥚" },
    ],
  },
  {
    id: "vehicles",
    name: "Vehicles 🚗",
    emoji: "🚗",
    items: [
      { name: "Car", emoji: "🚗" },
      { name: "School Bus", emoji: "🚌" },
      { name: "Bicycle", emoji: "🚲" },
      { name: "Aeroplane", emoji: "✈️" },
      { name: "Train", emoji: "🚂" },
      { name: "Rocket", emoji: "🚀" },
    ],
  },
  {
    id: "body",
    name: "Body Parts 👁️",
    emoji: "👁️",
    items: [
      { name: "Eyes", emoji: "👁️" },
      { name: "Ears", emoji: "👂" },
      { name: "Nose", emoji: "👃" },
      { name: "Hands", emoji: "🙌" },
      { name: "Feet", emoji: "👣" },
      { name: "Smile", emoji: "😊" },
    ],
  },
  {
    id: "opposites",
    name: "Opposites ↕️",
    emoji: "↕️",
    items: [
      { name: "Big 🐘 vs Small 🐭", emoji: "↕️" },
      { name: "Hot ☕ vs Cold 🍦", emoji: "↕️" },
      { name: "Happy 😄 vs Sad 😢", emoji: "↕️" },
      { name: "Day ☀️ vs Night 🌙", emoji: "↕️" },
      { name: "Fast 🐆 vs Slow 🐢", emoji: "↕️" },
      { name: "Up 🎈 vs Down ⚓", emoji: "↕️" },
    ],
  },
];

interface TeluguLetter {
  telugu: string;
  english: string;
  word: string;
  emoji: string;
  soundText: string;
}

const TELUGU_VARNAMALA: TeluguLetter[] = [
  { telugu: "అ", english: "A", word: "అమ్మ (Amma - Mother)", emoji: "👩‍👦", soundText: "A" },
  { telugu: "ఆ", english: "Aa", word: "ఆవు (Aavu - Cow)", emoji: "🐄", soundText: "Aa" },
  { telugu: "ఇ", english: "I", word: "ఇల్లు (Illu - House)", emoji: "🏠", soundText: "I" },
  { telugu: "ఈ", english: "Ee", word: "ఈల (Eela - Whistle)", emoji: "🪈", soundText: "Ee" },
  { telugu: "ఉ", english: "U", word: "ఉడుత (Uduta - Squirrel)", emoji: "🐿️", soundText: "U" },
  { telugu: "ఊ", english: "Oo", word: "ఊయల (Ooyala - Cradle Swing)", emoji: "🪘", soundText: "Oo" },
  { telugu: "ఋ", english: "Ru", word: "ఋషి (Rushi - Sage)", emoji: "🧘‍♂️", soundText: "Ru" },
  { telugu: "ఎ", english: "E", word: "ఎలుక (Eluka - Mouse)", emoji: "🐭", soundText: "E" },
  { telugu: "ఏ", english: "Ae", word: "ఏనుగు (Aenugu - Elephant)", emoji: "🐘", soundText: "Ae" },
  { telugu: "ఐ", english: "Ai", word: "ఐదు (Aidu - Five)", emoji: "🖐️", soundText: "Ai" },
  { telugu: "ఒ", english: "O", word: "ఒంటె (Onte - Camel)", emoji: "🐪", soundText: "O" },
  { telugu: "ఓ", english: "Oo", word: "ఓడ (Oda - Ship)", emoji: "🚢", soundText: "Oo" },
  { telugu: "ఔ", english: "Au", word: "ఔషధం (Aushadham - Medicine)", emoji: "🧪", soundText: "Au" },
  { telugu: "అం", english: "Am", word: "అంబరం (Ambaram - Sky)", emoji: "🌌", soundText: "Am" },
  { telugu: "క", english: "Ka", word: "కప్ప (Kappa - Frog)", emoji: "🐸", soundText: "Ka" },
  { telugu: "ఖ", english: "Kha", word: "ఖడ్గం (Khadgam - Sword)", emoji: "⚔️", soundText: "Kha" },
  { telugu: "గ", english: "Ga", word: "గంట (Ganta - Bell)", emoji: "🔔", soundText: "Ga" },
  { telugu: "ఘ", english: "Gha", word: "ఘటం (Ghatam - Pot)", emoji: "🏺", soundText: "Gha" },
];

interface StoryItem {
  id: string;
  title: string;
  category: "Panchatantra" | "Moral" | "Bedtime";
  emoji: string;
  summary: string;
  paragraphs: string[];
  moral: string;
  quiz: {
    question: string;
    options: string[];
    answer: string;
  };
}

const STORIES_LIST: StoryItem[] = [
  {
    id: "thirsty-crow",
    title: "The Thirsty Crow 🪶",
    category: "Panchatantra",
    emoji: "🐦🪨",
    summary: "A smart crow solves a difficult puzzle to drink cool water on a dry day.",
    paragraphs: [
      "Once, on a very hot summer afternoon, a clever little black crow was flying around Lawsons Bay Colony, feeling extremely thirsty.",
      "He searched high and low but couldn't find a single stream of water. Finally, he spotted an old earthen pitcher garden pot.",
      "The crow flew down happily and peeped inside. There was water, but it was sitting right at the bottom, and his short beak couldn't reach it!",
      "Instead of crying, the smart crow saw a pile of clean little pebbles nearby. He picked them up, one by one, dropping them into the pitcher.",
      "Plop! Plop! Plop! With every single pebble, the water level rose higher and higher. Finally, he drank the cool water and flew away happily!"
    ],
    moral: "Where there is a will, there is always a clever way! 🧠✨",
    quiz: {
      question: "How did the clever crow make the water rise to the top?",
      options: [
        "By tipping the jar over",
        "By throwing pebbles inside",
        "By asking a friendly rabbit",
        "By singing a nice rain song"
      ],
      answer: "By throwing pebbles inside"
    }
  },
  {
    id: "hare-tortoise",
    title: "The Slow & Steady Race 🐢🐇",
    category: "Moral",
    emoji: "🐢🏁",
    summary: "The proud, fast rabbit is challenged to an epic race by a persistent tortoise.",
    paragraphs: [
      "Deep in the green meadows of Honey Bees Park, a bouncy little Hare loved to boast about how incredibly fast he could run.",
      "A friendly, quiet Tortoise grew tired of the boasting and said: 'Let's have a race to the big ancient oak tree!'",
      "The Hare laughed, zoom-zoomed ahead, and was soon miles in front. Feeling extremely safe, he decided to take a cozy nap under some clover.",
      "Meanwhile, the persistent Tortoise walked 'step-by-step', never stopping for a break. He quietly crept past the sleeping Hare.",
      "When the Hare woke up with a start, he ran as fast as the wind, but the Tortoise had already crossed the finish line to win the crown!"
    ],
    moral: "Slow and steady wins the race. Never boast or give up! 👑💪",
    quiz: {
      question: "Why did the Hare lose the race?",
      options: [
        "He got lost in the forest",
        "He fell asleep taking a nap",
        "His shoes broke",
        "He stopped to eat fresh carrots"
      ],
      answer: "He fell asleep taking a nap"
    }
  }
];

// --- TRACING STREAK DATE HELPERS ---
const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getYesterdayDateString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// =========================================================================
// SUBSECTION: CERTIFICATE HTML GENERATOR (LANDSCAPE & PRINT OPTIMIZED)
// =========================================================================
const generateCertificateHTML = (childName: string, milestoneTitle: string, milestoneDesc: string, dateStr?: string) => {
  const cName = childName.trim() || "Little Bee";
  const dStr = dateStr || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Honey Bees Playroom Certificate - ${milestoneTitle}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@400;600;850&family=Outfit:wght@500;800;900&display=swap');
    
    @page {
      size: landscape;
      margin: 0;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      color: #1e293b;
      margin: 0;
      padding: 0;
      background-color: #fafaf9;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
    }
    
    .certificate-border-outer {
      width: 92%;
      height: 88%;
      border: 8px solid #fbbf24;
      border-radius: 24px;
      padding: 4px;
      background-color: #ffffff;
      box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
      box-sizing: border-box;
    }
    
    .certificate-border-inner {
      width: 100%;
      height: 100%;
      border: 3px dashed #d97706;
      border-radius: 18px;
      padding: 30px;
      box-sizing: border-box;
      background-color: #fffbeb;
      background-image: radial-gradient(#fef3c7 1.5px, transparent 1.5px);
      background-size: 24px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      text-align: center;
    }
    
    .logo-area {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .logo-emoji {
      font-size: 36px;
    }
    
    .academy-title {
      font-family: 'Outfit', sans-serif;
      font-weight: 900;
      font-size: 20px;
      color: #78350f;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    
    .academy-sub {
      font-size: 10px;
      color: #d97706;
      font-weight: bold;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-top: 2px;
    }
    
    .main-award-title {
      font-family: 'Outfit', sans-serif;
      font-weight: 900;
      font-size: 36px;
      color: #92400e;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin: 10px 0 5px 0;
      text-shadow: 1px 1px 0px #fef3c7;
    }
    
    .award-sub {
      font-size: 13px;
      color: #78350f;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 1.5px;
    }
    
    .recipient-name {
      font-family: 'Great Vibes', cursive, 'Outfit', sans-serif;
      font-size: 48px;
      color: #d97706;
      margin: 12px 0;
      border-bottom: 2px dashed #f59e0b;
      padding: 0 40px 6px 40px;
      display: inline-block;
      text-shadow: 1px 1px 0px #fff;
    }
    
    .achievement-details {
      font-size: 14px;
      line-height: 1.6;
      color: #78350f;
      max-width: 650px;
      margin: 5px auto;
      font-weight: 500;
    }
    
    .achievement-highlight {
      font-weight: bold;
      color: #b45309;
      background-color: #fef3c7;
      padding: 2px 8px;
      border-radius: 6px;
    }
    
    .certificate-footer {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: 0 30px;
      box-sizing: border-box;
      margin-top: 15px;
    }
    
    .signature-block {
      text-align: left;
    }
    
    .sig-line {
      font-family: 'Great Vibes', cursive, 'Inter', sans-serif;
      font-size: 24px;
      color: #1e293b;
      border-bottom: 1.5px solid #d97706;
      padding-bottom: 2px;
      width: 200px;
      text-align: center;
    }
    
    .sig-title {
      font-size: 10px;
      color: #78350f;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 6px;
      text-align: center;
    }
    
    .seal-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    
    .seal-circle {
      width: 75px;
      height: 75px;
      background-color: #fbbf24;
      border: 4px double #d97706;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      box-shadow: 0 4px 10px rgba(217, 119, 6, 0.2);
    }
    
    .seal-text {
      font-size: 9px;
      font-weight: 850;
      color: #92400e;
      margin-top: 6px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    
    .date-block {
      text-align: right;
    }
    
    .date-val {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 14px;
      color: #1e293b;
      border-bottom: 1.5px solid #d97706;
      padding-bottom: 5px;
      width: 150px;
      text-align: center;
    }
    
    .date-title {
      font-size: 10px;
      color: #78350f;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 6px;
      text-align: center;
    }
    
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
        padding: 0;
        margin: 0;
        height: 100vh;
      }
      .print-controls {
        display: none !important;
      }
      .certificate-border-outer {
        width: 100vw;
        height: 100vh;
        border-radius: 0;
        border-width: 12px;
      }
    }
  </style>
</head>
<body>

  <div class="print-controls">
    <button class="print-btn" onclick="window.print()">🖨️ Print Certificate</button>
    <button class="print-btn" style="background-color: #e2e8f0; color: #475569;" onclick="window.close()">❌ Close Preview</button>
  </div>

  <div class="certificate-border-outer">
    <div class="certificate-border-inner">
      
      <div class="logo-area">
        <span class="logo-emoji">🐝</span>
        <div>
          <div class="academy-title">Honey Bees Playroom</div>
          <div class="academy-sub">Pre-School, Daycare & Learning Centre</div>
        </div>
      </div>
      
      <div>
        <h1 class="main-award-title">Certificate of Completion</h1>
        <div class="award-sub">This official achievement certificate is proudly awarded to</div>
      </div>
      
      <div class="recipient-name">${cName}</div>
      
      <div class="achievement-details">
        for demonstrating outstanding dedication, creative focus, and milestone completion under the guidance of Beatrice Learning Systems by successfully unlocking the
        <br>
        <span class="achievement-highlight">"${milestoneTitle}"</span>
        <br>
        <span style="font-size: 12px; color: #92400e; font-style: italic; margin-top: 4px; display: block;">
          ${milestoneDesc}
        </span>
      </div>
      
      <div class="certificate-footer">
        <div class="signature-block">
          <div class="sig-line">Beatrice AI</div>
          <div class="sig-title">Preschool Director of Beatrice Labs</div>
        </div>
        
        <div class="seal-block">
          <div class="seal-circle">🐝</div>
          <div class="seal-text">HONEY BEES SEAL</div>
        </div>
        
        <div class="date-block">
          <div class="date-val">${dStr}</div>
          <div class="date-title">Date Earned</div>
        </div>
      </div>
      
    </div>
  </div>

</body>
</html>
`;
};

interface Milestone {
  id: string;
  title: string;
  description: string;
  badge: string;
  requirementDesc: string;
  checkUnlocked: (points: number, completed: string[], streak: number) => boolean;
}

const MILESTONES: Milestone[] = [
  {
    id: "ms-alpha-explorer",
    title: "Alphabet Explorer",
    description: "Successfully completed tracing 3 uppercase letters inside the Tracing Slate!",
    badge: "🍎",
    requirementDesc: "Trace 3 alphabet letters",
    checkUnlocked: (_, completed) => completed.filter(id => id.startsWith("tracing-validated-") || id.startsWith("letter-")).length >= 3
  },
  {
    id: "ms-points-50",
    title: "Golden Star Earner",
    description: "Amassed 50 or more Honeybee points from active playroom practices!",
    badge: "🌟",
    requirementDesc: "Reach 50 Honeybee Points",
    checkUnlocked: (points) => points >= 50
  },
  {
    id: "ms-streak-3",
    title: "Dedicated Tracing Streak",
    description: "Maintained a perfect 3-day learning practice streak inside the playrooms!",
    badge: "🔥",
    requirementDesc: "Earn a 3-day practice streak",
    checkUnlocked: (_, __, streak) => streak >= 3
  },
  {
    id: "ms-vocab-champ",
    title: "Vocabulary Champion",
    description: "Mastered spelling and tracing of 3 animal flashcards in the vocabulary zone!",
    badge: "🎨",
    requirementDesc: "Complete 3 Vocabulary Cards",
    checkUnlocked: (_, completed) => completed.filter(id => id.startsWith("vocab-")).length >= 3
  },
  {
    id: "ms-telugu-novice",
    title: "Telugu Language Novice",
    description: "Mastered correct sound association and tracing of 3 Telugu vowels (అచ్చులు)!",
    badge: "🕉️",
    requirementDesc: "Complete 3 Telugu letters",
    checkUnlocked: (_, completed) => completed.filter(id => id.startsWith("telugu-")).length >= 3
  },
  {
    id: "ms-story-lover",
    title: "Avid Story Listener",
    description: "Listened to Beatrice read-along voice overs and successfully answered a story comprehension quiz!",
    badge: "📚",
    requirementDesc: "Complete 1 story reading quiz",
    checkUnlocked: (_, completed) => completed.filter(id => id.startsWith("story-quiz-")).length >= 1
  },
  {
    id: "ms-playroom-champ",
    title: "Playroom Champion",
    description: "Beat a cognitive Memory Flip challenge or doodled on the Magic Kids Sandbox!",
    badge: "🎮",
    requirementDesc: "Complete a memory game or sandbox doodle",
    checkUnlocked: (_, completed) => completed.includes("doodle-board") || completed.some(id => id.startsWith("memory-game-"))
  }
];

export default function Playroom() {
  const [activePlayTab, setActivePlayTab] = useState<"alphabet" | "numbers" | "words" | "telugu" | "stories" | "games" | "parents">("alphabet");
  
  // Child Profile / Progress States
  const [kidName, setKidName] = useState<string>(() => localStorage.getItem("kid_name") || "");
  const [kidAgeGroup, setKidAgeGroup] = useState<string>(() => localStorage.getItem("kid_age") || "3-4"); // Toddler, LKG, UKG
  const [points, setPoints] = useState<number>(() => Number(localStorage.getItem("kid_points")) || 10);
  const [hasRegistered, setHasRegistered] = useState<boolean>(() => !!localStorage.getItem("kid_name"));
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Daily Tracing Streak State (consecutive days of practicing alphabet tracing)
  const [tracingStreak, setTracingStreak] = useState<number>(() => {
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();
    const lastDate = localStorage.getItem("kid_last_practice_date") || "";
    const savedStreak = Number(localStorage.getItem("kid_tracing_streak")) || 0;

    if (lastDate === today || lastDate === yesterday) {
      return savedStreak;
    } else {
      // Streak broken since they missed a day
      return 0;
    }
  });

  // Track task completions
  const [completedActivities, setCompletedActivities] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("completed_activities") || "[]");
    } catch {
      return [];
    }
  });

  const [unlockedMilestones, setUnlockedMilestones] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("unlocked_milestones") || "[]");
    } catch {
      return [];
    }
  });
  
  const [currentMilestoneCelebration, setCurrentMilestoneCelebration] = useState<Milestone | null>(null);

  // Automatic Milestone & Achievement Checker
  useEffect(() => {
    if (!kidName) return; // Do not trigger for anonymous users before register
    
    const newlyUnlocked = MILESTONES.filter(ms => {
      if (unlockedMilestones.includes(ms.id)) return false;
      return ms.checkUnlocked(points, completedActivities, tracingStreak);
    });

    if (newlyUnlocked.length > 0) {
      const nextMilestone = newlyUnlocked[0];
      const updatedUnlocked = [...unlockedMilestones, nextMilestone.id];
      setUnlockedMilestones(updatedUnlocked);
      localStorage.setItem("unlocked_milestones", JSON.stringify(updatedUnlocked));
      setCurrentMilestoneCelebration(nextMilestone);
    }
  }, [points, completedActivities, tracingStreak, kidName]);

  const saveProfile = (name: string, age: string) => {
    localStorage.setItem("kid_name", name);
    localStorage.setItem("kid_age", age);
    localStorage.setItem("kid_points", String(points));
    setKidName(name);
    setKidAgeGroup(age);
    setHasRegistered(true);
  };

  const recordAlphabetPractice = () => {
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();
    const lastDate = localStorage.getItem("kid_last_practice_date") || "";
    let currentStreak = Number(localStorage.getItem("kid_tracing_streak")) || 0;

    if (lastDate === today) {
      // Already practiced today, streak remains unchanged
      return;
    } else if (lastDate === yesterday) {
      // Practiced yesterday, streak incremented
      currentStreak += 1;
    } else {
      // Missed yesterday or first practice, start streak at 1
      currentStreak = 1;
    }

    setTracingStreak(currentStreak);
    localStorage.setItem("kid_tracing_streak", String(currentStreak));
    localStorage.setItem("kid_last_practice_date", today);
  };

  const addPoints = (amount: number, activityId: string) => {
    if (!completedActivities.includes(activityId)) {
      const newCompleted = [...completedActivities, activityId];
      const newPoints = points + amount;
      setPoints(newPoints);
      setCompletedActivities(newCompleted);
      localStorage.setItem("kid_points", String(newPoints));
      localStorage.setItem("completed_activities", JSON.stringify(newCompleted));
      
      // Play a lovely success chime (optional/synth)
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } catch (e) {
        console.log("AudioContext blocked or un-supported");
      }
    }
  };

  // Text to Speech Helper
  const speakText = (text: string, lang = "en-US") => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Stop current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9; // Kids friendly slow rate
      utterance.pitch = 1.25; // Slightly higher cute pitch

      // Try to find a friendly child-like or female voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        (v.lang.includes(lang) && (v.name.includes("Zira") || v.name.includes("Google") || v.name.includes("Natural")))
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-yellow-50/20 dark:bg-slate-950 min-h-screen py-8 sm:py-12 relative overflow-hidden font-sans transition-colors duration-350">
      
      {/* Cartoon clouds and sunshine backdrop decorators */}
      <div className="absolute top-10 left-10 w-32 h-16 bg-white/70 dark:bg-slate-900/30 rounded-full blur-md animate-pulse pointer-events-none" />
      <div className="absolute top-24 right-16 w-24 h-12 bg-white/60 dark:bg-slate-900/30 rounded-full blur-md pointer-events-none" />
      <div className="absolute bottom-20 left-6 w-28 h-14 bg-white/50 dark:bg-slate-900/30 rounded-full blur-lg pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Kid Profile Registration Header */}
        {!hasRegistered ? (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 border-4 border-yellow-300 rounded-[36px] p-6 sm:p-10 text-center shadow-xl max-w-xl mx-auto space-y-6"
          >
            <div className="text-6xl animate-bounce">🎈🧸🍯</div>
            <div className="space-y-2">
              <h2 className="font-display font-black text-3xl text-slate-900 dark:text-white tracking-tight">
                Welcome to Honey Bees Playroom!
              </h2>
              <p className="text-slate-500 dark:text-slate-350 text-xs sm:text-sm">
                Enter your child's nickname to customize games, track star badges, and check learning reports!
              </p>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const nameInput = form.elements.namedItem("nickname") as HTMLInputElement;
                const ageInput = form.elements.namedItem("ageGroup") as HTMLSelectElement;
                if (nameInput.value.trim()) {
                  saveProfile(nameInput.value.trim(), ageInput.value);
                }
              }}
              className="space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">
                    Child's Nickname
                  </label>
                  <input
                    name="nickname"
                    type="text"
                    placeholder="e.g. Leo, Cherry"
                    maxLength={15}
                    className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-2xl p-3.5 focus:outline-none focus:border-yellow-400 font-sans text-xs font-bold"
                    required
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">
                    Age Group
                  </label>
                  <select
                    name="ageGroup"
                    className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-2xl p-3.5 focus:outline-none focus:border-yellow-400 font-sans text-xs font-bold"
                  >
                    <option value="2-3">Toddlers (2-3 Years)</option>
                    <option value="4-5">LKG (4-5 Years)</option>
                    <option value="5-6">UKG (5-6 Years)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-display font-black py-4 rounded-2xl transition-all cursor-pointer shadow-lg shadow-yellow-300/30 text-xs flex justify-center items-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
              >
                Let's Play & Learn! <ChevronRight size={16} />
              </button>
            </form>
          </motion.div>
        ) : (
          /* Profile Strip Header */
          <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 rounded-[32px] p-4 sm:p-6 shadow-md border-b-4 border-amber-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-4xl sm:text-5xl bg-white p-2.5 rounded-2xl shadow-inner animate-bounce">
                🐝
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                    Hello, {kidName}! 👋
                  </h1>
                  <span className="text-[10px] font-extrabold bg-slate-900 text-yellow-400 px-2 py-0.5 rounded-full">
                    Ages {kidAgeGroup}
                  </span>
                  {tracingStreak > 0 && (
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-[10px] font-black bg-orange-600 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-orange-500/30 animate-pulse"
                      title="Daily Alphabet Tracing Streak!"
                    >
                      🔥 {tracingStreak}-Day Streak
                    </motion.span>
                  )}
                </div>
                <p className="text-xs text-slate-950/80 font-medium font-sans">
                  Ready to earn some golden stars today? Pick any playground below!
                </p>
              </div>
            </div>

            {/* Kid Stats Scoreboard */}
            <div className="flex items-center gap-4">
              <div className="bg-white/90 backdrop-blur-xs py-2 px-4 rounded-2xl border border-yellow-300 flex items-center gap-2 shadow-xs">
                <Trophy size={16} className="text-amber-500 animate-pulse" />
                <span className="font-display font-black text-slate-900 text-sm">
                  {points} <span className="text-xs text-slate-500 font-sans font-bold">Stars</span>
                </span>
              </div>
              {showResetConfirm ? (
                <div className="flex items-center gap-2 bg-white/95 rounded-2xl p-1.5 border border-red-300 shadow-sm">
                  <span className="text-[10px] font-bold text-red-600 px-1">Reset Profile?</span>
                  <button
                    onClick={() => {
                      localStorage.removeItem("kid_name");
                      localStorage.removeItem("kid_age");
                      localStorage.removeItem("kid_points");
                      localStorage.removeItem("completed_activities");
                      localStorage.removeItem("kid_tracing_streak");
                      localStorage.removeItem("kid_last_practice_date");
                      setPoints(10);
                      setCompletedActivities([]);
                      setTracingStreak(0);
                      setHasRegistered(false);
                      setShowResetConfirm(false);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-2.5 py-1 rounded-xl text-[9px] font-black cursor-pointer transition-all hover:scale-105 active:scale-95"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-xl text-[9px] font-black cursor-pointer transition-all hover:scale-105 active:scale-95"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="bg-red-500/10 hover:bg-red-500 text-red-700 hover:text-white p-2.5 rounded-xl border border-red-500/20 text-[10px] font-bold cursor-pointer transition-all"
                  title="Change Kid Profile"
                >
                  Change Player
                </button>
              )}
            </div>
          </div>
        )}

        {/* Playroom Sub-navigation Carousel tabs */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "alphabet", label: "A-Z Alphabet 🍎", bg: "bg-rose-100 text-rose-800 border-rose-200" },
            { id: "numbers", label: "Numbers 1-100 🔢", bg: "bg-sky-100 text-sky-800 border-sky-200" },
            { id: "words", label: "Word Cards 🎨", bg: "bg-violet-100 text-violet-800 border-violet-200" },
            { id: "telugu", label: "తెలుగు Varnamala 🕉️", bg: "bg-emerald-100 text-emerald-800 border-emerald-200" },
            { id: "stories", label: "Story Time 📚", bg: "bg-amber-100 text-amber-800 border-amber-200" },
            { id: "games", label: "Games Slate 🎮", bg: "bg-indigo-100 text-indigo-800 border-indigo-200" },
            { id: "parents", label: "Parent Zone 👨‍👩‍👦", bg: "bg-slate-100 text-slate-800 border-slate-200" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePlayTab(tab.id as any)}
              className={`px-5 py-3 rounded-2xl font-display font-extrabold text-xs tracking-wide cursor-pointer transition-all border shrink-0 ${
                activePlayTab === tab.id 
                  ? `${tab.bg} ring-2 ring-slate-900 ring-offset-2 scale-105 shadow-md` 
                  : "bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50 shadow-2xs"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- Primary Tabs Area --- */}
        <AnimatePresence mode="wait">
          
          {/* ======================================= */}
          {/* 1. ENGLISH ALPHABET TAB */}
          {/* ======================================= */}
          {activePlayTab === "alphabet" && (
            <motion.div
              key="alphabet"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <AlphabetSection 
                onCompleteActivity={(id) => {
                  addPoints(5, id);
                  recordAlphabetPractice();
                }} 
                speakText={speakText} 
                tracingStreak={tracingStreak}
              />
            </motion.div>
          )}

          {/* ======================================= */}
          {/* 2. NUMBERS 1-100 TAB */}
          {/* ======================================= */}
          {activePlayTab === "numbers" && (
            <motion.div
              key="numbers"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <NumbersSection onCompleteActivity={(id) => addPoints(5, id)} speakText={speakText} />
            </motion.div>
          )}

          {/* ======================================= */}
          {/* 3. WORD CARDS VOCAB TAB */}
          {/* ======================================= */}
          {activePlayTab === "words" && (
            <motion.div
              key="words"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <VocabSection onCompleteActivity={(id) => addPoints(5, id)} speakText={speakText} />
            </motion.div>
          )}

          {/* ======================================= */}
          {/* 4. TELUGU VARNAMALA TAB */}
          {/* ======================================= */}
          {activePlayTab === "telugu" && (
            <motion.div
              key="telugu"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <TeluguSection onCompleteActivity={(id) => addPoints(8, id)} speakText={speakText} />
            </motion.div>
          )}

          {/* ======================================= */}
          {/* 5. STORY TIME TAB */}
          {/* ======================================= */}
          {activePlayTab === "stories" && (
            <motion.div
              key="stories"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <StoriesSection onCompleteActivity={(id) => addPoints(10, id)} speakText={speakText} />
            </motion.div>
          )}

          {/* ======================================= */}
          {/* 6. GAMES & COLORING TAB */}
          {/* ======================================= */}
          {activePlayTab === "games" && (
            <motion.div
              key="games"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <GamesSection onCompleteActivity={(id) => addPoints(10, id)} />
            </motion.div>
          )}

          {/* ======================================= */}
          {/* 7. PARENT REPORT ZONE */}
          {/* ======================================= */}
          {activePlayTab === "parents" && (
            <motion.div
              key="parents"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <ParentsSection 
                points={points} 
                completed={completedActivities} 
                ageGroup={kidAgeGroup} 
                kidName={kidName} 
                tracingStreak={tracingStreak}
              />
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* Dynamic Celebration & Print Milestone Certificate Modal */}
      <AnimatePresence>
        {currentMilestoneCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto font-sans text-left"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-[36px] border-4 border-amber-400 p-8 shadow-2xl max-w-2xl w-full text-center space-y-6 relative overflow-hidden"
            >
              {/* Confetti styling blocks */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400" />
              
              <div className="text-6xl animate-bounce mt-4 select-none">🎉</div>
              
              <div className="space-y-2">
                <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                  New Milestone Unlocked! 🏆
                </span>
                <h3 className="font-display font-black text-2xl text-slate-900 mt-2">
                  Congratulations, {kidName}!
                </h3>
                <p className="text-sm font-medium text-amber-600 max-w-md mx-auto">
                  You just earned the <strong className="font-display text-amber-700">{currentMilestoneCelebration.title}</strong> badge!
                </p>
              </div>

              <div className="bg-amber-50/50 border-2 border-dashed border-amber-200 p-5 rounded-2xl space-y-3 relative max-w-md mx-auto">
                <span className="text-5xl block select-none">{currentMilestoneCelebration.badge}</span>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {currentMilestoneCelebration.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 max-w-md mx-auto">
                <button
                  onClick={() => {
                    const htmlContent = generateCertificateHTML(
                      kidName || "Little Bee",
                      currentMilestoneCelebration.title,
                      currentMilestoneCelebration.description
                    );
                    const printWindow = window.open("", "_blank");
                    if (printWindow) {
                      printWindow.document.write(htmlContent);
                      printWindow.document.close();
                      setTimeout(() => {
                        printWindow.focus();
                        printWindow.print();
                      }, 500);
                    }
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-display font-black text-xs py-3.5 px-6 rounded-2xl cursor-pointer shadow-lg shadow-amber-500/20 transition-all hover:scale-102 active:scale-98 flex items-center justify-center gap-1.5"
                >
                  🖨️ Print My Certificate!
                </button>
                <button
                  onClick={() => setCurrentMilestoneCelebration(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-black text-xs py-3.5 px-6 rounded-2xl cursor-pointer transition-all hover:scale-102 active:scale-98"
                >
                  Keep Playing! 🚀
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// =========================================================================
// SUBSECTION: ALPHABET LEARNING
// =========================================================================
function LetterStrokeAnimator({ letter, speakText }: { letter: string; speakText: (txt: string) => void }) {
  const [animationKey, setAnimationKey] = useState(0);
  const strokes = LETTER_STROKES[letter] || [];

  const playSequence = () => {
    setAnimationKey(prev => prev + 1);
    
    // Child-friendly voice directions synchronized with stroke indices
    speakText(`Let's learn how to write the letter ${letter}!`);
    
    const strokeDirections: Record<string, string[]> = {
      A: ["First, slide down to the left!", "Next, slide down to the right!", "And cross in the middle! Great job!"],
      B: ["Draw a straight line down!", "Curve around to the middle!", "Curve around to the bottom! Splendid!"],
      C: ["Start near the top right, and curve all the way down and around like a big moon!"],
      D: ["Draw a straight line down!", "Make a big round belly curve from the top to the bottom!"],
      E: ["Draw a straight line down!", "Slide straight across the top!", "Slide straight across the middle!", "Slide straight across the bottom!"],
      F: ["Draw a straight line down!", "Slide straight across the top!", "Slide straight across the middle!"],
      G: ["Make a big round curve around like a C!", "Go up and make a small shelf line inside!"],
      H: ["Line one straight down!", "Line two straight down on the right!", "Connect them across the middle! Wonderful!"],
      I: ["Line straight down in the center!", "Slide across the top!", "Slide across the bottom!"],
      J: ["Slide across the top!", "Line straight down and scoop up on the left like an umbrella hook!"],
      K: ["Line straight down!", "Slide in from the top right!", "Slide down to the bottom right!"],
      L: ["Line straight down!", "Slide straight across to the right!"],
      M: ["Line straight up on the left!", "Slide down to the middle!", "Slide back up to the top!", "Line straight down to the bottom!"],
      N: ["Line straight up!", "Slide diagonally down to the right!", "Line straight up to the top!"],
      O: ["Start at the top, and curve all the way around in a big friendly circle!"],
      P: ["Line straight down!", "Make a neat curve from the top to the middle!"],
      Q: ["Make a big round circle first!", "Add a little kick tail at the bottom right!"],
      R: ["Line straight down!", "Make a curve to the middle!", "Slide down to the bottom right!"],
      S: ["Curve to the left, then curve back to the right like a snake! Slither slither!"],
      T: ["Slide across the top!", "Line straight down from the middle!"],
      U: ["Go down, curve at the bottom, and head straight back up!"],
      V: ["Slide diagonally down!", "Slide diagonally straight back up to the top!"],
      W: ["Slide down, slide up, slide down, and slide back up!"],
      X: ["Slide diagonally down-right!", "Slide diagonally down-left across!"],
      Y: ["Make a small V shape at the top!", "Draw a straight stem down to the bottom!"],
      Z: ["Slide across the top!", "Slide diagonally down-left!", "Slide across the bottom!"],
    };

    const directions = strokeDirections[letter] || ["Draw along the path!"];
    directions.forEach((direction, idx) => {
      setTimeout(() => {
        speakText(direction);
      }, (idx + 1) * 1600);
    });
  };

  useEffect(() => {
    // Play sequence automatically when a new letter is loaded
    const timer = setTimeout(() => {
      playSequence();
    }, 400);
    return () => clearTimeout(timer);
  }, [letter]);

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-lg border-4 border-slate-800 space-y-4 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-yellow-400 font-mono flex items-center gap-1">
          🐝 Guided Writing Stroke Sequence
        </span>
        <button
          onClick={playSequence}
          className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all"
        >
          <RotateCcw size={10} /> Replay
        </button>
      </div>

      <div className="relative aspect-square bg-slate-950 border-2 border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center p-6">
        <svg viewBox="0 0 100 100" className="w-full h-full max-w-[220px] max-h-[220px]" key={animationKey}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
            </marker>
          </defs>

          {/* Core sequential CSS-based stroke keyframes */}
          <style>{`
            ${strokes.map((_, index) => `
              .stroke-${letter}-${index} {
                stroke-dasharray: 200;
                stroke-dashoffset: 200;
                animation: draw-stroke-${letter}-${index} 1.4s ease-in-out forwards;
                animation-delay: ${index * 1.5}s;
              }
              @keyframes draw-stroke-${letter}-${index} {
                to {
                  stroke-dashoffset: 0;
                }
              }
            `).join("\n")}
          `}</style>

          {/* Underlay dark trace lines */}
          {strokes.map((path, idx) => (
            <path
              key={`bg-${idx}`}
              d={path}
              fill="none"
              stroke="#1E293B"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Dotted helper lines with directional arrow tips */}
          {strokes.map((path, idx) => (
            <path
              key={`dotted-${idx}`}
              d={path}
              fill="none"
              stroke="#334155"
              strokeWidth="2"
              strokeDasharray="4 4"
              strokeLinecap="round"
              strokeLinejoin="round"
              markerEnd="url(#arrow)"
            />
          ))}

          {/* Beautiful animated glowing gold foreground lines representing honey trail */}
          {strokes.map((path, idx) => (
            <path
              key={`fg-${idx}`}
              d={path}
              className={`stroke-${letter}-${idx}`}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>

        {/* Small badge displaying stroke counter */}
        <div className="absolute bottom-3 right-3 bg-yellow-400 text-slate-950 font-display font-extrabold text-[9px] px-2 py-0.5 rounded-full">
          {strokes.length} {strokes.length === 1 ? "Stroke" : "Strokes"}
        </div>
      </div>

      <div className="text-center space-y-1">
        <p className="text-[11px] text-slate-300 font-bold font-sans">
          Look closely at how the strokes are built!
        </p>
        <span className="text-[9px] text-slate-500 block leading-snug">
          Vocal instructions describe direction in real-time.
        </span>
      </div>
    </div>
  );
}

function AlphabetSection({ 
  onCompleteActivity, 
  speakText,
  tracingStreak
}: { 
  onCompleteActivity: (id: string) => void; 
  speakText: (txt: string) => void;
  tracingStreak: number
}) {
  const [selectedLetter, setSelectedLetter] = useState<AlphabetLetter>(ALPHABET_LIST[0]);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"sandbox" | "guided">("sandbox");

  // Dynamic Playroom Videos States
  const [playroomVideos, setPlayroomVideos] = useState<Record<string, Array<{ id: string; title: string; url: string }>>>({});
  const [activeVideoId, setActiveVideoId] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [demoAdminOverride, setDemoAdminOverride] = useState(false);
  
  // Video Add Form State
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch playroom videos from server on mount
  const fetchPlayroomVideos = () => {
    fetch("/api/playroom/videos")
      .then(res => res.json())
      .then(data => {
        setPlayroomVideos(data);
      })
      .catch(err => console.error("Failed to load playroom videos from API:", err));
  };

  useEffect(() => {
    fetchPlayroomVideos();

    // Check if authenticated user is admin
    try {
      const userStr = localStorage.getItem("honeybees_current_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setIsAdmin(user?.role === "admin");
      } else {
        setIsAdmin(localStorage.getItem("honeybees_admin_authenticated") === "true");
      }
    } catch (e) {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    setFormError("");
    setFormSuccess("");
    setNewVideoTitle("");
    setNewVideoUrl("");
    setActiveVideoId("");
  }, [selectedLetter]);

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1]?.split("&")[0];
    } else if (url.includes("embed/")) {
      videoId = url.split("embed/")[1]?.split("?")[0];
    }
    
    if (videoId) {
      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    }
    return url;
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    if (!newVideoTitle.trim() || !newVideoUrl.trim()) {
      setFormError("Both title and video URL are required.");
      return;
    }

    const cleanUrl = getEmbedUrl(newVideoUrl.trim());
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/playroom/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          letter: selectedLetter.letter,
          title: newVideoTitle.trim(),
          url: cleanUrl
        })
      });

      const data = await response.json();
      if (response.ok) {
        setFormSuccess("Phonics lesson video added successfully! 🐝");
        setNewVideoTitle("");
        setNewVideoUrl("");
        fetchPlayroomVideos();
      } else {
        setFormError(data.error || "Failed to add video.");
      }
    } catch (err) {
      setFormError("Connection error to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    setFormError("");
    setFormSuccess("");
    if (!confirm("Are you sure you want to delete this educational song video from the playlist?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/playroom/videos/${selectedLetter.letter}/${videoId}`, {
        method: "DELETE"
      });

      const data = await response.json();
      if (response.ok) {
        setFormSuccess("Video removed from library.");
        fetchPlayroomVideos();
        if (activeVideoId === videoId) {
          setActiveVideoId("");
        }
      } else {
        setFormError(data.error || "Failed to delete video.");
      }
    } catch (err) {
      setFormError("Connection error.");
    }
  };

  // Canvas Tracing States
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tracePoints, setTracePoints] = useState<{ x: number; y: number; visited: boolean }[]>([]);
  const [traceSuccess, setTraceSuccess] = useState<boolean>(false);
  const [drawnPaths, setDrawnPaths] = useState<{ x: number; y: number }[][]>([]);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);

  // Sample SVG paths to generate target checkpoints
  const generatePoints = (letter: string) => {
    const strokes = LETTER_STROKES[letter] || [];
    const points: { x: number; y: number; visited: boolean }[] = [];

    strokes.forEach((stroke) => {
      try {
        const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathEl.setAttribute("d", stroke);
        const totalLen = pathEl.getTotalLength();
        
        // Sample about 12 points per stroke
        const stepsCount = 12;
        const step = Math.max(1.5, totalLen / stepsCount);
        for (let d = 0; d <= totalLen + 0.1; d += step) {
          const pt = pathEl.getPointAtLength(Math.min(d, totalLen));
          points.push({
            x: pt.x,
            y: pt.y,
            visited: false,
          });
        }
      } catch (err) {
        console.warn("Failed to generate path points:", err);
      }
    });

    // Fallback if empty
    if (points.length === 0) {
      points.push({ x: 30, y: 50, visited: false });
      points.push({ x: 50, y: 50, visited: false });
      points.push({ x: 70, y: 50, visited: false });
    }

    return points;
  };

  useEffect(() => {
    // Generate new trace points and clear previous paths on letter change
    const points = generatePoints(selectedLetter.letter);
    setTracePoints(points);
    setTraceSuccess(false);
    setDrawnPaths([]);
    setCurrentPath([]);
    setIsPlayingVideo(false);
  }, [selectedLetter]);

  useEffect(() => {
    drawEverything();
  }, [drawnPaths, currentPath, tracePoints, selectedLetter, activeSubTab]);

  const drawEverything = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // 1. Slate chalkboard background
    ctx.fillStyle = "#0F172A"; // Slate-900
    ctx.fillRect(0, 0, W, H);

    // 2. Draw thick skeleton guide path
    const strokes = LETTER_STROKES[selectedLetter.letter] || [];
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.strokeStyle = "rgba(51, 65, 85, 0.4)"; // Translucent Slate-700
    ctx.lineWidth = 18;
    strokes.forEach((stroke) => {
      try {
        const path = new Path2D(stroke);
        ctx.save();
        ctx.scale(W / 100, H / 100);
        ctx.stroke(path);
        ctx.restore();
      } catch (e) {}
    });

    // Dotted guideline down the middle
    ctx.strokeStyle = "rgba(148, 163, 184, 0.5)"; // Slate-400
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    strokes.forEach((stroke) => {
      try {
        const path = new Path2D(stroke);
        ctx.save();
        ctx.scale(W / 100, H / 100);
        ctx.stroke(path);
        ctx.restore();
      } catch (e) {}
    });
    ctx.setLineDash([]); // Reset dash

    // 3. Draw child's strokes (glowing neon orange/amber)
    ctx.strokeStyle = "#F59E0B"; // Amber-500
    ctx.lineWidth = 10;
    const drawLine = (path: { x: number; y: number }[]) => {
      if (path.length === 0) return;
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.stroke();
    };

    drawnPaths.forEach(drawLine);
    drawLine(currentPath);

    // 4. Draw checkpoints (visited vs unvisited guides)
    tracePoints.forEach((pt) => {
      const cx = (pt.x / 100) * W;
      const cy = (pt.y / 100) * H;

      if (pt.visited) {
        // Glowing completed emerald green dot
        ctx.fillStyle = "#10B981"; // Emerald-500
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing ring
        ctx.strokeStyle = "rgba(16, 185, 129, 0.3)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 10, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Soft unvisited template guide dot
        ctx.fillStyle = "rgba(226, 232, 240, 0.7)"; // Slate-200
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  const checkProximity = (x: number, y: number, W: number, H: number) => {
    const normX = (x / W) * 100;
    const normY = (y / H) * 100;

    let updated = false;
    const nextPoints = tracePoints.map((pt) => {
      if (!pt.visited) {
        const dist = Math.hypot(pt.x - normX, pt.y - normY);
        if (dist < 8) { // Generous 8% coordinate radius for child touch friendliness
          updated = true;
          return { ...pt, visited: true };
        }
      }
      return pt;
    });

    if (updated) {
      setTracePoints(nextPoints);
      const visitedCount = nextPoints.filter((pt) => pt.visited).length;
      const totalCount = nextPoints.length;
      const completionPercent = (visitedCount / totalCount) * 100;

      if (completionPercent >= 85 && !traceSuccess) {
        setTraceSuccess(true);
        speakText(`Superb! You completed writing the letter ${selectedLetter.letter}! You got 5 star points!`);
        onCompleteActivity(`tracing-validated-${selectedLetter.letter}`);
      }
    }
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (traceSuccess) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;

      if ("touches" in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const width = rect.width || canvas.width;
      const height = rect.height || canvas.height;
      const x = ((clientX - rect.left) / width) * canvas.width;
      const y = ((clientY - rect.top) / height) * canvas.height;

      setIsDrawing(true);
      setCurrentPath([{ x, y }]);
      checkProximity(x, y, canvas.width, canvas.height);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || traceSuccess) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;

      if ("touches" in e) {
        if (e.cancelable) {
          e.preventDefault();
        }
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const width = rect.width || canvas.width;
      const height = rect.height || canvas.height;
      const x = ((clientX - rect.left) / width) * canvas.width;
      const y = ((clientY - rect.top) / height) * canvas.height;

      setCurrentPath((prev) => [...prev, { x, y }]);
      checkProximity(x, y, canvas.width, canvas.height);
    }
  };

  const stopDraw = () => {
    if (isDrawing) {
      setIsDrawing(false);
      if (currentPath.length > 0) {
        setDrawnPaths((prev) => [...prev, currentPath]);
        setCurrentPath([]);
      }
    }
  };

  const resetTracing = () => {
    setDrawnPaths([]);
    setCurrentPath([]);
    setTraceSuccess(false);
    const resetPoints = tracePoints.map((pt) => ({ ...pt, visited: false }));
    setTracePoints(resetPoints);
    speakText(`Let's trace the letter ${selectedLetter.letter} again!`);
  };

  const handleNextLetter = () => {
    const currentIndex = ALPHABET_LIST.findIndex((item) => item.letter === selectedLetter.letter);
    const nextIndex = (currentIndex + 1) % ALPHABET_LIST.length;
    setSelectedLetter(ALPHABET_LIST[nextIndex]);
    speakText(ALPHABET_LIST[nextIndex].letter);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      
      {/* 26 Letters Selector Board */}
      <div className="lg:col-span-1 bg-white border-4 border-rose-200 rounded-[32px] p-5 shadow-sm space-y-4">
        {/* Daily Tracing Streak Banner */}
        <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-2xl p-3.5 border border-orange-500/25 flex items-center gap-3">
          <div className="bg-orange-500 text-white text-xl p-2 rounded-xl shadow-sm animate-pulse flex items-center justify-center shrink-0">
            🔥
          </div>
          <div className="space-y-0.5">
            <h4 className="font-display font-black text-slate-900 text-xs flex items-center gap-1.5 leading-tight">
              {tracingStreak > 0 ? `${tracingStreak}-Day Tracing Streak!` : "Start Your Streak!"}
            </h4>
            <p className="text-[10px] text-slate-500 font-bold leading-normal">
              {tracingStreak > 0 
                ? "Awesome! Keep practicing every day to grow your streak!" 
                : "Complete tracing a letter today to start your daily streak!"}
            </p>
          </div>
        </div>

        <h3 className="font-display font-black text-slate-900 text-xs flex items-center gap-1.5 pl-1 text-rose-600">
          ✨ Tap to Pronounce Letters
        </h3>
        
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
          {ALPHABET_LIST.map((item) => (
            <button
              key={item.letter}
              onClick={() => {
                setSelectedLetter(item);
                speakText(item.letter);
                onCompleteActivity(`letter-${item.letter}`);
              }}
              className={`aspect-square rounded-2xl font-display font-black text-base flex flex-col justify-center items-center shadow-3xs cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                selectedLetter.letter === item.letter
                  ? "bg-rose-500 text-white ring-2 ring-rose-500 border-none scale-105"
                  : "bg-rose-50 hover:bg-rose-100 text-rose-800 border-2 border-rose-200/50"
              }`}
            >
              <span className="text-xl leading-none">{item.letter}</span>
              <span className="text-[9px] opacity-75 font-sans font-bold leading-none mt-1">{item.emoji}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Feature / Tracing Slate */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Phonetics & Presentation Banner */}
        <div className="bg-white border-4 border-rose-200 rounded-[32px] p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <span className="text-7xl leading-none">{selectedLetter.emoji}</span>
            <div>
              <h4 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
                {selectedLetter.letter} is for {selectedLetter.word}!
              </h4>
              <p className="text-xs text-rose-600 font-mono font-bold mt-1.5 flex items-center gap-1.5 justify-center sm:justify-start">
                Pronounced: <code className="bg-rose-50 text-rose-700 px-2.5 py-1 rounded-md">"{selectedLetter.phonetics}"</code>
              </p>
            </div>
          </div>

          <button
            onClick={() => speakText(`${selectedLetter.letter} is for ${selectedLetter.word}`)}
            className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold px-5 py-3 rounded-2xl text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-rose-500/20"
          >
            <Volume2 size={15} /> Play Sound
          </button>
        </div>

        {/* Sub-Tabs Switcher for Play & Learn Modes */}
        <div className="flex gap-2.5 bg-rose-50 p-1.5 rounded-2xl border border-rose-100">
          <button
            onClick={() => {
              setActiveSubTab("sandbox");
              onCompleteActivity(`sandbox-subtab-${selectedLetter.letter}`);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === "sandbox"
                ? "bg-rose-500 text-white shadow-xs"
                : "text-rose-700 hover:bg-rose-100"
            }`}
          >
            ✍️ Chalkboard Sandbox
          </button>
          <button
            onClick={() => {
              setActiveSubTab("guided");
              onCompleteActivity(`guided-subtab-${selectedLetter.letter}`);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === "guided"
                ? "bg-rose-500 text-white shadow-xs"
                : "text-rose-700 hover:bg-rose-100"
            }`}
          >
            🐝 Animated Writing Guide
          </button>
        </div>

        {/* Tracing slate + Video card split */}
        <div className="grid sm:grid-cols-2 gap-6">
          
          {/* Sub Tab contents: Sandbox Canvas vs Guided Stroke Animator */}
          {activeSubTab === "sandbox" ? (
            <div className="bg-slate-900 text-white rounded-[32px] p-5 shadow-lg border-4 border-slate-800 space-y-3 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-mono flex items-center gap-1">
                  <PenTool size={11} className="text-yellow-400" /> Letter Tracing Sandbox
                </span>
                <button
                  onClick={resetTracing}
                  className="text-[10px] font-bold text-slate-400 hover:text-white underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={10} /> Reset guide
                </button>
              </div>

              <div className="relative aspect-square bg-slate-950 border-2 border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={500}
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={stopDraw}
                  onMouseLeave={stopDraw}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={stopDraw}
                  className="w-full h-full cursor-crosshair relative z-1"
                />

                {/* Celebration Victory Screen when letter tracing is completely successful */}
                {traceSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-slate-950/95 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4 z-10 space-y-4"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-5xl"
                    >
                      🏆👑✨
                    </motion.div>
                    <div className="space-y-1">
                      <h4 className="font-display font-black text-emerald-400 text-base uppercase tracking-wider animate-pulse">
                        Splendid Tracing!
                      </h4>
                      <p className="text-xs text-slate-300 font-bold px-4 leading-normal">
                        You successfully finished tracing the letter <span className="text-yellow-400 font-black text-sm">{selectedLetter.letter}</span>!
                      </p>
                      <span className="text-[9px] text-slate-500 block">
                        Completed with 100% path accuracy!
                      </span>
                    </div>

                    <div className="flex gap-2.5 w-full max-w-[200px]">
                      <button
                        onClick={resetTracing}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-[10px] py-2 rounded-xl border border-slate-700 cursor-pointer"
                      >
                        ✍️ Retrace
                      </button>
                      <button
                        onClick={handleNextLetter}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-[10px] py-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Next <ArrowRight size={12} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 px-1">
                <span>✨ Draw along the dots!</span>
                <span>
                  Progress: {Math.min(100, Math.round((tracePoints.filter((p) => p.visited).length / Math.max(1, tracePoints.length)) * 100))}%
                </span>
              </div>
            </div>
          ) : (
            <LetterStrokeAnimator letter={selectedLetter.letter} speakText={speakText} />
          )}

          {/* Video / Rhymes player */}
          <div className="bg-white border-4 border-rose-200 rounded-[32px] p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full">
                Learning Song Video
              </span>
              <h4 className="font-display font-black text-slate-900 text-sm mt-3">
                Watch animated letter lesson
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Enjoy safe ad-free animated educational nursery rhyme explaining alphabet phonetics.
              </p>
            </div>

            {/* Dynamic playlist of videos for this letter */}
            {(() => {
              const currentLetterVideos = playroomVideos[selectedLetter.letter] || [
                { id: "v-default", title: "Phonics Lesson Song", url: selectedLetter.videoUrl }
              ];
              const activeVideo = currentLetterVideos.find(v => v.id === activeVideoId) || currentLetterVideos[0];

              return (
                <div className="space-y-4">
                  {currentLetterVideos.length === 0 ? (
                    <div className="bg-slate-50 rounded-2xl p-6 border border-dashed border-slate-200 text-center flex flex-col items-center justify-center space-y-2">
                      <span className="text-3xl">🎥</span>
                      <h5 className="text-xs font-bold text-slate-700">No videos available</h5>
                      <p className="text-[10px] text-slate-400">Please add an educational song video using the administrator panel below.</p>
                    </div>
                  ) : (
                    <>
                      {/* Video Selector Playlist if there is more than 1 video */}
                      {currentLetterVideos.length > 1 && (
                        <div className="space-y-1.5">
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block font-mono">
                            Select Video Lesson ({currentLetterVideos.length})
                          </span>
                          <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-150">
                            {currentLetterVideos.map((vid) => (
                              <button
                                key={vid.id}
                                onClick={() => {
                                  setActiveVideoId(vid.id);
                                  setIsPlayingVideo(true);
                                }}
                                className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                                  (activeVideo?.id === vid.id)
                                    ? "bg-rose-500 text-white border-rose-500 shadow-3xs scale-102"
                                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                                }`}
                              >
                                <span>🎬</span>
                                <span className="truncate max-w-[120px]">{vid.title}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {!isPlayingVideo ? (
                        <div className="relative aspect-video bg-rose-50 rounded-2xl overflow-hidden border border-rose-100 flex flex-col items-center justify-center p-4 text-center group">
                          <div className="absolute inset-0 bg-rose-500/5 group-hover:bg-rose-500/10 transition-colors" />
                          <button
                            onClick={() => {
                              setIsPlayingVideo(true);
                              onCompleteActivity(`video-${selectedLetter.letter}`);
                            }}
                            className="w-12 h-12 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all group-hover:scale-110 relative z-10"
                          >
                            <Play size={20} className="fill-white ml-0.5" />
                          </button>
                          <span className="text-[10px] font-black text-rose-700 font-mono mt-3 relative z-10">
                            Play: {activeVideo?.title || "Phonics Lesson"}
                          </span>
                        </div>
                      ) : (
                        <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
                          <iframe
                            src={`${(activeVideo?.url || selectedLetter.videoUrl).replace("youtube.com", "youtube-nocookie.com")}?rel=0&modestbranding=1&autoplay=1`}
                            title="Preschool Rhyme Lesson"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                          <button
                            onClick={() => setIsPlayingVideo(false)}
                            className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-1 rounded-md hover:bg-slate-950"
                          >
                            Close Video
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {/* Admin Controls Panel */}
                  <div className="pt-2 border-t border-slate-100 mt-2 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 font-mono flex items-center gap-1">
                        🛡️ Administrator Access Panel
                      </span>
                      
                      {/* Admin Mode Status or Dev Bypass Toggle */}
                      {!isAdmin ? (
                        <button
                          onClick={() => setDemoAdminOverride(prev => !prev)}
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                            demoAdminOverride 
                              ? "bg-yellow-400 text-slate-950 border-yellow-500" 
                              : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          {demoAdminOverride ? "⚡ Admin Demo Mode: ACTIVE" : "🔐 Switch to Admin (Demo)"}
                        </button>
                      ) : (
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          ● Authenticated Administrator
                        </span>
                      )}
                    </div>

                    {(isAdmin || demoAdminOverride) ? (
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
                        <h5 className="text-[10px] font-extrabold text-slate-700 flex items-center gap-1 uppercase tracking-wide">
                          Manage Videos for Letter "{selectedLetter.letter}"
                        </h5>

                        {/* Add Video Form */}
                        <form onSubmit={handleAddVideo} className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Video Title (e.g. Letter A Rap)"
                              value={newVideoTitle}
                              onChange={(e) => setNewVideoTitle(e.target.value)}
                              className="bg-white border border-slate-200 rounded-lg p-1.5 text-[10px] focus:outline-none focus:border-rose-400 text-slate-800 w-full"
                            />
                            <input
                              type="text"
                              placeholder="YouTube Link or Embed URL"
                              value={newVideoUrl}
                              onChange={(e) => setNewVideoUrl(e.target.value)}
                              className="bg-white border border-slate-200 rounded-lg p-1.5 text-[10px] focus:outline-none focus:border-rose-400 text-slate-800 w-full"
                            />
                          </div>
                          
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-black text-[9.5px] py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            <Plus size={11} /> {isSubmitting ? "Saving..." : "Add Animated Phonics Video"}
                          </button>
                        </form>

                        {/* Success / Error alerts */}
                        {formError && <p className="text-[9px] text-red-600 font-bold">{formError}</p>}
                        {formSuccess && <p className="text-[9px] text-emerald-600 font-bold">{formSuccess}</p>}

                        {/* List of custom videos for the selected letter with delete buttons */}
                        {currentLetterVideos.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[8px] font-extrabold text-slate-400 block uppercase font-mono">
                              Active Playlist Library:
                            </span>
                            <div className="space-y-1 max-h-[120px] overflow-y-auto">
                              {currentLetterVideos.map((vid) => (
                                <div key={vid.id} className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-slate-150 gap-2">
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[9.5px] font-bold text-slate-700 truncate">{vid.title}</p>
                                    <span className="text-[7.5px] text-slate-400 font-mono truncate block">{vid.url}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteVideo(vid.id)}
                                    className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-slate-100 cursor-pointer shrink-0 transition-colors"
                                    title="Delete Video"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-150 flex items-center gap-1.5">
                        <span className="text-xs">🔒</span>
                        <p className="text-[8.5px] text-slate-400 leading-normal">
                          To modify, delete, or replace educational song videos for the letter lesson, please authenticate as <strong className="text-slate-500">administrator</strong> via the Admin Control dashboard.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

        </div>

      </div>

    </div>
  );
}

// =========================================================================
// SUBSECTION: NUMBERS 1-100 GRID & GAMES
// =========================================================================
function NumberStrokeAnimator({ numText, speakText }: { numText: string; speakText: (txt: string) => void }) {
  const [animationKey, setAnimationKey] = useState(0);
  const strokes = NUMBER_STROKES[numText] || [];

  const playSequence = () => {
    setAnimationKey(prev => prev + 1);
    speakText(`Let's write the number ${numText}!`);
    const strokeDirections: Record<string, string[]> = {
      "0": ["Start at the top, and curve all the way around in a nice smooth loop!"],
      "1": ["Slant up slightly to the top!", "Then draw a straight line down to the ground!"],
      "2": ["Curve around the top, slide down to the bottom left, and slide straight across to the right!"],
      "3": ["Slide across the top, down to the middle, and make a big curve to the bottom!"],
      "4": ["Slide down to the left!", "Slide straight across to the right!", "Go back up and draw a straight line down!"],
      "5": ["Draw a straight roof line!", "Line down on the left, and curve around in a big half-circle!"],
      "6": ["Slide down from the top right, and curl around in a tight circle at the bottom!"],
      "7": ["Slide straight across the top, and slide diagonally down to the bottom left!"],
      "8": ["Make an S shape from the top, and curve back up to connect it together!"],
      "9": ["Make a full circle at the top!", "Then draw a straight line down on the right side! Splendid!"]
    };

    const directions = strokeDirections[numText] || ["Draw along the path!"];
    directions.forEach((direction, idx) => {
      setTimeout(() => {
        speakText(direction);
      }, (idx + 1) * 1600);
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      playSequence();
    }, 400);
    return () => clearTimeout(timer);
  }, [numText]);

  return (
    <div className="bg-slate-900 text-white rounded-[32px] p-5 border-4 border-slate-800 space-y-4 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400 font-mono flex items-center gap-1">
          🔢 Guided Writing Stroke Sequence
        </span>
        <button
          onClick={playSequence}
          className="bg-sky-500 hover:bg-sky-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all"
        >
          <RotateCcw size={10} /> Replay
        </button>
      </div>

      <div className="relative aspect-square bg-slate-950 border-2 border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center p-6">
        <svg viewBox="0 0 100 100" className="w-full h-full max-w-[200px] max-h-[200px]" key={animationKey}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
            </marker>
          </defs>

          {/* Sequential CSS-based stroke keyframes */}
          <style>{`
            ${strokes.map((_, index) => `
              .num-stroke-${numText}-${index} {
                stroke-dasharray: 200;
                stroke-dashoffset: 200;
                animation: draw-num-stroke-${numText}-${index} 1.4s ease-in-out forwards;
                animation-delay: ${index * 1.5}s;
              }
              @keyframes draw-num-stroke-${numText}-${index} {
                to {
                  stroke-dashoffset: 0;
                }
              }
            `).join("\n")}
          `}</style>

          {/* Underlay dark lines */}
          {strokes.map((path, idx) => (
            <path
              key={`bg-${idx}`}
              d={path}
              fill="none"
              stroke="#1e293b"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Dotted helper guidance lines */}
          {strokes.map((path, idx) => (
            <path
              key={`dotted-${idx}`}
              d={path}
              fill="none"
              stroke="#334155"
              strokeWidth="2"
              strokeDasharray="4 4"
              strokeLinecap="round"
              strokeLinejoin="round"
              markerEnd="url(#arrow)"
            />
          ))}

          {/* Foreground sky blue animated stroke lines */}
          {strokes.map((path, idx) => (
            <path
              key={`fg-${idx}`}
              d={path}
              className={`num-stroke-${numText}-${idx}`}
              fill="none"
              stroke="#0EA5E9"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>

        <div className="absolute bottom-3 right-3 bg-sky-400 text-slate-950 font-display font-extrabold text-[9px] px-2 py-0.5 rounded-full">
          {strokes.length} {strokes.length === 1 ? "Step" : "Steps"}
        </div>
      </div>

      <div className="text-center">
        <p className="text-[11px] text-slate-300 font-bold font-sans">
          Watch the blue trail form the digit {numText}!
        </p>
      </div>
    </div>
  );
}

function CountAndMatchGame({ onCompleteActivity, speakText }: { onCompleteActivity: (id: string) => void; speakText: (txt: string) => void }) {
  const emojis = ["🍎", "🦆", "🦁", "🐢", "🎈", "🐝", "🍓", "🍌", "🥕", "🚀"];
  const [targetCount, setTargetCount] = useState(3);
  const [activeEmoji, setActiveEmoji] = useState("🍎");
  const [options, setOptions] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const startNewGame = () => {
    const randomCount = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    setTargetCount(randomCount);
    setActiveEmoji(randomEmoji);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);

    // Generate option list (including correct count and two wrong answers)
    const opts = new Set<number>();
    opts.add(randomCount);
    while (opts.size < 3) {
      const wrongOpt = Math.floor(Math.random() * 9) + 1;
      opts.add(wrongOpt);
    }
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));

    speakText(`Let's count how many ${randomEmoji} there are on the screen!`);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const handleSelect = (num: number) => {
    if (isAnswered) return;
    setSelectedOption(num);
    setIsAnswered(true);
    const correct = num === targetCount;
    setIsCorrect(correct);
    if (correct) {
      speakText(`Splendid! That is correct. There are ${targetCount} ${activeEmoji}!`);
      onCompleteActivity(`count-match-${targetCount}`);
    } else {
      speakText(`Oops! That's not quite right. Try counting them again!`);
    }
  };

  return (
    <div className="bg-sky-50 border-2 border-sky-100 rounded-[28px] p-5 space-y-4 flex flex-col justify-between">
      <div className="flex justify-between items-center border-b border-sky-100 pb-2">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-600 bg-white px-2.5 py-1 rounded-full border">
          Count & Match Game
        </span>
        <button
          onClick={startNewGame}
          className="text-[10px] text-sky-600 hover:text-sky-800 font-bold underline cursor-pointer"
        >
          Skip / Next
        </button>
      </div>

      <div className="text-center py-1">
        <h4 className="font-display font-black text-slate-900 text-sm">
          How many {activeEmoji} can you count?
        </h4>
      </div>

      {/* Emoji Cluster box */}
      <div className="bg-white rounded-2xl p-4 border border-sky-100 aspect-video flex flex-wrap items-center justify-center gap-3 min-h-[120px] max-h-[160px] overflow-y-auto">
        {Array.from({ length: targetCount }).map((_, idx) => (
          <span
            key={idx}
            className="text-4xl hover:scale-120 cursor-pointer transition-transform select-none"
            onClick={() => speakText("One!")}
          >
            {activeEmoji}
          </span>
        ))}
      </div>

      {/* Options */}
      <div className="grid grid-cols-3 gap-2.5">
        {options.map((opt) => (
          <button
            key={opt}
            disabled={isAnswered}
            onClick={() => handleSelect(opt)}
            className={`py-3.5 rounded-xl font-mono font-black text-sm text-center border transition-all cursor-pointer ${
              selectedOption === opt
                ? isCorrect
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : "bg-red-500 text-white border-red-500"
                : isAnswered && opt === targetCount
                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {isAnswered && (
        <div className={`p-3 rounded-xl text-[10px] font-black text-center ${
          isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
        }`}>
          {isCorrect ? "🎉 Wonderful! +5 Star Points earned!" : "❌ Try again by clicking Skip!"}
        </div>
      )}
    </div>
  );
}

function NumbersSection({ onCompleteActivity, speakText }: { onCompleteActivity: (id: string) => void; speakText: (txt: string) => void }) {
  const [selectedNumber, setSelectedNumber] = useState<number>(5);
  const [activeNumSubTab, setActiveNumSubTab] = useState<"chart" | "writing" | "balloon" | "match">("chart");
  const [selectedDigit, setSelectedDigit] = useState<string>("5");
  
  // Game state: "Tap-to-Count balloon pop"
  const [targetNumber, setTargetNumber] = useState<number>(3);
  const [poppedCount, setPoppedCount] = useState<number>(0);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);

  const startNewCountGame = () => {
    const random = Math.floor(Math.random() * 8) + 2; // 2 to 9
    setTargetNumber(random);
    setPoppedCount(0);
    setIsGameWon(false);
  };

  const handlePopBalloon = () => {
    if (poppedCount < targetNumber) {
      const nextCount = poppedCount + 1;
      setPoppedCount(nextCount);
      speakText(String(nextCount));
      
      if (nextCount === targetNumber) {
        setIsGameWon(true);
        onCompleteActivity(`counting-game-${targetNumber}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Interactive Numbers Learn & Play sub-tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none bg-sky-50/50 p-1.5 rounded-2xl border border-sky-100">
        {[
          { id: "chart", label: "🔢 1-100 Number Chart" },
          { id: "writing", label: "✍️ Digit Writing Guide" },
          { id: "balloon", label: "🎈 Balloon Pop Game" },
          { id: "match", label: "🌟 Count & Match Game" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveNumSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
              activeNumSubTab === tab.id
                ? "bg-sky-500 text-white shadow-xs"
                : "text-sky-700 hover:bg-sky-50 hover:text-sky-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeNumSubTab === "chart" && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* 100-Numbers Selector Board */}
          <div className="lg:col-span-2 bg-white border-4 border-sky-200 rounded-[32px] p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="font-display font-black text-slate-900 text-sm text-sky-600 flex items-center gap-1.5">
                🔢 Interactive Number Board (1-100)
              </h3>
              <span className="text-[10px] text-slate-400 font-mono font-bold">
                Tap to hear number voice
              </span>
            </div>

            <div className="grid grid-cols-10 gap-1.5 max-h-[300px] overflow-y-auto pr-1">
              {Array.from({ length: 100 }).map((_, i) => {
                const num = i + 1;
                return (
                  <button
                    key={num}
                    onClick={() => {
                      setSelectedNumber(num);
                      speakText(String(num));
                      onCompleteActivity(`number-${num}`);
                    }}
                    className={`aspect-square rounded-lg font-mono font-black text-xs flex items-center justify-center shadow-3xs cursor-pointer transition-all ${
                      selectedNumber === num
                        ? "bg-sky-500 text-white scale-105"
                        : "bg-sky-50 hover:bg-sky-100 text-sky-800"
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            {/* Multi-sensory count representative visualizer */}
            <div className="bg-sky-50/50 border-2 border-dashed border-sky-200 p-4 rounded-2xl space-y-2">
              <h4 className="font-display font-bold text-slate-900 text-xs text-center">
                Let's Count {selectedNumber} Honeybees! 🐝
              </h4>
              <div className="flex flex-wrap justify-center gap-1.5 max-h-[110px] overflow-y-auto p-1 bg-white rounded-xl border border-sky-100">
                {Array.from({ length: selectedNumber }).map((_, i) => (
                  <span key={i} className="text-xl animate-pulse">🐝</span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 bg-white border-4 border-sky-200 rounded-[32px] p-6 shadow-sm flex flex-col justify-between">
            <div className="text-center space-y-4">
              <span className="text-5xl">🐝🐝🐝</span>
              <h3 className="font-display font-black text-slate-900 text-xl">
                Counting with Bees
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Click any number on the board to practice pronunciation! The playroom dynamically constructs visual bee cohorts matching your exact choice.
              </p>
            </div>
            <button
              onClick={() => speakText(`Count with me: ${Array.from({ length: Math.min(10, selectedNumber) }).map((_, idx) => idx + 1).join(", ")}`)}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-display font-black py-3.5 rounded-xl text-xs shadow-md shadow-sky-500/10 cursor-pointer mt-4"
            >
              🎤 Sing Count Song (1 to {Math.min(10, selectedNumber)})
            </button>
          </div>
        </div>
      )}

      {activeNumSubTab === "writing" && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Digit Selector Grid */}
          <div className="lg:col-span-1 bg-white border-4 border-sky-200 rounded-[32px] p-5 shadow-sm space-y-4">
            <h3 className="font-display font-black text-slate-900 text-sm text-sky-600 flex items-center gap-1.5">
              ✍️ Choose a Digit
            </h3>
            <div className="grid grid-cols-5 gap-2.5">
              {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map((numStr) => (
                <button
                  key={numStr}
                  onClick={() => {
                    setSelectedDigit(numStr);
                    onCompleteActivity(`digit-${numStr}`);
                  }}
                  className={`aspect-square rounded-2xl font-display font-black text-sm flex items-center justify-center shadow-3xs cursor-pointer transition-all ${
                    selectedDigit === numStr
                      ? "bg-sky-500 text-white scale-105"
                      : "bg-sky-50 hover:bg-sky-100 text-sky-800 border"
                  }`}
                >
                  {numStr}
                </button>
              ))}
            </div>
          </div>

          {/* Stroke Animator */}
          <div className="lg:col-span-2">
            <NumberStrokeAnimator numText={selectedDigit} speakText={speakText} />
          </div>
        </div>
      )}

      {activeNumSubTab === "balloon" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border-4 border-sky-200 rounded-[32px] p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-display font-black text-slate-900 text-sm text-sky-600">
                🎈 Multi-Sensory Balloon Pop Training
              </h3>
              <p className="text-xs text-slate-500">
                Tap each red balloon on the right card to pop them. The app counts out loud as each balloon pops, reinforcing numerical sequence matching!
              </p>
              <div className="aspect-video bg-sky-50/50 border border-sky-100 rounded-2xl flex flex-col items-center justify-center p-4">
                <span className="text-6xl animate-bounce">🎈🧸🍯</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 bg-white border-4 border-sky-200 rounded-[32px] p-6 shadow-sm space-y-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full">
                Fun Count Game
              </span>
              <h3 className="font-display font-black text-slate-900 text-sm mt-3">
                Pop {targetNumber} balloons! 🎈
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tap the balloons below one by one. Help your child count out loud!
              </p>
            </div>

            <div className="my-4 relative bg-sky-50 rounded-2xl p-4 min-h-[140px] flex flex-col items-center justify-center border border-sky-100">
              {isGameWon ? (
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-center space-y-2.5"
                >
                  <div className="text-4xl">🏆🎖️✨</div>
                  <h4 className="font-display font-bold text-slate-900 text-xs">Fantastic Counting!</h4>
                  <button
                    onClick={startNewCountGame}
                    className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg"
                  >
                    Play Again
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-4 text-center">
                  <div className="flex justify-center gap-3">
                    {Array.from({ length: targetNumber }).map((_, idx) => (
                      <button
                        key={idx}
                        disabled={idx >= poppedCount}
                        onClick={handlePopBalloon}
                        className={`w-9 h-11 rounded-full flex items-center justify-center transition-all ${
                          idx < poppedCount
                            ? "opacity-30 scale-75 bg-slate-300 pointer-events-none"
                            : "bg-rose-500 hover:bg-rose-600 text-white cursor-pointer hover:scale-115 shadow-md active:scale-95"
                        }`}
                      >
                        🎈
                      </button>
                    ))}
                  </div>

                  <div className="text-xs font-bold text-sky-800">
                    Popped: {poppedCount} of {targetNumber}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>Score points: +5 Stars</span>
                <span>Level: Easy</span>
              </div>
              <button
                onClick={startNewCountGame}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-display font-black py-3 rounded-xl text-xs shadow-md shadow-sky-500/10 cursor-pointer"
              >
                Start Count Mission
              </button>
            </div>
          </div>
        </div>
      )}

      {activeNumSubTab === "match" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border-4 border-sky-200 rounded-[32px] p-6 shadow-sm space-y-4">
            <h3 className="font-display font-black text-slate-900 text-sm text-sky-600">
              🌟 Count & Match Challenge
            </h3>
            <p className="text-xs text-slate-500">
              In this game, beautiful groups of items appear on the whiteboard. Help your child count each of them, then click the correct matching number card below. Correct matching earns instant golden star badges!
            </p>
            <div className="p-4 bg-sky-50 rounded-2xl border flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Learn to Count Visually</h5>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Matching quantities to their numeric digits is a foundational math skill. This quiz helps preschoolers build numerical confidence.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <CountAndMatchGame onCompleteActivity={onCompleteActivity} speakText={speakText} />
          </div>
        </div>
      )}

    </div>
  );
}

// =========================================================================
// SUBSECTION: VOCABULARY CARDS (Animals, Fruits, Birds, opposites, etc)
// =========================================================================
function VocabSection({ onCompleteActivity, speakText }: { onCompleteActivity: (id: string) => void; speakText: (txt: string) => void }) {
  const [activeCategory, setActiveCategory] = useState<VocabCategory>(VOCAB_CATEGORIES[0]);

  return (
    <div className="space-y-6">
      
      {/* Category selector strip */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {VOCAB_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              activeCategory.id === cat.id
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Vocabulary Flashcards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {activeCategory.items.map((item, index) => (
          <motion.button
            key={index}
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={() => {
              speakText(item.name.replace(/vs/g, "versus"));
              onCompleteActivity(`vocab-${activeCategory.id}-${index}`);
            }}
            className="bg-white border-2 border-violet-100 rounded-3xl p-5 text-center shadow-2xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between items-center aspect-square group hover:border-violet-300"
          >
            {/* Multi-color rendering support for Colors tab */}
            {item.color ? (
              <span className={`w-14 h-14 rounded-full ${item.color} shadow-inner block mx-auto flex items-center justify-center text-white font-extrabold text-sm`}>
                {item.emoji}
              </span>
            ) : (
              <span className="text-5xl group-hover:animate-bounce transition-transform duration-300">
                {item.emoji}
              </span>
            )}

            <div>
              <h5 className="font-display font-black text-slate-900 text-xs tracking-tight group-hover:text-violet-600 transition-colors">
                {item.name}
              </h5>
              <span className="text-[8.5px] text-slate-400 font-mono flex items-center justify-center gap-0.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Volume2 size={9} /> Tap Sound
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 text-center max-w-lg mx-auto">
        <p className="text-xs text-violet-800 leading-relaxed font-sans">
          💡 **Pre-School Tip**: Let children repeat the names after the voice assistant reads them to accelerate vocabulary development and accent logic.
        </p>
      </div>

    </div>
  );
}

// =========================================================================
// SUBSECTION: TELUGU VARNAMALA
// =========================================================================
function TeluguSection({ onCompleteActivity, speakText }: { onCompleteActivity: (id: string) => void; speakText: (txt: string, l?: string) => void }) {
  const [selectedLetter, setSelectedLetter] = useState<TeluguLetter>(TELUGU_VARNAMALA[0]);

  // Handle pronouncing telugu words phonetically or via general TTS
  const speakTeluguPhonetic = () => {
    // Speak telugu letter using Telugu voice if possible
    speakText(selectedLetter.telugu, "te-IN");
    onCompleteActivity(`telugu-letter-${selectedLetter.telugu}`);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      
      {/* Telugu Letters Grid */}
      <div className="lg:col-span-2 bg-white border-4 border-emerald-200 rounded-[32px] p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-display font-black text-slate-900 text-sm text-emerald-600 flex items-center gap-1.5">
            🕉️ Telugu Varnamala (తెలుగు వర్ణమాల)
          </h3>
          <span className="text-[10px] text-slate-400 font-mono font-bold">
            అచ్చులు & హల్లులు (Vowels & Consonants)
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 max-h-[350px] overflow-y-auto pr-1">
          {TELUGU_VARNAMALA.map((item) => (
            <button
              key={item.telugu}
              onClick={() => {
                setSelectedLetter(item);
                speakText(item.telugu, "te-IN");
                onCompleteActivity(`telugu-${item.telugu}`);
              }}
              className={`py-3 px-2 rounded-2xl flex flex-col justify-center items-center shadow-3xs cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                selectedLetter.telugu === item.telugu
                  ? "bg-emerald-500 text-white scale-105"
                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-100"
              }`}
            >
              <span className="text-2xl font-black leading-none">{item.telugu}</span>
              <span className="text-[9px] text-slate-400 font-bold font-mono mt-1 group-hover:text-white">
                {item.english}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Focus Letter Presentation Card */}
      <div className="lg:col-span-1 bg-white border-4 border-emerald-200 rounded-[32px] p-6 shadow-sm flex flex-col justify-between space-y-5">
        <div className="text-center space-y-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            Telugu Word of the Day
          </span>

          <div className="bg-emerald-50 rounded-3xl p-5 border border-emerald-100">
            <span className="text-6xl block leading-none animate-bounce mb-3">
              {selectedLetter.emoji}
            </span>
            <h2 className="text-5xl font-black text-emerald-600 leading-normal">
              {selectedLetter.telugu}
            </h2>
            <p className="text-sm font-bold text-slate-700 font-sans mt-2">
              {selectedLetter.word}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={speakTeluguPhonetic}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-display font-black py-3.5 rounded-xl text-xs flex justify-center items-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Volume2 size={15} /> వినండి (Listen Audio)
          </button>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-[10px] text-slate-500 text-center leading-normal">
            Phonetic Accent: <span className="font-mono font-bold text-slate-800">"{selectedLetter.english}"</span> as in the picture above!
          </div>
        </div>
      </div>

    </div>
  );
}

// =========================================================================
// SUBSECTION: STORY TIME (Panchatantra, read-along & quizzes)
// =========================================================================
function StoriesSection({ onCompleteActivity, speakText }: { onCompleteActivity: (id: string) => void; speakText: (txt: string) => void }) {
  const [selectedStory, setSelectedStory] = useState<StoryItem>(STORIES_LIST[0]);
  const [activeParagraph, setActiveParagraph] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<{ score: number; answered: boolean; correct: boolean | null }>({ score: 0, answered: false, correct: null });
  const [selectedOption, setSelectedOption] = useState<string>("");

  useEffect(() => {
    // Reset reading indexes when story changes
    setActiveParagraph(0);
    setQuizScore({ score: 0, answered: false, correct: null });
    setSelectedOption("");
  }, [selectedStory]);

  const speakActiveLine = () => {
    const text = selectedStory.paragraphs[activeParagraph];
    speakText(text);
  };

  const handleAnswerSubmit = (option: string) => {
    setSelectedOption(option);
    const isCorrect = option === selectedStory.quiz.answer;
    setQuizScore({
      score: isCorrect ? 10 : 0,
      answered: true,
      correct: isCorrect
    });

    if (isCorrect) {
      onCompleteActivity(`story-quiz-${selectedStory.id}`);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      
      {/* Stories list panel */}
      <div className="lg:col-span-1 bg-white border-4 border-amber-200 rounded-[32px] p-5 shadow-sm space-y-4">
        <h3 className="font-display font-black text-slate-900 text-sm text-amber-600 pl-1">
          📖 Choose Fairy Tale
        </h3>

        <div className="space-y-3">
          {STORIES_LIST.map((story) => (
            <button
              key={story.id}
              onClick={() => setSelectedStory(story)}
              className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex gap-3 items-start ${
                selectedStory.id === story.id
                  ? "bg-amber-50 border-amber-300 shadow-3xs"
                  : "bg-white hover:bg-slate-50 border-slate-200"
              }`}
            >
              <span className="text-3xl bg-white p-1.5 rounded-xl shadow-2xs shrink-0 border border-slate-100">
                {story.emoji.split("")[0]}
              </span>
              <div>
                <h4 className="font-display font-black text-xs sm:text-sm text-slate-900">
                  {story.title}
                </h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  {story.summary}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Read-Along Engine */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Storyboard Display */}
        <div className="bg-white border-4 border-amber-200 rounded-[32px] p-6 shadow-sm space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md">
                {selectedStory.category} Bedtime Story
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Page {activeParagraph + 1} of {selectedStory.paragraphs.length}
            </span>
          </div>

          {/* Core reading sentence focused card */}
          <div className="bg-amber-50/45 p-6 rounded-3xl border border-amber-100 space-y-4 text-center sm:text-left">
            <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-sans italic">
              "{selectedStory.paragraphs[activeParagraph]}"
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={speakActiveLine}
                className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] px-4.5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20 w-full sm:w-auto"
              >
                <Volume2 size={13} /> 🔊 Speak This Sentence
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  disabled={activeParagraph === 0}
                  onClick={() => setActiveParagraph(activeParagraph - 1)}
                  className="px-3.5 py-2 bg-white border border-slate-250 text-xs font-bold rounded-xl text-slate-600 disabled:opacity-40 hover:bg-slate-50 cursor-pointer flex-1 sm:flex-none text-center"
                >
                  Prev
                </button>
                <button
                  disabled={activeParagraph === selectedStory.paragraphs.length - 1}
                  onClick={() => {
                    setActiveParagraph(activeParagraph + 1);
                    speakText(selectedStory.paragraphs[activeParagraph + 1]);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl disabled:opacity-40 cursor-pointer flex-1 sm:flex-none text-center"
                >
                  Next Page
                </button>
              </div>
            </div>
          </div>

          {/* Moral Box */}
          {activeParagraph === selectedStory.paragraphs.length - 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-100 text-amber-900 p-4.5 rounded-2xl border border-amber-200 text-xs font-semibold flex items-center gap-3"
            >
              <Award size={20} className="text-amber-600 shrink-0" />
              <div>
                <p className="text-[10px] font-black text-amber-800 uppercase tracking-wider">Lesson / Moral</p>
                <p className="mt-0.5 leading-normal">{selectedStory.moral}</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Interactive Story Quiz */}
        <div className="bg-white border-4 border-amber-200 rounded-[32px] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
            <Sparkles size={14} className="text-yellow-500" /> Kids Quiz Time! (Earn +10 Stars)
          </div>

          <p className="text-xs font-bold text-slate-700">
            {selectedStory.quiz.question}
          </p>

          <div className="grid sm:grid-cols-2 gap-2.5">
            {selectedStory.quiz.options.map((option) => (
              <button
                key={option}
                disabled={quizScore.answered}
                onClick={() => handleAnswerSubmit(option)}
                className={`w-full p-3 rounded-xl text-left text-xs font-bold border transition-all cursor-pointer ${
                  selectedOption === option
                    ? quizScore.correct
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "bg-red-500 text-white border-red-500"
                    : quizScore.answered && option === selectedStory.quiz.answer
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {quizScore.answered && (
            <div className={`p-3.5 rounded-xl text-[11px] font-semibold text-center ${
              quizScore.correct ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            }`}>
              {quizScore.correct ? "🎉 Superb! Correct answer. +10 Stars credited to your hive pocket!" : "❌ Oops, that is not quite right. Try again!"}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

// =========================================================================
// SUBSECTION: INTERACTIVE GAMES (Alphabet Match / Slate Doodle)
// =========================================================================
function GamesSection({ onCompleteActivity }: { onCompleteActivity: (id: string) => void }) {
  // Game: Memory Card Match
  const [cards, setCards] = useState<{ id: number; symbol: string; matched: boolean; flipped: boolean }[]>([]);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchesCount, setMatchesCount] = useState(0);

  const symbols = ["🐝", "🍎", "🧸", "🎈", "🐸", "🌻"];

  const initializeMemoryGame = () => {
    // Duplicate symbols for pairs
    const deck = [...symbols, ...symbols]
      .map((sym, idx) => ({ id: idx, symbol: sym, matched: false, flipped: false }))
      .sort(() => Math.random() - 0.5); // shuffle
    setCards(deck);
    setFlippedIndexes([]);
    setMoves(0);
    setMatchesCount(0);
  };

  useEffect(() => {
    initializeMemoryGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (flippedIndexes.length === 2 || cards[index].matched || cards[index].flipped) return;

    const updated = [...cards];
    updated[index].flipped = true;
    setCards(updated);

    const nextFlipped = [...flippedIndexes, index];
    setFlippedIndexes(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves(m => m + 1);
      const first = cards[nextFlipped[0]];
      const second = cards[nextFlipped[1]];

      if (first.symbol === second.symbol) {
        // Matched
        setTimeout(() => {
          const finalDeck = updated.map((c, i) => {
            if (i === nextFlipped[0] || i === nextFlipped[1]) {
              return { ...c, matched: true, flipped: true };
            }
            return c;
          });
          setCards(finalDeck);
          setFlippedIndexes([]);
          const matches = matchesCount + 1;
          setMatchesCount(matches);
          if (matches === symbols.length) {
            onCompleteActivity(`memory-game-${moves}`);
          }
        }, 500);
      } else {
        // Reset flip
        setTimeout(() => {
          const resetDeck = updated.map((c, i) => {
            if (i === nextFlipped[0] || i === nextFlipped[1]) {
              return { ...c, flipped: false };
            }
            return c;
          });
          setCards(resetDeck);
          setFlippedIndexes([]);
        }, 1000);
      }
    }
  };

  // Canvas drawing slate states
  const doodleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDoodling, setIsDoodling] = useState(false);
  const [color, setColor] = useState("#3B82F6"); // default blue
  const [brushSize, setBrushSize] = useState(6);

  const startDoodle = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = doodleCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const rect = canvas.getBoundingClientRect();
        let clientX = 0;
        let clientY = 0;

        if ("touches" in e) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else {
          clientX = e.clientX;
          clientY = e.clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDoodling(true);
      }
    }
  };

  const doodle = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDoodling) return;
    const canvas = doodleCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        let clientX = 0;
        let clientY = 0;

        if ("touches" in e) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else {
          clientX = e.clientX;
          clientY = e.clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };

  const stopDoodle = () => {
    setIsDoodling(false);
    onCompleteActivity("doodle-board");
  };

  const clearDoodle = () => {
    const canvas = doodleCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      
      {/* Memory Match Panel */}
      <div className="bg-white border-4 border-indigo-200 rounded-[32px] p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-indigo-100">
          <div>
            <span className="text-[9px] font-extrabold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full uppercase">
              Mind Training Game
            </span>
            <h3 className="font-display font-black text-slate-900 text-sm mt-2">
              Honey Flip Pair Match 🐝
            </h3>
          </div>
          <button
            onClick={initializeMemoryGame}
            className="text-indigo-600 hover:text-indigo-800 text-[10px] font-bold underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={11} /> Reset Game
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {cards.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`aspect-square rounded-2xl text-2xl flex items-center justify-center transition-all cursor-pointer shadow-3xs ${
                card.matched
                  ? "bg-emerald-100 border-2 border-emerald-300 opacity-60 text-emerald-800"
                  : card.flipped
                  ? "bg-indigo-50 border-2 border-indigo-300 text-slate-950 scale-102"
                  : "bg-indigo-500 hover:bg-indigo-600 text-white font-black hover:scale-103"
              }`}
            >
              {card.flipped || card.matched ? card.symbol : "❓"}
            </button>
          ))}
        </div>

        <div className="flex justify-between text-xs font-mono font-bold text-indigo-800 pt-2 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
          <span>Moves Played: {moves}</span>
          <span>Matched: {matchesCount} / {symbols.length}</span>
        </div>
      </div>

      {/* Drawing Coloring Slate Canvas */}
      <div className="bg-white border-4 border-indigo-200 rounded-[32px] p-6 shadow-sm space-y-4 flex flex-col justify-between">
        <div className="flex justify-between items-center border-b border-indigo-100 pb-2">
          <div>
            <span className="text-[9px] font-extrabold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full uppercase">
              Art & Drawing Slate
            </span>
            <h3 className="font-display font-black text-slate-900 text-sm mt-2">
              Magic Kids Sandbox Doodle 🎨
            </h3>
          </div>
          <button
            onClick={clearDoodle}
            className="text-[10px] font-bold text-slate-500 hover:text-red-500 underline flex items-center gap-1 cursor-pointer"
          >
            <Trash2 size={11} /> Erase Board
          </button>
        </div>

        {/* Color Palette selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {["#EF4444", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#F43F5E"].map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-6.5 h-6.5 rounded-full border transition-transform cursor-pointer ${
                color === c ? "scale-120 ring-2 ring-slate-950 ring-offset-1" : ""
              }`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}

          <div className="ml-auto flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold">Brush:</span>
            <select
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded p-1 text-[10px] font-bold"
            >
              <option value="4">Small</option>
              <option value="8">Medium</option>
              <option value="12">Thick</option>
              <option value="20">Jumbo</option>
            </select>
          </div>
        </div>

        {/* Canvas container */}
        <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
          <canvas
            ref={doodleCanvasRef}
            width={320}
            height={180}
            onMouseDown={startDoodle}
            onMouseMove={doodle}
            onMouseUp={stopDoodle}
            onMouseLeave={stopDoodle}
            onTouchStart={startDoodle}
            onTouchMove={doodle}
            onTouchEnd={stopDoodle}
            className="w-full h-full cursor-crosshair bg-slate-950"
          />
        </div>

        <p className="text-[10px] text-slate-400 text-center leading-normal">
          Paint, sketch or draw anything on this magic board. Tap "Erase" to restart your work!
        </p>
      </div>

    </div>
  );
}

// =========================================================================
// SUBSECTION: PARENT REPORT ZONE & WORK SHEET DOWNLOADS
// =========================================================================
// =========================================================================
// SUBSECTION: WORKSHEET HTML GENERATOR (PRINT OPTIMIZED)
// =========================================================================
const generateWorksheetHTML = (id: string, name: string, childName: string) => {
  const cName = childName.trim() || "Little Bee";
  const dateStr = new Date().toLocaleDateString();
  
  let mainContent = "";
  
  if (id === "pdf-az") {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let gridHTML = "";
    letters.forEach(letter => {
      gridHTML += `
        <div class="letter-card">
          <div class="letter-main">
            <span class="letter-guided">${letter}</span>
            <span class="letter-trace">${letter}</span>
          </div>
          <div class="letter-phonics">trace ${letter}</div>
        </div>
      `;
    });
    mainContent = `
      <h2>Alphabet A-Z Tracing Activity Sheet</h2>
      <p class="instructions">Instruction: Use a pencil to carefully trace each letter inside the dashed guides. Color the cards when finished!</p>
      <div class="alphabet-grid">
        ${gridHTML}
      </div>
    `;
  } else if (id === "pdf-num") {
    let rowsHTML = "";
    for (let i = 1; i <= 10; i++) {
      let balloons = "";
      for (let b = 0; b < i; b++) {
        balloons += `<span class="balloon">🎈</span>`;
      }
      rowsHTML += `
        <div class="number-row">
          <div class="num-guided">
            <span class="num-solid">${i}</span>
            <span class="num-trace">${i}</span>
          </div>
          <div class="balloons-count">
            ${balloons}
            <span class="count-label">(${i} ${i === 1 ? 'Balloon' : 'Balloons'})</span>
          </div>
        </div>
      `;
    }
    mainContent = `
      <h2>Numbers Counting & Balloon Pop Board</h2>
      <p class="instructions">Instruction: Trace the dashed numbers with your pencil, then count and color each of the balloons next to them!</p>
      <div class="numbers-list">
        ${rowsHTML}
      </div>
    `;
  } else if (id === "pdf-vocab") {
    const animals = [
      { name: "APPLE", icon: "🍎", phonetic: "Ah-pul" },
      { name: "LION", icon: "🦁", phonetic: "Lye-on" },
      { name: "ELEPHANT", icon: "🐘", phonetic: "Eh-lee-fant" },
      { name: "HONEYBEE", icon: "🐝", phonetic: "Hah-nee-bee" }
    ];
    let cardsHTML = "";
    animals.forEach(animal => {
      cardsHTML += `
        <div class="flashcard">
          <div class="card-icon">${animal.icon}</div>
          <div class="card-title">${animal.name}</div>
          <div class="card-phonetic">"${animal.phonetic}"</div>
          <div class="card-trace-word">
            <span class="word-trace-dashed">${animal.name}</span>
          </div>
          <div class="cut-line">✂--- Cut along dotted line ---</div>
        </div>
      `;
    });
    mainContent = `
      <h2>Vocabulary Animals Flashcards</h2>
      <p class="instructions">Instruction: Ask a parent to help you cut out these flashcards. Trace the animal words and color the backgrounds!</p>
      <div class="flashcard-grid">
        ${cardsHTML}
      </div>
    `;
  } else if (id === "pdf-telugu") {
    const teluguVowels = [
      { char: "అ", sound: "a", word: "అమ్మ (Amma)" },
      { char: "ఆ", sound: "aa", word: "ఆవు (Aavu)" },
      { char: "ఇ", sound: "i", word: "ఇల్లు (Illu)" },
      { char: "ఈ", sound: "ii", word: "ఈల (Eela)" },
      { char: "ఉ", sound: "u", word: "ఉడుత (Uduta)" },
      { char: "ఊ", sound: "uu", word: "ఊయల (Ooyala)" },
      { char: "ఋ", sound: "ru", word: "ఋషి (Rushi)" },
      { char: "ఎ", sound: "e", word: "ఎలుక (Eluka)" },
      { char: "ఏ", sound: "ee", word: "ఏనుగు (Eenugu)" },
      { char: "ఐ", sound: "ai", word: "ఐదు (Aidu)" },
      { char: "ఒ", sound: "o", word: "ఒంటె (Onte)" },
      { char: "ఓ", sound: "oo", word: "ఓడ (Oda)" },
      { char: "ఔ", sound: "au", word: "ఔషధం (Authadham)" },
      { char: "అం", sound: "am", word: "అంకెలు (Ankelu)" },
      { char: "అః", sound: "aha", word: "అంతఃపురం (Anthahpuram)" }
    ];
    let teluguGrid = "";
    teluguVowels.forEach(v => {
      teluguGrid += `
        <div class="telugu-card">
          <div class="telugu-char">${v.char}</div>
          <div class="telugu-phonetic">"${v.sound}"</div>
          <div class="telugu-word">${v.word}</div>
          <div class="telugu-trace-box">
            <span class="telugu-dashed">${v.char}</span>
          </div>
        </div>
      `;
    });
    mainContent = `
      <h2>Telugu Varnamala Vowels Writing Grid</h2>
      <p class="instructions">Instruction: Practice writing standard Telugu vowels (అచ్చులు) inside the guide grids. Complete the dashed tracing curves!</p>
      <div class="telugu-grid">
        ${teluguGrid}
      </div>
    `;
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Honey Bees Preschool Worksheet - ${name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;850&family=Outfit:wght@500;800;900&display=swap');
    
    body {
      font-family: 'Inter', sans-serif;
      color: #1e293b;
      margin: 0;
      padding: 40px;
      background-color: #ffffff;
      -webkit-print-color-adjust: exact;
    }
    
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 4px solid #facc15;
      padding-bottom: 15px;
      margin-bottom: 30px;
    }
    
    .logo-area {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .logo-emoji {
      font-size: 32px;
    }
    
    .brand-name {
      font-family: 'Outfit', sans-serif;
      font-weight: 900;
      font-size: 24px;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    
    .brand-sub {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 850;
      letter-spacing: 1px;
      margin-top: 2px;
    }
    
    .meta-box {
      font-size: 13px;
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 10px 15px;
      border-radius: 12px;
      display: grid;
      grid-template-columns: auto auto;
      gap: 5px 15px;
    }
    
    .meta-label {
      font-weight: 850;
      color: #475569;
    }
    
    .meta-value {
      color: #0f172a;
      text-decoration: underline;
    }
    
    h2 {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 26px;
      margin: 0 0 10px 0;
      color: #0f172a;
    }
    
    .instructions {
      font-size: 13px;
      line-height: 1.5;
      background-color: #fef9c3;
      border-left: 4px solid #eab308;
      padding: 12px 15px;
      border-radius: 0 8px 8px 0;
      color: #713f12;
      margin-bottom: 30px;
    }
    
    /* ALPHABET GRID WORKSHETS STYLE */
    .alphabet-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
    }
    
    .letter-card {
      border: 2px dashed #cbd5e1;
      border-radius: 16px;
      padding: 15px;
      text-align: center;
      position: relative;
    }
    
    .letter-main {
      position: relative;
      height: 90px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .letter-guided {
      font-size: 70px;
      font-weight: 800;
      color: #f1f5f9;
      position: absolute;
    }
    
    .letter-trace {
      font-size: 70px;
      font-weight: 800;
      color: transparent;
      -webkit-text-stroke: 1.5px #94a3b8;
      position: absolute;
      letter-spacing: 0px;
    }
    
    .letter-phonics {
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 10px;
      border-top: 1px solid #f1f5f9;
      padding-top: 5px;
    }
    
    /* NUMBERS LIST WORKSHETS STYLE */
    .numbers-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .number-row {
      display: flex;
      align-items: center;
      border: 2px dashed #cbd5e1;
      border-radius: 16px;
      padding: 10px 20px;
      gap: 30px;
    }
    
    .num-guided {
      position: relative;
      width: 70px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .num-solid {
      font-size: 55px;
      font-weight: 800;
      color: #f1f5f9;
      position: absolute;
    }
    
    .num-trace {
      font-size: 55px;
      font-weight: 800;
      color: transparent;
      -webkit-text-stroke: 1.5px #94a3b8;
      position: absolute;
    }
    
    .balloons-count {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .balloon {
      font-size: 26px;
    }
    
    .count-label {
      font-size: 12px;
      font-weight: 800;
      color: #64748b;
      margin-left: 10px;
    }
    
    /* FLASHCARDS WORKSHETS STYLE */
    .flashcard-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 30px;
    }
    
    .flashcard {
      border: 3px dashed #94a3b8;
      border-radius: 24px;
      padding: 30px;
      text-align: center;
      background-color: #fafafa;
      position: relative;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }
    
    .card-icon {
      font-size: 64px;
      margin-bottom: 10px;
    }
    
    .card-title {
      font-family: 'Outfit', sans-serif;
      font-weight: 900;
      font-size: 28px;
      color: #0f172a;
      letter-spacing: 0.5px;
    }
    
    .card-phonetic {
      font-size: 13px;
      color: #eab308;
      font-weight: 800;
      margin-top: 2px;
      margin-bottom: 25px;
    }
    
    .card-trace-word {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px dashed #e2e8f0;
      border-radius: 12px;
      background-color: #ffffff;
      margin-bottom: 20px;
    }
    
    .word-trace-dashed {
      font-size: 24px;
      font-weight: 800;
      color: transparent;
      -webkit-text-stroke: 1.5px #64748b;
      letter-spacing: 3px;
    }
    
    .cut-line {
      font-size: 10px;
      color: #cbd5e1;
      font-weight: bold;
      letter-spacing: 1px;
      margin-top: 15px;
    }
    
    /* TELUGU GRID WORKSHETS STYLE */
    .telugu-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    
    .telugu-card {
      border: 2px dashed #cbd5e1;
      border-radius: 18px;
      padding: 15px;
      text-align: center;
      background-color: #fafafa;
    }
    
    .telugu-char {
      font-size: 38px;
      font-weight: 800;
      color: #475569;
      margin-bottom: 2px;
    }
    
    .telugu-phonetic {
      font-size: 12px;
      color: #10b981;
      font-weight: 800;
      margin-bottom: 5px;
    }
    
    .telugu-word {
      font-size: 11px;
      color: #64748b;
      margin-bottom: 12px;
    }
    
    .telugu-trace-box {
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px dashed #e2e8f0;
      border-radius: 10px;
      background-color: #ffffff;
    }
    
    .telugu-dashed {
      font-size: 38px;
      font-weight: 800;
      color: transparent;
      -webkit-text-stroke: 1px #94a3b8;
    }
    
    .footer {
      margin-top: 50px;
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      padding-top: 15px;
    }
    
    .print-controls {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-bottom: 30px;
      background-color: #f1f5f9;
      padding: 15px;
      border-radius: 16px;
    }
    
    .print-btn {
      background-color: #fbbf24;
      color: #0f172a;
      border: none;
      font-weight: 800;
      padding: 10px 20px;
      border-radius: 10px;
      cursor: pointer;
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
    }
    
    .print-btn:hover {
      background-color: #f59e0b;
    }
    
    /* Certificate Style Box */
    .certificate-container {
      border: 10px double #fbbf24;
      background-color: #fffbeb;
      padding: 40px;
      text-align: center;
      border-radius: 20px;
      margin-top: 30px;
      position: relative;
    }
    
    .certificate-badge {
      font-size: 60px;
      margin-bottom: 15px;
    }
    
    .certificate-title {
      font-family: 'Outfit', sans-serif;
      font-weight: 900;
      font-size: 32px;
      color: #92400e;
      letter-spacing: 2px;
      margin: 0 0 10px 0;
    }
    
    .certificate-subtitle {
      font-size: 14px;
      color: #78350f;
      margin-bottom: 20px;
      text-transform: uppercase;
      font-weight: 600;
    }
    
    .certificate-student-name {
      font-family: 'Outfit', sans-serif;
      font-size: 36px;
      color: #d97706;
      border-bottom: 2px dashed #f59e0b;
      display: inline-block;
      padding-bottom: 5px;
      margin: 10px 0 20px 0;
      font-weight: 800;
    }
    
    .certificate-body {
      font-size: 15px;
      line-height: 1.6;
      color: #78350f;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .certificate-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 40px;
      padding: 0 20px;
    }
    
    .signature-block {
      text-align: left;
    }
    
    .sig-line {
      font-family: 'Outfit', sans-serif;
      font-weight: bold;
      font-size: 18px;
      color: #1e293b;
      border-bottom: 1px solid #94a3b8;
      padding-bottom: 4px;
      width: 180px;
    }
    
    .sig-title {
      font-size: 11px;
      color: #64748b;
      margin-top: 5px;
    }
    
    .seal-block {
      text-align: right;
    }

    @media print {
      body {
        padding: 0;
      }
      .print-controls {
        display: none !important;
      }
      .page-break {
        page-break-before: always;
        clear: both;
        height: 0;
        border: none;
      }
    }
  </style>
</head>
<body>

  <div class="print-controls">
    <button class="print-btn" onclick="window.print()">🖨️ Click to Print Complete Trace & Reward Pack</button>
  </div>

  <div class="header-container">
    <div class="logo-area">
      <span class="logo-emoji">🐝</span>
      <div>
        <div class="brand-name">Honey Bees Preschool</div>
        <div class="brand-sub">Curriculum & Sandbox Learning</div>
      </div>
    </div>
    
    <div class="meta-box">
      <span class="meta-label">Child Name:</span>
      <span class="meta-value">${cName}</span>
      
      <span class="meta-label">Date Generated:</span>
      <span class="meta-value">${dateStr}</span>
    </div>
  </div>

  <div class="content-body">
    ${mainContent}
  </div>

  <div class="footer">
    🐝 Honey Bees Academy • Page 1 of 2 • Printable Offline Activity Pack
  </div>

  <!-- Page Break to Page 2 -->
  <div class="page-break"></div>

  <div class="header-container" style="margin-top: 40px;">
    <div class="logo-area">
      <span class="logo-emoji">🐝</span>
      <div>
        <div class="brand-name">Honey Bees Preschool</div>
        <div class="brand-sub">Curriculum & Sandbox Learning</div>
      </div>
    </div>
    
    <div class="meta-box">
      <span class="meta-label">Star Student:</span>
      <span class="meta-value">${cName}</span>
      
      <span class="meta-label">Earned Date:</span>
      <span class="meta-value">${dateStr}</span>
    </div>
  </div>

  <div class="certificate-container">
    <div class="certificate-badge">🏆</div>
    <h1 class="certificate-title">CERTIFICATE OF MASTERY</h1>
    <p class="certificate-subtitle">This official certificate is proudly awarded to:</p>
    
    <h2 class="certificate-student-name">${cName}</h2>
    
    <p class="certificate-body">
      for demonstrating outstanding dedication, creative focus, and fine motor precision by successfully completing the physical tracing activities, counting guides, and preschool development tasks for the
      <br>
      <strong>"${name}"</strong> tracing challenge!
    </p>

    <div class="certificate-footer">
      <div class="signature-block">
        <div class="sig-line">Beatrice AI</div>
        <div class="sig-title">Preschool Director of Beatrice Learning Lab</div>
      </div>
      <div class="seal-block">
        <span style="font-size: 38px;">⭐</span>
        <div style="font-weight: 850; font-size: 11px; margin-top: 5px; color: #d97706;">OFFICIAL SEAL</div>
      </div>
    </div>
  </div>

  <div class="footer" style="margin-top: 80px;">
    🐝 Honey Bees Academy • Page 2 of 2 • Learning Rewards System
  </div>

</body>
</html>
  `;
};

// =========================================================================
// SUBSECTION: PARENT REPORT ZONE & WORK SHEET DOWNLOADS
// =========================================================================
function ParentsSection({ 
  points, 
  completed, 
  ageGroup,
  kidName = "",
  tracingStreak = 0
}: { 
  points: number; 
  completed: string[]; 
  ageGroup: string;
  kidName?: string;
  tracingStreak?: number;
}) {
  const [activePreviewSheet, setActivePreviewSheet] = useState<{ name: string; size: string; id: string } | null>(null);
  const [childName, setChildName] = useState(kidName || "");
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState(1);

  const [customCertName, setCustomCertName] = useState(kidName || "");
  const [customCertTitle, setCustomCertTitle] = useState("");
  const [customCertDesc, setCustomCertDesc] = useState("");

  useEffect(() => {
    if (kidName) {
      setCustomCertName(kidName);
      setChildName(kidName);
    }
  }, [kidName]);

  useEffect(() => {
    if (activePreviewSheet) {
      setZoom(100);
      setRotation(0);
      setSearchQuery("");
      setActivePage(1);
    }
  }, [activePreviewSheet]);

  // Programmatic worksheet download generator
  const handleDownloadWorksheet = (sheetId: string, sheetName: string) => {
    const htmlContent = generateWorksheetHTML(sheetId, sheetName, childName);
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${sheetName.replace(/\s+/g, "_")}_Worksheet.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Direct print-window opener
  const handlePrintWorksheet = (sheetId: string, sheetName: string) => {
    const htmlContent = generateWorksheetHTML(sheetId, sheetName, childName);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 500);
    } else {
      // Fallback to downloading if popup is blocked
      handleDownloadWorksheet(sheetId, sheetName);
    }
  };

  const getRecommendations = () => {
    switch (ageGroup) {
      case "2-3":
        return [
          { task: "Play 'Pop the 3 Balloons' Counting Adventure to support visual sharing values.", duration: "5 mins" },
          { task: "Tap Vocab words under 'Animals' Category. Repeat after Beatrice Voice.", duration: "10 mins" },
          { task: "Practice painting on Magic Kids Sandbox Doodle to build motor coordination.", duration: "10 mins" }
        ];
      case "4-5":
        return [
          { task: "Practice drawing Letter A and B in the Tracing Slate.", duration: "10 mins" },
          { task: "Read 'The Thirsty Crow' Bedtime Story with audio voice over read-along.", duration: "15 mins" },
          { task: "Learn Telugu Varnamala vowels (అచ్చులు) up to 'ఈ' sound phonetics.", duration: "10 mins" }
        ];
      case "5-6":
      default:
        return [
          { task: "Play Memory Flip Match game to train mental accuracy.", duration: "15 mins" },
          { task: "Complete Story Quiz for 'The Slow & Steady Race' with correct answers.", duration: "10 mins" },
          { task: "Identify English Opposites vocabulary words (Big vs Small, Up vs Down).", duration: "10 mins" }
        ];
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      
      {/* Column 1: Progress Tracker Report Cards */}
      <div className="lg:col-span-1 bg-white border-4 border-slate-200 rounded-[32px] p-6 shadow-sm space-y-6">
        <div>
          <span className="text-[10px] font-extrabold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
            Progress Tracking Dashboard
          </span>
          <h3 className="font-display font-black text-slate-900 text-sm mt-3">
            Your Child's Learning Analytics
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Live synchronization showing active milestone tracking inside our Playroom pipeline.
          </p>
        </div>

        {/* Milestone indicators */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
              <span className="text-slate-700">Alphabet Mastery</span>
              <span className="text-rose-600 font-mono">
                {Math.min(100, Math.floor((completed.filter(id => id.startsWith("letter-")).length / 26) * 100))}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-rose-500 h-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.floor((completed.filter(id => id.startsWith("letter-")).length / 26) * 100))}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
              <span className="text-slate-700">Number Counting Skill</span>
              <span className="text-sky-600 font-mono">
                {Math.min(100, Math.floor((completed.filter(id => id.startsWith("number-")).length / 30) * 100))}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-sky-500 h-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.floor((completed.filter(id => id.startsWith("number-")).length / 30) * 100))}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
              <span className="text-slate-700">Vocabulary Expansion</span>
              <span className="text-violet-600 font-mono">
                {Math.min(100, Math.floor((completed.filter(id => id.startsWith("vocab-")).length / 15) * 100))}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-violet-500 h-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.floor((completed.filter(id => id.startsWith("vocab-")).length / 15) * 100))}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
              <span className="text-slate-700">Telugu Varnamala Basics</span>
              <span className="text-emerald-600 font-mono">
                {Math.min(100, Math.floor((completed.filter(id => id.startsWith("telugu-")).length / 10) * 100))}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.floor((completed.filter(id => id.startsWith("telugu-")).length / 10) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-200 text-[11px] leading-relaxed font-sans text-yellow-800">
          🏆 **Milestone Achieved**: Your child has unlocked **{completed.length} star badges** and amassed **{points} Honeybee Points**!
        </div>
      </div>

      {/* Column 2: Weekly Plans & Daily Recommendations */}
      <div className="lg:col-span-1 bg-white border-4 border-slate-200 rounded-[32px] p-6 shadow-sm space-y-5">
        <div>
          <span className="text-[10px] font-extrabold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
            Schedules & Plans
          </span>
          <h3 className="font-display font-black text-slate-900 text-sm mt-3">
            Today's Recommended Path
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Personalized offline and online curriculum mapped securely for development.
          </p>
        </div>

        <div className="space-y-3.5">
          {getRecommendations().map((item, idx) => (
            <div key={idx} className="flex gap-3 items-start bg-slate-50 p-3.5 rounded-2xl border border-slate-150">
              <CheckCircle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-800 font-sans leading-snug">
                  {item.task}
                </p>
                <span className="text-[10px] font-bold text-slate-400 font-mono mt-1 inline-block bg-slate-200/50 px-1.5 py-0.5 rounded">
                  🕒 {item.duration}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Weekly schedule outline */}
        <div className="pt-2 border-t border-slate-100">
          <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
            Weekly Playroom Schedule
          </h4>
          <div className="grid grid-cols-5 gap-1.5">
            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
              <div key={day} className="bg-amber-50 border border-amber-100 py-2.5 rounded-xl text-center">
                <span className="block text-[9px] font-extrabold text-slate-400 uppercase font-mono">{day}</span>
                <span className="text-xs block mt-1">🐝</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Column 3: Downloadable Activity Sheets PDF */}
      <div className="lg:col-span-1 bg-white border-4 border-slate-200 rounded-[32px] p-6 shadow-sm space-y-6 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-extrabold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
            Printable Media Center
          </span>
          <h3 className="font-display font-black text-slate-900 text-sm mt-3">
            Download Practice Worksheets
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Beautiful child-friendly drawing worksheets designed by Honey Bees curriculum teachers. Clear guidelines for manual home-learning tracing.
          </p>
        </div>

        <div className="space-y-3">
          {[
            { name: "Alphabet A-Z Tracing Activity Sheet", size: "1.2 MB", id: "pdf-az" },
            { name: "Numbers Counting & Balloon Pop Board", size: "950 KB", id: "pdf-num" },
            { name: "Vocabulary Animals Flashcard Printable", size: "2.1 MB", id: "pdf-vocab" },
            { name: "Telugu Varnamala Vowels Writing Grid", size: "1.5 MB", id: "pdf-telugu" },
          ].map((sheet) => (
            <button
              key={sheet.id}
              onClick={() => setActivePreviewSheet(sheet)}
              className="w-full text-left p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-between gap-3 group cursor-pointer"
            >
              <div className="min-w-0">
                <h5 className="font-sans font-bold text-slate-800 text-xs truncate group-hover:text-yellow-600">
                  {sheet.name}
                </h5>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                  PDF format • {sheet.size}
                </span>
              </div>
              <span className="bg-white p-2 rounded-xl shadow-3xs text-slate-400 group-hover:text-yellow-600 transition-colors shrink-0">
                <Download size={14} />
              </span>
            </button>
          ))}
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 flex items-center gap-3">
          <span className="text-2xl">👩‍🏫</span>
          <div className="min-w-0">
            <h5 className="text-xs font-bold font-display text-yellow-400">Beatrice AI Assistant</h5>
            <p className="text-[9.5px] text-slate-400 mt-0.5 leading-normal">
              Need custom study plans? Just chat with me using the floating icon!
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: Milestones & Printable Certificate Center (Spanning all 3 columns) */}
      <div className="lg:col-span-3 bg-white border-4 border-slate-200 rounded-[32px] p-6 shadow-sm space-y-6">
        <div>
          <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
            🏆 Milestone Badges & Printable Certificate Center
          </span>
          <h3 className="font-display font-black text-slate-900 text-sm mt-3">
            Child Achievement Milestones
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed font-sans">
            Track specific learning milestones unlocked by your child. Click on any unlocked badge to immediately preview and print their customized Certificate of Completion!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 font-sans">
          {/* Left/Middle: Milestones Grid */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            {MILESTONES.map((ms) => {
              const isUnlocked = ms.checkUnlocked(points, completed, tracingStreak);
              return (
                <div 
                  key={ms.id} 
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 ${
                    isUnlocked 
                      ? "bg-amber-50/50 border-amber-200 hover:border-amber-300 shadow-3xs" 
                      : "bg-slate-50/50 border-slate-100 opacity-60"
                  }`}
                >
                  <div className="flex gap-3 items-start">
                    <span className={`text-3xl p-2.5 rounded-xl block ${isUnlocked ? 'bg-amber-100' : 'bg-slate-200'}`}>
                      {ms.badge}
                    </span>
                    <div>
                      <h5 className="font-display font-black text-slate-800 text-xs">
                        {ms.title}
                      </h5>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                        {ms.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-dashed border-slate-200/60">
                    <span className="text-[9px] text-slate-400 font-mono font-bold">
                      Req: {ms.requirementDesc}
                    </span>
                    {isUnlocked ? (
                      <button
                        onClick={() => {
                          const htmlContent = generateCertificateHTML(childName || kidName || "Little Bee", ms.title, ms.description);
                          const printWindow = window.open("", "_blank");
                          if (printWindow) {
                            printWindow.document.write(htmlContent);
                            printWindow.document.close();
                            setTimeout(() => {
                              printWindow.focus();
                              printWindow.print();
                            }, 500);
                          }
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-display font-black text-[10px] px-3 py-1.5 rounded-xl cursor-pointer shadow-3xs transition-all hover:scale-105 active:scale-95 flex items-center gap-1 shrink-0"
                      >
                        🖨️ Print Certificate
                      </button>
                    ) : (
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                        🔒 Locked
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Custom Certificate Generator */}
          <div className="lg:col-span-1 bg-amber-50/40 border-2 border-dashed border-amber-200 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">✍️</span>
                <h4 className="font-display font-black text-slate-950 text-xs uppercase tracking-wider">
                  Custom Certificate Designer
                </h4>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                Create and print a custom learning certificate for any personalized home achievement or daily task completed!
              </p>

              <div className="space-y-2.5 pt-1">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">
                    Child's Name
                  </label>
                  <input
                    type="text"
                    value={customCertName}
                    onChange={(e) => setCustomCertName(e.target.value)}
                    placeholder="e.g. Little Bee"
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-amber-400 outline-none text-xs font-bold text-slate-800 bg-white transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">
                    Achievement Title
                  </label>
                  <input
                    type="text"
                    value={customCertTitle}
                    onChange={(e) => setCustomCertTitle(e.target.value)}
                    placeholder="e.g. Perfect Bedtime Listening"
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-amber-400 outline-none text-xs font-bold text-slate-800 bg-white transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">
                    Achievement Details
                  </label>
                  <textarea
                    value={customCertDesc}
                    onChange={(e) => setCustomCertDesc(e.target.value)}
                    placeholder="For showing perfect patience and listening beautifully to the Thirsty Crow story read-along."
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-amber-400 outline-none text-xs font-medium text-slate-700 bg-white transition-colors resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const htmlContent = generateCertificateHTML(
                  customCertName || childName || kidName || "Little Bee",
                  customCertTitle || "Super Star Accomplishment",
                  customCertDesc || "For demonstrating incredible enthusiasm and mastering critical early development tasks."
                );
                const printWindow = window.open("", "_blank");
                if (printWindow) {
                  printWindow.document.write(htmlContent);
                  printWindow.document.close();
                  setTimeout(() => {
                    printWindow.focus();
                    printWindow.print();
                  }, 500);
                }
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-display font-black text-xs py-3 rounded-xl cursor-pointer shadow-sm transition-all hover:scale-102 active:scale-98 text-center flex items-center justify-center gap-1.5 mt-3"
            >
              🎓 Print Custom Certificate
            </button>
          </div>
        </div>
      </div>

      {/* Worksheet Live Preview & Customization Modal Overlay */}
      <AnimatePresence>
        {activePreviewSheet && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-[32px] border-4 border-slate-300 w-full max-w-5xl p-6 shadow-2xl relative flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto"
            >
              
              {/* Close Button top-right */}
              <button 
                onClick={() => setActivePreviewSheet(null)}
                className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-600 p-2.5 rounded-full transition-colors cursor-pointer z-10"
              >
                <X size={16} />
              </button>

              {/* Left Side: Customize & Actions */}
              <div className="md:w-1/3 flex flex-col justify-between py-2 shrink-0">
                <div className="space-y-4">
                  <div className="bg-yellow-100 text-yellow-800 font-mono text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
                    Printable Creator Zone
                  </div>
                  
                  <h4 className="font-display font-black text-slate-900 text-lg leading-tight">
                    {activePreviewSheet.name}
                  </h4>
                  
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Customize your child's worksheet live. Enter their name below to print a personalized homework tracing sheet!
                  </p>

                  {/* Customizer field */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-widest block">
                      Child's Name
                    </label>
                    <input
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="e.g. Little Bee"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-yellow-400 outline-none text-xs font-bold text-slate-800 transition-colors"
                    />
                  </div>
                  
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-[10px] leading-relaxed text-slate-500 space-y-1.5">
                    <p className="font-bold text-slate-700">💡 Interactive PDF Preview Tools:</p>
                    <p>• Use the toolbar controls on the right to <strong className="text-slate-800">zoom</strong>, <strong className="text-slate-800">rotate</strong>, and <strong className="text-slate-800">search</strong> elements inside the preview.</p>
                    <p>• Toggle <strong className="text-slate-800">Page 1</strong> for the customized study worksheet, and <strong className="text-slate-800">Page 2</strong> for the official Honey Bees completion certificate!</p>
                  </div>
                </div>

                <div className="space-y-2 mt-6">
                  <button
                    onClick={() => handlePrintWorksheet(activePreviewSheet.id, activePreviewSheet.name)}
                    className="w-full py-3.5 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold font-display text-xs transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Printer size={15} /> Print Complete Pack
                  </button>
                  
                  <button
                    onClick={() => handleDownloadWorksheet(activePreviewSheet.id, activePreviewSheet.name)}
                    className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download size={15} /> Download PDF Pack
                  </button>
                  
                  <button
                    onClick={() => setActivePreviewSheet(null)}
                    className="w-full py-3 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 font-bold text-xs transition-colors text-center cursor-pointer md:hidden"
                  >
                    Close Preview
                  </button>
                </div>
              </div>

              {/* Right Side: Visual Live Worksheet PDF Viewer & Interactive Canvas */}
              <div className="flex-1 bg-slate-800 rounded-3xl border border-slate-700 flex flex-col overflow-hidden max-h-[60vh] md:max-h-full min-h-[450px]">
                
                {/* PDF Chrome-style Navigation Header */}
                <div className="bg-slate-900 text-slate-200 p-2 px-4 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-850 shadow-md">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-600 text-white font-extrabold px-1.5 py-0.5 rounded text-[9px] tracking-wider uppercase">PDF</span>
                    <span className="font-mono text-[10px] truncate max-w-[130px] sm:max-w-[180px]">
                      {activePreviewSheet.name.toLowerCase().replace(/\s+/g, "_")}.pdf
                    </span>
                  </div>

                  {/* Page Toggles */}
                  <div className="flex items-center gap-1.5 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
                    <button 
                      onClick={() => setActivePage(1)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${activePage === 1 ? 'bg-yellow-400 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      Page 1: Work
                    </button>
                    <button 
                      onClick={() => setActivePage(2)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${activePage === 2 ? 'bg-yellow-400 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      Page 2: Reward
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Zoom State */}
                    <div className="flex items-center bg-slate-950/40 rounded-lg border border-slate-700 text-[10px]">
                      <button 
                        onClick={() => setZoom(prev => Math.max(50, prev - 25))}
                        className="p-1 px-2 hover:bg-slate-700 rounded-l-lg"
                        title="Zoom Out"
                      >
                        <ZoomOut size={12} />
                      </button>
                      <span className="px-2 font-mono text-[10px] min-w-[34px] text-center">{zoom}%</span>
                      <button 
                        onClick={() => setZoom(prev => Math.min(150, prev + 25))}
                        className="p-1 px-2 hover:bg-slate-700 rounded-r-lg"
                        title="Zoom In"
                      >
                        <ZoomIn size={12} />
                      </button>
                    </div>

                    {/* Rotate */}
                    <button 
                      onClick={() => setRotation(prev => (prev + 90) % 360)}
                      className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-750 transition-colors"
                      title="Rotate Page"
                    >
                      <RotateCw size={13} />
                    </button>

                    {/* Word highlighting search */}
                    <div className="relative hidden sm:flex items-center">
                      <Search size={10} className="absolute left-2 text-slate-500" />
                      <input 
                        type="text"
                        placeholder="Search word..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded-lg pl-6 pr-1.5 py-0.5 text-[9px] w-20 focus:w-28 focus:outline-none focus:border-yellow-500 transition-all text-slate-200 placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                </div>

                {/* PDF Staging Workspace with Gray Grid Paper backdrop */}
                <div className="flex-1 overflow-auto p-6 flex justify-center bg-slate-700 min-h-[380px] relative">
                  
                  {/* Real-time PDF Highlight Notification */}
                  {searchQuery && (
                    <div className="absolute top-2 left-2 z-10 bg-yellow-400/90 text-slate-900 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <span>🔍</span> Highlighted matches for "{searchQuery}"
                    </div>
                  )}

                  <div 
                    style={{ 
                      transform: `scale(${zoom / 100}) rotate(${rotation}deg)`, 
                      transformOrigin: 'top center',
                      transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      width: '100%',
                      maxWidth: '460px'
                    }}
                    className="origin-top"
                  >
                    {activePage === 2 ? (
                      /* PAGE 2: PREMIUM REWARD CERTIFICATE BOARD */
                      <div className="bg-amber-50 rounded-2xl border-[8px] border-double border-yellow-500 p-6 shadow-xl relative text-slate-800 min-h-[460px] flex flex-col justify-between text-center overflow-hidden">
                        
                        {/* Decorative Star graphics */}
                        <div className="absolute top-3 left-3 text-lg opacity-25">⭐</div>
                        <div className="absolute top-10 right-4 text-xl opacity-25">🐝</div>
                        <div className="absolute bottom-12 left-6 text-xl opacity-25">🌟</div>
                        <div className="absolute bottom-3 right-3 text-lg opacity-25">🏅</div>

                        <div className="space-y-4">
                          <div className="flex justify-center mt-2">
                            <span className="bg-yellow-400 text-slate-900 text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full border border-yellow-500 shadow-3xs">
                              Honey Bees Honor Certificate
                            </span>
                          </div>

                          <h4 className="font-display font-black text-amber-900 text-lg leading-tight tracking-tight mt-1 uppercase">
                            Certificate of Mastery
                          </h4>
                          
                          <p className="text-[8px] font-mono uppercase text-slate-500 tracking-wider">
                            Officially Awarded To
                          </p>

                          <div className="py-2">
                            <span className="text-base font-bold font-display text-yellow-600 border-b-2 border-dashed border-yellow-400 px-6 pb-0.5 inline-block">
                              {childName.trim() || "Little Bee"}
                            </span>
                          </div>

                          <p className="text-[10px] text-slate-600 leading-relaxed max-w-xs mx-auto">
                            For demonstrating excellent precision, motor skills, and tracing masterfulness in completing the custom <strong className="text-slate-800 font-bold">"{activePreviewSheet.name}"</strong> curriculum pack.
                          </p>
                        </div>

                        {/* Signatures */}
                        <div className="border-t border-yellow-200/80 pt-4 mt-6 flex justify-between items-end text-left text-[8px] text-slate-500">
                          <div>
                            <div className="font-bold text-slate-700 underline decoration-dashed decoration-yellow-400">Beatrice AI</div>
                            <span>Preschool Director Guide</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xl">🌟</span>
                            <div className="font-extrabold text-yellow-600 tracking-wider text-[7px] uppercase font-mono">Verified Star Student</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* PAGE 1: DYNAMIC PERSONALIZED PREVIEW WORK SHEET WITH LIVE SEARCH FILTERS */
                      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-5 font-sans min-h-[460px] relative text-slate-800 flex flex-col justify-between">
                        
                        {/* Interactive Header */}
                        <div>
                          <div className="flex justify-between items-start border-b-2 border-yellow-300 pb-2 mb-3.5">
                            <div className="flex items-center gap-1">
                              <span className="text-lg">🐝</span>
                              <div className="text-left">
                                <h5 className="text-[10px] font-black font-display tracking-tight text-slate-900 leading-none">Honey Bees</h5>
                                <span className="text-[7px] text-slate-400 font-extrabold uppercase tracking-widest font-mono">Preschool</span>
                              </div>
                            </div>
                            <div className="text-[8px] bg-slate-50 border border-slate-150 p-1 rounded-lg text-right space-y-0.5 leading-none">
                              <div><strong className="text-slate-400">Child:</strong> <span className="underline font-bold text-slate-800">{childName.trim() || "Little Bee"}</span></div>
                              <div><strong className="text-slate-400">Date:</strong> <span className="text-slate-500">{new Date().toLocaleDateString()}</span></div>
                            </div>
                          </div>

                          {/* Title inside mock preview */}
                          <h4 className="text-[11px] font-black text-slate-900 tracking-tight mb-0.5 text-center">
                            {activePreviewSheet.name}
                          </h4>
                          <p className="text-[8px] text-slate-400 mb-3 text-center leading-relaxed">
                            {activePreviewSheet.id === "pdf-az" && "Instruction: Carefully trace each letter with a pencil inside the dashed guides."}
                            {activePreviewSheet.id === "pdf-num" && "Instruction: Trace the numbers and count the balloons next to them!"}
                            {activePreviewSheet.id === "pdf-vocab" && "Instruction: Ask a parent to cut along lines and trace words!"}
                            {activePreviewSheet.id === "pdf-telugu" && "Instruction: Trace the Telugu vowel characters and say sounds aloud!"}
                          </p>

                          {/* Grid content mock representation */}
                          {activePreviewSheet.id === "pdf-az" && (
                            <div className="grid grid-cols-4 gap-1.5 text-center">
                              {["A", "B", "C", "D", "E", "F", "G", "H"].map((letter) => {
                                const isMatched = searchQuery && letter.toLowerCase().includes(searchQuery.toLowerCase());
                                return (
                                  <div 
                                    key={letter} 
                                    className={`border border-dashed rounded-lg p-1.5 transition-all ${isMatched ? 'bg-yellow-100 border-yellow-500 scale-105 shadow-md border-2' : 'bg-slate-50/50 border-slate-300'}`}
                                  >
                                    <div className="relative h-8 flex items-center justify-center font-bold">
                                      <span className="text-xl text-slate-200/60 absolute">{letter}</span>
                                      <span className="text-xl text-transparent absolute" style={{ WebkitTextStroke: "1px #94a3b8" }}>{letter}</span>
                                    </div>
                                    <span className="text-[7px] text-slate-400 block uppercase font-mono tracking-widest">trace {letter}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {activePreviewSheet.id === "pdf-num" && (
                            <div className="space-y-1">
                              {[1, 2, 3, 4, 5].map((num) => {
                                const isMatched = searchQuery && (num.toString().includes(searchQuery) || "balloon".includes(searchQuery.toLowerCase()));
                                return (
                                  <div 
                                    key={num} 
                                    className={`border border-dashed rounded-lg p-1.5 flex items-center gap-3 transition-all ${isMatched ? 'bg-yellow-100 border-yellow-500 scale-[1.02] shadow-xs border-2' : 'bg-slate-50/50 border-slate-200'}`}
                                  >
                                    <div className="relative w-7 h-7 flex items-center justify-center font-bold bg-white rounded border border-slate-100">
                                      <span className="text-md text-slate-200/60 absolute">{num}</span>
                                      <span className="text-md text-transparent absolute" style={{ WebkitTextStroke: "1px #94a3b8" }}>{num}</span>
                                    </div>
                                    <div className="flex gap-0.5 text-xs">
                                      {Array.from({ length: num }).map((_, i) => (
                                        <span key={i}>🎈</span>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {activePreviewSheet.id === "pdf-vocab" && (
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { name: "APPLE", emoji: "🍎", phonics: "Ah-pul" },
                                { name: "LION", emoji: "🦁", phonics: "Lye-on" },
                                { name: "ELEPHANT", emoji: "🐘", phonics: "Eh-lee-fant" },
                                { name: "HONEYBEE", emoji: "🐝", phonics: "Hah-nee-bee" }
                              ].map((animal) => {
                                const isMatched = searchQuery && (animal.name.toLowerCase().includes(searchQuery.toLowerCase()) || animal.phonics.toLowerCase().includes(searchQuery.toLowerCase()));
                                return (
                                  <div 
                                    key={animal.name} 
                                    className={`border-2 border-dashed rounded-xl p-2.5 text-center relative transition-all ${isMatched ? 'bg-yellow-100 border-yellow-500 scale-105 shadow-md' : 'bg-slate-50/50 border-slate-300'}`}
                                  >
                                    <span className="text-xl block mb-0.5">{animal.emoji}</span>
                                    <strong className="text-[10px] text-slate-800 font-display block leading-none">{animal.name}</strong>
                                    <span className="text-[7.5px] text-yellow-600 block mb-1.5">"{animal.phonics}"</span>
                                    <div className="border border-dashed border-slate-200 bg-white rounded-md py-0.5 text-[10px] font-bold text-transparent" style={{ WebkitTextStroke: "0.8px #64748b", letterSpacing: "1.2px" }}>
                                      {animal.name}
                                    </div>
                                    <span className="text-[6.5px] text-slate-300 block mt-1.5">✂--- Cut Line ---</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {activePreviewSheet.id === "pdf-telugu" && (
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { char: "అ", sound: "a" },
                                { char: "ఆ", sound: "aa" },
                                { char: "ఇ", sound: "i" },
                                { char: "ఈ", sound: "ii" },
                                { char: "ఉ", sound: "u" },
                                { char: "ఊ", sound: "uu" }
                              ].map((v) => {
                                const isMatched = searchQuery && (v.char.includes(searchQuery) || v.sound.toLowerCase().includes(searchQuery.toLowerCase()));
                                return (
                                  <div 
                                    key={v.char} 
                                    className={`border border-dashed rounded-lg p-1.5 bg-slate-50/50 text-center transition-all ${isMatched ? 'bg-yellow-100 border-yellow-500 scale-105 shadow-md border-2' : 'border-slate-300'}`}
                                  >
                                    <span className="text-md font-bold text-slate-700 block leading-tight">{v.char}</span>
                                    <span className="text-[7.5px] text-emerald-600 font-mono font-bold block mb-1">"{v.sound}"</span>
                                    <div className="border border-dashed border-slate-200 bg-white rounded-md py-0.5 text-sm font-bold text-transparent" style={{ WebkitTextStroke: "0.8px #94a3b8" }}>
                                      {v.char}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Mock Footer */}
                        <div className="text-[7px] text-slate-400 text-center mt-4 border-t border-slate-100 pt-1.5 flex items-center justify-between">
                          <span>🐝 Honey Bees Academy Printable</span>
                          <span>Parents PDF Tracing Sheet v1.2</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
