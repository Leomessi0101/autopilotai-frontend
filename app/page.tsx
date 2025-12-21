"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("autopilot-theme");
    if (saved === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("autopilot-theme", newTheme);

    if (newTheme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#0B0B0E] dark:text-white transition-all duration-500">
      {/* NAVBAR */}
      <header className="w-full py-6 px-6 md:px-10 flex justify-between items-center border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/70 dark:bg-[#0B0B0E]/70 backdrop-blur-xl z-50">
        <h1
          className="text-2xl font-bold tracking-tight cursor-pointer"
          onClick={() => (window.location.href = "/")}
        >
          AutopilotAI
        </h1>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 items-center text-sm font-medium">
          <a href="/features" className="hover:text-amber-600 transition">
            Features
          </a>
          <a href="/pricing" className="hover:text-amber-600 transition">
            Pricing
          </a>
          <a href="/login" className="hover:text-amber-600 transition">
            Login
          </a>

          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-full border dark:border-gray-700 border-gray-300 hover:border-amber-500 transition"
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>

          <a
            href="/register"
            className="px-6 py-3 rounded-full bg-black dark:bg-amber-500 text-white hover:opacity-90 transition shadow-lg"
          >
            Get Started
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0B0B0E] space-y-4 text-lg">
          <a href="/features" className="block hover:text-amber-500">Features</a>
          <a href="/pricing" className="block hover:text-amber-500">Pricing</a>
          <a href="/login" className="block hover:text-amber-500">Login</a>

          <button
            onClick={toggleTheme}
            className="w-full px-4 py-2 rounded-xl border dark:border-gray-700 border-gray-300 hover:border-amber-500 transition"
          >
            {theme === "light" ? "Enable Dark Mode" : "Disable Dark Mode"}
          </button>

          <a
            href="/register"
            className="block text-center px-6 py-3 rounded-xl bg-black dark:bg-amber-500 text-white hover:opacity-90 transition"
          >
            Get Started
          </a>
        </div>
      )}

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
          className="mt-6 md:mt-8 text-lg md:text-xl text-gray-600 dark:text-gray-400"
        >
          Content. Emails. Leads. Ads. Productivity.
          AutopilotAI handles the work —
          <span className="font-semibold text-black dark:text-white">
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
            className="px-10 py-4 bg-black dark:bg-amber-500 text-white rounded-full text-lg hover:opacity-90 transition shadow-xl"
          >
            Start Free
          </a>

          <a
            href="/features"
            className="px-10 py-4 border border-gray-300 dark:border-gray-700 rounded-full text-lg hover:border-black dark:hover:border-amber-500 transition"
          >
            See Features
          </a>
        </motion.div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="px-6 md:px-10 mt-6 text-center max-w-5xl mx-auto">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Already trusted by entrepreneurs, creators & marketers worldwide.
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
        <div className="p-8 md:p-12 border rounded-3xl bg-white dark:bg-[#0F0F14] dark:border-gray-800 shadow-xl">
          <h2 className="text-3xl font-bold">
            One platform that actually helps you grow.
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
            AutopilotAI gives you practical tools to stay consistent, convert
            leads, communicate better and operate like a modern business —
            without needing a team.
          </p>

          <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 text-lg">
            <li>• AI-written daily content</li>
            <li>• Smart email & lead responses</li>
            <li>• Ad creation for Meta & Google</li>
            <li>• Productivity + direction guidance</li>
          </ul>

          <div className="mt-8">
            <a
              href="/features"
              className="px-8 py-4 bg-black dark:bg-amber-500 text-white rounded-full hover:opacity-90 transition shadow-lg"
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
      <section className="mt-32 text-center pb-32 px-6 md:px-10">
        <h2 className="text-4xl font-bold">
          Ready to stop working like it’s 2015?
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
          AutopilotAI helps you do more, with less effort.
        </p>

        <a
          href="/register"
          className="inline-block mt-8 px-12 py-5 bg-black dark:bg-amber-500 text-white rounded-full text-xl hover:opacity-90 transition shadow-xl"
        >
          Get Started Today
        </a>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-10 text-center text-gray-500 dark:text-gray-400">
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
      className="p-8 md:p-10 border rounded-3xl bg-white dark:bg-[#0F0F14] dark:border-gray-800 shadow-lg"
    >
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">{text}</p>
    </motion.div>
  );
}

function Persona({ title, text }: any) {
  return (
    <div className="p-8 rounded-3xl border bg-white dark:bg-[#0F0F14] dark:border-gray-800 shadow-xl">
      <h4 className="text-xl font-bold">{title}</h4>
      <p className="text-gray-600 dark:text-gray-400 mt-3">{text}</p>
    </div>
  );
}
