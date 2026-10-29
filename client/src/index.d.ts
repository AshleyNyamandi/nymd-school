export interface MainLayoutProps {
  children: React.ReactNode
};

export interface AuthContextType {
    email: string | null;
    setEmail: (email: string | null) => void;
    userId: string | null;
    setUserId: (userId: string | null) => void;
    role: string | null;
    setRole: (role: string | null) => void;
};

export interface TutorSupportEntries {
    subject?: string;
    level?: string;
    email?: string;
    message?: string
  }

export interface TutorSupportErrors {
    subject?: string;
    level?: string;
    email?: string;
    message?: string
    general?: string
  }  

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "admin" | "teacher" | "student";
  isVerified: boolean;
  bio?: string;
  createdAt: string;
}

export interface TutorRequest {
  _id: string;
  subject: string;
  level: string;
  email: string;
  message: string;
  isReplied: boolean;
  createdAt: string;
}

export interface Material {
  _id: string;
  level: string;
  subject: string;
  materialType: string;
  paper?: string;
  year?: number;
  session?: string;
  fileUrl?: string;
}
