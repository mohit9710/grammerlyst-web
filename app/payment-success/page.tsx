
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { Suspense } from "react";
import PaymentSuccessClient from "./PaymentSuccessClient";

export const metadata: Metadata = {
  title: "Payment Successful | Grammrlyst",
  description: "Your Grammrlyst payment confirmation.",
};

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-20">
        <Suspense fallback={<p className="text-center">Loading payment details...</p>}>
          <PaymentSuccessClient />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
