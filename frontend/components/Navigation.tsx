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
    let timeoutId: NodeJS.Timeout;
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

const Navigation: React.FC<NavigationProps> = React.memo(
  ({
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
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 20);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const t = (key: string) => {
      return (
        translations[language]?.[key] || translations["English"][key] || key
      );
    };

    const mainLinks = [
      { mode: AppMode.DASHBOARD, label: t("home") },
      { mode: AppMode.NEWS, label: "NEWS" },
      { mode: AppMode.SHOP, label: t("shop") },
      { mode: AppMode.LEADERBOARD, label: t("leaderboard") },
      { mode: AppMode.BLOG, label: t("blog") },
      { mode: AppMode.CONTACT, label: t("contact") },
    ];

    const toolsLinks = [
      { mode: AppMode.CHAT, icon: MessageSquare, label: t("chat") },
      { mode: AppMode.CALCULATOR, icon: Calculator, label: t("archery_calc") },
      { mode: AppMode.FORM_ANALYSIS, icon: User, label: t("analysis") },
      { mode: AppMode.TARGET_ANALYSIS, icon: Target, label: t("target") },
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

    const activeLinkStyle =
      "text-yellow-400 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-yellow-400";
    const inactiveLinkStyle = isDark
      ? "text-white/60 hover:text-white"
      : "text-gray-500 hover:text-gray-900";

    return (
      <nav className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
        <div
          className={`absolute top-0 left-0 right-0 h-28 pointer-events-none border-b shadow-2xl transition-all duration-300 ${
            isDark
              ? "bg-neutral-950/95 backdrop-blur-2xl border-white/5"
              : "bg-white/95 backdrop-blur-2xl border-gray-100"
          }`}
        />

        <div className="pt-6 px-4 md:px-8">
          <div
            className={`max-w-7xl mx-auto rounded-full py-2 px-6 flex items-center justify-between pointer-events-auto transition-all duration-500 ${
              isDark
                ? "bg-neutral-900/60 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                : "bg-white/70 backdrop-blur-2xl border border-gray-200 shadow-xl"
            } ${scrolled ? "py-1.5 px-5 scale-[0.98]" : ""}`}
          >
            {/* Logo Section */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handleNavClick(AppMode.DASHBOARD)}
            >
              <div className="relative w-9 h-9 flex items-center justify-center">
                <img
                  src="/images/X10Minds logo.png"
                  alt="logo"
                  className="w-full h-full object-contain filter group-hover:brightness-110 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-6"
                />
              </div>
              <div className="flex flex-col items-start leading-none font-orbitron">
                <span
                  className={`text-[7px] font-black tracking-[0.2em] ${isDark ? "text-white/40" : "text-neutral-400"}`}
                >
                  ARCHERY AI
                </span>
                <div className="flex font-black tracking-tight text-lg uppercase">
                  <span className={isDark ? "text-white" : "text-neutral-900"}>
                    X10
                  </span>
                  <span className="text-yellow-400">MINDS</span>
                  <span
                    className={`ml-1 text-[7px] self-end mb-0.5 ${isDark ? "text-white/40" : "text-neutral-400"}`}
                  >
                    AI
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-10 font-orbitron">
              {mainLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.mode)}
                  className={`text-[9px] font-bold tracking-[0.25em] transition-all duration-200 ${
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
                  className={`flex items-center gap-1.5 text-[11px] font-black tracking-[0.2em] transition-all duration-200 ${
                    toolsLinks.some((t) => t.mode === currentMode)
                      ? "text-yellow-400"
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
                    <p className="text-[10px] font-black tracking-widest text-yellow-400/50 px-4 py-2 border-b border-white/5 mb-2">
                      {t("advanced_tools")}
                    </p>
                    {toolsLinks.map((tool) => (
                      <button
                        key={tool.label}
                        onClick={() => handleNavClick(tool.mode)}
                        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 hover:translate-x-2 ${
                          currentMode === tool.mode
                            ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20"
                            : isDark
                              ? "text-neutral-400 hover:bg-white/5 hover:text-white hover:shadow-lg hover:shadow-white/5"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-lg hover:shadow-gray-200"
                        }`}
                      >
                        <tool.icon
                          className={`w-4 h-4 ${
                            currentMode === tool.mode
                              ? "text-black"
                              : "text-yellow-400"
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
                  className="group relative flex items-center justify-center w-11 h-11 rounded-full bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)] transition-all hover:scale-110 active:scale-95 ring-4 ring-yellow-400/20 overflow-hidden"
                >
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-black font-black text-xs tracking-tighter">
                      {(user?.fullName || t("guest"))
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-black rounded-full z-10"></div>
                </button>

                {profileShouldRender && (
                  <div
                    className={`absolute top-full right-0 mt-5 w-72 rounded-[2.5rem] p-6 border duration-300 ${
                      isProfileOpen
                        ? "animate-in slide-in-from-top-3 fade-in"
                        : "animate-out slide-out-to-top-3 fade-out"
                    } ${
                      isDark
                        ? "bg-black/90 backdrop-blur-3xl border-white/10 shadow-2xl"
                        : "bg-white/95 backdrop-blur-3xl border-gray-200 shadow-2xl"
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-black text-xl shadow-lg ring-4 ring-yellow-400/20 overflow-hidden">
                        {user?.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          (user?.fullName || "U").charAt(0)
                        )}
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
                          <Crown className="w-3 h-3 text-yellow-400" />
                          <p className="text-[10px] text-yellow-400 font-black tracking-[0.2em]">
                            {(user?.subscriptionTier || "Free").toUpperCase()}{" "}
                            {t("member")}
                          </p>
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
                        <Settings className="w-4 h-4 text-yellow-400" />{" "}
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
                        <Clock className="w-4 h-4 text-yellow-400" />{" "}
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
                        <Bug className="w-4 h-4 text-yellow-400" />{" "}
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
                className="lg:hidden p-2 text-white bg-white/5 rounded-full ml-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-yellow-400" />
                ) : (
                  <Menu className="w-6 h-6" />
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
                  isMobileMenuOpen
                    ? "animate-in fade-in"
                    : "animate-out fade-out"
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
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {mainLinks.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => handleNavClick(link.mode)}
                      className={`flex flex-col items-center justify-center p-5 rounded-2xl gap-2 transition-all active:scale-95 ${
                        currentMode === link.mode
                          ? "bg-yellow-400 text-black shadow-xl shadow-yellow-400/30"
                          : isDark
                            ? "bg-white/5 text-white/60 border border-white/5 active:bg-white/10"
                            : "bg-gray-50 text-gray-600 border border-gray-200 active:bg-gray-100"
                      }`}
                    >
                      <span className="text-[10px] font-black tracking-[0.15em]">
                        {link.label}
                      </span>
                    </button>
                  ))}
                </div>
                <div
                  className={`h-px my-6 ${
                    isDark ? "bg-white/10" : "bg-gray-200"
                  }`}
                />
                <p className="text-[10px] font-black tracking-widest text-yellow-400/60 mb-4 uppercase text-center">
                  {t("elite_coaching_tools")}
                </p>
                <div className="space-y-2 pb-4">
                  {toolsLinks.map((tool) => (
                    <button
                      key={tool.label}
                      onClick={() => handleNavClick(tool.mode)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all active:scale-[0.98] ${
                        currentMode === tool.mode
                          ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
                          : isDark
                            ? "bg-white/5 text-white/50 border border-white/5 active:bg-white/10"
                            : "bg-gray-50 text-gray-500 active:bg-gray-100"
                      }`}
                    >
                      <tool.icon className="w-5 h-5 text-yellow-400" />
                      <span className="text-xs font-black uppercase tracking-widest">
                        {tool.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </nav>
    );
  },
);

export default React.memo(Navigation);
