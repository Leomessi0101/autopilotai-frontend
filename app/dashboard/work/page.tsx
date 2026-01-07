"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";

/* ---------------- TYPES ---------------- */
type WorkItem = {
  id: number;
  content_type: string;
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

/* ---------------- PAGE ---------------- */
export default function MyWorkPage() {
  const router = useRouter();

  const [items, setItems] = useState<WorkItem[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

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

    api.get("/api/auth/me").then((res) => {
      if (res.data?.name) setName(res.data.name.charAt(0).toUpperCase());
      if (res.data?.subscription)
        setSubscriptionPlan(res.data.subscription);
    });

    api.get("/api/work").then((res) => {
      setItems(res.data.reverse());
      setLoading(false);
    });

    api.get("/api/images/history").then((res) => {
      setImages(res.data);
      setImageLoading(false);
    });
  }, [router]);

  /* ---------------- GROUP GROWTH PACKS ---------------- */
  const growthPacks = useMemo(() => {
    const packs: Record<
      string,
      { base?: WorkItem; social?: WorkItem; email?: WorkItem; ads?: WorkItem }
    > = {};

    items.forEach((item) => {
      if (!item.content_type.startsWith("growth_pack")) return;

      const key = item.prompt;
      packs[key] = packs[key] || {};

      if (item.content_type === "growth_pack") packs[key].base = item;
      if (item.content_type.includes("social")) packs[key].social = item;
      if (item.content_type.includes("email")) packs[key].email = item;
      if (item.content_type.includes("ads")) packs[key].ads = item;
    });

    return Object.values(packs).filter((p) => p.base);
  }, [items]);

  const normalItems = items.filter(
    (i) => !i.content_type.startsWith("growth_pack")
  );

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <DashboardNavbar name={name} subscriptionPlan={subscriptionPlan} />

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* HEADER */}
        <h1 className="text-5xl font-light mb-12">My Work</h1>

        {/* ---------------- GROWTH PACKS ---------------- */}
        {growthPacks.length > 0 && (
          <section className="mb-20">
            <h2 className="text-3xl font-medium mb-8">Growth Packs</h2>

            <div className="space-y-6">
              {growthPacks.map((pack, i) => (
                <GrowthPackCard key={i} pack={pack} />
              ))}
            </div>
          </section>
        )}

        {/* ---------------- NORMAL ITEMS ---------------- */}
        <section>
          <h2 className="text-3xl font-medium mb-8">Other Content</h2>

          {loading ? (
            <p className="text-gray-400">Loading…</p>
          ) : normalItems.length === 0 ? (
            <p className="text-gray-400">No content yet.</p>
          ) : (
            <div className="space-y-6">
              {normalItems.map((item) => (
                <WorkRow
                  key={item.id}
                  item={item}
                  onOpen={() => setSelected(item)}
                />
              ))}
            </div>
          )}
        </section>

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
    </div>
  );
}

/* ---------------- GROWTH PACK CARD ---------------- */
function GrowthPackCard({
  pack,
}: {
  pack: {
    base?: WorkItem;
    social?: WorkItem;
    email?: WorkItem;
    ads?: WorkItem;
  };
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-[#6d8ce8]/40 bg-[#111827] p-8">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div>
          <p className="text-sm text-[#6d8ce8] uppercase">Growth Pack</p>
          <p className="text-gray-300 mt-1 line-clamp-2">
            {pack.base?.prompt}
          </p>
        </div>
        <span className="text-[#6d8ce8]">{open ? "−" : "+"}</span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 space-y-6"
          >
            {pack.social && (
              <Section title="Social Posts" text={pack.social.result} />
            )}
            {pack.email && (
              <Section title="Email" text={pack.email.result} />
            )}
            {pack.ads && <Section title="Ads" text={pack.ads.result} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- SECTION ---------------- */
function Section({ title, text }: { title: string; text: string }) {
  const copy = () => navigator.clipboard.writeText(text);

  return (
    <div className="bg-black/30 border border-white/10 rounded-xl p-6">
      <div className="flex justify-between mb-3">
        <h4 className="font-medium">{title}</h4>
        <button onClick={copy} className="text-sm text-[#6d8ce8]">
          Copy
        </button>
      </div>
      <pre className="whitespace-pre-wrap text-gray-200">{text}</pre>
    </div>
  );
}

/* ---------------- WORK ROW (UNCHANGED) ---------------- */
function WorkRow({
  item,
  onOpen,
}: {
  item: WorkItem;
  onOpen: () => void;
}) {
  return (
    <div
      onClick={onOpen}
      className="bg-white/5 rounded-2xl border border-white/10 p-8 hover:border-[#2b4e8d] cursor-pointer"
    >
      <p className="text-sm text-[#6d8ce8] uppercase mb-2">
        {item.content_type}
      </p>
      <p className="text-gray-200 line-clamp-4">{item.result}</p>
    </div>
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
  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6"
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0b0f1a] rounded-2xl p-10 max-w-3xl w-full"
      >
        <h3 className="text-2xl font-semibold mb-6">
          {item.content_type}
        </h3>
        <pre className="whitespace-pre-wrap text-gray-200">
          {item.result}
        </pre>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- IMAGE MODAL (UNCHANGED) ---------------- */
function ImageModal({
  image,
  onClose,
}: {
  image: ImageItem;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6"
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0b0f1a] rounded-2xl p-6 max-w-4xl w-full"
      >
        <img src={image.image_url} className="w-full rounded-xl" />
      </motion.div>
    </motion.div>
  );
}
