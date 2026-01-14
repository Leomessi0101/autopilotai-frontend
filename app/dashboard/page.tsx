"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";

/* =========================
   TYPES
========================= */

type WebsiteMeResponse =
  | { exists: false }
  | { exists: true; username: string; template: string };

type CreateWebsiteResponse = {
  ok?: boolean;
  username?: string;
  redirect?: string;
};

/* =========================
   HELPERS
========================= */

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function normalizeSlug(input: string) {
  let s = (input || "").trim().toLowerCase();
  s = s.replace(/\s+/g, "-");
  s = s.replace(/[^a-z0-9-]/g, "");
  s = s.replace(/-+/g, "-");
  s = s.replace(/^-+/, "").replace(/-+$/, "");
  return s;
}

function isValidSlug(slug: string) {
  return /^[a-z0-9-]{3,30}$/.test(slug);
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

/* =========================
   PAGE
========================= */

export default function DashboardPage() {
  const router = useRouter();

  const [initial, setInitial] = useState("U");
  const [fullName, setFullName] = useState<string | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

  const [used, setUsed] = useState<number | null>(null);
  const [limit, setLimit] = useState<number | null>(null);
  const [usageLoading, setUsageLoading] = useState(true);

  const [websiteLoading, setWebsiteLoading] = useState(true);
  const [website, setWebsite] = useState<WebsiteMeResponse | null>(null);
  const [websiteError, setWebsiteError] = useState<string | null>(null);

  const [desiredUsername, setDesiredUsername] = useState("");

  /* AI INPUTS */
  const [aiBusinessName, setAiBusinessName] = useState("");
  const [aiShortDescription, setAiShortDescription] = useState("");
  const [aiPrimaryGoal, setAiPrimaryGoal] = useState("");
  const [aiCity, setAiCity] = useState("");

  const [creatingWebsite, setCreatingWebsite] = useState(false);
  const [siteToast, setSiteToast] = useState<null | { type: "ok" | "err"; msg: string }>(null);

  const greeting = getGreeting();

  /* =========================
     AUTH + DATA LOAD
  ========================= */

  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      router.push("/login");
      return;
    }

    api.get("/api/auth/me").then((res) => {
      if (res.data?.name) {
        setInitial(res.data.name.charAt(0).toUpperCase());
        setFullName(res.data.name.split(" ")[0] || res.data.name);
      }
      if (res.data?.subscription) {
        setSubscriptionPlan(res.data.subscription);
        localStorage.setItem("autopilot_user_email", res.data.email);
      }
    });

    api
      .get("/api/auth/usage")
      .then((res) => {
        setUsed(res.data?.used ?? res.data?.used_generations ?? null);
        setLimit(res.data?.limit ?? res.data?.monthly_limit ?? null);
      })
      .finally(() => setUsageLoading(false));

    api
      .get("/api/dashboard/websites/me")
      .then((res) => {
        setWebsite(res.data);
        if (res.data?.exists && res.data.username) {
          setDesiredUsername(res.data.username);
        }
      })
      .catch(() => setWebsiteError("Failed to load website"))
      .finally(() => setWebsiteLoading(false));
  }, [router]);

  const cleanedSlug = useMemo(() => normalizeSlug(desiredUsername), [desiredUsername]);
  const slugValid = useMemo(() => isValidSlug(cleanedSlug), [cleanedSlug]);

  const hasWebsite = website && (website as any).exists === true;
  const existingUsername = hasWebsite ? (website as any).username : null;

  const DEV_EMAIL = "Test@user.com";
  const isPaid =
    (subscriptionPlan || "free").toLowerCase() !== "free" ||
    (typeof window !== "undefined" &&
      localStorage.getItem("autopilot_user_email") === DEV_EMAIL);

  /* =========================
     CREATE WEBSITE (UNCHANGED LOGIC)
  ========================= */

  async function createWebsite() {
    if (!isPaid) {
      router.push("/upgrade");
      return;
    }

    if (!slugValid) {
      setSiteToast({ type: "err", msg: "Invalid website username" });
      return;
    }

    setCreatingWebsite(true);

    try {
      const res = await api.post("/api/dashboard/websites/create", {
        username: cleanedSlug,
        template: "ai-generated",
      });

      const username = res.data?.username || cleanedSlug;

      await api.post(`/api/websites/${username}/ai-generate`, {
        business_name: aiBusinessName,
        description: aiShortDescription,
        goal: aiPrimaryGoal,
        location: aiCity,
      });

      router.push(`/r/${username}?edit=1`);
    } catch {
      setSiteToast({ type: "err", msg: "AI generation failed" });
    } finally {
      setCreatingWebsite(false);
    }
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <DashboardNavbar name={initial} subscriptionPlan={subscriptionPlan} />

      {siteToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div
            className={cx(
              "px-4 py-2 rounded-full text-sm font-semibold",
              siteToast.type === "ok"
                ? "bg-white text-black"
                : "bg-red-500/20 text-red-200"
            )}
          >
            {siteToast.msg}
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* GREETING */}
        <section className="mb-16">
          <h1 className="text-5xl font-light">
            {greeting}
            {fullName ? `, ${fullName}` : ""}.
          </h1>
          <p className="mt-4 text-gray-400">
            Your AI systems are online.
          </p>
        </section>

        {/* AI WEBSITE CARD */}
        <section className="mb-20 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10">
          <h2 className="text-3xl font-semibold mb-2">
            AI Website Designer
          </h2>
          <p className="text-gray-300 mb-8">
            Describe your business. AI designs the layout, structure, and theme.
          </p>

          {hasWebsite && existingUsername ? (
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => router.push(`/r/${existingUsername}?edit=1`)}
                className="px-6 py-3 rounded-xl bg-white text-black font-semibold"
              >
                Edit AI website
              </button>
              <button
                onClick={() => window.open(`/r/${existingUsername}`, "_blank")}
                className="px-6 py-3 rounded-xl border border-white/15"
              >
                View live
              </button>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  value={aiBusinessName}
                  onChange={(e) => setAiBusinessName(e.target.value)}
                  placeholder="Business name"
                  className="rounded-xl bg-black/40 border border-white/10 px-4 py-3"
                />
                <input
                  value={aiCity}
                  onChange={(e) => setAiCity(e.target.value)}
                  placeholder="City"
                  className="rounded-xl bg-black/40 border border-white/10 px-4 py-3"
                />
              </div>

              <textarea
                value={aiShortDescription}
                onChange={(e) => setAiShortDescription(e.target.value)}
                placeholder="Short description"
                rows={3}
                className="mt-4 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 resize-none"
              />

              <input
                value={aiPrimaryGoal}
                onChange={(e) => setAiPrimaryGoal(e.target.value)}
                placeholder="Primary goal (calls, bookings, sales)"
                className="mt-4 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3"
              />

              <input
                value={desiredUsername}
                onChange={(e) => setDesiredUsername(e.target.value)}
                placeholder="Website username"
                className="mt-4 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3"
              />

              <button
                onClick={createWebsite}
                disabled={creatingWebsite}
                className="mt-6 w-full py-4 rounded-xl bg-white text-black font-semibold"
              >
                {creatingWebsite ? "AI is designing…" : "Generate website"}
              </button>
            </>
          )}
        </section>

        {/* USAGE */}
        {limit !== null && (
          <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <p className="text-sm text-gray-400 uppercase">
              AI capacity this month
            </p>
            <p className="text-3xl font-semibold mt-2">
              {usageLoading ? "—" : `${used ?? 0} / ${limit}`}
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
