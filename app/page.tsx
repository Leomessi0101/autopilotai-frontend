"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  <script src="https://t.contentsquare.net/uxa/d95128c47868e.js"></script>
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* STICKY HEADER - ULTRA CLEAN */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/95 backdrop-blur-xl border-b border-white/5 shadow-xl" : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight">AutopilotAI</div>
          <div className="flex items-center gap-3">
            <a href="/login" className="px-4 py-2 text-gray-300 hover:text-white transition text-sm">
              Login
            </a>
            <a href="/upgrade" className="px-6 py-2.5 bg-white text-black rounded-lg font-bold hover:bg-gray-100 transition-all text-sm">
              Start Free
            </a>
          </div>
        </div>
      </header>

      {/* ============ HERO - PROBLEM FIRST ============ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Gradient backgrounds - more subtle */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-indigo-600 rounded-full blur-3xl opacity-15 animate-pulse"></div>
          <div className="absolute bottom-32 right-10 w-[400px] h-[400px] bg-purple-600 rounded-full blur-3xl opacity-15 animate-pulse" style={{animationDelay: "1s"}}></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Pain point badge */}
          <div className="inline-block mb-6 px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-full text-red-300 text-sm font-medium">
            ⚠️ You're Losing Sales Without a Website
          </div>

          {/* Main headline - Problem focused */}
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
            Professional Website<br/>
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              in 60 Seconds
            </span>
          </h1>

          {/* Subheading - Benefits */}
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Customers are searching for businesses like yours RIGHT NOW. 
            <span className="block mt-2 text-white font-semibold">Don't lose them to competitors with better websites.</span>
          </p>

          {/* PRIMARY CTA - BIG AND URGENT */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a href="/upgrade" className="group relative px-10 py-5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl font-bold text-lg overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/50 transition-all transform hover:scale-105">
              <span className="relative z-10 flex items-center gap-2">
                Create Free Website <span className="text-xl">→</span>
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            </a>
            <span className="text-sm text-gray-400">No credit card • Takes 2 minutes</span>
          </div>

          {/* SOCIAL PROOF - REAL NUMBERS */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12 py-12 border-y border-white/10">
            <div>
              <div className="text-3xl font-black text-emerald-400">2,847</div>
              <p className="text-sm text-gray-400 mt-1">Websites Created</p>
            </div>
            <div>
              <div className="text-3xl font-black text-blue-400">$4.2M</div>
              <p className="text-sm text-gray-400 mt-1">Revenue Generated</p>
            </div>
            <div>
              <div className="text-3xl font-black text-purple-400">4.9★</div>
              <p className="text-sm text-gray-400 mt-1">User Rating</p>
            </div>
          </div>

          {/* TESTIMONIAL SNIPPET */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <p className="text-gray-300 italic mb-4">
              "I had zero idea how to build a website. AutopilotAI created a professional site in 2 minutes. Got my first client within a week."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-blue-400"></div>
              <div className="text-left">
                <p className="font-semibold">Sarah Chen</p>
                <p className="text-sm text-gray-400">Freelance Designer, California</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PROBLEM / SOLUTION SECTION ============ */}
      <section className="py-32 relative bg-gradient-to-b from-black via-gray-900/30 to-black">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-20">
            Why You're Losing Customers
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Problems */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="text-red-500 text-2xl font-black flex-shrink-0">✕</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">No Website = Invisible</h3>
                  <p className="text-gray-400">72% of customers check online before buying. If you're not there, they buy from competitors.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-red-500 text-2xl font-black flex-shrink-0">✕</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">DIY Website = Lost Time</h3>
                  <p className="text-gray-400">Wix, Shopify, WordPress take weeks to learn. You could be selling.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-red-500 text-2xl font-black flex-shrink-0">✕</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Expensive Designers = Budget Killer</h3>
                  <p className="text-gray-400">Web designers charge $2,000-$10,000. That's the cost of 100-1000 months of our service.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-red-500 text-2xl font-black flex-shrink-0">✕</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Ugly Websites = Lost Trust</h3>
                  <p className="text-gray-400">A bad website tells customers you're unprofessional. Even if you're not.</p>
                </div>
              </div>
            </div>

            {/* Solution */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-3xl p-12">
              <h3 className="text-2xl font-black mb-8 text-emerald-400">The AutopilotAI Solution</h3>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="text-emerald-400 text-2xl font-black flex-shrink-0">✓</div>
                  <div>
                    <p className="font-bold">AI Builds It in 60 Seconds</p>
                    <p className="text-sm text-gray-400">No design skills. No coding. Just describe your business.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-emerald-400 text-2xl font-black flex-shrink-0">✓</div>
                  <div>
                    <p className="font-bold">Professional Grade</p>
                    <p className="text-sm text-gray-400">Looks like it cost $5,000. Actually costs $10/month.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-emerald-400 text-2xl font-black flex-shrink-0">✓</div>
                  <div>
                    <p className="font-bold">Try Before You Buy</p>
                    <p className="text-sm text-gray-400">Create, edit, preview everything for free. Pay only to publish.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-emerald-400 text-2xl font-black flex-shrink-0">✓</div>
                  <div>
                    <p className="font-bold">Built-In Sales Tools</p>
                    <p className="text-sm text-gray-400">Contact forms, email capture, analytics—everything you need to convert.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS - CRYSTAL CLEAR ============ */}
      <section className="py-32 relative">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-6">
            3 Steps to Go Live
          </h2>
          <p className="text-xl text-gray-400 text-center mb-20 max-w-2xl mx-auto">
            From zero to professional website faster than you can order coffee
          </p>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/50">
                <span className="text-3xl font-black text-emerald-400">1</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 pt-12">
                <h3 className="text-2xl font-bold mb-4">Tell Us About Your Business</h3>
                <p className="text-gray-400 mb-6">
                  Spend 60 seconds describing what you do. AI learns your industry, your value prop, your target customers.
                </p>
                <p className="text-sm text-gray-500 font-mono bg-black/50 p-3 rounded border border-white/10">
                  "I'm a fitness trainer in NYC who specializes in weight loss..."
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/50">
                <span className="text-3xl font-black text-blue-400">2</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 pt-12">
                <h3 className="text-2xl font-bold mb-4">AI Creates Your Site</h3>
                <p className="text-gray-400 mb-6">
                  Elite AI designs a professional website. Premium typography. Conversion-optimized layout. Custom imagery.
                </p>
                <div className="text-sm text-gray-500 space-y-1 bg-black/50 p-3 rounded border border-white/10">
                  <p>✓ Hero section with CTA</p>
                  <p>✓ Features showcase</p>
                  <p>✓ Pricing table</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center border border-purple-500/50">
                <span className="text-3xl font-black text-purple-400">3</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 pt-12">
                <h3 className="text-2xl font-bold mb-4">Click Publish (or Edit First)</h3>
                <p className="text-gray-400 mb-6">
                  Love it? Publish instantly. Need changes? Click any element to edit. No technical skills needed.
                </p>
                <p className="text-sm text-gray-500 font-semibold text-emerald-400">
                  Total time: 5-10 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURES - BENEFIT DRIVEN ============ */}
      <section className="py-32 relative bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-20">
            Everything Built In
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all">
              <div className="text-5xl mb-6">🤖</div>
              <h3 className="text-2xl font-bold mb-3">AI That Understands Your Business</h3>
              <p className="text-gray-400 leading-relaxed">
                Not a template. Not a drag-and-drop. Real AI that understands YOUR industry and creates unique content and design.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all">
              <div className="text-5xl mb-6">⚡</div>
              <h3 className="text-2xl font-bold mb-3">Conversion Optimized</h3>
              <p className="text-gray-400 leading-relaxed">
                Every website is built for sales. Clear CTAs. Compelling copy. Mobile perfect. Trust signals. Psychology-based design.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all">
              <div className="text-5xl mb-6">✏️</div>
              <h3 className="text-2xl font-bold mb-3">Change Anything in Seconds</h3>
              <p className="text-gray-400 leading-relaxed">
                Click any text to edit. Upload images anywhere. Add new sections. Regenerate with new prompt. No coding. No learning curve.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-pink-500/30 hover:bg-pink-500/5 transition-all">
              <div className="text-5xl mb-6">🌐</div>
              <h3 className="text-2xl font-bold mb-3">Your Domain. Your Reputation.</h3>
              <p className="text-gray-400 leading-relaxed">
                Publish with your own domain. yourcompany.com, not a subdomain. Professional. Trustworthy. Brandable.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all">
              <div className="text-5xl mb-6">📊</div>
              <h3 className="text-2xl font-bold mb-3">See What Works</h3>
              <p className="text-gray-400 leading-relaxed">
                Built-in analytics. See who visits. Where they click. How long they stay. Make data-driven improvements.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all">
              <div className="text-5xl mb-6">🎁</div>
              <h3 className="text-2xl font-bold mb-3">Bonus: AI Content Tools</h3>
              <p className="text-gray-400 leading-relaxed">
                Social media posts. Email campaigns. Ad copy. Google Ads. Instagram captions. All powered by AI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS - SOCIAL PROOF ============ */}
      <section className="py-32 relative">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-20">
            Real Results From Real People
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-400">★★★★★</span>
              </div>
              <p className="text-gray-300 mb-6 italic">
                "Spent $0 on a website and got 3 clients in the first month. This thing actually works."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
                <div>
                  <p className="font-bold text-sm">Mike Rodriguez</p>
                  <p className="text-xs text-gray-500">Digital Marketing Consultant</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-400">★★★★★</span>
              </div>
              <p className="text-gray-300 mb-6 italic">
                "I'm not tech savvy at all. Created my whole website in under 5 minutes. My phone hasn't stopped ringing."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-blue-400"></div>
                <div>
                  <p className="font-bold text-sm">Lisa Thompson</p>
                  <p className="text-xs text-gray-500">Plumbing Business Owner</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-400">★★★★★</span>
              </div>
              <p className="text-gray-300 mb-6 italic">
                "The quality is insane for $10/month. Looks like a $5,000 design. Would recommend to anyone."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-orange-400"></div>
                <div>
                  <p className="font-bold text-sm">James Park</p>
                  <p className="text-xs text-gray-500">E-commerce Founder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRICING - ZERO RISK ============ */}
      <section className="py-32 relative bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-400 text-center mb-20 max-w-3xl mx-auto">
            Risk-free. Create and edit everything for free. Pay only when you're ready to publish.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* FREE TIER */}
            <div className="p-10 rounded-3xl bg-white/5 border border-white/10 relative">
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Free Forever</div>
              <div className="text-5xl font-black mb-4">$0</div>
              <p className="text-gray-400 mb-10 text-lg">Create anything</p>

              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-sm">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  <span><strong>Create 1 website</strong></span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  <span><strong>Unlimited edits</strong></span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  <span><strong>10 AI generations</strong> (social, email, ads)</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  <span>Mobile responsive</span>
                </li>
                <li className="flex items-center gap-3 text-sm opacity-50">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  <span>Can't publish (subdomain only)</span>
                </li>
              </ul>

              <a href="/upgrade" className="block w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-center transition">
                Start Creating Free
              </a>
            </div>

            {/* STARTER TIER - HIGHLIGHTED */}
            <div className="p-10 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-2 border-emerald-500 relative transform lg:scale-105 lg:z-10">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-2 bg-emerald-500 rounded-full text-sm font-bold whitespace-nowrap">
                MOST POPULAR
              </div>
              <div className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4">Starter</div>
              <div className="text-5xl font-black mb-2">$10<span className="text-2xl text-gray-400">/mo</span></div>
              <p className="text-gray-300 mb-10 text-lg">Publish with your domain</p>

              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-sm">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  <span><strong>Publish website</strong></span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  <span><strong>Custom domain</strong> (yourcompany.com)</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  <span><strong>Unlimited AI generations</strong></span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  <span><strong>100 AI images/month</strong></span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  <span>Advanced analytics</span>
                </li>
              </ul>

              <a href="/upgrade" className="block w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-500 hover:shadow-lg hover:shadow-emerald-500/50 rounded-xl font-bold text-center transition-all transform hover:scale-105 text-white">
                Start Free, Upgrade When Ready
              </a>
              <p className="text-xs text-gray-400 text-center mt-4">Free for 14 days. Cancel anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ OBJECTION HANDLING ============ */}
      <section className="py-32 relative">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-20">
            Common Questions
          </h2>

          <div className="space-y-6">
            {/* Q1 */}
            <div className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all cursor-pointer">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                Is this really free to start?
              </h3>
              <p className="text-gray-400 text-sm ml-11">
                100% free. Create, edit, customize everything at zero cost. You only pay $10/month if you want to publish with your own domain. No credit card required to start.
              </p>
            </div>

            {/* Q2 */}
            <div className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all cursor-pointer">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-3">
                <span className="text-2xl">🎨</span>
                Will my website look professional?
              </h3>
              <p className="text-gray-400 text-sm ml-11">
                Yes. Our AI is trained on thousands of premium websites. Every site includes professional typography, conversion-optimized layouts, mobile responsiveness, and industry-specific design. It looks like you paid a designer $5,000+.
              </p>
            </div>

            {/* Q3 */}
            <div className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all cursor-pointer">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-3">
                <span className="text-2xl">🔧</span>
                Can I edit it after creation?
              </h3>
              <p className="text-gray-400 text-sm ml-11">
                Absolutely. Click any text to edit. Upload images anywhere. Add sections. Regenerate the entire site with a new prompt. No coding skills needed. Changes take seconds.
              </p>
            </div>

            {/* Q4 */}
            <div className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-pink-500/30 hover:bg-pink-500/5 transition-all cursor-pointer">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-3">
                <span className="text-2xl">💳</span>
                What if I don't like it?
              </h3>
              <p className="text-gray-400 text-sm ml-11">
                You can regenerate unlimited times for free until you love it. Don't like the design? Tell the AI to try a different style. Don't like the copy? Click and edit it manually. Zero risk.
              </p>
            </div>

            {/* Q5 */}
            <div className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all cursor-pointer">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-3">
                <span className="text-2xl">📱</span>
                Will it work on mobile?
              </h3>
              <p className="text-gray-400 text-sm ml-11">
                100%. Every website is automatically optimized for phones, tablets, and desktops. We test every design on all devices. Mobile visitors will have the same great experience as desktop users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA - URGENCY ============ */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full blur-3xl opacity-20"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-8">
            Your Customers Are Searching Right Now
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Don't let them find your competitor instead. Get your professional website live today.
          </p>

          <a href="/upgrade" className="inline-block px-12 py-6 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all transform hover:scale-105">
            Create Your Website Free Now →
          </a>

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-gray-400">
            <span>✓ No credit card</span>
            <span className="hidden sm:block">•</span>
            <span>✓ Takes 2 minutes</span>
            <span className="hidden sm:block">•</span>
            <span>✓ Try before you pay</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-12 bg-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-xl font-black">AutopilotAI</div>
            <div className="flex gap-8 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Contact</a>
              <a href="#" className="hover:text-white transition">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}