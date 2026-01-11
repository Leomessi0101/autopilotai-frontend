"use client";

import { motion } from "framer-motion";
import MarketingNavbar from "@/components/MarketingNavbar";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Wand2,
  Mail,
  Megaphone,
  Layers,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Stars,
  Rocket,
  Target,
  LineChart,
  Globe,
  Edit3,
  Smartphone,
  LayoutDashboard,
} from "lucide-react";

/* =========================================================
   MOTION PRESETS
========================================================= */

const fadeUp = {
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
};

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const springy = {
  type: "spring" as const,
  stiffness: 120,
  damping: 18,
  mass: 0.6,
};

/* =========================================================
   SMALL UI PRIMITIVES
========================================================= */

function GlowDivider() {
  return (
    <div className="relative my-20 md:my-28">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-px w-[90%] md:w-[75%] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full bg-[#6d8ce8]/15 blur-2xl" />
      </div>
      <div className="h-1" />
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-sm text-gray-200 flex items-center gap-2">
      {children}
    </div>
  );
}

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
      className="group inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 rounded-2xl bg-gradient-to-r from-[#203b6a] to-[#345899] font-semibold text-base md:text-lg hover:scale-[1.02] transition shadow-[0_20px_70px_rgba(15,35,85,0.55)]"
    >
      <span>{children}</span>
      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
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
      className="inline-flex items-center justify-center gap-2 px-8 md:px-10 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-xl font-semibold text-base md:text-lg transition"
    >
      {children}
    </a>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function HomePage() {
  return (
    <div className="min-h-screen text-white bg-[#05070d] relative overflow-x-hidden">
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <div className="absolute -top-44 -left-44 w-[980px] h-[980px] bg-[conic-gradient(at_top_left,var(--tw-gradient-stops))] from-[#0c1a39] via-[#0a1630] to-transparent blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[980px] h-[980px] bg-[conic-gradient(at_bottom_right,var(--tw-gradient-stops))] from-[#0d1b3d] via-[#111a2c] to-transparent blur-[200px]" />
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_20%_20%,white,transparent_30%),radial-gradient(circle_at_80%_30%,white,transparent_25%),radial-gradient(circle_at_40%_80%,white,transparent_35%)]" />
      </div>

      {/* NAV */}
      <div className="relative z-20">
        <MarketingNavbar />
      </div>

      {/* =========================================================
          HERO — WEBSITE BUILDER FIRST
      ========================================================= */}
      <section className="relative z-10 pt-32 md:pt-40 pb-20 px-6 md:px-10">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeUp}
          transition={{ duration: 0.95 }}
          className="max-w-6xl mx-auto text-center"
        >
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Pill>
              <Globe className="w-4 h-4 text-[#6d8ce8]" />
              Website builder included
            </Pill>
            <Pill>
              <Sparkles className="w-4 h-4 text-[#6d8ce8]" />
              AI marketing engine
            </Pill>
            <Pill>
              <ShieldCheck className="w-4 h-4 text-[#6d8ce8]" />
              Autosave by default
            </Pill>
          </div>

          <h1 className="text-[2.9rem] md:text-7xl font-black leading-[1.03] tracking-tight">
            Build your website.
            <br />
            <span className="text-[#d8e3ff]">
              Fill it with marketing.
            </span>
            <br />
            Automatically.
          </h1>

          <p className="mt-8 text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            AutopilotAI creates a live website at{" "}
            <span className="text-white font-semibold">/r/your-name</span>,
            then generates the content, emails, and ads that power it —
            all in one system.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
            <PrimaryCTA href="/register">Create your website</PrimaryCTA>
            <SecondaryCTA href="/features">
              Explore everything inside
              <ArrowRight className="w-5 h-5 opacity-70" />
            </SecondaryCTA>
          </div>

          <p className="mt-8 text-gray-400">
            No setup. No publishing flow. Edit live and move on.
          </p>
        </motion.div>
      </section>

      <GlowDivider />

      {/* =========================================================
          WEBSITE BUILDER HIGHLIGHT
      ========================================================= */}
      <section className="relative z-10 px-6 md:px-10 py-16">
        <div className="max-w-7xl mx-auto grid gap-14 lg:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-black leading-[1.05]">
              A real website.
              <br />
              <span className="text-[#d8e3ff]">Not a landing page.</span>
            </h2>

            <p className="mt-6 text-gray-300 text-lg max-w-xl leading-relaxed">
              Your site is live instantly. Click text. Replace images.
              Everything autosaves. No editors layered on top of editors.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "Live at /r/your-name",
                "Edit directly on the page",
                "Autosave — no publish button",
                "Mobile + desktop handled automatically",
              ].map((t, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-5 py-4"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#6d8ce8] mt-0.5" />
                  <span className="text-gray-200">{t}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, delay: 0.1 }}
            className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl p-10 shadow-[0_50px_140px_rgba(0,0,0,.6)]"
          >
            <p className="text-sm text-gray-400 mb-3">Example live URL</p>
            <p className="font-semibold text-white mb-5">
              autopilotai.dev/r/my-business
            </p>

            <div className="space-y-3">
              <div className="h-3 rounded-full bg-white/10 w-full" />
              <div className="h-3 rounded-full bg-white/10 w-5/6" />
              <div className="h-3 rounded-full bg-white/10 w-4/6" />
            </div>

            <p className="mt-5 text-sm text-gray-300">
              Click. Edit. Done.
            </p>
          </motion.div>
        </div>
      </section>

      <GlowDivider />

      {/* =========================================================
          AI MARKETING ENGINE (SUPPORTING PILLAR)
      ========================================================= */}
      <section className="relative z-10 px-6 md:px-10 py-16">
        <div className="max-w-7xl mx-auto text-center mb-14">
          <h2 className="text-4xl md:text-6xl font-black">
            The engine behind the site.
          </h2>
          <p className="mt-6 text-gray-400 text-xl max-w-3xl mx-auto">
            Generate everything your website needs — without context switching.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 max-w-7xl mx-auto">
          {[
            {
              icon: <Wand2 className="w-6 h-6 text-[#6d8ce8]" />,
              title: "Content Generator",
              desc: "Posts and narratives that actually sound human.",
            },
            {
              icon: <Mail className="w-6 h-6 text-[#6d8ce8]" />,
              title: "Email Writer",
              desc: "Clear, professional emails that get replies.",
            },
            {
              icon: <Megaphone className="w-6 h-6 text-[#6d8ce8]" />,
              title: "Ad Generator",
              desc: "Structured ad copy built for clicks and conversions.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              transition={springy}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-[0_40px_100px_rgba(0,0,0,.55)]"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-6">
                {f.icon}
              </div>
              <h3 className="text-2xl font-bold">{f.title}</h3>
              <p className="mt-3 text-gray-300">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <GlowDivider />

      {/* FINAL CTA */}
      <section className="relative z-10 py-28 text-center px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-black leading-[1.02]">
            Build once.
            <br />
            Ship everywhere.
          </h2>

          <p className="mt-8 text-xl text-gray-300 max-w-3xl mx-auto">
            AutopilotAI replaces scattered tools with one focused system.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-5">
            <PrimaryCTA href="/register">Get started</PrimaryCTA>
            <SecondaryCTA href="/features">
              See full feature list
              <ArrowRight className="w-5 h-5 opacity-70" />
            </SecondaryCTA>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-16 text-center relative z-10">
        <p className="text-gray-400 text-sm">
          © 2025 AutopilotAI — Built for people who execute.
        </p>
      </footer>
    </div>
  );
}
