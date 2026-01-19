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
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
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
    q: "Can I edit the site after it’s generated?",
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

  // Optional: if you add a hero looping video later (public/hero-loop.webm or .mp4)
  const [hideHeroMedia, setHideHeroMedia] = useState(false);

  const canGenerate = useMemo(() => {
    return description.trim().length > 0 && username.trim().length > 0;
  }, [description, username]);

  function handleGenerate() {
    // Public homepage → we nudge signup. The dashboard flow remains the real creation flow.
    // (We keep auth/routing intact by not changing any existing logic or APIs.)
    window.location.href = "/register";
  }

  return (
    <div className="min-h-screen bg-[#03050b] text-white overflow-x-hidden">
      {/* =========================
         BACKGROUND (premium + animated)
      ========================= */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070d] via-[#03050b] to-black" />

        {/* Subtle mesh */}
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(ellipse_at_top_left,_#ffffff_0%,_transparent_50%),radial-gradient(ellipse_at_bottom_right,_#6366f1_0%,_transparent_60%)]" />

        {/* Animated glow blobs */}
        <motion.div
          aria-hidden
          className="absolute -top-24 -left-24 h-[520px] w-[520px] rounded-full blur-3xl opacity-[0.18]"
          initial={{ scale: 0.95, opacity: 0.14 }}
          animate={{ scale: [0.95, 1.05, 0.98], opacity: [0.14, 0.2, 0.16] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(99,102,241,0.95), transparent 55%)",
          }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-28 -right-28 h-[560px] w-[560px] rounded-full blur-3xl opacity-[0.14]"
          initial={{ scale: 1.02, opacity: 0.12 }}
          animate={{ scale: [1.02, 0.98, 1.06], opacity: [0.12, 0.18, 0.13] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(circle at 60% 60%, rgba(255,255,255,0.75), transparent 58%)",
          }}
        />

        {/* Grain/noise overlay */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="relative z-10">
        <MarketingNavbar />

        {/* =========================
           HERO
        ========================= */}
        <section className="pt-28 sm:pt-32 pb-16 sm:pb-20 px-5 sm:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="max-w-6xl mx-auto"
          >
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
              {/* Left */}
              <div className="text-left">
                <motion.div variants={fadeUp}>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-medium text-indigo-300 uppercase tracking-wide">
                      AI-first website builder
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-300">One textbox. Done.</span>
                  </div>
                </motion.div>

                <motion.h1
                  variants={fadeUp}
                  className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05]"
                >
                  Describe your business.
                  <br />
                  <span className="text-indigo-400">Get a website.</span>
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  className="mt-6 text-lg sm:text-xl text-gray-300/90 max-w-xl"
                >
                  AutopilotAI generates a complete, publish-ready site from a single
                  description — layout, structure, and real starter content included.
                </motion.p>

                {/* Mini bullets (simple sells) */}
                <motion.div variants={fadeUp} className="mt-7 grid gap-3">
                  {[
                    "No templates. No setup. No choices.",
                    "Instant publish link. Edit inline. Autosave.",
                    "Built for speed and conversion, not complexity.",
                  ].map((t) => (
                    <div key={t} className="flex items-start gap-2 text-sm text-gray-300">
                      <div className="mt-0.5 rounded-full bg-white/5 border border-white/10 p-1">
                        <Check className="w-3.5 h-3.5 text-indigo-300" />
                      </div>
                      <span>{t}</span>
                    </div>
                  ))}
                </motion.div>

                {/* CTA row */}
                <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row gap-3">
                  <a
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-black font-medium px-6 py-3 hover:bg-gray-100 transition"
                  >
                    Start free trial
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="#demo"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 text-white font-medium px-6 py-3 hover:bg-white/10 transition"
                  >
                    View live demo
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href="/pricing"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-transparent border border-white/10 text-gray-200 font-medium px-6 py-3 hover:bg-white/5 transition"
                  >
                    Pricing
                    <ArrowRight className="w-4 h-4 opacity-70" />
                  </a>
                </motion.div>

                <motion.div variants={fadeUp} className="mt-4 text-xs text-gray-500">
                  Paid users can generate & publish their website. One website per user.
                </motion.div>
              </div>

              {/* Right: Hero media + “simple box” */}
              <motion.div variants={fadeIn} className="relative">
                {/* Decorative frame */}
                <div className="absolute -inset-6 rounded-[28px] bg-gradient-to-br from-white/10 via-white/0 to-indigo-500/10 blur-2xl opacity-80" />
                <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
                  {/* Header bar */}
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-black/30">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex-1 text-center text-sm text-gray-400">
                      AutopilotAI Generator
                    </div>
                  </div>

                  {/* “One textbox” generator card */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-2 text-sm text-indigo-300 mb-3">
                      <Wand2 className="w-4 h-4" />
                      One prompt → full website
                    </div>

                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g. A modern burger restaurant in Stockholm focused on delivery and takeaway"
                      rows={4}
                      className="w-full resize-none rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-400 outline-none focus:border-indigo-500/50"
                    />

                    <div className="mt-4 grid sm:grid-cols-2 gap-3">
                      <div className="rounded-xl bg-black/40 border border-white/10 px-4 py-3">
                        <div className="text-xs text-gray-400 mb-1">Website username</div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">autopilotai.dev/r/</span>
                          <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="yourbrand"
                            className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-gray-500"
                          />
                        </div>
                        <div className="mt-1 text-[11px] text-gray-500">
                          Connect your domain (coming soon)
                        </div>
                      </div>

                      <button
                        onClick={handleGenerate}
                        disabled={!canGenerate}
                        className={classNames(
                          "inline-flex items-center justify-center gap-2 rounded-xl font-medium px-5 py-3 transition",
                          canGenerate
                            ? "bg-white text-black hover:bg-gray-100"
                            : "bg-white/10 text-gray-400 border border-white/10 cursor-not-allowed"
                        )}
                      >
                        Generate website
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-4 text-xs text-gray-500">
                      <div className="inline-flex items-center gap-2">
                        <Zap className="w-4 h-4 text-indigo-300/80" />
                        <span>Simple by default</span>
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <Shield className="w-4 h-4 text-indigo-300/80" />
                        <span>Built for paid users</span>
                      </div>
                    </div>
                  </div>

                  {/* Background image / gif layer (optional) */}
                  {/* If you add images later: put in /public/hero-bg.jpg or /public/hero-bg.png */}
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 opacity-[0.18]">
                      <Image
                        src="/hero-bg.jpg"
                        alt=""
                        fill
                        priority={false}
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#03050b] via-transparent to-[#03050b]" />
                    <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] bg-indigo-500/10" />
                  </div>

                  {/* Optional moving media (drop a file into /public/hero-loop.webm or /public/hero-loop.mp4) */}
                  {!hideHeroMedia && (
                    <div className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-screen">
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

            {/* Scroll hint */}
            <motion.div
              variants={fadeUp}
              className="mt-14 flex items-center justify-center text-gray-500"
            >
              <a
                href="#how"
                className="inline-flex items-center gap-2 text-xs hover:text-gray-300 transition"
              >
                See how it works
                <ChevronDown className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* =========================
           TRUST / STRIP
        ========================= */}
        <section className="px-5 sm:px-8 pb-6">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 sm:p-6">
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    icon: <Sparkles className="w-5 h-5 text-indigo-300" />,
                    title: "AI does the thinking",
                    desc: "AutopilotAI infers business type + goal automatically.",
                  },
                  {
                    icon: <Wand2 className="w-5 h-5 text-indigo-300" />,
                    title: "Deterministic structure",
                    desc: "Same prompt → same site. Clean, consistent results.",
                  },
                  {
                    icon: <Zap className="w-5 h-5 text-indigo-300" />,
                    title: "Instant publish + edit",
                    desc: "Live site immediately. Edit inline and autosave.",
                  },
                ].map((c) => (
                  <div
                    key={c.title}
                    className="rounded-xl border border-white/10 bg-black/30 p-4"
                  >
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-white/5 border border-white/10 p-2">
                        {c.icon}
                      </div>
                      <div className="font-medium">{c.title}</div>
                    </div>
                    <div className="mt-2 text-sm text-gray-400">{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================
           HOW IT WORKS
        ========================= */}
        <section id="how" className="px-5 sm:px-8 pt-12 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-indigo-300">
                How it works
              </div>
              <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
                One prompt. One click. Live website.
              </h2>
              <p className="mt-4 text-gray-300/90 max-w-2xl mx-auto">
                AutopilotAI is built to feel effortless — because the AI handles the decisions.
              </p>
            </div>

            <div className="mt-10 grid lg:grid-cols-3 gap-4">
              {[
                {
                  step: "01",
                  title: "Describe your business",
                  desc: "Tell us what you do, where you are, and what you want the site to achieve.",
                },
                {
                  step: "02",
                  title: "AI builds the whole site",
                  desc: "Layout, sections, styling, and real starter copy — generated automatically.",
                },
                {
                  step: "03",
                  title: "Publish + edit instantly",
                  desc: "Your site goes live right away. Edit text inline and autosave updates.",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-indigo-300 text-sm font-semibold">{s.step}</div>
                    <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10" />
                  </div>
                  <div className="mt-4 text-lg font-medium">{s.title}</div>
                  <div className="mt-2 text-sm text-gray-400">{s.desc}</div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center gap-3 flex-col sm:flex-row">
              <a
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-black font-medium px-6 py-3 hover:bg-gray-100 transition"
              >
                Start building
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 text-white font-medium px-6 py-3 hover:bg-white/10 transition"
              >
                See pricing
                <ArrowRight className="w-4 h-4 opacity-70" />
              </a>
            </div>
          </div>
        </section>

        {/* =========================
           DEMO PREVIEW
        ========================= */}
        <section id="demo" className="px-5 sm:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 text-center">
              <div className="text-xs uppercase tracking-wider text-indigo-300">
                Live demo
              </div>
              <h3 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
                See what AutopilotAI generates
              </h3>
              <p className="mt-3 text-sm text-gray-400">
                This is a real generated site preview.
              </p>
            </div>

            <div className="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden shadow-2xl">
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/10 bg-black/60">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center text-sm text-gray-400">
                  /r/testrestaurant
                </div>
              </div>

              <div className="relative aspect-[16/9] bg-black">
                <iframe
                  src="/r/testrestaurant"
                  className="absolute inset-0 w-full h-full scale-[0.96] origin-top pointer-events-none"
                  title="AI generated website preview"
                />
              </div>
            </div>

            <div className="mt-6 text-center">
              <a
                href="/r/testrestaurant"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-indigo-300 hover:text-indigo-200"
              >
                Open live example <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* =========================
           FEATURES GRID
        ========================= */}
        <section className="px-5 sm:px-8 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-indigo-300">
                Built to feel simple
              </div>
              <h3 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
                Everything you need — without the builder headache
              </h3>
              <p className="mt-3 text-sm text-gray-400 max-w-2xl mx-auto">
                AutopilotAI is for people who want a great website, not another project.
              </p>
            </div>

            <div className="mt-10 grid md:grid-cols-2 gap-4">
              {[
                {
                  icon: <Wand2 className="w-5 h-5 text-indigo-300" />,
                  title: "AI-generated structure",
                  desc: "AutopilotAI creates a clean layout optimized for your business type and goal.",
                },
                {
                  icon: <Sparkles className="w-5 h-5 text-indigo-300" />,
                  title: "Real starter content",
                  desc: "Headlines, sections, and copy that actually fits your business — not lorem ipsum.",
                },
                {
                  icon: <Zap className="w-5 h-5 text-indigo-300" />,
                  title: "Instant publish link",
                  desc: "Your website is live immediately. Share it right away.",
                },
                {
                  icon: <Shield className="w-5 h-5 text-indigo-300" />,
                  title: "Inline editing + autosave",
                  desc: "Edit directly on the page. Your changes save automatically.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-white/5 border border-white/10 p-2">
                      {f.icon}
                    </div>
                    <div className="text-lg font-medium">{f.title}</div>
                  </div>
                  <div className="mt-2 text-sm text-gray-400">{f.desc}</div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <a
                href="/features"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-transparent border border-white/10 text-gray-200 font-medium px-6 py-3 hover:bg-white/5 transition"
              >
                Explore features
                <ArrowRight className="w-4 h-4 opacity-70" />
              </a>
            </div>
          </div>
        </section>

        {/* =========================
           FAQ
        ========================= */}
        <section className="px-5 sm:px-8 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-indigo-300">
                FAQ
              </div>
              <h3 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
                Questions, answered
              </h3>
              <p className="mt-3 text-sm text-gray-400">
                If you want it to feel simple — you’re in the right place.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              {FAQS.map((item, idx) => {
                const open = openFaq === idx;
                return (
                  <div
                    key={item.q}
                    className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(open ? null : idx)}
                      className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-white/5 transition"
                    >
                      <span className="font-medium">{item.q}</span>
                      <motion.span
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={softSpring}
                        className="text-gray-400"
                      >
                        <ChevronDown className="w-5 h-5" />
                      </motion.span>
                    </button>
                    <motion.div
                      initial={false}
                      animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="px-5 overflow-hidden"
                    >
                      <div className="pb-4 text-sm text-gray-400">{item.a}</div>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex justify-center">
              <a
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-black font-medium px-6 py-3 hover:bg-gray-100 transition"
              >
                Start building
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* =========================
           FOOTER
        ========================= */}
        <footer className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div>
                <div className="text-white font-semibold tracking-tight">
                  AutopilotAI
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Websites generated from one simple description.
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <a href="/pricing" className="text-gray-400 hover:text-gray-200 transition">
                  Pricing
                </a>
                <a href="/features" className="text-gray-400 hover:text-gray-200 transition">
                  Features
                </a>
                <a href="/login" className="text-gray-400 hover:text-gray-200 transition">
                  Log in
                </a>
                <a href="/register" className="text-gray-400 hover:text-gray-200 transition">
                  Get started
                </a>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-600">
              <div>© {new Date().getFullYear()} AutopilotAI. All rights reserved.</div>
              <div className="flex items-center gap-4">
                <a href="/privacy" className="hover:text-gray-400 transition">
                  Privacy
                </a>
                <a href="/terms" className="hover:text-gray-400 transition">
                  Terms
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
