"use client";

import { motion } from "framer-motion";
import MarketingNavbar from "@/components/MarketingNavbar";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Global Marketing Navbar */}
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
            <span className="text-blue-900">to run on autopilot.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-8 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
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
              className="group px-12 py-5 bg-black text-white font-semibold text-lg rounded-full hover:bg-gray-900 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center"
            >
              Start Free – No Card Needed
              <span className="ml-3 group-hover:translate-x-1 transition-transform inline-block">→</span>
            </a>

            <a
              href="/pricing"
              className="px-12 py-5 border-2 border-gray-300 font-semibold text-lg rounded-full hover:border-black transition-all hover:shadow-xl transform hover:-translate-y-1"
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
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              No more switching tools or letting things slip. AutopilotAI handles the repetitive work — consistently and intelligently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <FeatureBlock
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
      <section className="py-28 px-6 md:px-10 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-16">
            Built for ambitious people who hate wasting time
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <PersonaCard
              title="Solopreneurs & Founders"
              text="Run a full marketing engine without hiring a team or burning out."
            />
            <PersonaCard
              title="Creators & Personal Brands"
              text="Post daily, engage fans, and grow your audience — consistently and effortlessly."
            />
            <PersonaCard
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
      <section className="py-28 px-6 md:px-10 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16">
            Got questions? We've got answers.
          </h2>

          <div className="space-y-8">
            <Faq
              question="Do I need any technical skills?"
              answer="None at all. If you can send an email, you can use AutopilotAI effectively from day one."
            />
            <Faq
              question="Is the output actually good — or just generic AI slop?"
              answer="Our engine is fine-tuned for real-world marketing. Users consistently say the content and replies are better than what they’d write themselves."
            />
            <Faq
              question="What platforms does it support?"
              answer="Instagram, LinkedIn, X (Twitter), Facebook, Google Ads, email platforms, contact forms — and more coming."
            />
            <Faq
              question="Can I cancel anytime?"
              answer="Yes — no contracts, no hidden fees. Cancel directly from your dashboard in seconds."
            />
            <Faq
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

          <p className="mt-8 text-xl md:text-2xl text-gray-600">
            Join thousands already running their business on autopilot.
          </p>

          <div className="mt-12">
            <a
              href="/register"
              className="inline-block px-16 py-7 bg-black text-white font-bold text-2xl rounded-full hover:bg-gray-900 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-2"
            >
              Get Started Free
            </a>
          </div>

          <p className="mt-10 text-gray-500">
            Questions? Reach out anytime at{" "}
            <a href="mailto:contact@autopilotai.dev" className="underline hover:text-black">
              contact@autopilotai.dev
            </a>
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-16 text-center text-gray-500">
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
      className="p-10 md:p-12 bg-white border border-gray-200 rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2"
    >
      <h3 className="text-3xl md:text-4xl font-extrabold leading-tight">{title}</h3>
      <p className="mt-4 text-lg text-gray-600 leading-relaxed">
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
            className="flex items-start gap-4 text-lg text-gray-700"
          >
            <span className="mt-1 w-2 h-2 rounded-full bg-black flex-shrink-0" />
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
      className="p-12 bg-white border border-gray-200 rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
    >
      <h4 className="text-2xl font-bold">{title}</h4>
      <p className="mt-5 text-lg text-gray-600 leading-relaxed">{text}</p>
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
      className={`p-10 rounded-3xl border-2 shadow-xl ${
        good
          ? "border-amber-500 bg-amber-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <h4 className="text-2xl font-extrabold mb-8">{title}</h4>
      <ul className="space-y-5">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-4">
            <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${good ? "bg-amber-600" : "bg-gray-400"}`} />
            <span className="text-lg text-gray-700">{p}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function Faq({ question, answer }: { question: string; answer: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="border-b border-gray-300 pb-8"
    >
      <h4 className="text-xl md:text-2xl font-bold">{question}</h4>
      <p className="mt-4 text-lg text-gray-600 leading-relaxed">{answer}</p>
    </motion.div>
  );
}