import { Link } from "react-router-dom";
import { Youtube, Twitter, Instagram, Facebook } from "lucide-react";

interface FooterProps {
  themeMode?: "dark" | "light";
  accentColor?: string;
}

const Footer: React.FC<FooterProps> = ({
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
    <footer
      className={`transition-colors duration-500 border-t ${
        isDark ? "bg-[#000] border-white/5" : "bg-white border-gray-100"
      } pt-32 pb-16`}
    >
      <style>{`
        :root {
          --accent: ${accentColor};
          --accent-rgb: ${accentRgb};
        }
      `}</style>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-24">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-10 mb-10 group">
              <div className="w-16 h-16 flex items-center justify-center relative">
                <div
                  className={`absolute inset-0 blur-2xl rounded-full transition-opacity duration-500 ${isDark ? "bg-[rgba(var(--accent-rgb),0.1)] opacity-50" : "bg-[rgba(var(--accent-rgb),0.2)] opacity-30"}`}
                />
                <img
                  src="/images/X10Minds logo.png"
                  alt="X10Minds logo"
                  className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <span
                className={`text-4xl font-black tracking-tighter uppercase transition-colors ${
                  isDark ? "text-white" : "text-gray-950"
                }`}
              >
                X10
                <span className="text-[var(--accent)] block text-xs tracking-[1em] mt-1 font-black">
                  Systems
                </span>
              </span>
            </Link>
            <p
              className={`text-sm font-black uppercase tracking-widest leading-loose max-w-md mb-12 ${
                isDark ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Strategically engineering the primary artifacts of human
              precision. Experience the terminal of Olympic-tier trajectory
              equipment.
            </p>
            <div className="flex flex-col gap-8">
              <div className="flex gap-6">
                {[
                  { Icon: Twitter, href: "https://x.com/x10minds" },
                  {
                    Icon: Instagram,
                    href: "https://www.instagram.com/x10minds/",
                  },
                  { Icon: Youtube, href: "https://www.youtube.com/@x10minds" },
                  {
                    Icon: Facebook,
                    href: "https://www.facebook.com/X10Minds/",
                  },
                ].map(({ Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border ${
                      isDark
                        ? "bg-white/5 border-white/5 text-gray-400 hover:bg-[var(--accent)] hover:text-black hover:shadow-2xl hover:shadow-[rgba(var(--accent-rgb),0.2)]"
                        : "bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-950 hover:text-white"
                    }`}
                  >
                    <Icon size={20} strokeWidth={2} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h4
              className={`text-[10px] font-black uppercase tracking-[0.4em] mb-10 ${isDark ? "text-white" : "text-gray-950"}`}
            >
              Sectors
            </h4>
            <ul
              className={`space-y-6 text-[10px] font-black uppercase tracking-widest ${isDark ? "text-gray-600" : "text-gray-400"}`}
            >
              <li>
                <Link
                  to="/shop"
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  All Equipment
                </Link>
              </li>
              <li>
                <Link
                  to="/featured"
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  Tactical Picks
                </Link>
              </li>
              <li>
                <Link
                  to="/new-arrivals"
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  Latest Drops
                </Link>
              </li>
              <li>
                <Link
                  to="/offers"
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  Strategic Intel
                </Link>
              </li>
              <li>
                <Link
                  to="/reviews"
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  Field Logs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4
              className={`text-[10px] font-black uppercase tracking-[0.4em] mb-10 ${isDark ? "text-white" : "text-gray-950"}`}
            >
              Protocols
            </h4>
            <ul
              className={`space-y-6 text-[10px] font-black uppercase tracking-widest ${isDark ? "text-gray-600" : "text-gray-400"}`}
            >
              <li>
                <Link
                  to="/contact"
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  Direct Uplink
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  Intelligence Base
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  Deployment Intel
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  System Reversal
                </Link>
              </li>
              <li>
                <a
                  href="https://docs.x10minds.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className={`pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-10 ${
            isDark ? "border-white/5" : "border-gray-100"
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p
              className={`text-[9px] font-black uppercase tracking-[0.3em] ${isDark ? "text-gray-700" : "text-gray-300"}`}
            >
              &copy; 2024 X10MINDS OPERATIONAL CENTER. VERSION 2.0.4-STABLE
            </p>
          </div>
          <div
            className={`flex gap-12 text-[9px] font-black uppercase tracking-[0.3em] ${isDark ? "text-gray-700" : "text-gray-300"}`}
          >
            <Link
              to="/privacy"
              className="hover:text-[var(--accent)] transition-colors"
            >
              Privacy Module
            </Link>
            <Link
              to="/terms"
              className="hover:text-[var(--accent)] transition-colors"
            >
              Service Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
