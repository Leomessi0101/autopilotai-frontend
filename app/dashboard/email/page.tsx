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
          {/* Input */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10"
          >
            {/* Subject */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Subject line (optional)
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Exploring a potential collaboration"
                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-900 transition"
              />
            </div>

            {/* Details */}
            <div className="mb-10">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email details
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={9}
                placeholder="Recipient, tone, purpose, details..."
                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-900 resize-none transition text-base"
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
                    className="px-5 py-3 rounded-xl bg-gray-100 text-gray-800 hover:bg-blue-50 hover:text-blue-900 transition font-medium text-sm"
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
                className="px-10 py-4 bg-blue-900 text-white rounded-xl font-medium hover:bg-blue-800 transition disabled:opacity-60"
              >
                {loading ? "Generating…" : "Generate Email"}
              </button>

              {error && <p className="text-red-600 ml-4">{error}</p>}
            </div>
          </motion.div>

          {/* Sidebar */}
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
                <li>Be clear early</li>
                <li>Lead with value</li>
                <li>One clear next step</li>
                <li>Respect the reader’s time</li>
              </ul>
            </div>
          </motion.div>
        </section>

        {/* Output */}
        {(parsedBody || parsedSubject) && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-24"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-8 py-6 border-b bg-gray-50">
                <p className="text-sm text-gray-500 mb-1">Subject</p>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {parsedSubject}
                </h2>
              </div>

              <div className="px-8 py-8 whitespace-pre-wrap text-gray-800 text-base">
                {parsedBody}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="px-8 py-3 border rounded-xl"
              >
                Copy Text
              </button>

              <button
                onClick={openInEmailClient}
                className="px-8 py-3 bg-blue-900 text-white rounded-xl"
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
