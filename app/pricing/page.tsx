"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/userProfile";
import {
  Check,
  Sparkles,
  Crown,
  Rocket,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function PricingPage() {
  const router = useRouter();
  const { user } = useUser();

  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "Forever",
      description:
        "Perfect for building your daily English habit and exploring the platform.",
      icon: Sparkles,
      featured: false,
      gradient: "from-slate-100 to-white",
      border: "border-slate-200",
      button:
        "bg-slate-900 text-white hover:bg-slate-800",
      buttonText: "Current Plan",
      disabled: true,
      features: [
        "Basic grammar lessons",
        "Limited sentence polishing",
        "All arcade games access",
        "1 AI roleplay demo",
        "Daily XP rewards",
      ],
    },
    {
      name: "Basic",
      price: "₹199",
      yearly: "₹1499/year",
      period: "per month",
      description:
        "Daily speaking practice with AI guidance and a distraction-free experience.",
      icon: Rocket,
      featured: false,
      gradient: "from-blue-50 to-indigo-50",
      border: "border-blue-200",
      button:
        "bg-blue-600 text-white hover:bg-blue-500",
      buttonText: "Choose Basic",
      features: [
        "Unlimited grammar access",
        "Unlimited arcade games",
        "15 min/day AI roleplay",
        "Limited sentence polishing",
        "No advertisements",
      ],
    },
    {
      name: "Pro",
      price: "₹299",
      yearly: "₹2499/year",
      period: "per month",
      description:
        "Complete fluency toolkit with unlimited AI conversations and advanced feedback.",
      icon: Crown,
      featured: true,
      gradient: "from-slate-900 via-slate-800 to-slate-950",
      border: "border-slate-800",
      button:
        "bg-white text-slate-900 hover:bg-slate-100",
      buttonText: "Go Pro",
      badge: "MOST POPULAR",
      features: [
        "Everything in Basic",
        "Unlimited AI roleplay",
        "Unlimited sentence polishing",
        "AI pronunciation feedback",
        "Advanced analytics & streak boosts",
      ],
    },
  ];

  const handleCheckout = (planName: string) => {
    if (planName === "Free") return;

    const planId =
      planName === "Basic"
        ? "basic"
        : planName === "Pro"
        ? "pro"
        : "free";

    router.push(`/checkout?planId=${planId}`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] overflow-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-500/10 blur-3xl rounded-full" />
          <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-indigo-500/10 blur-3xl rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-slate-700">
                Learn Faster With AI-Powered English Practice
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.05]">
              Pricing Built
              <br />
              For{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Real Fluency
              </span>
            </h1>

            <p className="mt-8 text-lg md:text-xl text-slate-500 leading-relaxed">
              Start free and upgrade whenever you're ready for unlimited AI
              speaking, grammar correction, pronunciation analysis, and
              immersive roleplay practice.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <main className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => {
            const Icon = plan.icon;

            return (
              <div
                key={index}
                className={`relative rounded-[2.5rem] border ${plan.border} overflow-hidden transition-all duration-500 hover:-translate-y-2 ${
                  plan.featured
                    ? "shadow-[0_30px_80px_rgba(15,23,42,0.25)]"
                    : "shadow-xl hover:shadow-2xl"
                }`}
              >
                {/* Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${plan.gradient}`}
                />

                {/* Glow */}
                {plan.featured && (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.35),transparent_55%)]" />
                )}

                {/* Badge */}
                {plan.badge && (
                  <div className="absolute top-6 right-6 bg-blue-500 text-white text-[11px] font-black tracking-widest px-4 py-2 rounded-full shadow-lg">
                    {plan.badge}
                  </div>
                )}

                <div className="relative p-10 flex flex-col h-full">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${
                      plan.featured
                        ? "bg-white/10 text-white"
                        : "bg-white text-slate-900 shadow-sm"
                    }`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>

                  {/* Name */}
                  <h2
                    className={`text-3xl font-black tracking-tight mb-3 ${
                      plan.featured ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {plan.name}
                  </h2>

                  {/* Description */}
                  <p
                    className={`leading-relaxed mb-8 ${
                      plan.featured
                        ? "text-slate-300"
                        : "text-slate-500"
                    }`}
                  >
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-end gap-2">
                      <span
                        className={`text-6xl font-black tracking-tight ${
                          plan.featured
                            ? "text-white"
                            : "text-slate-900"
                        }`}
                      >
                        {plan.price}
                      </span>

                      <span
                        className={`mb-2 text-sm ${
                          plan.featured
                            ? "text-slate-400"
                            : "text-slate-500"
                        }`}
                      >
                        / {plan.period}
                      </span>
                    </div>

                    {plan.yearly && (
                      <p className="mt-3 text-emerald-500 font-bold text-sm">
                        {plan.yearly} • Save 40%
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-4 flex-grow">
                    {plan.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3"
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                            plan.featured
                              ? "bg-blue-500/20 text-blue-300"
                              : "bg-emerald-100 text-emerald-600"
                          }`}
                        >
                          <Check className="w-3 h-3" />
                        </div>

                        <span
                          className={`text-sm leading-relaxed ${
                            plan.featured
                              ? "text-slate-200"
                              : "text-slate-600"
                          }`}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <button
                    disabled={plan.disabled}
                    onClick={() => handleCheckout(plan.name)}
                    className={`mt-10 w-full py-4 rounded-2xl font-bold transition-all duration-300 ${
                      plan.disabled
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : `${plan.button} hover:scale-[1.02] active:scale-[0.98]`
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* TRUST SECTION */}
        <div className="mt-24 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: ShieldCheck,
              title: "Secure Payments",
              text: "Your payments are encrypted and securely processed.",
            },
            {
              icon: Sparkles,
              title: "AI Powered",
              text: "Advanced AI helps improve speaking, grammar, and fluency.",
            },
            {
              icon: Crown,
              title: "Upgrade Anytime",
              text: "Switch plans whenever your learning needs evolve.",
            },
          ].map((item, i) => {
            const Icon = item.icon;

            return (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-slate-800" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {item.title}
                </h3>

                <p className="text-slate-500 leading-relaxed">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* BOTTOM CTA */}
        <div className="mt-24">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 px-8 py-16 md:p-16 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.3),transparent_60%)]" />

            <div className="relative max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
                Start Speaking English
                <br />
                With Confidence
              </h2>

              <p className="text-slate-400 text-lg leading-relaxed mb-10">
                Practice daily with AI tutors, roleplay conversations,
                pronunciation analysis, and real-time grammar corrections.
              </p>

              <button
                onClick={() => router.push("/checkout?planId=pro")}
                className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black hover:bg-slate-100 transition-all hover:scale-105 active:scale-95"
              >
                Unlock Pro
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}