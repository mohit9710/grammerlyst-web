"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../../styles/index.css";
import Navbar from "@/components/Navbar";
import Link from "next/link"; 
import TipOfTheDay from "@/components/TipOfTheDay";
import RecentActivity from "@/components/ActivityFeed";
import { fetchUserProfile, syncStreak } from "@/services/userService";

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_image: string;
  streak: number;
  points: number;
  total_xp: number;
  bonus: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchUserProfile(token)
        .then((data: UserProfile) => {
          setUser(data);
          setIsAuth(true);
        })
        .catch(() => {
          localStorage.removeItem("access_token");
        });

      syncStreak(token)
        .then((res) => {
          setUser(prev => prev ? { ...prev, streak: res.streak } : null);
        })
        .catch(err => console.error("Streak Error:", err));
    }
  }, [router]);

  // Logic for Level Progress Bar
  const currentXP = user?.total_xp || 0;
  const level = Math.floor(currentXP / 1000) + 1;
  const progressToNextLevel = (currentXP % 1000) / 10; // Percentage for 1000xp levels

  return (
    <>
      <Navbar />
      <header className="bg-white py-16 px-6 border-b">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">
            {isAuth ? `Welcome back, ${user?.first_name}!` : "Ready to Master English?"}
          </h1>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed italic">
            "Every correct syntax is a step toward mastery."
          </p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-16">
        {isAuth && <TipOfTheDay />}

        {/* Learning Modules Grid - Always Visible */}
        <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
          <i className="fas fa-th-large text-blue-500"></i> Learning Modules
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <ModuleLink href="/verbs" color="blue" icon="fa-font" title="Verb Workshop" desc="Master visual vocabulary." />
          <ModuleLink href="/grammar" color="purple" icon="fa-project-diagram" title="Grammar Rules" desc="Deep dive into tenses." />
          <ModuleLink href="/games" color="rose" icon="fa-gamepad" title="Language Games" desc="Fun arcade challenges." />
          <ModuleLink href="/chatbot" color="orange" icon="fa-robot" title="AI Chat Tutor" desc="Instant corrections." />
        </div>

        {/* Stats & Logs Section */}
        <div className="grid lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 relative">
            {/* The Main Stats Card */}
            <div className={`bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl h-full transition-all duration-500 ${!isAuth ? 'blur-sm opacity-50 grayscale select-none' : ''}`}>
              <h3 className="text-3xl font-bold mb-8">Performance Overview</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                 {/* Level Section */}
                 <div className="bg-white/10 p-6 rounded-3xl border border-white/10">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className="text-slate-400 text-xs uppercase font-bold mb-1">Current Level</p>
                        <p className="text-4xl font-black text-amber-400">{isAuth ? level : '1'}</p>
                      </div>
                      <p className="text-slate-400 text-xs font-bold">{isAuth ? `${currentXP % 1000}/1000 XP` : '0/1000 XP'}</p>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-1000"
                        style={{ width: isAuth ? `${progressToNextLevel}%` : '10%' }}
                      ></div>
                    </div>
                 </div>

                 {/* Streak Section */}
                 <div className="bg-white/10 p-6 rounded-3xl border border-white/10 flex flex-col justify-center">
                    <p className="text-slate-400 text-xs uppercase font-bold mb-2">Daily Streak</p>
                    <p className="text-4xl font-black text-rose-400">🔥 {isAuth ? user?.streak : '0'}</p>
                    <p className="text-slate-500 text-xs mt-2">Keep the flame alive!</p>
                 </div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-10">
                <StatCard value={isAuth ? user?.total_xp : '---'} label="Total XP" color="text-blue-400" />
                <StatCard value={isAuth ? user?.bonus : '---'} label="Bonus" color="text-emerald-400" />
                <StatCard value={isAuth ? user?.points : '---'} label="Points" color="text-purple-400" />
              </div>
            </div>

            {/* Overlay for Not Logged In User */}
            {!isAuth && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center bg-slate-900/40 rounded-[3rem] backdrop-blur-[2px]">
                <div className="bg-white text-slate-900 p-8 rounded-[2rem] shadow-2xl max-w-sm">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    <i className="fas fa-lock"></i>
                  </div>
                  <h4 className="text-xl font-bold mb-2">Track Your Progress</h4>
                  <p className="text-slate-500 text-sm mb-6">Sign in to save your streaks, earn XP, and level up your English skills.</p>
                  <Link href="/auth/login" className="block w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all">
                    Get Started
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Activity Logs - Only visible if Auth */}
          <div className="lg:col-span-1">
            {isAuth ? (
              <RecentActivity />
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-10 h-full flex flex-col items-center justify-center text-center">
                <i className="fas fa-chart-line text-slate-300 text-4xl mb-4"></i>
                <p className="text-slate-400 font-medium">Activity feed will appear here once you log in.</p>
              </div>
            )}
          </div>

        </div>
      </main>
      
      <footer className="py-12 text-center text-slate-400 text-sm">
        &copy; 2026 Grammrlyst Learning Inc.
      </footer>
    </>
  );
}

function ModuleLink({ href, color, icon, title, desc }: any) {
  const colorMap: any = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    rose: "bg-rose-100 text-rose-600",
    orange: "bg-orange-100 text-orange-600"
  };
  return (
    <Link href={href} className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col items-center text-center">
      <div className={`w-16 h-16 ${colorMap[color]} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm mb-6">{desc}</p>
      <span className="font-bold text-sm">Explore →</span>
    </Link>
  );
}

function StatCard({ value, label, color }: any) {
  return (
    <div className="text-center">
      <div className={`text-4xl font-black ${color}`}>{value}</div>
      <div className="text-slate-500 text-sm uppercase font-bold tracking-widest">{label}</div>
    </div>
  );
}