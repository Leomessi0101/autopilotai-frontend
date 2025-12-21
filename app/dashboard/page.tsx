"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function DashboardPage() {
  const router = useRouter();

  const [name, setName] = useState("U");
  const [subscriptionPlan, setSubscriptionPlan] =
    useState<string | null>(null);

  const [dark, setDark] = useState(false);

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
  }, [router]);

  return (
    <div className={dark ? "bg-black text-white" : "bg-white text-black"}>
      {/* NAVBAR */}
      <DashboardNavbar
        name={name}
        subscriptionPlan={subscriptionPlan}
      />

      <div className="px-6 md:px-16 py-14 max-w-7xl mx-auto transition">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Dashboard<span className="text-amber-500">.</span>
            </h1>
            <p className={dark ? "text-gray-400 mt-2" : "text-gray-600 mt-2"}>
              Everything you need to grow — in one place.
            </p>
          </div>

          <button
            onClick={() => setDark(!dark)}
            className="px-4 py-2 rounded-full border hover:opacity-80 transition text-sm"
          >
            {dark ? "Light Mode ☀️" : "Dark Mode 🌙"}
          </button>
        </div>

        {/* QUICK ACTIONS */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid md:grid-cols-3 gap-6 mt-12"
        >
          <ActionCard
            title="Generate Content"
            desc="Social posts, blogs, product descriptions and more"
            onClick={() => router.push("/dashboard/content")}
            dark={dark}
          />

          <ActionCard
            title="Write Emails"
            desc="Cold outreach, follow-ups, replies — in your voice"
            onClick={() => router.push("/dashboard/email")}
            dark={dark}
          />

          <ActionCard
            title="Create Ads"
            desc="High-converting Facebook, TikTok & Google copy"
            onClick={() => router.push("/dashboard/ads")}
            dark={dark}
          />
        </motion.div>

        {/* USAGE + PLAN */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <StatCard
            title="Your Plan"
            value={subscriptionPlan ?? "Free"}
            hint="Upgrade for unlimited usage and advanced tools"
            btn="View Plans"
            action={() => router.push("/pricing")}
            dark={dark}
          />

          <StatCard
            title="Saved Work"
            value="View Everything"
            hint="All generated content safely stored"
            btn="Open My Work"
            action={() => router.push("/dashboard/work")}
            dark={dark}
          />
        </div>

        {/* FINAL CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={
            dark
              ? "mt-12 p-8 rounded-3xl border border-gray-700 bg-black/40"
              : "mt-12 p-8 rounded-3xl border border-gray-200 bg-white"
          }
        >
          <h3 className="text-2xl font-semibold">
            Build faster with AutopilotAI
          </h3>
          <p className={dark ? "text-gray-400 mt-2" : "text-gray-600 mt-2"}>
            You focus on growth. AI handles writing, outreach and ads.
          </p>

          <button
            onClick={() => router.push("/dashboard/content")}
            className={
              dark
                ? "mt-6 px-6 py-3 rounded-full bg-white text-black hover:opacity-80"
                : "mt-6 px-6 py-3 rounded-full bg-black text-white hover:bg-gray-900"
            }
          >
            Start Creating →
          </button>
        </motion.div>

        <div className="h-20" />
      </div>
    </div>
  );
}

/* ====================
   COMPONENTS
==================== */

function ActionCard({ title, desc, onClick, dark }: any) {
  return (
    <div
      onClick={onClick}
      className={
        dark
          ? "p-7 rounded-3xl border border-gray-700 bg-black hover:border-amber-500 cursor-pointer transition"
          : "p-7 rounded-3xl border border-gray-200 bg-white hover:border-amber-400 cursor-pointer transition"
      }
    >
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className={dark ? "text-gray-400 mt-2" : "text-gray-600 mt-2"}>
        {desc}
      </p>

      <span className="inline-block mt-4 text-amber-500 font-medium">
        Open →
      </span>
    </div>
  );
}

function StatCard({ title, value, hint, btn, action, dark }: any) {
  return (
    <div
      className={
        dark
          ? "p-7 rounded-3xl border border-gray-700 bg-black"
          : "p-7 rounded-3xl border border-gray-200 bg-white"
      }
    >
      <p className="text-sm uppercase tracking-wide text-gray-500">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-2">{value}</h2>

      <p className={dark ? "text-gray-400 mt-2" : "text-gray-600 mt-2"}>
        {hint}
      </p>

      <button
        onClick={action}
        className={
          dark
            ? "mt-4 px-5 py-2 border border-gray-700 rounded-full hover:border-amber-400"
            : "mt-4 px-5 py-2 border border-gray-300 rounded-full hover:border-black"
        }
      >
        {btn}
      </button>
    </div>
  );
}
