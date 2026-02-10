"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import MarketingNavbar from "@/components/MarketingNavbar";
import { ArrowRight, Check, Sparkles, Zap, Crown } from "lucide-react";

/* =========================
   TYPES
========================= */
type Plan = "free" | "starter" | "pro";

interface User {
  subscription_plan: Plan;
}

/* =========================
   PAGE
========================= */
export default function PricingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isLoggedIn =
    typeof window !== "undefined" &&
    !!localStorage.getItem("autopilot_token");

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    api
      .get("/api/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  const subscribe = async (plan: "starter" | "pro") => {
    if (!isLoggedIn) {
      window.location.href = "/register";
      return;
    }

    try {
      const res = await api.post(
        `/api/stripe/create-checkout-session?plan=${plan}`
      );
      window.location.href = res.data.checkout_url;
    } catch {
      alert("Stripe error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Premium Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d14] via-[#0a0a0f] to-black" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 h-[600px] w-[600px] rounded-full blur-[120px] opacity-20"
          animate={{ 
            opacity: [0.15, 0.25, 0.18],
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.8) 0%, transparent 70%)",
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 right-1/4 h-[700px] w-[700px] rounded-full blur-[120px] opacity-15"
          animate={{ 
            opacity: [0.12, 0.22, 0.15],
            scale: [1, 1.15, 1.05],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{
            background: "radial-gradient(circle, rgba(168,85,247,0.6) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10">
        <MarketingNavbar />

        {/* HERO */}
        <section className="pt-24 md:pt-32 pb-20 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-sm mb-8">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                Pricing
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-transparent">
                Simple pricing
              </span>
            </h1>
            
            <p className="mt-6 text-xl md:text-2xl text-gray-400 leading-relaxed">
              Generate for free. Pay only to publish.
            </p>
          </motion.div>
        </section>

        {/* PLANS */}
        <section className="px-6 pb-32">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* FREE */}
            <PlanCard
              title="Free"
              price="0"
              subtitle="Try it out"
              icon={<Sparkles className="w-6 h-6 text-gray-400" />}
              features={[
                "Generate a full website",
                "Edit content & layout",
                "No credit card required",
                "Publishing disabled",
              ]}
              cta={
                isLoggedIn
                  ? user?.subscription_plan === "free"
                    ? "Current plan"
                    : "Included"
                  : "Start free"
              }
              disabled
              highlight={false}
            />

            {/* STARTER */}
            <PlanCard
              title="Starter"
              price="10"
              subtitle="Publish your site"
              icon={<Zap className="w-6 h-6 text-indigo-400" />}
              features={[
                "Publish 1 website",
                "1 page",
                "Custom domain support",
                "Cancel anytime",
              ]}
              highlight
              popular
              cta={
                user?.subscription_plan === "starter"
                  ? "Current plan"
                  : "Publish website"
              }
              onClick={() => subscribe("starter")}
              disabled={user?.subscription_plan === "starter"}
            />

            {/* PRO */}
            <PlanCard
              title="Pro"
              price="20"
              subtitle="More flexibility"
              icon={<Crown className="w-6 h-6 text-purple-400" />}
              features={[
                "Publish 1 website",
                "Up to 3 pages",
                "Custom domain support",
                "Priority updates",
              ]}
              cta={
                user?.subscription_plan === "pro"
                  ? "Current plan"
                  : "Upgrade to Pro"
              }
              onClick={() => subscribe("pro")}
              disabled={user?.subscription_plan === "pro"}
            />
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/10 bg-gradient-to-b from-transparent to-black/40 py-16 text-center relative z-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-3">
              AutopilotAI
            </div>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} AutopilotAI — Websites built by AI.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* =========================
   COMPONENTS
========================= */

function PlanCard({
  title,
  price,
  subtitle,
  icon,
  features,
  cta,
  onClick,
  disabled,
  highlight = false,
  popular = false,
}: {
  title: string;
  price: string;
  subtitle: string;
  icon?: React.ReactNode;
  features: string[];
  cta: string;
  onClick?: () => void;
  disabled?: boolean;
  highlight?: boolean;
  popular?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={!disabled ? { y: -6, scale: 1.02 } : {}}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`group relative rounded-3xl border p-8 md:p-10 ${
        highlight
          ? "border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 shadow-xl shadow-indigo-500/10"
          : "border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02]"
      } backdrop-blur-xl overflow-hidden transition-all duration-300`}
    >
      {/* Popular badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg border border-white/20">
            Most Popular
          </div>
        </div>
      )}

      {/* Glow effect on hover */}
      {highlight && (
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className={`w-14 h-14 rounded-2xl ${
            highlight 
              ? "bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30" 
              : "bg-white/5 border border-white/10"
          } flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
            {icon}
          </div>
        )}

        {/* Title */}
        <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-500">{subtitle}</p>

        {/* Price */}
        <div className="mt-8 flex items-end gap-2">
          <span className="text-6xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
            ${price}
          </span>
          <span className="text-lg text-gray-500 mb-2">/month</span>
        </div>

        {/* Features */}
        <ul className="mt-8 space-y-4">
          {features.map((f, idx) => (
            <motion.li
              key={f}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-3 text-sm md:text-base text-gray-300"
            >
              <div className="mt-0.5 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 p-1">
                <Check className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <span>{f}</span>
            </motion.li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-10">
          <button
            onClick={onClick}
            disabled={disabled}
            className={`group/btn relative w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2.5 transition-all duration-300 overflow-hidden
              ${
                disabled
                  ? "bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed"
                  : highlight
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20"
              }`}
          >
            <span className="relative z-10">{cta}</span>
            {!disabled && (
              <ArrowRight className="relative z-10 w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
            )}
            {!disabled && highlight && (
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}