"use client";

import { useState } from "react";

export default function MarketingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto h-20 px-6 md:px-10 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => (window.location.href = "/")}
          className="flex items-center gap-1 group"
        >
          <span className="text-2xl font-light tracking-wide text-gray-900">
            AutopilotAI
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-700">
          <a
            href="/features"
            className="hover:text-blue-900 transition"
          >
            Features
          </a>

          <a
            href="/pricing"
            className="hover:text-blue-900 transition"
          >
            Pricing
          </a>

          <a
            href="/login"
            className="hover:text-blue-900 transition"
          >
            Login
          </a>

          <a
            href="/register"
            className="px-10 py-4 bg-blue-900 text-white rounded-xl font-medium hover:bg-blue-800 transition shadow-sm"
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
            className="w-7 h-7 text-gray-900"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-6 py-8 space-y-6 text-base font-medium text-gray-800">
            <a
              href="/features"
              className="block hover:text-blue-900 transition"
              onClick={() => setOpen(false)}
            >
              Features
            </a>

            <a
              href="/pricing"
              className="block hover:text-blue-900 transition"
              onClick={() => setOpen(false)}
            >
              Pricing
            </a>

            <a
              href="/login"
              className="block hover:text-blue-900 transition"
              onClick={() => setOpen(false)}
            >
              Login
            </a>

            <a
              href="/register"
              className="block text-center px-10 py-4 bg-blue-900 text-white rounded-xl font-medium hover:bg-blue-800 transition shadow-sm"
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