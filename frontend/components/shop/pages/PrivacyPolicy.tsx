import * as React from "react";
import { Shield, Lock, Eye, Database, UserCheck, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface PrivacyPolicyProps {
  themeMode?: "dark" | "light";
  accentColor?: string;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({
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
    <div
      className={`pt-32 pb-24 transition-colors duration-500 ${isDark ? "bg-[#000]" : "bg-white"}`}
    >
      <style>{`
        :root {
          --accent: ${accentColor};
          --accent-rgb: ${accentRgb};
        }
      `}</style>
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <header className="mb-24 text-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[var(--accent)] font-black tracking-[0.4em] uppercase text-[10px] mb-6 block"
            >
              System Protocol
            </motion.span>
            <h1
              className={`text-6xl md:text-8xl font-black mb-8 tracking-tighter ${isDark ? "text-white" : "text-gray-950"}`}
            >
              Privacy <span className="text-[var(--accent)]">Policy</span>
            </h1>
            <p
              className={`text-sm font-black uppercase tracking-[0.2em] leading-loose max-w-2xl mx-auto ${isDark ? "text-gray-600" : "text-gray-400"}`}
            >
              Operational guidelines for data interaction and security assurance
              within the X10Minds terminal.
            </p>
            <p
              className={`text-[10px] font-black uppercase tracking-[0.3em] mt-8 ${isDark ? "text-gray-800" : "text-gray-300"}`}
            >
              Last Updated: December 25, 2025 | Revision 4.0.2
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {[
              {
                icon: Shield,
                title: "Secured",
                desc: "Encryption standard AES-256 for all field data.",
              },
              {
                icon: Lock,
                title: "Private",
                desc: "Zero-sale policy on operator intelligence.",
              },
              {
                icon: UserCheck,
                title: "Verified",
                desc: "Full autonomy over stored digital artifacts.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`p-10 rounded-[3rem] border transition-all duration-500 ${
                  isDark
                    ? "bg-white/5 border-white/5 shadow-2xl shadow-black"
                    : "bg-white border-gray-100 shadow-2xl shadow-gray-200/40"
                }`}
              >
                <div
                  className={`w-14 h-14 bg-[var(--accent)] text-black rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-[rgba(var(--accent-rgb),0.2)]`}
                >
                  <item.icon size={24} strokeWidth={2.5} />
                </div>
                <h3
                  className={`text-sm font-black uppercase tracking-widest mb-3 ${isDark ? "text-white" : "text-gray-950"}`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-[10px] font-black uppercase tracking-[0.2em] leading-loose ${isDark ? "text-gray-600" : "text-gray-400"}`}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-12">
            {[
              {
                icon: Database,
                num: "01",
                title: "Information Acquisition",
                content: (
                  <div className="space-y-8">
                    <p>
                      We log data transmitted directly during account synthesis,
                      asset deployment, or terminal interaction.
                    </p>
                    <div
                      className={`rounded-[2.5rem] p-8 border ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}
                    >
                      <h3
                        className={`font-black uppercase tracking-widest text-xs mb-4 ${isDark ? "text-white" : "text-gray-950"}`}
                      >
                        Primary Vector Data:
                      </h3>
                      <ul className="space-y-3 list-none">
                        {[
                          "Personnel identifiers (Name, Uplink Code)",
                          "Geographical drop sectors",
                          "Secure transaction payloads",
                          "System access credentials",
                        ].map((li, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                            <span>{li}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ),
              },
              {
                icon: Eye,
                num: "02",
                title: "Operational Data Usage",
                content: (
                  <div className="space-y-8">
                    <p>
                      Acquired intelligence is utilized to stabilize, maintain,
                      and optimize mission parameters.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          t: "Asset Deployment",
                          d: "Fulfilling equipment orders and logistical tracking.",
                        },
                        {
                          t: "Security Maintenance",
                          d: "Preventing unauthorized terminal access and fraud.",
                        },
                        {
                          t: "Strategic Comms",
                          d: "Transmitting critical field updates and intel.",
                        },
                        {
                          t: "Optimization",
                          d: "Refining user experience based on interaction logs.",
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className={`p-6 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}
                        >
                          <h4
                            className={`font-black uppercase tracking-widest text-[10px] mb-2 ${isDark ? "text-white" : "text-gray-950"}`}
                          >
                            {item.t}
                          </h4>
                          <p className="text-[10px] leading-relaxed">
                            {item.d}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                icon: Globe,
                num: "03",
                title: "Global Intelligence Transfer",
                content: (
                  <div className="space-y-6">
                    <p>
                      Data may be routed through international operational hubs.
                      X10Minds ensures consistent protection protocols across
                      all geographical sectors.
                    </p>
                    <div
                      className={`p-8 rounded-[2.5rem] border flex items-center gap-8 ${isDark ? "bg-[rgba(var(--accent-rgb),0.05)] border-[rgba(var(--accent-rgb),0.2)]" : "bg-[rgba(var(--accent-rgb),0.05)] border-[rgba(var(--accent-rgb),0.1)]"}`}
                    >
                      <Lock
                        size={40}
                        className="text-[var(--accent)] flex-shrink-0"
                      />
                      <p
                        className={`text-xs font-black uppercase tracking-widest leading-loose ${isDark ? "text-gray-300" : "text-gray-600"}`}
                      >
                        Security overrides are in place for all cross-sector
                        transmissions. Encrypted tunnels are mandatory for all
                        core data movement.
                      </p>
                    </div>
                  </div>
                ),
              },
            ].map((section, i) => (
              <motion.section
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`rounded-[3.5rem] p-12 md:p-16 border transition-all duration-500 ${
                  isDark
                    ? "bg-neutral-900 border-white/5"
                    : "bg-white border-gray-100 shadow-xl shadow-gray-200/50"
                }`}
              >
                <div className="flex items-start gap-8">
                  <div className="hidden md:flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--accent)] font-black">
                      <section.icon size={20} />
                    </div>
                    <div className="w-px h-24 bg-gradient-to-b from-white/10 to-transparent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-8">
                      <span className="text-[var(--accent)] font-black text-2xl tracking-tighter">
                        {section.num}
                      </span>
                      <h2
                        className={`text-3xl font-black tracking-tighter ${isDark ? "text-white" : "text-gray-950"}`}
                      >
                        {section.title}
                      </h2>
                    </div>
                    <div
                      className={`text-[11px] font-black uppercase tracking-widest leading-loose ${isDark ? "text-gray-600" : "text-gray-400"}`}
                    >
                      {section.content}
                    </div>
                  </div>
                </div>
              </motion.section>
            ))}
          </div>

          <div className="mt-24 text-center">
            <div
              className={`rounded-[3rem] p-12 border ${
                isDark
                  ? "bg-[rgba(var(--accent-rgb),0.05)] border-[rgba(var(--accent-rgb),0.2)]"
                  : "bg-[rgba(var(--accent-rgb),0.05)] border-[rgba(var(--accent-rgb),0.2)]"
              }`}
            >
              <p
                className={`text-sm font-black uppercase tracking-[0.2em] leading-loose mb-10 ${isDark ? "text-gray-300" : "text-gray-600"}`}
              >
                We are committed to the absolute protection of human digital
                artifacts.
              </p>
              <Link
                to="/terms"
                className="bg-black text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl"
              >
                System Service Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
