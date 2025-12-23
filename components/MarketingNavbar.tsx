"use client";

import { useState } from "react";

export default function MarketingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">

        {/* LOGO */}
        <h1
          onClick={() => (window.location.href = "/")}
          className="text-xl font-bold tracking-tight cursor-pointer"
        >
          AutopilotAI<span className="text-amber-500">.</span>
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">

          <a href="/features" className="hover:text-black transition">
            Features
          </a>

          <a href="/pricing" className="hover:text-black transition">
            Pricing
          </a>

          <a href="/login" className="hover:text-black transition">
            Login
          </a>

          <a
            href="/register"
            className="px-6 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-900 transition shadow-sm"
          >
            Get Started
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden"
        >
          <svg className="w-7 h-7" fill="none" stroke="black" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden border-t bg-white px-6 py-4 space-y-4 text-lg">
          <a href="/features" className="block hover:text-amber-500">
            Features
          </a>

          <a href="/pricing" className="block hover:text-amber-500">
            Pricing
          </a>

          <a href="/login" className="block hover:text-amber-500">
            Login
          </a>

          <a
            href="/register"
            className="block text-center px-6 py-3 rounded-xl bg-black text-white hover:opacity-90 shadow-sm"
          >
            Get Started
          </a>
        </div>
      )}
    </header>
  );
}
