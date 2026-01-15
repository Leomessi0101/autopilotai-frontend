"use client";

import { motion } from "framer-motion";
import MarketingNavbar from "@/components/MarketingNavbar";
import {
  Sparkles,
  Globe,
  Zap,
  CheckCircle2,
  ArrowRight,
  Edit,
  Shield,
  Rocket,
  Users,
} from "lucide-react";

/* -----------------------------
   MOTION SYSTEM (MATCH HOME)
-------------------------------- */
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const springy = {
  type: "spring" as const,
  stiffness: 120,
  damping: 18,
};

/* -----------------------------
   SHARED UI
-------------------------------- */
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-sm text-gray-200 flex items-center gap-2">
      {children}
    </div>
  );
}

function PrimaryCTA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-white text-black font-semibold text-lg hover:bg-gray-100 transition"
    >
      <span>{children}</span>
      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}

function SecondaryCTA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center gap-2 px-8 py-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-xl font-semibold text-lg transition"
    >
      {children}
    </a>
  );
}

/* -----------------------------
   PAGE
-------------------------------- */
export default function FeaturesPage() {
  return (
    <div className="min-h-screen text-white bg-[#03050b] relative overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070d] via-[#03050b] to-black" />
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_20%_20%,white,transparent_30%),radial-gradient(circle_at_80%_30%,white,transparent_25%)]" />
      </div>

      <div className="relative z-20">
        <MarketingNavbar />
      </div>

      {/* HERO */}
      <section className="relative z-10 pt-28 md:pt-36 pb-24 px-6 md:px-10">
        <motion.div {...fadeUp} className="max-w-5xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Pill><Sparkles className="w-4 h-4 text-indigo-400" /> AI decides everything</Pill>
            <Pill><Globe className="w-4 h-4 text-indigo-400" /> Instant live website</Pill>
            <Pill><Zap className="w-4 h-4 text-indigo-400" /> One textbox</Pill>
          </div>

          <h1 className="text-[2.6rem] md:text-7xl font-semibold tracking-tight leading-[1.05]">
            A website builder
            <br />
            <span className="text-indigo-400">that thinks for you</span>
          </h1>

          <p className="mt-8 text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto">
            AutopilotAI generates a complete website from a single description —
            layout, structure, and real content included.
          </p>

          <div className="mt-14 flex flex-col sm:flex-row justify-center gap-5">
            <PrimaryCTA href="/register">Start building</PrimaryCTA>
            <SecondaryCTA href="/pricing">View pricing</SecondaryCTA>
          </div>
        </motion.div>
      </section>

      {/* CORE FEATURE */}
      <section className="relative z-10 px-6 md:px-10 py-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <motion.div {...fadeUp}>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight">
              One prompt.
              <br />
              One website.
            </h2>

            <p className="mt-6 text-xl text-gray-300">
              No templates. No setup. No decisions.
              Just describe your business and AutopilotAI does the rest.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "AI infers business type automatically",
                "Deterministic layout & structure",
                "Real starter copy (not lorem ipsum)",
                "Instant publish link",
                "Inline editing with autosave",
                "Mobile-ready by default",
              ].map((b) => (
                <div key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 mt-1" />
                  <span className="text-lg text-gray-200">{b}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-2xl">
            <div className="text-sm text-indigo-300 mb-4">What AutopilotAI handles</div>
            <div className="space-y-6">
              <FeatureMini
                icon={<Globe className="w-5 h-5 text-indigo-400" />}
                title="Website structure"
                desc="Hero, sections, layout, theme and footer — generated deterministically."
              />
              <FeatureMini
                icon={<Edit className="w-5 h-5 text-indigo-400" />}
                title="Content generation"
                desc="Headlines and sections tailored to your business and goal."
              />
              <FeatureMini
                icon={<Shield className="w-5 h-5 text-indigo-400" />}
                title="Editing & persistence"
                desc="Edit directly on the site. Changes autosave instantly."
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHO IT’S FOR */}
      <section className="relative z-10 px-6 md:px-10 py-24">
        <motion.div {...fadeUp} className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold mb-16">
            Built for people who want
            <br />
            results — not tools
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <Persona icon={<Rocket className="w-6 h-6 text-indigo-400" />} title="Founders">
              Launch fast without hiring designers or learning builders.
            </Persona>
            <Persona icon={<Users className="w-6 h-6 text-indigo-400" />} title="Creators">
              Get a clean, professional site without managing layouts.
            </Persona>
            <Persona icon={<Zap className="w-6 h-6 text-indigo-400" />} title="Operators">
              Ship sites quickly and focus on execution.
            </Persona>
          </div>
        </motion.div>
      </section>

      {/* FINAL CTA */}
      <section className="relative z-10 py-32 text-center px-6 md:px-10">
        <motion.div {...fadeUp} className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-semibold leading-[1.02]">
            Describe it.
            <br />
            Publish it.
          </h2>

          <p className="mt-8 text-xl text-gray-300">
            AutopilotAI removes the friction between idea and live website.
          </p>

          <div className="mt-14 flex flex-col sm:flex-row justify-center gap-5">
            <PrimaryCTA href="/register">Build your site</PrimaryCTA>
            <SecondaryCTA href="/pricing">See pricing</SecondaryCTA>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-16 text-center relative z-10">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} AutopilotAI — Websites built by AI.
        </p>
      </footer>
    </div>
  );
}

/* -----------------------------
   SUB COMPONENTS
-------------------------------- */
function FeatureMini({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-400 mt-1">{desc}</div>
      </div>
    </div>
  );
}

function Persona({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={springy}
      {...fadeUp}
      className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-xl"
    >
      <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h4 className="text-2xl font-semibold">{title}</h4>
      <p className="mt-5 text-lg text-gray-300">{children}</p>
    </motion.div>
  );
}
