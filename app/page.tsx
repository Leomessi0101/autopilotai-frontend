"use client";
import MarketingNavbar from "@/components/MarketingNavbar";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

/* =========================
   MOTION VARIANTS
========================= */
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
};

/* =========================
   REUSABLE COMPONENTS
========================= */
function PrimaryButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center gap-2.5 px-7 py-3.5 
        rounded-xl bg-white text-black font-medium text-base shadow-lg shadow-black/30 
        hover:bg-gray-100 transition-all duration-300 ${className}`}
    >
      {children}
      <ArrowRight className="w-4 h-4" />
    </motion.a>
  );
}

function SecondaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.12)" }}
      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl 
        border border-white/15 bg-white/5 backdrop-blur-sm text-white 
        font-medium text-base hover:border-white/30 transition-all duration-300"
    >
      {children}
    </motion.a>
  );
}

/* =========================
   MAIN PAGE
========================= */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#03050b] text-white overflow-x-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070d] via-[#03050b] to-black" />
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(ellipse_at_top_left,_#ffffff_0%,_transparent_50%),radial-gradient(ellipse_at_bottom_right,_#6366f1_0%,_transparent_60%)]" />
      </div>

      <div className="relative z-10">
        <MarketingNavbar />

        {/* HERO - Bigger & punchier */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-5 sm:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="max-w-5xl mx-auto text-center"
          >
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-medium text-indigo-300 tracking-wide uppercase">
                  AI-Powered Website Builder
                </span>
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.05] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-300"
            >
              Build beautiful websites
              <br />
              <span className="text-indigo-400">with AI superpowers</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-xl md:text-2xl text-gray-300/90 max-w-3xl mx-auto font-light"
            >
              Create, edit and grow your online presence — all with the help of AI.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col sm:flex-row gap-5 justify-center items-center"
            >
              <PrimaryButton href="/register">Create your website →</PrimaryButton>
              <SecondaryButton href="/features">Explore features</SecondaryButton>
            </motion.div>
          </motion.div>
        </section>

        {/* LIVE PREVIEW - Much bigger & more impressive */}
        <section className="px-5 sm:px-8 pb-32 md:pb-40">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9 }}
              className="relative"
            >
              <div className="absolute -inset-8 md:-inset-12 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent rounded-3xl blur-3xl opacity-60" />

              <div className="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/60">
                {/* Browser chrome */}
                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/10 bg-gradient-to-r from-black/80 to-black/60">
                  <div className="flex gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-red-500/80 shadow-sm" />
                    <div className="w-3.5 h-3.5 rounded-full bg-yellow-400/80 shadow-sm" />
                    <div className="w-3.5 h-3.5 rounded-full bg-green-500/80 shadow-sm" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-sm text-gray-400 font-medium">
                      autopilotai.dev/r/testrestaurant
                    </span>
                  </div>
                </div>

                {/* Preview window */}
                <div className="relative aspect-[4/3] md:aspect-[16/9] bg-black">
                  <iframe
                    src="/r/testrestaurant"
                    className="absolute inset-0 w-full h-full scale-[0.92] md:scale-[0.96] origin-top rounded-b-2xl pointer-events-none"
                    title="Live website preview"
                  />
                </div>
              </div>
            </motion.div>

            <div className="mt-6 text-center">
              <SecondaryButton href="https://www.autopilotai.dev/r/testrestaurant">
                Open live example <ExternalLink className="w-4 h-4 ml-1.5 opacity-70" />
              </SecondaryButton>
            </div>
          </div>
        </section>

        {/* SIMPLE CAPABILITIES - Cleaner & more elegant */}
        <section className="px-5 sm:px-8 pb-32">
          <div className="max-w-5xl mx-auto">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8 md:gap-12 text-center"
            >
              {[
                { title: "Instant live URL", value: "/r/your-name" },
                { title: "True in-place editing", value: "No dashboard needed" },
                { title: "Zero save button", value: "Everything auto-saves" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
                >
                  <div className="text-2xl md:text-3xl font-semibold text-white mb-3">
                    {item.title}
                  </div>
                  <div className="text-indigo-300/90 font-medium">{item.value}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FINAL CTA - More premium feeling */}
        <section className="px-5 sm:px-8 pb-40">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-b from-white/8 to-white/3 backdrop-blur-xl p-10 md:p-16 text-center shadow-2xl shadow-black/40"
          >
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Ready to launch your site?
            </h2>
            <p className="mt-5 text-xl text-gray-300 max-w-2xl mx-auto">
              Create beautiful websites with built-in AI content, email & advertising tools.
            </p>

            <div className="mt-10">
              <PrimaryButton href="/register" className="text-lg px-10 py-5">
                Start Building Now
              </PrimaryButton>
            </div>
          </motion.div>
        </section>

        {/* Minimal footer */}
        <footer className="border-t border-white/10 py-12 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} AutopilotAI • Made with AI + ❤️
        </footer>
      </div>
    </div>
  );
}