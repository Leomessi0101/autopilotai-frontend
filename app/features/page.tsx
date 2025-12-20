"use client";
import { motion } from "framer-motion";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* HEADER */}
      <div className="w-full py-8 px-10 border-b border-gray-200 flex justify-between items-center">
        <h1
          className="text-2xl font-bold tracking-tight cursor-pointer"
          onClick={() => (window.location.href = "/")}
        >
          AutopilotAI
        </h1>

        <a
          href="/pricing"
          className="px-6 py-2 rounded-full border hover:border-black transition"
        >
          Pricing
        </a>
      </div>

      {/* HERO */}
      <section className="px-10 pt-24 text-center max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold"
        >
          Grow Faster.
          <span className="text-amber-600"> Work Less.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-xl text-gray-600"
        >
          AutopilotAI takes care of your content, emails, leads and ads —
          while you stay focused on actually building your business.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex justify-center gap-6"
        >
          <a
            href="/pricing"
            className="px-10 py-4 bg-black text-white rounded-full text-lg hover:bg-gray-900 transition"
          >
            Start Now
          </a>

          <a
            href="/register"
            className="px-10 py-4 border border-gray-300 rounded-full text-lg hover:border-black transition"
          >
            Try Free
          </a>
        </motion.div>
      </section>

      {/* VALUE PROPOSITION */}
      <section className="mt-28 px-10 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold">
          Everything you struggle to do consistently —
          <span className="text-amber-600"> handled.</span>
        </h2>
        <p className="text-gray-600 mt-4 text-lg">
          No more “I’ll post tomorrow”. No more ignoring leads. No more
          guessing ads. AutopilotAI helps you show up every day like a real
          brand.
        </p>
      </section>

      {/* FEATURE BLOCKS */}
      <section className="mt-28 px-10 grid grid-cols-1 md:grid-cols-2 gap-20 max-w-6xl mx-auto">
        
        <FeatureBlock
          title="AI Content Engine"
          desc="Zero effort content creation. Consistent, brand-aligned, and built to engage — without you thinking for hours."
          items={[
            "High-quality content ideas",
            "Full posts & captions ready to use",
            "Consistent brand tone",
            "Built for Instagram, LinkedIn & more"
          ]}
        />

        <FeatureBlock
          title="Smart Email & Lead Replies"
          desc="Instant, human-sounding replies that don't feel robotic. Never miss another opportunity because you were ‘busy’."
          items={[
            "Lead response automation",
            "Follow-ups that convert",
            "Professional tone matching",
            "Saves time — makes money"
          ]}
        />

        <FeatureBlock
          title="Ad & Campaign Builder"
          desc="Turn ideas into structured ad campaigns in seconds. Copy, variations, creative direction — done."
          items={[
            "Facebook / Instagram ad copy",
            "Google search ad scripting",
            "Creative ideas & angles",
            "A/B test ready instantly"
          ]}
        />

        <FeatureBlock
          title="AI Strategy Guidance"
          desc="Not just a tool. AutopilotAI actually helps you think clearer about growth."
          items={[
            "Daily focus suggestions",
            "Clarity on what to do next",
            "Less overwhelm",
            "More execution"
          ]}
        />

      </section>

      {/* WHO IS THIS FOR */}
      <section className="mt-28 px-10 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Built for people who want results.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <PersonaCard
            title="Business Owners"
            text="Grow your brand without burning out trying to do everything manually."
          />
          <PersonaCard
            title="Creators & Personal Brands"
            text="Stay consistent, post better content, and build real momentum."
          />
          <PersonaCard
            title="Agencies & Marketers"
            text="Scale output without scaling workload. Deliver more for clients."
          />
        </div>
      </section>

      {/* COMPARISON */}
      <section className="mt-28 px-10 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center">
          Why AutopilotAI instead of “doing it yourself”?
        </h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <CompareCard
            title="Without AutopilotAI"
            bad
            points={[
              "Inconsistent posting",
              "Slow replies to leads",
              "Hard to stay motivated",
              "Thinking instead of doing"
            ]}
          />

          <CompareCard
            title="With AutopilotAI"
            good
            points={[
              "Consistent output",
              "Instant communication",
              "Clear direction",
              "More growth — less stress"
            ]}
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-28 px-10 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Questions? We got you.
        </h2>

        <Faq question="Do I need to be technical?"
             answer="No. If you can type, you can use AutopilotAI." />

        <Faq question="Is this actually useful or just hype?"
             answer="People use it daily to save hours, stay consistent and grow faster." />

        <Faq question="Can I cancel anytime?"
             answer="Yes. No contracts. No commitments." />
      </section>

      {/* CTA */}
      <div className="mt-32 text-center pb-32">
        <h2 className="text-3xl font-bold">
          Ready to let AI take over the boring parts?
        </h2>
        <p className="text-gray-600 mt-3">
          Start today. Every day you delay, you fall behind someone who didn’t.
        </p>

        <a
          href="/pricing"
          className="inline-block mt-8 px-10 py-4 bg-black text-white rounded-full text-lg hover:bg-gray-900 transition"
        >
          Get Started
        </a>
      </div>

      <footer className="border-t py-10 text-center text-gray-500">
        © 2025 AutopilotAI. All rights reserved.
      </footer>
    </div>
  );
}

/* COMPONENTS */

function FeatureBlock({ title, desc, items }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="p-10 rounded-3xl border border-gray-200 shadow-sm bg-white"
    >
      <h3 className="text-3xl font-bold">{title}</h3>
      <p className="text-gray-600 mt-4">{desc}</p>

      <ul className="mt-6 space-y-2">
        {items.map((i: any, idx: number) => (
          <li key={idx} className="text-gray-800 flex items-center gap-3">
            <span className="w-2 h-2 bg-black rounded-full"></span>
            {i}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function PersonaCard({ title, text }: any) {
  return (
    <div className="p-8 rounded-3xl border bg-white">
      <h4 className="text-xl font-bold">{title}</h4>
      <p className="text-gray-600 mt-3">{text}</p>
    </div>
  );
}

function CompareCard({ title, points, good = false, bad = false }: any) {
  return (
    <div
      className={`p-8 rounded-3xl border ${
        good ? "border-amber-400 bg-amber-50" : ""
      }`}
    >
      <h4 className="text-xl font-bold mb-4">{title}</h4>
      <ul className="space-y-2">
        {points.map((p: any, i: number) => (
          <li key={i} className="flex gap-3 text-gray-700">
            <span
              className={`w-2 h-2 rounded-full ${
                good ? "bg-amber-500" : "bg-black"
              }`}
            />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Faq({ question, answer }: any) {
  return (
    <div className="border-b py-6">
      <h4 className="font-semibold text-lg">{question}</h4>
      <p className="text-gray-600 mt-2">{answer}</p>
    </div>
  );
}
