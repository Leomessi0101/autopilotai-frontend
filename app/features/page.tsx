"use client";
import { motion } from "framer-motion";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* HEADER */}
      <div className="w-full py-8 px-10 border-b border-gray-200">
        <h1 className="text-2xl font-bold tracking-tight">AutopilotAI</h1>
      </div>

      {/* HERO */}
      <section className="px-10 pt-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold"
        >
          The Future of Automated Business
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto"
        >
          AutopilotAI handles your content creation, lead responses, advertising, 
          and follow-ups — without you lifting a finger.
        </motion.p>
      </section>

      {/* FEATURES GRID */}
      <section className="mt-32 px-10 grid grid-cols-1 md:grid-cols-2 gap-20">
        
        {/* Feature 1 */}
        <FeatureBlock
          title="30-Day Content Machine"
          desc="Generate an entire month of posts, captions, ideas, and hashtags for your business instantly. Perfect for Instagram, Facebook, and LinkedIn."
          items={[
            "Daily post ideas",
            "Auto-written captions",
            "AI hashtags",
            "Brand-consistent tone",
          ]}
        />

        {/* Feature 2 */}
        <FeatureBlock
          title="AI Inbox & Email Autopilot"
          desc="AutopilotAI responds to leads, emails, and inquiries with your tone, your offers, and your exact style."
          items={[
            "DM responder",
            "Email templates",
            "Follow-up sequences",
            "FAQ-based smart replies",
          ]}
        />

        {/* Feature 3 */}
        <FeatureBlock
          title="Ad & Campaign Generator"
          desc="Generate ads for Meta and Google instantly — complete with headlines, angles, creatives, and variations."
          items={[
            "Meta ad sets",
            "Google search ads",
            "Creative prompts",
            "Multiple angles & versions",
          ]}
        />
      </section>

      {/* CTA */}
      <div className="mt-32 text-center pb-32">
        <h2 className="text-3xl font-bold">Ready to put your business on autopilot?</h2>
        <p className="text-gray-600 mt-3">Start your free trial today.</p>

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
