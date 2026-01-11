"use client";

import { motion, AnimatePresence } from "framer-motion";
import MarketingNavbar from "@/components/MarketingNavbar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Wand2,
  Mail,
  Megaphone,
  Layers,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Stars,
  Rocket,
  Target,
  LineChart,
  Globe,
  Edit3,
  Smartphone,
  LayoutDashboard,
  Link2,
  MousePointerClick,
  Gauge,
  Palette,
  Image as ImageIcon,
  Lock,
  BadgeCheck,
  ChevronDown,
  ExternalLink,
  Play,
  Search,
  Building2,
  Utensils,
  Workflow,
  FileText,
  Users,
  ChevronRight,
  Braces,
  Sparkle,
} from "lucide-react";

/* =========================================================
   THEME / MOTION
========================================================= */

const COLORS = {
  bg: "#05070d",
  blueA: "#0c1a39",
  blueB: "#0a1630",
  blueC: "#0d1b3d",
  ink: "#111a2c",
  accent: "#6d8ce8",
  accent2: "#2b4e8d",
  text: "#ffffff",
  muted: "rgba(255,255,255,0.65)",
};

const springy = {
  type: "spring" as const,
  stiffness: 120,
  damping: 18,
  mass: 0.65,
};

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
};

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
};

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

/* =========================================================
   SMALL UI PRIMITIVES
========================================================= */

function GlowDivider({ tight }: { tight?: boolean }) {
  return (
    <div className={cx("relative", tight ? "my-14 md:my-18" : "my-18 md:my-26")}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-px w-[92%] md:w-[78%] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full bg-[#6d8ce8]/15 blur-2xl" />
      </div>
      <div className="h-1" />
    </div>
  );
}

function Pill({
  children,
  subtle,
}: {
  children: React.ReactNode;
  subtle?: boolean;
}) {
  return (
    <div
      className={cx(
        "px-4 py-2 rounded-full border backdrop-blur-xl text-sm flex items-center gap-2",
        subtle
          ? "border-white/10 bg-white/5 text-gray-200"
          : "border-white/12 bg-white/6 text-gray-100"
      )}
    >
      {children}
    </div>
  );
}

function PrimaryCTA({
  href,
  children,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="group inline-flex items-center justify-center gap-3 px-7 md:px-9 py-4 rounded-2xl bg-gradient-to-r from-[#203b6a] to-[#345899] font-semibold text-base md:text-lg hover:scale-[1.02] transition shadow-[0_20px_80px_rgba(15,35,85,0.62)] border border-white/10"
    >
      <span>{children}</span>
      {icon ? (
        <span className="opacity-90">{icon}</span>
      ) : (
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
      )}
    </a>
  );
}

function SecondaryCTA({
  href,
  children,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center gap-2 px-7 md:px-9 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-xl font-semibold text-base md:text-lg transition"
    >
      {children}
      {icon ? icon : <ArrowRight className="w-5 h-5 opacity-70" />}
    </a>
  );
}

function SoftCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_50px_140px_rgba(0,0,0,.6)]",
        className
      )}
    >
      {children}
    </div>
  );
}

function IconBadge({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="text-white font-semibold">{title}</div>
        <div className="text-sm text-white/60 mt-1">{subtitle}</div>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-5 flex items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <div className="text-sm text-white/60">{label}</div>
          <div className="text-lg font-semibold text-white mt-0.5">{value}</div>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-white/35" />
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cx("max-w-4xl", align === "center" ? "mx-auto text-center" : "")}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/55">
          <span className="w-2 h-2 rounded-full bg-[#6d8ce8]" />
          {eyebrow}
        </div>
      )}
      <h2
        className={cx(
          "mt-4 font-black tracking-tight leading-[1.04]",
          align === "center" ? "text-4xl md:text-6xl" : "text-3xl md:text-5xl"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cx(
            "mt-6 text-white/65 leading-relaxed",
            align === "center" ? "text-lg md:text-xl" : "text-base md:text-lg"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   ADVANCED UI: ACCORDION, TABS, MARQUEE
========================================================= */

function AccordionItem({
  q,
  a,
  defaultOpen,
}: {
  q: string;
  a: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <button
        onClick={() => setOpen((s) => !s)}
        className="w-full px-6 py-5 flex items-center justify-between text-left"
      >
        <div className="font-semibold text-white">{q}</div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={springy}
          className="text-white/60"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="px-6 pb-6 text-white/70 leading-relaxed"
          >
            {a}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type TabKey = "restaurant" | "business";

function TemplateTabs({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (k: TabKey) => void;
}) {
  const items: Array<{ key: TabKey; label: string; sub: string; icon: React.ReactNode }> =
    [
      { key: "restaurant", label: "Restaurant", sub: "Menu • hours • location", icon: <Utensils className="w-4 h-4" /> },
      { key: "business", label: "Business", sub: "Services • CTA layout", icon: <Building2 className="w-4 h-4" /> },
    ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-2 flex gap-2">
      {items.map((it) => (
        <button
          key={it.key}
          onClick={() => onChange(it.key)}
          className={cx(
            "flex-1 rounded-xl px-4 py-3 text-left transition border",
            active === it.key
              ? "bg-white text-black border-white/20"
              : "bg-black/10 border-white/10 hover:bg-white/10 text-white"
          )}
        >
          <div className="flex items-center gap-2 font-semibold">
            <span className={cx("opacity-90", active === it.key ? "text-black" : "text-white")}>
              {it.icon}
            </span>
            {it.label}
          </div>
          <div
            className={cx(
              "text-xs mt-1",
              active === it.key ? "text-black/70" : "text-white/55"
            )}
          >
            {it.sub}
          </div>
        </button>
      ))}
    </div>
  );
}

function Marquee({
  items,
}: {
  items: Array<{ icon: React.ReactNode; text: string }>;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 -right-28 w-80 h-80 bg-[#6d8ce8]/10 blur-3xl" />
        <div className="absolute -bottom-28 -left-28 w-80 h-80 bg-[#2b4e8d]/15 blur-3xl" />
      </div>

      <div className="relative py-4">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{ duration: 22, ease: "linear", repeat: Infinity }}
          className="flex gap-6 whitespace-nowrap"
        >
          {[...items, ...items].map((it, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10 bg-black/20"
            >
              <span className="text-[#6d8ce8]">{it.icon}</span>
              <span className="text-white/80 text-sm">{it.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function HomePage() {
  const [templateTab, setTemplateTab] = useState<TabKey>("restaurant");
  const [isMounted, setIsMounted] = useState(false);

  // ensures consistent framer + iframe behavior
  useEffect(() => setIsMounted(true), []);

  const marqueeItems = useMemo(
    () => [
      { icon: <Globe className="w-4 h-4" />, text: "Live websites at /r/your-name" },
      { icon: <Edit3 className="w-4 h-4" />, text: "Edit directly on the page" },
      { icon: <Zap className="w-4 h-4" />, text: "Autosave by default" },
      { icon: <ImageIcon className="w-4 h-4" />, text: "Fast image uploads built-in" },
      { icon: <Smartphone className="w-4 h-4" />, text: "Mobile-ready layouts" },
      { icon: <Lock className="w-4 h-4" />, text: "Owner-only edit mode" },
      { icon: <BadgeCheck className="w-4 h-4" />, text: "Clean templates — no bloat" },
      { icon: <Gauge className="w-4 h-4" />, text: "Designed to load fast" },
    ],
    []
  );

  const heroPills = useMemo(
    () => [
      { icon: <LayoutDashboard className="w-4 h-4 text-[#6d8ce8]" />, text: "Website Builder" },
      { icon: <Sparkles className="w-4 h-4 text-[#6d8ce8]" />, text: "AI marketing tools" },
      { icon: <ShieldCheck className="w-4 h-4 text-[#6d8ce8]" />, text: "Autosave + ownership" },
    ],
    []
  );

  const quickProof = useMemo(
    () => [
      {
        icon: <Link2 className="w-5 h-5 text-[#6d8ce8]" />,
        title: "Instant URL",
        subtitle: "Your site lives at /r/your-name",
      },
      {
        icon: <MousePointerClick className="w-5 h-5 text-[#6d8ce8]" />,
        title: "In-place editing",
        subtitle: "Click text/images to change them",
      },
      {
        icon: <Zap className="w-5 h-5 text-[#6d8ce8]" />,
        title: "Autosave",
        subtitle: "No publish button. It’s live.",
      },
    ],
    []
  );

  const aiTools = useMemo(
    () => [
      {
        icon: <Wand2 className="w-6 h-6 text-[#6d8ce8]" />,
        title: "Content Generator",
        desc: "Posts, captions, and brand-aligned writing that doesn’t sound generic.",
        bullets: ["Hook-first structure", "Short or long format", "Saved to My Work"],
      },
      {
        icon: <Mail className="w-6 h-6 text-[#6d8ce8]" />,
        title: "Email Writer",
        desc: "Send-ready emails — crisp, professional, and human.",
        bullets: ["Subject + body format", "Clear purpose + next step", "Reply + outreach modes"],
      },
      {
        icon: <Megaphone className="w-6 h-6 text-[#6d8ce8]" />,
        title: "Ad Generator",
        desc: "Conversion-first copy for Meta / Google / TikTok style formats.",
        bullets: ["Multiple variations", "Headline + primary + CTA", "Skimmable & clean"],
      },
    ],
    []
  );

  const useCases = useMemo(
    () => [
      {
        icon: <Utensils className="w-6 h-6 text-[#6d8ce8]" />,
        title: "Restaurants",
        desc: "Menu, hours, location — clean and easy to edit.",
        points: ["Menu categories + items", "Upload food images", "Perfect mobile layout"],
      },
      {
        icon: <Building2 className="w-6 h-6 text-[#6d8ce8]" />,
        title: "Local businesses",
        desc: "Services, proof, and CTA — built to convert.",
        points: ["Services layout", "Strong call-to-action blocks", "Simple, premium design"],
      },
      {
        icon: <Users className="w-6 h-6 text-[#6d8ce8]" />,
        title: "Creators & coaches",
        desc: "A clean site and consistent output — without overhead.",
        points: ["Offer + testimonials", "Email outreach scripts", "Ad copy when ready"],
      },
    ],
    []
  );

  const testimonials = useMemo(
    () => [
      {
        name: "Founder",
        role: "Solo operator",
        quote:
          "This feels like the first tool that actually ships the whole thing — site + marketing — without needing 6 apps.",
      },
      {
        name: "Restaurant owner",
        role: "Small team",
        quote:
          "We can update menu items in seconds. No web agency. No waiting. It’s just live.",
      },
      {
        name: "Coach",
        role: "Service business",
        quote:
          "The site is clean and the marketing outputs are structured. It’s built for execution.",
      },
    ],
    []
  );

  return (
    <div className="min-h-screen text-white bg-[#05070d] relative overflow-x-hidden">
      {/* =========================
          BACKGROUND ATMOSPHERE
      ========================= */}
      <div className="fixed inset-0 z-0">
        <div className="absolute -top-44 -left-44 w-[980px] h-[980px] bg-[conic-gradient(at_top_left,var(--tw-gradient-stops))] from-[#0c1a39] via-[#0a1630] to-transparent blur-[175px]" />
        <div className="absolute bottom-0 right-0 w-[980px] h-[980px] bg-[conic-gradient(at_bottom_right,var(--tw-gradient-stops))] from-[#0d1b3d] via-[#111a2c] to-transparent blur-[200px]" />
        <div className="absolute inset-0 opacity-[0.055] bg-[radial-gradient(circle_at_20%_20%,white,transparent_30%),radial-gradient(circle_at_80%_30%,white,transparent_25%),radial-gradient(circle_at_40%_80%,white,transparent_35%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/25" />
      </div>

      {/* NAV */}
      <div className="relative z-20">
        <MarketingNavbar />
      </div>

      {/* =========================
          HERO — BIG, VISUAL, PREMIUM
      ========================= */}
      <section className="relative z-10 pt-28 md:pt-36 pb-10 md:pb-14 px-6 md:px-10">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeUp}
          transition={{ duration: 0.95 }}
          className="max-w-7xl mx-auto"
        >
          <div className="grid gap-10 lg:grid-cols-[1.05fr,0.95fr] items-center">
            {/* LEFT COPY */}
            <div>
              <div className="flex flex-wrap gap-3 mb-8">
                {heroPills.map((p, i) => (
                  <Pill key={i}>
                    {p.icon}
                    {p.text}
                  </Pill>
                ))}
              </div>

              <h1 className="text-[2.85rem] leading-[1.02] md:text-7xl md:leading-[1.01] font-black tracking-tight">
                Build a website
                <br />
                that stays
                <br />
                <span className="text-[#d8e3ff]">live and editable.</span>
              </h1>

              <p className="mt-7 text-lg md:text-2xl text-white/65 max-w-2xl leading-relaxed">
                AutopilotAI gives you a clean, premium website at{" "}
                <span className="text-white font-semibold">/r/your-name</span>
                — then helps you generate the marketing that fills it.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-5">
                <PrimaryCTA href="/register">Create your website</PrimaryCTA>
                <SecondaryCTA
                  href="https://www.autopilotai.dev/r/testrestaurant"
                  icon={<ExternalLink className="w-5 h-5 opacity-80" />}
                >
                  View live example
                </SecondaryCTA>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <MiniStat
                  label="Live URL"
                  value="/r/your-name"
                  icon={<Globe className="w-5 h-5 text-[#6d8ce8]" />}
                />
                <MiniStat
                  label="Editing"
                  value="In-place"
                  icon={<Edit3 className="w-5 h-5 text-[#6d8ce8]" />}
                />
                <MiniStat
                  label="Saving"
                  value="Autosave"
                  icon={<Zap className="w-5 h-5 text-[#6d8ce8]" />}
                />
                <MiniStat
                  label="Layout"
                  value="Mobile-ready"
                  icon={<Smartphone className="w-5 h-5 text-[#6d8ce8]" />}
                />
              </div>

              <p className="mt-7 text-sm text-white/45">
                Website Builder is included on paid plans. (1 website per account for now.)
              </p>
            </div>

            {/* RIGHT VISUAL PANEL */}
            <SoftCard className="relative overflow-hidden">
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#6d8ce8]/15 blur-3xl" />
              <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#2b4e8d]/20 blur-3xl" />

              <div className="relative p-7 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                      <LayoutDashboard className="w-5 h-5 text-[#6d8ce8]" />
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Website Builder</div>
                      <div className="font-semibold text-white">Live proof</div>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 bg-black/20 text-xs text-white/70">
                    <span className="w-2 h-2 rounded-full bg-[#6d8ce8]" />
                    Live preview
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,.6)]">
                  {/* browser bar */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-black/60 border-b border-white/10">
                    <div className="flex gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500/70" />
                      <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
                      <span className="w-3 h-3 rounded-full bg-green-500/70" />
                    </div>
                    <div className="ml-4 text-xs text-white/45 truncate">
                      autopilotai.dev/r/testrestaurant
                    </div>
                  </div>

                  <div className="relative h-[380px] md:h-[420px] overflow-hidden">
                    {/* Note: iframe is local path to avoid cross-origin issues */}
                    <iframe
                      src="/r/testrestaurant"
                      className="absolute inset-0 w-full h-full scale-[0.86] origin-top-left pointer-events-none"
                      title="AutopilotAI Website Builder Live Preview"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-transparent to-transparent" />
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  {quickProof.map((p, i) => (
                    <IconBadge
                      key={i}
                      icon={p.icon}
                      title={p.title}
                      subtitle={p.subtitle}
                    />
                  ))}
                </div>
              </div>
            </SoftCard>
          </div>
        </motion.div>
      </section>

      {/* =========================
          MARQUEE — BIG PRODUCT SIGNAL
      ========================= */}
      <section className="relative z-10 px-6 md:px-10 mt-10">
        <div className="max-w-7xl mx-auto">
          <Marquee items={marqueeItems} />
        </div>
      </section>

      <GlowDivider />

      {/* =========================
          TEMPLATE TEASE — TABS + MICRO PREVIEWS
      ========================= */}
      <section className="relative z-10 px-6 md:px-10 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            eyebrow="Templates"
            title="Start with a premium layout"
            subtitle="Pick a template, claim your URL, and edit in place. Simple workflow — clean results."
            align="left"
          />

          <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr,1.1fr] items-start">
            <div className="space-y-6">
              <TemplateTabs active={templateTab} onChange={setTemplateTab} />

              <SoftCard className="p-7 md:p-8">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="text-sm text-white/60">Why templates?</div>
                    <div className="mt-2 text-xl font-semibold text-white">
                      Designed to look expensive.
                    </div>
                    <div className="mt-3 text-white/60 leading-relaxed">
                      The point is not endless configuration. It’s getting a clean, modern site
                      that you can edit instantly — and actually ship.
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                    <Palette className="w-5 h-5 text-[#6d8ce8]" />
                  </div>
                </div>

                <div className="mt-7 space-y-3">
                  {[
                    { icon: <CheckCircle2 className="w-5 h-5 text-[#6d8ce8]" />, t: "Clean spacing + typography" },
                    { icon: <CheckCircle2 className="w-5 h-5 text-[#6d8ce8]" />, t: "Mobile-first structure" },
                    { icon: <CheckCircle2 className="w-5 h-5 text-[#6d8ce8]" />, t: "Fast edit mode (no cursor loss)" },
                    { icon: <CheckCircle2 className="w-5 h-5 text-[#6d8ce8]" />, t: "Image uploads built-in" },
                  ].map((x, i) => (
                    <div key={i} className="flex items-start gap-3 text-white/80">
                      {x.icon}
                      <span>{x.t}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <SecondaryCTA
                    href="https://www.autopilotai.dev/r/testrestaurant"
                    icon={<ExternalLink className="w-5 h-5 opacity-80" />}
                  >
                    Open example
                  </SecondaryCTA>
                  <PrimaryCTA href="/register">Start with a template</PrimaryCTA>
                </div>
              </SoftCard>
            </div>

            {/* Right panel: micro previews */}
            <SoftCard className="relative overflow-hidden">
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#6d8ce8]/10 blur-3xl" />
              <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#2b4e8d]/18 blur-3xl" />

              <div className="relative p-8 md:p-10">
                <div className="flex items-center justify-between gap-6 mb-8">
                  <div>
                    <div className="text-sm uppercase tracking-[0.2em] text-white/50">
                      Preview
                    </div>
                    <div className="mt-2 text-2xl md:text-3xl font-bold">
                      {templateTab === "restaurant"
                        ? "Restaurant template"
                        : "Business template"}
                    </div>
                    <div className="mt-2 text-white/55">
                      {templateTab === "restaurant"
                        ? "Menu • Hours • Location • Contact"
                        : "Services • Proof • CTA • Contact"}
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/20 text-sm text-white/70">
                    <Sparkles className="w-4 h-4 text-[#6d8ce8]" />
                    Clean by default
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <PreviewTile
                    title="Hero"
                    subtitle="Headline + supporting copy"
                    lines={6}
                    accent="a"
                  />
                  <PreviewTile
                    title={templateTab === "restaurant" ? "Menu" : "Services"}
                    subtitle={templateTab === "restaurant" ? "Categories + items" : "Offer blocks"}
                    lines={7}
                    accent="b"
                  />
                  <PreviewTile
                    title="Social proof"
                    subtitle="Testimonials / highlights"
                    lines={5}
                    accent="c"
                  />
                  <PreviewTile
                    title="Contact"
                    subtitle="CTA + location details"
                    lines={6}
                    accent="d"
                  />
                </div>

                <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6 flex items-start justify-between gap-6">
                  <div>
                    <div className="font-semibold text-white">Want to see the real thing?</div>
                    <div className="mt-2 text-white/60">
                      Open the live example. This isn’t a static mockup.
                    </div>
                  </div>
                  <a
                    href="https://www.autopilotai.dev/r/testrestaurant"
                    className="inline-flex items-center gap-2 text-[#6d8ce8] font-semibold hover:underline"
                  >
                    View live
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </SoftCard>
          </div>
        </div>
      </section>

      <GlowDivider />

      {/* =========================
          EDIT MODE TEASE — “HOW IT FEELS” (NOT A TUTORIAL)
      ========================= */}
      <section className="relative z-10 px-6 md:px-10 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            eyebrow="Editing"
            title="Editing feels instant"
            subtitle="No builder UI fighting you. The website is the editor."
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <FeatureCard
              icon={<MousePointerClick className="w-6 h-6 text-[#6d8ce8]" />}
              title="Click to change"
              desc="Edit the content directly where it lives — clean, obvious, fast."
              bullets={["Text and images in place", "No “settings panels” maze", "Designed for speed"]}
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-[#6d8ce8]" />}
              title="Autosave always"
              desc="Stop thinking about publishing. Save happens automatically."
              bullets={["No publish button", "No draft confusion", "Always live for guests"]}
            />
            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6 text-[#6d8ce8]" />}
              title="Owner-only"
              desc="Guests see the website. Owners can edit via edit mode."
              bullets={["Edit mode for owners", "Guests never see controls", "Built with paid gating"]}
            />
          </div>
        </div>
      </section>

      <GlowDivider />

      {/* =========================
          USE CASES — WHO IT'S FOR
      ========================= */}
      <section className="relative z-10 px-6 md:px-10 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            eyebrow="Use cases"
            title="Built for real businesses"
            subtitle="The Website Builder is designed for people who want a clean site that converts — without overhead."
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {useCases.map((u, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                transition={springy}
                className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-[0_40px_100px_rgba(0,0,0,.55)] overflow-hidden"
              >
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#6d8ce8]/12 blur-3xl opacity-0 hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-6">
                    {u.icon}
                  </div>
                  <h3 className="text-2xl font-bold">{u.title}</h3>
                  <p className="mt-3 text-white/65 leading-relaxed">{u.desc}</p>

                  <div className="mt-6 space-y-3">
                    {u.points.map((p, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-white/80">
                        <CheckCircle2 className="w-5 h-5 text-[#6d8ce8] mt-0.5" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <GlowDivider />

      {/* =========================
          AI TOOLS — SECONDARY, BUT PREMIUM
      ========================= */}
      <section className="relative z-10 px-6 md:px-10 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            eyebrow="AI tools"
            title="Marketing that matches the site"
            subtitle="Generate content, emails, and ads without switching tools. Built for structure, clarity, and speed."
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {aiTools.map((t, i) => (
              <FeatureCard
                key={i}
                icon={t.icon}
                title={t.title}
                desc={t.desc}
                bullets={t.bullets}
              />
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <SecondaryCTA href="/features">See full features</SecondaryCTA>
            <PrimaryCTA href="/register">Start building</PrimaryCTA>
          </div>
        </div>
      </section>

      <GlowDivider />

      {/* =========================
          TESTIMONIALS — TASTE + CONFIDENCE
      ========================= */}
      <section className="relative z-10 px-6 md:px-10 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            eyebrow="Signal"
            title="Designed for execution"
            subtitle="AutopilotAI is built to help you ship — not to give you infinite settings."
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <SoftCard key={i} className="p-8">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/55">Testimonial</div>
                  <Stars className="w-5 h-5 text-[#6d8ce8]" />
                </div>

                <div className="mt-5 text-white text-lg leading-relaxed">
                  “{t.quote}”
                </div>

                <div className="mt-7 pt-6 border-t border-white/10">
                  <div className="font-semibold text-white">{t.name}</div>
                  <div className="text-sm text-white/55 mt-1">{t.role}</div>
                </div>
              </SoftCard>
            ))}
          </div>
        </div>
      </section>

      <GlowDivider />

      {/* =========================
          FAQ — SHORT ANSWERS, NO FLUFF
      ========================= */}
      <section className="relative z-10 px-6 md:px-10 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            eyebrow="FAQ"
            title="Quick answers"
            subtitle="No long explanations — just what you actually want to know."
          />

          <div className="mt-12 grid gap-5 max-w-4xl mx-auto">
            <AccordionItem
              q="Is the website really live?"
              a={
                <>
                  Yes. Your site is available at <span className="text-white font-semibold">/r/your-name</span>.
                  Owners can edit with edit mode. Guests see a clean published site.
                </>
              }
              defaultOpen
            />
            <AccordionItem
              q="Do I need to press publish?"
              a={
                <>
                  No. The Website Builder is built around <span className="text-white font-semibold">autosave</span>.
                  Changes are saved and reflected without a publishing workflow.
                </>
              }
            />
            <AccordionItem
              q="Can I use my own images?"
              a={
                <>
                  Yes. Image uploads are supported. You can replace images directly in the editor.
                </>
              }
            />
            <AccordionItem
              q="Is the Website Builder available on free?"
              a={
                <>
                  No — it’s included on paid plans. (Right now it’s limited to{" "}
                  <span className="text-white font-semibold">1 website per account</span>.)
                </>
              }
            />
          </div>
        </div>
      </section>

      <GlowDivider />

      {/* =========================
          FINAL CTA — BIG, CONFIDENT
      ========================= */}
      <section className="relative z-10 px-6 md:px-10 pb-28 md:pb-36">
        <div className="max-w-7xl mx-auto">
          <SoftCard className="relative overflow-hidden">
            <div className="absolute -top-40 -right-40 w-[720px] h-[720px] bg-[#6d8ce8]/12 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-[720px] h-[720px] bg-[#2b4e8d]/18 blur-3xl" />

            <div className="relative p-10 md:p-14 grid gap-10 lg:grid-cols-[1.1fr,0.9fr] items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/55">
                  <span className="w-2 h-2 rounded-full bg-[#6d8ce8]" />
                  Ready
                </div>

                <h2 className="mt-4 text-4xl md:text-6xl font-black tracking-tight leading-[1.05]">
                  Build it.
                  <br />
                  Edit it live.
                  <br />
                  <span className="text-[#d8e3ff]">Move on.</span>
                </h2>

                <p className="mt-6 text-white/65 text-lg leading-relaxed max-w-2xl">
                  AutopilotAI is designed to remove friction — a clean website and the marketing that powers it,
                  in one place.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <PrimaryCTA href="/register">Create your website</PrimaryCTA>
                  <SecondaryCTA
                    href="https://www.autopilotai.dev/r/testrestaurant"
                    icon={<ExternalLink className="w-5 h-5 opacity-80" />}
                  >
                    See live example
                  </SecondaryCTA>
                </div>

                <div className="mt-7 text-sm text-white/45">
                  Built for creators, founders, and small teams who execute.
                </div>
              </div>

              <div className="space-y-4">
                <MiniStat
                  label="Website included"
                  value="Paid plans"
                  icon={<BadgeCheck className="w-5 h-5 text-[#6d8ce8]" />}
                />
                <MiniStat
                  label="Edit mode"
                  value="Owner-only"
                  icon={<Lock className="w-5 h-5 text-[#6d8ce8]" />}
                />
                <MiniStat
                  label="Output"
                  value="Content + email + ads"
                  icon={<Sparkles className="w-5 h-5 text-[#6d8ce8]" />}
                />
                <MiniStat
                  label="Workflow"
                  value="Ship fast"
                  icon={<Rocket className="w-5 h-5 text-[#6d8ce8]" />}
                />
              </div>
            </div>
          </SoftCard>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 py-14 text-center">
        <p className="text-white/45 text-sm">
          © 2025 AutopilotAI — Built for people who execute.
        </p>
      </footer>
    </div>
  );
}

/* =========================================================
   COMPONENTS: FEATURE CARD + PREVIEW TILE
========================================================= */

function FeatureCard({
  icon,
  title,
  desc,
  bullets,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  bullets: string[];
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={springy}
      className="group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-[0_40px_100px_rgba(0,0,0,.55)] overflow-hidden"
    >
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#6d8ce8]/12 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-6">
          {icon}
        </div>

        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="mt-3 text-white/65 leading-relaxed">{desc}</p>

        <div className="mt-6 space-y-3">
          {bullets.map((b, i) => (
            <div key={i} className="flex items-start gap-3 text-white/80">
              <CheckCircle2 className="w-5 h-5 text-[#6d8ce8] mt-0.5 flex-shrink-0" />
              <span className="text-sm md:text-base">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function PreviewTile({
  title,
  subtitle,
  lines,
  accent,
}: {
  title: string;
  subtitle: string;
  lines: number;
  accent: "a" | "b" | "c" | "d";
}) {
  const glow =
    accent === "a"
      ? "bg-[#6d8ce8]/12"
      : accent === "b"
      ? "bg-[#2b4e8d]/18"
      : accent === "c"
      ? "bg-[#6d8ce8]/10"
      : "bg-[#2b4e8d]/14";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={springy}
      className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_40px_110px_rgba(0,0,0,.55)] overflow-hidden"
    >
      <div className={cx("absolute -bottom-32 -left-32 w-72 h-72 blur-3xl", glow)} />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-white/55">{subtitle}</p>
            <h4 className="text-xl font-bold mt-1">{title}</h4>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
            <Sparkle className="w-5 h-5 text-[#6d8ce8]" />
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-5">
          <div className="space-y-3">
            {Array.from({ length: lines }).map((_, i) => (
              <div key={i} className="h-3 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  whileInView={{ width: `${Math.min(96, 52 + i * 7)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.75, delay: 0.06 + i * 0.05 }}
                  className="h-full bg-white/22"
                />
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm text-white/65 leading-relaxed">
            Clean structure. Fast editing. No clutter.
          </div>
        </div>
      </div>
    </motion.div>
  );
}
