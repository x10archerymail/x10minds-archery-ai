import * as React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  User,
  Target,
  Activity,
  Camera,
  X,
  Trash2,
  Maximize2,
} from "lucide-react";
import { analyzeArcheryImage } from "../services/geminiService";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

interface AnalysisViewProps {
  type: "FORM" | "TARGET";
  themeMode?: "dark" | "light";
  accentColor?: string;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES = 5;

const AnalysisView: React.FC<AnalysisViewProps> = React.memo(
  ({ type, themeMode = "dark", accentColor = "orange" }: AnalysisViewProps) => {
    const [analysisMode, setAnalysisMode] = useState<"FORM" | "TARGET">(
      type || "FORM",
    );
    const [images, setImages] = useState<string[]>([]);
    const [result, setResult] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [equipmentData, setEquipmentData] = useState({
      bowType: "Recurve",
      bowHeight: "",
      drawWeight: "",
      limbs: "",
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const isDark = themeMode === "dark";
    const bgClass = isDark ? "bg-[#000]" : "bg-gray-50";
    const cardClass = isDark
      ? "bg-[#0A0A0A] border-white/5 shadow-2xl shadow-black"
      : "bg-white border-gray-100 shadow-xl shadow-gray-200/40";
    const headerText = isDark ? "text-white" : "text-gray-950 text-shadow-sm";
    const subText = isDark ? "text-gray-500" : "text-gray-400";

    const themes: Record<
      string,
      { gradient: string; text: string; bg: string }
    > = {
      orange: {
        gradient: "from-[#FFD700] via-[#FDB931] to-[#FFD700]",
        text: "text-[#FFD700]",
        bg: "bg-[#FFD700]",
      },
      blue: {
        gradient: "from-blue-400 to-indigo-600",
        text: "text-blue-400",
        bg: "bg-blue-600",
      },
      green: {
        gradient: "from-emerald-400 to-green-600",
        text: "text-emerald-400",
        bg: "bg-green-600",
      },
      purple: {
        gradient: "from-purple-400 to-pink-600",
        text: "text-purple-400",
        bg: "bg-purple-600",
      },
      red: {
        gradient: "from-red-400 to-red-600",
        text: "text-red-400",
        bg: "bg-red-600",
      },
      pink: {
        gradient: "from-pink-400 to-rose-600",
        text: "text-pink-400",
        bg: "bg-pink-600",
      },
      teal: {
        gradient: "from-teal-400 to-cyan-600",
        text: "text-teal-400",
        bg: "bg-teal-600",
      },
      cyan: {
        gradient: "from-cyan-400 to-blue-600",
        text: "text-cyan-400",
        bg: "bg-cyan-600",
      },
      indigo: {
        gradient: "from-indigo-400 to-purple-600",
        text: "text-indigo-400",
        bg: "bg-indigo-600",
      },
    };

    const currentTheme = themes[accentColor] || themes.orange;
    const accentGradient = currentTheme.gradient;
    const accentText = currentTheme.text;
    const accentBg = currentTheme.bg;
    const goldColor = "#FFD700";

    useEffect(() => {
      return () => {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      };
    }, [stream]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (images.length + files.length > MAX_IMAGES) {
        setError(`You can only upload up to ${MAX_IMAGES} images.`);
        return;
      }

      const validFiles = files.filter((file: File) => {
        if (file.size > MAX_IMAGE_SIZE) {
          setError(`File ${file.name} is too large. Maximum size is 5MB.`);
          return false;
        }
        return true;
      });

      validFiles.forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((prev) =>
            [...prev, reader.result as string].slice(0, MAX_IMAGES),
          );
          setResult(null);
          setError(null);
        };
        reader.readAsDataURL(file);
      });

      if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeImage = (index: number) => {
      setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const startCamera = async () => {
      if (images.length >= MAX_IMAGES) {
        setError(`You can only upload up to ${MAX_IMAGES} images.`);
        return;
      }
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setIsCameraOpen(true);
        setError(null);
      } catch (err) {
        console.error("Camera error:", err);
        setError("Could not access camera. Please check permissions.");
      }
    };

    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setStream(null);
      setIsCameraOpen(false);
    };

    const takePhoto = () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = canvas.toDataURL("image/jpeg", 0.8);
          setImages((prev) => [...prev, imageData].slice(0, MAX_IMAGES));
          setResult(null);
          stopCamera();
        }
      }
    };

    const handleAnalyze = async () => {
      if (images.length === 0) return;

      setIsAnalyzing(true);
      setError(null);
      try {
        const equipInfo = `EQUIPMENT CONTEXT: Type: ${equipmentData.bowType}, Height: ${equipmentData.bowHeight}", Draw Weight: ${equipmentData.drawWeight}lbs, Limbs: ${equipmentData.limbs}. `;
        const prompt =
          analysisMode === "FORM"
            ? `${equipInfo}Analyze these archer's form images in detail. Identify the bow type (Recurve/Compound). Check stance, grip, draw elbow position, anchor point, and alignment across all provided angles. Provide 3 specific improvements based on these images.`
            : `${equipInfo}Analyze these target face images. Estimate the total score (assuming standard 10-zone scoring). Describe the group pattern (tightness, location relative to center). Suggest potential tuning or technique adjustments based on the arrow spread shown in these photos.`;

        const analysis = await analyzeArcheryImage(images, prompt);
        setResult(analysis);
      } catch (err) {
        console.error(err);
        setError("Failed to analyze images. Please try again.");
      } finally {
        setIsAnalyzing(false);
      }
    };

    return (
      <div
        className={`p-4 md:p-8 min-h-screen ${bgClass} transition-colors duration-500`}
      >
        <div className="max-w-[2000px] mx-auto">
          <header className="mb-12 animate-in fade-in slide-in-from-top-6 duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-[#FFD700] font-black tracking-[0.4em] uppercase text-[10px] mb-6 block"
                >
                  Intelligence Component // {analysisMode}_SCAN
                </motion.span>
                <h2
                  className={`text-5xl md:text-7xl font-black mb-6 tracking-tighter ${headerText} leading-none`}
                >
                  {analysisMode === "FORM" ? (
                    <>
                      Form <span className={accentText}>Check</span>
                    </>
                  ) : (
                    <>
                      Target <span className={accentText}>Scan</span>
                    </>
                  )}
                </h2>
                <p
                  className={`${subText} text-sm font-black uppercase tracking-[0.2em] leading-loose max-w-2xl`}
                >
                  {analysisMode === "FORM"
                    ? "Neural-scan your draw position from multiple tactical vectors for elite technical feedback."
                    : "Synchronize target face optics to calculate atmospheric precision and grouping density."}
                </p>
              </div>

              {/* Analysis Mode Toggle */}
              <div
                className={`flex bg-neutral-900/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md self-start md:self-center mb-6 md:mb-0`}
              >
                <button
                  onClick={() => setAnalysisMode("FORM")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                    analysisMode === "FORM"
                      ? `bg-${accentColor}-600 text-white shadow-lg shadow-${accentColor}-600/20`
                      : "text-neutral-500 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <User className="w-4 h-4" />
                  Form
                </button>
                <button
                  onClick={() => setAnalysisMode("TARGET")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                    analysisMode === "TARGET"
                      ? `bg-${accentColor}-600 text-white shadow-lg shadow-${accentColor}-600/20`
                      : "text-neutral-500 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Target className="w-4 h-4" />
                  Target
                </button>
              </div>
            </div>
          </header>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3 animate-in zoom-in-95 duration-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto hover:bg-red-500/20 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
            {/* Upload Section */}
            <div className="space-y-6 lg:sticky lg:top-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={images.length >= MAX_IMAGES}
                  className={`
                    flex flex-col items-center justify-center p-12 rounded-[2rem] border-2 border-dashed transition-all duration-500 group relative overflow-hidden
                    ${
                      images.length >= MAX_IMAGES
                        ? "opacity-50 cursor-not-allowed border-white/5"
                        : isDark
                          ? "border-white/10 hover:border-[#FFD700] hover:bg-[#FFD700]/5"
                          : "border-gray-200 hover:border-[#FFD700] hover:bg-[#FFD700]/5"
                    }
                  `}
                >
                  <div
                    className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:rotate-12 ${
                      isDark
                        ? `bg-white/5 text-gray-500 group-hover:${accentText} group-hover:bg-${accentColor}-500/10`
                        : `bg-gray-100 text-gray-400 group-hover:${accentText} group-hover:bg-${accentColor}-500/10`
                    }`}
                  >
                    <Upload className="w-8 h-8" />
                  </div>
                  <span
                    className={`font-black uppercase tracking-[0.2em] text-[10px] ${headerText}`}
                  >
                    Upload Tactical Ops
                  </span>
                  <p
                    className={`text-[9px] font-bold mt-2 uppercase tracking-widest opacity-40 ${subText}`}
                  >
                    Max 5MB • {images.length}/{MAX_IMAGES}
                  </p>
                </button>

                <button
                  onClick={startCamera}
                  disabled={images.length >= MAX_IMAGES}
                  className={`
                    flex flex-col items-center justify-center p-12 rounded-[2rem] border-2 border-dashed transition-all duration-500 group relative overflow-hidden
                    ${
                      images.length >= MAX_IMAGES
                        ? "opacity-50 cursor-not-allowed border-white/5"
                        : isDark
                          ? "border-white/10 hover:border-[#FFD700] hover:bg-[#FFD700]/5"
                          : "border-gray-200 hover:border-[#FFD700] hover:bg-[#FFD700]/5"
                    }
                  `}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                      isDark
                        ? `bg-neutral-900 text-neutral-400 group-hover:${accentText}`
                        : `bg-gray-100 text-gray-500 group-hover:${accentText}`
                    }`}
                  >
                    <Camera className="w-7 h-7" />
                  </div>
                  <span className={`font-bold ${headerText}`}>Take Photo</span>
                  <p className={`text-xs mt-1 ${subText}`}>Instant capture</p>
                </button>
              </div>

              {/* Equipment Details Input */}
              <div
                className={`${cardClass} p-6 rounded-[2rem] border-2 space-y-4`}
              >
                <h4
                  className={`text-xs font-black uppercase tracking-widest ${headerText} mb-2`}
                >
                  Equipment Specifications
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label
                      className={`text-[10px] font-bold uppercase tracking-widest ${subText}`}
                    >
                      Bow Type
                    </label>
                    <select
                      value={equipmentData.bowType}
                      onChange={(e) =>
                        setEquipmentData({
                          ...equipmentData,
                          bowType: e.target.value,
                        })
                      }
                      className={`w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[var(--accent)] transition-all ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      <option value="Recurve">Recurve</option>
                      <option value="Compound">Compound</option>
                      <option value="Barebow">Barebow</option>
                      <option value="Longbow">Longbow</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label
                      className={`text-[10px] font-bold uppercase tracking-widest ${subText}`}
                    >
                      Bow Height (")
                    </label>
                    <input
                      type="text"
                      placeholder='e.g. 68"'
                      value={equipmentData.bowHeight}
                      onChange={(e) =>
                        setEquipmentData({
                          ...equipmentData,
                          bowHeight: e.target.value,
                        })
                      }
                      className={`w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[var(--accent)] transition-all ${isDark ? "text-white" : "text-gray-900"}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      className={`text-[10px] font-bold uppercase tracking-widest ${subText}`}
                    >
                      Draw Weight (lbs)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 38lbs"
                      value={equipmentData.drawWeight}
                      onChange={(e) =>
                        setEquipmentData({
                          ...equipmentData,
                          drawWeight: e.target.value,
                        })
                      }
                      className={`w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[var(--accent)] transition-all ${isDark ? "text-white" : "text-gray-900"}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      className={`text-[10px] font-bold uppercase tracking-widest ${subText}`}
                    >
                      Limbs Model
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hoyt Velos"
                      value={equipmentData.limbs}
                      onChange={(e) =>
                        setEquipmentData({
                          ...equipmentData,
                          limbs: e.target.value,
                        })
                      }
                      className={`w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[var(--accent)] transition-all ${isDark ? "text-white" : "text-gray-900"}`}
                    />
                  </div>
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />

              {/* Image Gallery */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-in fade-in zoom-in-95 duration-500">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative aspect-square rounded-2xl overflow-hidden group border-2 border-transparent hover:border-${accentColor}-500 transition-all shadow-xl`}
                    >
                      <img
                        src={img}
                        alt={`Upload ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => removeImage(idx)}
                          className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-lg active:scale-90"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full font-bold">
                        #{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={images.length === 0 || isAnalyzing}
                className={`
                w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-2xl relative overflow-hidden group
                ${
                  images.length === 0
                    ? isDark
                      ? "bg-neutral-800 text-neutral-600"
                      : "bg-gray-200 text-gray-400"
                    : isAnalyzing
                      ? "bg-neutral-800 text-white cursor-wait"
                      : `bg-gradient-to-r ${accentGradient} text-black hover:shadow-${accentColor}-500/25`
                }
              `}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    <span className="animate-pulse">
                      Analyzing {images.length} Image
                      {images.length > 1 ? "s" : ""}...
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-6 h-6 group-hover:scale-125 transition-transform" />
                    <span>Start Analysis</span>
                    {images.length > 0 && (
                      <span className="absolute right-6 bg-white/20 px-3 py-1 rounded-full text-sm">
                        {images.length}
                      </span>
                    )}
                  </>
                )}
              </button>
            </div>

            {/* Results Section */}
            <div
              className={`${cardClass} rounded-[2.5rem] p-8 lg:p-10 border-2 backdrop-blur-xl shadow-2xl min-h-[500px] flex flex-col relative overflow-hidden animate-in fade-in slide-in-from-right-8 duration-1000`}
            >
              <div
                className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${accentGradient}`}
              ></div>

              <div className="flex items-center justify-between mb-8">
                <h3
                  className={`text-2xl font-black flex items-center gap-3 ${headerText}`}
                >
                  <Activity className={`w-6 h-6 ${accentText}`} />
                  X10 AI Assessment
                </h3>
                {result && (
                  <div
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      isDark
                        ? `bg-${accentColor}-500/10 ${accentText}`
                        : `bg-${accentColor}-500/10 ${accentText}`
                    }`}
                  >
                    Analysis Complete
                  </div>
                )}
              </div>

              {!result && !isAnalyzing && (
                <div
                  className={`flex-1 flex flex-col items-center justify-center text-center px-6 relative`}
                >
                  <img
                    src="/images/products/archery_analysis_background.png"
                    className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <div
                    className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 rotate-3 hover:rotate-0 transition-transform duration-500 relative z-10 ${
                      isDark
                        ? "bg-neutral-800 shadow-inner"
                        : "bg-gray-100 shadow-lg shadow-gray-200"
                    }`}
                  >
                    <Target className={`w-12 h-12 ${accentText} opacity-50`} />
                  </div>
                  <h4
                    className={`font-black text-2xl mb-3 ${headerText} relative z-10`}
                  >
                    Ready for Deployment
                  </h4>
                  <p className="text-lg max-w-sm leading-relaxed relative z-10 opacity-70">
                    Upload your tactical images and let X10Minds decode your
                    performance with superintelligence.
                  </p>
                </div>
              )}

              {isAnalyzing && (
                <div className="flex-1 space-y-8 py-4">
                  <div className="flex gap-5 items-center">
                    <div
                      className={`h-16 w-16 rounded-2xl animate-pulse ${
                        isDark ? "bg-neutral-800" : "bg-gray-100"
                      }`}
                    ></div>
                    <div className="flex-1 space-y-3">
                      <div
                        className={`h-4 rounded-full animate-pulse w-3/4 ${
                          isDark ? "bg-neutral-800" : "bg-gray-100"
                        }`}
                      ></div>
                      <div
                        className={`h-3 rounded-full animate-pulse w-1/2 ${
                          isDark ? "bg-neutral-800" : "bg-gray-100"
                        }`}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-4 rounded-full animate-pulse ${
                          isDark ? "bg-neutral-800" : "bg-gray-100"
                        } ${i === 4 ? "w-4/5" : "w-full"}`}
                      ></div>
                    ))}
                  </div>
                  <div
                    className={`h-64 rounded-3xl animate-pulse w-full mt-6 ${
                      isDark ? "bg-neutral-800" : "bg-gray-100"
                    }`}
                  ></div>
                </div>
              )}

              {result && !isAnalyzing && (
                <div
                  className={`flex-1 overflow-y-auto custom-scrollbar pr-4 prose prose-lg prose-headings:font-black prose-p:leading-relaxed prose-li:my-1 max-w-none ${
                    isDark
                      ? `prose-invert prose-strong:${accentText} prose-ul:list-disc`
                      : `prose-neutral prose-strong:${accentText} prose-ul:list-disc`
                  }`}
                >
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Camera Modal */}
        {isCameraOpen && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            <div className="w-full max-w-4xl bg-neutral-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-neutral-800 relative">
              <div className="relative aspect-video bg-black flex items-center justify-center group">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover scale-x-[-1]"
                />

                {/* Camera HUD Overlay */}
                <div className="absolute inset-0 border-[40px] border-black/20 pointer-events-none"></div>
                <div className="absolute top-8 left-8 flex items-center gap-3 text-white/50 font-mono text-xs uppercase tracking-[0.2em] bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  REC - 4K 60FPS
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 pointer-events-auto">
                  <button
                    onClick={stopCamera}
                    className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 backdrop-blur-xl"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <button onClick={takePhoto} className="group relative">
                    <div className="w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center transition-transform group-active:scale-90 overflow-hidden">
                      <div className="w-[68px] h-[68px] bg-white rounded-full transition-all group-hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.5)]"></div>
                    </div>
                    {/* Ring animation */}
                    <div className="absolute inset-0 w-20 h-20 rounded-full border border-white/20 animate-ping opacity-20"></div>
                  </button>

                  <div className="p-4 text-white/40">
                    <Maximize2 className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="p-6 flex items-center justify-between text-neutral-500 font-medium">
                <span className="text-sm">POSITION ARCHER IN FRAME</span>
                <span className="text-sm">X10MINDS OPTICAL ENGINE</span>
              </div>
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}
      </div>
    );
  },
);

export default AnalysisView;
