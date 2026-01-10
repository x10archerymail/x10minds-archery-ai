import React, { useState, useRef, useEffect } from "react";
import {
  Target as TargetIcon,
  Trash2,
  RotateCcw,
  Save,
  Plus,
  CheckCircle2,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";

interface Hit {
  x: number;
  y: number;
  score: number;
  isX?: boolean;
}

interface ScoringViewProps {
  onSave: (hits: Hit[], ends: Hit[][], distance: number) => void;
  onSaveSession?: (hits: Hit[], ends: Hit[][], distance: number) => void;
  onBack: () => void;
  sessionDistance?: number;
  onDistanceChange?: (d: number) => void;
  podiums?: number;
  onAddPodium?: () => void;
}

const HistoryIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);

const ScoringView: React.FC<ScoringViewProps> = ({
  onSave,
  onSaveSession,
  onBack,
  sessionDistance = 70,
  onDistanceChange,
  podiums = 0,
  onAddPodium,
}) => {
  const [currentEnd, setCurrentEnd] = useState<Hit[]>([]);
  const [ends, setEnds] = useState<Hit[][]>([]);
  const [distance, setDistance] = useState<number>(sessionDistance);
  const [isDistanceOpen, setIsDistanceOpen] = useState(false);
  const targetRef = useRef<SVGSVGElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDistance(sessionDistance);
  }, [sessionDistance]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDistanceOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const calculateScore = (distance: number) => {
    // Distance from center in percentage (0 to 100)
    if (distance < 5) return { score: 10, isX: true };
    if (distance < 10) return { score: 10, isX: false };
    if (distance < 20) return { score: 9, isX: false };
    if (distance < 30) return { score: 8, isX: false };
    if (distance < 40) return { score: 7, isX: false };
    if (distance < 50) return { score: 6, isX: false };
    if (distance < 60) return { score: 5, isX: false };
    if (distance < 70) return { score: 4, isX: false };
    if (distance < 80) return { score: 3, isX: false };
    if (distance < 90) return { score: 2, isX: false };
    if (distance < 100) return { score: 1, isX: false };
    return { score: 0, isX: false };
  };

  const handleTargetClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!targetRef.current) return;

    const svg = targetRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;

    const screenCTM = svg.getScreenCTM();
    if (!screenCTM) return;
    const cursorpt = pt.matrixTransform(screenCTM.inverse());

    // Center is (250, 250) in our 500x500 SVG
    const centerX = 250;
    const centerY = 250;
    const dx = cursorpt.x - centerX;
    const dy = cursorpt.y - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Scale distance to percentage (radius of target is 250)
    const distPercent = (dist / 250) * 100;
    const result = calculateScore(distPercent);

    const newHit: Hit = {
      x: cursorpt.x,
      y: cursorpt.y,
      score: result.score,
      isX: result.isX,
    };

    if (currentEnd.length < 6) {
      setCurrentEnd([...currentEnd, newHit]);
    }
  };

  const handleManualEntry = (score: number, isX = false) => {
    if (currentEnd.length < 6) {
      setCurrentEnd([...currentEnd, { x: -1, y: -1, score, isX }]);
    }
  };

  const undoLastHit = () => {
    setCurrentEnd(currentEnd.slice(0, -1));
  };

  const finishEnd = () => {
    if (currentEnd.length > 0) {
      setEnds([...ends, currentEnd]);
      setCurrentEnd([]);
    }
  };

  const totalScore =
    ends.flat().reduce((acc, hit) => acc + hit.score, 0) +
    currentEnd.reduce((acc, hit) => acc + hit.score, 0);

  const xCount =
    ends.flat().filter((h) => h.isX).length +
    currentEnd.filter((h) => h.isX).length;

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-8 font-sans selection:bg-orange-500/30 overflow-hidden relative">
      {/* Global Background Glows - "Out of Target" */}
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-orange-600/10 blur-[150px] rounded-full animate-pulse pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[180px] rounded-full animate-pulse delay-1000 pointer-events-none z-0" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] blur-[200px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/5 rounded-full transition-colors border border-white/5"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-black font-orbitron tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500">
                SCORING SESSION
              </h1>
              <p className="text-neutral-500 text-sm font-medium">
                Capture every shot with precision & analytics
              </p>
            </div>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDistanceOpen(!isDistanceOpen)}
              className="flex items-center gap-4 bg-neutral-900/80 backdrop-blur-2xl px-5 py-2.5 rounded-full border border-white/10 hover:border-orange-500/50 transition-all group shadow-lg shadow-black/20"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                  DIST
                </span>
                <span className="text-lg font-black text-white">
                  {distance}m
                </span>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <ChevronDown
                className={`w-4 h-4 text-neutral-500 transition-transform duration-500 ${
                  isDistanceOpen
                    ? "rotate-180 text-orange-500"
                    : "group-hover:text-white"
                }`}
              />
            </button>

            {isDistanceOpen && (
              <div className="absolute top-full mt-3 left-0 w-56 bg-neutral-900/95 backdrop-blur-3xl border border-white/10 rounded-[24px] shadow-3xl z-50 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300">
                <div className="p-3 grid grid-cols-1 gap-1.5">
                  <div className="px-3 py-2 text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">
                    Select Range
                  </div>
                  {[70, 60, 50, 40, 30, 25, 18, 10].map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setDistance(d);
                        setIsDistanceOpen(false);
                        if (onDistanceChange) onDistanceChange(d);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        distance === d
                          ? "bg-orange-600 text-white shadow-xl shadow-orange-600/20"
                          : "text-neutral-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {d}{" "}
                        <span className="text-[10px] opacity-50 font-normal">
                          Meters
                        </span>
                      </span>
                      {distance === d && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <div className="px-6 py-3 bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-2xl flex flex-col items-center min-w-[100px]">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                Total
              </span>
              <span className="text-2xl font-black text-white">
                {totalScore}
              </span>
            </div>
            <div className="px-6 py-3 bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-2xl flex flex-col items-center min-w-[100px]">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                X-Count
              </span>
              <span className="text-2xl font-black text-yellow-500">
                {xCount}
              </span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Target Interaction Panel */}
          <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-10 animate-in fade-in zoom-in-95 duration-1000 delay-200">
            <div className="relative group p-4 flex justify-center items-center overflow-visible">
              {/* Decorative Background Elements - "Out of Target" Premium Design */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/[0.03] rounded-full pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] border border-white/[0.01] rounded-full pointer-events-none" />

              {/* Distinct Floating Glass Circles (Matching the uploaded image) */}
              <div className="absolute -right-16 top-1/4 w-44 h-44 bg-white/[0.02] border border-white/5 rounded-full backdrop-blur-[2px] pointer-events-none animate-pulse shadow-[0_0_40px_rgba(255,255,255,0.02)]" />
              <div className="absolute -right-32 bottom-1/3 w-32 h-32 bg-white/[0.01] border border-white/5 rounded-full pointer-events-none animate-pulse delay-500" />
              <div className="absolute -left-24 top-1/2 w-60 h-60 bg-white/[0.01] border border-white/[0.02] rounded-full pointer-events-none animate-pulse delay-1000" />
              <div className="absolute left-1/4 -top-16 w-20 h-20 bg-orange-500/5 border border-orange-500/10 rounded-full blur-[1px] pointer-events-none" />
              <div className="absolute -bottom-12 right-1/2 w-40 h-40 bg-blue-500/5 border border-blue-500/10 rounded-full blur-[3px] pointer-events-none delay-300" />

              <svg
                ref={targetRef}
                viewBox="0 0 500 500"
                className="w-full max-w-[500px] md:max-w-[800px] h-auto cursor-crosshair drop-shadow-[0_0_50px_rgba(255,255,255,0.03)] transition-transform duration-500 group-hover:scale-[1.01] z-10"
                onClick={handleTargetClick}
              >
                {/* Target Circles */}
                <circle cx="250" cy="250" r="250" fill="#f3f4f6" />{" "}
                {/* White 1 */}
                <circle
                  cx="250"
                  cy="250"
                  r="225"
                  fill="#f3f4f6"
                  stroke="#d1d5db"
                  strokeWidth="0.5"
                />{" "}
                {/* White 2 */}
                <circle cx="250" cy="250" r="200" fill="#1f2937" />{" "}
                {/* Black 3 */}
                <circle
                  cx="250"
                  cy="250"
                  r="175"
                  fill="#1f2937"
                  stroke="#374151"
                  strokeWidth="0.5"
                />{" "}
                {/* Black 4 */}
                <circle cx="250" cy="250" r="150" fill="#3b82f6" />{" "}
                {/* Blue 5 */}
                <circle
                  cx="250"
                  cy="250"
                  r="125"
                  fill="#3b82f6"
                  stroke="#2563eb"
                  strokeWidth="0.5"
                />{" "}
                {/* Blue 6 */}
                <circle cx="250" cy="250" r="100" fill="#ef4444" />{" "}
                {/* Red 7 */}
                <circle
                  cx="250"
                  cy="250"
                  r="75"
                  fill="#ef4444"
                  stroke="#dc2626"
                  strokeWidth="0.5"
                />{" "}
                {/* Red 8 */}
                <circle cx="250" cy="250" r="50" fill="#facc15" />{" "}
                {/* Gold 9 */}
                <circle
                  cx="250"
                  cy="250"
                  r="25"
                  fill="#facc15"
                  stroke="#eab308"
                  strokeWidth="2"
                />{" "}
                {/* Gold 10 */}
                <circle
                  cx="250"
                  cy="250"
                  r="12.5"
                  fill="none"
                  stroke="#eab308"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />{" "}
                {/* X Ring */}
                {/* Grid Lines */}
                <line
                  x1="250"
                  y1="0"
                  x2="250"
                  y2="500"
                  stroke="white"
                  strokeOpacity="0.05"
                  strokeWidth="1"
                />
                <line
                  x1="0"
                  y1="250"
                  x2="500"
                  y2="250"
                  stroke="white"
                  strokeOpacity="0.05"
                  strokeWidth="1"
                />
                {/* Registered Hits in current end */}
                {currentEnd.map(
                  (hit, i) =>
                    hit.x !== -1 && (
                      <g key={i}>
                        <circle
                          cx={hit.x}
                          cy={hit.y}
                          r="6"
                          fill="white"
                          className="animate-in zoom-in-0 duration-300 drop-shadow-2xl"
                        />
                        <circle
                          cx={hit.x}
                          cy={hit.y}
                          r="12"
                          fill="none"
                          stroke="white"
                          strokeOpacity="0.3"
                          className="animate-ping"
                        />
                      </g>
                    )
                )}
              </svg>

              {/* Score Indicator Overlay - Moved 'Out of Target' */}
              <div className="absolute -right-16 top-1/2 -translate-y-1/2 flex flex-col gap-4 pointer-events-none hidden md:flex">
                {currentEnd.map((hit, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full bg-orange-600/20 backdrop-blur-xl border border-white/10 flex items-center justify-center font-black text-lg animate-in slide-in-from-right-8 fade-in shadow-2xl shadow-orange-600/10"
                  >
                    <span
                      className={hit.isX ? "text-yellow-500" : "text-white"}
                    >
                      {hit.isX ? "X" : hit.score}
                    </span>
                  </div>
                ))}
                {Array.from({ length: 6 - currentEnd.length }).map((_, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full border border-white/5 bg-white/[0.03] backdrop-blur-sm animate-pulse"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>

              {/* Mobile Indicators Overlay (Floating Top-Right) */}
              <div className="absolute top-4 right-4 flex md:hidden flex-wrap gap-2 max-w-[120px] justify-end">
                {currentEnd.map((hit, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center font-bold text-xs animate-in zoom-in-50 fade-in"
                  >
                    {hit.isX ? "X" : hit.score}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="w-full flex justify-between items-center bg-neutral-900/30 backdrop-blur-xl p-4 rounded-3xl border border-white/5 shadow-xl mb-8">
              <div className="flex gap-4">
                <button
                  onClick={undoLastHit}
                  disabled={currentEnd.length === 0}
                  className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all disabled:opacity-20"
                  title="Undo Last"
                >
                  <RotateCcw className="w-5 h-5 text-neutral-400" />
                </button>
                <button
                  onClick={() => {
                    setEnds([]);
                    setCurrentEnd([]);
                  }}
                  className="p-4 bg-white/5 hover:bg-red-500/10 rounded-2xl transition-all group"
                  title="Reset All"
                >
                  <Trash2 className="w-5 h-5 text-neutral-500 group-hover:text-red-500" />
                </button>
              </div>

              <div className="flex gap-6">
                <button
                  onClick={finishEnd}
                  disabled={currentEnd.length === 0}
                  className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-orange-900/20 transition-all disabled:opacity-20 active:scale-95"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Complete End
                </button>
                <div className="flex gap-6">
                  <button
                    onClick={() => onSave(ends.flat(), ends, distance)}
                    disabled={ends.length === 0}
                    className="flex-1 px-8 py-4 bg-orange-600 text-white hover:bg-orange-500 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl transition-all disabled:opacity-20 active:scale-95"
                  >
                    <Save className="w-5 h-5" />
                    Save to Dashboard
                  </button>
                  {onSaveSession && (
                    <button
                      onClick={() => onSaveSession(ends.flat(), ends, distance)}
                      disabled={ends.length === 0}
                      className="flex-1 px-8 py-4 bg-white text-black hover:bg-neutral-200 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl transition-all disabled:opacity-20 active:scale-95"
                    >
                      <HistoryIcon className="w-5 h-5" />
                      Save Session
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Podiums Section - Moved to Left */}
            <div className="w-full bg-neutral-900/40 backdrop-blur-3xl p-8 rounded-[40px] border border-white/10 shadow-3xl animate-in fade-in slide-in-from-left-4 duration-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Plus className="w-5 h-5 text-yellow-400" />
                Podiums & Achievements
              </h3>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-black mb-1">
                    Total Podiums
                  </p>
                  <p className="text-3xl font-black text-yellow-400">
                    {podiums}
                  </p>
                </div>
                <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-black mb-1">
                    Win Rate
                  </p>
                  <p className="text-3xl font-black text-white">0%</p>
                </div>
              </div>
              <button
                onClick={() => onAddPodium && onAddPodium()}
                className="w-full py-4 bg-yellow-400 text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-yellow-400/20"
              >
                Add Podium Finish
              </button>
            </div>
          </div>

          {/* Right Sidebar: Quick Input & Stats */}
          <div className="lg:col-span-12 xl:col-span-4 flex flex-col gap-10 animate-in fade-in slide-in-from-right-4 duration-1000 delay-300">
            {/* Quick Score Entry */}
            <div className="bg-neutral-900/40 backdrop-blur-3xl p-6 rounded-[32px] border border-white/10 shadow-3xl">
              <h3 className="text-sm font-bold mb-5 flex items-center gap-3 text-neutral-400">
                <Plus className="w-4 h-4 text-orange-500" />
                Quick Score Entry
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {[101, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((val) => (
                  <button
                    key={val}
                    onClick={() =>
                      handleManualEntry(val === 101 ? 10 : val, val === 101)
                    }
                    className={`h-12 rounded-xl font-black transition-all border border-white/5 active:scale-95
                          ${
                            val === 101
                              ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20"
                              : val === 10
                              ? "bg-orange-500/10 text-orange-500 border-orange-500/10 hover:bg-orange-500/20"
                              : val === 0
                              ? "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
                              : "bg-white/5 text-white hover:bg-white/10 text-xs"
                          }`}
                  >
                    {val === 0 ? "M" : val === 101 ? "X" : val}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Ends */}
            <div className="bg-neutral-900/40 backdrop-blur-3xl p-8 rounded-[40px] border border-white/10 shadow-3xl flex-1 overflow-hidden flex flex-col">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                <HistoryIcon className="w-5 h-5 text-blue-500" />
                Recent Ends
              </h3>
              <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {ends.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-neutral-600">
                    <TargetIcon className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm">No ends recorded yet</p>
                  </div>
                )}
                {ends
                  .slice()
                  .reverse()
                  .map((end, endIdx) => (
                    <div
                      key={endIdx}
                      className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-xs font-bold text-orange-500">
                          {ends.length - endIdx}
                        </span>
                        <div className="flex gap-2">
                          {end.map((hit, i) => (
                            <span
                              key={i}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black
                                    ${
                                      hit.isX
                                        ? "bg-yellow-500/20 text-yellow-500"
                                        : hit.score >= 9
                                        ? "bg-orange-500/20 text-orange-500"
                                        : "bg-neutral-800 text-neutral-400"
                                    }`}
                            >
                              {hit.isX ? "X" : hit.score}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-black text-white">
                          {end.reduce((acc, h) => acc + h.score, 0)}
                        </div>
                        <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-0.5">
                          Running Total:{" "}
                          {ends
                            .slice(0, ends.length - endIdx)
                            .flat()
                            .reduce((acc, h) => acc + h.score, 0)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              {/* Session Summary Table */}

              {ends.length > 0 && (
                <div className="bg-neutral-900/40 backdrop-blur-3xl p-8 rounded-[40px] border border-white/10 shadow-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                    <TargetIcon className="w-5 h-5 text-green-500" />
                    Session Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-neutral-500 text-sm">
                        Total Distance
                      </span>
                      <span className="font-bold">{distance} Meters</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-neutral-500 text-sm">
                        Total Arrows
                      </span>
                      <span className="font-bold">{ends.length * 6}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-neutral-500 text-sm">
                        Session Total
                      </span>
                      <span className="font-black text-xl text-orange-500">
                        {totalScore}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-neutral-500 text-sm">
                        Average per End
                      </span>
                      <span className="font-bold">
                        {(totalScore / ends.length).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
          }
        `}</style>
      </div>
    </div>
  );
};

export default ScoringView;
