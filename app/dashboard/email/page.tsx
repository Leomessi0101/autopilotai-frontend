"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function EmailPage() {
  const router = useRouter();

  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");

  const [result, setResult] = useState("");
  const [parsedSubject, setParsedSubject] = useState("");
  const [parsedBody, setParsedBody] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("U");
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

  const [copyToast, setCopyToast] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/api/auth/me")
      .then((res) => {
        if (res.data?.name)
          setName(res.data.name.charAt(0).toUpperCase());
        if (res.data?.subscription)
          setSubscriptionPlan(res.data.subscription);
      })
      .catch(() => {
        localStorage.removeItem("autopilot_token");
        router.push("/login");
      });
  }, [router]);

  const handleGenerate = async () => {
    setError("");
    setResult("");
    setParsedSubject("");
    setParsedBody("");

    if (!details.trim()) {
      setError("Please describe the email you'd like to create.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/email/generate", {
        subject: subject || undefined,
        prompt: details,
      });

      const output = res.data.output || "";
      setResult(output);
      parseEmail(output);
    } catch (e: any) {
      setError(
        e?.response?.data?.detail ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const parseEmail = (text: string) => {
    const subjectMatch = text.match(/Subject:\s*(.*)/i);
    const body = text.replace(/Subject:.*\n?/i, "").trim();

    setParsedSubject(subjectMatch?.[1] || subject || "No subject");
    setParsedBody(body || text);
  };

  const openInEmailClient = () => {
    const mailto = `mailto:?subject=${encodeURIComponent(
      parsedSubject || "No subject"
    )}&body=${encodeURIComponent(parsedBody || result || "")}`;

    window.location.href = mailto;
  };

  const copyEmail = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2000);
  };

  const clearAll = () => {
    setSubject("");
    setDetails("");
    setResult("");
    setParsedSubject("");
    setParsedBody("");
    setError("");
  };

  const quickTemplates = [
    "Cold outreach — professional introduction with clear value proposition",
    "Follow-up — polite reminder to a previous conversation",
    "Client check-in — strengthen relationship and offer additional support",
    "Sales proposal — concise pitch with benefits and next steps",
    "Thank you note — express appreciation after a meeting or purchase",
  ];

  return (
    <div className="min-h-screen bg-[#050810] text-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b06_1px,transparent_1px),linear-gradient(to_bottom,#1e293b06_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="relative">
        <DashboardNavbar name={name} subscriptionPlan={subscriptionPlan} />

        {copyToast && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-emerald-500/95 text-white border border-emerald-400/30 shadow-lg backdrop-blur-xl">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            <span className="font-medium">Copied to clipboard</span>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Email Writer
                </h1>
                <p className="mt-5 text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed">
                  Craft precise, professional emails — outreach, follow-ups,
                  proposals, and client communication.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => router.push("/dashboard/work")}
                  className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-200 font-medium transition-all duration-300"
                >
                  My Work →
                </button>
                <button
                  onClick={clearAll}
                  className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-200 font-medium transition-all duration-300"
                >
                  Clear
                </button>
              </div>
            </div>
          </motion.section>

          <section className="grid gap-10 lg:grid-cols-[1fr,380px] mb-20">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-2xl p-8 md:p-10 shadow-2xl shadow-black/40"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]" />

              <div className="relative space-y-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">
                    Subject line (optional)
                  </label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Exploring a potential collaboration"
                    className="w-full px-5 py-4 rounded-2xl bg-black/50 border border-white/10 hover:border-white/20 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder:text-slate-500 focus:outline-none transition-all duration-300"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Leave blank to let the AI suggest an effective subject.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">
                    Email details
                  </label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={9}
                    placeholder="Recipient, context, tone, key points, CTA…"
                    className="w-full px-5 py-4 rounded-2xl bg-black/50 border border-white/10 hover:border-white/20 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder:text-slate-500 resize-none focus:outline-none transition-all duration-300"
                  />
                  <div className="mt-3 flex justify-between text-xs text-slate-500">
                    <span>Tip: One clear goal per email converts best.</span>
                    <span className="tabular-nums font-medium">{details.length} chars</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-400 mb-4">
                    Quick starters
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickTemplates.map((template, i) => {
                      const [title, body] = template.split(" — ");
                      return (
                        <button
                          key={i}
                          onClick={() => setDetails(body || template)}
                          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/40 text-sm text-slate-200 font-medium transition-all duration-300"
                        >
                          {title}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6 pt-2">
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="relative overflow-hidden px-10 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl font-semibold disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]"
                  >
                    <span className="relative z-10">
                      {loading ? "Generating…" : "Generate Email"}
                    </span>
                    {!loading && <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />}
                  </button>
                  {error && <p className="text-sm text-red-400 font-medium">{error}</p>}
                </div>

                <p className="text-xs text-slate-500">
                  All generated emails are automatically saved to My Work.
                </p>
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="rounded-3xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-2xl p-6 shadow-xl shadow-black/30">
                <p className="text-sm font-semibold text-slate-200 mb-4">
                  High-performing email principles
                </p>
                <ul className="space-y-2.5 text-sm text-slate-400">
                  <li>• State the purpose in the first sentence</li>
                  <li>• Focus on recipient value, not features</li>
                  <li>• Keep one clear CTA</li>
                  <li>• Respect the reader's time</li>
                </ul>
              </div>

              <div className="rounded-3xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-2xl p-6 shadow-xl shadow-black/30">
                <p className="text-sm font-semibold text-slate-200 mb-4">
                  Quick actions
                </p>
                <div className="grid gap-2">
                  <button
                    onClick={copyEmail}
                    disabled={!result}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/40 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed text-left"
                  >
                    <p className="text-sm font-medium text-slate-200">Copy email text</p>
                    <p className="text-xs text-slate-500 mt-0.5">Copy full email to clipboard</p>
                  </button>
                  <button
                    onClick={() => router.push("/dashboard/work")}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/40 hover:bg-white/10 transition text-left"
                  >
                    <p className="text-sm font-medium text-slate-200">Open My Work</p>
                    <p className="text-xs text-slate-500 mt-0.5">See saved emails</p>
                  </button>
                  <button
                    onClick={clearAll}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition text-left"
                  >
                    <p className="text-sm font-medium text-slate-200">Reset form</p>
                    <p className="text-xs text-slate-500 mt-0.5">Clear and start fresh</p>
                  </button>
                </div>
              </div>
            </motion.aside>
          </section>

          {(parsedBody || parsedSubject) && (
            <motion.section
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-24"
            >
              <div className="rounded-3xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-2xl shadow-2xl shadow-black/40 overflow-hidden">
                <div className="px-8 py-6 border-b border-white/10 bg-white/[0.03]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Subject
                  </p>
                  <h2 className="text-2xl font-bold text-white">
                    {parsedSubject}
                  </h2>
                </div>

                <div className="px-8 py-6 border-b border-white/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-semibold text-white">
                    {name}
                  </div>
                  <div>
                    <p className="font-medium text-white">You — AutopilotAI</p>
                    <p className="text-slate-400 text-sm">To recipient</p>
                  </div>
                </div>

                <div className="px-8 py-8 whitespace-pre-wrap leading-relaxed text-slate-200">
                  {parsedBody}
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-3 mt-6">
                <button
                  onClick={copyEmail}
                  className="px-6 py-3 rounded-xl border border-white/20 text-slate-200 font-medium hover:bg-white/10 transition"
                >
                  Copy Raw Text
                </button>
                <button
                  onClick={openInEmailClient}
                  className="px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition"
                >
                  Open in Email App
                </button>
              </div>
            </motion.section>
          )}
        </main>
      </div>
    </div>
  );
}
