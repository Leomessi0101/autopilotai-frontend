"use client";

import { motion } from "framer-motion";
import MarketingNavbar from "@/components/MarketingNavbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Global Navbar */}
      <MarketingNavbar />

      {/* HERO */}
      <section className="pt-20 pb-24 px-6 md:px-10 text-center max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold leading-tight"
        >
          Run Your Business
          <span className="text-amber-600"> On Autopilot.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 md:mt-8 text-lg md:text-xl text-gray-600"
        >
          Content. Emails. Leads. Ads. Productivity.
          AutopilotAI handles the work —
          <span className="text-black font-semibold">
            {" "}
            while you focus on what matters.
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-col md:flex-row justify-center gap-4 md:gap-6"
        >
          <a
            href="/register"
            className="px-10 py-4 text-white rounded-full text-lg hover:opacity-90 transition shadow-xl bg-black"
          >
            Start Free
          </a>

          <a
            href="/features"
            className="px-10 py-4 border rounded-full text-lg transition border-gray-300 hover:border-black"
          >
            See Features
          </a>
        </motion.div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="px-6 md:px-10 text-center max-w-5xl mx-auto">
        <p className="text-gray-500 text-lg">
          Trusted by entrepreneurs, creators & marketers worldwide.
        </p>
      </section>

      {/* VALUE GRID */}
      <section className="mt-24 px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <ValueCard
          title="Save Hours Every Week"
          text="Stop manually writing posts, emails, and replies. AI does it for you."
        />

        <ValueCard
          title="Look More Professional"
          text="Show up consistently like a real brand — without burning out."
        />

        <ValueCard
          title="Grow Faster"
          text="Better output. Better communication. Better results."
        />
      </section>

      {/* BIG FEATURE PREVIEW */}
      <section className="mt-28 px-6 md:px-10 max-w-6xl mx-auto">
        <div className="p-8 md:p-12 border rounded-3xl shadow-xl bg-white border-gray-200">
          <h2 className="text-3xl font-bold">
            One platform that actually helps you grow.
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            AutopilotAI gives you the tools to stay consistent, convert leads,
            communicate better and operate like a modern business — without
            needing a team.
          </p>

          <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-gray-700">
            <li>• AI-written daily content</li>
            <li>• Smart email & lead responses</li>
            <li>• Ad creation for Meta & Google</li>
            <li>• Productivity + strategy guidance</li>
          </ul>

          <div className="mt-8">
            <a
              href="/features"
              className="px-8 py-4 rounded-full text-white hover:opacity-90 transition shadow-lg bg-black"
            >
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* WHO ITS FOR */}
      <section className="mt-28 px-6 md:px-10 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Built for people who want real progress.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Persona
            title="Business Owners"
            text="Grow your brand while AI handles the repetitive work."
          />

          <Persona title="Creators" text="Stay consistent without burnout." />

          <Persona
            title="Marketers & Agencies"
            text="Scale output. Work smarter. Deliver more."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mt-32 text-center pb-32 px-6 md:px-10">
        <h2 className="text-4xl font-bold">
          Ready to stop working like it’s 2015?
        </h2>

        <p className="text-gray-600 mt-4 text-lg">
          AutopilotAI helps you do more, with less effort.
        </p>

        <a
          href="/register"
          className="inline-block mt-8 px-12 py-5 rounded-full text-xl text-white hover:opacity-90 transition shadow-xl bg-black"
        >
          Get Started Today
        </a>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-10 text-center text-gray-500">
        <div className="mb-4">
          <a href="/features" className="mx-3 hover:text-amber-500 transition">
            Features
          </a>
          <a href="/pricing" className="mx-3 hover:text-amber-500 transition">
            Pricing
          </a>
          <a href="/login" className="mx-3 hover:text-amber-500 transition">
            Login
          </a>
        </div>

        © 2025 AutopilotAI. All rights reserved.
      </footer>
    </div>
  );
}

/* COMPONENTS */

function ValueCard({ title, text }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="p-8 md:p-10 border rounded-3xl shadow-lg bg-white border-gray-200"
    >
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="mt-3 text-lg text-gray-600">{text}</p>
    </motion.div>
  );
}

function Persona({ title, text }: any) {
  return (
    <div className="p-8 rounded-3xl border shadow-xl bg-white border-gray-200">
      <h4 className="text-xl font-bold">{title}</h4>
      <p className="mt-3 text-gray-600">{text}</p>
    </div>
  );
}
