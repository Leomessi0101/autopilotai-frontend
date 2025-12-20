"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";

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
    <div className="min-h-screen bg-white text-black flex">

      {/* LEFT SIDEBAR */}
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
          <SidebarItem label="Write Emails" onClick={() => router.push("/dashboard/email")} />
          <SidebarItem label="Create Ads" onClick={() => router.push("/dashboard/ads")} />
          <SidebarItem label="My Work" active />
          <SidebarItem label="Billing" onClick={() => router.push("/billing")} />
          <SidebarItem label="Pricing" onClick={() => router.push("/pricing")} />
        </nav>

        <div className="mt-auto pt-6 text-xs text-gray-500">
          Everything you create — stored safely.
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 px-6 md:px-16 py-10 overflow-y-auto">

        {/* TOP BAR */}
        <div className="flex justify-between items-center relative">
          <div>
            <h2 className="text-4xl font-bold tracking-tight">
              My Work
            </h2>
            <p className="text-gray-600 mt-2">
              Every piece of content AI generated for you — automatically saved.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setMenuOpen(true)}
            className="relative w-11 h-11 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 shadow-sm"
          >
            {name}
            <span className="absolute inset-0 rounded-full ring-2 ring-amber-400 opacity-40" />
          </motion.button>

          {/* PROFILE PANEL */}
          <AnimatePresence>
            {menuOpen && (
              <>
                <motion.div
                  className="fixed inset-0 bg-black/20"
                  onClick={() => setMenuOpen(false)}
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
                      onClick={() => setMenuOpen(false)}
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

            <div className="flex gap-3">
              {["all", "content", "email", "ad"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t as any)}
                  className={`px-4 py-2 rounded-full border transition ${
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

        {selected && (
          <WorkModal item={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </div>
  );
}

/* =========================
   SIDEBAR
   ========================= */
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

          <p className="text-gray-800 line-clamp-2">{item.result}</p>
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
          : "Everything you generate with AI will appear here."}
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
  function copy() {
    navigator.clipboard.writeText(item.result);
  }

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

          <p className="text-gray-800 whitespace-pre-line leading-relaxed">
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

/* =========================
   MENU
   ========================= */
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
