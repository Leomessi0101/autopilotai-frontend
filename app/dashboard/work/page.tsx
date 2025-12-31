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

type ImageItem = {
  id: number;
  image_url: string;
  text_content?: string;
  image_style?: string;
  created_at?: string;
};

export default function MyWorkPage() {
  const router = useRouter();

  const [items, setItems] = useState<WorkItem[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "content" | "email" | "ad">("all");

  const [selected, setSelected] = useState<WorkItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  const [name, setName] = useState("U");
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      router.push("/login");
      return;
    }

    api.get("/api/auth/me")
      .then((res) => {
        if (res.data?.name) setName(res.data.name.charAt(0).toUpperCase());
        if (res.data?.subscription) setSubscriptionPlan(res.data.subscription);
      })
      .catch(() => {
        localStorage.removeItem("autopilot_token");
        router.push("/login");
      });

    api.get("/api/work")
      .then((res) => setItems(res.data.reverse()))
      .finally(() => setLoading(false));

    api.get("/api/images/history")
      .then((res) => setImages(res.data))
      .finally(() => setImageLoading(false));

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
            All generated content, emails, ads, and AI images — saved in one place.
          </p>
        </motion.section>

        {/* Images Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-semibold text-gray-900">
              Saved Images
            </h3>
          </div>

          {imageLoading ? (
            <p className="text-gray-500">Loading images…</p>
          ) : images.length === 0 ? (
            <p className="text-gray-500">No saved images yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {images.map((img) => (
                <motion.div
                  key={img.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white border rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:border-blue-900"
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img.image_url}
                    className="w-full h-48 object-cover"
                    alt="AI Generated"
                  />
                  <div className="p-4">
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {img.text_content || "No caption"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Search + Filters */}
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
              className="px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-900 transition w-full md:max-w-md"
            />

            <div className="flex gap-3 flex-wrap">
              {["all", "content", "email", "ad"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t as any)}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition ${
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

        {/* Content Items */}
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

        <AnimatePresence>
          {selected && (
            <WorkModal item={selected} onClose={() => setSelected(null)} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedImage && (
            <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
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

/* ---------------- IMAGE MODAL ---------------- */
function ImageModal({ image, onClose }: { image: ImageItem; onClose: () => void }) {
  const download = () => {
    const a = document.createElement("a");
    a.href = image.image_url;
    a.download = "autopilotai-image.png";
    a.click();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-2xl shadow-xl border max-w-4xl w-full overflow-hidden"
      >
        <img src={image.image_url} className="w-full max-h-[70vh] object-contain" />

        <div className="p-6">
          <p className="text-gray-700 mb-2">
            {image.text_content || "No text content saved"}
          </p>

          {image.image_style && (
            <p className="text-sm text-gray-500 mb-4">
              Style: {image.image_style}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={download}
              className="px-8 py-3 border rounded-xl hover:border-blue-900 transition"
            >
              Download
            </button>

            <button
              onClick={onClose}
              className="px-8 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- ORIGINAL COMPONENTS BELOW ---------------- */

function WorkRow({ item, onOpen }: { item: WorkItem; onOpen: () => void }) {
  const lines = item.result.split("\n").slice(0, 4);
  const previewText = lines.join("\n");
  const preview =
    previewText.length > 350 ? previewText.slice(0, 350) + "…" : previewText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-sm border p-8 hover:border-blue-900 transition cursor-pointer group"
      onClick={onOpen}
    >
      <div className="flex items-start justify-between gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-sm font-medium text-teal-600 uppercase tracking-wide">
              {labelForType(item.content_type)}
            </span>
            {item.created_at && (
              <span className="text-sm text-gray-500">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
            )}
          </div>

          <p className="text-gray-800 whitespace-pre-wrap line-clamp-4">
            {preview || "(empty)"}
          </p>
        </div>

        <span className="text-sm text-gray-500 group-hover:text-blue-900">
          View →
        </span>
      </div>
    </motion.div>
  );
}

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
          : "Everything you generate is automatically saved here."}
      </p>

      {!hasItems && (
        <a
          href="/dashboard"
          className="px-10 py-4 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition"
        >
          Start Generating
        </a>
      )}
    </motion.div>
  );
}

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
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="bg-white rounded-2xl border shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-10"
        >
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-sm text-gray-500 uppercase mb-2">
                {labelForType(item.content_type)}
              </p>
              <h3 className="text-2xl font-semibold">Full Output</h3>
            </div>

            <button className="text-2xl" onClick={onClose}>
              ×
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 mb-8">
            <pre className="whitespace-pre-wrap text-gray-800">
              {item.result}
            </pre>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={copy}
              className="px-8 py-4 border rounded-xl hover:border-blue-900"
            >
              Copy
            </button>

            <button
              onClick={onClose}
              className="px-8 py-4 bg-blue-900 text-white rounded-xl hover:bg-blue-800"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function labelForType(type: WorkItem["content_type"]) {
  if (type === "content") return "Content";
  if (type === "email") return "Email";
  if (type === "ad") return "Ad";
  return "AI Output";
}
