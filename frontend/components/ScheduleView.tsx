import React, { useState } from "react";
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
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ onBack }) => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);

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
        })
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

  const toggleComplete = (id: string) => {
    setSchedules(
      schedules.map((s) =>
        s.id === id ? { ...s, completed: !s.completed, cancelled: false } : s
      )
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
    <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-8 font-sans selection:bg-orange-500/30 relative overflow-x-hidden">
      {/* Dynamic Background Blurs */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-orange-600/5 blur-[120px] rounded-full animate-pulse pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] rounded-full animate-pulse delay-700 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-4xl font-black font-orbitron tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500 uppercase">
                Training Schedule
              </h1>
              <p className="text-neutral-500 text-sm mt-1 uppercase tracking-widest font-bold">
                Plan your path to perfection
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="group flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-500 rounded-2xl font-bold shadow-xl shadow-orange-900/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Add New Session
          </button>
        </header>

        {/* Filters / Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <div className="p-6 bg-neutral-900/40 border border-white/5 rounded-[32px] backdrop-blur-3xl">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
              Total Sessions
            </span>
            <div className="text-4xl font-black mt-1">{schedules.length}</div>
          </div>
          <div className="p-6 bg-neutral-900/40 border border-white/5 rounded-[32px] backdrop-blur-3xl">
            <span className="text-xs font-bold text-green-500 uppercase tracking-widest">
              Completed
            </span>
            <div className="text-4xl font-black mt-1 text-green-500">
              {schedules.filter((s) => s.completed).length}
            </div>
          </div>
          <div className="p-6 bg-neutral-900/40 border border-white/5 rounded-[32px] backdrop-blur-3xl">
            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">
              Upcoming
            </span>
            <div className="text-4xl font-black mt-1 text-orange-500">
              {schedules.filter((s) => !s.completed).length}
            </div>
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          {schedules.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center text-neutral-600 bg-neutral-900/20 rounded-[40px] border border-dashed border-white/5">
              <CalendarIcon className="w-16 h-16 mb-6 opacity-10" />
              <p className="text-lg font-medium">Your schedule is empty</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 text-orange-500 hover:underline"
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
                        : "bg-neutral-900/40 border-white/5 hover:border-orange-500/20 hover:bg-neutral-900/60 shadow-xl"
                    }
                   `}
              >
                <div className="flex items-start gap-5">
                  <div
                    className={`p-4 rounded-2xl flex-shrink-0 transition-colors
                         ${
                           item.type === "Scoring"
                             ? "bg-orange-500/10 text-orange-500"
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
                            : "text-white"
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
                                    ? "bg-orange-500/10 text-orange-500"
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
                    <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                      <span className="flex items-center gap-1.5">
                        <CalendarIcon className="w-4 h-4" /> {item.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> {item.time}
                      </span>
                    </div>
                    <p
                      className={`mt-3 text-sm max-w-xl group-hover:text-neutral-300 transition-colors ${
                        item.cancelled ? "text-red-900/40" : "text-neutral-400"
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
                               : "bg-white/5 border-white/5 hover:border-green-500/30 hover:bg-green-500/5 text-neutral-400 hover:text-green-500"
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
                    className="p-4 bg-white/5 border border-white/5 hover:bg-red-500/10 hover:border-red-500/20 rounded-2xl text-neutral-500 hover:text-red-500 transition-all active:scale-90"
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
          <div className="relative bg-neutral-900 border border-white/10 rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            <div className="p-8 border-b border-white/5 shrink-0">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Plus className="text-orange-500" />
                New Training Session
              </h2>
              <p className="text-neutral-400 text-sm mt-1">
                Fill in the details for your practice
              </p>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() =>
                    setNewSchedule({ ...newSchedule, type: "Scoring" })
                  }
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2
                         ${
                           newSchedule.type === "Scoring"
                             ? "bg-orange-600 border-orange-500 text-white"
                             : "bg-white/5 border-white/5 hover:bg-white/10 text-neutral-400"
                         }`}
                >
                  <Target className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-center">
                    Scoring
                  </span>
                </button>
                <button
                  onClick={() =>
                    setNewSchedule({ ...newSchedule, type: "Exercise" })
                  }
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2
                         ${
                           newSchedule.type === "Exercise"
                             ? "bg-blue-600 border-blue-500 text-white"
                             : "bg-white/5 border-white/5 hover:bg-white/10 text-neutral-400"
                         }`}
                >
                  <Activity className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-center">
                    Exercise
                  </span>
                </button>
                <button
                  onClick={() =>
                    setNewSchedule({ ...newSchedule, type: "Equipment" })
                  }
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2
                         ${
                           newSchedule.type === "Equipment"
                             ? "bg-purple-600 border-purple-500 text-white"
                             : "bg-white/5 border-white/5 hover:bg-white/10 text-neutral-400"
                         }`}
                >
                  <Wrench className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-center">
                    Equip.
                  </span>
                </button>
                <button
                  onClick={() =>
                    setNewSchedule({ ...newSchedule, type: "Mental" })
                  }
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2
                         ${
                           newSchedule.type === "Mental"
                             ? "bg-emerald-600 border-emerald-500 text-white"
                             : "bg-white/5 border-white/5 hover:bg-white/10 text-neutral-400"
                         }`}
                >
                  <Brain className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-center">
                    Mental
                  </span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 ml-1">
                  Session Title
                </label>
                <input
                  type="text"
                  value={newSchedule.title}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, title: e.target.value })
                  }
                  className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  placeholder="e.g. 70m Olympic Round"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 ml-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newSchedule.date}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, date: e.target.value })
                    }
                    className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 ml-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newSchedule.time}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, time: e.target.value })
                    }
                    className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 ml-1">
                  Notes / Details
                </label>
                <textarea
                  value={newSchedule.details}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, details: e.target.value })
                  }
                  rows={3}
                  className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none resize-none"
                  placeholder="Special focus, wind conditions, etc."
                />
              </div>
            </div>

            <div className="p-8 bg-black/20 flex gap-4 shrink-0 border-t border-white/5">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 py-4 bg-white text-black hover:bg-neutral-200 rounded-2xl font-bold transition-all shadow-xl"
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
