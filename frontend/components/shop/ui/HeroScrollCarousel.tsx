import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  Shield,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "../services/productService";
import { usePreferences } from "../context/PreferencesContext";
import { useCart } from "../context/CartContext";

// Configuration for valid museum-grade IDs
const DISPLAY_IDS = ["1", "2", "6", "12", "16", "21", "25", "46"];
const HERO_PRODUCTS = products
  .filter((p) => DISPLAY_IDS.includes(p.id))
  .sort((a, b) => DISPLAY_IDS.indexOf(a.id) - DISPLAY_IDS.indexOf(b.id));

const DESIGN_SYSTEM = [
  { bg: "#f0fdf4", accent: "#22c55e", secondary: "#14532d", text: "#064e3b" }, // Green (Hoyt)
  { bg: "#fdf2f8", accent: "#ec4899", secondary: "#831843", text: "#500724" }, // Pink (Win&Win)
  { bg: "#f0f9ff", accent: "#0ea5e9", secondary: "#0c4a6e", text: "#082f49" }, // Blue (Formula)
  { bg: "#fff7ed", accent: "#f97316", secondary: "#7c2d12", text: "#431407" }, // Orange (MK)
  { bg: "#faf5ff", accent: "#a855f7", secondary: "#581c87", text: "#3b0764" }, // Purple (Elite)
  { bg: "#fef2f2", accent: "#ef4444", secondary: "#7f1d1d", text: "#450a0a" }, // Red (Easton)
  { bg: "#ecfeff", accent: "#06b6d4", secondary: "#164e63", text: "#083344" }, // Cyan (Case)
  { bg: "#f8fafc", accent: "#64748b", secondary: "#0f172a", text: "#020617" }, // Slate (Tab)
];

interface HeroScrollCarouselProps {
  themeMode?: "dark" | "light";
  accentColor?: string;
}

const HeroScrollCarousel: React.FC<HeroScrollCarouselProps> = ({
  themeMode = "dark",
  accentColor = "#f97316",
}) => {
  const { formatPrice } = usePreferences();
  const { addToCart } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const isDark = themeMode === "dark";

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_PRODUCTS.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? HERO_PRODUCTS.length - 1 : prev - 1,
    );
    setIsAutoPlay(false);
  };

  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_PRODUCTS.length);
    }, 18000);
    return () => clearInterval(timer);
  }, [isAutoPlay, currentIndex]);

  // Resume autoplay after interaction
  useEffect(() => {
    if (isAutoPlay) return;
    const timer = setTimeout(() => setIsAutoPlay(true), 25000); // Wait longer after interaction
    return () => clearTimeout(timer);
  }, [isAutoPlay]);

  const product = HERO_PRODUCTS[currentIndex];
  const design = DESIGN_SYSTEM[currentIndex % DESIGN_SYSTEM.length];

  // Dynamic Background Colors based on Theme Mode
  // If Dark: Use a very dark hex that is tinted with the product color
  // If Light: Use the original pastel background
  const activeBg = isDark
    ? design.secondary // Use the darker secondary color as base
        .replace("#", "")
        .match(/.{2}/g)
        ?.map((h) => parseInt(h, 16))
        .reduce(
          (acc, val, i) =>
            acc +
            (i === 0 ? "rgb(" : "") +
            Math.max(0, val - 40) + // Darken it significantly
            (i < 2 ? "," : ")"),
          "",
        ) || "#0f172a"
    : design.bg;

  // Text Colors
  const titleColor = isDark ? "#ffffff" : design.secondary;
  const subTextColor = isDark ? "#94a3b8" : "#64748b";

  if (!product) return null;

  return (
    <div className="relative w-full min-h-[100vh] lg:h-[110vh] overflow-hidden">
      <motion.div
        animate={{ backgroundColor: isDark ? "#050505" : activeBg }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 flex items-center justify-center pt-16"
      >
        {/* Animated Background Blobs - Tinted with Product Color for Atmosphere */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {isDark && (
            <div
              className="absolute inset-0 opacity-40 bg-gradient-to-b from-transparent to-black/80"
              style={{ mixBlendMode: "multiply" }}
            />
          )}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 180, 270, 360],
              x: [0, 50, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className={`absolute -top-[15%] -left-[10%] w-[60vw] h-[60vw] rounded-full blur-[140px] transition-colors duration-1000 ${
              isDark ? "opacity-20" : "opacity-40"
            }`}
            style={{
              background: `radial-gradient(circle, ${design.accent} 0%, transparent 70%)`,
            }}
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 270, 180, 90, 0],
              x: [0, -50, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className={`absolute -bottom-[15%] -right-[10%] w-[50vw] h-[50vw] rounded-full blur-[140px] transition-colors duration-1000 ${
              isDark ? "opacity-15" : "opacity-30"
            }`}
            style={{
              background: `radial-gradient(circle, ${design.accent} 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* Large Background Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
          <AnimatePresence mode="wait">
            <motion.h1
              key={`bg-text-${currentIndex}`}
              initial={{ opacity: 0, scale: 1.2, y: 50 }}
              animate={{ opacity: isDark ? 0.05 : 0.04, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              transition={{ duration: 0.6 }}
              className={`text-[30vw] md:text-[25vw] font-black uppercase whitespace-nowrap select-none ${
                isDark ? "text-white" : ""
              }`}
              style={{ color: isDark ? undefined : design.secondary }}
            >
              {product.name.split(" ")[0]}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 pt-16 lg:pt-0 pb-32 lg:pb-0 h-full flex flex-col lg:flex-row items-center justify-center relative z-20 gap-0 lg:gap-16">
          {/* Product Image */}
          <div className="relative w-full lg:w-1/2 flex items-center justify-center z-30 h-[30vh] sm:h-[35vh] md:h-[50vh] lg:h-auto -mb-8 lg:mb-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={`img-${currentIndex}`}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  mass: 1,
                }}
                className="relative w-full flex justify-center h-full items-center"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full lg:max-h-[65vh] w-auto object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.5)] transition-transform duration-500"
                />
                <div
                  className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4/5 lg:w-3/5 h-6 lg:h-12 blur-[25px] rounded-full ${
                    isDark ? "bg-white/[0.05]" : "bg-black/[0.1]"
                  }`}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Product Details Card */}
          <div
            className="w-full lg:w-1/2 max-w-xl z-40 relative"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`info-${currentIndex}`}
                initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -20, filter: "blur(5px)" }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div
                  className={`backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border transition-all duration-300 ${
                    isDark
                      ? "bg-neutral-900/60 border-white/10 shadow-black/20"
                      : "bg-white/60 border-white/60 hover:shadow-xl"
                  }`}
                >
                  {/* Category Pill - Hidden on Mobile to save space */}
                  <div className="hidden lg:flex items-center gap-4 mb-8">
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[.2em] shadow-sm"
                      style={{
                        backgroundColor: isDark
                          ? `${accentColor}20`
                          : `${design.accent}20`,
                        color: isDark ? accentColor : design.accent,
                      }}
                    >
                      {product.category}
                    </motion.span>
                    <div className="flex items-center gap-1.5 text-yellow-500">
                      <Star size={16} fill="currentColor" />
                      <span
                        className={`text-xs font-black ${
                          isDark ? "opacity-60" : "opacity-40"
                        }`}
                      >
                        {product.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <h2
                    className="text-3xl md:text-5xl lg:text-7xl font-black mb-6 leading-[0.9] tracking-tighter"
                    style={{ color: titleColor }}
                  >
                    {product.name}
                  </h2>

                  <p
                    className="text-sm md:text-base leading-relaxed mb-10 font-medium line-clamp-3"
                    style={{ color: subTextColor }}
                  >
                    {product.description}
                  </p>

                  <div className="flex items-end justify-between mb-8 lg:mb-10 pt-6 lg:pt-8 border-t border-white/5">
                    <div className="space-y-1">
                      <span className="block text-[10px] font-black uppercase tracking-widest text-[#64748b]">
                        Acquisition Cost
                      </span>
                      <motion.span
                        key={`price-${currentIndex}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black tracking-tighter"
                        style={{ color: titleColor }}
                      >
                        {formatPrice(product.price)}
                      </motion.span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Link
                      to={`/product/${product.id}`}
                      className="flex-1 py-5 rounded-2xl font-black text-black text-xs uppercase tracking-[.2em] shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                      style={{
                        backgroundColor: accentColor, // Locking to Theme Accent
                        color: isDark ? "#000" : "#fff",
                      }}
                    >
                      View Details
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all shadow-md ${
                        isDark
                          ? "bg-neutral-800 border-neutral-700 text-gray-400 hover:text-white hover:bg-neutral-700"
                          : "bg-white border-transparent hover:border-gray-200 text-gray-400 hover:text-black hover:bg-gray-50"
                      }`}
                    >
                      <ShoppingCart size={22} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Controls (Side Buttons) */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-12 pointer-events-none z-50">
          <button
            onClick={prevSlide}
            className={`pointer-events-auto w-12 h-12 md:w-20 md:h-20 rounded-full backdrop-blur-md shadow-lg border flex items-center justify-center transition-all group ${
              isDark
                ? "bg-black/40 border-white/10 text-white hover:bg-black/60"
                : "bg-white/40 border-white/50 text-gray-600 hover:bg-white hover:text-black"
            }`}
          >
            <ChevronLeft
              size={24}
              className="md:w-8 md:h-8 group-hover:-translate-x-1 transition-transform"
            />
          </button>
          <button
            onClick={nextSlide}
            className={`pointer-events-auto w-12 h-12 md:w-20 md:h-20 rounded-full backdrop-blur-md shadow-lg border flex items-center justify-center transition-all group ${
              isDark
                ? "bg-black/40 border-white/10 text-white hover:bg-black/60"
                : "bg-white/40 border-white/50 text-gray-600 hover:bg-white hover:text-black"
            }`}
          >
            <ChevronRight
              size={24}
              className="md:w-8 md:h-8 group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-50">
          {HERO_PRODUCTS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentIndex(i);
                setIsAutoPlay(false);
              }}
              className="group relative h-10 w-4 flex items-center justify-center"
            >
              <div
                className={`transition-all duration-500 rounded-full ${
                  i === currentIndex ? "w-4 h-4" : "w-2 h-2"
                }`}
                style={{
                  backgroundColor:
                    i === currentIndex
                      ? accentColor // Match Theme Accent
                      : isDark
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(0,0,0,0.2)",
                  boxShadow:
                    i === currentIndex ? `0 0 20px ${accentColor}80` : "none",
                }}
              />
            </button>
          ))}
        </div>

        {/* Bottom Features Strip */}
        <div
          className={`absolute bottom-0 left-0 right-0 backdrop-blur-lg border-t py-4 hidden md:block z-[45] ${
            isDark
              ? "bg-black/40 border-white/5"
              : "bg-white/20 border-white/30"
          }`}
        >
          <div className="container mx-auto px-6 flex justify-center gap-16 md:gap-32">
            {[
              { icon: Shield, label: "Certified Protection" },
              { icon: Zap, label: "Instant Deployment" },
              { icon: Star, label: "Olympic Standard" },
            ].map((f, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 ${
                  isDark ? "text-gray-400" : "text-gray-700/70"
                }`}
              >
                <f.icon size={16} />
                <span className="text-[10px] font-black uppercase tracking-[.2em]">
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroScrollCarousel;
