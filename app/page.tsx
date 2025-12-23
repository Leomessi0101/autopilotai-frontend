"use client";

import { motion } from "framer-motion";
import MarketingNavbar from "@/components/MarketingNavbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Global Navbar */}
      <MarketingNavbar />

      {/* HERO */}
      <section className="pt-24 pb-28 px-6 md:px-10 text-center max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight"
        >
          Run Your Business
          <br />
          <span className="text-amber-600">On Autopilot.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-8 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
        >
          Content. Emails. Leads. Ads. Productivity.
          <br className="hidden md:block" />
          AutopilotAI handles the work —
          <span className="text-black font-semibold">
            {" while you focus on what matters."}
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-12 flex flex-col sm:flex-row justify-center gap-5"
        >
          <a
            href="/register"
            className="px-12 py-5 bg-black text-white font-medium text-lg rounded-full hover:bg-gray-900 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-black/20"
          >
            Start Free Today
          </a>

          <a
            href="/features"
            className="px-12 py-5 border-2 border-gray-300 text-black font-medium text-lg rounded-full hover:border-black transition hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-gray-300"
          >
            See All Features
          </a>
        </motion.div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-10 px-6 md:px-10 text-center">
        <p className="text-gray-500 text-lg font-medium">
          Trusted by entrepreneurs, creators, and marketers worldwide
        </p>
      </section>

      {/* VALUE GRID */}
      <section className="mt-20 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ValueCard
            title="Save Hours Every Week"
            text="Stop manually writing posts, emails, and replies. Let AI handle the repetitive tasks instantly."
          />
          <ValueCard
            title="Look More Professional"
            text="Show up consistently like a premium brand — without the burnout or massive team."
          />
          <ValueCard
            title="Grow Faster"
            text="Higher-quality output. Smarter communication. Measurable results, faster."
          />
        </div>
      </section>

      {/* BIG FEATURE PREVIEW */}
      <section className="mt-32 px-6 md:px-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="p-12 md:p-16 bg-white border border-gray-200 rounded-3xl shadow-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            One platform that actually helps you grow.
          </h2>

          <p className="mt-6 text-xl text-gray-600 leading-relaxed max-w-4xl">
            AutopilotAI gives you the tools to stay consistent, convert leads,
            communicate better, and operate like a modern business — all without
            needing a big team.
          </p>

          <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 text-lg text-gray-700">
            {[
              "AI-written daily content",
              "Smart email & lead responses",
              "Ad creation for Meta & Google",
              "Productivity + strategy guidance",
            ].map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center"
              >
                <span className="text-amber-600 mr-3 text-xl">•</span>
                {item}
              </motion.li>
            ))}
          </ul>

          <div className="mt-12">
            <a
              href="/features"
              className="inline-block px-10 py-5 bg-black text-white font-medium text-lg rounded-full hover:bg-gray-900 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Explore All Features
            </a>
          </div>
        </motion.div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="mt-32 px-6 md:px-10 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-center mb-16"
        >
          Built for people who want real progress.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <Persona
            title="Business Owners"
            text="Grow your brand while AI handles the repetitive work."
          />
          <Persona title="Creators" text="Stay consistent without burning out." />
          <Persona
            title="Marketers & Agencies"
            text="Scale output. Work smarter. Deliver more value."
          />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mt-40 pb-40 px-6 md:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Ready to stop working like it’s 2015?
          </h2>

          <p className="mt-6 text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            AutopilotAI helps you do more, with less effort.
          </p>

          <a
            href="/register"
            className="inline-block mt-10 px-14 py-6 bg-black text-white font-semibold text-xl rounded-full hover:bg-gray-900 transition shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-black/30"
          >
            Get Started Today – Free
          </a>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-12 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-6">
            <a
              href="/features"
              className="mx-4 text-gray-600 hover:text-amber-600 transition font-medium"
            >
              Features
            </a>
            <a
              href="/pricing"
              className="mx-4 text-gray-600 hover:text-amber-600 transition font-medium"
            >
              Pricing
            </a>
            <a
              href="/login"
              className="mx-4 text-gray-600 hover:text-amber-600 transition font-medium"
            >
              Login
            </a>
          </div>

          <p className="text-gray-500 text-sm">
            © 2025 AutopilotAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* COMPONENTS */

interface CardProps {
  title: string;
  text: string;
}

function ValueCard({ title, text }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-100px" }}
      className="p-10 bg-white border border-gray-200 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow"
    >
      <h3 className="text-2xl md:text-3xl font-extrabold leading-tight">{title}</h3>
      <p className="mt-4 text-lg text-gray-600 leading-relaxed">{text}</p>
    </motion.div>
  );
}

function Persona({ title, text }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="p-10 bg-white border border-gray-200 rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
    >
      <h4 className="text-2xl font-bold text-black">{title}</h4>
      <p className="mt-4 text-lg text-gray-600 leading-relaxed">{text}</p>
    </motion.div>
  );
}