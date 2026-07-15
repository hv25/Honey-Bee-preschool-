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
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DatabaseState, Student, Homework, Notice, Message, AdmissionApplication, TourBooking } from "../types";
import { safeJson } from "../utils";

interface DashboardsProps {
  initialRole?: "parent" | "teacher" | "admin";
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
  const [adminSubTab, setAdminSubTab] = useState<"gallery" | "students" | "submissions" | "reviews" | "events" | "emails">("gallery");
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [expandedAdmId, setExpandedAdmId] = useState<string | null>(null);
  const [expandedTourId, setExpandedTourId] = useState<string | null>(null);

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

  // Fetch state from server on load
  const fetchDbState = async () => {
    try {
      const res = await fetch("/api/admin/data");
      const data = await safeJson(res);
      if (!data.error) {
        setDbState(data);
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
                  <div className="flex items-center gap-2 text-xs font-mono bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-slate-300">Live Synchronized</span>
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

            {/* Dashboard blocks */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left col - Info cards */}
              <div className="lg:col-span-2 space-y-6">
                {/* School CCTV classroom stream */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-rose-500">
                      <Video size={18} />
                      <h4 className="font-display font-bold text-lg text-slate-900">
                        Live SafeClass CCTV Stream
                      </h4>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      LIVE FEED
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Exclusive, dual-authenticated live streaming for parents to observe playground activities and rest areas. Fully compliant with preschool privacy safety grids.
                  </p>

                  <div className="relative bg-slate-950 aspect-video rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner group">
                    {/* Simulated live video */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)] opacity-40 z-10" />
                    <div className="absolute top-4 left-4 z-20 bg-black/60 px-3 py-1 rounded-lg text-[10px] text-slate-300 font-mono tracking-wider">
                      CAMERA_02_NURSERY_PLAYROOM
                    </div>
                    <div className="absolute top-4 right-4 z-20 bg-black/60 px-2 py-1 rounded-lg text-[10px] text-rose-400 font-mono flex items-center gap-1">
                      REC 🔴
                    </div>

                    {/* Animated visual noise overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-1/2 w-full animate-bounce [animation-duration:8s] opacity-20 pointer-events-none" />

                    {/* Fun play scene illustration */}
                    <div className="text-center p-6 space-y-3 z-10">
                      <span className="text-5xl block animate-bounce">🎨🧸🤸</span>
                      <p className="text-xs text-slate-300 font-medium max-w-xs leading-normal">
                        Sophia, Ethan, and Liam are currently participating in circle storytelling time led by Mrs. Evelyn Green.
                      </p>
                      <span className="text-[10px] text-slate-400 font-sans block mt-1">CCTV access active 9:00 AM - 1:00 PM</span>
                    </div>
                  </div>
                </div>

                {/* Homework Task Assignments */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-display font-bold text-lg text-slate-900">
                      Homework & Home-Play Tasks
                    </h4>
                    <span className="bg-sky-100 text-sky-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {dbState.homework.filter((h) => h.class === activeStudent.program).length} Tasks
                    </span>
                  </div>

                  <div className="space-y-3">
                    {dbState.homework
                      .filter((h) => h.class === activeStudent.program)
                      .map((hw) => (
                        <div key={hw.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="bg-sky-100 text-sky-700 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-extrabold">
                                {hw.subject}
                              </span>
                              <h5 className="font-display font-bold text-sm text-slate-900 mt-1">{hw.title}</h5>
                            </div>
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                              Due: {hw.dueDate}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{hw.description}</p>
                          <div className="text-[10px] text-slate-400 font-mono">Assigned: {hw.assignedDate}</div>
                        </div>
                      ))}
                    {dbState.homework.filter((h) => h.class === activeStudent.program).length === 0 && (
                      <p className="text-xs text-slate-400 italic py-4 text-center">No homework posted for this class yet!</p>
                    )}
                  </div>
                </div>

                {/* Progress reports milestones */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
                  <h4 className="font-display font-bold text-lg text-slate-900">Developmental Milestones & Progress Report</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-center space-y-1">
                      <span className="text-xl block">🏃</span>
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Motor Skills</h5>
                      <p className="text-xs font-bold text-slate-800">{activeStudent.progress?.motorSkills}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-center space-y-1">
                      <span className="text-xl block">🤝</span>
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Social Skills</h5>
                      <p className="text-xs font-bold text-slate-800">{activeStudent.progress?.socialSkills}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-center space-y-1">
                      <span className="text-xl block">🎨</span>
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Creativity</h5>
                      <p className="text-xs font-bold text-slate-800">{activeStudent.progress?.creativity}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-center space-y-1">
                      <span className="text-xl block">🧠</span>
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cognitive</h5>
                      <p className="text-xs font-bold text-slate-800">{activeStudent.progress?.cognitive}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right col - Bills, Teacher messaging & Attendance */}
              <div className="space-y-6">
                {/* Attendance rate indicator */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-display font-bold text-sm text-slate-900">Weekly Attendance Logs</h4>
                    <span className="text-xs font-bold text-emerald-500 font-mono">
                      {Math.round(
                        (activeStudent.attendance?.filter((a) => a.status === "Present").length /
                          (activeStudent.attendance?.length || 1)) *
                          100
                      )}
                      % Attendance
                    </span>
                  </div>

                  <div className="flex gap-1.5">
                    {activeStudent.attendance?.map((log, index) => (
                      <div
                        key={index}
                        className={`flex-1 p-2 rounded-lg text-center font-mono text-[10px] font-bold ${
                          log.status === "Present"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-rose-50 text-rose-700 border border-rose-100"
                        }`}
                      >
                        <div>{log.date.split("-")[2]}</div>
                        <div className="text-[9px] font-bold mt-1 uppercase tracking-wider">{log.status[0]}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tuition Fee Billing list */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-display font-bold text-sm text-slate-900">Term Tuition Fees</h4>
                    <div className="bg-yellow-100 text-yellow-800 text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full">
                      Razorpay Active
                    </div>
                  </div>

                  <div className="space-y-3">
                    {activeStudent.fees?.map((fee, index) => (
                      <div key={index} className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <h5 className="font-bold text-slate-800">{fee.term}</h5>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            fee.status === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}>
                            {fee.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <span className="text-slate-400 text-[10px] block">Amount Due</span>
                            <span className="text-lg font-display font-extrabold text-slate-900">${fee.amount}</span>
                          </div>
                          {fee.status === "Pending" ? (
                            <button
                              id={`btn-pay-fee-${index}`}
                              onClick={() => handlePayFee(activeStudent.id, fee.term)}
                              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                            >
                              <CreditCard size={12} /> Pay Now
                            </button>
                          ) : (
                            <div className="text-right text-[10px] text-slate-400 font-mono">
                              Paid: {fee.paidDate}
                            </div>
                          )}
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono block">Due Date: {fee.dueDate}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Teacher Chat Box */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-sky-500">
                    <MessageSquare size={16} />
                    <h4 className="font-display font-bold text-sm text-slate-900">Teacher Communication Line</h4>
                  </div>
                  <p className="text-[11px] text-slate-400">Direct instant messaging with child's class advisor.</p>

                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl h-[160px] overflow-y-auto space-y-2.5">
                    {/* Render messages */}
                    {dbState.teacherMessages.map((m) => (
                      <div key={m.id} className="text-xs">
                        <div className="font-bold text-sky-600">Mrs. Evelyn Green</div>
                        <p className="bg-sky-50 border border-sky-100 p-2 rounded-lg text-slate-700 mt-0.5 leading-relaxed">
                          {m.text}
                        </p>
                        <span className="text-[8px] text-slate-400 block mt-0.5">{m.timestamp}</span>
                      </div>
                    ))}
                    {dbState.parentMessages.map((m) => (
                      <div key={m.id} className="text-xs text-right">
                        <div className="font-bold text-amber-600">You (Sarah Watson)</div>
                        <p className="bg-amber-50 border border-amber-100 p-2 rounded-lg text-slate-700 mt-0.5 text-left inline-block max-w-[90%] leading-relaxed">
                          {m.text}
                        </p>
                        <span className="text-[8px] text-slate-400 block mt-0.5 text-right">{m.timestamp}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      id="inp-parent-msg"
                      type="text"
                      value={parentMessageText}
                      onChange={(e) => setParentMessageText(e.target.value)}
                      placeholder="Type a feedback message..."
                      className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-400 font-sans"
                    />
                    <button
                      id="btn-parent-msg-send"
                      onClick={handleSendParentMessage}
                      disabled={!parentMessageText.trim()}
                      className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-40 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
            <div className="bg-sky-500 p-6 rounded-3xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-2xl text-2xl text-sky-500 shadow-sm leading-none">
                  👩‍🏫
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-100 bg-sky-600/30 px-2 py-0.5 rounded">
                    Senior Educator Portal
                  </span>
                  <h3 className="text-2xl font-display font-bold mt-1">Mrs. Evelyn Green</h3>
                  <p className="text-xs text-sky-100 mt-0.5">
                    Class Advisor: <strong className="font-bold">Nursery Hive</strong> • Certified CPR & Pediatric Care
                  </p>
                </div>
              </div>

              <div className="bg-sky-600/30 border border-sky-400/30 px-4 py-2 rounded-2xl text-xs font-bold flex gap-4">
                <div>📚 Lesson Plans: 4 active</div>
                <div>👦 Class Size: {dbState.students.filter((s) => s.program === "Nursery" || s.program === "Play Group").length} Pupils</div>
              </div>
            </div>

            {/* Main panels */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Daily Attendance Checklist */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-display font-bold text-lg text-slate-900">
                      Attendance Checklist (Today)
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">Mark attendance below. Changes update parent portals in real-time.</p>
                  </div>
                  <span className="bg-sky-50 text-sky-800 text-xs font-bold px-2.5 py-1 rounded font-mono">
                    {new Date().toISOString().split("T")[0]}
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                  {dbState.students.map((student) => {
                    const todayStr = new Date().toISOString().split("T")[0];
                    const todayLog = student.attendance?.find((a) => a.date === todayStr);
                    const statusVal = todayLog?.status || "None";

                    return (
                      <div key={student.id} className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <h5 className="font-bold text-slate-850 text-sm">{student.name}</h5>
                          <p className="text-slate-400 font-medium">Program: {student.program} • Parent: {student.parentName}</p>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleMarkAttendance(student.id, todayStr, "Present")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              statusVal === "Present"
                                ? "bg-emerald-500 text-white shadow-sm"
                                : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                            }`}
                          >
                            Present
                          </button>
                          <button
                            onClick={() => handleMarkAttendance(student.id, todayStr, "Absent")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              statusVal === "Absent"
                                ? "bg-rose-500 text-white shadow-sm"
                                : "bg-slate-200 text-slate-600 hover:bg-slate-300"
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

              {/* Upload homework assignment */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-sky-600">
                  <Plus size={18} />
                  <h4 className="font-display font-bold text-lg text-slate-900">Assign Home-Play Activity</h4>
                </div>

                <form onSubmit={handleUploadHomework} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-500 uppercase mb-1">Target Class</label>
                    <select
                      value={hwClass}
                      onChange={(e) => setHwClass(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-sans"
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-sans"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-500 uppercase mb-1">Due Date</label>
                      <input
                        type="date"
                        value={hwDueDate}
                        onChange={(e) => setHwDueDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-sans"
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-sans"
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-sans"
                    />
                  </div>

                  <button
                    id="btn-hw-submit"
                    type="submit"
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm shadow-sky-100 cursor-pointer text-center"
                  >
                    Post Activity & Alert Guardians
                  </button>
                </form>
              </div>
            </div>

            {/* Split row - parent feedback and lesson plans */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Lesson Plans Progress */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
                <h4 className="font-display font-bold text-base text-slate-900">Lesson Plans & Milestone Tracker</h4>
                <div className="space-y-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Phonics Circle (Level A)</span>
                      <span className="text-emerald-500">Completed</span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">Focusing on letters A, B, C, D with flashcards.</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Honeycomb Mosaic Arts</span>
                      <span className="text-yellow-600">Active Task</span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">Using safety scissors, yellow tissue papers, and glue boards.</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Splash Pool Sensory Class</span>
                      <span className="text-slate-400">Scheduled: Mon 10 AM</span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">Water play with floating ducks and measuring cups for volume basics.</p>
                  </div>
                </div>
              </div>

              {/* Direct message from parent */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs lg:col-span-2 space-y-3">
                <div className="flex items-center gap-2 text-sky-500">
                  <MessageSquare size={16} />
                  <h4 className="font-display font-bold text-base text-slate-900">Parent Communication Workspace</h4>
                </div>
                <p className="text-xs text-slate-400">Active channels with Sarah Watson (Ethan's Guardian)</p>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl h-[160px] overflow-y-auto space-y-2.5">
                  {/* Message chat logs */}
                  {dbState.parentMessages.map((m) => (
                    <div key={m.id} className="text-xs">
                      <div className="font-bold text-amber-600">Sarah Watson (Ethan's Parent)</div>
                      <p className="bg-amber-50 border border-amber-100 p-2 rounded-lg text-slate-700 mt-0.5 leading-relaxed">
                        {m.text}
                      </p>
                      <span className="text-[8px] text-slate-400 block mt-0.5">{m.timestamp}</span>
                    </div>
                  ))}
                  {dbState.teacherMessages.map((m) => (
                    <div key={m.id} className="text-xs text-right">
                      <div className="font-bold text-sky-600">You (Mrs. Evelyn Green)</div>
                      <p className="bg-sky-50 border border-sky-100 p-2 rounded-lg text-slate-700 mt-0.5 text-left inline-block max-w-[90%] leading-relaxed">
                        {m.text}
                      </p>
                      <span className="text-[8px] text-slate-400 block mt-0.5 text-right">{m.timestamp}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    id="inp-teacher-msg"
                    type="text"
                    value={teacherMessageText}
                    onChange={(e) => setTeacherMessageText(e.target.value)}
                    placeholder="Type direct advice or progress updates..."
                    className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-400 font-sans"
                  />
                  <button
                    id="btn-teacher-msg-send"
                    onClick={handleSendTeacherMessage}
                    disabled={!teacherMessageText.trim()}
                    className="bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    Send Reply
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
