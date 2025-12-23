"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function MarketingNavbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 md:px-10 h-16 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-8">
          <h1
            onClick={() => router.push("/")}
            className="text-xl font-semibold tracking-tight cursor-pointer"
          >
            AutopilotAI<span className="text-amber-500">.</span>
          </h1>

          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <button onClick={() => router.push("/features")} className="hover:text-black transition">
              Features
            </button>

            <button onClick={() => router.push("/pricing")} className="hover:text-black transition">
              Pricing
            </button>

            <button onClick={() => router.push("/#how-it-works")} className="hover:text-black transition">
              How it works
            </button>

            <button onClick={() => router.push("/#faq")} className="hover:text-black transition">
              FAQ
            </button>
          </nav>
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => router.push("/login")}
            className="text-sm text-gray-700 hover:text-black transition"
          >
            Log in
          </button>

          <button
            onClick={() => router.push("/register")}
            className="px-5 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-900 transition"
          >
            Get Started
          </button>
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border"
        >
          ☰
        </button>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/30"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              <motion.div
                initial={{ x: 120, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 120, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 p-8 flex flex-col gap-6"
              >
                <button className="text-right" onClick={() => setOpen(false)}>
                  ✕
                </button>

                <button onClick={() => router.push("/features")} className="text-lg text-left">
                  Features
                </button>

                <button onClick={() => router.push("/pricing")} className="text-lg text-left">
                  Pricing
                </button>

                <button onClick={() => router.push("/#how-it-works")} className="text-lg text-left">
                  How it works
                </button>

                <button onClick={() => router.push("/#faq")} className="text-lg text-left">
                  FAQ
                </button>

                <div className="mt-auto flex flex-col gap-3">
                  <button
                    onClick={() => router.push("/login")}
                    className="w-full py-3 rounded-full border"
                  >
                    Log in
                  </button>

                  <button
                    onClick={() => router.push("/register")}
                    className="w-full py-3 rounded-full bg-black text-white"
                  >
                    Get Started
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
