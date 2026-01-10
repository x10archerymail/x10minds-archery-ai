import React from "react";
import {
  BookOpen,
  Mail,
  MapPin,
  Phone,
  Instagram,
  Youtube,
  Facebook,
  Github,
} from "lucide-react";

interface PageProps {
  themeMode?: "dark" | "light";
  accentColor?: string;
  onBack?: () => void;
}

const getAccentClasses = (accentColor: string) => {
  const themes: Record<string, any> = {
    orange: {
      color: "orange-500",
      colorDark: "orange-600",
      colorLight: "orange-400",
      gradient: "from-orange-600 to-red-600",
      shadow: "shadow-orange-500/20",
    },
    blue: {
      color: "blue-500",
      colorDark: "blue-600",
      colorLight: "blue-400",
      gradient: "from-blue-600 to-indigo-600",
      shadow: "shadow-blue-500/20",
    },
    green: {
      color: "green-500",
      colorDark: "green-600",
      colorLight: "green-400",
      gradient: "from-green-600 to-emerald-600",
      shadow: "shadow-green-500/20",
    },
    purple: {
      color: "purple-500",
      colorDark: "purple-600",
      colorLight: "purple-400",
      gradient: "from-purple-600 to-pink-600",
      shadow: "shadow-purple-500/20",
    },
  };
  return themes[accentColor] || themes.orange;
};

const blogPosts = [
  {
    category: "TRAINING",
    title: "Mastering the Shot Cycle",
    description:
      "A deep dive into the biomechanical phases of a perfect release for maximum consistency.",
    image: "/images/realise.png",
  },
  {
    category: "EQUIPMENT",
    title: "Choosing Your First Recurve",
    description:
      "Everything you need to know about limb weights, riser materials, and sizing for beginners.",
    image: "/images/recurve.png",
  },
  {
    category: "SELECTION",
    title: "Picking the Perfect Arrows",
    description:
      "Spine weight, fletching types, and point weight explained for every type of setup.",
    image: "/images/arrow.png",
  },
  {
    category: "TECHNIQUE",
    title: "Precision and Consistency",
    description:
      "How to find the perfect equilibrium between physiological strength and stability.",
    image: "/images/world.png",
  },
  {
    category: "MENTAL",
    title: "The Inner Game",
    description:
      "Mastering focus and consistency under pressure while standing on the shooting line.",
    image: "/images/panic.png",
  },
  {
    category: "HISTORY",
    title: "Evolution of the Bow",
    description:
      "Journey from ancient wooden limbs to modern carbon fiber and CNC machined technology.",
    image: "/images/evolution.png",
  },
];

export const BlogPage: React.FC<PageProps> = ({
  themeMode = "dark",
  accentColor = "orange",
  onBack,
}) => {
  const isDark = themeMode === "dark";
  const accents = getAccentClasses(accentColor);
  const bgClass = isDark ? "bg-neutral-950" : "bg-gray-50";
  const cardClass = isDark
    ? "bg-neutral-900 border-neutral-800"
    : "bg-white border-gray-200 shadow-md";
  const headerText = isDark ? "text-white" : "text-gray-900";
  const subText = isDark ? "text-neutral-400" : "text-gray-500";

  return (
    <div
      className={`p-6 md:p-8 ${bgClass} ${
        isDark ? "text-neutral-200" : "text-gray-800"
      }`}
    >
      <header className="mb-12 text-center max-w-2xl mx-auto relative">
        {onBack && (
          <button
            onClick={onBack}
            className={`absolute left-0 top-0 p-2 rounded-full hover:bg-white/10 transition-colors ${subText}`}
          >
            ← Back
          </button>
        )}
        <h2
          className={`text-5xl font-black mb-4 tracking-tighter ${headerText}`}
        >
          ARCHERY <span className={`text-${accents.color}`}>INSIGHTS</span>
        </h2>
        <div
          className={`h-1.5 w-24 mx-auto rounded-full mb-6 bg-${accents.color}`}
        ></div>
        <p className={subText}>
          Deep dives into the science, gear, and psychology of modern archery.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {blogPosts.map((post, idx) => (
          <article
            key={idx}
            className={`rounded-3xl overflow-hidden transition-all duration-300 border flex flex-col group ${cardClass} hover:border-${accents.color}/50 hover:shadow-2xl ${accents.shadow}`}
          >
            <div className="h-56 overflow-hidden relative">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1544924405-459686772713?q=80&w=800&auto=format&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div
                className={`absolute bottom-4 left-6 text-[10px] font-black tracking-widest px-3 py-1 rounded-full text-white bg-${accents.color}`}
              >
                {post.category}
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <h3
                className={`text-2xl font-bold mb-3 leading-tight ${headerText}`}
              >
                {post.title}
              </h3>
              <p className={`text-sm mb-6 flex-1 line-clamp-3 ${subText}`}>
                {post.description}
              </p>
              <a
                href="https://docs.x10minds.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 font-bold transition-all text-${accents.color} hover:text-${accents.colorLight} group/btn`}
              >
                Read Article
                <span className="transition-transform group-hover/btn:translate-x-1">
                  &rarr;
                </span>
              </a>
            </div>
          </article>
        ))}
      </div>
      <footer className="mt-24 text-center border-t border-white/10 pt-16 pb-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <img
            src="/images/X10Minds logo.png"
            alt="X10Minds"
            className="w-8 h-8 opacity-50"
          />
          <p
            className={`text-sm font-black tracking-widest uppercase m-0 text-${accents.color}`}
          >
            X10Minds Blog
          </p>
        </div>
        <div className="flex items-center justify-center gap-6">
          <a
            href="https://x.com/x10minds"
            target="_blank"
            className="text-neutral-500 hover:text-white transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="w-5 h-5 fill-current"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
          </a>
          <a
            href="https://www.instagram.com/?nux=1&hl=en"
            target="_blank"
            className="text-neutral-500 hover:text-white transition-colors"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://www.youtube.com/channel/UCK-Bm6SEBsUP-nH0MJy88PQ"
            target="_blank"
            className="text-neutral-500 hover:text-white transition-colors"
          >
            <Youtube className="w-5 h-5" />
          </a>
          <a
            href="https://github.com/x10archerymail"
            target="_blank"
            className="text-neutral-500 hover:text-white transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export const AboutPage: React.FC<PageProps> = ({
  themeMode = "dark",
  accentColor = "orange",
  onBack,
}) => {
  const isDark = themeMode === "dark";
  const accents = getAccentClasses(accentColor);
  const bgClass = isDark ? "bg-neutral-950" : "bg-gray-50";
  const cardClass = isDark
    ? "bg-neutral-900 border-neutral-800"
    : "bg-white border-gray-200 shadow-md";
  const headerText = isDark ? "text-white" : "text-gray-900";
  const subText = isDark ? "text-neutral-300" : "text-gray-700";

  return (
    <div
      className={`p-6 md:p-12 ${bgClass} ${
        isDark ? "text-neutral-200" : "text-gray-800"
      }`}
    >
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-6 relative">
          {onBack && (
            <button
              onClick={onBack}
              className={`absolute left-0 top-0 p-2 rounded-full hover:bg-white/10 transition-colors ${subText}`}
            >
              ← Back
            </button>
          )}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold tracking-widest uppercase mb-4">
            Started at age 11 • Currently 15 Years Old
          </div>
          <h1
            className={`text-4xl md:text-6xl font-black tracking-tighter leading-tight ${headerText}`}
          >
            X10Minds: My Journey, My Struggle, and a Mission to{" "}
            <span className={`text-${accents.color}`}>
              Change Archery Forever
            </span>
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white bg-gradient-to-br ${accents.gradient} shadow-xl transform rotate-3`}
            >
              <span className="transform -rotate-3 text-2xl">N</span>
            </div>
            <div className="text-left">
              <p className={`font-bold text-lg ${headerText}`}>Nikunj</p>
              <p className={`text-sm ${subText}`}>
                National Archery Player & CEO of X10Minds
              </p>
            </div>
          </div>
          <div
            className={`h-1.5 w-24 mx-auto rounded-full bg-${accents.color} opacity-50`}
          ></div>
          <p
            className={`text-sm tracking-widest uppercase font-black text-${accents.color}`}
          >
            Launched: 1 Feb 2026
          </p>
        </header>

        <div
          className={`prose prose-lg max-w-none ${
            isDark
              ? "prose-invert prose-p:text-neutral-300 prose-headings:text-white"
              : "prose-neutral prose-p:text-gray-700 prose-headings:text-gray-900"
          }`}
        >
          <div
            className={`p-8 md:p-12 rounded-[40px] border text-center mb-16 ${cardClass} relative overflow-hidden group shadow-2xl`}
          >
            <div
              className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${accents.gradient}`}
            ></div>
            <p className="text-2xl md:text-4xl font-light italic leading-relaxed text-white">
              "Archery is not just a sport. For me, it is discipline, patience,
              focus, pain, growth, and belief—all combined into one powerful
              journey."
            </p>
          </div>

          <div className="space-y-6">
            <p>
              My name is <strong>Nikunj</strong>. I am a 15-year-old
              national-level archer, and the founder & CEO of{" "}
              <strong>X10Minds</strong>. My journey in this ancient discipline
              began when I was just 11 years old. I started X10Minds in June
              2024 with one clear purpose:
            </p>
            <div
              className={`p-6 md:p-10 rounded-3xl bg-gradient-to-br ${accents.gradient} text-white shadow-xl my-10`}
            >
              <p className="font-bold text-xl md:text-2xl text-center m-0">
                To help archers who are struggling silently and to make archery
                a respected, famous, and accessible sport through technology,
                education, and honesty, because I also experienced this
                Struggle.
              </p>
            </div>
            <p>
              This is not just about AI. It is about real problems, real
              archers, and real solutions.
            </p>
          </div>

          <section className="mt-16">
            <h2 className={`text-4xl font-bold mb-8 ${headerText}`}>
              Why X10Minds Was Born
            </h2>
            <p>
              Every archer starts with a dream. Some dream of playing at the
              national level, representing their country, or simply falling in
              love with the sound of the arrow leaving the string. But as
              archers grow, many face problems that are never talked about
              openly.
            </p>

            <h3 className={`text-2xl font-bold mt-12 mb-8 ${headerText}`}>
              The Hidden Problems I Witnessed
            </h3>
            <div className="grid md:grid-cols-2 gap-4 my-10">
              {[
                { icon: "🚫", text: "Poor or outdated coaching" },
                { icon: "📉", text: "Lack of personal attention" },
                { icon: "🏛️", text: "Favoritism and politics" },
                { icon: "👤", text: "Talent being ignored" },
                { icon: "🔬", text: "No scientific or technical guidance" },
                { icon: "🧠", text: "Mental pressure without support" },
                {
                  icon: "❓",
                  text: "Parents and players confused about the path",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`p-5 rounded-2xl border ${cardClass} flex items-center gap-4 transition-all hover:border-${accents.color}/40 hover:translate-x-1 shadow-sm`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <p>
              Sadly, many skilled archers quit, not because they lack talent,
              but because the system fails them.{" "}
              <strong>I faced this too.</strong> I trained hard. I followed
              discipline. I respected the sport. Yet I experienced situations
              where politics affected performance, and where guidance was
              missing.
            </p>
            <div className="my-12 py-8 border-y-2 border-neutral-800 text-center">
              <p
                className={`text-3xl font-bold italic text-${accents.color} leading-snug`}
              >
                “What if technology could support archers when humans fail
                them?”
              </p>
              <p className="mt-4 font-bold uppercase tracking-widest opacity-50">
                That question became X10Minds.
              </p>
            </div>
          </section>

          <section className="mt-20">
            <h2 className={`text-4xl font-bold mb-8 ${headerText}`}>
              An Ecosystem of Support
            </h2>
            <p>
              X10Minds is an archery-focused AI and digital ecosystem built to
              guide beginners, support intermediate archers, assist advanced
              players, and educate parents and coaches.
            </p>
            <p>
              X10Minds does not replace coaches. It supports archers when
              support is missing. Our goal is simple:{" "}
              <strong>No archer should feel lost, ignored, or helpless.</strong>
            </p>
          </section>

          <section className="mt-20">
            <div className="flex flex-col md:flex-row gap-10 items-center mb-12">
              <div className="flex-1">
                <h2 className={`text-4xl font-bold mb-6 ${headerText}`}>
                  Resurrecting the Legacy
                </h2>
                <p>
                  Archery is one of the oldest sports in human history, a core
                  Olympic discipline, and a perfect mix of physical skill and
                  mental strength. X10Minds supports both major formats:
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 my-10">
              <div
                className={`p-8 rounded-[32px] border ${cardClass} relative group overflow-hidden`}
              >
                <div
                  className={`absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150`}
                ></div>
                <h4 className={`text-2xl font-bold mb-4 ${headerText}`}>
                  Indoor Archery
                </h4>
                <ul className="list-none p-0 space-y-3">
                  <li className="flex gap-3 text-sm">
                    {" "}
                    <span className="font-medium">
                      Usually shot at 18 meters in a controlled environment.
                    </span>
                  </li>
                  <li className="flex gap-3 text-sm">
                    {" "}
                    <span className="font-medium">
                      Heavy focus on technique and consistency.
                    </span>
                  </li>
                  <li className="flex gap-3 text-sm">
                    {" "}
                    <span className="font-medium">
                      Perfect for beginners and mental stability training.
                    </span>
                  </li>
                </ul>
              </div>
              <div
                className={`p-8 rounded-[32px] border ${cardClass} relative group overflow-hidden`}
              >
                <div
                  className={`absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150`}
                ></div>
                <h4 className={`text-2xl font-bold mb-4 ${headerText}`}>
                  Outdoor Archery
                </h4>
                <ul className="list-none p-0 space-y-3">
                  <li className="flex gap-3 text-sm">
                    {" "}
                    <span className="font-medium">
                      Distances ranging from 30 to 70 meters.
                    </span>
                  </li>
                  <li className="flex gap-3 text-sm">
                    {" "}
                    <span className="font-medium">
                      Wind, light, and weather affect every shot.
                    </span>
                  </li>
                  <li className="flex gap-3 text-sm">
                    {" "}
                    <span className="font-medium">
                      True test of equipment tuning and atmospheric focus.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mt-24">
            <h2 className={`text-4xl font-bold mb-8 ${headerText}`}>
              The Foundation of Excellence
            </h2>
            <p>
              One of the biggest problems is that basics are ignored. No AI or
              coach can help if your foundation is weak.
            </p>

            <div className="grid md:grid-cols-3 gap-6 my-10">
              {[
                {
                  t: "Stance",
                  d: "Your feet are your foundation. Balanced, shoulder-width, and mirrored every single shot.",
                },
                {
                  t: "Nocking",
                  d: "Precise arrow placement. Small inconsistencies here grow into massive center-deviations.",
                },
                {
                  t: "Grip and Hooking",
                  d: "Relaxed thumb pad pressure. A tight grip twists the bow and destroys accuracy. In hooking we pull the bow with only the three finger Index, Middle and Ring then we pull the bow in the set up position with relax fingers.",
                },
                {
                  t: "Set Position",
                  d: "Discipline starts here. Shoulders low, core engaged, mind becoming still.",
                },
                {
                  t: "Drawing",
                  d: "Symmetric and controlled. Power must come from the back, not just the arms.",
                },
                {
                  t: "Anchor",
                  d: "The point of no return. Chin, jaw, or nose—it must be identical every time.",
                },
                {
                  t: "Aiming",
                  d: "Accepting natural movement and trusting your alignment under pressure.",
                },
                {
                  t: "Release",
                  d: "Relaxing fingers without plucking. The string must leave the hand naturally.",
                },
                {
                  t: "Follow Through",
                  d: "Maintain posture until the arrow hits. Never finish the shot too early.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-2xl border ${cardClass} transition-all hover:bg-${accents.color}/5 hover:border-${accents.color}/20`}
                >
                  <h5 className={`text-lg font-bold mb-2 ${headerText}`}>
                    {i + 1}. {item.t}
                  </h5>
                  <p className="m-0 text-sm leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-24">
            <div
              className={`p-8 md:p-12 rounded-[40px] border ${cardClass} shadow-2xl relative overflow-hidden`}
            >
              <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                <div className="flex-1">
                  <h2 className={`text-4xl font-bold mb-6 ${headerText}`}>
                    The Inner Game
                  </h2>
                  <p className="text-xl leading-relaxed">
                    Archery is <strong>70% mental</strong>. I’ve seen
                    world-class talent fail because of fear, target panic, or
                    the weight of judgment.
                  </p>
                  <p className="mt-4">
                    This is where <strong>X10Minds AI</strong> changes the game.
                    It provides neutral, pressure-free guidance. It does not
                    judge. It does not play politics. It focuses only on your
                    growth.
                  </p>
                </div>
                <div
                  className={`w-full md:w-64 h-64 rounded-3xl bg-neutral-800 flex flex-col items-center justify-center border-4 border-${accents.color}/20`}
                >
                  <div className={`text-5xl font-bold text-${accents.color}`}>
                    70%
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest mt-2">
                    Mental Power
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-24">
            <h2 className={`text-4xl font-bold mb-8 ${headerText}`}>
              My Promise as CEO
            </h2>
            <p>
              I am not building X10Minds for money alone. I am building it
              because I know how it feels to be unheard, how talent gets wasted,
              and how archery deserves better systems.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-10">
              {["Transparency", "Fairness", "Athlete-First", "Excellence"].map(
                (p, i) => (
                  <div
                    key={i}
                    className={`py-4 px-2 rounded-2xl border text-center font-bold uppercase tracking-widest text-xs bg-${accents.color}/5 border-${accents.color}/20 text-${accents.color}`}
                  >
                    {p}
                  </div>
                )
              )}
            </div>
            <p className="text-2xl font-bold italic text-center p-10 bg-neutral-900 text-white rounded-[32px] border border-neutral-800 shadow-xl">
              "Your arrow does not lie. Your effort matters. X10Minds exists for
              you."
            </p>
          </section>

          <footer className="mt-24 text-center border-t border-neutral-800 pt-16 pb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img
                src="/images/X10Minds logo.png"
                alt="X10Minds"
                className="w-8 h-8 opacity-50"
              />
              <p
                className={`text-sm font-black tracking-widest uppercase m-0 text-${accents.color}`}
              >
                X10Minds Inc.
              </p>
            </div>
            <p className={`text-neutral-500 italic mb-6`}>
              June 2024 was the start. The future is just beginning.
            </p>
            <div className="flex items-center justify-center gap-6 mt-8">
              <a
                href="https://x.com/x10minds"
                target="_blank"
                className="text-neutral-500 hover:text-white transition-colors"
                title="Follow us on X"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="w-5 h-5 fill-current"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/?nux=1&hl=en"
                target="_blank"
                className="text-neutral-500 hover:text-white transition-colors"
                title="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/channel/UCK-Bm6SEBsUP-nH0MJy88PQ"
                target="_blank"
                className="text-neutral-500 hover:text-white transition-colors"
                title="Subscribe on Youtube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/x10archerymail"
                target="_blank"
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC<PageProps> = ({
  themeMode = "dark",
  accentColor = "orange",
}) => {
  const isDark = themeMode === "dark";
  const accents = getAccentClasses(accentColor);
  const bgClass = isDark ? "bg-neutral-950" : "bg-gray-50";
  const cardClass = isDark
    ? "bg-neutral-900 border-neutral-800"
    : "bg-white border-gray-200 shadow-md";
  const headerText = isDark ? "text-white" : "text-gray-900";
  const subText = isDark ? "text-neutral-400" : "text-gray-500";
  const inputBg = isDark ? "bg-black" : "bg-white";
  const inputBorder = isDark ? "border-neutral-800" : "border-gray-200";

  return (
    <div
      className={`p-6 md:p-8 ${bgClass} ${
        isDark ? "text-neutral-200" : "text-gray-800"
      }`}
    >
      <div className="max-w-2xl mx-auto">
        <header className="mb-10 text-center">
          <h2 className={`text-3xl font-bold mb-2 ${headerText}`}>
            Get in Touch
          </h2>
          <p className={subText}>
            Have questions or feedback? We'd love to hear from you.
          </p>
        </header>

        <div className={`rounded-3xl p-8 mb-8 border ${cardClass}`}>
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm mb-1 ${subText}`}>Name</label>
                <input
                  type="text"
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition-all ${inputBg} ${inputBorder} focus:border-${accents.color}`}
                />
              </div>
              <div>
                <label className={`block text-sm mb-1 ${subText}`}>Email</label>
                <input
                  type="email"
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition-all ${inputBg} ${inputBorder} focus:border-${accents.color}`}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm mb-1 ${subText}`}>Message</label>
              <textarea
                className={`w-full h-32 border rounded-xl px-4 py-3 focus:outline-none transition-all resize-none ${inputBg} ${inputBorder} focus:border-${accents.color}`}
              ></textarea>
            </div>
            <button
              className={`w-full py-4 font-bold rounded-xl transition-all ${
                isDark
                  ? "bg-white text-black hover:bg-neutral-200"
                  : `bg-gradient-to-r ${accents.gradient} text-white shadow-lg`
              }`}
            >
              Send Message
            </button>
          </form>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-center">
          {[
            { icon: Mail, label: "Email Us", value: "support@ai.x10minds.com" },
          ].map((item, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${cardClass}`}>
              <item.icon
                className={`w-6 h-6 mx-auto mb-2 text-${accents.color}`}
              />
              <div className={`text-sm font-bold ${headerText}`}>
                {item.label}
              </div>
              <div className={`text-xs ${subText}`}>{item.value}</div>
            </div>
          ))}
        </div>
        <footer className="mt-20 text-center border-t border-white/10 pt-12 pb-8">
          <p
            className={`text-xs font-bold tracking-widest uppercase mb-6 text-neutral-500`}
          >
            Connect With Us
          </p>
          <div className="flex items-center justify-center gap-6">
            <a
              href="https://x.com/x10minds"
              target="_blank"
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="w-5 h-5 fill-current"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            </a>
            <a
              href="https://www.instagram.com/?nux=1&hl=en"
              target="_blank"
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCK-Bm6SEBsUP-nH0MJy88PQ"
              target="_blank"
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/x10archerymail"
              target="_blank"
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};
