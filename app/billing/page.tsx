"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";

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

  const [name, setName] = useState("U");
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/api/auth/me")
      .then((res) => {
        setData(res.data);
        if (res.data?.name) setName(res.data.name.charAt(0).toUpperCase());
        if (res.data?.subscription) setSubscriptionPlan(res.data.subscription);
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [router]);

  const planLabel = (sub?: string) => {
    if (!sub) return "Free";
    return sub.charAt(0).toUpperCase() + sub.slice(1);
  };

  const usageText = (d: MeResponse) => {
    if (d.monthly_limit === null) return "Unlimited generations";
    const used = d.used_generations ?? 0;
    return `${used} of ${d.monthly_limit} generations used`;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070d] flex items-center justify-center text-gray-400">
        Loading billing details…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#05070d] flex items-center justify-center">
        <p className="text-gray-300">
          Unable to load billing information. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070d] text-white relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 w-[900px] h-[900px] bg-[conic-gradient(at_top_left,var(--tw-gradient-stops))] from-[#0c1a39] via-[#0a1630] to-transparent blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[900px] h-[900px] bg-[conic-gradient(at_bottom_right,var(--tw-gradient-stops))] from-[#0d1b3d] via-[#111a2c] to-transparent blur-[200px]" />
      </div>

      <DashboardNavbar name={name} subscriptionPlan={subscriptionPlan ?? undefined} />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">

        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-light">
            Billing & Subscription
          </h1>
          <p className="mt-6 text-xl text-gray-300">
            Manage your plan, view usage, and update payment details.
          </p>
        </motion.section>

        {/* Plan + Usage Grid */}
        <section className="grid gap-10 md:grid-cols-[2fr,1fr] mb-20">

          {/* Current Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-12 shadow-[0_50px_120px_rgba(0,0,0,.55)]"
          >
            <h3 className="text-2xl font-semibold mb-4 text-white">Current Plan</h3>

            <p className="text-gray-300 mb-8">
              Account: <span className="font-medium text-white">{data.email}</span>
            </p>

            <div className="mb-10">
              <p className="text-4xl font-semibold">
                {planLabel(data.subscription)}
              </p>

              {data.subscription?.toLowerCase() === "free" && (
                <span className="inline-block mt-3 px-4 py-2 bg-white/10 text-gray-200 rounded-xl text-sm font-medium border border-white/10">
                  Free Tier
                </span>
              )}
            </div>

            <p className="text-gray-300 mb-10">
              {data.subscription === "free"
                ? "Limited access to get started. Upgrade for full capabilities."
                : data.subscription === "basic"
                ? "Essential tools for individuals and small teams."
                : data.subscription === "growth"
                ? "Unlimited generations and priority processing for scaling businesses."
                : "Maximum performance with advanced features and dedicated support."}
            </p>

            {data.subscription?.toLowerCase() === "free" ? (
              <button
                onClick={() => router.push("/pricing")}
                className="px-10 py-4 bg-white text-[#1b2f54] rounded-xl font-medium hover:bg-gray-200 transition"
              >
                Upgrade Plan
              </button>
            ) : (
              <button
                onClick={openStripePortal}
                disabled={portalLoading}
                className="px-10 py-4 bg-white text-[#1b2f54] rounded-xl font-medium hover:bg-gray-200 transition disabled:opacity-60"
              >
                {portalLoading ? "Opening portal…" : "Manage Subscription"}
              </button>
            )}
          </motion.div>

          {/* Usage */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-12 shadow-[0_50px_120px_rgba(0,0,0,.55)]"
          >
            <h3 className="text-2xl font-semibold text-white mb-6">
              Usage This Month
            </h3>

            <p className="text-3xl font-medium mb-8">
              {usageText(data)}
            </p>

            {data.monthly_limit !== null && (
              <>
                <div className="h-4 bg-white/10 rounded-full overflow-hidden mb-6">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(
                        100,
                        ((data.used_generations ?? 0) / (data.monthly_limit || 1)) * 100
                      )}%`,
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#1c2f57] to-[#2b4e8d]"
                  />
                </div>

                <p className="text-gray-300">
                  {data.remaining_generations} generations remaining
                </p>
              </>
            )}

            {data.last_reset && (
              <p className="mt-8 text-sm text-gray-400">
                Last reset: {new Date(data.last_reset).toLocaleDateString()}
              </p>
            )}
          </motion.div>
        </section>

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
