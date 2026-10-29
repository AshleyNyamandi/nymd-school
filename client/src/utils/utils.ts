import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { aLevelSubjectsData, oLevelSubjectsData, subjectColors } from "../constants.ts";
import type { Variants } from "motion/react";
import api from "../services/api.tsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateEmail(email: string) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

export const requiresYear = (type: string) => {
  return type === "marking-scheme" || type === "past-paper";
};

export const requiresTopic = (type: string) => {
  return type === "notes";
};

export const requiresPaper = (type: string) => {
  return type === "marking-scheme" || type === "past-paper";
};

export const requiresSession = (type: string) => {
  return type === "marking-scheme" || type === "past-paper";
};

export const currentYear = new Date().getFullYear();

export const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => ({
  value: String(2000 + i),
  label: String(2000 + i),
})).reverse();

const getSubjectColor = (index: number) => {
  return subjectColors[index % subjectColors.length];
};

export const oLevelSubjects = oLevelSubjectsData.map((name, index) => ({
  id: index + 1,
  name,
  color: getSubjectColor(index),
}));

export const aLevelSubjects = aLevelSubjectsData.map((name, index) => ({
  id: index + 1,
  name,
  color: getSubjectColor(index + oLevelSubjectsData.length),
}));

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

export const headerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "Something went wrong";
};

export const fetchStats = async () => {
  try {
    const response = await api.get("/stats/all-stats");
    if (!response.data.success) {
      throw new Error("Failed to fetch stats");
    }
    return response.data.data || [];
  } catch (error) {
    console.log(getErrorMessage(error));
  }
};