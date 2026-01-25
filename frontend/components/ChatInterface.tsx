import * as React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Send,
  Image as ImageIcon,
  X,
  Mic,
  Cloud,
  Sparkles,
  Camera,
  MicOff,
  CloudOff,
  Target,
  Copy,
  PlusCircle,
  Loader2,
  Lock,
  Crown,
  Share2,
  Pencil,
  Save,
  RotateCcw,
  Volume2,
  Square,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Globe,
  ExternalLink,
  ChevronDown,
  Zap,
  Maximize,
  Minimize,
  Dumbbell,
  FileText,
  History,
  ArrowRight,
  CheckCircle,
  ShoppingBag,
  CreditCard as CreditCardIcon,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Message,
  UserProfile,
  AppMode,
  Exercise,
  ScoreData,
  ChatSession,
} from "../types";
import {
  streamGeminiResponse,
  enhancePrompt,
  enhanceImagePrompt,
  generateImageFromPrompt,
} from "../services/geminiService";
import { ArcheryLoader } from "./ArcheryLoader";
import { getTranslation } from "../i18n";
import { ChartRenderer } from "./ChartRenderer";

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  saveHistory: (messages: Message[]) => void;
  userProfile: UserProfile | null;
  scoreData?: ScoreData[];
  allSessions?: ChatSession[];
  onSaveScore?: (score: ScoreData) => void;
  onTokenUsage: (amount: number) => void;
  onResetChat: (isPenalty: boolean) => void;
  onGoToUpgrade: () => void;
  accentColor?: string;
  themeMode?: "dark" | "light";
  nickname?: string;
  onImageGenerated?: () => void;
  onNavigate?: (mode: AppMode) => void;
  onExercisePlanPreload?: (plan: Exercise[]) => void;
  onThemeChange?: (theme: "dark" | "light") => void;
  onLogout?: () => void;
  isFocusMode?: boolean;
  onToggleFocusMode?: () => void;
  language?: string;

  customInstructions?: string;
  aiPersonality?: string;
}

const CameraModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageData: string) => void;
  isDark: boolean;
  activeTextClass: string;
  activeBgClass: string;
  activeGradient: string;
}> = ({
  isOpen,
  onClose,
  onCapture,
  isDark,
  activeTextClass,
  activeBgClass,
  activeGradient,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (e) {
      console.error("Camera access failed", e);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        onCapture(canvas.toDataURL("image/jpeg", 0.8));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-neutral-950 rounded-[2rem] overflow-hidden border border-white/10 relative shadow-2xl">
        <div className="relative aspect-square md:aspect-video bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={onClose}
              className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <button onClick={takePhoto} className="group relative">
              <div className="w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full transition-transform active:scale-90"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

const ChatInterface: React.FC<ChatInterfaceProps> = React.memo(
  ({
    messages,
    setMessages,
    saveHistory,
    userProfile,
    scoreData,
    allSessions,
    onSaveScore,
    onTokenUsage,
    onResetChat,
    onGoToUpgrade,
    accentColor = "orange",
    themeMode = "dark",
    nickname,
    onImageGenerated,
    onNavigate,
    onExercisePlanPreload,
    onThemeChange,
    onLogout,
    isFocusMode = false,
    onToggleFocusMode,

    language = "English",
    customInstructions,
    aiPersonality,
  }) => {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [isIncognito, setIsIncognito] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [pendingOrder, setPendingOrder] = useState<any>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const t = (key: string) => {
      return getTranslation(language, key);
    };
    const [showToast, setShowToast] = useState<{
      show: boolean;
      message: string;
    }>({ show: false, message: "" });
    const [selectedModel, setSelectedModel] = useState("Gemini 3.0 Flash");
    const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);

    const models = [
      {
        id: "gemini-3.0-flash",
        name: "Gemini 3.0 Flash",
        provider: "Google",
        color: "text-[#FFD700]", // Google brand color or gold
        desc: "Ultra-fast multimodal reasoning",
      },
      {
        id: "gemini-2.5-flash",
        name: "Gemini 2.5 Flash",
        provider: "Google",
        color: "text-amber-400",
        desc: "Balanced speed and accuracy",
      },
      {
        id: "gpt-5.1",
        name: "GPT-5.1",
        provider: "OpenAI",
        color: "text-emerald-400",
        desc: "Advanced logic & reasoning",
      },
      {
        id: "gpt-5.2",
        name: "GPT-5.2",
        provider: "OpenAI",
        color: "text-teal-400",
        desc: "Next-gen cognitive architecture",
      },
      {
        id: "claude-4.5-sonnet",
        name: "Claude 4.5 Sonnet",
        provider: "Anthropic",
        color: "text-orange-400",
        desc: "Creative expert analysis",
      },
      {
        id: "claude-4.5-opus",
        name: "Claude 4.5 Opus",
        provider: "Anthropic",
        color: "text-rose-400",
        desc: "Deepest reasoning capability",
      },
    ];

    const isDark = themeMode === "dark";
    const stopGeneration = useRef(false);

    // Maps for dynamic color classes
    const colors: Record<string, string> = {
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
    const bgGradients: Record<string, string> = {
      orange: "from-[#FFD700] via-[#FDB931] to-[#FFD700]",
      blue: "from-blue-600 to-cyan-600",
      green: "from-green-600 to-emerald-600",
      purple: "from-purple-600 to-pink-600",
      red: "from-red-600 to-rose-600",
      pink: "from-pink-600 to-rose-600",
      teal: "from-teal-600 to-cyan-600",
      cyan: "from-cyan-600 to-blue-600",
      indigo: "from-indigo-600 to-purple-600",
    };
    const activeTextClass = colors[accentColor] || colors.orange;
    const activeGradient = bgGradients[accentColor] || bgGradients.orange;

    const bgColors: Record<string, string> = {
      orange: "bg-[#FFD700]",
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      red: "bg-red-500",
      pink: "bg-pink-500",
      teal: "bg-teal-500",
      cyan: "bg-cyan-500",
      indigo: "bg-indigo-500",
    };
    const activeBgClass = bgColors[accentColor] || bgColors.orange;

    const borderColors: Record<string, string> = {
      orange: "border-[#FFD700]",
      blue: "border-blue-500",
      green: "border-green-500",
      purple: "border-purple-500",
      red: "border-red-500",
      pink: "border-pink-500",
      teal: "border-teal-500",
      cyan: "border-cyan-500",
      indigo: "border-indigo-500",
    };
    const activeBorderClass = borderColors[accentColor] || borderColors.orange;

    const shadowColors: Record<string, string> = {
      orange: "shadow-[#FFD700]",
      blue: "shadow-blue-500",
      green: "shadow-green-500",
      purple: "shadow-purple-500",
      red: "shadow-red-500",
      pink: "shadow-pink-500",
      teal: "shadow-teal-500",
      cyan: "shadow-cyan-500",
      indigo: "shadow-indigo-500",
    };
    const activeShadowClass = shadowColors[accentColor] || shadowColors.orange;

    // Speech & Editing State
    const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(
      null,
    );
    const [editingMessageId, setEditingMessageId] = useState<string | null>(
      null,
    );
    const [editText, setEditText] = useState("");

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<any>(null);
    const modelSelectorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          modelSelectorRef.current &&
          !modelSelectorRef.current.contains(event.target as Node)
        ) {
          setIsModelSelectorOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
      messagesEndRef.current?.scrollIntoView({ behavior });
    };

    useEffect(() => {
      if (!editingMessageId) {
        // Use instant scroll during loading to prevent "growing" lag effect
        scrollToBottom(isLoading ? "auto" : "smooth");
      }
    }, [messages, editingMessageId, isLoading]);

    useEffect(() => {
      if (!isIncognito && messages.length > 0 && !isLoading) {
        saveHistory(messages);
      }
    }, [messages, isIncognito, isLoading, saveHistory]);

    useEffect(() => {
      return () => {
        window.speechSynthesis.cancel();
      };
    }, []);

    const showNotification = (msg: string) => {
      setShowToast({ show: true, message: msg });
      setTimeout(() => setShowToast({ show: false, message: "" }), 3000);
    };

    const estimateTokens = (text: string) => {
      return Math.ceil(text.length / 4);
    };

    const handleCopy = (text: string) => {
      navigator.clipboard.writeText(text);
      showNotification(t("copied"));
    };

    const handleSpeak = (text: string, msgId: string) => {
      if (speakingMessageId === msgId) {
        window.speechSynthesis.cancel();
        setSpeakingMessageId(null);
        return;
      }

      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#_`]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      const voices = window.speechSynthesis.getVoices();

      let preferredVoice;
      if (language === "Hindi") {
        preferredVoice =
          voices.find(
            (v) => v.lang.includes("hi-IN") || v.lang.includes("hi"),
          ) ||
          voices.find((v) => v.lang.includes("en-IN")) ||
          voices.find((v) => v.lang.includes("en"));
      } else {
        preferredVoice =
          voices.find(
            (v) =>
              (v.name.includes("Google") || v.name.includes("Premium")) &&
              v.lang.includes("en"),
          ) ||
          voices.find((v) => v.lang.includes("en")) ||
          voices[0];
      }

      if (preferredVoice) {
        utterance.voice = preferredVoice;
        utterance.lang = preferredVoice.lang;
      } else if (language === "Hindi") {
        utterance.lang = "hi-IN";
      }

      utterance.pitch = 1;
      utterance.rate = 1.05;
      utterance.onend = () => setSpeakingMessageId(null);
      utterance.onerror = () => setSpeakingMessageId(null);
      setSpeakingMessageId(msgId);
      window.speechSynthesis.speak(utterance);
    };

    const handleShareMessage = async (text: string) => {
      const shareData = {
        title: "X10Minds Insight",
        text: `${text}\n\n- Coach X10`,
      };
      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          handleCopy(shareData.text);
        }
      } catch (err) {
        handleCopy(shareData.text);
      }
    };

    const handleFeedback = (msgId: string, type: "like" | "dislike") => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === msgId) {
            const newFeedback = msg.feedback === type ? undefined : type;
            return { ...msg, feedback: newFeedback };
          }
          return msg;
        }),
      );
      showNotification(
        type === "like" ? t("feedback_helpful") : t("feedback_not_helpful"),
      );
    };

    const handleRegenerate = async (index: number) => {
      const userMsgIndex = index - 1;
      if (userMsgIndex < 0) return;
      const lastUserMsg = messages[userMsgIndex];
      if (lastUserMsg.role !== "user") return;

      // Check if it was an image generation request
      const isImageRequest = lastUserMsg.content.startsWith(
        "Generate an image for: ",
      );

      // Reset history to this point
      const history = messages.slice(0, userMsgIndex + 1);
      setMessages(history);

      if (isImageRequest) {
        // Re-trigger image generation
        const prompt = lastUserMsg.content.replace("create an image: ", "");
        setIsGeneratingImage(true);
        showNotification(t("regenerating_image") + " 🎨");

        const now = Date.now();
        const botMsgId = `b-${now}`;

        setMessages((prev) => [
          ...prev,
          {
            id: botMsgId,
            role: "model",
            content: "✨ " + t("regenerating_image"),
            timestamp: now + 1,
            isTyping: true,
          },
        ]);

        try {
          const imageUrl = await generateImageFromPrompt(prompt);
          if (imageUrl) {
            onImageGenerated?.();
            await new Promise((r) => setTimeout(r, 500));

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === botMsgId
                  ? {
                      ...msg,
                      content: `Here is the archery visualization I created for: **${prompt}** 🏹`,
                      image: imageUrl,
                      isTyping: false,
                    }
                  : msg,
              ),
            );
          } else {
            throw new Error("Failed");
          }
        } catch (error) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMsgId
                ? {
                    ...msg,
                    content: "❌ Failed to regenerate image.",
                    isTyping: false,
                  }
                : msg,
            ),
          );
        } finally {
          setIsGeneratingImage(false);
        }
      } else {
        // Normal Text Regeneration
        setIsLoading(true);
        await processGeminiResponse(
          lastUserMsg.content,
          lastUserMsg.image,
          messages.slice(0, userMsgIndex),
        );
      }
    };

    const handleEditStart = (msg: Message) => {
      setEditingMessageId(msg.id);
      setEditText(msg.content);
    };

    const handleEditCancel = () => {
      setEditingMessageId(null);
      setEditText("");
    };

    const handleEditEnhance = async () => {
      if (!editText.trim()) return;
      setIsEnhancing(true);
      const enhanced = await enhancePrompt(editText);
      setEditText(enhanced);
      setIsEnhancing(false);
    };

    const handleEditSubmit = async (msgId: string) => {
      const index = messages.findIndex((m) => m.id === msgId);
      if (index === -1) return;
      const history = messages.slice(0, index);
      const oldMsg = messages[index];
      const updatedMsg = {
        ...oldMsg,
        content: editText,
        timestamp: Date.now(),
      };
      setMessages([...history, updatedMsg]);
      setEditingMessageId(null);
      setIsLoading(true);
      await processGeminiResponse(editText, updatedMsg.image, history);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          showNotification("Image too large. Maximum size is 5MB.");
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleCameraCapture = () => {
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      }
    };

    const handleCameraFileChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const file = event.target.files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          showNotification("Photo too large. Maximum size is 5MB.");
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const toggleDictation = () => {
      if (
        "webkitSpeechRecognition" in window ||
        "SpeechRecognition" in window
      ) {
        const SpeechRecognition =
          (window as any).webkitSpeechRecognition ||
          (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language === "Hindi" ? "hi-IN" : "en-US";
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev) => prev + (prev ? " " : "") + transcript);
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
      } else {
        alert("Speech recognition is not supported in this browser.");
      }
    };

    const handleEnhance = async () => {
      if (!input.trim() || isEnhancing) return;
      setIsEnhancing(true);
      const enhanced = await enhancePrompt(input);
      setInput(enhanced);
      setIsEnhancing(false);
    };

    const handleGenerateImage = async (
      providedPrompt?: string,
      targetBotMsgId?: string,
    ) => {
      const promptToUse = providedPrompt || input.trim();
      if (!promptToUse) {
        showNotification(t("enter_description"));
        return;
      }
      if (isGeneratingImage) return;

      const isUnlimited =
        userProfile?.subscriptionTier === "Pro" ||
        userProfile?.subscriptionTier === "Ultra";
      const isCharge = userProfile?.subscriptionTier === "Charge";
      const imageLimit = isUnlimited ? Infinity : isCharge ? 10 : 2;
      const imagesRemaining = isUnlimited
        ? Infinity
        : imageLimit - (userProfile?.imagesGenerated || 0);

      if (!isUnlimited && imagesRemaining <= 0) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "user",
            content: `Generate an image: ${promptToUse}`,
            timestamp: Date.now(),
          },
          {
            id: (Date.now() + 1).toString(),
            role: "model",
            content: `🎨 **${t(
              "limit_reached",
            )}** 🛑\n\nYou have used your total daily capacity of **${imageLimit} visualizations**! ✨ Archery art and biomechanical analysis require significant computing power. Upgrade for more access! 💪`,
            timestamp: Date.now(),
          },
        ]);
        if (!providedPrompt) setInput("");
        return;
      }

      setIsGeneratingImage(true);
      if (!providedPrompt) setInput("");
      showNotification(t("generating_image") + " 🎨");

      const now = Date.now();
      const userMsgId = `u-${now}`;
      const botMsgId = targetBotMsgId || `b-${now}`;

      // Only add new messages if NOT triggered by system command (which already has a bot box)
      if (!targetBotMsgId) {
        setMessages((prev) => [
          ...prev,
          {
            id: userMsgId,
            role: "user",
            content: `Generate an image for: ${promptToUse}`,
            timestamp: now,
          },
          {
            id: botMsgId,
            role: "model",
            content: "✨ " + t("generating_image"),
            timestamp: now + 1,
            isTyping: true,
          },
        ]);
      } else {
        // Just update existing bot message to show "Generating"
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId
              ? {
                  ...msg,
                  content: "✨ " + t("generating_image"),
                  isTyping: true,
                }
              : msg,
          ),
        );
      }

      try {
        // Quality Upgrade: Enhance the prompt first
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId
              ? { ...msg, content: "✨ Enhancing prompt details (15%)..." }
              : msg,
          ),
        );
        const elitePrompt = await enhanceImagePrompt(promptToUse);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId
              ? {
                  ...msg,
                  content:
                    "🎨 Rendering high-definition visualization (45%)...",
                }
              : msg,
          ),
        );

        const imageUrl = await generateImageFromPrompt(elitePrompt);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId
              ? {
                  ...msg,
                  content:
                    "🚀 Finalizing render and applying simulated physics (88%)...",
                }
              : msg,
          ),
        );

        if (imageUrl) {
          onImageGenerated?.();
          await new Promise((r) => setTimeout(r, 800)); // Simulate final processing

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMsgId
                ? {
                    ...msg,
                    content: `Here is the archery visualization I created for: **${promptToUse}** 🏹`,
                    image: imageUrl,
                    isTyping: false,
                  }
                : msg,
            ),
          );
        } else {
          throw new Error("Failed to generate image URL");
        }
      } catch (error) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId
              ? {
                  ...msg,
                  content:
                    "❌ I apologize, but I encountered an error while generating your image. Please try again with a different prompt.",
                  isTyping: false,
                }
              : msg,
          ),
        );
      } finally {
        setIsGeneratingImage(false);
      }
    };

    const handleNewChat = () => {
      setMessages([]);
      setInput("");
      setSelectedImage(null);
      onResetChat(isLimitReached);
      window.speechSynthesis.cancel();
    };

    const handleStop = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      stopGeneration.current = true;
      setIsLoading(false);
    };

    const processGeminiResponse = async (
      text: string,
      image?: string,
      overrideHistory?: Message[],
    ) => {
      stopGeneration.current = false;
      try {
        const inputTokens = estimateTokens(text);
        onTokenUsage(inputTokens);
        const botMessageId = (Date.now() + 1).toString();

        setMessages((prev) => [
          ...prev,
          {
            id: botMessageId,
            role: "model",
            content: "",
            timestamp: Date.now(),
            isTyping: true,
          },
        ]);

        const historyToUse = overrideHistory || messages;
        const startTime = Date.now();
        // Pass the nickname to the service
        const stream = await streamGeminiResponse(
          historyToUse,
          text,
          image,
          nickname,
          userProfile?.subscriptionTier || "Free",
          true,
          selectedModel,
          customInstructions,
          scoreData,
          allSessions,
          aiPersonality,
        );

        let fullResponse = "";
        const sourcesSet = new Set<string>();
        let allSources: { title: string; url: string }[] = [];

        for await (const chunk of stream) {
          if (stopGeneration.current) {
            break;
          }

          if (chunk.isSearching) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === botMessageId ? { ...msg, isSearching: true } : msg,
              ),
            );
            continue;
          }

          if (chunk.sources) {
            chunk.sources.forEach((s) => {
              if (!sourcesSet.has(s.url)) {
                sourcesSet.add(s.url);
                allSources.push(s);
              }
            });
          }

          if (chunk.text) {
            fullResponse += chunk.text;
          }

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId
                ? {
                    ...msg,
                    content: fullResponse
                      .replace(/\[SYSTEM_COMMAND:NAVIGATE:\w+\]/g, "")
                      .replace(/\[SYSTEM_COMMAND:THEME_LIGHT\]/g, "")
                      .replace(/\[SYSTEM_COMMAND:THEME_DARK\]/g, "")
                      .replace(/\[SYSTEM_COMMAND:LOGOUT\]/g, "")
                      .replace(/\[SYSTEM_COMMAND:NOTIFY:[\s\S]*?\]/g, "")
                      .replace(
                        /\[SYSTEM_COMMAND:GENERATE_IMAGE:[\s\S]*?\]/g,
                        "",
                      )
                      .replace(/\[SYSTEM_COMMAND:EXERCISE_DATA:[\s\S]*?\]/g, "")
                      .replace(/\[SYSTEM_COMMAND:RENDER_CHART:[\s\S]*?\]/g, "")
                      .replace(/\[SYSTEM_COMMAND:SAVE_SCORE:[\s\S]*?\]/g, "")
                      .replace(
                        /\[SYSTEM_COMMAND:ORDER_PRODUCT:[\s\S]*?\]/g,
                        "",
                      ), // Hide the commands from user
                    sources: allSources.length > 0 ? allSources : undefined,
                    isSearching: false,
                    isTyping: false,
                    thoughtTime: Date.now() - startTime,
                  }
                : msg,
            ),
          );
        }

        // Detect System Commands after response is complete
        if (!stopGeneration.current) {
          // 0. Check for Chart Data
          if (fullResponse.includes("[SYSTEM_COMMAND:RENDER_CHART:")) {
            const chartMatch = fullResponse.match(
              /\[SYSTEM_COMMAND:RENDER_CHART:!!(.*?)!!\]/s,
            );
            if (chartMatch && chartMatch[1]) {
              try {
                const chartJson = JSON.parse(chartMatch[1].trim());
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMessageId
                      ? { ...msg, chart: chartJson }
                      : msg,
                  ),
                );
              } catch (e) {
                console.error("Failed to parse chart data", e);
              }
            }
          }

          // 0.1 Check for Save Score
          if (fullResponse.includes("[SYSTEM_COMMAND:SAVE_SCORE:")) {
            const scoreMatch = fullResponse.match(
              /\[SYSTEM_COMMAND:SAVE_SCORE:!!(.*?)!!\]/s,
            );
            if (scoreMatch && scoreMatch[1]) {
              try {
                const scoreJson = JSON.parse(scoreMatch[1].trim());
                if (onSaveScore) {
                  onSaveScore({
                    ...scoreJson,
                    date:
                      scoreJson.date || new Date().toISOString().split("T")[0],
                  });
                }
              } catch (e) {
                console.error("Failed to parse score data", e);
              }
            }
          }

          // 1. Check for Exercise Data
          if (fullResponse.includes("[SYSTEM_COMMAND:EXERCISE_DATA:")) {
            const exerciseMatch = fullResponse.match(
              /\[SYSTEM_COMMAND:EXERCISE_DATA:!!(.*?)!!\]/s,
            );
            if (exerciseMatch && exerciseMatch[1]) {
              try {
                const plan = JSON.parse(exerciseMatch[1].trim());
                if (Array.isArray(plan)) {
                  onExercisePlanPreload?.(plan);
                }
              } catch (e) {
                console.error("Failed to parse preloaded exercise plan", e);
              }
            }
          }

          // 2. Check for Navigation
          if (fullResponse.includes("[SYSTEM_COMMAND:NAVIGATE:")) {
            const match = fullResponse.match(
              /\[SYSTEM_COMMAND:NAVIGATE:(\w+)\]/,
            );
            if (match && match[1]) {
              const targetMode = match[1] as AppMode;
              if (Object.values(AppMode).includes(targetMode)) {
                setTimeout(() => {
                  onNavigate?.(targetMode);
                  showNotification(
                    `Navigating to ${targetMode.replace("_", " ")}... 🚀`,
                  );
                }, 1500);
              }
            }
          }

          // 3. Check for Theme
          if (fullResponse.includes("[SYSTEM_COMMAND:THEME_DARK]")) {
            onThemeChange?.("dark");
            showNotification("Switching to Dark Mode... 🌙");
          }
          if (fullResponse.includes("[SYSTEM_COMMAND:THEME_LIGHT]")) {
            onThemeChange?.("light");
            showNotification("Switching to Light Mode... ☀️");
          }

          // 4. Check for Logout
          if (fullResponse.includes("[SYSTEM_COMMAND:LOGOUT]")) {
            setTimeout(() => {
              onLogout?.();
            }, 2000);
            showNotification("Logging out... 👋");
          }

          // 5. Check for Image Generation
          if (fullResponse.includes("[SYSTEM_COMMAND:GENERATE_IMAGE:")) {
            const imgMatch = fullResponse.match(
              /\[SYSTEM_COMMAND:GENERATE_IMAGE:(.*?)\]/,
            );
            if (imgMatch && imgMatch[1]) {
              const prompt = imgMatch[1].trim();
              // Small delay to let the user see the text before it converts to image task
              setTimeout(() => {
                handleGenerateImage(prompt, botMessageId); // Pass botMessageId to avoid duplicate boxes
              }, 1000);
            }
          }

          // 6. Check for Notifications
          if (fullResponse.includes("[SYSTEM_COMMAND:NOTIFY:")) {
            const noteMatch = fullResponse.match(
              /\[SYSTEM_COMMAND:NOTIFY:(.*?)\]/,
            );
            if (noteMatch && noteMatch[1]) {
              showNotification(noteMatch[1].trim());
            }
          }
          // 7. Check for Product Ordering
          if (fullResponse.includes("[SYSTEM_COMMAND:ORDER_PRODUCT:")) {
            const orderMatch = fullResponse.match(
              /\[SYSTEM_COMMAND:ORDER_PRODUCT:!!(.*?)!!\]/s,
            );
            if (orderMatch && orderMatch[1]) {
              try {
                const orderJson = JSON.parse(orderMatch[1].trim());
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMessageId
                      ? { ...msg, orderData: orderJson }
                      : msg,
                  ),
                );
              } catch (e) {
                console.error("Failed to parse order data", e);
              }
            }
          }
        }

        if (!stopGeneration.current) {
          const outputTokens = estimateTokens(fullResponse);
          onTokenUsage(outputTokens);
        }
      } catch (error) {
        console.error("Chat Error:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 2).toString(),
            role: "model",
            content:
              "**Error:** I encountered an issue connecting to the server. Please check your internet connection.",
            timestamp: Date.now(),
            isTyping: false,
          },
        ]);
      } finally {
        setIsLoading(false);
        // Ensure the bot message is no longer "typing" even if stopped early
        setMessages((prev) => {
          // If the last message is still typing, mark it as done
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.role === "model" && lastMsg.isTyping) {
            return prev.map((msg) =>
              msg.id === lastMsg.id ? { ...msg, isTyping: false } : msg,
            );
          }
          return prev;
        });
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if ((!input.trim() && !selectedImage) || isLoading) return;
      const isUnlimited =
        userProfile?.subscriptionTier === "Pro" ||
        userProfile?.subscriptionTier === "Ultra";

      // Auto-detect image generation requests even through regular chat button
      const lowerInput = input.toLowerCase();
      const isImageRequest =
        (lowerInput.includes("generate image") ||
          lowerInput.includes("create image") ||
          lowerInput.includes("make an image") ||
          lowerInput.includes("show me an image")) &&
        !lowerInput.includes("how to");

      if (isImageRequest && !selectedImage) {
        await handleGenerateImage();
        return;
      }

      if (
        userProfile &&
        !isUnlimited &&
        userProfile.tokenLimit !== Infinity &&
        userProfile.tokensUsed >= userProfile.tokenLimit
      ) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: Date.now(),
            image: selectedImage || undefined,
          },
          {
            id: (Date.now() + 1).toString(),
            role: "model",
            content: `**${t(
              "limit_reached",
            )}** 🛑\n\nYou have used your total daily capacity of **${
              userProfile.tokenLimit
            } tokens**. \n\n### 🚀 ${t(
              "upgrade_plan",
            )}\nTo keep training with X10Minds and access unlimited coaching, biomechanic analysis, and HD visualizations, please consider upgrading to a premium tier.\n\n[${t(
              "view_plans",
            )}](#upgrade)`,
            timestamp: Date.now(),
            isTyping: false,
          },
        ]);
        setInput("");
        showNotification("Token limit reached. Please upgrade!");
        return;
      }
      const userMessage: Message = {
        id: `u-${Date.now()}`,
        role: "user",
        content: input,
        timestamp: Date.now(),
        image: selectedImage || undefined,
      };

      // Save current history for AI memory before clearing the UI
      const currentHistory = [...messages];

      // Clear previous messages and only show the current one
      setMessages((prev) => [...prev, userMessage]);

      setInput("");
      const imageToSend = selectedImage;
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (cameraInputRef.current) cameraInputRef.current.value = "";
      setIsLoading(true);
      await processGeminiResponse(
        userMessage.content,
        imageToSend || undefined,
        currentHistory,
      );
    };

    const isLimitReached: boolean = !!(
      userProfile &&
      (userProfile.subscriptionTier === "Free" ||
        userProfile.subscriptionTier === "Charge") &&
      userProfile.tokenLimit !== Infinity &&
      userProfile.tokensUsed >= userProfile.tokenLimit
    );

    // Theme Logic
    const bgMain = isDark ? "bg-neutral-950" : "bg-gray-50";
    const headerBg = isDark
      ? "bg-neutral-900/40 backdrop-blur-2xl border-neutral-800/50"
      : "bg-white/80 border-gray-200";
    const headerText = isDark ? "text-white" : "text-gray-900";
    const inputContainerBg = isDark
      ? "bg-neutral-900/60 backdrop-blur-3xl border-neutral-800/50 ring-1 ring-white/5"
      : "bg-white border-gray-200";
    const inputPlaceholder = isDark
      ? "placeholder-neutral-500 text-white"
      : "placeholder-gray-400 text-gray-900";
    const chatBubbleAi = isDark
      ? "glass-card text-neutral-100 shadow-2xl ring-1 ring-white/5"
      : "bg-white text-gray-800 border-gray-100 shadow-xl ring-1 ring-black/5";
    const chatBubbleUser = `bg-gradient-to-br ${activeGradient} text-white shadow-xl shadow-${accentColor}-900/30 ring-1 ring-white/10`;

    return (
      <div
        className={`flex flex-col flex-1 relative overflow-hidden ${bgMain}`}
      >
        {/* Premium Tech Background - Hidden on mobile for performance */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 hidden md:block">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
        <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none hidden md:block"></div>
        <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none hidden md:block"></div>

        <div className="absolute top-4 right-4 z-20 md:top-6 md:right-8">
          <button
            onClick={() => onNavigate?.(AppMode.HISTORY)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
              isDark
                ? "bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white"
                : "bg-white border-gray-200 text-gray-500 hover:text-black"
            }`}
          >
            <History className="w-3.5 h-3.5" /> History
          </button>
        </div>

        {showToast.show && (
          <div
            className={`absolute top-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full shadow-lg border z-50 animate-in fade-in slide-in-from-top-4 text-sm font-medium flex items-center gap-2 pointer-events-none ${
              isDark
                ? "bg-neutral-800 text-white border-neutral-700"
                : "bg-white text-black border-gray-200"
            }`}
          >
            <Target className={`w-4 h-4 ${activeTextClass}`} />{" "}
            {showToast.message}
          </div>
        )}

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 md:px-4 pt-4 pb-12 md:pb-32 space-y-4 md:space-y-6 max-w-4xl mx-auto w-full scroll-smooth">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] py-8 md:py-12 text-center space-y-6 md:space-y-8 animate-in fade-in duration-500">
              <div className="relative group">
                <div
                  className={`w-24 h-24 md:w-36 md:h-36 rounded-3xl md:rounded-[40px] flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.1)] relative z-10 overflow-hidden border-2 ${
                    isDark
                      ? "bg-neutral-900/50 border-neutral-800 backdrop-blur-2xl"
                      : "bg-white border-gray-100"
                  }`}
                >
                  <img
                    src="/images/X10Minds%20logo.png"
                    alt="X10Minds Logo"
                    className="w-14 h-14 md:w-20 md:h-20 object-contain drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]"
                  />
                </div>
                <div
                  className={`absolute inset-0 blur-[40px] md:blur-[60px] rounded-full animate-pulse opacity-30 md:opacity-40 bg-gradient-to-tr ${activeGradient}`}
                ></div>
              </div>

              <div className="max-w-xl space-y-3 px-2">
                <h3
                  className={`text-3xl md:text-5xl font-black font-orbitron uppercase tracking-tighter ${headerText} leading-none`}
                >
                  X10Minds
                  <br />
                  <span className={activeTextClass}>AI</span>
                </h3>
                <p
                  className={`text-sm md:text-base font-medium opacity-60 max-w-sm mx-auto ${
                    isDark ? "text-neutral-400" : "text-gray-600"
                  }`}
                >
                  Your complete Advanced General Intelligence solution for all
                  challenges and tasks.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 md:gap-4 w-full px-2 md:px-6">
                {[
                  {
                    title: "Technical",
                    text: "Analyze my release technique",
                    icon: <Target className="w-3.5 h-3.5 md:w-4 md:h-4" />,
                  },
                  {
                    title: "Equipment",
                    text: "Bow tuning guide",
                    icon: <RefreshCw className="w-3.5 h-3.5 md:w-4 md:h-4" />,
                  },
                  {
                    title: "Mental",
                    text: "Eliminate target panic",
                    icon: <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />,
                  },
                  {
                    title: "Physiology",
                    text: "Core stability routine",
                    icon: <Zap className="w-3.5 h-3.5 md:w-4 md:h-4" />,
                  },
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion.text)}
                    className={`group p-3 md:p-6 border rounded-xl md:rounded-3xl text-left transition-all duration-300 relative overflow-hidden active:scale-95 ${
                      isDark
                        ? "bg-neutral-900/40 hover:bg-neutral-800 border-neutral-800/50 hover:border-orange-500/30 text-neutral-400"
                        : "bg-white hover:bg-gray-50 border-gray-100 text-gray-600 shadow-lg shadow-black/5"
                    }`}
                  >
                    <div
                      className={`p-1.5 md:p-2 rounded-lg w-fit mb-2 md:mb-4 transition-colors ${
                        isDark
                          ? "bg-neutral-800 group-hover:bg-orange-500/20"
                          : "bg-gray-100 group-hover:bg-orange-100"
                      }`}
                    >
                      {suggestion.icon}
                    </div>
                    <h4
                      className={`font-bold text-xs md:text-base mb-0.5 md:mb-1 ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      {suggestion.title}
                    </h4>
                    <p className="text-[10px] md:text-sm opacity-60 leading-relaxed font-medium line-clamp-2">
                      {suggestion.text}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg: Message, index: number) => {
            const isUser = msg.role === "user";
            const isEditing = editingMessageId === msg.id;

            // Check for embedded SPT Plan
            const sptStartTag = "[OPEN_SPT_PLAN]";
            const sptEndTag = "[/OPEN_SPT_PLAN]";
            let displayContent = msg.content;
            let sptPlanJson: Exercise[] | null = null;

            if (
              displayContent.includes(sptStartTag) &&
              displayContent.includes(sptEndTag)
            ) {
              const startIndex = displayContent.indexOf(sptStartTag);
              const endIndex = displayContent.indexOf(sptEndTag);
              const jsonString = displayContent.substring(
                startIndex + sptStartTag.length,
                endIndex,
              );
              try {
                sptPlanJson = JSON.parse(jsonString);
                // Remove the tag and content from main display
                displayContent =
                  displayContent.substring(0, startIndex) +
                  displayContent.substring(endIndex + sptEndTag.length);
              } catch (e) {
                console.error("Failed to parse embedded SPT plan", e);
              }
            }

            return (
              <div
                key={msg.id}
                className={`flex w-full gap-2 md:gap-4 ${
                  isUser ? "justify-end" : "justify-start"
                } animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                {!isUser && (
                  <div
                    className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-gradient-to-br border flex items-center justify-center mt-1 shadow-lg md:shadow-2xl overflow-hidden ${
                      isDark
                        ? "from-neutral-800 to-neutral-900 border-neutral-700"
                        : "from-gray-100 to-white border-gray-200"
                    }`}
                  >
                    <img
                      src="/images/X10Minds%20logo.png"
                      alt="Coach X10"
                      className="w-5 h-5 md:w-7 md:h-7 object-contain drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]"
                    />
                  </div>
                )}
                <div
                  className={`flex flex-col max-w-[85%] md:max-w-[80%] ${
                    isUser ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`relative shadow-lg md:shadow-2xl text-sm md:text-base transition-all duration-300 ${
                      isUser
                        ? isEditing
                          ? "w-full min-w-[280px] md:min-w-[300px]"
                          : `bg-gradient-to-br ${activeGradient} text-white rounded-2xl md:rounded-[2rem] rounded-tr-none py-3 px-4 md:py-4 md:px-6 shadow-xl shadow-${accentColor}-900/10`
                        : `${chatBubbleAi} rounded-2xl md:rounded-[2rem] rounded-tl-none border py-3 px-4 md:py-5 md:px-7 relative group/msg`
                    }`}
                  >
                    {isEditing ? (
                      <div
                        className={`border rounded-3xl p-4 w-full animate-in zoom-in-95 duration-300 ${
                          isDark
                            ? "bg-neutral-900 border-neutral-700 shadow-2xl"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className={`w-full rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-${accentColor}-500/50 min-h-[120px] resize-y mb-4 text-sm font-medium leading-relaxed ${
                            isDark
                              ? "bg-neutral-950 border border-neutral-800 text-white"
                              : "bg-gray-50 border border-gray-200 text-gray-900"
                          }`}
                          autoFocus
                        />
                        <div className="flex items-center justify-between">
                          <button
                            onClick={handleEditCancel}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all font-orbitron ${
                              isDark
                                ? "text-neutral-400 hover:text-white"
                                : "text-gray-500 hover:text-black"
                            }`}
                          >
                            {t("cancel").toUpperCase()}
                          </button>
                          <div className="flex items-center gap-1.5 md:gap-2">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className={`p-2 md:p-3 rounded-xl md:rounded-2xl transition-all ${
                                isDark
                                  ? "text-neutral-400 hover:text-white hover:bg-white/5"
                                  : "text-gray-500 hover:text-black hover:bg-gray-100"
                              }`}
                              title="UPLOAD SCAN"
                            >
                              <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => cameraInputRef.current?.click()}
                              className={`p-2 md:p-3 rounded-xl md:rounded-2xl transition-all ${
                                isDark
                                  ? "text-neutral-400 hover:text-white hover:bg-white/5"
                                  : "text-gray-500 hover:text-black hover:bg-gray-100"
                              }`}
                              title="CAMERA SCAN"
                            >
                              <Camera className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleEditSubmit(msg.id)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-green-600 text-white hover:bg-green-500 transition-all shadow-xl shadow-green-900/20 font-orbitron hover:scale-105 active:scale-95"
                          >
                            <Save className="w-3.5 h-3.5" /> SYNCHRONIZE
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {msg.image && (
                          <div className="mb-5 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900 flex flex-col items-center justify-center min-h-[200px] relative group">
                            <img
                              src={msg.image}
                              alt="Projected Content"
                              className="max-w-full h-auto max-h-[600px] object-contain"
                            />
                          </div>
                        )}
                        <div
                          className={`prose prose-sm md:prose-base max-w-none break-words font-medium tracking-tight ${
                            isUser
                              ? "prose-invert prose-p:text-white prose-strong:text-yellow-300"
                              : isDark
                                ? "prose-invert prose-p:text-neutral-200 prose-headings:text-white"
                                : "prose-p:text-gray-800 prose-headings:text-gray-950"
                          }`}
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              table: ({ node, ...props }: any) => (
                                <div className="my-6 rounded-xl border border-neutral-700/50 overflow-hidden bg-neutral-900/50">
                                  <div className="flex items-center justify-between gap-2 px-4 py-2 bg-neutral-800/50 border-b border-neutral-700/50">
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-blue-400" />
                                      <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                                        Data Sheet
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => handleEditStart(msg)}
                                      className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors hover:bg-neutral-700 text-neutral-500 hover:text-white"
                                    >
                                      <Pencil className="w-3 h-3" /> Edit Sheet
                                    </button>
                                  </div>
                                  <div className="overflow-x-auto">
                                    <table
                                      className="w-full text-left text-sm"
                                      {...props}
                                    />
                                  </div>
                                </div>
                              ),
                              thead: ({ node, ...props }: any) => (
                                <thead
                                  className="bg-neutral-800/50 text-neutral-300 font-bold uppercase tracking-wider text-xs"
                                  {...props}
                                />
                              ),
                              th: ({ node, ...props }: any) => (
                                <th
                                  className="px-4 py-3 border-b border-neutral-700"
                                  {...props}
                                />
                              ),
                              td: ({ node, ...props }: any) => (
                                <td
                                  className="px-4 py-3 border-b border-neutral-800/50"
                                  {...props}
                                />
                              ),
                              tr: ({ node, ...props }: any) => (
                                <tr
                                  className="hover:bg-neutral-800/30 transition-colors"
                                  {...props}
                                />
                              ),
                            }}
                          >
                            {displayContent}
                          </ReactMarkdown>
                        </div>

                        {msg.chart && (
                          <div className="mt-4">
                            <ChartRenderer
                              chartData={msg.chart}
                              themeMode={themeMode}
                            />
                          </div>
                        )}

                        {sptPlanJson && (
                          <div className="mt-4">
                            <button
                              onClick={() => {
                                if (
                                  sptPlanJson &&
                                  onNavigate &&
                                  onExercisePlanPreload
                                ) {
                                  onExercisePlanPreload(sptPlanJson);
                                  onNavigate(AppMode.EXERCISE);
                                  showNotification(t("opening_plan"));
                                }
                              }}
                              className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition-all w-full md:w-auto font-orbitron group relative overflow-hidden ${
                                isDark
                                  ? `${activeBgClass} hover:brightness-110 ${accentColor === "orange" ? "text-black" : "text-white"} shadow-lg ${activeShadowClass}/20`
                                  : "bg-black hover:bg-neutral-800 text-white shadow-lg shadow-black/20"
                              }`}
                            >
                              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
                              <Dumbbell className="w-5 h-5" />
                              <div className="flex flex-col items-start">
                                <span className="text-xs md:text-sm font-black uppercase tracking-wider">
                                  {t("open_spt_generator")}
                                </span>
                                <span className="text-[10px] opacity-80 font-medium">
                                  {t("view_execute_plan")}
                                </span>
                              </div>
                              <Zap className="w-4 h-4 ml-auto text-white/50 group-hover:text-white group-hover:animate-pulse transition-colors" />
                            </button>
                          </div>
                        )}

                        {msg.orderData && !msg.isTyping && (
                          <div className="mt-6 animate-in zoom-in-95 duration-500">
                            <OrderConfirmation
                              order={msg.orderData}
                              isDark={isDark}
                              accentColor={accentColor}
                              onNavigate={onNavigate}
                              onSuccess={(orderId) => {
                                // Update message to show success
                                setMessages((prev) =>
                                  prev.map((m) =>
                                    m.id === msg.id
                                      ? {
                                          ...m,
                                          orderData: {
                                            ...m.orderData,
                                            confirmed: true,
                                            orderId,
                                          },
                                        }
                                      : m,
                                  ),
                                );
                                showNotification(
                                  `Order #${orderId} confirmed! 🏹`,
                                );
                              }}
                            />
                          </div>
                        )}

                        {(msg.isSearching ||
                          (msg.isTyping && !displayContent && !msg.image)) && (
                          <div className="mb-4">
                            <ArcheryLoader
                              isSearching={!!msg.isSearching}
                              startTime={msg.timestamp}
                            />
                          </div>
                        )}

                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-6 pt-6 border-t border-white/5">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 flex items-center gap-2 font-orbitron">
                                <Globe className="w-3.5 h-3.5 text-blue-400" />{" "}
                                VERIFIED SOURCES ({msg.sources.length})
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                              {msg.sources.map((source: any, i: number) => (
                                <a
                                  key={i}
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/5 border border-blue-500/10 text-blue-400 text-xs hover:bg-blue-500/10 transition-colors max-w-[200px]"
                                >
                                  <span className="truncate">
                                    {source.title}
                                  </span>
                                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {!isUser && !msg.isTyping && (
                          <div className="flex items-center gap-1 mt-6 border-t border-white/5 pt-4 opacity-0 group-hover/msg:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleSpeak(msg.content, msg.id)}
                              className={`p-2.5 rounded-xl transition-all ${
                                speakingMessageId === msg.id
                                  ? `${activeBgClass} ${accentColor === "orange" ? "text-black" : "text-white"} shadow-lg ${activeShadowClass}/20`
                                  : `hover:bg-white/5 ${
                                      isDark
                                        ? "text-neutral-500 hover:text-white"
                                        : "text-gray-400 hover:text-black"
                                    }`
                              }`}
                              title="VOICE SYNTHESIS"
                            >
                              {speakingMessageId === msg.id ? (
                                <Square className="w-4 h-4 fill-current" />
                              ) : (
                                <Volume2 className="w-4 h-4" />
                              )}
                            </button>
                            <div
                              className={`w-px h-4 mx-2 ${
                                isDark ? "bg-white/10" : "bg-gray-200"
                              }`}
                            ></div>
                            {[
                              {
                                icon: ThumbsUp,
                                action: () => handleFeedback(msg.id, "like"),
                                title: "OPTIMAL",
                                active: msg.feedback === "like",
                                activeColor: "text-green-500 bg-green-500/10",
                              },
                              {
                                icon: ThumbsDown,
                                action: () => handleFeedback(msg.id, "dislike"),
                                title: "SUBOPTIMAL",
                                active: msg.feedback === "dislike",
                                activeColor: "text-red-500 bg-red-500/10",
                              },
                              {
                                icon: Copy,
                                action: () => handleCopy(msg.content),
                                title: "COPY LINK",
                              },
                              {
                                icon: Share2,
                                action: () => handleShareMessage(msg.content),
                                title: "TRANSMIT",
                              },
                              {
                                icon: RefreshCw,
                                action: () => handleRegenerate(index),
                                title: "RE-SIMULATE",
                              },
                            ].map((tool: any, i: number) => (
                              <button
                                key={i}
                                onClick={tool.action}
                                className={`p-2.5 rounded-xl transition-all ${
                                  tool.active
                                    ? tool.activeColor
                                    : `hover:bg-white/5 ${
                                        isDark
                                          ? "text-neutral-500 hover:text-white"
                                          : "text-gray-400 hover:text-black"
                                      }`
                                }`}
                                title={tool.title}
                              >
                                <tool.icon className="w-4 h-4" />
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {!msg.isTyping && !isUser && !isEditing && (
                    <span
                      className={`text-[10px] mt-2 px-1 font-black opacity-30 font-orbitron uppercase tracking-widest ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      LINK ESTABLISHED •{" "}
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {msg.thoughtTime && (
                        <span className={`ml-2 ${activeTextClass} opacity-80`}>
                          • THOUGHT FOR {(msg.thoughtTime / 1000).toFixed(1)}s
                        </span>
                      )}
                    </span>
                  )}
                  {isUser && !isEditing && (
                    <div className="flex items-center gap-2 mt-2 opacity-30 hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditStart(msg)}
                        className={`p-1 px-2 rounded-lg bg-white/5 border border-white/5 hover:${activeBorderClass}/30 transition-all`}
                      >
                        <Pencil className={`w-3 h-3 ${activeTextClass}`} />
                      </button>
                      <button
                        onClick={() => handleCopy(msg.content)}
                        className={`p-1 px-2 rounded-lg bg-white/5 border border-white/5 hover:${activeBorderClass}/30 transition-all`}
                      >
                        <Copy className={`w-3 h-3 ${activeTextClass}`} />
                      </button>
                      <span
                        className={`text-[9px] font-black font-orbitron ${activeTextClass}/60 uppercase tracking-widest`}
                      >
                        USER INPUT RECEIVED
                      </span>
                    </div>
                  )}
                </div>
                {isUser && (
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br border flex items-center justify-center mt-1 font-black shadow-2xl transition-transform hover:scale-105 overflow-hidden ${
                      isDark
                        ? "from-neutral-700 to-neutral-800 border-neutral-600 text-white"
                        : "from-gray-200 to-gray-300 border-gray-400 text-black"
                    } font-orbitron text-[10px]`}
                  >
                    {userProfile?.avatarUrl ? (
                      <img
                        src={userProfile.avatarUrl}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      "USER"
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex w-full gap-4 justify-start animate-in slide-in-from-bottom-2 pl-12">
              <ArcheryLoader isSearching={false} startTime={Date.now()} />
            </div>
          )}
          <div
            ref={messagesEndRef}
            className="h-8 md:h-12 pointer-events-none"
          />
        </div>

        <div
          className="fixed bottom-0 left-0 right-0 p-2 md:p-3 z-50 pointer-events-none"
          style={{
            background: isDark
              ? "linear-gradient(to top, #050505 0%, #050505 70%, transparent 100%)"
              : "linear-gradient(to top, #f9fafb 0%, #f9fafb 70%, transparent 100%)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto pointer-events-auto"
          >
            {selectedImage && (
              <div
                className={`absolute bottom-full left-2 right-2 md:left-0 mb-4 p-3 md:p-4 rounded-xl md:rounded-[2rem] border shadow-xl flex items-center gap-3 md:gap-5 animate-in fade-in slide-in-from-bottom-2 backdrop-blur-xl ${
                  isDark
                    ? "bg-neutral-900/90 border-white/10"
                    : "bg-white/90 border-gray-200"
                }`}
              >
                <div className="relative">
                  <img
                    alt="Visual Buffer"
                    className={`w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl object-cover shadow-lg border-2 ${activeBorderClass}/50`}
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:gap-2 flex-1 min-w-0">
                  <span
                    className={`text-[9px] md:text-[10px] font-black ${activeTextClass} uppercase tracking-[0.2em] md:tracking-[0.3em] font-orbitron`}
                  >
                    IMAGE READY
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                      if (cameraInputRef.current)
                        cameraInputRef.current.value = "";
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-wider transition-all w-fit ${
                      isDark
                        ? "bg-red-500/10 text-red-500 border border-red-500/20 active:bg-red-500/20"
                        : "bg-red-50 text-red-600 active:bg-red-100"
                    }`}
                  >
                    <X className="w-3 h-3" /> {t("clear").toUpperCase()}
                  </button>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-2 md:gap-4">
              {/* Mobile: Compact single-row toolbar */}
              <div
                className={`flex items-center justify-between gap-2 px-1 md:px-4 transition-all duration-300 ${
                  isLoading ? "opacity-30" : "opacity-100"
                }`}
              >
                {/* Left: Status indicators */}
                <div className="flex items-center gap-1.5 md:gap-3 overflow-hidden">
                  <button
                    type="button"
                    onClick={handleNewChat}
                    className={`flex items-center gap-1.5 px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[8px] md:text-[9px] font-black tracking-wider md:tracking-[0.2em] transition-all border font-orbitron whitespace-nowrap ${
                      isDark
                        ? "bg-white/5 hover:bg-white/10 text-white border-transparent"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600 border-transparent"
                    }`}
                    title="Start New Session"
                  >
                    <PlusCircle className={`w-3 h-3 ${activeTextClass}`} />
                    <span className="hidden xs:inline">
                      {t("new_chat").toUpperCase()}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsIncognito(!isIncognito)}
                    className={`flex items-center gap-1.5 px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[8px] md:text-[9px] font-black tracking-wider md:tracking-[0.2em] transition-all border font-orbitron whitespace-nowrap ${
                      isIncognito
                        ? "bg-red-500/10 text-red-500 border-red-500/30"
                        : `${
                            isDark
                              ? "text-neutral-500 border-transparent"
                              : "text-gray-500 border-transparent"
                          }`
                    }`}
                  >
                    {isIncognito ? (
                      <CloudOff className="w-3 h-3" />
                    ) : (
                      <Cloud className="w-3 h-3" />
                    )}
                    <span className="hidden xs:inline">
                      {isIncognito
                        ? t("incog").toUpperCase()
                        : t("active").toUpperCase()}
                    </span>
                  </button>
                  <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        isLimitReached ? "bg-red-500" : "bg-green-500"
                      } animate-pulse`}
                    ></div>
                    <span className="text-[8px] font-bold tracking-wider text-neutral-500 font-orbitron uppercase">
                      {isLimitReached
                        ? t("limit").toUpperCase()
                        : t("ready").toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Right: Tool buttons */}
                <div className="flex items-center gap-0.5 bg-white/5 p-0.5 md:p-1 rounded-xl border border-white/5">
                  {[
                    {
                      icon: ImageIcon,
                      action: () => fileInputRef.current?.click(),
                      title: t("upload"),
                    },
                    {
                      icon: Camera,
                      action: () => setIsCameraOpen(true),
                      title: t("camera"),
                    },
                    {
                      icon: isListening ? Mic : MicOff,
                      action: toggleDictation,
                      title: t("voice"),
                      active: isListening,
                      activeColor: "text-red-500 bg-red-500/10",
                    },
                    {
                      icon: Sparkles,
                      action: handleEnhance,
                      title: t("enhance"),
                      disabled: isEnhancing || !input.trim(),
                      active: isEnhancing,
                      activeColor: "text-purple-500 bg-purple-500/10",
                    },
                    {
                      icon: isFocusMode ? Minimize : Maximize,
                      action: onToggleFocusMode,
                      title: isFocusMode
                        ? t("exit_full_screen")
                        : t("full_screen"),
                      active: isFocusMode,
                      activeColor: `${activeTextClass} ${activeBgClass}/10`,
                    },
                  ].map((tool, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={tool.action}
                      disabled={tool.disabled}
                      className={`p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all active:scale-90 ${
                        tool.active
                          ? tool.activeColor
                          : isDark
                            ? `text-neutral-400 active:text-orange-400 active:bg-white/10`
                            : `text-gray-500 active:text-orange-600 active:bg-gray-100`
                      } ${
                        tool.disabled
                          ? "opacity-20 cursor-not-allowed"
                          : "opacity-100"
                      }`}
                      title={tool.title}
                    >
                      <tool.icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Main input bar */}
              <div
                className={`flex items-center gap-0 backdrop-blur-xl rounded-2xl md:rounded-[2.5rem] border transition-all p-1 md:p-2 shadow-lg md:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] ${
                  isDark
                    ? `bg-neutral-900/60 border-white/10 focus-within:${activeBorderClass}/50`
                    : `bg-white border-gray-200 focus-within:${activeBorderClass}/30`
                }`}
              >
                {/* Model selector - compact on mobile */}
                <div
                  className="relative flex items-center"
                  ref={modelSelectorRef}
                >
                  {isModelSelectorOpen && (
                    <div className="absolute bottom-full left-0 mb-3 z-[70] bg-neutral-950/98 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-[2rem] p-3 md:p-4 w-64 md:w-80 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-300">
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/5 px-2 md:px-4 font-orbitron">
                        <p className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                          SELECT MODEL
                        </p>
                        <Zap
                          className={`w-3 h-3 md:w-3.5 md:h-3.5 ${activeTextClass} animate-pulse`}
                        />
                      </div>
                      <div className="space-y-1 md:space-y-2">
                        {models.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => {
                              setSelectedModel(m.name);
                              setIsModelSelectorOpen(false);
                              showNotification(`Model: ${m.name} 🚀`);
                            }}
                            className={`w-full flex items-center justify-between p-2.5 md:p-4 rounded-xl md:rounded-[1.5rem] transition-all active:scale-95 ${
                              selectedModel === m.name
                                ? "bg-white/10 border border-white/10"
                                : "active:bg-white/5"
                            }`}
                          >
                            <div className="flex flex-col items-start gap-0.5">
                              <span
                                className={`text-[10px] md:text-xs font-black font-orbitron uppercase tracking-tight ${m.color}`}
                              >
                                {m.name}
                              </span>
                              <span className="text-[8px] md:text-[9px] text-neutral-600 font-bold tracking-wider uppercase">
                                {m.provider}
                              </span>
                            </div>
                            {selectedModel === m.name && (
                              <div
                                className={`w-2 h-2 rounded-full ${activeBgClass} ${activeShadowClass}`}
                              ></div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsModelSelectorOpen(!isModelSelectorOpen)}
                    className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-3 md:py-4 rounded-xl md:rounded-2xl transition-all pointer-events-auto border ${
                      isDark
                        ? "bg-white/5 border-white/5 active:bg-white/10"
                        : "bg-gray-100 border-gray-200 active:bg-gray-200"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${activeBgClass} ${activeShadowClass}/80 animate-pulse`}
                    ></div>
                    <span
                      className={`text-[9px] md:text-[10px] font-black font-orbitron uppercase tracking-wider max-w-[120px] md:max-w-none truncate ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {selectedModel}
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 md:w-3.5 md:h-3.5 transition-transform duration-300 ${
                        isModelSelectorOpen ? "rotate-180" : ""
                      } ${isDark ? "text-neutral-500" : "text-gray-400"}`}
                    />
                  </button>
                </div>

                {/* Divider */}
                <div
                  className={`w-px h-8 md:h-10 mx-1 ${
                    isDark ? "bg-white/10" : "bg-gray-200"
                  }`}
                ></div>

                {/* Text input */}
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder={
                    isLimitReached
                      ? t("limit_reached")
                      : isListening
                        ? "Listening..."
                        : t("type_message")
                  }
                  className={`flex-1 bg-transparent px-2 md:px-4 py-3 md:py-4 min-h-[44px] md:min-h-[56px] max-h-32 md:max-h-56 focus:outline-none resize-none font-medium text-sm md:text-base tracking-tight leading-relaxed ${
                    isLimitReached ? "cursor-not-allowed opacity-30" : ""
                  } ${inputPlaceholder}`}
                  rows={1}
                  disabled={isLimitReached}
                />

                {/* Send button */}
                <button
                  type={isLoading ? "button" : "submit"}
                  onClick={isLoading ? handleStop : undefined}
                  disabled={
                    !isLoading &&
                    (isLimitReached || (!input.trim() && !selectedImage))
                  }
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-full flex items-center justify-center transition-all flex-shrink-0 mr-0.5 md:mr-1 active:scale-90 ${
                    !isLoading &&
                    (isLimitReached || (!input.trim() && !selectedImage))
                      ? isDark
                        ? "bg-white/5 text-white/20 cursor-not-allowed"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : `bg-gradient-to-r ${activeGradient} text-white shadow-lg shadow-${accentColor}-500/20`
                  }`}
                >
                  {isLoading ? (
                    <Square className="w-4 h-4 md:w-5 md:h-5 fill-current animate-pulse" />
                  ) : isLimitReached ? (
                    <Lock className="w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    <Send className="w-4 h-4 md:w-5 md:h-5 transform rotate-[-10deg]" />
                  )}
                </button>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <input
              type="file"
              ref={cameraInputRef}
              onChange={handleCameraFileChange}
              accept="image/*"
              capture="environment"
              className="hidden"
            />
            <CameraModal
              isOpen={isCameraOpen}
              onClose={() => setIsCameraOpen(false)}
              onCapture={(img) => {
                setSelectedImage(img);
                setIsCameraOpen(false);
              }}
              isDark={isDark}
              activeTextClass={activeTextClass}
              activeBgClass={activeBgClass}
              activeGradient={activeGradient}
            />
          </form>
        </div>
      </div>
    );
  },
);

// --- Sub-components ---

const OrderConfirmation: React.FC<{
  order: any;
  isDark: boolean;
  accentColor: string;
  onNavigate?: (mode: AppMode) => void;
  onSuccess: (orderId: string) => void;
}> = ({ order, isDark, accentColor, onNavigate, onSuccess }) => {
  const bgColors: Record<string, string> = {
    orange: "bg-[#FFD700]",
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    red: "bg-red-500",
    pink: "bg-pink-500",
    teal: "bg-teal-500",
    cyan: "bg-cyan-500",
    indigo: "bg-indigo-500",
  };
  const activeBgClass = bgColors[accentColor] || bgColors.orange;

  const textColors: Record<string, string> = {
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
  const activeTextClass = textColors[accentColor] || textColors.orange;

  const borderColors: Record<string, string> = {
    orange: "border-[#FFD700]",
    blue: "border-blue-500",
    green: "border-green-500",
    purple: "border-purple-500",
    red: "border-red-500",
    pink: "border-pink-500",
    teal: "border-teal-500",
    cyan: "border-cyan-500",
    indigo: "border-indigo-500",
  };
  const activeBorderClass = borderColors[accentColor] || borderColors.orange;

  const shadowColors: Record<string, string> = {
    orange: "shadow-[#FFD700]",
    blue: "shadow-blue-500",
    green: "shadow-green-500",
    purple: "shadow-purple-500",
    red: "shadow-red-500",
    pink: "shadow-pink-500",
    teal: "shadow-teal-500",
    cyan: "shadow-cyan-500",
    indigo: "shadow-indigo-500",
  };
  const activeShadowClass = shadowColors[accentColor] || shadowColors.orange;
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [savedPayments, setSavedPayments] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("x10minds_saved_payments");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSavedPayments(parsed);
      if (parsed.length > 0) setSelectedPayment(parsed[0]);
    }
  }, []);

  const handleConfirm = () => {
    if (!selectedPayment) return;
    setIsConfirming(true);

    setTimeout(() => {
      const orderId = Math.floor(Math.random() * 90000) + 10000;
      const newOrder = {
        id: orderId.toString(),
        productId: order.productId,
        name: order.name,
        total: (order.price * (order.quantity || 1)).toFixed(2),
        status: "Processing",
        date: new Date().toLocaleDateString(),
        timestamp: Date.now(),
        items: order.quantity || 1,
        color: order.color,
        size: order.size,
      };

      // Save to global orders
      const existingOrders = JSON.parse(
        localStorage.getItem("x10minds_shop_orders") || "[]",
      );
      localStorage.setItem(
        "x10minds_shop_orders",
        JSON.stringify([newOrder, ...existingOrders]),
      );

      setIsConfirming(false);
      onSuccess(orderId.toString());
    }, 2000);
  };

  if (order.confirmed) {
    return (
      <div
        className={`p-6 rounded-3xl border border-green-500/30 bg-green-500/5 backdrop-blur-xl`}
      >
        <div className="flex items-center gap-3 text-green-500 mb-2">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
            <CheckCircle size={16} />
          </div>
          <p className="font-orbitron font-black uppercase tracking-widest text-sm">
            Order Confirmed
          </p>
        </div>
        <p
          className={`text-xs ${isDark ? "text-neutral-400" : "text-gray-500"}`}
        >
          Order #{order.orderId} for {order.name} has been placed successfully.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`p-6 rounded-3xl border ${isDark ? "bg-neutral-900/50 border-white/10" : "bg-white border-gray-200"} backdrop-blur-xl shadow-2xl`}
    >
      <h4
        className={`text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 ${isDark ? "text-white/40" : "text-gray-500"} font-orbitron`}
      >
        <ShoppingBag size={14} /> Review Your Order
      </h4>

      <div className="flex items-center gap-4 mb-6">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden border ${isDark ? "bg-black/20 border-white/5" : "bg-gray-50 border-gray-100"}`}
        >
          <img
            src={(() => {
              const name = order.name?.toLowerCase() || "";
              if (name.includes("stratos"))
                return "/images/products/Hoyt Stratos bow.jpg";
              if (name.includes("atf-x"))
                return "/images/products/ATF-X bow image.jpg";
              if (name.includes("title 36"))
                return "/images/products/Mathese title 36 bow.jpg";
              if (name.includes("pro tour"))
                return "/images/products/Easton proTour arrow.jpg";
              if (name.includes("achieve xp"))
                return "/images/products/Axcel sight.jpg";
              if (name.includes("plunger"))
                return "/images/products/biater plunger button.jpg";
              if (name.includes("edge stabilizer"))
                return "/images/products/ramrod stabilizer set.jpg";
              if (name.includes("saker 2"))
                return "/images/products/FIvics FINGER TAB.jpg";
              if (name.includes("formula xd"))
                return "/images/products/Hoyt XD recurve bow.jpg";
              if (name.includes("mk x10"))
                return "/images/products/MK recurve bow.png";
              if (name.includes("ns graphene"))
                return "/images/products/win and win NS grahpen carbon limb.jpg";
              if (name.includes("quiver"))
                return "/images/products/Legend Archery Quiver.jpg";
              if (name.includes("arm guard"))
                return "/images/products/Arm guard elite.jpg";
              if (name.includes("a/c/e") || name.includes(" ace "))
                return "/images/products/Easton ACE arrow.jpg";
              if (name.includes("superdrive"))
                return "/images/products/easton superdrive 23.jpg";
              if (name.includes("ps23"))
                return "/images/products/black eagle ps23.png";
              if (name.includes("block"))
                return "/images/products/block 6x6 target.jpg";
              if (name.includes("everest"))
                return "/images/products/legend everest 44 case.jpg";
              if (name.includes("compound case"))
                return "/images/products/easton duluxe compound case(2).jpg";
              if (name.includes("recurve case"))
                return "/images/products/SKB iseries recurve case.jpg";
              if (name.includes("target face"))
                return "/images/products/target face 80 cm.jpg";
              return `/images/products/${order.name}.jpg`;
            })()}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) =>
              (e.currentTarget.src = "/images/products/Hoyt Stratos bow.jpg")
            }
          />
        </div>
        <div className="flex-1">
          <p
            className={`font-black uppercase tracking-tight ${isDark ? "text-white" : "text-black"}`}
          >
            {order.name}
          </p>
          <p className={`text-xs ${activeTextClass} font-black`}>
            ${order.price} x {order.quantity || 1}
          </p>
          <div className="flex gap-2 mt-1">
            {order.color && (
              <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 text-neutral-500 border border-white/5">
                {order.color}
              </span>
            )}
            {order.size && (
              <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 text-neutral-500 border border-white/5">
                {order.size}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <p
          className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-neutral-500" : "text-gray-400"}`}
        >
          Payment Method
        </p>
        {savedPayments.length > 0 ? (
          <div className="space-y-2">
            {savedPayments.map((pm) => (
              <button
                key={pm.id}
                onClick={() => setSelectedPayment(pm)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                  selectedPayment?.id === pm.id
                    ? `${activeBorderClass} ${activeBgClass}/10`
                    : "border-white/5 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  {pm.type === "CARD" ? (
                    <CreditCardIcon size={14} className="text-blue-400" />
                  ) : (
                    <div className="text-[10px] font-black text-green-500">
                      UPI
                    </div>
                  )}
                  <span
                    className={`text-xs font-bold ${isDark ? "text-white" : "text-black"}`}
                  >
                    {pm.label}
                  </span>
                </div>
                {selectedPayment?.id === pm.id && (
                  <div
                    className={`w-2 h-2 rounded-full ${activeBgClass} ${activeShadowClass}/50`}
                  ></div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="p-3 rounded-xl border border-dashed border-white/10 text-center">
            <p className="text-[10px] font-medium text-neutral-500 mb-2">
              No payment methods saved
            </p>
            <button
              onClick={() => onNavigate?.(AppMode.SETTINGS)}
              className={`text-[10px] font-black uppercase tracking-widest ${activeTextClass} hover:underline`}
            >
              Add Payment Method
            </button>
          </div>
        )}
      </div>

      <button
        onClick={handleConfirm}
        disabled={!selectedPayment || isConfirming}
        className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 transition-all ${
          !selectedPayment || isConfirming
            ? "bg-white/5 text-white/20 cursor-not-allowed"
            : `${activeBgClass} ${accentColor === "orange" ? "text-black" : "text-white"} hover:brightness-110 active:scale-95 shadow-xl ${activeShadowClass}/20`
        }`}
      >
        {isConfirming ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            Confirm Payment ${(order.price * (order.quantity || 1)).toFixed(2)}
            <ArrowRight size={14} />
          </>
        )}
      </button>
    </div>
  );
};

export default ChatInterface;
