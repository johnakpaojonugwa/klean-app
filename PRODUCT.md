# Product

## Register

product

## Platform

web

## Users

**Primary audience — operations team (Branch Managers and Staff).** These are the people who open the dashboard every day, run order intake, move jobs through processing, manage inventory, and resolve customer issues. They are time-poor, often working across multiple browser tabs and a physical workspace, and they need the next action to be obvious at a glance.

A **secondary surface** exists at `/`, `/about`, `/services`, `/booking`, `/contact` — a public marketing site that acquires customers and drives bookings. It is a brand-register surface (design IS the product there) but is not the primary register of the app.

The Super Admin and end customers are real users in the codebase, but the design and information density of the product surface should be calibrated to the day-in, day-out operator.

## Product Purpose

Klean is a multi-role SaaS for laundry and dry-cleaning businesses: it runs the operations of a multi-branch cleaning service end to end — orders, inventory, employees, customers, invoices, reports, and live job tracking — behind a single role-aware dashboard.

Success means an operations manager can run a shift without fighting the tool: every order's status is clear, every inventory shortfall is visible, every customer interaction is logged, and every report is one click away. The dashboard is judged by how quietly it disappears into the workflow, not by how many features it shows.

## Positioning

**Calm intelligence** — surface what needs attention, not everything that's happening. Every screen answers one question first; secondary information earns its place.

## Brand Personality

Professional, clean, trustworthy — in three words: **steady, precise, reliable.** The current brand color (`#4F7DF3`) and ink (`#0F172A`) are correct anchors for this register and should be preserved.

The tone is operational: confident but not loud, specific but not academic. The product copy talks like a competent colleague, not a marketing site. The marketing site copy is warmer, but the dashboard copy is direct.

## Anti-references

What this product must NOT look like:

- **Generic admin templates.** No Material-default feels, no Tailwind UI kit defaults, no clipped card grids of identical size. Every screen earns its own density.
- **Stock dashboard look.** No Bootstrap-era blue, no obvious "stats grid + bar chart + activity feed" template, no copy-paste component library. Custom composition, not a theme.
- **AI scaffold tells.** No 2023-era "small uppercase kicker → big heading → paragraph" pattern on every section, no 01/02/03 numbered eyebrows everywhere, no identical card grids, no gradient text, no glassmorphism as a default. Each surface composes for its own purpose.

## Design Principles

1. **Calm intelligence, not data dump.** Default to surfacing what needs the operator's attention — overdue orders, low stock, exceptions, the next action. Hide what's nominal. Density is earned, not maxed.
2. **One screen, one question.** Each primary view answers a single question first ("What's overdue?" / "What needs to be packed?" / "What did we make this week?"). Secondary info is one layer below.
3. **The dashboard is the proof.** A laundry operations tool should feel like it was built by people who run laundry operations. Every flow should look like it's been used in a real branch.
4. **Density without clutter.** Operators read fast. Type, spacing, and grouping should let a trained eye scan a screen in under three seconds — without making it hostile to a new user.
5. **Brand consistency across both registers.** The marketing site and the dashboard share tokens (color, type, motion) so a customer who books online and the manager who fulfills the order are visibly using the same product.

## Accessibility & Inclusion

WCAG 2.1 AA across both public site and dashboard. The Sonner toast system, Radix UI primitives, and existing keyboard handling are the foundation; new work must preserve keyboard operability, respect `prefers-reduced-motion`, and meet contrast floors (4.5:1 body, 3:1 large text). Reduced motion is a hard requirement for every animation — not an optional polish.
