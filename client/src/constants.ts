import { Home, Inbox, Settings, Upload, Users } from "lucide-react";

export const navLinks = [
    { href: "/", label: "Home" },
    { href: "/tutor-support", label: "Tutor Support" },
  ];

 export  const adminNavItems = [
    { name: "Dashboard", icon: Home, path: "/admin/dashboard" },
    { name: "Upload materials", icon: Upload, path: "/admin/upload-material" },
    { name: "Tutor Requests", icon: Inbox, path: "/admin/tutor-request" },
    { name: "Users", icon: Users, path: "/admin/users" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
  ];  

  export const levels = [
  { value: "o-level", label: "O Level" },
  { value: "a-level", label: "A Level" },
];

export const types = [
  { value: "marking-scheme", label: "Marking Scheme" },
  { value: "past-paper", label: "Past Paper" },
  { value: "notes", label: "Notes" },
];

export const sessions = [
  {value: "june", label: "June"},
  {value: "november", label: "November"}
]

// Paper options (1-6)
export const paperOptions = [
  { value: "paper-1", label: "Paper 1" },
  { value: "paper-2", label: "Paper 2" },
  { value: "paper-3", label: "Paper 3" },
  { value: "paper-4", label: "Paper 4" },
  { value: "paper-5", label: "Paper 5" },
  { value: "paper-6", label: "Paper 6" },
];

export const subjectColors = [
  "bg-blue-100 text-blue-800",
  "bg-purple-100 text-purple-800",
  "bg-emerald-100 text-emerald-800",
  "bg-green-100 text-green-800",
  "bg-amber-100 text-amber-800",
  "bg-red-100 text-red-800",
  "bg-teal-100 text-teal-800",
  "bg-indigo-100 text-indigo-800",
  "bg-rose-100 text-rose-800",
  "bg-cyan-100 text-cyan-800",
  "bg-orange-100 text-orange-800",
  "bg-pink-100 text-pink-800",
  "bg-violet-100 text-violet-800",
  "bg-fuchsia-100 text-fuchsia-800",
  "bg-sky-100 text-sky-800",
  "bg-lime-100 text-lime-800",
  "bg-stone-100 text-stone-800",
  "bg-neutral-100 text-neutral-800",
  "bg-zinc-100 text-zinc-800",
  "bg-slate-100 text-slate-800",
];

export const oLevelSubjectsData = ["Mathematics", "Physics", "Chemistry", "Computer Science"]

export const aLevelSubjectsData = ["Mathematics", "Physics", "Chemistry", "Computer Science", "Statistics"]

// ---------- Role badge ----------
export const roleStyles = {
  admin: "bg-red-50 text-red-600",
  teacher: "bg-blue-50 text-blue-600",
  student: "bg-emerald-50 text-emerald-600",
};

export const nymdServices = [
    {
        label: "Virtual Classes",
        value: "virtual-classes"
    },
    {
        label: "Quizzes and tests",
        value: "quizzes-and-tests"
    },
    {
        label: "AI teaching Assistant",
        value: "ai-teaching-assistant"
    }
]