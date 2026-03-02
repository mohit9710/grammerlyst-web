import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { ShieldCheck, Lock, Eye, Mail } from "lucide-react"; // npm install lucide-react

export const metadata: Metadata = {
  title: "Privacy Policy | Grammrlyst - Your Data Security",
  description:
    "At Grammrlyst, we value your privacy. Learn how we handle your personal data, our use of cookies, and how we ensure a safe learning environment.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "March 2, 2026";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header Section */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-xl mb-4">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-500">Last updated: {lastUpdated}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
          
          <section className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Welcome to <strong>Grammrlyst</strong>. Your privacy is critically important to us. This policy outlines 
              the types of personal information we receive and collect when you use our services, 
              as well as some of the steps we take to safeguard information.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mt-10">
              <Lock className="w-5 h-5 text-blue-600" /> 1. Information We Collect
            </h2>
            <p className="text-slate-600">
              We collect information to provide better services to all our users. This includes:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li><strong>Personal Identifiers:</strong> Name, email address, and account preferences when you register.</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent on lessons, and progress tracking (XP, streaks).</li>
              <li><strong>Log Files:</strong> Like many other websites, we use log files (IP addresses, browser type, ISP).</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mt-10">
              <Eye className="w-5 h-5 text-blue-600" /> 2. Advertising & Cookies
            </h2>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
              <p className="text-slate-700 text-sm leading-relaxed">
                <strong>Third-Party Advertising:</strong> We use third-party advertising companies (like Google AdSense) 
                to serve ads. These companies may use cookies to serve ads based on a user's prior visits to 
                this website or other websites.
              </p>
            </div>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li><strong>Google & DART Cookies:</strong> Google’s use of advertising cookies enables it and its partners to serve ads to our users based on their visit to Grammrlyst and/or other sites on the Internet.</li>
              <li><strong>Opt-out:</strong> You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-blue-600 underline">Ads Settings</a>.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-10">3. How We Use Data</h2>
            <p className="text-slate-600">
              The data we collect is used to personalize your AI learning experience, analyze site performance, 
              and communicate important updates regarding your account or our services. <strong>We do not sell 
              your personal data to third parties.</strong>
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10">4. GDPR & CCPA Rights</h2>
            <p className="text-slate-600">
              Depending on your location, you have the right to access, delete, or restrict the use of your 
              personal data. If you wish to exercise these rights, please reach out to our data protection team.
            </p>

            <hr className="my-12 border-slate-100" />

            <div className="flex flex-col items-center text-center py-6">
              <Mail className="w-6 h-6 text-slate-400 mb-3" />
              <h3 className="text-xl font-bold text-slate-900">Contact Our Privacy Team</h3>
              <p className="text-slate-600 mt-2">
                Have questions or concerns about your data? <br />
                Reach us at: <a href="mailto:grammrlyst@gmail.com" className="text-blue-600 font-medium">grammrlyst@gmail.com</a>
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}