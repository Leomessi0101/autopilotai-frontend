"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";

const PLATFORMS = [
  { key: "meta", label: "Facebook / Instagram" },
  { key: "google", label: "Google Search" },
  { key: "tiktok", label: "TikTok" },
];

const OBJECTIVES = ["Leads", "Sales", "Traffic", "Brand Awareness"];

export default function AdsPage() {
  const router = useRouter();

  const [platform, setPlatform] = useState("meta");
  const [objective, setObjective] = useState("Leads");
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");

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

    if (!product.trim() || !audience.trim()) {
      setError("Fill in product + audience.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/ads/generate", {
        platform,
        objective,
        product,
        audience,
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

      {/* 🌟 GLOBAL DASHBOARD NAV */}
      <DashboardNavbar name={name} subscriptionPlan={subscriptionPlan} />

      <div className="px-6 md:px-16 py-12 max-w-7xl mx-auto">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold">
            Ad Generator<span className="text-amber-500">.</span>
          </h1>

          <p className="text-gray-600 mt-2 text-lg">
            High-converting ad copy: hooks, angles, CTAs — tailored to your offer.
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
          {/* LEFT MAIN PANEL */}
          <div className="rounded-3xl border border-gray-200 bg-white shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Step 1 · Define the campaign
                </p>
                <h3 className="text-xl font-semibold mt-1">
                  What are we trying to achieve?
                </h3>
              </div>

              <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                Paid Ads
              </span>
            </div>

            {/* PLATFORM */}
            <Section label="Platform">
              <div className="flex gap-2 flex-wrap">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setPlatform(p.key)}
                    className={`px-4 py-2 rounded-full border text-sm transition ${
                      platform === p.key
                        ? "bg-amber-500 border-amber-500 text-white"
                        : "border-gray-300 text-gray-700 hover:border-amber-400"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </Section>

            {/* OBJECTIVE */}
            <Section label="Objective">
              <div className="flex gap-2 flex-wrap">
                {OBJECTIVES.map((o) => (
                  <button
                    key={o}
                    onClick={() => setObjective(o)}
                    className={`px-4 py-2 rounded-full border text-sm transition ${
                      objective === o
                        ? "bg-black text-white border-black"
                        : "border-gray-300 text-gray-700 hover:border-amber-400"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </Section>

            {/* PRODUCT */}
            <Input
              label="What are you selling?"
              value={product}
              onChange={setProduct}
              placeholder="e.g. Custom MMA mouthguards — $60 premium protection"
            />

            {/* AUDIENCE */}
            <Input
              label="Who is this for?"
              value={audience}
              onChange={setAudience}
              placeholder="e.g. Amateur & pro fighters, 18–35, train at combat gyms"
            />

            {/* QUICK PRESETS */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Chip
                label="Direct response"
                onClick={() =>
                  setProduct(
                    "Custom MMA mouthguards with pro level protection and custom designs for serious fighters."
                  )
                }
              />
              <Chip
                label="Brand angle"
                onClick={() =>
                  setAudience(
                    "Combat sports fans who care about look + performance, active on Instagram and TikTok."
                  )
                }
              />
              <Chip
                label="High ticket"
                onClick={() =>
                  setProduct(
                    "Done-for-you custom mouthguard packages for gyms — design + branding included."
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
              {loading ? "Generating…" : "Generate Ad Copy"}
            </button>

            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

            <p className="mt-3 text-xs text-gray-500">
              Generated ads are automatically saved in{" "}
              <span className="font-medium">My Work</span>.
            </p>
          </div>

          {/* RIGHT KNOWLEDGE PANEL */}
          <div className="space-y-4">
            <InfoPanel
              title="Make your ads stronger"
              bullets={[
                "Say your main benefit clearly",
                "Mention who you want clicking",
                "Add pricing if relevant",
                "Choose urgency OR brand tone — not both",
              ]}
            />

            <TipPanel
              title="Performance tip"
              text="Test 3–5 angles, not one. Use variations and let the platform choose winners."
            />
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
                    Step 2 · Review & launch
                  </p>
                  <h3 className="text-xl font-semibold">
                    Generated Ad Copy
                    <span className="text-amber-600"> · {platform}</span>
                  </h3>
                </div>

                <button
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="px-4 py-2 rounded-full border border-amber-300 hover:bg-amber-100 transition text-sm"
                >
                  Copy ad
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

/* COMPONENTS */
function Section({ label, children }: any) {
  return (
    <div className="mb-6">
      <p className="text-sm uppercase tracking-wide text-gray-500 mb-3">
        {label}
      </p>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: any) {
  return (
    <div className="mb-6">
      <label className="text-sm uppercase tracking-wide text-gray-500">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full mt-3 p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
    </div>
  );
}

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

function InfoPanel({ title, bullets }: any) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
      <h4 className="text-sm font-semibold mb-2">{title}</h4>
      <ul className="text-sm text-gray-700 space-y-2">
        {bullets.map((b: string, i: number) => (
          <li key={i}>• {b}</li>
        ))}
      </ul>
    </div>
  );
}

function TipPanel({ title, text }: any) {
  return (
    <div className="rounded-3xl border border-amber-100 bg-amber-50 p-6">
      <h4 className="text-sm font-semibold mb-1 text-amber-800">
        {title}
      </h4>
      <p className="text-sm text-amber-800">{text}</p>
    </div>
  );
}
