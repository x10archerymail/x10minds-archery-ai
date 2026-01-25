import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { products } from "../services/productService";
import { ShoppingCart, Star, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { usePreferences } from "../context/PreferencesContext";

const ProductCarousel3D: React.FC = () => {
  const { formatPrice } = usePreferences();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const count = Math.min(products.length, 12);

  // Auto-rotation
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count);
    }, 18000);
    return () => clearInterval(interval);
  }, [isAutoPlay, count]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % count);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 25000);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + count) % count);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 25000);
  };

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const normalizedDiff = ((diff + count) % count) - Math.floor(count / 2);

    // Calculate position in a wave pattern
    const angle = normalizedDiff * 25; // degrees
    const distance = Math.abs(normalizedDiff) * 80 + 200;
    const zOffset = -Math.abs(normalizedDiff) * 150;
    const scale = 1 - Math.abs(normalizedDiff) * 0.15;
    const opacity = 1 - Math.abs(normalizedDiff) * 0.25;
    const blur = Math.abs(normalizedDiff) * 2;

    return {
      transform: `
        perspective(2000px)
        rotateY(${angle}deg)
        translateX(${normalizedDiff * distance}px)
        translateZ(${zOffset}px)
        scale(${Math.max(scale, 0.5)})
      `,
      opacity: Math.max(opacity, 0.3),
      filter: `blur(${blur}px)`,
      zIndex: 100 - Math.abs(normalizedDiff),
      transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
    };
  };

  return (
    <section className="w-full py-32 overflow-hidden bg-gradient-to-b from-black via-[#0a0a0a] to-black relative">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-r from-[#FFD700]/20 via-[#FFA500]/20 to-[#FFD700]/20 blur-[120px]"
          animate={{
            x: ["-50%", "50%", "-50%"],
            y: ["-50%", "50%", "-50%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ top: "50%", left: "50%" }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
              y: Math.random() * 800,
            }}
            animate={{
              y: [null, Math.random() * 800 - 400],
              x: [null, Math.random() * 200 - 100],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles size={12} className="text-[#FFD700]" />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-6 text-center mb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20 border border-[#FFD700]/30 rounded-full px-6 py-2 mb-6"
        >
          <Sparkles size={16} className="text-[#FFD700]" />
          <span className="text-[#FFD700] font-bold tracking-wider uppercase text-sm">
            Premium Collection
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-[#FFD700] to-white bg-clip-text text-transparent"
        >
          Immersive 3D Experience
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 max-w-2xl mx-auto text-lg"
        >
          Explore our curated selection in stunning 3D. Swipe, click, or let it
          flow.
        </motion.p>
      </div>

      {/* Main Carousel Container */}
      <div
        ref={containerRef}
        className="relative w-full h-[700px] flex items-center justify-center perspective-[2000px]"
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {Array.from({ length: count }).map((_, i) => {
            const product = products[i];
            const isActive = i === activeIndex;

            return (
              <motion.div
                key={product.id}
                className="absolute w-[320px] md:w-[380px]"
                style={getCardStyle(i)}
              >
                <div
                  className={`relative rounded-3xl overflow-hidden border transition-all duration-700 ${
                    isActive
                      ? "border-[#FFD700] shadow-2xl shadow-[#FFD700]/50"
                      : "border-white/10 shadow-xl"
                  }`}
                >
                  {/* Glass morphism background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80 backdrop-blur-xl" />

                  {/* Content */}
                  <div className="relative p-6">
                    {/* Image Section */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-6 group">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 transition-transform duration-1000 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                        <Link
                          to={`/product/${product.id}`}
                          className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-black px-8 py-4 rounded-xl hover:scale-110 transition-transform shadow-2xl"
                        >
                          View Details
                        </Link>
                      </div>

                      {/* Featured badge */}
                      {product.featured && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black text-xs font-black px-4 py-2 rounded-full shadow-lg flex items-center gap-1">
                          <Star size={12} fill="currentColor" />
                          FEATURED
                        </div>
                      )}

                      {/* Rating */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Star
                          size={14}
                          className="text-[#FFD700]"
                          fill="#FFD700"
                        />
                        <span className="text-white text-sm font-bold">
                          4.8
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-[#FFD700] font-bold uppercase tracking-wider mb-2">
                          {product.category}
                        </p>
                        <h3 className="font-bold text-xl line-clamp-2 text-white mb-2">
                          {product.name}
                        </h3>
                      </div>

                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-3xl font-black text-[#FFD700]">
                            {formatPrice(product.price)}
                          </div>
                          <div className="text-sm text-gray-500 line-through">
                            {formatPrice(Math.round(product.price * 1.4))}
                          </div>
                        </div>

                        <button className="p-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-2xl text-black hover:scale-110 active:scale-95 transition-all shadow-lg shadow-[#FFD700]/30">
                          <ShoppingCart size={22} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Glow effect for active card */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-3xl"
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(255, 215, 0, 0.3)",
                          "0 0 60px rgba(255, 215, 0, 0.6)",
                          "0 0 20px rgba(255, 215, 0, 0.3)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-50 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-[#FFD700] hover:bg-gradient-to-br hover:from-[#FFD700] hover:to-[#FFA500] hover:text-black transition-all duration-300 shadow-2xl hover:shadow-[#FFD700]/50 hover:scale-110 backdrop-blur-xl group"
        >
          <svg
            className="w-8 h-8 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={handleNext}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-50 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-[#FFD700] hover:bg-gradient-to-br hover:from-[#FFD700] hover:to-[#FFA500] hover:text-black transition-all duration-300 shadow-2xl hover:shadow-[#FFD700]/50 hover:scale-110 backdrop-blur-xl group"
        >
          <svg
            className="w-8 h-8 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-6 mt-16 relative z-10">
        <button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className={`px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-300 shadow-xl ${
            isAutoPlay
              ? "bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:scale-105"
              : "bg-white/10 border border-white/20 hover:border-[#FFD700] hover:bg-white/20"
          }`}
        >
          {isAutoPlay ? "⏸ PAUSE AUTO-PLAY" : "▶ RESUME AUTO-PLAY"}
        </button>
      </div>

      {/* Indicator Dots */}
      <div className="flex justify-center gap-3 mt-8 relative z-10">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveIndex(i);
              setIsAutoPlay(false);
              setTimeout(() => setIsAutoPlay(true), 5000);
            }}
            className={`transition-all duration-300 rounded-full ${
              i === activeIndex
                ? "w-12 h-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500]"
                : "w-3 h-3 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductCarousel3D;
