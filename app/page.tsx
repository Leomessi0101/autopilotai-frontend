"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* STICKY HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            AutopilotAI
          </div>
          <div className="flex items-center gap-4">
            <a href="/login" className="px-4 py-2 text-gray-300 hover:text-white transition">
              Login
            </a>
            <a href="/register" className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold hover:scale-105 transition-all">
              Start Free
            </a>
          </div>
        </div>
      </header>

      {/* HERO - 3 SECOND VALUE PROP */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: "1s"}}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          {/* THE 3-SECOND PITCH */}
          <div className="inline-block mb-6 px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm font-medium">
            ⚡ AI Website Builder • No Code • 60 Seconds
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            Your Website,
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Built in 60 Seconds
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Describe your business. AI creates a professional website instantly. Edit anything with a click.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a href="/register" className="group relative px-10 py-5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl font-bold text-lg overflow-hidden hover:scale-105 transition-all shadow-2xl shadow-indigo-500/30">
              <span className="relative z-10">Create Your Website Free</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            </a>
            <button onClick={() => document.getElementById('demo')?.scrollIntoView({behavior: 'smooth'})} className="px-10 py-5 border-2 border-white/20 rounded-2xl font-semibold hover:bg-white/5 transition-all">
              Watch Demo →
            </button>
          </div>

          {/* SOCIAL PROOF */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 border-2 border-black"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-black"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-red-400 border-2 border-black"></div>
              </div>
              <span>500+ websites created</span>
            </div>
            <div>⭐ 4.9/5 rating</div>
            <div>🚀 No credit card required</div>
          </div>
        </div>
      </section>

      {/* DEMO VIDEO/VISUAL - SHOW DON'T TELL */}
      <section id="demo" className="py-32 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              See It in Action
            </h2>
            <p className="text-xl text-gray-400">
              From idea to live website in under 60 seconds
            </p>
          </div>

          {/* VISUAL DEMO */}
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 backdrop-blur-sm shadow-2xl">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Animated demo placeholder - replace with actual video/gif */}
              <div className="text-center p-12">
                <div className="inline-block mb-6 px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">AI Generating Website...</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-white/20 rounded-full w-64 mx-auto animate-pulse"></div>
                  <div className="h-4 bg-white/20 rounded-full w-48 mx-auto animate-pulse" style={{animationDelay: "0.2s"}}></div>
                  <div className="h-4 bg-white/20 rounded-full w-56 mx-auto animate-pulse" style={{animationDelay: "0.4s"}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* HOW IT WORKS - SIMPLE 3 STEPS */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Describe Your Business</h3>
              <p className="text-gray-400">Tell us what you do in one sentence</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">AI Builds Your Site</h3>
              <p className="text-gray-400">Watch it generate in real-time</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Click to Edit</h3>
              <p className="text-gray-400">Change anything with a click</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES - VISUAL, NOT WORDY */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-400">
              Professional websites without the headache
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02]">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold mb-3">AI-Powered Design</h3>
              <p className="text-gray-400 leading-relaxed">
                Every website is unique. No templates, no copy-paste. AI creates custom designs based on your business.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02]">
              <div className="text-4xl mb-4">✏️</div>
              <h3 className="text-2xl font-bold mb-3">Click-to-Edit</h3>
              <p className="text-gray-400 leading-relaxed">
                Click any text to edit. Drag images to upload. No coding, no complex editor. Just click and type.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02]">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-2xl font-bold mb-3">Mobile Perfect</h3>
              <p className="text-gray-400 leading-relaxed">
                Looks amazing on phones, tablets, and desktops. Automatically responsive. No extra work needed.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02]">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-3">Live in Minutes</h3>
              <p className="text-gray-400 leading-relaxed">
                Get your custom domain. Publish with one click. Share your link immediately. No hosting headaches.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING - SIMPLE & CLEAR */}
      <section className="py-32 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple Pricing
            </h2>
            <p className="text-xl text-gray-400">
              Start free. Upgrade when you're ready.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* FREE */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Free</div>
              <div className="text-5xl font-bold mb-2">$0</div>
              <p className="text-gray-400 mb-8">Test it out</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>1 AI website</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Click-to-edit</span>
                </li>
                <li className="flex items-center gap-3 opacity-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Custom domain</span>
                </li>
              </ul>
              <a href="/register" className="block w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold text-center transition">
                Start Free
              </a>
            </div>

            {/* STARTER - POPULAR */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-2 border-indigo-500 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-500 rounded-full text-sm font-bold">
                POPULAR
              </div>
              <div className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">Starter</div>
              <div className="text-5xl font-bold mb-2">$9<span className="text-2xl text-gray-400">/mo</span></div>
              <p className="text-gray-400 mb-8">For serious creators</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Everything in Free</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Custom domain</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Remove branding</span>
                </li>
              </ul>
              <a href="/register" className="block w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 rounded-xl font-semibold text-center transition-all">
                Get Started
              </a>
            </div>

            {/* PRO */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Pro</div>
              <div className="text-5xl font-bold mb-2">$29<span className="text-2xl text-gray-400">/mo</span></div>
              <p className="text-gray-400 mb-8">For agencies</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Everything in Starter</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Unlimited pages</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Priority support</span>
                </li>
              </ul>
              <a href="/register" className="block w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold text-center transition">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-3xl opacity-20"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Build Your Website?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Join 500+ creators who chose speed over complexity
          </p>
          <a href="/register" className="inline-block px-12 py-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-2xl shadow-indigo-500/30">
            Create Your Website Free →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              AutopilotAI
            </div>
            <div className="flex gap-8 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}