"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import MarketingNavbar from "@/components/MarketingNavbar";
import { ArrowRight, Check } from "lucide-react";

/* =========================
   TYPES
========================= */
type Plan = "free" | "starter" | "pro";

interface User {
  subscription_plan: Plan;
}

/* =========================
   MOTION
========================= */
const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

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
    <div className="min-h-screen bg-[#05070d] text-white">
      <MarketingNavbar />

      {/* HERO */}
      <section className="pt-32 pb-24 px-6 text-center">
        <motion.div {...fade} className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight">
            Simple pricing
          </h1>
          <p className="mt-6 text-xl text-gray-300">
            Generate for free. Pay only to publish.
          </p>
        </motion.div>
      </section>

      {/* PLANS */}
      <section className="px-6 pb-32">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* FREE */}
          <PlanCard
            title="Free"
            price="0"
            subtitle="Try it out"
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
            features={[
              "Publish 1 website",
              "1 page",
              "Custom domain support",
              "Cancel anytime",
            ]}
            highlight
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
      <footer className="border-t border-white/10 py-12 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} AutopilotAI
      </footer>
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
  features,
  cta,
  onClick,
  disabled,
  highlight = false,
}: {
  title: string;
  price: string;
  subtitle: string;
  features: string[];
  cta: string;
  onClick?: () => void;
  disabled?: boolean;
  highlight?: boolean;
}) {
  return (
    <motion.div
      {...fade}
      className={`rounded-3xl border p-10 ${
        highlight
          ? "border-[#6d8ce8] bg-white/5"
          : "border-white/10 bg-white/3"
      }`}
    >
      <h3 className="text-3xl font-bold">{title}</h3>
      <p className="mt-2 text-gray-400">{subtitle}</p>

      <div className="mt-8 flex items-end gap-2">
        <span className="text-6xl font-black">${price}</span>
        <span className="text-lg text-gray-400">/month</span>
      </div>

      <ul className="mt-8 space-y-4">
        {features.map((f) => (
          <li key={f} className="flex gap-3 text-gray-200">
            <Check className="w-5 h-5 text-[#6d8ce8] mt-0.5" />
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <button
          onClick={onClick}
          disabled={disabled}
          className={`w-full py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 transition
            ${
              disabled
                ? "bg-white/10 text-gray-400 cursor-not-allowed"
                : "bg-[#345899] hover:bg-[#3f6bc5]"
            }`}
        >
          {cta}
          {!disabled && <ArrowRight className="w-5 h-5" />}
        </button>
      </div>
    </motion.div>
  );
}
