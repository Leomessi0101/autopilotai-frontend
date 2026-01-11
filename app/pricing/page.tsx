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
  Globe,
} from "lucide-react";

/* -----------------------------
   TYPES
-------------------------------- */
interface User {
  subscription_plan: "basic" | "growth" | "pro";
}

/* -----------------------------
   MOTION
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
      className={`group w-full inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl 
        bg-gradient-to-r from-[#203b6a] to-[#345899] font-medium text-lg 
        hover:scale-[1.02] transition shadow-[0_10px_40px_rgba(52,88,153,0.4)]
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
        .get("/api/auth/me")
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
      const res = await api.post(`/api/stripe/create-checkout-session?plan=${plan}`);
      window.location.href = res.data.checkout_url;
    } catch {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen text-white bg-[#05070d] relative overflow-x-hidden">

      {/* BACKGROUND - same as features/home */}
      <div className="fixed inset-0 z-0">
        <div className="absolute -top-44 -left-44 w-[980px] h-[980px] bg-[conic-gradient(at_top_left,var(--tw-gradient-stops))] from-[#0c1a39] via-[#0a1630] to-transparent blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[980px] h-[980px] bg-[conic-gradient(at_bottom_right,var(--tw-gradient-stops))] from-[#0d1b3d] via-[#111a2c] to-transparent blur-[200px]" />
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_20%_20%,white,transparent_30%),radial-gradient(circle_at_80%_30%,white,transparent_25%),radial-gradient(circle_at_40%_80%,white,transparent_35%)]" />
      </div>

      <div className="relative z-20">
        <MarketingNavbar />

        {/* HERO */}
        <section className="relative z-10 pt-28 md:pt-36 pb-20 px-6 md:px-10">
          <motion.div {...fadeUp} transition={{ duration: 0.9 }} className="max-w-6xl mx-auto text-center">
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Pill><Sparkles className="w-4 h-4 text-[#6d8ce8]" /> No hidden fees</Pill>
              <Pill><Zap className="w-4 h-4 text-[#6d8ce8]" /> Cancel anytime</Pill>
              <Pill><ShieldCheck className="w-4 h-4 text-[#6d8ce8]" /> Secure payments</Pill>
            </div>

            <h1 className="text-[2.7rem] leading-[1.05] md:text-7xl md:leading-[1.02] font-black tracking-tight">
              Simple pricing
              <br />
              <span className="text-[#d8e3ff]">that works for you</span>
            </h1>

            <p className="mt-8 text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Start free. Upgrade when you need more. Cancel whenever.
            </p>
          </motion.div>
        </section>

        <GlowDivider />

        {/* PRICING CARDS - All plans now include live website */}
        <section className="relative z-10 px-6 md:px-10 pb-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <PriceCard
              plan="Basic"
              price="19"
              desc="Great for getting started"
              features={[
                "30 AI generations per month",
                "Live website included",
                "Core content tools",
                "Email templates",
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
              desc="Best for most people"
              features={[
                "Unlimited generations",
                "Live website included",
                "Full history & saves",
                "Multiple output variations",
                "Priority speed",
                "Priority support",
              ]}
              current={user?.subscription_plan === "growth"}
              isLoggedIn={isLoggedIn}
              onChoose={() => handleSubscribe("growth")}
            />

            <PriceCard
              plan="Pro"
              price="99"
              desc="For serious users"
              features={[
                "Everything in Growth",
                "Live website included",
                "Long-form content",
                "Full campaign bundles",
                "Advanced analytics",
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
            <h2 className="text-4xl md:text-5xl font-black mb-8">
              Fair. Clear. Yours to control.
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Manage or cancel your plan anytime from your dashboard. No tricks.
            </p>
          </motion.div>
        </section>

        <GlowDivider />

        {/* FAQ */}
        <section className="relative z-10 px-6 md:px-10 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-16">
              Common questions
            </h2>

            <div className="space-y-10">
              <FaqItem
                question="Is there a free trial?"
                answer="Yes — sign up and try everything before choosing a plan. No card needed."
              />
              <FaqItem
                question="Can I cancel or change plans?"
                answer="Yes, anytime directly from your dashboard."
              />
              <FaqItem
                question="What payments do you accept?"
                answer="All major cards through Stripe."
              />
              <FaqItem
                question="Is payment secure?"
                answer="Yes — handled securely by Stripe."
              />
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        {!isLoggedIn && (
          <section className="relative z-10 py-32 text-center px-6 md:px-10">
            <motion.div {...fadeUp} className="max-w-5xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-black leading-[1.02]">
                Ready to get started?
              </h2>

              <p className="mt-8 text-xl text-gray-300 max-w-3xl mx-auto">
                Start free — no card required.
              </p>

              <div className="mt-12">
                <a
                  href="/register"
                  className="inline-flex items-center justify-center gap-3 px-12 py-6 rounded-2xl text-xl md:text-2xl font-medium 
                    bg-gradient-to-r from-[#203b6a] to-[#345899] shadow-[0_10px_40px_rgba(52,88,153,0.4)]
                    hover:scale-[1.02] transition"
                >
                  Start Free
                  <ArrowRight className="w-6 h-6" />
                </a>
              </div>
            </motion.div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="border-t border-white/10 py-16 text-center relative z-10">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} AutopilotAI
          </p>
        </footer>
      </div>
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
  highlight = false,
  popular = false,
  current,
  onChoose,
  isLoggedIn,
}: PriceCardProps) {
  return (
    <motion.div
      {...fadeUp}
      whileHover={{ y: -6 }}
      transition={springy}
      className={`relative rounded-3xl border p-10 shadow-[0_30px_80px_rgba(0,0,0,0.55)] ${
        highlight
          ? "border-[#6d8ce8]/40 bg-white/5 backdrop-blur-xl"
          : "border-white/10 bg-white/5 backdrop-blur-xl"
      }`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-[#6d8ce8] text-white text-sm font-medium rounded-full">
          Most Popular
        </div>
      )}

      <div className="text-center">
        <h3 className="text-3xl font-bold">{plan}</h3>
        <p className="mt-3 text-lg text-gray-400">{desc}</p>

        <div className="mt-8">
          <span className="text-6xl font-black">${price}</span>
          <span className="text-xl text-gray-400">/month</span>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#6d8ce8] mt-1 flex-shrink-0" />
            <span className="text-gray-200">{f}</span>
          </div>
        ))}
      </div>

      <div className="mt-12">
        {current ? (
          <div className="py-5 text-[#6dff9c] font-bold text-lg text-center flex items-center justify-center gap-2">
            <Star className="w-5 h-5 fill-current" />
            Current Plan
          </div>
        ) : (
          <PrimaryCTA onClick={onChoose} disabled={current}>
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