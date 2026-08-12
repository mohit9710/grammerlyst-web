import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardPersonalized from "@/components/DashboardPersonalized";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "AI English Fluency Dashboard | Speak English Confidently",
};

export default function Dashboard() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050816] text-white overflow-hidden">
        <DashboardPersonalized />

        {/* MAIN CONTENT */}
        <section className="px-6 py-16">
          <div className="max-w-7xl mx-auto space-y-20">
            {/* SPEAKING */}
            <CategorySection title="🎤 Speaking Practice">
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
                href="/tongue-twisters"
                title="Tongue Twisters"
                desc="Sharpen articulation with beginner to advanced speaking drills."
                gradient="from-cyan-500 to-violet-600"
              />
            </CategorySection>

            {/* FLUENCY */}
            <CategorySection title="⚡ Fluency & Recall">
              <ModuleCard
                href="/listening"
                title="Listening Lab"
                desc="Sharp your listening skills."
                gradient="from-yellow-500 to-orange-500"
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
                href="/writing"
                title="Writing Task"
                desc="Practice writing with AI-powered prompts and feedback."
                gradient="from-emerald-500 to-teal-600"
              />

              <ModuleCard
                href="/writing-strategies"
                title="IELTS Writing Strategy"
                desc="Learn structures, templates, and examiner tips for Task 1 & 2."
                gradient="from-amber-500 to-pink-600"
              />

              <ModuleCard
                href="/sentence-polisher"
                title="Sentence Polisher"
                desc="Improve writing with AI corrections."
                gradient="from-rose-500 to-pink-600"
              />

              <ModuleCard
                href="/verbs"
                title="Verbs Lab"
                desc="Your secret vocabulary builder."
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
            </CategorySection>

            <AdUnit slot="XXXXXXXXXX" className="max-w-4xl mx-auto" />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

/* COMPONENTS */

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
