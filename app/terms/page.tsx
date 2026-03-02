import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { FileText, Scale, AlertCircle, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | Grammrlyst",
  description:
    "Review the terms and conditions for using the Grammrlyst platform, including our rules for AI-powered English learning tools.",
};

export default function TermsPage() {
  const lastUpdated = "March 2, 2026";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-xl mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Terms & Conditions</h1>
          <p className="text-slate-500 italic">Effective Date: {lastUpdated}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
          
          <article className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              By accessing or using <strong>Grammrlyst</strong>, you agree to be bound by these Terms and Conditions. 
              Please read them carefully before using our platform. If you do not agree with any part of these terms, 
              you may not use our services.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mt-10">
              <Scale className="w-5 h-5 text-blue-600" /> 1. Use of Service
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Grammrlyst provides AI-powered English learning tools. You agree to use this platform only for 
              lawful purposes and in a way that does not infringe the rights of others.
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-4">
              <li>You must provide accurate information when creating an account.</li>
              <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
              <li>Unauthorized use of our AI systems or scraping of content is strictly prohibited.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-10">2. Intellectual Property</h2>
            <p className="text-slate-600 leading-relaxed">
              All content on Grammrlyst—including text, logos, lesson materials, and the underlying 
              AI algorithms—is the property of Grammrlyst and is protected by international copyright laws. 
              Users may not reproduce or distribute our content without explicit written permission.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mt-10">
              <AlertCircle className="w-5 h-5 text-orange-500" /> 3. Disclaimer of Accuracy
            </h2>
            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 my-6">
              <p className="text-slate-700 text-sm leading-relaxed">
                <strong>AI Limitation:</strong> Grammrlyst utilizes advanced Artificial Intelligence for grammar 
                correction and conversation. While we strive for 100% accuracy, we do not guarantee that the 
                results will always be error-free. Our tools should be used as a supplementary educational resource.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10">4. Third-Party Advertising</h2>
            <p className="text-slate-600 leading-relaxed">
              Our website displays advertisements provided by third-party networks (e.g., Google AdSense). 
              We are not responsible for the content of these ads or the business practices of the advertisers. 
              Interaction with any third-party content is at your own risk.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10">5. Limitation of Liability</h2>
            <p className="text-slate-600 leading-relaxed">
              Grammrlyst shall not be liable for any direct, indirect, or incidental damages resulting 
              from your use of the service or the inability to use the platform.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10">6. Changes to Terms</h2>
            <p className="text-slate-600 leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of significant changes 
              by updating the "Last Updated" date at the top of this page.
            </p>

            <hr className="my-12 border-slate-100" />

            <div className="bg-slate-50 rounded-xl p-8 border border-slate-100 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900">Questions about our Terms?</h3>
              <p className="text-slate-600 mt-2 mb-4">
                Our legal team is happy to clarify any points mentioned above.
              </p>
              <a 
                href="mailto:support@grammrlyst.com" 
                className="text-blue-600 font-bold hover:underline"
              >
                support@grammrlyst.com
              </a>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}