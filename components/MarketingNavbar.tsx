"use client";

import { useState } from "react";

export default function MarketingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto h-16 px-5 md:px-8 flex items-center justify-between">
        {/* LOGO */}
        <button
          onClick={() => (window.location.href = "/")}
          className="flex items-center gap-1 cursor-pointer"
        >
          <span className="text-xl md:text-2xl font-extrabold tracking-tight text-gray-900">
            AutopilotAI
          </span>
          <span className="text-amber-500 text-2xl leading-none">.</span>
        </button>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <a
            href="/features"
            className="hover:text-gray-900 hover:-translate-y-0.5 transition-all"
          >
            Features
          </a>
          <a
            href="/pricing"
            className="hover:text-gray-900 hover:-translate-y-0.5 transition-all"
          >
            Pricing
          </a>
          <a
            href="/login"
            className="hover:text-gray-900 hover:-translate-y-0.5 transition-all"
          >
            Login
          </a>

          <a
            href="/register"
            className="px-6 py-2 rounded-full bg-black text-white shadow-md hover:bg-gray-900 hover:shadow-lg transition-all text-sm"
          >
            Get Started
          </a>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden inline-flex items-center justify-center"
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

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-5 py-4 space-y-3 text-base text-gray-700">
          <a
            href="/features"
            className="block hover:text-amber-600 transition-colors"
            onClick={() => setOpen(false)}
          >
            Features
          </a>
          <a
            href="/pricing"
            className="block hover:text-amber-600 transition-colors"
            onClick={() => setOpen(false)}
          >
            Pricing
          </a>
          <a
            href="/login"
            className="block hover:text-amber-600 transition-colors"
            onClick={() => setOpen(false)}
          >
            Login
          </a>

          <a
            href="/register"
            className="block text-center mt-2 px-6 py-3 rounded-full bg-black text-white hover:bg-gray-900 transition-all shadow-md"
            onClick={() => setOpen(false)}
          >
            Get Started
          </a>
        </div>
      )}
    </header>
  );
}
