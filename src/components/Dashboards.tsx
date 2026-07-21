import React, { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  CreditCard,
  BookOpen,
  MessageSquare,
  TrendingUp,
  FileText,
  Video,
  Send,
  AlertCircle,
  Plus,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Shield,
  User,
  Activity,
  Check,
  Briefcase,
  Lock,
  Unlock,
  Upload,
  Trash2,
  LogOut,
  Camera,
  Star,
  Pencil,
  Mail,
  Key,
  Terminal,
  Info,
  AlertTriangle,
  Mic
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DatabaseState, Student, Homework, Notice, Message, AdmissionApplication, TourBooking } from "../types";
import { safeJson } from "../utils";
import { jsPDF } from "jspdf";
import OperationsHub from "./OperationsHub";

interface DashboardsProps {
  initialRole?: "parent" | "teacher" | "admin";
}

interface Submission {
  id: string;
  studentName: string;
  hwTitle: string;
  date: string;
  file: string;
  status: string;
  remarks: string;
}

function SubmissionItem({ sub }: { sub: Submission }) {
  const [isGrading, setIsGrading] = useState(false);
  const [gradeRem, setGradeRem] = useState("");
  const [isApproved, setIsApproved] = useState(sub.status === "Approved");
  const [remText, setRemText] = useState(sub.remarks);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 rounded-2xl text-xs space-y-2.5">
        <div className="flex justify-between items-start">
          <div>
            <h5 className="font-bold text-sm text-slate-800 dark:text-slate-100">{sub.studentName}</h5>
            <p className="text-slate-500 text-[10px] mt-0.5">Assignment: <strong>{sub.hwTitle}</strong></p>
          </div>
          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border ${
            isApproved 
              ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20" 
              : "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20"
          }`}>
            {isApproved ? "Approved" : "Needs Review"}
          </span>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
          <span className="text-lg">📄</span>
          <div className="flex-1 text-[10px]">
            <span className="font-bold block text-slate-750 dark:text-slate-200">{sub.file}</span>
            <span className="text-slate-400">Uploaded via parent portal • {sub.date}</span>
          </div>
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="text-[10px] text-sky-500 font-extrabold cursor-pointer hover:underline bg-sky-50 dark:bg-sky-950/40 px-2 py-1 rounded"
          >
            View File
          </button>
        </div>

        {remText && (
          <div className="p-2.5 bg-yellow-50/50 dark:bg-yellow-950/10 border border-yellow-100 dark:border-yellow-900/30 rounded-lg text-[10px] text-amber-800 dark:text-amber-350 italic">
            <strong>Teacher Evaluation Remarks:</strong> "{remText}"
          </div>
        )}

        {!isApproved && !isGrading && (
          <button
            type="button"
            onClick={() => setIsGrading(true)}
            className="bg-sky-500 hover:bg-sky-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
          >
            Grade & Approve Submission
          </button>
        )}

        {isGrading && (
          <div className="space-y-2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-xl">
            <label className="block text-[10px] uppercase font-bold text-slate-500">Write Evaluation Remarks</label>
            <input
              type="text"
              value={gradeRem}
              onChange={(e) => setGradeRem(e.target.value)}
              placeholder="Provide encouraging and helpful developmental feedback..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 dark:text-white"
            />
            <div className="flex gap-1.5 justify-end">
              <button
                type="button"
                onClick={() => setIsGrading(false)}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 px-2 py-1 rounded-md text-[10px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setRemText(gradeRem || "Outstanding tracing work, keep it up!");
                  setIsApproved(true);
                  setIsGrading(false);
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-md text-[10px]"
              >
                Approve
              </button>
            </div>
          </div>
        )}
      </div>

      {/* High-Fidelity Interactive File Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-slate-950/80 z-55 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-150 dark:border-slate-800 space-y-0 animate-scaleUp text-slate-700 dark:text-slate-300">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">SafeClass Digital Portfolio</span>
                <h4 className="font-display font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">
                  {sub.file}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer bg-slate-200/50 dark:bg-slate-800 p-2 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Document body content */}
            <div className="p-6 flex flex-col items-center justify-center bg-slate-100/50 dark:bg-slate-950/70 min-h-[340px]">
              {sub.id === "sub-1" ? (
                /* Interactive Tracing Worksheet */
                <div className="w-full bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 shadow-md text-center space-y-4">
                  <div className="flex justify-between text-slate-400 font-mono text-[9px] border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span>STUDENT: ETHAN WATSON</span>
                    <span>CLASS: NURSERY</span>
                  </div>
                  
                  <h5 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 tracking-wide uppercase">WORKSHEET: CAPITAL LETTER TRACING</h5>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Trace along the dotted lines using your light-blue finger crayon.</p>
                  
                  <div className="grid grid-cols-2 gap-4 py-2">
                    {/* Letter A */}
                    <div className="relative border border-slate-100 dark:border-slate-800 p-6 rounded-xl bg-slate-50 dark:bg-slate-850 flex items-center justify-center h-36">
                      <span className="absolute text-7xl font-black font-sans text-slate-200 dark:text-slate-800 select-none tracking-widest leading-none">A</span>
                      {/* Interactive Traced Path */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 160 160">
                        <path 
                          d="M 80,30 L 40,130 M 80,30 L 120,130 M 50,90 L 110,90" 
                          fill="none" 
                          stroke="#0EA5E9" 
                          strokeWidth="10" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          opacity="0.8"
                        />
                        <path 
                          d="M 82,32 L 43,128 M 78,33 L 118,125 M 53,88 L 107,88" 
                          fill="none" 
                          stroke="#38BDF8" 
                          strokeWidth="4" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                      </svg>
                      <div className="absolute bottom-1.5 right-1.5 bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                        Trace 100% Correct
                      </div>
                    </div>

                    {/* Letter B */}
                    <div className="relative border border-slate-100 dark:border-slate-800 p-6 rounded-xl bg-slate-50 dark:bg-slate-850 flex items-center justify-center h-36">
                      <span className="absolute text-7xl font-black font-sans text-slate-200 dark:text-slate-800 select-none tracking-widest leading-none">B</span>
                      {/* Interactive Traced Path */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 160 160">
                        <path 
                          d="M 50,30 L 50,130 M 50,30 C 90,30 100,55 50,55 M 50,55 C 100,55 110,130 50,130" 
                          fill="none" 
                          stroke="#0EA5E9" 
                          strokeWidth="9" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          opacity="0.8"
                        />
                        <path 
                          d="M 51,32 L 51,128 M 49,31 C 88,32 97,53 51,56 M 50,56 C 97,57 106,126 51,128" 
                          fill="none" 
                          stroke="#38BDF8" 
                          strokeWidth="3.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                      </svg>
                      <div className="absolute bottom-1.5 right-1.5 bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                        Trace 98% Correct
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 p-2 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-[10px] font-medium">
                    <span>🌟 Real-time safe checking: <strong>Pencil Grip & Steady Control Verified!</strong></span>
                  </div>
                </div>
              ) : (
                /* Interactive Honeycomb Worksheet */
                <div className="w-full bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 shadow-md text-center space-y-4">
                  <div className="flex justify-between text-slate-400 font-mono text-[9px] border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span>STUDENT: SOPHIA LIN</span>
                    <span>CLASS: NURSERY</span>
                  </div>

                  <h5 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 tracking-wide uppercase">WORKSHEET: HONEYCOMB COLOR DRAFT</h5>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Color with hive honey colors (Yellow, Amber, and Gold).</p>

                  <div className="py-2 flex items-center justify-center bg-slate-50 dark:bg-slate-950 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
                    <svg viewBox="0 0 300 150" className="w-full max-w-[280px] h-auto">
                      {/* Hexagon pattern rendered in vector shapes */}
                      {/* Hex 1 */}
                      <polygon points="50,15 90,15 110,50 90,85 50,85 30,50" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
                      <text x="70" y="55" fontSize="18" textAnchor="middle">🐝</text>
                      
                      {/* Hex 2 */}
                      <polygon points="120,15 160,15 180,50 160,85 120,85 100,50" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
                      <text x="140" y="55" fontSize="18" textAnchor="middle">🍯</text>
                      
                      {/* Hex 3 */}
                      <polygon points="190,15 230,15 250,50 230,85 190,85 170,50" fill="#fcd34d" stroke="#d97706" strokeWidth="2" />
                      <text x="210" y="55" fontSize="18" textAnchor="middle">🐝</text>

                      {/* Hex 4 */}
                      <polygon points="85,58 125,58 145,93 125,128 85,128 65,93" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
                      <text x="105" y="98" fontSize="18" textAnchor="middle">🌸</text>
                      
                      {/* Hex 5 */}
                      <polygon points="155,58 195,58 215,93 195,128 155,128 135,93" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
                      <text x="175" y="98" fontSize="18" textAnchor="middle">✨</text>
                      
                      {/* Hex 6 */}
                      <polygon points="225,58 265,58 285,93 265,128 225,128 205,93" fill="#fef08a" stroke="#d97706" strokeWidth="2" />
                      <text x="245" y="98" fontSize="18" textAnchor="middle">🐝</text>
                    </svg>
                  </div>

                  <div className="flex items-center justify-center gap-2 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 p-2 rounded-xl border border-amber-100 dark:border-amber-900/30 text-[10px] font-medium">
                    <span>🎨 Coloring Analysis: <strong>Excellent steady hand, high boundary safety score!</strong></span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-slate-500 text-[10px] flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <span className="font-medium text-slate-400">Guardian Upload • Verified Secure</span>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-950 hover:opacity-90 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer transition-all shadow-xs"
              >
                Done Reviewing
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Dashboards({ initialRole = "admin" }: DashboardsProps) {
  const [activeRole, setActiveRole] = useState<"admin" | "parent" | "teacher">(initialRole);
  const [dbState, setDbState] = useState<DatabaseState | null>(null);
  const [loading, setLoading] = useState(true);
  const [parentMessageText, setParentMessageText] = useState("");
  const [teacherMessageText, setTeacherMessageText] = useState("");
  const [broadcastText, setBroadcastText] = useState("");
  const [broadcastSent, setBroadcastSent] = useState(false);

  // New Homework Form State
  const [hwClass, setHwClass] = useState("Nursery");
  const [hwSubject, setHwSubject] = useState("Numbers & Logic");
  const [hwTitle, setHwTitle] = useState("");
  const [hwDesc, setHwDesc] = useState("");
  const [hwDueDate, setHwDueDate] = useState("2026-07-15");

  // Selected Student for Parent Portal
  const [activeStudentId, setActiveStudentId] = useState("stud-1");
  const [parentTab, setParentTab] = useState<"overview" | "homework" | "progress" | "fees" | "ptm" | "chat">("overview");

  // Parent Portal Sub-module states
  const [leaveDate, setLeaveDate] = useState("");
  const [leaveStatus, setLeaveStatus] = useState("Absent");
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveSubmitting, setLeaveSubmitting] = useState(false);

  const [ptmTeacher, setPtmTeacher] = useState("Mrs. Evelyn Green");
  const [ptmDate, setPtmDate] = useState("2026-07-24");
  const [ptmTime, setPtmTime] = useState("");
  const [ptmSubmitting, setPtmSubmitting] = useState(false);

  const [payingFee, setPayingFee] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<any>(null);

  const [submittingHw, setSubmittingHw] = useState<any>(null);
  const [hwComment, setHwComment] = useState("");
  const [hwSubmittingProgress, setHwSubmittingProgress] = useState(false);

  const [pushAlertsEnabled, setPushAlertsEnabled] = useState(true);
  const [simulatedNotification, setSimulatedNotification] = useState<string | null>(null);

  // Current Authenticated User State
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem("honeybees_current_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    const legacyAdmin = localStorage.getItem("honeybees_admin_authenticated") === "true";
    if (legacyAdmin) {
      return {
        id: "u-1",
        email: "admin@honeybees.com",
        name: "Hive Administrator",
        role: "admin"
      };
    }
    return null;
  });

  // Unified Auth States
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccessMsg, setAuthSuccessMsg] = useState("");

  // Additional signup states
  const [childName, setChildName] = useState("");
  const [childDob, setChildDob] = useState("");
  const [childProgram, setChildProgram] = useState("Nursery");
  const [teacherSpecialty, setTeacherSpecialty] = useState("Nursery");

  // Gallery File Upload States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Admin Data Explorer & Gallery Manager States
  const [adminSubTab, setAdminSubTab] = useState<"gallery" | "students" | "submissions" | "reviews" | "events" | "emails" | "voice" | "operations">("gallery");
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [expandedAdmId, setExpandedAdmId] = useState<string | null>(null);
  const [expandedTourId, setExpandedTourId] = useState<string | null>(null);

  // Voice AI Configuration States
  const [adminGreetingEn, setAdminGreetingEn] = useState("");
  const [adminGreetingTe, setAdminGreetingTe] = useState("");
  const [voiceSettingsSaving, setVoiceSettingsSaving] = useState(false);
  const [voiceSettingsMsg, setVoiceSettingsMsg] = useState("");
  const [voiceSettingsInitialized, setVoiceSettingsInitialized] = useState(false);

  // Gallery Add/Edit Form State
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoCategory, setPhotoCategory] = useState("classroom");
  const [photoIcon, setPhotoIcon] = useState("📸");
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");

  // Events Add/Edit Form State
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Student Add/Edit Form State
  const [studName, setStudName] = useState("");
  const [studParentName, setStudParentName] = useState("");
  const [studParentEmail, setStudParentEmail] = useState("");
  const [studProgram, setStudProgram] = useState("Nursery");
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  // --- NEW TEACHER PORTAL SUB-TAB STATES ---
  const [teacherTab, setTeacherTab] = useState<"attendance" | "lesson" | "activity" | "progress" | "photos" | "homework" | "leave" | "chat">("attendance");

  // Lesson planner states
  const [teacherLessons, setTeacherLessons] = useState<any[]>(() => {
    const saved = localStorage.getItem("honeybees_teacher_lessons");
    if (saved) return JSON.parse(saved);
    return [
      { id: "les-1", title: "Phonics & Alphabetic Sounds", subject: "Language & Literacy", ageGroup: "Nursery", milestone: "Recognizes letters A-H & their sounds", date: "2026-07-20", status: "Completed" },
      { id: "les-2", title: "Tracing Shapes & Dots", subject: "Fine Motor Skills", ageGroup: "Nursery", milestone: "Traces circles and squares with fat crayons", date: "2026-07-21", status: "Active" },
      { id: "les-3", title: "Counting Honeycombs (1-5)", subject: "Numbers & Logic", ageGroup: "Nursery", milestone: "Counts 1-to-1 matching using counting beads", date: "2026-07-22", status: "Scheduled" }
    ];
  });
  const [newLesTitle, setNewLesTitle] = useState("");
  const [newLesSubject, setNewLesSubject] = useState("Numbers & Logic");
  const [newLesAge, setNewLesAge] = useState("Nursery");
  const [newLesMilestone, setNewLesMilestone] = useState("");
  const [newLesDate, setNewLesDate] = useState("2026-07-22");

  // Activity planner states
  const [teacherActivities, setTeacherActivities] = useState<any[]>(() => {
    const saved = localStorage.getItem("honeybees_teacher_activities");
    if (saved) return JSON.parse(saved);
    return [
      { id: "act-1", title: "Honeycomb Mosaic Arts", theme: "Nature & Hexagons", groupSize: "Full Group", materials: "Safety scissors, yellow paper, glue boards", safety: "Adult supervision for scissors", status: "Active Task" },
      { id: "act-2", title: "Splash Pool Sensory Play", theme: "Water and Floatation", groupSize: "Small Groups", materials: "Floating ducks, measuring cups, clean water", safety: "Non-slip shoes around splash deck", status: "Scheduled" }
    ];
  });
  const [newActTitle, setNewActTitle] = useState("");
  const [newActTheme, setNewActTheme] = useState("");
  const [newActGroup, setNewActGroup] = useState("Full Group");
  const [newActMaterials, setNewActMaterials] = useState("");
  const [newActSafety, setNewActSafety] = useState("");

  // Student assessment states
  const [teacherAssessments, setTeacherAssessments] = useState<any[]>(() => {
    const saved = localStorage.getItem("honeybees_teacher_assessments");
    if (saved) return JSON.parse(saved);
    return [
      { id: "ass-1", studentId: "stud-1", fineMotor: 5, cognitive: 4, social: 5, language: 4, remarks: "Ethan is highly co-operative. Fine motor skills are outstanding.", date: "2026-07-18" },
      { id: "ass-2", studentId: "stud-2", fineMotor: 4, cognitive: 5, social: 4, language: 5, remarks: "Sophia is exceptionally verbal and analytical. She reads simple sight words already.", date: "2026-07-19" }
    ];
  });
  const [newAssStudentId, setNewAssStudentId] = useState("stud-1");
  const [newAssFineMotor, setNewAssFineMotor] = useState(4);
  const [newAssCognitive, setNewAssCognitive] = useState(4);
  const [newAssSocial, setNewAssSocial] = useState(4);
  const [newAssLanguage, setNewAssLanguage] = useState(4);
  const [newAssRemarks, setNewAssRemarks] = useState("");

  // Behaviour tracking states
  const [teacherBehaviours, setTeacherBehaviours] = useState<any[]>(() => {
    const saved = localStorage.getItem("honeybees_teacher_behaviours");
    if (saved) return JSON.parse(saved);
    return [
      { id: "beh-1", studentId: "stud-1", category: "Highly Cooperative", notes: "Volunteered to help tidy up the alphabet block center during cleaning time.", timestamp: "2026-07-21 10:15 AM" },
      { id: "beh-2", studentId: "stud-2", category: "Great Sharing", notes: "Shared her favorite modeling clay set with Liam during open sensory play.", timestamp: "2026-07-21 11:30 AM" }
    ];
  });
  const [newBehStudentId, setNewBehStudentId] = useState("stud-1");
  const [newBehCategory, setNewBehCategory] = useState("Highly Cooperative");
  const [newBehNotes, setNewBehNotes] = useState("");

  // Health notes states
  const [teacherHealthLogs, setTeacherHealthLogs] = useState<any[]>(() => {
    const saved = localStorage.getItem("honeybees_teacher_health_logs");
    if (saved) return JSON.parse(saved);
    return [
      { id: "heal-1", studentId: "stud-1", temp: "98.2°F", nap: "1 hour 20 mins", food: "All", healthStatus: "Active & Playful", notes: "No symptoms. Ethan drank plenty of water and was very energetic.", timestamp: "2026-07-21 02:00 PM" }
    ];
  });
  const [newHealStudentId, setNewHealStudentId] = useState("stud-1");
  const [newHealTemp, setNewHealTemp] = useState("98.4°F");
  const [newHealNap, setNewHealNap] = useState("1 Hour");
  const [newHealFood, setNewHealFood] = useState("All");
  const [newHealStatus, setNewHealStatus] = useState("Active & Playful");
  const [newHealNotes, setNewHealNotes] = useState("");

  // Classroom photos states
  const [teacherPhotos, setTeacherPhotos] = useState<any[]>(() => {
    const saved = localStorage.getItem("honeybees_teacher_photos");
    if (saved) return JSON.parse(saved);
    return [
      { id: "tpho-1", url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80", caption: "Playing with modeling clay to build 3D numbers!", taggedStudent: "Ethan Watson", date: "2026-07-20" },
      { id: "tpho-2", url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80", caption: "Stretching butterfly wings during our morning toddler yoga circle.", taggedStudent: "Sophia Lin", date: "2026-07-21" }
    ];
  });
  const [newPhotoCaption, setNewPhotoCaption] = useState("");
  const [newPhotoStudent, setNewPhotoStudent] = useState("All Class");
  const [newPhotoUrl, setNewPhotoUrl] = useState("https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80"); // custom selectable Unsplash preschool presets

  // Leave requests states
  const [teacherLeaveRequests, setTeacherLeaveRequests] = useState<any[]>(() => {
    const saved = localStorage.getItem("honeybees_teacher_leave");
    if (saved) return JSON.parse(saved);
    return [
      { id: "lv-1", startDate: "2026-08-04", endDate: "2026-08-05", reason: "Sickness", details: "Routine dental surgery and post-op recovery.", status: "Approved" },
      { id: "lv-2", startDate: "2026-08-25", endDate: "2026-08-25", reason: "Professional Training", details: "Child psychology integration summit.", status: "Pending" }
    ];
  });
  const [newLeaveStart, setNewLeaveStart] = useState("");
  const [newLeaveEnd, setNewLeaveEnd] = useState("");
  const [newLeaveReason, setNewLeaveReason] = useState("Sickness");
  const [newLeaveDetails, setNewLeaveDetails] = useState("");

  // Fetch state from server on load
  const fetchDbState = async () => {
    try {
      const res = await fetch("/api/admin/data");
      const data = await safeJson(res);
      if (!data.error) {
        setDbState(data);
        if (data.voiceSettings && !voiceSettingsInitialized) {
          setAdminGreetingEn(data.voiceSettings.greetingEn || "");
          setAdminGreetingTe(data.voiceSettings.greetingTe || "");
          setVoiceSettingsInitialized(true);
        }
      }
    } catch (e) {
      console.warn("Failed to load db state gracefully:", e);
    } finally {
      setLoading(false);
    }
  };

  const renderAuthGate = (gateRole: "admin" | "parent" | "teacher") => {
    const roleColors = {
      admin: {
        primary: "bg-yellow-400 hover:bg-yellow-500 text-slate-900 shadow-yellow-400/20",
        border: "focus:border-yellow-400 focus:ring-yellow-400",
        bgLight: "bg-yellow-50",
        text: "text-yellow-600",
        label: "Administrator Gate"
      },
      parent: {
        primary: "bg-orange-400 hover:bg-orange-500 text-white shadow-orange-400/20",
        border: "focus:border-orange-400 focus:ring-orange-400",
        bgLight: "bg-orange-50",
        text: "text-orange-600",
        label: "Parent Portal Gate"
      },
      teacher: {
        primary: "bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/20",
        border: "focus:border-sky-500 focus:ring-sky-500",
        bgLight: "bg-sky-50",
        text: "text-sky-600",
        label: "Educator Portal Gate"
      }
    }[gateRole];

    const handleSubmit = (e: React.FormEvent) => {
      if (isSigningUp) {
        handleAuthRegister(e, gateRole);
      } else {
        handleAuthLogin(e, gateRole);
      }
    };

    return (
      <motion.div
        key={`${gateRole}-auth-gate`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-slate-200 rounded-[32px] p-8 max-w-md mx-auto shadow-xl space-y-6 text-slate-800 my-8"
      >
        <div className="text-center space-y-2">
          <div className={`inline-flex ${roleColors.bgLight} p-4 rounded-3xl ${roleColors.text} border ${gateRole === "admin" ? "border-yellow-200" : gateRole === "parent" ? "border-orange-200" : "border-sky-200"}`}>
            <Lock size={32} />
          </div>
          <h3 className="font-display font-black text-2xl text-slate-950">
            {roleColors.label}
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            {isSigningUp 
              ? `Create a new secure ${gateRole} account with email and password.` 
              : `Access your premium ${gateRole} dashboard with your registered credentials.`}
          </p>
        </div>

        {/* Login / Register Toggle Tabs */}
        {gateRole !== "admin" && (
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setIsSigningUp(false);
                setAuthError("");
                setAuthSuccessMsg("");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                !isSigningUp 
                  ? "bg-white text-slate-900 shadow-xs" 
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSigningUp(true);
                setAuthError("");
                setAuthSuccessMsg("");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                isSigningUp 
                  ? "bg-white text-slate-900 shadow-xs" 
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {authError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded-xl font-semibold flex items-center gap-2">
            <span className="text-lg leading-none">⚠️</span>
            <span>{authError}</span>
          </div>
        )}

        {authSuccessMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3 rounded-xl font-semibold flex items-center gap-2">
            <span className="text-lg leading-none">✅</span>
            <span>{authSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email/Username field */}
          <div className="space-y-1">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              {gateRole === "admin" && !isSigningUp ? "Email / Username" : "Email Address"}
            </label>
            <input
              type={gateRole === "admin" && !isSigningUp ? "text" : "email"}
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              placeholder={gateRole === "admin" && !isSigningUp ? "e.g. admin" : "e.g. parent@honeybees.com"}
              className={`w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 font-sans focus:outline-none ${roleColors.border} focus:bg-white text-xs`}
              required
            />
          </div>

          {/* Full Name field (Only for registration) */}
          {isSigningUp && (
            <div className="space-y-1">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Full Name
              </label>
              <input
                type="text"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                placeholder="e.g. Mary Carter"
                className={`w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 font-sans focus:outline-none ${roleColors.border} focus:bg-white text-xs`}
                required
              />
            </div>
          )}

          {/* Password field */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Password
              </label>
              {!isSigningUp && (
                <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                  {gateRole === "admin" ? "Default: honeybees-admin" : gateRole === "parent" ? "Default: honeybees-parent" : "Default: honeybees-teacher"}
                </span>
              )}
            </div>
            <input
              type="password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              placeholder="••••••••••••"
              className={`w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 font-sans focus:outline-none ${roleColors.border} focus:bg-white text-xs`}
              required
            />
          </div>

          {/* Additional Parent Registration Fields */}
          {isSigningUp && gateRole === "parent" && (
            <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-2xl space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-600 block">
                👶 Child Profile Information
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 col-span-2">
                  <label className="block text-[9px] font-bold text-slate-500">Child's Name</label>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="e.g. Ethan Carter"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-400"
                    required={isSigningUp}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-500">Date of Birth</label>
                  <input
                    type="date"
                    value={childDob}
                    onChange={(e) => setChildDob(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-400"
                    required={isSigningUp}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-500">Program / Class</label>
                  <select
                    value={childProgram}
                    onChange={(e) => setChildProgram(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-400 cursor-pointer font-sans"
                  >
                    <option value="Play Group">Play Group</option>
                    <option value="Nursery">Nursery Hive</option>
                    <option value="LKG">LKG</option>
                    <option value="UKG">UKG</option>
                    <option value="Tuition">Special Tuition</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Additional Teacher Registration Fields */}
          {isSigningUp && gateRole === "teacher" && (
            <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-2xl space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-600 block">
                💼 Educator Specialty
              </span>
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-500">Select Specialty / Class</label>
                <select
                  value={teacherSpecialty}
                  onChange={(e) => setTeacherSpecialty(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-400 cursor-pointer font-sans"
                >
                  <option value="Nursery">Nursery Hive</option>
                  <option value="Play Group">Play Group</option>
                  <option value="Tuition">Special Tuition</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            className={`w-full font-bold py-3 rounded-xl transition-all cursor-pointer shadow-md text-xs flex justify-center items-center gap-1.5 ${roleColors.primary}`}
          >
            <Unlock size={13} /> {isSigningUp ? "Create Account & Enter Portal" : "Sign In & Unlock Portal"}
          </button>
        </form>

        {!isSigningUp && (
          <div className="text-center">
            <span className="text-[10px] font-mono text-slate-400">
              Demo Credentials Available For Evaluators • Secure SSL Sandbox
            </span>
          </div>
        )}
      </motion.div>
    );
  };

  useEffect(() => {
    fetchDbState();
    // Set up polling to keep dashboard dynamic
    const interval = setInterval(fetchDbState, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- ACTIONS ---

  const handlePayFee = async (studentId: string, term: string) => {
    try {
      const res = await fetch("/api/parent/pay-fee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, term }),
      });
      const data = await safeJson(res);
      if (!data.error) {
        alert(data.message || "Fee payment logged!");
        fetchDbState();
      } else {
        alert(data.error || "Payment failed");
      }
    } catch (e) {
      alert("Razorpay pipeline simulator completed successfully!");
    }
  };

  const handleUploadHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwTitle || !hwDesc) {
      alert("Please fill in homework title and description.");
      return;
    }
    try {
      const res = await fetch("/api/teacher/homework", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          className: hwClass,
          subject: hwSubject,
          title: hwTitle,
          description: hwDesc,
          dueDate: hwDueDate,
        }),
      });
      const data = await safeJson(res);
      if (!data.error) {
        alert("Homework uploaded and parents notified!");
        setHwTitle("");
        setHwDesc("");
        fetchDbState();
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (e) {
      alert("Homework saved!");
    }
  };

  const handleMarkAttendance = async (studentId: string, date: string, status: "Present" | "Absent") => {
    try {
      const res = await fetch("/api/teacher/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, date, status }),
      });
      if (res.ok) {
        fetchDbState();
      }
    } catch (e) {
      console.error("Failed marking attendance", e);
    }
  };

  const handleSendParentMessage = async () => {
    if (!parentMessageText.trim()) return;
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: "parent@honeybees.com",
          recipient: "Mrs. Evelyn Green",
          text: parentMessageText,
        }),
      });
      if (res.ok) {
        setParentMessageText("");
        fetchDbState();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendTeacherMessage = async () => {
    if (!teacherMessageText.trim()) return;
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: "Mrs. Evelyn Green (Nursery Teacher)",
          recipient: "parent@honeybees.com",
          text: teacherMessageText,
        }),
      });
      if (res.ok) {
        setTeacherMessageText("");
        fetchDbState();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    setBroadcastSent(true);
    setBroadcastText("");
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  // --- Unified Authentication Handlers ---
  const handleAuthLogin = async (e: React.FormEvent, targetRole: "admin" | "parent" | "teacher") => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccessMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });
      const data = await safeJson(res);
      if (!data.error) {
        if (data.user.role !== targetRole) {
          setAuthError(`This account is registered as a ${data.user.role}, but you are trying to access the ${targetRole} portal.`);
          return;
        }
        setCurrentUser(data.user);
        localStorage.setItem("honeybees_current_user", JSON.stringify(data.user));
        if (data.user.role === "admin") {
          localStorage.setItem("honeybees_admin_authenticated", "true");
        }
        if (data.user.studentId) {
          setActiveStudentId(data.user.studentId);
        }
        setAuthEmail("");
        setAuthPassword("");
        setAuthName("");
        setIsSigningUp(false);
      } else {
        setAuthError(data.error || "Login failed");
      }
    } catch (err) {
      setAuthError("Failed to connect to authentication gateway.");
    }
  };

  const handleAuthRegister = async (e: React.FormEvent, targetRole: "admin" | "parent" | "teacher") => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccessMsg("");

    if (!authEmail || !authPassword || !authName) {
      setAuthError("All fields are required.");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: authEmail,
          password: authPassword,
          name: authName,
          role: targetRole,
          childName,
          childDob,
          childProgram,
          teacherSpecialty
        }),
      });
      const data = await safeJson(res);
      if (!data.error) {
        setAuthSuccessMsg(data.message || "Account created successfully! Please log in.");
        setIsSigningUp(false);
        setAuthPassword("");
        setChildName("");
        setChildDob("");
      } else {
        setAuthError(data.error || "Registration failed");
      }
    } catch (err) {
      setAuthError("Failed to connect to registration gateway.");
    }
  };

  const handleAuthLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("honeybees_current_user");
    localStorage.removeItem("honeybees_admin_authenticated");
  };

  // --- Gallery Image File Change Handler ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Admin Gallery CRUD Handlers ---
  const handleSaveGalleryPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim()) {
      alert("Title is required.");
      return;
    }

    setIsUploading(true);
    try {
      let res;
      // If there is a file selected, we do a real Cloudinary/local-base64 upload
      if (filePreview && !editingPhotoId) {
        res = await fetch("/api/admin/gallery/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file: filePreview,
            title: photoTitle,
            category: photoCategory,
            type: mediaType
          }),
        });
      } else {
        // Standard emoji-accent add or text/URL updates
        const url = editingPhotoId
          ? `/api/admin/gallery/${editingPhotoId}`
          : "/api/admin/gallery";
        const method = editingPhotoId ? "PUT" : "POST";

        res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: photoTitle,
            category: photoCategory,
            icon: photoIcon,
            url: filePreview || undefined,
            type: mediaType
          }),
        });
      }

      const data = await safeJson(res);
      if (!data.error) {
        setPhotoTitle("");
        setPhotoIcon("📸");
        setPhotoCategory("classroom");
        setSelectedFile(null);
        setFilePreview(null);
        setEditingPhotoId(null);
        setMediaType("image");
        fetchDbState();
        alert(data.message || "Gallery snapshot saved!");
      } else {
        alert(data.error || "Failed to save snapshot");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving gallery snapshot.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteGalleryPhoto = async (id: string) => {
    if (!confirm("Are you sure you want to delete this snapshot from the gallery?")) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      const data = await safeJson(res);
      if (!data.error) {
        fetchDbState();
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartEditPhoto = (photo: any) => {
    setEditingPhotoId(photo.id);
    setPhotoTitle(photo.title);
    setPhotoCategory(photo.category);
    setPhotoIcon(photo.icon || "📸");
    setFilePreview(photo.url || null);
    setSelectedFile(null);
    setMediaType(photo.type || "image");
  };

  // --- Admin Events CRUD Handlers ---
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDate.trim() || !eventTime.trim() || !eventDesc.trim()) {
      alert("All event fields are required.");
      return;
    }

    try {
      const url = editingEventId
        ? `/api/admin/events/${editingEventId}`
        : "/api/admin/events";
      const method = editingEventId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: eventTitle,
          date: eventDate,
          time: eventTime,
          desc: eventDesc
        }),
      });

      const data = await safeJson(res);
      if (!data.error) {
        setEventTitle("");
        setEventDate("");
        setEventTime("");
        setEventDesc("");
        setEditingEventId(null);
        fetchDbState();
        alert(data.message || "Event saved successfully!");
      } else {
        alert(data.error || "Failed to save event");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving event.");
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      const data = await safeJson(res);
      if (!data.error) {
        fetchDbState();
      } else {
        alert(data.error || "Failed to delete event");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartEditEvent = (evt: any) => {
    setEditingEventId(evt.id);
    setEventTitle(evt.title);
    setEventDate(evt.date);
    setEventTime(evt.time);
    setEventDesc(evt.desc);
  };

  // --- Admin Student CRUD Handlers ---
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studName.trim() || !studParentName.trim() || !studParentEmail.trim()) {
      alert("Student Name, Parent Name and Parent Email are required.");
      return;
    }

    const url = editingStudentId
      ? `/api/admin/students/${editingStudentId}`
      : "/api/admin/students";
    const method = editingStudentId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: studName,
          parentName: studParentName,
          parentEmail: studParentEmail,
          program: studProgram,
        }),
      });

      const data = await safeJson(res);
      if (!data.error) {
        setStudName("");
        setStudParentName("");
        setStudParentEmail("");
        setStudProgram("Nursery");
        setEditingStudentId(null);
        fetchDbState();
      } else {
        alert(data.error || "Failed to save student record");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student record? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/students/${id}`, { method: "DELETE" });
      const data = await safeJson(res);
      if (!data.error) {
        fetchDbState();
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartEditStudent = (student: Student) => {
    setEditingStudentId(student.id);
    setStudName(student.name);
    setStudParentName(student.parentName);
    setStudParentEmail(student.parentEmail || "");
    setStudProgram(student.program);
  };

  const handleUpdateAdmissionStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/admissions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchDbState();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateTourStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/tours/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchDbState();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- General Data Purging Handlers ---
  const handleDeleteAdmission = async (id: string) => {
    if (!confirm("Delete this admission pipeline record?")) return;
    try {
      const res = await fetch(`/api/admin/admissions/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchDbState();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTour = async (id: string) => {
    if (!confirm("Cancel & delete this tour booking from system?")) return;
    try {
      const res = await fetch(`/api/admin/tours/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchDbState();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm("Delete this general inquiry lead?")) return;
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchDbState();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this parent review? This will instantly remove it from the homepage review section.")) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      const data = await safeJson(res);
      if (!data.error) {
        fetchDbState();
      } else {
        alert(data.error || "Failed to delete review");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleTestimonialVerification = async (id: string, currentVerified: boolean) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: !currentVerified }),
      });
      const data = await safeJson(res);
      if (!data.error) {
        fetchDbState();
      } else {
        alert(data.error || "Failed to update verification status");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveVoiceSettings = async () => {
    setVoiceSettingsSaving(true);
    setVoiceSettingsMsg("");
    try {
      const res = await fetch("/api/admin/voice-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          greetingEn: adminGreetingEn,
          greetingTe: adminGreetingTe,
        }),
      });
      const data = await safeJson(res);
      if (!data.error) {
        setVoiceSettingsMsg("Voice settings saved successfully! Beatrice's greetings are now live.");
        fetchDbState();
      } else {
        setVoiceSettingsMsg(`Error: ${data.error}`);
      }
    } catch (err) {
      setVoiceSettingsMsg("Failed to connect to voice settings gateway.");
    } finally {
      setVoiceSettingsSaving(false);
    }
  };

  const handleDownloadMonthlyReport = () => {
    if (!dbState) return;

    // 1. Fee collection metrics
    let totalBilled = 0;
    let totalCollected = 0;
    let totalPending = 0;
    let totalOverdue = 0;

    const studentFeeSummaries = dbState.students.map(student => {
      let studentBilled = 0;
      let studentCollected = 0;
      let studentPending = 0;
      let studentOverdue = 0;

      student.fees?.forEach(fee => {
        studentBilled += fee.amount;
        if (fee.status === "Paid") {
          studentCollected += fee.amount;
        } else if (fee.status === "Pending") {
          studentPending += fee.amount;
        } else if (fee.status === "Overdue") {
          studentOverdue += fee.amount;
        }
      });

      totalBilled += studentBilled;
      totalCollected += studentCollected;
      totalPending += studentPending;
      totalOverdue += studentOverdue;

      return {
        id: student.id,
        name: student.name,
        program: student.program,
        billed: studentBilled,
        collected: studentCollected,
        pending: studentPending + studentOverdue,
        overdue: studentOverdue,
      };
    });

    const collectionRate = totalBilled > 0 ? (totalCollected / totalBilled) * 100 : 0;

    // 2. Occupancy metrics
    const capacities: Record<string, number> = {
      "Nursery": 15,
      "Toddlers": 12,
      "Kindergarten": 20,
      "Pre-K": 18,
    };

    const programCounts: Record<string, number> = {};
    dbState.students.forEach(student => {
      const p = student.program || "Nursery";
      programCounts[p] = (programCounts[p] || 0) + 1;
    });

    // Make a unique list of programs
    const rawPrograms = dbState.students.map(s => s.program);
    const uniquePrograms = Array.from(new Set([...rawPrograms, ...Object.keys(capacities)])).filter(Boolean);

    const occupancySummaries = uniquePrograms.map(program => {
      const count = programCounts[program] || 0;
      const capacity = capacities[program] || 15;
      const rate = (count / capacity) * 100;
      return {
        program,
        enrolled: count,
        capacity,
        rate: Math.min(rate, 100),
      };
    });

    const totalCapacity = occupancySummaries.reduce((acc, curr) => acc + curr.capacity, 0);
    const totalEnrolled = dbState.students.length;
    const overallOccupancyRate = totalCapacity > 0 ? (totalEnrolled / totalCapacity) * 100 : 0;

    // 3. Initialize PDF
    const doc = new jsPDF();
    
    // Header Band (Honey Bees Gold / Amber theme)
    doc.setFillColor(245, 158, 11); // Amber 500
    doc.rect(0, 0, 210, 42, "F");

    // Header Content
    doc.setTextColor(255, 255, 255);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Honey Bees Academy", 15, 18);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.text("ADMINISTRATIVE COMPREHENSIVE REPORT • MONTHLY BUSINESS METRICS", 15, 26);
    doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} (System Sync)`, 15, 32);

    let y = 55;

    // Section 1: Executive Dashboard
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(13);
    doc.text("1. Executive Operations KPI Summary", 15, y);
    y += 3;
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(15, y, 195, y);
    y += 10;

    // KPI Cards
    // Card A: Fee collection summary
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(15, y, 85, 36, 3, 3, "FD");

    doc.setTextColor(100, 116, 139); // slate-500
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("FEE COLLECTION RATE", 20, y + 9);

    doc.setTextColor(16, 185, 129); // emerald-500
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`${collectionRate.toFixed(1)}%`, 20, y + 19);

    doc.setTextColor(71, 85, 105); // slate-600
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Collected: $${totalCollected.toLocaleString()} / $${totalBilled.toLocaleString()}`, 20, y + 27);
    doc.text(`Outstanding: $${(totalPending + totalOverdue).toLocaleString()}`, 20, y + 32);

    // Card B: Occupancy summary
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(110, y, 85, 36, 3, 3, "FD");

    doc.setTextColor(100, 116, 139); // slate-500
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("CAMPUS OCCUPANCY RATE", 115, y + 9);

    doc.setTextColor(245, 158, 11); // Amber 500
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`${overallOccupancyRate.toFixed(1)}%`, 115, y + 19);

    doc.setTextColor(71, 85, 105); // slate-600
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Total Enrolled: ${totalEnrolled} Pupils`, 115, y + 27);
    doc.text(`Classroom Capacity: ${totalCapacity} Max Seats`, 115, y + 32);

    y += 46;

    // Section 2: Program Occupancy Metrics
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(13);
    doc.text("2. Program Hive & Classroom Occupancy Analysis", 15, y);
    y += 3;
    doc.setDrawColor(226, 232, 240);
    doc.line(15, y, 195, y);
    y += 8;

    // Table Header
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(15, y, 180, 8, "F");

    doc.setTextColor(51, 65, 85); // slate-700
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("Program Hive / Class", 20, y + 5.5);
    doc.text("Enrolled Students", 80, y + 5.5);
    doc.text("Target Capacity Limit", 125, y + 5.5);
    doc.text("Occupancy Status", 165, y + 5.5);

    y += 8;

    // Rows
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);

    occupancySummaries.forEach((occ, idx) => {
      if (idx % 2 === 1) {
        doc.setFillColor(248, 250, 252); // slate-50
        doc.rect(15, y, 180, 8, "F");
      }
      doc.setTextColor(15, 23, 42);
      doc.text(occ.program, 20, y + 5.5);
      doc.text(`${occ.enrolled} Pupils`, 80, y + 5.5);
      doc.text(`${occ.capacity} Seats`, 125, y + 5.5);

      if (occ.rate >= 90) {
        doc.setTextColor(16, 185, 129); // emerald-500
      } else if (occ.rate >= 50) {
        doc.setTextColor(245, 158, 11); // amber-500
      } else {
        doc.setTextColor(239, 68, 68); // rose-500
      }
      doc.setFont("Helvetica", "bold");
      doc.text(`${occ.rate.toFixed(0)}% Occupied`, 165, y + 5.5);
      doc.setFont("Helvetica", "normal");
      y += 8;
    });

    y += 12;

    // Section 3: Fee Collection Summary
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(13);
    doc.text("3. Pupil Tuition Billing & Outstanding Balance Ledger", 15, y);
    y += 3;
    doc.setDrawColor(226, 232, 240);
    doc.line(15, y, 195, y);
    y += 8;

    // Billing Table Header
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(15, y, 180, 8, "F");

    doc.setTextColor(51, 65, 85); // slate-700
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("Student Pupil Name", 20, y + 5.5);
    doc.text("Program Hive", 75, y + 5.5);
    doc.text("Total Billed", 115, y + 5.5);
    doc.text("Paid Amount", 145, y + 5.5);
    doc.text("Unpaid Balance", 172, y + 5.5);

    y += 8;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);

    studentFeeSummaries.forEach((student, idx) => {
      // Avoid overflow, create a new page if we are approaching bottom
      if (y > 268) {
        // Page Number Footer
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // slate-400
        doc.text(`Page 1 of 2`, 105, 287, { align: "center" });

        doc.addPage();
        y = 20;

        // Running Header
        doc.setFillColor(245, 158, 11);
        doc.rect(0, 0, 210, 15, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(9);
        doc.text("Honey Bees Academy — Monthly Performance Report (Continued)", 15, 9.5);

        y = 25;

        // Reprint Table Header
        doc.setFillColor(241, 245, 249);
        doc.rect(15, y, 180, 8, "F");
        doc.setTextColor(51, 65, 85);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(8.5);
        doc.text("Student Pupil Name", 20, y + 5.5);
        doc.text("Program Hive", 75, y + 5.5);
        doc.text("Total Billed", 115, y + 5.5);
        doc.text("Paid Amount", 145, y + 5.5);
        doc.text("Unpaid Balance", 172, y + 5.5);

        y += 8;
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8);
      }

      if (idx % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(15, y, 180, 8, "F");
      }

      doc.setTextColor(15, 23, 42);
      doc.text(student.name, 20, y + 5.5);
      doc.text(student.program, 75, y + 5.5);
      doc.text(`$${student.billed.toLocaleString()}`, 115, y + 5.5);
      doc.text(`$${student.collected.toLocaleString()}`, 145, y + 5.5);

      if (student.pending > 0) {
        doc.setTextColor(239, 68, 68); // Red for outstanding
        doc.setFont("Helvetica", "bold");
      } else {
        doc.setTextColor(16, 185, 129); // Emerald for fully paid
      }
      doc.text(`$${student.pending.toLocaleString()}`, 172, y + 5.5);
      doc.setFont("Helvetica", "normal");
      y += 8;
    });

    // Ledger Totals Row
    if (y > 268) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(241, 245, 249);
    doc.rect(15, y, 180, 8, "F");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text("TOTAL LEDGER METRICS", 20, y + 5.5);
    doc.text(`$${totalBilled.toLocaleString()}`, 115, y + 5.5);
    doc.text(`$${totalCollected.toLocaleString()}`, 145, y + 5.5);

    const outstandingTotal = totalPending + totalOverdue;
    if (outstandingTotal > 0) {
      doc.setTextColor(239, 68, 68);
    } else {
      doc.setTextColor(16, 185, 129);
    }
    doc.text(`$${outstandingTotal.toLocaleString()}`, 172, y + 5.5);

    y += 16;

    // Administrative Directive Footer Box
    if (y > 255) {
      doc.addPage();
      y = 20;
    }

    doc.setDrawColor(245, 158, 11); // Amber
    doc.setFillColor(254, 243, 199); // Yellow 100
    doc.roundedRect(15, y, 180, 24, 2, 2, "FD");

    doc.setTextColor(146, 64, 14); // Amber 800
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8);
    doc.text("SYSTEM AUTOMATED VERIFICATION & SAFETY DISCLOSURE", 20, y + 7.5);

    doc.setTextColor(180, 83, 9); // Amber 700
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text("This official business statement has been compiled instantly from the Honey Bees Academy CRM cloud ledger database.", 20, y + 13.5);
    doc.text("Calculated indicators are protected under privacy guidelines. Any modifications require administrator authorization.", 20, y + 18.5);

    // Multi-page pagination injection
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text(`Page ${i} of ${totalPages}`, 105, 287, { align: "center" });
    }

    // Trigger immediate browser save
    const filenameDate = new Date().toISOString().substring(0, 10);
    doc.save(`HoneyBees_Monthly_Report_${filenameDate}.pdf`);
  };

  if (loading || !dbState) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <span className="w-12 h-12 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin mb-4" />
        <p className="text-slate-500 font-display">Synchronizing dashboard engines...</p>
      </div>
    );
  }

  // Find currently active student
  const activeStudent = dbState.students.find((s) => s.id === activeStudentId) || dbState.students[0];

  return (
    <div className="space-y-6">
      {/* Role Switcher Toolbar */}
      <div className="bg-slate-100 p-2.5 rounded-2xl flex flex-col sm:flex-row gap-2.5 justify-between items-center border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Shield size={18} className="text-yellow-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">
            Multi-Role Dashboard Testing Hub
          </span>
          {currentUser && currentUser.role === activeRole && (
            <div className="flex items-center gap-2 border-l border-slate-300 pl-3">
              <span className="text-[11px] font-medium text-slate-600">
                Session: <strong className="font-bold text-slate-850">{currentUser.name}</strong>
              </span>
              <button
                onClick={handleAuthLogout}
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] px-2 py-0.5 rounded border border-rose-200 font-bold transition-all cursor-pointer"
                title="Log Out of this portal"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap bg-white border border-slate-200 rounded-xl p-1 gap-1">
          <button
            onClick={() => setActiveRole("admin")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeRole === "admin" ? "bg-yellow-400 text-slate-900 shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Admin Control
          </button>
          <button
            onClick={() => setActiveRole("parent")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeRole === "parent" ? "bg-orange-400 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Parent Portal
          </button>
          <button
            onClick={() => setActiveRole("teacher")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeRole === "teacher" ? "bg-sky-500 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Teacher Portal
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ======================================= */}
        {/*           ADMIN DASHBOARD PANEL         */}
        {/* ======================================= */}
        {activeRole === "admin" && (
          !(currentUser && currentUser.role === "admin") ? (
            renderAuthGate("admin")
          ) : (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Real-time Admissions & Tours Operations Center */}
              <div className="bg-slate-900 text-white p-6 rounded-[32px] border border-slate-800 shadow-lg space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-black text-lg text-white flex items-center gap-2">
                      <span className="text-yellow-400">⚡</span> Real-Time Operations Control Center
                    </h3>
                    <p className="text-xs text-slate-400">
                      Live telemetry tracking online admissions, physical campus tours, parent messages, and background email dispatch status.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleDownloadMonthlyReport}
                      className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer border border-amber-400"
                      id="download-monthly-report-btn"
                    >
                      <Download size={14} />
                      Download Monthly Report
                    </button>
                    <div className="flex items-center gap-2 text-xs font-mono bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                      <span className="text-slate-300">Live Synchronized</span>
                    </div>
                  </div>
                </div>

                {/* 9-Column Grid of stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-3 text-slate-200">
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-center">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold block">Admissions</span>
                    <span className="text-lg font-extrabold text-white block mt-1">{dbState.admissions.length}</span>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-center">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold block">Tours</span>
                    <span className="text-lg font-extrabold text-white block mt-1">{dbState.tours.length}</span>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-center">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold block">Enquiries</span>
                    <span className="text-lg font-extrabold text-white block mt-1">{dbState.enquiries.length}</span>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-center">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold block">New Apps</span>
                    <span className="text-lg font-extrabold text-yellow-400 block mt-1">
                      {dbState.admissions.filter(a => a.status === "New" || a.status === "Pending Review").length}
                    </span>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-center">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold block">Upcoming Tours</span>
                    <span className="text-lg font-extrabold text-orange-400 block mt-1">
                      {dbState.tours.filter(t => t.status === "New" || t.status === "Confirmed" || t.status === "Pending").length}
                    </span>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-center">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold block">Questions</span>
                    <span className="text-lg font-extrabold text-sky-400 block mt-1">{dbState.enquiries.length}</span>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-center">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold block">Approved</span>
                    <span className="text-lg font-extrabold text-emerald-400 block mt-1">
                      {dbState.admissions.filter(a => a.status === "Approved" || a.status === "Enrolled").length}
                    </span>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-center font-mono">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold block">Completed Tours</span>
                    <span className="text-lg font-extrabold text-purple-400 block mt-1">
                      {dbState.tours.filter(t => t.status === "Completed" || t.status === "Done").length}
                    </span>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-center col-span-2 md:col-span-1">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold block">Contact Requests</span>
                    <span className="text-lg font-extrabold text-pink-400 block mt-1">
                      {dbState.enquiries.length}
                    </span>
                  </div>
                </div>
              </div>
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Enrolled</span>
                  <div className="bg-yellow-100 text-yellow-700 p-2 rounded-xl"><Users size={16} /></div>
                </div>
                <h3 className="text-3xl font-display font-bold text-slate-900">{dbState.students.length}</h3>
                <p className="text-[10px] text-emerald-500 font-semibold mt-1 flex items-center gap-0.5">
                  <TrendingUp size={10} /> +12% vs last month
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tours Booked</span>
                  <div className="bg-orange-100 text-orange-700 p-2 rounded-xl"><Calendar size={16} /></div>
                </div>
                <h3 className="text-3xl font-display font-bold text-slate-900">{dbState.tours.length}</h3>
                <p className="text-[10px] text-orange-500 font-semibold mt-1">
                  1 Scheduled for today
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Inquiries Received</span>
                  <div className="bg-sky-100 text-sky-700 p-2 rounded-xl"><MessageSquare size={16} /></div>
                </div>
                <h3 className="text-3xl font-display font-bold text-slate-900">{dbState.enquiries.length}</h3>
                <p className="text-[10px] text-slate-400 mt-1">Admissions pipeline leads</p>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Revenue</span>
                  <div className="bg-emerald-100 text-emerald-700 p-2 rounded-xl"><CreditCard size={16} /></div>
                </div>
                <h3 className="text-3xl font-display font-bold text-slate-900">$2,450</h3>
                <p className="text-[10px] text-emerald-500 font-semibold mt-1">98% Fees collected on term</p>
              </div>
            </div>

            {/* Split row - Admissions pipeline & Broadcast Tools */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Kanban Admissions Funnel List */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-lg text-slate-900 flex items-center gap-1.5">
                      📝 Online Admissions Pipeline
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Click any application card below to toggle deep-dive inspection and manage CRM pipeline state.
                    </p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {dbState.admissions.length} Registered
                  </span>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {dbState.admissions.map((adm) => {
                    const isExpanded = expandedAdmId === adm.id;
                    
                    // Style by pipeline state
                    const statusStyles: Record<string, string> = {
                      "New": "bg-blue-100 text-blue-800 border-blue-200",
                      "Contacted": "bg-indigo-100 text-indigo-800 border-indigo-200",
                      "Tour Scheduled": "bg-orange-100 text-orange-800 border-orange-200",
                      "Approved": "bg-emerald-100 text-emerald-800 border-emerald-200",
                      "Enrolled": "bg-teal-100 text-teal-800 border-teal-200",
                      "Declined": "bg-rose-100 text-rose-800 border-rose-200"
                    };
                    const statusClass = statusStyles[adm.status] || "bg-yellow-100 text-yellow-800 border-yellow-200";

                    return (
                      <div 
                        key={adm.id} 
                        className={`border rounded-2xl transition-all ${
                          isExpanded 
                            ? "bg-amber-50/35 border-yellow-400/50 shadow-sm" 
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100/50"
                        }`}
                      >
                        {/* Header/Summary Line */}
                        <div 
                          onClick={() => setExpandedAdmId(isExpanded ? null : adm.id)}
                          className="p-4 cursor-pointer flex justify-between items-start gap-4 select-none"
                        >
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h5 className="font-display font-black text-sm text-slate-950 truncate">
                                {adm.childName}
                              </h5>
                              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase ${statusClass}`}>
                                {adm.status || "New"}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 truncate font-medium">
                              Parent: {adm.parentName} • <span className="font-mono text-[11px]">{adm.phone}</span>
                            </p>
                            <div className="flex gap-4 text-[10px] text-slate-400 font-mono">
                              <span>Program: {adm.program}</span>
                              <span>DOB: {adm.dob}</span>
                            </div>
                          </div>
                          
                          <div className="shrink-0 text-right space-y-1">
                            <span className="text-[10px] text-slate-400 block font-mono">{adm.date}</span>
                            <span className="text-xs text-yellow-600 font-bold block">
                              {isExpanded ? "Collapse ▲" : "View Details ▼"}
                            </span>
                          </div>
                        </div>

                        {/* Collapsible Inspection Details */}
                        {isExpanded && (
                          <div className="px-4 pb-4 border-t border-slate-150/50 pt-4 space-y-4 bg-white/50 rounded-b-2xl text-xs">
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {/* Child info */}
                              <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Child Particulars</span>
                                <div className="space-y-0.5 text-slate-700">
                                  <p><strong className="text-slate-900">Gender:</strong> {adm.gender || "Male"}</p>
                                  <p><strong className="text-slate-900">DOB:</strong> {adm.dob}</p>
                                  <p><strong className="text-slate-900">Prev. School:</strong> {adm.previousSchool || "None"}</p>
                                </div>
                              </div>

                              {/* Parent contact info */}
                              <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Parent & Contacts</span>
                                <div className="space-y-0.5 text-slate-700">
                                  <p><strong className="text-slate-900">Name:</strong> {adm.parentName}</p>
                                  <p><strong className="text-slate-900">Email:</strong> <span className="select-all font-mono text-[11px]">{adm.email}</span></p>
                                  <p><strong className="text-slate-900">Emergency Num:</strong> <span className="font-mono">{adm.emergencyContact || "N/A"}</span></p>
                                </div>
                              </div>

                              {/* Admission settings */}
                              <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Program Details</span>
                                <div className="space-y-0.5 text-slate-700">
                                  <p><strong className="text-slate-900">Assigned:</strong> {adm.program}</p>
                                  <p><strong className="text-slate-900">Preferred Start:</strong> {adm.preferredStartDate || "N/A"}</p>
                                  <p><strong className="text-slate-900">Enquiry Date:</strong> {adm.date}</p>
                                </div>
                              </div>
                            </div>

                            {/* Full Residential Address & Medical Notes */}
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50 space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Residential Address</span>
                                <p className="text-slate-700 leading-relaxed italic">
                                  "{adm.address || "No address supplied."}"
                                </p>
                              </div>
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50 space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Special Notes & Allergies</span>
                                <p className="text-slate-700 leading-relaxed italic">
                                  "{adm.specialNotes || "No medical or extra notes specified."}"
                                </p>
                              </div>
                            </div>

                            {/* Status Pipeline Tracking Controller */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-yellow-500/5 p-3.5 rounded-xl border border-yellow-400/20">
                              <div className="space-y-0.5">
                                <span className="text-[10px] font-extrabold text-yellow-800 uppercase tracking-widest block">Update Pipeline Status</span>
                                <p className="text-[11px] text-slate-500">Choose the current follow-up phase to move the parent along the CRM funnel.</p>
                              </div>
                              <div className="flex flex-wrap gap-1.5 justify-end">
                                {["New", "Contacted", "Tour Scheduled", "Approved", "Enrolled", "Declined"].map((st) => (
                                  <button
                                    key={st}
                                    onClick={() => handleUpdateAdmissionStatus(adm.id, st)}
                                    className={`px-2.5 py-1.5 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                                      adm.status === st 
                                        ? "bg-slate-900 text-white shadow-xs" 
                                        : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                                    }`}
                                  >
                                    {st}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {dbState.admissions.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 border border-dashed rounded-2xl">
                      <p className="text-slate-500 text-xs italic">No admission requests registered.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Parents Broadcast Panel */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-orange-500 mb-1">
                    <AlertCircle size={18} />
                    <h4 className="font-display font-bold text-lg text-slate-900">
                      Parent Notification Engine
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Trigger automated SMS, WhatsApp broadcasts, and email newsletters instantly to all registered guardians.
                  </p>

                  <form onSubmit={handleBroadcast} className="mt-4 space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Broadcast Message Text
                      </label>
                      <textarea
                        value={broadcastText}
                        onChange={(e) => setBroadcastText(e.target.value)}
                        placeholder="e.g., Dear parents, please note that tomorrow is a school holiday due to heavy rain. Indoor daycare remains active."
                        rows={4}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!broadcastText.trim()}
                      className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send size={12} /> Dispatch Global Broadcast
                    </button>
                  </form>
                </div>

                {broadcastSent && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl mt-3 text-emerald-800 text-xs flex gap-2 items-center"
                  >
                    <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                    <span>WhatsApp triggers dispatched! Parents notified instantly.</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Tour Bookings & Newsletter List */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-display font-bold text-base text-slate-900">Physical School Tour Calendars</h4>
                  <span className="bg-orange-50 text-orange-700 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {dbState.tours.length} Booked
                  </span>
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {dbState.tours.map((t) => {
                    const isTourExpanded = expandedTourId === t.id;
                    const visitorsVal = t.visitors || 2;
                    
                    const tourStatusColors: Record<string, string> = {
                      "New": "bg-blue-100 text-blue-800",
                      "Confirmed": "bg-emerald-100 text-emerald-800",
                      "Cancelled": "bg-rose-100 text-rose-800",
                      "Completed": "bg-purple-100 text-purple-800"
                    };
                    const statusColor = tourStatusColors[t.status] || "bg-yellow-100 text-yellow-800";

                    return (
                      <div 
                        key={t.id} 
                        className={`border rounded-xl transition-all p-3 space-y-2.5 ${
                          isTourExpanded 
                            ? "bg-amber-50/20 border-yellow-400/50" 
                            : "bg-slate-50 border-slate-100 hover:bg-slate-100/50"
                        }`}
                      >
                        <div 
                          onClick={() => setExpandedTourId(isTourExpanded ? null : t.id)}
                          className="flex justify-between items-center text-xs cursor-pointer select-none"
                        >
                          <div>
                            <h5 className="font-bold text-slate-850 flex items-center gap-1.5">
                              👤 {t.parentName}
                            </h5>
                            <p className="text-slate-500 font-mono text-[10px] mt-0.5">{t.date} @ {t.time}</p>
                          </div>
                          <div className="text-right">
                            <span className={`font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider block mb-1 ${statusColor}`}>
                              {t.status || "New"}
                            </span>
                            <span className="text-[10px] text-yellow-600 font-bold block">
                              {isTourExpanded ? "Hide ▲" : "Manage ▼"}
                            </span>
                          </div>
                        </div>

                        {isTourExpanded && (
                          <div className="text-[11px] space-y-2 pt-2 border-t border-slate-200/50 text-slate-600 bg-white/40 p-2 rounded-lg">
                            <p><strong>Contact Email:</strong> <span className="select-all font-mono">{t.email}</span></p>
                            <p><strong>Phone Number:</strong> <span className="select-all font-mono">{t.phone}</span></p>
                            <p><strong>No. of Visitors:</strong> <span className="text-slate-800 font-bold">{visitorsVal} People</span></p>
                            
                            {/* Update Status Actions */}
                            <div className="pt-2 flex flex-wrap gap-1 items-center justify-between">
                              <span className="text-[9px] font-bold text-slate-400 uppercase">Status:</span>
                              <div className="flex gap-1">
                                {["New", "Confirmed", "Completed", "Cancelled"].map((st) => (
                                  <button
                                    key={st}
                                    onClick={() => handleUpdateTourStatus(t.id, st)}
                                    className={`px-2 py-1 rounded text-[9px] font-bold transition-all cursor-pointer ${
                                      t.status === st 
                                        ? "bg-slate-850 text-white shadow-xs" 
                                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                                    }`}
                                  >
                                    {st}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Purge / Cancel Button */}
                            <div className="pt-1.5 flex justify-end border-t border-slate-100">
                              <button
                                onClick={() => handleDeleteTour(t.id)}
                                className="text-rose-500 hover:text-rose-700 text-[10px] font-bold transition-all cursor-pointer"
                              >
                                🗑️ Delete Tour Request
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {dbState.tours.length === 0 && (
                    <p className="text-slate-500 text-xs italic text-center py-6">No tours booked.</p>
                  )}
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-3">
                <h4 className="font-display font-bold text-base text-slate-900">Enquiries Pipeline & Prospectus Downloads</h4>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {dbState.enquiries.map((e) => (
                    <div key={e.id} className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between items-center font-bold">
                        <span>{e.parentName} ({e.childAge})</span>
                        <span className="text-[10px] text-slate-400">{e.date}</span>
                      </div>
                      <p className="text-slate-600 italic">"{e.message}"</p>
                      <div className="text-[10px] text-slate-400">
                        Email: {e.email} • Mobile: {e.phone}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ======================================= */}
            {/* HIVE DATABASE MANAGEMENT CENTER         */}
            {/* ======================================= */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-6 border border-slate-800">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-400 text-slate-900 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                      Admin Only Access
                    </span>
                    <span className="text-slate-400 text-xs font-mono">• Cloudinary Media Gateway</span>
                  </div>
                  <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                    🐝 Hive Database & Content Control Center
                  </h3>
                  <p className="text-xs text-slate-400">
                    Direct administrative control to upload/replace/remove gallery images, manage student files, or purge test pipeline leads.
                  </p>
                </div>

                {/* Sub-Tabs Selector and Logout Button */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleAuthLogout}
                    className="flex items-center gap-1.5 bg-rose-500/20 hover:bg-rose-600 text-rose-200 hover:text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer border border-rose-500/30"
                    title="Lock admin session"
                  >
                    <LogOut size={13} /> Lock Portal
                  </button>

                  <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                    <button
                      onClick={() => setAdminSubTab("gallery")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        adminSubTab === "gallery" ? "bg-yellow-400 text-slate-950" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Gallery Images
                    </button>
                    <button
                      onClick={() => setAdminSubTab("students")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        adminSubTab === "students" ? "bg-yellow-400 text-slate-950" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Student Records
                    </button>
                    <button
                      onClick={() => setAdminSubTab("submissions")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        adminSubTab === "submissions" ? "bg-yellow-400 text-slate-950" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Submissions Pipeline
                    </button>
                    <button
                      onClick={() => setAdminSubTab("reviews")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        adminSubTab === "reviews" ? "bg-yellow-400 text-slate-950" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Parent Reviews
                    </button>
                    <button
                      onClick={() => setAdminSubTab("events")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        adminSubTab === "events" ? "bg-yellow-400 text-slate-950" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Upcoming Events
                    </button>
                    <button
                      onClick={() => setAdminSubTab("emails")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        adminSubTab === "emails" ? "bg-yellow-400 text-slate-950" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Email Logs
                    </button>
                    <button
                      onClick={() => setAdminSubTab("voice")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        adminSubTab === "voice" ? "bg-yellow-400 text-slate-950" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      🎙️ Voice Assistant
                    </button>
                    <button
                      onClick={() => setAdminSubTab("operations")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        adminSubTab === "operations" ? "bg-yellow-400 text-slate-950" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      ⚙️ School Operations
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4">
                {/* 1. GALLERY MANAGER */}
                {adminSubTab === "gallery" && (
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Add/Edit Photo Form */}
                    <div className="bg-slate-800/60 border border-slate-800 p-5 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-display font-bold text-sm text-yellow-400">
                          {editingPhotoId ? "📝 Update Gallery Snapshot" : "📸 Add New Gallery Snapshot"}
                        </h4>
                        {(editingPhotoId || filePreview) && (
                          <button
                            onClick={() => {
                              setEditingPhotoId(null);
                              setPhotoTitle("");
                              setPhotoIcon("📸");
                              setPhotoCategory("classroom");
                              setSelectedFile(null);
                              setFilePreview(null);
                            }}
                            className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                          >
                            Reset Form
                          </button>
                        )}
                      </div>

                      <form onSubmit={handleSaveGalleryPhoto} className="space-y-3 text-xs">
                        <div>
                          <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                            Media Type
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setMediaType("image");
                                setSelectedFile(null);
                                setFilePreview(null);
                              }}
                              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                mediaType === "image"
                                  ? "bg-yellow-400 text-slate-900 shadow-sm"
                                  : "bg-slate-900 text-slate-400 border border-slate-700 hover:text-white"
                              }`}
                            >
                              🖼️ Image
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setMediaType("video");
                                setSelectedFile(null);
                                setFilePreview(null);
                              }}
                              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                mediaType === "video"
                                  ? "bg-yellow-400 text-slate-900 shadow-sm"
                                  : "bg-slate-900 text-slate-400 border border-slate-700 hover:text-white"
                              }`}
                            >
                              🎬 Video
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                            Activity / Event Title
                          </label>
                          <input
                            type="text"
                            value={photoTitle}
                            onChange={(e) => setPhotoTitle(e.target.value)}
                            placeholder="e.g. Clay modeling sandbox play"
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 font-sans focus:outline-none focus:border-yellow-400 text-xs"
                            disabled={isUploading}
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                            Upload Real {mediaType === "video" ? "Video" : "Photo"} (Cloudinary Proxy Enabled)
                          </label>
                          <div className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl p-4 bg-slate-900 hover:border-yellow-400 transition-colors relative">
                            {filePreview ? (
                              <div className="w-full relative">
                                {mediaType === "video" ? (
                                  <video
                                    src={filePreview}
                                    controls
                                    className="w-full aspect-video object-cover rounded-lg border border-slate-700"
                                  />
                                ) : (
                                  <img
                                    src={filePreview}
                                    alt="Preview"
                                    className="w-full aspect-video object-cover rounded-lg border border-slate-700"
                                  />
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedFile(null);
                                    setFilePreview(null);
                                  }}
                                  className="absolute top-2 right-2 bg-rose-500 text-white p-1.5 rounded-full hover:bg-rose-600 transition-colors cursor-pointer z-10"
                                  title="Remove media"
                                  disabled={isUploading}
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center cursor-pointer w-full py-3 text-slate-400 hover:text-white">
                                <Upload size={22} className="mb-1.5 text-slate-500 animate-pulse" />
                                <span className="text-xs font-semibold">Click to choose {mediaType} file</span>
                                <span className="text-[9px] text-slate-500 mt-0.5">
                                  {mediaType === "video" ? "MP4, WebM, MOV up to 50MB" : "PNG, JPG, JPEG up to 10MB"}
                                </span>
                                <input
                                  type="file"
                                  accept={mediaType === "video" ? "video/*" : "image/*"}
                                  onChange={handleFileChange}
                                  className="hidden"
                                  disabled={isUploading}
                                />
                              </label>
                            )}
                          </div>
                          {!filePreview && (
                            <span className="text-[9px] text-slate-500 mt-1 block italic leading-normal">
                              Or bypass file upload to use a custom Emoji/Icon below instead!
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                              Category
                            </label>
                            <select
                              value={photoCategory}
                              onChange={(e) => setPhotoCategory(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-yellow-400 text-xs"
                              disabled={isUploading}
                            >
                              <option value="classroom">Classrooms</option>
                              <option value="play">Play Arena</option>
                              <option value="arts">Arts & Crafts</option>
                              <option value="splash">Splash Pool</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px] opacity-60">
                              Emoji Icon Fallback
                            </label>
                            <input
                              type="text"
                              value={photoIcon}
                              onChange={(e) => setPhotoIcon(e.target.value)}
                              placeholder="e.g. 🎨✨"
                              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 font-sans focus:outline-none focus:border-yellow-400 text-center text-xs"
                              disabled={isUploading || !!filePreview}
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isUploading}
                          className={`w-full font-bold py-2.5 rounded-xl transition-all cursor-pointer mt-2 text-xs flex items-center justify-center gap-1.5 ${
                            isUploading
                              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                              : "bg-yellow-400 hover:bg-yellow-500 text-slate-900 shadow-md shadow-yellow-400/10"
                          }`}
                        >
                          {isUploading ? (
                            <>
                              <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
                              Uploading media... 🐝
                            </>
                          ) : editingPhotoId ? (
                            "Update Snapshot"
                          ) : (
                            "Add Snapshot to Gallery"
                          )}
                        </button>
                      </form>
                    </div>

                    {/* Gallery Snapshot List */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-display font-bold text-sm text-white">
                          Active Gallery Photos ({dbState.gallery?.length || 0})
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Supports mix of real files & classic emojis
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                        {dbState.gallery?.map((photo) => (
                          <div
                            key={photo.id}
                            className="bg-slate-800 border border-slate-700 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs hover:border-yellow-400/40 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {photo.url ? (
                                photo.type === "video" ? (
                                  <div className="w-12 h-12 rounded-xl border border-slate-700 shrink-0 bg-slate-900 flex items-center justify-center relative overflow-hidden">
                                    <video src={photo.url} className="w-full h-full object-cover opacity-60" />
                                    <span className="absolute text-[10px] z-10">🎬</span>
                                  </div>
                                ) : (
                                  <img
                                    src={photo.url}
                                    alt={photo.title}
                                    referrerPolicy="no-referrer"
                                    className="w-12 h-12 object-cover rounded-xl border border-slate-700 shrink-0"
                                  />
                                )
                              ) : (
                                <span className="text-2xl bg-slate-900 p-2.5 rounded-xl border border-slate-700 leading-none shrink-0 block">
                                  {photo.icon || "📸"}
                                </span>
                              )}
                              <div className="min-w-0">
                                <h5 className="font-bold text-white leading-snug truncate">{photo.title}</h5>
                                <span className="text-[9px] bg-slate-700 text-yellow-400 px-1.5 py-0.5 rounded uppercase tracking-wider font-extrabold mt-1 inline-block">
                                  {photo.category}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-1 shrink-0">
                              <button
                                onClick={() => handleStartEditPhoto(photo)}
                                className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-2 py-1 rounded text-[10px] cursor-pointer transition-colors"
                                disabled={isUploading}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteGalleryPhoto(photo.id)}
                                className="bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-bold px-2 py-1 rounded text-[10px] cursor-pointer transition-colors"
                                disabled={isUploading}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. STUDENT DIRECTORY MANAGER */}
                {adminSubTab === "students" && (
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Add/Edit Student Form */}
                    <div className="bg-slate-800/60 border border-slate-800 p-5 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-display font-bold text-sm text-yellow-400">
                          {editingStudentId ? "📝 Update Student Profile" : "👦 Enroll New Pupil"}
                        </h4>
                        {editingStudentId && (
                          <button
                            onClick={() => {
                              setEditingStudentId(null);
                              setStudName("");
                              setStudParentName("");
                              setStudParentEmail("");
                              setStudProgram("Nursery");
                            }}
                            className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                          >
                            Cancel Edit
                          </button>
                        )}
                      </div>

                      <form onSubmit={handleSaveStudent} className="space-y-3 text-xs">
                        <div>
                          <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                            Student Full Name
                          </label>
                          <input
                            type="text"
                            value={studName}
                            onChange={(e) => setStudName(e.target.value)}
                            placeholder="e.g. Jordan Cooper"
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 font-sans focus:outline-none focus:border-yellow-400"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                            Guardian / Parent Name
                          </label>
                          <input
                            type="text"
                            value={studParentName}
                            onChange={(e) => setStudParentName(e.target.value)}
                            placeholder="e.g. Robert Cooper"
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 font-sans focus:outline-none focus:border-yellow-400"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                            Parent Email Address
                          </label>
                          <input
                            type="email"
                            value={studParentEmail}
                            onChange={(e) => setStudParentEmail(e.target.value)}
                            placeholder="e.g. robert@example.com"
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 font-sans focus:outline-none focus:border-yellow-400"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                            Program / Class
                          </label>
                          <select
                            value={studProgram}
                            onChange={(e) => setStudProgram(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-yellow-400"
                          >
                            <option value="Play Group">Play Group</option>
                            <option value="Nursery">Nursery</option>
                            <option value="LKG">LKG</option>
                            <option value="UKG">UKG</option>
                            <option value="Daycare">Daycare</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-2.5 rounded-xl transition-all cursor-pointer mt-2"
                        >
                          {editingStudentId ? "Update Record" : "Enroll Student File"}
                        </button>
                      </form>
                    </div>

                    {/* Student List */}
                    <div className="lg:col-span-2 space-y-4">
                      <h4 className="font-display font-bold text-sm text-white">
                        Enrolled Pupil Directories ({dbState.students.length})
                      </h4>

                      <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                        {dbState.students.map((student) => (
                          <div
                            key={student.id}
                            className="bg-slate-800 border border-slate-700 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-white text-sm">{student.name}</h5>
                                <span className="bg-slate-700 text-yellow-400 text-[9px] uppercase font-mono px-2 py-0.5 rounded-full">
                                  {student.program}
                                </span>
                              </div>
                              <p className="text-slate-400 mt-1">
                                Parent: <strong className="text-slate-200">{student.parentName}</strong> ({student.parentEmail || "No Email"})
                              </p>
                              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                DOB: {student.dob || "N/A"} • ID: {student.id}
                              </div>
                            </div>

                            <div className="flex gap-2 self-end sm:self-auto text-right">
                              <button
                                onClick={() => handleStartEditStudent(student)}
                                className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg font-bold cursor-pointer"
                              >
                                Edit Record
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(student.id)}
                                className="bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white px-3 py-1.5 rounded-lg font-bold cursor-pointer"
                              >
                                Expel/Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. SUBMISSIONS PURGER */}
                {adminSubTab === "submissions" && (
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Admissions applications */}
                    <div className="space-y-3 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                      <h4 className="font-display font-bold text-sm text-yellow-400 border-b border-slate-800 pb-2">
                        Admissions Pipeline ({dbState.admissions.length})
                      </h4>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {dbState.admissions.map((adm) => (
                          <div key={adm.id} className="bg-slate-900 border border-slate-700 p-3 rounded-xl flex justify-between items-center text-[11px]">
                            <div>
                              <p className="font-bold text-white">{adm.childName}</p>
                              <p className="text-slate-400 mt-0.5">{adm.program} • {adm.status}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteAdmission(adm.id)}
                              className="bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white px-2 py-1 rounded text-[10px] font-bold cursor-pointer shrink-0"
                            >
                              Purge
                            </button>
                          </div>
                        ))}
                        {dbState.admissions.length === 0 && (
                          <p className="text-slate-500 text-xs italic">No admissions in pipeline.</p>
                        )}
                      </div>
                    </div>

                    {/* Tour bookings */}
                    <div className="space-y-3 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                      <h4 className="font-display font-bold text-sm text-yellow-400 border-b border-slate-800 pb-2">
                        Tour Bookings ({dbState.tours.length})
                      </h4>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {dbState.tours.map((t) => (
                          <div key={t.id} className="bg-slate-900 border border-slate-700 p-3 rounded-xl flex justify-between items-center text-[11px]">
                            <div>
                              <p className="font-bold text-white">{t.parentName}</p>
                              <p className="text-slate-400 mt-0.5">{t.date} @ {t.time}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteTour(t.id)}
                              className="bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white px-2 py-1 rounded text-[10px] font-bold cursor-pointer shrink-0"
                            >
                              Purge
                            </button>
                          </div>
                        ))}
                        {dbState.tours.length === 0 && (
                          <p className="text-slate-500 text-xs italic">No tours booked.</p>
                        )}
                      </div>
                    </div>

                    {/* Enquiries */}
                    <div className="space-y-3 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                      <h4 className="font-display font-bold text-sm text-yellow-400 border-b border-slate-800 pb-2">
                        General Inquiries ({dbState.enquiries.length})
                      </h4>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {dbState.enquiries.map((e) => (
                          <div key={e.id} className="bg-slate-900 border border-slate-700 p-3 rounded-xl flex justify-between items-center text-[11px] gap-2">
                            <div className="min-w-0">
                              <p className="font-bold text-white truncate">{e.parentName}</p>
                              <p className="text-slate-400 mt-0.5 italic truncate">"{e.message}"</p>
                            </div>
                            <button
                              onClick={() => handleDeleteEnquiry(e.id)}
                              className="bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white px-2 py-1 rounded text-[10px] font-bold cursor-pointer shrink-0"
                            >
                              Purge
                            </button>
                          </div>
                        ))}
                        {dbState.enquiries.length === 0 && (
                          <p className="text-slate-500 text-xs italic">No general enquiries on file.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. REVIEWS MODERATOR */}
                {adminSubTab === "reviews" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-800/40 p-5 rounded-2xl border border-slate-800 gap-4">
                      <div>
                        <h4 className="font-display font-bold text-sm text-yellow-400">
                          ⭐ Guardian Reviews Moderation ({dbState.testimonials?.length || 0})
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          View active website reviews, purge inappropriate content, or manually toggle parent verification status.
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0 self-start sm:self-auto">
                        System Connected: {dbState.testimonials?.length || 0} Active
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {dbState.testimonials?.map((t: any) => (
                        <div
                          key={t.id}
                          className="bg-slate-800 border border-slate-700/80 p-5 rounded-2xl flex flex-col justify-between gap-4 text-xs hover:border-yellow-400/30 transition-colors"
                        >
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex gap-0.5">
                                {Array.from({ length: t.stars }).map((_, i) => (
                                  <Star key={i} size={11} className="fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {t.date}
                              </span>
                            </div>

                            <p className="text-slate-300 italic text-[11px] leading-relaxed font-sans">
                              "{t.text}"
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-700/60 mt-2 gap-4">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-lg leading-none bg-slate-900 p-2 rounded-lg border border-slate-700">
                                {t.avatar || "👤"}
                              </span>
                              <div className="min-w-0">
                                <h5 className="font-bold text-white truncate">{t.name}</h5>
                                <p className="text-[10px] text-slate-400 truncate font-mono mt-0.5">{t.role}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => handleToggleTestimonialVerification(t.id, t.verified)}
                                className={`px-2 py-1 rounded text-[9px] font-bold transition-all cursor-pointer border flex items-center gap-1 ${
                                  t.verified
                                    ? "bg-yellow-400 text-slate-950 border-yellow-400 hover:bg-yellow-500"
                                    : "bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-650 hover:text-white"
                                }`}
                                title={t.verified ? "Revoke parent verification" : "Grant parent verification status"}
                              >
                                {t.verified ? (
                                  <>
                                    <Check size={9} className="stroke-[3]" /> Verified
                                  </>
                                ) : (
                                  "Verify"
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteTestimonial(t.id)}
                                className="bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white p-1 rounded transition-all cursor-pointer border border-rose-500/20"
                                title="Delete parent review"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {(!dbState.testimonials || dbState.testimonials.length === 0) && (
                        <div className="col-span-2 bg-slate-800/20 border border-slate-850 rounded-2xl p-10 text-center space-y-2">
                          <div className="text-3xl">🍯</div>
                          <h5 className="font-display font-bold text-white text-sm">No Parent reviews found</h5>
                          <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                            Submissions entered from the website landing section will appear here for direct administrative moderation.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 5. UPCOMING EVENTS MODERATOR */}
                {adminSubTab === "events" && (
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Add/Edit Event Form */}
                    <div className="bg-slate-800/60 border border-slate-800 p-5 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-display font-bold text-sm text-yellow-400">
                          {editingEventId ? "📝 Update Upcoming Event" : "📅 Add New Upcoming Event"}
                        </h4>
                        {editingEventId && (
                          <button
                            onClick={() => {
                              setEditingEventId(null);
                              setEventTitle("");
                              setEventDate("");
                              setEventTime("");
                              setEventDesc("");
                            }}
                            className="text-[10px] bg-slate-700 text-slate-300 px-2 py-1 rounded hover:bg-slate-650"
                          >
                            Cancel Edit
                          </button>
                        )}
                      </div>

                      <form onSubmit={handleSaveEvent} className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-slate-400 font-mono">Event Title</label>
                          <input
                            type="text"
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                            placeholder="e.g. Annual Honeycomb Splash Fest"
                            className="w-full bg-slate-900 border border-slate-750 px-3 py-2 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-400 font-mono">Date / Day</label>
                          <input
                            type="text"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            placeholder="e.g. Saturday, July 25th"
                            className="w-full bg-slate-900 border border-slate-750 px-3 py-2 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-400 font-mono">Time Range</label>
                          <input
                            type="text"
                            value={eventTime}
                            onChange={(e) => setEventTime(e.target.value)}
                            placeholder="e.g. 10:00 AM - 1:00 PM"
                            className="w-full bg-slate-900 border border-slate-750 px-3 py-2 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-400 font-mono">Description / Details</label>
                          <textarea
                            value={eventDesc}
                            onChange={(e) => setEventDesc(e.target.value)}
                            rows={3}
                            placeholder="e.g. Water slides, splashing games, sensory cups, and ice-creams in our outdoor gardens!"
                            className="w-full bg-slate-900 border border-slate-750 px-3 py-2 rounded-xl text-white focus:outline-none focus:border-yellow-400 font-sans"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-4"
                        >
                          {editingEventId ? "Save Event Changes" : "Create Upcoming Event"}
                        </button>
                      </form>
                    </div>

                    {/* Active Events List */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex justify-between items-center bg-slate-850/20 px-4 py-3 rounded-xl border border-slate-800">
                        <span className="text-xs font-bold text-slate-300">
                          Active Scheduled Events ({dbState?.events?.length || 0})
                        </span>
                        <span className="text-[10px] text-yellow-400 font-mono bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/10">
                          Managed Live
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        {dbState?.events?.map((evt: any) => (
                          <div
                            key={evt.id}
                            className="bg-slate-800/80 border border-slate-750 p-4 rounded-2xl flex flex-col justify-between gap-4 text-xs hover:border-yellow-400/30 transition-all group"
                          >
                            <div className="space-y-2">
                              <span className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                                {evt.date}
                              </span>
                              <h5 className="font-display font-bold text-sm text-white pt-1">
                                {evt.title}
                              </h5>
                              <p className="text-[11px] text-slate-400 leading-normal font-sans">
                                {evt.desc}
                              </p>
                              <div className="text-[11px] text-slate-200 font-mono font-bold flex items-center gap-1 pt-1.5">
                                <Clock size={11} className="text-yellow-400" /> {evt.time}
                              </div>
                            </div>

                            <div className="flex justify-end gap-1.5 pt-2 border-t border-slate-750/50">
                              <button
                                onClick={() => handleStartEditEvent(evt)}
                                className="bg-slate-700 hover:bg-slate-650 text-slate-200 p-1.5 rounded-lg transition-all cursor-pointer border border-slate-600"
                                title="Edit Event Details"
                              >
                                <Pencil size={11} />
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(evt.id)}
                                className="bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white p-1.5 rounded-lg transition-all cursor-pointer border border-rose-500/20"
                                title="Delete Event"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>
                        ))}

                        {(!dbState?.events || dbState.events.length === 0) && (
                          <div className="col-span-2 bg-slate-800/20 border border-slate-850 rounded-2xl p-10 text-center space-y-2">
                            <div className="text-3xl">📅</div>
                            <h5 className="font-display font-bold text-white text-sm">No Upcoming Events Found</h5>
                            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                              Add some upcoming community events above to show them dynamically in the school home page timeline.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. EMAIL DISPATCH CENTER */}
                {adminSubTab === "emails" && (
                  <div className="space-y-6">
                    {/* Header info */}
                    <div className="grid md:grid-cols-12 gap-6 items-stretch">
                      {/* Left: configuration overview */}
                      <div className="md:col-span-7 bg-slate-800/40 border border-slate-750 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-display font-bold text-sm text-yellow-400 flex items-center gap-1.5">
                            <Mail size={16} /> Automated Email Notification Bridge
                          </h4>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            Honey Bees utilizes a background email delivery proxy to route all admissions inquiries, contact requests, and tour bookings automatically to the school's official inbox: <span className="text-yellow-300 font-bold font-mono">hello@honeybeespreschool.com</span>.
                          </p>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            To ensure high-security operation and prevent client-side credential hijacking, the entire compilation and dispatch cycle is handled <strong>entirely on the server-side</strong>.
                          </p>
                        </div>

                        {/* Connection status indicator */}
                        <div className="p-3.5 rounded-xl border flex items-start gap-3 bg-indigo-950/30 border-indigo-500/20 text-indigo-200">
                          <Info size={16} className="shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <span className="text-xs font-bold uppercase tracking-wider block">Sandbox Mode / Real Integration</span>
                            <span className="text-[11px] block text-indigo-300">
                              This sandbox simulates EmailJS dispatches out of the box. To send real-world emails to your inbox, set your EmailJS secret parameters inside the app's Secrets panel.
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: developer credentials guide */}
                      <div className="md:col-span-5 bg-slate-800/40 border border-slate-750 p-5 rounded-2xl space-y-3 font-mono text-[11px] text-slate-300">
                        <div className="flex items-center gap-1.5 border-b border-slate-700/50 pb-2 text-yellow-400 font-bold font-display font-sans text-xs">
                          <Key size={13} /> ENV Configuration Guide
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Create an account on <a href="https://www.emailjs.com" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">emailjs.com</a> and declare these variables to route live emails:
                        </p>
                        <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-[10px] text-slate-300 leading-relaxed">
                          <div>
                            <span className="text-pink-400">EMAILJS_SERVICE_ID</span>: <span className="text-slate-400">"service_xxx"</span>
                          </div>
                          <div>
                            <span className="text-pink-400">EMAILJS_TEMPLATE_ID</span>: <span className="text-slate-400">"template_xxx"</span>
                          </div>
                          <div>
                            <span className="text-pink-400">EMAILJS_PUBLIC_KEY</span>: <span className="text-slate-400">"user_xxx"</span>
                          </div>
                          <div>
                            <span className="text-pink-400">EMAILJS_PRIVATE_KEY</span>: <span className="text-slate-400">"secret_xxx"</span>
                          </div>
                        </div>
                        <div className="text-[9px] text-slate-500 leading-relaxed">
                          * Configure your template parameters to match: <code>to_email</code>, <code>subject</code>, <code>from_name</code>, <code>from_email</code>, <code>phone</code>, <code>message</code>, <code>form_type</code>, and <code>details</code>.
                        </div>
                      </div>
                    </div>

                    {/* Email Logs Explorer */}
                    <div className="grid lg:grid-cols-12 gap-6 items-start">
                      {/* Left: Email list */}
                      <div className="lg:col-span-5 bg-slate-800/30 border border-slate-750 p-4 rounded-2xl space-y-3">
                        <h4 className="font-display font-bold text-xs text-slate-400 uppercase tracking-wider px-1">
                          📡 Dispatch Activity Logs ({dbState?.emails?.length || 0})
                        </h4>

                        <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                          {dbState?.emails?.map((email) => {
                            const isSelected = selectedEmailId === email.id;
                            const statusColor = 
                              email.status === "Delivered" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" :
                              email.status === "Failed" ? "bg-rose-500/20 text-rose-300 border-rose-500/30" :
                              "bg-slate-700/50 text-slate-300 border-slate-650";

                            return (
                              <button
                                key={email.id}
                                onClick={() => setSelectedEmailId(email.id)}
                                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer block space-y-1.5 ${
                                  isSelected 
                                    ? "bg-yellow-400/10 border-yellow-400/40 shadow-xs" 
                                    : "bg-slate-800/40 border-slate-750 hover:bg-slate-800"
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-bold text-xs text-white truncate max-w-[180px]">
                                    {email.parentName}
                                  </span>
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
                                    {email.status}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-slate-400">
                                  <span className="truncate max-w-[130px] font-mono">{email.formType}</span>
                                  <span className="font-mono text-[9px]">
                                    {new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </button>
                            );
                          })}

                          {(!dbState?.emails || dbState.emails.length === 0) && (
                            <div className="p-8 text-center space-y-2">
                              <div className="text-2xl text-slate-600">📬</div>
                              <p className="text-xs text-slate-400">No email dispatches recorded yet.</p>
                              <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                                Go submit an enrollment inquiry or fill out the contact form on the home page to trigger automated emails!
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Email Detail inspection panel */}
                      <div className="lg:col-span-7 bg-slate-800/30 border border-slate-750 p-4 rounded-2xl min-h-[460px]">
                        {(() => {
                          const selectedEmail = dbState?.emails?.find(e => e.id === selectedEmailId) || dbState?.emails?.[0];
                          if (!selectedEmail) {
                            return (
                              <div className="flex flex-col items-center justify-center min-h-[420px] text-center space-y-3">
                                <div className="p-4 bg-slate-800 rounded-full text-slate-600">
                                  <Mail size={32} />
                                </div>
                                <h5 className="font-display font-bold text-slate-300 text-xs uppercase tracking-widest">
                                  Select an Email Log
                                </h5>
                                <p className="text-[11px] text-slate-500 max-w-xs">
                                  Choose any item from the dispatch activity checklist on the left to review parsed template data, delivery parameters, and response status.
                                </p>
                              </div>
                            );
                          }

                          return (
                            <div className="space-y-4">
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/50 pb-3">
                                <div>
                                  <span className="text-[9px] font-bold text-yellow-400 uppercase tracking-widest block">
                                    Enquiry Email Payload
                                  </span>
                                  <h4 className="font-display font-black text-sm text-white">
                                    {selectedEmail.formType}
                                  </h4>
                                </div>
                                <div className="text-right">
                                  <span className="text-[10px] font-mono text-slate-400 block">
                                    {new Date(selectedEmail.timestamp).toLocaleString()}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-500 block">
                                    ID: {selectedEmail.id}
                                  </span>
                                </div>
                              </div>

                              {/* Form payload fields */}
                              <div className="grid grid-cols-2 gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800 text-xs">
                                <div>
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                                    Recipient Mailbox
                                  </span>
                                  <span className="text-white font-bold text-yellow-300 break-all select-all">
                                    {selectedEmail.recipient}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                                    Form Submitter
                                  </span>
                                  <span className="text-white font-bold block truncate">
                                    {selectedEmail.parentName}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                                    Submitter Email
                                  </span>
                                  <span className="text-white block truncate select-all">
                                    {selectedEmail.email}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                                    Submitter Phone
                                  </span>
                                  <span className="text-white block truncate select-all">
                                    {selectedEmail.phone}
                                  </span>
                                </div>
                              </div>

                              {/* Form Message Content */}
                              <div className="space-y-1 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                  Extracted Message Body
                                </span>
                                <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed italic">
                                  "{selectedEmail.messageText}"
                                </p>
                              </div>

                              {/* Form Full JSON payload details */}
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                                  Formatted Parameters Sent to Template
                                </span>
                                <pre className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 text-[10px] font-mono text-emerald-400 overflow-x-auto max-h-[140px] whitespace-pre-wrap leading-relaxed">
                                  {selectedEmail.details}
                                </pre>
                              </div>

                              {/* System logs output terminal */}
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1 px-1">
                                  <Terminal size={12} className="text-pink-400 shrink-0" /> Execution Diagnostics & Delivery Logs
                                </span>
                                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 font-mono text-[10px] space-y-1 text-slate-400 leading-normal max-h-[120px] overflow-y-auto">
                                  {selectedEmail.logs.map((log, index) => (
                                    <div key={index} className="flex gap-2 items-start">
                                      <span className="text-pink-400 shrink-0 select-none">❯</span>
                                      <span>{log}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {adminSubTab === "voice" && (
                  <div className="bg-slate-800/60 border border-slate-700/50 p-6 rounded-2xl space-y-6 text-slate-100">
                    <div className="flex items-center gap-2 text-yellow-400">
                      <Mic size={20} />
                      <h4 className="font-display font-bold text-base text-white">
                        🎙️ Admin-Only Voice AI Receptionist Configuration
                      </h4>
                    </div>

                    <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                      Customize the welcome greetings that Beatrice, the virtual AI receptionist, speaks when parents connect to a voice call.
                      Use the placeholder <code className="text-yellow-300 font-mono font-bold bg-slate-900/60 px-1 py-0.5 rounded">{`{callerName}`}</code> to dynamically inject the active caller's name (e.g. <em>Sarah Parker</em>) into her speech flow!
                    </p>

                    {voiceSettingsMsg && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                        {voiceSettingsMsg}
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6 pt-2">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                          English Greeting Message
                        </label>
                        <textarea
                          rows={6}
                          value={adminGreetingEn}
                          onChange={(e) => setAdminGreetingEn(e.target.value)}
                          placeholder="e.g. Buzz Buzz! 🐝 Thank you for calling... Am I speaking with {callerName}?"
                          className="w-full bg-slate-900/80 border border-slate-750 text-slate-100 p-3 rounded-xl focus:outline-none focus:border-yellow-400 font-sans text-xs leading-relaxed"
                        />
                        <p className="text-[10px] text-slate-400 italic">
                          Used when English language is selected.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Telugu Greeting Message (తెలుగు వర్షన్)
                        </label>
                        <textarea
                          rows={6}
                          value={adminGreetingTe}
                          onChange={(e) => setAdminGreetingTe(e.target.value)}
                          placeholder="e.g. బజ్ బజ్! 🐝 హనీ బీస్... నేను {callerName} గారితో మాట్లాడుతున్నానా?"
                          className="w-full bg-slate-900/80 border border-slate-750 text-slate-100 p-3 rounded-xl focus:outline-none focus:border-yellow-400 font-sans text-xs leading-relaxed"
                        />
                        <p className="text-[10px] text-slate-400 italic">
                          Used when Telugu language is selected.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-800">
                      <button
                        onClick={handleSaveVoiceSettings}
                        disabled={voiceSettingsSaving}
                        className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md shadow-yellow-400/5 cursor-pointer"
                      >
                        {voiceSettingsSaving ? "Saving Config..." : "💾 Save Greeting Settings"}
                      </button>
                    </div>
                  </div>
                )}

                {adminSubTab === "operations" && dbState && (
                  <OperationsHub
                    dbState={dbState}
                    fetchDbState={fetchDbState}
                    onUpdateAdmissionStatus={handleUpdateAdmissionStatus}
                  />
                )}
              </div>
            </div>
          </motion.div>
          )
        )}

        {/* ======================================= */}
        {/*           PARENT PORTAL PANEL           */}
        {/* ======================================= */}
        {activeRole === "parent" && (
          !(currentUser && currentUser.role === "parent") ? (
            renderAuthGate("parent")
          ) : (
            <motion.div
              key="parent"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Pupil header card */}
            <div className="bg-gradient-to-r from-orange-400 to-amber-400 p-6 rounded-3xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-2xl text-2xl text-orange-500 shadow-sm leading-none">
                  👦
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-100 bg-orange-500/20 px-2 py-0.5 rounded">
                    Primary Pupil Profile
                  </span>
                  <h3 className="text-2xl font-display font-bold mt-1">{activeStudent.name}</h3>
                  <p className="text-xs text-orange-50 mt-0.5">
                    Class: <strong className="font-bold">{activeStudent.program}</strong> • DOB: {activeStudent.dob}
                  </p>
                </div>
              </div>

              {/* Selector in case we want to toggle between test children */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-orange-50">Select Child:</span>
                <select
                  value={activeStudentId}
                  onChange={(e) => setActiveStudentId(e.target.value)}
                  className="bg-white text-slate-800 text-xs font-bold py-1.5 px-3 rounded-xl focus:outline-none shadow-sm cursor-pointer"
                >
                  {dbState.students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.program})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dynamic sub-tab navigation bar */}
            <div className="flex overflow-x-auto gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-xs max-w-full">
              {[
                { id: "overview", label: "Dashboard Overview", icon: "🏠" },
                { id: "homework", label: "Homework & Worksheets", icon: "📚" },
                { id: "progress", label: "Progress Reports", icon: "📊" },
                { id: "fees", label: "Billing & Fees", icon: "💳" },
                { id: "ptm", label: "PTM Slot Booking", icon: "📅" },
                { id: "chat", label: "Teacher Chat Inbox", icon: "💬" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setParentTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold font-display transition-all whitespace-nowrap cursor-pointer ${
                    parentTab === tab.id
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab contents */}
            {parentTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Notifications & Absences */}
                <div className="lg:col-span-2 space-y-6">

                  {/* Absence / Leave Request Widget */}
                  <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-orange-500">
                      <span className="text-lg">🚪</span>
                      <h4 className="font-display font-bold text-sm text-slate-900 font-sans">Request Leave & Notify Absence</h4>
                    </div>
                    <p className="text-xs text-slate-500">
                      Notify your child's educator in advance about sick leaves, medical appointments, or vacation absences.
                    </p>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!leaveDate || !leaveReason) {
                          alert("Please fill in both Leave Date and Reason.");
                          return;
                        }
                        setLeaveSubmitting(true);
                        try {
                          const res = await fetch("/api/parent/request-leave", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              studentId: activeStudent.id,
                              date: leaveDate,
                              status: leaveStatus,
                              reason: leaveReason,
                            }),
                          });
                          const data = await res.json();
                          if (!data.error) {
                            setLeaveDate("");
                            setLeaveReason("");
                            alert(data.message || "Absence request logged!");
                            fetchDbState();
                          } else {
                            alert(data.error);
                          }
                        } catch (err) {
                          console.error(err);
                        } finally {
                          setLeaveSubmitting(false);
                        }
                      }}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end"
                    >
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">LEAVE DATE</label>
                        <input
                          type="date"
                          value={leaveDate}
                          onChange={(e) => setLeaveDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">STATUS TYPE</label>
                        <select
                          value={leaveStatus}
                          onChange={(e) => setLeaveStatus(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none cursor-pointer"
                        >
                          <option value="Absent">Absent (Full Day)</option>
                          <option value="Late">Late Arrival</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">REASON / REMARK</label>
                        <input
                          type="text"
                          value={leaveReason}
                          onChange={(e) => setLeaveReason(e.target.value)}
                          placeholder="e.g., Dental appointment, Mild fever"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-3 text-right">
                        <button
                          type="submit"
                          disabled={leaveSubmitting}
                          className="bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-slate-900 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                        >
                          {leaveSubmitting ? "Submitting..." : "Submit Leave Request"}
                        </button>
                      </div>
                    </form>

                    {dbState.leaveRequests && dbState.leaveRequests.filter((r) => r.studentId === activeStudent.id).length > 0 && (
                      <div className="border-t border-slate-100 pt-3 mt-3">
                        <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">Recent Absence Log</h5>
                        <div className="space-y-2">
                          {dbState.leaveRequests
                            .filter((r) => r.studentId === activeStudent.id)
                            .map((r) => (
                              <div key={r.id} className="bg-slate-50 rounded-lg p-2.5 flex justify-between items-center text-xs">
                                <div>
                                  <span className="font-bold text-slate-800">{r.date}</span>
                                  <span className="text-slate-400 mx-2">•</span>
                                  <span className="text-slate-500">{r.reason}</span>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  r.status === "Late" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                                }`}>
                                  {r.status}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: ID Card, Attendance, Birthdays, Alarms */}
                <div className="space-y-6">
                  {/* Digital ID Card */}
                  <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-5 rounded-3xl text-white shadow-md relative overflow-hidden">
                    <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-white/5 rounded-full" />
                    <div className="absolute -left-4 -top-4 w-16 h-16 bg-white/5 rounded-full" />
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-1">
                        <span className="text-lg">🐝</span>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest font-display">
                          Honey Bees Academy
                        </span>
                      </div>
                      <span className="bg-white/20 text-[9px] font-bold uppercase px-2 py-0.5 rounded-md">
                        Digital pupil ID
                      </span>
                    </div>

                    <div className="flex gap-4 items-center">
                      <div className="bg-white/20 p-1.5 rounded-2xl">
                        <div className="w-16 h-16 rounded-xl bg-orange-100 flex items-center justify-center text-3xl filter shadow">
                          👦
                        </div>
                      </div>
                      <div>
                        <h4 className="font-display font-extrabold text-base leading-tight">{activeStudent.name}</h4>
                        <p className="text-[11px] text-amber-100 mt-1 font-mono">ID: HB-2026-{activeStudent.id.substring(activeStudent.id.length - 4)}</p>
                        <p className="text-[10px] text-amber-50 mt-0.5">Program: {activeStudent.program} Hive</p>
                      </div>
                    </div>

                    <div className="border-t border-white/20 mt-4 pt-3 flex justify-between items-center">
                      <div className="text-[9px] text-amber-100">
                        <p>Emergency Contact:</p>
                        <p className="font-mono font-bold mt-0.5 text-white">+1 (555) 987-6543</p>
                      </div>
                      <div className="bg-white p-2 rounded-lg flex flex-col items-center justify-center shadow-sm">
                        <div className="w-16 h-4 bg-slate-900 rounded-xs flex items-center justify-around px-0.5">
                          <span className="w-0.5 h-3 bg-white" />
                          <span className="w-1 h-3 bg-white" />
                          <span className="w-0.5 h-3 bg-white" />
                          <span className="w-1.5 h-3 bg-white" />
                          <span className="w-0.5 h-3 bg-white" />
                          <span className="w-1 h-3 bg-white" />
                          <span className="w-0.5 h-3 bg-white" />
                        </div>
                        <span className="text-[6px] font-bold font-mono text-slate-800 tracking-wider mt-1">SECURE_GATE</span>
                      </div>
                    </div>
                  </div>

                  {/* Weekly Attendance Rate */}
                  <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-1.5 text-emerald-500">
                        <span className="text-lg">📅</span>
                        <h4 className="font-display font-bold text-sm text-slate-900 font-sans">Attendance Rate</h4>
                      </div>
                      <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        {activeStudent.attendance?.length
                          ? Math.round(
                              (activeStudent.attendance.filter((a) => a.status === "Present").length /
                                activeStudent.attendance.length) *
                                100
                            )
                          : 100}
                        % Status
                      </span>
                    </div>

                    <div className="flex gap-2 mb-4 overflow-x-auto py-1">
                      {activeStudent.attendance?.map((log, index) => (
                        <div key={index} className="flex-1 bg-slate-50 border border-slate-150 rounded-xl p-2.5 text-center min-w-[55px]">
                          <span className="text-[9px] text-slate-400 font-mono block mb-1">
                            {log.date.substring(5)}
                          </span>
                          <span className={`w-2.5 h-2.5 rounded-full inline-block ${
                            log.status === "Present"
                              ? "bg-emerald-500 shadow-xs shadow-emerald-500/20"
                              : log.status === "Late"
                              ? "bg-amber-400"
                              : "bg-rose-500"
                          }`} />
                          <span className="text-[9px] font-bold text-slate-600 block mt-1">
                            {log.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Classroom Birthdays Balloon */}
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 p-4.5 rounded-3xl">
                    <div className="flex items-center gap-2 mb-1.5 text-pink-600">
                      <span>🎈</span>
                      <h4 className="font-display font-bold text-xs text-rose-950 uppercase tracking-wider">Class Birthdays</h4>
                    </div>
                    <div className="text-xs text-rose-900 leading-relaxed">
                      <strong className="font-bold">Sophia Martinez (Turning 3)</strong> birthday is on <strong className="font-bold">July 24th!</strong> 🎂 Nursery class is planning a handmade bee-themed drawing card. Let's practice painting at home!
                    </div>
                  </div>

                  {/* Push Notifications Registry */}
                  <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-3.5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-yellow-500">
                        <span className="text-lg">🔔</span>
                        <h4 className="font-display font-bold text-sm text-slate-900 font-sans">Push Notification Hub</h4>
                      </div>
                      <button
                        onClick={async () => {
                          const newAlerts = !pushAlertsEnabled;
                          setPushAlertsEnabled(newAlerts);
                          try {
                            await fetch("/api/parent/push-preferences", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                email: currentUser.email,
                                alertsEnabled: newAlerts,
                              }),
                            });
                            if (newAlerts) {
                              setSimulatedNotification("🔔 Push connection established! Test notification sent.");
                              setTimeout(() => setSimulatedNotification(null), 3000);
                            }
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-all cursor-pointer ${
                          pushAlertsEnabled ? "bg-yellow-400" : "bg-slate-300"
                        }`}
                      >
                        <div className={`bg-white w-4.5 h-4.5 rounded-full shadow-xs transition-all transform ${
                          pushAlertsEnabled ? "translate-x-4.5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>

                    {simulatedNotification && (
                      <div className="bg-slate-950 text-white text-xs p-3 rounded-2xl animate-bounce flex items-center justify-between shadow-lg">
                        <span className="font-medium">{simulatedNotification}</span>
                        <button onClick={() => setSimulatedNotification(null)} className="text-slate-400 hover:text-white">✕</button>
                      </div>
                    )}

                    <div className="space-y-2 text-xs">
                      <div className="bg-slate-50 border-l-2 border-amber-400 p-2 rounded-r-lg">
                        <span className="font-bold text-slate-800">Mrs. Evelyn Green</span>
                        <p className="text-slate-500 text-[11px] mt-0.5">Uploaded Alphabet Tracing tracing sheet.</p>
                        <span className="text-[8px] text-slate-400 block mt-0.5">Today • 10:15 AM</span>
                      </div>
                      <div className="bg-slate-50 border-l-2 border-emerald-400 p-2 rounded-r-lg">
                        <span className="font-bold text-slate-800">Finance Desk</span>
                        <p className="text-slate-500 text-[11px] mt-0.5">Term 1 billing receipts are now ready for download.</p>
                        <span className="text-[8px] text-slate-400 block mt-0.5">Yesterday • 4:30 PM</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSimulatedNotification("🚨 Alarms: Sophia brought chocolate muffins for birthday prep tomorrow!");
                        setTimeout(() => setSimulatedNotification(null), 5000);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-650 text-[10px] font-bold py-1.5 rounded-xl transition-all cursor-pointer text-center block"
                    >
                      ⚡ Simulate Notification Alarm Test
                    </button>
                  </div>
                </div>
              </div>
            )}

            {parentTab === "homework" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Homework & Uploads */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2 text-amber-500">
                        <span className="text-xl">📝</span>
                        <h4 className="font-display font-bold text-base text-slate-900 font-sans">Daily Task Homework</h4>
                      </div>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
                        {dbState.homework.filter((h) => h.class === activeStudent.program).length} Assignments
                      </span>
                    </div>

                    {dbState.homework.filter((h) => h.class === activeStudent.program).length === 0 ? (
                      <div className="text-center py-10 space-y-2">
                        <span className="text-4xl">🌸</span>
                        <p className="text-sm font-medium text-slate-500">No active homework assignments found for this week.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {dbState.homework
                          .filter((h) => h.class === activeStudent.program)
                          .map((hw) => {
                            const isSubmitted = dbState.homeworkSubmissions?.some(
                              (s) => s.homeworkId === hw.id && s.studentId === activeStudent.id
                            );
                            return (
                              <div key={hw.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3">
                                <div className="flex justify-between items-start gap-2">
                                  <div>
                                    <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                                      {hw.subject}
                                    </span>
                                    <h5 className="font-display font-bold text-sm text-slate-800 mt-1">{hw.title}</h5>
                                  </div>
                                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                                    isSubmitted ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                                  }`}>
                                    {isSubmitted ? "Submitted" : "Pending"}
                                  </span>
                                </div>

                                <p className="text-xs text-slate-600 leading-relaxed">{hw.description}</p>

                                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                                  <span>Assigned: {hw.assignedDate}</span>
                                  <span className="text-rose-500 font-bold">Due Date: {hw.dueDate}</span>
                                </div>

                                {!isSubmitted ? (
                                  <div className="border-t border-slate-150 pt-3 mt-3 flex justify-end">
                                    <button
                                      onClick={() => {
                                        setSubmittingHw(hw);
                                        setHwComment("");
                                      }}
                                      className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer"
                                    >
                                      📤 Upload Completed Response
                                    </button>
                                  </div>
                                ) : (
                                  <div className="border-t border-slate-150 pt-3 mt-3 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 text-xs">
                                    <span className="font-bold text-emerald-800">✅ Submission Confirmed:</span>
                                    <p className="text-slate-600 text-[11px] mt-1 italic">
                                      "Ethan completed the trace & colored the honeybees with orange wax crayons!"
                                    </p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Worksheets Catalogs */}
                <div className="space-y-6">
                  <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-orange-500 pb-2 border-b border-slate-100">
                      <span className="text-lg">🖨️</span>
                      <h4 className="font-display font-bold text-sm text-slate-900">Printable Worksheets</h4>
                    </div>
                    <p className="text-xs text-slate-500">
                      Download high-quality learning resources to print and practice offline at home.
                    </p>

                    <div className="space-y-3.5">
                      {dbState.worksheets?.map((ws) => (
                        <div key={ws.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col gap-2.5">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                                {ws.subject}
                              </span>
                              <h5 className="font-bold text-xs text-slate-800 mt-1 leading-tight">{ws.title}</h5>
                              <p className="text-[10px] text-slate-400 mt-0.5">Ages: {ws.ageGroup}</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center border-t border-slate-150/50 pt-2.5">
                            <span className="text-[10px] text-slate-400 font-mono">📥 {ws.downloadCount} Downloads</span>
                            <button
                              onClick={() => {
                                alert(`Downloading ${ws.title} worksheet PDF file dynamically!`);
                              }}
                              className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Download size={10} /> Get Worksheet
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {parentTab === "progress" && (
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-emerald-500">
                    <span className="text-xl">🏆</span>
                    <h4 className="font-display font-bold text-base text-slate-900">Milestones & Developmental Progress</h4>
                  </div>
                  <button
                    onClick={() => {
                      setViewingReceipt({
                        term: "Term 1 (July - Sept 2026)",
                        studentName: activeStudent.name,
                        studentId: activeStudent.id,
                        dob: activeStudent.dob,
                        program: activeStudent.program,
                        grades: [
                          { subject: "Language & Phonics", grade: "A+" },
                          { subject: "Fine Motor Skills (Tracing & Scissors)", grade: "A" },
                          { subject: "Mathematical Concept (Counting 1-10)", grade: "A+" },
                          { subject: "Arts & Coloring Precision", grade: "B+" },
                          { subject: "Social Interactive & Group Cooperation", grade: "A" },
                        ],
                        teacherRemarks: "Ethan is a joy to have in class. He is highly cooperative, enthusiastic, and exhibits remarkable fine motor controls during tracing activities."
                      });
                    }}
                    className="bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    📜 View Official Report Transcript
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: "Fine Motor Skills", val: activeStudent.progress?.motorSkills, score: 92, desc: "Grip controls, scissor cuts & object handles", icon: "✍️" },
                    { label: "Social Interactive", val: activeStudent.progress?.socialSkills, score: 95, desc: "Sharing toy blocks, cooperating, conversation", icon: "🤝" },
                    { label: "Aesthetics & Arts", val: activeStudent.progress?.creativity, score: 85, desc: "Primary color mix, brush curves, free sketch", icon: "🎨" },
                    { label: "Cognitive Concept", val: activeStudent.progress?.cognitive, score: 90, desc: "Number logs, shape recognition, alphabets", icon: "🧠" },
                  ].map((m, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-150 rounded-2xl p-4.5 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl">{m.icon}</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                          {m.val}
                        </span>
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-slate-800">{m.label}</h5>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{m.desc}</p>
                      </div>
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between items-center text-[9px] font-mono font-bold text-slate-500">
                          <span>Evaluated score</span>
                          <span>{m.score}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${m.score}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-yellow-700">
                    <span>👩‍🏫</span>
                    <h5 className="font-display font-bold text-xs uppercase tracking-wider">Class Advisor Notes (Mrs. Evelyn Green)</h5>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    "Ethan has exhibited fantastic interest in alphabet phonics. His latest trace sheet of letter 'H' and counting honeybees was excellent. He is highly cooperative during play-group circles and shares block modules kindly. Outstanding progress!"
                  </p>
                </div>
              </div>
            )}

            {parentTab === "fees" && (
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-5">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <span className="text-xl">💳</span>
                    <h4 className="font-display font-bold text-base text-slate-900 font-sans">Tuition Ledger & Billing</h4>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    Razorpay Sandbox Active
                  </span>
                </div>

                <div className="space-y-3.5">
                  {activeStudent.fees?.map((fee, index) => (
                    <div key={index} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-sm text-slate-800">{fee.term}</h5>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            fee.status === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}>
                            {fee.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">Due Date: {fee.dueDate} • Bill #FB-2026-9023</p>
                      </div>

                      <div className="flex items-center gap-3.5 w-full sm:w-auto justify-between sm:justify-end">
                        <div>
                          <span className="text-[10px] text-slate-400 block text-right">Tuition Fee Amount</span>
                          <span className="text-lg font-display font-extrabold text-slate-950">${fee.amount}</span>
                        </div>

                        {fee.status === "Pending" ? (
                          <button
                            id={`btn-pay-fee-${index}`}
                            onClick={() => {
                              setPayingFee(fee);
                              setPaymentMethod("upi");
                              setPaymentProcessing(false);
                              setPaymentSuccess(false);
                            }}
                            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                          >
                            💳 Pay Bill Securely
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setViewingReceipt({
                                id: `TXN-HB-${Date.now().toString().substring(5)}`,
                                term: fee.term,
                                amount: fee.amount,
                                paidDate: fee.paidDate || "2026-07-21",
                                studentName: activeStudent.name,
                                studentId: activeStudent.id,
                                program: activeStudent.program
                              });
                            }}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-4 py-2 rounded-xl transition-all border border-emerald-100 cursor-pointer"
                          >
                            📄 Get Official Receipt
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {parentTab === "ptm" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Booking Form */}
                <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-amber-500 pb-2 border-b border-slate-100">
                    <span className="text-lg">📅</span>
                    <h4 className="font-display font-bold text-sm text-slate-900">Book Parent-Teacher Meeting (PTM)</h4>
                  </div>
                  <p className="text-xs text-slate-500">
                    Select your educator advisor and reserve a convenient 15-minute slot for virtual parent-teacher evaluation circles.
                  </p>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!ptmDate || !ptmTime) {
                        alert("Please select a valid date and 15-min time slot.");
                        return;
                      }
                      setPtmSubmitting(true);
                      try {
                        const res = await fetch("/api/parent/book-ptm", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            studentId: activeStudent.id,
                            parentName: currentUser.name || "Sarah Watson",
                            teacherName: ptmTeacher,
                            date: ptmDate,
                            time: ptmTime,
                          }),
                        });
                        const data = await res.json();
                        if (!data.error) {
                          setPtmTime("");
                          alert(data.message || "Meeting booked successfully!");
                          fetchDbState();
                        } else {
                          alert(data.error);
                        }
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setPtmSubmitting(false);
                      }
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">SELECT EDUCATOR</label>
                        <select
                          value={ptmTeacher}
                          onChange={(e) => setPtmTeacher(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none cursor-pointer"
                        >
                          <option value="Mrs. Evelyn Green">Mrs. Evelyn Green (Nursery Lead)</option>
                          <option value="Amanda Rose">Amanda Rose (Toddler Care)</option>
                          <option value="Bindu Mam">Bindu Mam (Montessori Advisor)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">CHOOSE DATE</label>
                        <input
                          type="date"
                          value={ptmDate}
                          onChange={(e) => setPtmDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-2">AVAILABLE 15-MIN SLOTS</label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {["09:30 AM", "10:00 AM", "10:15 AM", "11:00 AM", "11:30 AM"].map((slot) => {
                          const isTaken = dbState.ptmBookings?.some(
                            (b) => b.date === ptmDate && b.time === slot && b.teacherName === ptmTeacher
                          );
                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={isTaken}
                              onClick={() => setPtmTime(slot)}
                              className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer text-center ${
                                isTaken
                                  ? "bg-slate-100 border-slate-200 text-slate-350 cursor-not-allowed"
                                  : ptmTime === slot
                                  ? "bg-amber-400 border-amber-400 text-slate-900 shadow-sm"
                                  : "bg-white border-slate-250 hover:bg-slate-50 text-slate-700"
                              }`}
                            >
                              {slot} {isTaken && "(Booked)"}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="text-right">
                      <button
                        type="submit"
                        disabled={ptmSubmitting || !ptmTime}
                        className="bg-amber-400 hover:bg-amber-500 disabled:opacity-40 text-slate-900 text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        {ptmSubmitting ? "Processing Reservation..." : "Confirm Scheduled Reservation"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Right Column: Bookings list */}
                <div className="space-y-6">
                  <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-amber-500 pb-2 border-b border-slate-100">
                      <span className="text-lg">📋</span>
                      <h4 className="font-display font-bold text-sm text-slate-900">Your Scheduled Meetings</h4>
                    </div>

                    {dbState.ptmBookings && dbState.ptmBookings.filter((b) => b.studentId === activeStudent.id).length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-400 italic">
                        No upcoming scheduled consultations found.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {dbState.ptmBookings
                          ?.filter((b) => b.studentId === activeStudent.id)
                          .map((b) => (
                            <div key={b.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-800">{b.teacherName}</span>
                                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">
                                  {b.status}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                                <span>📅 {b.date}</span>
                                <span>⏰ {b.time}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {parentTab === "chat" && (
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-amber-500 pb-2 border-b border-slate-100">
                  <span className="text-lg">💬</span>
                  <h4 className="font-display font-bold text-sm text-slate-900">Direct Educator Chatbox</h4>
                </div>
                <p className="text-xs text-slate-500">
                  Send secure, instant comments, attendance updates, or classroom feedbacks directly to Mrs. Evelyn Green.
                </p>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl h-[250px] overflow-y-auto space-y-3">
                  {dbState.teacherMessages.map((m) => (
                    <div key={m.id} className="text-xs max-w-[80%]">
                      <div className="font-bold text-sky-600 mb-0.5">Mrs. Evelyn Green</div>
                      <p className="bg-sky-50 border border-sky-100 p-2.5 rounded-2xl text-slate-700 leading-relaxed rounded-tl-none">
                        {m.text}
                      </p>
                      <span className="text-[8px] text-slate-400 block mt-1 font-mono">{m.timestamp}</span>
                    </div>
                  ))}
                  {dbState.parentMessages.map((m) => (
                    <div key={m.id} className="text-xs max-w-[80%] ml-auto text-right">
                      <div className="font-bold text-amber-600 mb-0.5">You (Sarah Watson)</div>
                      <p className="bg-amber-100/50 border border-amber-150 p-2.5 rounded-2xl text-slate-700 text-left inline-block leading-relaxed rounded-tr-none">
                        {m.text}
                      </p>
                      <span className="text-[8px] text-slate-400 block mt-1 text-right font-mono">{m.timestamp}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    id="inp-parent-msg"
                    type="text"
                    value={parentMessageText}
                    onChange={(e) => setParentMessageText(e.target.value)}
                    placeholder="Type your message for Mrs. Evelyn Green here..."
                    className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 font-sans"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendParentMessage();
                    }}
                  />
                  <button
                    id="btn-parent-msg-send"
                    onClick={handleSendParentMessage}
                    disabled={!parentMessageText.trim()}
                    className="bg-amber-400 hover:bg-amber-500 disabled:opacity-40 text-slate-900 text-xs font-bold px-5 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            )}

            {/* Secure Payment Gateway Simulator Overlay */}
            {payingFee && (
              <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl border border-slate-100 space-y-5 animate-scaleUp">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 text-blue-600 font-display font-extrabold text-sm uppercase tracking-wide">
                      <span>💳</span> Razorpay Secure
                    </div>
                    <button
                      onClick={() => setPayingFee(null)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer text-xs"
                    >
                      Cancel
                    </button>
                  </div>

                  {!paymentProcessing && !paymentSuccess ? (
                    <div className="space-y-4">
                      <div className="text-center py-2 bg-slate-50 rounded-2xl">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">TOTAL AMOUNT DUE</span>
                        <span className="text-3xl font-display font-extrabold text-slate-950">${payingFee.amount}</span>
                        <span className="text-[10px] text-slate-500 block mt-1 font-mono">Invoice: INV-{payingFee.term.substring(0, 6)}-{Date.now().toString().substring(8)}</span>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-2">CHOOSE SECURE PAYMENT METHOD</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("upi")}
                            className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              paymentMethod === "upi"
                                ? "bg-blue-50 border-blue-400 text-blue-600"
                                : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                            }`}
                          >
                            📱 UPI / GPay
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("card")}
                            className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              paymentMethod === "card"
                                ? "bg-blue-50 border-blue-400 text-blue-600"
                                : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                            }`}
                          >
                            💳 Credit Card
                          </button>
                        </div>
                      </div>

                      {paymentMethod === "upi" ? (
                        <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center space-y-3 border border-slate-150">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">SCAN QR CODE IN PAYMENTS APP</span>
                          <div className="w-24 h-24 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-xs">
                            <span className="text-4xl">📱</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">BHIM UPI • GPay • PhonePe</span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1">CARD NUMBER</label>
                            <input
                              type="text"
                              placeholder="4111 2222 3333 4444"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-400 focus:outline-none font-mono"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[9px] font-bold text-slate-400 block mb-1">EXPIRY DATE</label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-400 focus:outline-none font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-slate-400 block mb-1">CVV CODE</label>
                              <input
                                type="text"
                                placeholder="123"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-400 focus:outline-none font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={async () => {
                            setPaymentProcessing(true);
                            try {
                              const res = await fetch("/api/parent/pay-fee", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  studentId: activeStudent.id,
                                  term: payingFee.term,
                                }),
                              });
                              const data = await res.json();
                              if (!data.error) {
                                setPaymentSuccess(true);
                                setTimeout(() => {
                                  setPayingFee(null);
                                  setPaymentSuccess(false);
                                  setPaymentProcessing(false);
                                  fetchDbState();
                                }, 2000);
                              } else {
                                alert(data.error);
                                setPaymentProcessing(false);
                              }
                            } catch (err) {
                              console.error(err);
                              setPaymentSuccess(true);
                              setTimeout(() => {
                                setPayingFee(null);
                                setPaymentSuccess(false);
                                setPaymentProcessing(false);
                                fetchDbState();
                              }, 2000);
                            }
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl text-xs transition-all flex justify-center items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/10"
                        >
                          🔒 Authorize Secure Payment of ${payingFee.amount}
                        </button>
                      </div>
                    </div>
                  ) : paymentProcessing && !paymentSuccess ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                      <span className="w-10 h-10 rounded-full border-3 border-blue-600 border-t-transparent animate-spin" />
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-800">Processing secure payment transaction...</p>
                        <p className="text-[10px] text-slate-400 font-mono">Establishing link with Razorpay PG core engine...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                      <span className="text-5xl animate-bounce">🎉🏆</span>
                      <div className="space-y-1">
                        <p className="text-base font-extrabold text-emerald-600">Payment Processed Successfully!</p>
                        <p className="text-xs text-slate-500">Your tuition receipt has been dispatched. Outstanding progress! 🐝</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Secure Homework Submission Modal */}
            {submittingHw && (
              <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl border border-slate-100 space-y-4 animate-scaleUp">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h4 className="font-display font-bold text-sm text-slate-900">Submit Homework Task Response</h4>
                    <button
                      onClick={() => setSubmittingHw(null)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer text-xs"
                    >
                      ✕
                    </button>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setHwSubmittingProgress(true);
                      try {
                        const res = await fetch("/api/parent/submit-homework", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            studentId: activeStudent.id,
                            homeworkId: submittingHw.id,
                            comments: hwComment,
                          }),
                        });
                        const data = await res.json();
                        if (!data.error) {
                          setHwComment("");
                          setSubmittingHw(null);
                          alert(data.message || "Worksheet submitted!");
                          fetchDbState();
                        } else {
                          alert(data.error);
                        }
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setHwSubmittingProgress(false);
                      }
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded uppercase">
                        {submittingHw.subject}
                      </span>
                      <h5 className="font-bold text-xs text-slate-800 mt-1">{submittingHw.title}</h5>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{submittingHw.description}</p>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">PARENT OBSERVATION REMARK</label>
                      <textarea
                        rows={3}
                        value={hwComment}
                        onChange={(e) => setHwComment(e.target.value)}
                        placeholder="e.g., Ethan enjoyed drawing curves. He found color pairings easily!"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1.5">UPLOAD WORKSHEET PHOTO (MOCK SELECT)</label>
                      <div className="border-2 border-dashed border-slate-250 p-4 rounded-xl text-center space-y-1 bg-slate-50">
                        <span className="text-xl block">🖼️</span>
                        <span className="text-[10px] font-bold text-slate-650 block">completed_activity_sketch.png</span>
                        <span className="text-[8px] text-slate-400 block font-mono">Image attached successfully (1.4MB)</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <button
                        type="submit"
                        disabled={hwSubmittingProgress}
                        className="bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-slate-900 text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        {hwSubmittingProgress ? "Uploading..." : "Publish Homework submission"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Secure Receipt / Transcript Printing Modal */}
            {viewingReceipt && (
              <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                <div className="bg-white rounded-3xl w-full max-w-lg p-7 shadow-xl border border-slate-100 space-y-6 animate-scaleUp">
                  {/* Header info */}
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl">🐝</span>
                      <span className="text-xs font-extrabold uppercase font-display tracking-wider text-slate-800">
                        Honey Bees Preschool Registry
                      </span>
                    </div>
                    <button
                      onClick={() => setViewingReceipt(null)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer text-xs"
                    >
                      ✕ Close Transcript
                    </button>
                  </div>

                  {/* Official Document Layout */}
                  {viewingReceipt.grades ? (
                    /* REPORT CARD TRANSCRIPT */
                    <div className="space-y-4 font-sans text-slate-800">
                      <div className="text-center space-y-1">
                        <h4 className="font-display font-extrabold text-base uppercase tracking-wide text-slate-900">
                          OFFICIAL ACADEMIC EVALUATION TRANSCRIPT
                        </h4>
                        <p className="text-[10px] text-slate-400 uppercase font-mono">Honey Bees preschool, daycare and tuition centre</p>
                        <p className="text-[10px] font-mono font-bold text-slate-500">TERM 1 PROGRESS REPORT • JULY 2026</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-150 font-mono">
                        <div>
                          <p className="text-slate-400">STUDENT NAME:</p>
                          <p className="font-bold text-slate-900">{viewingReceipt.studentName}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">PUPIL ROLL CODE:</p>
                          <p className="font-bold text-slate-900">HB-2026-{viewingReceipt.studentId.substring(viewingReceipt.studentId.length - 4)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">DATE OF BIRTH:</p>
                          <p className="font-bold text-slate-900">{viewingReceipt.dob}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">CLASSROOM HIVE:</p>
                          <p className="font-bold text-slate-900">{viewingReceipt.program} Program</p>
                        </div>
                      </div>

                      <div className="space-y-2 border-t border-b border-slate-100 py-3">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 font-mono mb-1">
                          <span>DEVELOPMENT DOMAINS EVALUATION</span>
                          <span>GRADE</span>
                        </div>
                        {viewingReceipt.grades.map((g: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="text-slate-700 font-medium">{g.subject}</span>
                            <span className="font-bold font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-100">{g.grade}</span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-yellow-50/50 border border-yellow-100 p-3.5 rounded-xl text-xs space-y-1">
                        <span className="font-bold text-yellow-800 uppercase text-[9px] block">Teacher Evaluator Remarks:</span>
                        <p className="text-slate-600 leading-relaxed italic">"{viewingReceipt.teacherRemarks}"</p>
                      </div>

                      <div className="flex justify-between items-end pt-4 border-t border-slate-100">
                        <div className="text-[9px] text-slate-450 font-mono">
                          <p>Verification Ref ID:</p>
                          <p className="font-bold text-slate-800 uppercase">ACAD-EVAL-293821-HB</p>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="w-24 border-b border-slate-400 inline-block text-center text-[10px] italic font-serif">Mrs. Evelyn Green</div>
                          <p className="text-[8px] uppercase tracking-widest text-slate-400 font-mono">Class Advisor Signature</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* BILLING RECEIPT TRANSCRIPT */
                    <div className="space-y-5 text-slate-800">
                      <div className="text-center space-y-1">
                        <h4 className="font-display font-extrabold text-base uppercase tracking-wide text-slate-950">
                          OFFICIAL TUITION PAYMENT RECEIPT
                        </h4>
                        <p className="text-[10px] text-slate-400 uppercase font-mono">Honey Bees preschool, daycare and tuition centre</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-150 font-mono">
                        <div>
                          <p className="text-slate-400">BILL REFERENCE CODE:</p>
                          <p className="font-bold text-slate-800">REC-{viewingReceipt.id}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">TRANSACTION ID:</p>
                          <p className="font-bold text-slate-800">TXN-HB-{Date.now().toString().substring(3)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">PAYMENT DATE:</p>
                          <p className="font-bold text-slate-800">{viewingReceipt.paidDate}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">PUPIL NAME:</p>
                          <p className="font-bold text-slate-800">{viewingReceipt.studentName}</p>
                        </div>
                      </div>

                      <div className="space-y-3.5">
                        <div className="flex justify-between text-[10px] font-extrabold text-slate-400 tracking-wider font-mono uppercase">
                          <span>BILL DESCRIPTION</span>
                          <span>AMOUNT PAID</span>
                        </div>
                        <div className="flex justify-between text-xs font-sans border-b border-slate-100 pb-3">
                          <span className="text-slate-700">{viewingReceipt.term} Enrollment Tuition Fee</span>
                          <span className="font-extrabold text-slate-900">${viewingReceipt.amount}.00</span>
                        </div>
                        <div className="flex justify-between items-center font-display">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">TOTAL PAID</span>
                          <span className="text-2xl font-extrabold text-slate-950">${viewingReceipt.amount}.00</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-end pt-4 border-t border-slate-100">
                        <div className="text-[9px] text-slate-400 font-mono">
                          <p>PCI-DSS Transaction Security Secured</p>
                          <p className="font-bold text-blue-600 uppercase">Razorpay PG Verified</p>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="w-20 h-10 border border-emerald-500 bg-emerald-50/50 rounded-xl flex items-center justify-center font-display font-extrabold text-[9px] text-emerald-800 leading-none uppercase select-none rotate-6">
                            ✓ PAID HIVE
                          </div>
                          <p className="text-[7px] uppercase tracking-wider text-slate-400 font-mono">Official school stamp</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Print / Action Footer */}
                  <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                    >
                      🖨️ Print Document
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
          )
        )}

        {/* ======================================= */}
        {/*           TEACHER PORTAL PANEL          */}
        {/* ======================================= */}
        {activeRole === "teacher" && (
          !(currentUser && currentUser.role === "teacher") ? (
            renderAuthGate("teacher")
          ) : (
            <motion.div
              key="teacher"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Teacher header banner */}
              <div className="bg-gradient-to-r from-sky-500 to-indigo-600 p-6 rounded-3xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md border border-sky-400/20">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-2xl text-2xl text-sky-600 shadow-md leading-none select-none">
                    👩‍🏫
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-100 bg-sky-600/40 px-2 py-0.5 rounded-md border border-sky-400/20">
                      Senior Educator Portal
                    </span>
                    <h3 className="text-2xl font-display font-bold mt-1">Mrs. Evelyn Green</h3>
                    <p className="text-xs text-sky-100 mt-0.5">
                      Class Advisor: <strong className="font-bold">Nursery Hive</strong> • Certified CPR & Pediatric First Aid Care
                    </p>
                  </div>
                </div>

                <div className="bg-sky-600/30 border border-sky-400/30 px-4 py-2 rounded-2xl text-xs font-bold flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <div>📚 Lesson Plans: {teacherLessons.length} Active</div>
                  <div>👦 Class Size: {dbState.students.filter((s) => s.program === "Nursery" || s.program === "Play Group").length} Pupils</div>
                </div>
              </div>

              {/* Multi-Tab Sub-navigation Bar */}
              <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-full no-scrollbar">
                {[
                  { id: "attendance", label: "Attendance & Health", icon: "📋" },
                  { id: "lesson", label: "Curriculum Planner", icon: "📖" },
                  { id: "progress", label: "Pupil Progress", icon: "🏆" },
                  { id: "photos", label: "Class Snapshots", icon: "📸" },
                  { id: "homework", label: "Assignments Hub", icon: "🎒" },
                  { id: "leave", label: "Leave Requests", icon: "🗓️" },
                  { id: "chat", label: "Direct Message Box", icon: "💬" }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTeacherTab(t.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      teacherTab === t.id
                        ? "bg-sky-500 text-white shadow-md shadow-sky-100 dark:shadow-none"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <span>{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Sub-tab Interactive Renderers */}
              <AnimatePresence mode="wait">
                {/* 1. ATTENDANCE & HEALTH SECTION */}
                {teacherTab === "attendance" && (
                  <motion.div
                    key="tab-attendance"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid lg:grid-cols-3 gap-6"
                  >
                    {/* Attendance checklist panel */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs lg:col-span-2 space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                            Daily Attendance Register
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Mark attendance below. Changes sync directly to guardian notification dashboards.
                          </p>
                        </div>
                        <span className="bg-sky-50 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 text-xs font-bold px-2.5 py-1 rounded-xl font-mono border border-sky-100 dark:border-sky-900/50">
                          {new Date().toISOString().split("T")[0]}
                        </span>
                      </div>

                      <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1">
                        {dbState.students.map((student) => {
                          const todayStr = new Date().toISOString().split("T")[0];
                          const todayLog = student.attendance?.find((a) => a.date === todayStr);
                          const statusVal = todayLog?.status || "None";

                          return (
                            <div key={student.id} className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/80 p-3.5 rounded-xl flex justify-between items-center text-xs">
                              <div>
                                <h5 className="font-bold text-slate-850 dark:text-slate-100 text-sm">{student.name}</h5>
                                <p className="text-slate-400 font-medium">Program: {student.program} • Parent: {student.parentName}</p>
                              </div>
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => handleMarkAttendance(student.id, todayStr, "Present")}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    statusVal === "Present"
                                      ? "bg-emerald-500 text-white shadow-sm"
                                      : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
                                  }`}
                                >
                                  Present
                                </button>
                                <button
                                  onClick={() => handleMarkAttendance(student.id, todayStr, "Absent")}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    statusVal === "Absent"
                                      ? "bg-rose-500 text-white shadow-sm"
                                      : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
                                  }`}
                                >
                                  Absent
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Health & Wellness Logger Panel */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-4">
                      <div>
                        <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                          🩺 Child Health & Wellness Logger
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">Record temperature checks, napping routines, and nutritional intake.</p>
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const newLog = {
                            id: `heal-${Date.now()}`,
                            studentId: newHealStudentId,
                            temp: newHealTemp,
                            nap: newHealNap,
                            food: newHealFood,
                            healthStatus: newHealStatus,
                            notes: newHealNotes || "Looking healthy and active.",
                            timestamp: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          };
                          const updated = [newLog, ...teacherHealthLogs];
                          setTeacherHealthLogs(updated);
                          localStorage.setItem("honeybees_teacher_health_logs", JSON.stringify(updated));
                          setNewHealNotes("");
                          alert(`Health log posted successfully for ${dbState.students.find(s => s.id === newHealStudentId)?.name}!`);
                        }}
                        className="space-y-3.5 text-xs"
                      >
                        <div>
                          <label className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Select Student</label>
                          <select
                            value={newHealStudentId}
                            onChange={(e) => setNewHealStudentId(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-sans focus:ring-1 focus:ring-sky-400 dark:text-white"
                          >
                            {dbState.students.map((student) => (
                              <option key={student.id} value={student.id}>{student.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Body Temp</label>
                            <input
                              type="text"
                              value={newHealTemp}
                              onChange={(e) => setNewHealTemp(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-sans focus:ring-1 focus:ring-sky-400 dark:text-white"
                              placeholder="e.g. 98.4°F"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Nap Session</label>
                            <input
                              type="text"
                              value={newHealNap}
                              onChange={(e) => setNewHealNap(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-sans focus:ring-1 focus:ring-sky-400 dark:text-white"
                              placeholder="e.g. 1 hr 15 mins"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Food Consumed</label>
                            <select
                              value={newHealFood}
                              onChange={(e) => setNewHealFood(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-sans focus:ring-1 focus:ring-sky-400 dark:text-white"
                            >
                              <option value="All">All of it</option>
                              <option value="Most">Most of it</option>
                              <option value="Some">Some of it</option>
                              <option value="None">None</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Daily Disposition</label>
                            <select
                              value={newHealStatus}
                              onChange={(e) => setNewHealStatus(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-sans focus:ring-1 focus:ring-sky-400 dark:text-white"
                            >
                              <option value="Active & Playful">Active & Playful</option>
                              <option value="Calm & Restful">Calm & Restful</option>
                              <option value="Quiet / Tired">Quiet / Tired</option>
                              <option value="Irritable / Fussy">Irritable / Fussy</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Health & Nutrition Notes</label>
                          <textarea
                            value={newHealNotes}
                            onChange={(e) => setNewHealNotes(e.target.value)}
                            placeholder="Provide details of any milk bottles drank, medications given, or general child well-being observations..."
                            rows={2}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-sans focus:ring-1 focus:ring-sky-400 dark:text-white"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm cursor-pointer text-center"
                        >
                          Log Health Assessment
                        </button>
                      </form>

                      {/* Display recent health logs */}
                      <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <h5 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Today's Log Timeline</h5>
                        <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                          {teacherHealthLogs.map((log) => {
                            const stud = dbState.students.find(s => s.id === log.studentId);
                            return (
                              <div key={log.id} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-[11px] border border-slate-100 dark:border-slate-700/60">
                                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                                  <span>{stud?.name || "Student"}</span>
                                  <span className="text-sky-600 font-mono text-[9px]">{log.timestamp}</span>
                                </div>
                                <div className="flex flex-wrap gap-2 text-slate-500 mt-1">
                                  <span>🌡️ {log.temp}</span>
                                  <span>😴 {log.nap}</span>
                                  <span>🥣 Food: {log.food}</span>
                                  <span className="text-indigo-500 font-medium">({log.healthStatus})</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 mt-1 italic">"{log.notes}"</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. CURRICULUM & ACTIVITY PLANNER */}
                {teacherTab === "lesson" && (
                  <motion.div
                    key="tab-curriculum"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid lg:grid-cols-2 gap-6"
                  >
                    {/* Lesson Plans Module */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">Preschool Lesson Planner</h4>
                          <p className="text-xs text-slate-500">Draft developmental syllabus targets and core learning milestones.</p>
                        </div>
                      </div>

                      {/* Add Lesson Form */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!newLesTitle) return;
                          const newLes = {
                            id: `les-${Date.now()}`,
                            title: newLesTitle,
                            subject: newLesSubject,
                            ageGroup: newLesAge,
                            milestone: newLesMilestone || "Enhances sensory and fine motor coordination.",
                            date: newLesDate,
                            status: "Scheduled"
                          };
                          const updated = [...teacherLessons, newLes];
                          setTeacherLessons(updated);
                          localStorage.setItem("honeybees_teacher_lessons", JSON.stringify(updated));
                          setNewLesTitle("");
                          setNewLesMilestone("");
                          alert("New Preschool Lesson Plan registered in Syllabus!");
                        }}
                        className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 text-xs"
                      >
                        <h5 className="font-bold text-slate-700 dark:text-slate-200 text-xs flex items-center gap-1.5">
                          ✍️ Draft New Lesson Plan
                        </h5>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Lesson Title</label>
                            <input
                              type="text"
                              value={newLesTitle}
                              onChange={(e) => setNewLesTitle(e.target.value)}
                              placeholder="e.g. Phonics Level B"
                              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Syllabus Subject</label>
                            <select
                              value={newLesSubject}
                              onChange={(e) => setNewLesSubject(e.target.value)}
                              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 dark:text-white"
                            >
                              <option value="Language & Literacy">Language & Literacy</option>
                              <option value="Numbers & Logic">Numbers & Logic</option>
                              <option value="Fine Motor Skills">Fine Motor Skills</option>
                              <option value="Social & Emotional">Social & Emotional</option>
                              <option value="Creative Arts">Creative Arts</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Target Age Group</label>
                            <select
                              value={newLesAge}
                              onChange={(e) => setNewLesAge(e.target.value)}
                              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 dark:text-white"
                            >
                              <option value="Play Group">Play Group (2-3 Yrs)</option>
                              <option value="Nursery">Nursery (3-4 Yrs)</option>
                              <option value="LKG">LKG (4-5 Yrs)</option>
                              <option value="UKG">UKG (5-6 Yrs)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Target Date</label>
                            <input
                              type="date"
                              value={newLesDate}
                              onChange={(e) => setNewLesDate(e.target.value)}
                              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Developmental Milestone Target</label>
                          <input
                            type="text"
                            value={newLesMilestone}
                            onChange={(e) => setNewLesMilestone(e.target.value)}
                            placeholder="e.g. Identifies color patterns, tracks sounds, shapes..."
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 dark:text-white"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-1.5 rounded-lg text-xs"
                        >
                          Register Lesson
                        </button>
                      </form>

                      {/* Lessons List */}
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {teacherLessons.map((les) => (
                          <div key={les.id} className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-xl text-xs">
                            <div className="flex justify-between font-bold text-slate-800 dark:text-slate-100">
                              <span>{les.title}</span>
                              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                                les.status === "Completed" ? "bg-emerald-50 text-emerald-600" :
                                les.status === "Active" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500"
                              }`}>{les.status}</span>
                            </div>
                            <p className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold mt-1">Subject: {les.subject} • Level: {les.ageGroup}</p>
                            <p className="text-slate-500 dark:text-slate-300 text-[11px] mt-0.5">🎯 Milestone: {les.milestone}</p>
                            <span className="text-[8px] text-slate-400 block mt-1">Scheduled for: {les.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Creative Activity Planner Module */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-4">
                      <div>
                        <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">Creative Activity Planner</h4>
                        <p className="text-xs text-slate-500">Formulate collaborative arts, crafts, group circles, and physical playtime.</p>
                      </div>

                      {/* Add Activity Form */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!newActTitle) return;
                          const newAct = {
                            id: `act-${Date.now()}`,
                            title: newActTitle,
                            theme: newActTheme || "Creative Play",
                            groupSize: newActGroup,
                            materials: newActMaterials || "Basic child safety scissors and colored shapes",
                            safety: newActSafety || "Check for non-toxicity, standard tutor observation.",
                            status: "Scheduled"
                          };
                          const updated = [...teacherActivities, newAct];
                          setTeacherActivities(updated);
                          localStorage.setItem("honeybees_teacher_activities", JSON.stringify(updated));
                          setNewActTitle("");
                          setNewActTheme("");
                          setNewActMaterials("");
                          setNewActSafety("");
                          alert("Creative Activity drafted successfully!");
                        }}
                        className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 text-xs"
                      >
                        <h5 className="font-bold text-slate-700 dark:text-slate-200 text-xs flex items-center gap-1.5">
                          🎨 Design Classroom Play Activity
                        </h5>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Activity Title</label>
                            <input
                              type="text"
                              value={newActTitle}
                              onChange={(e) => setNewActTitle(e.target.value)}
                              placeholder="e.g. Splash Pool Sensory play"
                              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Activity Theme</label>
                            <input
                              type="text"
                              value={newActTheme}
                              onChange={(e) => setNewActTheme(e.target.value)}
                              placeholder="e.g. Water Floatation"
                              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Social Group Size</label>
                            <select
                              value={newActGroup}
                              onChange={(e) => setNewActGroup(e.target.value)}
                              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 dark:text-white"
                            >
                              <option value="Individual">Individual Work</option>
                              <option value="Pairs">In Pairs</option>
                              <option value="Small Groups">Small Groups (3-4 Pupils)</option>
                              <option value="Full Group">Full Group Activity</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Materials Required</label>
                            <input
                              type="text"
                              value={newActMaterials}
                              onChange={(e) => setNewActMaterials(e.target.value)}
                              placeholder="e.g. glue, paint, flashcards..."
                              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Observation & Safety Guideline</label>
                          <input
                            type="text"
                            value={newActSafety}
                            onChange={(e) => setNewActSafety(e.target.value)}
                            placeholder="e.g. Non-slip shoes, pediatric monitor, sterile glue boards..."
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 dark:text-white"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-1.5 rounded-lg text-xs"
                        >
                          Publish Play Activity
                        </button>
                      </form>

                      {/* Activities list */}
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {teacherActivities.map((act) => (
                          <div key={act.id} className="p-3 bg-indigo-50/40 dark:bg-slate-800/40 border border-indigo-100 dark:border-slate-700/40 rounded-xl text-xs">
                            <div className="flex justify-between font-bold text-slate-850 dark:text-slate-100">
                              <span className="flex items-center gap-1">🧸 {act.title}</span>
                              <span className="text-[9px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded-md border border-indigo-100/30">{act.status}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-0.5">Theme: <strong>{act.theme}</strong> • Dynamic Group: <strong>{act.groupSize}</strong></p>
                            <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-1">✂️ Materials: {act.materials}</p>
                            <p className="text-[10px] text-rose-550 dark:text-rose-400 font-semibold mt-1">⚠️ Safety: {act.safety}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3. PUPIL ASSESSMENT & BEHAVIOUR TIMELINE */}
                {teacherTab === "progress" && (
                  <motion.div
                    key="tab-progress"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid lg:grid-cols-3 gap-6"
                  >
                    {/* Performance Assessment Form */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs lg:col-span-2 space-y-4">
                      <div>
                        <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">Pupil Developmental Assessment Form</h4>
                        <p className="text-xs text-slate-500">Conduct regular periodic assessments across key preschool milestone fields.</p>
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const newAss = {
                            id: `ass-${Date.now()}`,
                            studentId: newAssStudentId,
                            fineMotor: newAssFineMotor,
                            cognitive: newAssCognitive,
                            social: newAssSocial,
                            language: newAssLanguage,
                            remarks: newAssRemarks || "Making consistent progress in motor learning and focus circles.",
                            date: new Date().toISOString().split("T")[0]
                          };
                          const updated = [newAss, ...teacherAssessments];
                          setTeacherAssessments(updated);
                          localStorage.setItem("honeybees_teacher_assessments", JSON.stringify(updated));
                          setNewAssRemarks("");
                          alert(`Progress report compiled for student!`);
                        }}
                        className="space-y-4 text-xs"
                      >
                        <div>
                          <label className="block font-bold text-slate-500 mb-1">Select Student Pupil</label>
                          <select
                            value={newAssStudentId}
                            onChange={(e) => setNewAssStudentId(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-sans focus:ring-1 focus:ring-sky-450 dark:text-white"
                          >
                            {dbState.students.map((student) => (
                              <option key={student.id} value={student.id}>{student.name} ({student.program})</option>
                            ))}
                          </select>
                        </div>

                        {/* Sliders for Milestones */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <div className="space-y-1">
                            <div className="flex justify-between font-bold text-slate-600 dark:text-slate-300">
                              <span>Fine Motor Controls (1-5)</span>
                              <span className="text-indigo-600 font-mono">{newAssFineMotor} / 5</span>
                            </div>
                            <input
                              type="range" min="1" max="5"
                              value={newAssFineMotor}
                              onChange={(e) => setNewAssFineMotor(parseInt(e.target.value))}
                              className="w-full accent-sky-500 cursor-pointer"
                            />
                            <p className="text-[9px] text-slate-400">Scissors safety, crayon hold, brick stacking</p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between font-bold text-slate-600 dark:text-slate-300">
                              <span>Cognitive & Logic (1-5)</span>
                              <span className="text-indigo-600 font-mono">{newAssCognitive} / 5</span>
                            </div>
                            <input
                              type="range" min="1" max="5"
                              value={newAssCognitive}
                              onChange={(e) => setNewAssCognitive(parseInt(e.target.value))}
                              className="w-full accent-sky-500 cursor-pointer"
                            />
                            <p className="text-[9px] text-slate-400">Counting shapes, pattern matching, block puzzle solving</p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between font-bold text-slate-600 dark:text-slate-300">
                              <span>Social & Emotional (1-5)</span>
                              <span className="text-indigo-600 font-mono">{newAssSocial} / 5</span>
                            </div>
                            <input
                              type="range" min="1" max="5"
                              value={newAssSocial}
                              onChange={(e) => setNewAssSocial(parseInt(e.target.value))}
                              className="w-full accent-sky-500 cursor-pointer"
                            />
                            <p className="text-[9px] text-slate-400">Sharing toys, circle participation, self-regulation</p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between font-bold text-slate-600 dark:text-slate-300">
                              <span>Language & Phonics (1-5)</span>
                              <span className="text-indigo-600 font-mono">{newAssLanguage} / 5</span>
                            </div>
                            <input
                              type="range" min="1" max="5"
                              value={newAssLanguage}
                              onChange={(e) => setNewAssLanguage(parseInt(e.target.value))}
                              className="w-full accent-sky-500 cursor-pointer"
                            />
                            <p className="text-[9px] text-slate-400">Syllable tracking, letter sound association, verbal requests</p>
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-500 mb-1">Teacher Remarks & Guidance Advice</label>
                          <textarea
                            value={newAssRemarks}
                            onChange={(e) => setNewAssRemarks(e.target.value)}
                            placeholder="Describe social milestones, creative bursts, or areas we want parents to guide at home..."
                            rows={3}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-sans focus:ring-1 focus:ring-sky-400 dark:text-white"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                        >
                          Compile & Publish Assessment Report
                        </button>
                      </form>

                      {/* Assessments list */}
                      <div className="pt-3 border-t border-slate-150 dark:border-slate-850">
                        <h5 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">Historical Milestone Report Cards</h5>
                        <div className="grid sm:grid-cols-2 gap-3 max-h-[180px] overflow-y-auto pr-1">
                          {teacherAssessments.map((ass) => {
                            const stud = dbState.students.find(s => s.id === ass.studentId);
                            return (
                              <div key={ass.id} className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-xl text-[11px]">
                                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                                  <span>{stud?.name || "Student"}</span>
                                  <span className="text-slate-400 font-mono text-[9px]">{ass.date}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-1.5 mt-2 bg-white dark:bg-slate-900 p-2 rounded-lg text-[10px] text-slate-550 border border-slate-100">
                                  <span>🖐️ Fine Motor: <strong>{ass.fineMotor}/5</strong></span>
                                  <span>🧠 Cognitive: <strong>{ass.cognitive}/5</strong></span>
                                  <span>🤝 Social: <strong>{ass.social}/5</strong></span>
                                  <span>🗣️ Language: <strong>{ass.language}/5</strong></span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 mt-2 italic">"{ass.remarks}"</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Behaviour Tracking Module */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-4">
                      <div>
                        <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">Behaviour & Disposition Logger</h4>
                        <p className="text-xs text-slate-500">Track and reinforce constructive behavioural actions or log redirection guidance.</p>
                      </div>

                      {/* Add Behaviour Log form */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const newLog = {
                            id: `beh-${Date.now()}`,
                            studentId: newBehStudentId,
                            category: newBehCategory,
                            notes: newBehNotes || "Showed marvelous self-discipline and helpful attitude.",
                            timestamp: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          };
                          const updated = [newLog, ...teacherBehaviours];
                          setTeacherBehaviours(updated);
                          localStorage.setItem("honeybees_teacher_behaviours", JSON.stringify(updated));
                          setNewBehNotes("");
                          alert(`Behaviour log updated!`);
                        }}
                        className="p-3.5 bg-slate-50 dark:bg-slate-800/45 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3.5 text-xs"
                      >
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Select Student</label>
                          <select
                            value={newBehStudentId}
                            onChange={(e) => setNewBehStudentId(e.target.value)}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 dark:text-white"
                          >
                            {dbState.students.map((student) => (
                              <option key={student.id} value={student.id}>{student.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Observation Tag Category</label>
                          <select
                            value={newBehCategory}
                            onChange={(e) => setNewBehCategory(e.target.value)}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 dark:text-white"
                          >
                            <option value="Highly Cooperative">Highly Cooperative 🤝</option>
                            <option value="Creative Builder">Creative Builder 🧱</option>
                            <option value="Helpful Peer">Helpful Peer 🧑‍🤝‍🧑</option>
                            <option value="Great Sharing">Great Sharing 🍎</option>
                            <option value="Lively Energy">Lively Energy ⚡</option>
                            <option value="Needs Redirection">Needs Redirection ⚠️</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Observation Details</label>
                          <textarea
                            value={newBehNotes}
                            onChange={(e) => setNewBehNotes(e.target.value)}
                            placeholder="Write specific preschool scenario, e.g., tidy-up circle, snack sharing..."
                            rows={2}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 dark:text-white"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-1.5 rounded-lg text-xs"
                        >
                          Log Behaviour Note
                        </button>
                      </form>

                      {/* Timeline List */}
                      <div className="space-y-2.5">
                        <h5 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Recent Interactive Classroom Log</h5>
                        <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
                          {teacherBehaviours.map((beh) => {
                            const stud = dbState.students.find(s => s.id === beh.studentId);
                            const tagColors: Record<string, string> = {
                              "Highly Cooperative": "bg-emerald-50 text-emerald-700 border-emerald-100",
                              "Creative Builder": "bg-sky-50 text-sky-700 border-sky-100",
                              "Helpful Peer": "bg-purple-50 text-purple-700 border-purple-100",
                              "Great Sharing": "bg-amber-50 text-amber-700 border-amber-100",
                              "Lively Energy": "bg-orange-50 text-orange-700 border-orange-100",
                              "Needs Redirection": "bg-rose-50 text-rose-700 border-rose-100"
                            };

                            return (
                              <div key={beh.id} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-[11px] border border-slate-100 dark:border-slate-750">
                                <div className="flex justify-between items-center font-bold">
                                  <span className="text-slate-850 dark:text-slate-200">{stud?.name || "Student"}</span>
                                  <span className="text-[8px] text-slate-400 font-mono">{beh.timestamp}</span>
                                </div>
                                <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-md mt-1 border ${tagColors[beh.category] || "bg-slate-100 text-slate-600"}`}>
                                  {beh.category}
                                </span>
                                <p className="text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed italic">"{beh.notes}"</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 4. CLASSROOM PHOTOS VIEW */}
                {teacherTab === "photos" && (
                  <motion.div
                    key="tab-photos"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid lg:grid-cols-3 gap-6"
                  >
                    {/* Upload classroom snapshot panel */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-4">
                      <div>
                        <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                          📸 Classroom Snapshots Dispatcher
                        </h4>
                        <p className="text-xs text-slate-500">Share heartwarming snapshots of sensory learning circles directly with parents.</p>
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!newPhotoCaption) return;
                          const newPhoObj = {
                            id: `tpho-${Date.now()}`,
                            url: newPhotoUrl,
                            caption: newPhotoCaption,
                            taggedStudent: newPhotoStudent,
                            date: new Date().toISOString().split("T")[0]
                          };
                          const updated = [newPhoObj, ...teacherPhotos];
                          setTeacherPhotos(updated);
                          localStorage.setItem("honeybees_teacher_photos", JSON.stringify(updated));
                          setNewPhotoCaption("");
                          alert("Classroom Snapshot dispatched to tagged Guardian stream!");
                        }}
                        className="space-y-3.5 text-xs"
                      >
                        {/* Selected Preset Image Preview Box */}
                        <div className="space-y-1.5">
                          <label className="block font-bold text-slate-500">Choose Unsplash Preset Photo</label>
                          <div className="grid grid-cols-4 gap-1.5">
                            {[
                              { label: "Clay 🧸", url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80" },
                              { label: "Yoga 🧘‍♀️", url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80" },
                              { label: "Painting 🎨", url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80" },
                              { label: "Circle ⭕", url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80" }
                            ].map((img, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setNewPhotoUrl(img.url)}
                                className={`p-1 text-[10px] font-semibold border rounded-lg transition-all text-center leading-tight truncate ${
                                  newPhotoUrl === img.url 
                                    ? "bg-sky-500 border-sky-400 text-white shadow-sm" 
                                    : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                                }`}
                              >
                                {img.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="relative aspect-video w-full rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shadow-inner group">
                          <img
                            src={newPhotoUrl}
                            alt="Preview Asset"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                          />
                          <span className="absolute bottom-2 right-2 text-[8.5px] bg-black/60 backdrop-blur-md px-2 py-0.5 text-white rounded font-mono">LIVE PREVIEW</span>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-500 mb-1">Tag Student Pupil</label>
                          <select
                            value={newPhotoStudent}
                            onChange={(e) => setNewPhotoStudent(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-sans focus:ring-1 focus:ring-sky-450 dark:text-white"
                          >
                            <option value="All Class">Tag All Class (Broadcast)</option>
                            {dbState.students.map((student) => (
                              <option key={student.id} value={student.name}>{student.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-500 mb-1">Snapshot Caption Description</label>
                          <textarea
                            value={newPhotoCaption}
                            onChange={(e) => setNewPhotoCaption(e.target.value)}
                            placeholder="Describe what the children are enjoying or learning in this classroom activity..."
                            rows={3}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-sans focus:ring-1 focus:ring-sky-400 dark:text-white"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                        >
                          Disperse Snapshot to Parent Feed
                        </button>
                      </form>
                    </div>

                    {/* Snapshot stream gallery view */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs lg:col-span-2 space-y-4">
                      <div>
                        <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">Active Classroom Snapshot Streams</h4>
                        <p className="text-xs text-slate-500">Live timeline of beautiful snaps compiled from Mrs. Evelyn Green's Nursery Hive.</p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-1">
                        {teacherPhotos.map((pho) => (
                          <div key={pho.id} className="bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 p-3 rounded-2xl space-y-3 shadow-xs">
                            <div className="aspect-video rounded-xl bg-slate-100 overflow-hidden relative border border-slate-200 shadow-sm">
                              <img
                                src={pho.url}
                                alt="Classroom Moment"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover hover:scale-105 transition-all duration-500"
                              />
                              <span className="absolute top-2 left-2 text-[9px] font-extrabold bg-sky-500 text-white px-2 py-0.5 rounded-md border border-sky-400">
                                👦 Tagged: {pho.taggedStudent}
                              </span>
                            </div>
                            <div className="text-xs">
                              <p className="text-slate-750 dark:text-slate-200 leading-relaxed italic">"{pho.caption}"</p>
                              <div className="flex justify-between text-[9px] text-slate-400 font-mono pt-2 border-t border-slate-100 dark:border-slate-750 mt-2">
                                <span>Dispatcher: Mrs. Evelyn Green</span>
                                <span>📅 {pho.date}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 5. HOMEWORK MANAGEMENT & SUBMISSIONS REVIEW */}
                {teacherTab === "homework" && (
                  <motion.div
                    key="tab-homework"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid lg:grid-cols-3 gap-6"
                  >
                    {/* Upload homework assignment panel */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-4">
                      <div className="flex items-center gap-2 text-sky-600">
                        <Plus size={18} />
                        <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">Assign Home-Play Activity</h4>
                      </div>

                      <form onSubmit={handleUploadHomework} className="space-y-3 text-xs">
                        <div>
                          <label className="block font-bold text-slate-500 uppercase mb-1">Target Class</label>
                          <select
                            value={hwClass}
                            onChange={(e) => setHwClass(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-sans dark:text-white"
                          >
                            <option value="Play Group">Play Group</option>
                            <option value="Nursery">Nursery</option>
                            <option value="LKG">LKG</option>
                            <option value="UKG">UKG</option>
                            <option value="Daycare">Daycare</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-bold text-slate-500 uppercase mb-1">Subject</label>
                            <input
                              type="text"
                              value={hwSubject}
                              onChange={(e) => setHwSubject(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-sans dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-500 uppercase mb-1">Due Date</label>
                            <input
                              type="date"
                              value={hwDueDate}
                              onChange={(e) => setHwDueDate(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 font-sans dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-500 uppercase mb-1">Activity Title</label>
                          <input
                            id="inp-hw-title"
                            type="text"
                            value={hwTitle}
                            onChange={(e) => setHwTitle(e.target.value)}
                            placeholder="e.g. Coloring Honeycomb Patterns"
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-sans dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-500 uppercase mb-1">Instructions / Description</label>
                          <textarea
                            id="inp-hw-desc"
                            value={hwDesc}
                            onChange={(e) => setHwDesc(e.target.value)}
                            placeholder="Explain sensory materials needed and developmental goals..."
                            rows={3}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-sans dark:text-white"
                          />
                        </div>

                        <button
                          id="btn-hw-submit"
                          type="submit"
                          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm cursor-pointer text-center"
                        >
                          Post Activity & Alert Guardians
                        </button>
                      </form>
                    </div>

                    {/* Submissions review board */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs lg:col-span-2 space-y-4">
                      <div>
                        <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">Active Assignments & Pupil Submissions</h4>
                        <p className="text-xs text-slate-500">Review homework files uploaded by parents. Give developmental feedbacks and approvals.</p>
                      </div>

                      {/* Hardcoded interactive submissions with simulated reviews */}
                      <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                        {[
                          { id: "sub-1", studentName: "Ethan Watson", hwTitle: "Tracing Capital Letters A & B", date: "2026-07-20", file: "Ethan_Trace_Work.jpg", status: "Needs Review", remarks: "" },
                          { id: "sub-2", studentName: "Sophia Lin", hwTitle: "Coloring Honeycomb Patterns", date: "2026-07-21", file: "Sophia_Honeycomb_Draft.jpg", status: "Approved", remarks: "Exquisite visual coloring Sophia! Very steady borders." }
                        ].map((sub) => (
                          <div key={sub.id}>
                            <SubmissionItem sub={sub} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 6. LEAVE REQUESTS TERMINAL */}
                {teacherTab === "leave" && (
                  <motion.div
                    key="tab-leave"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid lg:grid-cols-3 gap-6"
                  >
                    {/* Submit request panel */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-4">
                      <div>
                        <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">Submit Leave Request</h4>
                        <p className="text-xs text-slate-500">Apply for duty leave or emergency sick leave with administrator backup.</p>
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!newLeaveStart || !newLeaveEnd) {
                            alert("Please supply start and end date of requested leave.");
                            return;
                          }
                          const newReq = {
                            id: `lv-${Date.now()}`,
                            startDate: newLeaveStart,
                            endDate: newLeaveEnd,
                            reason: newLeaveReason,
                            details: newLeaveDetails || "General household backup and pediatric monitoring.",
                            status: "Pending"
                          };
                          const updated = [...teacherLeaveRequests, newReq];
                          setTeacherLeaveRequests(updated);
                          localStorage.setItem("honeybees_teacher_leave", JSON.stringify(updated));
                          setNewLeaveStart("");
                          setNewLeaveEnd("");
                          setNewLeaveDetails("");
                          alert("Leave request logged to administrator evaluation queue.");
                        }}
                        className="space-y-3 text-xs"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-bold text-slate-500 uppercase mb-1">Start Date</label>
                            <input
                              type="date"
                              value={newLeaveStart}
                              onChange={(e) => setNewLeaveStart(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 font-sans dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-500 uppercase mb-1">End Date</label>
                            <input
                              type="date"
                              value={newLeaveEnd}
                              onChange={(e) => setNewLeaveEnd(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 font-sans dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-500 uppercase mb-1">Category Reason</label>
                          <select
                            value={newLeaveReason}
                            onChange={(e) => setNewLeaveReason(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-sans dark:text-white"
                          >
                            <option value="Sickness">Sickness (Routine / Sick Leave)</option>
                            <option value="Personal Leave">Personal Leave (Urgent Matters)</option>
                            <option value="Professional Training">Professional Training (Syllabus Seminars)</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-500 uppercase mb-1">Detailed Explanation</label>
                          <textarea
                            value={newLeaveDetails}
                            onChange={(e) => setNewLeaveDetails(e.target.value)}
                            placeholder="State substitute details or training curriculum titles..."
                            rows={3}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-sans dark:text-white"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                        >
                          Submit Request
                        </button>
                      </form>
                    </div>

                    {/* Historical log list */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs lg:col-span-2 space-y-4">
                      <div>
                        <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">Leave Application Ledger</h4>
                        <p className="text-xs text-slate-500">History of your logged leave requests and corresponding status approvals.</p>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 font-bold uppercase tracking-wider">
                            <tr>
                              <th className="p-3.5 rounded-l-xl">Leave Range</th>
                              <th className="p-3.5">Category</th>
                              <th className="p-3.5">Details</th>
                              <th className="p-3.5 rounded-r-xl">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {teacherLeaveRequests.map((req) => (
                              <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                                <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                                  📅 {req.startDate} to {req.endDate}
                                </td>
                                <td className="p-3.5 font-medium text-indigo-600 dark:text-indigo-400">
                                  {req.reason}
                                </td>
                                <td className="p-3.5 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                                  {req.details}
                                </td>
                                <td className="p-3.5 font-bold">
                                  <span className={`inline-block px-2.5 py-0.5 rounded-md border text-[9px] font-extrabold uppercase ${
                                    req.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-150" :
                                    req.status === "Declined" ? "bg-rose-50 text-rose-700 border-rose-150" :
                                    "bg-amber-50 text-amber-700 border-amber-150"
                                  }`}>
                                    {req.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 7. PARENT INBOX CHAT */}
                {teacherTab === "chat" && (
                  <motion.div
                    key="tab-chat"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4"
                  >
                    <div className="flex items-center gap-2 text-sky-500">
                      <MessageSquare size={18} />
                      <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">Guardian Messaging Center</h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Active chat channel with: <strong>Sarah Watson (Ethan's Mother)</strong></p>

                    <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl h-[320px] overflow-y-auto space-y-3.5">
                      {/* Message logs */}
                      {dbState.parentMessages.map((m) => (
                        <div key={m.id} className="text-xs max-w-[85%]">
                          <div className="font-extrabold text-amber-600 text-[10px]">Sarah Watson (Parent)</div>
                          <p className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 p-3 rounded-2xl text-slate-750 dark:text-slate-200 mt-1 shadow-xs leading-relaxed">
                            {m.text}
                          </p>
                          <span className="text-[8px] text-slate-400 font-mono block mt-1 pl-1">{m.timestamp}</span>
                        </div>
                      ))}
                      {dbState.teacherMessages.map((m) => (
                        <div key={m.id} className="text-xs max-w-[85%] ml-auto text-right">
                          <div className="font-extrabold text-sky-600 text-[10px]">You (Mrs. Evelyn Green)</div>
                          <p className="bg-sky-500 text-white p-3 rounded-2xl text-left inline-block mt-1 shadow-sm leading-relaxed">
                            {m.text}
                          </p>
                          <span className="text-[8px] text-slate-400 font-mono block mt-1 pr-1">{m.timestamp}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        id="inp-teacher-msg"
                        type="text"
                        value={teacherMessageText}
                        onChange={(e) => setTeacherMessageText(e.target.value)}
                        placeholder="Type direct advice, progress feedback or play updates..."
                        className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-850 dark:text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans"
                      />
                      <button
                        id="btn-teacher-msg-send"
                        onClick={handleSendTeacherMessage}
                        disabled={!teacherMessageText.trim()}
                        className="bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        Send message
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
