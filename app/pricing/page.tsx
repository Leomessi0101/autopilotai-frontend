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
  Stars,
} from "lucide-react";

/* -----------------------------
   TYPES
-------------------------------- */
type User = {
  subscription_plan: "basic" | "growth" | "pro";
};

/* -----------------------------
   MOTION (MATCH HOME)
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
    <div className="relative my-20 md:my-28">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-px w-[80%] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full bg-[#6d8ce8]/15 blur-2xl" />
      </div>
      <div className="h-1" />
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-sm text-gray-200 flex items-center gap-2">
      {children}
    </div>
  );
}

function PrimaryCTA({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="group w-full inline-flex items-center justify-center gap-3 px-8 md:px-10 py-5 rounded-2xl bg-gradient-to-r from-[#203b6a] to-[#345899] font-semibold text-lg hover:scale-[1.02] transition shadow-[0_25px_80px_rgba(15,35,85,0.6)]"
    >
      <span>{children}</span>
      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
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
        .get("/api/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, []);

  const handleSubscribe = async (plan: "basic" | "growth" | "pro") => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      window.location.href = "/register";
      return;
    }

    if (user?.subscription_plan === plan) return;

    try {
      const res = await api.post(
        `/api/stripe/create-checkout-session?plan=${plan}`
      );
      window.location.href = res.data.checkout_url;
    } catch {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen text-white bg-[#05070d] relative overflow-x-hidden">

      {/* BACKGROUND ATMOSPHERE */}
      <div className="fixed inset-0 z-0">
        <div className="absolute -top-44 -left-44 w-[980px] h-[980px] bg-[conic-gradient(at_top_left,var(--tw-gradient-stops))] from-[#0c1a39] via-[#0a1630] to-transparent blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[980px] h-[980px] bg-[conic-gradient(at_bottom_right,var(--tw-gradient-stops))] from-[#0d1b3d] via-[#111a2c] to-transparent blur-[200px]" />
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_20%_20%,white,transparent_30%),radial-gradient(circle_at_80%_30%,white,transparent_25%),radial-gradient(circle_at_40%_80%,white,transparent_35%)]" />
      </div>

      {/* NAV */}
      <div className="relative z-20">
        <MarketingNavbar />
      </div>

      {/* HERO */}
      <section className="relative z-10 pt-32 md:pt-40 pb-20 px-6 md:px-10">
        <motion.div {...fadeUp} transition={{ duration: 0.9 }} className="max-w-6xl mx-auto text-center">

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Pill><Sparkles className="w-4 h-4 text-[#6d8ce8]" /> No hidden fees</Pill>
            <Pill><Zap className="w-4 h-4 text-[#6d8ce8]" /> Cancel anytime</Pill>
            <Pill><ShieldCheck className="w-4 h-4 text-[#6d8ce8]" /> Secure Stripe payments</Pill>
          </div>

          <h1 className="text-[2.7rem] leading-[1.05] md:text-7xl md:leading-[1.02] font-black tracking-tight">
            Simple, transparent pricing
            <br />
            <span className="text-[#d8e3ff]">that scales with you.</span>
          </h1>

          <p className="mt-8 text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            No contracts. No surprises. Upgrade, downgrade, or cancel whenever you want.
          </p>
        </motion.div>
      </section>

      {/* PRICING CARDS */}
      <section className="relative z-10 px-6 md:px-10 -mt-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <PriceCard
            plan="Basic"
            price="19"
            desc="Get momentum without overthinking."
            features={[
              "Up to 30 AI generations / month",
              "Core content tools",
              "Email & reply templates",
              "Basic strategy guidance",
              "Standard processing",
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
            desc="The execution sweet spot."
            features={[
              "Unlimited generations",
              "Everything in Basic",
              "Full history & saved work",
              "Multiple output variations",
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
            desc="For power users and teams."
            features={[
              "Everything in Growth",
              "Long-form content",
              "Full campaign bundles",
              "Advanced analytics",
              "Highest priority queue",
              "Dedicated support",
            ]}
            current={user?.subscription_plan === "pro"}
            isLoggedIn={isLoggedIn}
            onChoose={() => handleSubscribe("pro")}
          />
        </div>
      </section>

      <GlowDivider />

      {/* TRUST */}
      <section className="relative z-10 px-6 md:px-10 py-16">
        <motion.div {...fadeUp} className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-gray-300 mb-6">
            <Stars className="w-5 h-5 text-[#6d8ce8]" />
            <span>Built for creators, founders, and teams</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Fair. Flexible. In your control.
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Manage everything from your dashboard. No contracts. No pressure.
          </p>
        </motion.div>
      </section>

      <GlowDivider />

      {/* FAQ */}
      <section className="relative z-10 px-6 md:px-10 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16">
            Frequently asked questions
          </h2>

          <div className="space-y-10">
            <FaqItem
              question="Is there a free trial?"
              answer="Yes. You can sign up and explore AutopilotAI before choosing a plan. No card required."
            />
            <FaqItem
              question="Can I change or cancel anytime?"
              answer="Yes. Upgrade, downgrade, or cancel directly from your dashboard."
            />
            <FaqItem
              question="What payment methods do you accept?"
              answer="All major credit and debit cards via Stripe."
            />
            <FaqItem
              question="Is payment secure?"
              answer="Absolutely. Payments are handled securely by Stripe with bank-level encryption."
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      {!isLoggedIn && (
        <section className="relative z-10 py-32 text-center px-6 md:px-10">
          <motion.div {...fadeUp} className="max-w-5xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black leading-[1.02]">
              Ready to build momentum?
            </h2>

            <p className="mt-8 text-xl text-gray-300 max-w-3xl mx-auto">
              Start free and turn ideas into consistent output.
            </p>

            <div className="mt-14">
              <a
                href="/register"
                className="inline-flex items-center justify-center gap-3 px-16 py-7 rounded-2xl text-2xl font-bold bg-gradient-to-r from-[#1c2f57] to-[#2b4e8d] shadow-[0_35px_120px_rgba(20,40,90,0.6)] hover:scale-[1.02] transition"
              >
                Get Started Free
                <ArrowRight className="w-6 h-6" />
              </a>
            </div>
          </motion.div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-16 text-center relative z-10">
        <p className="text-gray-400 text-sm">
          © 2025 AutopilotAI — Built for people who execute.
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
      whileHover={{ y: -6 }}
      transition={springy}
      className={`relative rounded-3xl border p-10 md:p-12 shadow-[0_50px_140px_rgba(0,0,0,.6)] ${
        highlight
          ? "border-[#2b4e8d] bg-[#0b1424]"
          : "border-white/10 bg-white/5 backdrop-blur-xl"
      }`}
    >
      {popular && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2">
          <span className="px-4 py-2 bg-[#2b4e8d] text-white text-sm font-bold rounded-full">
            MOST POPULAR
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-3xl font-bold">{plan}</h3>
        <p className="mt-3 text-lg text-gray-300">{desc}</p>

        <div className="mt-8">
          <span className="text-6xl font-black">${price}</span>
          <span className="text-xl text-gray-400">/month</span>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#6d8ce8] mt-1" />
            <span className="text-gray-200">{f}</span>
          </div>
        ))}
      </div>

      <div className="mt-12">
        {current ? (
          <div className="py-4 text-[#6dff9c] font-bold text-center text-lg">
            ✓ Current plan
          </div>
        ) : (
          <PrimaryCTA onClick={onChoose}>
            {isLoggedIn ? `Choose ${plan}` : "Start Free"}
          </PrimaryCTA>
        )}
      </div>
    </motion.div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <motion.div {...fadeUp} className="border-b border-white/10 pb-8">
      <h4 className="text-xl md:text-2xl font-bold">{question}</h4>
      <p className="mt-4 text-lg text-gray-300 leading-relaxed">{answer}</p>
    </motion.div>
  );
}
