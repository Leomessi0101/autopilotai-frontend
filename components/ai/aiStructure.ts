// components/ai/aiStructure.ts

export type HeroVariant =
  | "split_image"
  | "centered_text"
  | "image_background"
  | "minimal";

export type SectionType =
  | "trust"
  | "about"
  | "services"
  | "process"
  | "testimonial"
  | "cta";

export type ThemePalette = "light" | "dark";
export type AccentColor = "indigo" | "orange" | "emerald" | "neutral";

export type AIStructure = {
  hero: {
    variant: HeroVariant;
  };

  sections: SectionType[]; // ORDER MATTERS

  theme: {
    palette: ThemePalette;
    accent: AccentColor;
  };

  footer: {
    variant: "minimal" | "standard";
  };
};
