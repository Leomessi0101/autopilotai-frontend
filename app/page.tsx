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

      {/* HERO - MAIN VALUE PROP */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: "1s"}}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          {/* THE 3-SECOND PITCH */}
          <div className="inline-block mb-6 px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm font-medium">
            🤖 AI-Powered Everything • Websites • Social • Emails • Ads
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            Your Entire Online Presence,
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Built by AI in Seconds
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Professional websites, social media posts, email campaigns, and ads. All created instantly with AI. All editable with a click.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a href="/register" className="group relative px-10 py-5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl font-bold text-lg overflow-hidden hover:scale-105 transition-all shadow-2xl shadow-indigo-500/30">
              <span className="relative z-10">Create Your Website Free</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            </a>
            <button onClick={() => document.getElementById('demo')?.scrollIntoView({behavior: 'smooth'})} className="px-10 py-5 border-2 border-white/20 rounded-2xl font-semibold hover:bg-white/5 transition-all">
              See What It Does →
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
              <span>500+ creators using AutopilotAI</span>
            </div>
            <div>⭐ 4.9/5 rating</div>
            <div>🚀 No credit card required</div>
          </div>
        </div>
      </section>

      {/* PRODUCT SHOWCASE - ALL FEATURES */}
      <section id="demo" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need in One Tool
            </h2>
            <p className="text-xl text-gray-400">
              Stop juggling 10 different tools. AutopilotAI does it all.
            </p>
          </div>

          {/* MAIN FEATURES GRID */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {/* WEBSITES - PRIMARY */}
            <div className="md:col-span-2 group relative p-10 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-2 border-indigo-500 hover:scale-[1.02] transition-all">
              <div className="absolute top-6 right-6 px-3 py-1 bg-indigo-500 rounded-full text-xs font-bold">
                PRIMARY
              </div>
              <div className="text-5xl mb-6">🌐</div>
              <h3 className="text-3xl font-bold mb-4">AI Website Builder</h3>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                Describe your business. AI generates a complete, professional website in 60 seconds. Click any text to edit. Upload images anywhere. Publish with custom domain.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-white/10 rounded-lg text-sm">Click-to-Edit</span>
                <span className="px-4 py-2 bg-white/10 rounded-lg text-sm">Custom Domains</span>
                <span className="px-4 py-2 bg-white/10 rounded-lg text-sm">Mobile Responsive</span>
                <span className="px-4 py-2 bg-white/10 rounded-lg text-sm">Unique Every Time</span>
              </div>
            </div>

            {/* SOCIAL MEDIA */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02]">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-2xl font-bold mb-3">Social Media Content</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                AI writes engaging posts for Instagram, Twitter, LinkedIn, and Facebook. Complete with hashtags, captions, and hooks.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs">Instagram</span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs">Twitter</span>
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-xs">LinkedIn</span>
              </div>
            </div>

            {/* AI IMAGES */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02]">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold mb-3">AI Image Generation</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Create custom images for your brand, social posts, ads, and website. No stock photos needed. Unique visuals in seconds.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-lg text-xs">Brand Assets</span>
                <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-lg text-xs">Social Graphics</span>
              </div>
            </div>

            {/* EMAIL CAMPAIGNS */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02]">
              <div className="text-4xl mb-4">✉️</div>
              <h3 className="text-2xl font-bold mb-3">Email Campaigns</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                AI writes compelling email campaigns. Newsletters, promotions, announcements. Subject lines that get opened.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg text-xs">Newsletters</span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs">Promotions</span>
              </div>
            </div>

            {/* AD COPY */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02]">
              <div className="text-4xl mb-4">📢</div>
              <h3 className="text-2xl font-bold mb-3">Ad Copy That Converts</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Generate high-converting ad copy for Google Ads, Facebook, Instagram. Headlines, descriptions, CTAs that drive sales.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-xs">Google Ads</span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs">Facebook</span>
              </div>
            </div>
          </div>

          {/* HOW IT WORKS */}
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">How It Works</h3>
            <p className="text-gray-400">Three steps to your entire online presence</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Describe Your Business</h3>
              <p className="text-gray-400">Tell AI what you do in one sentence</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">AI Creates Everything</h3>
              <p className="text-gray-400">Website, posts, emails, ads - all at once</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Edit & Publish</h3>
              <p className="text-gray-400">Click to edit anything. Publish when ready.</p>
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="py-32 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Perfect For
            </h2>
            <p className="text-xl text-gray-400">
              Whether you're solo or scaling
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-black/50 border border-white/10">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-2xl font-bold mb-3">Solopreneurs</h3>
              <p className="text-gray-400">
                Launch your business online without hiring a designer, copywriter, or developer.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-black/50 border border-white/10">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-2xl font-bold mb-3">Small Businesses</h3>
              <p className="text-gray-400">
                Professional online presence and marketing materials in minutes, not weeks.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-black/50 border border-white/10">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold mb-3">Agencies</h3>
              <p className="text-gray-400">
                Deliver client websites and content faster. Scale without hiring more people.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
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
              <p className="text-gray-400 mb-8">Try everything</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Full AI suite access</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Create & edit everything</span>
                </li>
                <li className="flex items-center gap-3 opacity-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Publish websites</span>
                </li>
              </ul>
              <a href="/register" className="block w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold text-center transition">
                Start Free
              </a>
            </div>

            {/* STARTER - POPULAR */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-2 border-indigo-500 relative transform scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-500 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <div className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">Starter</div>
              <div className="text-5xl font-bold mb-2">$10<span className="text-2xl text-gray-400">/mo</span></div>
              <p className="text-gray-400 mb-8">Go live</p>
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
                  <span><strong>Publish websites</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Custom domain</strong></span>
                </li>
              </ul>
              <a href="/register" className="block w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 rounded-xl font-semibold text-center transition-all shadow-lg">
                Get Started
              </a>
            </div>

            {/* PRO */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Pro</div>
              <div className="text-5xl font-bold mb-2">$20<span className="text-2xl text-gray-400">/mo</span></div>
              <p className="text-gray-400 mb-8">Scale up</p>
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
                  <span><strong>3 websites</strong></span>
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
            Stop Doing It All Manually
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Let AI handle your websites, social media, emails, and ads. You focus on growing.
          </p>
          <a href="/register" className="inline-block px-12 py-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-2xl shadow-indigo-500/30">
            Start Creating for Free →
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