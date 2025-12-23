"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function ContentPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  const [result, setResult] = useState("");
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

    if (!details.trim()) {
      setError("Please describe the content you’d like to create.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/api/content/generate", { title, details });
      setResult(res.data.output || "");
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const quickTemplates = [
    "Instagram caption — short, confident, benefit-focused with CTA",
    "LinkedIn post — professional, value-driven, thought leadership tone",
    "Twitter/X thread — engaging hook, clear value, strong close",
    "Product description — persuasive, benefit-oriented, premium feel",
    "YouTube script intro — high-energy hook for the first 10 seconds",
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
            Content Generator
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            Craft compelling posts, threads, and narratives tailored to your voice and audience.
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
              <p className="text-lg font-medium text-gray-700">Describe the content you need</p>
            </div>

            {/* Title (optional) */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Title or topic (optional)
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Launch announcement for new product line"
                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
              />
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
                placeholder="Platform, tone, length, audience, key points, or any specific direction."
                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900 resize-none transition text-base"
              />
            </div>

            {/* Quick Templates */}
            <div className="mb-10">
              <p className="text-sm font-medium text-gray-600 mb-4">Quick starters</p>
              <div className="flex flex-wrap gap-3">
                {quickTemplates.map((template, i) => (
                  <button
                    key={i}
                    onClick={() => setDetails(template)}
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
                {loading ? "Generating…" : "Generate Content"}
              </button>

              {error && <p className="text-red-600 ml-4">{error}</p>}
            </div>

            <p className="mt-6 text-sm text-gray-500">
              All generated content is automatically saved in My Work.
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
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Guidelines for stronger output</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
                  <span>Specify platform and format</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
                  <span>Define tone and voice clearly</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
                  <span>Include target audience details</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
                  <span>List key points or examples</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-8 border border-blue-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Best practice</h4>
              <p className="text-gray-700">
                Start specific, generate, then refine. Iteration produces the highest quality results.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Result */}
        {result && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-24"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Generated Content</p>
                  <h3 className="text-3xl font-semibold text-gray-900">Ready for review and use</h3>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="px-8 py-4 bg-blue-900 text-white rounded-xl font-medium hover:bg-blue-800 transition shadow-sm"
                >
                  Copy to Clipboard
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl p-10">
                <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed text-base font-medium">
                  {result}
                </pre>
              </div>
            </div>
          </motion.section>
        )}

        {/* Contact Footer */}
        <footer className="text-center py-12 border-t border-gray-200">
          <p className="text-gray-600">
            Questions? Reach out at{" "}
            <a href="mailto:contact@autopilotai.dev" className="font-medium text-blue-900 hover:underline">
              contact@autopilotai.dev
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}