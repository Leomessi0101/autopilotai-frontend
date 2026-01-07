"use client";

import { motion } from "framer-motion";
import MarketingNavbar from "@/components/MarketingNavbar";
import {
  Sparkles,
  Layers,
  Mail,
  Megaphone,
  Zap,
  CheckCircle2,
  ArrowRight,
  Target,
  Rocket,
  Users,
} from "lucide-react";

/* -----------------------------
   MOTION SYSTEM (MATCH HOME)
-------------------------------- */
const fadeUp = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const springy = {
  type: "spring" as const,
  stiffness: 120,
  damping: 18,
  mass: 0.6,
};

/* -----------------------------
   SHARED UI ELEMENTS
-------------------------------- */
function GlowDivider() {
  return (
    <div className="relative my-20 md:my-28">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-px w-[80%] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
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

function PrimaryCTA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center justify-center gap-3 px-8 md:px-10 py-5 rounded-2xl bg-gradient-to-r from-[#203b6a] to-[#345899] font-semibold text-lg hover:scale-[1.02] transition shadow-[0_25px_80px_rgba(15,35,85,0.6)]"
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
      className="inline-flex items-center justify-center gap-2 px-8 md:px-10 py-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-xl font-semibold text-lg transition"
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
    <div className="min-h-screen text-white bg-[#05070d] relative overflow-x-hidden">

      {/* BACKGROUND ATMOSPHERE */}
      <div className="fixed inset-0 z-0">
        <div className="absolute -top-44 -left-44 w-[980px] h-[980px] bg-[conic-gradient(at_top_left,var(--tw-gradient-stops))] from-[#0c1a39] via-[#0a1630] to-transparent blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[980px] h-[980px] bg-[conic-gradient(at_bottom_right,var(--tw-gradient-stops))] from-[#0d1b3d] via-[#111a2c] to-transparent blur-[200px]" />
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_20%_20%,white,transparent_30%),radial-gradient(circle_at_80%_30%,white,transparent_25%),radial-gradient(circle_at_40%_80%,white,transparent_35%)]" />
      </div>

      {/* NAV */}
      <div className="relative z-20">
        <MarketingNavbar />
      </div>

      {/* HERO */}
      <section className="relative z-10 pt-28 md:pt-36 pb-20 px-6 md:px-10">
        <motion.div {...fadeUp} transition={{ duration: 0.9 }} className="max-w-6xl mx-auto text-center">

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Pill><Sparkles className="w-4 h-4 text-[#6d8ce8]" /> All core tools included</Pill>
            <Pill><Zap className="w-4 h-4 text-[#6d8ce8]" /> Built for execution</Pill>
            <Pill><Target className="w-4 h-4 text-[#6d8ce8]" /> Output-first workflow</Pill>
          </div>

          <h1 className="text-[2.7rem] leading-[1.05] md:text-7xl md:leading-[1.02] font-black tracking-tight">
            Everything you need
            <br />
            <span className="text-[#d8e3ff]">to stay consistent.</span>
          </h1>

          <p className="mt-8 text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            AutopilotAI replaces scattered tools, indecision, and friction
            with a single system designed for momentum.
          </p>

          <div className="mt-14 flex flex-col sm:flex-row justify-center gap-5">
            <PrimaryCTA href="/register">Start Free</PrimaryCTA>
            <SecondaryCTA href="/pricing">View Pricing</SecondaryCTA>
          </div>
        </motion.div>
      </section>

      <GlowDivider />

      {/* PROBLEM → SOLUTION */}
      <section className="relative z-10 px-6 md:px-10 py-16">
        <motion.div {...fadeUp} transition={{ duration: 0.8 }} className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black">
            The problem isn’t effort.
            <br />
            It’s fragmentation.
          </h2>

          <p className="mt-8 text-xl text-gray-400 max-w-3xl mx-auto">
            Most people don’t fail because they lack ideas —
            they fail because execution is split across tools, tabs, and decisions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-20">
          {[
            "Too many disconnected tools",
            "No clear daily direction",
            "Inconsistent execution",
          ].map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              transition={springy}
              {...fadeUp}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-[0_40px_100px_rgba(0,0,0,.55)]"
            >
              <h3 className="text-2xl font-bold">{t}</h3>
              <p className="mt-4 text-gray-300">
                AutopilotAI replaces chaos with one focused system for output.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <GlowDivider />

      {/* CORE FEATURES */}
      <section className="relative z-10 px-6 md:px-10 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black">Core Capabilities</h2>
            <p className="mt-6 text-xl text-gray-400">
              Built to replace workflows — not add another tool.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-14">
            <FeatureCard
              icon={<Sparkles className="w-6 h-6 text-[#6d8ce8]" />}
              title="AI Content Engine"
              desc="Generate structured posts, threads, captions, and long-form content with intent."
              bullets={[
                "Platform-aware formatting",
                "Conversion-focused hooks",
                "Brand & tone alignment",
                "Consistent daily output",
              ]}
            />

            <FeatureCard
              icon={<Mail className="w-6 h-6 text-[#6d8ce8]" />}
              title="Email & Communication"
              desc="Handle outreach, follow-ups, and replies with clarity and professionalism."
              bullets={[
                "Send-ready emails",
                "Human tone (no robotic copy)",
                "Follow-up logic",
                "Saved & reusable outputs",
              ]}
            />

            <FeatureCard
              icon={<Megaphone className="w-6 h-6 text-[#6d8ce8]" />}
              title="Ad & Campaign Builder"
              desc="Campaign-ready ad copy built for speed and clarity."
              bullets={[
                "Meta, Google & TikTok",
                "Multiple variations",
                "Clear CTA structure",
                "Launch-ready formatting",
              ]}
            />

            <FeatureCard
              icon={<Layers className="w-6 h-6 text-[#6d8ce8]" />}
              title="One-Click Growth Pack"
              desc="Generate posts, emails, and ads in one aligned pass."
              bullets={[
                "Unified messaging",
                "Single-prompt workflow",
                "Optional AI visuals",
                "One credit, full pack",
              ]}
            />
          </div>
        </div>
      </section>

      <GlowDivider />

      {/* WHO IT’S FOR */}
      <section className="relative z-10 px-6 md:px-10 py-16">
        <motion.div {...fadeUp} className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-20">
            Built for people who ship.
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <Persona icon={<Rocket className="w-6 h-6 text-[#6d8ce8]" />} title="Founders">
              Replace overwhelm with clarity and execution.
            </Persona>

            <Persona icon={<Users className="w-6 h-6 text-[#6d8ce8]" />} title="Creators">
              Stay consistent without burnout.
            </Persona>

            <Persona icon={<Zap className="w-6 h-6 text-[#6d8ce8]" />} title="Agencies">
              Scale results without scaling workload.
            </Persona>
          </div>
        </motion.div>
      </section>

      <GlowDivider />

      {/* FINAL CTA */}
      <section className="relative z-10 py-32 text-center px-6 md:px-10">
        <motion.div {...fadeUp} className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black leading-[1.02]">
            Focus.
            <br />
            Output.
            <br />
            Momentum.
          </h2>

          <p className="mt-8 text-xl text-gray-300 max-w-3xl mx-auto">
            AutopilotAI is built to help you move forward — consistently.
          </p>

          <div className="mt-14 flex flex-col sm:flex-row justify-center gap-5">
            <PrimaryCTA href="/register">Get Started Free</PrimaryCTA>
            <SecondaryCTA href="/pricing">See pricing</SecondaryCTA>
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

/* -----------------------------
   SUB COMPONENTS
-------------------------------- */
function FeatureCard({
  icon,
  title,
  desc,
  bullets,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  bullets: string[];
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={springy}
      {...fadeUp}
      className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-[0_40px_110px_rgba(0,0,0,.55)] relative overflow-hidden"
    >
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#6d8ce8]/15 blur-3xl" />
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-6">
          {icon}
        </div>

        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="mt-4 text-gray-300 text-lg">{desc}</p>

        <div className="mt-8 space-y-4">
          {bullets.map((b, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#6d8ce8] mt-1" />
              <span className="text-gray-200">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
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
      <h4 className="text-2xl font-bold">{title}</h4>
      <p className="mt-5 text-lg text-gray-300">{children}</p>
    </motion.div>
  );
}
