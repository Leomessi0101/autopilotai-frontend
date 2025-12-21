"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function ProfilePage() {
  const router = useRouter();

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("autopilot_token")
      : null;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("U");
  const [subscriptionPlan, setSubscriptionPlan] =
    useState<string | null>(null);

  const [form, setForm] = useState({
    full_name: "",
    company_name: "",
    company_website: "",
    title: "",
    brand_tone: "",
    industry: "",
    brand_description: "",
    target_audience: "",
    signature: "",
    writing_style: "",
  });

  /* ================= LOAD USER + PROFILE ================= */
  useEffect(() => {
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

    api
      .get("/api/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setForm(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router, token]);

  /* ================= HELPERS ================= */
  const updateField = (field: string, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const saveProfile = async () => {
    setSaving(true);

    try {
      await api.post("/api/profile/update", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Profile saved successfully!");
    } catch {
      alert("Failed to save profile.");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* 🌟 Global Navbar */}
      <DashboardNavbar name={name} subscriptionPlan={subscriptionPlan} />

      <div className="px-6 md:px-16 py-12 max-w-7xl mx-auto">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold">
            Your Profile<span className="text-amber-500">.</span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Tell AutopilotAI who you are — every email, ad & post adapts automatically.
          </p>
        </div>

        {/* BILLING CARD */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-12 p-6 border border-gray-200 rounded-2xl shadow-sm bg-white flex items-center justify-between"
        >
          <div>
            <h3 className="text-xl font-semibold">Billing & Subscription</h3>
            <p className="text-gray-600 mt-1">
              View your current plan, manage payment, cancel or upgrade anytime.
            </p>
          </div>

          <button
            onClick={() => router.push("/billing")}
            className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition"
          >
            Open Billing
          </button>
        </motion.div>

        {/* FORM */}
        <div className="mt-10 p-8 border border-gray-200 rounded-3xl shadow-sm bg-white space-y-6 mb-20 max-w-5xl">

          <SectionTitle title="Personal Info" />

          <Input label="Full Name" field="full_name" value={form.full_name} onChange={updateField} />
          <Input label="Company Name" field="company_name" value={form.company_name} onChange={updateField} />
          <Input label="Company Website" field="company_website" value={form.company_website} onChange={updateField} />
          <Input label="Your Title (CEO, Founder, Marketing Lead…)" field="title" value={form.title} onChange={updateField} />

          <SectionTitle title="Brand Voice" />

          <Input label="Brand Tone (Friendly, Professional, Aggressive…)" field="brand_tone" value={form.brand_tone} onChange={updateField} />
          <Input label="Industry" field="industry" value={form.industry} onChange={updateField} />

          <Textarea
            label="Brand Description"
            field="brand_description"
            value={form.brand_description}
            placeholder="Explain what your business does, your mission, values, and how you want people to feel…"
            onChange={updateField}
          />

          <Input
            label="Target Audience"
            field="target_audience"
            value={form.target_audience}
            placeholder="Small business owners, gym members, tech professionals, students…"
            onChange={updateField}
          />

          <SectionTitle title="Email Defaults" />

          <Textarea
            label="Email Signature"
            field="signature"
            value={form.signature}
            placeholder={`Best regards,\nYour Name\nCompany`}
            onChange={updateField}
          />

          <Input
            label="Writing Style"
            field="writing_style"
            value={form.writing_style}
            placeholder="Short & punchy, storytelling, corporate, persuasive…"
            onChange={updateField}
          />

          <button
            onClick={saveProfile}
            disabled={saving}
            className="mt-6 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ====================== COMPONENTS ===================== */

function SectionTitle({ title }: any) {
  return <h3 className="text-2xl font-semibold mb-4 mt-6">{title}</h3>;
}

function Input({ label, field, value, onChange, placeholder }: any) {
  return (
    <div>
      <label className="font-medium">{label}</label>
      <input
        value={value || ""}
        placeholder={placeholder || ""}
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full p-3 border bg-gray-50 rounded-xl mt-1 focus:outline-none focus:border-black"
      />
    </div>
  );
}

function Textarea({ label, field, value, onChange, placeholder }: any) {
  return (
    <div>
      <label className="font-medium">{label}</label>
      <textarea
        value={value || ""}
        placeholder={placeholder || ""}
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full p-4 border bg-gray-50 rounded-xl mt-1 resize-none h-28 focus:outline-none focus:border-black"
      />
    </div>
  );
}
