import React, { useState, useRef } from "react";
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
  Type,
  Keyboard,
  Camera,
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
}) => {
  const [localSettings, setLocalSettings] =
    useState<AppSettings>(currentSettings);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    currentUser?.avatarUrl
  );
  const [saved, setSaved] = useState(false);

  // MFA State
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [mfaStep, setMfaStep] = useState<"PHONE" | "CODE">("PHONE");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [isMfaLoading, setIsMfaLoading] = useState(false);
  const recaptchaVerifierRef = useRef<any>(null);
  const [recaptchaKey, setRecaptchaKey] = useState(0);
  const [emailError, setEmailError] = useState(false);
  const mfaAttemptRef = useRef(0);

  // Re-auth State for sensitive ops
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [reauthPassword, setReauthPassword] = useState("");
  const [pendingMfaAction, setPendingMfaAction] = useState<
    "ENABLE" | "DISABLE" | null
  >(null);

  const t = (key: string) => {
    return getTranslation(localSettings.language || "English", key);
  };

  const handleSendMfaCode = async (phoneToVerify?: string) => {
    const targetPhone = phoneToVerify || phoneNumber;
    if (!targetPhone) return;

    mfaAttemptRef.current++;
    console.log(`MFA Send Attempt #${mfaAttemptRef.current} for:`, targetPhone);

    setIsMfaLoading(true);
    try {
      setEmailError(false);

      // Clean up previous verifier index
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (e) {}
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
          "error"
        );
        setIsMfaLoading(false);
        return;
      }

      const cleanedPhone = "+" + targetPhone.replace(/\D/g, "");
      const id = await startMfaEnrollment(
        cleanedPhone,
        recaptchaVerifierRef.current
      );

      console.log("MFA started for:", cleanedPhone, "ID:", id);
      setVerificationId(id);
      setMfaStep("CODE");
      notify(
        t("verification_code_sent") || "Verification code sent!",
        "success"
      );
    } catch (e: any) {
      console.error("MFA Error Details:", e);

      if (e.code === "auth/requires-recent-login") {
        if (mfaAttemptRef.current > 1) {
          notify(
            "Security session is still stale. Please Log Out and Log In again to refresh your account strictly.",
            "warning"
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
          "error"
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
    ? "bg-black border-neutral-800 text-white focus:border-white/20"
    : "bg-gray-50 border-gray-200 text-gray-900 focus:border-gray-400";
  const switchBgOff = isDark ? "bg-neutral-700" : "bg-gray-300";
  const radioActive = isDark
    ? "border-white bg-white/10"
    : "border-gray-900 bg-gray-100";
  const radioInactive = isDark
    ? "border-neutral-800 bg-black hover:border-neutral-600"
    : "border-gray-200 bg-white hover:border-gray-300";

  const handleSave = () => {
    onUpdateSettings(localSettings);
    if (currentUser && onUpdateUser && avatarUrl !== currentUser.avatarUrl) {
      onUpdateUser({ ...currentUser, avatarUrl });
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onSave();
    }, 800);
  };

  const getAccentClass = (color: string) => {
    switch (color) {
      case "orange":
        return "bg-orange-600";
      case "blue":
        return "bg-blue-600";
      case "green":
        return "bg-green-600";
      case "purple":
        return "bg-purple-600";
      default:
        return "bg-orange-600";
    }
  };

  const activeAccent = localSettings.accentColor || "orange";
  const activeIconColor =
    activeAccent === "blue"
      ? "text-blue-500"
      : activeAccent === "green"
      ? "text-green-500"
      : activeAccent === "purple"
      ? "text-purple-500"
      : "text-orange-500";

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
                className={`flex items-center gap-3 mb-6 ${activeIconColor}`}
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
                      className={`w-24 h-24 rounded-[2rem] flex items-center justify-center overflow-hidden border-2 transition-all duration-300 group-hover/avatar:scale-105 group-hover/avatar:shadow-[0_0_20px_rgba(249,115,22,0.3)] ${
                        isDark
                          ? "bg-neutral-800 border-neutral-700 group-hover/avatar:border-orange-500/50"
                          : "bg-gray-100 border-gray-200 shadow-sm group-hover/avatar:border-orange-500/30"
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
                            if (file.size > 5 * 1024 * 1024) {
                              alert(
                                "File too large. Please select an image under 5MB."
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
                                  0.7
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
                    <p className={`text-xs mb-3 font-medium ${textSub}`}>
                      Recommended: Square JPG or PNG, max 5MB.
                    </p>
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
                    onChange={(e) =>
                      setLocalSettings((s) => ({
                        ...s,
                        nickname: e.target.value,
                      }))
                    }
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
                  {["Professional", "Casual", "Strict", "Funny"].map((p) => (
                    <label
                      key={p}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                        localSettings.aiPersonality === p
                          ? radioActive
                          : radioInactive
                      }`}
                    >
                      <span className={`font-bold text-sm ${textTitle}`}>
                        {t(p.toLowerCase()) || p}
                      </span>
                      <input
                        type="radio"
                        name="personality"
                        checked={localSettings.aiPersonality === p}
                        onChange={() =>
                          setLocalSettings((s) => ({
                            ...s,
                            aiPersonality: p as any,
                          }))
                        }
                        className="w-4 h-4 accent-current"
                      />
                    </label>
                  ))}
                </div>

                <div className="mt-4">
                  <label className={`block text-sm mb-2 ${textSub}`}>
                    {t("custom_instructions") || "Custom AI Instructions"}
                  </label>
                  <textarea
                    value={localSettings.aiInstructions || ""}
                    onChange={(e) =>
                      setLocalSettings((s) => ({
                        ...s,
                        aiInstructions: e.target.value,
                      }))
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
                    onClick={() =>
                      setLocalSettings((s) => ({ ...s, theme: "light" }))
                    }
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all duration-300 ${
                      !isDark
                        ? "bg-white text-black shadow-md scale-[1.02]"
                        : "text-neutral-500 hover:text-white"
                    }`}
                  >
                    <Sun className="w-5 h-5" /> {t("light")}
                  </button>
                  <button
                    onClick={() =>
                      setLocalSettings((s) => ({ ...s, theme: "dark" }))
                    }
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
                  {["orange", "blue", "green", "purple"].map((color) => (
                    <button
                      key={color}
                      onClick={() =>
                        setLocalSettings((s) => ({
                          ...s,
                          accentColor: color as any,
                        }))
                      }
                      className={`w-12 h-12 rounded-full border-2 transition-transform hover:scale-110 ${
                        localSettings.accentColor === color
                          ? `border-current scale-110 ${textTitle}`
                          : "border-transparent"
                      }`}
                      style={{
                        backgroundColor:
                          color === "orange"
                            ? "#ea580c"
                            : color === "blue"
                            ? "#2563eb"
                            : color === "green"
                            ? "#16a34a"
                            : "#9333ea",
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
                      onClick={() =>
                        setLocalSettings((s) => ({ ...s, fontSize: size }))
                      }
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
                  ].map((lang) => (
                    <button
                      key={lang}
                      onClick={() =>
                        setLocalSettings((s) => ({ ...s, language: lang }))
                      }
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                        localSettings.language === lang
                          ? radioActive
                          : radioInactive
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5 opacity-60" />
                      {lang}
                    </button>
                  ))}
                </div>
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
                          "Are you sure you want to disable Two-Factor Authentication?"
                        )
                      ) {
                        setIsMfaLoading(true);
                        try {
                          await unenrollMfa();
                          setLocalSettings((s) => ({
                            ...s,
                            twoFactorAuth: false,
                          }));
                          notify(
                            "Two-Factor Authentication Disabled.",
                            "success"
                          );
                        } catch (err) {
                          console.error("Firebase unenroll failure:", err);
                          // Force reset anyway for user convenience
                          setLocalSettings((s) => ({
                            ...s,
                            twoFactorAuth: false,
                          }));
                          notify("MFA Reset locally (out of sync).", "warning");
                        } finally {
                          setIsMfaLoading(false);
                        }
                      }
                    }
                  }}
                  className={`w-12 h-7 rounded-full transition-colors relative ${
                    localSettings.twoFactorAuth
                      ? getAccentClass(activeAccent)
                      : switchBgOff
                  }`}
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
                                    "success"
                                  );
                                } catch (e: any) {
                                  notify(
                                    "Failed to send email: " + e.message,
                                    "error"
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
                                    "success"
                                  );
                                } catch (e: any) {
                                  notify(
                                    "Failed to refresh: " + e.message,
                                    "error"
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
                                verificationCode
                              );
                              setLocalSettings((s) => ({
                                ...s,
                                twoFactorAuth: true,
                              }));
                              setShowMfaModal(false);
                              notify(
                                "Two-Factor Authentication Enabled!",
                                "success"
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
                                  err
                                );
                                notify(
                                  "MFA was out of sync, resetting your account security state now.",
                                  "warning"
                                );
                              }
                              setLocalSettings((s) => ({
                                ...s,
                                twoFactorAuth: false,
                              }));
                              notify(
                                "Two-Factor Authentication Disabled.",
                                "success"
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
                              "error"
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
                  className={`w-12 h-7 rounded-full transition-colors relative ${
                    localSettings.publicProfile
                      ? getAccentClass(activeAccent)
                      : switchBgOff
                  }`}
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
                  className={`w-12 h-7 rounded-full transition-colors relative ${
                    localSettings.dataCollection ? "bg-green-600" : switchBgOff
                  }`}
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

          {/* App Preferences */}
          <section className={`rounded-2xl p-6 border ${bgCard}`}>
            <div className={`flex items-center gap-3 mb-6 ${textTitle}`}>
              <SettingsIcon className="w-6 h-6" />
              <h3 className="text-xl font-bold">
                {t("app_preferences") || "App Preferences"}
              </h3>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className={`font-bold flex items-center gap-2 ${textTitle}`}>
                  <Keyboard className={`w-4 h-4 ${textSub}`} /> Keyboard
                  Shortcuts
                </p>
                <p className={`text-sm ${textSub}`}>
                  View global hotkeys for faster navigation
                </p>
              </div>
              <button
                onClick={() => onNavigate(AppMode.SHORTCUTS)}
                className="px-4 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 font-bold text-sm hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
              >
                View Shortcuts
              </button>
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
            className={`w-full py-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              saved
                ? "bg-green-600 text-white"
                : `${
                    isDark
                      ? "bg-white text-black hover:bg-neutral-200"
                      : "bg-black text-white hover:bg-neutral-800"
                  }`
            }`}
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
    </div>
  );
};

export default Settings;
