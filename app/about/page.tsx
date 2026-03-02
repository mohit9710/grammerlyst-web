import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { BookOpen, Cpu, Globe, Award } from "lucide-react"; // Optional: install lucide-react

export const metadata: Metadata = {
  title: "About Us | Grammrlyst - Redefining English Mastery",
  description:
    "Discover how Grammrlyst leverages cutting-edge AI to bridge the gap between traditional grammar and real-world English communication.",
  keywords: ["About Grammrlyst", "English Learning AI", "Grammar Tools", "ESL Platform"],
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">Our Story</span>
          <h1 className="text-5xl font-extrabold text-slate-900 mt-4 mb-6 tracking-tight">
            Empowering Voices Through <span className="text-blue-600">Smarter Learning.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Grammrlyst was founded on a simple belief: Mastering English shouldn't be a chore. 
            We combine linguistic expertise with advanced AI to create a personalized classroom for the digital age.
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-16">
        
        {/* Mission & Vision Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed">
              To democratize high-quality English education by providing intuitive, AI-driven tools 
              that adapt to every learner's unique pace, background, and goals.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h2>
            <p className="text-slate-600 leading-relaxed">
              To become the world's most trusted companion for non-native speakers, 
              fostering a world where language is a bridge, not a barrier.
            </p>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">The Grammrlyst Difference</h2>
          <p className="text-slate-500 mt-2">Why thousands of learners choose us daily</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            { title: "AI Precision", desc: "Instant, context-aware corrections.", icon: <Cpu className="w-6 h-6 text-blue-500" /> },
            { title: "Global Community", desc: "Built for learners from all cultures.", icon: <Globe className="w-6 h-6 text-blue-500" /> },
            { title: "Scientific Method", desc: "Curriculum based on linguistic research.", icon: <BookOpen className="w-6 h-6 text-blue-500" /> },
            { title: "Proven Results", desc: "Measurable growth with XP tracking.", icon: <Award className="w-6 h-6 text-blue-500" /> },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6">
              <div className="mb-4 p-3 bg-blue-50 rounded-full">{item.icon}</div>
              <h3 className="font-bold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-500 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>

        <hr className="border-slate-200 mb-20" />

        {/* Content for Ad Networks (SEO/Authority Content) */}
        <article className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Redefining English Education</h2>
          <div className="space-y-6 text-slate-600 leading-relaxed">
            <p>
              In an increasingly connected world, English proficiency is more than just a skill—it's an opportunity. 
              However, traditional methods often fail to address the nuances of modern communication. 
              <strong> Grammrlyst</strong> fills this gap by integrating <strong>Natural Language Processing (NLP)</strong> 
              with interactive pedagogy.
            </p>
            <p>
              Whether you are a student preparing for exams like IELTS/TOEFL, a professional aiming for career growth, 
              or a hobbyist, our platform provides a structured path toward fluency. From real-time roleplay 
              simulations to granular grammar analysis, we ensure every minute spent on Grammrlyst translates 
              to real-world confidence.
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}