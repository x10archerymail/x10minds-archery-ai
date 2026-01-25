import * as React from "react";
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
  Quote,
  ChevronRight,
  ShieldCheck,
  Globe,
  Crown,
  Sparkles,
  Menu,
  Github,
} from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { AppMode } from "../types";
import { blogPosts } from "./StaticPages";
import BowModel from "./shop/ui/BowModel";

interface LandingPageProps {
  onGetStarted: () => void;
  onLegalClick: (mode: AppMode) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onLegalClick,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileLegalOpen, setIsMobileLegalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FFD700]/30 font-sans overflow-x-hidden">
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
                src="/images/X10Minds%20logo.png"
                alt="logo"
                className="w-full h-full object-contain filter group-hover:brightness-110 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-6"
              />
            </div>
            <div className="flex font-black tracking-tight text-xl uppercase font-orbitron">
              <span className="text-white">X10</span>
              <span className="text-[#FFD700]">MINDS</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 font-orbitron">
            <a
              href="#pricing"
              className="text-[10px] font-bold tracking-[0.2em] text-white/60 hover:text-white transition-all uppercase"
            >
              Pricing
            </a>
            <button
              onClick={() => onLegalClick(AppMode.BLOG)}
              className="text-[10px] font-bold tracking-[0.2em] text-white/60 hover:text-white transition-all uppercase"
            >
              Blog
            </button>
            <button
              onClick={() => onLegalClick(AppMode.ABOUT)}
              className="text-[10px] font-bold tracking-[0.2em] text-white/60 hover:text-white transition-all uppercase"
            >
              About
            </button>

            <div className="relative group">
              <button className="flex items-center gap-1 text-[10px] font-bold tracking-[0.2em] text-white/60 hover:text-white transition-all uppercase">
                Legal <span className="text-[10px]">▼</span>
              </button>
              <div className="absolute top-full left-0 pt-2 w-48 hidden group-hover:block animate-in fade-in slide-in-from-top-2 shadow-2xl">
                <div className="bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden p-2">
                  <button
                    onClick={() => onLegalClick(AppMode.PRIVACY)}
                    className="w-full text-left px-4 py-2 text-[10px] font-bold tracking-widest text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all uppercase"
                  >
                    Privacy Policy
                  </button>
                  <button
                    onClick={() => onLegalClick(AppMode.TERMS)}
                    className="w-full text-left px-4 py-2 text-[10px] font-bold tracking-widest text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all uppercase"
                  >
                    Terms & Policy
                  </button>
                  <button
                    onClick={() => onLegalClick(AppMode.COOKIES)}
                    className="w-full text-left px-4 py-2 text-[10px] font-bold tracking-widest text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all uppercase"
                  >
                    Cookie Policy
                  </button>
                  <button
                    onClick={() => onLegalClick(AppMode.SECURITY)}
                    className="w-full text-left px-4 py-2 text-[10px] font-bold tracking-widest text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all uppercase"
                  >
                    Security
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-4 items-center">
            <a
              href="https://docs.x10minds.com"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white transition-all text-[10px] font-bold tracking-widest uppercase font-orbitron"
            >
              Docs <ExternalLink className="w-3 h-3 text-[#FFD700]" />
            </a>
            <button
              onClick={onGetStarted}
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#FFD700] text-black font-black rounded-full hover:scale-105 active:scale-95 transition-all text-[10px] tracking-widest uppercase font-orbitron shadow-[0_0_20px_rgba(255,215,0,0.3)]"
            >
              Start Now
            </button>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 sm:p-2.5 rounded-full text-white bg-white/5 hover:bg-white/10 transition-all border border-white/10"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
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
              src="/images/X10Minds%20logo.png"
              alt="X10Minds Logo"
              className="w-10 h-10 object-contain drop-shadow-md"
            />
            <span className="text-xl font-bold tracking-tight text-white">
              X10Minds
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
          <a
            href="#blog"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-4 py-3 text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 transform hover:translate-x-1"
          >
            Blog
          </a>
          <button
            onClick={() => {
              onLegalClick(AppMode.ABOUT);
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 transform hover:translate-x-1"
          >
            About
          </button>

          {/* Mobile Legal Dropdown */}
          <div className="border-t border-white/5 my-2 pt-2">
            <button
              onClick={() => setIsMobileLegalOpen(!isMobileLegalOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <span>Legal</span>
              <ChevronRight
                className={`w-4 h-4 transition-transform duration-300 ${
                  isMobileLegalOpen ? "rotate-90" : ""
                }`}
              />
            </button>
            {isMobileLegalOpen && (
              <div className="pl-6 space-y-1 animate-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => {
                    onLegalClick(AppMode.PRIVACY);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-xs font-medium text-neutral-500 hover:text-white rounded-lg"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => {
                    onLegalClick(AppMode.TERMS);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-xs font-medium text-neutral-500 hover:text-white rounded-lg"
                >
                  Terms & Policy
                </button>
                <button
                  onClick={() => {
                    onLegalClick(AppMode.COOKIES);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-xs font-medium text-neutral-500 hover:text-white rounded-lg"
                >
                  Cookie Policy
                </button>
                <button
                  onClick={() => {
                    onLegalClick(AppMode.SECURITY);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-xs font-medium text-neutral-500 hover:text-white rounded-lg"
                >
                  Security
                </button>
              </div>
            )}
          </div>

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
              className="w-full px-6 py-3 bg-[#FFD700] text-black font-extrabold rounded-full hover:brightness-110 transition-all duration-200 transform hover:scale-[1.02] active:scale-95"
            >
              Get Started
            </button>
          </div>
        </nav>
      </aside>

      {/* Hero Section */}
      <section className="relative h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-[#050505] pb-16 sm:pb-0">
        {/* Advanced Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.05)_0%,transparent_50%)]"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'url("https://grainy-gradients.vercel.app/noise.svg")',
            filter: "contrast(150%) brightness(100%)",
          }}
        ></div>

        {/* Moving Mesh Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FFD700]/5 blur-[120px] rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Big Background Text */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-0 select-none pointer-events-none">
          <h2 className="text-[25vw] font-black leading-none text-white/[0.02] font-orbitron tracking-tighter opacity-10 blur-sm">
            X10
          </h2>
        </div>

        {/* Central HUD Logic */}
        <div className="relative z-10 flex flex-col items-center justify-center scale-[0.55] xs:scale-[0.65] sm:scale-[0.8] md:scale-95 lg:scale-110 xl:scale-125 transition-transform duration-700">
          {/* Top Badge */}
          <div className="mb-8 animate-in fade-in slide-in-from-top-8 duration-1000 delay-300 relative z-20">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(255,215,0,0.1)] hover:border-[#FFD700]/40 transition-all duration-500">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD700] animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.3em] text-white uppercase font-orbitron">
                Neural Archery Intelligence{" "}
                <span className="text-[#FFD700]">v2.5</span>
              </span>
            </div>
          </div>

          {/* Main Visual Core */}
          <div className="relative w-[300px] h-[300px] sm:w-[320px] sm:h-[320px] md:w-[420px] md:h-[420px] flex items-center justify-center group">
            {/* Advanced Orbiting Rings */}
            <div className="absolute inset-0 border-[0.5px] border-white/10 rounded-full animate-[spin_20s_linear_infinite] group-hover:border-[#FFD700]/30 transition-all duration-700"></div>
            <div className="absolute inset-4 border-[0.5px] border-white/5 rounded-full border-dashed animate-[spin_30s_linear_infinite_reverse]"></div>
            <div className="absolute inset-12 border-[2px] border-[#FFD700]/10 rounded-full animate-pulse group-hover:scale-105 transition-all"></div>

            {/* Spinning HUD Markers */}
            <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-[#FFD700]/40 rounded-full"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-[#FFD700]/40 rounded-full"></div>
            </div>

            {/* Center Glass Core */}
            <div className="relative z-20 w-44 h-44 xs:w-52 xs:h-52 sm:w-60 sm:h-60 md:w-80 md:h-80 flex flex-col items-center justify-center bg-white/[0.03] backdrop-blur-3xl rounded-full border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)] transition-all duration-700 group-hover:scale-105 group-hover:shadow-[0_0_150px_rgba(255,215,0,0.25)] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.15)_0%,transparent_70%)] animate-pulse"></div>
              <div className="w-full h-full p-2 sm:p-4 pointer-events-none">
                <BowModel className="w-full h-full transition-transform duration-1000 group-hover:scale-110" />
              </div>
            </div>

            {/* Title Overlay (Hidden on Hover for impact) */}
            <div className="absolute top-[68%] z-30 transition-all duration-700 group-hover:opacity-0 group-hover:translate-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white font-orbitron drop-shadow-2xl">
                X10<span className="text-[#FFD700]">MINDS</span>
              </h1>
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent mt-2"></div>
            </div>

            {/* Floating Intelligence Targets */}

            {/* Left Tag */}
            <div className="absolute left-[-40px] md:left-[-140px] top-1/2 -translate-y-1/2 flex items-center gap-4 group-hover:-translate-x-6 transition-transform duration-700">
              <div className="flex flex-col items-end">
                <div className="px-4 py-1.5 bg-black/40 backdrop-blur-md border border-blue-500/30 rounded-lg text-[9px] font-black text-blue-400 tracking-[0.2em] uppercase font-orbitron">
                  PREDICTIVE
                </div>
                <div className="w-20 h-[0.5px] bg-gradient-to-r from-transparent to-blue-500/50 mt-1"></div>
              </div>
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)]"></div>
            </div>

            {/* Right Tag */}
            <div className="absolute right-[-40px] md:right-[-140px] top-[20%] flex items-center gap-4 group-hover:translate-x-6 transition-transform duration-700">
              <div className="w-2 h-2 rounded-full bg-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,1)]"></div>
              <div className="flex flex-col items-start">
                <div className="px-4 py-1.5 bg-black/40 backdrop-blur-md border border-[#FFD700]/30 rounded-lg text-[9px] font-black text-[#FFD700] tracking-[0.2em] uppercase font-orbitron">
                  BIOMETRIC
                </div>
                <div className="w-20 h-[0.5px] bg-gradient-to-l from-transparent to-[#FFD700]/50 mt-1"></div>
              </div>
            </div>

            {/* Bottom HUD Details */}
            <div className="absolute bottom-[-30px] md:bottom-[-60px] left-1/2 -translate-x-1/2 flex flex-col items-center group-hover:translate-y-6 transition-transform duration-700">
              <div className="w-[0.5px] h-12 bg-gradient-to-b from-transparent to-[#FFD700]/40"></div>
              <div className="px-6 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-black text-white tracking-[0.4em] uppercase font-orbitron shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:border-[#FFD700]/50 transition-colors">
                CORE_STABILITY_ONLINE
              </div>
            </div>
          </div>

          {/* Navigation CTAs */}
          <div className="mt-16 sm:mt-24 flex flex-col sm:flex-row gap-6 z-30">
            <button
              onClick={onGetStarted}
              className="group relative px-10 py-4 bg-[#FFD700] text-black font-black text-xs tracking-[0.2em] uppercase rounded-none skew-x-[-12deg] transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(255,215,0,0.2)] hover:shadow-[0_30px_60px_rgba(255,215,0,0.3)]"
            >
              <div className="absolute inset-0 bg-white/20 skew-x-[12deg] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              <span className="skew-x-[12deg] block relative z-10 flex items-center gap-3">
                Initialize System <ArrowRight className="w-4 h-4" />
              </span>
            </button>
            <button
              onClick={() => onLegalClick(AppMode.ABOUT)}
              className="px-10 py-4 border border-white/20 text-white font-black text-xs tracking-[0.2em] uppercase rounded-none skew-x-[-12deg] hover:bg-white/5 transition-all hover:border-white/50"
            >
              <span className="skew-x-[12deg] block">Terminal Info</span>
            </button>
          </div>
        </div>

        {/* Cinematic Particles Backdrop */}
        <div className="absolute bottom-10 left-10 flex flex-col gap-2 opacity-20 hidden md:flex">
          <div className="w-40 h-[1px] bg-gradient-to-r from-white to-transparent"></div>
          <div className="w-24 h-[1px] bg-gradient-to-r from-white to-transparent"></div>
          <div className="text-[8px] font-mono text-white tracking-widest mt-2 uppercase">
            System_Coordinates: 34.0522° N, 118.2437° W
          </div>
        </div>

        {/* Big Background Footer Text */}
        <div className="absolute bottom-0 w-full flex justify-center overflow-hidden z-0 select-none pointer-events-none">
          <h2 className="text-[20vw] font-black leading-none text-white/[0.03] font-orbitron tracking-tighter translate-y-[20%]">
            ARCHERY
          </h2>
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
                Artificial Intelligent
              </h2>
              <p className="text-neutral-400 max-w-2xl mx-auto">
                X10Minds AI combines specialized sports science with universal
                knowledge to solve any task with absolute perfection.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="p-6 md:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-[#FFD700]/50 hover:shadow-[0_0_30px_rgba(255,215,0,0.1)] transition-all duration-300 group hover:-translate-y-1">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-[#FFD700]/10 rounded-2xl flex items-center justify-center mb-6 sm:group-hover:scale-110 transition-transform duration-500">
                  <Camera className="w-6 h-6 md:w-7 md:h-7 text-[#FFD700]" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 font-orbitron group-hover:text-[#FFD700] transition-colors">
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
              <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-[#FFD700]/50 hover:shadow-[0_0_30px_rgba(255,215,0,0.1)] transition-all duration-300 group hover:-translate-y-1">
                <div className="w-14 h-14 bg-[#FFD700]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Trophy className="w-7 h-7 text-[#FFD700]" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-orbitron group-hover:text-[#FFD700] transition-colors">
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
            <h2 className="text-4xl font-bold mb-4">The X10 Workflow</h2>
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
                  <div className="text-5xl font-bold text-neutral-800 mb-6 font-mono group-hover:text-[#FFD700]/20 transition-colors">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#FFD700] transition-colors">
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

      {/* Blog Section */}
      <section
        className="py-24 bg-neutral-900/50 backdrop-blur-sm px-6"
        id="blog"
      >
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 font-orbitron">
                  ARCHERY <span className="text-[#FFD700]">INSIGHTS</span>
                </h2>
                <p className="text-neutral-400 text-lg">
                  Deep dives into the science, gear, and psychology of modern
                  archery.
                </p>
              </div>
              <button
                onClick={() => onLegalClick(AppMode.BLOG)}
                className="flex items-center gap-2 text-[#FFD700] font-bold hover:brightness-110 transition-all group"
              >
                View All Articles{" "}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(0, 3).map((post, idx) => (
              <ScrollReveal key={idx} animation="fade-up" delay={idx * 100}>
                <article className="rounded-[2.5rem] overflow-hidden bg-neutral-900 border border-white/5 hover:border-[#FFD700]/30 transition-all duration-500 group flex flex-col h-full shadow-2xl hover:-translate-y-2">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1544924405-459686772713?q=80&w=800&auto=format&fit=crop";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-6 px-4 py-1.5 rounded-full bg-[#FFD700] text-black text-[10px] font-black tracking-[0.2em] uppercase">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-[#FFD700] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-neutral-400 text-sm leading-relaxed mb-8 flex-1 line-clamp-3">
                      {post.description}
                    </p>
                    <button
                      onClick={() => onLegalClick(AppMode.BLOG)}
                      className="flex items-center gap-2 font-black text-[10px] tracking-widest uppercase text-white hover:text-[#FFD700] transition-all"
                    >
                      READ MORE <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-black px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 font-orbitron tracking-tight">
            ELITE <span className="text-[#FFD700]">FEEDBACK</span>
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
                <div className="bg-neutral-900 p-8 rounded-[2.5rem] border border-white/5 relative h-full hover:border-[#FFD700]/20 transition-all duration-300 shadow-2xl group">
                  <Quote className="absolute top-8 right-8 w-8 h-8 text-neutral-800 group-hover:text-[#FFD700]/20 transition-colors" />
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 text-[#FFD700] fill-[#FFD700]"
                      />
                    ))}
                  </div>
                  <p className="text-neutral-300 mb-8 leading-relaxed font-medium italic">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-[#FFD700] border border-white/10">
                      {t.author[0]}
                    </div>
                    <div>
                      <div className="font-bold text-white">{t.author}</div>
                      <div className="text-xs text-neutral-500 font-medium uppercase tracking-widest">
                        {t.role}
                      </div>
                    </div>
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
                  className="w-full py-4 rounded-xl bg-[#FFD700]/10 text-[#FFD700] font-bold hover:bg-[#FFD700]/20 transition-colors border border-[#FFD700]/20"
                >
                  Get Charge
                </button>
              </div>
            </ScrollReveal>

            {/* Pro Tier */}
            <ScrollReveal animation="fade-up" delay={300} className="h-full">
              <div className="p-8 rounded-3xl border border-[#FFD700]/30 bg-neutral-900 flex flex-col relative shadow-2xl shadow-[#FFD700]/20 sm:hover:scale-[1.02] transition-all group h-full">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase shadow-lg">
                  Recommended
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#FFD700]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-[#FFD700]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 font-orbitron uppercase text-[#FFD700]">
                  Pro
                </h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">₹1399</span>
                  <span className="text-neutral-500">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-sm text-white font-medium">
                    <Check className="w-5 h-5 text-[#FFD700] flex-shrink-0" />{" "}
                    Unlimited Chat Tokens
                  </li>
                  <li className="flex items-start gap-3 text-sm text-white font-medium">
                    <Check className="w-5 h-5 text-[#FFD700] flex-shrink-0" />{" "}
                    HD Form Analysis
                  </li>
                  <li className="flex items-start gap-3 text-sm text-white font-medium">
                    <Check className="w-5 h-5 text-[#FFD700] flex-shrink-0" />{" "}
                    Custom SPT Plans
                  </li>
                  <li className="flex items-start gap-3 text-sm text-white font-medium">
                    <Check className="w-5 h-5 text-[#FFD700] flex-shrink-0" />{" "}
                    Priority AI Access
                  </li>
                </ul>
                <button
                  onClick={onGetStarted}
                  className="w-full py-4 rounded-xl bg-[#FFD700] text-black font-black hover:brightness-110 transition-all shadow-xl shadow-[#FFD700]/20"
                >
                  Go Pro Now
                </button>
              </div>
            </ScrollReveal>

            {/* Ultra Tier */}
            <ScrollReveal animation="fade-up" delay={400} className="h-full">
              <div className="p-8 rounded-3xl border border-[#FFD700]/20 bg-neutral-900/30 flex flex-col hover:border-[#FFD700]/40 transition-all group h-full">
                <div className="w-12 h-12 rounded-2xl bg-[#FFD700]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Crown className="w-6 h-6 text-[#FFD700]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 font-orbitron uppercase text-[#FFD700]">
                  Ultra
                </h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">₹2,999</span>
                  <span className="text-neutral-500">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-sm text-neutral-300">
                    <Check className="w-5 h-5 text-[#FFD700] flex-shrink-0" />{" "}
                    GPT-4o Class Models
                  </li>
                  <li className="flex items-start gap-3 text-sm text-neutral-300">
                    <Check className="w-5 h-5 text-[#FFD700] flex-shrink-0" />{" "}
                    Video Form Analysis
                  </li>
                  <li className="flex items-start gap-3 text-sm text-neutral-300">
                    <Check className="w-5 h-5 text-[#FFD700] flex-shrink-0" />{" "}
                    Team Management
                  </li>
                  <li className="flex items-start gap-3 text-sm text-neutral-300">
                    <Check className="w-5 h-5 text-[#FFD700] flex-shrink-0" />{" "}
                    24/7 Priority Support
                  </li>
                </ul>
                <button
                  onClick={onGetStarted}
                  className="w-full py-4 rounded-xl bg-[#FFD700] text-black font-black hover:brightness-110 transition-all shadow-xl shadow-[#FFD700]/20"
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
        <div className="absolute inset-0 bg-[#FFD700] -z-20"></div>
        <div className="absolute inset-0 bg-black/90 -z-10"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 -z-10"></div>

        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight font-orbitron uppercase">
            Ready to shoot <span className="text-[#FFD700]">X's?</span>
          </h2>
          <p className="text-xl text-neutral-500 mb-10 max-w-2xl mx-auto font-bold uppercase tracking-widest text-[12px]">
            Join the elite circle of archers who have elevated their game with
            X10Minds Intelligence.
          </p>
          <button
            onClick={onGetStarted}
            className="px-16 py-6 bg-[#FFD700] text-black font-black text-xl rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-2xl shadow-[#FFD700]/20 uppercase tracking-[0.2em] font-orbitron"
          >
            Deploy System Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/10 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <img
                src="/images/X10Minds%20logo.png"
                alt="X10Minds Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="font-bold text-white text-lg">X10Minds</span>
            </div>
            <p className="text-neutral-500 text-sm mb-6 leading-relaxed">
              X10Minds is the world's most advanced Artificial Intelligent
              Archery Coach. We provide biomechanical technique analysis,
              personalized training plans, and mental conditioning to help
              archers achieve perfection in every shot.
            </p>
            <div className="flex gap-4">
              <a
                href="https://x.com/x10minds"
                target="_blank"
                className="text-neutral-500 hover:text-white transition-colors"
                rel="noreferrer"
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
                href="https://www.instagram.com/x10minds"
                target="_blank"
                className="text-neutral-500 hover:text-white transition-colors"
                rel="noreferrer"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/channel/UCK-Bm6SEBsUP-nH0MJy88PQ"
                target="_blank"
                className="text-neutral-500 hover:text-white transition-colors"
                rel="noreferrer"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/x10archerymail/x10minds-archery-ai"
                target="_blank"
                className="text-neutral-500 hover:text-white transition-colors"
                rel="noreferrer"
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
                    window.open("https://docs.x10minds.com/ai-docs", "_blank")
                  }
                  className="hover:text-[#FFD700] transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-[#FFD700] transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <button
                  onClick={() =>
                    window.open("https://docs.x10minds.com/changelog", "_blank")
                  }
                  className="hover:text-[#FFD700] transition-colors"
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
                  href="https://docs.x10minds.com/ai-docs"
                  className="hover:text-[#FFD700] transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://docs.x10minds.com/community"
                  className="hover:text-[#FFD700] transition-colors"
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
                <button
                  onClick={() => onLegalClick(AppMode.TERMS)}
                  className="hover:text-[#FFD700] transition-colors"
                >
                  Terms of Service
                </button>
              </li>

              <li>
                <button
                  onClick={() => onLegalClick(AppMode.SECURITY)}
                  className="hover:text-[#FFD700] transition-colors"
                >
                  Security
                </button>
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
