"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { signupUser } from "@/services/auth";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    referral_code: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const ref = searchParams.get("ref");

    if (ref) {
      setForm((prev) => ({
        ...prev,
        referral_code: ref,
      }));

      localStorage.setItem("referral_code", ref);
    } else {
      const savedRef =
        localStorage.getItem("referral_code");

      if (savedRef) {
        setForm((prev) => ({
          ...prev,
          referral_code: savedRef,
        }));
      }
    }
  }, [searchParams]);

  const handleSignup = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    if (form.password.length < 8) {
      setError(
        "Password must be at least 8 characters long"
      );

      setLoading(false);

      return;
    }

    try {
      await signupUser(form);

      router.push("/auth/verify-email-info");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] text-white overflow-hidden relative">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0ea5e920,transparent_30%),radial-gradient(circle_at_bottom_right,#8b5cf620,transparent_30%)]"></div>

      {/* GLOW */}
      <div className="absolute -top-32 -left-20 w-[32rem] h-[32rem] bg-cyan-500/20 blur-[140px] rounded-full"></div>

      <div className="absolute top-20 -right-32 w-[35rem] h-[35rem] bg-violet-500/20 blur-[150px] rounded-full"></div>

      <div className="relative z-10 min-h-screen grid lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-center px-20 border-r border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-violet-500/10"></div>

          <div className="relative z-10">
            {/* ICON */}
            <div className="w-20 h-20 rounded-[2rem] bg-white/10 border border-white/10 backdrop-blur-xl flex items-center justify-center mb-10 shadow-2xl">
              <span className="text-4xl">🚀</span>
            </div>

            {/* TITLE */}
            <h1 className="text-6xl xl:text-7xl font-black leading-[1.05] mb-8">
              Start Your
              <br />

              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Fluency
              </span>

              <br />
              Journey.
            </h1>

            {/* DESCRIPTION */}
            <p className="text-slate-300 text-xl leading-relaxed max-w-xl mb-12">
              Practice speaking with AI conversations,
              pronunciation feedback, real-world
              scenarios, and fluency challenges.
            </p>

            {/* FEATURES */}
            <div className="space-y-5">
              <FeatureItem text="🎤 AI Speaking Practice" />

              <FeatureItem text="⚡ Real-Time Fluency Feedback" />

              <FeatureItem text="🔥 Daily XP & Streak System" />

              <FeatureItem text="🧠 Personalized AI Learning" />
            </div>

            {/* QUOTE */}
            <div className="mt-12 bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[2rem] p-7 shadow-2xl max-w-xl">
              <p className="italic text-lg text-slate-200 leading-relaxed">
                “Small daily improvements are the key
                to long-term fluency.”
              </p>

              <p className="mt-5 font-bold text-cyan-300">
                — Grammrlyst AI
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-6 lg:p-12">
          <div
            className="w-full max-w-lg rounded-[2.5rem]
            bg-white/[0.06]
            border border-white/10
            backdrop-blur-3xl
            p-8 shadow-[0_0_80px_rgba(14,165,233,0.08)]"
          >
            {/* TOP */}
            <div className="mb-8">
              <div
                className="w-20 h-20 rounded-[2rem]
                bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600
                flex items-center justify-center text-4xl
                shadow-[0_20px_60px_rgba(59,130,246,0.45)] mb-6"
              >
                ✨
              </div>

              <p className="uppercase tracking-[0.25em] text-cyan-300 text-xs font-bold mb-4">
                Join Grammrlyst
              </p>

              <h2 className="text-5xl font-black mb-4">
                Create Account
              </h2>

              <p className="text-slate-400 leading-relaxed text-[15px]">
                Start learning English confidently
                with AI-powered speaking practice.
              </p>

              {/* REFERRAL */}
              {form.referral_code && (
                <div className="mt-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3">
                  <p className="text-emerald-300 text-sm">
                    🎉 Referral code applied
                    automatically.
                  </p>
                </div>
              )}
            </div>

            {/* ERROR */}
            {error && (
              <div
                className="mb-6 rounded-2xl
                bg-red-500/10 border border-red-500/20
                p-4 text-red-300 text-sm backdrop-blur-xl"
              >
                {error}
              </div>
            )}

            {/* FORM */}
            <form
              onSubmit={handleSignup}
              className="space-y-5"
            >
              {/* NAME */}
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="First Name"
                  placeholder="John"
                  onChange={(e: any) =>
                    setForm({
                      ...form,
                      first_name: e.target.value,
                    })
                  }
                />

                <InputField
                  label="Last Name"
                  placeholder="Doe"
                  onChange={(e: any) =>
                    setForm({
                      ...form,
                      last_name: e.target.value,
                    })
                  }
                />
              </div>

              {/* EMAIL */}
              <InputField
                label="Email Address"
                type="email"
                required
                placeholder="john@example.com"
                onChange={(e: any) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />

              {/* PASSWORD */}
              <InputField
                label="Create Password"
                type="password"
                required
                placeholder="••••••••"
                onChange={(e: any) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />

              {/* REFERRAL */}
              <InputField
                label="Referral Code (Optional)"
                placeholder="Enter referral code"
                value={form.referral_code}
                onChange={(e: any) =>
                  setForm({
                    ...form,
                    referral_code: e.target.value,
                  })
                }
              />

              {/* TERMS */}
              <div className="flex items-start gap-3 px-1 py-1">
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-white/10"
                />

                <p className="text-sm text-slate-400 leading-relaxed">
                  I agree to the{" "}
                  <span className="text-cyan-300 font-semibold">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-cyan-300 font-semibold">
                    Privacy Policy
                  </span>
                  .
                </p>
              </div>

              {/* BUTTON */}
              <button
                disabled={loading}
                className="w-full py-4 rounded-2xl
                bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600
                font-bold text-lg shadow-[0_20px_50px_rgba(59,130,246,0.35)]
                hover:scale-[1.02]
                hover:shadow-[0_20px_70px_rgba(59,130,246,0.55)]
                transition-all duration-300 disabled:opacity-70"
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>
            </form>

            {/* LOGIN */}
            <p className="text-center mt-8 text-slate-400">
              Already a member?{" "}
              <Link
                href="/auth/login"
                className="text-cyan-300 font-bold hover:text-cyan-200 transition-all"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

/* COMPONENTS */

function InputField({
  label,
  type = "text",
  placeholder,
  required,
  value,
  onChange,
}: any) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-300 mb-3">
        {label}
      </label>

      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-5 py-4 rounded-2xl
        bg-white/[0.04] border border-white/10
        text-white placeholder:text-slate-500
        focus:outline-none focus:border-cyan-400
        focus:ring-4 focus:ring-cyan-400/10
        transition-all duration-300"
      />
    </div>
  );
}

function FeatureItem({ text }: any) {
  return (
    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 backdrop-blur-xl max-w-xl">
      <div className="w-2 h-2 rounded-full bg-cyan-400"></div>

      <p className="text-slate-300 text-lg">
        {text}
      </p>
    </div>
  );
}