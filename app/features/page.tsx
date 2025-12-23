"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import MarketingNavbar from "@/components/MarketingNavbar";

export default function FeaturesPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

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
      {/* Unified Marketing Navbar */}
      <MarketingNavbar />

      {/* HERO */}
      <section className="pt-28 pb-32 px-6 md:px-10 text-center">
        <div className="max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight"
          >
            Everything you need
            <br />
            <span className="text-amber-600">to run on autopilot.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className={`mt-8 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            AI that creates your content, replies to leads, builds ads, and guides your strategy —
            so you can finally focus on what actually moves the needle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-12 flex flex-col sm:flex-row justify-center gap-6"
          >
            <a
              href="/register"
              className={`group px-12 py-5 font-semibold text-lg rounded-full transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center ${
                isDark
                  ? "bg-amber-500 text-black hover:bg-amber-400"
                  : "bg-black text-white hover:bg-gray-900"
              }`}
            >
              Start Free – No Card Needed
              <span className="ml-3 group-hover:translate-x-1 transition-transform inline-block">→</span>
            </a>

            <a
              href="/pricing"
              className={`px-12 py-5 border-2 font-semibold text-lg rounded-full transition-all hover:shadow-xl transform hover:-translate-y-1 ${
                isDark
                  ? "border-gray-700 hover:border-amber-500"
                  : "border-gray-300 hover:border-black"
              }`}
            >
              View Pricing
            </a>
          </motion.div>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section className="py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold">
              One platform. Every growth task.
            </h2>
            <p className={`mt-6 text-xl max-w-3xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              No more switching tools or letting things slip. AutopilotAI handles the repetitive work — consistently and intelligently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <FeatureBlock
              theme={theme}
              title="AI Content Engine"
              desc="Never stare at a blank screen again. Get daily, high-converting content that sounds exactly like you."
              highlights={[
                "Full social posts & captions (Instagram, LinkedIn, X, etc.)",
                "On-brand tone & voice automatically applied",
                "Engagement-optimized ideas and hooks",
                "Schedule-ready content every single day",
              ]}
            />

            <FeatureBlock
              theme={theme}
              title="Smart Lead & Email Replies"
              desc="Turn every inquiry into a conversation. AI responds instantly with personalized, human-like messages."
              highlights={[
                "Replies to DMs, emails, and contact forms",
                "Smart follow-ups that nurture leads",
                "Professional yet conversational tone",
                "Closes more deals while you sleep",
              ]}
            />

            <FeatureBlock
              theme={theme}
              title="Ad Campaign Builder"
              desc="Launch winning ads in minutes. AI writes copy, generates angles, and structures full campaigns."
              highlights={[
                "Meta (Facebook/Instagram) ad copy & creatives",
                "Google Search & Performance Max scripts",
                "A/B test variations ready to deploy",
                "Proven frameworks built-in",
              ]}
            />

            <FeatureBlock
              theme={theme}
              title="Daily Strategy & Focus Guidance"
              desc="More than a tool — a thinking partner. Get clear direction on what to prioritize every day."
              highlights={[
                "Personalized daily action plans",
                "Growth suggestions based on your goals",
                "Eliminate decision fatigue",
                "Stay focused on high-impact work",
              ]}
            />
          </div>
        </div>
      </section>

      {/* PERSONAS */}
      <section className="py-28 px-6 md:px-10 bg-gray-50 dark:bg-gray-900/30">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-16">
            Built for ambitious people who hate wasting time
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <PersonaCard
              theme={theme}
              title="Solopreneurs & Founders"
              text="Run a full marketing engine without hiring a team or burning out."
            />
            <PersonaCard
              theme={theme}
              title="Creators & Personal Brands"
              text="Post daily, engage fans, and grow your audience — consistently and effortlessly."
            />
            <PersonaCard
              theme={theme}
              title="Marketers & Agencies"
              text="10x your output. Deliver better results for clients without scaling headcount."
            />
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-28 px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16">
            Doing it yourself vs. AutopilotAI
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <CompareCard
              theme={theme}
              title="Doing It Yourself"
              good={false}
              points={[
                "Inconsistent posting & communication",
                "Leads slip through the cracks",
                "Hours wasted on repetitive tasks",
                "Decision fatigue and burnout",
                "Slow, unpredictable growth",
              ]}
            />

            <CompareCard
              theme={theme}
              title="With AutopilotAI"
              good={true}
              points={[
                "Daily consistent output — guaranteed",
                "Every lead gets a fast, smart response",
                "Hours reclaimed every week",
                "Clear direction and focus",
                "Faster, more predictable growth",
              ]}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-28 px-6 md:px-10 bg-gray-50 dark:bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16">
            Got questions? We've got answers.
          </h2>

          <div className="space-y-8">
            <Faq
              theme={theme}
              question="Do I need any technical skills?"
              answer="None at all. If you can send an email, you can use AutopilotAI effectively from day one."
            />
            <Faq
              theme={theme}
              question="Is the output actually good — or just generic AI slop?"
              answer="Our engine is fine-tuned for real-world marketing. Users consistently say the content and replies are better than what they’d write themselves."
            />
            <Faq
              theme={theme}
              question="What platforms does it support?"
              answer="Instagram, LinkedIn, X (Twitter), Facebook, Google Ads, email platforms, contact forms — and more coming."
            />
            <Faq
              theme={theme}
              question="Can I cancel anytime?"
              answer="Yes — no contracts, no hidden fees. Cancel directly from your dashboard in seconds."
            />
            <Faq
              theme={theme}
              question="Is my data safe?"
              answer="We never train on your private data. Everything stays yours, and we use bank-level encryption."
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-6 md:px-10 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Stop grinding.
            <br />
            Start scaling.
          </h2>

          <p className={`mt-8 text-xl md:text-2xl max-w-2xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Join thousands already running their business on autopilot.
          </p>

          <div className="mt-12">
            <a
              href="/register"
              className={`inline-block px-16 py-7 font-bold text-2xl rounded-full transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 ${
                isDark
                  ? "bg-amber-500 text-black hover:bg-amber-400"
                  : "bg-black text-white hover:bg-gray-900"
              }`}
            >
              Get Started Free
            </a>
          </div>

          <p className="mt-10 text-gray-500">
            Questions? Reach out anytime at{" "}
            <a href="mailto:contact@autopilotai.dev" className="underline hover:text-amber-600">
              contact@autopilotai.dev
            </a>
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className={`border-t py-16 text-center ${
          isDark ? "border-gray-800 text-gray-500" : "border-gray-200 text-gray-500"
        }`}
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-8">
            <a href="/" className="mx-5 hover:text-amber-600 transition font-medium">Home</a>
            <a href="/features" className="mx-5 hover:text-amber-600 transition font-medium">Features</a>
            <a href="/pricing" className="mx-5 hover:text-amber-600 transition font-medium">Pricing</a>
            <a href="/login" className="mx-5 hover:text-amber-600 transition font-medium">Login</a>
          </div>
          <p className="text-sm">© 2025 AutopilotAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

/* COMPONENTS - UPGRADED BUT LOGIC PRESERVED */

interface FeatureBlockProps {
  title: string;
  desc: string;
  highlights: string[];
  theme: "light" | "dark";
}

function FeatureBlock({ title, desc, highlights, theme }: FeatureBlockProps) {
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className={`p-10 md:p-12 rounded-3xl border shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 ${
        isDark ? "bg-[#0F0F14] border-gray-800" : "bg-white border-gray-200"
      }`}
    >
      <h3 className="text-3xl md:text-4xl font-extrabold leading-tight">{title}</h3>
      <p className={`mt-4 text-lg leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
        {desc}
      </p>

      <ul className="mt-8 space-y-4">
        {highlights.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="flex items-start gap-4 text-lg"
          >
            <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${isDark ? "bg-amber-500" : "bg-black"}`} />
            <span className={isDark ? "text-gray-300" : "text-gray-700"}>{item}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

interface PersonaCardProps {
  title: string;
  text: string;
  theme: "light" | "dark";
}

function PersonaCard({ title, text, theme }: PersonaCardProps) {
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`p-12 rounded-3xl border shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 ${
        isDark ? "bg-[#0F0F14] border-gray-800" : "bg-white border-gray-200"
      }`}
    >
      <h4 className="text-2xl font-bold">{title}</h4>
      <p className={`mt-5 text-lg leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
        {text}
      </p>
    </motion.div>
  );
}

interface CompareCardProps {
  title: string;
  points: string[];
  good: boolean;
  theme: "light" | "dark";
}

function CompareCard({ title, points, good, theme }: CompareCardProps) {
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`p-10 rounded-3xl border-2 shadow-xl ${
        good
          ? "border-amber-500 bg-amber-50/50 dark:bg-amber-900/10"
          : isDark
          ? "border-gray-800 bg-[#0F0F14]"
          : "border-gray-200 bg-white"
      }`}
    >
      <h4 className="text-2xl font-extrabold mb-8">{title}</h4>
      <ul className="space-y-5">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-4">
            <span
              className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                good ? "bg-amber-600" : isDark ? "bg-gray-600" : "bg-gray-400"
              }`}
            />
            <span className={`text-lg ${isDark ? "text-gray-300" : "text-gray-700"}`}>{p}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

interface FaqProps {
  question: string;
  answer: string;
  theme: "light" | "dark";
}

function Faq({ question, answer, theme }: FaqProps) {
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`border-b pb-8 ${isDark ? "border-gray-800" : "border-gray-300"}`}
    >
      <h4 className="text-xl md:text-2xl font-bold">{question}</h4>
      <p className={`mt-4 text-lg leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
        {answer}
      </p>
    </motion.div>
  );
}