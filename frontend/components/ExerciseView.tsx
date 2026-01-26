import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Dumbbell,
  PlayCircle,
  Loader2,
  Zap,
  ChevronRight,
  Pause,
  RotateCcw,
  SkipBack,
  CheckCircle2,
  X,
  Maximize2,
  Minimize,
  Send,
  Sparkles,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  generateExercisePlan,
  streamGeminiResponse,
} from "../services/geminiService";
import { Exercise, UserProfile } from "../types";
import { translations } from "../i18n";
import { PREDEFINED_PLANS } from "../services/exercisePlans";

interface ExerciseViewProps {
  themeMode?: "dark" | "light";
  accentColor?: string;
  onSaveToHistory: (messages: any[]) => void;
  preloadedPlan?: Exercise[] | null;
  language?: string;
  userProfile?: UserProfile | null;
  onUpdateUser?: (u: UserProfile) => void;
}

// Lottie animation removed

const ExerciseAnimator = React.memo<{
  type: string;
  isDark: boolean;
  accentColor: string;
  accentText: string;
  isLoading?: boolean;
  imageUrl?: string;
}>(({ type, isDark, accentColor, accentText, isLoading, imageUrl }) => {
  const color =
    accentColor === "blue"
      ? "#3b82f6"
      : accentColor === "green"
        ? "#22c55e"
        : accentColor === "purple"
          ? "#a855f7"
          : accentColor === "red"
            ? "#ef4444"
            : accentColor === "pink"
              ? "#ec4899"
              : accentColor === "teal"
                ? "#14b8a6"
                : accentColor === "cyan"
                  ? "#06b6d4"
                  : accentColor === "indigo"
                    ? "#6366f1"
                    : "#FFD700";

  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      {/* Background Effects - Static */}
      <div
        className={`absolute inset-0 opacity-[0.1] ${
          isDark
            ? "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_1px,transparent_1px)]"
            : "bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.1)_1px,transparent_1px)]"
        } bg-[size:32px_32px]`}
      />

      {/* Subtle Breathing Glow */}
      <div
        className="absolute w-[150%] h-[150%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.1] pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          animation: "breathing-glow 6s ease-in-out infinite",
        }}
      />

      <div className="relative z-10 w-full max-w-[500px] h-full flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2
              className={`w-12 h-12 animate-spin ${isDark ? "text-white" : "text-black"}`}
            />
            <span className="text-xs font-black tracking-[0.3em] opacity-50 uppercase">
              Processing Intel...
            </span>
          </div>
        ) : imageUrl ? (
          <div className="relative w-full h-full flex items-center justify-center animate-in zoom-in-95 duration-500 p-4">
            <div className="relative w-full group rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src={imageUrl}
                alt="Exercise Demonstration"
                className="w-full h-auto object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <p className="text-white text-xs font-bold uppercase tracking-widest">
                  Targeting: {type}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex flex-col items-center justify-center opacity-40">
            {/* Archery Technical Heartbeat - Fallback instead of idling video */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border-2 border-dashed border-white/10 animate-spin"
                style={{ animationDuration: "30s" }}
              />
              <div
                className="absolute inset-4 rounded-full border border-white/5 animate-spin"
                style={{
                  animationDuration: "20s",
                  animationDirection: "reverse",
                }}
              />
              <Dumbbell className={`w-16 h-16 ${accentText} animate-pulse`} />

              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/20 backdrop-blur-xl border border-white/5 rounded-full">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80 text-white whitespace-nowrap">
                  {type === "IDLE" ? "System Ready" : "Form Analysis Active"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// Memoized List Item for Performance
const PlanListItem = React.memo<{
  ex: Exercise;
  idx: number;
  isActive: boolean;
  isDone: boolean;
  isDark: boolean;
  accentBg: string;
  headerText: string;
  t: (k: string) => string;
  onClick: (i: number) => void;
}>(
  ({ ex, idx, isActive, isDone, isDark, accentBg, headerText, t, onClick }) => (
    <button
      onClick={() => onClick(idx)}
      className={`w-full text-left p-4 rounded-xl flex items-center gap-4 transition-all border ${
        isActive
          ? `${accentBg} border-transparent text-white shadow-lg scale-[1.02] z-10`
          : isDone
            ? "opacity-40 border-transparent hover:opacity-60"
            : isDark
              ? "border-neutral-800 hover:border-neutral-700 text-neutral-400"
              : "border-gray-100 hover:border-gray-200 text-gray-400"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${
          isActive ? "bg-white/20" : "bg-black/20"
        }`}
      >
        {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`font-black text-sm truncate uppercase tracking-tight ${
            isActive ? "text-white" : headerText
          }`}
        >
          {ex.name}
        </p>
        <p className="text-[10px] font-bold uppercase opacity-60">
          {ex.sets} {t("sets_label")} •{" "}
          {ex.duration && ex.duration > 0 ? `${ex.duration}s` : ex.reps}
        </p>
      </div>
    </button>
  ),
);

const ExerciseView: React.FC<ExerciseViewProps> = React.memo(
  ({
    themeMode = "dark",
    accentColor = "orange",
    onSaveToHistory,
    preloadedPlan,
    language = "English",
    userProfile,
    onUpdateUser,
  }) => {
    const [bodyPart, setBodyPart] = useState("Core");
    const [level, setLevel] = useState("Intermediate");
    const [plan, setPlan] = useState<Exercise[] | null>(preloadedPlan ?? null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDescExpanded, setIsDescExpanded] = useState(false);

    // AI Advisor Chat State
    const [chatInput, setChatInput] = useState("");
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const EXERCISE_SUGGESTIONS = [
      "How to do this exercise perfectly?",
      "What muscle groups does this target?",
      "Show me a YouTube video of this.",
      "Give me a tip for better form.",
      "How can I make this harder?",
      "What are the common mistakes for this?",
      "I feel pain in my shoulder, what should I do?",
    ];

    const t = (key: string) => {
      return (
        translations[language]?.[key] || translations["English"][key] || key
      );
    };

    useEffect(() => {
      if (preloadedPlan) {
        setPlan(preloadedPlan);
      }
    }, [preloadedPlan]);

    // Workout Player State
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [timer, setTimer] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const isDark = themeMode === "dark";
    const bgClass = isDark ? "bg-neutral-950" : "bg-gray-50";
    const cardClass = isDark
      ? "bg-neutral-900 border-neutral-800"
      : "bg-white border-gray-200 shadow-md";
    const headerText = isDark ? "text-white" : "text-gray-900";
    const subText = isDark ? "text-neutral-400" : "text-gray-500";

    const accentClasses: Record<string, string> = {
      orange: "text-[#FFD700]",
      blue: "text-blue-500",
      green: "text-green-500",
      purple: "text-purple-500",
      red: "text-red-500",
      pink: "text-pink-500",
      teal: "text-teal-500",
      cyan: "text-cyan-500",
      indigo: "text-indigo-500",
    };
    const accentText = accentClasses[accentColor] || "text-[#FFD700]";
    const accentBg =
      accentColor === "blue"
        ? "bg-blue-600"
        : accentColor === "green"
          ? "bg-green-600"
          : accentColor === "purple"
            ? "bg-purple-600"
            : accentColor === "red"
              ? "bg-red-600"
              : accentColor === "pink"
                ? "bg-pink-600"
                : accentColor === "teal"
                  ? "bg-teal-600"
                  : accentColor === "cyan"
                    ? "bg-cyan-600"
                    : accentColor === "indigo"
                      ? "bg-indigo-600"
                      : "bg-[#FFD700]";

    const handleGenerate = async () => {
      setIsLoading(true);
      setPlan(null);

      // Secret Level Improvement: If user has completed sessions, boost difficulty secretly
      const completedSessions = userProfile?.completedSessions || 0;
      let effectiveLevel = level;
      if (completedSessions > 10 && level === "Beginner")
        effectiveLevel = "Intermediate";
      if (completedSessions > 30 && level === "Intermediate")
        effectiveLevel = "Advanced";
      if (completedSessions > 60) effectiveLevel = "Advanced++"; // Secret elite level

      try {
        const result = await generateExercisePlan(bodyPart, effectiveLevel);
        const parsed = JSON.parse(result);
        if (Array.isArray(parsed)) {
          setPlan(parsed);

          // Save to history
          const date = new Date().toLocaleDateString();
          const planText =
            `**SPT Plan Generated: ${bodyPart} (${level}) - ${date}**\n\n` +
            parsed
              .map(
                (e: Exercise, i: number) =>
                  `${i + 1}. **${e.name}**\n   - ${e.sets} sets x ${
                    e.reps && e.reps !== "0" ? e.reps : (e.duration ?? 0) + "s"
                  }\n   - ${e.description}`,
              )
              .join("\n\n");

          const userMsg = {
            id: Date.now().toString(),
            role: "user" as const,
            content: `Generate a ${level} level SPT plan for ${bodyPart}.`,
            timestamp: Date.now(),
          };
          const aiMsg = {
            id: (Date.now() + 1).toString(),
            role: "model" as const,
            content:
              planText +
              `\n\n<details><summary>System Data</summary>\n\n\`\`\`json\n${JSON.stringify(
                parsed,
              )}\n\`\`\`\n</details>\n\n[OPEN_SPT_PLAN]${JSON.stringify(
                parsed,
              )}[/OPEN_SPT_PLAN]`,
            timestamp: Date.now(),
          };
          onSaveToHistory([userMsg, aiMsg]);
        } else {
          setPlan([]); // Handle error or bad format
        }
      } catch (error) {
        console.error(error);
        setPlan([]);
      } finally {
        setIsLoading(false);
      }
    };

    const startWorkout = () => {
      if (!plan || plan.length === 0) return;
      setIsFinished(false);
      setIsPlaying(true);
      setCurrentStep(0);
      startStep(0);
    };

    const startStep = (index: number) => {
      if (!plan || index >= plan.length) {
        setIsPlaying(false);
        setIsFinished(true);
        return;
      }
      const step = plan[index];
      setTimer(step.duration || 60); // Default 60s if rep based for timer display purpose
      setIsPaused(false);
    };

    useEffect(() => {
      if (isPlaying && !isPaused && timer > 0) {
        timerRef.current = setTimeout(() => {
          setTimer((t) => t - 1);
        }, 1000);
      } else if (
        timer === 0 &&
        isPlaying &&
        !isPaused &&
        plan &&
        (plan[currentStep]?.duration ?? 0) > 0
      ) {
        // Auto advance for duration-based exercises if not last step
        if (currentStep < plan.length - 1) {
          handleNext();
        } else {
          setIsPlaying(false);
          setIsFinished(true);
        }
      }
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, [timer, isPlaying, isPaused]);

    const handleNext = () => {
      if (!plan) return;
      if (currentStep < plan.length - 1) {
        const nextIdx = currentStep + 1;
        setCurrentStep(nextIdx);
        startStep(nextIdx);
      } else {
        setIsPlaying(false);
        setIsFinished(true);

        // Mark session as complete
        if (userProfile && onUpdateUser) {
          const currentSessions = userProfile.completedSessions || 0;
          onUpdateUser({
            ...userProfile,
            completedSessions: currentSessions + 1,
          });
        }
      }
    };

    const handleChatSubmit = async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!chatInput.trim() || !plan) return;

      const currentEx = plan[currentStep] || plan[0];
      const userMsg = {
        role: "user",
        content: chatInput,
        timestamp: Date.now(),
      };
      setChatMessages((prev) => [...prev, userMsg]);
      setChatInput("");
      setSuggestions([]);
      setIsChatLoading(true);

      try {
        const prompt = `Assistant for Archery Exercise. 
            Current Exercise: ${currentEx.name}
            Description: ${currentEx.description}
            User Question: ${userMsg.content}
            
            Instruction: Provide clear form advice, mention muscles, and if possible provide a YouTube link or image description. 
            Keep it brief and coaching-focused. Use markdown.`;

        const result = await streamGeminiResponse(
          [],
          prompt,
          undefined,
          userProfile?.fullName,
          userProfile?.subscriptionTier,
          true,
        );
        let fullText = "";
        for await (const chunk of result) {
          fullText += chunk.text || "";
          setChatMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last && last.role === "model") {
              return [...prev.slice(0, -1), { ...last, content: fullText }];
            }
            return [
              ...prev,
              { role: "model", content: fullText, timestamp: Date.now() },
            ];
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsChatLoading(false);
      }
    };

    const onChatInputChange = (val: string) => {
      setChatInput(val);
      if (val.trim()) {
        const filtered = EXERCISE_SUGGESTIONS.filter((s) =>
          s.toLowerCase().includes(val.toLowerCase()),
        );
        setSuggestions(filtered.slice(0, 4));
      } else {
        setSuggestions([]);
      }
    };

    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    // Render Setup View
    if (!isPlaying) {
      return (
        <div className={`p-6 md:p-8 max-w-[2000px] mx-auto ${bgClass}`}>
          {/* AI Advisor at the top */}
          <div
            className={`mb-12 rounded-[40px] overflow-hidden border border-neutral-800 shadow-2xl relative group ${isDark ? "bg-neutral-900/40" : "bg-white"}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-blue-500/5 opacity-50"></div>
            <div className="relative p-6 md:p-10">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-1/3">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`p-3 rounded-2xl ${accentBg} text-white shadow-xl`}
                    >
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h3
                        className={`text-xl font-black tracking-tight ${headerText}`}
                      >
                        AI CO-COACH
                      </h3>
                      <p
                        className={`text-[10px] font-bold uppercase tracking-[0.3em] ${subText}`}
                      >
                        Neural Link Active
                      </p>
                    </div>
                  </div>
                  <p className={`text-sm ${subText} leading-relaxed mb-6`}>
                    Ask me about any technique, equipment adjustment during SPT,
                    or biomechanical alignment. I have full access to your
                    current regimen.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {EXERCISE_SUGGESTIONS.slice(0, 3).map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setChatInput(s);
                          handleChatSubmit();
                        }}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold border ${isDark ? "border-white/10 text-white/40 hover:text-white" : "border-gray-200 text-gray-500 hover:text-black"} transition-colors`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  className={`flex-1 w-full rounded-3xl border flex flex-col h-[300px] ${isDark ? "bg-black/40 border-white/5" : "bg-gray-50 border-gray-100"}`}
                >
                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
                    {chatMessages.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center opacity-30">
                        <Sparkles className="w-8 h-8 mb-2" />
                        <p className="text-xs font-bold uppercase tracking-widest">
                          Waiting for input...
                        </p>
                      </div>
                    )}
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2`}
                      >
                        <div
                          className={`max-w-[85%] p-4 rounded-2xl text-sm ${msg.role === "user" ? `${accentBg} text-white shadow-lg` : `${isDark ? "bg-white/5 border border-white/10" : "bg-white border border-gray-100"}`}`}
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            className="prose prose-sm prose-invert prose-p:leading-relaxed"
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                          <Loader2 className="w-4 h-4 animate-spin opacity-50" />
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef}></div>
                  </div>
                  <div className="p-4 border-t border-white/5 relative">
                    {suggestions.length > 0 && (
                      <div className="absolute bottom-full left-4 right-4 mb-2 bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-20">
                        {suggestions.map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setChatInput(s);
                              setSuggestions([]);
                              handleChatSubmit();
                            }}
                            className="w-full text-left p-3 text-xs font-bold hover:bg-white/5 transition-colors text-white/70 hover:text-white border-b border-white/5 last:border-0"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                    <form onSubmit={handleChatSubmit} className="flex gap-2">
                      <input
                        value={chatInput}
                        onChange={(e) => onChatInputChange(e.target.value)}
                        placeholder="Consult AI Co-Coach..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
                      />
                      <button
                        type="submit"
                        className={`p-2.5 rounded-xl ${accentBg} text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-transform`}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <header className="mb-6 sm:mb-8">
            <h2
              className={`text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2 sm:gap-3 ${headerText}`}
            >
              <Dumbbell className={`w-6 h-6 sm:w-8 sm:h-8 ${accentText}`} />
              {t("spt_generator")}
            </h2>
            <p className={`${subText} text-sm sm:text-base`}>{t("spt_desc")}</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Controls */}
            <div className={`${cardClass} p-6 rounded-3xl h-fit sticky top-6`}>
              <h3 className={`text-lg font-bold mb-6 ${headerText}`}>
                {t("parameters")}
              </h3>
              <div className="space-y-6">
                <div>
                  <label
                    className={`block text-xs sm:text-sm mb-3 font-medium ${subText}`}
                  >
                    {t("muscle_group")}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {[
                      "Shoulders",
                      "Back",
                      "Core",
                      "Arms",
                      "Legs",
                      "Full Body",
                    ].map((part) => (
                      <button
                        key={part}
                        onClick={() => setBodyPart(part)}
                        className={`px-3 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                          bodyPart === part
                            ? `${accentBg} border-transparent text-white shadow-lg`
                            : isDark
                              ? "bg-neutral-800/50 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                              : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {part}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label
                    className={`block text-sm mb-3 font-medium ${subText}`}
                  >
                    {t("difficulty_level")}
                  </label>
                  <div
                    className={`flex rounded-xl p-1.5 ${
                      isDark ? "bg-neutral-800/50" : "bg-gray-100"
                    }`}
                  >
                    {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setLevel(lvl)}
                        className={`flex-1 py-2.5 text-xs font-black rounded-lg transition-all uppercase tracking-wider ${
                          level === lvl
                            ? isDark
                              ? "bg-neutral-700 text-white shadow"
                              : "bg-white text-gray-900 shadow-sm"
                            : "text-neutral-500 hover:text-neutral-300"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all mt-6 ${
                    isLoading
                      ? "bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-50"
                      : `${accentBg} ${accentColor === "orange" ? "text-black" : "text-white"} hover:scale-[1.02] active:scale-95 shadow-xl shadow-[#FFD700]/10`
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6" />
                  ) : (
                    <Zap className="w-6 h-6" />
                  )}
                  {plan ? t("regenerate_plan") : t("generate_plan")}
                </button>
              </div>
            </div>

            {/* Plan Display */}
            <div className="lg:col-span-2 space-y-6">
              {plan ? (
                <div className="">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
                    <div>
                      <h3
                        className={`text-xl sm:text-2xl font-black ${headerText}`}
                      >
                        {t("training_regimen")}
                      </h3>
                      <p className={`text-xs sm:text-sm ${subText}`}>
                        {plan.length} {t("targeted_exercises")} {bodyPart}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        console.log("Start Workout clicked");
                        startWorkout();
                      }}
                      className={`relative z-10 w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-2xl cursor-pointer ${accentBg} ${accentColor === "orange" ? "text-black" : "text-white"}`}
                    >
                      <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6" />{" "}
                      {t("start_workout")}
                    </button>
                  </div>
                  <div className="grid gap-4">
                    {plan.map((ex, idx) => (
                      <div
                        key={idx}
                        className={`p-6 rounded-2xl border flex items-center justify-between group cursor-default transition-all hover:border-[#FFD700]/50 ${cardClass}`}
                      >
                        <div className="flex items-center gap-6">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl transition-all ${
                              isDark
                                ? "bg-white/5 text-white group-hover:bg-white/10"
                                : "bg-black/5 text-black group-hover:bg-black/10"
                            }`}
                          >
                            {idx + 1}
                          </div>
                          <div>
                            <p className={`text-lg font-black ${headerText}`}>
                              {ex.name}
                            </p>
                            <p
                              className={`text-sm tracking-wide font-medium ${subText}`}
                            >
                              {ex.sets} {t("sets_label")} •{" "}
                              {ex.duration && ex.duration > 0
                                ? `${ex.duration}s`
                                : ex.reps}
                            </p>
                            <p
                              className={`text-[10px] mt-2 max-w-md ${subText} opacity-70 line-clamp-3 hover:line-clamp-none cursor-pointer transition-all`}
                              title="Click to expand"
                            >
                              {ex.description}
                            </p>
                            {ex.imageUrl && (
                              <div className="mt-4 rounded-xl overflow-hidden border border-white/5 shadow-lg w-full max-w-[200px] aspect-square">
                                <img
                                  src={ex.imageUrl}
                                  alt={ex.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <ChevronRight
                          className={`w-6 h-6 transition-transform group-hover:translate-x-1 ${subText}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  className={`h-[500px] sm:h-[600px] flex flex-col items-center justify-start pt-8 rounded-[32px] border border-dashed relative overflow-y-auto overflow-x-hidden custom-scrollbar ${
                    isDark
                      ? "bg-neutral-900/30 border-neutral-800"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="w-full max-w-sm h-64 sm:h-96 flex-shrink-0">
                    <ExerciseAnimator
                      type="IDLE"
                      isDark={isDark}
                      accentColor={accentColor}
                      accentText={accentText}
                      isLoading={isLoading}
                    />
                  </div>
                  <div className="text-center mt-8 px-8">
                    {isLoading ? (
                      <div className="space-y-2">
                        <p
                          className={`${headerText} text-2xl font-black tracking-tighter uppercase`}
                        >
                          {t("compiling_intelligence")}
                        </p>
                        <p className={`${subText} text-sm`}>
                          {t("analyzing_biomechanics")}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-3xl bg-[#FFD700]/10 flex items-center justify-center mb-2">
                          <Dumbbell className={`w-8 h-8 ${accentText}`} />
                        </div>
                        <h3 className={`text-xl font-black ${headerText}`}>
                          {t("ready_generation")}
                        </h3>
                        <p className={`${subText} max-w-xs mb-8`}>
                          {t("select_parameters")}
                        </p>

                        {/* Suggested Plans Library */}
                        <div className="w-full max-w-3xl text-left">
                          <h4
                            className={`text-sm font-black uppercase tracking-[0.2em] mb-4 opacity-50 ${headerText}`}
                          >
                            Suggested Programs for {level} {bodyPart}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {PREDEFINED_PLANS[level]?.[bodyPart]?.map(
                              (p, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setPlan(p.exercises)}
                                  className={`p-6 rounded-2xl border text-left group transition-all duration-300 hover:scale-[1.02] active:scale-95 ${cardClass} hover:border-[#FFD700]/50`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h5
                                      className={`font-black text-lg ${headerText}`}
                                    >
                                      {p.title}
                                    </h5>
                                    <ChevronRight className="w-5 h-5 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                  </div>
                                  <p className="text-xs text-neutral-500 line-clamp-2 mb-4">
                                    {p.exercises.map((e) => e.name).join(", ")}
                                  </p>
                                  <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFD700]/10 text-[#FFD700] uppercase tracking-tighter">
                                      {p.exercises.length} Exercises
                                    </span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 uppercase tracking-tighter">
                                      Est. 20m
                                    </span>
                                  </div>
                                </button>
                              ),
                            )}
                            {(!PREDEFINED_PLANS[level]?.[bodyPart] ||
                              PREDEFINED_PLANS[level][bodyPart].length ===
                                0) && (
                              <div className="col-span-1 sm:col-span-2 p-8 rounded-2xl border border-dashed border-white/5 bg-white/5 text-center">
                                <p className="text-sm text-neutral-500 italic">
                                  No suggested plans available for this category
                                  yet. Use AI to generate a custom one!
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // FINISHED VIEW
    if (isFinished) {
      return (
        <div
          className={`fixed inset-0 z-[300] flex items-center justify-center p-6 ${bgClass}`}
        >
          <div
            className={`max-w-md w-full p-12 rounded-[48px] text-center border shadow-2xl ${cardClass}`}
          >
            <div className="mb-8 relative inline-block">
              <div className="p-8 rounded-full bg-[#FFD700]/10 border-4 border-[#FFD700]/20">
                <CheckCircle2 className={`w-20 h-20 ${accentText}`} />
              </div>
              <div className="absolute -top-2 -right-2 bg-[#FFD700] text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                Finished
              </div>
            </div>
            <h1
              className={`text-3xl sm:text-4xl font-black mb-4 uppercase tracking-tighter ${headerText}`}
            >
              Session Complete
            </h1>
            <p
              className={`${subText} mb-10 text-sm font-medium leading-relaxed`}
            >
              Excellent work! You've successfully completed your {bodyPart}{" "}
              training regimen. Progress is the result of consistency.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div
                className={`p-5 rounded-3xl border ${
                  isDark
                    ? "bg-black/40 border-neutral-800"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <p
                  className={`text-[10px] font-black uppercase opacity-40 mb-1 ${headerText}`}
                >
                  Total Plan
                </p>
                <p className={`text-2xl font-black ${headerText}`}>
                  {plan?.length}
                </p>
              </div>
              <div
                className={`p-5 rounded-3xl border ${
                  isDark
                    ? "bg-black/40 border-neutral-800"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <p
                  className={`text-[10px] font-black uppercase opacity-40 mb-1 ${headerText}`}
                >
                  Targeted
                </p>
                <p className={`text-2xl font-black ${headerText}`}>
                  {bodyPart}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsFinished(false)}
              className={`w-full py-5 rounded-[24px] font-black shadow-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 ${accentBg} ${accentColor === "orange" ? "text-black" : "text-white"}`}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      );
    }

    // PLAYER MODE
    if (!plan || !plan[currentStep]) return null;
    const activeEx = plan[currentStep];
    const progress = ((currentStep + 1) / plan.length) * 100;

    const getRefinedAnimationType = (ex: Exercise) => {
      const n = ex.name.toUpperCase();
      const c = (ex.category || "").toUpperCase();

      // Specific Detection
      if (n.includes("BURPEE")) return "BURPEE";
      if (n.includes("MOUNTAIN") || n.includes("CLIMBER")) return "MOUNTAIN";
      if (n.includes("CRUNCH") || n.includes("SIT") || n.includes("AB"))
        return "CRUNCH";

      if (n.includes("SQUAT")) return "SQUAT";
      if (n.includes("LUNGE")) return "LUNGE";
      if (n.includes("DEADLIFT")) return "DEADLIFT";
      if (n.includes("PLANK") || n.includes("HOLD")) return "PLANK";

      if (n.includes("PUSH") || n.includes("PRESS") || n.includes("CHEST"))
        return "PRESS";
      if (
        n.includes("PULL") ||
        n.includes("ROW") ||
        n.includes("BACK") ||
        n.includes("CHIN")
      )
        return "PULL";
      if (n.includes("CURL") || n.includes("BICEP")) return "CURL";
      if (n.includes("DIP") || n.includes("TRICEP") || n.includes("EXTENSION"))
        return "DIP";
      if (
        n.includes("RAISE") ||
        n.includes("FLY") ||
        n.includes("SHOULDER") ||
        n.includes("LATERAL")
      )
        return "RAISE";

      if (n.includes("JUMP") || n.includes("JACK")) return "JUMPING";
      if (n.includes("RUN") || n.includes("JOG") || n.includes("CARDIO"))
        return "RUN";
      if (n.includes("STRETCH") || n.includes("YOGA")) return "STRETCH";

      // Fallback to Category
      return c || "SPT";
    };

    const currentAnimType = isPaused
      ? "STATIC"
      : getRefinedAnimationType(activeEx);

    return (
      <div className={`fixed inset-0 z-[200] flex flex-col ${bgClass}`}>
        {/* Player Header */}
        <header
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isDark
              ? "bg-neutral-900/50 backdrop-blur-xl border-neutral-800"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              onClick={() => setIsPlaying(false)}
              className={`p-2 sm:p-3 rounded-2xl hover:bg-red-500/10 hover:text-red-500 transition-all ${subText}`}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="min-w-0">
              <h2
                className={`font-black text-lg sm:text-xl tracking-tight leading-none truncate ${headerText}`}
              >
                {bodyPart} Training
              </h2>
              <div className="flex items-center gap-2 sm:gap-3 mt-1.5">
                <div className="w-24 sm:w-48 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${accentBg}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span
                  className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${subText}`}
                >
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>
          <div
            className={`text-xs sm:text-sm font-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border-2 flex items-center gap-1 sm:gap-2 ${
              isDark
                ? "border-neutral-800 text-neutral-300"
                : "border-gray-200 text-gray-700"
            }`}
          >
            <span className={accentText}>{currentStep + 1}</span>
            <span className="opacity-30">/</span>
            <span>{plan.length}</span>
          </div>
        </header>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Main Stage */}
          <div className="relative flex flex-col h-[45vh] md:h-auto md:flex-1">
            <div className="flex-1 relative flex items-center justify-center p-8 lg:p-12 overflow-hidden">
              <div className="w-full h-full max-w-2xl max-h-[600px] flex items-center justify-center pointer-events-none">
                <ExerciseAnimator
                  key={isPaused ? "paused" : activeEx.name + currentStep} // Force re-mount on exercise change or pause toggle
                  type={currentAnimType}
                  isDark={isDark}
                  accentColor={accentColor}
                  accentText={accentText}
                  imageUrl={activeEx.imageUrl}
                />
              </div>
            </div>
            {/* Float Controls */}
            <div
              className={`absolute bottom-4 sm:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 sm:gap-6 px-4 sm:px-8 py-3.5 sm:py-5 rounded-[24px] sm:rounded-[32px] backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/10 z-[250] pointer-events-auto ${
                isDark ? "bg-black/40" : "bg-white/80"
              }`}
            >
              <button
                onClick={() => {
                  // Smart Previous Logic
                  // If playing for > 3 seconds, restart current exercise
                  // If playing for < 3 seconds, go to previous exercise
                  const initialDuration = plan[currentStep].duration || 60;
                  const timeElapsed = initialDuration - timer;

                  if (currentStep > 0 && timeElapsed < 3) {
                    // Go to previous
                    const prev = currentStep - 1;
                    setCurrentStep(prev);
                    startStep(prev);
                  } else {
                    // Restart current
                    startStep(currentStep);
                  }
                }}
                className={`relative z-[300] p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all disabled:opacity-20 cursor-pointer ${
                  isDark
                    ? "hover:bg-white/10 text-white"
                    : "hover:bg-black/5 text-black"
                }`}
                title="Restart / Previous"
              >
                {/* Show SkipBack icon if we would skip back, else RotateCcw */}
                {currentStep > 0 &&
                (plan[currentStep].duration || 60) - timer < 3 ? (
                  <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>

              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`relative z-[300] w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 active:scale-90 cursor-pointer ${accentBg}`}
                title={isPaused ? "Resume" : "Pause"}
              >
                {isPaused ? (
                  <PlayCircle className="w-8 h-8 sm:w-10 sm:h-10 ml-1" />
                ) : (
                  <Pause className="w-8 h-8 sm:w-10 sm:h-10" />
                )}
              </button>

              <button
                onClick={handleNext}
                className={`relative z-[300] p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all cursor-pointer ${
                  isDark
                    ? "hover:bg-white/10 text-white"
                    : "hover:bg-black/5 text-black"
                }`}
                title="Skip to Next"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Info & List Panel (The "See Everything" part) */}
          <aside
            className={`flex flex-1 md:flex-none w-full md:w-[320px] lg:w-[400px] flex-col border-t md:border-t-0 md:border-l overflow-hidden ${
              isDark
                ? "bg-neutral-900 border-neutral-800"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Active Info */}
            <div className="p-6 sm:p-8 border-b border-neutral-800/50">
              <span
                className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 block ${accentText}`}
              >
                {t("now_training")}
              </span>
              <h1
                className={`text-2xl sm:text-3xl font-black mb-4 leading-tight tracking-tighter uppercase ${headerText}`}
              >
                {activeEx.name}
              </h1>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div
                  className={`p-4 rounded-2xl border ${
                    isDark
                      ? "bg-black/40 border-neutral-800"
                      : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <p
                    className={`text-[10px] font-bold uppercase opacity-50 mb-1 ${headerText}`}
                  >
                    {t("intensity")}
                  </p>
                  <p className={`text-xl font-black ${headerText}`}>
                    {activeEx.sets} x{" "}
                    {activeEx.reps && activeEx.reps !== "0"
                      ? activeEx.reps
                      : `${activeEx.duration ?? 0}s`}
                  </p>
                </div>
                {activeEx.rest && (
                  <div
                    className={`p-4 rounded-2xl border ${
                      isDark
                        ? "bg-black/40 border-neutral-800"
                        : "bg-gray-50 border-gray-100"
                    }`}
                  >
                    <p
                      className={`text-[10px] font-bold uppercase opacity-50 mb-1 ${headerText}`}
                    >
                      {t("rest_label") || "REST"}
                    </p>
                    <p className={`text-xl font-black ${headerText}`}>
                      {activeEx.rest}
                    </p>
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl border ${
                    isDark
                      ? "bg-black/40 border-neutral-800"
                      : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <p
                    className={`text-[10px] font-bold uppercase opacity-50 mb-1 ${headerText}`}
                  >
                    {t("timer_label")}
                  </p>
                  <p
                    className={`text-xl font-black ${
                      (activeEx.duration ?? 0) > 0 && timer > 0
                        ? "text-[#FFD700]"
                        : headerText
                    }`}
                  >
                    {(activeEx.duration ?? 0) > 0 ? `${timer}s` : t("manual")}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[10px] font-black uppercase tracking-[0.2em] block ${accentText}`}
                >
                  {t("instructions")}
                </span>
                <button
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                  className={`p-1.5 rounded-lg transition-all hover:bg-white/10 ${subText}`}
                  title={isDescExpanded ? "Minimize" : "Extend"}
                >
                  {isDescExpanded ? (
                    <Minimize className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div
                className={`transition-all duration-300 ease-in-out overflow-y-auto pr-2 custom-scrollbar ${
                  isDescExpanded ? "max-h-[500px]" : "max-h-[100px]"
                }`}
              >
                <div
                  className={`text-sm leading-relaxed font-medium ${subText} prose prose-sm ${isDark ? "prose-invert" : ""}`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {activeEx.description}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Full List ("See Everything") */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-6 sm:px-8 py-4 border-b border-neutral-800/50 flex items-center justify-between bg-black/20">
                <span
                  className={`text-[10px] font-black uppercase tracking-widest ${subText}`}
                >
                  {t("full_plan_overview")}
                </span>
                <span className={`text-[10px] font-black ${subText}`}>
                  {plan!.length} {t("items_suffix")}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {plan!.map((ex, idx) => (
                  <PlanListItem
                    key={idx}
                    ex={ex}
                    idx={idx}
                    isActive={idx === currentStep}
                    isDone={idx < currentStep}
                    isDark={isDark}
                    accentBg={accentBg}
                    headerText={headerText}
                    t={t}
                    onClick={(i) => {
                      setCurrentStep(i);
                      startStep(i);
                    }}
                  />
                ))}
              </div>
            </div>
          </aside>
        </div>
        <style>{`
        @keyframes breathing-glow {
          0%, 100% { opacity: 0.03; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.08; transform: translate(-50%, -50%) scale(1.1); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? "#333" : "#ddd"};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? "#444" : "#ccc"};
        }
      `}</style>
      </div>
    );
  },
);

export default ExerciseView;
