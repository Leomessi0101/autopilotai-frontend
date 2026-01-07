"use client";

import { motion } from "framer-motion";
import MarketingNavbar from "@/components/MarketingNavbar";

export default function HomePage() {
  return (
    <div className="min-h-screen text-white bg-[#05070d] relative overflow-x-hidden">

      {/* ====== DEEP ATMOSPHERIC BACKGROUND ====== */}
      <div className="fixed inset-0 z-0">
        <div className="absolute -top-60 -left-60 w-[1100px] h-[1100px] bg-[conic-gradient(at_top_left,var(--tw-gradient-stops))] from-[#0e1f44] via-[#0a1630] to-transparent blur-[200px]" />
        <div className="absolute top-[30%] right-[-20%] w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,#1c3a7a,transparent_70%)] blur-[220px]" />
        <div className="absolute bottom-[-30%] left-[10%] w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,#0f2a5f,transparent_70%)] blur-[240px]" />
      </div>

      {/* ====== NAV ====== */}
      <div className="relative z-30">
        <MarketingNavbar />
      </div>

      {/* ====== HERO ====== */}
      <section className="relative z-10 pt-36 pb-40 px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-7xl mx-auto text-center"
        >
          <span className="inline-block mb-6 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-sm tracking-wide text-gray-300">
            Built for real work. Not demos.
          </span>

          <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tight">
            The AI Workspace
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#d8e3ff] to-[#6d8ce8]">
              That Actually Delivers
            </span>
          </h1>

          <p className="mt-10 text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            AutopilotAI helps you think, plan, create and communicate —
            faster, clearer, and without mental overload.
          </p>

          <div className="mt-16 flex flex-col sm:flex-row justify-center gap-6">
            <a
              href="/register"
              className="px-14 py-6 rounded-2xl bg-gradient-to-r from-[#1c2f57] to-[#2b4e8d] text-xl font-bold shadow-[0_30px_100px_rgba(30,60,140,0.6)] hover:scale-[1.03] transition"
            >
              Get Started Free
            </a>

            <a
              href="/features"
              className="px-14 py-6 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl text-xl font-semibold hover:bg-white/10 transition"
            >
              Explore Platform
            </a>
          </div>

          <p className="mt-10 text-gray-400">
            Used by founders, creators, solo operators and teams
          </p>
        </motion.div>

        {/* ====== HERO VISUAL ====== */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mt-32 max-w-6xl mx-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_80px_200px_rgba(0,0,0,.7)] overflow-hidden"
        >
          <img
            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format"
            className="w-full h-[420px] object-cover opacity-95"
          />
          <div className="p-10 text-left">
            <p className="text-lg text-gray-300">
              A focused system for content, communication, planning and execution.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ====== PHILOSOPHY ====== */}
      <section className="relative z-10 py-32 px-6 md:px-10">
        <div className="max-w-6xl mx-auto text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-black">
            Designed For People Who Build
          </h2>
          <p className="mt-8 text-xl text-gray-400 max-w-3xl mx-auto">
            No fluff. No distractions. Just intelligent systems that move work forward.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {[
            {
              title: "Clarity Over Chaos",
              text: "Turn scattered thoughts into structured action.",
              img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format",
            },
            {
              title: "Execution First",
              text: "Every tool exists to help you finish, not brainstorm forever.",
              img: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1600&auto=format",
            },
            {
              title: "Built To Scale",
              text: "From solo operators to growing teams — same system, more leverage.",
              img: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1600&auto=format",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_50px_140px_rgba(0,0,0,.6)]"
            >
              <img
                src={item.img}
                className="h-[240px] w-full object-cover opacity-90"
              />
              <div className="p-10">
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-300">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ====== FEATURES ====== */}
      <section className="relative z-10 py-32 px-6 md:px-10">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-black">
            One System. Many Capabilities.
          </h2>
        </div>

        <div className="grid gap-10 md:grid-cols-3 max-w-7xl mx-auto">
          {[
            {
              title: "Content & Copy",
              text: "Posts, emails, ads and messaging that sound human and convert.",
            },
            {
              title: "Smart Communication",
              text: "Respond faster, cleaner and more confidently — every time.",
            },
            {
              title: "Execution Engine",
              text: "Plan, prioritize and move work forward without friction.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-3xl p-12 border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_40px_120px_rgba(0,0,0,.55)]"
            >
              <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                {f.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ====== FINAL CTA ====== */}
      <section className="relative z-10 py-40 text-center px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-6xl md:text-8xl font-black leading-tight">
            Work Smarter.
            <br />
            Stay Focused.
            <br />
            Execute Better.
          </h2>

          <p className="mt-10 text-xl text-gray-300">
            AutopilotAI is built to be useful — every single day.
          </p>

          <div className="mt-16">
            <a
              href="/register"
              className="px-20 py-8 rounded-2xl text-2xl font-black bg-gradient-to-r from-[#1c2f57] to-[#2b4e8d] shadow-[0_40px_160px_rgba(20,40,100,0.7)] hover:scale-[1.03] transition"
            >
              Get Started Free
            </a>
          </div>
        </motion.div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="border-t border-white/10 py-16 text-center relative z-10">
        <p className="text-gray-400 text-sm">
          © 2025 AutopilotAI — Built for people who actually build.
        </p>
      </footer>
    </div>
  );
}
