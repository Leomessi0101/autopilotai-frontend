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
      setError("Please describe the email you’d like to create.");
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
    <div className="min-h-screen bg-[#05070d] text-white relative overflow-hidden">
      {/* Cinematic background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 w-[900px] h-[900px] bg-[conic-gradient(at_top_left,var(--tw-gradient-stops))] from-[#0c1a39] via-[#0a1630] to-transparent blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[900px] h-[900px] bg-[conic-gradient(at_bottom_right,var(--tw-gradient-stops))] from-[#0d1b3d] via-[#111a2c] to-transparent blur-[200px]" />
      </div>

      <DashboardNavbar name={name} subscriptionPlan={subscriptionPlan} />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        {/* HEADER */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-light">
                Email Writer
              </h1>
              <p className="mt-6 text-xl text-gray-300 max-w-3xl">
                Craft precise, professional emails — outreach, follow-ups,
                proposals, and client communication.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push("/dashboard/work")}
                className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#2b4e8d] transition"
              >
                My Work →
              </button>
              <button
                onClick={clearAll}
                className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition"
              >
                Clear
              </button>
            </div>
          </div>
        </motion.section>

        {/* MAIN GRID */}
        <section className="grid gap-10 lg:grid-cols-[1fr,380px] mb-20">
          {/* INPUT PANEL */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-[0_60px_140px_rgba(0,0,0,.55)]"
          >
            {/* Subject */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subject line (optional)
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Exploring a potential collaboration"
                className="w-full px-5 py-4 rounded-2xl bg-black/25 border border-white/20 text-white focus:ring-2 focus:ring-[#6d8ce8] outline-none"
              />
              <p className="mt-2 text-xs text-gray-400">
                Leave blank to let the AI suggest an effective subject.
              </p>
            </div>

            {/* DETAILS */}
            <div className="mb-10">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email details
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={9}
                placeholder="Recipient, context, tone, key points, CTA…"
                className="w-full px-5 py-4 rounded-2xl bg-black/25 border border-white/20 text-white focus:ring-2 focus:ring-[#6d8ce8] resize-none outline-none"
              />
              <div className="mt-3 flex justify-between text-xs text-gray-400">
                <span>Tip: One clear goal per email converts best.</span>
                <span>{details.length} chars</span>
              </div>
            </div>

            {/* QUICK STARTERS */}
            <div className="mb-10">
              <p className="text-sm font-medium text-gray-300 mb-4">
                Quick starters
              </p>
              <div className="flex flex-wrap gap-3">
                {quickTemplates.map((template, i) => {
                  const [title, body] = template.split(" — ");
                  return (
                    <button
                      key={i}
                      onClick={() => setDetails(body || template)}
                      className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#6d8ce8]/60 hover:bg-white/10 transition text-sm"
                    >
                      {title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between gap-6">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="relative px-10 py-4 bg-[#6d8ce8] text-black rounded-2xl disabled:opacity-60 hover:bg-white transition font-medium shadow-[0_20px_60px_rgba(109,140,232,.25)]"
              >
                {loading ? "Generating…" : "Generate Email"}
              </button>

              {error && <p className="text-red-400">{error}</p>}
            </div>

            <p className="mt-6 text-xs text-gray-400">
              All generated emails are automatically saved to My Work.
            </p>
          </motion.div>

          {/* SIDEBAR */}
          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="space-y-8"
          >
            {/* Writing tips */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 shadow-[0_40px_100px_rgba(0,0,0,.45)]">
              <p className="text-sm font-medium text-gray-200 mb-4">
                High-performing email principles
              </p>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>• State the purpose in the first sentence</li>
                <li>• Focus on recipient value, not features</li>
                <li>• Keep one clear CTA</li>
                <li>• Respect the reader’s time</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <p className="text-sm font-medium text-gray-200 mb-4">
                Quick actions
              </p>
              <div className="grid gap-3">
                <button
                  onClick={copyEmail}
                  disabled={!result}
                  className="px-5 py-3 rounded-2xl bg-black/25 border border-white/10 hover:border-[#6d8ce8]/60 transition disabled:opacity-50 text-left"
                >
                  Copy email text
                </button>

                <button
                  onClick={() => router.push("/dashboard/work")}
                  className="px-5 py-3 rounded-2xl bg-black/25 border border-white/10 hover:border-[#2b4e8d] transition text-left"
                >
                  Open My Work
                </button>
              </div>
            </div>
          </motion.aside>
        </section>

        {/* RESULT */}
        {(parsedBody || parsedSubject) && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-24"
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_40px_90px_rgba(0,0,0,.6)] overflow-hidden">
              {/* Subject */}
              <div className="px-8 py-6 border-b border-white/10 bg-white/10">
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                  Subject
                </p>
                <h2 className="text-2xl font-semibold text-white">
                  {parsedSubject}
                </h2>
              </div>

              {/* Meta */}
              <div className="px-8 py-6 border-b border-white/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1b2f54] to-[#6d8ce8] flex items-center justify-center font-semibold">
                  {name}
                </div>
                <div>
                  <p className="font-medium text-white">
                    You — AutopilotAI
                  </p>
                  <p className="text-gray-400 text-sm">To recipient</p>
                </div>
              </div>

              {/* BODY */}
              <div className="px-8 py-8 whitespace-pre-wrap leading-relaxed text-gray-100">
                {parsedBody}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap justify-end gap-4 mt-8">
              <button
                onClick={copyEmail}
                className="px-8 py-3 border border-white/20 rounded-2xl hover:border-[#6d8ce8] transition"
              >
                Copy Raw Text
              </button>

              <button
                onClick={openInEmailClient}
                className="px-8 py-3 bg-white text-black rounded-2xl font-medium hover:bg-gray-200 transition"
              >
                Open in Email App
              </button>
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}
