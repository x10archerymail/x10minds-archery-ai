import React from "react";
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
  ArrowUpRight,
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

    const t = (key: string) => {
      return (
        translations[language]?.[key] || translations["English"][key] || key
      );
    };

    const avgScore =
      displayData.length > 0
        ? Math.round(
            displayData.reduce((acc, curr) => acc + curr.score, 0) /
              displayData.length
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
        main: "#ea580c",
        light: "#ea580c1a",
        text: "text-orange-500",
        border: "border-orange-500/10",
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
          return "text-yellow-500";
        case "Silver":
          return "text-gray-400";
        case "Copper":
          return "text-orange-700";
        default:
          return "text-neutral-500";
      }
    };

    return (
      <div className={`p-6 md:p-8 max-w-[2000px] mx-auto ${bgMain}`}>
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="relative flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_15px_#f97316] animate-pulse"></div>
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-orange-500 animate-ping opacity-20"></div>
              </div>
              <h2 className="text-[10px] font-black tracking-[0.4em] text-orange-500 uppercase font-orbitron">
                Advanced General Intelligence <span className="text-white/20 px-2">|</span> <span className="text-emerald-500">Active</span>
              </h2>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white font-orbitron tracking-tighter mb-2 leading-none">
              Welcome,{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-orange-400 to-white animate-gradient-slow drop-shadow-[0_0_15px_rgba(251,146,60,0.3)]">
                {user?.fullName.split(" ")[0] || "Archer"}
              </span>
            </h1>
            <p
              className={`${textSub} flex items-center gap-3 mt-2 font-medium tracking-wide text-sm opacity-80`}
            >
              System Core ENGAGED <span className="w-1 h-1 rounded-full bg-white/20"></span> Performance Optimized for Excellence.
            </p>
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
            className={`${cardBg} p-6 rounded-[2.5rem] border shadow-xl relative overflow-hidden group transition-all duration-500 hover:translate-y-[-8px] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] hover:border-orange-500/30`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-all transform group-hover:scale-125 group-hover:rotate-12 duration-1000">
              <Award className={`w-36 h-36 ${getRankColor(rank)}`} />
            </div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-colors"></div>
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
                rank
              )}`}
            >
              {rank}
            </div>
            <div className={`text-xs font-medium relative z-10 ${textSub}`}>
              Global Status
            </div>
          </div>

          <div
            className={`${cardBg} p-6 rounded-[2.5rem] border shadow-xl relative overflow-hidden group transition-all duration-500 hover:translate-y-[-8px] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] hover:border-orange-500/30`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-all transform group-hover:scale-125 group-hover:rotate-12 duration-1000">
              <img
                src="/images/X10Minds logo.png"
                alt="X10Minds Logo"
                className="w-36 h-36 object-contain grayscale"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-colors"></div>
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
              <div className="p-2.5 bg-red-500/10 rounded-xl border border-red-500/10">
                <ArrowUpRight className="w-5 h-5 text-red-500" />
              </div>
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
            className={`${cardBg} p-6 rounded-3xl border shadow-xl relative overflow-hidden group transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:border-yellow-500/20`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-all transform group-hover:scale-110 group-hover:rotate-6 duration-1000">
              <Calendar className="w-32 h-32 text-yellow-500" />
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2.5 bg-yellow-500/10 rounded-xl border border-yellow-500/10">
                <Activity className="w-5 h-5 text-yellow-500" />
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
            className={`${cardBg} p-6 rounded-3xl border shadow-xl relative overflow-hidden group transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:border-amber-500/20`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30">
              <Award className="w-32 h-32 text-amber-500" />
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/10">
                <Trophy className="w-5 h-5 text-amber-500" />
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
              <div className="w-1.5 h-6 bg-yellow-500 rounded-full"></div>
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
                      itemStyle={{ color: "#fbbf24", fontWeight: "bold" }}
                      labelStyle={{
                        color: isDark ? "#a3a3a3" : "#6b7280",
                        marginBottom: "0.5rem",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="xCount"
                      stroke="#eab308"
                      strokeWidth={4}
                      dot={{
                        r: 6,
                        fill: isDark ? "#171717" : "#fff",
                        strokeWidth: 3,
                        stroke: "#eab308",
                      }}
                      activeDot={{ r: 8, fill: "#eab308", stroke: "#fff" }}
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
            <div
              onClick={() => setMode("SCHEDULE")}
              className={`${cardBg} p-8 rounded-3xl border relative overflow-hidden group hover:border-orange-500/30 transition-all cursor-pointer bg-gradient-to-br from-neutral-900/40 to-orange-900/10 col-span-1 md:col-span-2 lg:col-span-3 min-h-[200px] flex items-center justify-center`}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <div className="p-5 bg-orange-500/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <PlusCircle className="w-10 h-10 text-orange-500" />
                </div>
                <h4 className={`text-xl font-bold ${textTitle}`}>
                  Add New Schedule
                </h4>
                <p className="text-sm text-neutral-400 mt-2">
                  Plan your next archery practice or exercise sessions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default Dashboard;
