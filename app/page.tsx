"use client";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* NAVBAR */}
      <nav className="w-full py-6 px-10 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-2xl font-bold tracking-tight">AutopilotAI</h1>
        <div className="space-x-6 text-gray-800">
          <a href="/features" className="hover:text-black">Features</a>
          <a href="/pricing" className="hover:text-black">Pricing</a>
          <a href="/login" className="hover:text-black">Login</a>
          <a
            href="/register"
            className="px-5 py-2 rounded-full bg-black text-white hover:bg-gray-900 transition"
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="w-full flex flex-col items-center text-center mt-28 px-6">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl font-bold leading-tight tracking-tight max-w-4xl"
        >
          Your Business,
          <span className="bg-gradient-to-r from-black to-gray-400 bg-clip-text text-transparent">
            {" "}on Autopilot.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-xl text-gray-600 max-w-2xl"
        >
          AutopilotAI handles your content, emails, leads and customer responses — 
          automatically. Grow your business while doing less.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex gap-4 mt-10"
        >
          <a
            href="#pricing"
            className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition"
          >
            Start Free Trial
          </a>
          <a
            href="#features"
            className="px-8 py-3 border border-black rounded-full hover:bg-black hover:text-white transition"
          >
            See Features
          </a>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mt-32 px-10 max-w-6xl mx-auto">
        <SectionHeader
          title="Everything Automated"
          subtitle="AutopilotAI replaces entire marketing departments."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
          <FeatureCard
            title="30-Day Content Machine"
            desc="Generate a full month of posts, captions, hashtags and ideas instantly."
          />
          <FeatureCard
            title="AI Inbox & Email Autopilot"
            desc="Fast, consistent replies trained on your brand. Never lose a lead again."
          />
          <FeatureCard
            title="Ad & Campaign Generator"
            desc="Meta + Google ads, headlines, angles and variations in seconds."
          />
        </div>
      </section>

      {/* BENEFITS */}
      <section className="mt-40 px-10 max-w-6xl mx-auto">
        <SectionHeader
          title="Why Businesses Choose AutopilotAI"
          subtitle="Built for founders, teams, and growing brands."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
          <BenefitCard text="Save 20+ hours per week on manual work" />
          <BenefitCard text="Reply to leads instantly 24/7" />
          <BenefitCard text="Consistent, professional brand communication" />
          <BenefitCard text="Create campaigns in seconds, not weeks" />
          <BenefitCard text="Scale your content without hiring" />
          <BenefitCard text="Simple. Fast. Reliable." />
        </div>
      </section>

      {/* USE CASES */}
      <section className="mt-40 px-10 max-w-6xl mx-auto">
        <SectionHeader
          title="Made For Real Business"
          subtitle="AutopilotAI fits into any workflow."
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
          <UseCaseCard title="Agencies" desc="Deliver more work with less staff" />
          <UseCaseCard title="E-Commerce" desc="Emails, ads & campaigns automated" />
          <UseCaseCard title="Coaches / Creators" desc="Content engine for growth" />
          <UseCaseCard title="B2B Companies" desc="Lead nurturing & emails handled" />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mt-40 px-10 max-w-6xl mx-auto text-center">
        <SectionHeader
          title="Trusted By Businesses"
          subtitle="(Placeholder content — you can plug in real testimonials later)"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
          <TestimonialCard
            text="We replaced 80% of our manual marketing work."
            name="Business Owner"
          />
          <TestimonialCard
            text="Lead responses are instant now — conversions increased."
            name="Agency Founder"
          />
          <TestimonialCard
            text="Finally feels like marketing is handled."
            name="Startup CEO"
          />
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="mt-40 px-10 mb-32 max-w-6xl mx-auto">
        <SectionHeader title="Pricing" subtitle="Simple plans. Cancel anytime." />

        <div className="flex flex-col md:flex-row justify-center gap-10 mt-16">
          <PriceCard price="19" plan="Basic" desc="Essentials for small businesses." />
          <PriceCard price="49" plan="Growth" desc="Unlimited generation & variations." />
          <PriceCard price="99" plan="Pro" desc="AI images, blogs, campaigns & priority." />
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-20 px-10 max-w-5xl mx-auto mb-32">
        <SectionHeader title="Frequently Asked Questions" />

        <div className="space-y-6 mt-10">
          <FAQ q="Is there a free trial?" a="Yes, you can start immediately." />
          <FAQ q="Can I cancel anytime?" a="Yes, subscriptions are flexible." />
          <FAQ q="Do I need technical skills?" a="No, AutopilotAI is beginner friendly." />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-10 text-center py-24 border-t border-gray-200">
        <h2 className="text-4xl font-bold mb-4">Ready To Put Your Business On Autopilot?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Join businesses using AutopilotAI to automate growth.
        </p>

        <div className="mt-10 flex justify-center gap-6">
          <a className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition" href="/register">
            Get Started
          </a>
          <a className="px-8 py-3 border border-black rounded-full hover:bg-black hover:text-white transition" href="#pricing">
            View Pricing
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-10 text-center text-gray-500">
        © 2025 AutopilotAI. All rights reserved.
      </footer>
    </div>
  );
}

/* ========== COMPONENTS BELOW ========= */

function SectionHeader({ title, subtitle }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <h2 className="text-4xl font-bold">{title}</h2>
      {subtitle && <p className="text-gray-600 mt-3">{subtitle}</p>}
    </motion.div>
  );
}

function FeatureCard({ title, desc }: any) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition bg-white"
    >
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </motion.div>
  );
}

function BenefitCard({ text }: any) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
    >
      <p className="text-gray-700">{text}</p>
    </motion.div>
  );
}

function UseCaseCard({ title, desc }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-7 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
    >
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </motion.div>
  );
}

function TestimonialCard({ text, name }: any) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="p-8 border rounded-3xl bg-white shadow-sm hover:shadow-md transition"
    >
      <p className="italic text-gray-700 mb-4">“{text}”</p>
      <div className="font-semibold">{name}</div>
    </motion.div>
  );
}

function FAQ({ q, a }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="border p-6 rounded-2xl"
    >
      <h4 className="font-semibold">{q}</h4>
      <p className="text-gray-600 mt-2">{a}</p>
    </motion.div>
  );
}

function PriceCard({ plan, price, desc }: any) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-10 rounded-3xl border border-gray-200 shadow-md hover:shadow-xl transition bg-white w-full md:w-80 text-center"
    >
      <h3 className="text-2xl font-bold">{plan}</h3>
      <p className="text-gray-600 mt-2">{desc}</p>
      <div className="text-5xl font-bold mt-6">${price}</div>
      <div className="text-gray-600 mt-1">per month</div>
      <a
        href="#"
        className="block mt-8 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition"
      >
        Get Started
      </a>
    </motion.div>
  );
}
