import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Star,
  MessageSquare,
  Send,
  CheckCircle2,
  User,
  Building2,
  Package,
} from "lucide-react";
import { useNotification } from "../context/NotificationContext";

interface ReviewsProps {
  themeMode?: "dark" | "light";
  accentColor?: string;
}

const Reviews: React.FC<ReviewsProps> = ({
  themeMode = "dark",
  accentColor = "orange",
}) => {
  const { showNotification } = useNotification();
  const [reviewType, setReviewType] = useState<"company" | "product">(
    "company",
  );
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDark = themeMode === "dark";

  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : "255, 215, 0";
  };

  const accentRgb = hexToRgb(accentColor);

  const reviews = [
    {
      id: 1,
      name: "Marcus Thorne",
      type: "company",
      rating: 5,
      comment:
        "The precision of the equipment is beyond anything I've used. Professional service at every step.",
      date: "2 days ago",
      avatar: "MT",
    },
    {
      id: 2,
      name: "Elena Vance",
      type: "product",
      product: "Hoyt Invicta",
      rating: 5,
      comment:
        "My grouping tightened up within the first hour. This bow is a masterpiece of engineering.",
      date: "1 week ago",
      avatar: "EV",
    },
    {
      id: 3,
      name: "David Chen",
      type: "company",
      rating: 4,
      comment:
        "Excellent support. Had some questions about my draw weight and they answered with elite expertise.",
      date: "3 days ago",
      avatar: "DC",
    },
    {
      id: 4,
      name: "Sarah Miller",
      type: "product",
      product: "Carbon Matrix",
      rating: 5,
      comment:
        "Lightweight, silent, and incredibly fast. The delivery was secure and very fast.",
      date: "2 weeks ago",
      avatar: "SM",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) {
      showNotification("Please provide your name and review", "error");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      showNotification("Thank you for your elite feedback!", "success");
      setName("");
      setComment("");
      setRating(5);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="pt-32 pb-24 container mx-auto px-6 overflow-hidden">
      <style>{`
        :root {
          --accent: ${accentColor};
          --accent-rgb: ${accentRgb};
        }
      `}</style>
      <header className="max-w-4xl mx-auto text-center mb-24">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[var(--accent)] font-black tracking-[0.4em] uppercase text-[10px] mb-6 block"
        >
          Operational Intelligence
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`text-6xl md:text-8xl font-black mb-8 tracking-tighter ${isDark ? "text-white" : "text-gray-950"}`}
        >
          Elite <span className="text-[var(--accent)]">Feedback</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`font-black uppercase tracking-[0.2em] text-[10px] max-w-2xl mx-auto ${isDark ? "text-gray-500" : "text-gray-400"}`}
        >
          Verified transmissions from operators in the field regarding the
          X10Minds system
        </motion.p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Review Grid */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 pb-8 border-b border-white/5">
            <h2
              className={`text-xl font-black flex items-center gap-4 uppercase tracking-widest ${isDark ? "text-white" : "text-gray-950"}`}
            >
              <MessageSquare className="text-[var(--accent)]" size={28} />
              Recent Logs
            </h2>
            <div
              className={`flex gap-2 p-1.5 rounded-2xl border ${isDark ? "bg-white/5 border-white/5" : "bg-gray-100 border-gray-200"}`}
            >
              <button
                onClick={() => setReviewType("company")}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  reviewType === "company"
                    ? "bg-[var(--accent)] text-black shadow-lg shadow-[rgba(var(--accent-rgb),0.2)]"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                HQ Intel
              </button>
              <button
                onClick={() => setReviewType("product")}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  reviewType === "product"
                    ? "bg-[var(--accent)] text-black shadow-lg shadow-[rgba(var(--accent-rgb),0.2)]"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                Gear Stats
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {reviews.map((rev, i) => (
                <motion.div
                  key={rev.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-[2.5rem] p-8 border transition-all group relative ${
                    isDark
                      ? "bg-neutral-900 border-white/5 hover:border-[rgba(var(--accent-rgb),0.3)] shadow-2xl shadow-[rgba(var(--accent-rgb),0)] hover:shadow-[rgba(var(--accent-rgb),0.05)]"
                      : "bg-white border-gray-100 shadow-xl shadow-gray-200/50 hover:border-[rgba(var(--accent-rgb),0.2)] hover:shadow-[rgba(var(--accent-rgb),0.1)]"
                  }`}
                >
                  <div className="flex items-center gap-5 mb-8">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg border-2 shadow-inner ${
                        isDark
                          ? "bg-white/5 border-white/5 text-[var(--accent)]"
                          : "bg-[rgba(var(--accent-rgb),0.1)] border-[rgba(var(--accent-rgb),0.1)] text-[var(--accent)] shadow-[rgba(var(--accent-rgb),0.05)]"
                      }`}
                    >
                      {rev.avatar}
                    </div>
                    <div>
                      <h4
                        className={`font-black uppercase tracking-widest text-xs flex items-center gap-2 ${isDark ? "text-white" : "text-gray-950"}`}
                      >
                        {rev.name}
                        <CheckCircle2 size={14} className="text-blue-500" />
                      </h4>
                      <p
                        className={`text-[9px] uppercase font-black tracking-widest mt-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}
                      >
                        STATUS: {rev.date}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex gap-1.5 mb-6 py-2 px-4 rounded-xl w-fit ${isDark ? "bg-white/5" : "bg-gray-50"}`}
                  >
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={12}
                        fill={idx < rev.rating ? accentColor : "none"}
                        className={
                          idx < rev.rating
                            ? "text-[var(--accent)]"
                            : isDark
                              ? "text-gray-800"
                              : "text-gray-200"
                        }
                      />
                    ))}
                  </div>

                  <p
                    className={`text-xs font-bold leading-relaxed mb-8 italic ${isDark ? "text-gray-400 font-medium" : "text-gray-600"}`}
                  >
                    "{rev.comment}"
                  </p>

                  <div
                    className={`pt-6 border-t flex items-center justify-between ${isDark ? "border-white/5" : "border-gray-50"}`}
                  >
                    <span
                      className={`text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest ${
                        rev.type === "company"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-[rgba(var(--accent-rgb),0.1)] text-[var(--accent)]"
                      }`}
                    >
                      {rev.type === "company"
                        ? "HQ SYSTEM LOG"
                        : `ASSET: ${rev.product}`}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Form Sidebar */}
        <div className="lg:col-span-1">
          <div
            className={`rounded-[3rem] p-10 sticky top-32 border transition-all duration-500 overflow-hidden group ${
              isDark
                ? "bg-neutral-900/60 border-white/5"
                : "bg-white border-gray-100 shadow-2xl shadow-gray-200/50"
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[rgba(var(--accent-rgb),0.05)] -skew-x-12 translate-x-16 -translate-y-16 group-hover:translate-x-12 group-hover:-translate-y-12 transition-transform duration-700" />

            <h3
              className={`text-2xl font-black mb-10 relative z-10 uppercase tracking-tighter ${isDark ? "text-white" : "text-gray-950"}`}
            >
              Log Your <br />
              <span className="text-[var(--accent)]">Experience</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="space-y-3">
                <label
                  className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}
                >
                  Data Sector
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setReviewType("company")}
                    className={`flex items-center justify-center gap-3 p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                      reviewType === "company"
                        ? "bg-[var(--accent)] text-black border-[var(--accent)] shadow-lg shadow-[rgba(var(--accent-rgb),0.2)]"
                        : isDark
                          ? "bg-white/5 border-white/5 text-gray-500"
                          : "bg-gray-50 border-gray-100 text-gray-400"
                    }`}
                  >
                    <Building2 size={16} strokeWidth={2.5} /> HQ
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewType("product")}
                    className={`flex items-center justify-center gap-3 p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                      reviewType === "product"
                        ? "bg-[var(--accent)] text-black border-[var(--accent)] shadow-lg shadow-[rgba(var(--accent-rgb),0.2)]"
                        : isDark
                          ? "bg-white/5 border-white/5 text-gray-500"
                          : "bg-gray-50 border-gray-100 text-gray-400"
                    }`}
                  >
                    <Package size={16} strokeWidth={2.5} /> Gear
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label
                  className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}
                >
                  Quality Index
                </label>
                <div
                  className={`flex gap-2 p-3 rounded-2xl w-fit ${isDark ? "bg-white/5" : "bg-gray-50"}`}
                >
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={24}
                      className={`cursor-pointer transition-all ${
                        s <= rating
                          ? "text-[var(--accent)] scale-110 drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.3)]"
                          : isDark
                            ? "text-gray-800 hover:text-gray-700 font-medium"
                            : "text-gray-200 hover:text-gray-300"
                      }`}
                      fill={s <= rating ? accentColor : "none"}
                      onClick={() => setRating(s)}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label
                  className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}
                >
                  Callsign
                </label>
                <div className="relative">
                  <User
                    className={`absolute left-5 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-600" : "text-gray-400"}`}
                    size={18}
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Operator ID"
                    className={`w-full p-5 pl-14 rounded-[1.5rem] border outline-none transition-all text-xs font-black uppercase tracking-widest ${
                      isDark
                        ? "bg-white/5 border-white/5 text-white placeholder:text-gray-800 focus:border-[var(--accent)]"
                        : "bg-gray-50 border-gray-100 text-black placeholder:text-gray-300 shadow-inner focus:border-[var(--accent)]"
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label
                  className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}
                >
                  Intel Transmission
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Record tactical feedback here..."
                  className={`w-full p-6 rounded-[1.5rem] border outline-none transition-all text-xs font-bold leading-relaxed resize-none ${
                    isDark
                      ? "bg-white/5 border-white/5 text-white placeholder:text-gray-800 focus:border-[var(--accent)]"
                      : "bg-gray-50 border-gray-100 text-black placeholder:text-gray-300 shadow-inner focus:border-[var(--accent)]"
                  }`}
                />
              </div>

              <button
                disabled={isSubmitting}
                className="w-full bg-[var(--accent)] text-black font-black py-6 rounded-[1.5rem] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-[rgba(var(--accent-rgb),0.3)] flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-[10px] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-[3px] border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Authorize Sync <Send size={18} strokeWidth={3} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
