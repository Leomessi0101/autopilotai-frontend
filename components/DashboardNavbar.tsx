"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LogOut, User, CreditCard, Zap, LayoutDashboard,
  FileText, Mail, Megaphone, Briefcase, ChevronDown,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Dashboard", icon: <LayoutDashboard size={14} />, href: "/dashboard" },
  { label: "Content",   icon: <FileText size={14} />,        href: "/dashboard/content" },
  { label: "Emails",    icon: <Mail size={14} />,            href: "/dashboard/email" },
  { label: "Ads",       icon: <Megaphone size={14} />,       href: "/dashboard/ads" },
  { label: "My Work",   icon: <Briefcase size={14} />,       href: "/dashboard/work" },
];

export default function DashboardNavbar({
  name = "U",
  subscriptionPlan,
}: {
  name?: string;
  subscriptionPlan?: string | null;
}) {
  const router   = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef  = useRef<HTMLDivElement>(null);

  const plan = subscriptionPlan ?? "free";
  const isPaid = plan !== "free";

  // Close menu on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

        .nav-root {
          position: sticky; top: 0; z-index: 100;
          background: rgba(10,10,10,0.92);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid #1a1a1a;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .nav-inner {
          max-width: 1100px; margin: 0 auto;
          padding: 0 24px; height: 60px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 24px;
        }

        /* Logo */
        .nav-logo {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: 20px; color: white;
          background: none; border: none;
          cursor: pointer; padding: 0; letter-spacing: -0.02em;
          flex-shrink: 0; text-decoration: none;
          transition: opacity .2s;
        }
        .nav-logo:hover { opacity: .75; }
        .nav-logo span { color: #059669; }

        /* Nav links */
        .nav-links {
          display: flex; align-items: center; gap: 2px; flex: 1;
          justify-content: center;
        }
        .nav-link {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 13px; border-radius: 9px;
          font-size: 13px; font-weight: 600; color: #555;
          background: none; border: none; cursor: pointer;
          transition: color .18s, background .18s;
          text-decoration: none; white-space: nowrap;
          font-family: 'DM Sans', system-ui, sans-serif;
          position: relative;
        }
        .nav-link:hover { color: #ccc; background: #161616; }
        .nav-link.active { color: white; background: #161616; }
        .nav-link.active::after {
          content: '';
          position: absolute; bottom: -1px; left: 12px; right: 12px;
          height: 2px; border-radius: 2px;
          background: linear-gradient(90deg, #059669, #0ea5e9);
        }
        .nav-link-icon { opacity: .5; display: flex; }
        .nav-link.active .nav-link-icon { opacity: 1; color: #059669; }

        /* Avatar button */
        .nav-avatar-btn {
          display: flex; align-items: center; gap: 9px;
          background: #111; border: 1px solid #222;
          border-radius: 100px; padding: 5px 12px 5px 5px;
          cursor: pointer; transition: border-color .18s, background .18s;
          flex-shrink: 0;
        }
        .nav-avatar-btn:hover { border-color: #333; background: #161616; }
        .nav-avatar-circle {
          width: 30px; height: 30px; border-radius: 50%;
          background: linear-gradient(135deg, #059669, #0ea5e9);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 800; color: white;
          flex-shrink: 0;
        }
        .nav-avatar-name {
          font-size: 13px; font-weight: 600; color: #ccc;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .nav-avatar-chevron { color: #444; }

        /* Plan badge */
        .nav-plan-badge {
          font-size: 10px; font-weight: 800; letter-spacing: .06em;
          text-transform: uppercase; padding: 2px 7px; border-radius: 100px;
        }
        .nav-plan-badge.paid {
          background: rgba(5,150,105,.15);
          border: 1px solid rgba(5,150,105,.3);
          color: #4ade80;
        }
        .nav-plan-badge.free {
          background: #1a1a1a; border: 1px solid #2a2a2a; color: #555;
        }

        /* Dropdown */
        .nav-dropdown {
          position: fixed; top: 68px; right: 24px;
          width: 260px;
          background: #111; border: 1px solid #222;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.04);
          z-index: 200;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .nav-dropdown-header {
          padding: 18px 20px 14px;
          border-bottom: 1px solid #1a1a1a;
          display: flex; align-items: center; gap: 12px;
        }
        .nav-dd-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          background: linear-gradient(135deg, #059669, #0ea5e9);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 800; color: white; flex-shrink: 0;
        }
        .nav-dd-plan-name {
          font-size: 14px; font-weight: 700; color: white;
          text-transform: capitalize;
        }
        .nav-dd-plan-sub {
          font-size: 11px; color: #555; margin-top: 1px;
        }
        .nav-dropdown-items { padding: 6px; }
        .nav-dd-item {
          width: 100%; display: flex; align-items: center; gap: 11px;
          padding: 10px 12px; border-radius: 10px;
          background: none; border: none; cursor: pointer;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 13px; font-weight: 600; color: #888;
          text-align: left; transition: background .15s, color .15s;
        }
        .nav-dd-item:hover { background: #1a1a1a; color: #ccc; }
        .nav-dd-item.danger { color: #7f1d1d; }
        .nav-dd-item.danger:hover { background: rgba(127,29,29,.15); color: #f87171; }
        .nav-dd-item-icon { color: #444; display: flex; flex-shrink: 0; }
        .nav-dd-item:hover .nav-dd-item-icon { color: #059669; }
        .nav-dd-item.danger .nav-dd-item-icon { color: #7f1d1d; }
        .nav-dd-item.danger:hover .nav-dd-item-icon { color: #f87171; }
        .nav-dd-divider { height: 1px; background: #1a1a1a; margin: 4px 6px; }

        /* Mobile */
        @media (max-width: 760px) {
          .nav-links { display: none; }
          .nav-avatar-name { display: none; }
          .nav-avatar-chevron { display: none; }
        }
      `}</style>

      <header className="nav-root">
        <div className="nav-inner">

          {/* Logo */}
          <button className="nav-logo" onClick={() => router.push("/dashboard")}>
            Autopilot<span>AI</span>
          </button>

          {/* Nav links */}
          <nav className="nav-links">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname?.startsWith(link.href));
              return (
                <button
                  key={link.href}
                  className={`nav-link ${isActive ? "active" : ""}`}
                  onClick={() => router.push(link.href)}
                >
                  <span className="nav-link-icon">{link.icon}</span>
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Avatar / menu trigger */}
          <div ref={menuRef} style={{ position: "relative" }}>
            <button
              className="nav-avatar-btn"
              onClick={() => setMenuOpen((p) => !p)}
            >
              <div className="nav-avatar-circle">{name}</div>
              <span className="nav-avatar-name">{name}</span>
              <span className={`nav-plan-badge ${isPaid ? "paid" : "free"}`}>
                {isPaid ? plan : "Free"}
              </span>
              <ChevronDown
                size={13}
                className="nav-avatar-chevron"
                style={{ transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }}
              />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  className="nav-dropdown"
                  initial={{ opacity: 0, y: -8, scale: .97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: .97 }}
                  transition={{ duration: .18, ease: "easeOut" }}
                >
                  {/* Header */}
                  <div className="nav-dropdown-header">
                    <div className="nav-dd-avatar">{name}</div>
                    <div>
                      <div className="nav-dd-plan-name">{plan} plan</div>
                      <div className="nav-dd-plan-sub">
                        {isPaid ? "Premium features active" : "Free tier · upgrade anytime"}
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="nav-dropdown-items">
                    {[
                      { label: "Dashboard", icon: <LayoutDashboard size={14} />, href: "/dashboard" },
                      { label: "Profile",   icon: <User size={14} />,            href: "/dashboard/profile" },
                      { label: "Billing",   icon: <CreditCard size={14} />,      href: "/billing" },
                      { label: "Upgrade",   icon: <Zap size={14} />,             href: "/upgrade" },
                    ].map((item) => (
                      <button
                        key={item.label}
                        className="nav-dd-item"
                        onClick={() => { setMenuOpen(false); router.push(item.href); }}
                      >
                        <span className="nav-dd-item-icon">{item.icon}</span>
                        {item.label}
                      </button>
                    ))}

                    <div className="nav-dd-divider" />

                    <button
                      className="nav-dd-item danger"
                      onClick={() => {
                        localStorage.removeItem("autopilot_token");
                        router.push("/login");
                      }}
                    >
                      <span className="nav-dd-item-icon"><LogOut size={14} /></span>
                      Log out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </header>
    </>
  );
}