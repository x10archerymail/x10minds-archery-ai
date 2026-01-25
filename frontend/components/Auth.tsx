import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Github,
  Loader2,
  AlertCircle,
  ChevronLeft,
  Sparkles,
  Hash,
  Target,
  Trophy,
  Instagram,
  Twitter,
  Calendar,
  Globe,
} from "lucide-react";
import { UserProfile } from "../types";
import {
  syncUserToFirebase,
  registerWithEmail,
  loginWithEmail,
  getUserProfile,
  loginWithGoogle,
  loginWithGithub,
  handleRedirectLogin,
  sendPasswordReset,
  getMultiFactorResolver,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  getRecaptchaVerifier,
  auth,
  loginWithPhone,
} from "../services/firebase";
import { NotificationType } from "./Overlays";

interface AuthProps {
  onLogin: (user: UserProfile) => void;
  onBack: () => void;
  notify: (message: string, type: NotificationType) => void;
}

type AuthView =
  | "LOGIN"
  | "SIGNUP"
  | "FORGOT_PASSWORD"
  | "MFA_VERIFY"
  | "PHONE_ENTRY"
  | "SMS_VERIFY"
  | "COMPLETE_PROFILE";

const Auth: React.FC<AuthProps> = ({ onLogin, onBack, notify }) => {
  const [view, setView] = useState<AuthView>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Form Data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // Profile Data
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bowType, setBowType] = useState<UserProfile["bowType"]>("Recurve");
  const [archerLevel, setArcherLevel] =
    useState<UserProfile["archerLevel"]>("Beginner");
  const [hobby, setHobby] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    instagram: "",
    twitter: "",
    facebook: "",
  });

  const [tempSocialUser, setTempSocialUser] = useState<any>(null);
  const [mfaCode, setMfaCode] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [resolver, setResolver] = useState<any>(null);
  const recaptchaVerifierRef = useRef<any>(null);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  useEffect(() => {
    const checkRedirect = async () => {
      try {
        setIsLoading(true);
        const user = await handleRedirectLogin();
        if (user) await handleAuthSuccess(user, true);
      } catch (e: any) {
        if (e.code === "auth/multi-factor-auth-required") {
          handleMfaRequirement(e);
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkRedirect();
  }, []);

  useEffect(() => {
    setError("");
  }, [view]);

  const handleAuthSuccess = async (firebaseUser: any, isSocial = false) => {
    try {
      let profile = await getUserProfile(firebaseUser.uid);

      if (!profile) {
        if (isSocial) {
          setTempSocialUser(firebaseUser);
          setFullName(firebaseUser.displayName || "");
          setView("COMPLETE_PROFILE");
          setIsLoading(false);
          return;
        }

        const birthDate = new Date(dob || "2000-01-01");
        const age = new Date().getFullYear() - birthDate.getFullYear();

        const newProfile: UserProfile = {
          fullName: firebaseUser.displayName || fullName || "Archer",
          email: firebaseUser.email || email,
          dateOfBirth: dob || "2000-01-01",
          age: age,
          isLoggedIn: true,
          isNew: true,
          subscriptionTier: "Free",
          tokensUsed: 0,
          tokenLimit: 20000,
          imagesGenerated: 0,
          lastLimitRefill: Date.now(),
          phoneNumber: phoneNumber || firebaseUser.phoneNumber || undefined,
          bowType,
          archerLevel,
          hobby: hobby || undefined,
          socialLinks: socialLinks,
          activeDevices: [],
        };

        await syncUserToFirebase(newProfile);
        profile = newProfile;
      }

      let deviceId = localStorage.getItem("x10minds_device_id");
      if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem("x10minds_device_id", deviceId);
      }

      const updatedDevices = [...(profile.activeDevices || [])];
      const existingDeviceIndex = updatedDevices.findIndex(
        (d) => d.deviceId === deviceId,
      );

      if (existingDeviceIndex >= 0) {
        updatedDevices[existingDeviceIndex].lastActive = Date.now();
      } else {
        if (updatedDevices.length >= 3) {
          throw new Error(
            "Device limit reached (Max 3). Please logout from other devices.",
          );
        }
        updatedDevices.push({
          deviceId,
          userAgent: navigator.userAgent,
          lastActive: Date.now(),
        });
      }

      const finalProfile = {
        ...profile,
        activeDevices: updatedDevices,
        isLoggedIn: true,
      };
      await syncUserToFirebase(finalProfile);
      onLogin(finalProfile);
      notify("Welcome to the Elite Circle!", "success");
    } catch (e: any) {
      setError(e.message || "Authentication failed");
      notify(e.message, "error");
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempSocialUser) return;
    setIsLoading(true);

    try {
      const birthDate = new Date(dob || "2000-01-01");
      const age = new Date().getFullYear() - birthDate.getFullYear();

      const newProfile: UserProfile = {
        fullName: fullName || tempSocialUser.displayName || "Archer",
        email: tempSocialUser.email || "",
        dateOfBirth: dob || "2000-01-01",
        age: age,
        isLoggedIn: true,
        isNew: true,
        subscriptionTier: "Free",
        tokensUsed: 0,
        tokenLimit: 20000,
        imagesGenerated: 0,
        lastLimitRefill: Date.now(),
        phoneNumber: phoneNumber || tempSocialUser.phoneNumber || undefined,
        bowType,
        archerLevel,
        hobby: hobby || undefined,
        socialLinks: socialLinks,
        activeDevices: [],
      };

      await syncUserToFirebase(newProfile);

      let deviceId = localStorage.getItem("x10minds_device_id");
      if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem("x10minds_device_id", deviceId);
      }

      newProfile.activeDevices = [
        {
          deviceId,
          userAgent: navigator.userAgent,
          lastActive: Date.now(),
        },
      ];

      await syncUserToFirebase(newProfile);
      onLogin(newProfile);
      notify("Profile Created Successfully!", "success");
    } catch (e: any) {
      setError(e.message || "Failed to complete profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMfaRequirement = async (error: any) => {
    const resolver = getMultiFactorResolver(auth, error);
    setResolver(resolver);

    if (resolver.hints[0]) {
      const hint = resolver.hints[0] as any;
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current =
          getRecaptchaVerifier("recaptcha-wrapper");
      }
      try {
        const phoneAuthProvider = new PhoneAuthProvider(auth);
        const vId = await phoneAuthProvider.verifyPhoneNumber(
          {
            multiFactorHint: hint,
            session: resolver.session,
          },
          recaptchaVerifierRef.current,
        );
        setVerificationId(vId);
        setView("MFA_VERIFY");
      } catch (e) {
        setError("Failed to send MFA code");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (view === "SIGNUP") {
      if (!email || !password || !fullName) {
        setError("Please fill in all basic fields.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setIsLoading(true);

    try {
      if (view === "LOGIN") {
        try {
          const user = await loginWithEmail(email, password);
          await handleAuthSuccess(user);
        } catch (e: any) {
          if (e.code === "auth/multi-factor-auth-required") {
            await handleMfaRequirement(e);
          } else {
            throw e;
          }
        }
      } else if (view === "SIGNUP") {
        const user = await registerWithEmail(email, password, fullName);
        await handleAuthSuccess(user);
      } else if (view === "COMPLETE_PROFILE") {
        await handleCompleteProfile(e);
      } else if (view === "FORGOT_PASSWORD") {
        await sendPasswordReset(email);
        notify("Reset email sent", "success");
        setView("LOGIN");
      } else if (view === "PHONE_ENTRY") {
        if (!recaptchaVerifierRef.current) {
          recaptchaVerifierRef.current =
            getRecaptchaVerifier("recaptcha-wrapper");
        }
        const res = await loginWithPhone(
          phoneNumber,
          recaptchaVerifierRef.current,
        );
        setConfirmationResult(res);
        setView("SMS_VERIFY");
      } else if (view === "SMS_VERIFY") {
        const res = await confirmationResult.confirm(mfaCode);
        await handleAuthSuccess(res.user);
      } else if (view === "MFA_VERIFY") {
        const cred = PhoneAuthProvider.credential(verificationId, mfaCode);
        const assertion = PhoneMultiFactorGenerator.assertion(cred);
        const res = await resolver.resolveSignIn(assertion);
        await handleAuthSuccess(res.user);
      }
    } catch (e: any) {
      console.error(e);
      let msg = "An error occurred";
      if (e.code === "auth/wrong-password") msg = "Invalid password";
      if (e.code === "auth/user-not-found") msg = "No account found";
      if (e.code === "auth/email-already-in-use")
        msg = "Email already registered";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocial = async (provider: string) => {
    try {
      setIsLoading(true);
      let user;
      if (provider === "google") user = await loginWithGoogle();
      if (provider === "github") user = await loginWithGithub();
      if (user) await handleAuthSuccess(user, true);
    } catch (e: any) {
      if (e.code === "auth/multi-factor-auth-required") {
        await handleMfaRequirement(e);
      } else {
        setError("Social login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );

  const SocialButtons = () => (
    <div className="grid grid-cols-3 gap-3">
      <button
        type="button"
        onClick={() => handleSocial("google")}
        className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#FFD700]/20 transition-all flex items-center justify-center group"
      >
        <GoogleIcon />
      </button>
      <button
        type="button"
        onClick={() => handleSocial("github")}
        className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex items-center justify-center group"
      >
        <Github className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" />
      </button>
      <button
        type="button"
        onClick={() => setView("PHONE_ENTRY")}
        className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/20 transition-all flex items-center justify-center group"
      >
        <Phone className="w-5 h-5 text-neutral-500 group-hover:text-blue-400 transition-colors" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row relative overflow-hidden font-sans selection:bg-[#FFD700]/30">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-[#FFD700]/[0.05] rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-blue-600/[0.05] rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[url('/images/noise.svg')] opacity-[0.02] pointer-events-none"></div>
      </div>

      {/* Left Branding Panel */}
      <div className="hidden md:flex md:w-[45%] lg:w-[40%] xl:w-[35%] p-12 lg:p-16 flex-col justify-between relative z-10 border-r border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div
          className="flex items-center gap-3 group cursor-pointer"
          onClick={onBack}
        >
          <div className="w-10 h-10 rounded-xl bg-[#FFD700] flex items-center justify-center shadow-lg shadow-[#FFD700]/20 group-hover:rotate-6 transition-transform">
            <Target className="w-6 h-6 text-black" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            X10Minds
          </span>
        </div>

        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-white">
              Master Your Archery <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700]">
                With AI Precision.
              </span>
            </h2>
            <p className="text-lg text-neutral-400 max-w-md leading-relaxed">
              Join thousands of archers using advanced analytics to hit the
              X-ring consistently.
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                icon: Sparkles,
                title: "Instant Form Analysis",
                desc: "Get real-time feedback on your stance and release.",
              },
              {
                icon: Trophy,
                title: "Data-Driven Progress",
                desc: "Track scores, visualize trends, and spot weaknesses.",
              },
              {
                icon: Lock,
                title: "Elite Coaching Logic",
                desc: "AI trained on Olympic-level archery methodologies.",
              },
            ].map((feature, i) => (
              <div key={i} className="flex gap-5 group items-start">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#FFD700]/10 group-hover:border-[#FFD700]/20 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-neutral-400 group-hover:text-[#FFD700] transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">{feature.title}</h4>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[10px] text-neutral-600 font-bold tracking-[0.2em] uppercase">
          &copy; 2026 X10MINDS AI • PROPRIETARY TECHNOLOGY
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-[520px] my-auto bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FFD700]/5 rounded-full blur-3xl group-hover:bg-[#FFD700]/10 transition-all duration-1000"></div>

          <button
            onClick={onBack}
            className="mb-8 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest uppercase text-neutral-500 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Terminal
          </button>

          <div className="mb-10">
            <div className="inline-flex p-3 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/20 mb-6 group hover:scale-110 transition-transform">
              <Sparkles className="w-8 h-8 text-[#FFD700]" />
            </div>
            <h1 className="text-4xl font-black mb-3 tracking-tight">
              {view === "LOGIN" && "Welcome Back"}
              {view === "SIGNUP" && "Join the Elite"}
              {view === "FORGOT_PASSWORD" && "Recover Account"}
              {view === "PHONE_ENTRY" && "Phone Entry"}
              {view.includes("VERIFY") && "Secure Access"}
              {view === "COMPLETE_PROFILE" && "Finalize Profile"}
            </h1>
            <p className="text-neutral-500 font-medium text-sm">
              {view === "LOGIN" &&
                "Enter your credentials to access the terminal."}
              {view === "SIGNUP" &&
                "Create your account and start your journey."}
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold animate-in slide-in-from-top-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" id="auth-form">
            {view === "LOGIN" && (
              <div className="space-y-5 animate-in fade-in duration-500">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">
                    Email
                  </label>
                  <div className="group relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600 group-focus-within:text-[#FFD700] transition-colors" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#FFD700]/50 focus:bg-white/[0.07] transition-all text-white placeholder:text-neutral-700"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setView("FORGOT_PASSWORD")}
                      className="text-[10px] font-bold text-[#FFD700] hover:text-white transition-colors"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="group relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600 group-focus-within:text-[#FFD700] transition-colors" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#FFD700]/50 focus:bg-white/[0.07] transition-all text-white placeholder:text-neutral-700"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {view === "SIGNUP" && (
              <div className="space-y-5 animate-in slide-in-from-right-8 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">
                      Full Name
                    </label>
                    <input
                      placeholder="John Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 outline-none focus:border-[#FFD700]/40 transition-all text-white"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">
                      Birth
                    </label>
                    <input
                      type="date"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 outline-none focus:border-[#FFD700]/40 transition-all text-neutral-300"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 outline-none focus:border-[#FFD700]/40 transition-all text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 outline-none focus:border-[#FFD700]/40 transition-all text-white"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">
                      Confirm
                    </label>
                    <input
                      type="password"
                      placeholder="••••"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 outline-none focus:border-[#FFD700]/40 transition-all text-white"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {view === "FORGOT_PASSWORD" && (
              <div className="animate-in fade-in duration-500">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">
                    Reset Email
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 outline-none focus:border-[#FFD700]/40 transition-all text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {view === "PHONE_ENTRY" && (
              <div className="animate-in fade-in duration-500">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 234..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 outline-none focus:border-[#FFD700]/40 transition-all text-white"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {view.includes("VERIFY") && (
              <div className="space-y-4 animate-in fade-in duration-500 text-center">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">
                  Check device for code
                </label>
                <input
                  type="text"
                  placeholder="000000"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-4 outline-none focus:border-[#FFD700]/40 transition-all text-center tracking-[1em] font-mono text-2xl text-white"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  required
                />
              </div>
            )}

            <div id="recaptcha-wrapper"></div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-[#FFD700] text-black rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-[#FFD700]/10 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 disabled:opacity-50 mt-8"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {view === "LOGIN" && "Enter Dashboard"}
                  {view === "SIGNUP" && "Create Account"}
                  {view === "FORGOT_PASSWORD" && "Send Link"}
                  {view.includes("VERIFY") && "Secure Verify"}
                  {view === "PHONE_ENTRY" && "Verify Number"}
                  {view === "COMPLETE_PROFILE" && "Finalize Profile"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {view === "LOGIN" && (
            <div className="animate-in fade-in duration-700">
              <div className="relative py-8 flex items-center">
                <div className="flex-1 h-px bg-white/5"></div>
                <span className="px-4 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
                  or continue with
                </span>
                <div className="flex-1 h-px bg-white/5"></div>
              </div>
              <SocialButtons />
            </div>
          )}

          <div className="text-center mt-10 pt-8 border-t border-white/5">
            <button
              type="button"
              onClick={() => setView(view === "LOGIN" ? "SIGNUP" : "LOGIN")}
              className="text-sm font-medium text-neutral-500 hover:text-white transition-colors group"
            >
              {view === "LOGIN" ? (
                <>
                  New here?{" "}
                  <span className="text-[#FFD700] font-bold ml-1 group-hover:underline underline-offset-4">
                    Create Account
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span className="text-[#FFD700] font-bold ml-1 group-hover:underline underline-offset-4">
                    Log in
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
