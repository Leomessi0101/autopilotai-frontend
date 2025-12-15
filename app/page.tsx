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

      {/* HERO SECTION */}
      <section className="w-full flex flex-col items-center text-center mt-28 px-6">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl font-bold leading-tight tracking-tight max-w-4xl"
        >
          Your Business,  
          <span className="bg-gradient-to-r from-black to-gray-400 bg-clip-text text-transparent">
            on Autopilot.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-xl text-gray-600 max-w-2xl"
        >
          AutopilotAI handles your content, emails, lead generation and customer 
          responses — automatically. Grow your business while doing nothing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex gap-4 mt-10"
        >
          <a
            href="#"
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

      {/* FEATURES SECTION */}
      <section id="features" className="mt-32 px-10">
        <h2 className="text-4xl font-bold text-center">Everything Automated</h2>
        <p className="text-center text-gray-600 mt-3">
          AutopilotAI replaces entire marketing departments.
        </p>

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
            desc="Generate Meta + Google ads, headlines, angles and variations in seconds."
          />
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="mt-32 px-10 mb-32">
        <h2 className="text-4xl font-bold text-center">Pricing</h2>
        <p className="text-center text-gray-600 mt-3">
          Simple plans. Cancel anytime.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-10 mt-16">
          <PriceCard price="19" plan="Basic" desc="Essentials for small businesses." />
          <PriceCard price="49" plan="Growth" desc="Unlimited generation & variations." />
          <PriceCard price="99" plan="Pro" desc="AI images, blogs, campaigns & priority." />
        </div>
      </section>

      <footer className="border-t py-10 text-center text-gray-500">
        © 2025 AutopilotAI. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc }: any) {
  return (
    <div className="p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition bg-white">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}

function PriceCard({ plan, price, desc }: any) {
  return (
    <div className="p-10 rounded-3xl border border-gray-200 shadow-md hover:shadow-lg transition bg-white w-full md:w-80 text-center">
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
    </div>
  );
}
