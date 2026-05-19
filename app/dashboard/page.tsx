"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TipOfTheDay from "@/components/TipOfTheDay";
import RecentActivity from "@/components/ActivityFeed";
import { syncStreak } from "@/services/userService";
import { initAnalytics } from "@/services/firebaseService";
import { logEvent } from "firebase/analytics";
import useUser from "@/hooks/userProfile";
import { missionService, DailyMission } from "@/services/tips"

export default function Dashboard() {
  const [analyticsInstance, setAnalyticsInstance] = useState<any>(null);
  const { user, isAuth, setUser } = useUser();
  const [missionsLoading, setMissionLoading ] = useState(false);
  const [missions, setMissions] = useState<
    DailyMission[]
  >([]);

  const fetchMissions = async () => {
    try {
      const data =
        await missionService.getDailyMissions();

      setMissions(data);
      setMissionLoading(false);
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    initAnalytics().then(setAnalyticsInstance);

    const token = localStorage.getItem("access_token");

    if (token) {
      syncStreak(token)
        .then((res) => {
          setUser((prev: any) =>
            prev ? { ...prev, streak: res.streak } : prev
          );
        })
        .catch((err) => console.error(err));

        setMissionLoading(true);
        fetchMissions();

    }

    document.title =
      "AI English Fluency Dashboard | Speak English Confidently";
  }, []);

  const currentXP = user?.total_xp || 0;
  const level = Math.floor(currentXP / 1000) + 1;
  const progress = (currentXP % 1000) / 10;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050816] text-white overflow-hidden">
        {/* HERO SECTION */}
        <section className="relative px-6 pt-10 pb-20">
          {/* Glow Effects */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full"></div>
          <div className="absolute top-20 right-0 w-[30rem] h-[30rem] bg-violet-500/20 blur-3xl rounded-full"></div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              {/* LEFT */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-xl mb-6">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-sm text-slate-300">
                    AI Powered Fluency Training
                  </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
                  {isAuth ? (
                    <>
                      Welcome back,
                      <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        {" "}
                        {user?.first_name}
                      </span>
                    </>
                  ) : (
                    <>
                      Speak English
                      <br />
                      <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                        Confidently
                      </span>
                    </>
                  )}
                </h1>

                <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mb-10">
                  Practice speaking with AI conversations, fluency challenges,
                  pronunciation training, and real-world English simulations.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/daily-speaking"
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-lg shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    🎤 Start Speaking
                  </Link>

                  <Link
                    href="/learning-path"
                    className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl font-semibold hover:bg-white/10 transition-all"
                  >
                    Continue Learning
                  </Link>
                </div>
              </div>

              {/* RIGHT */}
              <div className="relative">

                {isAuth ? (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <FloatingCard
                        title="Current Level"
                        value={`Lv. ${level}`}
                        color="from-cyan-500 to-blue-600"
                      />

                      <FloatingCard
                        title="Daily Streak"
                        value={`🔥 ${user?.streak || 0}`}
                        color="from-rose-500 to-orange-500"
                      />

                      <FloatingCard
                        title="Total XP"
                        value={`${user?.total_xp || 0}`}
                        color="from-violet-500 to-indigo-600"
                      />

                      <FloatingCard
                        title="Points"
                        value={`${user?.points || 0}`}
                        color="from-emerald-500 to-green-600"
                      />
                    </div>

                    {/* Progress Card */}
                    <div className="mt-6 rounded-[2rem] bg-white/5 backdrop-blur-2xl border border-white/10 p-6 shadow-2xl">
                      <div className="flex justify-between mb-4">
                        <div>
                          <p className="text-slate-400 text-sm">Level Progress</p>
                          <h3 className="text-2xl font-bold">
                            {currentXP % 1000}/1000 XP
                          </h3>
                        </div>

                        <div className="text-right">
                          <p className="text-emerald-400 font-bold">
                            {progress.toFixed(0)}%
                          </p>
                        </div>
                      </div>

                      <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full transition-all duration-1000"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-2xl p-10 shadow-2xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-3xl shadow-2xl">
                        🚀
                      </div>

                      <div>
                        <p className="text-cyan-400 font-bold uppercase tracking-widest text-sm">
                          Unlock AI Features
                        </p>

                        <h3 className="text-3xl font-black">
                          Start Your Fluency Journey
                        </h3>
                      </div>
                    </div>

                    <p className="text-slate-400 text-lg leading-relaxed mb-8">
                      Track your speaking progress, earn XP, maintain streaks,
                      and get personalized AI fluency insights.
                    </p>

                    <div className="space-y-4 mb-8">
                      <FeaturePoint text="🎤 AI Speaking Practice" />
                      <FeaturePoint text="⚡ Fluency Challenges" />
                      <FeaturePoint text="🔥 Daily Streak System" />
                      <FeaturePoint text="🧠 AI Weakness Detection" />
                    </div>

                    <Link
                      href="/auth/login"
                      className="block text-center py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-lg hover:scale-[1.02] transition-all"
                    >
                      Get Started Free
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* DAILY MISSION */}
        {isAuth && (
          <section className="px-6 -mt-8 relative z-20">
            <div className="max-w-7xl mx-auto">
              <div className="rounded-[2.5rem] bg-gradient-to-r from-cyan-500 to-blue-700 p-8 shadow-2xl">
                <div className="grid lg:grid-cols-2 gap-10 items-center">

                  {/* LEFT */}
                  <div>
                    <p className="uppercase tracking-widest text-cyan-100 text-sm font-bold mb-3">
                      Today's Speaking Mission
                    </p>

                    <h2 className="text-4xl font-black mb-4">
                      Train Your Fluency Daily
                    </h2>

                    <p className="text-cyan-100 text-lg">
                      Complete speaking exercises and improve your confidence with
                      AI-powered real conversation practice.
                    </p>
                  </div>

                  {/* RIGHT */}
                  <div className="grid gap-4">

                    {missionsLoading ? (
                      <>
                        {[1, 2, 3].map((item) => (
                          <div
                            key={item}
                            className="h-20 rounded-2xl bg-white/10 animate-pulse"
                          />
                        ))}
                      </>
                    ) : missions.length > 0 ? (
                      missions.map((mission: any) => (
                        <MissionItem
                          key={mission.id}
                          text={mission.title}
                          done={mission.completed}
                          progress={
                            mission.progress_count || 0
                          }
                          target={
                            mission.target_count || 1
                          }
                          xp={mission.xp_reward}
                        />
                      ))
                    ) : (
                      <div className="bg-white/10 border border-white/20 rounded-2xl p-5 text-white">
                        No daily missions available today.
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TIP */}
        {isAuth && (
          <section className="px-6 mt-10">
            <div className="max-w-7xl mx-auto">
              <TipOfTheDay />
            </div>
          </section>
        )}

        {/* MAIN CONTENT */}
        <section className="px-6 py-16">
          <div className="max-w-7xl mx-auto space-y-20">

            {/* SPEAKING */}
            <CategorySection title="🎤 Speaking Practice">
              <ModuleCard
                href="/ai-audio-call"
                title="AI Audio Call"
                desc="Practice natural voice conversations with AI."
                gradient="from-cyan-500 to-blue-600"
              />

              <ModuleCard
                href="/role-play"
                title="Roleplay Chat"
                desc="Practice real-world English scenarios."
                gradient="from-pink-500 to-rose-500"
              />

              <ModuleCard
                href="/accent-training"
                title="Accent Training"
                desc="Train you speaking accent and pronunciation."
                gradient="from-orange-500 to-amber-500"
              />

              <ModuleCard
                href="/shadow-listening"
                title="Shadow Listening"
                desc="Repeat native speech and improve fluency."
                gradient="from-violet-500 to-indigo-600"
              />
            </CategorySection>

            {/* FLUENCY */}
            <CategorySection title="⚡ Fluency & Recall">
              <ModuleCard
                href="/think-fast"
                title="Think Fast"
                desc="Speak instantly on random topics."
                gradient="from-yellow-500 to-orange-500"
              />

              <ModuleCard
                href="/word-rescue"
                title="Word Rescue"
                desc="Get smart vocabulary hints while speaking."
                gradient="from-emerald-500 to-green-600"
              />

              <ModuleCard
                href="/sentence-rebuild"
                title="Sentence Rebuild"
                desc="Build fast and correct English sentences."
                gradient="from-fuchsia-500 to-purple-600"
              />

              <ModuleCard
                href="/conversation-gap"
                title="Conversation Flow"
                desc="Practice natural follow-up conversations."
                gradient="from-indigo-500 to-blue-600"
              />
            </CategorySection>

            {/* GRAMMAR */}
            <CategorySection title="📚 Grammar & Writing">
              <ModuleCard
                href="/grammar"
                title="Grammar Rules"
                desc="Master English grammar and sentence structure."
                gradient="from-violet-500 to-indigo-600"
              />

              <ModuleCard
                href="/sentence-polisher"
                title="Sentence Polisher"
                desc="Improve writing with AI corrections."
                gradient="from-rose-500 to-pink-600"
              />

              <ModuleCard
                href="/screen-analyzer"
                title="Screen Analyzer"
                desc="Learn from movies and subtitles."
                gradient="from-emerald-500 to-teal-600"
              />
            </CategorySection>

            {/* FUN */}
            <CategorySection title="🎮 Fun & Community">
              <ModuleCard
                href="/games"
                title="Language Games"
                desc="Learn vocabulary through interactive games."
                gradient="from-blue-500 to-cyan-500"
              />

              <ModuleCard
                href="/group-video-call"
                title="Group Video Call"
                desc="Practice English with real people."
                gradient="from-indigo-500 to-violet-600"
              />

              <ModuleCard
                href="/scene-display"
                title="Scene Display"
                desc="Practice with real-life visual situations."
                gradient="from-pink-500 to-rose-600"
              />
            </CategorySection>

            {/* STATS + ACTIVITY */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* AI Recommendation */}
              {isAuth && (
              <div className="lg:col-span-2 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-2xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-cyan-400 uppercase text-sm font-bold tracking-widest">
                      AI Recommendation
                    </p>

                    <h3 className="text-3xl font-black mt-2">
                      Your Weak Areas
                    </h3>
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-3xl shadow-xl">
                    🧠
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <WeaknessCard
                    title="Hesitation While Speaking"
                    recommendation="Quick Response Challenge"
                  />

                  <WeaknessCard
                    title="Vocabulary Recall"
                    recommendation="Word Rescue Mode"
                  />
                </div>
              </div>
              )}
              {/* Activity */}
              <div>
                {isAuth ? (
                  <RecentActivity />
                ) : (
                  <div className="rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-2xl p-10 text-center h-full">
                    <div className="text-5xl mb-4">📈</div>
                    <h3 className="text-2xl font-bold mb-3">
                      Track Your Progress
                    </h3>

                    <p className="text-slate-400 mb-6">
                      Login to save streaks, XP, and fluency stats.
                    </p>

                    <Link
                      href="/auth/login"
                      className="inline-block px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold"
                    >
                      Login Now
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

/* COMPONENTS */

function FeaturePoint({ text }: any) {
  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
      <div className="w-2 h-2 rounded-full bg-cyan-400"></div>

      <p className="text-slate-300">{text}</p>
    </div>
  );
}


function FloatingCard({ title, value, color }: any) {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] bg-white/5 backdrop-blur-2xl border border-white/10 p-6 shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500">
      <div
        className={`absolute inset-0 opacity-20 bg-gradient-to-br ${color}`}
      ></div>

      <div className="relative z-10">
        <p className="text-slate-400 text-sm mb-2">{title}</p>

        <h3 className="text-4xl font-black">{value}</h3>
      </div>
    </div>
  );
}

function CategorySection({ title, children }: any) {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black">{title}</h2>

        <button className="text-cyan-400 font-semibold hover:text-cyan-300 transition-all">
          View All →
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {children}
      </div>
    </section>
  );
}

function ModuleCard({ href, title, desc, gradient }: any) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 hover:-translate-y-3 hover:border-cyan-400/40 transition-all duration-500 shadow-xl"
    >
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-all duration-500 bg-gradient-to-br ${gradient}`}
      ></div>

      <div
        className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${gradient} flex items-center justify-center text-3xl mb-6 shadow-2xl`}
      >
        ✨
      </div>

      <h3 className="text-2xl font-bold mb-3">{title}</h3>

      <p className="text-slate-400 leading-relaxed mb-6">{desc}</p>

      <div className="text-cyan-400 font-semibold group-hover:translate-x-2 transition-all">
        Explore →
      </div>
    </Link>
  );
}

function MissionItem({ text, done = false }: any) {
  return (
    <div className="flex items-center gap-4 bg-white/10 rounded-2xl px-5 py-4 backdrop-blur-xl border border-white/10">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center ${
          done ? "bg-emerald-400" : "bg-white/20"
        }`}
      >
        {done && "✓"}
      </div>

      <p className="font-medium">{text}</p>
    </div>
  );
}

function WeaknessCard({ title, recommendation }: any) {
  return (
    <div className="rounded-[2rem] bg-white/5 border border-white/10 p-6">
      <p className="text-slate-400 mb-2">Detected Weakness</p>

      <h4 className="text-2xl font-bold mb-4">{title}</h4>

      <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
        <p className="text-cyan-300 text-sm mb-1">Recommended Practice</p>

        <p className="font-bold">{recommendation}</p>
      </div>
    </div>
  );
}