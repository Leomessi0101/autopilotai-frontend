"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, User, CreditCard, Zap, LayoutDashboard, FileText, Mail, Megaphone, Briefcase } from "lucide-react";

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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-2xl supports-[backdrop-filter]:bg-black/20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">

        {/* Brand */}
        <button
          onClick={() => router.push("/dashboard")}
          className="group flex items-center gap-2.5 hover:opacity-80 transition-opacity duration-300"
        >
          {/* Logo icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg blur-md opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          
          <span className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            AutopilotAI
          </span>
        </button>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <NavButton 
            label="Dashboard" 
            icon={<LayoutDashboard className="w-4 h-4" />}
            onClick={() => router.push("/dashboard")} 
          />
          <NavButton 
            label="Content" 
            icon={<FileText className="w-4 h-4" />}
            onClick={() => router.push("/dashboard/content")} 
          />
          <NavButton 
            label="Emails" 
            icon={<Mail className="w-4 h-4" />}
            onClick={() => router.push("/dashboard/email")} 
          />
          <NavButton 
            label="Ads" 
            icon={<Megaphone className="w-4 h-4" />}
            onClick={() => router.push("/dashboard/ads")} 
          />
          <NavButton 
            label="My Work" 
            icon={<Briefcase className="w-4 h-4" />}
            onClick={() => router.push("/dashboard/work")} 
          />
        </nav>

        {/* Avatar */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMenuOpen(true)}
          className="relative group"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-300" />
          
          {/* Avatar circle */}
          <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-sm font-semibold flex items-center justify-center border border-white/20 shadow-lg">
            {name}
          </div>
          
          {/* Plan badge */}
          <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-[10px] font-bold text-white border border-white/20 shadow-lg">
            {plan.charAt(0)}
          </div>
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
function NavButton({ 
  label, 
  icon,
  onClick 
}: { 
  label: string; 
  icon?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group relative px-4 py-2.5 rounded-xl text-sm font-medium 
      text-gray-400 hover:text-white 
      bg-transparent hover:bg-white/5 
      border border-transparent hover:border-white/10
      transition-all duration-300 flex items-center gap-2"
    >
      {icon && <span className="opacity-60 group-hover:opacity-100 transition-opacity duration-300">{icon}</span>}
      <span>{label}</span>
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-3/4 transition-all duration-300" />
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Menu Panel */}
          <motion.aside
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-6 top-24 w-80 rounded-3xl 
            bg-gradient-to-br from-slate-900/95 to-black/95 
            backdrop-blur-2xl
            border border-white/10 
            shadow-2xl shadow-black/50
            text-white z-50 overflow-hidden"
          >
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="relative">
              {/* Header */}
              <div className="px-6 pt-6 pb-5 border-b border-white/10">
                <button
                  onClick={onClose}
                  className="absolute right-5 top-5 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 blur-md opacity-50" />
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center text-xl font-bold border border-white/20 shadow-lg">
                      {name}
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                      Current Plan
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold capitalize bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {subscriptionPlan}
                      </p>
                      {subscriptionPlan !== "Free" && (
                        <div className="px-2 py-0.5 rounded-md bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
                          <span className="text-[10px] font-bold text-indigo-300 uppercase">Pro</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <MenuItem 
                  label="Dashboard" 
                  icon={<LayoutDashboard className="w-4 h-4" />}
                  onClick={() => { onClose(); router.push("/dashboard"); }} 
                />
                <MenuItem 
                  label="Profile" 
                  icon={<User className="w-4 h-4" />}
                  onClick={() => { onClose(); router.push("/dashboard/profile"); }} 
                />
                <MenuItem 
                  label="Billing" 
                  icon={<CreditCard className="w-4 h-4" />}
                  onClick={() => { onClose(); router.push("/billing"); }} 
                />
                <MenuItem 
                  label="Upgrade" 
                  icon={<Zap className="w-4 h-4" />}
                  onClick={() => { onClose(); router.push("/upgrade"); }} 
                />

                <div className="border-t border-white/10 mt-2 pt-2">
                  <MenuItem
                    label="Log Out"
                    icon={<LogOut className="w-4 h-4" />}
                    danger
                    onClick={() => {
                      localStorage.removeItem("autopilot_token");
                      router.push("/login");
                    }}
                  />
                </div>
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
  icon,
  onClick,
  danger = false,
}: {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ x: 6 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group w-full px-6 py-3.5 text-left text-sm font-medium transition-all duration-300 flex items-center gap-3 rounded-lg mx-2
      ${
        danger
          ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className={`transition-all duration-300 ${
        danger 
          ? "text-red-400 group-hover:text-red-300" 
          : "text-gray-500 group-hover:text-indigo-400"
      }`}>
        {icon}
      </span>
      <span>{label}</span>
    </motion.button>
  );
}