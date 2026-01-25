import { useState } from "react";
import { Bug, Send, CheckCircle } from "lucide-react";
import { reportBugToFirebase } from "../services/firebase";

import { NotificationType } from "./Overlays";

interface ReportBugProps {
  notify?: (message: string, type: NotificationType) => void;
  themeMode?: "dark" | "light";
  accentColor?: string;
}

const ReportBug: React.FC<ReportBugProps> = ({
  notify,
  themeMode = "dark",
  accentColor = "orange",
}) => {
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isDark = themeMode === "dark";
  const bgClass = isDark ? "bg-neutral-950" : "bg-gray-50";
  const cardClass = isDark
    ? "bg-neutral-900 border-neutral-800 shadow-2xl"
    : "bg-white border-gray-200 shadow-xl";
  const headerText = isDark ? "text-white" : "text-gray-900";
  const subText = isDark ? "text-neutral-400" : "text-gray-500";
  const inputBg = isDark ? "bg-black" : "bg-white";
  const inputText = isDark ? "text-white" : "text-gray-900";
  const inputBorder = isDark ? "border-neutral-800" : "border-gray-300";

  const accentClasses: Record<string, string> = {
    orange: "from-[#FFD700] to-[#FDB931] border-[#FFD700] ring-[#FFD700]",
    blue: "from-blue-600 to-indigo-600 border-blue-500 ring-blue-500",
    green: "from-green-600 to-emerald-600 border-green-500 ring-green-500",
    purple: "from-purple-600 to-pink-600 border-purple-500 ring-purple-500",
    red: "from-red-600 to-orange-600 border-red-500 ring-red-500",
    pink: "from-pink-600 to-rose-600 border-pink-500 ring-pink-500",
    teal: "from-teal-600 to-cyan-600 border-teal-500 ring-teal-500",
    cyan: "from-cyan-600 to-blue-600 border-cyan-500 ring-cyan-500",
    indigo: "from-indigo-600 to-purple-600 border-indigo-500 ring-indigo-500",
  };

  const currentAccent = accentClasses[accentColor] || accentClasses.orange;
  const accentGradient = currentAccent.split(" border-")[0];
  const accentBorder = currentAccent.split(" border-")[1].split(" ring-")[0];
  const accentRing = currentAccent.split(" ring-")[1];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !description) return;

    setIsSubmitting(true);
    try {
      await reportBugToFirebase(description, email);

      setIsSuccess(true);
      if (notify) notify("Bug report submitted successfully!", "success");
      setEmail("");
      setDescription("");
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      if (notify) notify("Failed to submit report. Try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`p-6 md:p-8 flex items-center justify-center ${bgClass}`}>
      <div
        className={`max-w-xl w-full rounded-3xl p-8 relative overflow-hidden ${cardClass}`}
      >
        {isSuccess && (
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center z-10 animate-in fade-in ${
              isDark ? "bg-neutral-900/95" : "bg-white/95"
            }`}
          >
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className={`text-2xl font-bold ${headerText}`}>Report Sent!</h3>
            <p className={subText}>
              Thank you for helping us improve X10Minds.
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
            <Bug className="w-6 h-6" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${headerText}`}>Report a Bug</h2>
            <p className={`${subText} text-sm`}>
              Found an issue? Let our engineering team know.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-neutral-300" : "text-gray-700"
              }`}
            >
              Your Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all ${inputBg} ${inputText} ${inputBorder} focus:border-${accentBorder} focus:ring-${accentRing}`}
              placeholder="archer@example.com"
              required
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-neutral-300" : "text-gray-700"
              }`}
            >
              Issue Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full h-40 border rounded-xl px-4 py-3 focus:outline-none focus:ring-1 resize-none transition-all ${inputBg} ${inputText} ${inputBorder} focus:border-${accentBorder} focus:ring-${accentRing}`}
              placeholder="Please describe what happened..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
              ${
                isSubmitting
                  ? isDark
                    ? "bg-neutral-800 text-neutral-500"
                    : "bg-gray-200 text-gray-400"
                  : isDark
                    ? "bg-white text-black hover:bg-neutral-200"
                    : `bg-gradient-to-r ${accentGradient} text-white shadow-lg`
              }
            `}
          >
            {isSubmitting ? "Sending..." : "Submit Report"}{" "}
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportBug;
