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
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

  /* =========================
     WEBSITE STATE
  ========================= */

  const [slug, setSlug] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<
    "business" | "restaurant"
  >("business");

  const cleanedSlug = useMemo(() => normalizeSlug(slug), [slug]);
  const slugValid = useMemo(() => isValidSlug(cleanedSlug), [cleanedSlug]);

  /* =========================
     AI PROMPT (SINGLE INPUT)
  ========================= */

  const [aiPrompt, setAiPrompt] = useState("");

  /* =========================
     UI STATE
  ========================= */

  const [creatingWebsite, setCreatingWebsite] = useState(false);
  const [toast, setToast] = useState<
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
        }
        if (res.data?.subscription_plan) {
          setSubscriptionPlan(res.data.subscription_plan);
        }
      })
      .catch(() => {
        localStorage.removeItem("autopilot_token");
        router.push("/login");
      });
  }, [router]);

  /* =========================
     CREATE WEBSITE
  ========================= */

  async function createWebsite() {
    if (!slugValid) {
      setToast({
        type: "err",
        msg: "Username must be 3–30 chars (a–z, 0–9, hyphen)",
      });
      setTimeout(() => setToast(null), 2600);
      return;
    }

    if (!aiPrompt.trim()) {
      setToast({
        type: "err",
        msg: "Describe your business so the AI knows what to build.",
      });
      setTimeout(() => setToast(null), 2600);
      return;
    }

    setCreatingWebsite(true);
    setToast(null);

    try {
      const res = await api.post<CreateWebsiteResponse>(
        "/api/dashboard/websites/create",
        {
          username: cleanedSlug,
          template: selectedTemplate, // optional but still supported
          ai_prompt: aiPrompt,
        }
      );

      const username = res.data.username || cleanedSlug;
      router.push(`/r/${username}?edit=1`);
    } catch (err: any) {
      setToast({
        type: "err",
        msg:
          err?.response?.data?.detail ||
          "Failed to generate website. Try again.",
      });
      setTimeout(() => setToast(null), 3000);
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

      <main className="max-w-6xl mx-auto px-6 py-20">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl border border-white/10
                     bg-gradient-to-br from-[#0f172a] to-[#020617]
                     p-10 shadow-[0_60px_160px_rgba(0,0,0,.7)]"
        >
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                            bg-white/5 border border-white/10
                            text-xs uppercase tracking-wide text-indigo-300">
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
              Just explain what you do. The AI chooses layout, content, and structure.
            </p>

            {/* AI PROMPT */}
            <div className="mt-10 grid gap-5">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Example: I run a car dealership in Oslo and want more booking requests."
                rows={4}
                className="w-full rounded-2xl px-5 py-4 bg-black/40
                           border border-white/10 text-white outline-none
                           resize-none focus:border-indigo-400"
              />

              {/* USERNAME */}
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
                  <span className={slugValid ? "text-white" : "text-red-300"}>
                    /r/{cleanedSlug || "your-name"}
                  </span>
                </div>
              </div>

              {/* TEMPLATE (OPTIONAL) */}
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
