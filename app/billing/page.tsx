"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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

  const [menuOpen, setMenuOpen] = useState(false);
  const [name, setName] = useState("U");
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const isDark = theme === "dark";

  useEffect(() => {
    const saved = localStorage.getItem("autopilot-theme");
    if (saved === "dark") setTheme("dark");

    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/api/auth/me")
      .then((res) => {
        setData(res.data);
        if (res.data?.name)
          setName(res.data.name.charAt(0).toUpperCase());
        if (res.data?.subscription)
          setSubscriptionPlan(res.data.subscription);
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [router]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("autopilot-theme", next);
  };

  const planLabel = (sub?: string) => {
    if (!sub) return "Free";
    return sub.charAt(0).toUpperCase() + sub.slice(1);
  };

  const usageText = (d: MeResponse) => {
    if (d.monthly_limit === null) return "Unlimited generations";
    const used = d.used_generations ?? 0;
    return `${used} used / ${d.monthly_limit} total`;
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
    <div
      className={`min-h-screen flex transition-all duration-500 ${
        isDark ? "bg-[#0B0B0E] text-white" : "bg-white text-black"
      }`}
    >
      {/* SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col w-64 px-6 py-8 border-r ${
          isDark
            ? "bg-[#0F0F14] border-gray-800"
            : "bg-white border-gray-200"
        }`}
      >
        <h1
          onClick={() => router.push("/")}
          className="text-2xl font-semibold tracking-tight cursor-pointer"
        >
          AutopilotAI<span className="text-amber-500">.</span>
        </h1>

        <nav className="mt-12 space-y-4 text-sm">
          <SidebarItem label="Dashboard" onClick={() => router.push("/dashboard")} />
          <SidebarItem label="Generate Content" onClick={() => router.push("/dashboard/content")} />
          <SidebarItem label="Write Emails" onClick={() => router.push("/dashboard/email")} />
          <SidebarItem label="Create Ads" onClick={() => router.push("/dashboard/ads")} />
          <SidebarItem label="My Work" onClick={() => router.push("/dashboard/work")} />
          <SidebarItem label="Profile" onClick={() => router.push("/dashboard/profile")} />
          <SidebarItem label="Billing" active />
          <SidebarItem label="Pricing" onClick={() => router.push("/pricing")} />
        </nav>

        <div className="mt-auto pt-6 text-xs text-gray-500">
          Control your plan. Stay in charge.
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 overflow-y-auto px-6 md:px-16 py-10">

        {/* TOP BAR */}
        <div
          className={`flex justify-between items-center sticky top-0 z-50 backdrop-blur-xl border-b mb-6 pb-4 ${
            isDark ? "border-gray-800 bg-[#0B0B0E]/80" : "border-gray-200 bg-white/80"
          }`}
        >
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-2">
              Billing & Subscription
            </h2>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              View your plan, usage, and manage your subscription.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-full border text-sm transition ${
                isDark
                  ? "border-gray-700 hover:border-amber-500"
                  : "border-gray-300 hover:border-black"
              }`}
            >
              {isDark ? "Light Mode" : "Dark Mode"}
            </button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setMenuOpen(true)}
              className={`relative w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold shadow-sm ${
                isDark
                  ? "bg-[#13131A] text-white"
                  : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700"
              }`}
            >
              {name}
              <span className="absolute inset-0 rounded-full ring-2 ring-amber-400 opacity-40" />
            </motion.button>
          </div>

          {/* PROFILE PANEL */}
          <AnimatePresence>
            {menuOpen && (
              <>
                <motion.div
                  className="fixed inset-0 bg-black/40"
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />

                <motion.aside
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ type: "spring", stiffness: 260, damping: 26 }}
                  className={`fixed top-20 right-6 w-80 rounded-3xl border shadow-2xl z-50 overflow-hidden backdrop-blur-xl ${
                    isDark
                      ? "bg-[#0F0F14]/95 border-gray-800"
                      : "bg-white/95 border-gray-200"
                  }`}
                >
                  <div
                    className={`relative px-6 pt-6 pb-4 border-b ${
                      isDark ? "bg-[#13131A]" : "bg-amber-50"
                    }`}
                  >
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="absolute right-4 top-4 text-sm text-gray-500 hover:text-black"
                    >
                      ✕
                    </button>

                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                          isDark ? "bg-black text-white" : "bg-black text-white"
                        }`}
                      >
                        {name}
                      </div>
                      <div>
                        <p className="text-xs uppercase text-gray-500">Plan</p>
                        <p className="font-bold capitalize">
                          {subscriptionPlan ?? "Free"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <MenuItem label="Dashboard" onClick={() => router.push("/dashboard")} />
                    <MenuItem label="Subscription Plans" onClick={() => router.push("/pricing")} />

                    <div className="border-t mt-2 pt-2">
                      <MenuItem
                        label="Log out"
                        danger
                        onClick={() => {
                          localStorage.removeItem("autopilot_token");
                          router.push("/login");
                        }}
                      />
                    </div>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* CONTENT */}
        <div className="mt-10 max-w-6xl">

          {loading ? (
            <div
              className={`rounded-3xl p-10 shadow-xl border ${
                isDark ? "bg-[#0F0F14] border-gray-800" : "bg-white border-gray-200"
              }`}
            >
              <p className={isDark ? "text-gray-400" : "text-gray-500"}>
                Loading your billing details…
              </p>
            </div>
          ) : !data ? (
            <div className="border border-red-300 bg-red-100 text-red-800 rounded-3xl p-6">
              Could not load your billing information. Please refresh.
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-[2fr,1.5fr]">

              {/* PLAN CARD */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`rounded-3xl p-10 shadow-xl border ${
                  isDark ? "bg-[#0F0F14] border-gray-800" : "bg-white border-gray-200"
                }`}
              >
                <h3 className="text-xl font-semibold mb-2">Current Plan</h3>
                <p className={isDark ? "text-gray-400 mb-6" : "text-gray-500 mb-6"}>
                  Linked to <span className="font-mono">{data.email}</span>
                </p>

                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-4xl font-bold">
                    {planLabel(data.subscription)}
                  </span>

                  {data.subscription?.toLowerCase() === "free" && (
                    <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs">
                      Free Tier
                    </span>
                  )}
                </div>

                <p className={isDark ? "text-gray-400 mb-8" : "text-gray-600 mb-8"}>
                  {data.subscription === "free"
                    ? "Start your journey with limited access. Upgrade when you’re ready."
                    : data.subscription === "basic"
                    ? "Basic — perfect for small businesses getting started with automation."
                    : data.subscription === "growth"
                    ? "Growth — unlimited automation & content for scaling businesses."
                    : "Pro — full power, AI images, campaigns & priority queue."}
                </p>

                {data.subscription?.toLowerCase() === "free" ? (
                  <button
                    onClick={() => router.push("/pricing")}
                    className="px-7 py-3 rounded-full bg-black text-white text-sm hover:opacity-90 transition"
                  >
                    Upgrade plan
                  </button>
                ) : (
                  <button
                    onClick={openStripePortal}
                    disabled={portalLoading}
                    className="px-7 py-3 rounded-full bg-black text-white text-sm hover:opacity-90 transition disabled:opacity-50"
                  >
                    {portalLoading ? "Opening portal…" : "Manage subscription"}
                  </button>
                )}
              </motion.div>

              {/* USAGE */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className={`rounded-3xl p-10 shadow-xl border ${
                  isDark ? "bg-[#0F0F14] border-gray-800" : "bg-white border-gray-200"
                }`}
              >
                <h3 className="text-xl font-semibold mb-4">
                  Usage this month
                </h3>

                <p className="text-lg mb-2">
                  {usageText(data)}
                </p>

                {data.monthly_limit !== null && (
                  <>
                    <div className="w-full h-2 rounded-full bg-gray-200 mt-4 mb-4 overflow-hidden">
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

                    <p className={isDark ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>
                      {data.remaining_generations} generations remaining
                    </p>
                  </>
                )}

                {data.last_reset && (
                  <p className={isDark ? "text-gray-500 text-xs mt-6" : "text-gray-500 text-xs mt-6"}>
                    Last reset: {new Date(data.last_reset).toLocaleString()}
                  </p>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function SidebarItem({ label, onClick, active = false }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left py-2 transition text-sm ${
        active
          ? "text-amber-500 font-semibold"
          : "hover:translate-x-1"
      }`}
    >
      {label}
    </button>
  );
}

function MenuItem({ label, onClick, danger = false }: any) {
  return (
    <motion.button
      whileHover={{ x: 6 }}
      onClick={onClick}
      className={`w-full px-6 py-3 text-left text-sm ${
        danger ? "text-red-500" : "text-gray-700"
      } hover:bg-gray-100 dark:hover:bg-[#13131A]`}
    >
      {label}
    </motion.button>
  );
}
