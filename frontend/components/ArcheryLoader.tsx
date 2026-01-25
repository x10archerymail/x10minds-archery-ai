import { useEffect, useState } from "react";
import {
  Target,
  Search,
  Brain,
  Globe,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface ArcheryLoaderProps {
  isSearching: boolean;
  startTime?: number;
}

export const ArcheryLoader: React.FC<ArcheryLoaderProps> = ({
  isSearching,
  startTime,
}) => {
  const [elapsed, setElapsed] = useState(0);
  const [step, setStep] = useState(0);

  // Simulate "steps" of thinking if searching
  const steps = [
    { text: "Analyzing request...", icon: Brain },
    { text: "Searching knowledge base...", icon: Search },
    { text: "Browsing the web for latest info...", icon: Globe },
    { text: "Formulating expert response...", icon: Target },
  ];

  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 100);
    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    if (isSearching) {
      const interval = setInterval(() => {
        setStep((prev) => (prev + 1) % steps.length);
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setStep(0);
    }
  }, [isSearching]);

  const currentStep = isSearching
    ? steps[Math.min(step, steps.length - 1)]
    : steps[0];

  return (
    <div className="flex flex-col gap-2 p-4 bg-black/40 backdrop-blur-md border border-white/5 rounded-xl max-w-[300px] animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center gap-3">
        {/* Animated Archery Spinner */}
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin"></div>
          <Target className="w-4 h-4 text-[#FFD700]" />
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-widest animate-pulse">
            {isSearching ? currentStep.text : "Thinking..."}
          </span>
          <span className="text-[9px] font-bold text-neutral-500 mt-0.5 uppercase tracking-widest">
            T + {(elapsed / 1000).toFixed(1)}s
          </span>
        </div>
      </div>

      {/* Optional: Show fake progress bar */}
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-1">
        <div className="h-full bg-[#FFD700]/50 animate-progress-indeterminate"></div>
      </div>
    </div>
  );
};
