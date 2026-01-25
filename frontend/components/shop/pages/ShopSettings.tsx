import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Globe,
  DollarSign,
  Save,
  CheckCircle,
  CreditCard,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { usePreferences } from "../context/PreferencesContext";
import { useNotification } from "../context/NotificationContext";
import { UserProfile } from "../../../types";

interface ShopSettingsProps {
  themeMode?: "dark" | "light";
  accentColor?: string;
  user?: UserProfile | null;
}

const ShopSettings: React.FC<ShopSettingsProps> = ({
  themeMode = "dark",
  accentColor = "orange",
  user,
}) => {
  const { preferences, setCurrency, savePreferences } = usePreferences();
  const { showNotification } = useNotification();
  const [localCurrency, setLocalCurrency] = useState(preferences.currency);
  const [saved, setSaved] = useState(false);

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

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "BDT", name: "Bangladeshi Taka", symbol: "৳" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "KRW", name: "South Korean Won", symbol: "₩" },
    { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  ];

  const handleSave = () => {
    setCurrency(localCurrency);
    savePreferences();
    setSaved(true);
    showNotification("Settings saved successfully!", "success");
    setTimeout(() => setSaved(false), 2000);
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const daysUntilExpiry = user?.subscriptionExpires
    ? Math.ceil((user.subscriptionExpires - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const isExpiringSoon =
    daysUntilExpiry !== null && daysUntilExpiry <= 10 && daysUntilExpiry > 0;

  return (
    <div className="pt-40 pb-24 container mx-auto px-6">
      <style>{`
        :root {
          --accent: ${accentColor};
          --accent-rgb: ${accentRgb};
        }
      `}</style>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`p-4 rounded-2xl ${isDark ? "bg-white/5" : "bg-gray-100"}`}
            >
              <SettingsIcon size={32} className="text-[var(--accent)]" />
            </div>
            <div>
              <h1
                className={`text-4xl font-black ${isDark ? "text-white" : "text-gray-950"}`}
              >
                Shop Settings
              </h1>
              <p
                className={`text-sm font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Customize your shopping experience
              </p>
            </div>
          </div>
        </motion.div>

        {/* Subscription Plan */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className={`rounded-[2.5rem] p-8 border mb-8 relative overflow-hidden ${
              isDark
                ? "bg-neutral-900/40 border-white/5"
                : "bg-white border-gray-100 shadow-xl shadow-gray-200/40"
            }`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="flex items-center gap-3 mb-6 relative z-10">
              <CreditCard size={24} className="text-[var(--accent)]" />
              <h2
                className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-950"}`}
              >
                Active Subscription
              </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-8 relative z-10 mb-2">
              <div className="flex-1">
                <p
                  className={`text-sm font-bold uppercase tracking-widest mb-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  Current Plan
                </p>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-4xl font-black ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {user.subscriptionTier}
                  </span>
                  <span className="bg-[var(--accent)] text-black text-[10px] font-black uppercase px-3 py-1 rounded-full">
                    Active
                  </span>
                </div>
              </div>

              {user.subscriptionExpires ? (
                <div className="flex-1">
                  <p
                    className={`text-sm font-bold uppercase tracking-widest mb-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    Renewal Date
                  </p>
                  <div className="flex items-center gap-3">
                    <Calendar
                      size={24}
                      className={isDark ? "text-gray-400" : "text-gray-600"}
                    />
                    <span
                      className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {formatDate(user.subscriptionExpires)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <p
                    className={`text-sm font-bold uppercase tracking-widest mb-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    Duration
                  </p>
                  <div className="flex items-center gap-3">
                    <Calendar
                      size={24}
                      className={isDark ? "text-gray-400" : "text-gray-600"}
                    />
                    <span
                      className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      Lifetime Access
                    </span>
                  </div>
                </div>
              )}
            </div>

            {isExpiringSoon && (
              <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-4 relative z-10">
                <div className="p-2 bg-red-500/20 rounded-lg shrink-0">
                  <AlertTriangle className="text-red-500" size={20} />
                </div>
                <div>
                  <p
                    className={`text-sm font-bold mb-1 ${isDark ? "text-red-400" : "text-red-600"}`}
                  >
                    Subscription Expiring Soon
                  </p>
                  <p
                    className={`text-xs ${isDark ? "text-red-400/80" : "text-red-600/80"}`}
                  >
                    Your plan expires in{" "}
                    <span className="font-bold">{daysUntilExpiry} days</span>.
                    Please renew to avoid interruption of premium services.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Currency Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-[2.5rem] p-8 border mb-8 ${
            isDark
              ? "bg-neutral-900/40 border-white/5"
              : "bg-white border-gray-100 shadow-xl shadow-gray-200/40"
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <DollarSign size={24} className="text-[var(--accent)]" />
            <h2
              className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-950"}`}
            >
              Currency Preference
            </h2>
          </div>

          <p
            className={`mb-6 font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Choose your preferred currency. All product prices will be
            automatically converted.
          </p>

          {/* Currency Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
            {currencies.map((curr) => {
              const isSelected = localCurrency === curr.code;
              return (
                <button
                  key={curr.code}
                  onClick={() => setLocalCurrency(curr.code)}
                  className={`p-4 rounded-2xl border transition-all duration-300 ${
                    isSelected
                      ? "border-[var(--accent)] bg-[rgba(var(--accent-rgb),0.1)] shadow-lg shadow-[rgba(var(--accent-rgb),0.2)]"
                      : isDark
                        ? "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10"
                        : "border-gray-100 bg-gray-50 hover:bg-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{curr.symbol}</span>
                    {isSelected && (
                      <CheckCircle
                        size={16}
                        className="text-[var(--accent)] ml-auto"
                      />
                    )}
                  </div>
                  <p
                    className={`text-sm font-black ${
                      isSelected
                        ? "text-[var(--accent)]"
                        : isDark
                          ? "text-white"
                          : "text-gray-900"
                    }`}
                  >
                    {curr.code}
                  </p>
                  <p
                    className={`text-[10px] font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    {curr.name}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Info Box */}
          <div
            className={`p-4 rounded-xl ${
              isDark
                ? "bg-[rgba(var(--accent-rgb),0.05)] border border-[var(--accent)]/20"
                : "bg-[var(--accent)]/5 border border-[var(--accent)]/20"
            }`}
          >
            <div className="flex items-start gap-3">
              <Globe size={18} className="text-[var(--accent)] mt-0.5" />
              <div>
                <p
                  className={`text-sm font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  Currency Conversion
                </p>
                <p
                  className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Prices are converted in real-time based on current exchange
                  rates. Your selected currency will be applied to all products
                  throughout the shop.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-end"
        >
          <button
            onClick={handleSave}
            disabled={saved}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-lg ${
              saved
                ? "bg-green-500 text-white shadow-green-500/20"
                : "bg-[var(--accent)] text-black hover:scale-105 active:scale-95 shadow-[rgba(var(--accent-rgb),0.2)]"
            }`}
          >
            {saved ? (
              <>
                <CheckCircle size={20} />
                Saved!
              </>
            ) : (
              <>
                <Save size={20} />
                Save Settings
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ShopSettings;
