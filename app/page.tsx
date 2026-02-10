"use client";

import MarketingNavbar from "@/components/MarketingNavbar";
import Image from "next/image";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ExternalLink,
  Shield,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";

/* =========================
   MOTION VARIANTS
========================= */
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
};

const softSpring = { type: "spring", stiffness: 260, damping: 26 } as const;

/* =========================
   FAQ DATA
========================= */
const FAQS = [
  {
    q: "Can i test it for free?",
    a: "Yes. Free users can test but cannot publish, publishing is only for paid users.",
  },
  {
    q: "How fast is it?",
    a: "Usually minutes. You go from one text box → a published website you can edit instantly.",
  },
  {
    q: "Can I edit the site after it's generated?",
    a: "Yes. You can edit text inline and changes autosave. No complicated editors.",
  },
  {
    q: "Do i need to have any skills?",
    a: "No. AutopilotAI is made so anyone can make a website, simply describe your business and get a page.",
  },
  {
    q: "Can I connect my own domain?",
    a: "Yes — domain connection is coming soon. For now, you get an instant shareable link.",
  },
];

/* =========================
   UI HELPERS
========================= */
function classNames(...v: Array<string | false | undefined | null>) {
  return v.filter(Boolean).join(" ");
}

/* =========================
   MAIN PAGE
========================= */
export default function HomePage() {
  const [description, setDescription] = useState("");
  const [username, setUsername] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [hideHeroMedia, setHideHeroMedia] = useState(false);

  const canGenerate = useMemo(() => {
    return description.trim().length > 0 && username.trim().length > 0;
  }, [description, username]);

  function handleGenerate() {
    window.location.href = "/register";
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* =========================
         PREMIUM BACKGROUND
      ========================= */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d14] via-[#0a0a0f] to-black" />

        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />

        {/* Animated gradient orbs */}
        <motion.div
          aria-hidden
          className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full blur-[120px] opacity-20"
          initial={{ opacity: 0.15 }}
          animate={{ 
            opacity: [0.15, 0.25, 0.18],
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.8) 0%, transparent 70%)",
          }}
        />
        
        <motion.div
          aria-hidden
          className="absolute bottom-0 right-1/4 h-[700px] w-[700px] rounded-full blur-[120px] opacity-15"
          initial={{ opacity: 0.12 }}
          animate={{ 
            opacity: [0.12, 0.22, 0.15],
            scale: [1, 1.15, 1.05],
            x: [0, -40, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{
            background: "radial-gradient(circle, rgba(168,85,247,0.6) 0%, transparent 70%)",
          }}
        />

        <motion.div
          aria-hidden
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full blur-[100px] opacity-10"
          initial={{ opacity: 0.08 }}
          animate={{ 
            opacity: [0.08, 0.15, 0.1],
            scale: [1, 1.2, 1.1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)",
          }}
        />

        {/* Subtle noise texture */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="relative z-10">
        <MarketingNavbar />

        {/* =========================
           HERO SECTION
        ========================= */}
        <section className="pt-20 sm:pt-28 pb-12 sm:pb-16 px-5 sm:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="max-w-7xl mx-auto"
          >
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Copy */}
              <div className="text-left">
                <motion.div variants={fadeUp}>
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-sm shadow-lg shadow-indigo-500/5">
                    <div className="relative">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <div className="absolute inset-0 blur-md bg-indigo-400/50" />
                    </div>
                    <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                      AI-First Builder
                    </span>
                    <div className="w-1 h-1 rounded-full bg-indigo-400/50" />
                    <span className="text-xs text-gray-400 font-medium">One prompt. Done.</span>
                  </div>
                </motion.div>

                <motion.h1
                  variants={fadeUp}
                  className="mt-8 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.02]"
                >
                  <span className="bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-transparent">
                    Describe your
                  </span>
                  <br />
                  <span className="bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-transparent">
                    business.
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
                    Get a website.
                  </span>
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  className="mt-7 text-lg sm:text-xl text-gray-400 max-w-xl leading-relaxed"
                >
                  AutopilotAI generates a complete, publish-ready site from a single
                  description — layout, structure, and real starter content included.
                </motion.p>

                {/* Feature bullets */}
                <motion.div variants={fadeUp} className="mt-8 space-y-3.5">
                  {[
                    { text: "No templates. No setup. No choices.", icon: Check },
                    { text: "Instant publish link. Edit inline. Autosave.", icon: Check },
                    { text: "Built for speed and conversion, not complexity.", icon: Check },
                  ].map((item) => (
                    <div key={item.text} className="flex items-start gap-3 group">
                      <div className="mt-0.5 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 p-1.5 group-hover:scale-110 transition-transform duration-300">
                        <item.icon className="w-3.5 h-3.5 text-indigo-300" />
                      </div>
                      <span className="text-sm sm:text-base text-gray-300 leading-relaxed">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </motion.div>

                {/* CTA buttons */}
                <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row gap-3.5">
                  <a
                    href="/register"
                    className="group relative inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold px-8 py-4 overflow-hidden shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="relative z-10">Start free trial</span>
                    <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                  
                  <a
                    href="#demo"
                    className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold px-8 py-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <span>View live demo</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </a>
                  
                  <a
                    href="/pricing"
                    className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-transparent border border-white/10 text-gray-300 font-semibold px-8 py-4 hover:bg-white/5 hover:border-white/20 transition-all duration-300"
                  >
                    <span>Pricing</span>
                    <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                </motion.div>

                <motion.div variants={fadeUp} className="mt-5 flex items-center gap-2 text-xs text-gray-600">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Paid users can generate & publish. One website per user.</span>
                </motion.div>
              </div>

              {/* Right: Interactive Generator Card */}
              <motion.div variants={scaleIn} className="relative lg:mt-0">
                {/* Glow effect behind card */}
                <div className="absolute -inset-8 rounded-[32px] bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl opacity-60" />
                
                <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl shadow-2xl overflow-hidden">
                  {/* Browser chrome */}
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-black/30 backdrop-blur-sm">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/90 shadow-lg shadow-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400/90 shadow-lg shadow-yellow-400/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/90 shadow-lg shadow-green-500/50" />
                    </div>
                    <div className="flex-1 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-green-400/80" />
                        <span className="text-xs text-gray-400 font-mono">autopilotai.dev</span>
                      </div>
                    </div>
                  </div>

                  {/* Generator interface */}
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-2.5 mb-5">
                      <div className="rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 p-2.5">
                        <Wand2 className="w-5 h-5 text-indigo-300" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">AI Website Generator</div>
                        <div className="text-xs text-gray-500">One prompt → full website</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Business description */}
                      <div className="group">
                        <label className="block text-xs font-medium text-gray-400 mb-2">
                          Describe your business
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="e.g. A modern burger restaurant in Stockholm focused on delivery and takeaway"
                          rows={4}
                          className="w-full resize-none rounded-2xl bg-black/40 border border-white/10 px-5 py-4 text-sm text-white placeholder:text-gray-600 outline-none focus:border-indigo-500/50 focus:bg-black/60 transition-all duration-300 shadow-inner"
                        />
                      </div>

                      {/* Username input */}
                      <div className="group">
                        <label className="block text-xs font-medium text-gray-400 mb-2">
                          Choose your URL
                        </label>
                        <div className="rounded-2xl bg-black/40 border border-white/10 px-5 py-4 focus-within:border-indigo-500/50 focus-within:bg-black/60 transition-all duration-300 shadow-inner">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-mono">autopilotai.dev/r/</span>
                            <input
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              placeholder="yourbrand"
                              className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-gray-600 font-mono"
                            />
                          </div>
                          <div className="mt-2 text-[11px] text-gray-600">
                            Custom domain support coming soon
                          </div>
                        </div>
                      </div>

                      {/* Generate button */}
                      <button
                        onClick={handleGenerate}
                        disabled={!canGenerate}
                        className={classNames(
                          "group relative w-full inline-flex items-center justify-center gap-2.5 rounded-2xl font-semibold px-6 py-4 transition-all duration-300 overflow-hidden",
                          canGenerate
                            ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
                            : "bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed"
                        )}
                      >
                        <span className="relative z-10">Generate website</span>
                        <ArrowRight className={classNames(
                          "relative z-10 w-5 h-5 transition-transform duration-300",
                          canGenerate && "group-hover:translate-x-1"
                        )} />
                        {canGenerate && (
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        )}
                      </button>
                    </div>

                    {/* Bottom stats */}
                    <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Zap className="w-4 h-4 text-indigo-400/80" />
                        <span>Instant deploy</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Shield className="w-4 h-4 text-indigo-400/80" />
                        <span>AI-powered</span>
                      </div>
                    </div>
                  </div>

                  {/* Optional background effects */}
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 opacity-[0.08]">
                      <Image
                        src="/hero-bg.jpg"
                        alt=""
                        fill
                        priority={false}
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-transparent to-[#0a0a0f]" />
                  </div>

                  {!hideHeroMedia && (
                    <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-screen">
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                        onError={() => setHideHeroMedia(true)}
                      >
                        <source src="/hero-loop.webm" type="video/webm" />
                        <source src="/hero-loop.mp4" type="video/mp4" />
                      </video>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
              variants={fadeUp}
              className="mt-16 flex items-center justify-center"
            >
              <a
                href="#how"
                className="group inline-flex flex-col items-center gap-2 text-gray-600 hover:text-gray-400 transition-colors duration-300"
              >
                <span className="text-xs font-medium uppercase tracking-wider">See how it works</span>
                <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* =========================
           TRUST STRIP
        ========================= */}
        <section className="px-5 sm:px-8 pb-10">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl p-6 sm:p-8 shadow-xl">
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: <Sparkles className="w-6 h-6 text-indigo-400" />,
                    title: "AI does the thinking",
                    desc: "AutopilotAI infers business type + goal automatically.",
                  },
                  {
                    icon: <Wand2 className="w-6 h-6 text-purple-400" />,
                    title: "Deterministic structure",
                    desc: "Same prompt → same site. Clean, consistent results.",
                  },
                  {
                    icon: <Zap className="w-6 h-6 text-blue-400" />,
                    title: "Instant publish + edit",
                    desc: "Live site immediately. Edit inline and autosave.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="group rounded-2xl border border-white/10 bg-gradient-to-br from-black/40 to-black/20 p-5 hover:border-white/20 hover:bg-gradient-to-br hover:from-black/60 hover:to-black/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-2.5 group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <div className="font-semibold text-white">{item.title}</div>
                    </div>
                    <div className="text-sm text-gray-400 leading-relaxed">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================
           HOW IT WORKS
        ========================= */}
        <section id="how" className="px-5 sm:px-8 pt-20 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-sm mb-6">
                <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                  How it works
                </span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-transparent">
                  One prompt. One click.
                </span>
                <br />
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Live website.
                </span>
              </h2>
              
              <p className="mt-6 text-lg text-gray-400 leading-relaxed">
                AutopilotAI is built to feel effortless — because the AI handles the decisions.
              </p>
            </div>

            <div className="mt-14 grid lg:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  title: "Describe your business",
                  desc: "Tell us what you do, where you are, and what you want the site to achieve.",
                  color: "from-indigo-500/20 to-indigo-500/5",
                  borderColor: "border-indigo-500/30",
                },
                {
                  step: "02",
                  title: "AI builds the whole site",
                  desc: "Layout, sections, styling, and real starter copy — generated automatically.",
                  color: "from-purple-500/20 to-purple-500/5",
                  borderColor: "border-purple-500/30",
                },
                {
                  step: "03",
                  title: "Publish + edit instantly",
                  desc: "Your site goes live right away. Edit text inline and autosave updates.",
                  color: "from-blue-500/20 to-blue-500/5",
                  borderColor: "border-blue-500/30",
                },
              ].map((item, idx) => (
                <div
                  key={item.step}
                  className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl p-8 hover:border-white/20 transition-all duration-300"
                >
                  <div className="absolute -inset-px rounded-3xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(to bottom right, ${item.color})` }} />
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} border ${item.borderColor} text-lg font-bold text-white shadow-lg`}>
                        {idx + 1}
                      </div>
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.color} border ${item.borderColor} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center gap-4 flex-col sm:flex-row">
              <a
                href="/register"
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold px-8 py-4 overflow-hidden shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10">Start building</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
              
              <a
                href="/pricing"
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold px-8 py-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <span>See pricing</span>
                <ArrowRight className="w-4 h-4 opacity-60" />
              </a>
            </div>
          </div>
        </section>

        {/* =========================
           DEMO PREVIEW
        ========================= */}
        <section id="demo" className="px-5 sm:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-sm mb-6">
                <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                  Live Demo
                </span>
              </div>
              
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                <span className="bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-transparent">
                  See what AutopilotAI generates
                </span>
              </h3>
              
              <p className="mt-4 text-sm text-gray-500">
                This is a real generated site preview — built by AI in seconds.
              </p>
            </div>

            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-6 rounded-[36px] bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
              
              <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl overflow-hidden shadow-2xl">
                {/* Browser chrome */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-sm">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/90 shadow-lg shadow-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/90 shadow-lg shadow-yellow-400/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/90 shadow-lg shadow-green-500/50" />
                  </div>
                  <div className="flex-1 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                      <div className="w-2 h-2 rounded-full bg-green-400/80" />
                      <span className="text-xs text-gray-400 font-mono">autopilotai.dev/r/testrestaurant</span>
                    </div>
                  </div>
                </div>

                {/* Demo iframe */}
                <div className="relative aspect-[16/9] bg-black">
                  <iframe
                    src="/r/testrestaurant"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    title="AI generated website preview"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <a
                href="/r/testrestaurant"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 text-sm text-indigo-300 hover:text-indigo-200 transition-colors duration-300"
              >
                <span>Open live example</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </section>

        {/* =========================
           FEATURES GRID
        ========================= */}
        <section className="px-5 sm:px-8 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-sm mb-6">
                <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                  Features
                </span>
              </div>
              
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                <span className="bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-transparent">
                  Everything you need
                </span>
                <br />
                <span className="text-gray-500">
                  without the builder headache
                </span>
              </h3>
              
              <p className="mt-4 text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
                AutopilotAI is for people who want a great website, not another project.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: <Wand2 className="w-6 h-6 text-indigo-400" />,
                  title: "AI-generated structure",
                  desc: "AutopilotAI creates a clean layout optimized for your business type and goal.",
                  gradient: "from-indigo-500/20 to-indigo-500/5",
                  border: "border-indigo-500/30",
                },
                {
                  icon: <Sparkles className="w-6 h-6 text-purple-400" />,
                  title: "Real starter content",
                  desc: "Headlines, sections, and copy that actually fits your business — not lorem ipsum.",
                  gradient: "from-purple-500/20 to-purple-500/5",
                  border: "border-purple-500/30",
                },
                {
                  icon: <Zap className="w-6 h-6 text-blue-400" />,
                  title: "Instant publish link",
                  desc: "Your website is live immediately. Share it right away.",
                  gradient: "from-blue-500/20 to-blue-500/5",
                  border: "border-blue-500/30",
                },
                {
                  icon: <Shield className="w-6 h-6 text-cyan-400" />,
                  title: "Inline editing + autosave",
                  desc: "Edit directly on the page. Your changes save automatically.",
                  gradient: "from-cyan-500/20 to-cyan-500/5",
                  border: "border-cyan-500/30",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl p-8 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className={`rounded-2xl bg-gradient-to-br ${feature.gradient} border ${feature.border} p-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <a
                href="/features"
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-transparent border border-white/10 text-gray-300 font-semibold px-8 py-4 hover:bg-white/5 hover:border-white/20 transition-all duration-300"
              >
                <span>Explore all features</span>
                <ArrowRight className="w-4 h-4 opacity-60" />
              </a>
            </div>
          </div>
        </section>

        {/* =========================
           FAQ
        ========================= */}
        <section className="px-5 sm:px-8 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-sm mb-6">
                <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                  FAQ
                </span>
              </div>
              
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
                <span className="bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-transparent">
                  Questions, answered
                </span>
              </h3>
              
              <p className="mt-4 text-sm text-gray-500">
                If you want it to feel simple — you're in the right place.
              </p>
            </div>

            <div className="space-y-4">
              {FAQS.map((item, idx) => {
                const open = openFaq === idx;
                return (
                  <div
                    key={item.q}
                    className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl overflow-hidden hover:border-white/20 transition-all duration-300"
                  >
                    <button
                      onClick={() => setOpenFaq(open ? null : idx)}
                      className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors duration-300"
                    >
                      <span className="font-semibold text-white">{item.q}</span>
                      <motion.span
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={softSpring}
                        className="flex-shrink-0"
                      >
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </motion.span>
                    </button>
                    <motion.div
                      initial={false}
                      animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-sm text-gray-400 leading-relaxed">
                        {item.a}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 flex justify-center">
              <a
                href="/register"
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold px-8 py-4 overflow-hidden shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10">Start building</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            </div>
          </div>
        </section>

        {/* =========================
           FOOTER
        ========================= */}
        <footer className="border-t border-white/10 bg-gradient-to-b from-transparent to-black/40">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mb-12">
              <div className="max-w-xs">
                <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-3">
                  AutopilotAI
                </div>
                <div className="text-sm text-gray-500 leading-relaxed">
                  Professional websites generated from one simple description. Built for speed, designed for results.
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
                {[
                  { label: "Pricing", href: "/pricing" },
                  { label: "Features", href: "/features" },
                  { label: "Log in", href: "/login" },
                  { label: "Get started", href: "/register" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-gray-600">
              <div>© {new Date().getFullYear()} AutopilotAI. All rights reserved.</div>
              <div className="flex items-center gap-6">
                <a href="/privacy" className="hover:text-gray-400 transition-colors duration-300">
                  Privacy Policy
                </a>
                <a href="/terms" className="hover:text-gray-400 transition-colors duration-300">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}