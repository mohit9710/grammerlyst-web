"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChangePasswordForm from "@/components/ChangePassword";

export default function ChangePasswordPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-white rounded-[2rem] shadow-xl border p-8">
          <h1 className="text-3xl font-black mb-2">
            Change Password
          </h1>

          <p className="text-slate-500 mb-8">
            Update your account password securely.
          </p>

          <ChangePasswordForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}