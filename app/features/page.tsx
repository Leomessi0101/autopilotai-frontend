"use client";

import { motion } from "framer-motion";
import MarketingNavbar from "@/components/MarketingNavbar";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen text-white bg-[#05070d] relative overflow-x-hidden">

      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-[900px] h-[900px] bg-[conic-gradient(at_top_left,var(--tw-gradient-stops))] from-[#0c1a39] via-[#0a1630] to-transparent blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[900px] h-[900px] bg-[conic-gradient(at_bottom_right,var(--tw-gradient-stops))] from-[#0d1b3d] via-[#111a2c] to-transparent blur-[180px]" />
      </div>

      {/* NAV */}
      <div className="relative z-20">
        <MarketingNavbar />
      </div>

      {/* HERO */}
      <section className="relative z-10 pt-32 pb-28 px-6 md:px-10 text-center">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-7xl font-black leading-tight tracking-tight"
          >
            Everything You Need
            <br />
            <span className="text-[#d8e3ff]">
              To Work Smarter.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-8 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            AutopilotAI helps you plan, create, communicate and stay consistent —
            without wasting time or burning out.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-12 flex flex-col sm:flex-row justify-center gap-6"
          >
            <a
              href="/register"
              className="px-12 py-5 rounded-2xl bg-gradient-to-r from-[#203b6a] to-[#345899] font-semibold text-lg hover:scale-[1.02] transition shadow-[0_20px_60px_rgba(15,35,85,0.5)]"
            >
              Get Started Free
            </a>

            <a
              href="/pricing"
              className="px-12 py-5 border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-2xl text-lg font-semibold transition"
            >
              View Pricing
            </a>
          </motion.div>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section className="relative z-10 py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black">
              One Platform. Real Results.
            </h2>
            <p className="mt-6 text-xl text-gray-400 max-w-3xl mx-auto">
              No chaos. No juggling tools. Just consistent output and clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <FeatureBlock
              title="AI Content Engine"
              desc="Ideas, posts, captions and long-form content — ready when you are."
              highlights={[
                "High-quality content in your voice",
                "Platform-optimized writing",
                "Hook-driven outputs",
                "Daily, consistent creation"
              ]}
            />

            <FeatureBlock
              title="Smart Replies & Communication"
              desc="Fast, helpful responses for leads, emails and conversations."
              highlights={[
                "Instant professional replies",
                "Lead nurturing & follow-ups",
                "Human-like tone",
                "Never miss an opportunity"
              ]}
            />

            <FeatureBlock
              title="Ad & Campaign Builder"
              desc="Winning ad copy and structured campaigns — without the headache."
              highlights={[
                "Meta & Google campaign support",
                "Multiple proven angles",
                "A/B variations",
                "Ready to launch outputs"
              ]}
            />

            <FeatureBlock
              title="Daily Strategy & Focus"
              desc="Clear direction so you always know what matters most."
              highlights={[
                "Personalized daily guidance",
                "Simple prioritized plans",
                "Remove decision fatigue",
                "Stay focused on impact"
              ]}
            />
          </div>
        </div>
      </section>

      {/* PERSONAS */}
      <section className="relative z-10 py-28 px-6 md:px-10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-16">
            Built For People Who Want To Move Faster
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <PersonaCard
              title="Founders"
              text="Run smarter without endless manual work."
            />
            <PersonaCard
              title="Creators"
              text="Stay consistent without burning out."
            />
            <PersonaCard
              title="Marketers & Agencies"
              text="Do more without increasing workload."
            />
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="relative z-10 py-28 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16">
            With AutopilotAI vs Doing It Yourself
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <CompareCard
              title="Doing It Yourself"
              good={false}
              points={[
                "Inconsistent output",
                "Missed leads",
                "Too much manual work",
                "Overthinking & fatigue",
                "Slow progress"
              ]}
            />

            <CompareCard
              title="With AutopilotAI"
              good={true}
              points={[
                "Consistent daily output",
                "Every lead handled",
                "Time back in your day",
                "Clarity and focus",
                "Faster, predictable progress"
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-32 text-center px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black leading-tight">
            Simple.
            <br />
            Powerful.
            <br />
            Useful.
          </h2>

          <p className="mt-8 text-xl text-gray-300">
            Built to actually help — not just impress.
          </p>

          <div className="mt-12">
            <a
              href="/register"
              className="px-16 py-7 rounded-2xl text-2xl font-bold bg-gradient-to-r from-[#1c2f57] to-[#2b4e8d] shadow-[0_35px_120px_rgba(20,40,90,0.6)] hover:scale-[1.02] transition"
            >
              Get Started Free
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-16 text-center relative z-10">
        <p className="text-gray-400 text-sm">
          © 2025 AutopilotAI — Built for ambitious people.
        </p>
      </footer>
    </div>
  );
}

/* COMPONENTS */

interface FeatureBlockProps {
  title: string;
  desc: string;
  highlights: string[];
}

function FeatureBlock({ title, desc, highlights }: FeatureBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="p-10 md:p-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl"
    >
      <h3 className="text-3xl font-bold">{title}</h3>
      <p className="mt-4 text-lg text-gray-300">{desc}</p>

      <ul className="mt-8 space-y-4">
        {highlights.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="flex items-start gap-4 text-lg text-gray-300"
          >
            <span className="mt-1 w-2 h-2 rounded-full bg-[#6d8ce8]" />
            {item}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

function PersonaCard({ title, text }: { title: string; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="p-12 border border-white/10 bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl"
    >
      <h4 className="text-2xl font-bold">{title}</h4>
      <p className="mt-5 text-lg text-gray-300">{text}</p>
    </motion.div>
  );
}

function CompareCard({ title, points, good }: { title: string; points: string[]; good: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`p-10 rounded-3xl border shadow-xl ${
        good
          ? "border-[#2b4e8d] bg-[#0b1424]"
          : "border-white/10 bg-white/5"
      }`}
    >
      <h4 className="text-2xl font-bold mb-8">{title}</h4>
      <ul className="space-y-5">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-4">
            <span
              className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                good ? "bg-[#6d8ce8]" : "bg-gray-400"
              }`}
            />
            <span className="text-lg text-gray-300">{p}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
