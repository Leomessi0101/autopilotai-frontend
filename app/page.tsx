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
              Create Free Website
            </a>
          </div>
        </div>
      </header>

      {/* HERO - ULTRA CLEAR VALUE */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: "1s"}}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          {/* VALUE PROP */}
          <div className="inline-block mb-6 px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm font-medium">
            ⚡ Try Free • No Credit Card • 60 Seconds
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold mb-8 leading-tight">
            Your Website,
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Built in 60 Seconds
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Describe your business. AI creates a professional website instantly. Edit with a click. <span className="text-white font-semibold">Publish for $10/mo.</span>
          </p>

          {/* PRIMARY CTA - MASSIVE AND CLEAR */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a href="/register" className="group relative px-12 py-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl font-bold text-xl overflow-hidden hover:scale-105 transition-all shadow-2xl shadow-indigo-500/30">
              <span className="relative z-10">Create Your Website Free →</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            </a>
          </div>

          {/* TRUST SIGNALS */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 mb-4">
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

          {/* CLARITY - What happens next */}
          <p className="text-sm text-gray-500">
            Free: Create & edit everything • Paid ($10/mo): Publish with custom domain
          </p>
        </div>
      </section>

      {/* HOW IT WORKS - CRYSTAL CLEAR */}
      <section className="py-32 relative bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              From Zero to Live Website in 3 Steps
            </h2>
            <p className="text-xl text-gray-400">
              No design skills. No coding. Just results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl mb-6 text-3xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-bold mb-3">Sign Up Free</h3>
              <p className="text-gray-400 text-lg">Just email + password. No credit card. Takes 10 seconds.</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl mb-6 text-3xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-bold mb-3">AI Builds Your Site</h3>
              <p className="text-gray-400 text-lg">Describe your business. AI generates everything in 60 seconds.</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-3xl mb-6 text-3xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold mb-3">Publish for $10/mo</h3>
              <p className="text-gray-400 text-lg">Love it? Click publish. Your site goes live with custom domain.</p>
            </div>
          </div>

          {/* SECONDARY CTA */}
          <div className="text-center mt-16">
            <a href="/register" className="inline-block px-10 py-4 bg-white/10 hover:bg-white/20 border-2 border-white/20 rounded-2xl font-semibold text-lg transition-all hover:scale-105">
              Start Building Free →
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES */}
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
            <div className="group relative p-10 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 hover:scale-[1.02] transition-all">
              <div className="text-5xl mb-6">🤖</div>
              <h3 className="text-3xl font-bold mb-4">AI-Powered Design</h3>
              <p className="text-xl text-gray-300 leading-relaxed">
                Every website is unique. No templates. AI creates custom layouts and content for YOUR business.
              </p>
            </div>

            <div className="group relative p-10 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 hover:scale-[1.02] transition-all">
              <div className="text-5xl mb-6">✏️</div>
              <h3 className="text-3xl font-bold mb-4">Click-to-Edit</h3>
              <p className="text-xl text-gray-300 leading-relaxed">
                Click any text to change it. Upload images anywhere. No coding, no complex tools.
              </p>
            </div>

            <div className="group relative p-10 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 hover:scale-[1.02] transition-all">
              <div className="text-5xl mb-6">📱</div>
              <h3 className="text-3xl font-bold mb-4">Mobile Perfect</h3>
              <p className="text-xl text-gray-300 leading-relaxed">
                Looks amazing on phones, tablets, desktops. Every website is automatically responsive.
              </p>
            </div>

            <div className="group relative p-10 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 hover:scale-[1.02] transition-all">
              <div className="text-5xl mb-6">🌐</div>
              <h3 className="text-3xl font-bold mb-4">Custom Domain</h3>
              <p className="text-xl text-gray-300 leading-relaxed">
                Publish with your own domain. yourcompany.com, not a subdomain. Professional and trustworthy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BONUS TOOLS */}
      <section className="py-32 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium">
              Bonus: AI Content Tools
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Plus AI for Social, Emails & Ads
            </h2>
            <p className="text-xl text-gray-400">
              Free users get 10 AI generations
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-black/50 border border-white/10">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="text-lg font-bold mb-2">Social Posts</h3>
              <p className="text-sm text-gray-400">Instagram, Twitter, LinkedIn with hashtags</p>
            </div>

            <div className="p-6 rounded-2xl bg-black/50 border border-white/10">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="text-lg font-bold mb-2">AI Images</h3>
              <p className="text-sm text-gray-400">Custom images (20/mo on paid plan)</p>
            </div>

            <div className="p-6 rounded-2xl bg-black/50 border border-white/10">
              <div className="text-3xl mb-3">✉️</div>
              <h3 className="text-lg font-bold mb-2">Email Copy</h3>
              <p className="text-sm text-gray-400">Newsletters and campaigns</p>
            </div>

            <div className="p-6 rounded-2xl bg-black/50 border border-white/10">
              <div className="text-3xl mb-3">📢</div>
              <h3 className="text-lg font-bold mb-2">Ad Copy</h3>
              <p className="text-sm text-gray-400">Google Ads and Facebook</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING - SIMPLE */}
      <section className="py-32 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple Pricing
            </h2>
            <p className="text-xl text-gray-400">
              Try free. Upgrade only when ready to publish.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* FREE */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Free Forever</div>
              <div className="text-5xl font-bold mb-2">$0</div>
              <p className="text-gray-400 mb-8">Try everything</p>
              <ul className="space-y-4 mb-8 text-sm">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Create 1 AI website</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Edit everything</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>10 AI content generations</span>
                </li>
                <li className="flex items-center gap-3 opacity-50">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  <span>Can't publish</span>
                </li>
              </ul>
              <a href="/register" className="block w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold text-center transition">
                Start Free
              </a>
            </div>

            {/* STARTER */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-2 border-indigo-500 relative transform scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-500 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <div className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">Starter</div>
              <div className="text-5xl font-bold mb-2">$10<span className="text-2xl text-gray-400">/mo</span></div>
              <p className="text-gray-400 mb-8">Go live</p>
              <ul className="space-y-4 mb-8 text-sm">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span><strong>Publish website</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span><strong>Custom domain</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Unlimited AI generations</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>20 AI images/month</span>
                </li>
              </ul>
              <a href="/register" className="block w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 rounded-xl font-semibold text-center transition-all shadow-lg">
                Start Free, Upgrade Later
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
            Join 500+ businesses. Free to start, $10/mo to publish.
          </p>
          <a href="/register" className="inline-block px-12 py-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-2xl shadow-indigo-500/30">
            Create Your Website Free →
          </a>
          <p className="text-sm text-gray-500 mt-6">No credit card required • Cancel anytime</p>
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
    </div>
  );
}