import * as React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Target,
  TrendingUp,
  Calendar,
  PlusCircle,
  Award,
  Activity,
  BarChart2,
  Trophy,
  History,
  Timer,
  Globe,
} from "lucide-react";
import { ScoreData, UserProfile } from "../types";

interface DashboardProps {
  user: UserProfile | null;
  scoreData: ScoreData[];
  rank: string;
  sessionDistance: number;
  accentColor?: string;
  themeMode?: "dark" | "light";
  language?: string;
  setMode: (mode: any) => void;
}

import { translations } from "../i18n";

interface ScheduleItem {
  id: string;
  type: "Scoring" | "Exercise" | "Equipment" | "Mental";
  title: string;
  date: string;
  time: string;
  details: string;
  completed: boolean;
  cancelled: boolean;
}

const Dashboard: React.FC<DashboardProps> = React.memo(
  ({
    user,
    scoreData,
    rank,
    sessionDistance,
    accentColor = "orange",
    themeMode = "dark",
    language = "English",
    setMode,
  }) => {
    const isNewUser = user?.isNew ?? false;
    const displayData = scoreData.length > 0 ? scoreData : [];
    const isDark = themeMode === "dark";

    // Load schedules from localStorage
    const [schedules, setSchedules] = React.useState<ScheduleItem[]>([]);

    React.useEffect(() => {
      const loadSchedules = () => {
        const saved = localStorage.getItem("x10minds_schedules");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setSchedules(parsed);
          } catch (e) {
            console.error("Failed to load schedules:", e);
          }
        }
      };

      loadSchedules();

      // Listen for storage changes
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "x10minds_schedules") {
          loadSchedules();
        }
      };

      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Filter upcoming, non-cancelled, non-completed schedules
    const upcomingSchedules = schedules
      .filter((s) => !s.completed && !s.cancelled)
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time || "00:00"}`).getTime();
        const dateB = new Date(`${b.date}T${b.time || "00:00"}`).getTime();
        return dateA - dateB;
      })
      .slice(0, 3); // Show only the next 3 schedules

    const t = (key: string) => {
      return (
        translations[language]?.[key] || translations["English"][key] || key
      );
    };

    const avgScore =
      displayData.length > 0
        ? Math.round(
            displayData.reduce((acc, curr) => acc + curr.score, 0) /
              displayData.length,
          )
        : 0;

    const sessionsCount = displayData.length;

    const highestScore =
      displayData.length > 0 ? Math.max(...displayData.map((d) => d.score)) : 0;

    const rankProgress = user?.stats?.rankProgress ?? 0;
    const podiumFinishes = user?.stats?.podiumFinishes ?? 0;

    let improvement = 0;
    if (displayData.length >= 2) {
      const first = displayData[0].score;
      const last = displayData[displayData.length - 1].score;
      if (first > 0) {
        improvement = Number((((last - first) / first) * 100).toFixed(1));
      }
    }

    // Theme Definitions
    const colors = {
      orange: {
        main: "#FFD700",
        light: "rgba(255, 215, 0, 0.1)",
        text: "text-[#FFD700]",
        border: "border-[#FFD700]/20",
      },
      blue: {
        main: "#3b82f6",
        light: "#3b82f61a",
        text: "text-blue-500",
        border: "border-blue-500/10",
      },
      green: {
        main: "#22c55e",
        light: "#22c55e1a",
        text: "text-green-500",
        border: "border-green-500/10",
      },
      purple: {
        main: "#a855f7",
        light: "#a855f71a",
        text: "text-purple-500",
        border: "border-purple-500/10",
      },
      red: {
        main: "#ef4444",
        light: "#ef44441a",
        text: "text-red-500",
        border: "border-red-500/10",
      },
      pink: {
        main: "#ec4899",
        light: "#ec48991a",
        text: "text-pink-500",
        border: "border-pink-500/10",
      },
      teal: {
        main: "#14b8a6",
        light: "#14b8a61a",
        text: "text-teal-500",
        border: "border-teal-500/10",
      },
      cyan: {
        main: "#06b6d4",
        light: "#06b6d41a",
        text: "text-cyan-500",
        border: "border-cyan-500/10",
      },
      indigo: {
        main: "#6366f1",
        light: "#6366f11a",
        text: "text-indigo-500",
        border: "border-indigo-500/10",
      },
    };
    const theme = colors[accentColor as keyof typeof colors] || colors.orange;

    // Mode Styles
    const bgMain = isDark
      ? "bg-neutral-950 text-neutral-200"
      : "bg-gray-50 text-gray-700";
    const cardBg = isDark
      ? "bg-neutral-900/40 backdrop-blur-xl border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
      : "bg-white border-gray-200 shadow-sm";
    const cardBgAlt = isDark
      ? "bg-neutral-900/40 backdrop-blur-xl border-white/5 shadow-2xl"
      : "bg-white border-gray-200 shadow-sm";
    const textTitle = isDark ? "text-white" : "text-gray-900";
    const textSub = isDark ? "text-neutral-400" : "text-gray-500";
    const chartGrid = isDark ? "rgba(255, 255, 255, 0.05)" : "#e5e7eb";
    const chartText = isDark ? "#737373" : "#9ca3af";
    const tooltipBg = isDark ? "rgba(23, 23, 23, 0.9)" : "#ffffff";
    const tooltipBorder = isDark ? "rgba(255, 255, 255, 0.1)" : "#e5e7eb";
    const tooltipText = isDark ? "#fff" : "#111827";

    // Rank Colors
    // Rank Colors
    const getRankColor = (r: string) => {
      switch (r) {
        case "Olympic Champion":
        case "Asian Champion":
        case "World Champion":
          return "text-yellow-400";
        case "Diamond":
          return "text-cyan-400";
        case "Platinum":
          return "text-slate-300";
        case "Gold":
          return "text-[#FFD700]";
        case "Silver":
          return "text-gray-400";
        case "Copper":
          return "text-[#FFD700]/70";
        default:
          return "text-neutral-500";
      }
    };

    return (
      <div className={`p-6 md:p-8 max-w-[2000px] mx-auto ${bgMain}`}>
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2"></div>
            <h1 className="flex flex-col mb-4">
              <span
                className={`text-sm md:text-base font-bold tracking-[0.5em] uppercase mb-2 ${isDark ? "text-neutral-500" : "text-gray-400"}`}
              >
                Welcome to X10Minds
              </span>
              <span
                className={`text-5xl md:text-7xl font-black font-orbitron tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-${theme.main} to-white animate-gradient-slow drop-shadow-2xl`}
              >
                {user?.fullName.split(" ")[0] || "Archer"}
              </span>
            </h1>
            <div
              className={`inline-flex items-center gap-3 px-4 py-2 rounded-full border ${theme.border} bg-${accentColor}-500/5 backdrop-blur-sm ${textSub} font-mono text-xs tracking-wider`}
            >
              <div className="relative flex items-center justify-center w-2 h-2">
                <div className="absolute w-full h-full bg-green-500 rounded-full animate-ping opacity-75"></div>
                <div className="relative w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              </div>
              <span>SYSTEM ONLINE</span>
              <span className="w-px h-3 bg-white/10 mx-1"></span>
              <span className={theme.text}>OPTIMIZED FOR PERFORMANCE</span>
            </div>
          </div>
          {!isNewUser && (
            <div
              className={`flex items-center gap-2 border px-5 py-2.5 rounded-xl shadow-lg animate-in slide-in-from-right-5 ${
                isDark
                  ? "bg-gradient-to-r from-neutral-900 to-neutral-800 border-neutral-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <Award className={`w-5 h-5 ${getRankColor(rank)}`} />
              <span className={`text-sm font-medium ${textTitle}`}>
                {t("rank")}:{" "}
                <span className={`${getRankColor(rank)} font-bold`}>
                  {rank}
                </span>
              </span>
            </div>
          )}
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 4xl:grid-cols-6 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div
            className={`${cardBg} p-6 rounded-[2.5rem] border shadow-xl relative overflow-hidden group transition-all duration-500 hover:translate-y-[-8px] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] hover:border-[#FFD700]/30`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-all transform group-hover:scale-125 group-hover:rotate-12 duration-1000">
              <Award className={`w-36 h-36 ${getRankColor(rank)}`} />
            </div>
            <div
              className={`absolute -bottom-10 -left-10 w-32 h-32 bg-${accentColor}-500/10 rounded-full blur-3xl group-hover:bg-${accentColor}-500/20 transition-colors`}
            ></div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div
                className={`p-2.5 rounded-xl border ${theme.border}`}
                style={{ backgroundColor: theme.light }}
              >
                <Trophy className={`w-5 h-5 ${theme.text}`} />
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest font-orbitron opacity-70 ${textSub}`}
              >
                {t("rank")}
              </span>
            </div>
            <div
              className={`text-2xl sm:text-3xl font-bold mb-2 tracking-tight relative z-10 ${getRankColor(
                rank,
              )}`}
            >
              {rank}
            </div>
            <div className={`text-xs font-medium relative z-10 ${textSub}`}>
              Global Status
            </div>
          </div>

          <div
            className={`${cardBg} p-6 rounded-[2.5rem] border shadow-xl relative overflow-hidden group transition-all duration-500 hover:translate-y-[-8px] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] hover:border-[#FFD700]/30`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-all transform group-hover:scale-125 group-hover:rotate-12 duration-1000">
              <img
                src="/images/logo.png"
                alt="X10Minds Logo"
                className="w-36 h-36 object-contain grayscale opacity-20"
              />
            </div>
            <div
              className={`absolute -bottom-10 -left-10 w-32 h-32 bg-${accentColor}-500/10 rounded-full blur-3xl group-hover:bg-${accentColor}-500/20 transition-colors`}
            ></div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div
                className={`p-2.5 rounded-xl border ${theme.border}`}
                style={{ backgroundColor: theme.light }}
              >
                <Target className={`w-5 h-5 ${theme.text}`} />
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest font-orbitron opacity-70 ${textSub}`}
              >
                {t("avg_score")}
              </span>
            </div>
            <div
              className={`text-4xl sm:text-5xl font-bold mb-2 tracking-tight relative z-10 ${textTitle}`}
            >
              {avgScore}
            </div>
            <div className={`text-xs font-medium relative z-10 ${textSub}`}>
              {t("out_of_300")}
            </div>
          </div>

          <div
            className={`${cardBg} p-6 rounded-[2.5rem] border shadow-xl relative overflow-hidden group transition-all duration-500 hover:translate-y-[-8px] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] hover:border-blue-500/30`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-all transform group-hover:scale-125 group-hover:rotate-12 duration-1000">
              <Globe className="w-36 h-36 text-blue-500" />
            </div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div
                className={`p-2.5 rounded-xl border border-blue-500/10 bg-blue-500/10`}
              >
                <Target className={`w-5 h-5 text-blue-500`} />
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest font-orbitron opacity-70 ${textSub}`}
              >
                DISTANCE
              </span>
            </div>
            <div
              className={`text-4xl sm:text-5xl font-bold mb-2 tracking-tight relative z-10 ${textTitle}`}
            >
              {sessionDistance}m
            </div>
            <div className={`text-xs font-medium relative z-10 ${textSub}`}>
              Current Practice
            </div>
          </div>

          <div
            className={`${cardBg} p-6 rounded-[2.5rem] border shadow-xl relative overflow-hidden group transition-all duration-500 hover:translate-y-[-8px] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] hover:border-red-500/30`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-all transform group-hover:scale-125 group-hover:rotate-12 duration-1000">
              <TrendingUp className="w-36 h-36 text-red-500" />
            </div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-colors"></div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2.5 bg-red-500/10 rounded-xl border border-red-500/10"></div>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest font-orbitron opacity-70 ${textSub}`}
              >
                {t("improvement")}
              </span>
            </div>
            <div
              className={`text-4xl sm:text-5xl font-bold mb-2 tracking-tight flex items-baseline gap-2 relative z-10 ${textTitle}`}
            >
              {improvement > 0 ? "+" : ""}
              {improvement}%
            </div>
            <div className={`text-xs font-medium relative z-10 ${textSub}`}>
              {t("all_time")}
            </div>
          </div>

          <div
            className={`${cardBg} p-6 rounded-3xl border shadow-xl relative overflow-hidden group transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:border-[#FFD700]/20`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-all transform group-hover:scale-110 group-hover:rotate-6 duration-1000">
              <Calendar className="w-32 h-32 text-[#FFD700]" />
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div
                className={`p-2.5 bg-${accentColor}-500/10 rounded-xl border ${theme.border}`}
              >
                <Activity className={`w-5 h-5 ${theme.text}`} />
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest font-orbitron opacity-70 ${textSub}`}
              >
                {t("sessions")}
              </span>
            </div>
            <div
              className={`text-4xl sm:text-5xl font-bold mb-2 tracking-tight relative z-10 ${textTitle}`}
            >
              {sessionsCount}
            </div>
            <div className={`text-xs font-medium relative z-10 ${textSub}`}>
              {t("total_logged")}
            </div>
          </div>

          {/* New Stats */}
          <div
            className={`${cardBg} p-6 rounded-3xl border shadow-xl relative overflow-hidden group transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:border-purple-500/20`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30">
              <Trophy className="w-32 h-32 text-purple-500" />
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/10">
                <Award className="w-5 h-5 text-purple-500" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest font-orbitron opacity-70 text-neutral-400">
                Highest Score
              </span>
            </div>
            <div
              className={`text-4xl sm:text-5xl font-bold mb-2 tracking-tight ${textTitle}`}
            >
              {highestScore}
            </div>
            <div className="text-xs font-medium text-neutral-400">
              Personal Best
            </div>
          </div>

          <div
            className={`${cardBg} p-6 rounded-3xl border shadow-xl relative overflow-hidden group transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:border-blue-500/20`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30">
              <TrendingUp className="w-32 h-32 text-blue-500" />
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/10">
                <History className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest font-orbitron opacity-70 text-neutral-400">
                Rank Progress
              </span>
            </div>
            <div
              className={`text-4xl sm:text-5xl font-bold mb-2 tracking-tight ${textTitle}`}
            >
              {rankProgress}%
            </div>
            <div className="text-xs font-medium text-neutral-400">
              To next rank
            </div>
          </div>

          <div
            className={`${cardBg} p-6 rounded-3xl border shadow-xl relative overflow-hidden group transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:border-[#FFD700]/20`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30">
              <Award className="w-32 h-32 text-[#FFD700]" />
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div
                className={`p-2.5 bg-${accentColor}-500/10 rounded-xl border ${theme.border}`}
              >
                <Trophy className={`w-5 h-5 ${theme.text}`} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest font-orbitron opacity-70 text-neutral-400">
                Podiums
              </span>
            </div>
            <div
              className={`text-4xl sm:text-5xl font-bold mb-2 tracking-tight ${textTitle}`}
            >
              {podiumFinishes}
            </div>
            <div className="text-xs font-medium text-neutral-400">
              Total matches
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          <button
            onClick={() => setMode("CALCULATOR")}
            className={`${cardBg} p-4 rounded-2xl border flex items-center gap-4 group hover:border-[#FFD700]/50 transition-all active:scale-95`}
          >
            <div
              className={`p-2.5 rounded-xl bg-[#FFD700]/10 text-[#FFD700] group-hover:scale-110 transition-transform`}
            >
              <Target className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p
                className={`text-xs font-black uppercase tracking-widest ${textTitle}`}
              >
                New Session
              </p>
              <p className="text-[10px] text-neutral-500">Record your scores</p>
            </div>
          </button>

          <button
            onClick={() => setMode("CHAT")}
            className={`${cardBg} p-4 rounded-2xl border flex items-center gap-4 group hover:border-blue-500/50 transition-all active:scale-95`}
          >
            <div
              className={`p-2.5 rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform`}
            >
              <Activity className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p
                className={`text-xs font-black uppercase tracking-widest ${textTitle}`}
              >
                AI Coach
              </p>
              <p className="text-[10px] text-neutral-500">
                Get technical advice
              </p>
            </div>
          </button>

          <button
            onClick={() => setMode("FORM_ANALYSIS")}
            className={`${cardBg} p-4 rounded-2xl border flex items-center gap-4 group hover:border-green-500/50 transition-all active:scale-95`}
          >
            <div
              className={`p-2.5 rounded-xl bg-green-500/10 text-green-500 group-hover:scale-110 transition-transform`}
            >
              <Globe className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p
                className={`text-xs font-black uppercase tracking-widest ${textTitle}`}
              >
                Smart Analysis
              </p>
              <p className="text-[10px] text-neutral-500">Analyze your form</p>
            </div>
          </button>

          <button
            onClick={() => setMode("SHOP")}
            className={`${cardBg} p-4 rounded-2xl border flex items-center gap-4 group hover:border-purple-500/50 transition-all active:scale-95`}
          >
            <div
              className={`p-2.5 rounded-xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform`}
            >
              <History className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p
                className={`text-xs font-black uppercase tracking-widest ${textTitle}`}
              >
                Shop Assets
              </p>
              <p className="text-[10px] text-neutral-500">Browse gear</p>
            </div>
          </button>
        </div>

        {/* Charts Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Score Trend */}
          <div
            className={`${cardBgAlt} p-8 rounded-3xl border shadow-lg relative min-h-[400px] flex flex-col`}
          >
            <h3
              className={`text-xl font-bold mb-8 flex items-center gap-3 ${textTitle}`}
            >
              <div
                className={`w-1.5 h-6 rounded-full`}
                style={{ backgroundColor: theme.main }}
              ></div>
              {t("score_progression")}
            </h3>

            <div className="flex-1 w-full relative">
              {displayData.length === 0 ? (
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center z-10 backdrop-blur-sm rounded-xl border ${
                    isDark
                      ? "bg-neutral-900/80 border-neutral-800/50 text-neutral-500"
                      : "bg-white/80 border-gray-100 text-gray-400"
                  }`}
                >
                  <BarChart2 className="w-16 h-16 mb-4 opacity-20" />
                  <p className="mb-6 text-center max-w-xs font-medium">
                    {t("no_data")}
                  </p>
                  <p className="text-xs">{t("use_calc")}</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={displayData}>
                    <defs>
                      <linearGradient
                        id="colorScore"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={theme.main}
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor={theme.main}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={chartGrid}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      stroke={chartText}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis
                      stroke={chartText}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      domain={["dataMin - 10", "auto"]}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        borderColor: tooltipBorder,
                        borderRadius: "12px",
                        color: tooltipText,
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                      itemStyle={{ color: theme.main, fontWeight: "bold" }}
                      labelStyle={{
                        color: isDark ? "#a3a3a3" : "#6b7280",
                        marginBottom: "0.5rem",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke={theme.main}
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorScore)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* X-Count Trend */}
          <div
            className={`${cardBgAlt} p-8 rounded-3xl border shadow-lg relative min-h-[400px] flex flex-col`}
          >
            <h3
              className={`text-xl font-bold mb-8 flex items-center gap-3 ${textTitle}`}
            >
              <div
                className={`w-1.5 h-6 rounded-full`}
                style={{ backgroundColor: theme.main }}
              ></div>
              {t("consistency")}
            </h3>

            <div className="flex-1 w-full relative">
              {displayData.length === 0 ? (
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center z-10 backdrop-blur-sm rounded-xl border ${
                    isDark
                      ? "bg-neutral-900/80 border-neutral-800/50 text-neutral-500"
                      : "bg-white/80 border-gray-100 text-gray-400"
                  }`}
                >
                  <Target className="w-16 h-16 mb-4 opacity-20" />
                  <p className="font-medium">{t("track_x")}</p>
                  <p className="text-sm mt-2 opacity-50">{t("data_appear")}</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={displayData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={chartGrid}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      stroke={chartText}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis
                      stroke={chartText}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        borderColor: tooltipBorder,
                        borderRadius: "12px",
                        color: tooltipText,
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                      itemStyle={{ color: "#FFD700", fontWeight: "bold" }}
                      labelStyle={{
                        color: isDark ? "#a3a3a3" : "#6b7280",
                        marginBottom: "0.5rem",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="xCount"
                      stroke="#FFD700"
                      strokeWidth={4}
                      dot={{
                        r: 6,
                        fill: isDark ? "#171717" : "#fff",
                        strokeWidth: 3,
                        stroke: "#FFD700",
                      }}
                      activeDot={{ r: 8, fill: "#FFD700", stroke: "#fff" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Schedules Section */}
        <div className="mt-8">
          <h3
            className={`text-2xl font-bold mb-6 flex items-center gap-3 ${textTitle}`}
          >
            <Calendar className={`w-6 h-6 ${theme.text}`} />
            Upcoming Schedules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingSchedules.map((schedule, index) => {
              const typeColors = {
                Scoring: {
                  bg: "from-[#FFD700]/10 to-[#FFD700]/5",
                  border: "border-[#FFD700]/20",
                  text: "text-[#FFD700]",
                  icon: "bg-[#FFD700]/10",
                },
                Exercise: {
                  bg: "from-blue-500/10 to-blue-600/5",
                  border: "border-blue-500/20",
                  text: "text-blue-500",
                  icon: "bg-blue-500/10",
                },
                Equipment: {
                  bg: "from-purple-500/10 to-purple-600/5",
                  border: "border-purple-500/20",
                  text: "text-purple-500",
                  icon: "bg-purple-500/10",
                },
                Mental: {
                  bg: "from-green-500/10 to-green-600/5",
                  border: "border-green-500/20",
                  text: "text-green-500",
                  icon: "bg-green-500/10",
                },
              };
              const colors = typeColors[schedule.type];

              const scheduleDate = new Date(
                `${schedule.date}T${schedule.time || "00:00"}`,
              );
              const now = new Date();
              const isToday =
                scheduleDate.toDateString() === now.toDateString();
              const daysUntil = Math.ceil(
                (scheduleDate.getTime() - now.getTime()) /
                  (1000 * 60 * 60 * 24),
              );

              return (
                <div
                  key={schedule.id}
                  onClick={() => setMode("SCHEDULE")}
                  className={`${cardBg} p-6 rounded-3xl border ${colors.border} relative overflow-hidden group hover:border-opacity-50 transition-all cursor-pointer bg-gradient-to-br ${colors.bg} animate-in fade-in slide-in-from-bottom-4`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all">
                    {schedule.type === "Scoring" ? (
                      <Target className="w-24 h-24" />
                    ) : schedule.type === "Exercise" ? (
                      <Activity className="w-24 h-24" />
                    ) : schedule.type === "Equipment" ? (
                      <Trophy className="w-24 h-24" />
                    ) : (
                      <Timer className="w-24 h-24" />
                    )}
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${colors.icon} ${colors.text} border ${colors.border}`}
                      >
                        {schedule.type}
                      </div>
                      {isToday && (
                        <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse"></div>
                          Today
                        </div>
                      )}
                    </div>

                    <h4
                      className={`text-xl font-bold mb-3 ${textTitle} line-clamp-2`}
                    >
                      {schedule.title}
                    </h4>

                    <div
                      className={`flex flex-col gap-2 text-sm ${textSub} mb-4`}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(schedule.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4" />
                        <span>{schedule.time || "All day"}</span>
                      </div>
                    </div>

                    {schedule.details && (
                      <p className={`text-sm ${textSub} line-clamp-2 italic`}>
                        {schedule.details}
                      </p>
                    )}

                    {!isToday && daysUntil > 0 && (
                      <div
                        className={`mt-4 pt-4 border-t ${isDark ? "border-white/5" : "border-gray-200"} text-xs ${textSub}`}
                      >
                        {daysUntil === 1 ? "Tomorrow" : `In ${daysUntil} days`}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Add New Schedule Card */}
            <div
              onClick={() => setMode("SCHEDULE")}
              className={`${cardBg} p-8 rounded-3xl border relative overflow-hidden group hover:border-[#FFD700]/30 transition-all cursor-pointer bg-gradient-to-br from-neutral-900/40 to-[#FFD700]/10 ${upcomingSchedules.length === 0 ? "col-span-1 md:col-span-2 lg:col-span-3" : ""} min-h-[200px] flex items-center justify-center`}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <div className="p-5 bg-[#FFD700]/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <PlusCircle className="w-10 h-10 text-[#FFD700]" />
                </div>
                <h4 className={`text-xl font-bold ${textTitle}`}>
                  {upcomingSchedules.length === 0
                    ? "Add Your First Schedule"
                    : "Add New Schedule"}
                </h4>
                <p className="text-sm text-neutral-400 mt-2">
                  {upcomingSchedules.length === 0
                    ? "Start planning your training sessions and stay on track"
                    : "Plan your next archery practice or exercise sessions"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default Dashboard;
