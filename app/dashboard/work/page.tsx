"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";

type WorkItem = {
  id: number;
  content_type:
    | "content"
    | "email"
    | "ad"
    | "growth_pack"
    | "growth_pack_social"
    | "growth_pack_email"
    | "growth_pack_ads"
    | string; // includes growth_pack_regen_* and growth_pack_refine_* etc
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
  const [filter, setFilter] = useState<"all" | "content" | "email" | "ad">(
    "all"
  );

  const [selected, setSelected] = useState<WorkItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

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
      .then((res) => setItems((res.data || []).reverse()))
      .finally(() => setLoading(false));

    api
      .get("/api/images/history")
      .then((res) => setImages(res.data || []))
      .finally(() => setImageLoading(false));
  }, [router]);

  /* ============================
     Growth Pack grouping (TOP)
  ============================ */

  const growthPackGroups = useMemo(() => {
    // base pack items only
    const packs = items.filter((i) => i.content_type === "growth_pack");

    // group by prompt (good enough for now)
    return packs.map((pack) => {
      const group = items.filter(
        (i) => i.prompt === pack.prompt && String(i.content_type).startsWith("growth_pack")
      );

      const social =
        group.find((x) => x.content_type === "growth_pack_social") || null;
      const email =
        group.find((x) => x.content_type === "growth_pack_email") || null;
      const ads =
        group.find((x) => x.content_type === "growth_pack_ads") || null;

      const regens = group.filter((x) =>
        String(x.content_type).startsWith("growth_pack_regen_")
      );

      const refines = group.filter((x) =>
        String(x.content_type).startsWith("growth_pack_refine_")
      );

      return {
        pack,
        social,
        email,
        ads,
        regens,
        refines,
      };
    });
  }, [items]);

  /* ============================
     Normal content list (filter/search)
  ============================ */

  const normalItems = useMemo(() => {
    return items.filter((i) => !String(i.content_type).startsWith("growth_pack"));
  }, [items]);

  const filtered = normalItems.filter((item) => {
    const type = item.content_type as any;
    const matchType = filter === "all" || type === filter;
    const matchSearch =
      item.result.toLowerCase().includes(search.toLowerCase()) ||
      item.prompt.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#05070d] text-white relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 w-[900px] h-[900px] bg-[conic-gradient(at_top_left,var(--tw-gradient-stops))] from-[#0c1a39] via-[#0a1630] to-transparent blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[900px] h-[900px] bg-[conic-gradient(at_bottom_right,var(--tw-gradient-stops))] from-[#0d1b3d] via-[#111a2c] to-transparent blur-[200px]" />
      </div>

      <DashboardNavbar name={name} subscriptionPlan={subscriptionPlan} />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-light">My Work</h1>
          <p className="mt-6 text-xl text-gray-300">
            All generated content, emails, ads, and AI images — saved in one
            place.
          </p>
        </motion.section>

        {/* Growth Packs (Premium) */}
        {growthPackGroups.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-semibold">Growth Packs</h3>
              <span className="text-sm text-[#6d8ce8]">Premium</span>
            </div>

            <div className="space-y-6">
              {growthPackGroups.map((g) => (
                <motion.div
                  key={g.pack.id}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl border border-[#6d8ce8]/35 bg-gradient-to-br from-[#111b2d] to-[#1b2f54] p-8 shadow-[0_50px_120px_rgba(0,0,0,.55)]"
                >
                  <div className="flex items-start justify-between gap-6 mb-6">
                    <div className="flex-1">
                      <p className="text-xs text-white/70 uppercase tracking-wide mb-2">
                        Growth Pack Prompt
                      </p>
                      <p className="text-gray-200 whitespace-pre-wrap line-clamp-3">
                        {g.pack.prompt}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelected(g.pack)}
                      className="px-5 py-2 rounded-xl bg-white/10 border border-white/15 hover:border-white/30 transition text-sm"
                    >
                      Open Full →
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <MiniSectionCard
                      title="Social"
                      item={g.social}
                      onOpen={setSelected}
                    />
                    <MiniSectionCard
                      title="Email"
                      item={g.email}
                      onOpen={setSelected}
                    />
                    <MiniSectionCard
                      title="Ads"
                      item={g.ads}
                      onOpen={setSelected}
                    />
                  </div>

                  {(g.refines.length > 0 || g.regens.length > 0) && (
                    <div className="mt-6">
                      <p className="text-sm text-white/70 mb-3">
                        Iterations
                      </p>

                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {[...g.refines, ...g.regens]
                          .slice(0, 6)
                          .map((it) => (
                            <button
                              key={it.id}
                              onClick={() => setSelected(it)}
                              className="text-left rounded-xl bg-black/25 border border-white/15 p-4 hover:border-[#6d8ce8]/70 transition"
                            >
                              <p className="text-xs text-[#6d8ce8] uppercase tracking-wide mb-2">
                                {labelForType(it.content_type as any)}
                              </p>
                              <p className="text-sm text-gray-200 line-clamp-3 whitespace-pre-wrap">
                                {it.result || "(empty)"}
                              </p>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Images Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-semibold">Saved Images</h3>
          </div>

          {imageLoading ? (
            <p className="text-gray-400">Loading images…</p>
          ) : images.length === 0 ? (
            <p className="text-gray-400">No saved images yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {images.map((img) => (
                <motion.div
                  key={img.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:border-[#2b4e8d] transition"
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img.image_url}
                    className="w-full h-48 object-cover"
                    alt="AI Generated"
                  />
                  <div className="p-4">
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {img.text_content || "No caption"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Search + Filters (normal content only) */}
        {normalItems.length > 0 && (
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
              className="px-5 py-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#2b4e8d] transition w-full md:max-w-md"
            />

            <div className="flex gap-3 flex-wrap">
              {["all", "content", "email", "ad"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t as any)}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition ${
                    filter === t
                      ? "bg-[#2b4e8d] text-white"
                      : "bg-white/5 border border-white/10 text-gray-300 hover:border-[#2b4e8d]"
                  }`}
                >
                  {t === "all"
                    ? "All"
                    : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Normal Content Items */}
        {loading ? (
          <p className="text-center text-gray-400 mt-32">
            Loading your work…
          </p>
        ) : filtered.length === 0 ? (
          <EmptyState hasItems={normalItems.length > 0} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6 pb-32"
          >
            {filtered.map((item) => (
              <WorkRow
                key={item.id}
                item={item}
                onOpen={() => setSelected(item)}
              />
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
            <ImageModal
              image={selectedImage}
              onClose={() => setSelectedImage(null)}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="text-center py-12 border-t border-white/10 text-gray-400">
        Questions? Reach out at{" "}
        <a
          href="mailto:contact@autopilotai.dev"
          className="text-[#6d8ce8] hover:underline"
        >
          contact@autopilotai.dev
        </a>
      </footer>
    </div>
  );
}

/* ================= MINI SECTION CARD ================= */

function MiniSectionCard({
  title,
  item,
  onOpen,
}: {
  title: "Social" | "Email" | "Ads";
  item: WorkItem | null;
  onOpen: (item: WorkItem) => void;
}) {
  const text = (item?.result || "").trim();
  const preview =
    text.length > 260 ? text.slice(0, 260) + "…" : text || "(empty)";

  return (
    <button
      onClick={() => item && onOpen(item)}
      disabled={!item}
      className={`text-left rounded-2xl border p-5 transition ${
        item
          ? "bg-black/25 border-white/15 hover:border-[#6d8ce8]/80"
          : "bg-black/10 border-white/10 opacity-60 cursor-not-allowed"
      }`}
    >
      <p className="text-xs uppercase tracking-wide text-white/70 mb-2">
        {title}
      </p>
      <p className="text-sm text-gray-200 whitespace-pre-wrap line-clamp-4">
        {preview}
      </p>
      {item && (
        <span className="mt-4 inline-block text-sm font-medium text-[#6d8ce8]">
          Open →
        </span>
      )}
    </button>
  );
}

/* ---------------- IMAGE MODAL ---------------- */
function ImageModal({
  image,
  onClose,
}: {
  image: ImageItem;
  onClose: () => void;
}) {
  const download = () => {
    const a = document.createElement("a");
    a.href = image.image_url;
    a.download = "autopilotai-image.png";
    a.click();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6"
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
        className="bg-[#0b0f1a] text-white rounded-2xl shadow-xl border border-white/10 max-w-4xl w-full overflow-hidden"
      >
        <img
          src={image.image_url}
          className="w-full max-h-[70vh] object-contain"
          alt="Saved AI"
        />

        <div className="p-6">
          <p className="text-gray-300 mb-2">
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
              className="px-8 py-3 border border-white/20 rounded-xl hover:border-[#2b4e8d]"
            >
              Download
            </button>

            <button
              onClick={onClose}
              className="px-8 py-3 bg-[#2b4e8d] text-white rounded-xl hover:bg-[#395fa5]"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- WORK ROW ---------------- */
function WorkRow({
  item,
  onOpen,
}: {
  item: WorkItem;
  onOpen: () => void;
}) {
  const lines = item.result.split("\n").slice(0, 4);
  const previewText = lines.join("\n");
  const preview =
    previewText.length > 350
      ? previewText.slice(0, 350) + "…"
      : previewText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 rounded-2xl border border-white/10 p-8 hover:border-[#2b4e8d] transition cursor-pointer group"
      onClick={onOpen}
    >
      <div className="flex items-start justify-between gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-sm font-medium text-[#6d8ce8] uppercase tracking-wide">
              {labelForType(item.content_type)}
            </span>
            {item.created_at && (
              <span className="text-sm text-gray-400">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
            )}
          </div>

          <p className="text-gray-200 whitespace-pre-wrap line-clamp-4">
            {preview || "(empty)"}
          </p>
        </div>

        <span className="text-sm text-gray-400 group-hover:text-[#6d8ce8]">
          View →
        </span>
      </div>
    </motion.div>
  );
}

/* ---------------- EMPTY STATE ---------------- */
function EmptyState({ hasItems }: { hasItems: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mt-32 max-w-2xl mx-auto"
    >
      <h3 className="text-3xl font-light text-gray-200 mb-6">
        {hasItems ? "No matching results" : "Your work will appear here"}
      </h3>

      <p className="text-lg text-gray-400 mb-10">
        {hasItems
          ? "Try adjusting your search or filter."
          : "Everything you generate is automatically saved here."}
      </p>

      {!hasItems && (
        <a
          href="/dashboard"
          className="px-10 py-4 bg-[#2b4e8d] text-white rounded-xl hover:bg-[#395fa5] transition"
        >
          Start Generating
        </a>
      )}
    </motion.div>
  );
}

/* ---------------- MODAL ---------------- */
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
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6"
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
          className="bg-[#0b0f1a] text-white rounded-2xl border border-white/10 shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-10"
        >
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-sm text-gray-400 uppercase mb-2">
                {labelForType(item.content_type)}
              </p>
              <h3 className="text-2xl font-semibold">Full Output</h3>
            </div>

            <button className="text-2xl" onClick={onClose}>
              ×
            </button>
          </div>

          <div className="bg-white/5 rounded-xl p-8 mb-8 border border-white/10">
            <pre className="whitespace-pre-wrap text-gray-200">
              {item.result}
            </pre>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={copy}
              className="px-8 py-4 border border-white/20 rounded-xl hover:border-[#2b4e8d]"
            >
              Copy
            </button>

            <button
              onClick={onClose}
              className="px-8 py-4 bg-[#2b4e8d] text-white rounded-xl hover:bg-[#395fa5]"
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
  const t = String(type);

  if (t === "content") return "Content";
  if (t === "email") return "Email";
  if (t === "ad") return "Ad";

  if (t === "growth_pack") return "Growth Pack";
  if (t === "growth_pack_social") return "Growth Pack • Social";
  if (t === "growth_pack_email") return "Growth Pack • Email";
  if (t === "growth_pack_ads") return "Growth Pack • Ads";

  if (t.startsWith("growth_pack_refine_")) return "Growth Pack • Refine";
  if (t.startsWith("growth_pack_regen_")) return "Growth Pack • Regenerate";

  return "AI Output";
}
