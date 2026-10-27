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
