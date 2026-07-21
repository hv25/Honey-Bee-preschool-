import React, { useState, useEffect } from "react";
import {
  Users,
  CreditCard,
  TrendingUp,
  Activity,
  Check,
  AlertTriangle,
  Plus,
  Trash2,
  Camera,
  Search,
  Package,
  DollarSign,
  History,
  RefreshCw,
  Download,
  FileText,
  Clock,
  Play,
  Lock,
  Eye,
  Flame,
  Briefcase,
  UserCheck,
  UserX,
  ShieldAlert,
  Sliders,
  Bell,
  Heart,
  ChevronRight,
  Database,
  ArrowRight,
  Info,
  Zap,
  Workflow,
  Code,
  Copy,
  ExternalLink,
  Brain,
  CheckSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DatabaseState, Student, AdmissionApplication } from "../types";

interface OperationsHubProps {
  dbState: DatabaseState;
  fetchDbState: () => Promise<void>;
  onUpdateAdmissionStatus: (id: string, status: string) => Promise<void>;
}

// Interally managed local-storage structures
interface StaffMember {
  id: string;
  name: string;
  role: string;
  salary: number;
  attendanceToday: "Present" | "Absent" | "Late" | "Unmarked";
  isPaidThisMonth: boolean;
  phone: string;
}

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: "Utilities" | "Food & Snacks" | "Learning Materials" | "CCTV Maintenance" | "Rent" | "Other";
  date: string;
}

interface InventoryItem {
  id: string;
  name: string;
  qty: number;
  unit: string;
  minThreshold: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

interface Visitor {
  id: string;
  name: string;
  purpose: string;
  phone: string;
  checkIn: string;
  checkOut?: string;
  status: "Active" | "Checked Out";
}

interface AuditLog {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "success" | "danger";
  message: string;
  module: string;
}

export default function OperationsHub({ dbState, fetchDbState, onUpdateAdmissionStatus }: OperationsHubProps) {
  // Operational sub-panels
  const [activeTab, setActiveTab] = useState<"overview" | "finance" | "logistics" | "system" | "automation">("overview");

  // n8n Workflows State
  const [workflows, setWorkflows] = useState<any[]>(() => {
    const saved = localStorage.getItem("honeybees_ops_workflows");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "wf-1",
        name: "New Enquiry Lead Router",
        triggerName: "Webhook (New Enquiry form)",
        actionName: "CRM Lead Pipeline",
        description: "Sends new student inquiries directly to the CRM dashboard, triggering automatic follow-ups.",
        category: "CRM Integration",
        isActive: true,
        webhookUrl: "https://n8n.honeybees.edu/webhook/new-enquiry",
        lastRunStatus: "Never",
        lastRunTime: undefined,
        nodeCount: 3,
        parameters: { pipelineStage: "Inquiry / Lead", source: "Online Admission Form", assignTo: "Mrs. Evelyn Green" }
      },
      {
        id: "wf-2",
        name: "Tour Calendar Scheduler",
        triggerName: "Tour Booking Received",
        actionName: "Google Calendar API",
        description: "Creates a detailed reservation event on Google Calendar, inviting both the school guide and the parent.",
        category: "Calendar Sync",
        isActive: true,
        webhookUrl: "https://n8n.honeybees.edu/webhook/tour-booked",
        lastRunStatus: "Never",
        lastRunTime: undefined,
        nodeCount: 4,
        parameters: { calendarName: "School Tours & Visits", guestInvites: "Enabled", reminderMinutes: "15" }
      },
      {
        id: "wf-3",
        name: "Welcome Pack Email Dispatcher",
        triggerName: "Admission Approved",
        actionName: "Gmail/SMTP Mailer",
        description: "Sends a beautiful HTML welcome letter, class policies document, and curriculum outline once a student is approved.",
        category: "Email automation",
        isActive: true,
        webhookUrl: "https://n8n.honeybees.edu/webhook/admission-welcome",
        lastRunStatus: "Never",
        lastRunTime: undefined,
        nodeCount: 3,
        parameters: { senderEmail: "welcome@honeybees.edu", mailTemplate: "Preschool Welcome Kit", attachment: "handbook.pdf" }
      },
      {
        id: "wf-4",
        name: "WhatsApp Fee Collector",
        triggerName: "Payment Due Date Near",
        actionName: "WhatsApp/Twilio API",
        description: "Pings parents on WhatsApp with a personalized reminder regarding upcoming term fee payments.",
        category: "Reminders",
        isActive: true,
        webhookUrl: "https://n8n.honeybees.edu/webhook/fee-due-reminder",
        lastRunStatus: "Never",
        lastRunTime: undefined,
        nodeCount: 4,
        parameters: { messageTemplate: "Dear {parent_name}, the term fee of {amount} is due.", gracePeriodDays: "3", maxAttempts: "2" }
      },
      {
        id: "wf-5",
        name: "Daily Birthday Wish System",
        triggerName: "Daily Cron (09:00 AM)",
        actionName: "Interactive SMS",
        description: "Looks up birthdays daily and drops festive birthday cards to students and parents.",
        category: "Greeting System",
        isActive: true,
        webhookUrl: "https://n8n.honeybees.edu/webhook/birthday-wishes",
        lastRunStatus: "Never",
        lastRunTime: undefined,
        nodeCount: 3,
        parameters: { greetingTemplate: "Happy Birthday {student_name}! 🎂🌸", sendCard: "True", priority: "high" }
      },
      {
        id: "wf-6",
        name: "Gallery Social Cross-Poster",
        triggerName: "New Photo Published",
        actionName: "Instagram Graph API",
        description: "Auto-publishes new classroom pictures from the web gallery straight to the school's social feed.",
        category: "Social Media",
        isActive: false,
        webhookUrl: "https://n8n.honeybees.edu/webhook/social-post",
        lastRunStatus: "Never",
        lastRunTime: undefined,
        nodeCount: 4,
        parameters: { tags: "#honeybees #preschool", qualityResize: "Auto-Square", platforms: "Instagram, Facebook" }
      },
      {
        id: "wf-7",
        name: "Cloud Backup Vault",
        triggerName: "Cron (Daily 00:00)",
        actionName: "Google Drive Upload",
        description: "Aggregates daily school ledgers, logs, and database snapshots, compressing and loading them onto Secure Drive.",
        category: "Security",
        isActive: true,
        webhookUrl: "https://n8n.honeybees.edu/webhook/daily-backup",
        lastRunStatus: "Never",
        lastRunTime: undefined,
        nodeCount: 3,
        parameters: { folderId: "drive_ops_backups_2026", compression: "gzip", autoPurgeOlderThanDays: "30" }
      },
      {
        id: "wf-8",
        name: "Monthly Trustee Summary",
        triggerName: "Cron (Monthly 1st 08:00)",
        actionName: "Mailgun SMTP Service",
        description: "Generates an automated summary report detailing new admissions, revenue, expenses, and occupancy metrics.",
        category: "Reporting",
        isActive: true,
        webhookUrl: "https://n8n.honeybees.edu/webhook/monthly-report",
        lastRunStatus: "Never",
        lastRunTime: undefined,
        nodeCount: 5,
        parameters: { recipient: "board@honeybees.edu", dataSections: "Financials, Personnel, Occupancy", attachedFormat: "PDF Summary" }
      },
      {
        id: "wf-9",
        name: "Feedback Sentiment Analyzer",
        triggerName: "Parent Review Received",
        actionName: "Gemini AI Node",
        description: "Performs sentiment analysis on reviews. Flags critical scores with higher priority and alerts the Supervisor.",
        category: "AI Operations",
        isActive: true,
        webhookUrl: "https://n8n.honeybees.edu/webhook/sentiment-analyzer",
        lastRunStatus: "Never",
        lastRunTime: undefined,
        nodeCount: 3,
        parameters: { model: "gemini-2.5-flash", priorityAlerts: "True", negativeScoreThreshold: "0.4" }
      }
    ];
  });

  // n8n Executions log
  const [executions, setExecutions] = useState<any[]>(() => {
    const saved = localStorage.getItem("honeybees_ops_wf_executions");
    if (saved) return JSON.parse(saved);
    return [
      { id: "exec-101", workflowId: "wf-1", workflowName: "New Enquiry Lead Router", timestamp: "2026-07-20T21:44:12", status: "Success", duration: "1.2s", payload: { parent: "John Doe", email: "johndoe@gmail.com", childName: "Bobby Doe" } },
      { id: "exec-102", workflowId: "wf-2", workflowName: "Tour Calendar Scheduler", timestamp: "2026-07-20T22:15:30", status: "Success", duration: "1.8s", payload: { date: "2026-07-24", time: "10:00 AM", parentEmail: "lucy@example.com" } }
    ];
  });

  // n8n State variables for interactive simulation
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>("wf-1");
  const [simulatingWorkflowId, setSimulatingWorkflowId] = useState<string | null>(null);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [aiReviewText, setAiReviewText] = useState("We love the personalized care at Honey Bees! The teachers make child learning so joyful.");
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
  const [isAnalyzingSentiment, setIsAnalyzingSentiment] = useState(false);

  // Emergency trigger state
  const [emergencyAlert, setEmergencyAlert] = useState<{
    active: boolean;
    type: "fire" | "medical" | "security" | null;
    triggeredAt: string | null;
  }>(() => {
    const saved = localStorage.getItem("honeybees_ops_emergency");
    return saved ? JSON.parse(saved) : { active: false, type: null, triggeredAt: null };
  });

  // 1. Staff Members State
  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem("honeybees_ops_staff");
    if (saved) return JSON.parse(saved);
    return [
      { id: "staff-1", name: "Mrs. Evelyn Green", role: "Nursery Teacher", salary: 2800, attendanceToday: "Present", isPaidThisMonth: true, phone: "+1 (555) 123-4567" },
      { id: "staff-2", name: "Miss Honey Parker", role: "Play Group Caregiver", salary: 2200, attendanceToday: "Present", isPaidThisMonth: false, phone: "+1 (555) 234-5678" },
      { id: "staff-3", name: "Mr. Baloo Miller", role: "Physical Education Coach", salary: 2000, attendanceToday: "Unmarked", isPaidThisMonth: false, phone: "+1 (555) 345-6789" },
      { id: "staff-4", name: "Miss Sarah Wood", role: "Daycare Supervisor", salary: 2400, attendanceToday: "Late", isPaidThisMonth: true, phone: "+1 (555) 456-7890" },
      { id: "staff-5", name: "Officer David Guard", role: "Campus Security Expert", salary: 1800, attendanceToday: "Present", isPaidThisMonth: false, phone: "+1 (555) 567-8901" }
    ];
  });

  // 2. Expenses State
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem("honeybees_ops_expenses");
    if (saved) return JSON.parse(saved);
    return [
      { id: "exp-1", title: "Premium Organic Toddler Snacks", amount: 240, category: "Food & Snacks", date: "2026-07-10" },
      { id: "exp-2", title: "High-Foam Soft Play Sensory Tiles", amount: 450, category: "Learning Materials", date: "2026-07-12" },
      { id: "exp-3", title: "Monthly High-Speed Fiber Internet", amount: 85, category: "Utilities", date: "2026-07-14" },
      { id: "exp-4", title: "Classroom-02 Camera Re-Wiring", amount: 120, category: "CCTV Maintenance", date: "2026-07-15" }
    ];
  });

  // 3. Inventory State
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem("honeybees_ops_inventory");
    if (saved) return JSON.parse(saved);
    return [
      { id: "inv-1", name: "Water-safe Finger Paints", qty: 45, unit: "tubs", minThreshold: 15, status: "In Stock" },
      { id: "inv-2", name: "Hypoallergenic Hand Sanitizers", qty: 12, unit: "bottles", minThreshold: 20, status: "Low Stock" },
      { id: "inv-3", name: "Emergency Pediatric First-Aid Packs", qty: 8, unit: "kits", minThreshold: 5, status: "In Stock" },
      { id: "inv-4", name: "Extra Absorbent Daycare Diapers", qty: 0, unit: "boxes", minThreshold: 10, status: "Out of Stock" },
      { id: "inv-5", name: "Beeswax Washable Crayons", qty: 60, unit: "packs", minThreshold: 10, status: "In Stock" }
    ];
  });

  // 4. Visitors State
  const [visitors, setVisitors] = useState<Visitor[]>(() => {
    const saved = localStorage.getItem("honeybees_ops_visitors");
    if (saved) return JSON.parse(saved);
    return [
      { id: "vis-1", name: "Robert Downey", purpose: "Deliver Learning Materials", phone: "+1 (555) 901-2345", checkIn: "10:15 AM", checkOut: "10:45 AM", status: "Checked Out" },
      { id: "vis-2", name: "Samantha Ross", purpose: "Prospective Parent Tour Inquiry", phone: "+1 (555) 890-1234", checkIn: "11:30 AM", status: "Active" }
    ];
  });

  // 5. Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem("honeybees_ops_audit");
    if (saved) return JSON.parse(saved);
    return [
      { id: "log-1", timestamp: "2026-07-20T09:00:00", level: "info", message: "Operations Center initialized.", module: "System" },
      { id: "log-2", timestamp: "2026-07-20T10:15:00", level: "success", message: "Visitor Robert Downey checked in.", module: "Visitors" },
      { id: "log-3", timestamp: "2026-07-20T10:45:00", level: "success", message: "Visitor Robert Downey checked out.", module: "Visitors" }
    ];
  });

  // 6. CCTV status simulation
  const [cctvCameras, setCctvCameras] = useState(() => [
    { id: "cam-1", name: "Nursery Playroom (CAM-01)", location: "Classroom A", status: "ONLINE", fps: 30 },
    { id: "cam-2", name: "Outdoor Playground (CAM-02)", location: "Garden Arena", status: "ONLINE", fps: 24 },
    { id: "cam-3", name: "Toddler Sleep Zone (CAM-03)", location: "Nap Room", status: "ONLINE", fps: 15 },
    { id: "cam-4", name: "Front Entry Gates (CAM-04)", location: "Main Access", status: "ONLINE", fps: 30 }
  ]);

  // 7. Local Backups State
  const [backups, setBackups] = useState<any[]>(() => {
    const saved = localStorage.getItem("honeybees_ops_backups");
    return saved ? JSON.parse(saved) : [];
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem("honeybees_ops_staff", JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem("honeybees_ops_expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("honeybees_ops_inventory", JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem("honeybees_ops_visitors", JSON.stringify(visitors));
  }, [visitors]);

  useEffect(() => {
    localStorage.setItem("honeybees_ops_audit", JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem("honeybees_ops_emergency", JSON.stringify(emergencyAlert));
  }, [emergencyAlert]);

  useEffect(() => {
    localStorage.setItem("honeybees_ops_backups", JSON.stringify(backups));
  }, [backups]);

  useEffect(() => {
    localStorage.setItem("honeybees_ops_workflows", JSON.stringify(workflows));
  }, [workflows]);

  useEffect(() => {
    localStorage.setItem("honeybees_ops_wf_executions", JSON.stringify(executions));
  }, [executions]);

  // Audit logger helper
  const addAuditLog = (message: string, module: string, level: "info" | "success" | "warning" | "danger" = "info") => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      level,
      message,
      module
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // --- ACTIONS ---

  // n8n Trigger simulation
  const handleTriggerWorkflow = (id: string) => {
    const wf = workflows.find((w) => w.id === id);
    if (!wf) return;
    if (!wf.isActive) {
      alert("This workflow is currently disabled. Please toggle it active to run.");
      return;
    }

    if (simulatingWorkflowId) return; // Prevent concurrent simulations

    setSimulatingWorkflowId(id);
    setSimulationStep(0);
    setSimulationLogs([`[0.0s] 🟢 Initiating execution trigger: ${wf.triggerName}`]);

    const stepMs = 600;

    // Simulation steps
    setTimeout(() => {
      setSimulationStep(1);
      setSimulationLogs((prev) => [...prev, `[0.6s] ⚡ Establishing connection to n8n Webhook Router: ${wf.webhookUrl}`]);
    }, stepMs);

    setTimeout(() => {
      setSimulationStep(2);
      setSimulationLogs((prev) => [
        ...prev,
        `[1.2s] 🤖 Checking execution parameters: ${JSON.stringify(wf.parameters)}`
      ]);
    }, stepMs * 2);

    setTimeout(() => {
      setSimulationStep(3);
      setSimulationLogs((prev) => [...prev, `[1.8s] 🚀 Connecting to target service: ${wf.actionName}`]);
    }, stepMs * 3);

    setTimeout(() => {
      setSimulationStep(4);
      const executionId = `exec-${Date.now().toString().slice(-4)}`;
      const nowStr = new Date().toISOString();
      
      setSimulationLogs((prev) => [...prev, `[2.4s] ✅ Success! Created execution record ${executionId}`]);

      // Update workflows state
      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === id
            ? { ...w, lastRunStatus: "Success", lastRunTime: nowStr }
            : w
        )
      );

      // Add to executions history
      const mockPayloads: Record<string, any> = {
        "wf-1": { parent: "Robert Vance", email: "vance@gmail.com", student: "Phyllis Vance", source: "Website Enquiry Form" },
        "wf-2": { title: "School Tour with Dwight", parent: "Dwight Schrute", guestCount: 2, calendarEvent: "Created" },
        "wf-3": { recipient: "jim.halpert@dundermifflin.com", status: "Delivered", packType: "Standard Preschool" },
        "wf-4": { receiverPhone: "+1 (555) 789-0123", amountDue: 350, template: "WhatsApp Term Fee Reminder v2" },
        "wf-5": { bdayChild: "Pam Beesly", age: 4, whatsappSent: true, bdayGreeting: "Happy Birthday Pam! 🎂🌸" },
        "wf-6": { platform: "Instagram", status: "Posted", mediaId: "ig_394857209", caption: "Fun day painting in classroom B! 🎨 #honeybees" },
        "wf-7": { destinationFolder: "Drive/Backups/2026", bytesUploaded: 128450, status: "Google Drive Upload Completed" },
        "wf-8": { boardReportMonth: "July 2026", newInquiriesCount: 12, balanceSurplus: 1420, recipient: "trustees@honeybeesplay.edu" },
        "wf-9": { parentName: "Angela Martin", reviewText: "The classroom ratio is perfectly managed. Extremely pleased.", sentimentScore: 0.95, priorityAlert: false }
      };

      const newExec = {
        id: executionId,
        workflowId: id,
        workflowName: wf.name,
        timestamp: nowStr,
        status: "Success",
        duration: "2.4s",
        payload: mockPayloads[id] || { status: "Ok", msg: "Simulated trigger payload executed successfully" }
      };

      setExecutions((prev) => [newExec, ...prev]);

      // Add to operations audit logs
      addAuditLog(`n8n workflow "${wf.name}" executed successfully. Trigger: ${wf.triggerName}`, "Automation", "success");

      setSimulatingWorkflowId(null);
    }, stepMs * 4);
  };

  // Toggle active/inactive
  const handleToggleWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const nextState = !w.isActive;
          addAuditLog(`n8n workflow "${w.name}" turned ${nextState ? "ON" : "OFF"}.`, "Automation", nextState ? "info" : "warning");
          return { ...w, isActive: nextState };
        }
        return w;
      })
    );
  };

  // Update parameters
  const handleUpdateParameter = (workflowId: string, paramKey: string, val: string) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === workflowId) {
          return {
            ...w,
            parameters: {
              ...w.parameters,
              [paramKey]: val
            }
          };
        }
        return w;
      })
    );
  };

  // AI Sentiment analysis helper
  const handleRunSentimentAnalysis = () => {
    if (!aiReviewText.trim()) return;
    setIsAnalyzingSentiment(true);
    setAiAnalysisResult(null);

    // Proxy or execute a mock sentiment model analysis based on Gemini API capabilities!
    // Since we want this to feel ultra-premium, we calculate sentiment based on keywords instantly
    setTimeout(() => {
      const text = aiReviewText.toLowerCase();
      let score = 0.5; // neutral
      
      const positiveWords = ["love", "great", "best", "happy", "wonderful", "phenomenal", "amazing", "care", "joyful", "pleased", "recommend", "perfect", "clean", "safe"];
      const negativeWords = ["bad", "poor", "slow", "chaotic", "loud", "frustrated", "rude", "dirty", "unhappy", "broke", "expensive", "hate", "scared", "messy"];

      let positives = 0;
      let negatives = 0;

      positiveWords.forEach(w => {
        if (text.includes(w)) positives++;
      });

      negativeWords.forEach(w => {
        if (text.includes(w)) negatives++;
      });

      if (positives > negatives) {
        score = 0.5 + (positives / (positives + negatives + 1)) * 0.5;
      } else if (negatives > positives) {
        score = 0.5 - (negatives / (positives + negatives + 1)) * 0.5;
      }

      // Bound
      score = Math.max(0.05, Math.min(0.98, score));
      score = Math.round(score * 100) / 100;

      let sentiment = "Neutral";
      let alertRaised = false;
      if (score >= 0.75) sentiment = "Positive";
      else if (score <= 0.4) {
        sentiment = "Critical / Negative";
        alertRaised = true;
      }

      setAiAnalysisResult({
        sentiment,
        score,
        alertRaised,
        analyzedAt: new Date().toISOString(),
        positivesCount: positives,
        negativesCount: negatives
      });

      if (alertRaised) {
        addAuditLog(`AI sentiment alert! Low score [${score}] detected in parent review: "${aiReviewText.slice(0, 30)}..."`, "AI Operations", "danger");
      } else {
        addAuditLog(`Processed parent review feedback sentiment. Result: ${sentiment} (${score})`, "AI Operations", "success");
      }

      setIsAnalyzingSentiment(false);
    }, 1000);
  };

  // Student list additions
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentParent, setNewStudentParent] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentProg, setNewStudentProg] = useState("Nursery");
  const [isAddingStudent, setIsAddingStudent] = useState(false);

  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentParent.trim() || !newStudentEmail.trim()) {
      alert("Please fill in all student enrollment fields.");
      return;
    }

    try {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newStudentName,
          parentName: newStudentParent,
          parentEmail: newStudentEmail,
          program: newStudentProg,
          dob: "2023-04-12"
        })
      });
      const data = await res.json();
      if (!data.error) {
        addAuditLog(`Enrolled new student ${newStudentName} into ${newStudentProg}.`, "Students", "success");
        setNewStudentName("");
        setNewStudentParent("");
        setNewStudentEmail("");
        setIsAddingStudent(false);
        fetchDbState();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Remove student
  const handleRemoveStudent = async (studentId: string, studentName: string) => {
    if (!confirm(`Are you sure you want to withdraw student ${studentName}?`)) return;
    try {
      const res = await fetch(`/api/admin/students/${studentId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!data.error) {
        addAuditLog(`Withdrew student ${studentName} from school system.`, "Students", "warning");
        fetchDbState();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Record Payment
  const [recordingPaymentId, setRecordingPaymentId] = useState<string | null>(null);

  const handleRecordPayment = async (studentId: string, term: string, amount: number) => {
    setRecordingPaymentId(studentId);
    // Simulate updating student fees in dbState
    try {
      // Find the student
      const studentObj = dbState.students.find(s => s.id === studentId);
      if (!studentObj) return;

      const updatedFees = studentObj.fees.map(f => {
        if (f.term === term) {
          return { ...f, status: "Paid" as const, paidDate: new Date().toISOString().split("T")[0] };
        }
        return f;
      });

      // Update student on server
      const res = await fetch(`/api/admin/students/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...studentObj,
          fees: updatedFees
        })
      });
      const data = await res.json();
      if (!data.error) {
        addAuditLog(`Recorded payment of $${amount} for student ${studentObj.name} for ${term}.`, "Fees", "success");
        fetchDbState();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRecordingPaymentId(null);
    }
  };

  // Staff Attendance Toggles
  const handleMarkStaffAttendance = (staffId: string, name: string, status: "Present" | "Absent" | "Late") => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, attendanceToday: status } : s))
    );
    addAuditLog(`Marked staff ${name} as ${status} for today.`, "Staff", "info");
  };

  // Payroll Disbursement
  const handleDisbursePayroll = (staffId: string, name: string, salary: number) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, isPaidThisMonth: true } : s))
    );
    // Auto-log payroll as expense
    const newExpense: Expense = {
      id: `exp-payroll-${Date.now()}`,
      title: `Payroll Disbursed: ${name}`,
      amount: salary,
      category: "Rent", // Standard salary out of fund
      date: new Date().toISOString().split("T")[0]
    };
    setExpenses((prev) => [newExpense, ...prev]);
    addAuditLog(`Disbursed salary of $${salary} to ${name}.`, "Finance", "success");
  };

  // Expense form state
  const [expTitle, setExpTitle] = useState("");
  const [expAmt, setExpAmt] = useState("");
  const [expCategory, setExpCategory] = useState<Expense["category"]>("Learning Materials");

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim() || !expAmt) return;
    const newExp: Expense = {
      id: `exp-${Date.now()}`,
      title: expTitle,
      amount: parseFloat(expAmt),
      category: expCategory,
      date: new Date().toISOString().split("T")[0]
    };
    setExpenses((prev) => [newExp, ...prev]);
    addAuditLog(`Logged operational expense: ${expTitle} ($${expAmt})`, "Finance", "info");
    setExpTitle("");
    setExpAmt("");
  };

  // Restock inventory
  const handleRestockItem = (itemId: string, name: string, cost: number = 150) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, qty: item.qty + 25, status: "In Stock" } : item
      )
    );
    // Log as expense
    const newExp: Expense = {
      id: `exp-restock-${Date.now()}`,
      title: `Inventory Restock: ${name} (x25)`,
      amount: cost,
      category: "Learning Materials",
      date: new Date().toISOString().split("T")[0]
    };
    setExpenses((prev) => [newExp, ...prev]);
    addAuditLog(`Restocked inventory item ${name} (+25 qty) for $${cost}.`, "Inventory", "success");
  };

  // CCTV Toggles
  const handleToggleCamera = (camId: string, name: string, current: string) => {
    const nextStatus = current === "ONLINE" ? "OFFLINE" : "ONLINE";
    setCctvCameras((prev) =>
      prev.map((c) => (c.id === camId ? { ...c, status: nextStatus } : c))
    );
    addAuditLog(`CCTV Feed ${name} set to ${nextStatus}.`, "CCTV Security", nextStatus === "ONLINE" ? "info" : "warning");
  };

  // Visitor check-in states
  const [visName, setVisName] = useState("");
  const [visPhone, setVisPhone] = useState("");
  const [visPurpose, setVisPurpose] = useState("");

  const handleCheckInVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visName.trim() || !visPurpose.trim()) return;
    const newVis: Visitor = {
      id: `vis-${Date.now()}`,
      name: visName,
      purpose: visPurpose,
      phone: visPhone || "N/A",
      checkIn: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "Active"
    };
    setVisitors((prev) => [newVis, ...prev]);
    addAuditLog(`Visitor ${visName} checked into preschool lobby.`, "Visitors", "success");
    setVisName("");
    setVisPhone("");
    setVisPurpose("");
  };

  const handleCheckOutVisitor = (id: string, name: string) => {
    setVisitors((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status: "Checked Out",
              checkOut: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            }
          : v
      )
    );
    addAuditLog(`Visitor ${name} checked out of preschool.`, "Visitors", "info");
  };

  // Emergency triggers
  const triggerEmergency = (type: "fire" | "medical" | "security") => {
    const timeStr = new Date().toLocaleTimeString();
    setEmergencyAlert({ active: true, type, triggeredAt: timeStr });
    addAuditLog(`CRITICAL EMERGENCY ALERT TRIGGERED: [${type.toUpperCase()}] at ${timeStr}. Evacuation protocols active.`, "Safety", "danger");
  };

  const resolveEmergency = () => {
    setEmergencyAlert({ active: false, type: null, triggeredAt: null });
    addAuditLog(`Emergency alert cleared. All building grids returned to safe operations.`, "Safety", "success");
  };

  // Backup & Restore Simulation
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleCreateBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      const snapId = `backup-${Date.now()}`;
      const snap = {
        id: snapId,
        timestamp: new Date().toLocaleString(),
        studentsCount: dbState.students.length,
        staffListSnapshot: staffList,
        expensesSnapshot: expenses,
        inventorySnapshot: inventory,
        visitorsSnapshot: visitors,
        auditLogsSnapshot: auditLogs
      };
      setBackups((prev) => [snap, ...prev]);
      addAuditLog(`Full system backup snapshot created. ID: ${snapId}`, "Backup & Restore", "success");
      setIsBackingUp(false);
    }, 1500);
  };

  const handleRestoreBackup = (backupId: string, stamp: string) => {
    if (!confirm(`Are you sure you want to restore system state to ${stamp}? This will replace current operations database.`)) return;
    setIsRestoring(true);
    setTimeout(() => {
      const target = backups.find((b) => b.id === backupId);
      if (target) {
        if (target.staffListSnapshot) setStaffList(target.staffListSnapshot);
        if (target.expensesSnapshot) setExpenses(target.expensesSnapshot);
        if (target.inventorySnapshot) setInventory(target.inventorySnapshot);
        if (target.visitorsSnapshot) setVisitors(target.visitorsSnapshot);
        if (target.auditLogsSnapshot) setAuditLogs(target.auditLogsSnapshot);
        addAuditLog(`System restored successfully to checkpoint: ${stamp}`, "Backup & Restore", "success");
      }
      setIsRestoring(false);
    }, 1500);
  };

  // Export database backup as standard client JSON file
  const handleDownloadBackupJSON = (backup: any) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `honeybees_operations_backup_${backup.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addAuditLog(`Exported JSON configuration file for backup checkpoint ${backup.id}.`, "Backup & Restore", "info");
  };

  // Calculate high fidelity figures
  const totalStudents = dbState.students.length;
  const capacityMax = 50;
  const occupancyPercentage = Math.round((totalStudents / capacityMax) * 100);

  // Student class distributions
  const playGroupStudents = dbState.students.filter(s => s.program.toLowerCase() === "play group" || s.program.toLowerCase() === "playgroup").length;
  const nurseryStudents = dbState.students.filter(s => s.program.toLowerCase() === "nursery").length;
  const lkgStudents = dbState.students.filter(s => s.program.toLowerCase() === "lkg").length;
  const otherStudents = totalStudents - playGroupStudents - nurseryStudents - lkgStudents;

  // Fee statistics
  const totalTargetFees = dbState.students.reduce((sum, stud) => sum + stud.fees.reduce((s, f) => s + f.amount, 0), 0);
  const totalPaidFees = dbState.students.reduce((sum, stud) => sum + stud.fees.reduce((s, f) => s + (f.status === "Paid" ? f.amount : 0), 0), 0);
  const outstandingFees = totalTargetFees - totalPaidFees;

  // Ledger stats
  const totalExpensesLogged = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalDesignatedPayroll = staffList.reduce((sum, s) => sum + s.salary, 0);
  const netSurplus = totalPaidFees - totalExpensesLogged;

  return (
    <div className="space-y-6">
      {/* 11. EMERGENCY SIREN BANNER */}
      <AnimatePresence>
        {emergencyAlert.active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-rose-600 text-white rounded-2xl border-2 border-rose-500 overflow-hidden shadow-lg shadow-rose-600/30 relative"
          >
            <div className="bg-rose-700/60 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
              <div className="flex items-center gap-3.5">
                <div className="bg-white text-rose-600 p-3 rounded-full animate-bounce">
                  <Flame size={24} className="stroke-[3]" />
                </div>
                <div>
                  <span className="bg-white/20 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full block w-max">
                    🚨 Active Building Alarm
                  </span>
                  <h4 className="font-display font-black text-lg text-white mt-1 uppercase">
                    Preschool Incident Zone: [{emergencyAlert.type}] alert triggered
                  </h4>
                  <p className="text-xs text-rose-100 mt-0.5">
                    Triggered at {emergencyAlert.triggeredAt}. Automated campus evacuation grids and fire emergency dispatches are active.
                  </p>
                </div>
              </div>
              <button
                onClick={resolveEmergency}
                className="bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-800 text-xs font-black px-6 py-2.5 rounded-xl shadow-md transition-all shrink-0 cursor-pointer uppercase tracking-wider"
              >
                Resolve Incident & Clear Alarms
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl pointer-events-none font-black font-display leading-none select-none">
          OPS
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-slate-900 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md">
              ADMINISTRATIVE GRID
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-slate-400 font-mono">Operations Module v2.4</span>
          </div>
          <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
            ⚙️ Honey Bees Integrated Operations Center
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl">
            Live operations, financial ledger audits, staffing registers, and building security grids for Lawsons Bay Colony.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-800 border border-slate-700/80 p-1.5 rounded-2xl gap-1.5 self-start md:self-center">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "overview" ? "bg-yellow-400 text-slate-950 shadow-sm font-black" : "text-slate-400 hover:text-white"
            }`}
          >
            📊 Analytics & Funnel
          </button>
          <button
            onClick={() => setActiveTab("finance")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "finance" ? "bg-yellow-400 text-slate-950 shadow-sm font-black" : "text-slate-400 hover:text-white"
            }`}
          >
            💼 Staff & Finance
          </button>
          <button
            onClick={() => setActiveTab("logistics")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "logistics" ? "bg-yellow-400 text-slate-950 shadow-sm font-black" : "text-slate-400 hover:text-white"
            }`}
          >
            📦 Safety & Logistics
          </button>
          <button
            onClick={() => setActiveTab("system")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "system" ? "bg-yellow-400 text-slate-950 shadow-sm font-black" : "text-slate-400 hover:text-white"
            }`}
          >
            🛡️ Console & Logs
          </button>
          <button
            onClick={() => setActiveTab("automation")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "automation" ? "bg-yellow-400 text-slate-950 shadow-sm font-black" : "text-slate-400 hover:text-white"
            }`}
          >
            ⚡ Automation (n8n)
          </button>
        </div>
      </div>

      {/* Primary Sub-panel Router */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          {/* ============================================== */}
          {/* TAB 1: OVERVIEW & PIPELINE ANALYTICS */}
          {/* ============================================== */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Top Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. REAL-TIME STUDENT COUNT */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                        Real-Time Enrolled
                      </span>
                      <h3 className="text-3xl font-display font-black text-slate-900 mt-1">{totalStudents}</h3>
                    </div>
                    <div className="bg-yellow-100 text-yellow-800 p-2.5 rounded-xl"><Users size={18} /></div>
                  </div>
                  <div className="space-y-1 text-[10px] text-slate-500 font-mono mt-3 pt-3 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span>Nursery:</span> <strong className="text-slate-800 font-bold">{nurseryStudents}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Play Group:</span> <strong className="text-slate-800 font-bold">{playGroupStudents}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>LKG:</span> <strong className="text-slate-800 font-bold">{lkgStudents}</strong>
                    </div>
                  </div>
                </div>

                {/* 3. OCCUPANCY PERCENTAGE */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                        Campus Occupancy
                      </span>
                      <h3 className="text-3xl font-display font-black text-slate-900 mt-1">{occupancyPercentage}%</h3>
                    </div>
                    <div className="bg-indigo-100 text-indigo-800 p-2.5 rounded-xl"><Activity size={18} /></div>
                  </div>

                  {/* Circular/Line Visual representation */}
                  <div className="space-y-1.5 mt-2">
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${occupancyPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Cap: {totalStudents}/50 Pupils</span>
                      <span>{50 - totalStudents} slots free</span>
                    </div>
                  </div>
                </div>

                {/* 2. FEE TARGET ANALYTICS */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                        Term Paid Fees
                      </span>
                      <h3 className="text-3xl font-display font-black text-emerald-600 mt-1">${totalPaidFees}</h3>
                    </div>
                    <div className="bg-emerald-100 text-emerald-800 p-2.5 rounded-xl"><CreditCard size={18} /></div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                    <span>Outstanding:</span>
                    <strong className="text-rose-500 font-bold">${outstandingFees}</strong>
                  </div>
                </div>

                {/* REVENUE TO LEDGER SURPLUS */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                        Total Net Surplus
                      </span>
                      <h3 className={`text-3xl font-display font-black mt-1 ${netSurplus >= 0 ? "text-indigo-600" : "text-rose-600"}`}>
                        ${netSurplus}
                      </h3>
                    </div>
                    <div className="bg-purple-100 text-purple-800 p-2.5 rounded-xl"><TrendingUp size={18} /></div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                    <span>Expenses Logged:</span>
                    <strong className="text-slate-800 font-bold">${totalExpensesLogged}</strong>
                  </div>
                </div>
              </div>

              {/* Admissions & Fees Row */}
              <div className="grid lg:grid-cols-12 gap-6">
                {/* 4. ADMISSIONS FUNNEL METRIC PANEL */}
                <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm lg:col-span-7 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-display font-bold text-slate-900 text-base">
                        📝 CRM Admissions Funnel & Pipeline Control
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        Visualizing active leads as they advance from Inquiry, Tour, Approval, to Enrollment.
                      </p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                      {dbState.admissions.length} active leads
                    </span>
                  </div>

                  {/* Funnel pipeline layout */}
                  <div className="grid grid-cols-5 gap-1 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-center text-[10px] font-mono font-bold">
                    {[
                      { key: "New", label: "1. New Inquiries", bg: "bg-blue-500/10 text-blue-600 border border-blue-200" },
                      { key: "Contacted", label: "2. Contacted", bg: "bg-indigo-500/10 text-indigo-600 border border-indigo-200" },
                      { key: "Tour Scheduled", label: "3. Scheduled", bg: "bg-orange-500/10 text-orange-600 border border-orange-200" },
                      { key: "Approved", label: "4. Approved", bg: "bg-emerald-500/10 text-emerald-600 border border-emerald-200" },
                      { key: "Enrolled", label: "5. Enrolled", bg: "bg-teal-500/10 text-teal-600 border border-teal-200" }
                    ].map((step) => {
                      const count = dbState.admissions.filter(a => a.status === step.key).length;
                      return (
                        <div key={step.key} className={`p-2 rounded-xl flex flex-col justify-between h-14 ${step.bg}`}>
                          <span className="block text-[8px] uppercase tracking-wider truncate">{step.label}</span>
                          <span className="block text-sm font-black mt-1">{count}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Active Admissions Control List */}
                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {dbState.admissions.map((adm) => (
                      <div key={adm.id} className="bg-slate-50 border border-slate-150 p-3 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-slate-850 text-sm font-bold">{adm.childName}</strong>
                            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono uppercase">
                              {adm.program}
                            </span>
                          </div>
                          <p className="text-slate-500 text-[11px] mt-0.5">Parent: {adm.parentName} • Contact: {adm.phone}</p>
                        </div>

                        {/* Dropdown status update */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 uppercase font-bold font-mono">Pipeline Status:</span>
                          <select
                            value={adm.status}
                            onChange={(e) => {
                              onUpdateAdmissionStatus(adm.id, e.target.value);
                              addAuditLog(`Updated ${adm.childName}'s admission status to: ${e.target.value}`, "Admissions", "info");
                            }}
                            className="bg-white border border-slate-200 rounded-lg p-1.5 font-sans font-bold text-[10px] shadow-xs cursor-pointer focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Tour Scheduled">Tour Scheduled</option>
                            <option value="Approved">Approved</option>
                            <option value="Enrolled">Enrolled</option>
                            <option value="Declined">Declined</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. FEES PAYMENT MANAGER PANEL */}
                <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm lg:col-span-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-display font-bold text-slate-900 text-base">
                        💳 Student Tuition Fees Register
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        Record paid fees, disburse pending alerts, and audit pending balances.
                      </p>
                    </div>
                  </div>

                  {/* Student Fee List */}
                  <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                    {dbState.students.map((student) => (
                      <div key={student.id} className="bg-slate-50 border border-slate-150 p-3 rounded-xl space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <strong className="text-slate-850 font-bold">{student.name}</strong>
                          <span className="text-[10px] text-slate-500 italic font-mono">{student.program}</span>
                        </div>

                        <div className="space-y-1.5">
                          {student.fees.map((fee) => (
                            <div key={fee.term} className="flex justify-between items-center bg-white border border-slate-100 p-2 rounded-lg text-[11px]">
                              <div>
                                <span className="font-bold text-slate-700 block text-[10px] truncate max-w-[150px]">{fee.term}</span>
                                <span className="text-slate-400 font-mono text-[9px]">Due: {fee.dueDate}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="font-mono text-slate-850 font-black">${fee.amount}</span>
                                {fee.status === "Paid" ? (
                                  <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-0.5">
                                    <Check size={8} className="stroke-[3]" /> Paid
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleRecordPayment(student.id, fee.term, fee.amount)}
                                    disabled={recordingPaymentId === student.id}
                                    className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-black text-[9px] uppercase px-2 py-1 rounded-md transition-all shadow-xs cursor-pointer flex items-center gap-1"
                                  >
                                    {recordingPaymentId === student.id ? "Syncing..." : "Record Pay"}
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pupils enrollment console */}
              <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-display font-bold text-slate-900 text-base">👦 Real-Time Student Enrollment Control Console</h4>
                    <p className="text-[10px] text-slate-500">Directly withdraw or enroll student records into the central campus database.</p>
                  </div>
                  <button
                    onClick={() => setIsAddingStudent(!isAddingStudent)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 text-xs font-black px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} className="stroke-[3]" /> {isAddingStudent ? "Close Form" : "Enroll New Pupil"}
                  </button>
                </div>

                {isAddingStudent && (
                  <motion.form
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    onSubmit={handleEnrollStudent}
                    className="bg-slate-50 border border-slate-250 p-4 rounded-2xl grid md:grid-cols-4 gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <label className="text-slate-500 font-bold uppercase text-[9px]">Student Name</label>
                      <input
                        type="text"
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        placeholder="e.g. Liam Parker"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-500 font-bold uppercase text-[9px]">Parent Name</label>
                      <input
                        type="text"
                        value={newStudentParent}
                        onChange={(e) => setNewStudentParent(e.target.value)}
                        placeholder="e.g. Sarah Parker"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-500 font-bold uppercase text-[9px]">Parent Email</label>
                      <input
                        type="email"
                        value={newStudentEmail}
                        onChange={(e) => setNewStudentEmail(e.target.value)}
                        placeholder="e.g. sarah@example.com"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-500 font-bold uppercase text-[9px]">Program Class</label>
                      <select
                        value={newStudentProg}
                        onChange={(e) => setNewStudentProg(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                      >
                        <option value="Play Group">Play Group</option>
                        <option value="Nursery">Nursery</option>
                        <option value="LKG">LKG</option>
                        <option value="UKG">UKG</option>
                        <option value="Daycare">Daycare</option>
                      </select>
                    </div>
                    <div className="md:col-span-4 flex justify-end">
                      <button
                        type="submit"
                        className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-6 py-2 rounded-xl transition-colors cursor-pointer"
                      >
                        Confirm Enrollment
                      </button>
                    </div>
                  </motion.form>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dbState.students.map((stud) => (
                    <div key={stud.id} className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex justify-between items-center text-xs">
                      <div>
                        <h5 className="font-bold text-slate-850 text-sm">{stud.name}</h5>
                        <p className="text-slate-400 mt-0.5 text-[10px]">Program: <strong className="text-slate-600 font-bold font-mono">{stud.program}</strong></p>
                        <p className="text-slate-400 text-[10px]">Parent: {stud.parentName}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveStudent(stud.id, stud.name)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 p-2 rounded-xl border border-rose-100 transition-all cursor-pointer"
                        title="Withdraw Student"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================== */}
          {/* TAB 2: STAFF & FINANCE */}
          {/* ============================================== */}
          {activeTab === "finance" && (
            <div className="grid lg:grid-cols-12 gap-6">
              {/* 5. STAFF ATTENDANCE TRACKER */}
              <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm lg:col-span-7 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-display font-bold text-slate-900 text-base">
                      👥 Staff Attendance & Duty Grid
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Manage early childhood educators, caregivers, safety officers, and mark daily attendance.
                    </p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {Math.round((staffList.filter(s => s.attendanceToday === "Present" || s.attendanceToday === "Late").length / staffList.length) * 100)}% active today
                  </span>
                </div>

                <div className="space-y-3">
                  {staffList.map((staff) => (
                    <div key={staff.id} className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                      <div>
                        <h5 className="font-bold text-slate-850 text-sm">{staff.name}</h5>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold font-mono mt-0.5 inline-block">
                          {staff.role}
                        </span>
                        <p className="text-slate-400 text-[10px] mt-1">Mobile: {staff.phone}</p>
                      </div>

                      {/* Attendance toggles */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase mr-1">Today:</span>
                        <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-1">
                          {(["Present", "Late", "Absent"] as const).map((st) => {
                            const statusColors = {
                              Present: "bg-emerald-500 text-white shadow-xs font-black",
                              Late: "bg-amber-500 text-white shadow-xs font-black",
                              Absent: "bg-rose-500 text-white shadow-xs font-black"
                            };
                            const isCurrent = staff.attendanceToday === st;
                            return (
                              <button
                                key={st}
                                onClick={() => handleMarkStaffAttendance(staff.id, staff.name, st)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                  isCurrent ? statusColors[st] : "text-slate-600 hover:bg-slate-50"
                                }`}
                              >
                                {st}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. PAYROLL DISBURSEMENT SYSTEM */}
              <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm lg:col-span-5 space-y-4">
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-base">
                    💳 Faculty Salary & Payroll Engine
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Process monthly school pay dispatches and record outbound payroll costs.
                  </p>
                </div>

                <div className="space-y-3">
                  {staffList.map((staff) => (
                    <div key={staff.id} className="bg-slate-50 border border-slate-150 p-3 rounded-xl flex justify-between items-center text-xs">
                      <div className="space-y-0.5">
                        <strong className="text-slate-850 font-bold block">{staff.name}</strong>
                        <span className="text-[9px] font-mono text-slate-400">Salary: ${staff.salary}/month</span>
                      </div>

                      {staff.isPaidThisMonth ? (
                        <span className="bg-emerald-50 border border-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-0.5">
                          <Check size={11} className="stroke-[3]" /> Disbursed
                        </span>
                      ) : (
                        <button
                          onClick={() => handleDisbursePayroll(staff.id, staff.name, staff.salary)}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          Disburse Pay
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 text-xs">
                  <div className="flex justify-between font-mono">
                    <span>Total Monthly Payroll:</span>
                    <strong className="font-black text-yellow-400">${totalDesignatedPayroll}</strong>
                  </div>
                  <div className="flex justify-between font-mono mt-1 text-slate-400 text-[11px]">
                    <span>Pending Disburse:</span>
                    <span>${staffList.filter(s => !s.isPaidThisMonth).reduce((sum, s) => sum + s.salary, 0)}</span>
                  </div>
                </div>
              </div>

              {/* 6. EXPENSE TRACKER */}
              <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm lg:col-span-12 grid md:grid-cols-12 gap-6">
                {/* Log Expense Form */}
                <div className="md:col-span-4 space-y-4">
                  <div>
                    <h4 className="font-display font-bold text-slate-900 text-base">
                      💰 Record Operational Outflow
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Submit utility costs, classroom sanitization charges, and toy supplies.
                    </p>
                  </div>

                  <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-slate-500 font-bold uppercase text-[9px]">Expense Title</label>
                      <input
                        type="text"
                        value={expTitle}
                        onChange={(e) => setExpTitle(e.target.value)}
                        placeholder="e.g. Sensory Splash Pool Filters"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold uppercase text-[9px]">Amount ($)</label>
                        <input
                          type="number"
                          value={expAmt}
                          onChange={(e) => setExpAmt(e.target.value)}
                          placeholder="e.g. 150"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold uppercase text-[9px]">Category</label>
                        <select
                          value={expCategory}
                          onChange={(e) => setExpCategory(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                        >
                          <option value="Learning Materials">Toys & Learning</option>
                          <option value="Food & Snacks">Food & Catering</option>
                          <option value="Utilities">Utilities & Net</option>
                          <option value="CCTV Maintenance">CCTV Guard</option>
                          <option value="Rent">Campus Rent</option>
                          <option value="Other">Other Miscellaneous</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-2.5 rounded-xl transition-colors cursor-pointer text-xs uppercase tracking-wider"
                    >
                      Record Operational Outflow
                    </button>
                  </form>
                </div>

                {/* Ledger list */}
                <div className="md:col-span-8 space-y-4">
                  <div className="flex justify-between items-center">
                    <h5 className="font-display font-bold text-slate-900 text-sm">Outflow General Ledger</h5>
                    <span className="text-[10px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 font-bold">
                      Total Costs: ${totalExpensesLogged}
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {expenses.map((exp) => (
                      <div key={exp.id} className="bg-slate-50 border border-slate-150 p-3 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <strong className="text-slate-850 font-bold block">{exp.title}</strong>
                          <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono uppercase mt-1 inline-block">
                            {exp.category}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-rose-600 font-black block">-${exp.amount}</span>
                          <span className="text-[9px] text-slate-400 font-mono block">{exp.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================== */}
          {/* TAB 3: SAFETY & LOGISTICS */}
          {/* ============================================== */}
          {activeTab === "logistics" && (
            <div className="grid lg:grid-cols-12 gap-6">
              {/* 8. INVENTORY REGISTER */}
              <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm lg:col-span-6 space-y-4">
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-base">
                    📦 Preschool Inventory Stock Register
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Track vital items (sanitizer, crayons, diapers, safety kits) with automatic low-stock triggers.
                  </p>
                </div>

                <div className="space-y-3">
                  {inventory.map((item) => {
                    const statusStyles = {
                      "In Stock": "bg-emerald-50 text-emerald-700 border-emerald-100",
                      "Low Stock": "bg-amber-50 text-amber-700 border-amber-100",
                      "Out of Stock": "bg-rose-50 text-rose-700 border-rose-100"
                    };
                    const isAlert = item.qty <= item.minThreshold;
                    const computedStatus = item.qty === 0 ? "Out of Stock" : isAlert ? "Low Stock" : "In Stock";

                    return (
                      <div key={item.id} className="bg-slate-50 border border-slate-150 p-3 rounded-2xl flex justify-between items-center text-xs">
                        <div>
                          <strong className="text-slate-850 font-bold block">{item.name}</strong>
                          <div className="flex gap-2 items-center mt-1">
                            <span className="text-slate-500 text-[10px]">
                              Qty: <strong className="text-slate-850">{item.qty} {item.unit}</strong>
                            </span>
                            <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${statusStyles[computedStatus]}`}>
                              {computedStatus}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRestockItem(item.id, item.name)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black text-[9px] uppercase px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Package size={11} /> Restock (+$150)
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 9. CCTV STREAM GRIDS */}
              <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm lg:col-span-6 space-y-4">
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-base">
                    📹 SafeClass Secure CCTV Camera Hub
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Simulate and trigger maintenance for building camera installations inVisakhapatnam.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  {cctvCameras.map((cam) => {
                    const isOnline = cam.status === "ONLINE";
                    return (
                      <div key={cam.id} className="bg-slate-950 text-white rounded-2xl overflow-hidden p-3 border border-slate-800 relative group aspect-video flex flex-col justify-between">
                        <div className="absolute inset-0 bg-slate-900/60 pointer-events-none" />

                        <div className="flex justify-between items-start z-10">
                          <span className="text-[9px] bg-black/60 px-1.5 py-0.5 rounded font-mono text-slate-300 tracking-wider">
                            {cam.location}
                          </span>
                          <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? "bg-emerald-400 animate-pulse" : "bg-rose-500"}`} />
                        </div>

                        {/* Camera feedback screen view */}
                        <div className="text-center py-2 z-10 flex flex-col items-center justify-center">
                          {isOnline ? (
                            <>
                              <span className="text-2xl animate-pulse">🧸🎪</span>
                              <span className="text-[8px] text-slate-400 mt-1 block font-mono">{cam.fps} FPS // FEED OK</span>
                            </>
                          ) : (
                            <>
                              <span className="text-2xl">⚠️</span>
                              <span className="text-[8px] text-rose-400 mt-1 block font-mono">FEED INTERRUPTION</span>
                            </>
                          )}
                        </div>

                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-800/80 z-10 text-[9px]">
                          <span className="text-slate-400 font-semibold max-w-[90px] truncate">{cam.name}</span>
                          <button
                            onClick={() => handleToggleCamera(cam.id, cam.name, cam.status)}
                            className="text-yellow-400 font-bold hover:underline cursor-pointer"
                          >
                            {isOnline ? "Cut Feed" : "Go Live"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 10. VISITOR MANAGEMENT REGISTRY */}
              <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm lg:col-span-12 grid md:grid-cols-12 gap-6">
                <div className="md:col-span-4 space-y-4">
                  <div>
                    <h4 className="font-display font-bold text-slate-900 text-base">
                      👤 Security Digital Lobby Guestbook
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Instantly record and audit contractors, delivery partners, and parents entering building.
                    </p>
                  </div>

                  <form onSubmit={handleCheckInVisitor} className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-slate-500 font-bold uppercase text-[9px]">Guest Full Name</label>
                      <input
                        type="text"
                        value={visName}
                        onChange={(e) => setVisName(e.target.value)}
                        placeholder="e.g. Sarah Connor"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500 font-bold uppercase text-[9px]">Mobile Phone</label>
                      <input
                        type="text"
                        value={visPhone}
                        onChange={(e) => setVisPhone(e.target.value)}
                        placeholder="e.g. +1 (555) 901-2345"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500 font-bold uppercase text-[9px]">Purpose of Visit</label>
                      <input
                        type="text"
                        value={visPurpose}
                        onChange={(e) => setVisPurpose(e.target.value)}
                        placeholder="e.g. Pest control service"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-2.5 rounded-xl transition-colors cursor-pointer text-xs uppercase tracking-wider"
                    >
                      Check-In Guest
                    </button>
                  </form>
                </div>

                <div className="md:col-span-8 space-y-4">
                  <h5 className="font-display font-bold text-slate-900 text-sm">Security Entry Ledger</h5>

                  <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                    {visitors.map((v) => (
                      <div key={v.id} className="bg-slate-50 border border-slate-150 p-3 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-slate-850 font-bold text-sm">{v.name}</strong>
                            <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md ${v.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-200 text-slate-600"}`}>
                              {v.status}
                            </span>
                          </div>
                          <p className="text-slate-500 text-[11px] mt-1">Purpose: {v.purpose} • Phone: {v.phone}</p>
                        </div>

                        <div className="text-right flex items-center gap-3">
                          <div className="text-[10px] font-mono text-slate-400">
                            <span>In: {v.checkIn}</span>
                            {v.checkOut && <span className="block">Out: {v.checkOut}</span>}
                          </div>
                          {v.status === "Active" && (
                            <button
                              onClick={() => handleCheckOutVisitor(v.id, v.name)}
                              className="bg-slate-900 hover:bg-slate-800 text-white font-black text-[9px] uppercase px-2 py-1 rounded-md transition-colors cursor-pointer"
                            >
                              Check Out
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================== */}
          {/* TAB 4: SYSTEM CONSOLE, BACKUPS & AUDITS */}
          {/* ============================================== */}
          {activeTab === "system" && (
            <div className="grid lg:grid-cols-12 gap-6">
              {/* 11. EMERGENCY SIREN ACTIVATOR */}
              <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm lg:col-span-12 space-y-4">
                <div>
                  <h4 className="font-display font-bold text-rose-600 text-base">
                    🚨 Preschool Panic Siren Control Console
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Instantly broadcast building emergency alerts, lock physical doors, and dispatch emergency responders.
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => triggerEmergency("fire")}
                    className="bg-rose-500 hover:bg-rose-600 text-white rounded-2xl p-4 transition-all shadow-md shadow-rose-500/10 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer"
                  >
                    <Flame size={24} className="animate-bounce" />
                    <strong className="text-sm block">1. Fire & Smoke Alarm</strong>
                    <span className="text-[10px] text-rose-100">Activate sirens & evacuation dispatches</span>
                  </button>

                  <button
                    onClick={() => triggerEmergency("medical")}
                    className="bg-amber-500 hover:bg-amber-600 text-white rounded-2xl p-4 transition-all shadow-md shadow-amber-500/10 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer"
                  >
                    <Heart size={24} className="animate-pulse" />
                    <strong className="text-sm block">2. Pediatric Medical Alert</strong>
                    <span className="text-[10px] text-amber-100">Dispatch on-site first-aid & paramedics</span>
                  </button>

                  <button
                    onClick={() => triggerEmergency("security")}
                    className="bg-slate-900 hover:bg-slate-850 text-white rounded-2xl p-4 transition-all shadow-md flex flex-col items-center justify-center text-center space-y-2 cursor-pointer border border-slate-800"
                  >
                    <ShieldAlert size={24} className="animate-pulse text-yellow-400" />
                    <strong className="text-sm block">3. Safety Door Lockout</strong>
                    <span className="text-[10px] text-slate-400">Lock down gates & secure playrooms</span>
                  </button>
                </div>
              </div>

              {/* 12. BACKUP & SYSTEM RESTORE */}
              <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm lg:col-span-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-display font-bold text-slate-900 text-base">
                      💾 System Backups & Recovery Gateway
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Snapshots contain student counts, payroll dispatches, ledger records, and guest books.
                    </p>
                  </div>
                  <button
                    onClick={handleCreateBackup}
                    disabled={isBackingUp}
                    className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-black px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <Database size={13} /> {isBackingUp ? "Backing up..." : "Create Backup"}
                  </button>
                </div>

                <div className="space-y-3">
                  {backups.map((bk) => (
                    <div key={bk.id} className="bg-slate-50 border border-slate-150 p-3 rounded-xl flex justify-between items-center text-xs">
                      <div className="space-y-1">
                        <strong className="text-slate-850 font-bold block">{bk.timestamp}</strong>
                        <span className="text-[9px] text-slate-400 block font-mono">ID: {bk.id} • Pupils Count: {bk.studentsCount}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownloadBackupJSON(bk)}
                          className="bg-slate-200 hover:bg-slate-350 text-slate-700 p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Export JSON"
                        >
                          <Download size={13} />
                        </button>
                        <button
                          onClick={() => handleRestoreBackup(bk.id, bk.timestamp)}
                          disabled={isRestoring}
                          className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black text-[9px] uppercase px-2.5 py-1.5 rounded-md transition-colors cursor-pointer"
                        >
                          {isRestoring ? "Restoring..." : "Restore"}
                        </button>
                      </div>
                    </div>
                  ))}

                  {backups.length === 0 && (
                    <div className="text-center py-8 text-slate-400 italic">
                      No automated database checkpoints generated yet.
                    </div>
                  )}
                </div>
              </div>

              {/* 13. CENTRAL TAMPER-PROOF AUDIT LOGS */}
              <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm lg:col-span-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-display font-bold text-slate-900 text-base">
                      📡 Audit Activity Logs & Telemetry
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Live audit logging of all administrative and system operations.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setAuditLogs([{ id: "log-init", timestamp: new Date().toISOString(), level: "success", message: "Audit logs cache cleared.", module: "System" }]);
                    }}
                    className="text-rose-600 text-[10px] font-black hover:underline cursor-pointer uppercase"
                  >
                    Clear Cache
                  </button>
                </div>

                <div className="bg-slate-950 rounded-2xl p-4 border border-slate-900 font-mono text-[10px] text-slate-400 space-y-2 max-h-[220px] overflow-y-auto">
                  {auditLogs.map((log) => {
                    const badgeColors = {
                      info: "text-blue-400",
                      success: "text-emerald-400",
                      warning: "text-amber-400",
                      danger: "text-rose-500 font-bold"
                    };

                    return (
                      <div key={log.id} className="flex gap-2 items-start border-b border-slate-900 pb-1.5 leading-normal">
                        <span className="text-slate-600 shrink-0 select-none">❯</span>
                        <div className="space-y-0.5">
                          <div className="flex gap-2 items-center">
                            <span className="text-slate-500">
                              [{new Date(log.timestamp).toLocaleTimeString()}]
                            </span>
                            <span className={`uppercase font-bold ${badgeColors[log.level]}`}>
                              {log.module}
                            </span>
                          </div>
                          <span className="text-slate-300 block">{log.message}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "automation" && (
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Left Column: n8n Workflow Configurator */}
              <div className="lg:col-span-6 space-y-6">
                <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-display font-bold text-slate-900 text-base">
                        ⚡ Active n8n Automation Workflows
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        Configure webhook triggers, adjust target parameters, and manually test pipeline dispatches.
                      </p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {workflows.filter(w => w.isActive).length} / {workflows.length} Active
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {workflows.map((wf) => {
                      const isSelected = selectedWorkflowId === wf.id;
                      const isSimulating = simulatingWorkflowId === wf.id;

                      return (
                        <div
                          key={wf.id}
                          className={`p-3.5 rounded-2xl border transition-all text-xs flex flex-col gap-3 ${
                            isSelected
                              ? "bg-yellow-50/50 border-yellow-300/60 shadow-xs"
                              : "bg-slate-50 border-slate-150 hover:bg-slate-100/70"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1 min-w-0 cursor-pointer flex-1" onClick={() => setSelectedWorkflowId(wf.id)}>
                              <div className="flex items-center gap-2">
                                <strong className="text-slate-850 font-bold text-sm block truncate">
                                  {wf.name}
                                </strong>
                                <span className="bg-slate-200 text-slate-600 text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-md font-mono shrink-0">
                                  {wf.category}
                                </span>
                              </div>
                              <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">
                                {wf.description}
                              </p>
                            </div>

                            <div className="flex items-center gap-2.5 shrink-0">
                              {/* Active/Inactive Toggle */}
                              <label className="relative inline-flex items-center cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={wf.isActive}
                                  onChange={() => handleToggleWorkflow(wf.id)}
                                  className="sr-only peer"
                                />
                                <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:height-3 after:h-3 after:w-3 after:transition-all peer-checked:bg-yellow-400"></div>
                              </label>

                              {/* Manual Run trigger button */}
                              <button
                                onClick={() => handleTriggerWorkflow(wf.id)}
                                disabled={!!simulatingWorkflowId || !wf.isActive}
                                className={`p-2 rounded-xl border font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                  isSimulating
                                    ? "bg-slate-100 border-slate-200 text-slate-400 animate-pulse"
                                    : wf.isActive
                                    ? "bg-slate-900 hover:bg-slate-800 text-white border-slate-900 shadow-sm"
                                    : "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed"
                                }`}
                                title={wf.isActive ? "Test trigger workflow" : "Activate first to run"}
                              >
                                <Play size={10} className="fill-current" />
                              </button>
                            </div>
                          </div>

                          {/* Selected workflow settings expansion */}
                          {isSelected && (
                            <div className="pt-2.5 border-t border-slate-200/60 grid sm:grid-cols-12 gap-3 bg-white/70 p-3 rounded-xl border border-slate-150/50">
                              <div className="sm:col-span-12 space-y-1.5">
                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono">
                                  <Code size={11} /> <span>Webhook URL:</span>
                                </div>
                                <div className="bg-slate-900 text-yellow-300 font-mono text-[9px] p-2 rounded-lg border border-slate-800 flex justify-between items-center select-all break-all overflow-hidden">
                                  <span>{wf.webhookUrl}</span>
                                  <Copy
                                    size={10}
                                    className="text-slate-500 hover:text-white shrink-0 ml-2 cursor-pointer"
                                    onClick={() => {
                                      navigator.clipboard.writeText(wf.webhookUrl);
                                      addAuditLog(`Copied n8n webhook URL to clipboard for "${wf.name}"`, "Automation", "info");
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="sm:col-span-12">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                                  Configurable Parameters
                                </span>
                                <div className="grid grid-cols-2 gap-2 text-[10px]">
                                  {Object.entries(wf.parameters).map(([key, val]: [string, any]) => (
                                    <div key={key} className="space-y-1">
                                      <label className="text-slate-500 font-medium font-mono text-[9px] capitalize">
                                        {key.replace(/([A-Z])/g, " $1")}
                                      </label>
                                      <input
                                        type="text"
                                        value={val}
                                        onChange={(e) => handleUpdateParameter(wf.id, key, e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-800 font-sans focus:outline-none focus:border-yellow-400 font-semibold"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="sm:col-span-12 flex justify-between items-center text-[10px] text-slate-400 pt-1.5 font-mono">
                                <div className="flex items-center gap-1">
                                  <RefreshCw size={10} />
                                  <span>Nodes: {wf.nodeCount}</span>
                                </div>
                                <span>Last Run: {wf.lastRunTime ? new Date(wf.lastRunTime).toLocaleTimeString() : "Never"} ({wf.lastRunStatus})</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Live n8n Execution Visualizer & Simulator */}
              <div className="lg:col-span-6 space-y-6">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-md text-white space-y-4">
                  <div>
                    <h4 className="font-display font-bold text-yellow-400 text-base flex items-center gap-1.5">
                      <Workflow size={18} /> Live Execution Visualizer
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      Step-by-step visual mapping of n8n router nodes during execution triggers.
                    </p>
                  </div>

                  {/* Flow chart visualization */}
                  {(() => {
                    const selectedWf = workflows.find((w) => w.id === selectedWorkflowId) || workflows[0];
                    const isCurrentSimulating = simulatingWorkflowId === selectedWf.id;

                    return (
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850/80 space-y-4 relative overflow-hidden">
                        <div className="flex items-center justify-between gap-4 py-2 text-xs border-b border-slate-855/50">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                            <span className="font-bold text-slate-200">Active Map: {selectedWf.name}</span>
                          </div>
                          <span className="font-mono text-[9px] text-slate-500">Pipeline ID: {selectedWf.id}</span>
                        </div>

                        {/* Interactive Nodes Connection Line */}
                        <div className="grid grid-cols-3 gap-3 relative items-center py-4">
                          {/* Animated beam overlay */}
                          {isCurrentSimulating && (
                            <div className="absolute top-[52px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-yellow-400 via-emerald-400 to-indigo-500 z-0 animate-pulse" />
                          )}

                          {/* Node 1: Webhook Trigger */}
                          <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center space-y-1.5 z-10 transition-all ${
                            isCurrentSimulating && simulationStep >= 0
                              ? "bg-yellow-400/15 border-yellow-400 text-yellow-300"
                              : "bg-slate-900 border-slate-800 text-slate-400"
                          }`}>
                            <Zap size={16} className={isCurrentSimulating && simulationStep === 0 ? "animate-bounce text-yellow-400" : ""} />
                            <span className="text-[10px] font-black uppercase font-mono tracking-wider">Trigger</span>
                            <span className="text-[9px] font-mono block max-w-[100px] truncate">{selectedWf.triggerName}</span>
                          </div>

                          {/* Node 2: n8n Router Core */}
                          <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center space-y-1.5 z-10 transition-all ${
                            isCurrentSimulating && simulationStep >= 1
                              ? "bg-emerald-400/15 border-emerald-400 text-emerald-300"
                              : "bg-slate-900 border-slate-800 text-slate-400"
                          }`}>
                            <Workflow size={16} className={isCurrentSimulating && (simulationStep === 1 || simulationStep === 2) ? "animate-spin" : ""} />
                            <span className="text-[10px] font-black uppercase font-mono tracking-wider">n8n Router</span>
                            <span className="text-[9px] font-mono block">Node Checks</span>
                          </div>

                          {/* Node 3: Target API Gateway */}
                          <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center space-y-1.5 z-10 transition-all ${
                            isCurrentSimulating && simulationStep >= 3
                              ? "bg-indigo-400/15 border-indigo-400 text-indigo-300"
                              : "bg-slate-900 border-slate-800 text-slate-400"
                          }`}>
                            <Copy size={16} className={isCurrentSimulating && simulationStep === 3 ? "animate-pulse text-indigo-400" : ""} />
                            <span className="text-[10px] font-black uppercase font-mono tracking-wider">Action</span>
                            <span className="text-[9px] font-mono block max-w-[100px] truncate">{selectedWf.actionName}</span>
                          </div>
                        </div>

                        {/* Interactive simulated terminal log window */}
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block px-1">
                            Live Simulation Console Logs
                          </span>
                          <div className="bg-black p-3.5 rounded-xl border border-slate-850 font-mono text-[10px] space-y-1 text-slate-400 h-[120px] overflow-y-auto leading-relaxed text-left">
                            {isCurrentSimulating ? (
                              simulationLogs.map((log, idx) => (
                                <div key={idx} className="flex gap-2 items-start text-emerald-400">
                                  <span className="text-yellow-400 shrink-0">❯</span>
                                  <span>{log}</span>
                                </div>
                              ))
                            ) : (
                              <div className="flex flex-col items-center justify-center text-center h-full text-slate-500 space-y-1">
                                <Code size={18} className="text-slate-650" />
                                <span>No live execution running.</span>
                                <span>Click the manual run button on the left to simulate!</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Lower Section: AI Sentiment Analysis & Recent Execution History */}
              <div className="lg:col-span-12 grid md:grid-cols-12 gap-6 pt-2">
                {/* 1. parent feedback -> AI sentiment analysis */}
                <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm md:col-span-5 space-y-4">
                  <div>
                    <h4 className="font-display font-bold text-slate-900 text-base flex items-center gap-1.5">
                      <Brain className="text-yellow-500 shrink-0" size={18} /> Parent Feedback AI Sentiment Analysis
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Utilizes natural language nodes to evaluate parental testimonials, auto-raising supervisor warning tickets on critical feedback.
                    </p>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[9px] block">Test Feedback Paragraph</label>
                      <textarea
                        rows={3}
                        value={aiReviewText}
                        onChange={(e) => setAiReviewText(e.target.value)}
                        placeholder="Enter parent feedback text..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-1 focus:ring-yellow-400 focus:outline-none leading-relaxed"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleRunSentimentAnalysis}
                      disabled={isAnalyzingSentiment || !aiReviewText.trim()}
                      className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black py-2 rounded-xl transition-all cursor-pointer uppercase text-xs tracking-wider flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      {isAnalyzingSentiment ? (
                        <>
                          <RefreshCw size={12} className="animate-spin" />
                          <span>Analyzing Sentiments...</span>
                        </>
                      ) : (
                        <>
                          <Brain size={12} />
                          <span>Run AI Analysis Node</span>
                        </>
                      )}
                    </button>

                    {/* AI analysis response */}
                    {aiAnalysisResult && (
                      <div className="p-3.5 rounded-xl border space-y-2 bg-slate-50 border-slate-200 text-left">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-400 font-bold uppercase tracking-wider font-mono">Analysis Node Output</span>
                          <span className="text-slate-400 font-mono">Score: <strong className="text-slate-800">{aiAnalysisResult.score} / 1.00</strong></span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-800">Computed Sentiment:</span>
                          <span className={`font-black uppercase tracking-wider px-2 py-0.5 rounded text-[10px] border ${
                            aiAnalysisResult.sentiment === "Positive"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : aiAnalysisResult.sentiment.includes("Critical")
                              ? "bg-rose-50 text-rose-700 border-rose-100 animate-pulse"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}>
                            {aiAnalysisResult.sentiment}
                          </span>
                        </div>

                        {aiAnalysisResult.alertRaised && (
                          <div className="p-2 bg-rose-50 border border-rose-100 text-rose-700 rounded-lg text-[10.5px] leading-relaxed flex gap-2 items-start font-sans">
                            <span className="text-xs shrink-0 mt-0.5">⚠️</span>
                            <p>
                              <strong>Critical Alert Flagged:</strong> Low sentiment threshold detected. Automated notification dispatched to Supervisor Green for resolution.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. n8n Execution History Table */}
                <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm md:col-span-7 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-display font-bold text-slate-900 text-base">
                        📋 n8n Pipeline Execution History
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        A dynamic, real-time audit ledger of simulated automation pipeline triggers.
                      </p>
                    </div>
                    <button
                      onClick={() => setExecutions([])}
                      className="text-rose-600 text-[10px] font-black hover:underline uppercase"
                    >
                      Clear Log
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                    {executions.map((exec) => {
                      const statusStyles = {
                        Success: "bg-emerald-50 text-emerald-700 border-emerald-100",
                        Error: "bg-rose-50 text-rose-700 border-rose-100"
                      };

                      return (
                        <div key={exec.id} className="bg-slate-50 border border-slate-150 p-3 rounded-2xl flex flex-col gap-2 text-xs text-left">
                          <div className="flex justify-between items-center">
                            <div>
                              <strong className="text-slate-850 font-bold block">{exec.workflowName}</strong>
                              <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">
                                ID: {exec.id} • Triggered: {new Date(exec.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] text-slate-500">{exec.duration}</span>
                              <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${statusStyles[exec.status as "Success" | "Error"] || "bg-slate-100 text-slate-600"}`}>
                                {exec.status}
                              </span>
                            </div>
                          </div>

                          {/* Detail payloads inspector */}
                          <div className="bg-slate-900 text-[9.5px] font-mono text-slate-300 p-2.5 rounded-xl border border-slate-950 overflow-x-auto select-all whitespace-pre-wrap leading-relaxed max-h-[80px]">
                            {JSON.stringify(exec.payload, null, 2)}
                          </div>
                        </div>
                      );
                    })}

                    {executions.length === 0 && (
                      <div className="text-center py-12 text-slate-400 italic">
                        No automation runs on log yet. Select a workflow above and trigger its manual simulation to see live dispatches!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
