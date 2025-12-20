"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function EmailPage() {
  const router = useRouter();

  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");

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

    if (!details.trim()) {
      setError("Write some email details first.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/email/generate", {
        subject,
        details,
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
      <div className="flex items-center justify-between mb-16">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            AI Email Writer
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Outreach, follow-ups, client replies, cold emails — written in your tone.
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

      {/* INPUTS */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-3xl rounded-3xl border border-gray-200 p-8 bg-white shadow-sm"
      >
        {/* SUBJECT */}
        <label className="text-sm uppercase tracking-wide text-gray-500">
          Email Subject (optional)
        </label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Quick question about working together"
          className="w-full mt-3 p-4 rounded-2xl border border-gray-200
                     focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        {/* DETAILS */}
        <label className="text-sm uppercase tracking-wide text-gray-500 mt-6 block">
          Email Details
        </label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Who is this for? What do you want? Tone? CTA? Any context?"
          rows={7}
          className="w-full mt-3 p-4 rounded-2xl border border-gray-200
                     focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        {/* BUTTON */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-6 px-7 py-3 rounded-full bg-black text-white
                     hover:bg-gray-900 transition disabled:opacity-60"
        >
          {loading ? "Generating…" : "Generate Email"}
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
          className="mt-12 max-w-3xl rounded-3xl border border-amber-200 bg-amber-50 p-8 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              Generated Email
              <span className="text-amber-600"> ·</span>
            </h3>

            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="px-5 py-2 rounded-full border border-amber-300
                         hover:bg-amber-100 transition text-sm"
            >
              Copy
            </button>
          </div>

          <pre className="mt-4 whitespace-pre-wrap text-gray-800 leading-relaxed text-[15px]">
            {result}
          </pre>
        </motion.div>
      )}
    </div>
  );
}
