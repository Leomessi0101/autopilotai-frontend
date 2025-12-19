"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/lib/api";

type MeResponse = {
  name: string;
  email: string;
  subscription: string;
  used_generations: number;
  monthly_limit: number | null;
  remaining_generations: number | null;
  last_reset: string | null;
};

export default function BillingPage() {
  const router = useRouter();

  const [data, setData] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/api/auth/me")
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const planLabel = (sub?: string) => {
    if (!sub) return "Free";
    return sub.charAt(0).toUpperCase() + sub.slice(1);
  };

  const usageText = (d: MeResponse) => {
    if (d.monthly_limit === null) return "Unlimited generations";
    const used = d.used_generations ?? 0;
    const limit = d.monthly_limit;
    return `${used} used / ${limit} total`;
  };

  const openStripePortal = async () => {
    try {
      setPortalLoading(true);
      const res = await api.post("/api/stripe/customer-portal");
      window.location.href = res.data.url;
    } catch {
      alert("Could not open billing portal.");
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* TOP BAR */}
      <div className="w-full py-6 px-10 border-b border-gray-200 flex items-center justify-between">
        <h1
          onClick={() => router.push("/dashboard")}
          className="text-2xl font-bold tracking-tight cursor-pointer"
        >
          AutopilotAI<span className="text-amber-500">.</span>
        </h1>

        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 rounded-full border border-gray-300 hover:border-amber-400 hover:text-amber-600 transition text-sm"
        >
          ← Back to dashboard
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="px-10 pt-16 pb-20 max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold tracking-tight mb-4"
        >
          Billing & Subscription
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 mb-12"
        >
          View your current plan, usage, and manage your subscription.
        </motion.p>

        {loading ? (
          <div className="border border-gray-200 rounded-3xl p-10 bg-white">
            <p className="text-gray-500">Loading your billing details…</p>
          </div>
        ) : !data ? (
          <div className="border border-red-200 bg-red-50 text-red-800 rounded-3xl p-6">
            <p>Could not load your billing information. Please refresh.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-[2fr,1.5fr]">

            {/* PLAN CARD */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-gray-200 rounded-3xl p-10 bg-white shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-2">Current Plan</h3>
              <p className="text-sm text-gray-500 mb-6">
                Linked to <span className="font-mono">{data.email}</span>
              </p>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-bold">
                  {planLabel(data.subscription)}
                </span>

                {data.subscription?.toLowerCase() === "free" && (
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
                    Free tier
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-8">
                {data.subscription === "free"
                  ? "Start your journey with limited generation access."
                  : data.subscription === "basic"
                  ? "Basic — perfect for small businesses getting started with automation."
                  : data.subscription === "growth"
                  ? "Growth — unlimited automation & content for scaling businesses."
                  : "Pro — full power, AI images & priority processing."}
              </p>

              {data.subscription?.toLowerCase() === "free" ? (
                <button
                  onClick={() => router.push("/pricing")}
                  className="px-7 py-3 rounded-full bg-black text-white text-sm hover:bg-gray-900 transition"
                >
                  Upgrade plan
                </button>
              ) : (
                <button
                  onClick={openStripePortal}
                  disabled={portalLoading}
                  className="px-7 py-3 rounded-full bg-black text-white text-sm hover:bg-gray-900 transition disabled:opacity-50"
                >
                  {portalLoading ? "Opening portal…" : "Manage subscription"}
                </button>
              )}
            </motion.div>

            {/* USAGE CARD */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="border border-gray-200 rounded-3xl p-10 bg-white shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-4">
                Usage this month
              </h3>

              <p className="text-gray-800 text-lg mb-2">
                {usageText(data)}
              </p>

              {data.monthly_limit !== null && (
                <>
                  <div className="w-full h-2 rounded-full bg-gray-100 mt-4 mb-4 overflow-hidden">
                    <div
                      className="h-full bg-amber-500"
                      style={{
                        width: `${Math.min(
                          100,
                          ((data.used_generations ?? 0) /
                            (data.monthly_limit || 1)) * 100
                        )}%`,
                      }}
                    />
                  </div>

                  <p className="text-sm text-gray-600">
                    {data.remaining_generations} generations remaining
                  </p>
                </>
              )}

              {data.last_reset && (
                <p className="text-xs text-gray-500 mt-6">
                  Last reset: {new Date(data.last_reset).toLocaleString()}
                </p>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
