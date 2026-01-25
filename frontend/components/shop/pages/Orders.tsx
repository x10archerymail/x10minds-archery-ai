import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  CheckCircle,
  ArrowRight,
  ShoppingBag,
  Truck,
  Clock,
  Circle,
  AlertTriangle,
  Search,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNotification } from "../context/NotificationContext";
import { usePreferences } from "../context/PreferencesContext";

interface OrdersProps {
  themeMode?: "dark" | "light";
  accentColor?: string;
}

const Orders: React.FC<OrdersProps> = ({
  themeMode = "dark",
  accentColor = "orange",
}) => {
  const { showNotification } = useNotification();
  const { formatPrice } = usePreferences();
  const location = useLocation();
  const orderSuccess = location.state?.orderSuccess;
  const newOrderData = location.state?.orderData;
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

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
    const savedOrders = JSON.parse(
      localStorage.getItem("x10minds_shop_orders") || "[]",
    );
    setOrders(savedOrders);
  }, []);

  // Simulated Order Tracking Data for the most recent order
  const trackingSteps = [
    { label: "Ordered", status: "complete", date: "Today" },
    { label: "Processing", status: "current", date: "In Progress" },
    { label: "Shipped", status: "upcoming", date: "Expected Dec 28" },
    { label: "Delivered", status: "upcoming", date: "Jan 2 - Jan 10" },
  ];

  const totalSpent = orders.reduce(
    (sum, o) => sum + parseFloat(o.total || 0),
    0,
  );

  return (
    <div className="pt-40 pb-24 container mx-auto px-6">
      <style>{`
        :root {
          --accent: ${accentColor};
          --accent-rgb: ${accentRgb};
        }
      `}</style>
      <div className="max-w-5xl mx-auto">
        {(orderSuccess || newOrderData) && !isCancelled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-[3rem] p-10 text-center mb-16 border relative overflow-hidden transition-all duration-300 ${
              isDark
                ? "bg-neutral-900/40 border-[var(--accent)]/20 shadow-2xl shadow-[rgba(var(--accent-rgb),0.05)]"
                : "bg-white border-[var(--accent)]/20 shadow-2xl shadow-gray-200"
            }`}
          >
            <div className="absolute top-0 left-0 w-full h-1 animate-pulse bg-[var(--accent)]" />
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-[rgba(var(--accent-rgb),0.1)] text-[var(--accent)]">
              <CheckCircle size={40} />
            </div>
            <h1
              className={`text-4xl font-black mb-3 ${isDark ? "text-white" : "text-gray-950"}`}
            >
              Order <span className="text-[var(--accent)]">Confirmed!</span>
            </h1>
            <p
              className={`mb-8 max-w-lg mx-auto font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              Your premium equipment is authorized and moving. Typically
              delivered within{" "}
              <span
                className={
                  isDark ? "text-white font-bold" : "text-gray-900 font-bold"
                }
              >
                7 to 15 Business Days
              </span>
              .
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/shop"
                className="bg-[var(--accent)] text-black font-black uppercase tracking-widest px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-[rgba(var(--accent-rgb),0.2)]"
              >
                Continue Exploring <ArrowRight size={20} />
              </Link>
              <button
                className={`font-black uppercase tracking-widest px-8 py-4 rounded-2xl transition-all border flex items-center justify-center gap-2 ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                    : "bg-gray-100 border-gray-200 text-gray-900 hover:bg-gray-200"
                }`}
              >
                <Truck size={18} /> Logistics System
              </button>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
          <div>
            <h2
              className={`text-4xl font-black flex items-center gap-4 mb-2 ${isDark ? "text-white" : "text-gray-950"}`}
            >
              <Package size={40} className="text-[var(--accent)]" />{" "}
              Intelligence
            </h2>
            <p
              className={`font-black uppercase tracking-[0.2em] text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              {orders.length} deployments authorized • Total Investment:{" "}
              {formatPrice(totalSpent)}
            </p>
          </div>
          <Link
            to="/shop"
            className={`px-6 py-4 rounded-2xl transition-all border flex items-center gap-3 font-black uppercase tracking-widest text-[10px] ${
              isDark
                ? "bg-white/5 text-gray-400 hover:text-[var(--accent)] border-white/5"
                : "bg-gray-100 text-gray-500 hover:text-black border-gray-100 shadow-sm"
            }`}
          >
            New Acquisition <ShoppingBag size={18} />
          </Link>
        </div>

        {/* Orders List */}
        <div className="space-y-8">
          {orders.length > 0 ? (
            orders.map((order, oIdx) => (
              <motion.div
                key={order.id || oIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: oIdx * 0.1 }}
                className={`rounded-[2.5rem] p-8 border transition-all duration-300 mb-8 ${
                  isDark
                    ? "bg-neutral-900/40 border-white/5"
                    : "bg-white border-gray-100 shadow-xl shadow-gray-200/40"
                }`}
              >
                {/* Header Info */}
                <div
                  className={`flex flex-col lg:flex-row justify-between gap-8 pb-8 border-b mb-8 ${
                    isDark ? "border-white/5" : "border-gray-100"
                  }`}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 flex-grow">
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                        Order ID
                      </p>
                      <p className="font-bold text-sm text-[var(--accent)]">
                        #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                        Authorization Date
                      </p>
                      <p
                        className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                        Investment
                      </p>
                      <p
                        className={`text-sm font-black ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        {location.state?.orderData?.total
                          ? formatPrice(location.state.orderData.total)
                          : formatPrice(0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                        System Status
                      </p>
                      <p
                        className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                          isCancelled ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isCancelled
                              ? "bg-red-500"
                              : "bg-green-500 animate-pulse"
                          }`}
                        />
                        {isCancelled ? "Voided" : "Active"}
                      </p>
                    </div>
                  </div>
                  {!isCancelled && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="flex items-center gap-2 text-[10px] font-black text-gray-500 hover:text-red-500 transition-colors uppercase tracking-widest shrink-0"
                    >
                      <Circle size={14} /> Void Deployment
                    </button>
                  )}
                </div>

                {!isCancelled ? (
                  <>
                    {/* Tracking Section */}
                    <div className="mb-12">
                      <div className="flex items-center gap-3 mb-6">
                        <Clock size={16} style={{ color: accentColor }} />
                        <p
                          className={`text-xs font-black uppercase tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}
                        >
                          ETA Status:{" "}
                          <span style={{ color: accentColor }}>
                            7 - 15 Business Days
                          </span>
                        </p>
                      </div>

                      <div className="relative pt-4 px-4 sm:px-8">
                        <div
                          className={`absolute top-8 left-4 right-4 sm:left-8 sm:right-8 h-1 rounded-full overflow-hidden ${
                            isDark ? "bg-white/5" : "bg-gray-100"
                          }`}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "25%" }}
                            className="h-full shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                            style={{ backgroundColor: accentColor }}
                          />
                        </div>
                        <div className="relative flex justify-between">
                          {trackingSteps.map((step, idx) => (
                            <div
                              key={idx}
                              className="flex flex-col items-center"
                            >
                              <div
                                className={`w-8 h-8 rounded-full border-4 flex items-center justify-center mb-3 transition-all duration-500 ${
                                  step.status === "complete"
                                    ? "bg-[#FFD700] border-[#FFD700]/20 text-black shadow-lg"
                                    : step.status === "current"
                                      ? isDark
                                        ? "bg-black border-[#FFD700] text-[#FFD700]"
                                        : "bg-white border-[#FFD700] text-[#FFD700]"
                                      : isDark
                                        ? "bg-neutral-800 border-white/5 text-gray-700"
                                        : "bg-gray-50 border-gray-100 text-gray-300"
                                }`}
                              >
                                {step.status === "complete" ? (
                                  <CheckCircle size={14} />
                                ) : (
                                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                )}
                              </div>
                              <p
                                className={`text-[9px] font-black uppercase tracking-widest ${
                                  step.status === "upcoming"
                                    ? "text-gray-600"
                                    : isDark
                                      ? "text-white"
                                      : "text-gray-950"
                                }`}
                              >
                                {step.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-12 text-center text-red-500/50">
                    <AlertTriangle size={48} className="mx-auto mb-4" />
                    <p className="font-black uppercase tracking-widest text-xs">
                      This order was voided on system request.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl ${isDark ? "bg-white/5" : "bg-gray-50"}`}
                    >
                      <Package style={{ color: accentColor }} size={20} />
                    </div>
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Securing your elite gear...
                    </span>
                  </div>
                  <button
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      isDark
                        ? "bg-white/5 hover:bg-white/10 border-white/5 text-white"
                        : "bg-gray-50 hover:bg-gray-100 border-gray-100 text-gray-900"
                    }`}
                  >
                    Core Metrics
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-32 text-center">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors ${
                  isDark
                    ? "bg-white/5 text-gray-700"
                    : "bg-gray-100 text-gray-300"
                }`}
              >
                <Package size={40} />
              </div>
              <h3
                className={`text-2xl font-black mb-2 uppercase tracking-widest ${isDark ? "text-white" : "text-gray-950"}`}
              >
                No Active Deployments
              </h3>
              <p
                className={`mb-8 font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                You haven't authorized any premium equipment yet.
              </p>
              <Link
                to="/shop"
                className="text-[#FFD700] font-black uppercase tracking-[0.3em] text-xs underline underline-offset-8 hover:text-white transition-all"
              >
                Initiate Acquisition
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xl"
              onClick={() => setShowCancelModal(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative rounded-[3rem] p-10 max-w-md w-full border text-center transition-all ${
                isDark
                  ? "bg-neutral-900 border-white/5"
                  : "bg-white border-gray-100 shadow-2xl shadow-gray-200"
              }`}
            >
              <div
                className={`w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6`}
              >
                <AlertTriangle size={40} />
              </div>
              <h3
                className={`text-3xl font-black mb-4 ${isDark ? "text-white" : "text-gray-950"}`}
              >
                Void Order?
              </h3>
              <p
                className={`mb-8 font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                This action is permanent within the system. Are you sure you
                want to void this authorization?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest transition-all border text-xs ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                      : "bg-gray-100 border-gray-200 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Return
                </button>
                <button
                  onClick={() => {
                    setIsCancelled(true);
                    setShowCancelModal(false);
                    showNotification("Order voided successfully", "info");
                  }}
                  className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-red-500/20 hover:bg-red-600 text-xs"
                >
                  Yes, Void
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
