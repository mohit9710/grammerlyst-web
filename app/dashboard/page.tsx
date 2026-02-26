"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../../styles/index.css";
import Navbar from "@/components/Navbar";
import Link from "next/link"; 
import TipOfTheDay from "@/components/TipOfTheDay";
import RecentActivity from "@/components/ActivityFeed";
import { fetchUserProfile, syncStreak } from "@/services/userService";
import { initAnalytics } from "@/services/firebaseService";
import { logEvent } from "firebase/analytics";

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
  const [analyticsInstance, setAnalyticsInstance] = useState<any>(null);

  useEffect(() => {
    initAnalytics().then(setAnalyticsInstance);
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
  {/* Verb Workshop */}
  <ModuleLink 
    analytics={analyticsInstance}
    href="/verbs" 
    color="blue" 
    title="Verb Workshop" 
    desc="Master irregular verbs and visual vocabulary." 
    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 6 4 14-8-4-8 4 4-14"/><path d="M12 2v2"/><path d="M12 18v2"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m19.07 4.93-.7.7"/><path d="m5.63 18.37-.7.7"/><path d="m18.37 18.37.7.7"/><path d="m4.93 4.93.7.7"/></svg>} 
  />

  {/* Grammar Rules */}
  <ModuleLink 
    analytics={analyticsInstance}
    href="/grammar" 
    color="purple" 
    title="Grammar Rules" 
    desc="Comprehensive guide to tenses and syntax." 
    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>} 
  />

  {/* Sentence Polisher (New) */}
  <ModuleLink 
    analytics={analyticsInstance}
    href="/sentence-polisher" 
    color="rose" 
    title="Sentence Polisher" 
    desc="Instant AI grammar and style refinement." 
    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>} 
  />

  {/* Role-Based Chat (New) */}
  <ModuleLink 
    analytics={analyticsInstance}
    href="/role-play" 
    color="rose" 
    title="Roleplay Chat" 
    desc="Practice scenarios: Doctor, Interviewer, etc." 
    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} 
  />

  {/* Language Games */}
  <ModuleLink 
    analytics={analyticsInstance}
    href="/games" 
    color="blue" 
    title="Language Games" 
    desc="Daily challenges to boost your memory." 
    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="15.5" cy="13" r=".5"/><circle cx="18.5" cy="11" r=".5"/></svg>} 
  />

  {/* AI Chat Tutor */}
  {/* <ModuleLink 
    analytics={analyticsInstance}
    href="/chatbot-page" 
    color="orange" 
    title="AI Chat Tutor" 
    desc="Open conversation and instant help." 
    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>} 
  /> */}
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

function ModuleLink({ href, color, icon, title, desc, analytics }: any) {
  const colorMap: any = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    rose: "bg-rose-100 text-rose-600",
    orange: "bg-orange-100 text-orange-600",
  };

  const handleClick = async () => {
    if (analytics) {
      await logEvent(analytics, "module_click", {
        module_name: title,
        module_path: href,
      });
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col items-center text-center"
    >
      <div
        className={`w-16 h-16 ${colorMap[color]} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
      >
        {icon}
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