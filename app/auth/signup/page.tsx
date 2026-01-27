"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signupUser } from "@/services/auth";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side: Form */}
      <div className="flex items-center justify-center p-8 bg-slate-50 order-2 lg:order-1">
        <div className="max-w-md w-full">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 mb-2">
              Join the Workshop
            </h2>
            <p className="text-slate-500 font-medium">
              Start your 7-day free trial of EduPlatform.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Jane"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all"
                  onChange={(e) =>
                  setForm({ ...form, first_name: e.target.value })
                }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all"
                  onChange={(e) =>
                  setForm({ ...form, last_name: e.target.value })
                }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="jane@example.com"
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all"
                onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Create Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all"
                onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              />
            </div>

            <div className="flex items-start gap-3 px-1 py-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="terms"
                className="text-sm text-slate-500 leading-tight"
              >
                I agree to the{" "}
                <span className="text-blue-600 font-bold">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-blue-600 font-bold">Privacy Policy</span>.
              </label>
            </div>

            <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-500 font-medium">
            Already a member?{" "}
            <Link
              href="/auth/login"
              className="text-blue-600 font-bold hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side: Visual Content */}
      <div className="hidden lg:flex bg-slate-900 flex-col justify-center p-20 text-white order-1 lg:order-2">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8">
          <i className="fas fa-rocket text-3xl"></i>
        </div>
        <h1 className="text-5xl font-black leading-tight mb-6">
          Your journey to <br /> fluency starts here.
        </h1>

        <ul className="space-y-6">
          <li className="flex gap-4 items-center">
            <div className="w-10 h-10 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fas fa-check"></i>
            </div>
            <p className="text-slate-300 text-lg">
              Unlimited access to the <b>Verb Workshop</b>
            </p>
          </li>
          <li className="flex gap-4 items-center">
            <div className="w-10 h-10 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fas fa-check"></i>
            </div>
            <p className="text-slate-300 text-lg">
              Track your progress in <b>Grammar Quizzes</b>
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
