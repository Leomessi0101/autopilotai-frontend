"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import MarketingNavbar from "@/components/MarketingNavbar";

export default function HomePage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("autopilot-theme");
    if (saved === "dark") setTheme("dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("autopilot-theme", newTheme);
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDark ? "bg-[#0B0B0E] text-white" : "bg-white text-black"
      }`}
    >
      {/* ⭐ NEW GLOBAL MARKETING NAVBAR */}
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
          className={`mt-6 md:mt-8 text-lg md:text-xl ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Content. Emails. Leads. Ads. Productivity.
          AutopilotAI handles the work —
          <span className={isDark ? "text-white font-semibold" : "text-black font-semibold"}>
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
            className={`px-10 py-4 text-white rounded-full text-lg hover:opacity-90 transition shadow-xl ${
              isDark ? "bg-amber-500" : "bg-black"
            }`}
          >
            Start Free
          </a>

          <a
            href="/features"
            className={`px-10 py-4 border rounded-full text-lg transition ${
              isDark
                ? "border-gray-700 hover:border-amber-500"
                : "border-gray-300 hover:border-black"
            }`}
          >
            See Features
          </a>
        </motion.div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="px-6 md:px-10 text-center max-w-5xl mx-auto">
        <p className={isDark ? "text-gray-400 text-lg" : "text-gray-500 text-lg"}>
          Trusted by entrepreneurs, creators & marketers worldwide.
        </p>
      </section>

      {/* VALUE GRID */}
      <section className="mt-24 px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <ValueCard
          theme={theme}
          title="Save Hours Every Week"
          text="Stop manually writing posts, emails, and replies. AI does it for you."
        />

        <ValueCard
          theme={theme}
          title="Look More Professional"
          text="Show up consistently like a real brand — without burning out."
        />

        <ValueCard
          theme={theme}
          title="Grow Faster"
          text="Better output. Better communication. Better results."
        />
      </section>

      {/* BIG FEATURE PREVIEW */}
      <section className="mt-28 px-6 md:px-10 max-w-6xl mx-auto">
        <div
          className={`p-8 md:p-12 border rounded-3xl shadow-xl ${
            isDark ? "bg-[#0F0F14] border-gray-800" : "bg-white border-gray-200"
          }`}
        >
          <h2 className="text-3xl font-bold">One platform that actually helps you grow.</h2>

          <p className={`mt-4 text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            AutopilotAI gives you the tools to stay consistent, convert leads, communicate
            better and operate like a modern business — without needing a team.
          </p>

          <ul
            className={`mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-lg ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <li>• AI-written daily content</li>
            <li>• Smart email & lead responses</li>
            <li>• Ad creation for Meta & Google</li>
            <li>• Productivity + strategy guidance</li>
          </ul>

          <div className="mt-8">
            <a
              href="/features"
              className={`px-8 py-4 rounded-full text-white hover:opacity-90 transition shadow-lg ${
                isDark ? "bg-amber-500" : "bg-black"
              }`}
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
            theme={theme}
            title="Business Owners"
            text="Grow your brand while AI handles the repetitive work."
          />

          <Persona theme={theme} title="Creators" text="Stay consistent without burnout." />

          <Persona
            theme={theme}
            title="Marketers & Agencies"
            text="Scale output. Work smarter. Deliver more."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mt-32 text-center pb-32 px-6 md:px-10">
        <h2 className="text-4xl font-bold">Ready to stop working like it’s 2015?</h2>

        <p className={isDark ? "text-gray-400 mt-4 text-lg" : "text-gray-600 mt-4 text-lg"}>
          AutopilotAI helps you do more, with less effort.
        </p>

        <a
          href="/register"
          className={`inline-block mt-8 px-12 py-5 rounded-full text-xl text-white hover:opacity-90 transition shadow-xl ${
            isDark ? "bg-amber-500" : "bg-black"
          }`}
        >
          Get Started Today
        </a>
      </section>

      {/* FOOTER */}
      <footer
        className={`border-t py-10 text-center ${
          isDark ? "border-gray-800 text-gray-400" : "border-gray-200 text-gray-500"
        }`}
      >
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

function ValueCard({ title, text, theme }: any) {
  const isDark = theme === "dark";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className={`p-8 md:p-10 border rounded-3xl shadow-lg ${
        isDark ? "bg-[#0F0F14] border-gray-800" : "bg-white border-gray-200"
      }`}
    >
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className={`mt-3 text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>{text}</p>
    </motion.div>
  );
}

function Persona({ title, text, theme }: any) {
  const isDark = theme === "dark";
  return (
    <div
      className={`p-8 rounded-3xl border shadow-xl ${
        isDark ? "bg-[#0F0F14] border-gray-800" : "bg-white border-gray-200"
      }`}
    >
      <h4 className="text-xl font-bold">{title}</h4>
      <p className={`mt-3 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{text}</p>
    </div>
  );
}
