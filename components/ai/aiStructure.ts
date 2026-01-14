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
   SECTIONS
====================================================== */

export type SectionType =
  | "trust"
  | "about"
  | "services"
  | "process"
  | "testimonial"
  | "cta";

/* ======================================================
   THEME
====================================================== */

export type ThemePalette = "light" | "dark";

export type AccentColor =
  | "indigo"
  | "orange"
  | "emerald"
  | "neutral";

/**
 * Theme is deterministic but extendable
 */
export type ThemeOptions = {
  palette: ThemePalette;
  accent: AccentColor;

  /**
   * Reserved for future use
   * (fonts, radius, spacing, etc.)
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
};
