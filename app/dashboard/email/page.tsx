"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function EmailPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-white text-black flex">

      {/* LEFT SIDEBAR */}
      <aside className="w-64 border-r border-gray-200 px-8 py-10 hidden md:block">
        <h1
          onClick={() => router.push("/dashboard")}
          className="text-2xl font-bold tracking-tight cursor-pointer hover:opacity-70"
        >
          AutopilotAI<span className="text-amber-500">.</span>
        </h1>

        <nav className="mt-10 space-y-3">
          <NavItem label="Dashboard" path="/dashboard" />
          <NavItem label="Content" path="/dashboard/content" />
          <NavItem label="Email" active />
          <NavItem label="Ads" path="/dashboard/ads" />
          <NavItem label="My Work" path="/dashboard/work" />
          <NavItem label="Pricing" path="/pricing" />
          <NavItem label="Billing" path="/billing" />
          <NavItem label="Profile" path="/dashboard/profile" />
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1 px-10 py-10">

        {/* AVATAR MENU */}
        <div className="flex justify-end mb-8 relative">
          <button
            onClick={() => setMenuOpen(true)}
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold"
          >
            U
          </button>

          <AnimatePresence>
            {menuOpen && (
              <>
                <div className="fixed inset-0" onClick={() => setMenuOpen(false)} />

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-12 w-64 rounded-3xl bg-white border shadow-xl"
                >
                  <MenuItem text="Profile" onClick={() => router.push("/dashboard/profile")} />
                  <MenuItem text="My Work" onClick={() => router.push("/dashboard/work")} />
                  <MenuItem text="Billing" onClick={() => router.push("/billing")} />
                  <MenuItem text="Pricing" onClick={() => router.push("/pricing")} />
                  <MenuItem
                    danger
                    text="Log out"
                    onClick={() => {
                      localStorage.removeItem("autopilot_token");
                      router.push("/login");
                    }}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-4xl font-bold">AI Email Writer</h2>
          <p className="text-gray-600 mt-2 text-lg">
            Outreach, follow-ups, replies — clear, persuasive, in your tone.
          </p>
        </motion.div>

        {/* INPUT CARD */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 max-w-3xl rounded-3xl border border-gray-200 bg-white shadow-sm p-8"
        >
          {/* SUBJECT */}
          <label className="uppercase text-sm text-gray-500">Subject (optional)</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full mt-2 p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-amber-400 outline-none"
            placeholder="Quick question about working together…"
          />

          {/* DETAILS */}
          <label className="uppercase text-sm text-gray-500 mt-6 block">Details</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={7}
            className="w-full mt-2 p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-amber-400 outline-none"
            placeholder="Who is it for? What do you want? Tone? CTA? Context?"
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-6 px-7 py-3 bg-black text-white rounded-full hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? "Generating…" : "Generate Email"}
          </button>

          {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
        </motion.div>

        {/* RESULT */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 max-w-3xl rounded-3xl border border-amber-200 bg-amber-50 p-8"
          >
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold text-xl">Generated Email</h3>

              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="px-4 py-2 rounded-full border border-amber-300 hover:bg-amber-100 text-sm"
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
    </div>
  );
}

/******** COMPONENTS *********/

function NavItem({ label, path, active }: any) {
  return (
    <button
      onClick={() => path && (window.location.href = path)}
      className={`block w-full text-left px-4 py-2 rounded-xl border ${
        active
          ? "bg-black text-white border-black"
          : "border-gray-300 hover:border-black"
      }`}
    >
      {label}
    </button>
  );
}

function MenuItem({ text, onClick, danger }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-6 py-4 text-sm ${
        danger ? "text-red-500" : "text-gray-700"
      } hover:bg-gray-100`}
    >
      {text}
    </button>
  );
}
