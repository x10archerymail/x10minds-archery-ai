import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import {
  Trophy,
  Medal,
  Target,
  Search,
  User,
  Crown,
  TrendingUp,
  Filter,
} from "lucide-react";
import { UserProfile, ScoreData } from "../types";

interface LeaderboardViewProps {
  currentUser: UserProfile | null;
  currentUserScoreData: ScoreData[];
  publicProfile: boolean;
  themeMode?: "dark" | "light";
  accentColor?: string;
  onBack?: () => void;
}

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  tier: string;
  avgScore: number;
  xCount: number;
  country: string;
  isCurrentUser?: boolean;
  avatar?: string;
}

// Mock Data Generator
const generateMockData = (current?: LeaderboardEntry): LeaderboardEntry[] => {
  const entries: LeaderboardEntry[] = [];

  if (current) {
    entries.push(current);
  }

  return entries;
};

const LeaderboardView: React.FC<LeaderboardViewProps> = React.memo(
  ({
    currentUser,
    currentUserScoreData,
    publicProfile,
    themeMode = "dark",
    accentColor = "orange",
  }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState<LeaderboardEntry[]>([]);
    const isDark = themeMode === "dark";

    // Calculate user stats & rank
    useEffect(() => {
      let userEntry: LeaderboardEntry | undefined;

      if (currentUser && publicProfile && currentUserScoreData.length > 0) {
        const avg = Math.round(
          currentUserScoreData.reduce((acc, curr) => acc + curr.score, 0) /
            currentUserScoreData.length,
        );
        // Calculate X count avg (mock logic for x count if not tracked per arrow)
        const xAvg =
          Math.round(
            currentUserScoreData.reduce(
              (acc, curr) => acc + (curr.xCount || 0),
              0,
            ) / currentUserScoreData.length,
          ) || 0;

        let tier = "Unranked";
        if (avg >= 345) tier = "Olympic Champion";
        else if (avg >= 340) tier = "Asian Champion";
        else if (avg >= 335) tier = "World Champion";
        else if (avg >= 320) tier = "Diamond";
        else if (avg >= 300) tier = "Platinum";
        else if (avg >= 270) tier = "Gold";
        else if (avg >= 250) tier = "Silver";
        else if (avg >= 170) tier = "Copper";

        userEntry = {
          id: "current-user",
          rank: 0, // Will be calc'd
          name: currentUser.fullName,
          tier,
          avgScore: avg,
          xCount: xAvg,
          country: "YOU",
          isCurrentUser: true,
        };
      }

      setData(generateMockData(userEntry));
    }, [currentUser, currentUserScoreData, publicProfile]);

    // Styles
    const bgClass = isDark ? "bg-neutral-950" : "bg-gray-50";
    const cardClass = isDark
      ? "bg-neutral-900 border-neutral-800"
      : "bg-white border-gray-200 shadow-sm";
    const textMain = isDark ? "text-white" : "text-gray-900";
    const textSub = isDark ? "text-neutral-400" : "text-gray-500";
    const textColors: Record<string, string> = {
      orange: "text-[#FFD700]",
      blue: "text-blue-500",
      green: "text-green-500",
      purple: "text-purple-500",
      red: "text-red-500",
      pink: "text-pink-500",
      teal: "text-teal-500",
      cyan: "text-cyan-500",
      indigo: "text-indigo-500",
    };
    const accentText = textColors[accentColor] || "text-[#FFD700]";
    const bgColors: Record<string, string> = {
      orange: "bg-[#FFD700]",
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      red: "bg-red-500",
      pink: "bg-pink-500",
      teal: "bg-teal-500",
      cyan: "bg-cyan-500",
      indigo: "bg-indigo-500",
    };
    const accentBg = bgColors[accentColor] || "bg-[#FFD700]";

    const getRankBadge = (rank: number) => {
      if (rank === 1)
        return (
          <Crown className="w-6 h-6 text-yellow-500" fill="currentColor" />
        );
      if (rank === 2)
        return <Medal className="w-6 h-6 text-gray-300" fill="currentColor" />;
      if (rank === 3)
        return <Medal className="w-6 h-6 text-amber-700" fill="currentColor" />;
      return <span className={`font-bold text-lg ${textSub}`}>#{rank}</span>;
    };

    const filteredData = data.filter((entry) =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
      <div className={`p-4 md:p-8 ${bgClass}`}>
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h2
              className={`text-3xl font-bold mb-2 flex items-center gap-3 ${textMain}`}
            >
              <Trophy className={`w-8 h-8 ${accentText}`} />
              Global Leaderboard
            </h2>
            <p className={textSub}>
              See how you stack up against archers from around the world.
            </p>
          </header>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className={`flex-1 relative`}>
              <Search
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${textSub}`}
              />
              <input
                type="text"
                placeholder="Search archers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none transition-all ${
                  isDark
                    ? "bg-neutral-900 border-neutral-800 focus:border-neutral-600 text-white placeholder-neutral-500"
                    : "bg-white border-gray-200 focus:border-gray-300 text-gray-900"
                }`}
              />
            </div>
          </div>

          {/* Table */}
          <div className={`rounded-3xl border overflow-hidden ${cardClass}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDark ? "bg-neutral-800/50" : "bg-gray-50"}>
                  <tr>
                    <th
                      className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${textSub}`}
                    >
                      Rank
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${textSub}`}
                    >
                      Archer
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${textSub}`}
                    >
                      Tier
                    </th>
                    <th
                      className={`px-6 py-4 text-center text-xs font-bold uppercase tracking-wider ${textSub}`}
                    >
                      Avg Score
                    </th>
                    <th
                      className={`px-6 py-4 text-center text-xs font-bold uppercase tracking-wider ${textSub}`}
                    >
                      X-Count
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    isDark ? "divide-neutral-800" : "divide-gray-100"
                  }`}
                >
                  {filteredData.map((entry) => (
                    <tr
                      key={entry.id}
                      className={`transition-colors ${
                        entry.isCurrentUser
                          ? isDark
                            ? "bg-[#FFD700]/5"
                            : "bg-[#FFD700]/10"
                          : isDark
                            ? "hover:bg-white/5"
                            : "hover:bg-black/5"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getRankBadge(entry.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-black shadow-sm ${
                              entry.isCurrentUser
                                ? `${accentBg} text-black`
                                : isDark
                                  ? "bg-neutral-800 text-white"
                                  : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            {entry.name.charAt(0)}
                          </div>
                          <div>
                            <p
                              className={`font-bold ${textMain} flex items-center gap-2`}
                            >
                              {entry.name}
                              {entry.isCurrentUser && (
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-500 border border-blue-500/20`}
                                >
                                  YOU
                                </span>
                              )}
                            </p>
                            <p className={`text-xs ${textSub}`}>
                              {entry.country}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            entry.tier === "Olympian"
                              ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                              : entry.tier === "Elite"
                                ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                                : entry.tier === "Sharpshooter"
                                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                  : entry.tier === "Marksman"
                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                    : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                          }`}
                        >
                          {entry.tier}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className={`text-lg font-bold ${textMain}`}>
                          {entry.avgScore}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className={`text-sm font-medium ${textSub}`}>
                          {entry.xCount}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredData.length === 0 && (
              <div className="p-12 text-center">
                <Target
                  className={`w-12 h-12 mx-auto mb-4 opacity-20 ${textSub}`}
                />
                {!publicProfile ? (
                  <>
                    <p className={`${textMain} font-bold text-lg mb-2`}>
                      You are incognito mode 🕵️‍♂️
                    </p>
                    <p className={textSub}>
                      Your profile is private, so you don't appear on the
                      leaderboard.
                    </p>
                  </>
                ) : (
                  <p className={textSub}>
                    No archers found matching your search.
                  </p>
                )}
              </div>
            )}
          </div>

          {!publicProfile && (
            <div
              className={`mt-6 p-4 rounded-xl border flex items-center gap-4 ${
                isDark
                  ? "bg-blue-900/20 border-blue-800 text-blue-200"
                  : "bg-blue-50 border-blue-100 text-blue-800"
              }`}
            >
              <User className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">
                Your profile is currently <strong>private</strong>. To appear on
                the leaderboard to others, enable "Public Profile" in Settings.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  },
);

export default LeaderboardView;
