"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
        const res = await fetch(
            `${API_BASE_URL}/auth/forgot-password`,
            {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
            }
        );

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.detail || "Something went wrong");
        }

        setSuccess(
            "If the email exists, a password reset link has been sent."
        );
        setEmail("");
        } catch (err: any) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100 px-4">
        <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center overflow-hidden">
            {/* Decorative blur */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />

            {/* Icon */}
            <div className="relative mx-auto mb-6 w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-300">
            <i className="fas fa-key text-white text-3xl" />
            </div>

            <h1 className="relative text-3xl font-black text-slate-900 mb-3">
            Forgot your password?
            </h1>

            <p className="relative text-slate-600 font-medium mb-8">
            Enter your email address and we’ll send you a link to reset your
            password.
            </p>

            {/* Messages */}
            {error && (
            <div className="mb-4 bg-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold">
                {error}
            </div>
            )}

            {success && (
            <div className="mb-4 bg-green-100 text-green-700 px-4 py-3 rounded-xl text-sm font-semibold">
                {success}
            </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
            <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all"
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-60"
            >
                {loading ? "Sending reset link..." : "Send reset link"}
            </button>
            </form>

            <button
            onClick={() => router.push("/auth/login")}
            className="relative mt-6 text-sm font-bold text-blue-600 hover:underline"
            >
            Back to login
            </button>
        </div>
        </div>
    );
}
