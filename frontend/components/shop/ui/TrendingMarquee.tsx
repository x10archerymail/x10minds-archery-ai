import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { products } from "../services/productService";
import { usePreferences } from "../context/PreferencesContext";
import { Star } from "lucide-react";

const TrendingMarquee = () => {
  const { formatPrice } = usePreferences();
  // Use a different set of products or just all of them
  const trendingProducts = products.slice(0, 10);

  return (
    <section className="py-24 overflow-hidden bg-[#050505] border-y border-white/10 relative">
      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--accent)]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 mb-12 relative z-10">
        <h3 className="text-2xl font-black uppercase tracking-widest text-[var(--accent)] mb-2">
          Trending Now
        </h3>
        <h2 className="text-4xl font-black tracking-tighter text-white">
          Elite Selections
        </h2>
      </div>

      {/* Infinite Marquee */}
      <div
        className="flex w-full overflow-hidden relative"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        }}
      >
        {/* We double the list for infinite loop */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex gap-8 flex-nowrap pl-6 min-w-max"
        >
          {[...trendingProducts, ...trendingProducts].map((product, idx) => (
            <Link
              key={`${product.id}-${idx}`}
              to={`/product/${product.id}`}
              className="group relative w-[320px] h-[450px] bg-[#111] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-[var(--accent)]/30 transition-all duration-500 hover:-translate-y-4 shadow-2xl"
            >
              <div className="h-2/3 bg-white p-6 flex items-center justify-center relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                />
                {product.featured && (
                  <div className="absolute top-4 right-4 bg-[var(--accent)] text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    Hot
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-white line-clamp-1">
                    {product.name}
                  </h4>
                  <div className="flex gap-1 text-[var(--accent)]">
                    <Star size={14} fill="currentColor" />
                    <span className="text-xs font-bold">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
                  {product.category}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-white">
                    {formatPrice(product.price)}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:text-black transition-colors">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrendingMarquee;
