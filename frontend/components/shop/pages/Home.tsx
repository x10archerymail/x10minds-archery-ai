import { motion } from "framer-motion";
import {
  ShoppingBag,
  Star,
  Zap,
  Shield,
  ArrowRight,
  Target,
  Box,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import HeroScrollCarousel from "../ui/HeroScrollCarousel";
import TrendingMarquee from "../ui/TrendingMarquee";
import { usePreferences } from "../context/PreferencesContext";

interface HomeProps {
  themeMode?: "dark" | "light";
  accentColor?: string;
}

const Home: React.FC<HomeProps> = ({
  themeMode = "dark",
  accentColor = "orange",
}) => {
  const { formatPrice, t } = usePreferences();
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 45,
    seconds: 12,
  });

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

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const diff = endOfDay.getTime() - now.getTime();

      if (diff > 0) {
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const [dealProduct, setDealProduct] = useState<any>(null);

  useEffect(() => {
    import("../services/productService").then(({ products }) => {
      const today = new Date();
      const start = new Date(today.getFullYear(), 0, 0);
      const diff = today.getTime() - start.getTime();
      const oneDay = 1000 * 60 * 60 * 24;
      const day = Math.floor(diff / oneDay);

      const productIndex = day % products.length;
      setDealProduct(products[productIndex]);
    });
  }, []);

  return (
    <div
      className={`relative min-h-screen transition-colors duration-700 ${isDark ? "bg-[#000]" : "bg-white"}`}
    >
      <style>{`
        :root {
          --accent: ${accentColor};
          --accent-rgb: ${accentRgb};
        }
      `}</style>

      {/* Hero Section with Scroll Interaction */}
      <section className="relative w-full">
        <HeroScrollCarousel themeMode={themeMode} accentColor={accentColor} />
      </section>

      {/* Feature Icons Section */}
      <section className="py-24 border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: Target, label: "Precision", val: "Olympic Tier" },
              { icon: Shield, label: "Secure", val: "Field Proved" },
              { icon: Zap, label: "Tactical", val: "High Spec" },
              { icon: Trophy, label: "Elite", val: "World Class" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--accent)] mb-6">
                  <item.icon size={28} strokeWidth={1.5} />
                </div>
                <h3
                  className={`text-sm font-black uppercase tracking-widest mb-2 ${isDark ? "text-white" : "text-gray-950"}`}
                >
                  {item.label}
                </h3>
                <p
                  className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? "text-gray-600" : "text-gray-400"}`}
                >
                  {item.val}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Marquee Section */}
      <TrendingMarquee />

      {/* Deal of the Day */}
      <section className="py-40 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div
            className={`rounded-[4rem] p-16 md:p-24 border relative overflow-hidden group transition-all duration-500 ${isDark ? "bg-neutral-900 border-white/5" : "bg-white border-gray-100 shadow-2xl shadow-gray-200/50"}`}
          >
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[var(--accent)]/[0.03] -skew-x-12 translate-x-32" />

            <div className="flex flex-col lg:flex-row items-center gap-20 relative z-10">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-[var(--accent)] text-black rounded-full font-black text-[10px] uppercase tracking-[0.3em] mb-10">
                  <Zap size={14} fill="currentColor" /> Flash Protocol
                </div>

                <h2
                  className={`text-6xl md:text-8xl font-black mb-10 tracking-tighter ${isDark ? "text-white" : "text-gray-950"}`}
                >
                  {dealProduct?.name || "Target Artifact"} <br />
                  <span className="text-[var(--accent)]">Special Intel</span>
                </h2>

                <div className="flex flex-wrap gap-12 justify-center lg:justify-start mb-16">
                  {[
                    { label: "Hours", val: timeLeft.hours },
                    { label: "Minutes", val: timeLeft.minutes },
                    { label: "Seconds", val: timeLeft.seconds },
                  ].map((unit, i) => (
                    <div key={i}>
                      <span
                        className={`block text-6xl font-black tracking-tighter ${isDark ? "text-white" : "text-gray-950"}`}
                      >
                        {unit.val.toString().padStart(2, "0")}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? "text-gray-700" : "text-gray-400"}`}
                      >
                        {unit.label}
                      </span>
                    </div>
                  ))}
                </div>

                {dealProduct && (
                  <div className="flex flex-col sm:flex-row items-center gap-10 justify-center lg:justify-start">
                    <div>
                      <span
                        className={`block text-xl line-through font-black uppercase tracking-widest ${isDark ? "text-gray-800" : "text-gray-200"}`}
                      >
                        {formatPrice(dealProduct.price)}
                      </span>
                      <span className="text-6xl font-black text-[var(--accent)] tracking-tighter">
                        {formatPrice(dealProduct.price * 0.7)}
                      </span>
                    </div>
                    <Link
                      to={`/product/${dealProduct.id}`}
                      className="px-12 py-6 bg-white text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
                    >
                      Authorize Deployment
                    </Link>
                  </div>
                )}
              </div>

              {dealProduct && (
                <div className="w-full lg:w-1/3 aspect-square relative">
                  <div className="absolute inset-0 bg-[var(--accent)]/20 blur-[100px] rounded-full" />
                  <motion.img
                    animate={{ y: [0, -30, 0] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    src={dealProduct.image}
                    className="w-full h-full object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-40">
        <div className="container mx-auto px-6 text-center mb-24">
          <span className="text-[var(--accent)] font-black tracking-[0.4em] uppercase text-[10px] mb-6 block">
            System Taxonomy
          </span>
          <h2
            className={`text-6xl md:text-8xl font-black tracking-tighter ${isDark ? "text-white" : "text-gray-950"}`}
          >
            Sectors <span className="text-[var(--accent)]">Grid</span>
          </h2>
        </div>

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Bows", count: "142 Assets", icon: Target },
              { title: "Arrows", count: "89 Assets", icon: ArrowRight },
              { title: "Accessories", count: "215 Assets", icon: Box },
            ].map((cat, i) => (
              <Link
                key={i}
                to={`/collection?category=${cat.title}`}
                className={`group relative overflow-hidden rounded-[3.5rem] p-12 h-[500px] border transition-all duration-700 ${isDark ? "bg-white/[0.02] border-white/5 hover:border-[var(--accent)]/30 hover:bg-white/[0.04] shadow-2xl" : "bg-white border-gray-100 shadow-2xl shadow-gray-200/50"}`}
              >
                <div className="relative z-10 h-full flex flex-col">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 transition-colors ${isDark ? "bg-white/5" : "bg-gray-50"} group-hover:bg-[var(--accent)] group-hover:text-black`}
                  >
                    <cat.icon size={28} />
                  </div>
                  <h3
                    className={`text-5xl font-black tracking-tighter mb-4 leading-none ${isDark ? "text-white" : "text-gray-950"}`}
                  >
                    {cat.title}
                  </h3>
                  <p
                    className={`text-[11px] font-black uppercase tracking-[0.3em] mb-8 ${isDark ? "text-gray-600" : "text-gray-400"}`}
                  >
                    {cat.count}
                  </p>

                  <div className="mt-auto inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[var(--accent)]">
                    Explore Sector{" "}
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-2 transition-transform"
                    />
                  </div>
                </div>
                {/* Large Background Glyph */}
                <div className="absolute -bottom-10 -right-10 text-[20rem] font-black text-white/[0.01] transition-all duration-1000 group-hover:scale-125 group-hover:text-[var(--accent)]/[0.03] pointer-events-none">
                  {cat.title[0]}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-60 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className={`text-6xl md:text-[8rem] font-black tracking-tighter leading-[0.8] mb-16 ${isDark ? "text-white" : "text-gray-950"}`}
          >
            READY TO <br /> <span className="text-[var(--accent)]">LAUNCH</span>
            ?
          </motion.h2>
          <Link
            to="/shop"
            className="inline-flex items-center gap-6 bg-white text-black px-16 py-8 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl"
          >
            Enter Terminal
            <ArrowRight size={24} />
          </Link>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent)]/10 to-transparent pointer-events-none" />
      </section>
    </div>
  );
};

export default Home;
