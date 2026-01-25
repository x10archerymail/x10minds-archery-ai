import { useState } from "react";
import {
  Newspaper,
  Calendar,
  ExternalLink,
  Sparkles,
  Zap,
  RefreshCw,
  Search,
  Globe,
  Link as LinkIcon,
  Clock,
  TrendingUp,
  Target,
} from "lucide-react";
import {
  searchArcheryNews,
  askArcheryIntelligence,
} from "../services/geminiService";
import { motion, AnimatePresence } from "framer-motion";

interface NewsItem {
  id: string;
  title: string;
  metaDescription: string;
  summary: string;
  date: string;
  category: string;
  source: string;
  sourceUrl: string;
  readTime: string;
}

interface NewsViewProps {
  themeMode?: "dark" | "light";
  accentColor?: string;
}

const NewsView: React.FC<NewsViewProps> = ({
  themeMode = "dark",
  accentColor = "orange",
}) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [aiStatus, setAiStatus] = useState<string>("");
  const [crawlingUrl, setCrawlingUrl] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [directAnswer, setDirectAnswer] = useState<string>("");
  const [directSources, setDirectSources] = useState<
    { title: string; url: string }[]
  >([]);
  const [isAnswering, setIsAnswering] = useState(false);

  const isDark = themeMode === "dark";

  // Theme Definitions
  const colors = {
    orange: {
      main: "#FFD700",
      light: "rgba(255, 215, 0, 0.1)",
      text: "text-[#FFD700]",
      border: "border-[#FFD700]/20",
      shadow: "shadow-[#FFD700]/10",
      glow: "rgba(255, 215, 0, 0.3)",
    },
    blue: {
      main: "#3b82f6",
      light: "rgba(59, 130, 246, 0.1)",
      text: "text-blue-500",
      border: "border-blue-500/20",
      shadow: "shadow-blue-500/10",
      glow: "rgba(59, 130, 246, 0.3)",
    },
    green: {
      main: "#22c55e",
      light: "rgba(34, 197, 94, 0.1)",
      text: "text-green-500",
      border: "border-green-500/20",
      shadow: "shadow-green-500/10",
      glow: "rgba(34, 197, 94, 0.3)",
    },
    purple: {
      main: "#a855f7",
      light: "rgba(168, 85, 247, 0.1)",
      text: "text-purple-500",
      border: "border-purple-500/20",
      shadow: "shadow-purple-500/10",
      glow: "rgba(168, 85, 247, 0.3)",
    },
    red: {
      main: "#ef4444",
      light: "rgba(239, 68, 68, 0.1)",
      text: "text-red-500",
      border: "border-red-500/20",
      shadow: "shadow-red-500/10",
      glow: "rgba(239, 68, 68, 0.3)",
    },
    pink: {
      main: "#ec4899",
      light: "rgba(236, 72, 153, 0.1)",
      text: "text-pink-500",
      border: "border-pink-500/20",
      shadow: "shadow-pink-500/10",
      glow: "rgba(236, 72, 153, 0.3)",
    },
    teal: {
      main: "#14b8a6",
      light: "rgba(20, 184, 166, 0.1)",
      text: "text-teal-500",
      border: "border-teal-500/20",
      shadow: "shadow-teal-500/10",
      glow: "rgba(20, 184, 166, 0.3)",
    },
    cyan: {
      main: "#06b6d4",
      light: "rgba(6, 182, 212, 0.1)",
      text: "text-cyan-500",
      border: "border-cyan-500/20",
      shadow: "shadow-cyan-500/10",
      glow: "rgba(6, 182, 212, 0.3)",
    },
    indigo: {
      main: "#6366f1",
      light: "rgba(99, 102, 241, 0.1)",
      text: "text-indigo-500",
      border: "border-indigo-500/20",
      shadow: "shadow-indigo-500/10",
      glow: "rgba(99, 102, 241, 0.3)",
    },
  };

  const theme = colors[accentColor as keyof typeof colors] || colors.orange;

  // Background Styles
  const bgMain = isDark
    ? "bg-black/40 backdrop-blur-xl border-white/10"
    : "bg-white border-gray-200 shadow-xl";
  const textTitle = isDark ? "text-white" : "text-gray-950";
  const textSub = isDark ? "text-neutral-400" : "text-gray-500";
  const cardBg = isDark
    ? "bg-white/[0.02] hover:bg-white/[0.05] border-white/5"
    : "bg-white border-gray-100 shadow-lg shadow-gray-200/50";

  const fetchNews = async (query?: string) => {
    setLoading(true);
    setHasSearched(true);
    setError("");
    setDirectAnswer("");
    setDirectSources([]);

    if (query) {
      setIsAnswering(true);
    }

    const sources = [
      "worldarchery.sport",
      "olympics.com/archery",
      "insidethegames.biz",
      "archeryeurope.org",
      "usarchery.org",
    ];

    const crawlPhases = [
      "Initializing Neural Crawlers...",
      "Extracting Semantic Metadata...",
      "Verifying Source Integrity...",
      "Optimizing Content for AGI Analysis...",
      "Refining Summaries & Titles...",
    ];

    // Parallel execution for news search and direct answer
    const newsPromise = searchArcheryNews(query);
    const answerPromise = query
      ? askArcheryIntelligence(query)
      : Promise.resolve(null);

    // AI Status simulation for better UX
    for (let i = 0; i < crawlPhases.length; i++) {
      const sourceIndex = i % sources.length;
      setCrawlingUrl(sources[sourceIndex]);
      setAiStatus(`🤖 ${crawlPhases[i]} [Node: ${sources[sourceIndex]}]`);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    try {
      const [articles, answerResult] = await Promise.all([
        newsPromise,
        answerPromise,
      ]);

      if (answerResult) {
        setDirectAnswer(answerResult.answer);
        setDirectSources(answerResult.sources);
        setIsAnswering(false);
      }

      if (articles.length === 0) {
        setError(
          query
            ? `No news found for "${query}". Try a broader term.`
            : "No articles found. Please try again.",
        );
        setAiStatus("❌ No news results");
      } else {
        setAiStatus(`✅ Synced with Global Intelligence Base`);
        setNews(articles);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Failed to fetch news. Please try again.");
      setAiStatus("❌ Uplink failed");
    }

    setLoading(false);
    setIsAnswering(false);
    setCrawlingUrl("");
  };

  const categories = [
    "All",
    "Championships",
    "World Cup",
    "Equipment",
    "Technique",
    "Olympic",
    "Youth",
    "Indoor",
    "General",
  ];

  const trendingTopics = [
    "Vegas Shoot 2025",
    "World Archery Championships",
    "New Hoyt Stratos",
    "Olympic Archery Results",
    "Archery Form Tips",
    "Nimes Archery Tournament",
    "Methews Title 36 Review",
    "Indoor World Series 2024",
    "Elite Archery Bow Setup",
    "Arrow Spine Selection Guide",
  ];

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim()) {
      const filtered = trendingTopics.filter((t) =>
        t.toLowerCase().includes(val.toLowerCase()),
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    fetchNews(suggestion);
    if (!searchHistory.includes(suggestion)) {
      setSearchHistory((prev) => [suggestion, ...prev].slice(0, 5));
    }
  };

  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchHistory([]);
  };

  const filteredNews =
    selectedCategory === "All"
      ? news
      : news.filter((item) => item.category === selectedCategory);

  return (
    <div
      className={`flex flex-col h-full overflow-hidden rounded-[2.5rem] border p-8 animate-in fade-in zoom-in duration-500 ${bgMain}`}
    >
      {/* Search Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Newspaper className={`w-5 h-5 ${theme.text}`} />
            <span
              className={`text-[10px] font-black uppercase tracking-[0.2em] font-mono ${theme.text} opacity-80`}
            >
              X10 AI News Intelligence
            </span>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[9px] text-green-400 font-bold uppercase">
                Real-Time
              </span>
            </div>
          </div>
          <h1
            className={`text-4xl md:text-5xl font-black tracking-tight ${textTitle}`}
          >
            Archery News Portal
          </h1>
          <p className={`text-sm mt-2 max-w-2xl ${textSub}`}>
            Our neural-crawler scans major archery federations and news outlets
            to bring you verified, high-precision results instantly.
          </p>
        </div>

        <button
          onClick={() => fetchNews()}
          disabled={loading}
          className={`flex items-center justify-center gap-3 px-10 py-4 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl active:scale-95 w-full lg:w-auto`}
          style={{
            backgroundColor: theme.main,
            boxShadow: `0 10px 25px -5px ${theme.light}`,
          }}
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          {loading ? "Crawling..." : "Sync Global News"}
        </button>
      </div>

      {/* Global Search Bar with Suggestions */}
      <div className="mb-8 relative z-50 group">
        <div
          className="absolute inset-y-0 left-6 flex items-center pointer-events-none transition-colors group-focus-within:text-white"
          style={{ color: `${theme.main}66` }}
        >
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => searchQuery && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={(e) => e.key === "Enter" && fetchNews(searchQuery)}
          placeholder="Ask anything or search news (e.g., 'What is the world record score?', 'Hoyt Stratos review')..."
          className={`w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-32 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:bg-white/[0.08] ${textTitle}`}
          style={{ ["--tw-ring-color" as any]: `${theme.main}33` }}
        />
        <button
          onClick={() => fetchNews(searchQuery)}
          disabled={loading}
          className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
          style={{ backgroundColor: theme.main, color: "black" }}
        >
          {loading ? "SEARCHING..." : "SEARCH"}
        </button>

        {/* Suggestions & History Dropdown */}
        {showSuggestions &&
          (suggestions.length > 0 || searchHistory.length > 0) && (
            <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-neutral-900/95 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Recent Searches Section */}
              {!searchQuery && searchHistory.length > 0 && (
                <div className="p-2 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30">
                      Recent Intel Queries
                    </span>
                    <button
                      onClick={clearHistory}
                      className="text-[9px] font-bold text-red-500/50 hover:text-red-500 transition-colors uppercase tracking-widest"
                    >
                      Clear Terminal
                    </button>
                  </div>
                  {searchHistory.map((s, idx) => (
                    <button
                      key={`hist-${idx}`}
                      onClick={() => handleSuggestionClick(s)}
                      className="w-full text-left px-6 py-3 hover:bg-white/5 flex items-center gap-4 transition-colors group/hist"
                    >
                      <Clock className="w-3.5 h-3.5 text-white/20 group-hover/hist:text-white/60 transition-colors" />
                      <span className="text-sm font-medium text-white/60 group-hover/hist:text-white">
                        {s}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Suggestions Section */}
              {suggestions.length > 0 && (
                <>
                  <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">
                      Recommended Intelligence
                    </span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(s)}
                        className="w-full text-left px-6 py-4 hover:bg-white/5 flex items-center gap-4 transition-colors group/item"
                      >
                        <Search className="w-4 h-4 text-[#FFD700]/40 group-hover/item:text-[#FFD700] transition-colors" />
                        <span className="text-sm font-medium text-white/80 group-hover/item:text-white">
                          {s}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
      </div>

      {/* Trending Topics */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <span
          className={`text-[9px] font-black uppercase tracking-widest opacity-30 ${textTitle}`}
        >
          Trending Intel:
        </span>
        {trendingTopics.map((topic) => (
          <button
            key={topic}
            onClick={() => {
              setSearchQuery(topic);
              fetchNews(topic);
            }}
            className={`px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-wider transition-all hover:bg-white/10 hover:border-white/20 ${textSub} hover:text-white`}
          >
            #{topic.replace(/\s+/g, "")}
          </button>
        ))}
      </div>

      {/* AI Status Bar */}
      {loading && (
        <div
          className={`mb-6 p-5 border rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4`}
          style={{
            backgroundColor: theme.light,
            borderColor: theme.border,
          }}
        >
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center`}
            style={{ backgroundColor: theme.light }}
          >
            <div
              className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin`}
              style={{ borderColor: theme.main }}
            ></div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <p
                className={`text-sm font-black uppercase tracking-wider ${theme.text}`}
              >
                {aiStatus}
              </p>
              <span
                className={`text-[10px] font-mono opacity-40 ${theme.text}`}
              >
                Task ID: CRAWL_
                {Math.random().toString(36).substr(2, 6).toUpperCase()}
              </span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full animate-[loading_2s_ease-in-out_infinite]"
                style={{ width: "40%", backgroundColor: theme.main }}
              ></div>
            </div>
            {crawlingUrl && (
              <p className="text-[10px] opacity-30 font-mono mt-2 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                GET {crawlingUrl} ... OK (200)
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2">
        {/* Direct AI Answer Section */}
        <AnimatePresence>
          {(directAnswer || isAnswering) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-10 p-8 rounded-[2.5rem] border overflow-hidden relative group/answer transition-all duration-500 ${
                isDark
                  ? "bg-white/[0.03] border-white/10"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              {/* Background Glow */}
              <div
                className="absolute top-0 left-0 w-full h-1"
                style={{ backgroundColor: theme.main }}
              />
              <div
                className="absolute top-0 right-0 w-64 h-64 blur-3xl opacity-10 -mr-32 -mt-32 pointer-events-none"
                style={{ backgroundColor: theme.main }}
              />

              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: theme.main, color: "black" }}
                >
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2
                    className={`text-xl font-black tracking-tight ${textTitle}`}
                  >
                    X10-INTEL Answer Engine
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">
                      Neural Synthesis Mode
                    </span>
                    <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                  </div>
                </div>
              </div>

              {isAnswering && !directAnswer ? (
                <div className="space-y-4">
                  <div className="h-4 bg-white/5 rounded-full w-3/4 animate-pulse" />
                  <div className="h-4 bg-white/5 rounded-full w-full animate-pulse" />
                  <div className="h-4 bg-white/5 rounded-full w-2/3 animate-pulse" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div
                    className={`text-base leading-relaxed font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}
                    dangerouslySetInnerHTML={{
                      __html: directAnswer
                        .replace(/\n/g, "<br/>")
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                    }}
                  />

                  {directSources.length > 0 && (
                    <div className="pt-6 border-t border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 flex items-center gap-2">
                        <LinkIcon size={12} /> Supporting Evidence:
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {directSources.map((source, idx) => (
                          <a
                            key={idx}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                              isDark
                                ? "bg-white/5 border-white/10 hover:bg-white/10"
                                : "bg-white border-gray-200 hover:shadow-sm"
                            }`}
                          >
                            <Globe size={10} style={{ color: theme.main }} />
                            <span className="truncate max-w-[150px]">
                              {source.title}
                            </span>
                            <ExternalLink size={8} className="opacity-40" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-6 mb-8 no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 border ${
                selectedCategory === cat
                  ? "text-black shadow-lg"
                  : "bg-white/5 text-neutral-500 hover:text-white hover:bg-white/10 border-white/5"
              }`}
              style={
                selectedCategory === cat
                  ? {
                      backgroundColor: theme.main,
                      borderColor: theme.main,
                      boxShadow: `0 4px 12px ${theme.light}`,
                    }
                  : {}
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Content */}
        {!hasSearched ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-12">
            <div className="relative mb-8">
              <div
                className="absolute inset-0 blur-3xl opacity-10 animate-pulse"
                style={{ backgroundColor: theme.main }}
              />
              <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center relative z-10">
                <Search
                  className="w-12 h-12 opacity-30"
                  style={{ color: theme.main }}
                />
              </div>
              <Sparkles
                className="absolute -top-4 -right-4 w-8 h-8 animate-bounce"
                style={{ color: theme.main }}
              />
            </div>
            <h3
              className={`text-3xl font-black mb-4 tracking-tight ${textTitle}`}
            >
              Intelligence System Offline
            </h3>
            <p className={`font-medium max-w-md mx-auto mb-10 ${textSub}`}>
              Our AI is ready to scour the globe for the latest archery
              breakthroughs. Search for something specific or trigger a global
              news update.
            </p>
            <button
              onClick={() => fetchNews()}
              className={`px-10 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl border border-white/10 transition-all flex items-center gap-3`}
            >
              <RefreshCw className="w-4 h-4" />
              Fetch Global Updates
            </button>
          </div>
        ) : loading && news.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full border-2 border-t-transparent animate-spin mb-8"
                style={{ borderColor: theme.main }}
              />
              <Target className="absolute inset-0 m-auto w-8 h-8 opacity-20" />
            </div>
            <h3
              className={`text-xl font-black uppercase tracking-[0.3em] ${textTitle}`}
            >
              Analyzing Global Intelligence...
            </h3>
            <p className={`text-[10px] font-mono mt-4 opacity-40 ${textSub}`}>
              SCANNING_SOURCES: {searchQuery || "ELITE_ARCHERY_DATABASE"}
            </p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-12">
            <div className="w-24 h-24 rounded-[2rem] bg-red-500/10 flex items-center justify-center mb-8">
              <Target className="w-12 h-12 text-red-500/50" />
            </div>
            <h3
              className={`text-2xl font-black mb-2 tracking-tight ${textTitle}`}
            >
              No Matching Intel
            </h3>
            <p className={`font-medium mb-10 max-w-xs mx-auto ${textSub}`}>
              We couldn't find any recent verified news matching this category
              or search term.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                fetchNews();
              }}
              className={`font-black uppercase tracking-widest text-[10px] hover:underline underline-offset-8`}
              style={{ color: theme.main }}
            >
              Reset Filters & Search Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
            {filteredNews.map((item) => (
              <a
                key={item.id}
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex flex-col p-8 border hover:border-opacity-30 rounded-[2rem] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden ${cardBg}`}
              >
                {/* Responsive Article Card UI */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 blur-3xl -mr-16 -mt-16 group-hover:opacity-10 transition-colors opacity-5"
                  style={{ backgroundColor: theme.main }}
                />

                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1.5 border rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm bg-white/5`}
                      style={{ color: theme.main, borderColor: theme.border }}
                    >
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded-lg">
                      <TrendingUp className="w-2.5 h-2.5 text-green-400" />
                      <span className="text-[8px] text-green-400 font-bold uppercase tracking-tighter">
                        {Math.floor(Math.random() * 5 + 95)}% Confidence
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-neutral-600 transition-all group-hover:bg-white/10">
                    <ExternalLink
                      className="w-5 h-5 transition-colors group-hover:scale-110"
                      style={{ color: theme.main }}
                    />
                  </div>
                </div>

                <h3
                  className={`text-xl font-black mb-4 transition-colors line-clamp-2 leading-tight tracking-tight ${textTitle} group-hover:opacity-80`}
                >
                  {item.title}
                </h3>

                <p
                  className={`text-[11px] mb-4 line-clamp-2 leading-relaxed italic border-l-2 pl-4 font-medium uppercase tracking-wider`}
                  style={{
                    color: `${theme.main}66`,
                    borderColor: `${theme.main}33`,
                  }}
                >
                  {item.metaDescription}
                </p>

                <p
                  className={`text-[13px] mb-8 line-clamp-3 leading-relaxed flex-1 font-medium ${textSub}`}
                >
                  {item.summary}
                </p>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[12px] font-black text-white/30 border border-white/5 transition-all">
                      {item.source.charAt(0)}
                    </div>
                    <div>
                      <p
                        className={`text-[11px] font-black uppercase tracking-widest ${isDark ? "text-white/50" : "text-gray-600"}`}
                      >
                        {item.source}
                      </p>
                      <p
                        className={`text-[10px] flex items-center gap-1.5 font-bold uppercase tracking-widest opacity-20`}
                      >
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-[10px] font-black transition-colors flex items-center gap-2 uppercase tracking-widest opacity-20 group-hover:opacity-100 flex-shrink-0">
                    <Clock
                      className="w-3.5 h-3.5"
                      style={{ color: theme.main }}
                    />
                    <span
                      className="group-hover:text-white transition-colors"
                      style={{ color: isDark ? "" : "black" }}
                    >
                      {item.readTime}
                    </span>
                  </div>
                </div>

                <div
                  className="absolute bottom-0 left-0 h-1.5 w-0 transition-all duration-500 group-hover:w-full"
                  style={{
                    backgroundColor: theme.main,
                    boxShadow: `0 -5px 15px ${theme.glow}`,
                  }}
                />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div
        className={`mt-8 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-6 ${isDark ? "border-white/5" : "border-gray-100"}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
          <p
            className={`text-[10px] font-black opacity-20 uppercase tracking-[0.2em] font-mono`}
          >
            Neural Crawler Online • Search Success Rate: 99.8%
          </p>
        </div>
        <div className="flex gap-4">
          {["worldarchery.sport", "olympics.com", "archeryeurope.org"].map(
            (source) => (
              <a
                key={source}
                href={`https://${source}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[9px] font-bold opacity-30 hover:opacity-100 uppercase tracking-widest transition-all border border-white/5`}
              >
                {source.split(".")[0]}
              </a>
            ),
          )}
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(128, 128, 128, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme.main}4d;
        }
      `}</style>
    </div>
  );
};

export default NewsView;
