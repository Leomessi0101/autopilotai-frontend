"use client";

import { motion } from "framer-motion";
import MarketingNavbar from "@/components/MarketingNavbar";
import { ArrowRight, ExternalLink } from "lucide-react";

/* =========================
   MOTION
========================= */

const fadeUp = {
  initial: { opacity: 0, y: 16 },
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
      className="inline-flex items-center gap-3 px-7 py-4 rounded-xl bg-white text-black font-medium hover:bg-gray-100 transition"
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
      className="inline-flex items-center gap-2 px-7 py-4 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition"
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
    <div className="min-h-screen bg-[#05070d] text-white overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#05070d]" />
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_30%,white,transparent_30%)]" />
      </div>

      <div className="relative z-10">
        <MarketingNavbar />

        {/* HERO */}
        <section className="pt-32 pb-24 px-6">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight">
              AutopilotAI
            </h1>

            <p className="mt-6 text-gray-400 text-lg max-w-xl">
              Websites and marketing.
              <br />
              Built in one place.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <PrimaryCTA href="/register">
                Create website
              </PrimaryCTA>
              <SecondaryCTA href="/features">
                View features
              </SecondaryCTA>
            </div>
          </motion.div>
        </section>

        {/* WEBSITE BUILDER PREVIEW */}
        <section className="px-6 pb-28">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 text-sm text-gray-400">
              website builder
            </div>

            <div className="rounded-2xl border border-white/10 bg-black overflow-hidden">
              {/* browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black">
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

            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <SecondaryCTA href="https://www.autopilotai.dev/r/testrestaurant">
                Open live example
                <ExternalLink className="w-4 h-4 opacity-70" />
              </SecondaryCTA>
            </div>
          </div>
        </section>

        {/* SHORT FACTS */}
        <section className="px-6 pb-28">
          <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-3 text-sm text-gray-400">
            <div>
              <div className="text-white mb-2">Live URL</div>
              /r/your-name
            </div>
            <div>
              <div className="text-white mb-2">Editing</div>
              in place
            </div>
            <div>
              <div className="text-white mb-2">Saving</div>
              automatic
            </div>
          </div>
        </section>

        {/* AI TOOLS (QUIET) */}
        <section className="px-6 pb-32">
          <div className="max-w-5xl mx-auto">
            <div className="text-sm text-gray-400 mb-6">
              ai tools
            </div>

            <div className="grid gap-6 md:grid-cols-3 text-gray-400 text-sm">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                content
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                email
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                ads
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-6 pb-36">
          <div className="max-w-6xl mx-auto rounded-2xl border border-white/10 bg-white/5 p-12">
            <h2 className="text-3xl md:text-5xl font-medium">
              Create your site.
            </h2>

            <p className="mt-4 text-gray-400">
              Everything else lives inside.
            </p>

            <div className="mt-8">
              <PrimaryCTA href="/register">
                Get started
              </PrimaryCTA>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/10 py-12 text-center text-sm text-gray-500">
          © 2025 AutopilotAI
        </footer>
      </div>
    </div>
  );
}
