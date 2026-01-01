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
    // Try to extract "Subject: ..."
    const subjectMatch = text.match(/Subject:\s*(.*)/i);
    const body = text.replace(/Subject:.*\n?/i, "").trim();

    setParsedSubject(subjectMatch?.[1] || subject || "No subject");
    setParsedBody(body || text);
  };

  const openInEmailClient = () => {
    // Leave "to" empty so their client asks / uses default
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
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <DashboardNavbar name={name} subscriptionPlan={subscriptionPlan} />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-light text-gray-800">
            Email Writer
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            Craft precise, professional emails — outreach, follow-ups, and
            client communication.
          </p>
        </motion.section>

        {/* Main Grid */}
        <section className="grid gap-10 lg:grid-cols-[1fr,380px] mb-20">
          {/* Input Area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10"
          >
            <div className="mb-10">
              <p className="text-lg font-medium text-gray-700">
                Describe the email you need
              </p>
            </div>

            {/* Subject (optional) */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Subject line (optional)
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Exploring a potential collaboration"
                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
              />
              <p className="mt-2 text-sm text-gray-500">
                Leave blank to let the AI suggest an effective subject.
              </p>
            </div>

            {/* Details */}
            <div className="mb-10">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Details
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={9}
                placeholder="Recipient, purpose, tone, key points, desired outcome."
                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900 resize-none transition text-base"
              />
            </div>

            {/* Quick Templates */}
            <div className="mb-10">
              <p className="text-sm font-medium text-gray-600 mb-4">
                Quick starters
              </p>
              <div className="flex flex-wrap gap-3">
                {quickTemplates.map((template, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setDetails(template.split(" — ")[1] || template)
                    }
                    className="px-5 py-3 rounded-xl bg-gray-100 text-gray-800 hover:bg-blue-50 hover:text-blue-900 hover:border-blue-900 transition font-medium text-sm border border-transparent"
                  >
                    {template.split(" — ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button + Error */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-10 py-4 bg-blue-900 text-white rounded-xl font-medium hover:bg-blue-800 transition shadow-sm disabled:opacity-60"
              >
                {loading ? "Generating…" : "Generate Email"}
              </button>

              {error && <p className="text-red-600 ml-4">{error}</p>}
            </div>

            <p className="mt-6 text-sm text-gray-500">
              All generated emails are automatically saved in My Work.
            </p>
          </motion.div>

          {/* Tips Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Guidelines for stronger emails
              </h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
                  <span>State purpose early and clearly</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
                  <span>Lead with value for the recipient</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
                  <span>Include one clear next step</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
                  <span>Keep length appropriate to context</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-8 border border-blue-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Best practice
              </h4>
              <p className="text-gray-700">
                The most effective emails are concise, respectful, and focused
                on the recipient’s interests.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Result — Gmail-style preview + actions */}
        {(parsedBody || parsedSubject) && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-24"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Email Header */}
              <div className="px-8 py-6 border-b bg-gray-50">
                <p className="text-sm text-gray-500 mb-1">Subject</p>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {parsedSubject}
                </h2>
              </div>

              {/* Meta */}
              <div className="px-8 py-6 border-b flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-900 text-white flex items-center justify-center text-lg font-semibold">
                  {name}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    You — AutopilotAI
                  </p>
                  <p className="text-gray-500 text-sm">To recipient</p>
                </div>
              </div>

              {/* Body */}
              <div className="px-8 py-8 leading-relaxed whitespace-pre-wrap text-gray-800 text-base">
                {parsedBody}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-end gap-4 mt-8">
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="px-8 py-3 border border-gray-300 rounded-xl font-medium hover:border-blue-900 transition"
              >
                Copy Raw Text
              </button>

              <button
                onClick={openInEmailClient}
                className="px-8 py-3 bg-blue-900 text-white rounded-xl font-medium hover:bg-blue-800 transition shadow-sm"
              >
                Open in Email App
              </button>
            </div>
          </motion.section>
        )}

        {/* Contact Footer */}
        <footer className="text-center py-12 border-t border-gray-200">
          <p className="text-gray-600">
            Questions? Reach out at{" "}
            <a
              href="mailto:contact@autopilotai.dev"
              className="font-medium text-blue-900 hover:underline"
            >
              contact@autopilotai.dev
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
