"use client";

import { motion, AnimatePresence } from "framer-motion";
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

  const [menuOpen, setMenuOpen] = useState(false);
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
        if (res.data?.name) {
          setName(res.data.name.charAt(0).toUpperCase());
        }
        if (res.data?.subscription) {
          setSubscriptionPlan(res.data.subscription);
        }
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
    <div className="min-h-screen bg-white text-black flex">
      {/* SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 border-r border-gray-200 bg-white px-6 py-8">
        <h1
          onClick={() => router.push("/")}
          className="text-2xl font-semibold tracking-tight cursor-pointer"
        >
          AutopilotAI<span className="text-amber-500">.</span>
        </h1>

        <nav className="mt-12 space-y-4 text-sm">
          <SidebarItem label="Dashboard" onClick={() => router.push("/dashboard")} />
          <SidebarItem label="Generate Content" onClick={() => router.push("/dashboard/content")} />
          <SidebarItem label="Write Emails" active />
          <SidebarItem label="Create Ads" onClick={() => router.push("/dashboard/ads")} />
          <SidebarItem label="My Work" onClick={() => router.push("/dashboard/work")} />
          <SidebarItem label="Profile" onClick={() => router.push("/dashboard/profile")} />
          <SidebarItem label="Billing" onClick={() => router.push("/billing")} />
          <SidebarItem label="Pricing" onClick={() => router.push("/pricing")} />
        </nav>

        <div className="mt-auto pt-6 text-xs text-gray-500">
          Make every email sound like your brand.
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 px-6 md:px-16 py-10 overflow-y-auto">
        {/* TOP BAR */}
        <div className="flex justify-between items-center relative">
          <div>
            <h2 className="text-4xl font-bold tracking-tight">
              AI Email Writer
            </h2>
            <p className="text-gray-600 mt-2 text-lg">
              Outreach, follow-ups, replies — written clearly in your voice.
            </p>
            {subscriptionPlan && (
              <p className="mt-1 text-xs text-gray-500">
                Plan: <span className="capitalize font-medium">{subscriptionPlan}</span>
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setMenuOpen(true)}
            className="relative w-11 h-11 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 shadow-sm"
          >
            {name}
            <span className="absolute inset-0 rounded-full ring-2 ring-amber-400 opacity-40" />
          </motion.button>

          <AvatarMenu
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            router={router}
          />
        </div>

        {/* GENERATION AREA */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,2.2fr),minmax(260px,1fr)] max-w-6xl"
        >
          {/* LEFT: EMAIL PANEL */}
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
                Cold / follow-up / reply
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
                You can leave this empty if you want AI to decide a good subject line.
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
                placeholder="Who is this for? What do you offer? What do you want them to do? Mention tone (casual, direct, luxury, aggressive, etc.)."
                className="w-full mt-3 p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none text-[15px]"
              />
            </div>

            {/* QUICK CHIPS */}
            <div className="flex flex-wrap gap-2 mb-6">
              <QuickChip
                label="Cold outreach"
                onClick={() =>
                  setDetails(
                    "Cold email to a gym owner about partnering to offer custom MMA mouthguards to their members. Friendly but confident, short and to the point, with a clear CTA to book a quick call."
                  )
                }
              />
              <QuickChip
                label="Follow-up"
                onClick={() =>
                  setDetails(
                    "Follow-up email to someone who showed interest in custom MMA mouthguards but stopped replying. Respectful tone, mention benefit and urgency, ask if the timing is wrong."
                  )
                }
              />
              <QuickChip
                label="Client check-in"
                onClick={() =>
                  setDetails(
                    "Check-in email to an existing customer who bought custom MMA mouthguards, asking for feedback and offering a small discount if they refer a friend."
                  )
                }
              />
            </div>

            {/* BUTTON + ERROR */}
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
              Generated emails are saved automatically in <span className="font-medium">My Work</span>.
            </p>
          </div>

          {/* RIGHT: GUIDANCE */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
              <h4 className="text-sm font-semibold mb-2">What to include</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Who you are and why you&apos;re emailing</li>
                <li>• The main benefit in one clear sentence</li>
                <li>• One simple CTA (reply, book a call, click a link)</li>
                <li>• Tone: casual, professional, direct, etc.</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-amber-100 bg-amber-50 p-6">
              <h4 className="text-sm font-semibold mb-1 text-amber-800">
                Reminder for cold emails
              </h4>
              <p className="text-sm text-amber-800">
                Short, respectful, and clear beats long essays. One screen of text is usually enough.
              </p>
            </div>
          </div>
        </motion.section>

        {/* RESULT */}
        {result && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
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

/* ===== COMPONENTS ===== */

function SidebarItem({ label, onClick, active = false }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left py-2 transition text-sm ${
        active ? "text-black font-semibold" : "hover:translate-x-1"
      }`}
    >
      {label}
    </button>
  );
}

function AvatarMenu({ open, onClose, router }: any) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/20"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed top-20 right-6 w-80 rounded-3xl bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl z-30 overflow-hidden"
          >
            <div className="py-2">
              <MenuItem label="Dashboard" onClick={() => router.push("/dashboard")} />
              <MenuItem label="My Work" onClick={() => router.push("/dashboard/work")} />
              <MenuItem label="Billing" onClick={() => router.push("/billing")} />
              <MenuItem label="Subscription Plans" onClick={() => router.push("/pricing")} />
              <div className="border-t mt-2 pt-2">
                <MenuItem
                  label="Log out"
                  danger
                  onClick={() => {
                    localStorage.removeItem("autopilot_token");
                    router.push("/login");
                  }}
                />
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function MenuItem({ label, onClick, danger = false }: any) {
  return (
    <motion.button
      whileHover={{ x: 6 }}
      onClick={onClick}
      className={`w-full px-6 py-3 text-left text-sm ${
        danger ? "text-red-500" : "text-gray-700"
      } hover:bg-gray-100`}
    >
      {label}
    </motion.button>
  );
}

function QuickChip({ label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full border border-gray-300 text-xs text-gray-700 hover:border-amber-400 hover:text-amber-700 transition"
    >
      {label}
    </button>
  );
}
