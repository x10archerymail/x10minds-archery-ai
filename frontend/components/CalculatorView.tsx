import React, { useState } from "react";
import { Calculator } from "lucide-react";
import ScoringView from "./ScoringView";
import { ScoreData } from "../types";
import { NotificationType } from "./Overlays";

interface CalculatorViewProps {
  onSaveScore: (scoreData: ScoreData) => void;
  onSaveHistory: (messages: any[]) => void;
  onBack: () => void;
  accentColor?: string;
  themeMode?: "dark" | "light";
  notify: (message: string, type: NotificationType) => void;
  sessionDistance: number;
  setSessionDistance: (d: number) => void;
  podiums: number;
  onAddPodium: () => void;
}

const CalculatorView: React.FC<CalculatorViewProps> = ({
  onSaveScore,
  onSaveHistory,
  onBack,
  accentColor = "orange",
  themeMode = "dark",
  notify,
  sessionDistance,
  setSessionDistance,
  podiums,
  onAddPodium,
}) => {
  const [activeTab, setActiveTab] = useState<"SCORE" | "FORMULAS">("SCORE");

  // Maps for dynamic color classes
  const colors: Record<string, string> = {
    orange: "bg-orange-600 hover:bg-orange-500",
    blue: "bg-blue-600 hover:bg-blue-500",
    green: "bg-green-600 hover:bg-green-500",
    purple: "bg-purple-600 hover:bg-purple-500",
  };
  const textColors: Record<string, string> = {
    orange: "text-orange-500",
    blue: "text-blue-500",
    green: "text-green-500",
    purple: "text-purple-500",
  };
  const borderColors: Record<string, string> = {
    orange: "focus:border-orange-500 hover:border-orange-500/50",
    blue: "focus:border-blue-500 hover:border-blue-500/50",
    green: "focus:border-green-500 hover:border-green-500/50",
    purple: "focus:border-purple-500 hover:border-purple-500/50",
  };

  const isDark = themeMode === "dark";
  const bgClass = isDark ? "bg-neutral-950" : "bg-gray-50";

  const headerText = isDark ? "text-white" : "text-gray-900";
  const subText = isDark ? "text-neutral-400" : "text-gray-500";
  const inputBg = isDark ? "bg-black" : "bg-gray-100";
  const inputText = isDark ? "text-white" : "text-gray-900";

  const btnClass = colors[accentColor] || colors.orange;
  const txtClass = textColors[accentColor] || textColors.orange;
  const borderClass = borderColors[accentColor] || borderColors.orange;

  // --- FORMULA STATES ---
  const [keInputs, setKeInputs] = useState({ weight: 0, speed: 0 });
  const [keResult, setKeResult] = useState<number | null>(null);

  const [focInputs, setFocInputs] = useState({
    totalLength: 0,
    balancePoint: 0,
  });
  const [focResult, setFocResult] = useState<number | null>(null);

  const [momInputs, setMomInputs] = useState({ weight: 0, speed: 0 });
  const [momResult, setMomResult] = useState<number | null>(null);

  const [wingspan, setWingspan] = useState(0);
  const [dlResult, setDlResult] = useState<number | null>(null);

  const [gppInputs, setGppInputs] = useState({ arrowWeight: 0, drawWeight: 0 });
  const [gppResult, setGppResult] = useState<number | null>(null);

  const [hwInputs, setHwInputs] = useState({ peakWeight: 0, letoff: 0 });
  const [hwResult, setHwResult] = useState<number | null>(null);

  const [psInputs, setPsInputs] = useState({ drawLength: 0, braceHeight: 0 });
  const [psResult, setPsResult] = useState<number | null>(null);

  const [stabInputs, setStabInputs] = useState({
    frontWeight: 0,
    frontLen: 0,
    backLen: 0,
  });
  const [stabResult, setStabResult] = useState<number | null>(null);

  const [speedInputs, setSpeedInputs] = useState({
    ibo: 0,
    arrowWeight: 0,
    drawWeight: 0,
  });
  const [speedResult, setSpeedResult] = useState<number | null>(null);

  const [tawInputs, setTawInputs] = useState({
    shaftGpi: 0,
    length: 0,
    point: 0,
    insert: 0,
    fletching: 0,
    nock: 0,
  });
  const [tawResult, setTawResult] = useState<number | null>(null);

  const handleCalculate = (result: number | null, unit: string) => {
    if (result !== null && !isNaN(result)) {
      notify(`Calculated: ${result.toFixed(2)} ${unit}`, "success");
    } else {
      notify("Invalid inputs. Please check your numbers.", "error");
    }
  };

  return (
    <div className={`p-4 md:p-8 ${bgClass}`}>
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2
            className={`text-3xl font-bold mb-2 flex items-center gap-3 ${headerText}`}
          >
            <Calculator className={`w-8 h-8 ${txtClass}`} />
            Archery Calculator
          </h2>
          <p className={subText}>Technical calculations and score keeping.</p>
        </div>

        <div
          className={`flex rounded-lg p-1 border self-start md:self-auto ${
            isDark
              ? "bg-neutral-900 border-neutral-800"
              : "bg-white border-gray-200"
          }`}
        >
          <button
            onClick={() => setActiveTab("SCORE")}
            className={`px-4 md:px-6 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === "SCORE"
                ? `${btnClass} text-white shadow-lg`
                : `${subText} hover:text-white`
            }`}
          >
            Score Calculator
          </button>
          <button
            onClick={() => setActiveTab("FORMULAS")}
            className={`px-4 md:px-6 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === "FORMULAS"
                ? `${btnClass} text-white shadow-lg`
                : `${subText} hover:text-white`
            }`}
          >
            Formulas
          </button>
        </div>
      </header>

      {activeTab === "SCORE" && (
        <div className="animate-in fade-in duration-500">
          <ScoringView
            onBack={() => {}}
            sessionDistance={sessionDistance}
            onDistanceChange={setSessionDistance}
            podiums={podiums}
            onAddPodium={onAddPodium}
            onSave={(hits, ends, distance) => {
              const flatHits = ends.flat();
              const totalScore = flatHits.reduce((acc, h) => acc + h.score, 0);
              const xCount = flatHits.filter((h) => h.isX).length;

              const newScore: ScoreData = {
                date: new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                }),
                score: totalScore,
                xCount: xCount,
                distance: distance,
                ends: ends,
              };

              onSaveScore(newScore);
              notify("Score saved successfully!", "success");
            }}
            onSaveSession={(hits, ends, distance) => {
              const flatHits = ends.flat();
              const totalScore = flatHits.reduce((acc, h) => acc + h.score, 0);
              const xCount = flatHits.filter((h) => h.isX).length;

              const newScore: ScoreData = {
                date: new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                }),
                score: totalScore,
                xCount: xCount,
                distance: distance,
                ends: ends,
              };

              onSaveScore(newScore);
              notify("Session saved to rankings!", "success");
            }}
          />
        </div>
      )}

      {activeTab === "FORMULAS" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
            <FormulaCard
              title="Kinetic Energy (KE)"
              desc="Energy transferred to target"
              borderColor={borderClass}
            >
              <div className="space-y-3">
                <input
                  placeholder="Arrow Weight (grains)"
                  type="number"
                  onChange={(e) =>
                    setKeInputs({ ...keInputs, weight: Number(e.target.value) })
                  }
                  className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${inputBg} ${inputText} ${borderClass}`}
                />
                <input
                  placeholder="Speed (fps)"
                  type="number"
                  onChange={(e) =>
                    setKeInputs({ ...keInputs, speed: Number(e.target.value) })
                  }
                  className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${inputBg} ${inputText} ${borderClass}`}
                />
                <button
                  onClick={() => {
                    const res =
                      (keInputs.weight * keInputs.speed * keInputs.speed) /
                      450240;
                    setKeResult(res);
                    handleCalculate(res, "ft-lbs");
                  }}
                  className={`w-full py-2 rounded-lg text-sm font-bold text-white transition-colors ${btnClass}`}
                >
                  Calculate
                </button>
                {keResult !== null && (
                  <Result value={`${keResult.toFixed(2)} ft-lbs`} />
                )}
              </div>
            </FormulaCard>

            <FormulaCard
              title="Momentum"
              desc="Penetration potential"
              borderColor={borderClass}
            >
              <div className="space-y-3">
                <input
                  placeholder="Arrow Weight (grains)"
                  type="number"
                  onChange={(e) =>
                    setMomInputs({
                      ...momInputs,
                      weight: Number(e.target.value),
                    })
                  }
                  className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${inputBg} ${inputText} ${borderClass}`}
                />
                <input
                  placeholder="Speed (fps)"
                  type="number"
                  onChange={(e) =>
                    setMomInputs({
                      ...momInputs,
                      speed: Number(e.target.value),
                    })
                  }
                  className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${inputBg} ${inputText} ${borderClass}`}
                />
                <button
                  onClick={() => {
                    const res = (momInputs.weight * momInputs.speed) / 225218;
                    setMomResult(res);
                    handleCalculate(res, "slug-ft/s");
                  }}
                  className={`w-full py-2 rounded-lg text-sm font-bold text-white transition-colors ${btnClass}`}
                >
                  Calculate
                </button>
                {momResult !== null && (
                  <Result value={`${momResult.toFixed(3)} slug-ft/s`} />
                )}
              </div>
            </FormulaCard>

            <FormulaCard
              title="FOC (Front of Center)"
              desc="Arrow balance percentage"
              borderColor={borderClass}
            >
              <div className="space-y-3">
                <input
                  placeholder="Total Arrow Length (inches)"
                  type="number"
                  onChange={(e) =>
                    setFocInputs({
                      ...focInputs,
                      totalLength: Number(e.target.value),
                    })
                  }
                  className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${inputBg} ${inputText} ${borderClass}`}
                />
                <input
                  placeholder="Balance Point from Nock (inches)"
                  type="number"
                  onChange={(e) =>
                    setFocInputs({
                      ...focInputs,
                      balancePoint: Number(e.target.value),
                    })
                  }
                  className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${inputBg} ${inputText} ${borderClass}`}
                />
                <button
                  onClick={() => {
                    const res =
                      ((focInputs.balancePoint - focInputs.totalLength / 2) /
                        focInputs.totalLength) *
                      100;
                    setFocResult(res);
                    handleCalculate(res, "%");
                  }}
                  className={`w-full py-2 rounded-lg text-sm font-bold text-white transition-colors ${btnClass}`}
                >
                  Calculate
                </button>
                {focResult !== null && (
                  <Result value={`${focResult.toFixed(2)} %`} />
                )}
              </div>
            </FormulaCard>

            <FormulaCard
              title="Draw Length Estimator"
              desc="Based on wingspan"
              borderColor={borderClass}
            >
              <div className="space-y-3">
                <input
                  placeholder="Wingspan (inches)"
                  type="number"
                  onChange={(e) => setWingspan(Number(e.target.value))}
                  className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${inputBg} ${inputText} ${borderClass}`}
                />
                <button
                  onClick={() => {
                    const res = wingspan / 2.5;
                    setDlResult(res);
                    handleCalculate(res, "inches");
                  }}
                  className={`w-full py-2 rounded-lg text-sm font-bold text-white transition-colors ${btnClass}`}
                >
                  Calculate
                </button>
                {dlResult !== null && (
                  <Result value={`${dlResult.toFixed(2)} inches`} />
                )}
              </div>
            </FormulaCard>

            <FormulaCard
              title="GPP (Grains Per Pound)"
              desc="Safety & speed ratio"
              borderColor={borderClass}
            >
              <div className="space-y-3">
                <input
                  placeholder="Arrow Weight (grains)"
                  type="number"
                  onChange={(e) =>
                    setGppInputs({
                      ...gppInputs,
                      arrowWeight: Number(e.target.value),
                    })
                  }
                  className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${inputBg} ${inputText} ${borderClass}`}
                />
                <input
                  placeholder="Draw Weight (lbs)"
                  type="number"
                  onChange={(e) =>
                    setGppInputs({
                      ...gppInputs,
                      drawWeight: Number(e.target.value),
                    })
                  }
                  className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${inputBg} ${inputText} ${borderClass}`}
                />
                <button
                  onClick={() => {
                    const res = gppInputs.arrowWeight / gppInputs.drawWeight;
                    setGppResult(res);
                    handleCalculate(res, "gr/lb");
                  }}
                  className={`w-full py-2 rounded-lg text-sm font-bold text-white transition-colors ${btnClass}`}
                >
                  Calculate
                </button>
                {gppResult !== null && (
                  <Result value={`${gppResult.toFixed(2)} gr/lb`} />
                )}
              </div>
            </FormulaCard>

            <FormulaCard
              title="Holding Weight"
              desc="Weight at full draw"
              borderColor={borderClass}
            >
              <div className="space-y-3">
                <input
                  placeholder="Peak Weight (lbs)"
                  type="number"
                  onChange={(e) =>
                    setHwInputs({
                      ...hwInputs,
                      peakWeight: Number(e.target.value),
                    })
                  }
                  className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${inputBg} ${inputText} ${borderClass}`}
                />
                <input
                  placeholder="Let-off % (e.g., 80)"
                  type="number"
                  onChange={(e) =>
                    setHwInputs({ ...hwInputs, letoff: Number(e.target.value) })
                  }
                  className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${inputBg} ${inputText} ${borderClass}`}
                />
                <button
                  onClick={() => {
                    const res =
                      hwInputs.peakWeight * (1 - hwInputs.letoff / 100);
                    setHwResult(res);
                    handleCalculate(res, "lbs");
                  }}
                  className={`w-full py-2 rounded-lg text-sm font-bold text-white transition-colors ${btnClass}`}
                >
                  Calculate
                </button>
                {hwResult !== null && (
                  <Result value={`${hwResult.toFixed(1)} lbs`} />
                )}
              </div>
            </FormulaCard>

            <FormulaCard
              title="Power Stroke"
              desc="Acceleration distance"
              borderColor={borderClass}
            >
              <div className="space-y-3">
                <input
                  placeholder="Draw Length (inches)"
                  type="number"
                  onChange={(e) =>
                    setPsInputs({
                      ...psInputs,
                      drawLength: Number(e.target.value),
                    })
                  }
                  className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${inputBg} ${inputText} ${borderClass}`}
                />
                <input
                  placeholder="Brace Height (inches)"
                  type="number"
                  onChange={(e) =>
                    setPsInputs({
                      ...psInputs,
                      braceHeight: Number(e.target.value),
                    })
                  }
                  className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${inputBg} ${inputText} ${borderClass}`}
                />
                <button
                  onClick={() => {
                    const res = psInputs.drawLength - psInputs.braceHeight;
                    setPsResult(res);
                    handleCalculate(res, "inches");
                  }}
                  className={`w-full py-2 rounded-lg text-sm font-bold text-white transition-colors ${btnClass}`}
                >
                  Calculate
                </button>
                {psResult !== null && (
                  <Result value={`${psResult.toFixed(2)} inches`} />
                )}
              </div>
            </FormulaCard>

            <FormulaCard
              title="Stabilizer Balance"
              desc="Simple lever calculation"
              borderColor={borderClass}
            >
              <div className="space-y-3">
                <input
                  placeholder="Front Weight (oz)"
                  type="number"
                  onChange={(e) =>
                    setStabInputs({
                      ...stabInputs,
                      frontWeight: Number(e.target.value),
                    })
                  }
                  className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${inputBg} ${inputText} ${borderClass}`}
                />
                <input
                  placeholder="Front Length (in)"
                  type="number"
                  onChange={(e) =>
                    setStabInputs({
                      ...stabInputs,
                      frontLen: Number(e.target.value),
                    })
                  }
                  className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${inputBg} ${inputText} ${borderClass}`}
                />
                <input
                  placeholder="Back Length (in)"
                  type="number"
                  onChange={(e) =>
                    setStabInputs({
                      ...stabInputs,
                      backLen: Number(e.target.value),
                    })
                  }
                  className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${inputBg} ${inputText} ${borderClass}`}
                />

                <button
                  onClick={() => {
                    const res =
                      (stabInputs.frontWeight * stabInputs.frontLen) /
                      stabInputs.backLen;
                    setStabResult(res);
                    handleCalculate(res, "oz");
                  }}
                  className={`w-full py-2 rounded-lg text-sm font-bold text-white transition-colors ${btnClass}`}
                >
                  Calculate Needed Back Wt
                </button>
                {stabResult !== null && (
                  <Result value={`${stabResult.toFixed(1)} oz`} />
                )}
              </div>
            </FormulaCard>

            <FormulaCard
              title="Speed Estimate"
              desc="Rough speed from IBO"
              borderColor={borderClass}
            >
              <div className="space-y-3">
                <input
                  placeholder="Bow IBO Speed (fps)"
                  type="number"
                  onChange={(e) =>
                    setSpeedInputs({
                      ...speedInputs,
                      ibo: Number(e.target.value),
                    })
                  }
                  className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${inputBg} ${inputText} ${borderClass}`}
                />
                <input
                  placeholder="Arrow Weight (gr)"
                  type="number"
                  onChange={(e) =>
                    setSpeedInputs({
                      ...speedInputs,
                      arrowWeight: Number(e.target.value),
                    })
                  }
                  className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${inputBg} ${inputText} ${borderClass}`}
                />
                <input
                  placeholder="Draw Weight (lbs)"
                  type="number"
                  onChange={(e) =>
                    setSpeedInputs({
                      ...speedInputs,
                      drawWeight: Number(e.target.value),
                    })
                  }
                  className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${inputBg} ${inputText} ${borderClass}`}
                />

                <button
                  onClick={() => {
                    const iboWeight = speedInputs.drawWeight * 5;
                    const diff = speedInputs.arrowWeight - iboWeight;
                    const loss = diff > 0 ? diff / 3 : 0;
                    const res = speedInputs.ibo - loss;
                    setSpeedResult(res);
                    handleCalculate(res, "fps");
                  }}
                  className={`w-full py-2 rounded-lg text-sm font-bold text-white transition-colors ${btnClass}`}
                >
                  Calculate
                </button>
                {speedResult !== null && (
                  <Result value={`~${speedResult.toFixed(0)} fps`} />
                )}
              </div>
            </FormulaCard>

            <FormulaCard
              title="Total Arrow Weight"
              desc="Sum of all components"
              borderColor={borderClass}
            >
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="Shaft GPI"
                    type="number"
                    onChange={(e) =>
                      setTawInputs({
                        ...tawInputs,
                        shaftGpi: Number(e.target.value),
                      })
                    }
                    className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${inputBg} ${inputText} ${borderClass}`}
                  />
                  <input
                    placeholder="Length (in)"
                    type="number"
                    onChange={(e) =>
                      setTawInputs({
                        ...tawInputs,
                        length: Number(e.target.value),
                      })
                    }
                    className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${inputBg} ${inputText} ${borderClass}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="Point (gr)"
                    type="number"
                    onChange={(e) =>
                      setTawInputs({
                        ...tawInputs,
                        point: Number(e.target.value),
                      })
                    }
                    className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${inputBg} ${inputText} ${borderClass}`}
                  />
                  <input
                    placeholder="Insert (gr)"
                    type="number"
                    onChange={(e) =>
                      setTawInputs({
                        ...tawInputs,
                        insert: Number(e.target.value),
                      })
                    }
                    className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${inputBg} ${inputText} ${borderClass}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="Fletching (Total)"
                    type="number"
                    onChange={(e) =>
                      setTawInputs({
                        ...tawInputs,
                        fletching: Number(e.target.value),
                      })
                    }
                    className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${inputBg} ${inputText} ${borderClass}`}
                  />
                  <input
                    placeholder="Nock (gr)"
                    type="number"
                    onChange={(e) =>
                      setTawInputs({
                        ...tawInputs,
                        nock: Number(e.target.value),
                      })
                    }
                    className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${inputBg} ${inputText} ${borderClass}`}
                  />
                </div>

                <button
                  onClick={() => {
                    const res =
                      tawInputs.shaftGpi * tawInputs.length +
                      tawInputs.point +
                      tawInputs.insert +
                      tawInputs.fletching +
                      tawInputs.nock;
                    setTawResult(res);
                    handleCalculate(res, "grains");
                  }}
                  className={`w-full py-2 rounded-lg text-sm font-bold text-white transition-colors ${btnClass}`}
                >
                  Calculate
                </button>
                {tawResult !== null && (
                  <Result value={`${tawResult.toFixed(1)} grains`} />
                )}
              </div>
            </FormulaCard>
          </div>

          {/* Detailed Formula Information Section */}
          <div
            className={`mt-12 border rounded-3xl p-6 md:p-10 animate-in fade-in slide-in-from-bottom-5 duration-700 ${
              isDark
                ? "bg-neutral-900/50 border-neutral-800"
                : "bg-white border-gray-200 shadow-xl"
            }`}
          >
            <div
              className={`flex flex-col md:flex-row items-start md:items-center gap-6 mb-10 pb-6 border-b ${
                isDark ? "border-neutral-800/50" : "border-gray-100"
              }`}
            >
              <div
                className={`p-4 rounded-2xl border shadow-xl ${
                  isDark
                    ? "bg-neutral-950 border-neutral-800"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <Calculator className={`w-8 h-8 ${txtClass}`} />
              </div>
              <div>
                <h3 className={`text-2xl font-bold mb-1 ${headerText}`}>
                  Archery Formula Information Guide
                </h3>
                <p className={subText}>
                  Comprehensive breakdown of technical archery physics and
                  standards.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <InfoSection title="Kinetic Energy (KE)" icon="⚡">
                Kinetic energy is the energy of motion. In archery, it
                represents the potential force of impact when the arrow hits the
                target.
                <br />
                <br />
                <span className="text-xs font-mono text-neutral-500 bg-black/30 px-2 py-1 rounded">
                  KE = (Arrow Weight * Speed²) / 450,240
                </span>
              </InfoSection>

              <InfoSection title="Momentum" icon="🎯">
                Momentum measures the "penetration potential" of an arrow.
                Unlike Kinetic Energy which favors speed, Momentum takes arrow
                weight more heavily into account, which is crucial for deep
                penetration into dense targets.
                <br />
                <br />
                <span className="text-xs font-mono text-neutral-500 bg-black/30 px-2 py-1 rounded">
                  Mo = (Arrow Weight * Speed) / 225,218
                </span>
              </InfoSection>

              <InfoSection title="FOC (Front of Center)" icon="⚖️">
                Focus on Center is the percentage of the arrow's weight
                concentrated in its front half. Higher FOC leads to better
                flight stability and better accuracy at long distances, but too
                much can cause the arrow to "nose dive."
                <br />
                <br />
                <span className="text-xs font-mono text-neutral-500 bg-black/30 px-2 py-1 rounded">
                  FOC = ((Balance Point - (Total Length / 2)) / Total Length) *
                  100
                </span>
              </InfoSection>

              <InfoSection title="GPP (Grains Per Pound)" icon="🏗️">
                GPP is a safety-to-performance ratio. Shooting an arrow that is
                too light (low GPP) can damage your bow (dry-fire effect). Most
                manufacturers recommend at least 5 grains per pound of draw
                weight.
                <br />
                <br />
                <span className="text-xs font-mono text-neutral-500 bg-black/30 px-2 py-1 rounded">
                  GPP = Arrow Weight / Draw Weight
                </span>
              </InfoSection>

              <InfoSection title="Bow IBO Speed" icon="🏃">
                The IBO (International Bowhunting Organization) speed is the
                industry standard benchmarking. It's measured with a bow set to
                70 lbs, 30" draw length, and a 350-grain arrow. Our estimator
                adjusts your speed based on weight deviations from this
                standard.
              </InfoSection>

              <InfoSection title="Power Stroke" icon="📏">
                The Power Stroke is the actual distance the arrow is being
                accelerated while still on the string. A longer power stroke
                generally results in higher arrow speeds for the same draw
                weight.
                <br />
                <br />
                <span className="text-xs font-mono text-neutral-500 bg-black/30 px-2 py-1 rounded">
                  PS = Draw Length - Brace Height
                </span>
              </InfoSection>

              <InfoSection title="Holding Weight" icon="💪">
                This is the amount of force you actually hold at full draw.
                Compound bows use "let-off" to reduce the weight, allowing the
                archer to aim more steadily for longer periods of time.
                <br />
                <br />
                <span className="text-xs font-mono text-neutral-500 bg-black/30 px-2 py-1 rounded">
                  HW = Peak Weight * (1 - Letoff %)
                </span>
              </InfoSection>

              <InfoSection title="Draw Length Estimation" icon="👐">
                A person's draw length is primarily determined by their height
                and arm length. The "Wingspan / 2.5" method is a widely accepted
                starting point for finding the correct draw length for most
                adults.
              </InfoSection>

              <InfoSection title="Total Arrow Weight" icon="📦">
                Total arrow weight is the sum of every component: shaft, point,
                insert, fletching, and nock. Even small weight variations can
                change your arrow flight and point of impact.
              </InfoSection>
            </div>

            <div
              className={`mt-10 p-4 rounded-xl border text-center text-sm italic ${
                isDark
                  ? "border-neutral-800 bg-neutral-950/80 text-neutral-500"
                  : "border-gray-200 bg-gray-50 text-gray-400"
              }`}
            >
              Note: These calculations are based on standard mechanical physics
              used in modern archery. Real-world results may vary slightly based
              on equipment efficiency and environmental factors.
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Helper Components
const InfoSection = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-3">
    <div className="flex items-center gap-3">
      <span className="text-xl bg-neutral-800/10 w-8 h-8 flex items-center justify-center rounded-lg shadow-inner">
        {icon}
      </span>
      <h4 className="font-bold tracking-wide">{title}</h4>
    </div>
    <p className="text-sm leading-relaxed font-light opacity-70">{children}</p>
  </div>
);

const FormulaCard = ({
  title,
  desc,
  children,
  borderColor,
}: {
  title: string;
  desc: string;
  children?: React.ReactNode;
  borderColor?: string;
}) => (
  <div
    className={`border rounded-3xl p-8 transition-all shadow-xl hover:shadow-2xl hover:translate-y-[-4px] backdrop-blur-md ${borderColor} bg-white/5`}
  >
    <div className="mb-6 relative">
      <h4 className="font-black text-xl tracking-tight mb-1">{title}</h4>
      <p className="text-xs font-medium uppercase tracking-widest opacity-40">
        {desc}
      </p>
      <div
        className={`absolute -left-8 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-current opacity-20`}
      ></div>
    </div>
    <div className="relative z-10">{children}</div>
  </div>
);

const Result = ({ value }: { value: string }) => (
  <div className="mt-4 p-4 bg-green-500/5 border border-green-500/20 rounded-2xl text-center font-black font-mono tracking-tighter animate-in zoom-in duration-300 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
    <div className="text-[10px] uppercase tracking-[0.2em] text-green-500/50 mb-1">
      Result Calculated
    </div>
    <span className="text-2xl text-green-500">{value}</span>
  </div>
);

export default React.memo(CalculatorView);
