import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  BarChart2,
  MessageSquare,
  Calculator,
  User,
  Target,
  Dumbbell,
  Trophy,
  Image as ImageIcon,
  CreditCard,
  ShoppingBag,
  Clock,
  Info,
  FileText,
  Bug,
  Settings,
  LogOut,
  Crown,
  Newspaper,
} from "lucide-react";
import { AppMode, UserProfile } from "../types";
import { translations } from "../i18n";

function useDelayUnmount(isMounted: boolean, delayTime: number) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let timeoutId: any;
    if (isMounted && !shouldRender) {
      setShouldRender(true);
    } else if (!isMounted && shouldRender) {
      timeoutId = setTimeout(() => setShouldRender(false), delayTime);
    }
    return () => clearTimeout(timeoutId);
  }, [isMounted, delayTime, shouldRender]);

  return shouldRender;
}

interface NavigationProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  user: UserProfile | null;
  onLogout: () => void;
  accentColor?: string;
  themeMode?: "dark" | "light";
  language?: string;
}

const Navigation: React.FC<NavigationProps> = ({
  currentMode,
  setMode,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  user,
  onLogout,
  accentColor = "orange",
  themeMode = "dark",
  language = "English",
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const isDark = themeMode === "dark";

  const daysUntilExpiry = user?.subscriptionExpires
    ? Math.ceil((user.subscriptionExpires - Date.now()) / (1000 * 60 * 60 * 24))
    : null;
  const isExpiringSoon =
    daysUntilExpiry !== null && daysUntilExpiry <= 10 && daysUntilExpiry > 0;

  const toolsShouldRender = useDelayUnmount(isToolsOpen, 300);
  const profileShouldRender = useDelayUnmount(isProfileOpen, 300);
  const mobileShouldRender = useDelayUnmount(isMobileMenuOpen, 300);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        toolsRef.current &&
        !toolsRef.current.contains(event.target as Node)
      ) {
        setIsToolsOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const t = (key: string) => {
    const lang = language || "English";
    return translations[lang]?.[key] || translations["English"]?.[key] || key;
  };

  const mainLinks = [
    { mode: AppMode.DASHBOARD, label: t("home") },
    { mode: AppMode.NEWS, label: "NEWS" },
    { mode: AppMode.LEADERBOARD, label: t("leaderboard") },
    { mode: AppMode.SHOP, label: t("shop") },
    { mode: AppMode.CONTACT, label: t("contact") },
  ];

  const toolsLinks = [
    { mode: AppMode.CHAT, icon: MessageSquare, label: t("chat") },
    { mode: AppMode.CALCULATOR, icon: Calculator, label: t("archery_calc") },
    { mode: AppMode.FORM_ANALYSIS, icon: User, label: t("smart_analysis") },
    { mode: AppMode.SCHEDULE, icon: Clock, label: "Schedule" },
    { mode: AppMode.EXERCISE, icon: Dumbbell, label: t("exercise") },
    { mode: AppMode.IMAGE_GEN, icon: ImageIcon, label: t("perfect_form") },
    {
      mode: AppMode.SUBSCRIPTION,
      icon: CreditCard,
      label: t("subscription"),
    },
  ];

  const handleNavClick = (mode: AppMode, isExternal?: boolean) => {
    setMode(mode);
    setIsMobileMenuOpen(false);
    setIsToolsOpen(false);
    setIsProfileOpen(false);
  };

  const getThemeStyles = () => {
    switch (accentColor) {
      case "blue":
        return {
          bg: "bg-blue-600",
          text: "text-blue-600",
          border: "border-blue-600",
          shadow: "shadow-blue-600/20",
          glow: "shadow-[0_0_15px_rgba(37,99,235,0.5)]",
          accent: "text-blue-500",
        };
      case "green":
        return {
          bg: "bg-green-600",
          text: "text-green-600",
          border: "border-green-600",
          shadow: "shadow-green-600/20",
          glow: "shadow-[0_0_15px_rgba(22,163,74,0.5)]",
          accent: "text-green-500",
        };
      case "purple":
        return {
          bg: "bg-purple-600",
          text: "text-purple-600",
          border: "border-purple-600",
          shadow: "shadow-purple-600/20",
          glow: "shadow-[0_0_15px_rgba(147,51,234,0.5)]",
          accent: "text-purple-500",
        };
      case "red":
        return {
          bg: "bg-red-600",
          text: "text-red-600",
          border: "border-red-600",
          shadow: "shadow-red-600/20",
          glow: "shadow-[0_0_15px_rgba(220,38,38,0.5)]",
          accent: "text-red-500",
        };
      case "pink":
        return {
          bg: "bg-pink-600",
          text: "text-pink-600",
          border: "border-pink-600",
          shadow: "shadow-pink-600/20",
          glow: "shadow-[0_0_15px_rgba(219,39,119,0.5)]",
          accent: "text-pink-500",
        };
      case "teal":
        return {
          bg: "bg-teal-600",
          text: "text-teal-600",
          border: "border-teal-600",
          shadow: "shadow-teal-600/20",
          glow: "shadow-[0_0_15px_rgba(13,148,136,0.5)]",
          accent: "text-teal-500",
        };
      case "cyan":
        return {
          bg: "bg-cyan-600",
          text: "text-cyan-600",
          border: "border-cyan-600",
          shadow: "shadow-cyan-600/20",
          glow: "shadow-[0_0_15px_rgba(8,145,178,0.5)]",
          accent: "text-cyan-500",
        };
      case "indigo":
        return {
          bg: "bg-indigo-600",
          text: "text-indigo-600",
          border: "border-indigo-600",
          shadow: "shadow-indigo-600/20",
          glow: "shadow-[0_0_15px_rgba(79,70,229,0.5)]",
          accent: "text-indigo-500",
        };
      default:
        return {
          bg: "bg-[#FFD700]",
          text: "text-[#FFD700]",
          border: "border-[#FFD700]",
          shadow: "shadow-[#FFD700]/20",
          glow: "shadow-[0_0_15px_rgba(255,215,0,0.5)]",
          accent: "text-[#FFD700]",
        };
    }
  };

  const themeStyle = getThemeStyles();

  const activeLinkStyle = isDark
    ? `${themeStyle.bg} text-black border ${themeStyle.border} ${themeStyle.glow} font-black`
    : `${themeStyle.bg} text-white border ${themeStyle.border} shadow-lg font-black`;

  const inactiveLinkStyle = isDark
    ? "text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent"
    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-transparent";

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
      <div
        className={`absolute top-0 left-0 right-0 h-28 pointer-events-none border-b shadow-2xl transition-all duration-300 ${
          isDark
            ? "bg-neutral-950/80 backdrop-blur-2xl border-white/5 supports-[backdrop-filter]:bg-neutral-950/60"
            : "bg-white/90 backdrop-blur-2xl border-gray-100"
        }`}
      />

      <div className="pt-6 px-4 md:px-8">
        <div
          className={`max-w-7xl mx-auto rounded-full py-2.5 px-6 flex items-center justify-between pointer-events-auto transition-all duration-500 ${
            isDark
              ? "bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
              : "bg-white/70 backdrop-blur-xl border border-gray-200 shadow-xl"
          } ${scrolled ? "py-2 px-5 scale-[0.98] bg-neutral-900/80" : ""}`}
        >
          {/* Logo Section */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavClick(AppMode.DASHBOARD)}
          >
            <div className="relative w-9 h-9 flex items-center justify-center">
              <img
                src="/images/X10Minds%20logo.png"
                alt="logo"
                className="w-full h-full object-contain filter group-hover:brightness-110 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-6"
              />
            </div>
            <div className="flex font-black tracking-tight text-xl uppercase font-orbitron">
              <span className={isDark ? "text-white" : "text-neutral-900"}>
                X10
              </span>
              <span className={themeStyle.text}>MINDS</span>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-2 font-orbitron">
            {mainLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.mode)}
                className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-[0.2em] transition-all duration-300 ${
                  currentMode === link.mode
                    ? activeLinkStyle
                    : inactiveLinkStyle
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Tools Dropdown */}
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-bold tracking-[0.2em] transition-all duration-300 ${
                  toolsLinks.some((t) => t.mode === currentMode) || isToolsOpen
                    ? activeLinkStyle
                    : inactiveLinkStyle
                }`}
              >
                {t("features")}{" "}
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-300 ${
                    isToolsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {toolsShouldRender && (
                <div
                  className={`absolute top-full right-0 mt-5 w-60 rounded-[2rem] p-3 border duration-300 ${
                    isToolsOpen
                      ? "animate-in slide-in-from-top-3 fade-in"
                      : "animate-out slide-out-to-top-3 fade-out"
                  } ${
                    isDark
                      ? "bg-black/90 backdrop-blur-3xl border-white/10 shadow-2xl"
                      : "bg-white/95 backdrop-blur-3xl border-gray-200 shadow-2xl"
                  }`}
                >
                  <p
                    className={`text-[10px] font-black tracking-widest ${themeStyle.accent}/50 px-4 py-2 border-b border-white/5 mb-2`}
                  >
                    {t("advanced_tools")}
                  </p>
                  {toolsLinks.map((tool) => (
                    <button
                      key={tool.label}
                      onClick={() => handleNavClick(tool.mode)}
                      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 hover:translate-x-2 ${
                        currentMode === tool.mode
                          ? `${themeStyle.bg} ${accentColor === "orange" ? "text-black" : "text-white"} shadow-lg ${themeStyle.shadow}`
                          : isDark
                            ? "text-neutral-400 hover:bg-white/5 hover:text-white hover:shadow-lg hover:shadow-white/5"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-lg hover:shadow-gray-200"
                      }`}
                    >
                      <tool.icon
                        className={`w-4 h-4 ${
                          currentMode === tool.mode
                            ? "text-black"
                            : themeStyle.text
                        }`}
                      />
                      <span className="text-xs font-black uppercase tracking-wider">
                        {tool.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <div className="relative ml-2" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`group relative flex items-center justify-center w-12 h-12 rounded-full border-4 ${isDark ? "border-neutral-800" : "border-gray-200"} ${themeStyle.glow} transition-all hover:scale-110 active:scale-95 overflow-hidden shadow-2xl`}
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full ${themeStyle.bg} flex items-center justify-center`}
                  >
                    <span className="text-black font-black text-xs tracking-tighter">
                      {(user?.fullName || t("guest"))
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-black rounded-full z-10"></div>
                {isExpiringSoon && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-black rounded-full z-20 animate-pulse"></div>
                )}
              </button>

              {profileShouldRender && (
                <div
                  className={`absolute top-full right-0 mt-5 w-80 rounded-[2.5rem] p-6 border duration-300 ${
                    isProfileOpen
                      ? "animate-in slide-in-from-top-3 fade-in"
                      : "animate-out slide-out-to-top-3 fade-out"
                  } ${
                    isDark
                      ? "bg-black/95 backdrop-blur-3xl border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)]"
                      : "bg-white/95 backdrop-blur-3xl border-gray-200 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)]"
                  }`}
                >
                  <div className="relative">
                    {isExpiringSoon && (
                      <div className="absolute -top-10 left-0 right-0 py-2 px-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-pulse mb-6">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <p className="text-[10px] font-black text-red-500 tracking-widest uppercase">
                          Subscription expires in {daysUntilExpiry} days
                        </p>
                      </div>
                    )}

                    <div
                      className={`flex items-center gap-4 mb-6 pb-6 border-b ${isDark ? "border-white/5" : "border-gray-100"}`}
                    >
                      <div
                        className={`w-16 h-16 rounded-3xl bg-gradient-to-tr ${accentColor === "orange" ? "from-yellow-400 to-yellow-600" : `from-${accentColor}-400 to-${accentColor}-600`} p-1 shadow-2xl relative group`}
                      >
                        <div className="w-full h-full rounded-[1.25rem] bg-black overflow-hidden flex items-center justify-center">
                          {user?.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt="Profile"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <span className="text-white font-black text-2xl">
                              {(user?.fullName || "U").charAt(0)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="overflow-hidden">
                        <p
                          className={`font-black text-lg truncate ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {user?.fullName || t("guest")}
                        </p>
                        <div className="flex items-center gap-1">
                          <Crown className={`w-3 h-3 ${themeStyle.accent}`} />
                          <p
                            className={`text-[10px] ${themeStyle.accent} font-black tracking-[0.2em]`}
                          >
                            {(user?.subscriptionTier || "Free").toUpperCase()}{" "}
                            {t("member")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => handleNavClick(AppMode.SETTINGS)}
                      className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all duration-300 hover:translate-x-2 ${
                        isDark
                          ? "text-white/60 hover:bg-white/5 hover:text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Settings className={`w-4 h-4 ${themeStyle.text}`} />{" "}
                      {t("settings").toUpperCase()}
                    </button>
                    <button
                      onClick={() => handleNavClick(AppMode.HISTORY)}
                      className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all duration-300 hover:translate-x-2 ${
                        isDark
                          ? "text-white/60 hover:bg-white/5 hover:text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Clock className={`w-4 h-4 ${themeStyle.accent}`} />{" "}
                      {t("session_history").toUpperCase()}
                    </button>
                    <button
                      onClick={() => handleNavClick(AppMode.REPORT_BUG)}
                      className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all duration-300 hover:translate-x-2 ${
                        isDark
                          ? "text-white/60 hover:bg-white/5 hover:text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Bug className={`w-4 h-4 ${themeStyle.accent}`} />{" "}
                      {t("system_report").toUpperCase()}
                    </button>
                    <div
                      className={`h-px my-4 ${
                        isDark ? "bg-white/5" : "bg-gray-100"
                      }`}
                    ></div>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black tracking-[0.3em] text-red-500 hover:bg-red-500/10 transition-all border border-red-500/20"
                    >
                      <LogOut className="w-4 h-4" />{" "}
                      {t("disconnect").toUpperCase()}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className={`lg:hidden p-2.5 rounded-full ml-2 transition-all ${
                isDark
                  ? "bg-white/5 hover:bg-white/10 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className={`w-5 h-5 ${themeStyle.accent}`} />
              ) : (
                <Menu
                  className={`w-5 h-5 ${isDark ? "text-white" : "text-gray-900"}`}
                />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileShouldRender && (
          <>
            {/* Backdrop */}
            <div
              className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] pointer-events-auto duration-300 ${
                isMobileMenuOpen ? "animate-in fade-in" : "animate-out fade-out"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Menu Panel */}
            <div
              className={`lg:hidden fixed inset-x-4 top-24 bottom-4 rounded-[2rem] p-6 border duration-300 z-[100] pointer-events-auto overflow-y-auto ${
                isMobileMenuOpen
                  ? "animate-in fade-in slide-in-from-top-4"
                  : "animate-out fade-out slide-out-to-top-4"
              } ${
                isDark
                  ? "bg-neutral-950/98 backdrop-blur-3xl border-white/10 shadow-2xl"
                  : "bg-white/98 backdrop-blur-3xl border-gray-200 shadow-2xl"
              }`}
            >
              {/* Main Navigation Links */}
              <div className="mb-6">
                <p
                  className={`text-[10px] font-black tracking-widest mb-3 uppercase ${isDark ? "text-neutral-500" : "text-gray-400"}`}
                >
                  MAIN MENU
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {mainLinks.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => handleNavClick(link.mode)}
                      className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all active:scale-[0.98] ${
                        currentMode === link.mode
                          ? `${themeStyle.bg} text-black ${themeStyle.shadow}`
                          : isDark
                            ? "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200"
                      }`}
                    >
                      <span className="text-xs font-bold tracking-[0.1em] uppercase">
                        {link.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div
                className={`h-px my-6 ${
                  isDark ? "bg-white/10" : "bg-gray-200"
                }`}
              />

              {/* Advanced Tools */}
              <div>
                <p
                  className={`text-[10px] font-black tracking-widest mb-3 uppercase ${isDark ? "text-neutral-500" : "text-gray-400"}`}
                >
                  {t("elite_coaching_tools")}
                </p>
                <div className="grid grid-cols-1 gap-2 pb-4">
                  {toolsLinks.map((tool) => (
                    <button
                      key={tool.label}
                      onClick={() => handleNavClick(tool.mode)}
                      className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all active:scale-[0.98] ${
                        currentMode === tool.mode
                          ? `${themeStyle.bg}/10 ${themeStyle.accent} border ${themeStyle.border}/20`
                          : isDark
                            ? "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5"
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 border border-gray-200"
                      }`}
                    >
                      <tool.icon className={`w-5 h-5 ${themeStyle.accent}`} />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {tool.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default React.memo(Navigation);
