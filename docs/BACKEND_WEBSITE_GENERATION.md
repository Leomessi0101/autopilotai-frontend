# Backend website generation contract

This doc describes what the **backend API** (e.g. `POST /api/dashboard/websites/create` and the logic that fills `content_json` and `ai_structure_json`) must do so that **each generated website looks different and high quality**, instead of every site looking the same.

## Problem

If every response uses the same `theme` (e.g. always `palette: "light"`, `accent: "indigo"`), the same section order, and the same HTML structure, all sites will look identical except for text. The frontend now **respects** `structure.theme` and remaps common color classes to the chosen accent; the backend must **vary** that structure and content per business.

## What the backend must do

### 1. Vary `ai_structure_json.theme` by business type and prompt

- **`theme.palette`**: Choose `"light"` or `"dark"` based on:
  - Business type (e.g. restaurant / bar → often dark; bakery / clinic → often light), or
  - Explicit user preference, or
  - Random/semantic choice from the prompt.
- **`theme.accent`**: Choose **different** accent colors per site. Supported values:
  - `"indigo"` | `"emerald"` | `"orange"` | `"neutral"` | `"violet"` | `"rose"`

**Do not** always return the same theme. For example:
- Restaurant → e.g. `emerald` or `orange`, palette `dark` or `light` by vibe.
- Law firm → e.g. `neutral` or `indigo`, palette `light`.
- Salon / creative → e.g. `rose` or `violet`, palette as appropriate.

### 2. Vary section order and which sections exist

- **`structure.sections`**: Order and list of sections should depend on business type and prompt (e.g. restaurant → highlight, about, menu, gallery, contact; SaaS → hero, features, pricing, cta, contact).
- **`structure.hero.variant`**: Use `"split_image"` | `"centered_text"` | `"image_background"` | `"minimal"` and pick one that fits the business.
- **`structure.footer.variant`**: Use `"minimal"` or `"standard"` to add variety.

The frontend supports many section types (see `aiStructure.ts`: about, services, trust, process, testimonial, faq, gallery, ca, contact, location, features, pricing, team, portfolio, menu, etc.). The backend should **choose** a subset and order that matches the business.

### 3. Generate HTML that works with the frontend theme

- The frontend injects CSS variables (`--theme-accent`, `--theme-accent-hover`, `--theme-accent-soft`) and **overrides** common Tailwind-style classes (e.g. `.bg-indigo-500`, `.text-indigo-600`) so they use the chosen accent.
- So the backend can:
  - Either use **generic** accent classes (e.g. `bg-indigo-500`) and the frontend will remap them to the chosen theme accent, or
  - Use **semantic** classes / CSS variables (e.g. `background: var(--theme-accent)`) in inline styles or class names that the frontend defines.

Either way, **varying `structure.theme.accent` and `structure.theme.palette`** is required so each site looks different.

### 4. Improve AI prompts for quality and variety

- In the prompt to the AI that generates the site, **require**:
  - “Use a **different** color theme (accent and light/dark) that fits the business; do not always use indigo and light.”
  - “Choose section order and hero/footer variants that fit the business type.”
  - “Copy and tone must be **specific to this business**, not generic placeholders.”
- Optionally pass a **design directive** (e.g. “minimal”, “bold”, “premium”) and map that to `theme` and section set.

### 5. Response shape (reminder)

- **`content_json`**: Object with `business_name` and `sections` (keyed by section id). Each section: `{ html: string, data: Record<string, string>, images?: ... }`. Use `{{key}}` in HTML for editable text; `data` holds the values.
- **`ai_structure_json`**: Object with `hero`, `sections` (ordered list of section keys), `theme` (`palette`, `accent`), `footer`. This is the **source of truth** for layout and theme; the frontend uses it to apply palette and accent.

## Summary

| Backend change | Effect |
|----------------|--------|
| Vary `theme.palette` and `theme.accent` per site | Each site gets different colors and light/dark. |
| Vary `sections` order and set by business type | Each site has a relevant structure. |
| Vary `hero.variant` and `footer.variant` | Layout and feel differ per site. |
| Stronger AI instructions for variety and quality | Copy and design choices are business-specific and high quality. |

The frontend is now set up to **apply** whatever theme and structure the backend returns; the backend must **decide** different themes and structures so sites are not all the same.
