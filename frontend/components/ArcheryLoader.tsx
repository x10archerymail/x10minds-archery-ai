import React, { useEffect, useState } from "react";
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
    <div className="flex flex-col gap-2 p-3 bg-white/5 border border-white/10 rounded-lg max-w-[300px] animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center gap-3">
        {/* Animated Archery Spinner */}
        <div className="relative w-6 h-6 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
          <Target className="w-3 h-3 text-orange-500" />
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-medium text-orange-400 animate-pulse">
            {isSearching ? currentStep.text : "Thinking..."}
          </span>
          <span className="text-[10px] text-gray-500 mt-0.5">
            {(elapsed / 1000).toFixed(1)}s
          </span>
        </div>
      </div>

      {/* Optional: Show fake progress bar */}
      <div className="h-0.5 w-full bg-white/10 rounded-full overflow-hidden mt-1">
        <div className="h-full bg-orange-500/50 animate-progress-indeterminate"></div>
      </div>
    </div>
  );
};
