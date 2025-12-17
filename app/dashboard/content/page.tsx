"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

const PLATFORMS = [
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "twitter", label: "X / Twitter" },
  { key: "linkedin", label: "LinkedIn" },
];

export default function ContentPage() {
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("instagram");

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) router.push("/login");
  }, [router]);

  const handleGenerate = async () => {
    setError("");
    setResult("");

    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (!topic.trim()) {
      setError("Write what you want to create content for.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/content/generate", {
        topic,
        platform,
      });

      setResult(res.data.output || "");
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-14 py-12 text-black">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-14">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Content Generator
          </h1>
          <p className="text-gray-600 mt-2">
            Generate ready-to-post content — no advice, no fluff.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-5 py-2 rounded-full border border-gray-300
                       hover:border-amber-400 hover:text-amber-600 transition"
          >
            ← Dashboard
          </button>
          <button
            onClick={() => router.push("/dashboard/work")}
            className="px-5 py-2 rounded-full bg-black text-white
                       hover:bg-gray-900 transition"
          >
            My Work
          </button>
        </div>
      </div>

      {/* INPUT CARD */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-3xl rounded-3xl border border-gray-200 p-8 bg-white shadow-sm"
      >
        {/* PLATFORM SELECTOR */}
        <div className="mb-6">
          <p className="text-sm uppercase tracking-wide text-gray-500 mb-3">
            Platform
          </p>
          <div className="flex gap-2 flex-wrap">
            {PLATFORMS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPlatform(p.key)}
                className={`px-4 py-2 rounded-full border transition text-sm
                  ${
                    platform === p.key
                      ? "bg-amber-500 border-amber-500 text-white"
                      : "border-gray-300 text-gray-700 hover:border-amber-400"
                  }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* TOPIC INPUT */}
        <label className="text-sm uppercase tracking-wide text-gray-500">
          What are you showcasing?
        </label>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Custom MMA mouthguards for fighters"
          className="w-full mt-3 p-4 rounded-2xl border border-gray-200
                     focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        {/* GENERATE */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-6 px-7 py-3 rounded-full bg-black text-white
                     hover:bg-gray-900 transition disabled:opacity-60"
        >
          {loading ? "Generating..." : "Generate content"}
        </button>

        {error && (
          <p className="mt-4 text-sm text-red-500">{error}</p>
        )}
      </motion.div>

      {/* RESULT */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-10 max-w-3xl rounded-3xl border border-amber-200 bg-amber-50 p-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">
              Result ·{" "}
              <span className="text-amber-600 capitalize">
                {platform}
              </span>
            </h3>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="px-4 py-2 rounded-full border border-amber-300
                         hover:bg-amber-100 transition text-sm"
            >
              Copy
            </button>
          </div>

          <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {result}
          </pre>
        </motion.div>
      )}
    </div>
  );
}
