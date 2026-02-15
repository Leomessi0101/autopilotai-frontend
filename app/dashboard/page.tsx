"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText,
  Mail,
  Megaphone,
  Briefcase,
  Globe,
  Zap,
  BarChart3,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";

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

export default function DashboardPage() {
  const router = useRouter();
  const [initial, setInitial] = useState("U");
  const [userName, setUserName] = useState<string | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [usage, setUsage] = useState<{
    used: number;
    limit: number | null;
  }>({ used: 0, limit: null });
  const [workCount, setWorkCount] = useState(0);
  const [loadingSite, setLoadingSite] = useState(true);
  const [existingSite, setExistingSite] = useState<null | {
    username: string;
  }>(null);
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

  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function load() {
      try {
        const [meRes, siteRes, workRes] = await Promise.all([
          api.get("/api/auth/me"),
          api.get("/api/dashboard/websites/me"),
          api.get("/api/work").catch(() => ({ data: [] })),
        ]);

        const me = meRes.data;
        if (me?.name) {
          setInitial(me.name.charAt(0).toUpperCase());
          setUserName(me.name);
        }
        if (me?.subscription) setSubscriptionPlan(me.subscription);
        if (me?.used_generations != null || me?.monthly_limit != null) {
          setUsage({
            used: me?.used_generations ?? 0,
            limit: me?.monthly_limit ?? null,
          });
        }

        if (siteRes.data?.exists && siteRes.data.username) {
          setExistingSite({ username: siteRes.data.username });
        }

        const workItems = Array.isArray(workRes.data) ? workRes.data : [];
        setWorkCount(workItems.length);
      } catch {
        localStorage.removeItem("autopilot_token");
        router.push("/login");
      } finally {
        setLoadingSite(false);
      }
    }

    load();
  }, [router]);

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

  if (loadingSite) {
    return (
      <div className="min-h-screen bg-[#050810] text-white flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative flex flex-col items-center gap-6">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-400 border-r-violet-400 animate-spin" />
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-violet-400 border-l-indigo-400 animate-spin [animation-duration:1.5s] [animation-direction:reverse]" />
          </div>
          <p className="text-slate-400 font-medium tracking-wide">Loading your workspace</p>
          <div className="h-1 w-24 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 loading-bar-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050810] text-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b06_1px,transparent_1px),linear-gradient(to_bottom,#1e293b06_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="relative">
      <DashboardNavbar name={initial} subscriptionPlan={subscriptionPlan} />

      {toast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <div
            className={cx(
              "px-6 py-3.5 rounded-2xl text-sm font-medium backdrop-blur-xl shadow-2xl border flex items-center gap-3",
              toast.type === "ok"
                ? "bg-emerald-500/95 text-white border-emerald-400/30 shadow-emerald-500/20"
                : "bg-red-500/95 text-white border-red-400/30 shadow-red-500/20"
            )}
          >
            {toast.type === "ok" ? (
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            ) : (
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            )}
            {toast.msg}
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-6 py-10 md:py-14 relative">
        {subscriptionPlan === "free" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-rose-500/5"></div>
            <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 mb-4">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Free Account</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Ready to Publish Your Website?
                </h2>
                <p className="text-gray-300 text-lg">
                  Upgrade to Starter ($10/mo) to publish your website with a custom domain
                </p>
              </div>
              <button
                onClick={() => router.push("/upgrade")}
                className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl font-bold text-lg text-white overflow-hidden shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:scale-105 flex items-center gap-2"
              >
                <span className="relative z-10">Upgrade Now</span>
                <ArrowRight className="relative z-10 w-5 h-5" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </div>
          </motion.div>
        )}
      
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-10"
        >
          <h1 className="text-2xl md:text-3xl font-semibold text-white mb-6">
            Welcome back{userName ? `, ${userName.split(" ")[0]}` : ""}
          </h1>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <StatCard
              icon={<Globe className="w-4 h-4" />}
              label="Website"
              value={existingSite ? "Live" : "Not created"}
              sub={existingSite ? existingSite.username : "Create with AI below"}
              accent={existingSite ? "emerald" : "slate"}
            />
            <StatCard
              icon={<BarChart3 className="w-4 h-4" />}
              label="Usage"
              value={
                usage.limit == null
                  ? "Unlimited"
                  : `${usage.used} / ${usage.limit}`
              }
              sub={usage.limit != null ? "generations this month" : "generations"}
              accent="indigo"
            />
            <StatCard
              icon={<Briefcase className="w-4 h-4" />}
              label="My Work"
              value={String(workCount)}
              sub="saved items"
              accent="violet"
            />
            <StatCard
              icon={<Zap className="w-4 h-4" />}
              label="Plan"
              value={subscriptionPlan ? String(subscriptionPlan).charAt(0).toUpperCase() + String(subscriptionPlan).slice(1) : "Free"}
              sub="current plan"
              accent="amber"
            />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="mb-10"
        >
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Quick access
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ShortcutCard
              icon={<FileText className="w-5 h-5" />}
              title="Content"
              description="Create and manage AI content and images"
              href="/dashboard/content"
              onClick={() => router.push("/dashboard/content")}
              accent="indigo"
            />
            <ShortcutCard
              icon={<Mail className="w-5 h-5" />}
              title="Emails"
              description="Generate and send email copy"
              href="/dashboard/email"
              onClick={() => router.push("/dashboard/email")}
              accent="violet"
            />
            <ShortcutCard
              icon={<Megaphone className="w-5 h-5" />}
              title="Ads"
              description="Create ad copy and creatives"
              href="/dashboard/ads"
              onClick={() => router.push("/dashboard/ads")}
              accent="rose"
            />
            <ShortcutCard
              icon={<Briefcase className="w-5 h-5" />}
              title="My Work"
              description="View and manage your saved work"
              href="/dashboard/work"
              onClick={() => router.push("/dashboard/work")}
              badge={workCount > 0 ? workCount : undefined}
              accent="emerald"
            />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400/80" />
            AI Website
          </h2>
        {existingSite ? (
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-2xl shadow-2xl shadow-black/40">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-indigo-500/12 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[380px] h-[380px] bg-violet-500/12 rounded-full blur-[100px]" />
            
            <div className="relative p-8 md:p-12">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 mb-8">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                <span className="text-sm font-semibold text-emerald-300 tracking-wide">Live & Ready</span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-5">
                Your AI Website
              </h1>
              
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
                Your website is live and accessible. Make edits anytime — update content, 
                refine the layout, or adjust the tone to match your vision.
              </p>

              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() =>
                    router.push(`/r/${existingSite.username}?edit=1`)
                  }
                  className="group relative overflow-hidden flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 font-semibold text-lg transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.99]"
                >
                  <span className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 flex items-center justify-center gap-2.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Website
                  </span>
                  <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>

                <a
                  href={`/r/${existingSite.username}`}
                  target="_blank"
                  className="flex-1 py-4 px-6 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25 text-center font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2.5 group"
                >
                  <span>View Live</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 gap-8">
                <div className="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Your URL</p>
                  <p className="text-slate-300 font-mono text-sm break-all">autopilotai.dev/r/{existingSite.username}</p>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Status</p>
                  <p className="text-emerald-400 font-semibold">Published</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-2xl shadow-2xl shadow-black/40">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-[420px] h-[420px] bg-indigo-500/12 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-0 w-[380px] h-[380px] bg-violet-500/12 rounded-full blur-[100px]" />
            
            <div className="relative p-8 md:p-12">
              <div className="mb-10">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/25 mb-8">
                  <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 7H7v6h6V7z" />
                    <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-semibold text-indigo-300 tracking-wide">AI Website Builder</span>
                </div>

                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-5">
                  Build Your Website with AI
                </h1>
                
                <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                  Describe your business in plain language. Our AI will write the content, 
                  design the layout, and build a complete website you can customize.
                </p>
              </div>

              <div className="space-y-6 mb-10">
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-400 mb-2.5 flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className="w-full rounded-2xl px-6 py-4 bg-black/50 border border-white/10 hover:border-white/20 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 focus:bg-black/60 resize-none focus:outline-none transition-all duration-300 text-slate-100 placeholder:text-slate-500 shadow-inner"
                    />
                    <div className="absolute bottom-4 right-4 text-xs text-slate-500 font-medium tabular-nums">
                      {businessDescription.length} characters
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-slate-400 mb-2.5 flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        "w-full rounded-2xl pl-6 pr-32 py-4 bg-black/50 border transition-all duration-300 focus:outline-none focus:ring-2 shadow-inner font-mono text-slate-100 placeholder:text-slate-500",
                        usernameValid
                          ? "border-white/10 hover:border-white/20 focus:border-emerald-500/50 focus:ring-emerald-500/20 focus:bg-black/60"
                          : username.length > 0 
                          ? "border-red-500/40 focus:border-red-500/60 focus:ring-red-500/20 bg-red-500/5"
                          : "border-white/10 hover:border-white/20 focus:border-indigo-500/50 focus:ring-indigo-500/20 focus:bg-black/60"
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
                    ? "bg-slate-700/80 text-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.99]"
                )}
              >
                <span className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <span className="relative z-10 flex items-center justify-center gap-2.5">
                  {creating ? (
                    <>
                      <svg className="w-5 h-5 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Generating your website with AI...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Generate Website</span>
                    </>
                  )}
                </span>
                {!creating && (
                  <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                )}
              </button>

              <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">AI-Powered</h3>
                    <p className="text-sm text-slate-500">Content written by advanced AI</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Fully Editable</h3>
                    <p className="text-sm text-slate-500">Customize every element</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
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
        </motion.section>
      </main>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent: "emerald" | "slate" | "indigo" | "violet" | "amber";
}) {
  const accentClasses = {
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    slate: "bg-slate-500/10 border-slate-500/20 text-slate-400",
    indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
    violet: "bg-violet-500/10 border-violet-500/20 text-violet-400",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  };
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-sm p-4 md:p-5 hover:border-white/[0.12] hover:bg-slate-900/60 transition-all duration-300">
      <div className="flex items-center gap-3 mb-2">
        <div
          className={cx(
            "w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0",
            accentClasses[accent]
          )}
        >
          {icon}
        </div>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-lg md:text-xl font-semibold text-white tabular-nums">
        {value}
      </p>
      <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
    </div>
  );
}

function ShortcutCard({
  icon,
  title,
  description,
  href,
  onClick,
  badge,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  onClick: () => void;
  badge?: number;
  accent: "indigo" | "violet" | "rose" | "emerald";
}) {
  const accentClasses = {
    indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/15",
    violet: "bg-violet-500/10 border-violet-500/20 text-violet-400 group-hover:bg-violet-500/15",
    rose: "bg-rose-500/10 border-rose-500/20 text-rose-400 group-hover:bg-rose-500/15",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/15",
  };
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      className="group w-full text-left rounded-2xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-sm p-5 hover:border-white/[0.14] hover:bg-slate-900/60 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl bg-white/[0.02] group-hover:bg-white/[0.04] transition-colors" />
      <div className="relative">
        <div
          className={cx(
            "w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 mb-3 transition-colors",
            accentClasses[accent]
          )}
        >
          {icon}
        </div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-white">{title}</h3>
          {badge != null && badge > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-medium text-slate-300">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors pr-8">
          {description}
        </p>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all">
          <ChevronRight className="w-5 h-5" />
        </span>
      </div>
    </motion.button>
  );
}