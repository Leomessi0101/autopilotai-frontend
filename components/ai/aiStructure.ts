// components/ai/aiStructure.ts

/* ======================================================
   HERO
====================================================== */

export type HeroVariant =
  | "split_image"
  | "centered_text"
  | "image_background"
  | "minimal";

/**
 * Optional hero options that AI *may* set
 * without breaking older renderers
 */
export type HeroOptions = {
  cta_style?: "primary" | "secondary" | "ghost";
};

/* ======================================================
   SECTIONS (UNIVERSAL)
====================================================== */

/**
 * Core sections your renderer already supports well.
 */
export type CoreSectionType =
  | "highlight"
  | "about"
  | "services"
  | "trust"
  | "process"
  | "testimonial"
  | "faq"
  | "gallery"
  | "cta"
  | "contact"
  | "location";

/**
 * Universal “world” sections — works for nearly any business or project type.
 * Even if you don’t render all of these yet, the AI can plan with them.
 */
export type UniversalSectionType =
  | "features"
  | "pricing"
  | "plans"
  | "comparisons"
  | "faq" // duplicated intentionally OK (still same string)
  | "team"
  | "founders"
  | "story"
  | "mission"
  | "values"
  | "portfolio"
  | "projects"
  | "case_studies"
  | "clients"
  | "partners"
  | "testimonials"
  | "reviews"
  | "before_after"
  | "stats"
  | "press"
  | "awards"
  | "certifications"
  | "guarantees"
  | "process" // duplicated intentionally OK
  | "how_it_works"
  | "timeline"
  | "roadmap"
  | "blog"
  | "resources"
  | "downloads"
  | "newsletter"
  | "lead_magnet"
  | "contact" // duplicated intentionally OK
  | "hours"
  | "booking"
  | "appointment"
  | "map"
  | "faq"
  | "gallery" // duplicated intentionally OK
  | "video"
  | "social"
  | "community"
  | "events"
  | "calendar"
  | "shop"
  | "products"
  | "collections"
  | "menu"
  | "food_menu"
  | "drinks_menu"
  | "delivery"
  | "reservations";

/**
 * IMPORTANT:
 * Allow unknown future section keys without breaking TypeScript.
 * This prevents the system from “hard-locking” forever.
 */
export type SectionType = CoreSectionType | UniversalSectionType | (string & {});

/* ======================================================
   THEME
====================================================== */

export type ThemePalette = "light" | "dark";

export type AccentColor = "indigo" | "orange" | "emerald" | "neutral";

export type ThemeRadius = "sm" | "md" | "lg" | "xl";
export type ThemeDensity = "compact" | "comfortable" | "spacious";

/**
 * Theme is deterministic but extendable.
 * (Matches fields you already use in the renderer.)
 */
export type ThemeOptions = {
  palette: ThemePalette;
  accent: AccentColor;

  /**
   * Used by renderer today (optional for backward compat)
   */
  radius?: ThemeRadius;
  density?: ThemeDensity;

  /**
   * Reserved for future use
   */
  font?: string;
};

/* ======================================================
   FOOTER
====================================================== */

export type FooterVariant = "minimal" | "standard";

/* ======================================================
   AI STRUCTURE (CORE CONTRACT)
====================================================== */

export type AIStructure = {
  /**
   * HERO = layout decision only
   */
  hero: {
    variant: HeroVariant;
  } & HeroOptions;

  /**
   * SECTION ORDER (LEGO)
   * Now supports universal + unknown future section keys.
   */
  sections: SectionType[];

  /**
   * THEME DECISIONS
   */
  theme: ThemeOptions;

  /**
   * FOOTER STYLE
   */
  footer: {
    variant: FooterVariant;
  };

  /**
   * Optional plan/meta (you already pass this sometimes)
   */
  plan?: {
    name?: string;
    max_pages?: number;
    can_publish?: boolean;
  };
};
