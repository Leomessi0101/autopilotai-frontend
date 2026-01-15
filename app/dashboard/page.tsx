"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";

/* =========================
   TYPES
========================= */

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

function clamp(s: string, max: number) {
  const v = s || "";
  return v.length > max ? v.slice(0, max) : v;
}

function prettyNameFromSlug(slug: string) {
  const s = (slug || "").trim();
  if (!s) return "your-site";
  return s.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
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
     AI-FIRST INPUTS
  ========================= */

  const [aiPrompt, setAiPrompt] = useState("");
  const [slug, setSlug] = useState("");

  const cleanedSlug = useMemo(() => normalizeSlug(slug), [slug]);
  const slugValid = useMemo(() => isValidSlug(cleanedSlug), [cleanedSlug]);

  const [creatingWebsite, setCreatingWebsite] = useState(false);
  const [siteToast, setSiteToast] = useState<null | { type: "ok" | "err"; msg: string }>(null);

  const promptLen = aiPrompt.trim().length;
  const promptGood = promptLen >= 25;

  const liveUrl = useMemo(() => {
    const u = cleanedSlug || "your-site";
    return `/r/${u}`;
  }, [cleanedSlug]);

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
        if (res.data?.subscription) setSubscriptionPlan(res.data.subscription);
      })
      .catch(() => {
        localStorage.removeItem("autopilot_token");
        router.push("/login");
      });
  }, [router]);

  /* =========================
     CREATE WEBSITE (AI-ONLY)
  ========================= */

  async function createWebsite() {
    if (!slugValid) {
      setSiteToast({
        type: "err",
        msg: "Website username must be 3–30 chars (a–z, 0–9, hyphen).",
      });
      setTimeout(() => setSiteToast(null), 2600);
      return;
    }

    if (!promptGood) {
      setSiteToast({
        type: "err",
        msg: "Describe your business a bit more (at least ~1–2 sentences).",
      });
      setTimeout(() => setSiteToast(null), 2600);
      return;
    }

    setCreatingWebsite(true);
    setSiteToast(null);

    try {
      // IMPORTANT:
      // - We do NOT send template.
      // - Backend infers restaurant vs business from ai_input.prompt.
      const res = await api.post<CreateWebsiteResponse>("/api/dashboard/websites/create", {
        username: cleanedSlug,
        ai_input: {
          prompt: aiPrompt.trim(),
        },
      });

      const username = res.data.username || cleanedSlug;
      router.push(`/r/${username}?edit=1`);
    } catch (err: any) {
      setSiteToast({
        type: "err",
        msg: err?.response?.data?.detail || "Failed to generate website. Try again.",
      });
      setTimeout(() => setSiteToast(null), 3200);
    } finally {
      setCreatingWebsite(false);
    }
  }

  /* =========================
     UI BITS
  ========================= */

  const examples = [
    "I run a car dealership in Oslo selling used BMWs and Audis. I want leads and people to call or message us.",
    "We are a pizza restaurant in Chiang Mai focused on delivery and dine-in. Show menu, hours, and location.",
    "I’m a freelance designer. I want a clean portfolio-style landing page with a strong CTA to contact me.",
  ];

  const suggestedChecklist = [
    "Add phone + email",
    "Add address / service area",
    "Add opening hours (if local)",
    "Add 3–6 services or menu items",
  ];

  const vibeTitle = useMemo(() => {
    if (!aiPrompt.trim()) return "Your AI website, generated in seconds";
    // tiny “AI-ish” feedback without actually classifying on frontend
    const s = aiPrompt.toLowerCase();
    if (s.includes("restaurant") || s.includes("pizza") || s.includes("cafe") || s.includes("menu"))
      return "Restaurant-style layout detected";
    if (s.includes("portfolio") || s.includes("freelance") || s.includes("designer"))
      return "Portfolio-style layout detected";
    if (s.includes("leads") || s.includes("bookings") || s.includes("appointments"))
      return "Lead-generation layout detected";
    return "Smart layout + theme picked by AI";
  }, [aiPrompt]);

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

      <main className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        {/* =========================
            HERO HEADER
        ========================= */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-wide text-indigo-300">
            AutopilotAI Website Builder
          </div>

          <h1 className="mt-5 text-4xl md:text-5xl font-semibold leading-tight">
            {fullName ? (
              <>
                Hi {fullName}.{" "}
                <span className="text-indigo-400">Describe it.</span> We build it.
              </>
            ) : (
              <>
                Describe it. <span className="text-indigo-400">We build it.</span>
              </>
            )}
          </h1>

          <p className="mt-4 text-lg text-gray-300 max-w-3xl">
            No templates to choose. No setup. Just one prompt — the AI picks layout, sections, and style. You can
            edit everything after generation.
          </p>
        </motion.div>

        {/* =========================
            LAYOUT
        ========================= */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* LEFT: Prompt + username */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#020617] p-8 md:p-10 shadow-[0_60px_160px_rgba(0,0,0,.7)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-white">AI Prompt</div>
                <div className="mt-1 text-sm text-white/60">
                  Tell us what it is, who it’s for, and what you want visitors to do.
                </div>
              </div>

              <div
                className={cx(
                  "px-3 py-1 rounded-full text-xs font-semibold border",
                  promptGood ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200" : "border-white/10 bg-white/5 text-white/70"
                )}
              >
                {promptGood ? "Ready" : "Add more detail"}
              </div>
            </div>

            <div className="mt-5">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(clamp(e.target.value, 1200))}
                placeholder={`Example:\n“I run a car company called Car Deals in Oslo. We sell used BMW and Audi. I want leads and calls. Include services, trust, and contact details.”`}
                rows={10}
                className={cx(
                  "w-full rounded-2xl px-5 py-4 bg-black/40 border text-white outline-none resize-none",
                  "placeholder:text-white/35",
                  promptGood ? "border-white/10 focus:border-indigo-400" : "border-red-500/35 focus:border-red-400/60"
                )}
              />
              <div className="mt-2 flex items-center justify-between text-xs text-white/45">
                <div>
                  Tip: mention <span className="text-white/70">city</span>, <span className="text-white/70">offer</span>,{" "}
                  <span className="text-white/70">goal</span>, and <span className="text-white/70">contact</span>.
                </div>
                <div>{promptLen}/1200</div>
              </div>
            </div>

            {/* Quick examples */}
            <div className="mt-6">
              <div className="text-xs uppercase tracking-wide text-white/45 mb-2">Try an example</div>
              <div className="grid gap-2">
                {examples.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAiPrompt(ex)}
                    className="text-left rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition px-4 py-3"
                  >
                    <div className="text-sm text-white/85">{ex}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Username + domain */}
            <div className="mt-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-white">Website username</div>
                  <div className="mt-1 text-sm text-white/60">
                    This becomes your public link (you can connect a domain soon).
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/70">
                    Connect your domain <span className="text-white/45">(coming soon)</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="website-username"
                  className={cx(
                    "w-full rounded-2xl px-5 py-4 bg-black/40 border text-white outline-none",
                    slugValid ? "border-white/10 focus:border-indigo-400" : "border-red-500/35 focus:border-red-400/60"
                  )}
                />
                <div className="mt-2 text-xs text-white/50">
                  Live URL:{" "}
                  <span className={slugValid ? "text-white" : "text-red-200"}>
                    {liveUrl}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={createWebsite}
              disabled={creatingWebsite}
              className={cx(
                "mt-8 w-full py-4 rounded-2xl font-semibold transition",
                creatingWebsite
                  ? "bg-white/60 text-black cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-400 text-white"
              )}
            >
              {creatingWebsite ? "Generating website…" : "Generate website"}
            </button>

            <div className="mt-3 text-xs text-white/45">
              After generation, you’ll be redirected to your site in <span className="text-white/70">edit mode</span>.
              Changes auto-save.
            </div>
          </motion.section>

          {/* RIGHT: “AI status / preview / checklist” */}
          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.05 }}
            className="rounded-3xl border border-white/10 bg-[#070a12] p-8 md:p-10 shadow-[0_60px_160px_rgba(0,0,0,.6)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-white">AI Builder</div>
                <div className="mt-1 text-sm text-white/60">
                  {vibeTitle}
                </div>
              </div>

              <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-xs font-semibold text-indigo-200">
                Live + editable
              </div>
            </div>

            {/* Preview card */}
            <div className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6">
              <div className="text-xs uppercase tracking-wide text-white/45">Preview</div>

              <div className="mt-4">
                <div className="text-2xl md:text-3xl font-semibold leading-tight">
                  {aiPrompt.trim()
                    ? prettyNameFromSlug(cleanedSlug || "your-site")
                    : "Your next website"}
                </div>
                <div className="mt-2 text-sm text-white/60">
                  {aiPrompt.trim()
                    ? "A clean layout with sections chosen by AI based on your prompt."
                    : "Write a prompt and we’ll generate structure, theme, and starter content."}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {["Hero", "Services", "CTA", "Contact"].map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/70"
                    >
                      {t}
                    </span>
                  ))}
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/45">
                    + more based on your prompt
                  </span>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">After generation</div>
                  <div className="text-sm text-white/60 mt-1">
                    AI generates starter copy — then you finalize the real-world details.
                  </div>
                </div>
                <div className="text-xs text-white/45">~30 sec</div>
              </div>

              <div className="mt-4 grid gap-2">
                {suggestedChecklist.map((it) => (
                  <div key={it} className="flex items-center gap-2 text-sm text-white/75">
                    <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 inline-flex items-center justify-center text-xs">
                      ✓
                    </span>
                    {it}
                  </div>
                ))}
              </div>

              <div className="mt-4 text-xs text-white/45">
                (We’ll automate even more later: contact import, map embed, domain connection, forms.)
              </div>
            </div>

            {/* Confidence + positioning */}
            <div className="mt-6 rounded-3xl border border-white/10 bg-black/30 p-6">
              <div className="text-sm font-semibold">What makes this feel “real AI”</div>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li>• No template selection — AI infers what you need.</li>
                <li>• Layout + theme chosen deterministically (same prompt → consistent results).</li>
                <li>• Instant edit mode with auto-save so users don’t get stuck.</li>
              </ul>
            </div>
          </motion.aside>
        </div>
      </main>
    </div>
  );
}
