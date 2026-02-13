"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";
import { ArrowRight, Check, X, Sparkles } from "lucide-react";

/* =========================
   TYPES
========================= */
type Plan = "free" | "starter" | "pro";

interface User {
  name: string;
  subscription_plan: Plan;
}

/* =========================
   PAGE
========================= */
export default function UpgradePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/api/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("autopilot_token");
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const subscribe = async (plan: "starter" | "pro") => {
    try {
      const res = await api.post(
        `/api/stripe/create-checkout-session?plan=${plan}`
      );
      window.location.href = res.data.checkout_url;
    } catch {
      alert("Could not start checkout. Try again.");
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="inline-block w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentPlan = user.subscription_plan ?? "free";
  const nameInitial = user.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-black text-white">
      <DashboardNavbar name={nameInitial} subscriptionPlan={currentPlan} />

      {/* GRADIENT BACKGROUND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: "1s"}}></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4 px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm font-medium">
            {currentPlan === "free" ? "🚀 Publish Your Website" : "⚡ Upgrade Your Plan"}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            {currentPlan === "free" ? "Ready to Go Live?" : "Choose Your Plan"}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {currentPlan === "free" 
              ? "Upgrade to publish your website and get a custom domain"
              : "Manage your subscription. Cancel anytime, no questions asked."}
          </p>
        </motion.div>

        {/* PLANS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* FREE */}
          <PlanCard
            title="Free"
            price="$0"
            period="forever"
            subtitle="Try it out"
            active={currentPlan === "free"}
            features={[
              { text: "1 AI website", included: true },
              { text: "Click-to-edit", included: true },
              { text: "Upload images", included: true },
              { text: "Publish to web", included: false },
              { text: "Custom domain", included: false },
            ]}
            cta={currentPlan === "free" ? "Current Plan" : "Downgrade"}
            disabled={currentPlan === "free"}
          />

          {/* STARTER - MOST POPULAR */}
          <PlanCard
            title="Starter"
            price="$10"
            period="month"
            subtitle="Best for most users"
            active={currentPlan === "starter"}
            popular={true}
            features={[
              { text: "Everything in Free", included: true },
              { text: "Publish to web", included: true, highlight: true },
              { text: "Custom domain", included: true, highlight: true },
              { text: "Remove branding", included: true },
              { text: "Email support", included: true },
            ]}
            cta={
              currentPlan === "starter"
                ? "Current Plan"
                : currentPlan === "free"
                ? "Publish Website"
                : "Downgrade to Starter"
            }
            onClick={() => currentPlan !== "starter" && subscribe("starter")}
            disabled={currentPlan === "starter"}
          />

          {/* PRO */}
          <PlanCard
            title="Pro"
            price="$20"
            period="month"
            subtitle="For power users"
            active={currentPlan === "pro"}
            features={[
              { text: "Everything in Starter", included: true },
              { text: "3 websites", included: true, highlight: true },
              { text: "Multiple pages per site", included: true, highlight: true },
              { text: "Priority support", included: true },
              { text: "Early access to features", included: true },
            ]}
            cta={currentPlan === "pro" ? "Current Plan" : "Upgrade to Pro"}
            onClick={() => currentPlan !== "pro" && subscribe("pro")}
            disabled={currentPlan === "pro"}
          />
        </section>

        {/* COMPARISON TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Compare Plans</h2>
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-6 px-8 font-semibold">Feature</th>
                  <th className="py-6 px-8 font-semibold">Free</th>
                  <th className="py-6 px-8 font-semibold bg-indigo-500/10">Starter</th>
                  <th className="py-6 px-8 font-semibold">Pro</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <ComparisonRow feature="AI websites" free="1" starter="1" pro="3" />
                <ComparisonRow feature="Pages per site" free="1" starter="1" pro="Multiple" />
                <ComparisonRow feature="Edit content" free={true} starter={true} pro={true} />
                <ComparisonRow feature="Upload images" free={true} starter={true} pro={true} />
                <ComparisonRow feature="Publish to web" free={false} starter={true} pro={true} />
                <ComparisonRow feature="Custom domain" free={false} starter={true} pro={true} />
                <ComparisonRow feature="Remove branding" free={false} starter={true} pro={true} />
                <ComparisonRow feature="Email support" free={false} starter={true} pro={true} />
                <ComparisonRow feature="Priority support" free={false} starter={false} pro={true} />
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <FAQItem
              question="Can I cancel anytime?"
              answer="Yes! Cancel anytime from your dashboard. No questions asked, no cancellation fees."
            />
            <FAQItem
              question="What happens if I downgrade?"
              answer="Your website stays live for the current billing period. After that, it returns to draft mode until you upgrade again."
            />
            <FAQItem
              question="Do you offer refunds?"
              answer="We offer a 7-day money-back guarantee. If you're not satisfied, contact us for a full refund."
            />
            <FAQItem
              question="Can I upgrade or downgrade later?"
              answer="Absolutely! You can change your plan anytime. Changes take effect immediately."
            />
          </div>
        </motion.div>

        {/* FOOTER NOTE */}
        <div className="mt-20 text-center text-gray-500 text-sm">
          All plans include unlimited edits and updates. Secure checkout powered by Stripe.
        </div>
      </main>
    </div>
  );
}

/* =========================
   COMPONENTS
========================= */
function PlanCard({
  title,
  price,
  period,
  subtitle,
  features,
  cta,
  active,
  popular,
  disabled,
  onClick,
}: {
  title: string;
  price: string;
  period: string;
  subtitle: string;
  features: Array<{ text: string; included: boolean; highlight?: boolean }>;
  cta: string;
  active?: boolean;
  popular?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative rounded-3xl border p-8 backdrop-blur-xl transition-all ${
        popular ? "transform scale-105 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500" : "bg-white/5 border-white/10"
      } ${active ? "ring-2 ring-indigo-500" : ""}`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-500 rounded-full text-sm font-bold flex items-center gap-1">
          <Sparkles className="w-4 h-4" />
          MOST POPULAR
        </div>
      )}

      <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">
        {title}
      </div>
      <p className="text-gray-400 text-sm mb-6">{subtitle}</p>

      <div className="flex items-end gap-2 mb-8">
        <span className="text-5xl font-bold">{price}</span>
        <span className="text-gray-400 mb-2">/{period}</span>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((f, i) => (
          <li key={i} className="flex gap-3 items-start text-sm">
            {f.included ? (
              <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            ) : (
              <X className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
            )}
            <span className={f.included ? (f.highlight ? "font-semibold" : "") : "text-gray-600"}>
              {f.text}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
          disabled
            ? "bg-white/10 text-gray-500 cursor-not-allowed"
            : popular
            ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 shadow-lg"
            : "bg-white/10 hover:bg-white/20"
        }`}
      >
        {cta}
        {!disabled && <ArrowRight className="w-5 h-5" />}
      </button>
    </motion.div>
  );
}

function ComparisonRow({
  feature,
  free,
  starter,
  pro,
}: {
  feature: string;
  free: boolean | string;
  starter: boolean | string;
  pro: boolean | string;
}) {
  const Cell = ({ value }: { value: boolean | string }) => (
    <td className="py-4 px-8 text-center">
      {typeof value === "boolean" ? (
        value ? (
          <Check className="w-5 h-5 text-green-400 mx-auto" />
        ) : (
          <X className="w-5 h-5 text-gray-600 mx-auto" />
        )
      ) : (
        <span className="text-gray-300">{value}</span>
      )}
    </td>
  );

  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="py-4 px-8 font-medium text-gray-300">{feature}</td>
      <Cell value={free} />
      <td className="bg-indigo-500/5">
        <Cell value={starter} />
      </td>
      <Cell value={pro} />
    </tr>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <span className="font-semibold text-left">{question}</span>
        <svg
          className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-4 text-gray-400">
          {answer}
        </div>
      )}
    </div>
  );
}