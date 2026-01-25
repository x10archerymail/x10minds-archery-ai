import * as React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingCart, Star } from "lucide-react";
import { Product, getProducts } from "../services/productService";
import { Link } from "react-router-dom";
import { usePreferences } from "../context/PreferencesContext";
import { useCart } from "../context/CartContext";

interface ShopProps {
  themeMode?: "dark" | "light";
  accentColor?: string;
}

const Shop: React.FC<ShopProps> = ({
  themeMode = "dark",
  accentColor = "orange",
}) => {
  const { formatPrice } = usePreferences();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

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
    getProducts().then((data) => {
      setProducts(data);
      setFilteredProducts(data);
    });
  }, []);

  useEffect(() => {
    let result = products;
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchQuery) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    setFilteredProducts(result);
  }, [searchQuery, activeCategory, products]);

  const categories = [
    "All",
    "Bows",
    "Arrows",
    "Accessories",
    "Targets",
    "Cases",
  ];

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-20">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-[var(--accent)] font-black tracking-[0.4em] uppercase text-[10px] mb-6 block`}
            >
              System Inventory
            </motion.span>
            <h1
              className={`text-6xl font-black tracking-tighter ${isDark ? "text-white" : "text-gray-950"}`}
            >
              The <span className="text-[var(--accent)]">Collection</span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
            <div className="relative group">
              <Search
                className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${
                  isDark
                    ? `text-gray-600 group-focus-within:text-[var(--accent)]`
                    : `text-gray-400 group-focus-within:text-[var(--accent)]`
                }`}
                size={18}
              />
              <input
                type="text"
                placeholder="Search Assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`rounded-2xl py-4 pl-14 pr-8 outline-none transition-all w-full sm:w-72 font-bold text-sm border ${
                  isDark
                    ? `bg-white/5 border-white/5 text-white focus:border-[var(--accent)] focus:bg-white/10`
                    : `bg-gray-50 border-gray-100 text-gray-900 focus:border-[var(--accent)] focus:shadow-xl focus:shadow-gray-200`
                }`}
              />
            </div>
          </div>
        </div>

        <div
          className={`flex gap-4 p-2 rounded-[2.5rem] mb-16 overflow-x-auto no-scrollbar border ${
            isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-100"
          }`}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-10 py-4 rounded-[1.8rem] text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? `bg-[var(--accent)] ${accentColor === "orange" || accentColor === "#FFD700" ? "text-black" : "text-white"} shadow-2xl shadow-[rgba(var(--accent-rgb),0.3)]`
                  : isDark
                    ? "text-gray-600 hover:text-white"
                    : "text-gray-400 hover:text-gray-950"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="group"
            >
              <div
                className={`rounded-[3rem] p-6 h-full flex flex-col transition-all duration-500 border relative ${
                  isDark
                    ? `bg-neutral-900 border-white/5 hover:border-[var(--accent)]/40 hover:z-50 shadow-2xl shadow-black/80`
                    : `bg-white border-gray-100 hover:border-[var(--accent)]/40 hover:z-50 shadow-2xl shadow-gray-200/40`
                }`}
              >
                <Link
                  to={`/product/${product.id}`}
                  className={`relative aspect-square mb-8 overflow-hidden rounded-[2.5rem] transition-all duration-700 group/img ${
                    isDark ? "bg-white/5" : "bg-gray-50"
                  } hover:scale-150 hover:z-50 hover:shadow-[0_40px_100px_rgba(0,0,0,0.6)] active:scale-140`}
                  style={{ transformOrigin: "center center" }}
                >
                  {/* Primary Image */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-contain p-6 transition-all duration-700 ${
                      product.images && product.images.length > 1
                        ? "group-hover/img:opacity-0 group-hover/img:scale-75"
                        : "group-hover/img:scale-110"
                    }`}
                  />

                  {/* Secondary Image (Reveal on Hover) */}
                  {product.images && product.images.length > 1 && (
                    <img
                      src={product.images[1]}
                      alt={`${product.name} alternate`}
                      className="absolute inset-0 w-full h-full object-contain p-6 opacity-0 scale-125 group-hover/img:opacity-100 group-hover/img:scale-100 transition-all duration-700 pointer-events-none"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />

                  <div className="absolute top-4 right-4 translate-x-12 opacity-0 group-hover/img:translate-x-0 group-hover/img:opacity-100 transition-all duration-500 z-[60]">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className={`w-10 h-10 bg-[var(--accent)] ${accentColor === "orange" || accentColor === "#FFD700" ? "text-black" : "text-white"} rounded-xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all`}
                    >
                      <ShoppingCart size={16} strokeWidth={3} />
                    </button>
                  </div>
                </Link>

                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.3em] bg-[rgba(var(--accent-rgb),0.1)] px-3 py-1 rounded-full`}
                    >
                      {product.category}
                    </span>
                    <div
                      className={`flex items-center gap-1.5 text-[10px] font-black ${isDark ? "text-gray-500" : "text-gray-400"}`}
                    >
                      <Star
                        size={12}
                        className="text-[var(--accent)]"
                        fill={accentColor}
                      />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                  <Link
                    to={`/product/${product.id}`}
                    className={`text-2xl font-black mb-3 block hover:text-[var(--accent)] transition-colors leading-tight tracking-tighter ${
                      isDark ? "text-white" : "text-gray-950"
                    }`}
                  >
                    {product.name}
                  </Link>
                  <p
                    className={`text-[11px] line-clamp-2 mb-6 font-black uppercase tracking-widest leading-loose ${
                      isDark ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {product.description}
                  </p>
                </div>

                <div
                  className={`flex justify-between items-center mt-6 pt-6 border-t ${
                    isDark ? "border-white/5" : "border-gray-100"
                  }`}
                >
                  <span
                    className={`text-3xl font-black tracking-tighter ${isDark ? "text-white" : "text-gray-950"}`}
                  >
                    {formatPrice(product.price)}
                  </span>
                  <Link
                    to={`/product/${product.id}`}
                    className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all px-4 py-2 rounded-xl border-2 ${
                      isDark
                        ? "text-gray-500 border-white/5 hover:text-white hover:bg-white/5 hover:border-white/10"
                        : "text-gray-400 border-gray-100 hover:text-gray-950 hover:bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    Specifications
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-40 text-center">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 ${isDark ? "bg-white/5" : "bg-gray-50"}`}
            >
              <Search
                size={40}
                className={isDark ? "text-gray-800" : "text-gray-200"}
              />
            </div>
            <p
              className={`text-xl font-black uppercase tracking-[0.3em] mb-10 ${isDark ? "text-gray-600" : "text-gray-400"}`}
            >
              System Search Result: Zero Matches found
            </p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
              }}
              className={`bg-[var(--accent)] ${accentColor === "orange" || accentColor === "#FFD700" ? "text-black" : "text-white"} px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[rgba(var(--accent-rgb),0.3)]`}
            >
              Re-initialize Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
