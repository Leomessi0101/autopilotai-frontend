"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function UpgradePage() {
  const router = useRouter();

  const [name, setName] = useState("U");
  const [currentPlan, setCurrentPlan] = useState<string>("Free");

  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/api/auth/me")
      .then((res) => {
        if (res.data?.name)
          setName(res.data.name.charAt(0).toUpperCase());

        if (res.data?.subscription) {
          setCurrentPlan(
            res.data.subscription.charAt(0).toUpperCase() +
              res.data.subscription.slice(1)
          );
        }
      })
      .catch(() => {
        localStorage.removeItem("autopilot_token");
        router.push("/login");
      });
  }, [router]);

  const handleSubscribe = async (plan: "basic" | "growth" | "pro") => {
    if (currentPlan.toLowerCase() === plan) return;

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
    <div className="min-h-screen bg-[#05070d] text-white relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 w-[900px] h-[900px] 
          bg-[conic-gradient(at_top_left,var(--tw-gradient-stops))] 
          from-[#0c1a39] via-[#0a1630] to-transparent blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[900px] h-[900px] 
          bg-[conic-gradient(at_bottom_right,var(--tw-gradient-stops))] 
          from-[#0d1b3d] via-[#111a2c] to-transparent blur-[200px]" />
      </div>

      <DashboardNavbar name={name} subscriptionPlan={currentPlan} />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">

        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-light">
            Upgrade Your Plan
          </h1>

          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
            Unlock unlimited generations, priority processing, and advanced features.
          </p>
        </motion.section>

        {/* Pricing Cards */}
        <section className="grid gap-10 md:grid-cols-3 mb-20">

          {/* BASIC */}
          <PlanCard
            title="Basic"
            price="$19"
            month
            active={currentPlan === "Basic"}
            features={[
              "Live website included",
              "Up to 30 generations per month",
              "Core content & ad tools",
              "Email support",
            ]}
            onClick={() => handleSubscribe("basic")}
          />

          {/* GROWTH */}
          <PlanCard
            title="Growth"
            price="$49"
            month
            recommended
            active={currentPlan === "Growth"}
            features={[
              "Live website included",
              "Unlimited generations",
              "Priority processing",
              "Advanced features",
              "Priority support",
            ]}
            onClick={() => handleSubscribe("growth")}
          />

          {/* PRO */}
          <PlanCard
            title="Pro"
            price="$99"
            month
            active={currentPlan === "Pro"}
            features={[
              "Live website included",
              "Everything in Growth",
              "AI image generation",
              "Long-form content",
              "Advanced automation",
            ]}
            onClick={() => handleSubscribe("pro")}
          />
        </section>

        {/* Trust */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mb-20"
        >
          <p className="text-lg text-gray-400">
            Cancel or change plans anytime from Billing. No contracts.
          </p>
        </motion.section>

        {/* Footer */}
        <footer className="text-center py-12 border-t border-white/10 text-gray-400">
          Questions? Email{" "}
          <a
            href="mailto:contact@autopilotai.dev"
            className="text-[#6d8ce8] hover:underline"
          >
            contact@autopilotai.dev
          </a>
        </footer>
      </main>
    </div>
  );
}

/* ============ PLAN CARD COMPONENT ============ */
function PlanCard({
  title,
  price,
  month,
  features,
  recommended,
  active,
  onClick,
}: {
  title: string;
  price: string;
  month?: boolean;
  features: string[];
  recommended?: boolean;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className={`rounded-2xl border 
        ${active ? "border-[#6d8ce8]" : "border-white/10"} 
        bg-white/5 backdrop-blur-xl 
        p-10 shadow-[0_40px_120px_rgba(0,0,0,.55)] relative`}
    >
      {active && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 
          bg-[#6d8ce8] text-white text-sm font-medium rounded-full">
          Current Plan
        </span>
      )}

      {recommended && (
        <span className="absolute -top-10 right-4 px-4 py-1 
          bg-teal-600 text-white text-sm font-medium rounded-full">
          Recommended
        </span>
      )}

      <h3 className="text-2xl font-semibold mb-4">{title}</h3>

      <p className="text-4xl font-light mb-2">
        {price}
        {month && <span className="text-lg text-gray-400">/month</span>}
      </p>

      <ul className="space-y-4 text-gray-300 mb-10">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-4">
            <div className="w-2 h-2 rounded-full bg-[#6d8ce8] mt-2" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onClick}
        disabled={active}
        className={`w-full py-4 rounded-xl font-medium transition 
          ${
            active
              ? "bg-white/10 text-gray-400 cursor-not-allowed"
              : "bg-white text-[#1b2f54] hover:bg-gray-200"
          }`}
      >
        {active ? "Current Plan" : `Choose ${title}`}
      </button>
    </motion.div>
  );
}