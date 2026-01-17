"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";
import { ArrowRight, Check } from "lucide-react";

/* =========================
   TYPES
========================= */
type Plan = "free" | "starter" | "pro";

interface User {
  name: string;
  subscription_plan: Plan;
}

/* =========================
   PAGE
========================= */
export default function UpgradePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/api/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("autopilot_token");
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const subscribe = async (plan: "starter" | "pro") => {
    try {
      const res = await api.post(
        `/api/stripe/create-checkout-session?plan=${plan}`
      );
      window.location.href = res.data.checkout_url;
    } catch {
      alert("Could not start checkout. Try again.");
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#05070d] text-white flex items-center justify-center">
        Loading…
      </div>
    );
  }

  const currentPlan = user.subscription_plan ?? "free";
  const nameInitial = user.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <DashboardNavbar
        name={nameInitial}
        subscriptionPlan={currentPlan}
      />

      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl font-black tracking-tight">
            Publish your website
          </h1>
          <p className="mt-6 text-xl text-gray-300">
            Upgrade to make your site live. Cancel anytime.
          </p>
        </motion.div>

        {/* PLANS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* FREE */}
          <PlanCard
            title="Free"
            price="$0"
            subtitle="Draft mode"
            active={currentPlan === "free"}
            features={[
              "Generate a full website",
              "Edit content and layout",
              "Preview in draft mode",
              "Publishing disabled",
            ]}
            disabled
            cta="Current plan"
          />

          {/* STARTER */}
          <PlanCard
            title="Starter"
            price="$10"
            subtitle="Make your site live"
            active={currentPlan === "starter"}
            features={[
              "Publish 1 website",
              "1 page",
              "Custom domain support",
              "Cancel anytime",
            ]}
            cta={
              currentPlan === "starter"
                ? "Current plan"
                : "Publish website"
            }
            onClick={() => subscribe("starter")}
          />

          {/* PRO */}
          <PlanCard
            title="Pro"
            price="$20"
            subtitle="More pages"
            active={currentPlan === "pro"}
            features={[
              "Publish 1 website",
              "Up to 3 pages",
              "Custom domain support",
              "Priority updates",
            ]}
            cta={
              currentPlan === "pro"
                ? "Current plan"
                : "Upgrade to Pro"
            }
            onClick={() => subscribe("pro")}
          />
        </section>

        {/* FOOTER NOTE */}
        <div className="mt-20 text-center text-gray-400">
          You can manage or cancel your subscription anytime from Billing.
        </div>
      </main>
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
  active,
  disabled,
  onClick,
}: {
  title: string;
  price: string;
  subtitle: string;
  features: string[];
  cta: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`rounded-3xl border p-10 bg-white/5 backdrop-blur-xl
        ${
          active
            ? "border-[#6d8ce8]"
            : "border-white/10"
        }`}
    >
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="mt-1 text-gray-400">{subtitle}</p>

      <div className="mt-6 flex items-end gap-2">
        <span className="text-5xl font-black">{price}</span>
        <span className="text-gray-400">/month</span>
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
          disabled={disabled || active}
          className={`w-full py-4 rounded-xl text-lg font-medium flex items-center justify-center gap-2
            ${
              disabled || active
                ? "bg-white/10 text-gray-400 cursor-not-allowed"
                : "bg-[#345899] hover:bg-[#3f6bc5]"
            }`}
        >
          {cta}
          {!disabled && !active && (
            <ArrowRight className="w-5 h-5" />
          )}
        </button>
      </div>
    </motion.div>
  );
}
