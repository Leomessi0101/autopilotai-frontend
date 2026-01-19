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
  const [businessDescription, setBusinessDescription] = useState("");
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
     CREATE WEBSITE (AI)
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

    if (!businessDescription.trim()) {
      setToast({
        type: "err",
        msg: "Describe your business so the AI knows what to build",
      });
      setTimeout(() => setToast(null), 2500);
      return;
    }

    setCreating(true);
    setToast(null);

    try {
      const res = await api.post("/api/dashboard/websites/create", {
        username: cleanedUsername,
        prompt: businessDescription.trim(),
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <DashboardNavbar name={initial} subscriptionPlan={subscriptionPlan} />

      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div
            className={cx(
              "px-4 py-2 rounded-full text-sm font-semibold backdrop-blur",
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
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900 to-black p-10">
            <h1 className="text-4xl font-semibold">Your AI website</h1>
            <p className="mt-4 text-lg text-gray-400">
              Your website is live. You can edit everything — content, layout, tone.
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
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900 to-black p-10">
            <h1 className="text-4xl font-semibold mb-3">
              Build a website with AI
            </h1>
            <p className="text-gray-400 mb-8">
              Describe your business in plain language. AutopilotAI writes the
              content, designs the layout, and builds a real website you can edit.
            </p>

            <div className="grid gap-4 mb-8">
              <textarea
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                rows={5}
                placeholder="Example: I run a local basketball program for homeless youth in Oslo. We organize weekly training sessions, accept donations, and want people to volunteer or support us."
                className="w-full rounded-2xl px-5 py-4 bg-black/60 border border-white/10 resize-none focus:outline-none focus:border-indigo-500"
              />

              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="website-name"
                className={cx(
                  "w-full rounded-xl px-5 py-4 bg-black/60 border",
                  usernameValid
                    ? "border-white/10"
                    : "border-red-500/40"
                )}
              />
            </div>

            <button
              onClick={generateWebsite}
              disabled={creating}
              className={cx(
                "w-full py-4 rounded-xl font-semibold transition",
                creating
                  ? "bg-white/70 text-black"
                  : "bg-indigo-500 hover:bg-indigo-400"
              )}
            >
              {creating ? "Generating website with AI…" : "Generate website"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
