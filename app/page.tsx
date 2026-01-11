"use client";

import { motion } from "framer-motion";
import MarketingNavbar from "@/components/MarketingNavbar";
import {
  ArrowRight,
  Globe,
  Sparkles,
  Edit3,
  Zap,
  Layers,
} from "lucide-react";

/* =========================
   MOTION
========================= */

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

/* =========================
   UI
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
      className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-semibold hover:scale-[1.03] transition"
    >
      {children}
      <ArrowRight className="w-4 h-4" />
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
        <div className="absolute -top-40 -left-40 w-[900px] h-[900px] bg-[#1b2f54]/30 blur-[200px]" />
        <div className="absolute bottom-0 right-0 w-[900px] h-[900px] bg-[#0c1a39]/40 blur-[220px]" />
      </div>

      <div className="relative z-10">
        <MarketingNavbar />

        {/* HERO */}
        <section className="pt-36 pb-20 px-6 text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeUp}
            transition={{ duration: 0.9 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
              Your website.
              <br />
              Built automatically.
            </h1>

            <p className="mt-6 text-gray-400 text-lg">
              AutopilotAI builds a real website and fills it with marketing.
            </p>

            <div className="mt-10 flex justify-center">
              <PrimaryCTA href="/register">
                Create your site
              </PrimaryCTA>
            </div>
          </motion.div>
        </section>

        {/* LIVE WEBSITE */}
        <section className="px-6 pb-28">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="max-w-7xl mx-auto rounded-3xl border border-white/10 bg-black/40 overflow-hidden shadow-[0_80px_200px_rgba(0,0,0,.8)]"
          >
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-black/60 border-b border-white/10">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-4 text-xs text-gray-400">
                autopilotai.dev/r/testrestaurant
              </span>
            </div>

            {/* Iframe */}
            <div className="relative h-[420px] md:h-[600px]">
              <iframe
                src="/r/testrestaurant"
                className="absolute inset-0 w-full h-full scale-[0.88] origin-top-left pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-transparent to-transparent" />
            </div>
          </motion.div>

          <div className="mt-6 text-center text-sm text-gray-500">
            This is a live AutopilotAI website.
          </div>
        </section>

        {/* QUIET EXPLANATION */}
        <section className="px-6 pb-32">
          <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-3 text-center">
            {[
              {
                icon: <Globe className="w-6 h-6" />,
                text: "A real website at /r/your-name",
              },
              {
                icon: <Edit3 className="w-6 h-6" />,
                text: "Edit directly on the page",
              },
              {
                icon: <Zap className="w-6 h-6" />,
                text: "Changes save instantly",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                  {f.icon}
                </div>
                <p className="text-gray-300">{f.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* AI ENGINE (SECONDARY) */}
        <section className="px-6 pb-32">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-sm uppercase tracking-widest text-gray-500">
              Powered by AI
            </p>

            <h2 className="mt-4 text-3xl md:text-5xl font-medium">
              Content, emails, and ads
              <br />
              generated for your site.
            </h2>

            <div className="mt-10 flex justify-center gap-10 text-gray-400">
              <Sparkles />
              <Layers />
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-6 pb-40 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-semibold">
              Stop building.
              <br />
              Start publishing.
            </h2>

            <div className="mt-10 flex justify-center">
              <PrimaryCTA href="/register">
                Get started
              </PrimaryCTA>
            </div>
          </motion.div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/10 py-12 text-center text-sm text-gray-500">
          © 2025 AutopilotAI
        </footer>
      </div>
    </div>
  );
}
