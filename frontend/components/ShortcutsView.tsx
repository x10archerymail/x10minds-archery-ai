import React, { useState, useEffect } from "react";
import { Keyboard, ArrowLeft, Edit2, Check, RefreshCw, X } from "lucide-react";
import { AppMode } from "../types";
import { getTranslation } from "../i18n";

interface ShortcutsViewProps {
  onBackendNavigate: (mode: AppMode) => void;
  isDark: boolean;
  language?: string;
  shortcuts?: {
    history: string;
    chat: string;
    settings: string;
    help: string;
    theme: string;
  };
  onUpdateShortcuts?: (shortcuts: any) => void;
}

export const ShortcutsView: React.FC<ShortcutsViewProps> = ({
  onBackendNavigate,
  isDark,
  language = "English",
  shortcuts = {
    history: "ctrl+h",
    chat: "ctrl+k",
    settings: "ctrl+,",
    help: "ctrl+/",
    theme: "ctrl+t",
  },
  onUpdateShortcuts,
}) => {
  const t = (key: string) => getTranslation(language, key);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  // Capture keystrokes when editing
  useEffect(() => {
    if (!editingKey || !onUpdateShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Avoid capturing modifier-only events
      if (["Control", "Shift", "Alt", "Meta", "Command"].includes(e.key))
        return;

      const mods = [];
      if (e.ctrlKey || e.metaKey) mods.push("ctrl");
      if (e.altKey) mods.push("alt");
      if (e.shiftKey) mods.push("shift");

      // Valid shortcut needs a key
      const key = e.key.toLowerCase();
      // Handle special keys mapping if needed, but keeping it simple

      const newShortcut = [...mods, key].join("+");

      onUpdateShortcuts({
        ...shortcuts,
        [editingKey]: newShortcut,
      });
      setEditingKey(null);
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () =>
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [editingKey, shortcuts, onUpdateShortcuts]);

  const shortcutList = [
    { key: "history", label: "Open History", desc: "Access chat history" },
    { key: "chat", label: "New Chat / Focus", desc: "Start fresh or type" },
    { key: "settings", label: "Open Settings", desc: "Configuration" },
    { key: "theme", label: "Toggle Theme", desc: "Dark/Light mode switch" },
    { key: "help", label: "Show Shortcuts", desc: "View this page" },
  ];

  const formatShortcut = (s: string) => {
    return s
      .split("+")
      .map((p) => {
        if (p === "ctrl") return "Ctrl"; // Or ⌘ for Mac dynamic?
        if (p === "alt") return "Alt";
        if (p === "shift") return "Shift";
        return p.toUpperCase();
      })
      .join(" + ");
  };

  const handleReset = () => {
    if (confirm("Reset all shortcuts to default?") && onUpdateShortcuts) {
      onUpdateShortcuts({
        history: "ctrl+h",
        chat: "ctrl+k",
        settings: "ctrl+,",
        help: "ctrl+/",
        theme: "ctrl+t",
      });
    }
  };

  const bgCard = isDark
    ? "bg-neutral-900 border-neutral-800"
    : "bg-white border-gray-200";
  const hoverBg = isDark ? "hover:bg-neutral-800" : "hover:bg-gray-50";

  return (
    <div
      className={`min-h-screen p-6 md:p-10 ${
        isDark ? "bg-black text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onBackendNavigate(AppMode.SETTINGS)}
              className={`p-2 rounded-full transition-colors ${
                isDark ? "hover:bg-neutral-800" : "hover:bg-gray-200"
              }`}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Keyboard className="w-8 h-8 text-orange-500" />
                Keyboard Shortcuts
              </h1>
              <p
                className={`mt-1 ${
                  isDark ? "text-neutral-400" : "text-gray-500"
                }`}
              >
                Customize your hotkeys for maximum speed
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
              isDark
                ? "border-neutral-800 hover:bg-neutral-800 text-neutral-400"
                : "border-gray-200 hover:bg-gray-100 text-gray-600"
            }`}
          >
            <RefreshCw className="w-4 h-4" /> Reset Defaults
          </button>
        </header>

        <div className={`rounded-2xl p-6 mb-8 border ${
          isDark 
            ? "bg-neutral-900/50 border-neutral-800" 
            : "bg-white border-gray-200"
        }`}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-8 rounded-full bg-orange-500"></span>
            How to Customise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                isDark ? "bg-neutral-800" : "bg-orange-100 text-orange-600"
              }`}>1</div>
              <div>
                <p className="font-bold mb-1">Select Action</p>
                <p className="text-sm opacity-60">Click the Edit icon (pencil) next to the command you want to change.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                isDark ? "bg-neutral-800" : "bg-orange-100 text-orange-600"
              }`}>2</div>
              <div>
                <p className="font-bold mb-1">Press Keys</p>
                <p className="text-sm opacity-60">Press your desired key combination (e.g. Ctrl + Shift + P).</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                isDark ? "bg-neutral-800" : "bg-orange-100 text-orange-600"
              }`}>3</div>
              <div>
                <p className="font-bold mb-1">Save & Use</p>
                <p className="text-sm opacity-60">The shortcut is saved instantly. Reset anytime if needed.</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`rounded-3xl border overflow-hidden ${bgCard}`}>
          {/* Header Row */}
          <div
            className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b font-bold text-xs uppercase tracking-wider opacity-60 ${
              isDark ? "border-neutral-800" : "border-gray-100"
            }`}
          >
            <div className="md:col-span-5">Command</div>
            <div className="md:col-span-5">Shortcut Key</div>
            <div className="md:col-span-2 text-right">Action</div>
          </div>

          <div
            className={`divide-y ${
              isDark ? "divide-neutral-800" : "divide-gray-100"
            }`}
          >
            {shortcutList.map((item) => {
              const isActive = editingKey === item.key;
              const currentKey =
                shortcuts[item.key as keyof typeof shortcuts] || "Unset";

              return (
                <div
                  key={item.key}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-5 items-center transition-all ${
                    isActive
                      ? isDark
                        ? "bg-orange-500/10"
                        : "bg-orange-50"
                      : hoverBg
                  }`}
                >
                  <div className="md:col-span-5">
                    <p className="font-bold text-lg">{item.label}</p>
                    <p className="text-sm opacity-50">{item.desc}</p>
                  </div>

                  <div className="md:col-span-5">
                    {isActive ? (
                      <div className="flex items-center gap-2 animate-pulse text-orange-500 font-bold">
                        <Keyboard className="w-5 h-5" />
                        Press new keys...
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {currentKey.split("+").map((k, i) => (
                          <kbd
                            key={i}
                            className={`px-3 py-1.5 rounded-lg border text-sm font-mono font-bold shadow-sm ${
                              isDark
                                ? "bg-neutral-800 border-neutral-700 text-neutral-300"
                                : "bg-gray-100 border-gray-200 text-gray-600 uppercase"
                            }`}
                          >
                            {k === "ctrl"
                              ? navigator.platform.includes("Mac")
                                ? "⌘"
                                : "Ctrl"
                              : k}
                          </kbd>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2 flex justify-end">
                    {isActive ? (
                      <button
                        onClick={() => setEditingKey(null)}
                        className="p-3 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        disabled={!onUpdateShortcuts}
                        onClick={() => setEditingKey(item.key)}
                        className={`p-3 rounded-xl transition-colors ${
                          isDark
                            ? "hover:bg-white/10 text-neutral-400 hover:text-white"
                            : "hover:bg-gray-200 text-gray-400 hover:text-black"
                        }`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {editingKey && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <div
              className={`p-8 rounded-3xl max-w-sm w-full text-center border shadow-2xl ${bgCard}`}
            >
              <Keyboard className="w-12 h-12 mx-auto mb-4 text-orange-500 animate-bounce" />
              <h3 className="text-xl font-bold mb-2">Listening for input...</h3>
              <p className="opacity-60 mb-6">
                Press the key combination you want to assign to{" "}
                <b>{shortcutList.find((i) => i.key === editingKey)?.label}</b>
              </p>
              <button
                onClick={() => setEditingKey(null)}
                className="text-sm font-bold opacity-50 hover:opacity-100"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
