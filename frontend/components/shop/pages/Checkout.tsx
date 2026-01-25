import * as React from "react";
import { useState, useEffect } from "react";
import {
  CreditCard,
  Truck,
  ShieldCheck,
  ArrowRight,
  Smartphone,
  CheckCircle,
  Save,
  Zap,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from "../context/NotificationContext";
import { usePreferences } from "../context/PreferencesContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_sample",
);

interface CheckoutProps {
  themeMode?: "dark" | "light";
  accentColor?: string;
}

const Checkout: React.FC<CheckoutProps> = ({
  themeMode = "dark",
  accentColor = "var(--accent)",
}) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutContent themeMode={themeMode} accentColor={accentColor} />
    </Elements>
  );
};

const CheckoutContent: React.FC<CheckoutProps> = ({
  themeMode = "dark",
  accentColor = "var(--accent)",
}) => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { formatPrice } = usePreferences();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");
  const [saveDetails, setSaveDetails] = useState(true);

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

  // Stripe
  const stripe = useStripe();
  const elements = useElements();
  const [stripeError, setStripeError] = useState<string | null>(null);

  // Promo Code Logic
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const handleApplyPromo = () => {
    if (!promoCode) return;

    // Simulate promo code validation
    if (promoCode === "SAVE10" || promoCode === "X10MINDS") {
      const discountAmount = cartTotal * 0.1; // 10% off
      setDiscount(discountAmount);
      showNotification("Promo code applied: 10% Off", "success");
    } else if (promoCode === "PROMO30") {
      const discountAmount = cartTotal * 0.3; // 30% off
      setDiscount(discountAmount);
      showNotification("Super Promo applied: 30% Off!", "success");
    } else {
      showNotification("Invalid promo code", "error");
      setDiscount(0);
    }
  };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    phone: "",
    upiId: "",
  });

  // Load saved details from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("x10minds_checkout_details");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!formData.fullName || !formData.address) {
      showNotification("Please complete all shipping details", "error");
      setStep(1);
      return;
    }

    if (paymentMethod === "upi" && !formData.upiId) {
      showNotification("Please enter a valid UPI ID", "error");
      return;
    }

    setLoading(true);

    if (paymentMethod === "card") {
      if (!stripe || !elements) {
        setLoading(false);
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setLoading(false);
        return;
      }

      const { error, paymentMethod: stripePaymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name: formData.fullName,
            email: formData.email,
          },
        });

      if (error) {
        setStripeError(error.message || "Payment verification failed");
        setLoading(false);
        return;
      }

      console.log("Stripe Payment Method Created:", stripePaymentMethod);
    }

    if (saveDetails) {
      localStorage.setItem(
        "x10minds_checkout_details",
        JSON.stringify(formData),
      );
    }

    setTimeout(() => {
      setLoading(false);
      showNotification("Order placed successfully!", "success");
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: [accentColor, "#FFFFFF", "#FFA500"],
      });
      clearCart();
      navigate("/orders", {
        state: {
          orderSuccess: true,
          orderData: { ...formData, total: cartTotal - discount, discount },
        },
      });
    }, 1500);
  };

  if (cart.length === 0) {
    navigate("/shop");
    return null;
  }

  return (
    <div className="pt-32 pb-24 container mx-auto px-6">
      <style>{`
        :root {
          --accent: ${accentColor};
          --accent-rgb: ${accentRgb};
        }
      `}</style>
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[1000] backdrop-blur-xl flex items-center justify-center p-6 ${
              isDark ? "bg-black/90" : "bg-white/90"
            }`}
          >
            <div className="truck-loader-container">
              <div className="TruckLoader">
                <div
                  className={`TruckLoader-cab ${isDark ? "" : "bg-gray-200"}`}
                ></div>
                <div className="TruckLoader-smoke"></div>
              </div>
              <div
                className={`loading-text font-black uppercase tracking-[0.3em] mt-8 ${
                  isDark ? "text-[var(--accent)]" : "text-gray-900"
                }`}
              >
                Processing Your Order...
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1
            className={`text-5xl font-black mb-2 tracking-tighter ${isDark ? "text-white" : "text-gray-950"}`}
          >
            Secure <span className="text-[var(--accent)]">Checkout</span>
          </h1>
          <p
            className={`font-black uppercase tracking-[0.2em] text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}
          >
            Complete your purchase safely using our encrypted payment system
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            {/* Step 1: Shipping */}
            <motion.div
              layout
              className={`rounded-[2.5rem] p-8 transition-all border ${
                step === 1
                  ? isDark
                    ? "bg-neutral-900/40 border-[rgba(var(--accent-rgb),0.3)] shadow-2xl shadow-[rgba(var(--accent-rgb),0.05)]"
                    : "bg-white border-[rgba(var(--accent-rgb),0.2)] shadow-2xl shadow-gray-200"
                  : isDark
                    ? "bg-neutral-900/40 border-white/5 opacity-60"
                    : "bg-gray-50 border-gray-100 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-colors ${
                      step === 1
                        ? "bg-[var(--accent)] text-black"
                        : isDark
                          ? "bg-white/10 text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > 1 ? <CheckCircle size={20} /> : "1"}
                  </div>
                  <h2
                    className={`text-2xl font-black flex items-center gap-2 ${isDark ? "text-white" : "text-gray-950"}`}
                  >
                    <Truck size={24} /> Shipping
                  </h2>
                </div>
                {step > 1 && (
                  <button
                    onClick={() => setStep(1)}
                    className="text-[var(--accent)] text-xs font-black uppercase tracking-widest hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    label: "Full Name",
                    name: "fullName",
                    placeholder: "John Doe",
                    type: "text",
                  },
                  {
                    label: "Email",
                    name: "email",
                    placeholder: "john@example.com",
                    type: "email",
                  },
                  {
                    label: "Phone",
                    name: "phone",
                    placeholder: "+1 (555) 000-0000",
                    type: "tel",
                    fullRow: true,
                  },
                  {
                    label: "Address",
                    name: "address",
                    placeholder: "123 Strategy Lane, Victory City",
                    type: "text",
                    fullRow: true,
                  },
                ].map((field) => (
                  <div
                    key={field.name}
                    className={`${field.fullRow ? "sm:col-span-2" : ""} space-y-2`}
                  >
                    <label
                      className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                    >
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={(formData as any)[field.name]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      disabled={step !== 1}
                      className={`w-full border rounded-2xl p-4 focus:border-[var(--accent)] outline-none transition-all font-bold ${
                        isDark
                          ? "bg-white/5 border-white/10 text-white placeholder:text-gray-700"
                          : "bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-400"
                      }`}
                    />
                  </div>
                ))}
              </div>

              {step === 1 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={saveDetails}
                        onChange={() => setSaveDetails(!saveDetails)}
                      />
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          isDark
                            ? "bg-white/5 border border-white/10 group-hover:bg-white/10"
                            : "bg-gray-100 border border-gray-200 group-hover:bg-gray-200"
                        } peer-checked:bg-[var(--accent)] peer-checked:text-black peer-checked:border-[var(--accent)]`}
                      >
                        <Save size={18} />
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isDark ? "text-gray-500 group-hover:text-white" : "text-gray-400 group-hover:text-black"}`}
                    >
                      Save my session data
                    </span>
                  </label>
                  <button
                    onClick={() => setStep(2)}
                    className="w-full sm:w-auto px-10 py-4 bg-[var(--accent)] text-black rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-[rgba(var(--accent-rgb),0.2)]"
                  >
                    Continue <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </motion.div>

            {/* Step 2: Payment */}
            <motion.div
              layout
              className={`rounded-[2.5rem] p-8 transition-all border ${
                step === 2
                  ? isDark
                    ? "bg-neutral-900/40 border-[rgba(var(--accent-rgb),0.3)] shadow-2xl shadow-[rgba(var(--accent-rgb),0.05)]"
                    : "bg-white border-[var(--accent)]/20 shadow-2xl shadow-gray-200"
                  : isDark
                    ? "bg-neutral-900/40 border-white/5 opacity-60"
                    : "bg-gray-50 border-gray-100 opacity-60"
              }`}
            >
              <div className="flex items-center gap-4 mb-8">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-colors ${
                    step === 2
                      ? "bg-[var(--accent)] text-black"
                      : isDark
                        ? "bg-white/10 text-white"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <h2
                  className={`text-2xl font-black flex items-center gap-2 ${isDark ? "text-white" : "text-gray-950"}`}
                >
                  <CreditCard size={24} /> Payment
                </h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: "card", label: "Credit Card", icon: CreditCard },
                    { id: "upi", label: "UPI Transfer", icon: Smartphone },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-6 rounded-2xl border-2 transition-all text-left flex items-center justify-between ${
                        paymentMethod === method.id
                          ? isDark
                            ? "border-[var(--accent)] bg-[rgba(var(--accent-rgb),0.05)]"
                            : "border-[var(--accent)] bg-[rgba(var(--accent-rgb),0.05)]"
                          : isDark
                            ? "border-white/5 bg-white/5 hover:bg-white/10"
                            : "border-gray-100 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <method.icon
                          className={
                            paymentMethod === method.id
                              ? "text-[var(--accent)]"
                              : "text-gray-500"
                          }
                          size={20}
                        />
                        <span
                          className={`font-black uppercase tracking-widest text-xs ${
                            paymentMethod === method.id
                              ? isDark
                                ? "text-white"
                                : "text-gray-900"
                              : "text-gray-500"
                          }`}
                        >
                          {method.label}
                        </span>
                      </div>
                      {paymentMethod === method.id && (
                        <div className="w-2 h-2 bg-[var(--accent)] rounded-full" />
                      )}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {paymentMethod === "card" ? (
                    <motion.div
                      key="card"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="space-y-6 pt-4"
                    >
                      <div className="space-y-4">
                        <label
                          className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                        >
                          Secure Stripe Channel
                        </label>
                        <div
                          className={`p-5 border rounded-[1.5rem] transition-all focus-within:border-[var(--accent)] ${
                            isDark
                              ? "bg-black/40 border-white/10"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <CardElement
                            options={{
                              style: {
                                base: {
                                  fontSize: "16px",
                                  color: isDark ? "#ffffff" : "#111827",
                                  fontFamily: '"Outfit", sans-serif',
                                  "::placeholder": {
                                    color: isDark ? "#374151" : "#9ca3af",
                                  },
                                },
                                invalid: {
                                  color: "#ef4444",
                                },
                              },
                            }}
                          />
                        </div>
                        <div className="flex gap-4 items-center px-2">
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                            className="h-3 grayscale opacity-30"
                            alt="Visa"
                          />
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                            className="h-5 grayscale opacity-30"
                            alt="Mastercard"
                          />
                          <span
                            className={`text-[9px] font-black uppercase tracking-widest ml-auto ${isDark ? "text-gray-600" : "text-gray-400"}`}
                          >
                            🛡️ SSL Encrypted PCI-DSS
                          </span>
                        </div>
                        {stripeError && (
                          <div className="text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                            {stripeError}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="upi"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="space-y-4 pt-4"
                    >
                      <p
                        className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        Universal Payment Interface
                      </p>
                      <div className="space-y-2">
                        <div
                          className={`flex items-center border rounded-2xl p-1 transition-all ${
                            isDark
                              ? "bg-white/5 border-white/10"
                              : "bg-gray-100 border-gray-200"
                          }`}
                        >
                          <input
                            type="text"
                            name="upiId"
                            value={formData.upiId}
                            onChange={handleInputChange}
                            placeholder="archer@okaxis"
                            className={`w-full bg-transparent p-4 outline-none transition-all font-bold ${
                              isDark
                                ? "text-white placeholder:text-gray-700"
                                : "text-gray-900 placeholder:text-gray-400"
                            }`}
                          />
                        </div>
                      </div>
                      <div
                        className={`flex gap-6 p-6 rounded-[2rem] border items-center ${
                          isDark
                            ? "bg-white/5 border-white/5"
                            : "bg-gray-50 border-gray-100"
                        }`}
                      >
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-3 shadow-lg">
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png"
                            alt="UPI"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p
                          className={`text-[10px] font-black uppercase tracking-widest leading-loose ${isDark ? "text-gray-500" : "text-gray-400"}`}
                        >
                          Scan and pay with any UPI app including{" "}
                          <span
                            className={isDark ? "text-white" : "text-gray-950"}
                          >
                            PhonePe
                          </span>
                          ,{" "}
                          <span
                            className={isDark ? "text-white" : "text-gray-950"}
                          >
                            GPay
                          </span>
                          , or{" "}
                          <span
                            className={isDark ? "text-white" : "text-gray-950"}
                          >
                            Paytm
                          </span>
                          .
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div
              className={`rounded-[3rem] p-8 border sticky top-32 overflow-hidden transition-all duration-300 ${
                isDark
                  ? "bg-neutral-900/40 border-white/5 shadow-2xl shadow-[rgba(var(--accent-rgb),0.05)]"
                  : "bg-white border-gray-100 shadow-2xl shadow-gray-200"
              }`}
            >
              <div
                className={`absolute top-0 right-0 p-5 rounded-bl-[2rem] ${isDark ? "bg-[rgba(var(--accent-rgb),0.1)]" : "bg-[rgba(var(--accent-rgb),0.3)]"}`}
              >
                <ShieldCheck size={20} className="text-[var(--accent)]" />
              </div>

              <h3
                className={`text-2xl font-black mb-8 ${isDark ? "text-white" : "text-gray-950"}`}
              >
                Review Bag
              </h3>
              <div className="space-y-6 mb-8 max-h-72 overflow-y-auto pr-4 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-6 group items-center">
                    <div
                      className={`w-24 h-24 rounded-2xl flex items-center justify-center p-4 border transition-all duration-300 shrink-0 ${
                        isDark
                          ? "bg-white/5 border-white/5 group-hover:border-[rgba(var(--accent-rgb),0.3)]"
                          : "bg-gray-50 border-gray-100 group-hover:border-[rgba(var(--accent-rgb),0.2)]"
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-grow">
                      <p
                        className={`font-black uppercase tracking-widest text-[10px] mb-1 transition-colors group-hover:text-[var(--accent)] ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {item.name}
                      </p>
                      <div className="flex justify-between items-center">
                        <p
                          className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}
                        >
                          Qty {item.quantity}
                        </p>
                        <p className="font-black text-[var(--accent)] text-sm">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className={`space-y-4 pt-8 border-t ${isDark ? "border-white/10" : "border-gray-100"}`}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    Subtotal
                  </span>
                  <span
                    className={`font-black ${isDark ? "text-white" : "text-gray-950"}`}
                  >
                    {formatPrice(cartTotal)}
                  </span>
                </div>

                {/* Promo Code Discount */}
                {discount > 0 && (
                  <div className="flex justify-between items-center text-green-500">
                    <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Zap size={10} fill="currentColor" /> Strategic Promo
                    </span>
                    <span className="font-black text-sm">
                      -{formatPrice(discount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    Shipping
                  </span>
                  <span className="text-green-500 font-black uppercase text-[10px] tracking-[0.2em]">
                    Free
                  </span>
                </div>

                <div
                  className={`flex justify-between items-center mt-6 pt-6 border-t ${isDark ? "border-white/10" : "border-gray-100"}`}
                >
                  <span
                    className={`text-xl font-black uppercase tracking-widest ${isDark ? "text-white" : "text-gray-950"}`}
                  >
                    Grand Total
                  </span>
                  <span className="text-4xl font-black text-[var(--accent)]">
                    {formatPrice(cartTotal - discount)}
                  </span>
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="mt-8">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Apply Promo"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className={`w-full border rounded-2xl py-4 pl-5 pr-28 text-xs font-black uppercase tracking-widest focus:border-[var(--accent)] outline-none transition-all ${
                      isDark
                        ? "bg-white/5 border-white/10 text-white placeholder:text-gray-700"
                        : "bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-400"
                    }`}
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={!promoCode || discount > 0}
                    className="absolute right-1 top-1 bottom-1 px-6 bg-white/10 hover:bg-[var(--accent)] hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30"
                  >
                    {discount > 0 ? "Active" : "Apply"}
                  </button>
                </div>
              </div>

              <button
                disabled={loading || step !== 2}
                onClick={handlePlaceOrder}
                className="w-full bg-[var(--accent)] text-black font-black uppercase tracking-widest py-5 rounded-[2rem] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[rgba(var(--accent-rgb),0.2)] flex items-center justify-center gap-3 disabled:opacity-30 mt-10"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Transacting...</span>
                  </div>
                ) : (
                  <>
                    Confirm Order <ArrowRight size={20} />
                  </>
                )}
              </button>

              <div
                className={`mt-8 p-6 rounded-2xl border flex items-center gap-5 transition-all ${
                  isDark
                    ? "bg-[rgba(var(--accent-rgb),0.05)] border-[rgba(var(--accent-rgb),0.1)]"
                    : "bg-[rgba(var(--accent-rgb),0.05)] border-[rgba(var(--accent-rgb),0.1)]"
                }`}
              >
                <div
                  className={`p-3 rounded-xl ${isDark ? "bg-white/5" : "bg-white shadow-sm"}`}
                >
                  <ShieldCheck className="text-[var(--accent)]" size={20} />
                </div>
                <p
                  className={`text-[9px] font-black uppercase tracking-[0.2em] leading-loose ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  Deployment window{" "}
                  <span className={isDark ? "text-white" : "text-gray-950"}>
                    7-15 business days
                  </span>{" "}
                  with encrypted tracking.
                </p>
              </div>

              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className={`mt-6 w-full text-[10px] font-black uppercase tracking-widest transition-colors ${
                    isDark
                      ? "text-gray-500 hover:text-white"
                      : "text-gray-400 hover:text-black"
                  }`}
                >
                  Adjust Shipping
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
