"use client";

import { motion } from "framer-motion";
import MarketingNavbar from "@/components/MarketingNavbar";
import {
  Sparkles,
  Globe,
  Zap,
  CheckCircle2,
  ArrowRight,
  Edit,
  Shield,
  Rocket,
  Users,
  Layers,
  Wand2,
} from "lucide-react";

/* -----------------------------
   MOTION SYSTEM
-------------------------------- */
// Motion variants - no 'as const' or type assertions needed

/* -----------------------------
   SHARED UI
-------------------------------- */
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-sm text-sm font-medium text-indigo-300">
      {children}
    </div>
  );
}

function PrimaryCTA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold text-lg overflow-hidden shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
    >
      <span className="relative z-10">{children}</span>
      <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </a>
  );
}

function SecondaryCTA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 backdrop-blur-xl font-semibold text-lg transition-all duration-300"
    >
      <span>{children}</span>
      <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform duration-300" />
    </a>
  );
}

/* -----------------------------
   PAGE
-------------------------------- */
export default function FeaturesPage() {
  return (
    <div className="min-h-screen text-white bg-[#0a0a0f] relative overflow-x-hidden">
      {/* Premium Background */}
      <div className="fixed inset-0 z-0">
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
          className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full blur-[120px] opacity-20"
          animate={{ 
            opacity: [0.15, 0.25, 0.18],
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.8) 0%, transparent 70%)",
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 right-1/4 h-[600px] w-[600px] rounded-full blur-[120px] opacity-15"
          animate={{ 
            opacity: [0.12, 0.22, 0.15],
            scale: [1, 1.15, 1.05],
            x: [0, -40, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{
            background: "radial-gradient(circle, rgba(168,85,247,0.6) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-20">
        <MarketingNavbar />
      </div>

      {/* HERO */}
      <section className="relative z-10 pt-24 md:pt-32 pb-20 px-6 md:px-10">
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-5xl mx-auto text-center"
        >
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <Pill>
              <Sparkles className="w-4 h-4" />
              <span>AI decides everything</span>
            </Pill>
            <Pill>
              <Globe className="w-4 h-4" />
              <span>Instant live website</span>
            </Pill>
            <Pill>
              <Zap className="w-4 h-4" />
              <span>One textbox</span>
            </Pill>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.02]">
            <span className="bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-transparent">
              A website builder
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
              that thinks for you
            </span>
          </h1>

          <p className="mt-8 text-lg md:text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            AutopilotAI generates a complete website from a single description —
            layout, structure, and real content included.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <PrimaryCTA href="/register">Start building</PrimaryCTA>
            <SecondaryCTA href="/upgrade">View pricing</SecondaryCTA>
          </div>
        </motion.div>
      </section>

      {/* CORE FEATURE */}
      <section className="relative z-10 px-6 md:px-10 py-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-sm mb-8">
              <Wand2 className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                Core Features
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-transparent">
                One prompt.
              </span>
              <br />
              <span className="bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-transparent">
                One website.
              </span>
            </h2>

            <p className="mt-6 text-xl text-gray-400 leading-relaxed">
              No templates. No setup. No decisions.
              Just describe your business and AutopilotAI does the rest.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "AI infers business type automatically",
                "Deterministic layout & structure",
                "Real starter copy (not lorem ipsum)",
                "Instant publish link",
                "Inline editing with autosave",
                "Mobile-ready by default",
              ].map((item, idx) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="flex items-start gap-3 group"
                >
                  <div className="mt-0.5 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 p-1 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  </div>
                  <span className="text-base md:text-lg text-gray-300">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative group"
          >
            {/* Glow effect */}
            <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
            
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl p-8 md:p-10 shadow-2xl">
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-300 mb-8">
                <Layers className="w-5 h-5" />
                <span>What AutopilotAI handles</span>
              </div>
              
              <div className="space-y-6">
                <FeatureMini
                  icon={<Globe className="w-5 h-5 text-indigo-400" />}
                  title="Website structure"
                  desc="Hero, sections, layout, theme and footer — generated deterministically."
                  gradient="from-indigo-500/20 to-indigo-500/5"
                />
                <FeatureMini
                  icon={<Edit className="w-5 h-5 text-purple-400" />}
                  title="Content generation"
                  desc="Headlines and sections tailored to your business and goal."
                  gradient="from-purple-500/20 to-purple-500/5"
                />
                <FeatureMini
                  icon={<Shield className="w-5 h-5 text-blue-400" />}
                  title="Editing & persistence"
                  desc="Edit directly on the site. Changes autosave instantly."
                  gradient="from-blue-500/20 to-blue-500/5"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="relative z-10 px-6 md:px-10 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-sm mb-8">
              <Users className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                Who It's For
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-transparent">
                Built for people who want
              </span>
              <br />
              <span className="text-gray-500">
                results — not tools
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Persona 
              icon={<Rocket className="w-6 h-6 text-indigo-400" />} 
              title="Founders"
              gradient="from-indigo-500/20 to-indigo-500/5"
              borderColor="border-indigo-500/30"
            >
              Launch fast without hiring designers or learning builders.
            </Persona>
            <Persona 
              icon={<Users className="w-6 h-6 text-purple-400" />} 
              title="Creators"
              gradient="from-purple-500/20 to-purple-500/5"
              borderColor="border-purple-500/30"
            >
              Get a clean, professional site without managing layouts.
            </Persona>
            <Persona 
              icon={<Zap className="w-6 h-6 text-blue-400" />} 
              title="Operators"
              gradient="from-blue-500/20 to-blue-500/5"
              borderColor="border-blue-500/30"
            >
              Ship sites quickly and focus on execution.
            </Persona>
          </div>
        </motion.div>
      </section>

      {/* FINAL CTA */}
      <section className="relative z-10 py-32 text-center px-6 md:px-10">
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight">
            <span className="bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-transparent">
              Describe it.
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Publish it.
            </span>
          </h2>

          <p className="mt-8 text-xl text-gray-400 leading-relaxed">
            AutopilotAI removes the friction between idea and live website.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <PrimaryCTA href="/register">Build your site</PrimaryCTA>
            <SecondaryCTA href="/upgrade">See pricing</SecondaryCTA>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-gradient-to-b from-transparent to-black/40 py-16 text-center relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-3">
            AutopilotAI
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} AutopilotAI — Websites built by AI.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* -----------------------------
   SUB COMPONENTS
-------------------------------- */
function FeatureMini({
  icon,
  title,
  desc,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  gradient: string;
}) {
  return (
    <div className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-white mb-1">{title}</div>
        <div className="text-sm text-gray-400 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}

function Persona({
  icon,
  title,
  children,
  gradient,
  borderColor,
}: {
  icon: React.ReactNode;
  title: string;
  children: string;
  gradient: string;
  borderColor: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl p-8 md:p-10 shadow-xl hover:border-white/20 transition-all duration-300"
    >
      <div className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <div className="relative">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} border ${borderColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
          {icon}
        </div>
        <h4 className="text-2xl font-bold text-white mb-4">{title}</h4>
        <p className="text-base md:text-lg text-gray-400 leading-relaxed">{children}</p>
      </div>
    </motion.div>
  );
}