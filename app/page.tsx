"use client";
import MarketingNavbar from "@/components/MarketingNavbar";
import { ArrowRight, ExternalLink, Sparkles, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

/* =========================
   MOTION VARIANTS
========================= */
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

/* =========================
   MAIN PAGE
========================= */
export default function HomePage() {
  const [description, setDescription] = useState("");
  const [businessType, setBusinessType] = useState("restaurant");

  function handleGenerate() {
    // Later: persist this to localStorage / query params
    // For now: intentional redirect to signup
    window.location.href = "/register";
  }

  return (
    <div className="min-h-screen bg-[#03050b] text-white overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070d] via-[#03050b] to-black" />
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(ellipse_at_top_left,_#ffffff_0%,_transparent_50%),radial-gradient(ellipse_at_bottom_right,_#6366f1_0%,_transparent_60%)]" />
      </div>

      <div className="relative z-10">
        <MarketingNavbar />

        {/* =========================
           HERO (AI-FIRST)
        ========================= */}
        <section className="pt-32 pb-24 px-5 sm:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-medium text-indigo-300 uppercase tracking-wide">
                  AI Website Designer
                </span>
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.05]"
            >
              Your website.
              <br />
              <span className="text-indigo-400">Designed by AI.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-xl text-gray-300/90 max-w-2xl mx-auto"
            >
              Describe your business. Our AI chooses the layout, structure, and
              style — optimized for your goal.
            </motion.p>

            {/* =========================
               AI GENERATION BOX (KEY)
            ========================= */}
            <motion.div
              variants={fadeUp}
              className="mt-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8 text-left shadow-2xl"
            >
              <div className="flex items-center gap-2 text-sm text-indigo-300 mb-3">
                <Wand2 className="w-4 h-4" />
                AI website generator
              </div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. A modern burger restaurant in Stockholm focused on delivery and takeaway"
                rows={3}
                className="w-full resize-none rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-400 outline-none focus:border-indigo-500/50"
              />

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white outline-none"
                >
                  <option value="restaurant">Restaurant</option>
                  <option value="local">Local business</option>
                  <option value="online">Online business</option>
                  <option value="personal">Personal brand</option>
                </select>

                <button
                  onClick={handleGenerate}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-white text-black font-medium px-6 py-3 hover:bg-gray-100 transition"
                >
                  Generate my website
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 text-xs text-gray-400">
                No templates. AI decides the design.
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* =========================
           AI PREVIEW
        ========================= */}
        <section className="px-5 sm:px-8 pb-32">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 text-center text-sm text-gray-400">
              Example of what AI generates
            </div>

            <div className="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden shadow-2xl">
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/10 bg-black/60">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center text-sm text-gray-400">
                  autopilotai.dev/r/testrestaurant
                </div>
              </div>

              <div className="relative aspect-[16/9] bg-black">
                <iframe
                  src="/r/testrestaurant"
                  className="absolute inset-0 w-full h-full scale-[0.96] origin-top pointer-events-none"
                  title="AI generated website preview"
                />
              </div>
            </div>

            <div className="mt-6 text-center">
              <a
                href="https://www.autopilotai.dev/r/testrestaurant"
                className="inline-flex items-center gap-2 text-sm text-indigo-300 hover:text-indigo-200"
              >
                Open live example <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/10 py-12 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} AutopilotAI • Websites designed by AI
        </footer>
      </div>
    </div>
  );
}
