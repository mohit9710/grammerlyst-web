"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/services/auth";
import { useGoogleLogin } from "@/services/googleAuthService"

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

      // ✅ Store tokens
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      // ✅ Redirect after login
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side: Branding & Image */}
      <div className="hidden lg:flex bg-blue-600 flex-col justify-center p-20 text-white">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md">
          <i className="fas fa-unlock-alt text-3xl"></i>
        </div>
        <h1 className="text-5xl font-black leading-tight mb-6">
          Master the English <br /> Language with Us.
        </h1>
        <p className="text-blue-100 text-xl leading-relaxed max-w-md">
          Log back in to continue your progress in the Verb Workshop and unlock
          new grammar quizzes.
        </p>

        <div className="mt-12 p-6 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-sm">
          <p className="italic text-lg">
            "The beautiful thing about learning is that no one can take it away
            from you."
          </p>
          <p className="mt-4 font-bold">— B.B. King</p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex items-center justify-center p-8 bg-slate-50">
        <div className="max-w-md w-full">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 mb-2">Sign In</h2>
            <p className="text-slate-500 font-medium">
              Enter your details to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <p className="bg-red-100 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </p>
            )}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                placeholder="user@example.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-slate-700">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all shadow-sm"
              />
            </div>
            <a
                href="/auth/forgot-password"
                type="button"
                className="text-xs font-bold text-blue-600 hover:underline"
              >
              Forgot Password?
            </a>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-3 text-sm text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* ✅ GOOGLE BUTTON */}
          <button
            onClick={loginWithGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl 
                      border border-gray-300 bg-white 
                      hover:bg-gray-50 hover:shadow-md 
                      transition-all duration-200 
                      active:scale-[0.98]
                      disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />

            <span className="font-semibold text-gray-700">
              {googleLoading ? "Signing in..." : "Continue with Google"}
            </span>
          </button>

          <p className="text-center mt-8 text-slate-500 font-medium">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-blue-600 font-bold hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
