export interface AdmissionApplication {
  id: string;
  childName: string;
  parentName: string;
  email: string;
  phone: string;
  dob: string;
  program: string;
  status: "Pending Review" | "Approved" | "Declined";
  date: string;
}

export interface TourBooking {
  id: string;
  parentName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  status: "Confirmed" | "Pending" | "Cancelled";
}

export interface Enquiry {
  id: string;
  parentName: string;
  email: string;
  phone: string;
  childAge?: string;
  program?: string;
  message: string;
  date: string;
}

export interface AttendanceRecord {
  date: string;
  status: "Present" | "Absent" | "Late";
}

export interface FeeRecord {
  term: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  dueDate: string;
  paidDate?: string;
}

export interface StudentProgress {
  motorSkills: string;
  socialSkills: string;
  creativity: string;
  cognitive: string;
}

export interface Student {
  id: string;
  name: string;
  parentName: string;
  parentEmail: string;
  program: string;
  dob: string;
  attendance: AttendanceRecord[];
  fees: FeeRecord[];
  progress: StudentProgress;
}

export interface Homework {
  id: string;
  class: string;
  subject: string;
  title: string;
  description: string;
  assignedDate: string;
  dueDate: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  urgent: boolean;
}

export interface Message {
  id: string;
  sender: string;
  recipient: string;
  text: string;
  timestamp: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  icon?: string;
  url?: string;
}

export type UserRole = "guest" | "parent" | "teacher" | "admin";

export interface DatabaseState {
  admissions: AdmissionApplication[];
  tours: TourBooking[];
  enquiries: Enquiry[];
  newsletter: string[];
  students: Student[];
  homework: Homework[];
  notices: Notice[];
  teacherMessages: Message[];
  parentMessages: Message[];
  blogs: BlogArticle[];
  gallery: GalleryPhoto[];
  testimonials: Testimonial[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  stars: number;
  avatar: string;
  verified: boolean;
  parentEmail?: string;
  studentId?: string;
  date: string;
}
