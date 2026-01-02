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
        if (res.data?.name) setName(res.data.name.charAt(0).toUpperCase());
        if (res.data?.subscription) setSubscriptionPlan(res.data.subscription);
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
        e?.response?.data?.detail || "Something went wrong. Please try again."
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

  const quickTemplates = [
    "Cold outreach — professional introduction with clear value proposition",
    "Follow-up — polite reminder to a previous conversation",
    "Client check-in — strengthen relationship and offer additional support",
    "Sales proposal — concise pitch with benefits and next steps",
    "Thank you note — express appreciation after a meeting or purchase",
  ];

  return (
    <div className="min-h-screen bg-[#05070d] text-white relative overflow-hidden">

      {/* Cinematic Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 w-[900px] h-[900px] bg-[conic-gradient(at_top_left,var(--tw-gradient-stops))] from-[#0c1a39] via-[#0a1630] to-transparent blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[900px] h-[900px] bg-[conic-gradient(at_bottom_right,var(--tw-gradient-stops))] from-[#0d1b3d] via-[#111a2c] to-transparent blur-[200px]" />
      </div>

      <DashboardNavbar name={name} subscriptionPlan={subscriptionPlan} />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">

        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-light">
            Email Writer
          </h1>
          <p className="mt-6 text-xl text-gray-300">
            Craft precise, professional emails — outreach, follow-ups, and client communication.
          </p>
        </motion.section>

        {/* Main Grid */}
        <section className="grid gap-10 lg:grid-cols-[1fr,380px] mb-20">

          {/* Input Area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-[0_50px_120px_rgba(0,0,0,.5)]"
          >
            <div className="mb-10">
              <p className="text-lg font-medium text-gray-200">
                Describe the email you need
              </p>
            </div>

            {/* Subject */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subject line (optional)
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Exploring a potential collaboration"
                className="w-full px-5 py-4 rounded-xl bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-[#6d8ce8]"
              />
              <p className="mt-2 text-sm text-gray-400">
                Leave blank to let the AI suggest an effective subject.
              </p>
            </div>

            {/* Details */}
            <div className="mb-10">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Details
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={9}
                placeholder="Recipient, purpose, tone, key points, desired outcome."
                className="w-full px-5 py-4 rounded-xl bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-[#6d8ce8] resize-none"
              />
            </div>

            {/* Quick Templates */}
            <div className="mb-10">
              <p className="text-sm font-medium text-gray-300 mb-4">
                Quick starters
              </p>
              <div className="flex flex-wrap gap-3">
                {quickTemplates.map((template, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setDetails(template.split(" — ")[1] || template)
                    }
                    className="px-5 py-3 rounded-xl bg-white/10 text-gray-200 hover:bg-white/20 transition font-medium text-sm"
                  >
                    {template.split(" — ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Button */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-10 py-4 bg-white text-black rounded-xl font-medium disabled:opacity-60"
              >
                {loading ? "Generating…" : "Generate Email"}
              </button>

              {error && <p className="text-red-400 ml-4">{error}</p>}
            </div>

            <p className="mt-6 text-sm text-gray-400">
              All generated emails are automatically saved in My Work.
            </p>
          </motion.div>

          {/* Tips Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-gray-200 space-y-6 shadow-[0_50px_120px_rgba(0,0,0,.5)]"
          >
            <h4 className="text-lg font-semibold">Guidelines for stronger emails</h4>
            <ul className="space-y-3 text-gray-300">
              <li>State purpose early and clearly</li>
              <li>Lead with value for the recipient</li>
              <li>Include one clear next step</li>
              <li>Keep length appropriate to context</li>
            </ul>
          </motion.div>
        </section>

        {/* Result Section */}
        {(parsedBody || parsedSubject) && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-24"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg overflow-hidden">

              {/* Email Header */}
              <div className="px-8 py-6 border-b border-white/10 bg-white/10">
                <p className="text-sm text-gray-300 mb-1">Subject</p>
                <h2 className="text-2xl font-semibold text-white">
                  {parsedSubject}
                </h2>
              </div>

              {/* Meta */}
              <div className="px-8 py-6 border-b border-white/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center text-lg font-semibold">
                  {name}
                </div>
                <div>
                  <p className="font-medium text-white">
                    You — AutopilotAI
                  </p>
                  <p className="text-gray-400 text-sm">To recipient</p>
                </div>
              </div>

              {/* Body */}
              <div className="px-8 py-8 leading-relaxed whitespace-pre-wrap text-gray-100 text-base">
                {parsedBody}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap justify-end gap-4 mt-8">
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="px-8 py-3 border border-white/20 rounded-xl"
              >
                Copy Raw Text
              </button>

              <button
                onClick={openInEmailClient}
                className="px-8 py-3 bg-white text-black rounded-xl font-medium"
              >
                Open in Email App
              </button>
            </div>
          </motion.section>
        )}

        {/* Footer */}
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
