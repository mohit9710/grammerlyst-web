"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WritingTask from "@/components/WritingTask";

export default function WritingPage() {

  const router = useRouter();

  // =========================================
  // AUTH CHECK
  // =========================================

  useEffect(() => {
    const token =
      localStorage.getItem(
        "access_token"
      );

    if (!token) {
      router.replace("/auth/login");
      return;
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <WritingTask />

      <Footer />
    </div>
  );
}
