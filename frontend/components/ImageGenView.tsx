import React, { useState, useRef } from "react";
import {
  Image as ImageIcon,
  Sparkles,
  Upload,
  ArrowRight,
  Loader2,
  Lock,
  Crown,
  Palette,
  Wand2,
  Maximize,
  Smartphone,
  Monitor,
} from "lucide-react";
import {
  generateCorrectedFormImage,
  generateImageFromPrompt,
  enhanceImagePrompt,
} from "../services/geminiService";
import { UserProfile } from "../types";

interface ImageGenViewProps {
  user: UserProfile | null;
  onUpgrade: () => void;
  themeMode?: "dark" | "light";
  accentColor?: string;
  onImageGenerated?: () => void;
}

const ImageGenView: React.FC<ImageGenViewProps> = ({
  user,
  onUpgrade,
  themeMode = "dark",
  accentColor = "orange",
  onImageGenerated,
}) => {
  const [activeTab, setActiveTab] = useState<"form" | "studio">("form");

  // Form Correction State
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [generatedFormImage, setGeneratedFormImage] = useState<string | null>(
    null
  );

  // Creative Studio State
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Realistic");
  const [aspectRatio, setAspectRatio] = useState<
    "square" | "portrait" | "landscape"
  >("square");
  const [generatedStudioImage, setGeneratedStudioImage] = useState<
    string | null
  >(null);
  const [gallery, setGallery] = useState<{ url: string; prompt: string }[]>([]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDark = themeMode === "dark";
  const bgClass = isDark ? "bg-neutral-950" : "bg-gray-50";
  const cardClass = isDark
    ? "bg-neutral-900 border-neutral-800"
    : "bg-white border-gray-200 shadow-md";
  const headerText = isDark ? "text-white" : "text-gray-900";
  const subText = isDark ? "text-neutral-400" : "text-gray-500";
  const inputBg = isDark
    ? "bg-black border-neutral-800 text-white"
    : "bg-white border-gray-200 text-gray-900";

  const accentClasses: Record<string, string> = {
    orange: "from-orange-600 to-red-600 text-orange-500",
    blue: "from-blue-600 to-indigo-600 text-blue-500",
    green: "from-green-600 to-emerald-600 text-green-500",
    purple: "from-purple-600 to-pink-600 text-purple-500",
  };

  const currentAccent = accentClasses[accentColor] || accentClasses.orange;
  const accentGradient = currentAccent.split(" text-")[0];
  const accentText = currentAccent.split(" text-")[1];
  const accentBg = isDark ? "bg-neutral-800" : "bg-gray-100";

  const isPro =
    user?.subscriptionTier === "Pro" || user?.subscriptionTier === "Ultra";
  const isCharge = user?.subscriptionTier === "Charge";
  const imagesGenerated = user?.imagesGenerated || 0;
  const imageLimit = isPro ? Infinity : isCharge ? 10 : 2;
  const canGenerate = imagesGenerated < imageLimit;
  const imagesRemaining = isPro
    ? Infinity
    : Math.max(0, imageLimit - imagesGenerated);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
        setGeneratedFormImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateForm = async () => {
    if (!sourceImage || !canGenerate) return;
    setIsGenerating(true);
    try {
      const result = await generateCorrectedFormImage(sourceImage);
      setGeneratedFormImage(result);
      onImageGenerated?.();
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhanceImagePrompt(prompt);
      setPrompt(enhanced);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerateStudio = async () => {
    if (!prompt.trim() || !canGenerate) return;
    setIsGenerating(true);
    try {
      // Enhanced prompt logic for "Super Good" results
      const qualityTags =
        "masterpiece, best quality, highly detailed, 8k resolution, ray tracing, volumetric lighting, photorealistic, vivid colors, cinematic composition, trending on artstation";
      const finalPrompt = `${prompt}, ${style} style, ${qualityTags}`;

      const result = await generateImageFromPrompt(finalPrompt, aspectRatio);
      if (result) {
        setGeneratedStudioImage(result);
        setGallery((prev) => [{ url: result, prompt }, ...prev]);
        onImageGenerated?.();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const styles = [
    "Realistic Photographical",
    "Cinematic Unreal Engine 5",
    "Anime Visual Novel",
    "Cyberpunk Neon",
    "Oil Painting Classic",
    "Professional Watercolor",
    "Charcoal Sketch",
    "3D Pixar Render",
    "Vaporwave Aesthetics",
    "Film Noir Style",
    "Hyper-Realistic Portrait",
    "Concept Art Illustration",
  ];

  return (
    <div className={`p-4 md:p-8 ${bgClass}`}>
      <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2
            className={`text-3xl font-bold mb-2 flex items-center gap-3 ${headerText}`}
          >
            {activeTab === "form" ? (
              <>
                <Sparkles className={`w-8 h-8 ${accentText}`} /> Form Perfector
              </>
            ) : (
              <>
                <Palette className={`w-8 h-8 ${accentText}`} /> Creative Studio
              </>
            )}
          </h2>
          <p className={subText}>
            {activeTab === "form"
              ? "Upload a photo to visualize corrected biomechanics."
              : "Turn your ideas into stunning archery visuals with AI."}
          </p>
        </div>
        {!isPro && (
          <div
            className={`px-4 py-2 rounded-xl border text-sm font-bold flex items-center gap-2 ${
              isDark
                ? "bg-neutral-900 border-neutral-800 text-neutral-300"
                : "bg-white border-gray-200 text-gray-700 shadow-sm"
            }`}
          >
            <ImageIcon className={`w-4 h-4 ${accentText}`} />
            {imagesRemaining} Free Visualizations Left
          </div>
        )}
      </header>

      {/* Mode Switcher */}
      <div
        className={`flex p-1 rounded-xl mb-8 w-fit ${
          isDark
            ? "bg-neutral-900 border border-neutral-800"
            : "bg-gray-100 border border-gray-200"
        }`}
      >
        <button
          onClick={() => setActiveTab("form")}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "form"
              ? `bg-gradient-to-r ${accentGradient} text-white shadow-md`
              : `${subText} hover:${headerText}`
          }`}
        >
          <Sparkles className="w-4 h-4" /> Form Perfector
        </button>
        <button
          onClick={() => setActiveTab("studio")}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "studio"
              ? `bg-gradient-to-r ${accentGradient} text-white shadow-md`
              : `${subText} hover:${headerText}`
          }`}
        >
          <Palette className="w-4 h-4" /> Creative Studio
        </button>
      </div>

      {!canGenerate && (
        <div
          className={`mb-8 p-6 rounded-2xl border flex items-center gap-4 ${
            isDark
              ? "bg-red-900/10 border-red-900/30"
              : "bg-red-50 border-red-100"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-bold ${headerText}`}>
              Feature Locked
            </h3>
            <p className={`text-sm ${subText}`}>
              You've reached your free limit (2 images). Upgrade to generate
              unlimited images.
            </p>
          </div>
          <button
            onClick={onUpgrade}
            className={`px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-900/20 flex items-center gap-2`}
          >
            <Crown className="w-4 h-4" /> Upgrade
          </button>
        </div>
      )}

      {activeTab === "form" ? (
        // FORM PERFECTOR UI
        <div className="flex flex-col lg:flex-row gap-8 items-stretch min-h-[500px]">
          {/* Input */}
          <div
            className={`flex-1 rounded-2xl border p-4 flex flex-col relative group ${cardClass}`}
          >
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white z-10">
              YOUR UPLOAD
            </div>
            <div
              onClick={() => canGenerate && fileInputRef.current?.click()}
              className={`flex-1 border-2 border-dashed rounded-xl flex items-center justify-center transition-all overflow-hidden relative cursor-pointer ${
                sourceImage
                  ? "border-transparent"
                  : isDark
                  ? "border-neutral-700 hover:border-orange-500 hover:bg-neutral-800/50"
                  : "border-gray-300 hover:border-blue-500 hover:bg-gray-100/50"
              } ${!canGenerate && "pointer-events-none opacity-50"}`}
            >
              {sourceImage ? (
                <img
                  src={sourceImage}
                  alt="Source"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-6">
                  <Upload
                    className={`w-12 h-12 mx-auto mb-4 ${
                      isDark ? "text-neutral-600" : "text-gray-400"
                    }`}
                  />
                  <p className={`font-medium ${subText}`}>
                    Click to upload photo
                  </p>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
              disabled={!canGenerate}
            />
          </div>

          <div className="flex flex-col items-center justify-center">
            <button
              onClick={handleGenerateForm}
              disabled={!sourceImage || isGenerating || !canGenerate}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all ${
                !sourceImage || !canGenerate
                  ? "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                  : isGenerating
                  ? "bg-neutral-800 text-orange-500"
                  : `bg-gradient-to-r ${accentGradient} text-white hover:scale-110 shadow-orange-500/20`
              }`}
            >
              {isGenerating ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <ArrowRight className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Output */}
          <div
            className={`flex-1 rounded-2xl border p-4 flex flex-col relative ${cardClass}`}
          >
            <div
              className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white z-10 bg-gradient-to-r ${accentGradient}`}
            >
              AI CORRECTED
            </div>
            <div
              className={`flex-1 rounded-xl flex items-center justify-center overflow-hidden border ${
                isDark
                  ? "bg-black/50 border-neutral-800"
                  : "bg-gray-100 border-gray-200"
              }`}
            >
              {generatedFormImage ? (
                <img
                  src={generatedFormImage}
                  alt="Generated"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center">
                  {isGenerating ? (
                    <>
                      <Loader2
                        className={`w-10 h-10 animate-spin mb-4 ${accentText}`}
                      />
                      <p className={`text-sm ${subText} animate-pulse`}>
                        Analyzing biomechanics...
                      </p>
                    </>
                  ) : (
                    <>
                      <ImageIcon
                        className={`w-12 h-12 mb-4 opacity-20 ${subText}`}
                      />
                      <p className={`text-sm ${subText}`}>
                        Result appears here
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // CREATIVE STUDIO UI
        <div className="grid lg:grid-cols-3 gap-8 h-auto lg:h-[calc(100vh-250px)]">
          <div
            className={`lg:col-span-1 p-6 rounded-3xl border flex flex-col gap-6 overflow-y-auto ${cardClass}`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className={`block text-xs font-bold uppercase tracking-wider ${subText}`}
                >
                  Prompt
                </label>
                <button
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancing || !prompt.trim()}
                  className={`text-[10px] flex items-center gap-1 font-bold uppercase tracking-wider ${accentText} hover:brightness-110 disabled:opacity-50`}
                >
                  {isEnhancing ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  Enhance
                </button>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your archery scene (e.g., 'Futuristic archer with neon bow in cyberpunk city')"
                className={`w-full h-32 rounded-xl p-4 resize-none transition-all outline-none border focus:border-opacity-100 ${inputBg} ${
                  isDark ? "focus:border-white" : "focus:border-black"
                }`}
                disabled={!canGenerate}
              />
            </div>

            {/* Aspect Ratio */}
            <div>
              <label
                className={`block text-xs font-bold uppercase tracking-wider mb-2 ${subText}`}
              >
                Aspect Ratio
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "square", icon: Maximize, label: "1:1" },
                  { id: "portrait", icon: Smartphone, label: "3:4" },
                  { id: "landscape", icon: Monitor, label: "16:9" },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setAspectRatio(r.id as any)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                      aspectRatio === r.id
                        ? `${accentBg} border-transparent text-white`
                        : isDark
                        ? "border-neutral-700 hover:bg-neutral-800"
                        : "border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <r.icon className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                className={`block text-xs font-bold uppercase tracking-wider mb-2 ${subText}`}
              >
                Art Style
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                {styles.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    disabled={!canGenerate}
                    className={`px-3 py-2 rounded-lg text-sm text-center transition-all border ${
                      style === s
                        ? `${
                            isDark
                              ? "bg-white text-black border-white"
                              : "bg-black text-white border-black"
                          }`
                        : `${
                            isDark
                              ? "bg-neutral-800 text-neutral-400 border-transparent hover:bg-neutral-700"
                              : "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200"
                          }`
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateStudio}
              disabled={!prompt.trim() || isGenerating || !canGenerate}
              className={`mt-auto w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                !prompt.trim() || !canGenerate
                  ? "bg-neutral-800 text-gray-500 cursor-not-allowed"
                  : isGenerating
                  ? "bg-neutral-800 text-gray-400"
                  : `bg-gradient-to-r ${accentGradient} text-white shadow-lg hover:shadow-${
                      accentText.split("-")[1]
                    }-500/20 hover:scale-[1.02]`
              }`}
            >
              {isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Wand2 className="w-5 h-5" />
              )}
              {isGenerating ? "Dreaming..." : "Generate Artwork"}
            </button>
          </div>

          <div className={`lg:col-span-2 flex flex-col gap-4 h-full`}>
            {/* Main Canvas */}
            <div
              className={`flex-1 rounded-3xl border flex items-center justify-center relative overflow-hidden ${cardClass} ${
                isDark ? "bg-black/40" : "bg-gray-50"
              }`}
            >
              {generatedStudioImage ? (
                <img
                  src={generatedStudioImage}
                  alt="Generated Studio"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center text-center max-w-sm p-6">
                  {isGenerating ? (
                    <>
                      <div className={`relative mb-6`}>
                        <div
                          className={`absolute inset-0 blur-xl opacity-20 bg-gradient-to-r ${accentGradient} rounded-full animate-pulse`}
                        ></div>
                        <Loader2
                          className={`w-16 h-16 animate-spin relative z-10 ${accentText}`}
                        />
                      </div>
                      <h3 className={`text-xl font-bold mb-2 ${headerText}`}>
                        Creating Masterpiece
                      </h3>
                      <p className={subText}>
                        Our AI is painting your vision pixel by pixel...
                      </p>
                    </>
                  ) : (
                    <>
                      <div
                        className={`w-20 h-20 rounded-2xl mb-6 flex items-center justify-center ${
                          isDark ? "bg-neutral-800" : "bg-white shadow-sm"
                        }`}
                      >
                        <Palette
                          className={`w-10 h-10 ${
                            isDark ? "text-neutral-600" : "text-gray-300"
                          }`}
                        />
                      </div>
                      <h3 className={`text-xl font-bold mb-2 ${headerText}`}>
                        Your Canvas is Empty
                      </h3>
                      <p className={subText}>
                        Enter a prompt and choose a style to generate
                        high-quality archery art.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Gallery Strip */}
            {gallery.length > 0 && (
              <div
                className={`h-24 rounded-2xl border p-2 flex gap-2 overflow-x-auto ${cardClass}`}
              >
                {gallery.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setGeneratedStudioImage(item.url);
                      setPrompt(item.prompt);
                    }}
                    className="h-full aspect-square rounded-xl overflow-hidden border border-transparent hover:border-white transition-all relative group flex-shrink-0"
                  >
                    <img
                      src={item.url}
                      alt="Gallery"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenView;
