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
    <div className="min-h-screen bg-white text-black">

      {/* 🌟 SAME GLOBAL DASHBOARD NAV */}
      <DashboardNavbar name={name} subscriptionPlan={subscriptionPlan} />

      <div className="px-6 md:px-16 py-12 max-w-7xl mx-auto">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold">
            Email Writer<span className="text-amber-500">.</span>
          </h1>

          <p className="text-gray-600 mt-2 text-lg">
            Outreach, follow-ups, client replies — written in your voice.
          </p>

          {subscriptionPlan && (
            <p className="mt-1 text-xs text-gray-500">
              Plan:{" "}
              <span className="capitalize font-medium">
                {subscriptionPlan}
              </span>
            </p>
          )}
        </div>

        {/* GENERATION AREA */}
        <motion.section
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,2.2fr),minmax(280px,1fr)] max-w-6xl"
        >
          {/* LEFT CARD */}
          <div className="rounded-3xl border border-gray-200 bg-white shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Step 1 · Define the email
                </p>
                <h3 className="text-xl font-semibold mt-1">
                  What should this email do?
                </h3>
              </div>

              <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                Outreach / Follow-up / Reply
              </span>
            </div>

            {/* SUBJECT */}
            <div className="mb-6">
              <label className="text-sm uppercase tracking-wide text-gray-500">
                Subject (optional)
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Quick idea about working together"
                className="w-full mt-3 p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <p className="mt-2 text-xs text-gray-500">
                Leave empty to let AI choose a strong subject line.
              </p>
            </div>

            {/* DETAILS */}
            <div className="mb-5">
              <label className="text-sm uppercase tracking-wide text-gray-500">
                Email details
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={7}
                placeholder="Who is this for? What do you want? Mention tone (friendly, confident, luxury, aggressive). Example: Cold outreach to a gym owner pitching custom MMA mouthguards. Short, confident, benefit-focused, clear CTA to book a call."
                className="w-full mt-3 p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none text-[15px]"
              />
            </div>

            {/* QUICK PRESETS */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Chip
                label="Cold outreach"
                onClick={() =>
                  setDetails(
                    "Cold outreach email to a gym owner offering custom MMA mouthguards. Confident, short, benefit-focused, CTA to book a call."
                  )
                }
              />
              <Chip
                label="Follow-up"
                onClick={() =>
                  setDetails(
                    "Follow up email to someone who showed interest in custom MMA mouthguards but stopped replying. Polite, respectful, small urgency."
                  )
                }
              />
              <Chip
                label="Client email"
                onClick={() =>
                  setDetails(
                    "Friendly check-in email to an existing customer asking for feedback and offering a referral discount."
                  )
                }
              />
            </div>

            {/* BUTTON */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-2 px-7 py-3 rounded-full bg-black text-white hover:bg-gray-900 transition disabled:opacity-60"
            >
              {loading ? "Generating…" : "Generate Email"}
            </button>

            {error && (
              <p className="mt-4 text-sm text-red-500">{error}</p>
            )}

            <p className="mt-3 text-xs text-gray-500">
              Emails are automatically saved in{" "}
              <span className="font-medium">My Work</span>.
            </p>
          </div>

          {/* RIGHT INFO PANEL */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
              <h4 className="text-sm font-semibold mb-2">
                Strong emails include:
              </h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Who you are & why you’re messaging</li>
                <li>• One clear benefit</li>
                <li>• Simple CTA (reply, call, click)</li>
                <li>• Tone: professional / casual / aggressive</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-amber-100 bg-amber-50 p-6">
              <h4 className="text-sm font-semibold text-amber-800 mb-1">
                Quick email rule
              </h4>
              <p className="text-sm text-amber-800">
                Short, respectful, confident ➝ wins more than long paragraphs.
              </p>
            </div>
          </div>
        </motion.section>

        {/* RESULT */}
        {result && (
          <motion.section
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 max-w-6xl pb-24"
          >
            <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-amber-600">
                    Step 2 · Review & send
                  </p>
                  <h3 className="text-xl font-semibold">Generated Email</h3>
                </div>

                <button
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="px-4 py-2 rounded-full border border-amber-300 hover:bg-amber-100 transition text-sm"
                >
                  Copy email
                </button>
              </div>

              <pre className="whitespace-pre-wrap text-gray-900 leading-relaxed text-[15px]">
                {result}
              </pre>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}

/* COMPONENT */
function Chip({ label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full border border-gray-300 text-xs text-gray-700 hover:border-amber-400 hover:text-amber-700 transition"
    >
      {label}
    </button>
  );
}
