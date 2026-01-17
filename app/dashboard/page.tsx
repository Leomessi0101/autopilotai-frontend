"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";

/* =========================
   UTILS
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

/* =========================
   PAGE
========================= */

export default function DashboardPage() {
  const router = useRouter();

  /* =========================
     USER
  ========================= */

  const [initial, setInitial] = useState("U");
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

  /* =========================
     WEBSITE STATE
  ========================= */

  const [loadingSite, setLoadingSite] = useState(true);
  const [existingSite, setExistingSite] = useState<null | {
    username: string;
  }>(null);

  /* =========================
     INPUTS (CREATE FLOW)
  ========================= */

  const [username, setUsername] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [goal, setGoal] = useState("");
  const [whatYouDo, setWhatYouDo] = useState("");
  const [location, setLocation] = useState("");
  const [creating, setCreating] = useState(false);

  const cleanedUsername = useMemo(
    () => normalizeSlug(username),
    [username]
  );
  const usernameValid = useMemo(
    () => isValidSlug(cleanedUsername),
    [cleanedUsername]
  );

  const [toast, setToast] = useState<
    null | { type: "ok" | "err"; msg: string }
  >(null);

  /* =========================
     LOAD USER + WEBSITE
  ========================= */

  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function load() {
      try {
        const me = await api.get("/api/auth/me");
        if (me.data?.name) {
          setInitial(me.data.name.charAt(0).toUpperCase());
        }
        if (me.data?.subscription) {
          setSubscriptionPlan(me.data.subscription);
        }

        const site = await api.get("/api/dashboard/websites/me");
        if (site.data?.exists && site.data.username) {
          setExistingSite({ username: site.data.username });
        }
      } catch {
        localStorage.removeItem("autopilot_token");
        router.push("/login");
      } finally {
        setLoadingSite(false);
      }
    }

    load();
  }, [router]);

  /* =========================
     CREATE WEBSITE
  ========================= */

  async function generateWebsite() {
    if (!usernameValid) {
      setToast({
        type: "err",
        msg: "Website name must be 3–30 characters (a–z, 0–9, hyphen)",
      });
      setTimeout(() => setToast(null), 2500);
      return;
    }

    if (!businessType || !goal || !whatYouDo.trim()) {
      setToast({
        type: "err",
        msg: "Please fill out business type, goal, and what you do",
      });
      setTimeout(() => setToast(null), 2500);
      return;
    }

    setCreating(true);
    setToast(null);

    const aiPrompt = `
Business type: ${businessType}
Primary goal: ${goal}
What we do: ${whatYouDo}
${location ? `Location: ${location}` : ""}
    `.trim();

    try {
      const res = await api.post("/api/dashboard/websites/create", {
        username: cleanedUsername,
        prompt: aiPrompt,
        ai_prompt: aiPrompt,
      });

      const u = res.data.username || cleanedUsername;
      router.push(`/r/${u}?edit=1`);
    } catch (err: any) {
      setToast({
        type: "err",
        msg:
          err?.response?.data?.detail ||
          "Failed to generate website. Try again.",
      });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setCreating(false);
    }
  }

  /* =========================
     RENDER
  ========================= */

  if (loadingSite) {
    return (
      <div className="min-h-screen bg-[#05070d] text-white flex items-center justify-center">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <DashboardNavbar name={initial} subscriptionPlan={subscriptionPlan} />

      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div
            className={cx(
              "px-4 py-2 rounded-full text-sm font-semibold",
              toast.type === "ok"
                ? "bg-white text-black"
                : "bg-red-500/20 text-red-200 border border-red-500/30"
            )}
          >
            {toast.msg}
          </div>
        </div>
      )}

      <main className="max-w-3xl mx-auto px-6 py-24">
        {existingSite ? (
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#020617] p-10">
            <h1 className="text-4xl font-semibold">Your website</h1>
            <p className="mt-4 text-lg text-gray-300">
              Your site is live and ready to edit.
            </p>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() =>
                  router.push(`/r/${existingSite.username}?edit=1`)
                }
                className="flex-1 py-4 rounded-xl bg-indigo-500 hover:bg-indigo-400 font-semibold"
              >
                Edit website
              </button>

              <a
                href={`/r/${existingSite.username}`}
                target="_blank"
                className="flex-1 py-4 rounded-xl border border-white/10 bg-white/5 text-center font-semibold"
              >
                View live
              </a>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#020617] p-10">
            <h1 className="text-4xl font-semibold mb-6">
              Create your website with AI
            </h1>

            {/* Guided inputs */}
            <div className="grid gap-4 mb-6">
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full rounded-xl px-5 py-4 bg-black/40 border border-white/10"
              >
                <option value="">Business type</option>
                <option>Local service</option>
                <option>Restaurant</option>
                <option>Agency</option>
                <option>Consultant / Coach</option>
                <option>Online business</option>
              </select>

              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full rounded-xl px-5 py-4 bg-black/40 border border-white/10"
              >
                <option value="">Primary goal</option>
                <option>Get leads</option>
                <option>Get bookings</option>
                <option>Get quote requests</option>
                <option>Drive visitors to location</option>
              </select>

              <input
                value={whatYouDo}
                onChange={(e) => setWhatYouDo(e.target.value)}
                placeholder="What do you do? (one sentence)"
                className="w-full rounded-xl px-5 py-4 bg-black/40 border border-white/10"
              />

              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location (optional)"
                className="w-full rounded-xl px-5 py-4 bg-black/40 border border-white/10"
              />
            </div>

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="website-name"
              className={cx(
                "w-full rounded-xl px-5 py-4 bg-black/40 border mb-6",
                usernameValid
                  ? "border-white/10"
                  : "border-red-500/40"
              )}
            />

            <button
              onClick={generateWebsite}
              disabled={creating}
              className={cx(
                "w-full py-4 rounded-xl font-semibold",
                creating
                  ? "bg-white/60 text-black"
                  : "bg-indigo-500 hover:bg-indigo-400"
              )}
            >
              {creating ? "Generating website…" : "Generate website"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
