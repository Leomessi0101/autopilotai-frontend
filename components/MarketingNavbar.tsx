"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function MarketingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-2xl supports-[backdrop-filter]:bg-black/20">
        <div className="max-w-7xl mx-auto h-20 px-6 md:px-10 flex items-center justify-between">
          
          {/* Logo */}
          <button
            onClick={() => (window.location.href = "/")}
            className="group flex items-center gap-2.5 hover:opacity-80 transition-opacity duration-300"
          >
            {/* Logo icon/accent */}
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a 
              href="/features" 
              className="text-gray-400 hover:text-white transition-colors duration-300 relative group"
            >
              <span>Features</span>
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>

            <a 
              href="/pricing" 
              className="text-gray-400 hover:text-white transition-colors duration-300 relative group"
            >
              <span>Pricing</span>
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>

            <a 
              href="/login" 
              className="text-gray-400 hover:text-white transition-colors duration-300 relative group"
            >
              <span>Login</span>
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>

            <a
              href="/register"
              className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 text-white overflow-hidden shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10">Get Started</span>
              <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300"
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5 text-white transition-transform duration-300"
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
        <div className="md:hidden border-b border-white/10 bg-black/60 backdrop-blur-2xl">
          <nav className="px-6 py-6 space-y-1">
            <a
              href="/features"
              className="block px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 font-medium"
              onClick={() => setOpen(false)}
            >
              Features
            </a>

            <a
              href="/pricing"
              className="block px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 font-medium"
              onClick={() => setOpen(false)}
            >
              Pricing
            </a>

            <a
              href="/login"
              className="block px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 font-medium"
              onClick={() => setOpen(false)}
            >
              Login
            </a>

            <div className="pt-3">
              <a
                href="/register"
                className="group relative flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 text-white overflow-hidden shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all duration-300"
                onClick={() => setOpen(false)}
              >
                <span className="relative z-10">Get Started</span>
                <ArrowRight className="relative z-10 w-4 h-4 group-active:translate-x-0.5 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-active:opacity-100 transition-opacity duration-300" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}