import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Truck,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import { usePreferences } from "../context/PreferencesContext";

interface CartProps {
  themeMode?: "dark" | "light";
  accentColor?: string;
}

const Cart: React.FC<CartProps> = ({
  themeMode = "dark",
  accentColor = "var(--accent)",
}) => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { formatPrice } = usePreferences();

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

  const handleRemove = (id: string, name: string) => {
    removeFromCart(id);
    showNotification(`${name} removed from cart`, "info");
  };

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-24 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 transition-colors ${
              isDark ? "bg-white/5 text-gray-700" : "bg-gray-100 text-gray-400"
            }`}
          >
            <ShoppingCart size={40} />
          </div>
          <h1
            className={`text-4xl font-extrabold mb-4 ${isDark ? "text-white" : "text-gray-950"}`}
          >
            Your cart is <span className="text-[var(--accent)]">empty</span>
          </h1>
          <p
            className={`mb-10 text-lg font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Add some premium archery gear to your collection and start your
            journey today.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 bg-[var(--accent)] text-black font-black uppercase tracking-widest px-10 py-5 rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[rgba(var(--accent-rgb),0.2)]"
          >
            <ShoppingBag size={20} /> Start Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 container mx-auto px-6">
      <style>{`
        :root {
          --accent: ${accentColor};
          --accent-rgb: ${accentRgb};
        }
      `}</style>
      <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
        <div>
          <h1
            className={`text-5xl font-black mb-2 tracking-tighter ${isDark ? "text-white" : "text-gray-950"}`}
          >
            Shopping <span className="text-[var(--accent)]">Bag</span>
          </h1>
          <p
            className={`font-black uppercase tracking-[0.2em] text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}
          >
            Review your premium equipment selection
          </p>
        </div>
        <p
          className={`text-xs font-black uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}
        >
          <span className={isDark ? "text-white" : "text-gray-950"}>
            {cart.length}
          </span>{" "}
          {cart.length === 1 ? "item" : "items"} in your bag
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className={`rounded-[2.5rem] p-6 flex flex-col sm:flex-row items-center gap-8 group border transition-all duration-300 ${
                  isDark
                    ? "bg-neutral-900/40 border-white/5 hover:border-[rgba(var(--accent-rgb),0.2)]"
                    : "bg-white border-gray-100 shadow-xl shadow-gray-200/50 hover:border-yellow-200"
                }`}
              >
                <div
                  className={`w-32 h-32 rounded-2xl flex items-center justify-center p-4 border transition-all duration-300 ${
                    isDark
                      ? "bg-white/5 border-white/10 group-hover:border-[rgba(var(--accent-rgb),0.3)]"
                      : "bg-gray-50 border-gray-100 group-hover:border-yellow-200"
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="flex-grow text-center sm:text-left">
                  <div className="flex justify-between items-start mb-2">
                    <h3
                      className={`text-xl font-black transition-colors group-hover:text-[var(--accent)] ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {item.name}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-4 mb-4 justify-center sm:justify-start">
                    {item.selectedColor && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                          Color:
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${isDark ? "bg-white/5 text-gray-300" : "bg-gray-100 text-gray-700"}`}
                        >
                          {item.selectedColor}
                        </span>
                      </div>
                    )}
                    {item.selectedSize && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                          Option:
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${isDark ? "bg-white/5 text-gray-300" : "bg-gray-100 text-gray-700"}`}
                        >
                          {item.selectedSize}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-[var(--accent)] font-black text-2xl mb-6">
                    {formatPrice(item.price)}
                  </p>

                  <div className="flex items-center justify-center sm:justify-start gap-6">
                    <div
                      className={`flex items-center border rounded-2xl p-1 transition-all ${
                        isDark
                          ? "bg-white/5 border-white/10"
                          : "bg-gray-100 border-gray-200"
                      }`}
                    >
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-90 ${
                          isDark
                            ? "hover:bg-[var(--accent)] hover:text-black"
                            : "hover:bg-[var(--accent)] hover:text-black"
                        }`}
                      >
                        <Minus size={16} />
                      </button>
                      <span
                        className={`w-12 text-center font-black text-lg ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-90 ${
                          isDark
                            ? "hover:bg-[var(--accent)] hover:text-black"
                            : "hover:bg-[var(--accent)] hover:text-black"
                        }`}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id, item.name)}
                      className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all border border-transparent ${
                        isDark
                          ? "text-gray-600 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20"
                          : "text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100"
                      }`}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div
                  className={`text-center sm:text-right pt-4 sm:pt-0 sm:pl-8 border-t sm:border-t-0 sm:border-l ${
                    isDark ? "border-white/5" : "border-gray-100"
                  }`}
                >
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">
                    Subtotal
                  </p>
                  <p
                    className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <div
            className={`rounded-[2.5rem] p-8 sticky top-32 border transition-all duration-300 ${
              isDark
                ? "bg-neutral-900/40 border-white/5 shadow-2xl"
                : "bg-white border-gray-100 shadow-2xl shadow-gray-200/50"
            }`}
          >
            <h3
              className={`text-2xl font-black mb-8 pb-4 border-b ${
                isDark
                  ? "text-white border-white/5"
                  : "text-gray-900 border-gray-100"
              }`}
            >
              Summary
            </h3>
            <div className="space-y-4 mb-10">
              <div className="flex justify-between items-center">
                <span
                  className={`text-xs font-black uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  Subtotal
                </span>
                <span
                  className={`font-black ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {formatPrice(cartTotal)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span
                  className={`text-xs font-black uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  Shipping
                </span>
                <span className="text-green-500 font-black text-[10px] uppercase tracking-[0.2em]">
                  Free Entry
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span
                  className={`text-xs font-black uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  Taxes
                </span>
                <span
                  className={`font-black ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {formatPrice(0)}
                </span>
              </div>
              <div
                className={`pt-6 mt-4 border-t flex justify-between items-center ${
                  isDark ? "border-white/10" : "border-gray-100"
                }`}
              >
                <span
                  className={`text-xl font-black ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  Total
                </span>
                <span className="text-4xl font-black text-[var(--accent)]">
                  {formatPrice(cartTotal)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-[var(--accent)] text-black font-black uppercase tracking-widest py-5 rounded-[2rem] hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3 mb-6 shadow-xl shadow-[rgba(var(--accent-rgb),0.2)]"
            >
              Secure Checkout <ArrowRight size={22} />
            </button>
            <button
              onClick={() => navigate("/shop")}
              className={`w-full py-4 text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${
                isDark
                  ? "text-gray-500 hover:text-white"
                  : "text-gray-400 hover:text-black"
              }`}
            >
              <ArrowLeft size={16} /> Bag more gear
            </button>

            <div
              className={`mt-8 p-6 rounded-2xl border transition-all ${
                isDark
                  ? "bg-white/5 border-white/5"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <div className="flex items-center gap-3 mb-2 text-[var(--accent)]">
                <Truck size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Priority Shipping
                </span>
              </div>
              <p
                className={`text-[10px] font-medium leading-relaxed ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Every order is tracked and insured. Expected delivery within{" "}
                <span className={isDark ? "text-white" : "text-gray-900"}>
                  7 to 15 business days
                </span>{" "}
                after processing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
