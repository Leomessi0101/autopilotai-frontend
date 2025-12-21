"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function DashboardNavbar({
  name = "U",
  subscriptionPlan = "Free",
}: any) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* BRAND */}
        <h1
          onClick={() => router.push("/dashboard")}
          className="text-xl font-semibold tracking-tight cursor-pointer"
        >
          AutopilotAI<span className="text-amber-500">.</span>
        </h1>

        {/* CENTER NAV */}
        <nav className="hidden md:flex items-center gap-2">
          <NavButton label="Dashboard" onClick={() => router.push("/dashboard")} />
          <NavButton label="Content" onClick={() => router.push("/dashboard/content")} />
          <NavButton label="Emails" onClick={() => router.push("/dashboard/email")} />
          <NavButton label="Ads" onClick={() => router.push("/dashboard/ads")} />
          <NavButton label="My Work" onClick={() => router.push("/dashboard/work")} />
        </nav>

        {/* RIGHT — AVATAR */}
        <motion.button
          whileHover={{ scale: 1.07 }}
          onClick={() => setMenuOpen(true)}
          className="relative w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold"
        >
          {name}
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

/* =========================
   NAV BUTTON
   ========================= */
function NavButton({ label, onClick }: any) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      onClick={onClick}
      className="px-4 py-1.5 rounded-full text-sm border border-gray-200 hover:border-amber-400 hover:bg-amber-50 transition"
    >
      {label}
    </motion.button>
  );
}

/* =========================
   AVATAR MENU
   ========================= */
function AvatarMenu({ open, onClose, name, subscriptionPlan, router }: any) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/30"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.aside
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="fixed right-6 top-20 w-80 rounded-3xl bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl z-50 overflow-hidden"
          >
            <div className="relative px-6 pt-6 pb-4 border-b bg-gray-50">
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
              <MenuItem label="Profile" onClick={() => router.push("/dashboard/profile")} />
              <MenuItem label="Billing" onClick={() => router.push("/billing")} />
              <MenuItem label="Subscription Plans" onClick={() => router.push("/pricing")} />

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

/* =========================
   MENU ITEM
   ========================= */
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
