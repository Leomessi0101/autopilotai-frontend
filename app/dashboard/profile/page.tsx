"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  const [name, setName] = useState("U");
  const [menuOpen, setMenuOpen] = useState(false);
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
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [router, token]);

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

      alert("Profile saved successfully!");
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
      <div className="max-w-6xl mx-auto px-4 md:px-10 py-8 md:py-12 flex flex-col min-h-screen">

        {/* TOP NAV */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-10">
            <h1
              onClick={() => router.push("/")}
              className="text-2xl font-semibold tracking-tight cursor-pointer"
            >
              AutopilotAI<span className="text-amber-500">.</span>
            </h1>

            <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
              <button onClick={() => router.push("/dashboard")} className="hover:text-black transition">Dashboard</button>
              <button onClick={() => router.push("/dashboard/content")} className="hover:text-black transition">Generate Content</button>
              <button onClick={() => router.push("/dashboard/email")} className="hover:text-black transition">Write Emails</button>
              <button onClick={() => router.push("/dashboard/ads")} className="hover:text-black transition">Create Ads</button>
              <button onClick={() => router.push("/dashboard/work")} className="hover:text-black transition">My Work</button>
              <button onClick={() => router.push("/billing")} className="hover:text-black transition">Billing</button>
              <button onClick={() => router.push("/pricing")} className="hover:text-black transition">Pricing</button>
            </nav>
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
            name={name}
            subscriptionPlan={subscriptionPlan}
            router={router}
          />
        </div>

        {/* HEADER */}
        <div className="mt-10">
          <h2 className="text-4xl font-bold tracking-tight">Your Profile</h2>
          <p className="text-gray-600 mt-2 max-w-2xl text-lg">
            Tell AutopilotAI who you are — every email, ad & post adapts automatically.
          </p>
        </div>

        {/* BILLING CARD */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-12 p-6 border border-gray-200 rounded-2xl shadow-sm bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4"
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

        {/* PROFILE FORM */}
        <div className="mt-10 p-8 border border-gray-200 rounded-3xl shadow-sm bg-white space-y-6 mb-20 max-w-4xl">
          <SectionTitle title="Personal Info" />

          <Input label="Full Name" field="full_name" value={form.full_name} onChange={updateField} />
          <Input label="Company Name" field="company_name" value={form.company_name} onChange={updateField} />
          <Input label="Company Website" field="company_website" value={form.company_website} onChange={updateField} />
          <Input label="Your Title (CEO, Founder…)" field="title" value={form.title} onChange={updateField} />

          <SectionTitle title="Brand Voice" />

          <Input label="Brand Tone" field="brand_tone" value={form.brand_tone} onChange={updateField} />
          <Input label="Industry" field="industry" value={form.industry} onChange={updateField} />

          <Textarea
            label="Brand Description"
            placeholder="Explain your business, mission, tone…"
            field="brand_description"
            value={form.brand_description}
            onChange={updateField}
          />

          <Input
            label="Target Audience"
            placeholder="Who are you speaking to?"
            field="target_audience"
            value={form.target_audience}
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
            placeholder="Short & punchy, storytelling, corporate…"
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
      </div>
    </div>
  );
}

/* UI COMPONENTS */
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

/* AVATAR MENU */
function AvatarMenu({ open, onClose, name, subscriptionPlan, router }: any) {
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
            <div className="relative px-6 pt-6 pb-4 border-b bg-amber-50">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-sm text-gray-500 hover:text-black"
              >
                ✕
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                  {name}
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Plan</p>
                  <p className="font-bold capitalize">
                    {subscriptionPlan ?? "Free"}
                  </p>
                </div>
              </div>
            </div>

            <div className="py-2">
              <MenuItem label="Dashboard" onClick={() => router.push("/dashboard")} />
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
