import { useState, useRef, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Save,
  Shield,
  Brain,
  Palette,
  User,
  Lock,
  Eye,
  CheckCircle,
  Moon,
  Sun,
  Globe,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  Phone,
  Type,
  Keyboard,
  Camera,
  CreditCard,
  ShoppingBag,
  DollarSign,
  Package,
  FileText,
  Plus,
  Truck,
  Receipt,
  Calendar,
  RotateCcw,
} from "lucide-react";
import { AppSettings, UserProfile, AppMode } from "../types";
import { NotificationType } from "./Overlays";
import { getTranslation } from "../i18n";
import {
  getRecaptchaVerifier,
  startMfaEnrollment,
  finishMfaEnrollment,
  logoutFirebase,
  unenrollMfa,
  reauthenticateUser,
  sendVerificationEmail,
  reloadUser,
} from "../services/firebase";

interface SettingsProps {
  currentSettings: AppSettings;
  currentUser?: UserProfile | null;
  onUpdateSettings: (settings: AppSettings) => void;
  onUpdateUser?: (user: UserProfile) => void;
  onSave: () => void;
  onDeleteAccount: () => void;
  notify: (message: string, type: NotificationType) => void;
  onNavigate: (mode: AppMode) => void;
  onDirtyChange?: (isDirty: boolean) => void;
  onPreviewTheme?: (color: string | null) => void;
}

// Shop State Type Definitions
interface PaymentMethod {
  id: string;
  type: "CARD" | "UPI";
  label: string;
  expiry?: string;
}

interface Order {
  id: string;
  status: string;
  items: number;
  date: string;
  total: number;
}

const Settings: React.FC<SettingsProps> = ({
  currentSettings,
  currentUser,
  onUpdateSettings,
  onUpdateUser,
  onSave,
  onDeleteAccount,
  notify,
  onNavigate,
  onDirtyChange,
  onPreviewTheme,
}) => {
  // --- Hooks at the top ---
  const [localSettings, setLocalSettings] =
    useState<AppSettings>(currentSettings);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    currentUser?.avatarUrl,
  );
  const [saved, setSaved] = useState(false);
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [mfaStep, setMfaStep] = useState<"PHONE" | "CODE">("PHONE");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [isMfaLoading, setIsMfaLoading] = useState(false);
  const [recaptchaKey, setRecaptchaKey] = useState(0);
  const [emailError, setEmailError] = useState(false);
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [reauthPassword, setReauthPassword] = useState("");
  const [pendingMfaAction, setPendingMfaAction] = useState<
    "ENABLE" | "DISABLE" | null
  >(null);
  const [activeShopTab, setActiveShopTab] = useState("Orders");
  const [shopOrders, setShopOrders] = useState<Order[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [newPaymentType, setNewPaymentType] = useState<"CARD" | "UPI">("CARD");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [upiId, setUpiId] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Sync local state with prop updates (e.g. from shortcuts or external resets)
  useEffect(() => {
    setLocalSettings(currentSettings);
  }, [currentSettings]);

  const recaptchaVerifierRef = useRef<any>(null);
  const mfaAttemptRef = useRef(0);

  // --- Handlers ---
  const handleExportData = () => {
    const email = currentUser?.email || "guest";
    const data = {
      settings: localSettings,
      user: currentUser,
      history: JSON.parse(
        localStorage.getItem(`x10minds_history_${email}`) || "[]",
      ),
      scores: JSON.parse(
        localStorage.getItem(`x10minds_scores_${email}`) || "[]",
      ),
      payments: JSON.parse(
        localStorage.getItem("x10minds_saved_payments") || "[]",
      ),
      orders: JSON.parse(localStorage.getItem("x10minds_shop_orders") || "[]"),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `x10minds_data_${email.replace(/[@.]/g, "_")}_${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify("Data exported successfully!", "success");
  };

  const handleResetApp = () => {
    setShowResetConfirm(true);
  };

  const executeReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleShortcutChange = (
    key: keyof NonNullable<AppSettings["shortcuts"]>,
    value: string,
  ) => {
    const updatedShortcuts = {
      ...(localSettings.shortcuts || {
        history: "alt+h",
        chat: "alt+c",
        settings: "alt+,",
        help: "alt+/",
        theme: "alt+t",
        dashboard: "alt+d",
        calculator: "alt+k",
        shop: "alt+s",
      }),
      [key]: value,
    };

    const updatedSettings = {
      ...localSettings,
      shortcuts: updatedShortcuts,
    };

    setLocalSettings(updatedSettings);
    // Auto-save logic
    onUpdateSettings(updatedSettings);
    if (onDirtyChange) onDirtyChange(false); // No longer dirty if auto-saved
  };

  useEffect(() => {
    // Load data from local storage to mock persistence
    const savedPayments = localStorage.getItem("x10minds_saved_payments");
    if (savedPayments) {
      try {
        setPaymentMethods(JSON.parse(savedPayments));
      } catch (e) {}
    }

    // Check for any orders saved by shop component
    // (Note: Shop logic might need update to save here, but for now we read what's there or empty)
    const savedOrders = localStorage.getItem("x10minds_shop_orders");
    if (savedOrders) {
      try {
        setShopOrders(JSON.parse(savedOrders));
      } catch (e) {}
    }

    // Sync currency from shop preferences
    const shopPrefs = localStorage.getItem("x10minds_preferences");
    if (shopPrefs) {
      try {
        const prefs = JSON.parse(shopPrefs);
        if (prefs.currency && !localSettings.shopCurrency) {
          setLocalSettings((prev) => ({
            ...prev,
            shopCurrency: prefs.currency,
          }));
        }
      } catch (e) {}
    }
  }, []);

  const t = (key: string) => {
    return getTranslation(localSettings.language || "English", key);
  };

  const handleSendMfaCode = async (phoneToVerify?: string) => {
    const targetPhone = phoneToVerify || phoneNumber;
    if (!targetPhone) return;

    mfaAttemptRef.current++;

    setIsMfaLoading(true);
    try {
      setEmailError(false);

      // Clean up previous verifier index
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (e) {
          // Ignore clear errors
        }
        recaptchaVerifierRef.current = null;
      }

      // Force-reset the container via key
      setRecaptchaKey((prev) => prev + 1);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const verifier = getRecaptchaVerifier("recaptcha-container", "normal");
      recaptchaVerifierRef.current = verifier;
      await verifier.render();

      // Strict validation
      if (!targetPhone.trim().startsWith("+")) {
        notify(
          "Please include your country code starting with '+' (e.g., +91...)",
          "error",
        );
        setIsMfaLoading(false);
        return;
      }

      const cleanedPhone = "+" + targetPhone.replace(/\D/g, "");
      const id = await startMfaEnrollment(
        cleanedPhone,
        recaptchaVerifierRef.current,
      );

      setVerificationId(id);
      setMfaStep("CODE");
      notify(
        t("verification_code_sent") || "Verification code sent!",
        "success",
      );
    } catch (e: any) {
      console.error("MFA Error Details:", e);

      if (e.code === "auth/requires-recent-login") {
        if (mfaAttemptRef.current > 1) {
          notify(
            "Security session is still stale. Please Log Out and Log In again to refresh your account strictly.",
            "warning",
          );
        } else {
          setShowReauthModal(true);
          setPendingMfaAction("ENABLE");
        }
      } else if (e.code === "auth/unverified-email") {
        setEmailError(true);
        notify("You must verify your email before enabling 2FA.", "error");
      } else if (e.code === "auth/billing-not-enabled") {
        notify(
          "MFA requires a Firebase Blaze (Pay-as-you-go) plan. Please enable billing in your Firebase Console.",
          "error",
        );
      } else {
        let msg = e.message;
        if (e.code === "auth/invalid-phone-number")
          msg = "Invalid phone number.";
        if (e.code === "auth/operation-not-allowed")
          msg = "Phone Auth not enabled in Firebase.";
        notify("Error: " + msg, "error");
      }
    } finally {
      setIsMfaLoading(false);
    }
  };

  const isDark = localSettings.theme === "dark";

  // ... styles ...
  const bgMain = isDark ? "bg-neutral-950" : "bg-gray-50";
  const bgCard = isDark
    ? "bg-neutral-900 border-neutral-800"
    : "bg-white border-gray-200 shadow-sm";
  const textTitle = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-neutral-400" : "text-gray-500";
  const inputBg = isDark
    ? "bg-white/5 border-white/10 text-white focus:border-white/20 hover:bg-white/10 transition-all placeholder:text-neutral-500"
    : "bg-white border-gray-200 text-gray-900 focus:border-gray-400 shadow-sm";
  const switchBgOff = isDark ? "bg-neutral-700" : "bg-gray-300";
  const activeAccent = localSettings.accentColor || "orange";

  const getThemeStyles = () => {
    const isHex = activeAccent?.startsWith("#");
    const color = isHex
      ? activeAccent
      : activeAccent === "blue"
        ? "#3b82f6"
        : activeAccent === "green"
          ? "#22c55e"
          : activeAccent === "purple"
            ? "#a855f7"
            : activeAccent === "red"
              ? "#ef4444"
              : activeAccent === "pink"
                ? "#ec4899"
                : activeAccent === "teal"
                  ? "#14b8a6"
                  : activeAccent === "cyan"
                    ? "#06b6d4"
                    : activeAccent === "indigo"
                      ? "#6366f1"
                      : "#FFD700"; // Default gold

    const isGold = color === "#FFD700" || activeAccent === "orange";

    return {
      main: color,
      isGold,
    };
  };

  const themeStyle = getThemeStyles();

  const radioInactive = isDark
    ? "border-neutral-800 bg-black hover:border-neutral-600 text-neutral-400"
    : "border-gray-200 bg-white hover:border-gray-300 text-gray-600";

  const updateSetting = (key: keyof AppSettings, value: any) => {
    setLocalSettings((prev) => {
      const next = { ...prev, [key]: value };
      if (onDirtyChange) onDirtyChange(true);
      return next;
    });
  };

  const handleSave = () => {
    onUpdateSettings(localSettings);

    if (currentUser && onUpdateUser) {
      let updatedUser = { ...currentUser };
      let changed = false;

      // Update Avatar
      if (avatarUrl !== currentUser.avatarUrl) {
        updatedUser.avatarUrl = avatarUrl;
        changed = true;
      }

      // Enforce Concurrent Session Setting
      // If enabled, we remove all other devices from the list regarding of backend state
      // ensuring the user preference is reflected in data
      if (localSettings.singleSession) {
        const currentDeviceId = localStorage.getItem("x10minds_device_id");
        if (
          updatedUser.activeDevices &&
          updatedUser.activeDevices.length > 1 &&
          currentDeviceId
        ) {
          const myDevice = updatedUser.activeDevices.find(
            (d) => d.deviceId === currentDeviceId,
          );
          if (myDevice) {
            updatedUser.activeDevices = [myDevice];
            changed = true;
            notify(
              "Other sessions terminated due to single session policy",
              "info",
            );
          }
        }
      }

      if (changed) {
        onUpdateUser(updatedUser);
      }
    }

    // Sync currency with shop preferences
    if (localSettings.shopCurrency) {
      const shopPrefs = JSON.parse(
        localStorage.getItem("x10minds_preferences") || "{}",
      );
      shopPrefs.currency = localSettings.shopCurrency;
      localStorage.setItem("x10minds_preferences", JSON.stringify(shopPrefs));
    }

    setSaved(true);
    // Dirty state is handled by parent on save, but we can emit false here too
    if (onDirtyChange) onDirtyChange(false);

    setTimeout(() => {
      setSaved(false);
      onSave();
    }, 800);
  };

  // Helper function to get background color for toggles
  const getToggleStyle = (isActive: boolean) => {
    if (!isActive) return {};
    return { backgroundColor: themeStyle.main };
  };

  const activeIconStyle = { color: themeStyle.main };

  return (
    <div className={`p-6 md:p-8 ${bgMain}`}>
      <div className="max-w-2xl mx-auto">
        <header
          className={`mb-8 border-b pb-6 ${
            isDark ? "border-neutral-800" : "border-gray-200"
          }`}
        >
          <h2
            className={`text-3xl font-bold mb-2 flex items-center gap-3 ${textTitle}`}
          >
            <SettingsIcon className={`w-8 h-8 ${textSub}`} />
            {t("app_settings")}
          </h2>
          <p className={textSub}>{t("customize_ai")}</p>
        </header>

        <div className="space-y-6">
          {/* Profile & Personality - Restricted for Free Tier */}
          {currentUser?.subscriptionTier !== "Free" ? (
            <section className={`rounded-2xl p-6 border ${bgCard}`}>
              <div
                className="flex items-center gap-3 mb-6"
                style={activeIconStyle}
              >
                <User className="w-6 h-6" />
                <h3 className={`text-xl font-bold ${textTitle}`}>
                  {t("profile_identity")}
                </h3>
              </div>

              <div className="space-y-6">
                {/* Profile Picture Upload */}
                <div className="flex items-center gap-6">
                  <div className="relative group/avatar">
                    <div
                      className={`w-24 h-24 rounded-[2rem] flex items-center justify-center overflow-hidden border-2 transition-all duration-300 group-hover/avatar:scale-105 group-hover/avatar:shadow-[0_0_20px_rgba(255,215,0,0.3)] ${
                        isDark
                          ? "bg-neutral-800 border-neutral-700 group-hover/avatar:border-[#FFD700]/50"
                          : "bg-gray-100 border-gray-200 shadow-sm group-hover/avatar:border-[#FFD700]/30"
                      }`}
                    >
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className={`w-10 h-10 ${textSub}`} />
                      )}
                    </div>
                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer rounded-[2rem]">
                      <Camera className="w-8 h-8 text-white" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (!file.type.startsWith("image/")) {
                              notify(
                                "Please upload an image file (JPG, PNG).",
                                "error",
                              );
                              return;
                            }
                            if (file.size > 5 * 1024 * 1024) {
                              notify(
                                "File too large. Please select an image under 5MB.",
                                "error",
                              );
                              return;
                            }

                            const reader = new FileReader();
                            reader.onload = (readerEvent) => {
                              const img = new Image();
                              img.onload = () => {
                                const canvas = document.createElement("canvas");
                                let width = img.width;
                                let height = img.height;
                                const maxSize = 300; // Resize to max 300px

                                if (width > height) {
                                  if (width > maxSize) {
                                    height *= maxSize / width;
                                    width = maxSize;
                                  }
                                } else {
                                  if (height > maxSize) {
                                    width *= maxSize / height;
                                    height = maxSize;
                                  }
                                }

                                canvas.width = width;
                                canvas.height = height;
                                const ctx = canvas.getContext("2d");
                                ctx?.drawImage(img, 0, 0, width, height);

                                const compressedDataUrl = canvas.toDataURL(
                                  "image/jpeg",
                                  0.7,
                                );
                                setAvatarUrl(compressedDataUrl);
                              };
                              img.src = readerEvent.target?.result as string;
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`text-sm font-black uppercase tracking-widest mb-1 ${textTitle}`}
                    >
                      {t("profile_picture")}
                    </h4>
                    <p className={`text-xs mb-4 font-medium ${textSub}`}>
                      Recommended: Square JPG or PNG, max 5MB.
                    </p>

                    {/* Ready Avatars */}
                    <div className="mb-4">
                      <p
                        className={`text-[10px] font-black uppercase tracking-widest mb-2 ${textSub}`}
                      >
                        Ready Avatars
                      </p>
                      <div className="grid grid-cols-6 gap-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <button
                            key={i}
                            onClick={() =>
                              setAvatarUrl(`/images/avatars/avator ${i}.jpeg`)
                            }
                            className={`aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-110 ${
                              avatarUrl === `/images/avatars/avator ${i}.jpeg`
                                ? `${activeAccent === "orange" ? "border-[#FFD700]" : `border-${activeAccent}-500`} shadow-lg scale-110`
                                : "border-transparent opacity-60 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={`/images/avatars/avator ${i}.jpeg`}
                              alt={`Avatar ${i}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {avatarUrl && (
                        <button
                          onClick={() => setAvatarUrl(undefined)}
                          className={`px-3 py-2 rounded-lg text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors`}
                        >
                          {t("remove")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm mb-2 ${textSub}`}>
                    {t("nickname")}
                  </label>
                  <input
                    type="text"
                    value={localSettings.nickname}
                    onChange={(e) => updateSetting("nickname", e.target.value)}
                    className={`w-full rounded-xl px-4 py-3 focus:outline-none ${inputBg}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm mb-2 ${textSub}`}>
                    {t("email_address")}
                  </label>
                  <input
                    type="email"
                    value={currentUser?.email || ""}
                    readOnly
                    disabled
                    className={`w-full rounded-xl px-4 py-3 focus:outline-none cursor-not-allowed opacity-60 ${inputBg}`}
                  />
                  <p className={`text-xs mt-1.5 ml-1 italic ${textSub}`}>
                    {t("email_linked")}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  {["Professional", "Casual", "Strict", "Funny"].map((p) => {
                    const isActive = localSettings.aiPersonality === p;
                    return (
                      <label
                        key={p}
                        style={
                          isActive
                            ? {
                                borderColor:
                                  themeStyle.isGold && !isDark
                                    ? "#000000"
                                    : themeStyle.main,
                                backgroundColor: `${themeStyle.main}1a`,
                                color: themeStyle.main,
                              }
                            : {}
                        }
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                          isActive ? "border" : radioInactive
                        }`}
                      >
                        <span
                          className={`font-bold text-sm ${isActive ? "" : textTitle}`}
                        >
                          {t(p.toLowerCase()) || p}
                        </span>
                        <input
                          type="radio"
                          name="personality"
                          checked={isActive}
                          onChange={() =>
                            updateSetting("aiPersonality", p as any)
                          }
                          className="w-4 h-4"
                          style={{ accentColor: themeStyle.main }}
                        />
                      </label>
                    );
                  })}
                </div>

                <div className="mt-4">
                  <label className={`block text-sm mb-2 ${textSub}`}>
                    {t("custom_instructions") || "Custom AI Instructions"}
                  </label>
                  <textarea
                    value={localSettings.aiInstructions || ""}
                    onChange={(e) =>
                      updateSetting("aiInstructions", e.target.value)
                    }
                    placeholder="e.g. Always respond in bullet points, be very concise, or pretend to be a drill sergeant."
                    className={`w-full rounded-xl px-4 py-3 focus:outline-none min-h-[100px] resize-y ${inputBg}`}
                  />
                  <p className={`text-xs mt-1.5 ml-1 italic ${textSub}`}>
                    {t("custom_instructions_hint") ||
                      "These instructions will guide how the AI responds to you."}
                  </p>
                </div>
              </div>
            </section>
          ) : (
            <div className={`rounded-2xl p-6 border text-center ${bgCard}`}>
              <Shield className="w-12 h-12 mx-auto mb-4 text-neutral-500" />
              <h3 className={`text-xl font-bold mb-2 ${textTitle}`}>
                {t("profile_locked") || "Profile Settings Locked"}
              </h3>
              <p className={`mb-4 ${textSub}`}>
                Upgrade to Pro to customize your AI personality and profile.
              </p>
            </div>
          )}

          {/* Theme & Appearance */}
          <section className={`rounded-2xl p-6 border ${bgCard}`}>
            <div className={`flex items-center gap-3 mb-6 ${textTitle}`}>
              <Palette className="w-6 h-6" />
              <h3 className="text-xl font-bold">{t("theme_customization")}</h3>
            </div>

            <div className="space-y-6">
              {/* Theme Mode Toggle */}
              <div>
                <p className={`text-sm mb-3 ${textSub}`}>{t("theme_mode")}</p>
                <div
                  className={`flex w-full rounded-2xl p-1.5 ${
                    isDark
                      ? "bg-black border border-neutral-800"
                      : "bg-gray-100 border border-gray-200"
                  }`}
                >
                  <button
                    onClick={() => updateSetting("theme", "light")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all duration-300 ${
                      !isDark
                        ? "bg-white text-black shadow-md scale-[1.02]"
                        : "text-neutral-500 hover:text-white"
                    }`}
                  >
                    <Sun className="w-5 h-5" /> {t("light")}
                  </button>
                  <button
                    onClick={() => updateSetting("theme", "dark")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all duration-300 ${
                      isDark
                        ? "bg-neutral-800 text-white shadow-md scale-[1.02]"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    <Moon className="w-5 h-5" /> {t("dark")}
                  </button>
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <p className={`text-sm mb-3 ${textSub}`}>{t("accent_color")}</p>
                <div className="flex gap-4">
                  {[
                    "orange",
                    "blue",
                    "green",
                    "purple",
                    "red",
                    "pink",
                    "teal",
                    "cyan",
                    "indigo",
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        updateSetting("accentColor", color);
                        if (onPreviewTheme) onPreviewTheme(color);
                      }}
                      className={`w-12 h-12 rounded-full border-2 transition-transform hover:scale-110 ${
                        localSettings.accentColor === color
                          ? `border-current scale-110 ${textTitle}`
                          : "border-transparent"
                      }`}
                      style={{
                        backgroundColor:
                          color === "orange"
                            ? "#FFD700"
                            : color === "blue"
                              ? "#2563eb"
                              : color === "green"
                                ? "#16a34a"
                                : color === "purple"
                                  ? "#9333ea"
                                  : color === "red"
                                    ? "#dc2626"
                                    : color === "pink"
                                      ? "#db2777"
                                      : color === "teal"
                                        ? "#0d9488"
                                        : color === "cyan"
                                          ? "#0891b2"
                                          : "#4f46e5",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Font Size Selection */}
              <div>
                <p className={`text-sm mb-3 ${textSub}`}>{t("font_size")}</p>
                <div
                  className={`flex rounded-xl p-1 ${
                    isDark
                      ? "bg-black border border-neutral-800"
                      : "bg-gray-100 border border-gray-200"
                  }`}
                >
                  {(["small", "medium", "large"] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => updateSetting("fontSize", size)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${
                        localSettings.fontSize === size
                          ? isDark
                            ? "bg-neutral-800 text-white shadow-sm"
                            : "bg-white text-black shadow-sm"
                          : isDark
                            ? "text-neutral-500 hover:text-white"
                            : "text-gray-500 hover:text-black"
                      }`}
                    >
                      <Type
                        className={`${
                          size === "small"
                            ? "w-3 h-3"
                            : size === "large"
                              ? "w-5 h-5"
                              : "w-4 h-4"
                        }`}
                      />
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <p className={`text-sm mb-3 ${textSub}`}>{t("language")}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    "English",
                    "Spanish",
                    "French",
                    "German",
                    "Hindi",
                    "Chinese",
                    "Japanese",
                    "Arabic",
                  ].map((lang) => {
                    const isActive = localSettings.language === lang;
                    return (
                      <button
                        key={lang}
                        onClick={() => updateSetting("language", lang)}
                        style={
                          isActive
                            ? {
                                borderColor:
                                  themeStyle.isGold && !isDark
                                    ? "#000000"
                                    : themeStyle.main,
                                backgroundColor: `${themeStyle.main}1a`,
                                color: themeStyle.main,
                              }
                            : {}
                        }
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                          isActive ? "border" : radioInactive
                        }`}
                      >
                        <Globe className="w-3.5 h-3.5 opacity-60" />
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Keyboard Shortcuts */}
          <section className={`rounded-2xl p-6 border ${bgCard}`}>
            <div className={`flex items-center gap-3 mb-6 ${textTitle}`}>
              <Keyboard className="w-6 h-6" />
              <h3 className="text-xl font-bold">
                {t("keyboard_shortcuts") || "Keyboard Shortcuts"}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(
                localSettings.shortcuts || {
                  history: "alt+h",
                  chat: "alt+c",
                  settings: "alt+,",
                  help: "alt+/",
                  theme: "alt+t",
                  dashboard: "alt+d",
                  calculator: "alt+k",
                  shop: "alt+s",
                },
              ).map(([key, value]) => (
                <div key={key}>
                  <p
                    className={`text-xs font-bold uppercase tracking-widest mb-1.5 ${textSub}`}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </p>
                  <div
                    className={`relative flex items-center rounded-xl overflow-hidden border ${
                      isDark
                        ? "border-neutral-700 bg-black/20"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <input
                      type="text"
                      value={value as string}
                      onChange={(e) =>
                        handleShortcutChange(key as any, e.target.value)
                      }
                      className={`w-full bg-transparent px-4 py-3 text-sm font-mono focus:outline-none ${textTitle}`}
                      placeholder="e.g. alt+k"
                    />
                    <div
                      className={`px-4 py-3 border-l ${
                        isDark
                          ? "border-neutral-700 bg-neutral-800"
                          : "border-gray-200 bg-gray-100"
                      }`}
                    >
                      <Keyboard className={`w-4 h-4 ${textSub}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className={`mt-6 p-4 rounded-xl border ${
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <h4
                className={`text-sm font-bold mb-2 flex items-center gap-2 ${textTitle}`}
              >
                <AlertTriangle className="w-4 h-4 text-[#FFD700]" />
                How to Customize
              </h4>
              <ul className={`text-xs space-y-1 ${textSub} list-disc ml-4`}>
                <li>
                  Format: <strong>modifier+key</strong> (e.g.,{" "}
                  <code>alt+k</code>, <code>ctrl+shift+p</code>).
                </li>
                <li>
                  Supported modifiers: <code>alt</code>, <code>ctrl</code>,{" "}
                  <code>shift</code>, <code>meta</code> (Command).
                </li>
                <li>
                  Ensure the shortcut doesn't conflict with browser defaults
                  (like <code>ctrl+t</code> or <code>ctrl+w</code>).
                </li>
              </ul>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    const defaultedSettings = {
                      ...localSettings,
                      shortcuts: {
                        history: "alt+h",
                        chat: "alt+c",
                        settings: "alt+,",
                        help: "alt+/",
                        theme: "alt+t",
                        dashboard: "alt+d",
                        calculator: "alt+k",
                        shop: "alt+s",
                      },
                    };
                    setLocalSettings(defaultedSettings);
                    onUpdateSettings(defaultedSettings);
                    if (onDirtyChange) onDirtyChange(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                    isDark
                      ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Defaults
                </button>
              </div>
            </div>
          </section>

          {/* Privacy & Security */}
          <section className={`rounded-2xl p-6 border ${bgCard}`}>
            <div className={`flex items-center gap-3 mb-6 ${textTitle}`}>
              <Shield className="w-6 h-6" />
              <h3 className="text-xl font-bold">{t("data_security")}</h3>
            </div>

            <div
              className={`space-y-4 divide-y ${
                isDark ? "divide-neutral-800" : "divide-gray-100"
              }`}
            >
              <div className="flex items-center justify-between py-2 gap-4">
                <div>
                  <p
                    className={`font-bold flex items-center gap-2 ${textTitle}`}
                  >
                    <Lock className={`w-4 h-4 ${textSub}`} /> {t("two_factor")}
                  </p>
                  <p className={`text-sm ${textSub}`}>
                    {t("add_extra_security")}
                  </p>
                </div>
                <button
                  onClick={async () => {
                    if (!localSettings.twoFactorAuth) {
                      setShowMfaModal(true);
                      setPendingMfaAction("ENABLE");
                    } else {
                      if (
                        confirm(
                          "Are you sure you want to disable Two-Factor Authentication?",
                        )
                      ) {
                        setIsMfaLoading(true);
                        try {
                          await unenrollMfa();
                          updateSetting("twoFactorAuth", false);
                          notify(
                            "Two-Factor Authentication Disabled.",
                            "success",
                          );
                        } catch (err) {
                          console.error("Firebase unenroll failure:", err);
                          // Force reset anyway for user convenience
                          updateSetting("twoFactorAuth", false);
                          notify("MFA Reset locally (out of sync).", "warning");
                        } finally {
                          setIsMfaLoading(false);
                        }
                      }
                    }
                  }}
                  className={`w-12 h-7 rounded-full transition-colors relative ${localSettings.twoFactorAuth ? "" : switchBgOff}`}
                  style={getToggleStyle(localSettings.twoFactorAuth)}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                      localSettings.twoFactorAuth ? "left-6" : "left-1"
                    }`}
                  ></div>
                </button>
              </div>

              {/* MFA Modal */}
              {showMfaModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
                  <div
                    className={`max-w-md w-full rounded-3xl p-8 border relative ${
                      isDark
                        ? "bg-neutral-900 border-neutral-800"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <button
                      onClick={() => setShowMfaModal(false)}
                      className="absolute top-4 right-4 text-neutral-500 hover:text-white"
                    >
                      ✕
                    </button>

                    <h3 className={`text-xl font-bold mb-4 ${textTitle}`}>
                      {mfaStep === "PHONE"
                        ? t("enable_2fa")
                        : t("verify_phone")}
                    </h3>

                    {mfaStep === "PHONE" ? (
                      <div className="space-y-4">
                        <p className={textSub}>{t("enter_mobile")}</p>
                        <input
                          type="tel"
                          placeholder="+1 555-555-5555"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className={`w-full p-3 rounded-xl border ${inputBg}`}
                        />
                        <p className={`text-[10px] ${textSub} ml-1`}>
                          * {t("include_country_code")}
                        </p>
                        <div key={recaptchaKey} id="recaptcha-container"></div>

                        {emailError ? (
                          <div
                            className={`p-4 rounded-xl border ${
                              isDark
                                ? "bg-orange-500/10 border-orange-500/30"
                                : "bg-orange-50 border-orange-200"
                            }`}
                          >
                            <p
                              className={`text-sm mb-3 ${
                                isDark ? "text-orange-200" : "text-orange-800"
                              }`}
                            >
                              Your email address is not verified. Firebase
                              requires a verified email to enable MFA.
                            </p>
                            <button
                              onClick={async () => {
                                try {
                                  await sendVerificationEmail();
                                  notify(
                                    "Verification email sent! Please check your inbox.",
                                    "success",
                                  );
                                } catch (e: any) {
                                  notify(
                                    "Failed to send email: " + e.message,
                                    "error",
                                  );
                                }
                              }}
                              className="w-full py-2 bg-orange-600 text-white rounded-lg text-sm font-bold mb-2"
                            >
                              Resend Verification Email
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  await reloadUser();
                                  setEmailError(false);
                                  notify(
                                    "Profile refreshed! You can now try sending the code again.",
                                    "success",
                                  );
                                } catch (e: any) {
                                  notify(
                                    "Failed to refresh: " + e.message,
                                    "error",
                                  );
                                }
                              }}
                              className={`w-full py-2 rounded-lg text-sm font-bold border ${
                                isDark
                                  ? "border-white/20 text-white bg-white/5"
                                  : "border-gray-200 text-gray-900 bg-gray-50"
                              }`}
                            >
                              I've Verified My Email
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSendMfaCode()}
                            disabled={isMfaLoading}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold"
                          >
                            {isMfaLoading ? t("sending") : t("send_code")}
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className={textSub}>
                          {t("enter_code")} {phoneNumber}
                        </p>
                        <input
                          type="text"
                          placeholder="123456"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className={`w-full p-3 rounded-xl border ${inputBg}`}
                        />
                        <button
                          onClick={async () => {
                            if (!verificationCode) return;
                            setIsMfaLoading(true);
                            try {
                              await finishMfaEnrollment(
                                verificationId,
                                verificationCode,
                              );
                              setLocalSettings((s) => ({
                                ...s,
                                twoFactorAuth: true,
                              }));
                              setShowMfaModal(false);
                              notify(
                                "Two-Factor Authentication Enabled!",
                                "success",
                              );
                            } catch (e: any) {
                              notify("Invalid code: " + e.message, "error");
                            } finally {
                              setIsMfaLoading(false);
                            }
                          }}
                          disabled={isMfaLoading}
                          className="w-full py-3 bg-green-600 text-white rounded-xl font-bold"
                        >
                          {isMfaLoading ? t("verifying") : t("verify_enable")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Re-authentication Modal */}
              {showReauthModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                  <div
                    className={`max-w-md w-full rounded-3xl p-8 border ${
                      isDark
                        ? "bg-neutral-900 border-neutral-800"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <h3 className={`text-xl font-bold mb-4 ${textTitle}`}>
                      {t("confirm_password")}
                    </h3>
                    <p className={`text-sm mb-6 ${textSub}`}>
                      {t("sensitive_operation")}
                    </p>
                    <input
                      type="password"
                      placeholder="Your Password"
                      value={reauthPassword}
                      onChange={(e) => setReauthPassword(e.target.value)}
                      className={`w-full p-3 rounded-xl border mb-6 ${inputBg}`}
                    />
                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          setShowReauthModal(false);
                          setReauthPassword("");
                          setPendingMfaAction(null);
                        }}
                        className={`flex-1 py-3 rounded-xl font-bold ${
                          isDark
                            ? "bg-neutral-800 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        {t("cancel")}
                      </button>
                      <button
                        onClick={async () => {
                          setIsMfaLoading(true);
                          try {
                            await reauthenticateUser(reauthPassword);
                            setShowReauthModal(false);
                            setReauthPassword("");

                            // Resume pending action
                            if (pendingMfaAction === "DISABLE") {
                              try {
                                await unenrollMfa();
                              } catch (err) {
                                console.error(
                                  "Firebase unenroll failure:",
                                  err,
                                );
                                notify(
                                  "MFA was out of sync, resetting your account security state now.",
                                  "warning",
                                );
                              }
                              setLocalSettings((s) => ({
                                ...s,
                                twoFactorAuth: false,
                              }));
                              notify(
                                "Two-Factor Authentication Disabled.",
                                "success",
                              );
                            } else if (pendingMfaAction === "ENABLE") {
                              // Force a tiny delay to let Firebase state propagate
                              setTimeout(() => {
                                handleSendMfaCode();
                              }, 500);
                            }
                          } catch (e: any) {
                            notify(
                              "Re-authentication failed: " + e.message,
                              "error",
                            );
                          } finally {
                            setIsMfaLoading(false);
                          }
                        }}
                        disabled={isMfaLoading}
                        className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-bold"
                      >
                        {isMfaLoading ? "Verifying..." : t("confirm")}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between py-4">
                <div>
                  <p
                    className={`font-bold flex items-center gap-2 ${textTitle}`}
                  >
                    <Eye className={`w-4 h-4 ${textSub}`} />{" "}
                    {t("public_profile")}
                  </p>
                  <p className={`text-sm ${textSub}`}>
                    {t("public_profile_desc")}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setLocalSettings((s) => ({
                      ...s,
                      publicProfile: !s.publicProfile,
                    }))
                  }
                  className={`w-12 h-7 rounded-full transition-colors relative ${localSettings.publicProfile ? "" : switchBgOff}`}
                  style={getToggleStyle(localSettings.publicProfile)}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                      localSettings.publicProfile ? "left-6" : "left-1"
                    }`}
                  ></div>
                </button>
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <p
                    className={`font-bold flex items-center gap-2 ${textTitle}`}
                  >
                    <Brain className={`w-4 h-4 ${textSub}`} />{" "}
                    {t("ai_training_data")}
                  </p>
                  <p className={`text-sm ${textSub}`}>
                    {t("ai_training_data_desc")}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setLocalSettings((s) => ({
                      ...s,
                      dataCollection: !s.dataCollection,
                    }))
                  }
                  className={`w-12 h-7 rounded-full transition-colors relative ${localSettings.dataCollection ? "" : switchBgOff}`}
                  style={getToggleStyle(localSettings.dataCollection)}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                      localSettings.dataCollection ? "left-6" : "left-1"
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </section>

          {/* Shop Settings */}
          <section className={`rounded-2xl p-6 border ${bgCard}`}>
            <div className={`flex items-center gap-3 mb-6 ${textTitle}`}>
              <ShoppingBag className="w-6 h-6" />
              <h3 className="text-xl font-bold">Shop Settings</h3>
            </div>

            <div className="space-y-6">
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {["Orders", "Payments", "Invoices"].map((tab: string) => (
                  <button
                    key={tab}
                    onClick={() => setActiveShopTab(tab)}
                    className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-colors border ${
                      themeStyle.isGold
                        ? "border-orange-500/20"
                        : "border-white/10"
                    } ${
                      activeShopTab === tab
                        ? "bg-orange-500 text-white border-transparent"
                        : isDark
                          ? "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                          : "bg-gray-100 text-gray-600 hover:text-black hover:bg-gray-200"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Payments Content */}
              {activeShopTab === "Payments" && (
                <div
                  className={`p-4 rounded-xl border ${
                    isDark
                      ? "bg-black/20 border-white/5"
                      : "bg-gray-50 border-gray-100"
                  } animate-in fade-in duration-300`}
                >
                  <h4
                    className={`text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${textTitle}`}
                  >
                    <CreditCard className="w-4 h-4" /> Payment Methods
                  </h4>

                  <div className="space-y-3">
                    {paymentMethods.length > 0 ? (
                      paymentMethods.map((pm: PaymentMethod) => (
                        <div
                          key={pm.id}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            isDark
                              ? "bg-neutral-800 border-neutral-700"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {pm.type === "CARD" ? (
                              <div className="w-10 h-6 bg-blue-500 rounded flex items-center justify-center text-[8px] text-white font-bold tracking-tighter">
                                VISA
                              </div>
                            ) : (
                              <div className="w-10 h-6 bg-green-500 rounded flex items-center justify-center text-[8px] text-white font-bold tracking-tighter">
                                UPI
                              </div>
                            )}
                            <div>
                              <p className={`text-sm font-bold ${textTitle}`}>
                                {pm.label}
                              </p>
                              {pm.expiry && (
                                <p className={`text-[10px] ${textSub}`}>
                                  Expires {pm.expiry}
                                </p>
                              )}
                              {pm.type === "UPI" && (
                                <p className={`text-[10px] ${textSub}`}>
                                  Verified
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              const updated = paymentMethods.filter(
                                (p: PaymentMethod) => p.id !== pm.id,
                              );
                              setPaymentMethods(updated);
                              localStorage.setItem(
                                "x10minds_saved_payments",
                                JSON.stringify(updated),
                              );
                            }}
                            className="text-red-500 hover:text-red-400 text-xs font-bold"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className={`text-sm ${textSub} text-center py-4`}>
                        No payment methods saved.
                      </p>
                    )}

                    {/* Add New Method Button */}
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className={`w-full py-3 border border-dashed rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                        isDark
                          ? "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
                          : "border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-800"
                      }`}
                    >
                      <Plus className="w-4 h-4" /> Add Payment Method
                    </button>
                  </div>
                </div>
              )}

              {/* Orders Content */}
              {activeShopTab === "Orders" && (
                <div
                  className={`p-4 rounded-xl border ${
                    isDark
                      ? "bg-black/20 border-white/5"
                      : "bg-gray-50 border-gray-100"
                  } animate-in fade-in duration-300`}
                >
                  <h4
                    className={`text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${textTitle}`}
                  >
                    <Package className="w-4 h-4" /> Recent Orders
                  </h4>

                  <div className="space-y-3">
                    {shopOrders.length > 0 ? (
                      shopOrders.map((o: Order) => (
                        <div
                          key={o.id}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            isDark
                              ? "bg-neutral-800 border-neutral-700"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                isDark
                                  ? "bg-white/10 text-white"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              <Truck className="w-4 h-4" />
                            </div>
                            <div>
                              <p className={`text-sm font-bold ${textTitle}`}>
                                Order #{o.id}
                              </p>
                              <p className={`text-[10px] ${textSub}`}>
                                {o.status} • {o.items} items • {o.date}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="block text-sm font-bold text-green-500">
                              ${o.total}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <ShoppingBag
                          className={`w-8 h-8 mx-auto mb-2 opacity-50 ${textSub}`}
                        />
                        <p className={`text-sm ${textSub}`}>
                          No existing orders found.
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => onNavigate(AppMode.SHOP)}
                      className={`w-full text-center py-2 text-[10px] font-black uppercase tracking-[0.2em] ${textSub} hover:text-[#FFD700] transition-colors`}
                    >
                      View All Orders (Go to Shop)
                    </button>
                  </div>
                </div>
              )}

              {/* Invoices Content */}
              {activeShopTab === "Invoices" && (
                <div
                  className={`p-4 rounded-xl border ${
                    isDark
                      ? "bg-black/20 border-white/5"
                      : "bg-gray-50 border-gray-100"
                  } animate-in fade-in duration-300`}
                >
                  <h4
                    className={`text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${textTitle}`}
                  >
                    <FileText className="w-4 h-4" /> Invoices
                  </h4>

                  <div className="space-y-3">
                    {shopOrders.filter((o: any) => o.status === "Delivered")
                      .length > 0 ? (
                      shopOrders
                        .filter((o: any) => o.status === "Delivered")
                        .map((o: any) => (
                          <div
                            key={o.id}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              isDark
                                ? "bg-neutral-800 border-neutral-700"
                                : "bg-white border-gray-200"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  isDark
                                    ? "bg-white/10 text-white"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                <Receipt className="w-4 h-4" />
                              </div>
                              <div>
                                <p className={`text-sm font-bold ${textTitle}`}>
                                  Invoice #INV-{o.id}
                                </p>
                                <p className={`text-[10px] ${textSub}`}>
                                  {o.date} • Paid
                                </p>
                              </div>
                            </div>
                            <button className="text-[10px] font-black uppercase tracking-widest text-[#FFD700] hover:brightness-110 flex items-center gap-2">
                              <FileText size={12} /> Download PDF
                            </button>
                          </div>
                        ))
                    ) : (
                      <p className={`text-sm ${textSub} text-center py-4`}>
                        No invoices available.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Add Payment Modal */}
            {showPaymentModal && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                <div
                  className={`max-w-md w-full rounded-3xl p-6 border ${
                    isDark
                      ? "bg-neutral-900 border-neutral-800"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <h3 className={`text-xl font-bold mb-4 ${textTitle}`}>
                    Add Payment Method
                  </h3>

                  <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl border border-white/10">
                    <button
                      onClick={() => setNewPaymentType("CARD")}
                      className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                        newPaymentType === "CARD"
                          ? "bg-white text-black shadow-sm"
                          : "text-neutral-500 hover:text-white"
                      }`}
                    >
                      Credit Card
                    </button>
                    <button
                      onClick={() => setNewPaymentType("UPI")}
                      className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                        newPaymentType === "UPI"
                          ? "bg-white text-black shadow-sm"
                          : "text-neutral-500 hover:text-white"
                      }`}
                    >
                      UPI
                    </button>
                  </div>

                  {newPaymentType === "CARD" ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Card Number (Valid 16-digit)"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className={`w-full p-3 rounded-xl border ${inputBg}`}
                      />
                      <div className="flex gap-4">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className={`flex-1 p-3 rounded-xl border ${inputBg}`}
                        />
                        <input
                          type="text"
                          placeholder="CVC"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className={`w-24 p-3 rounded-xl border ${inputBg}`}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="UPI ID (e.g. name@bank)"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className={`w-full p-3 rounded-xl border ${inputBg}`}
                      />
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowPaymentModal(false)}
                      className={`flex-1 py-3 rounded-xl font-bold ${
                        isDark ? "bg-neutral-800 text-white" : "bg-gray-100"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        // Simple Mock Validation
                        if (newPaymentType === "CARD") {
                          if (!cardNumber || !cardExpiry) {
                            notify("Please fill in card details", "error");
                            return;
                          }
                        } else {
                          if (!upiId.includes("@")) {
                            notify("Invalid UPI ID", "error");
                            return;
                          }
                        }

                        const newItem = {
                          id: Date.now().toString(),
                          type: newPaymentType,
                          label:
                            newPaymentType === "CARD"
                              ? `•••• •••• •••• ${
                                  cardNumber.slice(-4) || "0000"
                                }`
                              : upiId,
                          expiry:
                            newPaymentType === "CARD" ? cardExpiry : undefined,
                        } as PaymentMethod;

                        const updated = [...paymentMethods, newItem];
                        setPaymentMethods(updated);
                        localStorage.setItem(
                          "x10minds_saved_payments",
                          JSON.stringify(updated),
                        );
                        notify("Payment method added!", "success");

                        // Reset
                        setCardNumber("");
                        setCardExpiry("");
                        setCardCvc("");
                        setUpiId("");
                        setShowPaymentModal(false);
                      }}
                      className="flex-1 py-3 text-black rounded-xl font-black uppercase tracking-widest text-[11px] hover:brightness-110 active:scale-95 transition-all shadow-lg"
                      style={{
                        backgroundColor: themeStyle.main,
                        color: themeStyle.isGold ? "black" : "white",
                      }}
                    >
                      Save Method
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Currency Settings */}
            <div
              className="mt-8 pt-8 border-t"
              style={{
                borderColor: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.05)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <DollarSign
                  className="w-5 h-5"
                  style={{ color: themeStyle.main }}
                />
                <h4 className={`text-lg font-bold ${textTitle}`}>
                  Currency Preference
                </h4>
              </div>

              <p className={`mb-4 text-sm ${textSub}`}>
                Choose your preferred currency for the shop. All product prices
                will be automatically converted.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {[
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
                ].map((curr) => {
                  const isSelected = localSettings.shopCurrency === curr.code;
                  return (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setLocalSettings((prev) => ({
                          ...prev,
                          shopCurrency: curr.code,
                        }));
                        if (onDirtyChange) onDirtyChange(true);
                      }}
                      style={
                        isSelected
                          ? {
                              borderColor: themeStyle.main,
                              backgroundColor: `${themeStyle.main}1a`,
                            }
                          : {}
                      }
                      className={`p-3 rounded-xl border transition-all ${
                        isSelected
                          ? "border shadow-lg"
                          : isDark
                            ? "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10"
                            : "border-gray-100 bg-gray-50 hover:bg-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{curr.symbol}</span>
                        {isSelected && (
                          <CheckCircle
                            size={14}
                            style={{ color: themeStyle.main }}
                            className="ml-auto"
                          />
                        )}
                      </div>
                      <p
                        className={`text-xs font-black ${
                          isSelected
                            ? ""
                            : isDark
                              ? "text-white"
                              : "text-gray-900"
                        }`}
                        style={isSelected ? { color: themeStyle.main } : {}}
                      >
                        {curr.code}
                      </p>
                      <p
                        className={`text-[9px] font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        {curr.name}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div
                className={`mt-4 p-4 rounded-xl ${
                  isDark
                    ? "bg-white/5 border border-white/10"
                    : "bg-gray-50 border border-gray-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Globe
                    size={16}
                    style={{ color: themeStyle.main }}
                    className="mt-0.5"
                  />
                  <div>
                    <p className={`text-xs font-bold mb-1 ${textTitle}`}>
                      Currency Conversion
                    </p>
                    <p className={`text-[11px] ${textSub}`}>
                      Prices are converted in real-time based on current
                      exchange rates. Your selected currency will be applied
                      throughout the shop.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Advanced Security */}
          <section className={`rounded-2xl p-6 border ${bgCard}`}>
            <div className={`flex items-center gap-3 mb-6 ${textTitle}`}>
              <ShieldCheck className="w-6 h-6" style={activeIconStyle} />
              <h3 className="text-xl font-bold">Advanced Security</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 border-b border-white/5">
                <div>
                  <p className={`font-bold ${textTitle}`}>
                    Concurrent Sessions
                  </p>
                  <p className="text-xs text-neutral-500">
                    Allow only one active session at a time
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateSetting("singleSession", !localSettings.singleSession)
                  }
                  className={`w-12 h-6 rounded-full relative transition-all duration-300 ${localSettings.singleSession ? "" : switchBgOff}`}
                  style={getToggleStyle(localSettings.singleSession || false)}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${localSettings.singleSession ? "right-1" : "left-1"}`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <p className={`font-bold ${textTitle}`}>Data Encryption</p>
                  <p className="text-xs text-neutral-500">
                    Enhanced client-side encryption for local data
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-500 border border-green-500/20">
                  <Lock className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black tracking-widest uppercase">
                    Active
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-blue-500 mb-1 uppercase tracking-widest">
                    Security Tip
                  </p>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Ensure your phone number is up to date for Multi-Factor
                    Authentication. We recommend rotating your password every 90
                    days for maximum safety.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Active Devices */}
          <section className={`rounded-2xl p-6 border ${bgCard}`}>
            <div className={`flex items-center gap-3 mb-6 ${textTitle}`}>
              <Globe className="w-6 h-6" style={activeIconStyle} />
              <h3 className="text-xl font-bold">Active Devices</h3>
            </div>

            <div className="space-y-4">
              <p className={`text-xs ${textSub} mb-4`}>
                You are allowed up to 3 active devices. Disconnect devices you
                no longer use to free up space for new ones.
              </p>

              {currentUser?.activeDevices?.map((device) => {
                const isCurrent =
                  device.deviceId ===
                  localStorage.getItem("x10minds_device_id");
                return (
                  <div
                    key={device.deviceId}
                    className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-100"} flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? "bg-white/5" : "bg-white shadow-sm"}`}
                      >
                        {device.userAgent.includes("Mobi") ? (
                          <Phone className="w-5 h-5 text-blue-500" />
                        ) : (
                          <Sun className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p
                          className={`text-sm font-bold ${textTitle} truncate max-w-[150px] sm:max-w-md`}
                        >
                          {device.userAgent.split(")")[0].split("(")[1] ||
                            "Unknown Device"}{" "}
                          {isCurrent && (
                            <span className="ml-2 text-[8px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 uppercase tracking-widest font-black">
                              Current
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-neutral-500">
                          Last active:{" "}
                          {new Date(device.lastActive).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {!isCurrent && (
                      <button
                        onClick={() => {
                          if (onUpdateUser && currentUser) {
                            const filtered = currentUser.activeDevices?.filter(
                              (d) => d.deviceId !== device.deviceId,
                            );
                            onUpdateUser({
                              ...currentUser,
                              activeDevices: filtered,
                            });
                            notify(
                              "Device disconnected successfully",
                              "success",
                            );
                          }
                        }}
                        className="p-2.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}

              {!currentUser?.activeDevices?.length && (
                <p className={`text-center py-4 text-xs ${textSub}`}>
                  No active devices tracked yet.
                </p>
              )}
            </div>
          </section>

          {/* Data Management */}
          <section className={`rounded-2xl p-6 border ${bgCard}`}>
            <div className={`flex items-center gap-3 mb-6 ${textTitle}`}>
              <Brain className="w-6 h-6" />
              <h3 className="text-xl font-bold">
                {t("data_management") || "Data Management"}
              </h3>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <p className={`font-bold ${textTitle}`}>
                    {t("export_data") || "Export Account Data"}
                  </p>
                  <p className={`text-sm ${textSub}`}>
                    {t("export_data_desc") ||
                      "Download a backup of all your history, scores, and settings in JSON format."}
                  </p>
                </div>
                <button
                  onClick={handleExportData}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${radioInactive} font-bold`}
                >
                  <FileText className="w-4 h-4" />
                  {t("export") || "Export JSON"}
                </button>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t pt-6 border-neutral-800">
                <div>
                  <p className={`font-bold text-red-500`}>
                    {t("reset_app") || "Reset Application"}
                  </p>
                  <p className={`text-sm ${textSub}`}>
                    {t("reset_app_desc") ||
                      "Clears local cache and logs you out. Use this if you experience performance issues."}
                  </p>
                </div>
                <button
                  onClick={handleResetApp}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-red-500/20 hover:bg-red-500/10 text-red-500 font-bold transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  {t("reset") || "Reset Cache"}
                </button>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section
            className={`rounded-2xl p-6 border ${
              isDark
                ? "border-red-900/30 bg-red-900/5"
                : "border-red-100 bg-red-50"
            }`}
          >
            <div className={`flex items-center gap-3 mb-6 text-red-500`}>
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-xl font-bold">{t("danger_zone")}</h3>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <p className={`font-bold ${textTitle}`}>
                  {t("delete_account")}
                </p>
                <p className={`text-sm ${textSub}`}>
                  {t("delete_account_desc")}
                </p>
              </div>
              <button
                onClick={onDeleteAccount}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-lg shadow-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
                {t("delete_account")}
              </button>
            </div>
          </section>

          <button
            onClick={handleSave}
            className={`w-full py-4 font-black uppercase tracking-[0.2em] text-[11px] rounded-xl transition-all flex items-center justify-center gap-2 ${
              saved
                ? "bg-green-600 text-white"
                : isDark
                  ? themeStyle.isGold
                    ? "bg-[#FFD700] text-black hover:brightness-110"
                    : "text-white hover:brightness-110 shadow-lg"
                  : "bg-black text-white hover:bg-neutral-800"
            }`}
            style={
              !saved && isDark && !themeStyle.isGold
                ? {
                    backgroundColor: themeStyle.main,
                    boxShadow: `0 10px 30px -5px ${themeStyle.main}4d`,
                  }
                : {}
            }
          >
            {saved ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saved ? t("settings_saved") : t("save_changes")}
          </button>
        </div>
      </div>
      {/* Custom Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150] flex items-center justify-center p-4">
          <div
            className={`max-w-md w-full rounded-3xl p-8 border shadow-2xl animate-in zoom-in-95 duration-200 ${
              isDark
                ? "bg-neutral-900 border-neutral-800"
                : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 mx-auto`}
            >
              <RotateCcw className="w-8 h-8 text-orange-500" />
            </div>

            <h3 className={`text-2xl font-bold mb-4 text-center ${textTitle}`}>
              {t("reset_app_confirm") || "Reset Application?"}
            </h3>

            <p className={`text-center mb-8 ${textSub}`}>
              {t("reset_app_warning") ||
                "This will clear all locally saved data. Your Firebase account will NOT be deleted. Proceed?"}
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={executeReset}
                className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-900/20"
              >
                {t("yes_reset") || "Yes, Reset Everything"}
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  isDark
                    ? "bg-neutral-800 text-white hover:bg-neutral-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {t("cancel") || "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
