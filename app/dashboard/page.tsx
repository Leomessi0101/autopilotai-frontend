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
  const [fullName, setFullName] = useState<string | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

  /* =========================
     WEBSITE STATE (FIXED)
  ========================= */

  const [slug, setSlug] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<
    "restaurant" | "business"
  >("business");

  const cleanedSlug = useMemo(() => normalizeSlug(slug), [slug]);
  const slugValid = useMemo(() => isValidSlug(cleanedSlug), [cleanedSlug]);

  /* =========================
     AI INPUTS
  ========================= */

  const [aiBusinessName, setAiBusinessName] = useState("");
  const [aiShortDescription, setAiShortDescription] = useState("");
  const [aiPrimaryGoal, setAiPrimaryGoal] = useState("");
  const [aiCity, setAiCity] = useState("");

  const [creatingWebsite, setCreatingWebsite] = useState(false);
  const [siteToast, setSiteToast] = useState<
    null | { type: "ok" | "err"; msg: string }
  >(null);

  /* =========================
     LOAD USER
  ========================= */

  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/api/auth/me")
      .then((res) => {
        if (res.data?.name) {
          setInitial(res.data.name.charAt(0).toUpperCase());
          setFullName(res.data.name.split(" ")[0]);
        }
        if (res.data?.subscription) {
          setSubscriptionPlan(res.data.subscription);
        }
      })
      .catch(() => {
        localStorage.removeItem("autopilot_token");
        router.push("/login");
      });
  }, [router]);

  /* =========================
     CREATE WEBSITE (FINAL)
  ========================= */

  async function createWebsite() {
    if (!slugValid) {
      setSiteToast({
        type: "err",
        msg: "Username must be 3–30 chars (a–z, 0–9, hyphen)",
      });
      setTimeout(() => setSiteToast(null), 2600);
      return;
    }

    setCreatingWebsite(true);
    setSiteToast(null);

    try {
      const res = await api.post<CreateWebsiteResponse>(
        "/api/dashboard/websites/create",
        {
          username: cleanedSlug,
          template: selectedTemplate,
          ai_input: {
            business_name: aiBusinessName,
            short_description: aiShortDescription,
            primary_goal: aiPrimaryGoal,
            city: aiCity,
          },
        }
      );

      const username = res.data.username || cleanedSlug;
      router.push(`/r/${username}?edit=1`);
    } catch (err: any) {
      setSiteToast({
        type: "err",
        msg:
          err?.response?.data?.detail ||
          "Failed to generate website. Try again.",
      });
      setTimeout(() => setSiteToast(null), 3000);
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
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div
            className={cx(
              "px-4 py-2 rounded-full text-sm font-semibold",
              siteToast.type === "ok"
                ? "bg-white text-black"
                : "bg-red-500/20 text-red-200 border border-red-500/30"
            )}
          >
            {siteToast.msg}
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* =========================
            AI BUILDER (LANDINGSITE STYLE)
        ========================= */}

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#020617] p-10 shadow-[0_60px_160px_rgba(0,0,0,.7)]"
        >
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-wide text-indigo-300">
              AI Website Generator
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-semibold leading-tight">
              Describe your business.
              <br />
              <span className="text-indigo-400">
                AutopilotAI builds the website.
              </span>
            </h1>

            <p className="mt-5 text-lg text-gray-300">
              No templates. No setup. Just type — your site is generated,
              editable, and live instantly.
            </p>

            {/* AI Inputs */}
            <div className="mt-10 grid gap-5">
              <input
                value={aiBusinessName}
                onChange={(e) => setAiBusinessName(e.target.value)}
                placeholder="Business name"
                className="w-full rounded-xl px-5 py-4 bg-black/40 border border-white/10 text-white outline-none focus:border-indigo-400"
              />

              <textarea
                value={aiShortDescription}
                onChange={(e) => setAiShortDescription(e.target.value)}
                placeholder="What do you do? Who is it for?"
                rows={3}
                className="w-full rounded-xl px-5 py-4 bg-black/40 border border-white/10 text-white outline-none resize-none focus:border-indigo-400"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  value={aiPrimaryGoal}
                  onChange={(e) => setAiPrimaryGoal(e.target.value)}
                  placeholder="Primary goal (leads, bookings, sales)"
                  className="rounded-xl px-5 py-4 bg-black/40 border border-white/10 text-white outline-none focus:border-indigo-400"
                />

                <input
                  value={aiCity}
                  onChange={(e) => setAiCity(e.target.value)}
                  placeholder="City (optional)"
                  className="rounded-xl px-5 py-4 bg-black/40 border border-white/10 text-white outline-none focus:border-indigo-400"
                />
              </div>

              {/* Username */}
              <div>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="website-username"
                  className={cx(
                    "w-full rounded-xl px-5 py-4 bg-black/40 border text-white outline-none",
                    slugValid
                      ? "border-white/10 focus:border-indigo-400"
                      : "border-red-500/40"
                  )}
                />
                <div className="mt-2 text-xs text-white/50">
                  Live URL:{" "}
                  <span
                    className={slugValid ? "text-white" : "text-red-300"}
                  >
                    /r/{cleanedSlug || "your-name"}
                  </span>
                </div>
              </div>

              {/* Template */}
              <div className="flex gap-3">
                {(["business", "restaurant"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTemplate(t)}
                    className={cx(
                      "flex-1 py-3 rounded-xl border font-medium transition",
                      selectedTemplate === t
                        ? "bg-white text-black border-white"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    )}
                  >
                    {t === "business" ? "Business" : "Restaurant"}
                  </button>
                ))}
              </div>

              <button
                onClick={createWebsite}
                disabled={creatingWebsite}
                className={cx(
                  "mt-4 w-full py-4 rounded-xl font-semibold transition",
                  creatingWebsite
                    ? "bg-white/60 text-black cursor-not-allowed"
                    : "bg-indigo-500 hover:bg-indigo-400 text-white"
                )}
              >
                {creatingWebsite ? "Generating website…" : "Generate website"}
              </button>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
