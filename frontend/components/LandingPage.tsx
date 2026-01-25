import { useState } from "react";
import {
  Target,
  Zap,
  Shield,
  ArrowRight,
  ExternalLink,
  Activity,
  Brain,
  Camera,
  Trophy,
  Star,
  Check,
  X,
  Instagram,
  Youtube,
  Facebook,
  Quote,
  ChevronRight,
  ShieldCheck,
  Play,
  Award,
  Globe,
  Crown,
  Sparkles,
  Menu,
  Github,
} from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { AppMode } from "../types";

interface LandingPageProps {
  onGetStarted: () => void;
  onLegalClick: (mode: AppMode) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onLegalClick,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500/30 font-sans overflow-x-hidden">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-[90] lg:hidden backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Navbar */}
      <nav className="fixed top-6 left-0 right-0 z-[100] px-4 md:px-8 pointer-events-none">
        <div
          className={`max-w-7xl mx-auto rounded-full py-2 px-6 flex items-center justify-between pointer-events-auto transition-all duration-500 bg-neutral-900/60 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] ${
            scrolled ? "py-1.5 px-5 scale-[0.98]" : ""
          }`}
        >
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <img
                src="/images/X10Minds logo.png"
                alt="logo"
                className="w-full h-full object-contain filter group-hover:brightness-110 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-6"
              />
            </div>
            <div className="flex flex-col items-start leading-none font-orbitron">
              <span className="text-[7px] font-black tracking-[0.2em] text-white/40">
                ARCHERY AI
              </span>
              <div className="flex font-black tracking-tight text-lg uppercase">
                <span className="text-white">X10</span>
                <span className="text-yellow-400">MINDS</span>
                <span className="ml-1 text-[7px] self-end mb-0.5 text-white/40">
                  AI
                </span>
              </div>
            </div>
          </div>

          {/* Nav Links in Header */}
          <div className="hidden lg:flex items-center gap-8 font-orbitron">
            <a
              href="#pricing"
              className="text-[10px] font-bold tracking-[0.2em] text-white/60 hover:text-white transition-all uppercase"
            >
              Pricing
            </a>
            <button
              onClick={() => onLegalClick(AppMode.PRIVACY)}
              className="text-[10px] font-bold tracking-[0.2em] text-white/60 hover:text-white transition-all uppercase"
            >
              Privacy
            </button>
            <button
              onClick={() => onLegalClick(AppMode.TERMS)}
              className="text-[10px] font-bold tracking-[0.2em] text-white/60 hover:text-white transition-all uppercase"
            >
              Terms
            </button>
            <button
              onClick={() => onLegalClick(AppMode.COOKIES)}
              className="text-[10px] font-bold tracking-[0.2em] text-white/60 hover:text-white transition-all uppercase"
            >
              Cookies
            </button>
            <button
              onClick={() => onLegalClick(AppMode.SECURITY)}
              className="text-[10px] font-bold tracking-[0.2em] text-white/60 hover:text-white transition-all uppercase"
            >
              Security
            </button>
            <button
              onClick={() => onLegalClick(AppMode.ABOUT)}
              className="text-[10px] font-bold tracking-[0.2em] text-white/60 hover:text-white transition-all uppercase"
            >
              About
            </button>
          </div>

          <div className="flex gap-4 items-center">
            <a
              href="https://docs.x10minds.com"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white transition-all text-[10px] font-bold tracking-widest uppercase font-orbitron"
            >
              Docs <ExternalLink className="w-3 h-3 text-yellow-400" />
            </a>
            <button
              onClick={onGetStarted}
              className="hidden md:block px-6 py-2.5 bg-yellow-400 text-black font-black rounded-full hover:scale-105 active:scale-95 transition-all text-[10px] tracking-widest uppercase font-orbitron shadow-[0_0_20px_rgba(250,204,21,0.3)]"
            >
              Start Now
            </button>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2.5 rounded-full text-white bg-white/5 hover:bg-white/10 transition-all border border-white/10"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar - Slides from top */}
      <aside
        className={`
        fixed top-0 left-0 right-0 z-[100] lg:hidden border-b transform transition-all duration-300 ease-out
        bg-black/95 backdrop-blur-xl border-white/10
        ${
          isMobileMenuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }
        flex flex-col max-h-[85vh] shadow-2xl
      `}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <img
              src="/images/X10Minds logo.png"
              alt="Archery AI X10Minds AI Logo"
              className="w-10 h-10 object-contain drop-shadow-md"
            />
            <span className="text-xl font-bold tracking-tight text-white">
              Archery AI X10Minds AI
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-all duration-200 transform hover:scale-110 active:scale-95"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-6 py-6 space-y-1 overflow-y-auto">
          <a
            href="#pricing"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-4 py-3 text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 transform hover:translate-x-1"
          >
            Pricing
          </a>
          <button
            onClick={() => {
              onLegalClick(AppMode.PRIVACY);
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 transform hover:translate-x-1"
          >
            Privacy
          </button>
          <button
            onClick={() => {
              onLegalClick(AppMode.TERMS);
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 transform hover:translate-x-1"
          >
            Terms
          </button>
          <button
            onClick={() => {
              onLegalClick(AppMode.COOKIES);
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 transform hover:translate-x-1"
          >
            Cookies
          </button>
          <button
            onClick={() => {
              onLegalClick(AppMode.SECURITY);
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 transform hover:translate-x-1"
          >
            Security
          </button>
          <a
            href="https://docs.x10minds.com"
            target="_blank"
            rel="noreferrer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 transform hover:translate-x-1"
          >
            Docs <ExternalLink className="w-4 h-4" />
          </a>
          <div className="pt-4 border-t border-white/10">
            <button
              onClick={() => {
                onGetStarted();
                setIsMobileMenuOpen(false);
              }}
              className="w-full px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-orange-500 hover:text-white transition-all duration-200 transform hover:scale-105"
            >
              Start Now
            </button>
          </div>
        </nav>
      </aside>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
          <img
            src="/images/hero-archer.png"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-60 scale-105 animate-ken-burns"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-20 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-left-12 duration-1000">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black tracking-[0.3em] uppercase">
                <Sparkles className="w-4 h-4" /> The Future of Mastery
              </div>

              <h1 className="text-5xl md:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.85] font-orbitron">
                HIT THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 drop-shadow-[0_0_30px_rgba(249,115,22,0.5)]">
                  X-RING
                </span>
              </h1>

              <p className="text-lg md:text-2xl text-neutral-400 max-w-xl leading-relaxed font-medium">
                Archery AI X10Minds AI. A singular intelligence designed to
                evolve your archery through biomechanical precision and adaptive
                coaching.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <button
                  onClick={onGetStarted}
                  className="group relative px-10 py-6 bg-white text-black rounded-2xl font-black text-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.15)] flex items-center gap-3 justify-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative group-hover:text-white flex items-center gap-3 transition-colors duration-300">
                    GET STARTED{" "}
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                </button>

                <button className="px-10 py-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl font-black text-xl text-white hover:bg-white/10 transition-all flex items-center gap-3 justify-center">
                  VIEW CASE STUDIES{" "}
                  <ChevronRight className="w-6 h-6 opacity-30" />
                </button>
              </div>
            </div>

            {/* Featured Image Mobile/Desktop Wrapper */}
            <div className="flex-1 relative animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
              <div className="relative z-10 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <img
                  src="/images/hero-archer.png"
                  alt="Advanced AI Archery"
                  className="w-full h-auto object-cover transform scale-110 group-hover:scale-100 transition-transform duration-[2000ms]"
                />

                {/* Floating HUD Elements */}
                <div className="absolute top-8 right-8 p-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl animate-pulse">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-orange-500 tracking-widest uppercase font-orbitron">
                      SENSORS ACTIVE
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="w-1.5 h-4 bg-orange-500/50 rounded-sm"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute -inset-20 bg-orange-500/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Trust Bar */}
      <section className="border-y border-neutral-800 bg-neutral-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl font-bold text-white">10M+</div>
            <div className="text-xs font-medium text-neutral-500 uppercase tracking-widest">
              Arrows Analyzed
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-white">50k+</div>
            <div className="text-xs font-medium text-neutral-500 uppercase tracking-widest">
              Active Archers
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-white">142</div>
            <div className="text-xs font-medium text-neutral-500 uppercase tracking-widest">
              Countries
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-white">4.9/5</div>
            <div className="text-xs font-medium text-neutral-500 uppercase tracking-widest">
              App Rating
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-neutral-950 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Omniscient General Intelligence
              </h2>
              <p className="text-neutral-400 max-w-2xl mx-auto">
                Archery AI X10Minds AI combines specialized sports science with
                universal knowledge to solve any task with absolute perfection.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="p-6 md:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] transition-all duration-300 group hover:-translate-y-1">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 sm:group-hover:scale-110 transition-transform duration-500">
                  <Camera className="w-6 h-6 md:w-7 md:h-7 text-orange-500" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 font-orbitron group-hover:text-orange-500 transition-colors">
                  Biomechanical Analysis
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  Upload photos of your shot process. Our AI analyzes skeletal
                  alignment, anchor point consistency, and release mechanics
                  with sub-millimeter precision.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200}>
              <div className="p-6 md:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.1)] transition-all duration-300 group hover:-translate-y-1">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 sm:group-hover:scale-110 transition-transform duration-500">
                  <Activity className="w-6 h-6 md:w-7 md:h-7 text-red-500" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 font-orbitron group-hover:text-red-500 transition-colors">
                  Adaptive SPT Plans
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  Get custom Specific Physical Training (SPT) routines generated
                  based on your weaknesses. From holding drills to reversal
                  strength, we build your archery muscles.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={300}>
              <div className="p-6 md:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-300 group hover:-translate-y-1">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 sm:group-hover:scale-110 transition-transform duration-500">
                  <Brain className="w-6 h-6 md:w-7 md:h-7 text-blue-500" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 font-orbitron group-hover:text-blue-500 transition-colors">
                  Mental Conditioning
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  Master the inner game. X10Minds provides visualization
                  techniques, breathwork protocols, and strategies to conquer
                  target panic and tournament pressure.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={400}>
              <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] transition-all duration-300 group hover:-translate-y-1">
                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Target className="w-7 h-7 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-orbitron group-hover:text-purple-500 transition-colors">
                  Calculator & Scoring
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  Technical calculations and advanced scoring in one place. Log
                  every arrow with sub-millimeter precision and track your
                  consistency.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={500}>
              <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-yellow-500/50 hover:shadow-[0_0_30px_rgba(234,179,8,0.1)] transition-all duration-300 group hover:-translate-y-1">
                <div className="w-14 h-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Trophy className="w-7 h-7 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-orbitron group-hover:text-yellow-500 transition-colors">
                  Competition Prep
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  Simulate match play pressure. The AI Coach acts as your
                  spotter, giving you wind adjustments and strategy during
                  practice matches.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={600}>
              <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-green-500/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)] transition-all duration-300 group hover:-translate-y-1">
                <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Globe className="w-7 h-7 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-orbitron group-hover:text-green-500 transition-colors">
                  Global Community
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  Compare your form against the pros. Share your progress on the
                  leaderboard and get peer reviews from certified coaches.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-4">
              The Archery AI X10 Workflow
            </h2>
            <p className="text-neutral-400">
              From diagnosis to podium in four simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                title: "Capture",
                desc: "Record your shot cycle or upload a photo of your full draw.",
                step: "01",
              },
              {
                title: "Analyze",
                desc: "AI identifies misalignments in your skeletal structure.",
                step: "02",
              },
              {
                title: "Correct",
                desc: "Receive visual overlays showing your ideal posture.",
                step: "03",
              },
              {
                title: "Train",
                desc: "Follow the custom exercise plan to fix the root cause.",
                step: "04",
              },
            ].map((item, i) => (
              <ScrollReveal
                key={i}
                animation="slide-in-right"
                delay={i * 150}
                className="h-full"
              >
                <div className="relative p-8 rounded-2xl bg-neutral-900 border border-neutral-800 h-full hover:bg-neutral-800/50 transition-colors duration-300 group">
                  <div className="text-5xl font-bold text-neutral-800 mb-6 font-mono group-hover:text-orange-900/50 transition-colors">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-500 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-neutral-400 text-sm">{item.desc}</p>
                  {i < 3 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-neutral-700">
                      <ChevronRight />
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-neutral-950 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Elite Feedback
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "X10Minds spotted a micro-collapse in my release that my human coach missed for months. My scores jumped 15 points in weeks.",
                author: "Sarah J.",
                role: "Olympic Recurve Hopeful",
              },
              {
                quote:
                  "As a bowhunter, precision matters. The SPT generator helped me increase my draw weight comfortably without injury.",
                author: "Mike T.",
                role: "Compound Hunter",
              },
              {
                quote:
                  "Finally, an app that focuses on the mental game. The visualization drills are part of my daily pre-shoot routine now.",
                author: "Elena R.",
                role: "Collegiate Archer",
              },
            ].map((t, i) => (
              <ScrollReveal
                key={i}
                animation="fade-up"
                delay={i * 200}
                className="h-full"
              >
                <div className="bg-neutral-900 p-8 rounded-3xl border border-neutral-800 relative h-full hover:-translate-y-2 transition-transform duration-300 shadow-xl">
                  <Quote className="absolute top-8 right-8 w-8 h-8 text-neutral-800 fill-neutral-800" />
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 text-orange-500 fill-orange-500"
                      />
                    ))}
                  </div>
                  <p className="text-neutral-300 mb-8 leading-relaxed">
                    "{t.quote}"
                  </p>
                  <div>
                    <div className="font-bold text-white">{t.author}</div>
                    <div className="text-sm text-neutral-500">{t.role}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-black px-6" id="pricing">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Choose Your Edge
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
              Unlock the full potential of X10Minds with our premium tiers.
              Scale your training from hobbyist to Olympian.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {/* Free Tier */}
            <ScrollReveal animation="fade-up" delay={100} className="h-full">
              <div className="p-8 rounded-3xl border border-neutral-800 bg-neutral-900/30 flex flex-col hover:border-neutral-700 transition-all group h-full">
                <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-neutral-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 font-orbitron uppercase">
                  Free
                </h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">₹0</span>
                  <span className="text-neutral-500">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-sm text-neutral-400">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />{" "}
                    20,000 Chat Tokens
                  </li>
                  <li className="flex items-start gap-3 text-sm text-neutral-400">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />{" "}
                    Basic Form Analysis
                  </li>
                  <li className="flex items-start gap-3 text-sm text-neutral-400">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />{" "}
                    Standard Speed
                  </li>
                  <li className="flex items-start gap-3 text-sm text-neutral-400">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />{" "}
                    Community Support
                  </li>
                </ul>
                <button
                  onClick={onGetStarted}
                  className="w-full py-4 rounded-xl border border-neutral-700 text-white font-bold hover:bg-neutral-800 transition-colors"
                >
                  Get Started
                </button>
              </div>
            </ScrollReveal>

            {/* Charge Tier */}
            <ScrollReveal animation="fade-up" delay={200} className="h-full">
              <div className="p-8 rounded-3xl border border-blue-500/20 bg-neutral-900/30 flex flex-col hover:border-blue-500/40 transition-all group h-full">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 font-orbitron uppercase text-blue-400">
                  Charge
                </h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">₹299</span>
                  <span className="text-neutral-500">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-sm text-neutral-300">
                    <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />{" "}
                    50,000 Chat Tokens
                  </li>
                  <li className="flex items-start gap-3 text-sm text-neutral-300">
                    <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />{" "}
                    Improved AI Speed
                  </li>
                  <li className="flex items-start gap-3 text-sm text-neutral-300">
                    <Check className="w-5 h-5 text-blue-500 flex-shrink-0" /> 10
                    AI Visuals / mo
                  </li>
                  <li className="flex items-start gap-3 text-sm text-neutral-300">
                    <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />{" "}
                    Ad-Free Experience
                  </li>
                </ul>
                <button
                  onClick={onGetStarted}
                  className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20"
                >
                  Get Charge
                </button>
              </div>
            </ScrollReveal>

            {/* Pro Tier */}
            <ScrollReveal animation="fade-up" delay={300} className="h-full">
              <div className="p-8 rounded-3xl border border-orange-500/30 bg-neutral-900 flex flex-col relative shadow-2xl shadow-orange-900/20 sm:hover:scale-[1.02] transition-all group h-full">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase shadow-lg">
                  Recommended
                </div>
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 font-orbitron uppercase text-orange-500">
                  Pro
                </h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">₹1399</span>
                  <span className="text-neutral-500">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-sm text-white font-medium">
                    <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />{" "}
                    Unlimited Chat Tokens
                  </li>
                  <li className="flex items-start gap-3 text-sm text-white font-medium">
                    <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />{" "}
                    HD Form Analysis
                  </li>
                  <li className="flex items-start gap-3 text-sm text-white font-medium">
                    <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />{" "}
                    Custom SPT Plans
                  </li>
                  <li className="flex items-start gap-3 text-sm text-white font-medium">
                    <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />{" "}
                    Priority AI Access
                  </li>
                </ul>
                <button
                  onClick={onGetStarted}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold hover:shadow-lg hover:shadow-orange-500/40 transition-all"
                >
                  Go Pro Now
                </button>
              </div>
            </ScrollReveal>

            {/* Ultra Tier */}
            <ScrollReveal animation="fade-up" delay={400} className="h-full">
              <div className="p-8 rounded-3xl border border-yellow-500/20 bg-neutral-900/30 flex flex-col hover:border-yellow-500/40 transition-all group h-full">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Crown className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 font-orbitron uppercase text-purple-500">
                  Ultra
                </h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">₹2,999</span>
                  <span className="text-neutral-500">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-sm text-neutral-300">
                    <Check className="w-5 h-5 text-yellow-500 flex-shrink-0" />{" "}
                    GPT-4o Class Models
                  </li>
                  <li className="flex items-start gap-3 text-sm text-neutral-300">
                    <Check className="w-5 h-5 text-yellow-500 flex-shrink-0" />{" "}
                    Video Form Analysis
                  </li>
                  <li className="flex items-start gap-3 text-sm text-neutral-300">
                    <Check className="w-5 h-5 text-yellow-500 flex-shrink-0" />{" "}
                    Team Management
                  </li>
                  <li className="flex items-start gap-3 text-sm text-neutral-300">
                    <Check className="w-5 h-5 text-yellow-500 flex-shrink-0" />{" "}
                    24/7 Priority Support
                  </li>
                </ul>
                <button
                  onClick={onGetStarted}
                  className="w-full py-4 rounded-xl bg-yellow-600 text-black font-extrabold hover:bg-yellow-500 transition-colors shadow-lg shadow-yellow-900/20"
                >
                  Get Ultra
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-neutral-950 px-6 border-t border-neutral-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-6">
            <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <h3 className="font-bold text-white mb-2">
                Does this work for compound bows?
              </h3>
              <p className="text-neutral-400">
                Yes, X10Minds supports Recurve, Compound, and Barebow. The
                biomechanical models adjust based on your selected bow type.
              </p>
            </div>
            <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <h3 className="font-bold text-white mb-2">
                Do I need special camera equipment?
              </h3>
              <p className="text-neutral-400">
                No. Your smartphone camera is sufficient. For best results, we
                recommend using a tripod or having a friend film you from a
                consistent angle.
              </p>
            </div>
            <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <h3 className="font-bold text-white mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-neutral-400">
                Absolutely. You can manage your subscription directly from the
                app settings and cancel with one click.
              </p>
            </div>
            <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <h3 className="font-bold text-white mb-2">
                Is the data private?
              </h3>
              <p className="text-neutral-400">
                Your form photos and chat history are private by default. You
                can choose to opt-in to anonymous data collection to help train
                the AI, but it is not required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-orange-600 -z-20"></div>
        <div className="absolute inset-0 bg-black/80 -z-10"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 -z-10"></div>

        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Ready to shoot X's?
          </h2>
          <p className="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto">
            Join thousands of archers who have elevated their game with
            X10Minds.
          </p>
          <button
            onClick={onGetStarted}
            className="px-12 py-6 bg-white text-black font-bold text-xl rounded-full hover:bg-neutral-200 hover:scale-105 transition-all shadow-2xl"
          >
            Get Started for Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/10 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <img
                src="/images/X10Minds logo.png"
                alt="X10Minds Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="font-bold text-white text-lg">X10Minds</span>
            </div>
            <p className="text-neutral-500 text-sm mb-6 leading-relaxed">
              X10Minds is the world's most advanced AI Archery Coach. We provide
              biomechanical technique analysis, personalized training plans, and
              mental conditioning to help archers achieve perfection in every
              shot.
            </p>
            <div className="flex gap-4">
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
                href="https://github.com/x10archerymail/x10minds-archery-ai"
                target="_blank"
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-neutral-500">
              <li>
                <button
                  onClick={() =>
                    window.open(
                      "https://docs.x10minds.com/ai-docs.html",
                      "_blank",
                    )
                  }
                  className="hover:text-orange-500 transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => window.open("#pricing", "_blank")}
                  className="hover:text-orange-500 transition-colors"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    window.open(
                      "https://docs.x10minds.com/changelog.html",
                      "_blank",
                    )
                  }
                  className="hover:text-orange-500 transition-colors"
                >
                  Changelog
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-neutral-500">
              <li>
                <a
                  href="https://docs.x10minds.com/ai-docs.html"
                  className="hover:text-orange-500 transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://docs.x10minds.com/community.html"
                  className="hover:text-orange-500 transition-colors"
                >
                  Community
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-neutral-500 text-left">
              <li>
                <a
                  href="/privacy.html"
                  className="hover:text-orange-500 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms.html"
                  className="hover:text-orange-500 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/?p=cookies"
                  onClick={(e) => {
                    e.preventDefault();
                    onLegalClick(AppMode.COOKIES);
                  }}
                  className="hover:text-orange-500 transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="/?p=security"
                  onClick={(e) => {
                    e.preventDefault();
                    onLegalClick(AppMode.SECURITY);
                  }}
                  className="hover:text-orange-500 transition-colors"
                >
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center md:text-left">
          <p className="text-neutral-600 text-sm">
            © 2024 X10Minds Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
