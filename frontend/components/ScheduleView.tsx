import * as React from "react";
import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Target,
  Activity,
  Plus,
  ChevronRight,
  CheckCircle2,
  Trash2,
  ArrowLeft,
  Search,
  Wrench,
  Brain,
} from "lucide-react";

export type ScheduleType = "Scoring" | "Exercise" | "Equipment" | "Mental";

interface ScheduleItem {
  id: string;
  type: ScheduleType;
  title: string;
  date: string;
  time: string;
  details: string;
  completed: boolean;
  cancelled: boolean;
}

interface ScheduleViewProps {
  onBack: () => void;
  themeMode?: "dark" | "light";
  accentColor?: string;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({
  onBack,
  themeMode = "dark",
  accentColor = "orange",
}) => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem("x10minds_schedules");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever schedules change
  React.useEffect(() => {
    localStorage.setItem("x10minds_schedules", JSON.stringify(schedules));
  }, [schedules]);

  // Auto-cancel logic
  React.useEffect(() => {
    const checkExpiry = () => {
      const now = new Date();
      setSchedules((prev) =>
        prev.map((s) => {
          if (!s.completed && !s.cancelled && s.date && s.time) {
            const scheduleTime = new Date(`${s.date}T${s.time}`);
            if (now > scheduleTime) {
              return { ...s, cancelled: true };
            }
          }
          return s;
        }),
      );
    };

    checkExpiry();
    const interval = setInterval(checkExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newSchedule, setNewSchedule] = useState<Partial<ScheduleItem>>({
    type: "Scoring",
    title: "",
    date: "",
    time: "",
    details: "",
  });

  const isDark = themeMode === "dark";
  const bgMain = isDark
    ? "bg-neutral-950 text-white"
    : "bg-gray-50 text-gray-900";
  const bgCard = isDark
    ? "bg-neutral-900/40 border-white/5"
    : "bg-white border-gray-200 shadow-xl";
  const textSub = isDark ? "text-neutral-500" : "text-gray-500";
  const inputBg = isDark
    ? "bg-black/30 border-white/10 text-white"
    : "bg-gray-100 border-gray-200 text-gray-900";
  const modalBg = isDark
    ? "bg-neutral-900 border-white/10"
    : "bg-white border-gray-200";

  const getAccentClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-600 hover:bg-blue-500",
      green: "bg-green-600 hover:bg-green-500",
      purple: "bg-purple-600 hover:bg-purple-500",
      red: "bg-red-600 hover:bg-red-500",
      pink: "bg-pink-600 hover:bg-pink-500",
      teal: "bg-teal-600 hover:bg-teal-500",
      cyan: "bg-cyan-600 hover:bg-cyan-500",
      indigo: "bg-indigo-600 hover:bg-indigo-500",
      orange: "bg-[#FFD700] hover:bg-[#FDB931]",
    };
    return colorMap[color] || colorMap.orange;
  };

  const activeAccent = getAccentClass(accentColor);
  const textColors: Record<string, string> = {
    blue: "text-blue-500",
    green: "text-green-500",
    purple: "text-purple-500",
    red: "text-red-500",
    pink: "text-pink-500",
    teal: "text-teal-500",
    cyan: "text-cyan-500",
    indigo: "text-indigo-500",
    orange: "text-[#FFD700]",
  };
  const accentText = textColors[accentColor] || textColors.orange;

  const toggleComplete = (id: string) => {
    setSchedules(
      schedules.map((s) =>
        s.id === id ? { ...s, completed: !s.completed, cancelled: false } : s,
      ),
    );
  };

  const deleteSchedule = (id: string) => {
    setSchedules(schedules.filter((s) => s.id !== id));
  };

  const handleAdd = () => {
    if (newSchedule.title && newSchedule.date) {
      setSchedules([
        ...schedules,
        {
          ...(newSchedule as ScheduleItem),
          id: Math.random().toString(36).substr(2, 9),
          completed: false,
          cancelled: false,
        },
      ]);
      setShowAddModal(false);
      setNewSchedule({
        type: "Scoring",
        title: "",
        date: "",
        time: "",
        details: "",
      });
    }
  };

  return (
    <div
      className={`min-h-screen p-4 md:p-8 font-sans selection:bg-[#FFD700]/30 relative overflow-x-hidden ${bgMain}`}
    >
      {/* Dynamic Background Blurs - Only for dark mode effectively */}
      {isDark && (
        <>
          <div className="fixed -top-40 -left-40 w-96 h-96 bg-[#FFD700]/5 blur-[120px] rounded-full animate-pulse pointer-events-none" />
          <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] rounded-full animate-pulse delay-700 pointer-events-none" />
        </>
      )}

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className={`p-3 rounded-2xl border transition-all ${isDark ? "bg-white/5 hover:bg-white/10 border-white/5" : "bg-gray-100 hover:bg-gray-200 border-gray-200"}`}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1
                className={`text-4xl font-black font-orbitron tracking-tight uppercase ${isDark ? "bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500" : "text-gray-900"}`}
              >
                Training Schedule
              </h1>
              <p
                className={`${textSub} text-sm mt-1 uppercase tracking-widest font-bold`}
              >
                Plan your path to perfection
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className={`group flex items-center gap-2 px-8 py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-95 text-white ${activeAccent}`}
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Add New Session
          </button>
        </header>

        {/* Filters / Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <div className={`p-6 rounded-[32px] backdrop-blur-3xl ${bgCard}`}>
            <span
              className={`text-xs font-bold uppercase tracking-widest ${textSub}`}
            >
              Total Sessions
            </span>
            <div className="text-4xl font-black mt-1">{schedules.length}</div>
          </div>
          <div className={`p-6 rounded-[32px] backdrop-blur-3xl ${bgCard}`}>
            <span className="text-xs font-bold text-green-500 uppercase tracking-widest">
              Completed
            </span>
            <div className="text-4xl font-black mt-1 text-green-500">
              {schedules.filter((s) => s.completed).length}
            </div>
          </div>
          <div className={`p-6 rounded-[32px] backdrop-blur-3xl ${bgCard}`}>
            <span
              className={`text-xs font-bold uppercase tracking-widest ${accentText}`}
            >
              Upcoming
            </span>
            <div className={`text-4xl font-black mt-1 ${accentText}`}>
              {schedules.filter((s) => !s.completed).length}
            </div>
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          {schedules.length === 0 ? (
            <div
              className={`py-32 flex flex-col items-center justify-center rounded-[40px] border border-dashed ${isDark ? "bg-neutral-900/20 border-white/5 text-neutral-600" : "bg-gray-50 border-gray-300 text-gray-400"}`}
            >
              <CalendarIcon className="w-16 h-16 mb-6 opacity-10" />
              <p className="text-lg font-medium">Your schedule is empty</p>
              <button
                onClick={() => setShowAddModal(true)}
                className={`mt-4 hover:underline ${accentText}`}
              >
                Create your first training session
              </button>
            </div>
          ) : (
            schedules.map((item, i) => (
              <div
                key={item.id}
                className={`group p-6 rounded-[32px] border transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6
                    ${
                      item.completed
                        ? "bg-neutral-900/20 border-green-500/10 grayscale-[0.8] opacity-60"
                        : item.cancelled
                          ? "bg-red-950/20 border-red-500/20 grayscale-[0.5] opacity-70"
                          : `${bgCard} hover:border-[#FFD700]/20 hover:shadow-2xl`
                    }
                   `}
              >
                <div className="flex items-start gap-5">
                  <div
                    className={`p-4 rounded-2xl flex-shrink-0 transition-colors
                         ${
                           item.type === "Scoring"
                             ? "bg-[#FFD700]/10 text-[#FFD700]"
                             : item.type === "Exercise"
                               ? "bg-blue-500/10 text-blue-500"
                               : item.type === "Equipment"
                                 ? "bg-purple-500/10 text-purple-500"
                                 : "bg-green-500/10 text-green-500"
                         }`}
                  >
                    {item.type === "Scoring" ? (
                      <Target className="w-6 h-6" />
                    ) : item.type === "Exercise" ? (
                      <Activity className="w-6 h-6" />
                    ) : item.type === "Equipment" ? (
                      <Wrench className="w-6 h-6" />
                    ) : (
                      <Brain className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3
                        className={`text-xl font-bold ${
                          item.completed
                            ? "line-through text-neutral-400"
                            : item.cancelled
                              ? "text-red-400 opacity-50"
                              : isDark
                                ? "text-white"
                                : "text-gray-900"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <span
                        className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tighter
                                ${
                                  item.completed
                                    ? "bg-green-500/10 text-green-500"
                                    : item.cancelled
                                      ? "bg-red-500/10 text-red-500"
                                      : item.type === "Scoring"
                                        ? "bg-[#FFD700]/10 text-[#FFD700]"
                                        : item.type === "Exercise"
                                          ? "bg-blue-500/10 text-blue-500"
                                          : item.type === "Equipment"
                                            ? "bg-purple-500/10 text-purple-500"
                                            : "bg-green-500/10 text-green-500"
                                }`}
                      >
                        {item.cancelled && !item.completed
                          ? "Cancelled"
                          : item.type}
                      </span>
                    </div>
                    <div
                      className={`flex flex-wrap items-center gap-4 text-sm ${textSub}`}
                    >
                      <span className="flex items-center gap-1.5">
                        <CalendarIcon className="w-4 h-4" /> {item.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> {item.time}
                      </span>
                    </div>
                    <p
                      className={`mt-3 text-sm max-w-xl transition-colors ${
                        item.cancelled
                          ? "text-red-900/40"
                          : isDark
                            ? "text-neutral-400 group-hover:text-neutral-300"
                            : "text-gray-500 group-hover:text-gray-700"
                      }`}
                    >
                      {item.details}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {!item.cancelled && (
                    <button
                      onClick={() => toggleComplete(item.id)}
                      className={`p-4 rounded-2xl border transition-all active:scale-90
                           ${
                             item.completed
                               ? "bg-green-500/10 border-green-500/20 text-green-500"
                               : `${isDark ? "bg-white/5 border-white/5" : "bg-gray-100 border-gray-200"} hover:bg-green-500/5 hover:border-green-500/30 text-neutral-400 hover:text-green-500`
                           }`}
                    >
                      <CheckCircle2 className="w-6 h-6" />
                    </button>
                  )}
                  {item.cancelled && !item.completed && (
                    <div className="p-4 rounded-2xl bg-red-500/5 text-red-500/30 border border-red-500/10">
                      <Clock className="w-6 h-6 animate-pulse" />
                    </div>
                  )}
                  <button
                    onClick={() => deleteSchedule(item.id)}
                    className={`p-4 border hover:bg-red-500/10 hover:border-red-500/20 rounded-2xl text-neutral-500 hover:text-red-500 transition-all active:scale-90 ${isDark ? "bg-white/5 border-white/5" : "bg-gray-100 border-gray-200"}`}
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          <div
            className={`relative ${modalBg} rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col`}
          >
            <div
              className={`p-8 border-b ${isDark ? "border-white/5" : "border-gray-200"} shrink-0`}
            >
              <h2
                className={`text-2xl font-bold flex items-center gap-3 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                <Plus className={accentText} />
                New Training Session
              </h2>
              <p className={`${textSub} text-sm mt-1`}>
                Fill in the details for your practice
              </p>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["Scoring", "Exercise", "Equipment", "Mental"].map((t) => (
                  <button
                    key={t}
                    onClick={() =>
                      setNewSchedule({ ...newSchedule, type: t as any })
                    }
                    className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2
                         ${
                           newSchedule.type === t
                             ? `${
                                 t === "Scoring"
                                   ? "bg-[#FFD700] border-[#FFD700] text-black"
                                   : t === "Exercise"
                                     ? "bg-blue-600 border-blue-500"
                                     : t === "Equipment"
                                       ? "bg-purple-600 border-purple-500"
                                       : "bg-emerald-600 border-emerald-500"
                               } text-white`
                             : `${isDark ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-gray-50 border-gray-200 hover:bg-gray-100"} text-neutral-400`
                         }`}
                  >
                    {t === "Scoring" ? (
                      <Target className="w-5 h-5" />
                    ) : t === "Exercise" ? (
                      <Activity className="w-5 h-5" />
                    ) : t === "Equipment" ? (
                      <Wrench className="w-5 h-5" />
                    ) : (
                      <Brain className="w-5 h-5" />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-center">
                      {t === "Equipment" ? "Equip." : t}
                    </span>
                  </button>
                ))}
              </div>

              <div>
                <label
                  className={`block text-xs font-bold ${textSub} uppercase tracking-widest mb-2 ml-1`}
                >
                  Session Title
                </label>
                <input
                  type="text"
                  value={newSchedule.title}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, title: e.target.value })
                  }
                  className={`w-full rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 ${inputBg}`}
                  placeholder="e.g. 70m Olympic Round"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-xs font-bold ${textSub} uppercase tracking-widest mb-2 ml-1`}
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    value={newSchedule.date}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, date: e.target.value })
                    }
                    className={`w-full rounded-2xl px-5 py-4 focus:outline-none ${inputBg}`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-xs font-bold ${textSub} uppercase tracking-widest mb-2 ml-1`}
                  >
                    Time
                  </label>
                  <input
                    type="time"
                    value={newSchedule.time}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, time: e.target.value })
                    }
                    className={`w-full rounded-2xl px-5 py-4 focus:outline-none ${inputBg}`}
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-xs font-bold ${textSub} uppercase tracking-widest mb-2 ml-1`}
                >
                  Notes / Details
                </label>
                <textarea
                  value={newSchedule.details}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, details: e.target.value })
                  }
                  rows={3}
                  className={`w-full rounded-2xl px-5 py-4 focus:outline-none resize-none ${inputBg}`}
                  placeholder="Special focus, wind conditions, etc."
                />
              </div>
            </div>

            <div
              className={`p-8 flex gap-4 shrink-0 border-t ${isDark ? "bg-black/20 border-white/5" : "bg-gray-50 border-gray-200"}`}
            >
              <button
                onClick={() => setShowAddModal(false)}
                className={`flex-1 py-4 rounded-2xl font-bold transition-all ${isDark ? "bg-white/5 hover:bg-white/10 text-white" : "bg-white hover:bg-gray-100 text-gray-900 border border-gray-200"}`}
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className={`flex-1 py-4 text-white rounded-2xl font-bold transition-all shadow-xl ${activeAccent}`}
              >
                Add Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleView;
