export interface Message {
  id: string;
  role: "user" | "model" | "system";
  content: string;
  timestamp: number;
  image?: string; // Base64 string
  isTyping?: boolean;
  isSearching?: boolean;
  sources?: { title: string; url: string }[];
  feedback?: "like" | "dislike";
  thoughtTime?: number; // ms
}

export interface ScoreData {
  date: string;
  score: number;
  xCount: number;
  distance: number; // meters
  ends?: any[];
}

export enum AppMode {
  DASHBOARD = "DASHBOARD",
  CHAT = "CHAT",
  FORM_ANALYSIS = "FORM_ANALYSIS",
  TARGET_ANALYSIS = "TARGET_ANALYSIS",
  EXERCISE = "EXERCISE",
  IMAGE_GEN = "IMAGE_GEN",
  CALCULATOR = "CALCULATOR",
  HISTORY = "HISTORY",
  SETTINGS = "SETTINGS",
  REPORT_BUG = "REPORT_BUG",
  BLOG = "BLOG",
  ABOUT = "ABOUT",
  CONTACT = "CONTACT",
  REVIEWS = "REVIEWS",
  SHOP = "SHOP",
  SUBSCRIPTION = "SUBSCRIPTION",
  PRIVACY = "PRIVACY",
  TERMS = "TERMS",
  COOKIES = "COOKIES",
  SECURITY = "SECURITY",
  LEADERBOARD = "LEADERBOARD",
  SCHEDULE = "SCHEDULE",
  NEWS = "NEWS",
  SHORTCUTS = "SHORTCUTS",
}

export type SubscriptionTier = "Free" | "Charge" | "Pro" | "Ultra";

export interface UserProfile {
  fullName: string;
  email: string;
  dateOfBirth: string;
  age: number;
  isLoggedIn: boolean;
  isNew?: boolean;
  subscriptionTier: SubscriptionTier;
  tokensUsed: number;
  tokenLimit: number;
  imagesGenerated: number;
  lastLimitRefill: number; // Deprecated but kept for migration, use lastTokenRefill
  lastTokenRefill?: number;
  lastImageRefill?: number;
  subscriptionExpires?: number;
  avatarUrl?: string;
  hobby?: string;
  bowType?: "Barebow" | "Compound" | "Recurve" | "Traditional" | "Other";
  archerLevel?: "Beginner" | "Intermediate" | "Advanced" | "Professional";
  phoneNumber?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  stats?: {
    avgScore: number;
    highestScore: number;
    rankProgress: number;
    podiumFinishes: number;
  };
  activeDevices?: DeviceInfo[];
}

export interface DeviceInfo {
  deviceId: string;
  userAgent: string;
  lastActive: number;
}

export interface ChatSession {
  id: string;
  title: string;
  date: number;
  preview: string;
  messages: Message[];
  isPinned?: boolean;
  type?: "chat" | "image" | "other" | "exercise";
}

export interface AppSettings {
  nickname: string;
  aiPersonality: "Professional" | "Casual" | "Strict" | "Funny";
  dataCollection: boolean;
  theme: "dark" | "light";
  accentColor: "orange" | "blue" | "green" | "purple";
  twoFactorAuth: boolean;
  publicProfile: boolean;
  language: string;
  fontSize: "small" | "medium" | "large";
  aiInstructions?: string;
  shortcuts?: {
    history: string;
    chat: string;
    settings: string;
    help: string;
    theme: string;
  };
}

export interface Exercise {
  name: string;
  duration?: number; // seconds
  reps?: string;
  sets: number;
  description: string;
  category?: string;
}

export interface ExercisePlan {
  id: string;
  bodyPart: string;
  level: string;
  content: string;
  createdAt: number;
  exercises?: Exercise[];
}
