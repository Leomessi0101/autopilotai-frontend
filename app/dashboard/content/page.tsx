"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";

/* =========================
   CONTENT PAGE
   ========================= */
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
      setError("Tell me what kind of content you’d like to create first! 😊");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/api/content/generate", { title, details });
      setResult(res.data.output || "");
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Oops, something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const quickTemplates = [
    {
      label: "Instagram Caption",
      text: "Short Instagram caption for my product. Confident tone, highlight benefits, strong CTA.",
    },
    {
      label: "LinkedIn Post",
      text: "Professional LinkedIn post sharing a win or insight. Thought-leadership style, engaging question at the end.",
    },
    {
      label: "Twitter Thread",
      text: "Engaging Twitter thread (3-5 tweets) on a topic I know well. Hook first, value in the middle, CTA at the end.",
    },
    {
      label: "Product Description",
      text: "Compelling product description that sells benefits, not just features. Persuasive and clear.",
    },
    {
      label: "YouTube Script Intro",
      text: "Energetic YouTube video intro script that hooks viewers in the first 10 seconds.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-gray-50 text-black">
      <DashboardNavbar name={name} subscriptionPlan={subscriptionPlan} />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            Content Generator ✨
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Posts, captions, threads, scripts — let AI write it for you in seconds.
          </p>
        </motion.section>

        {/* Main Grid */}
        <section className="grid gap-10 lg:grid-cols-[1fr,380px] mb-16">
          {/* Input Area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-lg font-medium text-gray-700">What would you like to create today?</p>
              </div>
              <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                AI Writing
              </span>
            </div>

            {/* Title (optional) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title or topic (optional)
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Instagram caption for my coffee brand"
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-amber-200 transition"
              />
            </div>

            {/* Details */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe what you need
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={8}
                placeholder="Platform? Tone? Length? Audience? Key points? The more you tell me, the better it gets! 😊"
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-amber-200 resize-none transition text-base"
              />
            </div>

            {/* Quick Templates */}
            <div className="mb-8">
              <p className="text-sm font-medium text-gray-700 mb-4">Quick starters</p>
              <div className="flex flex-wrap gap-3">
                {quickTemplates.map((template) => (
                  <button
                    key={template.label}
                    onClick={() => setDetails(template.text)}
                    className="px-5 py-3 rounded-full bg-gray-100 text-gray-800 hover:bg-amber-100 hover:text-amber-900 transition font-medium text-sm"
                  >
                    {template.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button + Error */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-10 py-5 bg-black text-white rounded-full font-bold text-lg hover:bg-gray-800 transition shadow-lg disabled:opacity-60"
              >
                {loading ? "Generating magic…" : "Generate Content ✨"}
              </button>

              {error && <p className="text-red-500 ml-4">{error}</p>}
            </div>

            <p className="mt-6 text-sm text-gray-500">
              Everything you generate is automatically saved in <span className="font-medium">My Work</span>.
            </p>
          </motion.div>

          {/* Tips Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 shadow-lg border border-amber-100">
              <h4 className="text-xl font-bold text-gray-900 mb-4">✨ Tips for amazing results</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <span>Be specific about platform & tone</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">👥</span>
                  <span>Mention your target audience</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <span>Include key points or examples</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">📣</span>
                  <span>Add a clear call-to-action if needed</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-3">🚀 Pro tip</h4>
              <p className="text-gray-700">
                Start with a quick template, tweak it a little, then generate — fastest way to great content!
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
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-xl p-12 border border-amber-200">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-lg font-medium text-amber-800 mb-2">Here’s your content 🎉</p>
                  <h3 className="text-3xl font-bold text-gray-900">Ready to post or edit</h3>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition shadow-lg"
                >
                  Copy to Clipboard
                </button>
              </div>

              <div className="bg-white rounded-2xl p-10 shadow-inner">
                <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed text-lg font-medium">
                  {result}
                </pre>
              </div>
            </div>
          </motion.section>
        )}

        {/* Contact Footer */}
        <footer className="text-center py-12 border-t border-gray-200">
          <p className="text-gray-600">
            Need help or have ideas? Email us at{" "}
            <a href="mailto:contact@autopilotai.dev" className="font-medium text-black hover:underline">
              contact@autopilotai.dev
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}