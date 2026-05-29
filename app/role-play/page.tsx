"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Mic,
  PlayCircle,
  Volume2,
  Sparkles,
  ArrowRight,
  Brain,
} from "lucide-react";
import { chatbotService } from "@/services/chatbotService";
import { useRouter } from "next/navigation";

interface Role {
  id: number;
  instruction: string;
  voice_type: string;
  avatar: string;
  title: string;
  scenario: string;
}

export default function RoleplayPage() {
  const router = useRouter();

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  
  useEffect(() => {
    const token =
      localStorage.getItem("access_token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const data = await chatbotService.getRoles();
      setRoles(data.roles || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050816] text-white overflow-hidden">

        {/* HERO */}
        <section className="relative border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_40%)]" />

          <div className="relative max-w-7xl mx-auto px-6 py-24">

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                AI Real-Life Speaking
              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6">
                Speak English
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 text-transparent bg-clip-text">
                  In Real Situations
                </span>
              </h1>

              <p className="text-slate-400 text-xl leading-relaxed max-w-2xl">
                Practice realistic conversations with AI characters.
                Talk naturally, continue conversations, and improve
                speaking confidence through immersive roleplay scenarios.
              </p>

              <div className="flex flex-wrap gap-4 mt-10">

                <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
                  <div className="text-2xl font-black text-blue-400">
                    AI Voice
                  </div>
                  <div className="text-sm text-slate-400">
                    Real conversation simulation
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
                  <div className="text-2xl font-black text-cyan-400">
                    Live Speaking
                  </div>
                  <div className="text-sm text-slate-400">
                    Practice naturally
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
                  <div className="text-2xl font-black text-emerald-400">
                    Smart Feedback
                  </div>
                  <div className="text-sm text-slate-400">
                    Fluency analysis
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ROLE GRID */}
        <section className="max-w-7xl mx-auto px-6 py-20">

          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-black mb-2">
                Choose Your Scenario
              </h2>

              <p className="text-slate-400">
                Learn through realistic speaking situations
              </p>
            </div>

            <div className="hidden md:flex items-center gap-2 text-slate-500">
              <Brain className="w-5 h-5" />
              AI Powered Conversations
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-64 rounded-3xl bg-white/5 animate-pulse border border-white/10"
                />
              ))}
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">

              {roles.map((role) => (
                <div
                  key={role.id}
                  className="group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-blue-500/40 rounded-[32px] p-8 transition-all duration-300 hover:-translate-y-2"
                >
                  {/* glow */}
                  <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/5 transition-all" />

                  <div className="relative">

                    {/* top */}
                    <div className="flex items-start justify-between mb-8">

                      <div className="flex items-center gap-5">

                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-5xl shadow-2xl">
                          {role.avatar}
                        </div>

                        <div>
                          <h3 className="text-3xl font-black mb-2">
                            {role.title}
                          </h3>

                          <div className="flex items-center gap-2 text-sm text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full w-fit">
                            <Volume2 className="w-4 h-4" />
                            {role.voice_type} voice
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* scenario */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
                      <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">
                        Scenario
                      </div>

                      <p className="text-lg text-slate-200 leading-relaxed">
                        {role.scenario}
                      </p>
                    </div>

                    {/* instruction */}
                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-5 mb-8">
                      <div className="text-xs uppercase tracking-widest text-blue-300 mb-2">
                        Speaking Goal
                      </div>

                      <p className="text-slate-300 leading-relaxed">
                        {role.instruction}
                      </p>
                    </div>

                    {/* features */}
                    <div className="grid grid-cols-3 gap-3 mb-8">

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                        <Mic className="w-5 h-5 mx-auto mb-2 text-cyan-400" />
                        <div className="text-xs text-slate-400">
                          Voice Practice
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                        <PlayCircle className="w-5 h-5 mx-auto mb-2 text-emerald-400" />
                        <div className="text-xs text-slate-400">
                          AI Response
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                        <Brain className="w-5 h-5 mx-auto mb-2 text-purple-400" />
                        <div className="text-xs text-slate-400">
                          Smart Feedback
                        </div>
                      </div>

                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => {
                        const params = new URLSearchParams({
                          title: role.title,
                          scenario: role.scenario,
                          instruction: role.instruction,
                          avatar: role.avatar,
                          voiceType: role.voice_type,
                        });

                        router.push(`/role-play/chat?${params.toString()}`);
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white py-5 rounded-2xl font-black text-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(59,130,246,0.25)]"
                    >
                      Start Roleplay
                      <ArrowRight className="w-5 h-5" />
                    </button>

                  </div>
                </div>
              ))}

            </div>
          )}
        </section>

        {/* PREVIEW */}
        {selectedRole && (
          <section className="border-t border-white/10 bg-white/[0.02]">
            <div className="max-w-5xl mx-auto px-6 py-20">

              <div className="text-center mb-10">
                <div className="text-7xl mb-5">
                  {selectedRole.avatar}
                </div>

                <h2 className="text-5xl font-black mb-4">
                  {selectedRole.title}
                </h2>

                <p className="text-slate-400 text-lg">
                  AI conversation session ready
                </p>
              </div>

              <div className="bg-white/[0.04] border border-white/10 rounded-[32px] p-8">

                <div className="space-y-6">

                  <div className="flex justify-start">
                    <div className="bg-blue-600 text-white rounded-3xl rounded-bl-md px-6 py-4 max-w-xl">
                      Hello 👋 Welcome.
                      How may I help you today?
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-white/10 rounded-3xl rounded-br-md px-6 py-4 max-w-xl text-slate-300">
                      Tap the mic and start speaking...
                    </div>
                  </div>

                </div>

                <button className="mt-10 w-full bg-emerald-500 hover:bg-emerald-400 text-black py-5 rounded-2xl font-black text-lg transition-all">
                  🎤 Start Speaking Session
                </button>

              </div>
            </div>
          </section>
        )}

      </main>

      <Footer />
    </>
  );
}