"use client";

import { useState } from "react";

export default function MarketingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto h-16 px-4 md:px-8 flex items-center justify-between">

        {/* LOGO */}
        <button
          onClick={() => (window.location.href = "/")}
          className="flex items-center gap-1 group"
        >
          <span className="text-[21px] md:text-[23px] leading-none font-black tracking-tight text-gray-900 group-hover:tracking-[0.8px] transition-all">
            AutopilotAI
          </span>
          <span className="text-amber-500 text-2xl leading-none font-black">
            .
          </span>
        </button>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-7 text-[14px] font-medium text-gray-600">
          <a
            href="/features"
            className="hover:text-black transition-all hover:-translate-y-[2px]"
          >
            Features
          </a>

          <a
            href="/pricing"
            className="hover:text-black transition-all hover:-translate-y-[2px]"
          >
            Pricing
          </a>

          <a
            href="/login"
            className="hover:text-black transition-all hover:-translate-y-[2px]"
          >
            Login
          </a>

          <a
            href="/register"
            className="ml-1 px-6 py-2.5 rounded-full bg-black text-white shadow-[0_5px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_22px_rgba(0,0,0,0.35)] hover:bg-gray-900 transition-all"
          >
            Get Started
          </a>
        </nav>

        {/* MOBILE BUTTON */}
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

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-5 py-4 space-y-4 text-base text-gray-800">
          <a
            href="/features"
            className="block hover:text-amber-600 transition"
            onClick={() => setOpen(false)}
          >
            Features
          </a>

          <a
            href="/pricing"
            className="block hover:text-amber-600 transition"
            onClick={() => setOpen(false)}
          >
            Pricing
          </a>

          <a
            href="/login"
            className="block hover:text-amber-600 transition"
            onClick={() => setOpen(false)}
          >
            Login
          </a>

          <a
            href="/register"
            className="block text-center mt-2 px-6 py-3 rounded-full bg-black text-white hover:bg-gray-900 transition shadow-lg"
            onClick={() => setOpen(false)}
          >
            Get Started
          </a>
        </div>
      )}
    </header>
  );
}
