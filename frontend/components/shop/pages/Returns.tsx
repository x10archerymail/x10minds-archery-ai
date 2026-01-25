import * as React from "react";
import { useState } from "react";
import {
  RotateCcw,
  PackageCheck,
  CreditCard,
  AlertCircle,
  ArrowRight,
  Truck,
  CheckCircle,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useNotification } from "../context/NotificationContext";

interface ReturnsProps {
  themeMode?: "dark" | "light";
  accentColor?: string;
}

const Returns: React.FC<ReturnsProps> = ({
  themeMode = "dark",
  accentColor = "orange",
}) => {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!orderNumber || !email || !reason) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    if (!orderNumber.match(/^ORD-\d{6}$/i)) {
      showNotification(
        "Invalid Authorization ID format. Use ORD-XXXXXX",
        "error",
      );
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showNotification("Invalid email address", "error");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Success
      setSubmitted(true);
      showNotification(
        `Return request submitted for ${orderNumber}`,
        "success",
      );

      // Optional: You could integrate with a real backend here
      // const response = await fetch('/api/returns', {
      //   method: 'POST',
      //   body: JSON.stringify({ orderNumber, email, reason })
      // });
    } catch (error) {
      showNotification(
        "Failed to submit return request. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 container mx-auto px-6">
      <style>{`
        :root {
          --accent: ${accentColor};
          --accent-rgb: ${accentRgb};
        }
      `}</style>
      <div className="max-w-4xl mx-auto">
        <header className="mb-16 text-center">
          <h1
            className={`text-6xl font-black mb-6 tracking-tighter ${isDark ? "text-white" : "text-gray-950"}`}
          >
            System <span className="text-[var(--accent)]">Reversal</span>
          </h1>
          <p
            className={`font-black uppercase tracking-[0.2em] text-[10px] max-w-2xl mx-auto ${isDark ? "text-gray-500" : "text-gray-400"}`}
          >
            Operational procedures for equipment return and tactical exchange
            authorizations
          </p>
        </header>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 relative">
          {/* Connector Line (Desktop) */}
          <div
            className={`hidden md:block absolute top-[60px] left-[15%] right-[15%] h-px ${isDark ? "bg-white/5" : "bg-gray-100"}`}
          />

          {[
            {
              icon: RotateCcw,
              title: "Initiate Return",
              desc: "Initialize the reversal sequence via the authorization terminal below.",
            },
            {
              icon: Truck,
              title: "Logistics Sync",
              desc: "Deploy assets back using the authorized prepaid courier encryption.",
            },
            {
              icon: CreditCard,
              title: "Final Settlement",
              desc: "Upon verification, credit authorization or exchange deployment will occur.",
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 border-2 transition-all duration-500 ${
                  isDark
                    ? "bg-neutral-900 border-white/5 group-hover:border-[rgba(var(--accent-rgb),0.3)] shadow-xl shadow-[rgba(var(--accent-rgb),0.05)]"
                    : "bg-white border-gray-100 group-hover:border-[rgba(var(--accent-rgb),0.2)] shadow-xl shadow-gray-200 group-hover:shadow-[rgba(var(--accent-rgb),0.1)]"
                }`}
              >
                <step.icon
                  size={42}
                  className={`transition-colors duration-500 ${isDark ? "text-gray-600 group-hover:text-[var(--accent)]" : "text-gray-300 group-hover:text-[var(--accent)]"}`}
                  strokeWidth={1.5}
                />
              </div>
              <h3
                className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${isDark ? "text-white" : "text-gray-950"}`}
              >
                {step.title}
              </h3>
              <p
                className={`text-[11px] font-bold leading-relaxed max-w-[200px] ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Initiate Return Form */}
          <div
            className={`p-10 rounded-[3rem] border transition-all duration-300 ${
              isDark
                ? "bg-neutral-900/40 border-white/5"
                : "bg-white border-gray-100 shadow-2xl shadow-gray-200/50"
            }`}
          >
            <h2
              className={`text-xl font-black mb-8 flex items-center gap-4 uppercase tracking-widest ${isDark ? "text-white" : "text-gray-900"}`}
            >
              <PackageCheck className="text-[var(--accent)]" size={28} /> Terminal
            </h2>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    className={`block text-[10px] font-black uppercase tracking-widest mb-3 ml-2 ${isDark ? "text-gray-600" : "text-gray-400"}`}
                  >
                    Authorization ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ORD-123456"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className={`w-full rounded-[1.5rem] p-5 focus:border-[var(--accent)] outline-none transition-all font-bold text-sm border ${
                      isDark
                        ? "bg-white/5 border-white/5 text-white"
                        : "bg-gray-50 border-gray-100 text-black"
                    }`}
                    required
                  />
                </div>
                <div>
                  <label
                    className={`block text-[10px] font-black uppercase tracking-widest mb-3 ml-2 ${isDark ? "text-gray-600" : "text-gray-400"}`}
                  >
                    System Email
                  </label>
                  <input
                    type="email"
                    placeholder="Verification Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className={`w-full rounded-[1.5rem] p-5 focus:border-[var(--accent)] outline-none transition-all font-bold text-sm border ${
                      isDark
                        ? "bg-white/5 border-white/5 text-white disabled:opacity-50"
                        : "bg-gray-50 border-gray-100 text-black disabled:opacity-50"
                    }`}
                    required
                  />
                </div>
                <div>
                  <label
                    className={`block text-[10px] font-black uppercase tracking-widest mb-3 ml-2 ${isDark ? "text-gray-600" : "text-gray-400"}`}
                  >
                    Reversal Protocol
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    disabled={loading}
                    className={`w-full rounded-[1.5rem] p-5 focus:border-[var(--accent)] outline-none transition-all font-bold text-sm border ${
                      isDark
                        ? "bg-white/5 border-white/5 text-white disabled:opacity-50"
                        : "bg-gray-50 border-gray-100 text-black disabled:opacity-50"
                    }`}
                    required
                  >
                    <option value="">Select Reason</option>
                    <option value="defective">Equipment Malfunction</option>
                    <option value="wrong_item">
                      Incorrect Asset Delivered
                    </option>
                    <option value="not_as_described">
                      Specifications Mismatch
                    </option>
                    <option value="change_mind">Strategic Re-evaluation</option>
                    <option value="other">Other Tactical Reason</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[var(--accent)] text-black font-black py-5 rounded-[1.5rem] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[rgba(var(--accent-rgb),0.2)] flex items-center justify-center gap-3 uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Authorize Retrieval{" "}
                      <ArrowRight size={20} strokeWidth={3} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-10">
                <div
                  className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 ${isDark ? "bg-green-500/10 text-green-400" : "bg-green-50 text-green-600"}`}
                >
                  <CheckCircle size={40} strokeWidth={2.5} />
                </div>
                <h3
                  className={`text-sm font-black uppercase tracking-widest mb-4 ${isDark ? "text-white" : "text-gray-950"}`}
                >
                  Authorization Success
                </h3>
                <p
                  className={`text-xs font-bold leading-relaxed mb-6 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  Confirmation protocols sent to{" "}
                  <strong className={isDark ? "text-white" : "text-gray-950"}>
                    {email}
                  </strong>{" "}
                  for operational ID{" "}
                  <strong className={isDark ? "text-white" : "text-gray-950"}>
                    {orderNumber}
                  </strong>
                  .
                </p>
                <div
                  className={`p-6 rounded-2xl border mb-10 ${isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-100"}`}
                >
                  <p
                    className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isDark ? "text-gray-600" : "text-gray-400"}`}
                  >
                    Reversal Reason:
                  </p>
                  <p
                    className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-950"}`}
                  >
                    {reason === "defective" && "Equipment Malfunction"}
                    {reason === "wrong_item" && "Incorrect Asset Delivered"}
                    {reason === "not_as_described" && "Specifications Mismatch"}
                    {reason === "change_mind" && "Strategic Re-evaluation"}
                    {reason === "other" && "Other Tactical Reason"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setOrderNumber("");
                    setEmail("");
                    setReason("");
                  }}
                  className="text-[var(--accent)] text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors underline underline-offset-8"
                >
                  Initialize New Authorization
                </button>
              </div>
            )}
          </div>

          {/* Policy Details */}
          <div className="space-y-6">
            <div
              className={`p-8 rounded-[2.5rem] border transition-all duration-500 flex gap-6 ${
                isDark
                  ? "bg-neutral-900 border-white/5"
                  : "bg-white border-gray-100 shadow-xl shadow-gray-200/40"
              }`}
            >
              <div
                className={`min-w-[56px] h-[56px] rounded-2xl flex items-center justify-center ${
                  isDark
                    ? "bg-white/5 text-[var(--accent)]"
                    : "bg-[rgba(var(--accent-rgb),0.1)] text-[var(--accent)]"
                }`}
              >
                <AlertCircle size={28} />
              </div>
              <div>
                <h3
                  className={`font-black text-sm uppercase tracking-widest mb-2 ${isDark ? "text-white" : "text-gray-950"}`}
                >
                  30-Day Protocol
                </h3>
                <p
                  className={`text-xs font-bold leading-relaxed ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  Asset reversal window remains active for 30 solar days from
                  deployment. Equipment must maintain zero-use status with all
                  system tags intact.
                </p>
              </div>
            </div>

            <div
              className={`p-8 rounded-[2.5rem] border transition-all duration-500 flex gap-6 ${
                isDark
                  ? "bg-neutral-900 border-white/5"
                  : "bg-white border-gray-100 shadow-xl shadow-gray-200/40"
              }`}
            >
              <div
                className={`min-w-[56px] h-[56px] rounded-2xl flex items-center justify-center ${
                  isDark
                    ? "bg-white/5 text-[var(--accent)]"
                    : "bg-[rgba(var(--accent-rgb),0.1)] text-[var(--accent)]"
                }`}
              >
                <RotateCcw size={28} />
              </div>
              <div>
                <h3
                  className={`font-black text-sm uppercase tracking-widest mb-2 ${isDark ? "text-white" : "text-gray-950"}`}
                >
                  Tactical Exchange
                </h3>
                <p
                  className={`text-xs font-bold leading-relaxed ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  Need alternative specifications? Select exchange during
                  authorization for rapid replacement deployment upon system
                  scanning.
                </p>
              </div>
            </div>

            <div
              className={`p-8 rounded-[2.5rem] border transition-all duration-500 flex gap-6 ${
                isDark
                  ? "bg-neutral-900 border-white/5"
                  : "bg-white border-gray-100 shadow-xl shadow-gray-200/40"
              }`}
            >
              <div
                className={`min-w-[56px] h-[56px] rounded-2xl flex items-center justify-center ${
                  isDark
                    ? "bg-white/5 text-[var(--accent)]"
                    : "bg-[rgba(var(--accent-rgb),0.1)] text-[var(--accent)]"
                }`}
              >
                <Mail size={28} />
              </div>
              <div>
                <h3
                  className={`font-black text-sm uppercase tracking-widest mb-2 ${isDark ? "text-white" : "text-gray-950"}`}
                >
                  Direct Intel
                </h3>
                <p
                  className={`text-xs font-bold leading-relaxed mb-4 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  For specialized asset queries or custom configurations,
                  contact our technical advisor squad.
                </p>
                <Link
                  to="/contact"
                  className="text-[var(--accent)] text-[10px] font-black uppercase tracking-widest hover:text-white transition-all underline underline-offset-8"
                >
                  Logistics Comms &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Non-returnable items */}
        <div className="mt-20 text-center">
          <p
            className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-gray-600" : "text-gray-300"}`}
          >
            * Note: Custom-engineered arrows and special-clearance bows are
            final-authorization assets.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Returns;
