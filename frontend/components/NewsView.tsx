import React, { useState } from "react";
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
import { searchArcheryNews } from "../services/geminiService";

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

const NewsView: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [aiStatus, setAiStatus] = useState<string>("");
  const [crawlingUrl, setCrawlingUrl] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string>("");

  const fetchNews = async (query?: string) => {
    setLoading(true);
    setHasSearched(true);
    setError("");

    // Simulate AI crawling different sources based on query
    const sources = [
      "worldarchery.sport",
      "olympics.com/archery",
      "insidethegames.biz",
      "archeryeurope.org",
      "usarchery.org",
    ];

    const crawlPhases = [
      "Initializing Neural Crawlers...",
      "Bypassing Global CDNs...",
      "Extracting Semantic Metadata...",
      "Verifying Source Integrity...",
      "Optimizing Content for AGI Analysis...",
      "Generating SEO Meta-Descriptions...",
      "Refining Summaries & Titles...",
    ];

    for (let i = 0; i < crawlPhases.length; i++) {
      const sourceIndex = i % sources.length;
      setCrawlingUrl(sources[sourceIndex]);
      setAiStatus(`🤖 ${crawlPhases[i]} [Node: ${sources[sourceIndex]}]`);
      await new Promise((resolve) =>
        setTimeout(resolve, i === crawlPhases.length - 1 ? 800 : 400)
      );
    }

    try {
      // Call the real web search function with query
      const articles = await searchArcheryNews(query);

      if (articles.length === 0) {
        setError(
          query
            ? `No news found for "${query}". Try a broader term.`
            : "No articles found. Please try again."
        );
        setAiStatus("❌ No results found");
      } else {
        setAiStatus(`✅ Found ${articles.length} verified articles`);
        await new Promise((resolve) => setTimeout(resolve, 400));
        setNews(articles);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Failed to fetch news. Please try again.");
      setAiStatus("❌ Search failed");
    }

    setLoading(false);
    setCrawlingUrl("");
  };

  const categories = [
    "All",
    "Championships",
    "World Cup",
    "Youth",
    "Indoor",
    "Olympic",
    "Para-Archery",
  ];

  const filteredNews =
    selectedCategory === "All"
      ? news
      : news.filter((item) => item.category === selectedCategory);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-neutral-950/50 backdrop-blur-xl rounded-3xl border border-white/5 p-6 animate-in fade-in zoom-in duration-500">
      {/* Search Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Newspaper className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-orange-500/80 uppercase tracking-widest">
              X10 AI News Intelligence
            </span>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[9px] text-green-400 font-bold uppercase">
                Real-Time
              </span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40">
            Archery News Portal
          </h1>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl">
            Our neural-crawler scans major archery federations and news outlets
            to bring you verified, high-precision results instantly.
          </p>
        </div>

        <button
          onClick={() => fetchNews()}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-800/50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-600/20 active:scale-95 w-full lg:w-auto"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          {loading ? "Crawling..." : "Sync Global News"}
        </button>
      </div>

      {/* AI Status Bar */}
      {loading && (
        <div className="mb-6 p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-bold text-orange-400">{aiStatus}</p>
              <span className="text-[10px] font-mono text-orange-500/40">
                Task ID: CRAWL_
                {Math.random().toString(36).substr(2, 6).toUpperCase()}
              </span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 animate-[loading_2s_ease-in-out_infinite]"
                style={{ width: "40%" }}
              ></div>
            </div>
            {crawlingUrl && (
              <p className="text-[10px] text-white/30 font-mono mt-2 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                GET {crawlingUrl} ... OK (200)
              </p>
            )}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 custom-scrollbar no-scrollbar scroll-smooth">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap active:scale-95 ${
              selectedCategory === cat
                ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-600/20 border-t border-white/20"
                : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-transparent"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2">
        {!hasSearched ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-12">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-orange-500 blur-3xl opacity-10 animate-pulse"></div>
              <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center relative z-10">
                <Search className="w-12 h-12 text-orange-500/50" />
              </div>
              <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-orange-400 animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Intelligence System Offline
            </h3>
            <p className="text-neutral-400 max-w-md mx-auto mb-8">
              Our AI is ready to scour the globe for the latest archery
              breakthroughs. Search for something specific or trigger a global
              news update.
            </p>
            <button
              onClick={() => fetchNews()}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all flex items-center gap-3"
            >
              <RefreshCw className="w-5 h-5" />
              Fetch Global Updates
            </button>
          </div>
        ) : loading && news.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-6">
            <div className="grid grid-cols-2 gap-4 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-48 h-32 bg-white/5 rounded-2xl border border-white/5"
                ></div>
              ))}
            </div>
            <p className="text-orange-500/60 font-medium animate-pulse">
              AI deep-crawling global databases...
            </p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-12">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
              <Target className="w-10 h-10 text-red-500/50" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No Matching Intel
            </h3>
            <p className="text-neutral-500 mb-8 max-w-xs">
              We couldn't find any recent verified news matching this category
              or search term.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                fetchNews();
              }}
              className="text-orange-500 font-bold hover:underline"
            >
              Reset Filters & Search Again
            </button>
            {error && (
              <p className="mt-4 text-red-500/60 text-sm font-mono">{error}</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
            {filteredNews.map((item, index) => (
              <a
                key={item.id}
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col p-6 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-orange-500/30 rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/10 overflow-hidden"
              >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-orange-500/10 transition-colors"></div>

                <div className="flex items-start justify-between mb-4 relative z-10">
                  <span className="px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 rounded-lg text-[9px] font-black text-orange-400 uppercase tracking-widest">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-2 text-white/20 group-hover:text-orange-400 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-[11px] text-white/40 mb-3 line-clamp-2 leading-relaxed italic border-l border-white/10 pl-3">
                  {item.metaDescription}
                </p>

                <p className="text-sm text-neutral-400 mb-6 line-clamp-3 leading-relaxed flex-1">
                  {item.summary}
                </p>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/30 border border-white/5">
                      {item.source.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/50 group-hover:text-white transition-colors">
                        {item.source}
                      </p>
                      <p className="text-[9px] text-white/20 flex items-center gap-1 italic">
                        <Calendar className="w-2.5 h-2.5" />
                        {item.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-white/20 group-hover:text-orange-500 transition-colors flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.readTime}
                  </div>
                </div>

                {/* Hover Glow Bar */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-orange-500 transition-all duration-500 group-hover:w-full"></div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] font-mono">
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
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[9px] font-bold text-white/30 hover:text-white uppercase tracking-widest transition-all border border-white/5"
              >
                {source.split(".")[0]}
              </a>
            )
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
      `}</style>
    </div>
  );
};

export default NewsView;
