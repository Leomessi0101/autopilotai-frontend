"use client";

import { motion } from "framer-motion";
import MarketingNavbar from "@/components/MarketingNavbar";

export default function HomePage() {
  return (
    <div className="min-h-screen text-white overflow-x-hidden bg-[#04060d] relative">

      {/* global animated glow */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-20 w-[900px] h-[900px] bg-gradient-to-br from-purple-700 via-blue-500 to-pink-500 opacity-40 blur-[140px] rounded-full animate-pulse"/>
        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-gradient-to-tl from-blue-900 via-purple-700 to-pink-500 opacity-40 blur-[140px] rounded-full animate-[spin_25s_linear_infinite]"/>
      </div>

      {/* NAVBAR */}
      <div className="relative z-10">
        <MarketingNavbar />
      </div>

      {/* HERO */}
      <section className="relative z-10 text-center pt-32 pb-28 px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
            The AI Platform
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
              Built For Creators & Entrepreneurs
            </span>
          </h1>

          <p className="mt-8 text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Intelligent personas, powerful automation and a living user experience —
            AutopilotAI helps you scale without burning out.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
            <a
              href="/register"
              className="px-12 py-5 rounded-2xl bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 font-semibold text-lg shadow-[0_20px_60px_rgba(124,77,255,0.4)] hover:shadow-[0_25px_70px_rgba(124,77,255,0.7)] transition-all"
            >
              Get Started Free
            </a>

            <a
              href="/features"
              className="px-12 py-5 border border-white/20 hover:border-white/40 rounded-2xl text-lg font-semibold backdrop-blur-xl bg-white/5 hover:bg-white/10 transition-all"
            >
              Explore Platform
            </a>
          </div>

          <p className="mt-8 text-gray-400">
            Already trusted by 8,000+ creators & founders
          </p>
        </motion.div>

        {/* Persona image strip */}
        <div className="mt-20 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            "https://images.unsplash.com/photo-1590086782792-42dd2350140d",
            "https://images.unsplash.com/photo-1517841905240-472988babdf9",
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
          ].map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl overflow-hidden relative border border-white/10 shadow-xl hover:scale-[1.02] transition"
            >
              <img src={img} className="w-full h-[260px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black">
            A Living AI Experience
          </h2>
          <p className="text-gray-400 mt-6 text-xl max-w-3xl mx-auto">
            Not just tools. An evolving AI platform that feels alive, responsive and deeply human.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3 max-w-7xl mx-auto">
          {[
            {
              title: "AI Personas",
              text: "Teacher, Coach, Coder, Strategist — intelligent personalities built to help you.",
              img: "https://images.unsplash.com/photo-1531297484001-80022131f5a1"
            },
            {
              title: "Automation Brain",
              text: "Content, emails, growth systems and workflows handled automatically.",
              img: "https://images.unsplash.com/photo-1535223289827-42f1e9919769"
            },
            {
              title: "Creator Power",
              text: "Designed for entrepreneurs who want power, speed and professional results.",
              img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"
            }
          ].map((block, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8 hover:scale-[1.01] transition"
            >
              <img src={block.img} className="rounded-2xl mb-6 h-[220px] object-cover w-full"/>
              <h3 className="text-2xl font-bold">{block.title}</h3>
              <p className="text-gray-300 mt-3">{block.text}</p>
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
            Build Faster.
            <br />
            <span className="text-purple-400">Scale Smarter.</span>
          </h2>

          <p className="mt-8 text-xl text-gray-300">
            Your AI platform for growth, creativity and execution.
          </p>

          <div className="mt-12">
            <a
              href="/register"
              className="px-16 py-7 rounded-2xl text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 shadow-[0_35px_120px_rgba(124,77,255,0.6)] hover:scale-[1.02] transition"
            >
              Get Started Free
            </a>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-16 text-center relative z-10">
        <p className="text-gray-400 text-sm">
          © 2025 AutopilotAI — Built for ambitious people who want more.
        </p>
      </footer>
    </div>
  );
}
