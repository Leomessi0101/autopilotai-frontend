"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("autopilot_token")
      : null;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  // Get saved profile on load
  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/api/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setForm(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveProfile = async () => {
    setSaving(true);

    try {
      await api.post(
        "/api/profile/update",
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Profile saved!");
    } catch (err) {
      alert("Failed to save profile.");
      console.error(err);
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
      {/* NAVBAR */}
      <nav className="w-full py-6 px-10 flex justify-between items-center border-b border-gray-200">
        <h1
          onClick={() => router.push("/dashboard")}
          className="text-2xl font-bold tracking-tight cursor-pointer"
        >
          AutopilotAI
        </h1>

        <div className="space-x-6 text-gray-800 flex items-center">
          <a href="/features" className="hover:text-black">
            Features
          </a>
          <a href="/pricing" className="hover:text-black">
            Pricing
          </a>
          <a href="/dashboard" className="hover:text-black font-semibold">
            Dashboard
          </a>

          <button
            onClick={() => {
              localStorage.removeItem("autopilot_token");
              router.push("/login");
            }}
            className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-900 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* PAGE HEADER */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-10 mt-16 max-w-4xl"
      >
        <h2 className="text-4xl font-bold tracking-tight">Your Profile</h2>
        <p className="text-gray-600 mt-3 text-lg">
          Personalize AutopilotAI so all your emails and content match your
          brand.
        </p>

        {/* FORM CARD */}
        <div className="mt-10 p-8 border border-gray-200 rounded-3xl shadow-sm bg-white space-y-6">
          <SectionTitle title="Personal Info" />

          <Input label="Full Name" field="full_name" value={form.full_name} onChange={updateField} />
          <Input label="Company Name" field="company_name" value={form.company_name} onChange={updateField} />
          <Input label="Company Website" field="company_website" value={form.company_website} onChange={updateField} />
          <Input label="Your Title" field="title" value={form.title} onChange={updateField} />

          <SectionTitle title="Brand Voice" />

          <Input label="Brand Tone" field="brand_tone" value={form.brand_tone} onChange={updateField} />
          <Input label="Industry" field="industry" value={form.industry} onChange={updateField} />

          <Textarea
            label="Brand Description"
            field="brand_description"
            value={form.brand_description}
            onChange={updateField}
          />

          <Input
            label="Target Audience"
            field="target_audience"
            value={form.target_audience}
            onChange={updateField}
          />

          <SectionTitle title="Email Defaults" />

          <Textarea
            label="Signature"
            field="signature"
            value={form.signature}
            onChange={updateField}
          />

          <Input
            label="Writing Style"
            field="writing_style"
            value={form.writing_style}
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
      </motion.section>
    </div>
  );
}

/* COMPONENTS */

function SectionTitle({ title }: any) {
  return <h3 className="text-2xl font-semibold mb-4 mt-8">{title}</h3>;
}

function Input({ label, field, value, onChange }: any) {
  return (
    <div>
      <label className="font-medium">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full p-3 border bg-gray-50 rounded-xl mt-1"
      />
    </div>
  );
}

function Textarea({ label, field, value, onChange }: any) {
  return (
    <div>
      <label className="font-medium">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full p-4 border bg-gray-50 rounded-xl mt-1 resize-none h-28"
      />
    </div>
  );
}
