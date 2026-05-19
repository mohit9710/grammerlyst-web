"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Referral from "@/components/Referral";
import ReportAnalysis from "@/components/ReportAnalysis";

import {
  fetchUserProfile,
  updateUserProfile,
} from "@/services/userService";

import { fetchReferralDashboard } from "@/services/referralService";

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) return router.replace("/auth/login");

    Promise.all([
      fetchUserProfile(token),
      fetchReferralDashboard(token),
    ])
      .then(([userRes]) => {
        setUser(userRes);
        setLoading(false);
      })
      .catch(() => router.push("/auth/login"));
  }, [router]);

  // IMAGE PREVIEW
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();

      reader.onloadend = () => {
        setUser((prev: any) => ({
          ...prev,
          profile_image: reader.result as string,
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  // SAVE PROFILE
  const handleSave = async () => {
    const token = localStorage.getItem("access_token") || "";

    try {
      const updatedUser = await updateUserProfile(token, {
        firstName: user.first_name,
        lastName: user.last_name,
        imageFile: selectedFile,
      });

      setUser((prev: any) => ({
        ...prev,
        ...updatedUser,
      }));

      setSelectedFile(null);
      setIsEditing(false);
    } catch {
      alert("Failed to update profile");
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white text-2xl font-bold">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] overflow-hidden">
      <Navbar />

      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-150px] left-[-100px] w-[400px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full"></div>

        <div className="absolute bottom-[-200px] right-[-100px] w-[450px] h-[450px] bg-cyan-500/10 blur-[150px] rounded-full"></div>

        <div className="absolute top-[30%] right-[10%] w-[250px] h-[250px] bg-purple-500/10 blur-[100px] rounded-full"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 py-10">

        {/* HERO PROFILE */}
        <section className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl shadow-black/40 p-8 md:p-12">
          
          {/* TOP */}
          <div className="flex flex-col xl:flex-row gap-10 xl:items-center justify-between">

            {/* LEFT */}
            <div className="flex flex-col md:flex-row items-center gap-8">

              {/* AVATAR */}
              <div
                className="relative group cursor-pointer"
                onClick={() =>
                  isEditing && fileInputRef.current?.click()
                }
              >
                {/* glow */}
                <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-30 rounded-full"></div>

                <div className="relative w-36 h-36 rounded-[2rem] overflow-hidden border border-white/10 bg-gradient-to-br from-blue-500 to-cyan-400 shadow-2xl">
                  {user.profile_image ? (
                    <img
                      src={user.profile_image}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-6xl font-black">
                      {user.first_name?.charAt(0)}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 rounded-[2rem] flex items-center justify-center text-white text-2xl">
                    <i className="fas fa-camera"></i>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* USER INFO */}
              <div className="text-center md:text-left">
                
                {/* NAME */}
                {isEditing ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      value={user.first_name}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          first_name: e.target.value,
                        })
                      }
                      className="bg-white/10 border border-white/10 rounded-2xl px-5 py-3 text-white outline-none"
                    />

                    <input
                      value={user.last_name}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          last_name: e.target.value,
                        })
                      }
                      className="bg-white/10 border border-white/10 rounded-2xl px-5 py-3 text-white outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                      {user.first_name} {user.last_name}
                    </h1>

                    <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
                      
                      <div className="px-4 py-2 rounded-2xl bg-blue-500/15 border border-blue-500/20 text-blue-300 text-sm font-semibold">
                        ✨ Premium Learner
                      </div>

                      <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-sm">
                        📧 {user.email}
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-slate-400 mt-5 max-w-xl leading-relaxed">
                  Continue building your English fluency with AI-powered speaking practice, pronunciation feedback, vocabulary training, and immersive conversations.
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-4">

              <button
                onClick={() =>
                  isEditing ? handleSave() : setIsEditing(true)
                }
                className="group relative overflow-hidden px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-2xl shadow-blue-500/20 hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10">
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </span>

                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition"></div>
              </button>

              <button
                onClick={() => router.push("/auth/change-password")}
                className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all duration-300"
              >
                Change Password
              </button>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">

            <GlassStat
              title="Current Streak"
              value={`🔥 ${user.streak || 0}`}
              sub="Keep learning daily"
            />

            <GlassStat
              title="Total XP"
              value={user.total_xp || 0}
              sub="Experience earned"
            />

            <GlassStat
              title="Points"
              value={user.points || 0}
              sub="Learning score"
            />

            <GlassStat
              title="Bonus"
              value={user.bonus || 0}
              sub="Extra rewards"
            />
          </div>
        </section>

        {/* REFERRAL */}
        <div className="mt-10">
          <Referral />
        </div>

        {/* REPORT */}
        <div className="mt-10">
          <ReportAnalysis user={user} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* =========================
   GLASS STAT CARD
========================= */

function GlassStat({
  title,
  value,
  sub,
}: {
  title: string;
  value: any;
  sub: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl hover:-translate-y-1 transition-all duration-300">
      
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-3xl rounded-full"></div>

      <div className="relative">
        <p className="text-sm uppercase tracking-widest text-slate-500 font-semibold">
          {title}
        </p>

        <h2 className="text-4xl font-black text-white mt-3">
          {value}
        </h2>

        <p className="text-slate-400 text-sm mt-2">
          {sub}
        </p>
      </div>
    </div>
  );
}