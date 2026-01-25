import { useEffect } from "react";
import {
  X,
  CheckCircle,
  AlertCircle,
  Trophy,
  Star,
  TrendingUp,
} from "lucide-react";

// --- Types ---
export type NotificationType = "success" | "error" | "info" | "warning";

export interface ToastProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
}

export interface RankUpModalProps {
  newRank: string;
  onClose: () => void;
}

// --- Toast Component ---
export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Auto hide after 4s
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgClass =
    type === "success"
      ? "bg-green-600"
      : type === "error"
        ? "bg-red-600"
        : type === "warning"
          ? "bg-yellow-500"
          : "bg-blue-600";

  const icon =
    type === "success" ? (
      <CheckCircle className="w-5 h-5" />
    ) : type === "error" ? (
      <AlertCircle className="w-5 h-5" />
    ) : type === "warning" ? (
      <AlertCircle className="w-5 h-5" />
    ) : (
      <TrendingUp className="w-5 h-5" />
    );

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white transform transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in ${bgClass} font-orbitron border border-white/10`}
    >
      {icon}
      <span className="font-bold text-xs tracking-widest uppercase">
        {message}
      </span>
      <button
        onClick={onClose}
        className="ml-2 hover:bg-white/20 p-1 rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// --- Rank Up Modal Component ---
export const RankUpModal: React.FC<RankUpModalProps> = ({
  newRank,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-500"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative bg-[#0A0A0A] border border-[#FFD700]/20 rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl shadow-[#FFD700]/10 animate-in zoom-in-95 slide-in-from-bottom-5 duration-500 overflow-hidden">
        {/* Confetti / Rays Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#FFD700]/5 to-transparent"></div>

        <div className="relative z-10">
          <div className="w-24 h-24 mx-auto bg-[#FFD700] rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-[#FFD700]/20 animate-bounce">
            <Trophy className="w-12 h-12 text-black" />
          </div>

          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3].map((i) => (
              <Star
                key={i}
                className="w-6 h-6 text-[#FFD700] fill-[#FFD700] animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>

          <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
            RANK UP!
          </h2>
          <p className="text-neutral-500 font-medium mb-8">
            Your elite performance has unlocked a new technical designation.
          </p>

          <div className="py-4 px-8 bg-white/5 rounded-2xl border border-white/10 mb-10 inline-block">
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FDB931] tracking-tight">
              {newRank}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-5 bg-[#FFD700] text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 transition-all shadow-xl shadow-[#FFD700]/10"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
