import * as React from "react";
import { motion } from "framer-motion";
import { FileText, Scale, AlertCircle, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

interface TermsOfServiceProps {
  themeMode?: "dark" | "light";
  accentColor?: string;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({
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
              Master Framework
            </motion.span>
            <h1
              className={`text-6xl md:text-8xl font-black mb-8 tracking-tighter ${isDark ? "text-white" : "text-gray-950"}`}
            >
              Terms of <span className="text-[var(--accent)]">Service</span>
            </h1>
            <p
              className={`text-sm font-black uppercase tracking-[0.2em] leading-loose max-w-2xl mx-auto ${isDark ? "text-gray-600" : "text-gray-400"}`}
            >
              Binding operational protocols for all personnel interacting with
              the X10Minds equipment matrix.
            </p>
            <p
              className={`text-[10px] font-black uppercase tracking-[0.3em] mt-8 ${isDark ? "text-gray-800" : "text-gray-300"}`}
            >
              Last Updated: December 25, 2025 | Master Revision V5.0
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            {[
              {
                icon: Scale,
                title: "Fair Usage Protocol",
                desc: "Equitable distribution of resources for all verified operators.",
              },
              {
                icon: ShieldCheck,
                title: "Transaction Encryption",
                desc: "Military-grade cryptographic tunnels for all asset acquisition.",
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
                icon: FileText,
                num: "01",
                title: "Binding Acceptance",
                content: (
                  <div className="space-y-6">
                    <p>
                      Usage of the X10Minds terminal implies absolute adherence
                      to these protocols. Non-compliance results in immediate
                      revocation of uplink credentials.
                    </p>
                    <p>
                      We maintain the authority to recalibrate these terms at
                      any interval. Deployment of new parameters is effective
                      immediately upon log update.
                    </p>
                  </div>
                ),
              },
              {
                icon: AlertCircle,
                num: "02",
                title: "Asset Acquisition & Logistics",
                content: (
                  <div className="space-y-8">
                    <p>
                      All prices are indexed to USD and may fluctuate based on
                      global resource availability.
                    </p>
                    <div
                      className={`p-8 rounded-[2.5rem] border ${isDark ? "bg-[rgba(var(--accent-rgb),0.05)] border-[rgba(var(--accent-rgb),0.2)]" : "bg-[rgba(var(--accent-rgb),0.05)] border-[rgba(var(--accent-rgb),0.1)]"}`}
                    >
                      <h3
                        className={`font-black uppercase tracking-widest text-[10px] mb-4 ${isDark ? "text-white" : "text-gray-950"}`}
                      >
                        Logistical Disclaimer:
                      </h3>
                      <p className="text-[10px] leading-loose">
                        Title transfer of all physical equipment occurs at the
                        point of carrier dispatch. Delivery timelines are
                        operational estimates and not guaranteed mission
                        deadlines.
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                icon: ShieldCheck,
                num: "03",
                title: "Intellectual Property Rights",
                content: (
                  <div className="space-y-6">
                    <p>
                      The entire equipment matrix, software architecture, and
                      visual aesthetics of the X10Minds terminal are proprietary
                      assets protected by international law.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "No Digital Reproduction",
                        "No Reverse Engineering",
                        "No Logo Distribution",
                        "No Content Scraping",
                      ].map((p, i) => (
                        <div
                          key={i}
                          className={`p-4 rounded-xl border flex items-center gap-3 ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}
                        >
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            {p}
                          </span>
                        </div>
                      ))}
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
                Operational interaction with X10Minds signifies complete
                agreement with the protocols outlined above.
              </p>
              <Link
                to="/privacy"
                className="bg-black text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl"
              >
                Privacy Protocol
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
