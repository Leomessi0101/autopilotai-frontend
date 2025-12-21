"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function DashboardPage() {
  const router = useRouter();

  const [name, setName] = useState("U");
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [usage, setUsage] = useState<{ used: number; limit: number | null }>({
    used: 0,
    limit: 10,
  });

  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

        if (res.data?.subscription)
          setSubscriptionPlan(res.data.subscription);
      })
      .catch(() => {
        localStorage.removeItem("autopilot_token");
        router.push("/login");
      });

    api.get("/api/usage")
      .then((res) => {
        setUsage({
          used: res.data.used,
          limit: res.data.limit,
        });
      })
      .catch(() => {});

    api.get("/api/work")
      .then((res) => setActivity(res.data.slice(0, 5)))
      .finally(() => setLoading(false));

  }, [router]);

  const percent =
    usage.limit === null
      ? 0
      : Math.min(100, Math.round((usage.used / usage.limit) * 100));

  return (
    <div className="min-h-screen bg-white text-black">

      {/* 🌟 UNIVERSAL NAVBAR */}
      <DashboardNavbar name={name} subscriptionPlan={subscriptionPlan} />

      {/* MAIN */}
      <div className="px-6 md:px-16 py-12 max-w-7xl mx-auto">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold">
            Welcome back<span className="text-amber-500">.</span>
          </h1>

          <p className="text-gray-600 mt-2 text-lg">
            Everything you need to build, sell and grow — powered by AI.
          </p>

          {subscriptionPlan && (
            <p className="mt-1 text-xs text-gray-500">
              Plan:{" "}
              <span className="capitalize font-medium">
                {subscriptionPlan}
              </span>
            </p>
          )}
        </div>

        {/* METRICS */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
        >
          <MetricCard
            title="AI Generations"
            value={usage.used}
            subtitle={usage.limit === null ? "Unlimited" : `of ${usage.limit} this month`}
          />

          <MetricCard
            title="Saved Work"
            value={activity.length}
            subtitle="Recently created"
          />

          <MetricCard
            title="Account Plan"
            value={subscriptionPlan ?? "Free"}
            subtitle="Upgrade anytime"
          />

          <MetricCard
            title="Status"
            value="Active"
            subtitle="Account in good standing"
          />
        </motion.div>

        {/* QUICK ACTIONS */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">

          <ActionCard
            title="Create Content"
            desc="Posts, captions, scripts & more"
            button="Open"
            onClick={() => router.push("/dashboard/content")}
          />

          <ActionCard
            title="Write Emails"
            desc="Outreach, follow-ups, replies"
            button="Open"
            onClick={() => router.push("/dashboard/email")}
          />

          <ActionCard
            title="Generate Ads"
            desc="High-converting ad copy"
            button="Open"
            onClick={() => router.push("/dashboard/ads")}
          />
        </div>

        {/* USAGE */}
        <div className="mt-16 p-8 rounded-3xl border border-gray-200 bg-white shadow-sm max-w-4xl">
          <h3 className="text-xl font-semibold mb-2">Monthly Usage</h3>
          <p className="text-gray-600 mb-4">
            Track how many AI generations you’ve used this month.
          </p>

          {usage.limit === null ? (
            <p className="font-medium">Unlimited plan 🔥</p>
          ) : (
            <>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <p className="mt-3 text-sm text-gray-700">
                {usage.used} / {usage.limit} used
              </p>
            </>
          )}
        </div>

        {/* RECENT ACTIVITY */}
        <div className="mt-16 mb-24">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : activity.length === 0 ? (
            <p className="text-gray-600">
              You haven’t generated anything yet. Start creating!
            </p>
          ) : (
            <div className="space-y-4 max-w-3xl">
              {activity.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="p-5 border border-gray-200 rounded-2xl hover:border-amber-400 hover:shadow-sm transition"
                >
                  <p className="text-sm font-semibold text-amber-700 mb-1">
                    {item.content_type.toUpperCase()}
                  </p>
                  <p className="text-gray-800 line-clamp-2">
                    {item.result}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */
function MetricCard({ title, value, subtitle }: any) {
  return (
    <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
      <p className="text-sm uppercase tracking-wide text-gray-500">
        {title}
      </p>
      <h3 className="text-3xl font-bold mt-1">{value}</h3>
      <p className="text-gray-600 text-sm mt-1">{subtitle}</p>
    </div>
  );
}

function ActionCard({ title, desc, button, onClick }: any) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-8 rounded-3xl border border-gray-200 bg-white shadow-sm"
    >
      <h4 className="text-xl font-semibold">{title}</h4>
      <p className="text-gray-600 mt-2">{desc}</p>

      <button
        onClick={onClick}
        className="mt-6 px-6 py-3 rounded-full bg-black text-white hover:bg-gray-900 transition"
      >
        {button}
      </button>
    </motion.div>
  );
}
