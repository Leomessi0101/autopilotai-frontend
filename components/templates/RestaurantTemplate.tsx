"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/* ======================================================
   TYPES
====================================================== */

type HeroVariant =
  | "hero_image_overlay"
  | "hero_centered"
  | "hero_split"
  | "hero_minimal"
  | "hero_full_image"
  | "hero_text_left";

type MenuVariant =
  | "menu_list"
  | "menu_cards"
  | "menu_images"
  | "menu_compact";

type FooterVariant =
  | "footer_simple"
  | "footer_columns"
  | "footer_centered";

type ThemeVariant =
  | "dark_gold"
  | "dark_minimal"
  | "light_clean"
  | "earthy"
  | "modern";

type ContentState = {
  hero_variant: HeroVariant;
  menu_variant: MenuVariant;
  footer_variant: FooterVariant;
  theme: ThemeVariant;

  hero: {
    headline: string;
    subheadline: string;
    image: string | null;
  };

  menu: {
    title: string;
    items: {
      name: string;
      description: string;
      price: string;
      image?: string;
    }[];
  }[];

  contact: {
    phone: string;
    email: string;
  };

  location: {
    address: string;
    city: string;
  };

  hours: {
    mon_fri: string;
    sat_sun: string;
  };
};

/* ======================================================
   NORMALIZE (CRITICAL FOR OLD DATA)
====================================================== */

function normalizeContent(raw: any, username: string): ContentState {
  return {
    hero_variant: raw?.hero_variant || "hero_image_overlay",
    menu_variant: raw?.menu_variant || "menu_list",
    footer_variant: raw?.footer_variant || "footer_simple",
    theme: raw?.theme || "dark_gold",

    hero: {
      headline: raw?.hero?.headline || username,
      subheadline: raw?.hero?.subheadline || "",
      image: raw?.hero?.image || null,
    },

    menu: Array.isArray(raw?.menu) ? raw.menu : [],

    contact: {
      phone: raw?.contact?.phone || "",
      email: raw?.contact?.email || "",
    },

    location: {
      address: raw?.location?.address || "",
      city: raw?.location?.city || "",
    },

    hours: {
      mon_fri: raw?.hours?.mon_fri || "11:00 – 22:00",
      sat_sun: raw?.hours?.sat_sun || "12:00 – 23:00",
    },
  };
}

/* ======================================================
   HERO LEGO VARIANTS
====================================================== */

function Hero({ c }: { c: ContentState }) {
  switch (c.hero_variant) {
    case "hero_centered":
      return (
        <section className="min-h-[70vh] flex items-center justify-center text-center">
          <div>
            <h1 className="text-5xl font-bold">{c.hero.headline}</h1>
            <p className="mt-4 opacity-80">{c.hero.subheadline}</p>
          </div>
        </section>
      );

    case "hero_split":
      return (
        <section className="grid md:grid-cols-2 min-h-[70vh]">
          <div className="flex items-center p-10">
            <div>
              <h1 className="text-5xl font-bold">{c.hero.headline}</h1>
              <p className="mt-4">{c.hero.subheadline}</p>
            </div>
          </div>
          <div
            className="bg-cover bg-center"
            style={{ backgroundImage: `url(${c.hero.image})` }}
          />
        </section>
      );

    case "hero_full_image":
      return (
        <section
          className="min-h-[80vh] bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `url(${c.hero.image})` }}
        >
          <h1 className="text-6xl font-bold bg-black/60 p-6 rounded">
            {c.hero.headline}
          </h1>
        </section>
      );

    case "hero_minimal":
      return (
        <section className="py-32 text-center">
          <h1 className="text-4xl font-semibold">{c.hero.headline}</h1>
        </section>
      );

    case "hero_text_left":
      return (
        <section className="py-32 px-10">
          <h1 className="text-5xl font-bold">{c.hero.headline}</h1>
          <p className="mt-4 max-w-xl">{c.hero.subheadline}</p>
        </section>
      );

    default:
      return (
        <section className="relative min-h-[75vh] flex items-center justify-center">
          {c.hero.image && (
            <img
              src={c.hero.image}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="relative z-10 text-center">
            <h1 className="text-5xl font-bold">{c.hero.headline}</h1>
            <p className="mt-4">{c.hero.subheadline}</p>
          </div>
        </section>
      );
  }
}

/* ======================================================
   MENU LEGO VARIANTS
====================================================== */

function Menu({ c }: { c: ContentState }) {
  if (!c.menu.length) return null;

  if (c.menu_variant === "menu_cards") {
    return (
      <section className="py-24 grid md:grid-cols-3 gap-6">
        {c.menu.flatMap((cat) =>
          cat.items.map((i, idx) => (
            <div key={idx} className="border p-6 rounded">
              <h3 className="font-semibold">{i.name}</h3>
              <p className="opacity-70">{i.description}</p>
              <div className="mt-2 font-bold">{i.price}</div>
            </div>
          ))
        )}
      </section>
    );
  }

  if (c.menu_variant === "menu_compact") {
    return (
      <section className="py-16">
        {c.menu.map((cat, idx) => (
          <div key={idx}>
            <h2 className="font-bold mt-8">{cat.title}</h2>
            {cat.items.map((i, j) => (
              <div key={j} className="flex justify-between py-1">
                <span>{i.name}</span>
                <span>{i.price}</span>
              </div>
            ))}
          </div>
        ))}
      </section>
    );
  }

  // default list
  return (
    <section className="py-24">
      {c.menu.map((cat, idx) => (
        <div key={idx}>
          <h2 className="text-2xl font-semibold mb-4">{cat.title}</h2>
          {cat.items.map((i, j) => (
            <div key={j} className="mb-4">
              <div className="font-semibold">{i.name}</div>
              <div className="opacity-70">{i.description}</div>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}

/* ======================================================
   FOOTER LEGO VARIANTS
====================================================== */

function Footer({ c, username }: { c: ContentState; username: string }) {
  if (c.footer_variant === "footer_columns") {
    return (
      <footer className="py-20 grid md:grid-cols-3 gap-8 text-sm opacity-80">
        <div>{username}</div>
        <div>{c.contact.phone}</div>
        <div>{c.location.city}</div>
      </footer>
    );
  }

  if (c.footer_variant === "footer_centered") {
    return (
      <footer className="py-10 text-center opacity-60">
        © {new Date().getFullYear()} {username}
      </footer>
    );
  }

  return (
    <footer className="py-10 text-center opacity-50">
      Powered by AutopilotAI
    </footer>
  );
}

/* ======================================================
   MAIN COMPONENT
====================================================== */

export default function RestaurantTemplate({
  username,
  content: raw,
}: {
  username: string;
  content: any;
}) {
  const content = normalizeContent(raw, username);

  return (
    <main className="min-h-screen bg-black text-white">
      <Hero c={content} />
      <Menu c={content} />
      <Footer c={content} username={username} />
    </main>
  );
}
