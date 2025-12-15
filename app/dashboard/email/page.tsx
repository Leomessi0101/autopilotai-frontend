"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

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
  }, []);

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

      const res = await axios.post(
        "http://127.0.0.1:8000/api/email/generate",
        { subject, details },
        { headers: { Authorization: `Bearer ${token}` } }
      );

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
            Email Writer
          </h1>
          <p className="text-gray-600 mt-2">
            Write outreach, follow-ups, replies — instantly.
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
        <label className="text-sm uppercase tracking-wide text-gray-500">
          Subject (optional)
        </label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Quick question about your services"
          className="w-full mt-3 p-4 rounded-2xl border border-gray-200
                     focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        <label className="text-sm uppercase tracking-wide text-gray-500 mt-6 block">
          Email details
        </label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Who are you writing to, why, what do you want, tone, CTA..."
          rows={6}
          className="w-full mt-3 p-4 rounded-2xl border border-gray-200
                     focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-6 px-7 py-3 rounded-full bg-black text-white
                     hover:bg-gray-900 transition disabled:opacity-60"
        >
          {loading ? "Generating..." : "Generate"}
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
          <h3 className="text-xl font-semibold mb-4">
            Result <span className="text-amber-600">·</span>
          </h3>
          <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {result}
          </pre>
          <button
            onClick={() => navigator.clipboard.writeText(result)}
            className="mt-6 px-5 py-2 rounded-full border border-amber-300
                       hover:bg-amber-100 transition text-sm"
          >
            Copy
          </button>
        </motion.div>
      )}
    </div>
  );
}
