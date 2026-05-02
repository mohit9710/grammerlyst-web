"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter, useSearchParams } from "next/navigation";
import { completePurchaseFlow } from "@/services/purchaseService";

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

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const planId = searchParams.get("planId") || "pro";

  const [plan, setPlan] = useState(planId);
  const [loading, setLoading] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);

  const selectedPlan = PLAN_CONFIG[plan];

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (!token) {
      router.replace("/auth/login");
    }
  }, [router]);

  const handlePayment = async () => {
    // ✅ Free plan skip payment
    if (plan === "free") {
      router.push("/dashboard");
      return;
    }

    setLoading(true);

    try {
      await completePurchaseFlow(
        {
          amount: selectedPlan.price,
          plan_name: selectedPlan.name,
        },
        (qr) => {
          setQrImage(qr); // ✅ show QR
        },
        (data) => {
          alert("Payment Success 🎉");
          router.push("/dashboard");
        }
      );
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto grid lg:grid-cols-12 h-[calc(100vh-80px)]">
        
        {/* LEFT: Plan Selection */}
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

        {/* RIGHT: Summary */}
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

            {/* ✅ QR Section */}
            {qrImage && (
              <div className="mt-6 bg-white p-6 rounded-xl shadow text-center">
                <h3 className="font-bold mb-4">Scan & Pay</h3>
                <img
                  src={qrImage}
                  alt="UPI QR"
                  className="mx-auto w-48 h-48"
                />
                <p className="text-sm mt-3 text-slate-500">
                  Scan with GPay / PhonePe / Paytm
                </p>
              </div>
            )}
          </div>

          {/* Checkout Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="mt-8 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            {loading
              ? "Processing..."
              : plan === "free"
              ? "Start Free"
              : plan === "lifetime"
              ? "Pay ₹99 Once"
              : "Subscribe Now"}
          </button>
        </div>
      </main>
    </>
  );
}