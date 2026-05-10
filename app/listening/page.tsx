"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ListeningPractice from "@/components/ListeningPractice";

import { fetchMyPlan } from "@/services/purchaseService";

export default function ListeningPage() {
  

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

      <ListeningPractice />

      <Footer />
    </div>
  );
}