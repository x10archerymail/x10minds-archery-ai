import { useState } from "react";
import { Check, Shield, Zap, Crown, Globe, ChevronDown } from "lucide-react";
import { SubscriptionTier } from "../types";

interface SubscriptionViewProps {
  currentTier: SubscriptionTier;
  onUpgrade: (tier: SubscriptionTier, months?: number) => void;
  tokenLimit: number;
  themeMode?: "dark" | "light";
  accentColor?: string;
  isGuest?: boolean;
}

interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Rate relative to USD
}

const currencies: Currency[] = [
  { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 1 },
  { code: "USD", symbol: "$", name: "United States Dollar", rate: 0.012 },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.011 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.0095 },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", rate: 1.82 },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 0.018 },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", rate: 0.016 },
];

const SubscriptionView: React.FC<SubscriptionViewProps> = ({
  currentTier,
  onUpgrade,
  tokenLimit,
  themeMode = "dark",
  accentColor = "orange",
  isGuest = false,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [billingPeriod, setBillingPeriod] = useState(1); // months
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    currencies[0],
  ); // Default to INR
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const isDark = themeMode === "dark";
  const bgClass = isDark ? "bg-neutral-950" : "bg-gray-50";
  const headerText = isDark ? "text-white" : "text-gray-900";
  const subText = isDark ? "text-neutral-400" : "text-gray-500";

  if (isGuest) {
    return (
      <div
        className={`flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500 ${bgClass} min-h-[60vh]`}
      >
        <div
          className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8 border shadow-2xl ${
            isDark
              ? "bg-neutral-900 border-white/5"
              : "bg-white border-gray-200"
          }`}
        >
          <Shield className="w-10 h-10 text-[#FFD700]" />
        </div>
        <h2 className={`text-4xl font-bold mb-6 ${headerText}`}>
          Guest Access Restricted
        </h2>
        <p className={`${subText} max-w-lg mb-10 text-lg leading-relaxed`}>
          Subscription upgrades require a permanent account to securely link
          your payment and unlock premium features across all your devices.
        </p>
        <div
          className={`p-6 rounded-2xl border max-w-md w-full mb-8 ${
            isDark
              ? "bg-neutral-900/50 border-neutral-800"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-left">
              <h4 className={`font-bold ${headerText}`}>
                Data Synchronization
              </h4>
              <p className={`text-xs ${subText}`}>Save your progress forever</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-left">
              <h4 className={`font-bold ${headerText}`}>Secure Payments</h4>
              <p className={`text-xs ${subText}`}>Bank-grade encryption</p>
            </div>
          </div>
        </div>
        <p className={`text-sm ${subText} animate-pulse`}>
          Please log out and create a full account to upgrade.
        </p>
      </div>
    );
  }

  const accentClasses: Record<string, string> = {
    orange: "from-[#FFD700] to-[#FDB931] text-[#FFD700]",
    blue: "from-blue-600 to-indigo-600 text-blue-500",
    green: "from-green-600 to-emerald-600 text-green-500",
    purple: "from-purple-600 to-pink-600 text-purple-500",
    red: "from-red-600 to-orange-600 text-red-500",
    pink: "from-pink-600 to-rose-600 text-pink-500",
    teal: "from-teal-600 to-cyan-600 text-teal-500",
    cyan: "from-cyan-600 to-blue-600 text-cyan-500",
    indigo: "from-indigo-600 to-purple-600 text-indigo-500",
  };

  const currentAccent = accentClasses[accentColor] || accentClasses.orange;
  const accentGradient = currentAccent.split(" text-")[0];
  const accentText = currentAccent.split(" text-")[1];

  const formatPrice = (usdPrice: number) => {
    const converted = usdPrice * selectedCurrency.rate;
    return `${selectedCurrency.symbol}${Math.round(converted)}`;
  };

  const periods = [
    { label: "1 Mo", value: 1, discount: 0 },
    { label: "2 Mo", value: 2, discount: 5 },
    { label: "6 Mo", value: 6, discount: 15 },
    { label: "12 Mo", value: 12, discount: 25 },
    { label: "24 Mo", value: 24, discount: 40 },
  ];

  const calculateTotalPrice = (basePrice: number, months: number) => {
    const period = periods.find((p) => p.value === months);
    const discount = period ? period.discount : 0;
    const total = basePrice * months * (1 - discount / 100);
    return formatPrice(total);
  };

  const handlePayment = async () => {
    const btn = document.getElementById("stripe-btn");
    if (btn) btn.innerText = "Redirecting to Stripe...";

    try {
      // Import dynamically to avoid top-level issues if file not ready
      const { redirectToCheckout } = await import("../services/stripeService");

      // In a real application, you would pass the Price ID here.
      // e.g., price_123456789
      await redirectToCheckout(selectedPlan.tier);

      // Simulating successful callback for demonstration
      // In production, you would handle this on a success page or via webhooks
      setTimeout(() => {
        onUpgrade(selectedPlan.tier, billingPeriod);
        setSelectedPlan(null);
      }, 5000);
    } catch (e) {
      console.error(e);
      if (btn) btn.innerText = "Payment Failed";
      alert(
        "Stripe configuration missing. Please check services/stripeService.ts",
      );
    }
  };

  const plans = [
    {
      name: "Free",
      price: 0,
      period: "/mo",
      icon: Shield,
      color: isDark ? "text-neutral-400" : "text-gray-400",
      border: isDark ? "border-neutral-800" : "border-gray-200",
      bg: isDark ? "bg-neutral-900" : "bg-white",
      features: [
        `20,000 Chat Tokens (Current Limit: ${tokenLimit})`,
        "Basic Form Analysis (Low Res)",
        "Standard AI Response Speed",
        "Community Support",
      ],
      buttonText: "Current Plan",
      tier: "Free" as SubscriptionTier,
    },
    {
      name: "Charge",
      price: 299,
      period: "/mo",
      icon: Zap,
      color: "text-blue-400",
      border: isDark ? "border-blue-500/30" : "border-blue-500/20",
      bg: isDark ? "bg-neutral-900" : "bg-white",
      features: [
        "50,000 Chat Tokens",
        "Improved AI Response Speed",
        "10 AI Visualizations / Month",
        "Ad-Free Experience",
        "Standard Email Support",
      ],
      buttonText: "Get Charge",
      tier: "Charge" as SubscriptionTier,
    },
    {
      name: "Pro",
      price: 1399,
      period: "/mo",
      icon: Zap,
      color: accentText,
      border: isDark ? `border-${accentText}/50` : `border-${accentText}/30`,
      bg: isDark
        ? `bg-neutral-900 shadow-xl ${
            accentColor === "orange"
              ? "shadow-[#FFD700]/10"
              : `shadow-${accentColor}-900/20`
          }`
        : `bg-white shadow-xl ${
            accentColor === "orange"
              ? "shadow-[#FFD700]/10"
              : `shadow-${accentColor}-500/10`
          }`,
      features: [
        "Unlimited Chat Tokens",
        "HD Form Analysis & Correction",
        "Priority AI Processing",
        "Custom SPT Plans",
        "Email Support",
      ],
      buttonText: "Upgrade to Pro",
      tier: "Pro" as SubscriptionTier,
      popular: true,
    },
    {
      name: "Ultra",
      price: 2999,
      period: "/mo",
      icon: Crown,
      color: "text-yellow-400",
      border: "border-yellow-500/50",
      bg: isDark
        ? "bg-neutral-900 shadow-xl shadow-yellow-900/20"
        : "bg-white shadow-xl shadow-yellow-500/10",
      features: [
        "Unlimited Tokens",
        "Real-time Video Analysis",
        "Mental Performance Coaching",
        "Team Management Tools",
        "24/7 Priority Support",
        "Early Access to Beta Features",
      ],
      buttonText: "Get Ultra",
      tier: "Ultra" as SubscriptionTier,
    },
  ];

  return (
    <div className={`p-6 md:p-8 relative ${bgClass}`}>
      {/* Payment Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setSelectedPlan(null)}
          />
          <div
            className={`relative max-w-4xl w-full rounded-[32px] overflow-hidden shadow-2xl border animate-in zoom-in-95 duration-300 flex flex-col md:flex-row ${
              isDark
                ? "bg-neutral-900 border-neutral-800"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Left side: Plan Info */}
            <div
              className={`md:w-5/12 p-8 md:p-12 flex flex-col ${
                isDark ? "bg-neutral-800/50" : "bg-gray-50"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  selectedPlan.color
                } ${isDark ? "bg-neutral-800" : "bg-white shadow-sm"}`}
              >
                <selectedPlan.icon className="w-8 h-8" />
              </div>
              <h3 className={`text-3xl font-bold mb-2 ${headerText}`}>
                Upgrade to {selectedPlan.name}
              </h3>
              <p className={`text-sm mb-8 leading-relaxed ${subText}`}>
                Unlock elite archery metrics and AI-driven coaching to achieve
                consistent X-ring accuracy.
              </p>

              <ul className="space-y-4">
                {selectedPlan.features.map((f: string, i: number) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <Check
                      className={`w-5 h-5 flex-shrink-0 ${selectedPlan.color}`}
                    />
                    <span
                      className={isDark ? "text-neutral-300" : "text-gray-600"}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-12">
                <div
                  className={`p-4 rounded-2xl border ${
                    isDark
                      ? "bg-black/20 border-white/5"
                      : "bg-white border-gray-100 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-green-500">
                      Secure Checkout
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-500">
                    Encrypted by Stripe. 30-day money-back guarantee.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side: Payment Config */}
            <div className="md:w-7/12 p-8 md:p-12 flex flex-col">
              <div className="mb-10">
                <label
                  className={`block text-xs font-bold uppercase tracking-widest mb-4 ${subText}`}
                >
                  Select Duration
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                  {periods.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setBillingPeriod(p.value)}
                      className={`
                        relative px-3 py-4 rounded-xl border text-sm font-bold transition-all flex flex-col items-center gap-1
                        ${
                          billingPeriod === p.value
                            ? `bg-neutral-800 border-${
                                accentText.split("-")[0] || "orange"
                              }-500 ${selectedPlan.color}`
                            : isDark
                              ? "bg-neutral-800/30 border-white/5 text-neutral-400 hover:border-white/10"
                              : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
                        }
                      `}
                    >
                      {p.label}
                      {p.discount > 0 && (
                        <span className="text-[9px] bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                          -{p.discount}%
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`p-6 rounded-2xl mb-10 ${
                  isDark ? "bg-black/30" : "bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-end mb-1 text-sm font-medium">
                  <span className={subText}>Current Price:</span>
                  <span className={headerText}>
                    {formatPrice(selectedPlan.price)}/mo
                  </span>
                </div>
                <div className="flex justify-between items-end mb-4 text-sm font-medium">
                  <span className={subText}>
                    Total for {billingPeriod} Months:
                  </span>
                  <span className="text-green-500 font-bold">
                    -{periods.find((p) => p.value === billingPeriod)?.discount}%
                    Bulk Discount
                  </span>
                </div>
                <div className="h-px bg-white/5 mb-4" />
                <div className="flex justify-between items-center">
                  <span className={`text-lg font-bold ${headerText}`}>
                    Total to Pay
                  </span>
                  <div className="text-right">
                    <div className={`text-4xl font-black ${headerText}`}>
                      {calculateTotalPrice(selectedPlan.price, billingPeriod)}
                    </div>
                    {(currentTier === "Charge" &&
                      (selectedPlan.tier === "Pro" ||
                        selectedPlan.tier === "Ultra")) ||
                    (currentTier === "Pro" && selectedPlan.tier === "Ultra") ? (
                      <p className="text-[10px] text-green-500 font-bold mt-1">
                        *Current plan value will be credited
                      </p>
                    ) : null}
                    <p className={`text-[10px] font-medium ${subText}`}>
                      Final amount inclusive of taxes
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  id="stripe-btn"
                  onClick={handlePayment}
                  className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-xl hover:scale-[1.02] flex items-center justify-center gap-3 ${
                    accentColor === "orange"
                      ? "bg-[#FFD700] text-black shadow-[#FFD700]/10"
                      : `bg-gradient-to-r ${accentGradient} text-white shadow-black/20`
                  }`}
                >
                  <svg
                    className={`w-12 h-6 ${accentColor === "orange" ? "text-black" : "text-white"}`}
                    viewBox="0 0 40 16"
                    fill="currentColor"
                  >
                    <path d="M12.98 6.13c0-1.16-.94-1.63-2.52-1.63-1.6 0-3.32.74-4.5 1.5l.65 2.15c1-.6 2.45-1.35 3.8-1.35 1 0 1.57.4 1.57 1 0 .66-.6 1-1.85 1.34-1.93.5-3.52 1.3-3.52 3.6 0 1.8 1.45 3.05 3.5 3.05 1.43 0 2.5-.53 3.1-1.25V15.5h2.8V6.13zm-2.8 7.3c-.63 0-1.07-.3-1.07-.86 0-.64.63-1 1.63-1.27 1.03-.27 1.68-.58 1.68-.58.12.87-.9 2.7-2.24 2.7zM24.84 4.5c-1.6 0-2.8.8-3.32 1.6V4.7h-2.8V15.5h2.8V8.72c0-1 .73-1.83 1.8-1.83.4 0 .7.1.86.17l.5-2.5c-.32-.1-.82-.2-1.84-.2zM33.7 4.5c-1.3 0-2.23.53-2.73 1.25l-.04-.55h-2.8V15.5h2.8V8.16c.4-.64 1.3-1.2 2.22-1.2 1.05 0 1.8.8 1.8 1.95V15.5h2.8V8.2c0-2.5-1.5-3.7-4.05-3.7zM2.8 4.7H0V15.5h2.8c1.8 0 3.2-1.3 3.2-3.1 0-1.1-.64-2-1.6-2.54.84-.5 1.4-1.35 1.4-2.4 0-1.7-1.3-2.8-3-2.8zM2.8 9.5H1.4V7h1.4c.5 0 .93.36.93.9s-.35.9-.93.9zm0 3.8H1.4V10.2h1.4c.7 0 1.2.43 1.2 1.05s-.5 1.05-1.2 1.05z" />
                  </svg>
                  Pay with Stripe
                </button>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className={`w-full py-4 text-sm font-bold opacity-50 hover:opacity-100 transition-opacity ${headerText}`}
                >
                  Cancel and go back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h2 className={`text-4xl font-bold mb-4 ${headerText}`}>
            Choose Your Edge
          </h2>
          <p className={`${subText} max-w-2xl mx-auto`}>
            Unlock the full potential of X10Minds with our premium tiers. Scale
            your training from hobbyist to Olympian.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan) => {
            const isCurrent = currentTier === plan.tier;
            return (
              <div
                key={plan.name}
                className={`
                  relative p-8 rounded-3xl border flex flex-col
                  ${plan.border} ${plan.bg} transition-all duration-300
                  ${!isCurrent ? "hover:scale-[1.02]" : ""}
                `}
              >
                {plan.popular && (
                  <div
                    className={`absolute top-0 right-0 ${accentColor === "orange" ? "text-black" : "text-white"} text-[10px] font-black tracking-widest px-4 py-1.5 rounded-bl-2xl bg-[#FFD700] shadow-lg shadow-[#FFD700]/10`}
                  >
                    MOST POPULAR
                  </div>
                )}

                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                    isDark ? "bg-neutral-800" : "bg-gray-100"
                  } ${plan.color}`}
                >
                  <plan.icon className="w-7 h-7" />
                </div>

                <h3 className={`text-2xl font-bold mb-2 ${headerText}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-4xl font-bold ${headerText}`}>
                    {formatPrice(plan.price)}
                  </span>
                  <span className={subText}>{plan.period}</span>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className={`flex items-start gap-3 text-sm ${
                        isDark ? "text-neutral-300" : "text-gray-600"
                      }`}
                    >
                      <Check
                        className={`w-5 h-5 flex-shrink-0 ${plan.color}`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => !isCurrent && setSelectedPlan(plan)}
                  disabled={isCurrent}
                  className={`
                    w-full py-4 rounded-xl font-bold transition-all
                    ${
                      isCurrent
                        ? isDark
                          ? "bg-neutral-800 text-neutral-500 cursor-default"
                          : "bg-gray-100 text-gray-400 cursor-default"
                        : plan.popular
                          ? accentColor === "orange"
                            ? "bg-[#FFD700] text-black hover:brightness-110 shadow-lg shadow-[#FFD700]/10"
                            : `bg-gradient-to-r ${accentGradient} text-white hover:shadow-lg shadow-black/10`
                          : isDark
                            ? "bg-white text-black hover:bg-neutral-200"
                            : `bg-gray-900 text-white hover:bg-black`
                    }
                  `}
                >
                  {isCurrent ? "Current Plan" : plan.buttonText}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center text-sm text-neutral-500">
          <p>
            Prices are converted to {selectedCurrency.name}. Cancel anytime.
            Terms and conditions apply.
          </p>
        </div>
      </div>

      {/* Beautiful Currency Dropdown in Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-full hover:bg-opacity-90 transition-all shadow-2xl group ${
            isDark
              ? "bg-neutral-900/90 border-white/10 text-white"
              : "bg-white/90 border-gray-200 text-gray-900"
          }`}
        >
          <Globe
            className={`w-4 h-4 group-hover:rotate-12 transition-transform ${accentText}`}
          />
          <span className="text-sm font-semibold">{selectedCurrency.code}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${
              showCurrencyDropdown ? "rotate-180" : ""
            }`}
          />
        </button>

        {showCurrencyDropdown && (
          <div
            className={`absolute bottom-full right-0 mb-4 w-56 border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 ${
              isDark
                ? "bg-neutral-900 border-white/10"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="p-2 max-h-64 overflow-y-auto custom-scrollbar">
              {currencies.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => {
                    setSelectedCurrency(curr);
                    setShowCurrencyDropdown(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all
                    ${
                      selectedCurrency.code === curr.code
                        ? `${
                            accentColor === "orange"
                              ? "bg-[#FFD700] text-black"
                              : `bg-${accentColor}-500 text-white`
                          }`
                        : isDark
                          ? "text-neutral-400 hover:bg-white/5 hover:text-white"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-bold">{curr.code}</span>
                    <span className="text-[10px] opacity-70">{curr.name}</span>
                  </div>
                  <span className="font-mono">{curr.symbol}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionView;
