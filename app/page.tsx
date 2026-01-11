"use client";

import MarketingNavbar from "@/components/MarketingNavbar";
import { ArrowRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

/* =========================
   MOTION
========================= */

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

/* =========================
   SMALL UI
========================= */

function PrimaryCTA({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-3 px-6 py-3 rounded-md bg-white text-black text-sm font-medium hover:bg-gray-100 transition"
    >
      {children}
      <ArrowRight className="w-4 h-4" />
    </a>
  );
}

function SecondaryCTA({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-white/10 bg-white/5 text-white text-sm hover:bg-white/10 transition"
    >
      {children}
    </a>
  );
}

/* =========================
   PAGE
========================= */

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      {/* background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#05070d]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_30%,white,transparent_30%)]" />
      </div>

      <div className="relative z-10">
        <MarketingNavbar />

        {/* HERO */}
        <section className="pt-28 pb-20 px-6">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-medium tracking-tight">
              Website builder
              <br />
              with built-in AI.
            </h1>

            <p className="mt-5 text-gray-400 max-w-xl text-base">
              Create a live website and manage content, email, and ads in one place.
            </p>

            <div className="mt-8 flex gap-4">
              <PrimaryCTA href="/register">Create website</PrimaryCTA>
              <SecondaryCTA href="/features">View features</SecondaryCTA>
            </div>
          </motion.div>
        </section>

        {/* PRODUCT PREVIEW */}
        <section className="px-6 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="mb-3 text-xs text-gray-400 uppercase tracking-wide">
              Live example
            </div>

            <div className="rounded-lg border border-white/10 bg-black overflow-hidden">
              {/* browser bar */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-black">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-4 text-xs text-gray-500">
                  autopilotai.dev/r/testrestaurant
                </span>
              </div>

              {/* iframe */}
              <div className="relative h-[420px] md:h-[560px]">
                <iframe
                  src="/r/testrestaurant"
                  className="absolute inset-0 w-full h-full scale-[0.88] origin-top-left pointer-events-none"
                />
              </div>
            </div>

            <div className="mt-4">
              <SecondaryCTA href="https://www.autopilotai.dev/r/testrestaurant">
                Open live site
                <ExternalLink className="w-4 h-4 opacity-60" />
              </SecondaryCTA>
            </div>
          </div>
        </section>

        {/* CAPABILITIES */}
        <section className="px-6 pb-24">
          <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-3 text-sm text-gray-400">
            <div>
              <div className="text-white mb-1">Live URL</div>
              /r/your-name
            </div>
            <div>
              <div className="text-white mb-1">Editing</div>
              In-place
            </div>
            <div>
              <div className="text-white mb-1">Saving</div>
              Automatic
            </div>
          </div>
        </section>

        {/* AI TOOLS (QUIET) */}
        <section className="px-6 pb-28">
          <div className="max-w-5xl mx-auto">
            <div className="text-xs uppercase tracking-wide text-gray-400 mb-4">
              AI tools
            </div>

            <div className="grid gap-4 md:grid-cols-3 text-sm text-gray-400">
              <div className="rounded-md border border-white/10 bg-white/5 px-5 py-4">
                Content
              </div>
              <div className="rounded-md border border-white/10 bg-white/5 px-5 py-4">
                Email
              </div>
              <div className="rounded-md border border-white/10 bg-white/5 px-5 py-4">
                Ads
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-6 pb-32">
          <div className="max-w-6xl mx-auto rounded-lg border border-white/10 bg-white/5 p-10">
            <h2 className="text-2xl md:text-4xl font-medium">
              Create a website.
            </h2>

            <p className="mt-3 text-gray-400 text-sm">
              Everything else is built in.
            </p>

            <div className="mt-6">
              <PrimaryCTA href="/register">Get started</PrimaryCTA>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/10 py-10 text-center text-xs text-gray-500">
          © 2025 AutopilotAI
        </footer>
      </div>
    </div>
  );
}
