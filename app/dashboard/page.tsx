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
  const [prompt, setPrompt] = useState("");
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

    if (!prompt.trim()) {
      setToast({
        type: "err",
        msg: "Describe your business in one sentence",
      });
      setTimeout(() => setToast(null), 2500);
      return;
    }

    setCreating(true);
    setToast(null);

    try {
      const res = await api.post("/api/dashboard/websites/create", {
        username: cleanedUsername,
        prompt: prompt.trim(),
        ai_prompt: prompt.trim(),
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
        {/* =========================
           EXISTING WEBSITE VIEW
        ========================= */}
        {existingSite ? (
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#020617] p-10 shadow-[0_60px_160px_rgba(0,0,0,.7)]">
            <h1 className="text-4xl font-semibold">Your website</h1>

            <p className="mt-4 text-lg text-gray-300">
              Your site is live and ready to edit.
            </p>

            <div className="mt-8 rounded-xl bg-black/40 border border-white/10 px-5 py-4">
              <div className="text-sm text-white/60">Live URL</div>
              <div className="mt-1 text-lg text-white">
                autopilotai.dev/r/{existingSite.username}
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() =>
                  router.push(`/r/${existingSite.username}?edit=1`)
                }
                className="flex-1 py-4 rounded-xl bg-indigo-500 hover:bg-indigo-400 font-semibold transition"
              >
                Edit website
              </button>

              <a
                href={`/r/${existingSite.username}`}
                target="_blank"
                className="flex-1 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-semibold text-center transition"
              >
                View live
              </a>
            </div>
          </div>
        ) : (
          /* =========================
             CREATE WEBSITE VIEW
          ========================= */
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#020617] p-10 shadow-[0_60px_160px_rgba(0,0,0,.7)]">
            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
                Create your website with AI
              </h1>
              <p className="mt-4 text-lg text-gray-300">
                Describe your business. We generate the website.
              </p>
            </div>

            <div className="mb-6">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: I run a car dealership in Oslo selling used cars and financing"
                rows={4}
                className="w-full rounded-2xl px-5 py-4 bg-black/40 border border-white/10 text-white outline-none resize-none focus:border-indigo-400"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="website-name"
                  className={cx(
                    "w-full rounded-xl px-5 py-4 bg-black/40 border text-white outline-none",
                    usernameValid
                      ? "border-white/10 focus:border-indigo-400"
                      : "border-red-500/40"
                  )}
                />
                <div className="mt-2 text-xs text-white/50">
                  URL:{" "}
                  <span
                    className={usernameValid ? "text-white" : "text-red-300"}
                  >
                    autopilotai.dev/r/{cleanedUsername || "your-name"}
                  </span>
                </div>
              </div>

              <div className="rounded-xl px-5 py-4 bg-black/20 border border-white/10 text-white/50 flex items-center">
                Connect your domain
                <span className="ml-2 text-xs opacity-60">
                  (coming soon)
                </span>
              </div>
            </div>

            <button
              onClick={generateWebsite}
              disabled={creating}
              className={cx(
                "w-full py-4 rounded-xl font-semibold transition",
                creating
                  ? "bg-white/60 text-black cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-400 text-white"
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
