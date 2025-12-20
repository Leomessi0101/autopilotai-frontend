"use client";

import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* NAVBAR */}
      <header className="w-full py-6 px-10 flex justify-between items-center border-b border-gray-200">
        <h1
          className="text-2xl font-bold tracking-tight cursor-pointer"
          onClick={() => (window.location.href = "/")}
        >
          AutopilotAI
        </h1>

        <div className="flex gap-6 items-center">
          <a href="/features" className="hover:underline">
            Features
          </a>
          <a href="/pricing" className="hover:underline">
            Pricing
          </a>
          <a href="/login" className="hover:underline">
            Login
          </a>

          <a
            href="/register"
            className="px-6 py-3 rounded-full bg-black text-white hover:bg-gray-900 transition"
          >
            Get Started
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-28 pb-24 px-10 text-center max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl font-bold leading-tight"
        >
          Run Your Business
          <span className="text-amber-600"> On Autopilot.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-xl text-gray-600"
        >
          Content. Emails. Leads. Ads. Productivity.
          AutopilotAI handles the work —
          <span className="font-semibold text-black"> while you focus on what matters.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex justify-center gap-6"
        >
          <a
            href="/register"
            className="px-10 py-4 bg-black text-white rounded-full text-lg hover:bg-gray-900 transition"
          >
            Start Free
          </a>

          <a
            href="/features"
            className="px-10 py-4 border border-gray-300 rounded-full text-lg hover:border-black transition"
          >
            See Features
          </a>
        </motion.div>
      </section>

      {/* TRUST / SOCIAL PROOF */}
      <section className="px-10 mt-10 text-center max-w-5xl mx-auto">
        <p className="text-gray-500 text-lg">
          Already trusted by entrepreneurs, creators & marketers worldwide.
        </p>
      </section>

      {/* VALUE GRID */}
      <section className="mt-32 px-10 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">

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
      <section className="mt-32 px-10 max-w-6xl mx-auto">
        <div className="p-12 border rounded-3xl bg-white shadow-sm">
          <h2 className="text-3xl font-bold">
            One platform that actually helps you grow.
          </h2>

          <p className="text-gray-600 mt-4 text-lg">
            AutopilotAI gives you practical tools to stay consistent, convert
            leads, communicate better and operate like a modern business —
            without needing a team.
          </p>

          <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-lg">
            <li>• AI-written daily content</li>
            <li>• Smart email & lead responses</li>
            <li>• Ad creation for Meta & Google</li>
            <li>• Productivity + direction guidance</li>
          </ul>

          <div className="mt-8">
            <a
              href="/features"
              className="px-8 py-4 bg-black text-white rounded-full hover:bg-gray-900 transition"
            >
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* WHO ITS FOR */}
      <section className="mt-32 px-10 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Built for people who want real progress.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <Persona
            title="Business Owners"
            text="Grow your brand while AI handles the repetitive work."
          />

          <Persona
            title="Creators"
            text="Stay consistent & build momentum without burnout."
          />

          <Persona
            title="Marketers & Agencies"
            text="Scale output. Work smarter. Deliver more."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mt-32 text-center pb-32 px-10">
        <h2 className="text-4xl font-bold">
          Ready to stop working like it’s 2015?
        </h2>

        <p className="text-gray-600 mt-4 text-lg">
          AutopilotAI helps you do more, with less effort.
        </p>

        <a
          href="/register"
          className="inline-block mt-8 px-12 py-5 bg-black text-white rounded-full text-xl hover:bg-gray-900 transition"
        >
          Get Started Today
        </a>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-10 text-center text-gray-500">
        <div className="mb-4">
          <a href="/features" className="mx-3 hover:underline">
            Features
          </a>
          <a href="/pricing" className="mx-3 hover:underline">
            Pricing
          </a>
          <a href="/login" className="mx-3 hover:underline">
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
      className="p-10 border rounded-3xl bg-white shadow-sm"
    >
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-gray-600 mt-3 text-lg">{text}</p>
    </motion.div>
  );
}

function Persona({ title, text }: any) {
  return (
    <div className="p-8 rounded-3xl border bg-white">
      <h4 className="text-xl font-bold">{title}</h4>
      <p className="text-gray-600 mt-3">{text}</p>
    </div>
  );
}
