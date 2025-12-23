"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";

type User = {
  subscription_plan: "basic" | "growth" | "pro" | null;
};

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
        if (res.data?.name) setName(res.data.name.charAt(0).toUpperCase());
        if (res.data?.subscription) {
          setCurrentPlan(res.data.subscription.charAt(0).toUpperCase() + res.data.subscription.slice(1));
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
      const res = await api.post(`/api/stripe/create-checkout-session?plan=${plan}`);
      window.location.href = res.data.checkout_url;
    } catch {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <DashboardNavbar name={name} subscriptionPlan={currentPlan} />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-light text-gray-800">
            Upgrade Your Plan
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock unlimited generations, priority processing, and advanced features.
          </p>
        </motion.section>

        {/* Pricing Cards */}
        <section className="grid gap-10 md:grid-cols-3 mb-20">
          {/* Basic */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className={`bg-white rounded-2xl shadow-sm border ${currentPlan === "Basic" ? "border-blue-900" : "border-gray-200"} p-10 relative`}
          >
            {currentPlan === "Basic" && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-900 text-white text-sm font-medium rounded-full">
                Current Plan
              </span>
            )}
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Basic</h3>
            <p className="text-4xl font-light text-gray-900 mb-2">$19<span className="text-lg text-gray-600">/month</span></p>
            <ul className="space-y-4 text-gray-700 mb-10">
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
                <span>Up to 30 generations per month</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
                <span>Core content & ad tools</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
                <span>Email support</span>
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe("basic")}
              disabled={currentPlan === "Basic"}
              className={`w-full py-4 rounded-xl font-medium transition ${
                currentPlan === "Basic"
                  ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                  : "bg-blue-900 text-white hover:bg-blue-800 shadow-sm"
              }`}
            >
              {currentPlan === "Basic" ? "Current Plan" : "Select Basic"}
            </button>
          </motion.div>

          {/* Growth – Recommended */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={`bg-white rounded-2xl shadow-lg border ${currentPlan === "Growth" ? "border-blue-900" : "border-gray-200"} p-10 relative scale-105`}
          >
            {currentPlan === "Growth" && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-900 text-white text-sm font-medium rounded-full">
                Current Plan
              </span>
            )}
            <div className="mb-4">
              <span className="px-4 py-1 bg-teal-600 text-white text-sm font-medium rounded-full">
                Recommended
              </span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Growth</h3>
            <p className="text-4xl font-light text-gray-900 mb-2">$49<span className="text-lg text-gray-600">/month</span></p>
            <ul className="space-y-4 text-gray-700 mb-10">
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
                <span>Unlimited generations</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
                <span>Priority processing</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
                <span>Advanced features</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
                <span>Priority support</span>
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe("growth")}
              disabled={currentPlan === "Growth"}
              className={`w-full py-4 rounded-xl font-medium transition ${
                currentPlan === "Growth"
                  ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                  : "bg-blue-900 text-white hover:bg-blue-800 shadow-sm"
              }`}
            >
              {currentPlan === "Growth" ? "Current Plan" : "Upgrade to Growth"}
            </button>
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className={`bg-white rounded-2xl shadow-sm border ${currentPlan === "Pro" ? "border-blue-900" : "border-gray-200"} p-10 relative`}
          >
            {currentPlan === "Pro" && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-900 text-white text-sm font-medium rounded-full">
                Current Plan
              </span>
            )}
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Pro</h3>
            <p className="text-4xl font-light text-gray-900 mb-2">$99<span className="text-lg text-gray-600">/month</span></p>
            <ul className="space-y-4 text-gray-700 mb-10">
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
                <span>Everything in Growth</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
                <span>AI image generation</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
                <span>Long-form content</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
                <span>Advanced automation</span>
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe("pro")}
              disabled={currentPlan === "Pro"}
              className={`w-full py-4 rounded-xl font-medium transition ${
                currentPlan === "Pro"
                  ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                  : "bg-blue-900 text-white hover:bg-blue-800 shadow-sm"
              }`}
            >
              {currentPlan === "Pro" ? "Current Plan" : "Upgrade to Pro"}
            </button>
          </motion.div>
        </section>

        {/* Trust Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mb-20"
        >
          <p className="text-lg text-gray-600">
            Cancel or change plans anytime from Billing. No contracts.
          </p>
        </motion.section>

        {/* Contact Footer */}
        <footer className="text-center py-12 border-t border-gray-200">
          <p className="text-gray-600">
            Questions? Reach out at{" "}
            <a href="mailto:contact@autopilotai.dev" className="font-medium text-blue-900 hover:underline">
              contact@autopilotai.dev
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}