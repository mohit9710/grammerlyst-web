"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { completePurchase } from "@/services/purchaseService";
import {
  Check,
  ShieldCheck,
  Sparkles,
  Crown,
  Zap,
  X,
  CreditCard,
  BadgeCheck,
} from "lucide-react";

const PLAN_CONFIG = {
  free: {
    name: "Free",
    monthly: 0,
    yearly: 0,
    period: "Forever",
    icon: Zap,
    color: "from-slate-500 to-slate-700",
  },
  basic: {
    name: "Basic",
    monthly: 199,
    yearly: 1499,
    period: "Per Month",
    icon: Sparkles,
    color: "from-blue-500 to-cyan-500",
  },
  pro: {
    name: "Pro",
    monthly: 299,
    yearly: 2499,
    period: "Per Month",
    icon: Crown,
    color: "from-violet-500 to-fuchsia-500",
  },
};

export default function CheckoutClient({ planId }: any) {
  const router = useRouter();

  const [plan, setPlan] = useState(planId || "pro");
  const [billing, setBilling] = useState("monthly");

  const [loading, setLoading] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);

  const selectedPlan =
    PLAN_CONFIG[plan as keyof typeof PLAN_CONFIG];

  const price =
    billing === "yearly"
      ? selectedPlan?.yearly ?? 0
      : selectedPlan?.monthly ?? 0;

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/auth/login");
    }
  }, [router]);

  const handlePayment = () => {
    if (plan === "free") {
      router.push("/dashboard");
      return;
    }

    setQrImage("/QRCODE_AXIS.jpeg");
  };

  const handlePaymentSuccess = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("access_token");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      // await completePurchase(token, {
      //   amount: price,
      //   plan_name: selectedPlan.name,
      // });

      alert(
        "Payment submitted successfully. Verification may take a few minutes."
      );

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050816] text-white overflow-hidden relative">
        {/* BACKGROUND */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/20 blur-[140px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/20 blur-[140px] rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          
          {/* HERO */}
          <div className="max-w-3xl mb-14">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm text-blue-300 mb-6">
              <ShieldCheck className="w-4 h-4" />
              Secure UPI Checkout
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight mb-5">
              Complete Your
              <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Subscription
              </span>
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed">
              Unlock premium AI-powered English learning tools, unlimited games, roleplays, pronunciation analysis, and advanced fluency tracking.
            </p>
          </div>

          {/* MAIN */}
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            
            {/* LEFT */}
            <div className="lg:col-span-7">
              
              {/* BILLING TOGGLE */}
              <div className="inline-flex bg-white/5 border border-white/10 p-1 rounded-2xl mb-10">
                <button
                  onClick={() =>
                    setBilling("monthly")
                  }
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    billing === "monthly"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Monthly
                </button>

                <button
                  onClick={() =>
                    setBilling("yearly")
                  }
                  className={`px-6 py-3 rounded-xl font-semibold transition-all relative ${
                    billing === "yearly"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Yearly

                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-[10px] px-2 py-1 rounded-full font-bold">
                    SAVE 40%
                  </span>
                </button>
              </div>

              {/* PLAN CARDS */}
              <div className="space-y-5">
                {Object.entries(PLAN_CONFIG).map(
                  ([key, value]) => {
                    const active = plan === key;

                    const planPrice =
                      billing === "yearly"
                        ? value.yearly
                        : value.monthly;

                    const Icon = value.icon;

                    return (
                      <div
                        key={key}
                        onClick={() => setPlan(key)}
                        className={`group relative rounded-[2rem] border cursor-pointer transition-all duration-300 overflow-hidden ${
                          active
                            ? "border-blue-500 bg-blue-500/10 shadow-[0_0_40px_rgba(59,130,246,0.2)]"
                            : "border-white/10 bg-white/[0.03] hover:border-white/20"
                        }`}
                      >
                        {active && (
                          <div className="absolute top-5 right-5">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                              <Check className="w-4 h-4" />
                            </div>
                          </div>
                        )}

                        <div className="p-8">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                            
                            {/* LEFT */}
                            <div>
                              <div className="flex items-center gap-4 mb-4">
                                <div
                                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center shadow-xl`}
                                >
                                  <Icon className="w-6 h-6 text-white" />
                                </div>

                                <div>
                                  <h2 className="text-2xl font-black">
                                    {value.name}
                                  </h2>

                                  <p className="text-sm text-slate-400">
                                    {billing === "monthly"
                                      ? "Monthly Access"
                                      : "Yearly Access"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-3">
                                <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-sm text-slate-300">
                                  AI Learning
                                </div>

                                <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-sm text-slate-300">
                                  Unlimited Games
                                </div>

                                <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-sm text-slate-300">
                                  Roleplay Practice
                                </div>
                              </div>
                            </div>

                            {/* RIGHT */}
                            <div className="text-left md:text-right">
                              <div className="flex items-end gap-1 md:justify-end">
                                <span className="text-5xl font-black">
                                  ₹{planPrice}
                                </span>

                                {planPrice !== 0 && (
                                  <span className="text-slate-500 mb-2">
                                    /
                                    {billing === "monthly"
                                      ? "mo"
                                      : "yr"}
                                  </span>
                                )}
                              </div>

                              <p className="text-slate-400 text-sm mt-2">
                                {value.period}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden">
                
                {/* HEADER */}
                <div className="p-8 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-emerald-400" />
                    </div>

                    <div>
                      <h2 className="text-2xl font-black">
                        Order Summary
                      </h2>

                      <p className="text-slate-400 text-sm">
                        Secure QR Payment
                      </p>
                    </div>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-8 space-y-6">
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">
                      Plan
                    </span>

                    <span className="font-bold text-lg">
                      {selectedPlan.name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">
                      Billing
                    </span>

                    <span className="capitalize font-semibold">
                      {billing}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">
                      Access
                    </span>

                    <span className="font-semibold">
                      Instant Unlock
                    </span>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-slate-400 text-sm">
                          Total Amount
                        </p>

                        <h3 className="text-5xl font-black mt-1">
                          ₹{price}
                        </h3>
                      </div>

                      <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-2 rounded-xl text-sm font-semibold">
                        Secure
                      </div>
                    </div>
                  </div>

                  {/* FEATURES */}
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <BadgeCheck className="w-4 h-4 text-blue-400" />
                      <span className="text-slate-300">
                        Unlimited AI Features
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <BadgeCheck className="w-4 h-4 text-blue-400" />
                      <span className="text-slate-300">
                        Premium Learning Tools
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <BadgeCheck className="w-4 h-4 text-blue-400" />
                      <span className="text-slate-300">
                        Cancel Anytime
                      </span>
                    </div>
                  </div>

                  {/* PAY BUTTON */}
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all font-black text-lg shadow-[0_10px_40px_rgba(37,99,235,0.4)] active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading
                      ? "Processing..."
                      : plan === "free"
                      ? "Start Free"
                      : `Pay ₹${price}`}
                  </button>

                  <p className="text-center text-xs text-slate-500 leading-relaxed">
                    Your subscription activates after payment verification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Modal */}
{qrImage && (
  <div
    className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    onClick={() => setQrImage(null)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-300"
    >
      
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
        <button
          onClick={() => setQrImage(null)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
        >
          ✕
        </button>

        <h2 className="text-2xl font-black tracking-tight">
          Scan & Pay
        </h2>

        <p className="text-blue-100 text-sm mt-1">
          Complete your subscription securely
        </p>
      </div>

      {/* QR Section */}
      <div className="p-6 text-center">
        
        {/* QR Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 inline-block shadow-inner">
          <img
            src={qrImage}
            alt="UPI QR"
            className="w-56 h-56 object-contain mx-auto"
          />
        </div>

        {/* Amount */}
        <div className="mt-5">
          <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">
            Amount
          </p>

          <h3 className="text-4xl font-black text-slate-900 mt-1">
            ₹{price}
          </h3>
        </div>

        {/* Apps */}
        <div className="flex justify-center gap-3 mt-5 flex-wrap">
          {["GPay", "PhonePe", "Paytm"].map((app) => (
            <span
              key={app}
              className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold"
            >
              {app}
            </span>
          ))}
        </div>

        {/* Info */}
        <p className="text-xs text-slate-400 mt-5 leading-relaxed">
          After completing the payment, click the confirmation button below.
        </p>

        {/* CTA */}
        <button
          onClick={handlePaymentSuccess}
          className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-200"
        >
          I Have Paid ✅
        </button>
      </div>
    </div>
  </div>
)}
      </main>
    </>
  );
}