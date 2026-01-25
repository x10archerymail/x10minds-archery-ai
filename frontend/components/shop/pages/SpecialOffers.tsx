import * as React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingCart, Star, Tag, Percent } from "lucide-react";
import { Product, getProducts } from "../services/productService";
import { Link } from "react-router-dom";
import { usePreferences } from "../context/PreferencesContext";
import { useCart } from "../context/CartContext";

// Extended interface for products with special offers
interface SpecialOfferProduct extends Product {
  originalPrice: number;
  discount: number;
}

interface SpecialOffersProps {
  themeMode?: "dark" | "light";
  accentColor?: string;
}

const SpecialOffers: React.FC<SpecialOffersProps> = ({
  themeMode = "dark",
  accentColor = "#FFD700",
}) => {
  const { formatPrice } = usePreferences();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<SpecialOfferProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<
    SpecialOfferProduct[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");

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
      // Simulate special offers by adding discount to products
      const offers = data
        .map((p) => ({
          ...p,
          originalPrice: p.price,
          discount: Math.floor(Math.random() * 30) + 10, // 10-40% discount
          price: p.price * (1 - (Math.floor(Math.random() * 30) + 10) / 100),
        }))
        .slice(0, 16); // Show 16 products on sale

      setProducts(offers);
      setFilteredProducts(offers);
    });
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const result = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredProducts(result);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  return (
    <div className="pt-32 pb-24 container mx-auto px-6">
      <style>{`
        :root {
          --accent: ${accentColor};
          --accent-rgb: ${accentRgb};
        }
      `}</style>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div>
          <header className="mb-4">
            <h1
              className={`text-6xl font-black mb-4 tracking-tighter ${isDark ? "text-white" : "text-gray-950"}`}
            >
              Special <span className="text-[var(--accent)]">Incentives</span>
            </h1>
            <p
              className={`font-black uppercase tracking-[0.2em] text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              High-value opportunities and limited-time system authorizations
            </p>
          </header>
        </div>

        <div className="relative w-full md:w-auto group">
          <Search
            className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isDark ? "text-gray-600 group-focus-within:text-[var(--accent)]" : "text-gray-400 group-focus-within:text-black"}`}
            size={18}
          />
          <input
            type="text"
            placeholder="Search Incentives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`rounded-full py-4 pl-12 pr-8 focus:border-[var(--accent)] transition-all outline-none font-bold text-xs w-full min-w-[280px] border ${
              isDark
                ? "bg-white/5 border-white/5 text-white placeholder:text-gray-700"
                : "bg-white border-gray-100 text-black shadow-xl shadow-gray-200/50 placeholder:text-gray-400"
            }`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: i * 0.05,
              duration: 0.5,
              ease: [0.19, 1, 0.22, 1],
            }}
            className="group"
          >
            <div
              className={`rounded-[2.5rem] p-6 h-full flex flex-col transition-all duration-500 border relative ${
                isDark
                  ? "bg-neutral-900 border-white/5 hover:border-[rgba(var(--accent-rgb),0.3)] hover:z-50 hover:shadow-2xl hover:shadow-[rgba(var(--accent-rgb),0.05)]"
                  : "bg-white border-gray-100 hover:border-[rgba(var(--accent-rgb),0.2)] hover:z-50 hover:shadow-2xl hover:shadow-gray-200"
              }`}
            >
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg shadow-red-500/20">
                  <Percent size={12} strokeWidth={3} />
                  {product.discount}% Benefit
                </span>
              </div>

              <Link
                to={`/product/${product.id}`}
                className={`relative aspect-square mb-8 overflow-hidden rounded-[2rem] transition-all duration-700 group/img flex items-center justify-center ${
                  isDark
                    ? "bg-white/5 hover:bg-white/10"
                    : "bg-gray-50 hover:bg-gray-100"
                } hover:scale-150 hover:z-50 hover:shadow-[0_40px_100px_rgba(0,0,0,0.6)] active:scale-140`}
                style={{ transformOrigin: "center center" }}
              >
                {/* Primary Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-full object-contain p-4 transition-all duration-700 ${
                    product.images && product.images.length > 1
                      ? "group-hover/img:opacity-0 group-hover/img:scale-75"
                      : "group-hover/img:scale-110"
                  }`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/400x400?text=" +
                      product.name;
                  }}
                />

                {/* Secondary Image (Reveal on Hover) */}
                {product.images && product.images.length > 1 && (
                  <img
                    src={product.images[1]}
                    alt={`${product.name} alternate`}
                    className="absolute inset-0 w-full h-full object-contain p-4 opacity-0 scale-125 group-hover/img:opacity-100 group-hover/img:scale-100 transition-all duration-700 pointer-events-none"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500" />

                <div className="absolute bottom-6 right-6 translate-y-12 opacity-0 group-hover/img:translate-y-0 group-hover/img:opacity-100 transition-all duration-500 ease-out z-[60]">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="w-12 h-12 bg-[var(--accent)] text-black rounded-2xl flex items-center justify-center shadow-xl shadow-[rgba(var(--accent-rgb),0.3)] transform hover:scale-110 active:scale-95 transition-all"
                  >
                    <ShoppingCart size={20} strokeWidth={2.5} />
                  </button>
                </div>
              </Link>

              <div className="flex-grow px-2">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.2em]">
                    {product.category}
                  </span>
                  <div
                    className={`flex items-center gap-1.5 text-[10px] font-black py-1 px-3 rounded-lg ${
                      isDark
                        ? "bg-white/5 text-[var(--accent)]"
                        : "bg-[rgba(var(--accent-rgb),0.05)] text-[rgba(var(--accent-rgb),0.8)]"
                    }`}
                  >
                    <Star size={10} fill="currentColor" />
                    <span>{product.rating}</span>
                  </div>
                </div>
                <Link
                  to={`/product/${product.id}`}
                  className={`text-sm font-black uppercase tracking-widest mb-2 block hover:text-[var(--accent)] transition-colors line-clamp-1 ${
                    isDark ? "text-white" : "text-gray-950"
                  }`}
                >
                  {product.name}
                </Link>
                <p
                  className={`text-[10px] font-medium leading-relaxed line-clamp-2 mb-6 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {product.description}
                </p>
              </div>

              <div
                className={`flex justify-between items-end mt-auto pt-6 border-t ${
                  isDark ? "border-white/5" : "border-gray-50"
                }`}
              >
                <div className="flex flex-col">
                  <span
                    className={`text-[10px] font-black line-through mb-1 ${isDark ? "text-gray-600" : "text-gray-300"}`}
                  >
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-xl font-black text-[var(--accent)]">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <Link
                  to={`/product/${product.id}`}
                  className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${
                    isDark
                      ? "text-gray-500 hover:text-white"
                      : "text-gray-400 hover:text-black"
                  }`}
                >
                  Initialize <Tag size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-32 text-center">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 ${isDark ? "bg-white/5" : "bg-gray-100"}`}
          >
            <Tag className="text-gray-500" size={48} />
          </div>
          <p
            className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? "text-gray-600" : "text-gray-400"}`}
          >
            No system incentives found matching your search parameters.
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-6 text-[var(--accent)] font-black uppercase tracking-widest text-xs hover:text-white transition-colors underline underline-offset-8"
          >
            Reset Incentive Scan
          </button>
        </div>
      )}
    </div>
  );
};

export default SpecialOffers;
