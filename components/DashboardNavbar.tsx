"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function DashboardNavbar({ name = "U", subscriptionPlan = "Free" }: any) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 md:px-10 h-16 flex items-center justify-between">
        
        {/* LEFT */}
        <div className="flex items-center gap-8">
          <h1
            onClick={() => router.push("/dashboard")}
            className="text-xl font-semibold tracking-tight cursor-pointer"
          >
            AutopilotAI<span className="text-amber-500">.</span>
          </h1>

          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <button onClick={() => router.push("/dashboard")} className="hover:text-black transition">
              Dashboard
            </button>

            <button onClick={() => router.push("/dashboard/content")} className="hover:text-black transition">
              Content
            </button>

            <button onClick={() => router.push("/dashboard/email")} className="hover:text-black transition">
              Emails
            </button>

            <button onClick={() => router.push("/dashboard/ads")} className="hover:text-black transition">
              Ads
            </button>

            <button onClick={() => router.push("/dashboard/work")} className="hover:text-black transition">
              My Work
            </button>
          </nav>
        </div>

        {/* RIGHT */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setMenuOpen(true)}
          className="relative w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 shadow-sm"
        >
          {name}
          <span className="absolute inset-0 rounded-full ring-2 ring-amber-400 opacity-40" />
        </motion.button>

        <AvatarMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          name={name}
          subscriptionPlan={subscriptionPlan}
          router={router}
        />
      </div>
    </header>
  );
}

/* Avatar Menu */
function AvatarMenu({ open, onClose, name, subscriptionPlan, router }: any) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/20"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.aside
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed top-20 right-6 w-80 rounded-3xl bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl z-50 overflow-hidden"
          >
            <div className="relative px-6 pt-6 pb-4 border-b bg-amber-50">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-sm text-gray-500 hover:text-black"
              >
                ✕
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                  {name}
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Plan</p>
                  <p className="font-bold capitalize">
                    {subscriptionPlan ?? "Free"}
                  </p>
                </div>
              </div>
            </div>

            <div className="py-2">
              <MenuItem label="Dashboard" onClick={() => router.push("/dashboard")} />
              <MenuItem label="Billing" onClick={() => router.push("/billing")} />
              <MenuItem label="Subscription Plans" onClick={() => router.push("/pricing")} />
              <MenuItem label="Profile" onClick={() => router.push("/dashboard/profile")} />

              <div className="border-t mt-2 pt-2">
                <MenuItem
                  label="Log out"
                  danger
                  onClick={() => {
                    localStorage.removeItem("autopilot_token");
                    router.push("/login");
                  }}
                />
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function MenuItem({ label, onClick, danger = false }: any) {
  return (
    <motion.button
      whileHover={{ x: 6 }}
      onClick={onClick}
      className={`w-full px-6 py-3 text-left text-sm ${
        danger ? "text-red-500" : "text-gray-700"
      } hover:bg-gray-100`}
    >
      {label}
    </motion.button>
  );
}
