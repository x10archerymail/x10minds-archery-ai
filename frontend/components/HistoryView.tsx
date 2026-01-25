import * as React from "react";
import { useState, useEffect } from "react";
import {
  Clock,
  Search,
  MessageSquare,
  Trash2,
  ChevronRight,
  MoreVertical,
  Pin,
  PinOff,
  Image as ImageIcon,
  Pencil,
  RefreshCw,
  Loader2,
  Check,
  X,
  Dumbbell,
} from "lucide-react";
import { Message, ChatSession, UserProfile } from "../types";
import { generateChatTitle } from "../services/geminiService";

interface HistoryViewProps {
  onLoadSession: (messages: Message[]) => void;
  themeMode?: "dark" | "light";
  accentColor?: string;
  notify?: (
    message: string,
    type: "success" | "error" | "info" | "warning",
  ) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({
  onLoadSession,
  themeMode = "dark",
  accentColor = "orange",
  notify,
}) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "all" | "chat" | "image" | "exercise" | "other"
  >("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [isRegeneratingId, setIsRegeneratingId] = useState<string | null>(null);

  const isDark = themeMode === "dark";
  const bgClass = isDark ? "bg-neutral-950" : "bg-gray-50";
  const cardClass = isDark
    ? "bg-neutral-900 border-neutral-800"
    : "bg-white border-gray-200 shadow-sm";
  const headerText = isDark ? "text-white" : "text-gray-900";
  const subText = isDark ? "text-neutral-400" : "text-gray-500";
  const inputBg = isDark ? "bg-neutral-900" : "bg-white";
  const inputBorder = isDark ? "border-neutral-800" : "border-gray-300";

  const themes: Record<string, { text: string; border: string; bg: string }> = {
    orange: {
      text: "text-[#FFD700]",
      border: "border-[#FFD700]",
      bg: "bg-[#FFD700]",
    },
    blue: {
      text: "text-blue-500",
      border: "border-blue-500",
      bg: "bg-blue-600",
    },
    green: {
      text: "text-green-500",
      border: "border-green-500",
      bg: "bg-green-600",
    },
    purple: {
      text: "text-purple-500",
      border: "border-purple-500",
      bg: "bg-purple-600",
    },
    red: {
      text: "text-red-500",
      border: "border-red-500",
      bg: "bg-red-600",
    },
    pink: {
      text: "text-pink-500",
      border: "border-pink-500",
      bg: "bg-pink-600",
    },
    teal: {
      text: "text-teal-500",
      border: "border-teal-500",
      bg: "bg-teal-600",
    },
    cyan: {
      text: "text-cyan-500",
      border: "border-cyan-500",
      bg: "bg-cyan-600",
    },
    indigo: {
      text: "text-indigo-500",
      border: "border-indigo-500",
      bg: "bg-indigo-600",
    },
  };

  const currentTheme = themes[accentColor] || themes.orange;
  const accentText = currentTheme.text;
  const accentBorder = currentTheme.border;
  const accentBg = currentTheme.bg;

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);

  useEffect(() => {
    const savedUserStr = localStorage.getItem("x10minds_user");
    if (savedUserStr) {
      const user = JSON.parse(savedUserStr);
      if (user && user.email) {
        setUserEmail(user.email);
        const historyKey = `x10minds_history_${user.email}`;
        const savedHistory = localStorage.getItem(historyKey);
        if (savedHistory) {
          try {
            const parsed = JSON.parse(savedHistory);
            if (Array.isArray(parsed)) {
              // basic validation to ensure it's iterable
              setSessions(parsed);
            } else {
              setSessions([]);
            }
          } catch (e) {
            console.error("Failed to parse history", e);
            setSessions([]);
          }
        }
      }
    }
  }, []);

  const handleTogglePin = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = sessions.map((s) =>
      s.id === id ? { ...s, isPinned: !s.isPinned } : s,
    );
    setSessions(updated);
    if (userEmail) {
      localStorage.setItem(
        `x10minds_history_${userEmail}`,
        JSON.stringify(updated),
      );
    }
    setOpenMenuId(null);
    const session = sessions.find((s) => s.id === id);
    if (notify)
      notify(
        session?.isPinned ? "Conversations unpinned" : "Conversation pinned",
        "success",
      );
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    if (userEmail) {
      localStorage.setItem(
        `x10minds_history_${userEmail}`,
        JSON.stringify(updated),
      );
    }
    setOpenMenuId(null);
    if (notify) notify("Conversation deleted", "info");
  };

  const handleRenameStart = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation();
    setRenamingId(session.id);
    setRenameValue(session.title);
    setOpenMenuId(null);
  };

  const handleRenameSubmit = (
    e: React.MouseEvent | React.FormEvent,
    id: string,
  ) => {
    e.stopPropagation();
    if (!renameValue.trim()) return;

    const updated = sessions.map((s) =>
      s.id === id ? { ...s, title: renameValue.trim() } : s,
    );
    setSessions(updated);
    if (userEmail) {
      localStorage.setItem(
        `x10minds_history_${userEmail}`,
        JSON.stringify(updated),
      );
    }
    setRenamingId(null);
    if (notify) notify("Chat renamed", "success");
  };

  const handleRegenerateTitle = async (
    e: React.MouseEvent,
    session: ChatSession,
  ) => {
    e.stopPropagation();
    if (isRegeneratingId) return;

    setIsRegeneratingId(session.id);
    setOpenMenuId(null);

    try {
      const firstMsg = session.messages[0]?.content || "";
      const newTitle = await generateChatTitle(firstMsg);
      const cleanedTitle = newTitle.replace(/^"|"$/g, "");

      const updated = sessions.map((s) =>
        s.id === session.id ? { ...s, title: cleanedTitle } : s,
      );
      setSessions(updated);
      if (userEmail) {
        localStorage.setItem(
          `x10minds_history_${userEmail}`,
          JSON.stringify(updated),
        );
      }
      if (notify) notify("Title regenerated", "success");
    } catch (error) {
      console.error("Failed to regenerate title:", error);
      if (notify) notify("Failed to regenerate title", "error");
    } finally {
      setIsRegeneratingId(null);
    }
  };

  const handleDeleteAll = () => {
    setSessions([]);
    if (userEmail) {
      localStorage.setItem(`x10minds_history_${userEmail}`, JSON.stringify([]));
    }
    setShowConfirmDelete(false);
    if (notify) notify("All history cleared", "info");
  };

  const [displayLimit, setDisplayLimit] = useState(20);

  const filteredSessions = React.useMemo(() => {
    return sessions.filter((s) => {
      const title = s.title || "";
      const preview = s.preview || "";
      const matchesSearch =
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        preview.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab =
        activeTab === "all" || (s.type || "chat") === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [sessions, searchTerm, activeTab]);

  const sortedSessions = React.useMemo(() => {
    return [...filteredSessions].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [filteredSessions]);

  const displayedSessions = sortedSessions.slice(0, displayLimit);

  const handleLoadMore = () => {
    setDisplayLimit((prev) => prev + 20);
  };

  return (
    <div className={`p-4 md:p-8 ${bgClass}`}>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2
              className={`text-3xl font-bold flex items-center gap-3 ${headerText}`}
            >
              <Clock className={`w-8 h-8 ${accentText}`} />
              Session History
            </h2>
            {sessions.length > 0 && (
              <button
                onClick={() => setShowConfirmDelete(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isDark
                    ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                    : "bg-red-50 text-red-600 hover:bg-red-100"
                }`}
              >
                <Trash2 className="w-4 h-4" /> Clear All
              </button>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full border rounded-xl pl-12 pr-4 py-3 focus:outline-none transition-all ${inputBg} ${
                isDark ? "text-white" : "text-gray-900"
              } ${inputBorder} focus:${accentBorder}`}
            />
          </div>

          <div className="flex gap-2 mt-6 overflow-x-auto pb-2 custom-scrollbar">
            {(["all", "chat", "image", "exercise", "other"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? `${accentBg} ${accentColor === "orange" ? "text-black" : "text-white"} shadow-lg shadow-${accentColor === "orange" ? "yellow" : accentColor}-500/20`
                      : isDark
                        ? "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {tab === "all"
                    ? "All Sessions"
                    : tab.charAt(0).toUpperCase() + tab.slice(1) + "s"}
                </button>
              ),
            )}
          </div>
        </header>

        <div className="space-y-4">
          {displayedSessions.length === 0 ? (
            <div className={`text-center py-20 ${subText}`}>
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No history found in this category.</p>
            </div>
          ) : (
            <>
              {displayedSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => onLoadSession(session.messages)}
                  className={`p-4 rounded-xl cursor-pointer transition-all group border relative ${cardClass} hover:${accentBorder}/50 hover:${
                    isDark ? "bg-neutral-800" : "bg-gray-50"
                  } ${session.isPinned ? `${accentBorder}/30` : ""}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isDark ? "bg-neutral-800" : "bg-gray-100"
                        }`}
                      >
                        {session.type === "image" ? (
                          <ImageIcon className={`w-5 h-5 ${accentText}`} />
                        ) : session.type === "exercise" ? (
                          <Dumbbell className={`w-5 h-5 ${accentText}`} />
                        ) : (
                          <MessageSquare className={`w-5 h-5 ${accentText}`} />
                        )}
                      </div>
                      <div>
                        {renamingId === session.id ? (
                          <div
                            className="flex items-center gap-2 mb-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="text"
                              autoFocus
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  handleRenameSubmit(e, session.id);
                                if (e.key === "Escape") setRenamingId(null);
                              }}
                              className={`px-2 py-1 text-sm font-bold border rounded-lg focus:outline-none focus:${accentBorder} ${inputBg} ${headerText} ${inputBorder}`}
                            />
                            <button
                              onClick={(e) => handleRenameSubmit(e, session.id)}
                              className="p-1 hover:text-green-500 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => setRenamingId(null)}
                              className="p-1 hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <h3
                            className={`font-bold mb-1 flex items-center gap-2 ${headerText}`}
                          >
                            {session.title}
                            {session.isPinned && (
                              <Pin
                                className={`w-3.5 h-3.5 ${accentText} fill-current`}
                              />
                            )}
                            {isRegeneratingId === session.id && (
                              <Loader2
                                className={`w-3.5 h-3.5 ${accentText} animate-spin`}
                              />
                            )}
                          </h3>
                        )}
                        <p className={`text-sm line-clamp-1 ${subText}`}>
                          {session.preview}
                        </p>
                        <p
                          className={`text-xs mt-2 ${
                            isDark ? "text-neutral-600" : "text-gray-400"
                          }`}
                        >
                          {new Date(session.date).toLocaleDateString()} •{" "}
                          {session.messages?.length || 0} messages
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(
                            openMenuId === session.id ? null : session.id,
                          );
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark
                            ? "text-neutral-600 hover:text-white hover:bg-neutral-700"
                            : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {openMenuId === session.id && (
                        <div
                          className={`absolute right-0 top-full mt-2 w-48 rounded-2xl border shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${
                            isDark
                              ? "bg-neutral-900 border-neutral-800 shadow-black/50"
                              : "bg-white border-gray-100"
                          }`}
                        >
                          <button
                            onClick={(e) => handleTogglePin(e, session.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                              isDark
                                ? "hover:bg-neutral-800 text-neutral-300"
                                : "hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            {session.isPinned ? (
                              <>
                                <PinOff className="w-4 h-4" /> Unpin Session
                              </>
                            ) : (
                              <>
                                <Pin className="w-4 h-4" /> Pin Session
                              </>
                            )}
                          </button>
                          <button
                            onClick={(e) => handleRenameStart(e, session)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                              isDark
                                ? "hover:bg-neutral-800 text-neutral-300"
                                : "hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            <Pencil className="w-4 h-4" /> Rename Chat
                          </button>
                          <button
                            disabled={isRegeneratingId === session.id}
                            onClick={(e) => handleRegenerateTitle(e, session)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                              isDark
                                ? "hover:bg-neutral-800 text-neutral-300"
                                : "hover:bg-gray-50 text-gray-700"
                            } ${
                              isRegeneratingId === session.id
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <RefreshCw
                              className={`w-4 h-4 ${
                                isRegeneratingId === session.id
                                  ? "animate-spin"
                                  : ""
                              }`}
                            />
                            Regenerate Title
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, session.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-red-500 ${
                              isDark ? "hover:bg-red-500/10" : "hover:bg-red-50"
                            }`}
                          >
                            <Trash2 className="w-4 h-4" /> Delete Session
                          </button>
                        </div>
                      )}

                      <ChevronRight
                        className={`w-5 h-5 transition-colors ${
                          isDark
                            ? "text-neutral-600 group-hover:text-white"
                            : "text-gray-300 group-hover:text-gray-900"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {sortedSessions.length > displayedSessions.length && (
                <button
                  onClick={handleLoadMore}
                  className={`w-full py-4 rounded-xl font-bold transition-all ${
                    isDark
                      ? "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  Load More History
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div
            className={`max-w-md w-full rounded-3xl p-8 shadow-2xl border animate-in zoom-in-95 duration-200 ${cardClass}`}
          >
            <h3 className={`text-2xl font-bold mb-4 ${headerText}`}>
              Delete All History?
            </h3>
            <p className={`${subText} mb-8`}>
              This action cannot be undone. All your saved conversations will be
              permanently removed.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
              >
                No
              </button>
              <button
                onClick={handleDeleteAll}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  isDark
                    ? "bg-neutral-800 text-white hover:bg-neutral-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryView;
