"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

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

  useEffect(() => {
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

  const updateField = (field: string, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const saveProfile = async () => {
    setSaving(true);

    try {
      await api.post("/api/profile/update", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Profile saved successfully.");
    } catch {
      alert("Failed to save profile.");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile…
      </div>
    );
  }

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
            Profile & Preferences
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            Personalize AutopilotAI to match your brand voice and communication style.
          </p>
        </motion.section>

        {/* Billing Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20 bg-white rounded-2xl shadow-sm border border-gray-200 p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8"
        >
          <div>
            <h3 className="text-2xl font-semibold text-gray-900">Billing & Subscription</h3>
            <p className="mt-2 text-gray-600">
              Manage your plan, payment method, and billing history.
            </p>
          </div>
          <button
            onClick={() => router.push("/billing")}
            className="px-10 py-4 bg-blue-900 text-white rounded-xl font-medium hover:bg-blue-800 transition shadow-sm"
          >
            Open Billing
          </button>
        </motion.div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 mb-24"
        >
          <SectionTitle title="Personal Information" />
          <div className="grid gap-8 md:grid-cols-2">
            <Input label="Full Name" field="full_name" value={form.full_name} onChange={updateField} />
            <Input label="Your Title" field="title" value={form.title} placeholder="e.g. Founder, Marketing Director" onChange={updateField} />
            <Input label="Company Name" field="company_name" value={form.company_name} onChange={updateField} />
            <Input label="Company Website" field="company_website" value={form.company_website} placeholder="https://" onChange={updateField} />
          </div>

          <SectionTitle title="Brand Voice & Positioning" />
          <div className="grid gap-8 md:grid-cols-2">
            <Input label="Industry" field="industry" value={form.industry} placeholder="e.g. Fitness, SaaS, E-commerce" onChange={updateField} />
            <Input label="Brand Tone" field="brand_tone" value={form.brand_tone} placeholder="e.g. Professional, Confident, Approachable" onChange={updateField} />
          </div>

          <Textarea
            label="Brand Description"
            field="brand_description"
            value={form.brand_description}
            placeholder="Describe your business, mission, values, and how you want to be perceived."
            onChange={updateField}
          />

          <Input
            label="Target Audience"
            field="target_audience"
            value={form.target_audience}
            placeholder="e.g. Entrepreneurs aged 25–45, gym owners, tech professionals"
            onChange={updateField}
          />

          <SectionTitle title="Email Preferences" />
          <Textarea
            label="Default Email Signature"
            field="signature"
            value={form.signature}
            placeholder="Best regards,\nYour Name\nYour Title\nCompany Name"
            onChange={updateField}
          />

          <Input
            label="Preferred Writing Style"
            field="writing_style"
            value={form.writing_style}
            placeholder="e.g. Concise and direct, warm and conversational, formal and polished"
            onChange={updateField}
          />

          <div className="mt-12 pt-8 border-t border-gray-200">
            <button
              onClick={saveProfile}
              disabled={saving}
              className="px-10 py-4 bg-blue-900 text-white rounded-xl font-medium hover:bg-blue-800 transition shadow-sm disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Profile"}
            </button>
          </div>
        </motion.div>

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

/* COMPONENTS */
function SectionTitle({ title }: { title: string }) {
  return (
    <h3 className="text-2xl font-semibold text-gray-900 mb-8 border-b border-gray-200 pb-4">
      {title}
    </h3>
  );
}

function Input({ label, field, value, onChange, placeholder }: { label: string; field: string; value: string; onChange: (field: string, value: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
      <input
        value={value || ""}
        placeholder={placeholder || ""}
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
      />
    </div>
  );
}

function Textarea({ label, field, value, onChange, placeholder }: { label: string; field: string; value: string; onChange: (field: string, value: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
      <textarea
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(field, e.target.value)}
        rows={6}
        className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900 resize-none transition"
      />
    </div>
  );
}