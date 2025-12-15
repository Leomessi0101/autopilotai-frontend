"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";

type WorkItem = {
  id: number;
  content_type: "content" | "email" | "ad";
  prompt: string;
  result: string;
  created_at?: string;
};

export default function MyWorkPage() {
  const router = useRouter();
  const [items, setItems] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      router.push("/login");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/work", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white px-14 py-12 text-black">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-16">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            My Work
          </h1>
          <p className="text-gray-600 mt-2">
            Everything AI has created for you.
          </p>
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="px-5 py-2 rounded-full border border-gray-300
                     hover:border-amber-400 hover:text-amber-600 transition"
        >
          ← Back to dashboard
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-gray-500">Loading your work…</p>
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6 max-w-4xl">
          {items.map((item) => (
            <WorkRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================
   COMPONENTS
   ========================= */

function WorkRow({ item }: { item: WorkItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-gray-200 bg-white p-6
                 hover:border-amber-400 hover:shadow-sm transition"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <span className="inline-block mb-2 text-xs uppercase tracking-wide
                           text-amber-600 font-medium">
            {labelForType(item.content_type)}
          </span>

          <p className="text-gray-800 line-clamp-2">
            {item.result}
          </p>
        </div>

        <button
          className="text-sm text-gray-400 hover:text-amber-600 transition"
          onClick={() => alert("View full coming next")}
        >
          View →
        </button>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="max-w-xl mt-24 text-center mx-auto">
      <h3 className="text-2xl font-semibold mb-4">
        Nothing here yet
      </h3>
      <p className="text-gray-600 mb-8">
        Everything you generate with AI will appear here.
      </p>
      <a
        href="/dashboard"
        className="inline-block px-6 py-3 rounded-full
                   bg-black text-white hover:bg-gray-900 transition"
      >
        Generate your first work
      </a>
    </div>
  );
}

function labelForType(type: WorkItem["content_type"]) {
  if (type === "content") return "Content";
  if (type === "email") return "Email";
  if (type === "ad") return "Ad";
  return "AI Output";
}
