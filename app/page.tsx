"use client";

import { motion } from "framer-motion";
import MarketingNavbar from "@/components/MarketingNavbar";

export default function HomePage() {
  return (
    <div className="min-h-screen text-white bg-[#05070d] relative overflow-x-hidden">

      {/* Background Atmosphere */}
      <div className="fixed inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-[900px] h-[900px] bg-[conic-gradient(at_top_left,var(--tw-gradient-stops))] from-[#0c1a39] via-[#0a1630] to-transparent blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[900px] h-[900px] bg-[conic-gradient(at_bottom_right,var(--tw-gradient-stops))] from-[#0d1b3d] via-[#111a2c] to-transparent blur-[180px]" />
      </div>

      {/* NAV */}
      <div className="relative z-20">
        <MarketingNavbar />
      </div>

      {/* HERO */}
      <section className="relative z-10 pt-32 pb-28 px-6 md:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
            AI That Feels Powerful —
            <br />
            <span className="text-[#d8e3ff]">
              Built For Real Work.
            </span>
          </h1>

          <p className="mt-8 text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            AutopilotAI helps entrepreneurs, creators and teams scale faster
            with intelligent personas, automated workflows and a living UI experience.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
            <a
              href="/register"
              className="px-12 py-5 rounded-2xl bg-gradient-to-r from-[#203b6a] to-[#345899] font-semibold text-lg hover:scale-[1.02] transition shadow-[0_20px_60px_rgba(15,35,85,0.5)]"
            >
              Get Started Free
            </a>

            <a
              href="/features"
              className="px-12 py-5 border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-2xl text-lg font-semibold transition"
            >
              Explore Platform
            </a>
          </div>

          <p className="mt-8 text-gray-400">
            Trusted by thousands of creators & founders
          </p>
        </motion.div>

        {/* Abstract AI Visual */}
        <div className="mt-24 max-w-5xl mx-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full h-[280px] rounded-2xl bg-[radial-gradient(circle_at_20%_20%,rgba(80,110,190,0.35),transparent),radial-gradient(circle_at_80%_60%,rgba(120,160,255,0.25),transparent)] border border-white/10"
          />
          <p className="text-gray-300 mt-6 text-lg">
            Calm. Powerful. Designed to feel like a living intelligence — not a webpage.
          </p>
        </div>
      </section>

      {/* PERSONA SECTION */}
      <section className="relative z-10 py-24 px-6 md:px-10">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black">
            Intelligent Personas Built To Help You
          </h2>
          <p className="text-gray-400 mt-6 text-xl max-w-3xl mx-auto">
            Not random chatbots. Carefully designed personalities with
            purpose, identity and expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {[
            {
              title: "Business Strategist",
              text: "Planning, growth frameworks, marketing clarity.",
              img: "https://images.unsplash.com/photo-1531297484001-80022131f5a1"
            },
            {
              title: "Coding Mentor",
              text: "Technical guidance, debugging and smart engineering help.",
              img: "https://images.unsplash.com/photo-1535223289827-42f1e9919769"
            }
          ].map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl"
            >
              <img src={p.img} className="h-[260px] w-full object-cover opacity-80" />
              <div className="p-10">
                <h3 className="text-2xl font-bold">{p.title}</h3>
                <p className="text-gray-300 mt-3">{p.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 relative z-10 px-6 md:px-10">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black">
            Everything You Need To Scale
          </h2>
          <p className="text-gray-400 mt-6 text-xl max-w-3xl mx-auto">
            Content. Communication. Growth systems. All in one intelligent platform.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3 max-w-7xl mx-auto">
          {[
            {
              title: "Content Engine",
              text: "High-quality posts, threads, captions and strategy."
            },
            {
              title: "Smart Communication",
              text: "Reply to leads, emails & comments intelligently."
            },
            {
              title: "Automation Brain",
              text: "Daily planning, execution and growth optimization."
            }
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-3xl p-10 border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl"
            >
              <h3 className="text-2xl font-bold">{f.title}</h3>
              <p className="text-gray-300 mt-4">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-32 text-center px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-black leading-tight">
            Professional.
            <br />
            Powerful.
            <br />
            Built To Win.
          </h2>

          <p className="mt-8 text-xl text-gray-300">
            AutopilotAI helps ambitious people scale without burning out.
          </p>

          <div className="mt-12">
            <a
              href="/register"
              className="px-16 py-7 rounded-2xl text-2xl font-bold bg-gradient-to-r from-[#1c2f57] to-[#2b4e8d] shadow-[0_35px_120px_rgba(20,40,90,0.6)] hover:scale-[1.02] transition"
            >
              Get Started Free
            </a>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-16 text-center relative z-10">
        <p className="text-gray-400 text-sm">
          © 2025 AutopilotAI — Built for ambitious creators, founders and teams.
        </p>
      </footer>
    </div>
  );
}
