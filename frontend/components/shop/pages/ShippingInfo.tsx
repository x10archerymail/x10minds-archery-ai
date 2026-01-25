import { Truck, Globe, Clock, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

interface ShippingInfoProps {
  themeMode?: "dark" | "light";
  accentColor?: string;
}

const ShippingInfo: React.FC<ShippingInfoProps> = ({
  themeMode = "dark",
  accentColor = "orange",
}) => {
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
            Logistic <span className="text-[var(--accent)]">Intelligence</span>
          </h1>
          <p
            className={`font-black uppercase tracking-[0.2em] text-[10px] max-w-2xl mx-auto ${isDark ? "text-gray-500" : "text-gray-400"}`}
          >
            Authorized global delivery systems for high-precision equipment with
            end-to-end tracking
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div
            className={`p-8 rounded-[2.5rem] border transition-all duration-300 ${
              isDark
                ? "bg-neutral-900/40 border-white/5"
                : "bg-white border-gray-100 shadow-xl shadow-gray-200/40"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-lg ${
                isDark
                  ? "bg-[rgba(var(--accent-rgb),0.1)] text-[var(--accent)]"
                  : "bg-[rgba(var(--accent-rgb),0.05)] text-[rgba(var(--accent-rgb),0.8)] shadow-[rgba(var(--accent-rgb),0.1)]"
              }`}
            >
              <Globe size={28} />
            </div>
            <h3
              className={`text-sm font-black uppercase tracking-widest mb-4 ${isDark ? "text-white" : "text-gray-950"}`}
            >
              Global Network
            </h3>
            <p
              className={`text-xs font-bold leading-relaxed ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Operating across 150+ international sectors. Every delivery
              includes full system documentation and customs authorization for
              seamless entry.
            </p>
          </div>
          <div
            className={`p-8 rounded-[2.5rem] border transition-all duration-300 ${
              isDark
                ? "bg-neutral-900/40 border-white/5"
                : "bg-white border-gray-100 shadow-xl shadow-gray-200/40"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-lg ${
                isDark
                  ? "bg-[rgba(var(--accent-rgb),0.1)] text-[var(--accent)]"
                  : "bg-[rgba(var(--accent-rgb),0.05)] text-[rgba(var(--accent-rgb),0.8)] shadow-[rgba(var(--accent-rgb),0.1)]"
              }`}
            >
              <Clock size={28} />
            </div>
            <h3
              className={`text-sm font-black uppercase tracking-widest mb-4 ${isDark ? "text-white" : "text-gray-950"}`}
            >
              Processing Protocol
            </h3>
            <p
              className={`text-xs font-bold leading-relaxed ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Standard equipment processed within 24-48 hours. Custom engineered
              systems require 3-5 tactical days for professional calibration and
              testing.
            </p>
          </div>
          <div
            className={`p-8 rounded-[2.5rem] border transition-all duration-300 ${
              isDark
                ? "bg-neutral-900/40 border-white/5"
                : "bg-white border-gray-100 shadow-xl shadow-gray-200/40"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-lg ${
                isDark
                  ? "bg-[rgba(var(--accent-rgb),0.1)] text-[var(--accent)]"
                  : "bg-[rgba(var(--accent-rgb),0.05)] text-[rgba(var(--accent-rgb),0.8)] shadow-[rgba(var(--accent-rgb),0.1)]"
              }`}
            >
              <Truck size={28} />
            </div>
            <h3
              className={`text-sm font-black uppercase tracking-widest mb-4 ${isDark ? "text-white" : "text-gray-950"}`}
            >
              Transport Options
            </h3>
            <p
              className={`text-xs font-bold leading-relaxed ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Strategic partnerships with global logistic leaders ensures
              mission success. Rapid deployment (3-5 days) available for urgent
              operational needs.
            </p>
          </div>
          <div
            className={`p-8 rounded-[2.5rem] border transition-all duration-300 ${
              isDark
                ? "bg-neutral-900/40 border-white/5"
                : "bg-white border-gray-100 shadow-xl shadow-gray-200/40"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-lg ${
                isDark
                  ? "bg-[rgba(var(--accent-rgb),0.1)] text-[var(--accent)]"
                  : "bg-[rgba(var(--accent-rgb),0.05)] text-[rgba(var(--accent-rgb),0.8)] shadow-[rgba(var(--accent-rgb),0.1)]"
              }`}
            >
              <ShieldCheck size={28} />
            </div>
            <h3
              className={`text-sm font-black uppercase tracking-widest mb-4 ${isDark ? "text-white" : "text-gray-950"}`}
            >
              Asset Protection
            </h3>
            <p
              className={`text-xs font-bold leading-relaxed ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              High-value assets are fully protected during transit. Our
              insurance protocol covers all elite bows and risers against any
              operational failure during delivery.
            </p>
          </div>
        </div>

        <div
          className={`rounded-[3rem] p-8 md:p-12 border transition-all duration-300 ${
            isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-100"
          }`}
        >
          <h2
            className={`text-2xl font-black mb-10 uppercase tracking-widest ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Sector Timelines
          </h2>
          <div className="space-y-8">
            <div
              className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b ${
                isDark ? "border-white/5" : "border-gray-200"
              }`}
            >
              <div>
                <h4
                  className={`font-black text-sm uppercase tracking-widest ${isDark ? "text-white" : "text-gray-950"}`}
                >
                  North America & Europe
                </h4>
                <p
                  className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  Rapid Deployment
                </p>
              </div>
              <div className="bg-[var(--accent)] text-black text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg shadow-[rgba(var(--accent-rgb),0.2)]">
                3 - 5 Standard Days
              </div>
            </div>
            <div
              className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b ${
                isDark ? "border-white/5" : "border-gray-200"
              }`}
            >
              <div>
                <h4
                  className={`font-black text-sm uppercase tracking-widest ${isDark ? "text-white" : "text-gray-950"}`}
                >
                  Asia Pacific
                </h4>
                <p
                  className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  Standard Authorization
                </p>
              </div>
              <div
                className={`text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full border ${
                  isDark
                    ? "bg-white/5 border-white/10 text-[var(--accent)]"
                    : "bg-gray-100 border-gray-200 text-gray-900"
                }`}
              >
                5 - 10 Standard Days
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4
                  className={`font-black text-sm uppercase tracking-widest ${isDark ? "text-white" : "text-gray-950"}`}
                >
                  Global Frontiers
                </h4>
                <p
                  className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  Standard Authorization
                </p>
              </div>
              <div
                className={`text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full border ${
                  isDark
                    ? "bg-white/5 border-white/10 text-[var(--accent)]"
                    : "bg-gray-100 border-gray-200 text-gray-900"
                }`}
              >
                10 - 15 Standard Days
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <Link
            to="/contact"
            className="text-[var(--accent)] font-black uppercase tracking-widest text-xs hover:text-white transition-all underline underline-offset-8"
          >
            Tactical Support Required? Contact Logistics Command
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
