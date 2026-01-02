"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function DashboardNavbar({
  name = "U",
  subscriptionPlan,
}: {
  name?: string;
  subscriptionPlan?: string | null;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const plan = subscriptionPlan ?? "Free";

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05070d]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">

        {/* Brand */}
        <h1
          onClick={() => router.push("/dashboard")}
          className="text-2xl font-light tracking-wide cursor-pointer text-white hover:text-[#6d8ce8] transition"
        >
          AutopilotAI
        </h1>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <NavButton label="Dashboard" onClick={() => router.push("/dashboard")} />
          <NavButton label="Content" onClick={() => router.push("/dashboard/content")} />
          <NavButton label="Emails" onClick={() => router.push("/dashboard/email")} />
          <NavButton label="Ads" onClick={() => router.push("/dashboard/ads")} />
          <NavButton label="My Work" onClick={() => router.push("/dashboard/work")} />
        </nav>

        {/* Avatar */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setMenuOpen(true)}
          className="relative w-12 h-12 rounded-full bg-gradient-to-r from-[#1c2f57] to-[#2b4e8d] text-white text-sm font-semibold flex items-center justify-center shadow-[0_20px_60px_rgba(20,40,90,0.6)] border border-white/20"
        >
          {name}
        </motion.button>

        <AvatarMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          name={name}
          subscriptionPlan={plan}
          router={router}
        />
      </div>
    </header>
  );
}

/* ---------------- NAV BUTTON ---------------- */
function NavButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="px-6 py-3 rounded-xl text-sm font-medium 
      text-gray-300 hover:text-white 
      bg-white/0 hover:bg-white/5 
      border border-transparent hover:border-white/10
      transition"
    >
      {label}
    </motion.button>
  );
}

/* ---------------- AVATAR MENU ---------------- */
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
  subscriptionPlan?: string;
  router: any;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Background dim */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Menu Panel */}
          <motion.aside
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed right-6 top-24 w-80 rounded-2xl 
            bg-[#0b1020] border border-white/10 
            shadow-[0_50px_150px_rgba(0,0,0,.8)]
            text-white z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-8 pt-8 pb-6 border-b border-white/10 relative">
              <button
                onClick={onClose}
                className="absolute right-6 top-6 text-gray-400 hover:text-white text-xl"
              >
                ×
              </button>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#1c2f57] to-[#2b4e8d] text-white flex items-center justify-center text-lg font-semibold border border-white/20 shadow-[0_20px_60px_rgba(20,40,90,0.6)]">
                  {name}
                </div>

                <div>
                  <p className="text-sm text-gray-400 uppercase tracking-wide">
                    Current Plan
                  </p>
                  <p className="text-xl font-semibold capitalize">
                    {subscriptionPlan}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu */}
            <div className="py-2">
              <MenuItem label="Dashboard" onClick={() => { onClose(); router.push("/dashboard"); }} />
              <MenuItem label="Profile" onClick={() => { onClose(); router.push("/dashboard/profile"); }} />
              <MenuItem label="Billing" onClick={() => { onClose(); router.push("/billing"); }} />
              <MenuItem label="Upgrade" onClick={() => { onClose(); router.push("/upgrade"); }} />

              <div className="border-t border-white/10 mt-2 pt-2">
                <MenuItem
                  label="Log Out"
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

/* ---------------- MENU ITEM ---------------- */
function MenuItem({
  label,
  onClick,
  danger = false,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ x: 8 }}
      onClick={onClick}
      className={`w-full px-8 py-4 text-left text-sm font-medium transition 
      ${
        danger
          ? "text-red-400 hover:bg-red-900/20 hover:text-red-300"
          : "text-gray-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      {label}
    </motion.button>
  );
}
