import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Star,
  Shield,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  ArrowLeft,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { Product, getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import { usePreferences } from "../context/PreferencesContext";

interface ProductProps {
  themeMode?: "dark" | "light";
  accentColor?: string;
}

const ProductPage: React.FC<ProductProps> = ({
  themeMode = "dark",
  accentColor = "orange",
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { formatPrice } = usePreferences();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDark = themeMode === "dark";

  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : "255, 215, 0";
  };

  const accentRgb = hexToRgb(accentColor);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      getProductById(id).then((data) => {
        setProduct(data || null);
        if (data) {
          if (data.colors && data.colors.length > 0) {
            const firstColor = data.colors[0];
            setSelectedColor(firstColor);

            // Sync initial image with color if applicable
            if (data.colorImages && data.colorImages[firstColor]) {
              const allImgs = data.images || [data.image];
              const idx = allImgs.findIndex(
                (img) => img === data.colorImages![firstColor],
              );
              if (idx !== -1) setSelectedImage(idx);
            }
          }
          if (data.sizes && data.sizes.length > 0)
            setSelectedSize(data.sizes[0]);
        }
        setLoading(false);
      });
    }
  }, [id]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[rgba(var(--accent-rgb),0.2)] border-t-[var(--accent)] rounded-full animate-spin" />
          <span className="text-[var(--accent)] font-black uppercase tracking-widest animate-pulse">
            Sustaining Performance...
          </span>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-32 px-6">
        <h2
          className={`text-3xl font-black mb-4 ${isDark ? "text-white" : "text-gray-950"}`}
        >
          Product Discovery Failed
        </h2>
        <p
          className={`text-center mb-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}
        >
          The requested equipment could not be located in our inventory.
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="bg-[var(--accent)] text-black font-black uppercase tracking-widest px-8 py-3 rounded-xl hover:scale-105 transition-all"
        >
          Return to Armory
        </button>
      </div>
    );

  const allImages = product.images || [product.image];

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    if (product?.colorImages && product.colorImages[color]) {
      const imageUrl = product.colorImages[color];
      const imageIndex = allImages.findIndex((img) => img === imageUrl);
      if (imageIndex !== -1) {
        setSelectedImage(imageIndex);
      }
    }
  };

  return (
    <div
      className={`pt-32 pb-24 min-h-screen ${isDark ? "bg-black" : "bg-gray-50/50"}`}
    >
      <style>{`
        :root {
          --accent: ${accentColor};
          --accent-rgb: ${accentRgb};
        }
      `}</style>
      <div className="container mx-auto px-6">
        <button
          onClick={() => navigate(-1)}
          className={`group flex items-center gap-3 mb-12 transition-all font-black uppercase tracking-widest text-xs ${
            isDark
              ? "text-gray-500 hover:text-[var(--accent)]"
              : "text-gray-400 hover:text-black"
          }`}
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Equipment
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* LEFT COLUMN: Images */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col-reverse md:flex-row gap-6">
              {/* Thumbnails */}
              <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all p-2 ${
                      selectedImage === i
                        ? "border-[var(--accent)] scale-105 shadow-lg shadow-[rgba(var(--accent-rgb),0.2)]"
                        : isDark
                          ? "border-white/5 bg-neutral-900/40"
                          : "border-gray-100 bg-white"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${i}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image with Zoom */}
              <div className="relative flex-grow">
                <motion.div
                  ref={containerRef}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  onMouseMove={handleMouseMove}
                  onClick={() => setIsZoomed(true)}
                  className={`relative rounded-[3rem] p-12 md:p-16 aspect-square flex items-center justify-center border overflow-hidden cursor-zoom-in transition-all duration-500 ${
                    isDark
                      ? "bg-neutral-900/40 border-white/5"
                      : "bg-white border-gray-100 shadow-2xl shadow-gray-200/50"
                  }`}
                >
                  <img
                    src={allImages[selectedImage]}
                    alt={product.name}
                    style={{
                      transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                      transform: isHovering ? "scale(1.8)" : "scale(1)",
                    }}
                    className="w-full h-full object-contain transition-transform duration-200 ease-out"
                  />

                  {!isHovering && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute bottom-8 right-8 bg-black/50 backdrop-blur-md text-white p-3 rounded-2xl border border-white/10"
                    >
                      <Maximize2 size={20} />
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Details */}
          <div className="lg:col-span-5">
            <div className="sticky top-40">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-[rgba(var(--accent-rgb),0.1)] text-[var(--accent)] px-3 py-1 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star
                      size={14}
                      className="text-[var(--accent)] fill-[var(--accent)]"
                    />
                    <span
                      className={`text-xs font-black ${isDark ? "text-white" : "text-gray-950"}`}
                    >
                      {product.rating}
                    </span>
                    <span className="text-gray-500 text-xs font-bold">
                      ({product.reviews} reviews)
                    </span>
                  </div>
                </div>

                <h1
                  className={`text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight ${isDark ? "text-white" : "text-gray-950"}`}
                >
                  {product.name}
                </h1>

                <div
                  className={`text-4xl font-black mb-8 ${isDark ? "text-white" : "text-gray-950"}`}
                >
                  {formatPrice(product.price)}
                </div>

                <p
                  className={`text-lg leading-relaxed mb-10 font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  {product.description}
                </p>

                {/* Color Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-8">
                    <h3
                      className={`text-xs font-black uppercase tracking-widest mb-4 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Select Color:{" "}
                      <span className={isDark ? "text-white" : "text-black"}>
                        {selectedColor}
                      </span>
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleColorSelect(color)}
                          className={`group relative p-1 rounded-full border-2 transition-all ${
                            selectedColor === color
                              ? "border-[var(--accent)] scale-110"
                              : "border-transparent hover:border-gray-500"
                          }`}
                        >
                          <div
                            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center"
                            style={{
                              backgroundColor: color
                                .toLowerCase()
                                .includes("black")
                                ? "#1a1a1a"
                                : color.toLowerCase().includes("white")
                                  ? "#ffffff"
                                  : color.toLowerCase().includes("blue")
                                    ? "#2563eb"
                                    : color.toLowerCase().includes("red")
                                      ? "#dc2626"
                                      : color.toLowerCase().includes("gold")
                                        ? "#facc15"
                                        : color.toLowerCase().includes("silver")
                                          ? "#94a3b8"
                                          : "#6b7280",
                            }}
                          >
                            {selectedColor === color && (
                              <Check
                                size={14}
                                className={
                                  color.toLowerCase().includes("white")
                                    ? "text-black"
                                    : "text-white"
                                }
                              />
                            )}
                          </div>

                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-black py-1 px-3 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                            {color}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-10">
                    <h3
                      className={`text-xs font-black uppercase tracking-widest mb-4 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Select{" "}
                      {product.category === "Bows"
                        ? "Option"
                        : product.category === "Arrows"
                          ? "Spine"
                          : "Size"}
                      :
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${
                            selectedSize === size
                              ? "bg-[var(--accent)] text-black border-[var(--accent)] shadow-lg shadow-[rgba(var(--accent-rgb),0.2)]"
                              : isDark
                                ? "bg-white/5 text-white border-white/5 hover:border-white/20"
                                : "bg-white text-gray-900 border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-6 mb-12">
                  <div
                    className={`flex items-center border rounded-2xl p-2 h-16 transition-all ${
                      isDark
                        ? "bg-white/5 border-white/10"
                        : "bg-white border-gray-200 shadow-sm"
                    }`}
                  >
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
                        isDark
                          ? "hover:bg-white/10 text-white"
                          : "hover:bg-gray-100 text-gray-900"
                      }`}
                    >
                      <Minus size={20} />
                    </button>
                    <span
                      className={`w-12 text-center font-black text-2xl ${isDark ? "text-white" : "text-gray-950"}`}
                    >
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
                        isDark
                          ? "hover:bg-white/10 text-white"
                          : "hover:bg-gray-100 text-gray-900"
                      }`}
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (product) {
                        addToCart(
                          product,
                          quantity,
                          selectedColor,
                          selectedSize,
                        );
                        navigate("/cart");
                      }
                    }}
                    className={`flex-grow bg-[var(--accent)] ${accentColor === "orange" || accentColor === "#FFD700" ? "text-black" : "text-white"} font-black uppercase tracking-widest px-12 py-4 h-16 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[rgba(var(--accent-rgb),0.3)] flex items-center justify-center gap-4 text-sm relative overflow-hidden group/btn`}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <ShoppingCart
                        size={20}
                        className="group-hover/btn:scale-110 transition-transform"
                      />{" "}
                      Add to Cart
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-[rgba(var(--accent-rgb),0.2)] blur-xl opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                  </motion.button>
                </div>

                {/* Features Bar */}
                <div
                  className={`grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-y ${
                    isDark ? "border-white/5" : "border-gray-200"
                  }`}
                >
                  {[
                    { icon: Truck, text: "Free Global Delivery" },
                    { icon: Shield, text: "X10 Performance Warranty" },
                    { icon: RotateCcw, text: "Elite Satisfaction Return" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left"
                    >
                      <item.icon className="text-[var(--accent)]" size={20} />
                      <span
                        className={`text-[9px] font-black uppercase tracking-[0.2em] leading-tight ${isDark ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Specs Section */}
                {product.specifications && (
                  <div className="mt-10">
                    <h3
                      className={`text-xs font-black uppercase tracking-widest mb-6 ${isDark ? "text-white" : "text-black"}`}
                    >
                      Technical Specifications
                    </h3>
                    <div className="grid grid-cols-2 gap-y-4">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div key={key} className="flex flex-col">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                              {key}
                            </span>
                            <span
                              className={`text-sm font-black ${isDark ? "text-gray-300" : "text-gray-700"}`}
                            >
                              {value}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6"
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-10 right-10 w-16 h-16 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded-full transition-all"
            >
              <X size={32} />
            </button>

            <button
              onClick={() =>
                setSelectedImage((prev) =>
                  prev > 0 ? prev - 1 : allImages.length - 1,
                )
              }
              className="absolute left-10 w-16 h-16 hidden md:flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded-full transition-all"
            >
              <ChevronLeft size={32} />
            </button>

            <div className="relative max-w-5xl w-full h-[80vh] flex items-center justify-center">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={allImages[selectedImage]}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            <button
              onClick={() =>
                setSelectedImage((prev) =>
                  prev < allImages.length - 1 ? prev + 1 : 0,
                )
              }
              className="absolute right-10 w-16 h-16 hidden md:flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded-full transition-all"
            >
              <ChevronRight size={32} />
            </button>

            <div className="absolute bottom-10 flex gap-4">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    selectedImage === i ? "bg-[#FFD700] w-8" : "bg-white/20"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductPage;
