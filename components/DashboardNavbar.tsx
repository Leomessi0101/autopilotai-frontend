"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function DashboardNavbar({
  name = "U",
  subscriptionPlan = "Free",
}: { name?: string; subscriptionPlan?: string }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        {/* Brand */}
        <h1
          onClick={() => router.push("/dashboard")}
          className="text-2xl font-light tracking-wide cursor-pointer text-gray-900"
        >
          AutopilotAI
        </h1>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <NavButton label="Dashboard" onClick={() => router.push("/dashboard")} />
          <NavButton label="Content" onClick={() => router.push("/dashboard/content")} />
          <NavButton label="Emails" onClick={() => router.push("/dashboard/email")} />
          <NavButton label="Ads" onClick={() => router.push("/dashboard/ads")} />
          <NavButton label="My Work" onClick={() => router.push("/dashboard/work")} />
        </nav>

        {/* Right — Avatar */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setMenuOpen(true)}
          className="relative w-12 h-12 rounded-full bg-blue-900 text-white flex items-center justify-center text-sm font-medium shadow-sm"
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

/* Nav Button */
function NavButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="px-6 py-3 rounded-xl text-sm font-medium text-gray-700 hover:text-blue-900 hover:bg-gray-100 transition"
    >
      {label}
    </motion.button>
  );
}

/* Avatar Menu */
function AvatarMenu({
  open,
  onClose,
  name,
  subscriptionPlan,
  router,
}: {
  open: boolean;
  onClose: () => void;
  name: string;
  subscriptionPlan: string | null;
  router: any;
}) {
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-6 top-24 w-80 rounded-2xl bg-white shadow-lg border border-gray-200 z-50 overflow-hidden"
          >
            <div className="px-8 pt-8 pb-6 border-b border-gray-200">
              <button
                onClick={onClose}
                className="absolute right-6 top-6 text-gray-500 hover:text-gray-900 text-xl"
              >
                ×
              </button>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-900 text-white flex items-center justify-center text-lg font-medium">
                  {name}
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wide">Current Plan</p>
                  <p className="text-xl font-semibold text-gray-900 capitalize">
                    {subscriptionPlan ?? "Free"}
                  </p>
                </div>
              </div>
            </div>

            <div className="py-2">
              <MenuItem label="Dashboard" onClick={() => { onClose(); router.push("/dashboard"); }} />
              <MenuItem label="Profile" onClick={() => { onClose(); router.push("/dashboard/profile"); }} />
              <MenuItem label="Billing" onClick={() => { onClose(); router.push("/billing"); }} />
              <MenuItem label="Subscription Plans" onClick={() => { onClose(); router.push("/pricing"); }} />

              <div className="border-t border-gray-200 mt-2 pt-2">
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

/* Menu Item */
function MenuItem({ label, onClick, danger = false }: { label: string; onClick: () => void; danger?: boolean }) {
  return (
    <motion.button
      whileHover={{ x: 6 }}
      onClick={onClick}
      className={`w-full px-8 py-4 text-left text-sm font-medium transition ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      {label}
    </motion.button>
  );
}