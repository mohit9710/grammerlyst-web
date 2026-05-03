"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { completePurchase } from "@/services/purchaseService";

const PLAN_CONFIG: any = {
  free: {
    name: "Free",
    price: 0,
    period: "forever",
  },
  lifetime: {
    name: "Lifetime Pass",
    price: 99,
    period: "once",
  },
  pro: {
    name: "Basic Pro",
    price: 199,
    period: "per month",
  },
};

export default function CheckoutClient({ planId }: any) {
  const router = useRouter();

  const [plan, setPlan] = useState(planId || "pro");
  const [loading, setLoading] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);

  const selectedPlan = PLAN_CONFIG[plan];

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) router.replace("/auth/login");
  }, [router]);

  // ✅ Step 1: Show QR
  const handlePayment = () => {
    if (plan === "free") {
      router.push("/dashboard");
      return;
    }

    setQrImage("/QRCODE_AXIS.jpeg"); // 👉 public folder me rakho
  };

  // ✅ Step 2: Confirm payment
  const handlePaymentSuccess = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      // await completePurchase(token, {
      //   amount: selectedPlan.price,
      //   plan_name: selectedPlan.name,
      // });

      alert("Payment done. Wait for confirmation. Thanks!!");
      router.push("/dashboard");
      // router.push(`/pricing?is_paid=1&plan=${plan}`);

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

      <main className="max-w-7xl mx-auto grid lg:grid-cols-12 min-h-[calc(100vh-80px)]">

        {/* LEFT */}
        <div className="lg:col-span-7 p-10 bg-white border-r">
          <h1 className="text-2xl font-bold mb-6">Choose Your Plan</h1>

          <div className="space-y-5">
            {Object.entries(PLAN_CONFIG).map(([key, value]: any) => (
              <div
                key={key}
                onClick={() => setPlan(key)}
                className={`p-6 border rounded-xl cursor-pointer transition ${
                  plan === key
                    ? "border-blue-600 bg-blue-50"
                    : "hover:border-blue-400"
                }`}
              >
                <h2 className="font-bold text-lg">{value.name}</h2>
                <p className="text-slate-500 text-sm capitalize">
                  {value.period}
                </p>
                <p className="mt-2 text-xl font-bold">
                  ₹{value.price}
                  {value.price !== 0 && value.period === "per month" && " / month"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-5 bg-slate-50 p-10 flex flex-col justify-between">

          <div>
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="bg-white p-6 rounded-xl shadow space-y-4">
              <div className="flex justify-between">
                <span>Plan</span>
                <span className="font-bold">{selectedPlan.name}</span>
              </div>

              <div className="flex justify-between">
                <span>Price</span>
                <span className="font-bold">₹{selectedPlan.price}</span>
              </div>

              <div className="border-t pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{selectedPlan.price}</span>
              </div>
            </div>

            {/* ✅ QR Section (ONLY ONCE) */}
            {qrImage && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                
                <div className="relative bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md w-full mx-4">
                  
                  {/* ❌ Close Button */}
                  <button
                    onClick={() => setQrImage(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 text-xl"
                  >
                    ✕
                  </button>

                  <h2 className="text-2xl font-bold mb-4">
                    Scan & Pay
                  </h2>

                  {/* 🔥 BIG QR */}
                  <img
                    src={qrImage}
                    alt="UPI QR"
                    className="w-72 h-72 mx-auto cursor-pointer hover:scale-105 transition"
                    onClick={handlePaymentSuccess}
                  />

                  <p className="text-sm text-slate-500 mt-4">
                    Scan using GPay / PhonePe / Paytm
                  </p>

                  <p className="text-blue-600 font-semibold text-sm mt-2">
                    After payment, tap QR to confirm
                  </p>

                  <p className="text-red-600 font-semibold text-sm mt-2">
                    Add Email id to additional message while payment.
                  </p>


                  {/* Manual confirm button (better UX) */}
                  <button
                    onClick={handlePaymentSuccess}
                    className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700"
                  >
                    I Have Paid ✅
                  </button>

                </div>
              </div>
            )}
          </div>

          {/* BUTTON */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="mt-8 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : plan === "free"
              ? "Start Free"
              : qrImage
              ? "Waiting for Payment..."
              : plan === "lifetime"
              ? "Pay ₹99 Once"
              : "Subscribe Now"}
          </button>
        </div>
      </main>
    </>
  );
}