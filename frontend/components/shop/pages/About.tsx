import { motion } from "framer-motion";
import { Target, Users, Globe, Award } from "lucide-react";

interface AboutProps {
  themeMode?: "dark" | "light";
  accentColor?: string;
}

const About: React.FC<AboutProps> = ({
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
    <div className={`pt-32 pb-24 ${isDark ? "bg-[#000]" : "bg-white"}`}>
      <style>{`
        :root {
          --accent: ${accentColor};
          --accent-rgb: ${accentRgb};
        }
      `}</style>
      {/* Vision Section */}
      <section className="container mx-auto px-6 mb-40">
        <div className="max-w-5xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[var(--accent)] font-black tracking-[0.4em] uppercase text-[10px] mb-6 block"
          >
            Mission Protocol 01
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-6xl md:text-9xl font-black mb-10 tracking-tighter ${isDark ? "text-white" : "text-gray-950"}`}
          >
            Calibrating <span className="text-[var(--accent)]">The Flight</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-lg md:text-xl font-black uppercase tracking-[0.2em] leading-relaxed max-w-3xl mx-auto ${isDark ? "text-gray-500" : "text-gray-400"}`}
          >
            At X10Minds Shop, we develop the primary artifacts of human
            precision. We don't just sell equipment; we authorize the extensions
            of the archer's soul.
          </motion.p>
        </div>
      </section>

      {/* Values */}
      <section
        className={`py-40 mb-40 border-y ${isDark ? "bg-white/[0.02] border-white/5" : "bg-gray-50 border-gray-100"}`}
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            {[
              {
                icon: Target,
                title: "Precision",
                desc: "Every system is calibrated to meet rigorous Olympic operational benchmarks.",
              },
              {
                icon: Users,
                title: "Legacy",
                desc: "Engineered by a specialized lineage for the next generation of operators.",
              },
              {
                icon: Globe,
                title: "Global Grid",
                desc: "Strategic sourcing of world-class materials from elite manufacturing sectors.",
              },
              {
                icon: Award,
                title: "X10 Standard",
                desc: "An absolute commitment to the perfect trajectory that never deviates.",
              },
            ].map((value, i) => (
              <div key={i} className="text-center group">
                <div
                  className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 transition-all duration-500 shadow-2xl border ${
                    isDark
                      ? "bg-neutral-900 border-white/5 group-hover:bg-[var(--accent)] group-hover:text-black group-hover:shadow-[rgba(var(--accent-rgb),0.3)]"
                      : "bg-white border-gray-100 group-hover:bg-[rgba(var(--accent-rgb),0.1)] group-hover:text-[var(--accent)] group-hover:shadow-gray-200"
                  }`}
                >
                  <value.icon size={44} strokeWidth={1.5} />
                </div>
                <h3
                  className={`text-sm font-black uppercase tracking-widest mb-4 ${isDark ? "text-white" : "text-gray-950"}`}
                >
                  {value.title}
                </h3>
                <p
                  className={`text-[10px] font-black uppercase tracking-[0.2em] leading-loose ${isDark ? "text-gray-600" : "text-gray-400"}`}
                >
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team / Story */}
      <section className="container mx-auto px-6 mb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div
            className={`rounded-[4rem] p-3 aspect-square relative overflow-hidden group border ${isDark ? "border-white/5" : "border-gray-100 shadow-2xl shadow-gray-200/50"}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(var(--accent-rgb),0.1)] via-transparent to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1541535650810-10d26f5d2abb?q=80&w=800"
              className={`w-full h-full object-cover transition-all duration-1000 ${isDark ? "grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-80" : "grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100"}`}
              alt="Archery Craft"
            />
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <span
                className={`text-[12rem] font-black mix-blend-overlay ${isDark ? "text-[var(--accent)]" : "text-gray-400 opacity-30"}`}
              >
                X10
              </span>
            </div>
          </div>
          <div className="max-w-xl">
            <span className="text-[var(--accent)] font-black tracking-[0.4em] uppercase text-[10px] mb-6 block">
              The Protocol Genesis
            </span>
            <h2
              className={`text-6xl font-black mb-10 tracking-tighter ${isDark ? "text-white" : "text-gray-950"}`}
            >
              The <span className="text-[var(--accent)]">Legacy</span>
            </h2>
            <div
              className={`space-y-8 text-[11px] font-black uppercase tracking-widest leading-loose ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              <p>
                Established in 2024, X10Minds Shop initiated a single objective:
                The pursuit of the "X" - the absolute center. We identified that
                high-performance equipment was restricted to sectors with
                privileged access to elite suppliers.
              </p>
              <p>
                We decided to authorize excellence by engineering a terminal
                where only the most scientifically advanced equipment is
                curated. From the tactical carbon weave of an X10 probe to the
                CNC-machined precision of a Stratos riser, we ensure mission
                success.
              </p>
              <p className="border-t border-white/5 pt-8 italic">
                Strategic Intelligence. Elite Equipment. Zero Deviation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join with us Section */}
      <section className="container mx-auto px-6">
        <div
          className={`rounded-[4rem] p-16 md:p-28 text-center border relative overflow-hidden ${
            isDark
              ? "bg-neutral-900/40 border-[rgba(var(--accent-rgb),0.2)]"
              : "bg-white border-[rgba(var(--accent-rgb),0.1)] shadow-2xl shadow-[rgba(var(--accent-rgb),0.05)]"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(var(--accent-rgb),0.05)] via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10">
            <span className="text-[var(--accent)] font-black tracking-[0.4em] uppercase text-[10px] mb-8 block">
              Network Authorization
            </span>
            <h2
              className={`text-6xl md:text-8xl font-black mb-10 tracking-tighter ${isDark ? "text-white" : "text-gray-950"}`}
            >
              Join The <span className="text-[var(--accent)]">Network</span>
            </h2>
            <p
              className={`text-[10px] font-black uppercase tracking-[0.3em] mb-12 max-w-2xl mx-auto leading-loose ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Initialize your integration into the X10Minds operational
              environment and experience tactical archery systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <a
                href="https://x10minds.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-12 py-5 bg-[var(--accent)] text-black text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[rgba(var(--accent-rgb),0.3)]"
              >
                Launch Intelligence
              </a>
              <a
                href="mailto:support@x10minds.com"
                className={`group px-12 py-5 border-2 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white hover:bg-white hover:text-black"
                    : "bg-gray-50 border-gray-100 text-gray-900 hover:bg-gray-950 hover:text-white"
                }`}
              >
                Support Comms
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
