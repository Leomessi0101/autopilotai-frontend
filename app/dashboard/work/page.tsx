"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";

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

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "content" | "email" | "ad">("all");

  const [selected, setSelected] = useState<WorkItem | null>(null);

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
        if (res.data?.name) setName(res.data.name.charAt(0).toUpperCase());
        if (res.data?.subscription) setSubscriptionPlan(res.data.subscription);
      })
      .catch(() => {
        localStorage.removeItem("autopilot_token");
        router.push("/login");
      });

    api
      .get("/api/work")
      .then((res) => setItems(res.data.reverse())) // newest first
      .finally(() => setLoading(false));
  }, [router]);

  const filtered = items.filter((item) => {
    const matchType = filter === "all" || item.content_type === filter;
    const matchSearch =
      item.result.toLowerCase().includes(search.toLowerCase()) ||
      item.prompt.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

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
            My Work
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            All generated content, emails, and ad copy — automatically saved and organized.
          </p>
        </motion.section>

        {/* Search & Filter */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12"
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your work..."
              className="px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900 transition w-full md:max-w-md"
            />

            <div className="flex gap-3 flex-wrap">
              {["all", "content", "email", "ad"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t as any)}
                  className={`px-6 py-3 rounded-xl font-medium transition text-sm ${
                    filter === t
                      ? "bg-blue-900 text-white"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-blue-900"
                  }`}
                >
                  {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Content */}
        {loading ? (
          <p className="text-center text-gray-500 mt-32">Loading your work…</p>
        ) : filtered.length === 0 ? (
          <EmptyState hasItems={items.length > 0} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6 pb-32"
          >
            {filtered.map((item) => (
              <WorkRow key={item.id} item={item} onOpen={() => setSelected(item)} />
            ))}
          </motion.div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {selected && <WorkModal item={selected} onClose={() => setSelected(null)} />}
        </AnimatePresence>
      </main>

      {/* Contact Footer */}
      <footer className="text-center py-12 border-t border-gray-200">
        <p className="text-gray-600">
          Questions? Reach out at{" "}
          <a href="mailto:contact@autopilotai.dev" className="font-medium text-blue-900 hover:underline">
            contact@autopilotai.dev
          </a>
        </p>
      </footer>
    </div>
  );
}

/* Work Row — Compact & Clean Preview */
function WorkRow({ item, onOpen }: { item: WorkItem; onOpen: () => void }) {
  // Very short preview: first 120 characters + first line
  const firstLine = item.result.split("\n")[0].trim();
  const shortPreview = firstLine.length > 120 ? firstLine.slice(0, 120) + "…" : firstLine;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:border-blue-900 hover:shadow-md transition cursor-pointer group"
      onClick={onOpen}
    >
      <div className="flex items-center justify-between gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-sm font-medium text-teal-600 uppercase tracking-wide">
              {labelForType(item.content_type)}
            </span>
            {item.created_at && (
              <span className="text-xs text-gray-500">
                {new Date(item.created_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
          <p className="text-gray-800 text-base line-clamp-1">
            {shortPreview || "(empty)"}
          </p>
        </div>

        <span className="text-sm text-gray-500 group-hover:text-blue-900 transition">
          View →
        </span>
      </div>
    </motion.div>
  );
}

/* Empty State */
function EmptyState({ hasItems }: { hasItems: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mt-32 max-w-2xl mx-auto"
    >
      <h3 className="text-3xl font-light text-gray-800 mb-6">
        {hasItems ? "No matching results" : "Your work will appear here"}
      </h3>
      <p className="text-lg text-gray-600 mb-10">
        {hasItems
          ? "Try adjusting your search or filter."
          : "All content, emails, and ads you generate are automatically saved."}
      </p>
      {!hasItems && (
        <a
          href="/dashboard"
          className="inline-block px-10 py-4 bg-blue-900 text-white rounded-xl font-medium hover:bg-blue-800 transition shadow-sm"
        >
          Start Generating
        </a>
      )}
    </motion.div>
  );
}

/* Modal */
function WorkModal({ item, onClose }: { item: WorkItem; onClose: () => void }) {
  const copy = () => navigator.clipboard.writeText(item.result);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl max-w-4xl w-full p-12 shadow-xl border border-gray-200"
        >
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                {labelForType(item.content_type)}
              </p>
              <h3 className="text-2xl font-semibold text-gray-900">Generated Output</h3>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-900 text-2xl">
              ×
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-10 mb-10">
            <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed text-base font-medium">
              {item.result}
            </pre>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={copy}
              className="px-8 py-4 border border-gray-300 rounded-xl font-medium hover:border-blue-900 transition"
            >
              Copy to Clipboard
            </button>
            <button
              onClick={onClose}
              className="px-8 py-4 bg-blue-900 text-white rounded-xl font-medium hover:bg-blue-800 transition shadow-sm"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* Helper */
function labelForType(type: WorkItem["content_type"]) {
  if (type === "content") return "Content";
  if (type === "email") return "Email";
  if (type === "ad") return "Ad";
  return "AI Output";
}