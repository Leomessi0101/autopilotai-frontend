"use client";

import { motion } from "framer-motion";
import MarketingNavbar from "@/components/MarketingNavbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      {/* Global Navbar */}
      <MarketingNavbar />

      {/* HERO */}
      <section className="pt-28 pb-32 px-6 md:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="max-w-5xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
            Your Business
            <br />
            <span className="text-blue-900">On Complete Autopilot</span>
          </h1>

          <p className="mt-8 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            AI that writes your content, replies to leads, runs ads, and manages daily tasks —
            so you can stop grinding and start scaling.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
            <a
              href="/register"
              className="group px-12 py-5 bg-black text-white font-semibold text-lg rounded-full hover:bg-gray-900 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center"
            >
              Start Free – No Card Required
              <span className="ml-3 group-hover:translate-x-1 transition-transform inline-block">→</span>
            </a>

            <a
              href="/features"
              className="px-12 py-5 border-2 border-gray-300 font-semibold text-lg rounded-full hover:border-black transition-all hover:shadow-xl transform hover:-translate-y-1"
            >
              Explore Features
            </a>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Join 8,000+ entrepreneurs already saving 20+ hours/week
          </p>
        </motion.div>
      </section>

      {/* SOCIAL PROOF BAR */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-600 font-medium">
            Trusted by founders, creators, and teams at
          </p>
          <div className="mt-6 flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale">
            <span className="text-2xl font-bold">StartupOS</span>
            <span className="text-2xl font-bold">CreatorHub</span>
            <span className="text-2xl font-bold">GrowthAgency</span>
            <span className="text-2xl font-bold">Indie Makers</span>
            <span className="text-2xl font-bold">ScaleFast</span>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <ValueCard
            title="Reclaim Your Time"
            text="Automate content, emails, and follow-ups. What used to take hours now happens while you sleep."
          />
          <ValueCard
            title="Stay Consistent"
            text="Never miss a post, reply, or opportunity. Show up like a pro — every single day."
          />
          <ValueCard
            title="Scale Without Burnout"
            text="Grow your audience, leads, and revenue without hiring or losing your mind."
          />
        </div>
      </section>

      {/* BIG FEATURE HIGHLIGHT */}
      <section className="py-28 px-6 md:px-10 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-extrabold">
              One AI. Every repetitive task.
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Stop switching tools. AutopilotAI handles the entire growth workflow in one place.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              "Daily AI-generated social content",
              "Smart replies to DMs, emails & comments",
              "Lead nurturing & follow-up sequences",
              "Ad copy + creative for Meta & Google",
              "Performance reports + growth suggestions",
              "Task automation & daily strategy briefs",
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 text-lg text-gray-700"
              >
                <span className="text-amber-600 font-bold mt-0.5">✓</span>
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <a
              href="/features"
              className="inline-flex items-center px-10 py-5 bg-black text-white font-semibold text-lg rounded-full hover:bg-gray-900 transition-all shadow-xl hover:shadow-2xl"
            >
              See Everything It Does
              <span className="ml-3">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16">
            Real people. Real results.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Testimonial
              quote="Saved me 25 hours/week. I finally have time to think strategically again."
              author="Alex Rivera"
              role="Founder, TechSaaS"
            />
            <Testimonial
              quote="My content is better than when I wrote it myself. And I never miss a day."
              author="Sarah Chen"
              role="Creator, 120k followers"
            />
            <Testimonial
              quote="Closed 3 new clients from leads I would’ve ignored. The AI replies are scary good."
              author="Marcus Torres"
              role="Agency Owner"
            />
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-28 px-6 md:px-10 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-12">
            Built for ambitious people who hate busywork
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <Persona
              title="Solopreneurs & Founders"
              text="Run a professional operation without the overhead of a team."
            />
            <Persona
              title="Content Creators"
              text="Post every day, engage fans, and grow — without burning out."
            />
            <Persona
              title="Marketers & Agencies"
              text="Deliver more for clients, faster, with higher quality output."
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-6 md:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Start running on autopilot.
          </h2>

          <p className="mt-8 text-xl md:text-2xl text-gray-600">
            Free to start. Cancel anytime. No credit card required.
          </p>

          <div className="mt-12">
            <a
              href="/register"
              className="inline-block px-16 py-7 bg-black text-white font-bold text-2xl rounded-full hover:bg-gray-900 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-2"
            >
              Get Started Free
            </a>
          </div>

          <p className="mt-8 text-gray-500">
            Have questions? Email us at{" "}
            <a href="mailto:contact@autopilotai.dev" className="underline hover:text-black">
              contact@autopilotai.dev
            </a>
          </p>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-16 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-8">
            <a href="/features" className="mx-5 text-gray-600 hover:text-amber-600 transition font-medium">
              Features
            </a>
            <a href="/pricing" className="mx-5 text-gray-600 hover:text-amber-600 transition font-medium">
              Pricing
            </a>
            <a href="/login" className="mx-5 text-gray-600 hover:text-amber-600 transition font-medium">
              Login
            </a>
            <a href="mailto:contact@autopilotai.dev" className="mx-5 text-gray-600 hover:text-amber-600 transition font-medium">
              Contact
            </a>
          </div>

          <p className="text-gray-500 text-sm">
            © 2025 AutopilotAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* COMPONENTS */

interface CardProps {
  title: string;
  text: string;
}

function ValueCard({ title, text }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="p-10 bg-white border border-gray-200 rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 text-center"
    >
      <h3 className="text-2xl md:text-3xl font-extrabold">{title}</h3>
      <p className="mt-4 text-lg text-gray-600 leading-relaxed">{text}</p>
    </motion.div>
  );
}

function Persona({ title, text }: CardProps) {
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

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
}

function Testimonial({ quote, author, role }: TestimonialProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="p-10 bg-white border border-gray-200 rounded-3xl shadow-xl"
    >
      <p className="text-lg md:text-xl text-gray-700 italic leading-relaxed">“{quote}”</p>
      <div className="mt-8">
        <p className="font-bold">{author}</p>
        <p className="text-gray-600 text-sm">{role}</p>
      </div>
    </motion.div>
  );
}