"use client";

import Link from "next/link";
import Image from "next/image";
import LogoImg from "../resources/logo.png";

export default function Footer() {
  return (
    <footer className="relative mt-5 overflow-hidden border-t border-white/10 bg-[#050816] text-white">
      
      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-violet-500/10 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        
        {/* TOP */}
        <div className="grid lg:grid-cols-5 gap-14 mb-20">

          {/* BRAND */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-30"></div>

                <Image
                  src={LogoImg}
                  alt="Grammrlyst"
                  className="relative h-14 w-auto object-contain"
                />
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  Grammrlyst
                </h2>

                <p className="text-cyan-400 text-sm font-medium">
                  AI English Fluency Platform
                </p>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-lg max-w-lg">
              Improve your spoken English with AI-powered speaking practice,
              pronunciation training, fluency challenges, and real-life
              conversations.
            </p>

            {/* SOCIALS */}
            <div className="flex items-center gap-4 mt-8">
              <SocialIcon
                href="https://www.youtube.com/@grammrlyst"
                icon="fab fa-youtube"
              />

              <SocialIcon
                href="https://www.instagram.com/grammrlyst/"
                icon="fab fa-instagram"
              />

              <SocialIcon
                href="#"
                icon="fab fa-facebook-f"
              />
            </div>
          </div>

          {/* PRODUCT */}
          <div>
            <h3 className="text-lg font-bold mb-6">
              Product
            </h3>

            <ul className="space-y-4 text-slate-400">
              <FooterLink href="/ai-audio-call" label="AI Audio Call" />
              <FooterLink href="/quick-response" label="Quick Response" />
              <FooterLink href="/grammar" label="Grammar Practice" />
              <FooterLink href="/role-play" label="Roleplay Chat" />
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="text-lg font-bold mb-6">
              Company
            </h3>

            <ul className="space-y-4 text-slate-400">
              <FooterLink href="/about" label="About Us" />
              <FooterLink href="/contact" label="Contact" />
              <FooterLink href="/partner" label="Become a Partner" />
              <FooterLink href="/help" label="Help Center" />
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h3 className="text-lg font-bold mb-6">
              Legal
            </h3>

            <ul className="space-y-4 text-slate-400">
              <FooterLink href="/privacy-policy" label="Privacy Policy" />
              <FooterLink href="/terms" label="Terms & Conditions" />
            </ul>
          </div>
        </div>

        {/* CTA SECTION */}
        <div className="rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-10 mb-16 shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            
            <div>
              <p className="text-cyan-400 uppercase tracking-widest text-sm font-bold mb-3">
                Start Speaking Today
              </p>

              <h2 className="text-4xl font-black mb-4">
                Build Real English Confidence
              </h2>

              <p className="text-slate-400 text-lg leading-relaxed">
                Practice with AI conversations, fluency drills,
                pronunciation feedback, and real speaking scenarios.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 lg:justify-end">
              <Link
                href="/auth/signup"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold shadow-2xl hover:scale-105 transition-all"
              >
                Get Started Free
              </Link>

              <Link
                href="/ai-audio-call"
                className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-semibold"
              >
                Try AI Speaking
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Grammrlyst. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/privacy-policy" className="hover:text-cyan-400 transition-all">
              Privacy
            </Link>

            <Link href="/terms" className="hover:text-cyan-400 transition-all">
              Terms
            </Link>

            <Link href="/contact" className="hover:text-cyan-400 transition-all">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: any) {
  return (
    <li>
      <Link
        href={href}
        className="hover:text-cyan-400 transition-all duration-300"
      >
        {label}
      </Link>
    </li>
  );
}

function SocialIcon({ href, icon }: any) {
  return (
    <Link
      href={href}
      target="_blank"
      className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-400/30 transition-all duration-300"
    >
      <i className={`${icon} text-lg`}></i>
    </Link>
  );
}