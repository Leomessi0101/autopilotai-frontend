"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  const [filter, setFilter] = useState<"all" | "content" | "email" | "ad">(
    "all"
  );

  const [selected, setSelected] = useState<WorkItem | null>(null);

  const [name, setName] = useState("U");
  const [subscriptionPlan, setSubscriptionPlan] =
    useState<string | null>(null);

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

    api
      .get("/api/work")
      .then((res) => setItems(res.data.reverse()))
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
    <div className="min-h-screen bg-white text-black">

      {/* 🌟 Global Navbar */}
      <DashboardNavbar name={name} subscriptionPlan={subscriptionPlan} />

      <div className="px-6 md:px-16 py-12 max-w-7xl mx-auto">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold">
            My Work<span className="text-amber-500">.</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Everything AI created for you — automatically saved.
          </p>
        </div>

        {/* TOOLS */}
        {items.length > 0 && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-12 mb-10">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your work..."
              className="px-4 py-3 rounded-xl border border-gray-300 w-full md:w-96 focus:outline-none focus:border-black"
            />

            <div className="flex gap-3 flex-wrap">
              {["all", "content", "email", "ad"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t as any)}
                  className={`px-4 py-2 rounded-full border transition text-sm ${
                    filter === t
                      ? "border-black bg-black text-white"
                      : "border-gray-300 hover:border-black"
                  }`}
                >
                  {t === "all"
                    ? "All"
                    : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CONTENT */}
        {loading ? (
          <p className="text-gray-500 mt-20">Loading your work…</p>
        ) : filtered.length === 0 ? (
          <EmptyState hasItems={items.length > 0} />
        ) : (
          <div className="space-y-6 max-w-4xl pb-32">
            {filtered.map((item) => (
              <WorkRow
                key={item.id}
                item={item}
                onOpen={() => setSelected(item)}
              />
            ))}
          </div>
        )}

        {/* MODAL */}
        {selected && (
          <WorkModal item={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </div>
  );
}

/* =========================
   ROW
========================= */

function WorkRow({ item, onOpen }: { item: WorkItem; onOpen: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-amber-400 hover:shadow-sm transition"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <span className="inline-block mb-2 text-xs uppercase tracking-wide text-amber-600 font-medium">
            {labelForType(item.content_type)}
          </span>

          <p className="text-gray-800 line-clamp-2 whitespace-pre-line">
            {item.result}
          </p>
        </div>

        <button
          className="text-sm text-gray-400 hover:text-amber-600 transition"
          onClick={onOpen}
        >
          View →
        </button>
      </div>
    </motion.div>
  );
}

/* =========================
   EMPTY
========================= */

function EmptyState({ hasItems }: { hasItems: boolean }) {
  return (
    <div className="max-w-xl mt-28 text-center mx-auto">
      <h3 className="text-2xl font-semibold mb-4">
        {hasItems ? "No matches found" : "Nothing here yet"}
      </h3>

      <p className="text-gray-600 mb-8">
        {hasItems
          ? "Try another filter or search phrase."
          : "Everything you generate will appear here."}
      </p>

      {!hasItems && (
        <a
          href="/dashboard"
          className="inline-block px-6 py-3 rounded-full bg-black text-white hover:bg-gray-900 transition"
        >
          Generate your first work
        </a>
      )}
    </div>
  );
}

/* =========================
   MODAL
========================= */

function WorkModal({
  item,
  onClose,
}: {
  item: WorkItem;
  onClose: () => void;
}) {
  const copy = () => navigator.clipboard.writeText(item.result);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          className="bg-white rounded-3xl max-w-3xl w-full p-10 shadow-xl border border-gray-200"
        >
          <div className="flex justify-between mb-6">
            <h3 className="text-xl font-bold">
              {labelForType(item.content_type)}
            </h3>

            <button onClick={onClose} className="text-gray-500 hover:text-black">
              ✕
            </button>
          </div>

          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
            {item.result}
          </p>

          <div className="flex justify-end gap-4 mt-10">
            <button
              onClick={copy}
              className="px-5 py-2 rounded-full border border-gray-300 hover:border-black transition"
            >
              Copy
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full bg-black text-white hover:bg-gray-900 transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* =========================
   HELPERS
========================= */

function labelForType(type: WorkItem["content_type"]) {
  if (type === "content") return "Content";
  if (type === "email") return "Email";
  if (type === "ad") return "Ad";
  return "AI Output";
}
