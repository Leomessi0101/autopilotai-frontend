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
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
};

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const springy = {
  type: "spring",
  stiffness: 120,
  damping: 18,
  mass: 0.6,
};

function GlowDivider() {
  return (
    <div className="relative my-16 md:my-24">
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
      className="group inline-flex items-center justify-center gap-3 px-7 md:px-9 py-4 rounded-2xl bg-gradient-to-r from-[#203b6a] to-[#345899] font-semibold text-base md:text-lg hover:scale-[1.02] transition shadow-[0_20px_70px_rgba(15,35,85,0.55)]"
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
      className="inline-flex items-center justify-center gap-2 px-7 md:px-9 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-xl font-semibold text-base md:text-lg transition"
    >
      {children}
    </a>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_30px_80px_rgba(0,0,0,.45)]">
      <div className="flex items-center justify-between">
        <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
          {icon}
        </div>
        <div className="text-right">
          <div className="text-2xl md:text-3xl font-black text-white">
            {value}
          </div>
          <div className="text-sm text-gray-400">{label}</div>
        </div>
      </div>
    </div>
  );
}

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
      className="group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-[0_40px_100px_rgba(0,0,0,.55)] overflow-hidden"
    >
      {/* glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#6d8ce8]/15 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-6">
          {icon}
        </div>

        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="mt-3 text-gray-300 leading-relaxed">{desc}</p>

        <div className="mt-6 space-y-3">
          {bullets.map((b, i) => (
            <div key={i} className="flex items-start gap-3 text-gray-200">
              <CheckCircle2 className="w-5 h-5 text-[#6d8ce8] mt-0.5 flex-shrink-0" />
              <span className="text-sm md:text-base">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function MiniPreviewCard({
  title,
  subtitle,
  lines,
  icon,
}: {
  title: string;
  subtitle: string;
  lines: string[];
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={springy}
      className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-7 shadow-[0_40px_110px_rgba(0,0,0,.55)] overflow-hidden"
    >
      <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-[#2b4e8d]/25 blur-3xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400">{subtitle}</p>
            <h4 className="text-xl font-bold mt-1">{title}</h4>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
            {icon}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-5">
          <div className="space-y-3">
            {lines.map((l, i) => (
              <div
                key={i}
                className="h-3 rounded-full bg-white/10 overflow-hidden"
              >
                <motion.div
                  initial={{ width: "0%" }}
                  whileInView={{ width: `${Math.min(96, 60 + i * 12)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.08 }}
                  className="h-full bg-white/25"
                />
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm text-gray-300 leading-relaxed">
            {lines[0]}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen text-white bg-[#05070d] relative overflow-x-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 z-0">
        <div className="absolute -top-44 -left-44 w-[980px] h-[980px] bg-[conic-gradient(at_top_left,var(--tw-gradient-stops))] from-[#0c1a39] via-[#0a1630] to-transparent blur-[170px]" />
        <div className="absolute bottom-0 right-0 w-[980px] h-[980px] bg-[conic-gradient(at_bottom_right,var(--tw-gradient-stops))] from-[#0d1b3d] via-[#111a2c] to-transparent blur-[190px]" />
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_20%_20%,white,transparent_30%),radial-gradient(circle_at_80%_30%,white,transparent_25%),radial-gradient(circle_at_40%_80%,white,transparent_35%)]" />
      </div>

      {/* NAV */}
      <div className="relative z-20">
        <MarketingNavbar />
      </div>

      {/* HERO */}
      <section className="relative z-10 pt-28 md:pt-36 pb-16 md:pb-24 px-6 md:px-10">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeUp}
          transition={{ duration: 0.95 }}
          className="max-w-6xl mx-auto text-center"
        >
          {/* top pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Pill>
              <Sparkles className="w-4 h-4 text-[#6d8ce8]" />
              One platform for content + email + ads
            </Pill>
            <Pill>
              <Zap className="w-4 h-4 text-[#6d8ce8]" />
              Built for speed + quality
            </Pill>
            <Pill>
              <ShieldCheck className="w-4 h-4 text-[#6d8ce8]" />
              Your work saved automatically
            </Pill>
          </div>

          <h1 className="text-[2.65rem] leading-[1.05] md:text-7xl md:leading-[1.02] font-black tracking-tight">
            Create marketing
            <br />
            <span className="text-[#d8e3ff]">in minutes</span>
            <br />
            not hours.
          </h1>

          <p className="mt-6 md:mt-8 text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            AutopilotAI generates content, writes emails, and builds ads that
            sound human — with structure, clarity, and a conversion-first style.
          </p>

          {/* compact value list (mobile friendly) */}
          <div className="mt-10 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: <Wand2 className="w-5 h-5 text-[#6d8ce8]" />, t: "Write posts people actually read" },
              { icon: <Mail className="w-5 h-5 text-[#6d8ce8]" />, t: "Emails that get replies (not ignored)" },
              { icon: <Megaphone className="w-5 h-5 text-[#6d8ce8]" />, t: "Ad copy built for clicks + conversions" },
              { icon: <Layers className="w-5 h-5 text-[#6d8ce8]" />, t: "Everything saved in My Work automatically" },
            ].map((x, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.08 * i }}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-5 py-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                  {x.icon}
                </div>
                <p className="text-gray-200 text-sm md:text-base">{x.t}</p>
              </motion.div>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-5">
            <PrimaryCTA href="/register">Start Free</PrimaryCTA>
            <SecondaryCTA href="/features">
              See what’s inside <ArrowRight className="w-5 h-5 opacity-70" />
            </SecondaryCTA>
          </div>

          <p className="mt-8 text-gray-400">
            No setup. No learning curve. Just generate and go.
          </p>
        </motion.div>

        {/* HERO PREVIEW STRIP */}
        <motion.div
          variants={fade}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="mt-16 md:mt-20 max-w-7xl mx-auto"
        >
          <div className="grid gap-6 lg:grid-cols-3">
            <MiniPreviewCard
              subtitle="Content Generator"
              title="5 posts in one click"
              icon={<Wand2 className="w-5 h-5 text-[#6d8ce8]" />}
              lines={[
                "Hook-first captions with a natural CTA.",
                "Short, punchy, and brand-aligned.",
                "Ideas you can reuse forever.",
                "Built for speed and consistency.",
              ]}
            />
            <MiniPreviewCard
              subtitle="Email Writer"
              title="Send-ready emails"
              icon={<Mail className="w-5 h-5 text-[#6d8ce8]" />}
              lines={[
                "Professional tone without sounding robotic.",
                "Clear purpose, strong structure.",
                "Confidence without cringe.",
                "One clean next step.",
              ]}
            />
            <MiniPreviewCard
              subtitle="Ad Generator"
              title="3 variations per campaign"
              icon={<Megaphone className="w-5 h-5 text-[#6d8ce8]" />}
              lines={[
                "Headline + primary text + CTA format.",
                "Built for Meta, Google, TikTok.",
                "Benefit-led hooks.",
                "Skimmable, conversion-first copy.",
              ]}
            />
          </div>
        </motion.div>
      </section>

      <GlowDivider />

      {/* SOCIAL PROOF + STATS */}
      <section className="relative z-10 px-6 md:px-10 py-10 md:py-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-black">
                Built for people who execute.
              </h2>
              <p className="mt-4 text-gray-300 text-lg max-w-2xl">
                AutopilotAI is not a toy — it’s a working system for marketing output.
              </p>
            </div>

            <div className="flex items-center gap-2 text-gray-300">
              <Stars className="w-5 h-5 text-[#6d8ce8]" />
              <span className="text-sm md:text-base">
                Designed for creators, founders, and small teams
              </span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <StatCard
              label="faster content creation"
              value="10×"
              icon={<Rocket className="w-5 h-5 text-[#6d8ce8]" />}
            />
            <StatCard
              label="less time stuck writing"
              value="—80%"
              icon={<Clock className="w-5 h-5 text-[#6d8ce8]" />}
            />
            <StatCard
              label="clarity per output"
              value="High"
              icon={<Target className="w-5 h-5 text-[#6d8ce8]" />}
            />
          </div>
        </div>
      </section>

      <GlowDivider />

      {/* HOW IT WORKS */}
      <section className="relative z-10 px-6 md:px-10 py-8 md:py-14">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-6xl font-black">
              From idea → output, instantly.
            </h2>
            <p className="mt-6 text-gray-400 text-xl max-w-3xl mx-auto">
              A simple workflow that feels obvious — because it’s designed for real work.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                step: "01",
                title: "Describe the goal",
                text: "Give a few lines: audience, offer, tone. That’s it.",
                icon: <Sparkles className="w-5 h-5 text-[#6d8ce8]" />,
              },
              {
                step: "02",
                title: "Generate your pack",
                text: "Get posts, an email, and ads — cleanly formatted.",
                icon: <Layers className="w-5 h-5 text-[#6d8ce8]" />,
              },
              {
                step: "03",
                title: "Refine + reuse",
                text: "Copy, regenerate sections, and save everything to My Work.",
                icon: <LineChart className="w-5 h-5 text-[#6d8ce8]" />,
              },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.08 * i }}
                className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-[0_40px_100px_rgba(0,0,0,.55)] relative overflow-hidden"
              >
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#6d8ce8]/10 blur-3xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                      {s.icon}
                    </div>
                    <span className="text-sm text-gray-400 font-semibold">
                      STEP {s.step}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold">{s.title}</h3>
                  <p className="mt-3 text-gray-300 leading-relaxed">{s.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <GlowDivider />

      {/* DEEP FEATURE GRID */}
      <section className="relative z-10 px-6 md:px-10 py-8 md:py-14">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-6xl font-black">
              The tools you need — without the chaos.
            </h2>
            <p className="mt-6 text-gray-400 text-xl max-w-3xl mx-auto">
              No “AI magic” marketing. Just clean outputs that ship faster.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <FeatureCard
              icon={<Wand2 className="w-6 h-6 text-[#6d8ce8]" />}
              title="Content Engine"
              desc="Generate posts that don’t feel generic — with structure, hooks, and momentum."
              bullets={[
                "5 ready-to-post outputs per run",
                "Built for IG, X, LinkedIn, TikTok prompts",
                "High-signal writing (no fluff walls)",
              ]}
            />
            <FeatureCard
              icon={<Mail className="w-6 h-6 text-[#6d8ce8]" />}
              title="Email Writer"
              desc="Write professional emails that are clear, persuasive, and human."
              bullets={[
                "Subject + body format automatically",
                "Confidence without sounding salesy",
                "Copy to clipboard and send immediately",
              ]}
            />
            <FeatureCard
              icon={<Megaphone className="w-6 h-6 text-[#6d8ce8]" />}
              title="Ad Generator"
              desc="Generate campaign variations for different platforms with clean formatting."
              bullets={[
                "3 ad variations per generation",
                "Headline / Primary / CTA structure",
                "Platform-aware tone and length",
              ]}
            />
          </div>
        </div>
      </section>

      <GlowDivider />

      {/* GROWTH PACK SPOTLIGHT */}
      <section className="relative z-10 px-6 md:px-10 py-10 md:py-16">
        <div className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-[1.2fr,1fr] items-center">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-[0_60px_140px_rgba(0,0,0,.6)] relative overflow-hidden"
          >
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#6d8ce8]/15 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#6d8ce8]" />
                </div>
                <p className="text-sm text-gray-300">
                  Your newest feature
                </p>
              </div>

              <h2 className="text-4xl md:text-5xl font-black">
                One-Click Growth Pack
              </h2>
              <p className="mt-5 text-gray-300 text-lg leading-relaxed">
                Generate your social posts, an email, and ad copy in a single pass —
                all aligned to your brand voice and goal.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  "Charges only 1 generation",
                  "Regenerate individual sections",
                  "Clean formatting every time",
                  "Saved to My Work automatically",
                ].map((t, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#6d8ce8]" />
                    <span className="text-gray-200">{t}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <PrimaryCTA href="/register">Try it free</PrimaryCTA>
                <SecondaryCTA href="/features">
                  See all tools <ArrowRight className="w-5 h-5 opacity-70" />
                </SecondaryCTA>
              </div>
            </div>
          </motion.div>

          {/* image card */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_60px_140px_rgba(0,0,0,.6)] overflow-hidden"
          >
            <div className="relative h-[320px] md:h-[520px]">
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1800&auto=format"
                className="w-full h-full object-cover opacity-90"
                alt="Workspace"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="rounded-2xl border border-white/10 bg-black/35 backdrop-blur-xl p-6">
                  <p className="text-sm text-gray-300 mb-2">Example output style</p>
                  <p className="text-gray-100 font-semibold">
                    “Hook-first. Benefit-led. Clear next step.”
                  </p>
                  <p className="text-gray-300 mt-2 text-sm">
                    Built to be copied and posted instantly.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <GlowDivider />

      {/* FINAL CTA */}
      <section className="relative z-10 py-28 md:py-32 text-center px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-black leading-[1.02]">
            Make output
            <br />
            your default.
          </h2>

          <p className="mt-8 text-xl text-gray-300 max-w-3xl mx-auto">
            Stop staring at a blank page. Generate, refine, ship — and keep it all saved.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-5">
            <PrimaryCTA href="/register">Get Started Free</PrimaryCTA>
            <SecondaryCTA href="/features">
              Explore the platform <ArrowRight className="w-5 h-5 opacity-70" />
            </SecondaryCTA>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3 text-gray-400">
            <Pill>
              <Clock className="w-4 h-4 text-[#6d8ce8]" />
              Generate in seconds
            </Pill>
            <Pill>
              <ShieldCheck className="w-4 h-4 text-[#6d8ce8]" />
              Saved automatically
            </Pill>
            <Pill>
              <Sparkles className="w-4 h-4 text-[#6d8ce8]" />
              Clean outputs
            </Pill>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-16 text-center relative z-10">
        <p className="text-gray-400 text-sm">
          © 2025 AutopilotAI — Built for creators, founders, and teams who execute.
        </p>
      </footer>
    </div>
  );
}
