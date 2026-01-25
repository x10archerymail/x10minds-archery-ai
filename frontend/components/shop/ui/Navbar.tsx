import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import {
  ShoppingCart,
  LogOut,
  Menu,
  X,
  Search,
  Crown,
  ArrowLeft,
  User,
  Package,
  Settings,
  ChevronDown,
} from "lucide-react";

interface NavbarProps {
  user: {
    uid: string;
    displayName: string;
    email: string;
    photoURL?: string;
  } | null;
  onExit?: () => void;
  onNavigateToSettings?: () => void;
  themeMode?: "dark" | "light";
  accentColor?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  user,
  onExit,
  onNavigateToSettings,
  themeMode = "dark",
  accentColor = "orange",
}) => {
  const { cart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const isDark = themeMode === "dark";
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getThemeStyles = () => {
    // If accentColor is a hex, we use it directly with Tailwind's arbitrary values
    const isHex = accentColor?.startsWith("#");
    const color = isHex ? accentColor : "#FFD700";

    return {
      bg: `bg-[${color}]`,
      text: `text-[${color}]`,
      border: `border-[${color}]`,
      shadow: `shadow-[${color}]/20`,
      colorName: `[${color}]`,
      itemShadow: `shadow-[${color}]/20`,
      gradientFrom: `from-[${color}]`,
      gradientTo: `to-[${color}]`,
      ring: `ring-[${color}]/40`,
    };
  };

  const themeStyle = getThemeStyles();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownOpen]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Collection", path: "/shop" },
    { name: "Support", path: "/contact" },
    { name: "Reviews", path: "/reviews" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled ? "py-4 md:py-6" : "py-6 md:py-10"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div
          className={`rounded-[2rem] md:rounded-[3rem] px-4 md:px-10 py-3 md:py-5 flex items-center justify-between transition-all duration-500 border relative ${
            scrolled
              ? isDark
                ? "bg-black/90 backdrop-blur-3xl border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
                : "bg-white/90 backdrop-blur-3xl border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.05)]"
              : isDark
                ? "bg-white/5 backdrop-blur-xl border-white/5"
                : "bg-gray-50/50 backdrop-blur-xl border-gray-100 shadow-xl shadow-gray-200/20"
          }`}
        >
          <div className="flex items-center gap-2 md:gap-6">
            {onExit && (
              <button
                onClick={onExit}
                className={`p-2 md:p-3 rounded-xl md:rounded-2xl transition-all duration-300 ${
                  isDark
                    ? `bg-white/5 text-white hover:bg-white/10`
                    : `bg-gray-100 text-gray-900 hover:bg-gray-200`
                }`}
                title="Back to Dashboard"
              >
                <ArrowLeft
                  className="w-4 h-4 md:w-[18px] md:h-[18px]"
                  strokeWidth={3}
                />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2 md:gap-3 group">
              <div
                className={`relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center p-1 md:p-1.5 rounded-lg md:rounded-xl bg-white/5 border border-white/10 group-hover:border-${themeStyle.colorName}/50 transition-colors`}
              >
                <img
                  src="/images/X10Minds%20logo.png"
                  alt="logo"
                  className="w-full h-full object-contain filter group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span
                    className={`text-base md:text-xl font-black tracking-tighter ${isDark ? "text-white" : "text-gray-950"}`}
                  >
                    X10
                  </span>
                  <span
                    className={`${themeStyle.text} ml-1 text-base md:text-xl font-black tracking-tighter`}
                  >
                    MINDS
                  </span>
                </div>
                <span
                  className={`text-[6px] md:text-[8px] font-black uppercase tracking-[0.4em] mt-[-2px] ${isDark ? "text-gray-700" : "text-gray-400"}`}
                >
                  Operational_Shop
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[9px] font-black tracking-[0.3em] transition-all duration-300 uppercase relative group/link ${
                  location.pathname === link.path
                    ? themeStyle.text
                    : isDark
                      ? "text-gray-600 hover:text-white"
                      : "text-gray-400 hover:text-gray-950"
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-2 left-0 w-0 h-[2px] ${themeStyle.bg} transition-all duration-300 group-hover/link:w-2/3 ${
                    location.pathname === link.path ? "w-2/3" : ""
                  }`}
                />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <Link
              to="/cart"
              className={`relative group p-2 md:p-3 rounded-xl md:rounded-2xl transition-all duration-300 border border-transparent hover:border-${themeStyle.colorName}/20`}
            >
              <ShoppingCart
                className={`w-4 h-4 md:w-5 md:h-5 transition-colors duration-300 ${isDark ? `text-gray-600 group-hover:${themeStyle.text}` : `text-gray-400 group-hover:text-gray-950`}`}
                strokeWidth={2.5}
              />
              {cart.reduce((a, b) => a + b.quantity, 0) > 0 && (
                <span
                  className={`absolute -top-1 -right-1 ${themeStyle.bg} ${accentColor === "orange" || accentColor === "#FFD700" ? "text-black" : "text-white"} text-[7px] md:text-[9px] font-black w-4 h-4 md:w-5 md:h-5 rounded-md md:rounded-lg flex items-center justify-center shadow-lg ${themeStyle.itemShadow} ring-2 md:ring-4 ring-black/10`}
                >
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`flex items-center gap-2 md:gap-4 md:ml-2 md:pl-6 md:border-l ${isDark ? "md:border-white/5" : "md:border-gray-100"} cursor-pointer transition-all hover:opacity-80`}
                >
                  <div className="flex flex-col items-end hidden md:flex">
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-white" : "text-gray-950"}`}
                    >
                      {user.displayName?.split(" ")[0] || "Operator"}
                    </p>
                    <p
                      className={`text-[8px] font-black ${themeStyle.text} uppercase tracking-[0.2em]`}
                    >
                      Elite Status
                    </p>
                  </div>
                  <div
                    className={`w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-gradient-to-tr ${themeStyle.gradientFrom} ${themeStyle.gradientTo} p-[2px] shadow-2xl ${themeStyle.itemShadow} active:scale-90 transition-transform`}
                  >
                    <div className="w-full h-full rounded-[10px] md:rounded-[14px] bg-black overflow-hidden flex items-center justify-center">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-black text-xs md:text-sm">
                          {(user.displayName || "U").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`transition-transform hidden md:block ${profileDropdownOpen ? "rotate-180" : ""} ${isDark ? "text-white" : "text-gray-950"}`}
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute top-full right-0 mt-4 w-60 rounded-2xl p-2 border shadow-2xl z-[200] ${
                        isDark
                          ? "bg-black/95 backdrop-blur-3xl border-white/10"
                          : "bg-white/95 backdrop-blur-3xl border-gray-100"
                      }`}
                    >
                      <Link
                        to="/orders"
                        onClick={() => setProfileDropdownOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isDark
                            ? "hover:bg-white/5 text-white"
                            : "hover:bg-gray-50 text-gray-900"
                        }`}
                      >
                        <Package size={18} className={themeStyle.text} />
                        <div>
                          <p
                            className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                          >
                            Order History
                          </p>
                          <p
                            className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}
                          >
                            Track your orders
                          </p>
                        </div>
                      </Link>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          if (onNavigateToSettings) {
                            onNavigateToSettings();
                          }
                        }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left ${
                          isDark
                            ? "hover:bg-white/5 text-white"
                            : "hover:bg-gray-50 text-gray-900"
                        }`}
                      >
                        <Settings size={18} className={themeStyle.text} />
                        <div>
                          <p
                            className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                          >
                            Settings
                          </p>
                          <p
                            className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}
                          >
                            Customize preferences
                          </p>
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div
                className={`ml-2 pl-6 border-l ${isDark ? "border-white/5" : "border-gray-100"}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full bg-red-600 animate-pulse`}
                  />
                  <p
                    className={`text-[9px] font-black uppercase tracking-[0.2em] ${isDark ? "text-gray-800" : "text-gray-300"}`}
                  >
                    System Guest
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-3 rounded-2xl transition-all ${
                isDark
                  ? "bg-white/5 text-white hover:bg-white/10"
                  : "bg-gray-100 text-gray-950 hover:bg-gray-200"
              }`}
            >
              {isOpen ? (
                <X size={20} strokeWidth={3} />
              ) : (
                <Menu size={20} strokeWidth={3} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`absolute top-28 left-6 right-6 rounded-[3rem] p-10 lg:hidden shadow-[0_40px_80px_-12px_rgba(0,0,0,0.8)] z-[101] border ${
              isDark
                ? "bg-black/95 backdrop-blur-3xl border-white/10"
                : "bg-white/95 backdrop-blur-3xl border-gray-100"
            }`}
          >
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-xs font-black tracking-[0.4em] uppercase transition-all ${
                    location.pathname === link.path
                      ? themeStyle.text
                      : isDark
                        ? "text-gray-600"
                        : "text-gray-400"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div
                className={`h-px ${isDark ? "bg-white/5" : "bg-gray-100"} my-2`}
              />
              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between text-[10px] font-black tracking-[0.3em] uppercase transition-colors"
                style={{ color: isDark ? "white" : "black" }}
              >
                <span>Shopping Cart</span>
                <span
                  className={`${themeStyle.bg} ${accentColor === "orange" || accentColor === "#FFD700" ? "text-black" : "text-white"} px-4 py-1.5 rounded-full text-[9px] shadow-lg ${themeStyle.itemShadow}`}
                >
                  {cart.length} ASSETS
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
