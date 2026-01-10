import React, { useState, useEffect } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Shield,
} from "lucide-react";
import { verifyResetCode, confirmReset } from "../services/firebase";

interface ResetPasswordProps {
  oobCode: string;
  onNavigateHome: () => void;
  notify: (msg: string, type: "success" | "error" | "info") => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({
  oobCode,
  onNavigateHome,
  notify,
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Validate Firebase oobCode
    const validateCode = async () => {
      try {
        if (!oobCode) {
          setError(
            "No reset code provided. Please use the link from your email."
          );
          setIsLoading(false);
          return;
        }

        const userEmail = await verifyResetCode(oobCode);
        setEmail(userEmail);
        setIsValid(true);
        setIsLoading(false);
      } catch (e: any) {
        console.error("Reset code validation error:", e);
        if (e.code === "auth/expired-action-code") {
          setError(
            "This password reset link has expired. Please request a new one."
          );
        } else if (e.code === "auth/invalid-action-code") {
          setError(
            "This password reset link is invalid or has already been used."
          );
        } else {
          setError("Unable to verify reset link. Please try again.");
        }
        setIsLoading(false);
      }
    };

    validateCode();
  }, [oobCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      notify("Passwords do not match", "error");
      return;
    }
    if (password.length < 8) {
      notify("Password must be at least 8 characters", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      await confirmReset(oobCode, password);
      setSuccess(true);
      notify("Password successfully updated!", "success");
    } catch (e: any) {
      console.error("Password reset error:", e);
      if (e.code === "auth/weak-password") {
        notify(
          "Password is too weak. Please use a stronger password.",
          "error"
        );
      } else if (e.code === "auth/expired-action-code") {
        notify(
          "This reset link has expired. Please request a new one.",
          "error"
        );
      } else {
        notify("Failed to reset password: " + e.message, "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full border-4 border-orange-500/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 animate-spin"></div>
            <Shield className="absolute inset-0 m-auto w-6 h-6 text-orange-500" />
          </div>
          <p className="text-neutral-400">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex font-sans selection:bg-orange-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="flex-1 flex flex-col justify-center p-6 md:p-12 lg:p-24 relative overflow-y-auto w-full max-w-2xl mx-auto">
        <div className="max-w-md w-full mx-auto animate-in fade-in zoom-in-95 duration-500 bg-neutral-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl flex items-center justify-center mb-6 border border-orange-500/20 shadow-lg shadow-orange-500/10">
              <Lock className="w-10 h-10 text-orange-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {success ? "Password Reset Complete" : "Set New Password"}
            </h2>
            <p className="text-neutral-400">
              {success
                ? "You can now log in with your new password."
                : email
                ? `Resetting password for ${email}`
                : "Create a new secure password"}
            </p>
          </div>

          {/* Error State */}
          {!isValid && error ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center backdrop-blur-sm">
              <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-red-400 font-medium mb-4">{error}</p>
              <button
                onClick={onNavigateHome}
                className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-all text-sm font-medium"
              >
                Return to Home
              </button>
            </div>
          ) : success ? (
            /* Success State */
            <div className="text-center">
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-green-400 font-medium">
                  Your password has been successfully updated!
                </p>
              </div>
              <button
                onClick={onNavigateHome}
                className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-900/30 flex items-center justify-center gap-2"
              >
                Continue to Login <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 ml-1">
                  New Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-4 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all pl-12 pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-orange-500 transition-colors" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 ml-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-4 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all pl-12"
                    placeholder="••••••••"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-orange-500 transition-colors" />
                </div>
                {password &&
                  confirmPassword &&
                  password !== confirmPassword && (
                    <p className="text-red-400 text-xs mt-2 ml-1">
                      Passwords do not match
                    </p>
                  )}
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          password.length >= (i + 1) * 3
                            ? password.length >= 12
                              ? "bg-green-500"
                              : password.length >= 8
                              ? "bg-yellow-500"
                              : "bg-red-500"
                            : "bg-neutral-800"
                        }`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-xs ${
                      password.length >= 8
                        ? "text-green-400"
                        : "text-neutral-500"
                    }`}
                  >
                    {password.length < 8
                      ? `${8 - password.length} more characters needed`
                      : "✓ Strong password"}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  password.length < 8 ||
                  password !== confirmPassword
                }
                className={`
                  w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-6
                  ${
                    isSubmitting ||
                    password.length < 8 ||
                    password !== confirmPassword
                      ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-lg shadow-orange-900/30"
                  }
                `}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Reset Password
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Link */}
          {!success && isValid && (
            <p className="text-center text-neutral-500 text-sm mt-6">
              Remember your password?{" "}
              <button
                onClick={onNavigateHome}
                className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
              >
                Back to Login
              </button>
            </p>
          )}
        </div>

        {/* Brand Footer */}
        <p className="text-center text-neutral-600 text-sm mt-8">
          © {new Date().getFullYear()} X10Minds. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
