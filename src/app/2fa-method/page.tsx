"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MelioLogo } from "@/components/MelioLogo";
import { MessageSquare, Phone, Mail, ChevronRight } from "lucide-react";

const methods = [
  { 
    id: "sms", 
    label: "SMS", 
    description: "Receive a code via text message",
    icon: MessageSquare 
  },
  { 
    id: "phone", 
    label: "Phone call", 
    description: "Receive a code via voice call",
    icon: Phone 
  },
  { 
    id: "email", 
    label: "Email", 
    description: "Receive a code in your inbox",
    icon: Mail 
  },
];

export default function TwoFAMethodPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>("sms");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (loading) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 10000));
    router.push(`/verify-code?method=${encodeURIComponent(selected)}`);
  };

  return (
    <div className="min-h-screen w-full flex items-start sm:items-center justify-center bg-white sm:bg-[#F0F4F8]">
      <div className="w-full sm:max-w-[500px] sm:bg-white sm:rounded-2xl sm:shadow-sm sm:border sm:border-[#e5e7eb] p-6 sm:p-10 pt-16 sm:pt-10">
        <div className="flex justify-center mb-8">
          <Link href="/" aria-label="Back to landing" className="inline-flex">
            <MelioLogo className="h-9 w-auto" />
          </Link>
        </div>

        <h1 className="text-center text-[28px] font-semibold text-[#1a1a2e] mb-2">
          Two-factor authentication
        </h1>
        <p className="text-center text-sm text-[#6b7280] mb-8">
          Select how you want to receive your verification code.
        </p>

    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleContinue(); }} aria-busy={loading}>
          <div className="space-y-3">
            {methods.map((method) => {
              const Icon = method.icon;
              const isSelected = selected === method.id;
              
              return (
                <label
                  key={method.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? "border-[#7244F6] bg-[#F5F3FF]" 
                      : "border-[#e5e7eb] bg-white hover:border-[#d1d5db] hover:bg-[#fafafa]"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value={method.id}
                    checked={isSelected}
                    onChange={() => setSelected(method.id)}
                    className="sr-only"
                  disabled={loading}
                  />
                  <div className={`p-2 rounded-lg ${isSelected ? "bg-[#7244F6] text-white" : "bg-[#F3F4F6] text-[#6b7280]"}`}>
                    <Icon size={20} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-semibold text-[#1a1a2e]">
                      {method.label}
                    </div>
                    <div className="text-xs text-[#6b7280]">
                      {method.description}
                    </div>
                  </div>
                  <div className={`transition-transform duration-200 ${isSelected ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}>
                    <ChevronRight size={20} className="text-[#7244F6]" />
                  </div>
                </label>
              );
            })}
          </div>

          <button
            type="submit"
            className="w-full h-12 mt-6 bg-[#7244F6] hover:bg-[#5a35c5] text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
            disabled={loading}
          >
            {loading ? "Loading..." : "Continue"}
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-[#e5e7eb]">
          <p className="text-sm text-[#6b7280]">
            Need help? <a href="#" className="text-[#7244F6] hover:underline font-medium">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
}

