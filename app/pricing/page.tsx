"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import MarketingNavbar from "@/components/MarketingNavbar";
import {
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Star,
  Crown,
} from "lucide-react";

/* -----------------------------
   TYPES
-------------------------------- */
interface User {
  subscription_plan: "basic" | "growth" | "pro";
}

/* -----------------------------
   MOTION (MATCH HOME & FEATURES)
-------------------------------- */
const fadeUp = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const springy = {
  type: "spring" as const,
  stiffness: 120,
  damping: 18,
  mass: 0.6,
};

/* -----------------------------
   SHARED UI
-------------------------------- */
function GlowDivider() {
  return (
    <div className="relative my-24 md:my-32">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-px w-[70%] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-16 w-16 rounded-full bg-[#6d8ce8]/10 blur-3xl" />
      </div>
      <div className="h-1" />
    </div>
  );
}

function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-sm font-medium text-gray-200 flex items-center gap-2.5 ${className}`}
    >
      {children}
    </div>
  );
}

function PrimaryCTA({
  onClick,
  children,
  disabled = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group w-full inline-flex items-center justify-center gap-3 px-8 md:px-12 py-6 rounded-2xl 
        bg-gradient-to-r from-[#1e3a8a] to-[#3b62d1] font-semibold text-lg 
        hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(59,98,209,0.4)] transition-all duration-300 shadow-lg
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      <span>{children}</span>
      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
    </button>
  );
}

/* -----------------------------
   PAGE
-------------------------------- */
export default function PricingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    setIsLoggedIn(!!token);

    if (token) {
      api
        .get<User>("/api/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, []);

  const handleSubscribe = async (plan: "basic" | "growth" | "pro"): Promise<void> => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      window.location.href = "/register";
      return;
    }

    if (user?.subscription_plan === plan) return;

    try {
      const res = await api.post<{ checkout_url: string }>(
        `/api/stripe/create-checkout-session?plan=${plan}`
      );
      window.location.href = res.data.checkout_url;
    } catch {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen text-white bg-[#05070d] relative overflow-x-hidden">

      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-96 -left-96 w-[1200px] h-[1200px] bg-gradient-to-br from-[#0c1a39] via-[#0a1630] to-transparent blur-[220px] opacity-70" />
        <div className="absolute -bottom-96 -right-96 w-[1200px] h-[1200px] bg-gradient-to-tl from-[#0d1b3d] via-[#111a2c] to-transparent blur-[240px] opacity-70" />
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_15%_15%,white,transparent_40%),radial-gradient(circle_at_85%_25%,white,transparent_35%)]" />
      </div>

      {/* NAV */}
      <div className="relative z-20">
        <MarketingNavbar />
      </div>

      {/* HERO */}
      <section className="relative z-10 pt-32 md:pt-44 pb-16 md:pb-24 px-6 md:px-10">
        <motion.div {...fadeUp} transition={{ duration: 0.9 }} className="max-w-6xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Pill><Sparkles className="w-4 h-4 text-[#8da2ff]" /> Transparent</Pill>
            <Pill><Zap className="w-4 h-4 text-[#8da2ff]" /> Flexible</Pill>
            <Pill><ShieldCheck className="w-4 h-4 text-[#8da2ff]" /> Secure</Pill>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05]">
            Pricing built for momentum,
            <br />
            <span className="text-[#d0e0ff]">not lock-in.</span>
          </h1>

          <p className="mt-8 text-xl md:text-2xl text-gray-300/90 max-w-3xl mx-auto font-light">
            Start free. Upgrade when you're ready. Cancel anytime — no drama.
          </p>
        </motion.div>
      </section>

      {/* PRICING CARDS — Much more premium */}
      <section className="relative z-10 px-6 md:px-10 pb-20 md:pb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12">
          <PriceCard
            plan="Basic"
            price="19"
            desc="Perfect for starting strong."
            features={[
              "30 AI generations / month",
              "Core content engine",
              "Email templates & replies",
              "Basic guidance",
              "Standard speed",
              "Email support",
            ]}
            current={user?.subscription_plan === "basic"}
            isLoggedIn={isLoggedIn}
            onChoose={() => handleSubscribe("basic")}
          />

          <PriceCard
            plan="Growth"
            price="49"
            popular
            highlight
            desc="The sweet spot for creators & founders"
            features={[
              "Unlimited generations",
              "All Basic features",
              "Full history & saves",
              "Multiple variations",
              "Priority processing",
              "Priority support",
            ]}
            current={user?.subscription_plan === "growth"}
            isLoggedIn={isLoggedIn}
            onChoose={() => handleSubscribe("growth")}
          />

          <PriceCard
            plan="Pro"
            price="99"
            desc="Built for serious scaling"
            features={[
              "Everything in Growth",
              "Long-form & campaigns",
              "Advanced analytics",
              "Full bundle generation",
              "Fastest queue",
              "Dedicated support",
            ]}
            current={user?.subscription_plan === "pro"}
            isLoggedIn={isLoggedIn}
            onChoose={() => handleSubscribe("pro")}
          />
        </div>
      </section>

      <GlowDivider />

      {/* TRUST & VALUE */}
      <section className="relative z-10 px-6 md:px-10 py-20">
        <motion.div {...fadeUp} className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-8">
            <Crown className="w-5 h-5 text-[#8da2ff]" />
            <span className="text-gray-200 font-medium">No hidden fees • No contracts • Full control</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black mb-8">
            Fair today. Fair tomorrow.
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            You control your plan from your dashboard — upgrade, downgrade or cancel in seconds.
          </p>
        </motion.div>
      </section>

      <GlowDivider />

      {/* FAQ */}
      <section className="relative z-10 px-6 md:px-10 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-16">
            Questions?
          </h2>

          <div className="space-y-12">
            <FaqItem
              question="Is there a free trial?"
              answer="Yes — sign up and explore everything before picking a plan. No credit card needed."
            />
            <FaqItem
              question="Can I cancel or change plans?"
              answer="Absolutely. Do it anytime directly from your dashboard — no questions asked."
            />
            <FaqItem
              question="What payment methods do you accept?"
              answer="All major credit/debit cards through Stripe."
            />
            <FaqItem
              question="Is my payment secure?"
              answer="Yes — 100% handled by Stripe with top-tier encryption and fraud protection."
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      {!isLoggedIn && (
        <section className="relative z-10 py-32 md:py-40 text-center px-6 md:px-10">
          <motion.div {...fadeUp} className="max-w-5xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black leading-tight">
              Ready to turn ideas
              <br />
              into consistent output?
            </h2>

            <p className="mt-8 text-2xl text-gray-300 max-w-3xl mx-auto">
              Start free today — no card required.
            </p>

            <div className="mt-12">
              <a
                href="/register"
                className="inline-flex items-center justify-center gap-4 px-16 py-8 rounded-3xl text-2xl md:text-3xl font-bold 
                  bg-gradient-to-r from-[#1e3a8a] via-[#3b62d1] to-[#5a8aff] 
                  shadow-[0_30px_100px_rgba(59,98,209,0.5)] hover:shadow-[0_40px_140px_rgba(59,98,209,0.6)]
                  hover:scale-[1.03] transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="w-8 h-8" />
              </a>
            </div>
          </motion.div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-16 text-center relative z-10">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} AutopilotAI • Built for builders
        </p>
      </footer>
    </div>
  );
}

/* -----------------------------
   COMPONENTS
-------------------------------- */
interface PriceCardProps {
  plan: string;
  price: string;
  desc: string;
  features: string[];
  highlight?: boolean;
  popular?: boolean;
  current: boolean;
  onChoose: () => void;
  isLoggedIn: boolean;
}

function PriceCard({
  plan,
  price,
  desc,
  features,
  highlight,
  popular,
  current,
  onChoose,
  isLoggedIn,
}: PriceCardProps) {
  return (
    <motion.div
      {...fadeUp}
      whileHover={{ y: -10, transition: springy }}
      className={`relative rounded-3xl border p-8 md:p-10 lg:p-12 shadow-2xl transition-all duration-300 ${
        highlight
          ? "border-[#4a6fff]/50 bg-gradient-to-b from-[#0f1e38] to-[#0a1426] shadow-[0_30px_100px_rgba(74,111,255,0.25)]"
          : "border-white/10 bg-white/5 backdrop-blur-xl"
      }`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="px-6 py-2 bg-gradient-to-r from-[#6d8ce8] to-[#8da2ff] text-white text-sm font-bold rounded-full shadow-md">
            MOST POPULAR
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-3xl md:text-4xl font-black">{plan}</h3>
        <p className="mt-4 text-lg md:text-xl text-gray-300/90">{desc}</p>

        <div className="mt-10">
          <span className="text-6xl md:text-7xl font-black">${price}</span>
          <span className="text-2xl text-gray-400 align-bottom">/mo</span>
        </div>
      </div>

      <div className="mt-12 space-y-5">
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-3.5">
            <CheckCircle2 className={`w-6 h-6 ${highlight ? "text-[#a3c0ff]" : "text-[#8da2ff]"} mt-1 flex-shrink-0`} />
            <span className="text-gray-100/95 text-lg">{f}</span>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-white/10">
        {current ? (
          <div className="py-5 text-[#a3ffbe] font-bold text-xl text-center flex items-center justify-center gap-2">
            <Star className="w-6 h-6 fill-current" />
            Current Plan
          </div>
        ) : (
          <PrimaryCTA onClick={onChoose} disabled={current}>
            {isLoggedIn ? `Switch to ${plan}` : "Start Free"}
          </PrimaryCTA>
        )}
      </div>
    </motion.div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <motion.div {...fadeUp} className="border-b border-white/10 pb-10 last:border-none">
      <h4 className="text-2xl md:text-3xl font-bold">{question}</h4>
      <p className="mt-5 text-lg md:text-xl text-gray-300/90 leading-relaxed">{answer}</p>
    </motion.div>
  );
}