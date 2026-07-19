---
name: Klean
description: Calm-intelligence operations surface for a multi-branch laundry SaaS — primary surface is the operations dashboard, secondary surface is the public marketing site.
colors:
  primary: "#4F7DF3"
  primary-deep: "#3F6AE1"
  primary-shadow: "#3B63C9"
  primary-soft: "#EEF2FF"
  ink: "#0F172A"
  ink-muted: "#64748B"
  ink-faint: "#94A3B8"
  surface: "#F8FAFC"
  surface-raised: "#FFFFFF"
  surface-deep: "#1A2E56"
  surface-deepest: "#1E1B4B"
  accent-cool: "#26C1C9"
  success: "#10B981"
  error: "#EF4444"
  warning: "#F59E0B"
  info: "#3B82F6"
  border: "#E2E8F0"
  border-strong: "#CBD5E1"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontWeight: 500
    fontSize: "0.875rem"
    lineHeight: 1.5
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontWeight: 800
    fontSize: "0.6875rem"
    letterSpacing: "0.2em"
    textTransform: "uppercase"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
  button-ghost:
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  button-ghost-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
  input-default:
    textColor: "{colors.ink}"
    backgroundColor: "{colors.surface-raised}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "44px"
  input-focus:
    borderColor: "#818CF8"
  card-default:
    backgroundColor: "{colors.surface-raised}"
    rounded: "{rounded.md}"
    padding: "24px"
  badge-status:
    rounded: "{rounded.pill}"
    padding: "2px 8px"
---

# Design System: Klean

## 1. Overview

**Creative North Star: "Calm Intelligence."**

Klean is a multi-role SaaS for laundry and dry-cleaning operations. Its primary surface is the dashboard that branch managers and staff use all day; the public marketing site is a secondary surface. The system is designed to surface what needs attention, not everything that's happening. Every screen answers one question first; secondary information earns its place through density, not decoration.

The system explicitly rejects the three reflexes that surface too often in this category: generic admin templates, stock dashboard looks, and AI-scaffold tells. Concretely, the system prohibits Material-default feels, identical card grids, decorative gradients, the small-uppercase-kicker reflex, and the numbered-eyebrow reflex. The system's character is operational, not performative.

**Key Characteristics:**
- One screen, one question — primary surfaces lead with the answer; secondary info is one layer below.
- Density without clutter — operators read fast, so type and spacing are tuned for a three-second scan without making the screen hostile to a new user.
- Brand consistency across registers — the marketing site and the dashboard share tokens (color, type, motion) so a customer booking online and the manager fulfilling the order are visibly using the same product.
- Brand color carries weight, not surface area — Operational Blue is a focused signal, not a wallpaper.

## 2. Colors

The palette is anchored on a single saturated blue plus a slate ink and an off-white surface, with a deep navy for chrome (sidebar, footer, dark sections) and four status colors reserved for state communication.

### Primary
- **Operational Blue** (`#4F7DF3`): the action color. Reserved for the primary CTA on any screen, active nav state, focus rings, and brand accents (logo, selection, link hover). Where the user can do one thing, this is it.

### Secondary
- **Deep Cobalt** (`#3F6AE1`): the hover partner of Operational Blue. Used only as the hover state of primary actions. Not used independently elsewhere.
- **Indigo Shadow** (`#3B63C9`): the bottom of the brand gradient ramp, used in the logo's inner shadow and select header treatments. Used as a tonal partner, never as a fill.
- **Indigo Soft** (`#EEF2FF`): the tinted background for the "mira" brand button variant and soft-active states. 5–10% surface area.

### Tertiary
- **Cool Cyan** (`#26C1C9`): the selection accent (text selection background) and a single decorative highlight on the marketing site. Never used inside the dashboard.

### Neutral
- **Ink** (`#0F172A`): the default text color on light surfaces. Headlines, body, and form values.
- **Ink Muted** (`#64748B`): secondary text, descriptions, helper text, metadata.
- **Ink Faint** (`#94A3B8`): tertiary text, placeholders, disabled labels, captions.
- **Surface** (`#F8FAFC`): the dashboard page background, page-level wash.
- **Surface Raised** (`#FFFFFF`): cards, inputs, popovers, raised chrome on light surfaces.
- **Surface Deep** (`#1A2E56`): the footer background and a few dark marketing sections.
- **Surface Deepest** (`#1E1B4B`): the admin sidebar. Reserved for chrome that needs to recede behind the workspace.
- **Border** (`#E2E8F0`): default 1px border for cards, inputs, table dividers.
- **Border Strong** (`#CBD5E1`): hover border for inputs, focused divider lines.

### Status
- **Success** (`#10B981`), **Error** (`#EF4444`), **Warning** (`#F59E0B`), **Info** (`#3B82F6`): reserved for state communication (toasts, badges, form errors, status pills). Never used as decoration.

### Named Rules
**The Operational-Blue Rule.** Operational Blue occupies ≤10% of any given screen. Its rarity is the point. Wherever the eye lands, blue is the answer, not the wallpaper.

**The No-Decorative-Gradient Rule.** The primary action is a flat fill of Operational Blue (hover → Deep Cobalt). Gradients are permitted only inside the brand logo lockup, the loader's "drawing circle" indicator, and the dark surface of the admin sidebar. They are not a button, a card, or a section background.

**The No-Glassmorphism Rule.** `backdrop-filter: blur` is permitted only on the dark-mode toast container, the auth screen's split panel, and the public site's marketing hero where it sits on a real photograph. Inside the dashboard, blur is reserved for elevated popovers only. Never a default card surface.

## 3. Typography

**Display Font:** Inter (with `ui-sans-serif, system-ui, -apple-system` fallback)
**Body Font:** Inter (same stack)
**Label Font:** Inter (same stack — uppercase + tracking instead of a separate family)

**Character:** A single sans family across the whole system, used at different weights and tracking. Display and headlines lean on `font-weight: 900` + `letter-spacing: -0.04em` for compression; labels lean on `font-weight: 800` + `letter-spacing: 0.2em` + uppercase for industrial cadence. The absence of a second family is deliberate: the system earns its hierarchy through weight and tracking, not through typeface contrast.

### Hierarchy
- **Display** (Inter 900, 1.05, −0.04em): hero headlines on the marketing site and oversized KPI tiles on the dashboard. Cap at `clamp(2.5rem, 7vw, 6rem)` to keep the page from shouting.
- **Headline** (Inter 800, 1.1, −0.03em): section titles, page titles, large in-card values. Marketing site section leads and dashboard page titles.
- **Title** (Inter 700, 1.25, −0.01em): card titles, modal titles, table headers, list-item primary text.
- **Body** (Inter 500, 14px / 0.875rem, 1.5): default body. 65–75ch max line length. Placeholder color: Ink Faint at full opacity (placeholder is not decorative, it must hit 4.5:1).
- **Label** (Inter 800, 11px / 0.6875rem, 0.2em, uppercase): kickers, button labels, table column headers, status pills, chip text. The all-caps tracking is reserved for short labels, not for body.

### Named Rules
**The One-Family Rule.** Inter is the only typeface. Weight, tracking, and case carry the hierarchy. Adding a second family is a structural change, not a stylistic one — it requires a refresh of every screen.

**The Balanced-Headline Rule.** `text-wrap: balance` is required on every h1, h2, and h3. `text-wrap: pretty` on long prose. No orphan widows in section openers.

**The Label-Reserved Rule.** The uppercase tracked label is reserved for short labels (button text, kickers, status pills, table column headers). It is never used for body or paragraph copy.

## 4. Elevation

The system is **flat by default**. Surfaces are flat at rest. Depth appears only as a response to state — hover, focus, popover elevation, modal elevation. When shadows do appear, they are soft and short (low blur, low offset) — not the heavy long shadows of stock templates. Tonal layering (Surface vs Surface Raised) carries the resting hierarchy; shadows are reserved for things that have left the page plane.

### Shadow Vocabulary
- **Resting card** (`box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04)`): used on Table headers and a small subset of cards that need a touch of lift at rest.
- **Popover** (`box-shadow: 0 12px 24px -8px rgba(15, 23, 42, 0.12)`): dropdowns, command menus, popovers.
- **Modal** (`box-shadow: 0 24px 60px -12px rgba(15, 23, 42, 0.25)`): dialogs, drawers, full-page overlays.
- **Glow on primary** (`box-shadow: 0 12px 30px -10px rgba(79, 125, 243, 0.30)`): the primary CTA in marketing hero contexts. Reserved for the public site; the dashboard uses a flat fill.
- **Toast** (`box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.10)` / dark `0 12px 40px -12px rgba(0, 0, 0, 0.5)`): Sonner toast surface.

### Named Rules
**The Flat-At-Rest Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, elevation, focus) or on a small set of elements that conceptually leave the page plane (popover, modal, toast).

**The Soft-Shadow Rule.** Shadows are short and soft (low offset, low blur, low opacity). If a shadow looks like a 2014 app, the offset is too big and the blur is too small — pull both down and re-test.

## 5. Components

### Buttons
- **Shape:** rounded-2xl (16px) for the default, lg, and icon sizes; rounded-lg (8px) for sm.
- **Primary:** flat Operational Blue fill, white text, no border. Hover → Deep Cobalt. Active → scale 0.97. Focus ring → `0 0 0 4px rgba(79, 125, 243, 0.10)`.
- **Mira (signature brand variant):** Indigo Soft (`#EEF2FF`) background, Operational Blue text, Indigo Soft border. Used for non-primary brand touches inside the dashboard (e.g. "View report" on a card).
- **Outline:** white background, slate-200 border, slate-700 text. Hover → slate-50 background, slate-300 border.
- **Secondary:** slate-100 background, slate-900 text. Hover → slate-200.
- **Ghost:** transparent background, slate-600 text. Hover → slate-100, slate-900 text.
- **Destructive:** rose-50 background, rose-600 text, rose-200 border. Hover → rose-100.
- **Link:** Operational Blue text, underline on hover.

The legacy `default` gradient variant (indigo-600 → purple-600) is **deprecated** in favor of the flat primary. New work uses the flat primary; the gradient remains in code for backward compatibility only.

### Inputs
- **Shape:** rounded-md (12px). Height 44px. Border 1px slate-200.
- **Default state:** white background, slate-200 border, slate-900 text, slate-400 placeholder.
- **Hover:** slate-300 border, very faint slate-50 background tint.
- **Focus:** border shifts to indigo-400 (`#818CF8`), ring `0 0 0 4px rgba(79, 125, 243, 0.10)`.
- **Error:** border rose-400, text rose-900, focus ring rose-500/10. Inline error text in rose-600, 11px uppercase tracked.
- **Disabled:** slate-50 background, slate-400 text, slate-200 border, cursor-not-allowed.
- **With icon:** 11px left padding to accommodate a 40px icon container at 14px from the left edge.

### Cards / Containers
- **Corner Style:** rounded-md (12px). Never a different radius on cards vs their inner content.
- **Background:** Surface Raised (`#FFFFFF`) on a Surface (`#F8FAFC`) page.
- **Shadow Strategy:** flat by default. Optional resting shadow is the 1px/2px ambient variant in Elevation.
- **Border:** 1px Border (`#E2E8F0`) — preferred over shadow as the resting separator.
- **Internal Padding:** 24px (p-6). Dense data cards use 16px (p-4). Headers and footers align to the same horizontal padding.
- **Side-stripe borders are forbidden.** A 4px colored left border is reserved for the Sonner toast (`border-left: 4px solid currentColor` for status type), nowhere else.

### Navigation (Admin Sidebar)
- **Background:** Surface Deepest (`#1E1B4B`, indigo-950). Always dark.
- **Width:** 256px expanded, 80px collapsed. 300ms ease-out on collapse.
- **Item default:** transparent background, white/60 text, 12px (text-sm), font-semibold.
- **Item hover:** white/5 background, white text.
- **Item active:** subtle Operational Blue accent — left border 3px Operational Blue, white text, white/10 background. Not a full background fill.
- **Section dividers:** 1px white/10. No shadows inside the sidebar.

### Navigation (Public Header)
- **Default state:** transparent background, white text (sits on a dark hero photograph).
- **Scrolled state:** white background, Ink text, slate-50 inner chrome. 300ms ease-out on transition.
- **Active link:** Operational Blue text + slight scale (1.05) on hover.
- **CTA button in header:** flat Operational Blue, white text, lg (8px) radius, shadow-lg Operational Blue/20.

### Status Badges / Chips
- **Shape:** pill (full radius), 2px vertical × 8px horizontal padding, 10–11px font, uppercase, tracked.
- **Default neutral:** slate-100 background, slate-500 text.
- **Status colors:** Success / Error / Warning / Info follow the dedicated status colors. No decorative use of status colors.

### Toasts (Sonner)
- **Surface:** white in light mode, `#0d1117` in dark mode.
- **Border:** 1px `rgba(0,0,0,0.08)` light / `rgba(255,255,255,0.1)` dark.
- **Side accent:** 4px `currentColor` left border (the only sanctioned side-stripe). Color follows status type.
- **Icon container:** 40px square, 10px radius, `rgba(0,0,0,0.04)` light / `rgba(255,255,255,0.08)` dark.
- **Progress bar:** 3px `currentColor` at 30% opacity, animated by status-type duration (3s success, 4s info, 7s warning; error has no progress).
- **Mobile:** full-width minus 16px margin, stacked top-center.

### KPI / Stat Tiles
- **Shape:** rounded-md, white background, 1px border.
- **Layout:** label (uppercase tracked, slate-500) → big number (Headline weight, ink) → delta or supporting line (Body, slate-500).
- **No large gradient on the value. No gradient text. No oversized icon.** The number is the hero.

## 6. Do's and Don'ts

### Do:
- **Do** lead every primary surface with the answer to one question. Make the next action visible in a three-second scan.
- **Do** use Operational Blue for the primary action, the active nav state, the focus ring, and the brand accent. Nothing else.
- **Do** use the flat primary button for the main CTA. Hover → Deep Cobalt. Active → scale 0.97.
- **Do** cap display type at `clamp(2.5rem, 7vw, 6rem)`. Above 6rem the page is shouting, not designing.
- **Do** apply `text-wrap: balance` to every h1, h2, h3.
- **Do** verify body text hits ≥4.5:1 against its background. Bump body color toward ink if the muted gray is even close to failing.
- **Do** keep surfaces flat at rest. Use shadows only for hover, focus, popover, and modal elevation.
- **Do** provide a `prefers-reduced-motion` alternative for every animation — typically a crossfade or an instant transition.
- **Do** test the longest heading copy at every breakpoint. Headings that overflow their container on tablet are not "responsive."

### Don't:
- **Don't** use side-stripe borders (border-left or border-right greater than 1px as a colored accent) on cards, list items, callouts, or alerts. The 4px Sonner toast accent is the only sanctioned exception.
- **Don't** use gradient text (`background-clip: text` combined with a gradient). Emphasis via weight or size.
- **Don't** use glassmorphism as a default. Blur is permitted only on the auth panel, the marketing hero on a real photograph, the dark-mode toast, and popovers.
- **Don't** repeat the same identical card grid across a screen. Use cards only when they're the best affordance; nested cards are always wrong.
- **Don't** put a tiny uppercase tracked eyebrow above every section. The 2023-era "ABOUT / PROCESS / PRICING" kicker is the saturated AI scaffold. One named kicker as deliberate brand voice is allowed; an eyebrow on every section is AI grammar.
- **Don't** number sections (01 / 02 / 03) as default scaffolding. Numbers earn their place when the section is actually a sequence and the order carries information.
- **Don't** ship the deprecated indigo→purple button gradient. Use the flat primary.
- **Don't** use stock dashboard layouts: stats grid + bar chart + activity feed in a three-column template, copy-paste component libraries, Bootstrap-era blue. Custom composition per screen.
- **Don't** exceed 75ch body line length. Long heading words + large clamp scales + narrow grids cause overflow on tablet/mobile. Test, don't assume.
