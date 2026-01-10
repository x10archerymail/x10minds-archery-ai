import React, { useEffect } from "react";
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
      <div className="relative bg-neutral-900 border border-yellow-500/30 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl shadow-yellow-500/20 animate-in zoom-in-95 slide-in-from-bottom-5 duration-500 overflow-hidden">
        {/* Confetti / Rays Effect */}
        <div className="absolute inset-0 bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-yellow-900/20 via-black to-yellow-900/20 animate-pulse"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 to-transparent"></div>

        <div className="relative z-10">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30 animate-bounce">
            <Trophy className="w-12 h-12 text-white" />
          </div>

          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map((i) => (
              <Star
                key={i}
                className="w-6 h-6 text-yellow-500 fill-yellow-500 animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">Rank Up!</h2>
          <p className="text-neutral-400 mb-6">
            Congratulations! Your performance has earned you a new title.
          </p>

          <div className="py-3 px-6 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-xl border border-neutral-600 mb-8 inline-block">
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              {newRank}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-colors shadow-lg"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
};
