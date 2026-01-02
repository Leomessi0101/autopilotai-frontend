"use client";

import { useState } from "react";

export default function MarketingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-white/10 bg-[#05070df0] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto h-20 px-6 md:px-10 flex items-center justify-between">
          
          {/* Logo */}
          <button
            onClick={() => (window.location.href = "/")}
            className="flex items-center gap-1 group"
          >
            <span className="text-2xl font-light tracking-wide text-white">
              AutopilotAI
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-300">
            <a href="/features" className="hover:text-white transition">
              Features
            </a>

            <a href="/pricing" className="hover:text-white transition">
              Pricing
            </a>

            <a href="/login" className="hover:text-white transition">
              Login
            </a>

            <a
              href="/register"
              className="px-10 py-4 rounded-xl font-medium bg-gradient-to-r from-[#1c2f57] to-[#2b4e8d] text-white shadow-[0_8px_40px_rgba(20,40,90,0.6)] hover:scale-[1.01] transition"
            >
              Get Started
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 7h16M4 12h16M4 17h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#05070d]">
          <nav className="px-6 py-8 space-y-6 text-base font-medium text-gray-200">
            <a
              href="/features"
              className="block hover:text-white transition"
              onClick={() => setOpen(false)}
            >
              Features
            </a>

            <a
              href="/pricing"
              className="block hover:text-white transition"
              onClick={() => setOpen(false)}
            >
              Pricing
            </a>

            <a
              href="/login"
              className="block hover:text-white transition"
              onClick={() => setOpen(false)}
            >
              Login
            </a>

            <a
              href="/register"
              className="block text-center px-10 py-4 rounded-xl font-medium bg-gradient-to-r from-[#1c2f57] to-[#2b4e8d] text-white shadow-[0_8px_40px_rgba(20,40,90,0.6)] hover:scale-[1.01] transition"
              onClick={() => setOpen(false)}
            >
              Get Started
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
