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
   QUOTES & DAILY FOCUS
========================= */

const QUOTES = [
  { text: "Excellence is not an act, but a habit.", author: "Aristotle" },
  { text: "The work is the reward.", author: "Unknown" },
  { text: "Progress is built on consistent execution.", author: "AutopilotAI" },
  { text: "Focus on the system, not the goal.", author: "James Clear" },
  { text: "Clarity precedes mastery.", author: "Robin Sharma" },
];

const AI_DAILY_FOCUS = [
  {
    title: "Strengthen Visibility",
    subtitle: "Increase reach through consistent, high-value output",
    tasks: [
      "Publish one piece of core content",
      "Engage with key audience members",
      "Share strategic insights",
    ],
  },
  {
    title: "Accelerate Conversion",
    subtitle: "Move prospects closer to commitment",
    tasks: [
      "Refine primary offer messaging",
      "Follow up on warm opportunities",
      "Test a new acquisition angle",
    ],
  },
  {
    title: "Deepen Authority",
    subtitle: "Establish long-term influence in your space",
    tasks: [
      "Develop one in-depth piece",
      "Repurpose existing high-performers",
      "Plan upcoming themes",
    ],
  },
  {
    title: "Refine Communication",
    subtitle: "Ensure every message aligns with your brand",
    tasks: [
      "Review recent content for consistency",
      "Update key templates",
      "Clarify core positioning",
    ],
  },
];

function getDailyItem<T>(list: T[]) {
  const today = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < today.length; i++) hash += today.charCodeAt(i);
  return list[hash % list.length];
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

/* =========================
   WEBSITE BUILDER HELPERS
========================= */

function normalizeSlug(input: string) {
  // lowercase, remove invalid chars, collapse spaces to hyphens
  let s = (input || "").trim().toLowerCase();
  s = s.replace(/\s+/g, "-");
  s = s.replace(/[^a-z0-9-]/g, "");
  s = s.replace(/-+/g, "-");
  s = s.replace(/^-+/, "").replace(/-+$/, "");
  return s;
}

function isValidSlug(slug: string) {
  // match backend: 3–30 chars, lowercase letters, numbers, hyphens only
  return /^[a-z0-9-]{3,30}$/.test(slug);
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

  // Website Builder state
  const [websiteLoading, setWebsiteLoading] = useState(true);
  const [website, setWebsite] = useState<WebsiteMeResponse | null>(null);
  const [websiteError, setWebsiteError] = useState<string | null>(null);

  const [selectedTemplate, setSelectedTemplate] = useState<
    "restaurant" | "business"
  >("restaurant");

  const [desiredUsername, setDesiredUsername] = useState<string>("");
  const [creatingWebsite, setCreatingWebsite] = useState(false);

  const [siteToast, setSiteToast] = useState<
    null | { type: "ok" | "err"; msg: string }
  >(null);

  const quote = getDailyItem(QUOTES);
  const focus = getDailyItem(AI_DAILY_FOCUS);
  const greeting = getGreeting();

  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      router.push("/login");
      return;
    }

    // ME
    api
      .get("/api/auth/me")
      .then((res) => {
        if (res.data?.name) {
          setInitial(res.data.name.charAt(0).toUpperCase());
          setFullName(res.data.name.split(" ")[0] || res.data.name);
        }
        if (res.data?.subscription) {
          setSubscriptionPlan(res.data.subscription);
        }
      })
      .catch(() => {
        localStorage.removeItem("autopilot_token");
        router.push("/login");
      });

    // USAGE
    api
      .get("/api/auth/usage")
      .then((res) => {
        const data = res.data || {};
        const usedValue =
          typeof data.used === "number"
            ? data.used
            : typeof data.used_generations === "number"
            ? data.used_generations
            : null;

        const limitValue =
          typeof data.limit === "number"
            ? data.limit
            : typeof data.monthly_limit === "number"
            ? data.monthly_limit
            : null;

        setUsed(usedValue);
        setLimit(limitValue);
      })
      .finally(() => setUsageLoading(false));

    // WEBSITE ME
    api
      .get("/api/dashboard/websites/me")
      .then((res) => {
        const d = res.data as WebsiteMeResponse;
        setWebsite(d);
        setWebsiteError(null);

        // if user already has a site, prefill for nicer UI
        if (d && (d as any).exists === true && (d as any).username) {
          setDesiredUsername((d as any).username);
        }
      })
      .catch((err) => {
        setWebsite(null);
        if (err?.response?.status === 401) {
          // token missing/expired
          localStorage.removeItem("autopilot_token");
          router.push("/login");
          return;
        }
        setWebsiteError("Failed to load website status");
      })
      .finally(() => setWebsiteLoading(false));
  }, [router]);

  const progress = useMemo(() => {
    return used !== null && limit !== null && limit > 0
      ? Math.min(100, (used / limit) * 100)
      : 0;
  }, [used, limit]);

  const remaining = useMemo(() => {
    return used !== null && limit !== null ? Math.max(0, limit - used) : null;
  }, [used, limit]);

  const isPaid = (subscriptionPlan || "free").toLowerCase() !== "free";

  const cleanedSlug = useMemo(
    () => normalizeSlug(desiredUsername),
    [desiredUsername]
  );

  const slugValid = useMemo(() => isValidSlug(cleanedSlug), [cleanedSlug]);

  async function refreshWebsiteMe() {
    setWebsiteLoading(true);
    setWebsiteError(null);
    try {
      const res = await api.get("/api/dashboard/websites/me");
      setWebsite(res.data as WebsiteMeResponse);
    } catch {
      setWebsite(null);
      setWebsiteError("Failed to refresh website status");
    } finally {
      setWebsiteLoading(false);
    }
  }

  async function createWebsite() {
    if (!isPaid) {
      router.push("/upgrade");
      return;
    }

    const slug = normalizeSlug(desiredUsername);

    if (!slugValid) {
      setSiteToast({
        type: "err",
        msg: "Choose a username (3–30 chars, lowercase letters/numbers/hyphens)",
      });
      setTimeout(() => setSiteToast(null), 2600);
      return;
    }

    setCreatingWebsite(true);
    setSiteToast(null);

    try {
      const res = await api.post("/api/dashboard/websites/create", {
        username: slug,
        template: selectedTemplate,
      });

      const data = (res.data || {}) as CreateWebsiteResponse;

      const redirect =
        data.redirect ||
        (data.username ? `/r/${data.username}?edit=1` : `/r/${slug}?edit=1`);

      setSiteToast({ type: "ok", msg: "Website generated" });
      setTimeout(() => setSiteToast(null), 1500);

      // refresh local state for card UI (optional but nice)
      await refreshWebsiteMe();

      // go edit
      router.push(redirect);
    } catch (err: any) {
      const status = err?.response?.status;

      if (status === 403) {
        // free or already has site
        const detail =
          err?.response?.data?.detail ||
          "Upgrade your plan to create a website";
        setSiteToast({ type: "err", msg: String(detail) });
        setTimeout(() => setSiteToast(null), 2800);
        return;
      }

      if (status === 400) {
        const detail = err?.response?.data?.detail || "Invalid request";
        setSiteToast({ type: "err", msg: String(detail) });
        setTimeout(() => setSiteToast(null), 2800);
        return;
      }

      setSiteToast({ type: "err", msg: "Failed to generate website" });
      setTimeout(() => setSiteToast(null), 2800);
    } finally {
      setCreatingWebsite(false);
    }
  }

  const hasWebsite = website && (website as any).exists === true;
  const existingUsername = hasWebsite ? (website as any).username : null;
  const existingTemplate = hasWebsite ? (website as any).template : null;

  return (
    <div className="min-h-screen bg-[#05070d] text-white relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 w-[900px] h-[900px] bg-[conic-gradient(at_top_left,var(--tw-gradient-stops))] from-[#0c1a39] via-[#0a1630] to-transparent blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[900px] h-[900px] bg-[conic-gradient(at_bottom_right,var(--tw-gradient-stops))] from-[#0d1b3d] via-[#111a2c] to-transparent blur-[200px]" />
      </div>

      <DashboardNavbar name={initial} subscriptionPlan={subscriptionPlan} />

      {/* Website toast */}
      {siteToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[90]">
          <div
            className={cx(
              "px-4 py-2 rounded-full text-sm font-semibold border shadow-lg shadow-black/30",
              siteToast.type === "ok"
                ? "bg-white text-black border-white/20"
                : "bg-red-500/15 text-red-100 border-red-500/25"
            )}
          >
            {siteToast.msg}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        {/* Greeting */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-light">
            {greeting}
            {fullName ? `, ${fullName}` : ""}.
          </h1>
          <p className="mt-6 text-xl text-gray-300">
            Your tools are ready. Let’s work.
          </p>
        </motion.section>

        {/* =========================
            WEBSITE BUILDER (BIG PREMIUM CARD) — ABOVE TOOLS
        ========================= */}
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.05 }}
          className="mb-20 rounded-3xl border border-[#2b4e8d]/60 bg-gradient-to-br from-[#111b2d] to-[#1b2f54] text-white p-10 md:p-12 shadow-[0_50px_120px_rgba(0,0,0,.6)]"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-wide opacity-80">
                AI Website Builder
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold mt-3">
                Generate a premium website in minutes
              </h2>
              <p className="mt-4 text-gray-200/90 leading-relaxed">
                Answer a few questions and AutopilotAI generates a clean,
                high-converting website — with built-in editing, autosave, image
                uploads, and mobile-friendly layouts.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Badge>AI-generated website</Badge>
                <Badge>In-place editing</Badge>
                <Badge>Autosave</Badge>
                <Badge>Mobile optimized</Badge>
                <Badge>Always live</Badge>
              </div>
            </div>

            <div className="md:w-[420px] w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              {websiteLoading ? (
                <div className="space-y-3">
                  <div className="h-4 w-40 bg-white/10 rounded" />
                  <div className="h-10 w-full bg-white/10 rounded-xl" />
                  <div className="h-10 w-full bg-white/10 rounded-xl" />
                  <div className="h-10 w-2/3 bg-white/10 rounded-xl" />
                </div>
              ) : websiteError ? (
                <div>
                  <div className="text-sm text-red-200 font-semibold">
                    {websiteError}
                  </div>
                  <button
                    onClick={refreshWebsiteMe}
                    className="mt-4 w-full py-3 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 transition font-medium"
                  >
                    Retry
                  </button>
                </div>
              ) : !isPaid ? (
                <div>
                  <div className="text-sm text-white/80 font-semibold">
                    Locked on Free plan
                  </div>
                  <div className="mt-2 text-sm text-white/65 leading-relaxed">
                    Upgrade to Basic / Growth / Pro to generate your first
                    website. Paid plans include{" "}
                    <span className="font-semibold">1 site</span>.
                  </div>

                  <button
                    onClick={() => router.push("/upgrade")}
                    className="mt-5 w-full py-3.5 rounded-xl bg-white text-[#1b2f54] font-semibold hover:bg-gray-100 transition"
                  >
                    Upgrade to unlock
                  </button>

                  <div className="mt-3 text-xs text-white/45">
                    You can generate your site instantly after upgrading.
                  </div>
                </div>
              ) : hasWebsite && existingUsername ? (
                <div>
                  <div className="text-sm text-white/75">Your website</div>
                  <div className="mt-1 text-xl font-semibold">
                    /r/{existingUsername}
                  </div>

                  <div className="mt-2 text-sm text-white/65">
                    Website type:{" "}
                    <span className="font-semibold text-white">
                      {String(existingTemplate || "unknown")}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => router.push(`/r/${existingUsername}?edit=1`)}
                      className="py-3 rounded-xl bg-white text-[#1b2f54] font-semibold hover:bg-gray-100 transition"
                    >
                      Edit website
                    </button>
                    <button
                      onClick={() =>
                        window.open(`/r/${existingUsername}`, "_blank")
                      }
                      className="py-3 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 transition font-semibold"
                    >
                      Preview
                    </button>
                  </div>

                  <div className="mt-4 text-xs text-white/45 leading-relaxed">
                    Tip: use <span className="font-semibold">Edit</span> to change
                    text/images, and <span className="font-semibold">Preview</span>{" "}
                    to see what guests see.
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-sm text-white/80 font-semibold">
                    Generate your website
                  </div>
                  <div className="mt-2 text-sm text-white/65 leading-relaxed">
                    Answer a few questions and choose a website username. Your
                    website will live at{" "}
                    <span className="font-semibold text-white">/r/username</span>.
                  </div>

                  {/* Username */}
                  <div className="mt-5">
                    <div className="text-[11px] uppercase tracking-wide text-white/55 mb-2">
                      Website username
                    </div>
                    <input
                      value={desiredUsername}
                      onChange={(e) => setDesiredUsername(e.target.value)}
                      placeholder="my-restaurant"
                      className={cx(
                        "w-full rounded-xl px-4 py-3 bg-black/25 border outline-none text-white placeholder:text-white/35",
                        slugValid || desiredUsername.length === 0
                          ? "border-white/10 focus:border-white/20"
                          : "border-red-500/30 focus:border-red-500/40"
                      )}
                    />
                    <div className="mt-2 text-xs text-white/45">
                      Slug preview:{" "}
                      <span
                        className={cx(
                          "font-semibold",
                          cleanedSlug
                            ? slugValid
                              ? "text-white"
                              : "text-red-200"
                            : "text-white/60"
                        )}
                      >
                        /r/{cleanedSlug || "username"}
                      </span>
                    </div>
                  </div>

                  {/* Website type chooser */}
                  <div className="mt-5">
                    <div className="text-[11px] uppercase tracking-wide text-white/55 mb-2">
                      Website type
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <TemplateOption
                        label="Restaurant"
                        subtitle="Menu + hours + location"
                        active={selectedTemplate === "restaurant"}
                        onClick={() => setSelectedTemplate("restaurant")}
                      />
                      <TemplateOption
                        label="Business"
                        subtitle="Services + CTA layout"
                        active={selectedTemplate === "business"}
                        onClick={() => setSelectedTemplate("business")}
                      />
                    </div>
                  </div>

                  <button
                    onClick={createWebsite}
                    disabled={creatingWebsite}
                    className={cx(
                      "mt-6 w-full py-3.5 rounded-xl font-semibold transition",
                      creatingWebsite
                        ? "bg-white/70 text-[#1b2f54] cursor-not-allowed"
                        : "bg-white text-[#1b2f54] hover:bg-gray-100"
                    )}
                  >
                    {creatingWebsite ? "Generating…" : "Generate website"}
                  </button>

                  <div className="mt-3 text-xs text-white/45 leading-relaxed">
                    You can edit instantly after generation. Changes autosave
                    inside the editor.
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Usage */}
        {limit !== null && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-20 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-[0_50px_120px_rgba(0,0,0,.5)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                  Monthly Generations
                </p>
                <p className="text-3xl font-semibold mt-2">
                  {usageLoading
                    ? "—"
                    : limit === null
                    ? "Unlimited"
                    : `${used ?? 0} of ${limit} used`}
                </p>
              </div>

              <div className="w-full max-w-md">
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#1c2f57] to-[#2b4e8d]"
                  />
                </div>
                <p className="mt-3 text-sm text-gray-400 text-right">
                  {remaining !== null ? `${remaining} remaining` : "No limits"}
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* Tools */}
        <section className="mb-20">
          <h2 className="text-3xl font-medium mb-10">Tools</h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <ToolCard
              title="One-Click Growth Pack"
              description="Generate content, emails & ads in one pass"
              href="/growth-pack"
            />
            <ToolCard
              title="Generate Content"
              description="Posts, threads, and narratives"
              href="/dashboard/content"
            />
            <ToolCard
              title="Write Emails & Replies"
              description="Outreach and communication"
              href="/dashboard/email"
            />
            <ToolCard
              title="Create Ads"
              description="High-conversion ad copy"
              href="/dashboard/ads"
            />
            <ToolCard
              title="My Work"
              description="All generated content"
              href="/dashboard/work"
            />
          </div>
        </section>

        {/* Focus + Plan */}
        <section className="grid gap-10 md:grid-cols-2 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-[0_50px_120px_rgba(0,0,0,.5)]"
          >
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">
              Today’s Focus
            </p>

            <h3 className="text-2xl font-semibold mb-3">{focus.title}</h3>
            <p className="text-gray-300 mb-8">{focus.subtitle}</p>

            <ul className="space-y-4">
              {focus.tasks.map((task, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#2b4e8d] mt-2" />
                  <span className="text-gray-200">{task}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="rounded-2xl border border-[#2b4e8d]/60 bg-gradient-to-br from-[#111b2d] to-[#1b2f54] text-white p-10 shadow-[0_50px_120px_rgba(0,0,0,.6)] flex flex-col justify-between"
          >
            <div>
              <p className="text-sm font-medium uppercase tracking-wide opacity-80 mb-4">
                Current Plan
              </p>

              <h3 className="text-3xl font-semibold mb-6">
                {subscriptionPlan
                  ? subscriptionPlan.charAt(0).toUpperCase() +
                    subscriptionPlan.slice(1)
                  : "Free"}
              </h3>

              <p className="opacity-90">
                Upgrade for unlimited generations and priority processing.
              </p>
            </div>

            <button
              onClick={() => router.push("/upgrade")}
              className="mt-10 py-4 bg-white text-[#1b2f54] rounded-xl font-medium hover:bg-gray-200 transition"
            >
              Upgrade Plan
            </button>
          </motion.div>
        </section>

        {/* Quote */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-center py-16 border-t border-white/10"
        >
          <p className="text-2xl md:text-3xl font-light italic text-gray-300 max-w-4xl mx-auto leading-relaxed">
            “{quote.text}”
          </p>
          <p className="mt-6 text-lg text-[#6d8ce8] font-medium">
            — {quote.author}
          </p>
        </motion.section>

        {/* Contact */}
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

/* =========================
   SMALL UI PIECES
========================= */

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
      {children}
    </span>
  );
}

function TemplateOption({
  label,
  subtitle,
  active,
  onClick,
}: {
  label: string;
  subtitle: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "text-left rounded-xl border p-4 transition",
        active
          ? "bg-white text-[#1b2f54] border-white/20"
          : "bg-white/5 border-white/10 hover:bg-white/10"
      )}
    >
      <div
        className={cx(
          "font-semibold",
          active ? "text-[#1b2f54]" : "text-white"
        )}
      >
        {label}
      </div>
      <div
        className={cx(
          "mt-1 text-xs",
          active ? "text-[#1b2f54]/80" : "text-white/60"
        )}
      >
        {subtitle}
      </div>
    </button>
  );
}

/* TOOL CARD */
function ToolCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  const router = useRouter();

  return (
    <motion.button
      whileHover={{ y: -4 }}
      onClick={() => router.push(href)}
      className="text-left rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-[0_40px_100px_rgba(0,0,0,.55)] hover:border-[#2b4e8d] transition-all group"
    >
      <h3 className="text-xl font-semibold mb-3 group-hover:text-[#6d8ce8] transition">
        {title}
      </h3>
      <p className="text-gray-300">{description}</p>

      <span className="mt-6 inline-block text-sm font-medium text-[#6d8ce8] opacity-0 group-hover:opacity-100 transition">
        Open →
      </span>
    </motion.button>
  );
}
