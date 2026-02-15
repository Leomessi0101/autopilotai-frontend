"use client";

import { useRouter } from "next/navigation";
import { Sparkles, Check, X } from "lucide-react";

export default function PublicUpgradePage() {
  const router = useRouter();

  const subscribe = async (plan: "starter" | "pro") => {
    // Check if logged in
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      // Not logged in - register first
      router.push(`/register?plan=${plan}`);
      return;
    }

    // Logged in - go to Stripe
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "https://autopilotai-api.onrender.com"}/api/stripe/create-checkout-session?plan=${plan}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      window.location.href = data.checkout_url;
    } catch {
      alert("Could not start checkout. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            AutopilotAI
          </div>
          <div className="flex items-center gap-4">
            <a href="/login" className="px-4 py-2 text-gray-300 hover:text-white transition">
              Login
            </a>
          </div>
        </div>
      </header>

      {/* GRADIENT BACKGROUND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: "1s"}}></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm font-medium">
            🚀 Choose Your Plan
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Start Free or Go Pro
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Try everything free. Upgrade only when you're ready to publish.
          </p>
        </div>

        {/* PLANS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* FREE */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
            <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Free</div>
            <div className="text-5xl font-bold mb-2">$0</div>
            <p className="text-gray-400 mb-8">Try everything</p>
            
            <ul className="space-y-3 mb-8 text-sm">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Create 1 AI website</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Edit everything</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>10 AI generations</span>
              </li>
              <li className="flex items-center gap-3 opacity-50">
                <X className="w-5 h-5 flex-shrink-0" />
                <span>Can't publish</span>
              </li>
              <li className="flex items-center gap-3 opacity-50">
                <X className="w-5 h-5 flex-shrink-0" />
                <span>0 AI images</span>
              </li>
            </ul>

            <a href="/register" className="block w-full py-3.5 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-semibold text-center transition-all">
              Start Free
            </a>
          </div>

          {/* STARTER - POPULAR */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-2 border-indigo-500 relative transform scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-500 rounded-full text-sm font-bold flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              MOST POPULAR
            </div>

            <div className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">Starter</div>
            <div className="text-5xl font-bold mb-2">$10<span className="text-2xl text-gray-400">/mo</span></div>
            <p className="text-gray-400 mb-8">Go live</p>

            <ul className="space-y-3 mb-8 text-sm">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Everything in Free</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="font-semibold">Publish to web</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="font-semibold">Custom domain</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Unlimited AI generations</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>20 AI images/month</span>
              </li>
            </ul>

            <button onClick={() => subscribe("starter")} className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 rounded-xl font-semibold text-center transition-all shadow-lg">
              Get Started
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">Start free, upgrade anytime</p>
          </div>

          {/* PRO */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
            <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Pro</div>
            <div className="text-5xl font-bold mb-2">$20<span className="text-2xl text-gray-400">/mo</span></div>
            <p className="text-gray-400 mb-8">Power user</p>

            <ul className="space-y-3 mb-8 text-sm">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Everything in Starter</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="font-semibold">50 AI images/month</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="font-semibold">3 websites</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Priority support</span>
              </li>
            </ul>

            <button onClick={() => subscribe("pro")} className="w-full py-3.5 bg-white/10 hover:bg-white/20 rounded-xl font-semibold text-center transition-all">
              Get Started
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">Start free, upgrade anytime</p>
          </div>
        </section>

        {/* FAQ */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Questions?</h2>
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-semibold mb-2">Can I try it free first?</h3>
              <p className="text-gray-400 text-sm">Yes! Create your free account, build your website, and upgrade only when you're ready to publish.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-400 text-sm">Absolutely. Cancel from your dashboard anytime. No questions asked.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-semibold mb-2">What happens if I downgrade?</h3>
              <p className="text-gray-400 text-sm">Your website stays live for the current billing period, then returns to draft mode.</p>
            </div>
          </div>
        </div>

        {/* FOOTER CTA */}
        <div className="mt-24 text-center">
          <p className="text-gray-500 text-sm">All plans include unlimited edits • Secure checkout powered by Stripe</p>
        </div>
      </main>
    </div>
  );
}