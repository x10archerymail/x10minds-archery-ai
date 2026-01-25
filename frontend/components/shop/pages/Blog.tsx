import * as React from "react";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogProps {
  themeMode?: "dark" | "light";
}

const Blog: React.FC<BlogProps> = ({ themeMode = "dark" }) => {
  const isDark = themeMode === "dark";
  const posts = [
    {
      title: "Tactical Trajectory: The Physics of Flight",
      excerpt:
        "Deep dive into the aerodynamic specifications of X10 field equipment.",
      date: "Oct 24, 2024",
      author: "Alex Rivers",
      category: "Innovation",
    },
    {
      title: "Operational Ergonomics in Competition",
      excerpt:
        "The neurological impact of carbon-density on split-second precision.",
      date: "Oct 20, 2024",
      author: "Sarah Chen",
      category: "Productivity",
    },
    {
      title: "Sustainability Protocol: 2025 Vision",
      excerpt:
        "Transitioning to 100% circular manufacturing for all core artifacts.",
      date: "Oct 15, 2024",
      author: "Marcus Thorne",
      category: "Ethics",
    },
  ];

  return (
    <div
      className={`pt-32 pb-24 transition-colors duration-500 ${isDark ? "bg-[#000]" : "bg-white"}`}
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto mb-24 text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[#FFD700] font-black tracking-[0.4em] uppercase text-[10px] mb-6 block"
          >
            Intelligence Base
          </motion.span>
          <h1
            className={`text-6xl md:text-8xl font-black mb-8 tracking-tighter ${isDark ? "text-white" : "text-gray-950"}`}
          >
            X10 <span className="text-[#FFD700]">Field Logs</span>
          </h1>
          <p
            className={`text-sm font-black uppercase tracking-[0.2em] leading-loose max-w-2xl mx-auto ${isDark ? "text-gray-600" : "text-gray-400"}`}
          >
            Analytical insights and project updates from the X10Minds
            operational research division.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.map((post, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div
                className={`rounded-[3rem] overflow-hidden border transition-all duration-500 flex flex-col h-full ${
                  isDark
                    ? "bg-neutral-900 border-white/5 hover:border-[#FFD700]/30 shadow-2xl shadow-black"
                    : "bg-white border-gray-100 hover:border-yellow-200 shadow-2xl shadow-gray-200/40"
                }`}
              >
                <div
                  className={`h-64 relative overflow-hidden flex items-center justify-center p-10 ${
                    isDark ? "bg-white/[0.02]" : "bg-gray-50"
                  }`}
                >
                  <div className="absolute top-6 left-6 bg-[#FFD700] text-black text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-2xl shadow-yellow-500/20 z-10">
                    {post.category}
                  </div>
                  <span
                    className={`text-8xl font-black transition-transform duration-700 group-hover:scale-110 ${
                      isDark ? "text-white/[0.02]" : "text-black/[0.02]"
                    }`}
                  >
                    LOG_{i + 1}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </div>

                <div className="p-10 flex flex-col flex-grow">
                  <div
                    className={`flex items-center gap-6 text-[9px] font-black uppercase tracking-widest mb-6 ${
                      isDark ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Calendar size={12} className="text-[#FFD700]" />{" "}
                      {post.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <User size={12} className="text-[#FFD700]" />{" "}
                      {post.author}
                    </span>
                  </div>
                  <h3
                    className={`text-2xl font-black mb-6 tracking-tighter transition-colors leading-tight group-hover:text-[#FFD700] ${
                      isDark ? "text-white" : "text-gray-950"
                    }`}
                  >
                    {post.title}
                  </h3>
                  <p
                    className={`text-[11px] font-black uppercase tracking-widest leading-loose mb-10 line-clamp-2 ${
                      isDark ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {post.excerpt}
                  </p>
                  <div className="mt-auto">
                    <a
                      href="https://docs.x10minds.com"
                      className="flex items-center gap-3 text-[#FFD700] text-[10px] font-black uppercase tracking-[0.2em] group/btn"
                    >
                      Analyze Report{" "}
                      <ArrowRight
                        size={16}
                        className="group-hover/btn:translate-x-2 transition-transform"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
