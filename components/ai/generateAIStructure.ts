import type { AIStructure } from "./aiStructure";

/**
 * FALLBACK STRUCTURE ONLY.
 * Backend AI is the source of truth.
 * This is used only if structure is missing.
 */
export function generateAIStructureFallback(): AIStructure {
  return {
    hero: {
      variant: "centered_text",
    },
    sections: ["about", "services", "cta"],
    theme: {
      palette: "light",
      accent: "indigo",
    },
    footer: {
      variant: "minimal",
    },
  };
}
