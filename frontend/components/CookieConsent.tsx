import { useState, useEffect } from "react";
import {
  X,
  Cookie,
  Shield,
  BarChart2,
  Target,
  Settings,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface CookiePreferences {
  necessary: boolean; // Always true, required
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentProps {
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onSavePreferences: (preferences: CookiePreferences) => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({
  onAcceptAll,
  onRejectAll,
  onSavePreferences,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: false,
  });
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem("cookieConsent");
    if (!cookieChoice) {
      // Small delay for smooth animation
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    localStorage.setItem("cookieConsent", JSON.stringify(allAccepted));
    localStorage.setItem("cookieConsentDate", new Date().toISOString());
    onAcceptAll();
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    localStorage.setItem("cookieConsent", JSON.stringify(onlyNecessary));
    localStorage.setItem("cookieConsentDate", new Date().toISOString());
    onRejectAll();
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(preferences));
    localStorage.setItem("cookieConsentDate", new Date().toISOString());
    onSavePreferences(preferences);
    setIsVisible(false);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === "necessary") return; // Can't disable necessary cookies
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const cookieCategories = [
    {
      id: "necessary",
      name: "Strictly Necessary",
      icon: Shield,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      description:
        "These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and account access.",
      required: true,
      cookies: [
        {
          name: "__session",
          purpose: "User authentication",
          duration: "Session",
        },
        {
          name: "csrf_token",
          purpose: "Security protection",
          duration: "Session",
        },
      ],
    },
    {
      id: "functional",
      name: "Functional Cookies",
      icon: Settings,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      description:
        "These cookies enable enhanced functionality and personalization, such as remembering your preferences, language settings, and theme choices.",
      required: false,
      cookies: [
        {
          name: "preferences",
          purpose: "Store user preferences",
          duration: "1 year",
        },
        {
          name: "language",
          purpose: "Remember language settings",
          duration: "1 year",
        },
        {
          name: "theme",
          purpose: "Remember theme preference",
          duration: "1 year",
        },
      ],
    },
    {
      id: "analytics",
      name: "Analytics & Performance",
      icon: BarChart2,
      color: "text-[#FFD700]",
      bgColor: "bg-[#FFD700]/10",
      description:
        "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our services.",
      required: false,
      cookies: [
        {
          name: "_ga",
          purpose: "Google Analytics tracking",
          duration: "2 years",
        },
        { name: "_gid", purpose: "User identification", duration: "24 hours" },
        {
          name: "performance_data",
          purpose: "Page load analytics",
          duration: "30 days",
        },
      ],
    },
    {
      id: "marketing",
      name: "Marketing & Advertising",
      icon: Target,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      description:
        "These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.",
      required: false,
      cookies: [
        { name: "fbp", purpose: "Facebook advertising", duration: "3 months" },
        {
          name: "ads_prefs",
          purpose: "Ad personalization",
          duration: "1 year",
        },
      ],
    },
  ];

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] transition-opacity duration-300"
        onClick={() => {}}
      />

      {/* Cookie Banner */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[9999] transition-all duration-500 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <div className="bg-neutral-900/95 backdrop-blur-xl border-t border-white/10 shadow-2xl shadow-black/50">
          {!showManage ? (
            /* Simple Cookie Banner */
            <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-2.5 bg-[#FFD700]/10 rounded-xl flex-shrink-0">
                  <Cookie className="w-6 h-6 text-[#FFD700]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-white font-bold text-lg">
                    We use cookies
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl">
                    We use cookies to help this site function, understand
                    service usage, and support marketing efforts. Visit{" "}
                    <button
                      onClick={() => setShowManage(true)}
                      className="text-[#FFD700] hover:text-[#FDB931] underline underline-offset-2 font-medium transition-colors"
                    >
                      Manage Cookies
                    </button>{" "}
                    to change preferences anytime. View our{" "}
                    <a
                      href="#"
                      className="text-[#FFD700] hover:text-[#FDB931] underline underline-offset-2 font-medium transition-colors"
                    >
                      Cookie Policy
                    </a>{" "}
                    for more info.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto">
                <button
                  onClick={() => setShowManage(true)}
                  className="flex-1 md:flex-none px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold rounded-lg border border-white/10 transition-all hover:scale-105 active:scale-95"
                >
                  Manage Cookies
                </button>
                <button
                  onClick={handleRejectAll}
                  className="flex-1 md:flex-none px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold rounded-lg border border-white/10 transition-all hover:scale-105 active:scale-95"
                >
                  Reject non-essential
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 md:flex-none px-5 py-2.5 bg-white hover:bg-neutral-200 text-black text-sm font-bold rounded-lg transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                  Accept all
                </button>
              </div>
            </div>
          ) : (
            /* Advanced Cookie Management Panel */
            <div className="max-w-4xl mx-auto px-4 py-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#FFD700]/10 rounded-xl">
                    <Cookie className="w-6 h-6 text-[#FFD700]" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-xl">
                      Cookie Preferences
                    </h2>
                    <p className="text-neutral-500 text-sm">
                      Customize your cookie settings
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowManage(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cookie Categories */}
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {cookieCategories.map((category) => {
                  const Icon = category.icon;
                  const isExpanded = expandedCategory === category.id;
                  const isEnabled =
                    preferences[category.id as keyof CookiePreferences];

                  return (
                    <div
                      key={category.id}
                      className="bg-neutral-800/50 border border-white/5 rounded-xl overflow-hidden transition-all hover:border-white/10"
                    >
                      <div className="p-4 flex items-center justify-between">
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="flex items-center gap-3 flex-1 text-left"
                        >
                          <div className={`p-2 ${category.bgColor} rounded-lg`}>
                            <Icon className={`w-5 h-5 ${category.color}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-semibold">
                                {category.name}
                              </span>
                              {category.required && (
                                <span className="text-[10px] px-2 py-0.5 bg-green-500/20 text-green-500 rounded-full font-bold uppercase tracking-wider">
                                  Required
                                </span>
                              )}
                            </div>
                            <p className="text-neutral-500 text-xs mt-0.5 line-clamp-1">
                              {category.description}
                            </p>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-neutral-500 ml-2" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-neutral-500 ml-2" />
                          )}
                        </button>

                        {/* Toggle Switch */}
                        <button
                          onClick={() =>
                            togglePreference(
                              category.id as keyof CookiePreferences,
                            )
                          }
                          disabled={category.required}
                          className={`relative w-14 h-7 rounded-full transition-all duration-300 flex-shrink-0 ml-4 ${
                            category.required
                              ? "bg-green-500/30 cursor-not-allowed"
                              : isEnabled
                                ? "bg-[#FFD700]"
                                : "bg-neutral-700"
                          }`}
                        >
                          <div
                            className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
                              isEnabled || category.required
                                ? "left-8"
                                : "left-1"
                            }`}
                          >
                            {(isEnabled || category.required) && (
                              <Check
                                className={`w-3 h-3 ${isEnabled && !category.required ? "text-black" : "text-green-600"}`}
                              />
                            )}
                          </div>
                        </button>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-0 border-t border-white/5 mt-2">
                          <p className="text-neutral-400 text-sm mb-4">
                            {category.description}
                          </p>
                          <div className="space-y-2">
                            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                              Cookies in this category:
                            </div>
                            {category.cookies.map((cookie, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between py-2 px-3 bg-neutral-900/50 rounded-lg text-sm"
                              >
                                <div>
                                  <span className="text-white font-mono text-xs">
                                    {cookie.name}
                                  </span>
                                  <span className="text-neutral-500 ml-2">
                                    — {cookie.purpose}
                                  </span>
                                </div>
                                <span className="text-neutral-600 text-xs">
                                  {cookie.duration}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                <button
                  onClick={() => setShowManage(false)}
                  className="text-neutral-400 hover:text-white text-sm font-medium transition-colors"
                >
                  ← Back to simple view
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={handleRejectAll}
                    className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold rounded-lg border border-white/10 transition-all"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="px-6 py-2.5 bg-[#FFD700] text-black text-sm font-black uppercase tracking-widest rounded-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#FFD700]/10"
                  >
                    Save Selection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>
    </>
  );
};

export default CookieConsent;
