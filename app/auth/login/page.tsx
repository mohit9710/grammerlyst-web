"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/services/auth";
import { useGoogleLogin } from "@/services/googleAuthService";

export default function LoginPage() {
  const { loginWithGoogle, loading: googleLoading } = useGoogleLogin();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const data = await signIn(email, password);

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] text-white overflow-hidden relative">
  {/* PREMIUM BACKGROUND */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0ea5e920,transparent_30%),radial-gradient(circle_at_bottom_right,#8b5cf620,transparent_30%)]"></div>

  {/* GLOW ORBS */}
  <div className="absolute -top-32 -left-20 w-[32rem] h-[32rem] bg-cyan-500/20 blur-[140px] rounded-full"></div>

  <div className="absolute top-20 -right-32 w-[35rem] h-[35rem] bg-violet-500/20 blur-[150px] rounded-full"></div>

  <div className="relative z-10 min-h-screen grid lg:grid-cols-2">
    {/* LEFT SIDE */}
    <div className="hidden lg:flex flex-col justify-center px-20 relative overflow-hidden border-r border-white/10">
      {/* GLASS OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-violet-500/10 backdrop-blur-3xl"></div>

      {/* FLOATING ELEMENT */}
      <div className="absolute top-20 right-20 w-40 h-40 rounded-full bg-cyan-400/10 blur-3xl"></div>

      <div className="relative z-10">
        {/* ICON */}
        <div className="w-20 h-20 rounded-[2rem] bg-white/10 border border-white/10 backdrop-blur-xl flex items-center justify-center mb-10 shadow-2xl">
          <i className="fas fa-unlock-alt text-4xl text-cyan-300"></i>
        </div>

        {/* TITLE */}
        <h1 className="text-6xl xl:text-7xl font-black leading-[1.05] mb-8">
          Master the
          <br />

          <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
            English
          </span>

          <br />
          Language.
        </h1>

        {/* DESCRIPTION */}
        <p className="text-slate-300 text-xl leading-relaxed max-w-xl mb-12">
          Continue your fluency journey with AI-powered speaking practice,
          real conversations, pronunciation feedback, and smart learning
          experiences.
        </p>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-5 max-w-xl">
          <div className="rounded-[1.8rem] bg-white/5 border border-white/10 backdrop-blur-2xl p-5">
            <p className="text-slate-400 text-sm mb-2">
              AI Speaking Sessions
            </p>

            <h3 className="text-3xl font-black text-cyan-300">
              50K+
            </h3>
          </div>

          <div className="rounded-[1.8rem] bg-white/5 border border-white/10 backdrop-blur-2xl p-5">
            <p className="text-slate-400 text-sm mb-2">
              Active Learners
            </p>

            <h3 className="text-3xl font-black text-violet-300">
              12K+
            </h3>
          </div>
        </div>

        {/* QUOTE */}
        <div className="mt-12 bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[2rem] p-7 shadow-2xl">
          <p className="italic text-lg text-slate-200 leading-relaxed">
            “The beautiful thing about learning is that no one can take it
            away from you.”
          </p>

          <p className="mt-5 font-bold text-cyan-300">
            — B.B. King
          </p>
        </div>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="flex items-center justify-center p-6 lg:p-12">
      <div
        className="w-full max-w-md rounded-[2.5rem] 
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
            🔐
          </div>

          <p className="uppercase tracking-[0.25em] text-cyan-300 text-xs font-bold mb-4">
            Welcome Back
          </p>

          <h2 className="text-5xl font-black mb-4">
            Sign In
          </h2>

          <p className="text-slate-400 leading-relaxed text-[15px]">
            Login to continue your AI-powered English fluency journey.
          </p>
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
        <form onSubmit={handleLogin} className="space-y-5">
          {/* EMAIL */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">
              Email Address
            </label>

            <input
              type="email"
              required
              value={email}
              placeholder="user@example.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl 
              bg-white/[0.04] border border-white/10 
              text-white placeholder:text-slate-500
              focus:outline-none focus:border-cyan-400
              focus:ring-4 focus:ring-cyan-400/10
              transition-all duration-300"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-slate-300">
                Password
              </label>

              <Link
                href="/auth/forgot-password"
                className="text-sm text-cyan-300 hover:text-cyan-200 transition-all"
              >
                Forgot Password?
              </Link>
            </div>

            <input
              type="password"
              required
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl 
              bg-white/[0.04] border border-white/10 
              text-white placeholder:text-slate-500
              focus:outline-none focus:border-cyan-400
              focus:ring-4 focus:ring-cyan-400/10
              transition-all duration-300"
            />
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl 
            bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600
            font-bold text-lg shadow-[0_20px_50px_rgba(59,130,246,0.35)]
            hover:scale-[1.02] hover:shadow-[0_20px_70px_rgba(59,130,246,0.55)]
            transition-all duration-300 disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-white/10"></div>

          <span className="text-slate-500 text-sm">
            OR
          </span>

          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* GOOGLE BUTTON */}
        <button
          onClick={loginWithGoogle}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl
          border border-white/10 bg-white/[0.04]
          hover:bg-white/[0.08]
          hover:border-cyan-400/30
          backdrop-blur-2xl transition-all duration-300"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />

          <span className="font-semibold text-slate-200">
            {googleLoading
              ? "Signing in..."
              : "Continue with Google"}
          </span>
        </button>

        {/* SIGNUP */}
        <p className="text-center mt-8 text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-cyan-300 font-bold hover:text-cyan-200 transition-all"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  </div>
</main>
  );
}