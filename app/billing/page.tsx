"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/lib/api";

type MeResponse = {
  name: string;
  email: string;
  subscription: string; // "Free" | "basic" | "growth" | "pro"
  used_generations: number;
  monthly_limit: number | null;
  remaining_generations: number | null;
  last_reset: string | null;
};

export default function BillingPage() {
  const router = useRouter();

  const [data, setData] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

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

  const planLabel = (sub: string | undefined) => {
    if (!sub) return "Free";
    if (sub.toLowerCase() === "basic") return "Basic";
    if (sub.toLowerCase() === "growth") return "Growth";
    if (sub.toLowerCase() === "pro") return "Pro";
    return sub;
  };

  const planDescription = (sub: string | undefined) => {
    if (!sub || sub.toLowerCase() === "free") {
      return "You are on the Free plan. Upgrade to unlock more AI power.";
    }
    if (sub.toLowerCase() === "basic") {
      return "Basic — perfect for small businesses getting started with automation.";
    }
    if (sub.toLowerCase() === "growth") {
      return "Growth — unlimited automation & content for scaling businesses.";
    }
    if (sub.toLowerCase() === "pro") {
      return "Pro — full power, AI images & priority processing.";
    }
    return "";
  };

  const usageText = (d: MeResponse) => {
    if (d.monthly_limit === null) {
      return "Unlimited generations";
    }
    const used = d.used_generations ?? 0;
    const limit = d.monthly_limit;
    const remaining =
      d.remaining_generations ?? Math.max(0, limit - used);
    return `${used} used / ${limit} total • ${remaining} left this month`;
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
      <div className="px-10 pt-16 pb-20 max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold tracking-tight mb-4"
        >
          Billing & Plan
        </motion.h2>

        <p className="text-gray-600 mb-10">
          View your current subscription and usage. Manage upgrades and billing
          from here.
        </p>

        {loading ? (
          <div className="border border-gray-200 rounded-3xl p-8 bg-white">
            <p className="text-gray-500">Loading your billing details…</p>
          </div>
        ) : !data ? (
          <div className="border border-red-200 bg-red-50 text-red-800 rounded-3xl p-6">
            <p>Could not load your billing information. Please try again.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-[2fr,1.5fr]">
            {/* CURRENT PLAN CARD */}
            <div className="border border-gray-200 rounded-3xl p-8 bg-white shadow-sm">
              <h3 className="text-xl font-semibold mb-2">
                Current plan
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Linked to: <span className="font-mono">{data.email}</span>
              </p>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-bold">
                  {planLabel(data.subscription)}
                </span>
                {data.subscription?.toLowerCase() === "free" && (
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    Free tier
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-6">
                {planDescription(data.subscription)}
              </p>

              <button
                onClick={() => router.push("/pricing")}
                className="px-6 py-3 rounded-full bg-black text-white text-sm hover:bg-gray-900 transition"
              >
                {data.subscription?.toLowerCase() === "free"
                  ? "Upgrade plan"
                  : "Change plan"}
              </button>
            </div>

            {/* USAGE CARD */}
            <div className="border border-gray-200 rounded-3xl p-8 bg-white shadow-sm">
              <h3 className="text-xl font-semibold mb-4">
                Usage this month
              </h3>

              <p className="text-gray-800 mb-2">
                {usageText(data)}
              </p>

              {data.monthly_limit !== null && (
                <div className="w-full h-2 rounded-full bg-gray-100 mt-4 mb-3 overflow-hidden">
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
              )}

              {data.last_reset && (
                <p className="text-xs text-gray-500 mt-2">
                  Last reset: {new Date(data.last_reset).toLocaleString()}
                </p>
              )}

              {data.subscription?.toLowerCase() === "free" && (
                <p className="text-xs text-gray-500 mt-4">
                  Upgrade to Basic, Growth, or Pro to increase your monthly
                  generation limits.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
