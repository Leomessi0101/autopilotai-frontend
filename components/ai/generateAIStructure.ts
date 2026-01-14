import type { AIStructure } from "./aiStructure";

/**
 * This is the deterministic "AI brain".
 * Later we can swap this with GPT.
 */
export function generateAIStructure(input: {
  businessType: "local" | "online" | "personal";
  goal: "leads" | "branding" | "sales";
}): AIStructure {
  // HERO SELECTION
  const heroVariant: AIStructure["hero"]["variant"] =
    input.goal === "branding"
      ? "image_background"
      : input.goal === "sales"
      ? "split_image"
      : "centered_text";

  // SECTION ORDER
  let sections: AIStructure["sections"] = [];

  if (input.businessType === "local") {
    sections = ["trust", "services", "process", "testimonial", "cta"];
  }

  if (input.businessType === "online") {
    sections = ["about", "services", "cta"];
  }

  if (input.businessType === "personal") {
    sections = ["about", "testimonial", "cta"];
  }

  // THEME
  const theme: AIStructure["theme"] =
    input.goal === "branding"
      ? {
          palette: "dark",
          accent: "indigo",
          font: "inter",
        }
      : {
          palette: "light",
          accent: "emerald",
          font: "inter",
        };

  return {
    hero: {
      variant: heroVariant,
      cta_style: "primary",
    },
    sections,
    theme,
    footer: {
      variant: "minimal",
    },
  };
}
