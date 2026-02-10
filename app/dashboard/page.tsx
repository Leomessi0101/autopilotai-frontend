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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin"></div>
          </div>
          <p className="text-slate-400 font-medium">Loading your workspace</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-950 text-white">
      <DashboardNavbar name={initial} subscriptionPlan={subscriptionPlan} />

      {toast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <div
            className={cx(
              "px-6 py-3 rounded-2xl text-sm font-medium backdrop-blur-xl shadow-2xl",
              toast.type === "ok"
                ? "bg-emerald-500/90 text-white border border-emerald-400/20"
                : "bg-red-500/90 text-white border border-red-400/20"
            )}
          >
            {toast.msg}
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        {existingSite ? (
          <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-black/80 backdrop-blur-sm shadow-2xl">
            {/* Ambient glow effect */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative p-8 md:p-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-300">Live & Ready</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-4">
                Your AI Website
              </h1>
              
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
                Your website is live and accessible. Make edits anytime — update content, 
                refine the layout, or adjust the tone to match your vision.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() =>
                    router.push(`/r/${existingSite.username}?edit=1`)
                  }
                  className="group relative overflow-hidden flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 font-semibold text-lg transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Website
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>

                <a
                  href={`/r/${existingSite.username}`}
                  target="_blank"
                  className="flex-1 py-4 px-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-center font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <span>View Live</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              {/* Stats or quick info */}
              <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Your URL</p>
                  <p className="text-slate-300 font-mono text-sm">autopilotai.dev/r/{existingSite.username}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Status</p>
                  <p className="text-emerald-400 font-medium">Published</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-black/80 backdrop-blur-sm shadow-2xl">
            {/* Ambient glow effect */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative p-8 md:p-12">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
                  <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 7H7v6h6V7z" />
                    <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-indigo-300">AI Website Builder</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-4">
                  Build Your Website with AI
                </h1>
                
                <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                  Describe your business in plain language. Our AI will write the content, 
                  design the layout, and build a complete website you can customize.
                </p>
              </div>

              <div className="space-y-5 mb-8">
                {/* Business description */}
                <div className="group">
                  <label className="block text-sm font-medium text-slate-400 mb-2.5 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Describe your business
                  </label>
                  <div className="relative">
                    <textarea
                      value={businessDescription}
                      onChange={(e) => setBusinessDescription(e.target.value)}
                      rows={6}
                      placeholder="Example: I run a local basketball program for homeless youth in Oslo. We organize weekly training sessions, accept donations, and want people to volunteer or support us."
                      className="w-full rounded-2xl px-6 py-4 bg-black/40 border border-white/10 hover:border-white/20 focus:border-indigo-500/50 focus:bg-black/60 resize-none focus:outline-none transition-all duration-300 text-slate-100 placeholder:text-slate-600 shadow-inner"
                    />
                    <div className="absolute bottom-4 right-4 text-xs text-slate-600">
                      {businessDescription.length} characters
                    </div>
                  </div>
                </div>

                {/* Website name */}
                <div className="group">
                  <label className="block text-sm font-medium text-slate-400 mb-2.5 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Website name
                  </label>
                  <div className="relative">
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="my-business"
                      className={cx(
                        "w-full rounded-2xl pl-6 pr-32 py-4 bg-black/40 border transition-all duration-300 focus:outline-none shadow-inner font-mono text-slate-100 placeholder:text-slate-600",
                        usernameValid
                          ? "border-white/10 hover:border-white/20 focus:border-emerald-500/50 focus:bg-black/60"
                          : username.length > 0 
                          ? "border-red-500/40 focus:border-red-500/60 bg-red-500/5"
                          : "border-white/10 hover:border-white/20 focus:border-indigo-500/50 focus:bg-black/60"
                      )}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">
                      .autopilotai.dev
                    </div>
                    {username.length > 0 && (
                      <div className="absolute -bottom-6 left-2 flex items-center gap-1.5 text-xs">
                        {usernameValid ? (
                          <>
                            <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-emerald-400 font-medium">Available</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-red-400 font-medium">3-30 chars, a-z, 0-9, hyphen only</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={generateWebsite}
                disabled={creating}
                className={cx(
                  "group relative overflow-hidden w-full py-5 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-xl mt-8",
                  creating
                    ? "bg-slate-700 text-slate-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
                )}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {creating ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Generating your website with AI...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Generate Website</span>
                    </>
                  )}
                </span>
                {!creating && (
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                )}
              </button>

              {/* Features list */}
              <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">AI-Powered</h3>
                    <p className="text-sm text-slate-500">Content written by advanced AI</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Fully Editable</h3>
                    <p className="text-sm text-slate-500">Customize every element</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Instant Deploy</h3>
                    <p className="text-sm text-slate-500">Live in seconds</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}