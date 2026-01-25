import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import {
  Menu,
  AlertTriangle,
  ShoppingBag,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "./components/Navigation";

// Lazy imports for performance optimization
const ChatInterface = lazy(() => import("./components/ChatInterface"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const AnalysisView = lazy(() => import("./components/AnalysisView"));
const ExerciseView = lazy(() => import("./components/ExerciseView"));
const ImageGenView = lazy(() => import("./components/ImageGenView"));
const CalculatorView = lazy(() => import("./components/CalculatorView"));
const ReportBug = lazy(() => import("./components/ReportBug"));
const LandingPage = lazy(() => import("./components/LandingPage"));
const Auth = lazy(() => import("./components/Auth"));
const Settings = lazy(() => import("./components/Settings"));
const HistoryView = lazy(() => import("./components/HistoryView"));
const SubscriptionView = lazy(() => import("./components/SubscriptionView"));
const LeaderboardView = lazy(() => import("./components/LeaderboardView"));
const ResetPassword = lazy(() => import("./components/ResetPassword"));
const ScheduleView = lazy(() => import("./components/ScheduleView"));
const NewsView = lazy(() => import("./components/NewsView"));
const ShopView = lazy(() => import("./components/shop/ShopView"));
const CookieConsent = lazy(() => import("./components/CookieConsent"));
const CustomCursor = lazy(() => import("./components/CustomCursor"));
const ShortcutsView = lazy(() => import("./components/ShortcutsView"));

import { BlogPage, AboutPage, ContactPage } from "./components/StaticPages";
import {
  PrivacyPolicy,
  TermsOfService,
  CookiePolicy,
  SecurityPolicy,
} from "./components/LegalPages";
import { PageTransition } from "./components/PageTransition";

const LoadingFallback = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#050505] z-[9999] overflow-hidden">
    {/* Background Decorative Blurs */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-500/10 blur-[120px] rounded-full"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full"
      />
    </div>

    {/* Loader Core */}
    <div className="relative">
      {/* Outer spinning ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="w-32 h-32 rounded-full border-t-2 border-b-2 border-transparent border-t-orange-500/50 border-b-orange-500/20"
      />

      {/* Middle spinning ring (reversed) */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 m-auto w-24 h-24 rounded-full border-r-2 border-l-2 border-transparent border-r-white/20 border-l-white/10"
      />

      {/* Inner Pulse */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/30 backdrop-blur-md shadow-[0_0_30px_rgba(249,115,22,0.3)]"
        >
          <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
        </motion.div>
      </div>
    </div>

    {/* Text Loader */}
    <div className="mt-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex flex-col items-center">
          <h2 className="text-white font-black tracking-[0.6em] text-[10px] uppercase opacity-90">
            X10Minds Intelligence
          </h2>
          <div className="mt-2 w-32 h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
        </div>

        <div className="flex items-center gap-1.5 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                backgroundColor: ["#f97316", "#ffffff", "#f97316"],
              }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-1 h-1 rounded-full"
            />
          ))}
        </div>

        <p className="text-white/30 font-bold uppercase tracking-[0.3em] text-[7px] animate-pulse">
          Building The Experience...
        </p>
      </motion.div>
    </div>
  </div>
);

const GlobalStyles = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
    @keyframes breathing-glow {
      0%, 100% { opacity: 0.1; transform: translate(-50%, -50%) scale(1); }
      50% { opacity: 0.2; transform: translate(-50%, -50%) scale(1.15); }
    }
    @keyframes float-particle {
      0% { transform: translateY(0px) translateX(0px); opacity: 0; }
      50% { opacity: 0.5; }
      100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(128, 128, 128, 0.1);
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(128, 128, 128, 0.3);
    }
    .selection-accent::selection {
      background: rgba(234, 88, 12, 0.4);
      color: white;
    }
  `,
    }}
  />
);
import {
  AppMode,
  Message,
  UserProfile,
  ChatSession,
  SubscriptionTier,
  ScoreData,
  AppSettings,
  Exercise,
} from "./types";
import {
  syncUserToFirebase,
  logoutFirebase,
  handleRedirectLogin,
  getUserProfile,
} from "./services/firebase";
import { generateChatTitle } from "./services/geminiService";
import { getTranslation } from "./i18n";
import { Toast, RankUpModal, NotificationType } from "./components/Overlays";

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [viewState, setViewState] = useState<
    "LANDING" | "AUTH" | "APP" | "RESET_PASSWORD"
  >("LANDING");
  // Separate state for reset token
  const [resetToken, setResetToken] = useState<string>("");

  const [mode, setMode] = useState<AppMode>(AppMode.DASHBOARD);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scoreData, setScoreData] = useState<ScoreData[]>([]);
  const [preloadedPlan, setPreloadedPlan] = useState<Exercise[] | null>(null);
  const [sessionDistance, setSessionDistance] = useState(70);
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Notifications & Modals
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
  } | null>(null);
  const [showRankUp, setShowRankUp] = useState<{ show: boolean; rank: string }>(
    { show: false, rank: "" },
  );

  // Default Settings
  const [settings, setSettings] = useState<AppSettings>({
    nickname: "Archer",
    aiPersonality: "Professional",
    dataCollection: true,
    theme: "dark",
    accentColor: "orange",
    twoFactorAuth: false,
    publicProfile: false,
    language: "English",
    fontSize: "medium",
    shortcuts: {
      history: "alt+h",
      chat: "alt+c",
      settings: "alt+,",
      help: "alt+/",
      theme: "alt+t",
      dashboard: "alt+d",
      calculator: "alt+k",
      shop: "alt+s",
    },
  });

  const t = (key: string) => {
    return getTranslation(settings.language || "English", key);
  };

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Unsaved Settings & Preview State
  const [isSettingsDirty, setIsSettingsDirty] = useState(false);
  const [previewAccent, setPreviewAccent] = useState<string | null>(null);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingMode, setPendingMode] = useState<AppMode | null>(null);

  const handleModeChange = (newMode: AppMode) => {
    if (newMode === mode) return;

    // Check for unsaved settings if leaving Settings page
    if (mode === AppMode.SETTINGS && isSettingsDirty) {
      setShowUnsavedModal(true);
      setPendingMode(newMode);
      return;
    }

    // Also reset preview if leaving settings even if not dirty (just in case)
    if (mode === AppMode.SETTINGS) {
      setPreviewAccent(null);
    }

    setMode(newMode);
  };

  // --- Rank Logic ---
  const calculateRank = (scores: ScoreData[]): string => {
    if (scores.length === 0) return "Unranked";

    // Calculate average score
    const total = scores.reduce((sum, s) => sum + s.score, 0);
    const avg = total / scores.length;

    // Updated difficulty based on user request
    if (avg >= 345) return "Olympic Champion";
    if (avg >= 340) return "Asian Champion";
    if (avg >= 335) return "World Champion";
    if (avg >= 320) return "Diamond";
    if (avg >= 300) return "Platinum";
    if (avg >= 270) return "Gold";
    if (avg >= 250) return "Silver";
    if (avg >= 170) return "Copper";
    return "Unranked";
  };

  const getRankValue = (rank: string): number => {
    switch (rank) {
      case "Unranked":
        return 0;
      case "Copper":
        return 1;
      case "Silver":
        return 2;
      case "Gold":
        return 3;
      case "Platinum":
        return 4;
      case "Diamond":
        return 5;
      case "World Champion":
        return 6;
      case "Asian Champion":
        return 7;
      case "Olympic Champion":
        return 8;
      default:
        return 0;
    }
  };

  const checkAndRefillLimits = (currentUser: UserProfile): UserProfile => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    let updated = { ...currentUser };
    let hasChanges = false;

    // Initialize new fields if missing
    if (!updated.lastTokenRefill)
      updated.lastTokenRefill = updated.lastLimitRefill || now;
    if (!updated.lastImageRefill)
      updated.lastImageRefill = updated.lastLimitRefill || now;

    // Check for subscription expiry
    if (
      updated.subscriptionTier !== "Free" &&
      updated.subscriptionExpires &&
      now > updated.subscriptionExpires
    ) {
      updated.subscriptionTier = "Free";
      updated.tokenLimit = 5000; // Reset to guest limit
      updated.subscriptionExpires = undefined;
      hasChanges = true;
    }

    const isFree = updated.subscriptionTier === "Free";
    const isUnlimited =
      updated.subscriptionTier === "Pro" ||
      updated.subscriptionTier === "Ultra";

    // --- Token Refill Logic ---
    // Free: 3 Days, Others: 24 Hours
    const tokenRefillInterval = isFree ? 3 * oneDay : oneDay;
    if (now - updated.lastTokenRefill >= tokenRefillInterval) {
      const baseLimit = isFree
        ? 5000
        : updated.subscriptionTier === "Charge"
          ? 50000
          : Infinity;

      updated.tokensUsed = 0;
      updated.tokenLimit = baseLimit;
      updated.lastTokenRefill = now;
      hasChanges = true;
    }

    // --- Image Refill Logic ---
    // Free: 7 Days
    const imageRefillInterval = isFree ? 7 * oneDay : oneDay;

    if (now - updated.lastImageRefill >= imageRefillInterval) {
      updated.imagesGenerated = 0;
      updated.lastImageRefill = now;
      hasChanges = true;
    }

    return hasChanges ? updated : currentUser;
  };

  useEffect(() => {
    if (user) {
      const now = Date.now();
      const tenDays = 10 * 24 * 60 * 60 * 1000;

      // Check for approaching expiry
      if (
        user.subscriptionExpires &&
        user.subscriptionTier !== "Free" &&
        user.isLoggedIn
      ) {
        const remaining = user.subscriptionExpires - now;
        if (remaining > 0 && remaining < tenDays) {
          const daysLeft = Math.ceil(remaining / (24 * 60 * 60 * 1000));
          const warningKey = `expiry_warned_${user.email}_${user.subscriptionExpires}`;
          const hasWarned = sessionStorage.getItem(warningKey);

          if (!hasWarned) {
            setTimeout(() => {
              notify(
                `Urgent: Your ${
                  user.subscriptionTier
                } benefits expire in ${daysLeft} day${
                  daysLeft !== 1 ? "s" : ""
                }! Renew now to maintain your performance edge. 🏹`,
                "info",
              );
              sessionStorage.setItem(warningKey, "true");
            }, 3000); // Delay to not overwhelm at start
          }
        }
      }

      const refilled = checkAndRefillLimits(user);
      if (refilled !== user) {
        // Find out if it was an expiry
        if (
          user.subscriptionTier !== "Free" &&
          refilled.subscriptionTier === "Free"
        ) {
          notify(
            "Your subscription has expired. You've been moved to the Free plan. Upgrade now to continue! 🏹",
            "info",
          );
        } else {
          notify("Daily limits refilled! 🎯", "success");
        }
        setUser(refilled);
        syncUserToFirebase(refilled);
      }
    }
  }, [user]);

  const notify = (message: string, type: NotificationType = "info") => {
    setNotification({ message, type });
  };
  // Initial Load (User, Settings, & Reset Token)
  useEffect(() => {
    console.log("App Mounting...");

    // 1. History Navigation Handlers
    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        if (event.state.mode) setMode(event.state.mode);
        if (event.state.viewState) setViewState(event.state.viewState);
      }
    };
    window.addEventListener("popstate", handlePopState);

    // 2. Parse URL Parameters
    const params = new URLSearchParams(window.location.search);
    const rawMode = params.get("mode");
    const modeParam = rawMode as AppMode;
    const vParam = params.get("v") as any;
    const oobCode = params.get("oobCode");
    const token = params.get("resetToken");
    const pageParam = params.get("p");

    const isPathReset = window.location.pathname === "/reset-password";
    const isResetPage = isPathReset || pageParam === "reset-password";
    const isPasswordReset =
      isResetPage ||
      (oobCode &&
        (rawMode === "resetPassword" || rawMode === "action" || !rawMode)) ||
      token;
    const resetCode = oobCode || token;

    // Legal Page / Mode Mapping
    if (pageParam === "privacy" || modeParam === AppMode.PRIVACY) {
      setMode(AppMode.PRIVACY);
      setViewState("LANDING");
    } else if (pageParam === "terms" || modeParam === AppMode.TERMS) {
      setMode(AppMode.TERMS);
      setViewState("LANDING");
    } else if (pageParam === "cookies" || modeParam === AppMode.COOKIES) {
      setMode(AppMode.COOKIES);
      setViewState("LANDING");
    } else if (pageParam === "security" || modeParam === AppMode.SECURITY) {
      setMode(AppMode.SECURITY);
      setViewState("LANDING");
    } else if (modeParam && Object.values(AppMode).includes(modeParam)) {
      setMode(modeParam);
    }

    if (vParam) setViewState(vParam);

    // 3. Load Settings
    try {
      const savedSettings = localStorage.getItem("x10minds_settings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        const root = document.documentElement;
        if (parsed.fontSize === "small") root.style.fontSize = "14px";
        else if (parsed.fontSize === "large") root.style.fontSize = "18px";
        else root.style.fontSize = "16px";

        // Apply theme to document root
        if (parsed.theme === "dark") {
          root.classList.add("dark");
          root.style.colorScheme = "dark";
        } else {
          root.classList.remove("dark");
          root.style.colorScheme = "light";
        }
      }
    } catch (e) {
      console.error("Failed to parse settings", e);
    }

    // 4. Handle Password Reset View
    if (isPasswordReset) {
      if (resetCode) setResetToken(resetCode);
      setViewState("RESET_PASSWORD");
    }

    // 5. Load User
    try {
      const savedUser = localStorage.getItem("x10minds_user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        const refilled = checkAndRefillLimits(parsedUser);
        setUser(refilled);
        if (!isPasswordReset && !vParam) setViewState("APP");
        syncUserToFirebase(refilled);
      }
    } catch (e) {
      console.error("Failed to parse user data", e);
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Handle Redirect Login (Mobile Social Auth)
  useEffect(() => {
    const checkRedirect = async () => {
      // Only check if we are on Landing and not already logged in
      if (viewState === "LANDING" && !user) {
        try {
          const firebaseUser = await handleRedirectLogin();
          if (firebaseUser) {
            console.log("Recovered from redirect login:", firebaseUser.uid);
            let profile = await getUserProfile(firebaseUser.uid);

            if (!profile) {
              // Create new profile if it doesn't exist (First time social login via redirect)
              const newSocialUser: UserProfile = {
                fullName: firebaseUser.displayName || "Archer",
                email: firebaseUser.email || "",
                dateOfBirth: "2000-01-01",
                age: 25,
                isLoggedIn: true,
                isNew: true,
                subscriptionTier: "Free",
                tokensUsed: 0,
                tokenLimit: 5000,
                imagesGenerated: 0,
                lastLimitRefill: Date.now(),
                lastTokenRefill: Date.now(),
                lastImageRefill: Date.now(),
              };
              await syncUserToFirebase(newSocialUser);
              profile = newSocialUser;
            }

            const validatedProfile = { ...profile, isLoggedIn: true };
            await handleLogin(validatedProfile);
          }
        } catch (e: any) {
          console.error("Redirect check failed", e);
          notify(e.message || "Login recovery failed", "error");
        }
      }
    };

    // Small delay to ensure firebase is initialized
    const timer = setTimeout(() => {
      checkRedirect();
    }, 500);

    return () => clearTimeout(timer);
  }, [viewState, user]);

  // Helper to centralize limit check and set user
  const refillAndSetUser = (u: UserProfile) => {
    const refilled = checkAndRefillLimits(u);
    setUser(refilled);
    syncUserToFirebase(refilled);
  };

  // Sync state to URL and push history
  useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const currentMode = params.get("mode");
    const currentV = params.get("v");

    let changed = false;
    if (mode !== AppMode.DASHBOARD) {
      if (currentMode !== mode) {
        url.searchParams.set("mode", mode);
        changed = true;
      }
    } else if (currentMode) {
      url.searchParams.delete("mode");
      changed = true;
    }

    if (viewState !== "LANDING" && viewState !== "APP") {
      if (currentV !== viewState) {
        url.searchParams.set("v", viewState);
        changed = true;
      }
    } else if (currentV && (viewState === "LANDING" || viewState === "APP")) {
      url.searchParams.delete("v");
      changed = true;
    }

    if (changed) {
      window.history.pushState({ mode, viewState }, "", url.toString());
    }
    // Block Access for Guest/Free Tier
    if (user?.subscriptionTier === "Free") {
      // Allow Settings access so they can change theme/language, but Profile section will be hidden in component
      if (mode === AppMode.IMAGE_GEN) {
        notify(
          "Creative Studio is available for Premium users. You can generate limited images in Chat.",
          "error",
        );
        setMode(AppMode.DASHBOARD);
      }
    }
  }, [mode, viewState, user]);

  // Update global user storage
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem("x10minds_user", JSON.stringify(user));
      } catch (e) {
        console.error("Failed to save user to localStorage", e);
        notify("Warning: Storage full. Some data may not persist.", "info");
      }
    }
  }, [user]);

  // Update settings storage
  // --- Keyboard Shortcuts (Consolidated) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input (except Escape)
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        if (e.key !== "Escape") return;
      }

      const s = settings.shortcuts || {
        history: "alt+h",
        chat: "alt+c",
        settings: "alt+,",
        help: "alt+/",
        theme: "alt+t",
        dashboard: "alt+d",
        calculator: "alt+k",
        shop: "alt+s",
      };

      const checkShortcut = (shortcut: string) => {
        if (!shortcut) return false;
        const parts = shortcut.toLowerCase().split("+");
        const key = parts.pop();
        const ctrl = parts.includes("ctrl") || parts.includes("cmd");
        const alt = parts.includes("alt");
        const shift = parts.includes("shift");

        return (
          e.key.toLowerCase() === key &&
          (e.ctrlKey || e.metaKey) === ctrl &&
          e.altKey === alt &&
          e.shiftKey === shift
        );
      };

      if (checkShortcut(s.chat)) {
        e.preventDefault();
        handleModeChange(AppMode.CHAT);
        notify("Shortcut: AI Chat", "info");
      } else if (checkShortcut(s.history)) {
        e.preventDefault();
        handleModeChange(AppMode.HISTORY);
        notify("Shortcut: Session History", "info");
      } else if (checkShortcut(s.shop)) {
        e.preventDefault();
        handleModeChange(AppMode.SHOP);
        notify("Shortcut: Shop", "info");
      } else if (checkShortcut(s.dashboard)) {
        e.preventDefault();
        handleModeChange(AppMode.DASHBOARD);
        notify("Shortcut: Dashboard", "info");
      } else if (checkShortcut(s.calculator)) {
        e.preventDefault();
        handleModeChange(AppMode.CALCULATOR);
        notify("Shortcut: Calculators", "info");
      } else if (checkShortcut(s.settings)) {
        e.preventDefault();
        handleModeChange(AppMode.SETTINGS);
        notify("Shortcut: Settings", "info");
      } else if (checkShortcut(s.help)) {
        e.preventDefault();
        handleModeChange(AppMode.SHORTCUTS);
        notify("Shortcut: Keyboard Help", "info");
      } else if (checkShortcut(s.theme)) {
        e.preventDefault();
        const nextTheme = settings.theme === "dark" ? "light" : "dark";
        handleUpdateSettings({ ...settings, theme: nextTheme });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [settings, user, isSettingsDirty, mode]);

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem("x10minds_settings", JSON.stringify(newSettings));

    // Set root font size for global scaling
    const root = document.documentElement;
    if (newSettings.fontSize === "small") root.style.fontSize = "14px";
    else if (newSettings.fontSize === "large") root.style.fontSize = "18px";
    else root.style.fontSize = "16px";

    // Synchronize document theme class
    if (newSettings.theme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }

    notify("Settings updated successfully");
    setIsSettingsDirty(false);
    setPreviewAccent(null);
  };

  // Load User Specific Data (History, Scores) when User changes
  useEffect(() => {
    if (user && user.email) {
      const scoreKey = `x10minds_scores_${user.email}`;
      const savedScores = localStorage.getItem(scoreKey);
      if (savedScores) {
        try {
          setScoreData(JSON.parse(savedScores));
        } catch (e) {
          console.error("Failed to parse scores", e);
          setScoreData([]);
        }
      } else {
        setScoreData([]);
      }
    } else {
      setScoreData([]);
      setMessages([]);
    }
  }, [user?.email]);

  // Persist Scores
  useEffect(() => {
    if (user && user.email && scoreData.length > 0) {
      const scoreKey = `x10minds_scores_${user.email}`;
      localStorage.setItem(scoreKey, JSON.stringify(scoreData));
    }
  }, [scoreData, user]);

  const handleGetStarted = () => {
    if (user && user.isLoggedIn) {
      setViewState("APP");
    } else {
      setViewState("AUTH");
    }
  };

  const handleLogin = async (userData: UserProfile) => {
    const tier = userData.subscriptionTier || "Free";
    const isUnlimited = tier === "Pro" || tier === "Ultra";

    // 1. Device Tracking & Enforcement
    let deviceId = localStorage.getItem("x10minds_device_id");
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem("x10minds_device_id", deviceId);
    }

    const updatedDevices = [...(userData.activeDevices || [])];
    const existingDeviceIndex = updatedDevices.findIndex(
      (d) => d.deviceId === deviceId,
    );

    if (existingDeviceIndex >= 0) {
      updatedDevices[existingDeviceIndex].lastActive = Date.now();
    } else {
      if (updatedDevices.length >= 3) {
        notify(
          "Access Restricted: Maximum 3 devices reached. Please disconnect another device via settings.",
          "error",
        );
        await logoutFirebase();
        setViewState("LANDING");
        return;
      }
      updatedDevices.push({
        deviceId,
        userAgent: navigator.userAgent,
        lastActive: Date.now(),
      });
    }

    const enrichedUser: UserProfile = {
      ...userData,
      subscriptionTier: tier,
      tokensUsed: userData.tokensUsed || 0,
      tokenLimit: isUnlimited ? Infinity : userData.tokenLimit || 10000,
      imagesGenerated: userData.imagesGenerated || 0,
      lastLimitRefill: userData.lastLimitRefill || Date.now(),
      activeDevices: updatedDevices,
    };

    // Check for refill immediately on login
    const refilledUser = checkAndRefillLimits(enrichedUser);
    setUser(refilledUser);
    localStorage.setItem("x10minds_user", JSON.stringify(refilledUser));
    await syncUserToFirebase(refilledUser);
    setMode(AppMode.DASHBOARD);
    setViewState("APP");

    // Add Welcome Template/Message if no messages exist
    const historyKey = `x10minds_history_${enrichedUser.email}`;
    const savedMessages = localStorage.getItem(historyKey);
    if (!savedMessages || JSON.parse(savedMessages).length === 0) {
      const welcomeMsg = {
        id: "welcome-tp-" + Date.now(),
        role: "model" as const,
        content: `Welcome to **X10Minds**, **${
          enrichedUser.fullName.split(" ")[0]
        }**! 🏹✨\n\nI am your elite Archery Intelligence, powered by Nikunj Poonia's vision. I've analyzed your profile and I'm ready to help you reach the X-ring consistently.\n\n### 🚀 How We Can Start:\n1. **Form Analysis**: Upload a photo/video of your stance.\n2. **SPT Training**: Head to the [Exercise Plan](#exercise) for custom workouts.\n3. **Equipment Tuning**: Ask me about stabilizer setups or arrow spine calculations.\n\nWhat is your primary goal for today's session?`,
        timestamp: Date.now(),
      };
      setMessages([welcomeMsg]);
      localStorage.setItem(historyKey, JSON.stringify([welcomeMsg]));
    }

    notify(`Welcome back, ${enrichedUser.fullName}!`, "success");
  };

  const handleLogout = async () => {
    await logoutFirebase();
    localStorage.removeItem("x10minds_user");
    setUser(null);
    setViewState("LANDING");
    setMessages([]);
    setScoreData([]);
    setMode(AppMode.DASHBOARD);
    notify("Logged out successfully", "info");
  };

  const handleDeleteAccount = async () => {
    // Prevent deletion for paid plans
    if (
      user?.subscriptionTier !== "Free" &&
      user?.subscriptionTier !== undefined
    ) {
      notify(
        "Active subscription found. Please cancel it before deleting your account.",
        "error",
      );
      setShowDeleteConfirm(false);
      return;
    }

    try {
      const { deleteUserAccount } = await import("./services/firebase");
      await deleteUserAccount();

      // Clear all local storage related to this user
      if (user?.email) {
        localStorage.removeItem(`x10minds_history_${user.email}`);
        localStorage.removeItem(`x10minds_scores_${user.email}`);
      }
      localStorage.removeItem("x10minds_user");

      setUser(null);
      setViewState("LANDING");
      setMessages([]);
      setScoreData([]);
      setMode(AppMode.DASHBOARD);
      notify(
        "Account permanently deleted. We're sorry to see you go. 🏹",
        "info",
      );
    } catch (e: any) {
      console.error(e);
      notify(
        "Failed to delete account: " + (e.message || "Unknown error"),
        "error",
      );
    }
  };

  const handleTokenUsage = (amount: number) => {
    if (!user) return;
    setUser((prev) =>
      prev ? { ...prev, tokensUsed: prev.tokensUsed + amount } : null,
    );
  };

  const handleImageGenerated = () => {
    if (!user) return;
    const updatedUser = { ...user, imagesGenerated: user.imagesGenerated + 1 };
    setUser(updatedUser);
    syncUserToFirebase(updatedUser);
  };

  const handleSubscriptionUpgrade = (
    tier: SubscriptionTier,
    months: number = 1,
  ) => {
    if (!user) return;
    let newLimit = 20000;
    if (tier === "Charge") newLimit = 50000;
    if (tier === "Pro" || tier === "Ultra") newLimit = Infinity;

    // Use approximate month length (30 days)
    const expiryDate = Date.now() + months * 30 * 24 * 60 * 60 * 1000;

    const updatedUser: UserProfile = {
      ...user,
      subscriptionTier: tier,
      tokenLimit: newLimit,
      tokensUsed: 0,
      imagesGenerated: 0,
      lastLimitRefill: Date.now(),
      subscriptionExpires: tier === "Free" ? undefined : expiryDate,
    };

    setUser(updatedUser);
    setMode(AppMode.CHAT);
    syncUserToFirebase(updatedUser);
    notify(
      `Upgraded to ${tier} Plan for ${months} month${
        months > 1 ? "s" : ""
      }! 🎯`,
      "success",
    );
  };

  const handleResetChat = (isPenalty: boolean) => {
    if (!user) return;
    setMessages([]);

    if (isPenalty) {
      let newLimit = user.tokenLimit;
      let planName = user.subscriptionTier;

      if (planName === "Free") {
        newLimit = 5000;
      } else if (planName === "Charge") {
        newLimit = 40000;
      }

      if (newLimit !== user.tokenLimit) {
        setUser((prev) =>
          prev ? { ...prev, tokensUsed: 0, tokenLimit: newLimit } : null,
        );

        setTimeout(() => {
          setMessages([
            {
              id: "system-penalty",
              role: "model",
              content: `**New Session Started.**\n\nBecause you reached your previous limit on the ${planName} plan, your new token limit has been adjusted to **${newLimit.toLocaleString()}**. Upgrade to Pro for unlimited access.`,
              timestamp: Date.now(),
            },
          ]);
        }, 500);
        notify("Chat reset. Token limit adjusted.", "info");
      } else {
        // Just reset usage but maintain same limit (e.g. if already at 40k)
        setUser((prev) => (prev ? { ...prev, tokensUsed: 0 } : null));
        notify("Chat session reset", "success");
      }
    } else {
      notify("Chat session reset", "success");
    }
  };

  const saveHistory = async (msgs: Message[]) => {
    if (!user || !user.email) return;
    if (msgs.length === 0) return;
    if (msgs.length === 1 && msgs[0].id === "system-penalty") return;

    const historyKey = `x10minds_history_${user.email}`;
    const historyData = localStorage.getItem(historyKey);
    let history: ChatSession[] = [];
    if (historyData) {
      try {
        history = JSON.parse(historyData);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    const sessionId = msgs[0]?.id;
    if (!sessionId) return;

    const existingIndex = history.findIndex((h) => h.id === sessionId);
    const existingSession = existingIndex >= 0 ? history[existingIndex] : null;

    let title = "New Session";
    if (existingIndex >= 0) {
      title = history[existingIndex].title;
    } else {
      title =
        msgs[0].content.substring(0, 30) +
        (msgs[0].content.length > 30 ? "..." : "");
    }

    // Determine session type
    let sessionType: "chat" | "image" | "other" | "exercise" = "chat";
    const firstMsgLower = msgs[0].content.toLowerCase();

    // Check if it's an exercise session (by keyword or model response content)
    const hasExerciseCommand = msgs.some((m) =>
      m.content.includes("[SYSTEM_COMMAND:EXERCISE_DATA:"),
    );
    const isExerciseRequest =
      firstMsgLower.includes("exercise") ||
      firstMsgLower.includes("workout") ||
      firstMsgLower.includes("training") ||
      firstMsgLower.includes("spt") ||
      firstMsgLower.includes("routine");

    if (hasExerciseCommand || isExerciseRequest) {
      sessionType = "exercise";
    } else if (
      firstMsgLower.includes("generate an image") ||
      firstMsgLower.includes("create an image") ||
      firstMsgLower.includes("visualization")
    ) {
      sessionType = "image";
    }

    const sessionData: ChatSession = {
      id: sessionId,
      title: title,
      date: Date.now(),
      preview: msgs[msgs.length - 1].content.substring(0, 50) + "...",
      messages: msgs,
      isPinned: existingSession?.isPinned || false,
      type: existingSession?.type || sessionType,
    };

    if (existingIndex >= 0) {
      history[existingIndex] = sessionData;
    } else {
      history.unshift(sessionData);
      if (msgs[0].content) {
        generateChatTitle(msgs[0].content).then((newTitle) => {
          const currentHistoryStr = localStorage.getItem(historyKey);
          if (currentHistoryStr) {
            const currentHistory: ChatSession[] = JSON.parse(currentHistoryStr);
            const idx = currentHistory.findIndex((h) => h.id === sessionId);
            if (idx >= 0) {
              currentHistory[idx].title = newTitle.replace(/^"|"$/g, "");
              localStorage.setItem(historyKey, JSON.stringify(currentHistory));
            }
          }
        });
      }
    }

    localStorage.setItem(historyKey, JSON.stringify(history));
  };

  const loadSession = (loadedMessages: Message[]) => {
    setMessages(loadedMessages);
    setMode(AppMode.CHAT);
  };

  const [allSessions, setAllSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    if (user?.email) {
      const historyKey = `x10minds_history_${user.email}`;
      const savedHistory = localStorage.getItem(historyKey);
      if (savedHistory) {
        try {
          setAllSessions(JSON.parse(savedHistory));
        } catch (e) {
          console.error("Failed to load all sessions", e);
        }
      }
    }
  }, [user, messages, mode]); // Reload when relevant states change

  const handleAddScore = (newScore: ScoreData) => {
    const oldRank = calculateRank(scoreData);
    const newScoresList = [...scoreData, newScore];
    setScoreData(newScoresList);

    const newRank = calculateRank(newScoresList);

    if (getRankValue(newRank) > getRankValue(oldRank)) {
      setShowRankUp({ show: true, rank: newRank });
    } else {
      notify(`Score Saved! Total: ${newScore.score}`, "success");
    }
  };

  const handleAddPodium = () => {
    if (!user) return;
    const currentStats = user.stats || {
      avgScore: 0,
      highestScore: 0,
      rankProgress: 0,
      podiumFinishes: 0,
    };
    const updatedUser = {
      ...user,
      stats: {
        ...currentStats,
        podiumFinishes: (currentStats.podiumFinishes || 0) + 1,
      },
    };
    setUser(updatedUser);
    syncUserToFirebase(updatedUser);
    notify("Podium finish added to your profile! 🏆", "success");
  };

  const isDark = settings.theme === "dark";
  const rootClass = isDark
    ? `bg-neutral-950 text-neutral-200`
    : `bg-gray-50 text-gray-800`;
  const currentRank = calculateRank(scoreData);

  // --- Render Overlays ---
  const renderOverlays = () => (
    <>
      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      {showRankUp.show && (
        <RankUpModal
          newRank={showRankUp.rank}
          onClose={() => setShowRankUp({ show: false, rank: "" })}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div
            className={`max-w-md w-full rounded-3xl p-8 shadow-2xl border animate-in zoom-in-95 duration-200 ${
              isDark
                ? "bg-neutral-900 border-neutral-800"
                : "bg-white border-gray-200"
            }`}
          >
            <h3
              className={`text-2xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("ready_logout")}
            </h3>
            <p
              className={`${
                isDark ? "text-neutral-400" : "text-gray-500"
              } mb-8`}
            >
              {t("logout_confirm_text")}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  isDark
                    ? "bg-neutral-800 text-white hover:bg-neutral-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {t("go_back")}
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  handleLogout();
                }}
                className={`flex-1 py-3 text-white rounded-xl font-bold transition-all shadow-lg ${
                  settings.accentColor === "orange"
                    ? "bg-orange-600 hover:bg-orange-700 shadow-orange-600/20"
                    : settings.accentColor === "blue"
                      ? "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
                      : settings.accentColor === "green"
                        ? "bg-green-600 hover:bg-green-700 shadow-green-600/20"
                        : settings.accentColor === "purple"
                          ? "bg-purple-600 hover:bg-purple-700 shadow-purple-600/20"
                          : settings.accentColor === "red"
                            ? "bg-red-600 hover:bg-red-700 shadow-red-600/20"
                            : settings.accentColor === "pink"
                              ? "bg-pink-600 hover:bg-pink-700 shadow-pink-600/20"
                              : settings.accentColor === "teal"
                                ? "bg-teal-600 hover:bg-teal-700 shadow-teal-600/20"
                                : settings.accentColor === "cyan"
                                  ? "bg-cyan-600 hover:bg-cyan-700 shadow-cyan-600/20"
                                  : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20"
                }`}
              >
                {t("logout")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unsaved Changes Warning Modal */}
      {showUnsavedModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div
            className={`max-w-md w-full rounded-3xl p-8 shadow-2xl border border-yellow-500/30 animate-in zoom-in-95 duration-200 ${
              settings.theme === "dark"
                ? "bg-neutral-900"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6 mx-auto">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
            <h3
              className={`text-2xl font-bold mb-4 text-center ${
                settings.theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Unsaved Changes
            </h3>
            <p
              className={`text-center ${
                settings.theme === "dark" ? "text-neutral-400" : "text-gray-500"
              } mb-8`}
            >
              You have unsaved changes in Settings. If you leave now, they will
              be lost.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowUnsavedModal(false);
                  setIsSettingsDirty(false);
                  setPreviewAccent(null);
                  if (pendingMode) setMode(pendingMode);
                  setPendingMode(null);
                }}
                className="w-full py-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-yellow-900/20"
              >
                Discard & Leave
              </button>
              <button
                onClick={() => {
                  setShowUnsavedModal(false);
                  setPendingMode(null);
                }}
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  settings.theme === "dark"
                    ? "bg-neutral-800 text-white hover:bg-neutral-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                Stay & Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Deletion Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div
            className={`max-w-md w-full rounded-3xl p-8 shadow-2xl border border-red-500/30 animate-in zoom-in-95 duration-200 ${
              isDark ? "bg-neutral-900" : "bg-white border-gray-200"
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 mx-auto">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3
              className={`text-2xl font-bold mb-4 text-center ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("delete_account_confirm_title")}
            </h3>
            <p
              className={`text-center ${
                isDark ? "text-neutral-400" : "text-gray-500"
              } mb-8`}
            >
              {t("delete_account_confirm_text")}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDeleteAccount}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-900/20"
              >
                {t("yes_delete")}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  isDark
                    ? "bg-neutral-800 text-white hover:bg-neutral-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // Simple Performance Monitor for elite optimization
  useEffect(() => {
    const perfData = window.performance.getEntriesByType(
      "navigation",
    )[0] as any;
    if (perfData) {
      console.log(
        `[X10 OPTIMIZED] Load Time: ${perfData.loadEventEnd - perfData.startTime}ms`,
      );
      console.log(
        `[X10 OPTIMIZED] DOM Ready: ${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`,
      );
    }
  }, []);

  // Main content renderer to ensure common wrappers are always present
  const renderContent = () => {
    return (
      <Suspense fallback={<LoadingFallback />}>
        {(() => {
          if (viewState === "LANDING") {
            if (mode === AppMode.PRIVACY)
              return (
                <PrivacyPolicy onBack={() => setMode(AppMode.DASHBOARD)} />
              );
            if (mode === AppMode.TERMS)
              return (
                <TermsOfService onBack={() => setMode(AppMode.DASHBOARD)} />
              );
            if (mode === AppMode.COOKIES)
              return <CookiePolicy onBack={() => setMode(AppMode.DASHBOARD)} />;
            if (mode === AppMode.SECURITY)
              return (
                <SecurityPolicy onBack={() => setMode(AppMode.DASHBOARD)} />
              );
            if (mode === AppMode.ABOUT)
              return (
                <AboutPage
                  themeMode={settings.theme}
                  accentColor={settings.accentColor}
                  onBack={() => setMode(AppMode.DASHBOARD)}
                />
              );
            if (mode === AppMode.BLOG)
              return (
                <BlogPage
                  themeMode={settings.theme}
                  accentColor={settings.accentColor}
                  onBack={() => setMode(AppMode.DASHBOARD)}
                />
              );
            if (mode === AppMode.CONTACT)
              return (
                <ContactPage
                  themeMode={settings.theme}
                  accentColor={settings.accentColor}
                  onBack={() => setMode(AppMode.DASHBOARD)}
                />
              );

            return (
              <>
                <LandingPage
                  onGetStarted={handleGetStarted}
                  onLegalClick={(legalMode) => setMode(legalMode)}
                />
                <CookieConsent
                  onAcceptAll={() => console.log("All cookies accepted")}
                  onRejectAll={() =>
                    console.log("Non-essential cookies rejected")
                  }
                  onSavePreferences={(prefs) =>
                    console.log("Cookie preferences saved:", prefs)
                  }
                />
              </>
            );
          }

          if (viewState === "RESET_PASSWORD") {
            return (
              <ResetPassword
                oobCode={resetToken}
                onNavigateHome={() => setViewState("LANDING")}
                notify={notify}
              />
            );
          }

          if (viewState === "AUTH") {
            return (
              <Auth
                onLogin={handleLogin}
                onBack={() => setViewState("LANDING")}
                notify={notify}
              />
            );
          }

          if (viewState === "APP" && !user) {
            return <LoadingFallback />;
          }

          return (
            <div
              className={`min-h-screen flex flex-col font-sans selection-accent relative overflow-x-hidden ${rootClass}`}
            >
              {/* Persistent Premium Background Elements */}
              {isDark && (
                <>
                  <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(234,88,12,0.03)_0%,transparent_50%)] pointer-events-none" />
                  <div className="fixed bottom-0 right-0 w-[800px] h-[800px] bg-blue-600/[0.02] blur-[150px] rounded-full pointer-events-none" />
                </>
              )}
              {!isFocusMode && mode !== AppMode.SHOP && (
                <Navigation
                  currentMode={mode}
                  setMode={handleModeChange}
                  isMobileMenuOpen={isMobileMenuOpen}
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
                  user={user}
                  onLogout={() => setShowLogoutConfirm(true)}
                  accentColor={previewAccent || settings.accentColor}
                  themeMode={settings.theme}
                  language={settings.language}
                />
              )}

              <main
                className={`flex-1 flex flex-col min-w-0 relative ${
                  isFocusMode || mode === AppMode.SHOP
                    ? "pt-0"
                    : "pt-24 md:pt-28"
                } ${isDark ? "bg-neutral-950" : "bg-gray-50"}`}
              >
                <PageTransition
                  mode={mode}
                  className="flex-1 flex flex-col relative"
                >
                  {mode === AppMode.DASHBOARD && (
                    <Dashboard
                      user={user}
                      scoreData={scoreData}
                      rank={currentRank}
                      accentColor={previewAccent || settings.accentColor}
                      themeMode={settings.theme}
                      language={settings.language}
                      setMode={handleModeChange}
                      sessionDistance={sessionDistance}
                    />
                  )}

                  {mode === AppMode.CHAT && (
                    <ChatInterface
                      messages={messages}
                      setMessages={setMessages}
                      saveHistory={saveHistory}
                      userProfile={user}
                      scoreData={scoreData}
                      allSessions={allSessions}
                      onSaveScore={handleAddScore}
                      onTokenUsage={handleTokenUsage}
                      onResetChat={handleResetChat}
                      onGoToUpgrade={() =>
                        handleModeChange(AppMode.SUBSCRIPTION)
                      }
                      accentColor={previewAccent || settings.accentColor}
                      themeMode={settings.theme}
                      nickname={settings.nickname}
                      onImageGenerated={handleImageGenerated}
                      onNavigate={handleModeChange}
                      onExercisePlanPreload={(plan) => {
                        setPreloadedPlan(plan);
                        handleModeChange(AppMode.EXERCISE);
                      }}
                      onThemeChange={(t) =>
                        handleUpdateSettings({ ...settings, theme: t })
                      }
                      onLogout={() => setShowLogoutConfirm(true)}
                      isFocusMode={isFocusMode}
                      onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
                      language={settings.language}
                      customInstructions={settings.aiInstructions}
                      aiPersonality={settings.aiPersonality}
                    />
                  )}

                  {mode === AppMode.CALCULATOR && (
                    <CalculatorView
                      onSaveScore={handleAddScore}
                      onSaveHistory={saveHistory}
                      onBack={() => setMode(AppMode.DASHBOARD)}
                      accentColor={settings.accentColor}
                      themeMode={settings.theme}
                      notify={notify}
                      sessionDistance={sessionDistance}
                      setSessionDistance={setSessionDistance}
                      podiums={user?.stats?.podiumFinishes || 0}
                      onAddPodium={handleAddPodium}
                    />
                  )}

                  {mode === AppMode.FORM_ANALYSIS && (
                    <AnalysisView
                      type="FORM"
                      themeMode={settings.theme}
                      accentColor={settings.accentColor}
                    />
                  )}

                  {mode === AppMode.EXERCISE &&
                    (user?.subscriptionTier !== "Free" ? (
                      <ExerciseView
                        themeMode={settings.theme}
                        accentColor={settings.accentColor}
                        onSaveToHistory={saveHistory}
                        preloadedPlan={preloadedPlan}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center p-6 text-center">
                        <div
                          className={`max-w-md p-8 rounded-3xl border ${
                            isDark
                              ? "bg-neutral-900 border-neutral-800"
                              : "bg-white border-gray-200 shadow-xl"
                          }`}
                        >
                          <h2
                            className={`text-2xl font-bold mb-4 ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Premium Feature Locked 🔒
                          </h2>
                          <p
                            className={`mb-6 ${
                              isDark ? "text-neutral-400" : "text-gray-600"
                            }`}
                          >
                            {t("exercise_plan_locked")}
                          </p>
                          <button
                            onClick={() => setMode(AppMode.SUBSCRIPTION)}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"
                          >
                            {t("upgrade_now")}
                          </button>
                        </div>
                      </div>
                    ))}

                  {mode === AppMode.IMAGE_GEN && (
                    <ImageGenView
                      user={user}
                      onUpgrade={() => setMode(AppMode.SUBSCRIPTION)}
                      themeMode={settings.theme}
                      accentColor={settings.accentColor}
                      onImageGenerated={handleImageGenerated}
                    />
                  )}

                  {mode === AppMode.SUBSCRIPTION && (
                    <SubscriptionView
                      currentTier={user?.subscriptionTier || "Free"}
                      onUpgrade={handleSubscriptionUpgrade}
                      tokenLimit={user?.tokenLimit || 20000}
                      themeMode={settings.theme}
                      accentColor={settings.accentColor}
                      isGuest={!user?.email}
                    />
                  )}

                  {mode === AppMode.REPORT_BUG && (
                    <ReportBug
                      notify={notify}
                      themeMode={settings.theme}
                      accentColor={settings.accentColor}
                    />
                  )}

                  {mode === AppMode.HISTORY && (
                    <HistoryView
                      onLoadSession={loadSession}
                      themeMode={settings.theme}
                      accentColor={settings.accentColor}
                      notify={notify}
                    />
                  )}

                  {mode === AppMode.SETTINGS && (
                    <Settings
                      currentSettings={settings}
                      currentUser={user}
                      onUpdateSettings={handleUpdateSettings}
                      onUpdateUser={(u) => {
                        setUser(u);
                        syncUserToFirebase(u);
                      }}
                      onSave={() => setMode(AppMode.DASHBOARD)}
                      onDeleteAccount={() => setShowDeleteConfirm(true)}
                      notify={notify}
                      onNavigate={handleModeChange}
                      onDirtyChange={setIsSettingsDirty}
                      onPreviewTheme={setPreviewAccent}
                    />
                  )}

                  {mode === AppMode.SHORTCUTS && (
                    <ShortcutsView
                      onBackendNavigate={setMode}
                      isDark={settings.theme === "dark"}
                      language={settings.language}
                      shortcuts={settings.shortcuts}
                      onUpdateShortcuts={(s: any) =>
                        handleUpdateSettings({ ...settings, shortcuts: s })
                      }
                    />
                  )}

                  {mode === AppMode.LEADERBOARD && (
                    <LeaderboardView
                      currentUser={user}
                      currentUserScoreData={scoreData}
                      publicProfile={settings.publicProfile}
                      themeMode={settings.theme}
                      accentColor={settings.accentColor}
                    />
                  )}

                  {mode === AppMode.SCHEDULE && (
                    <ScheduleView
                      themeMode={settings.theme}
                      accentColor={settings.accentColor}
                      onBack={() => setMode(AppMode.DASHBOARD)}
                    />
                  )}

                  {mode === AppMode.NEWS && (
                    <NewsView
                      themeMode={settings.theme}
                      accentColor={settings.accentColor}
                    />
                  )}

                  {mode === AppMode.BLOG && (
                    <BlogPage
                      themeMode={settings.theme}
                      accentColor={settings.accentColor}
                    />
                  )}
                  {mode === AppMode.ABOUT && (
                    <AboutPage
                      themeMode={settings.theme}
                      accentColor={settings.accentColor}
                    />
                  )}
                  {mode === AppMode.CONTACT && (
                    <ContactPage
                      themeMode={settings.theme}
                      accentColor={settings.accentColor}
                    />
                  )}

                  {mode === AppMode.SHOP && (
                    <ShopView
                      user={user}
                      onExit={() => setMode(AppMode.DASHBOARD)}
                      onOpenSettings={() => setMode(AppMode.SETTINGS)}
                      themeMode={settings.theme}
                      accentColor={settings.accentColor}
                    />
                  )}
                </PageTransition>
              </main>
            </div>
          );
        })()}
      </Suspense>
    );
  };

  return (
    <>
      <CustomCursor themeMode={settings.theme} />
      <GlobalStyles />
      {renderOverlays()}
      {renderContent()}
    </>
  );
};

export default App;
