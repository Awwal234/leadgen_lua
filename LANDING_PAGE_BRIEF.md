# Landing Page Design Brief — Lead Gen SDR Tool (Free Tier Signup)

## 1. Feature Summary

A public marketing landing page at `/` (accessible to unauthenticated users) that converts visitors into free-tier users of an AI-powered SDR research tool. The product runs a 4-stage pipeline (Research → Pain Points → Decision Makers → Outreach) on target accounts. Target audience: SDRs, founders, growth teams at B2B companies — mixed traffic (cold + warm), skeptical but curious. Primary conversion: "Start free" → register → immediate access to the workspace.

## 2. Primary User Action

**Click "Start free" → land on register page → create account → immediately use the product.**

No credit card. No demo request. No waitlist. The page must make the value concrete enough that signing up feels like the obvious next step.

## 3. Design Direction

**Expresses the brand (calm, capable, opinionated) through:**
- **Calm**: Generous whitespace, restrained color, no false urgency (no countdown timers, no "limited spots")
- **Capable**: Shows the actual pipeline flow visually. Technical depth visible but not overwhelming.
- **Opinionated**: The page structure *is* the product narrative — Research → Pain Points → Decision Makers → Outreach. Each section demonstrates one stage.

**Visual language**: Light mode, editorial typography (distinctive display + refined body), single accent color (~10% usage), real-looking illustrated pipeline outputs (not abstract illustrations), subtle motion on scroll (staggered reveals).

**Differentiation**: Most SDR tool landing pages show generic dashboards. This page shows the *workflow* — the 4-stage pipeline — as the hero. Visitors understand the product by seeing the process.

## 4. Layout Strategy

**Single-page, long-form, scroll-driven narrative.** Sections map 1:1 to pipeline stages.

| Section | Purpose | Visual Weight |
|---------|---------|---------------|
| **Hero** | Hook + primary CTA + pipeline preview | Highest — largest type, accent CTA |
| **How it works (Pipeline)** | 4-stage visual walkthrough | High — the core differentiator |
| **Stage deep-dives** (4×) | Each stage: input → process → output example | Medium — scannable, illustrated |
- Research: company intel, news, tech stack, funding
- Pain Points: AI-identified challenges with evidence
- Decision Makers: contact info with confidence scores
- Outreach: generated email + LinkedIn sequences
| **Social proof / trust** | Logos, metrics, or "used by teams at..." | Low — minimal for MVP, designed for future |
| **FAQ / objections** | Address: data sources, accuracy, integration, pricing | Low — collapsible |
| **Footer CTA** | Final conversion push | Medium — sticky on mobile |

**Rhythm**: Tight spacing within stage cards (related content groups). Generous separation between major sections (visual breathing room). Asymmetric layouts for stage deep-dives (image left, text right / alternating) to avoid grid monotony.

**Mobile**: Single column, same order. Pipeline visual collapses to vertical stepper. Illustrations scale down but remain legible.

## 5. Key States

| State | Trigger | What User Sees/Feels |
|-------|---------|---------------------|
| **Default** | Page load | Full page, all sections loaded, subtle scroll reveals |
| **Loading** | Slow network | Skeleton placeholders for illustrations, CTA disabled but visible |
| **Error** | JS failure / network | Inline toast, CTA still works (progressive enhancement — form submits to `/register` without JS) |
| **Success (post-submit)** | Register API returns | Redirect to app (handled by auth flow) — page doesn't handle this |
| **Reduced motion** | `prefers-reduced-motion` | No scroll reveals, no parallax, instant state changes |
| **Small viewport** | < 640px | Stacked layout, touch-friendly tap targets (44px min), compressed vertical rhythm |

## 6. Interaction Model

- **Scroll**: Primary navigation. IntersectionObserver triggers staggered fade/slide-up reveals per section (respects `prefers-reduced-motion`).
- **Primary CTA ("Start free")**: Fixed in hero, repeated in footer CTA bar (sticky on mobile). Click → navigate to `/register` (guest layout).
- **Stage cards**: Hover reveals subtle depth (shadow elevation), no complex interactions. Click does nothing (not links).
- **FAQ accordions**: Keyboard accessible, single-open or multi-open.
- **Illustrated outputs**: Static images (SVG/PNG) — no interactive demo for MVP.
- **Anchor links**: Optional sticky nav on desktop for jumping to stages.

## 7. Content Requirements

### Hero
- **Headline**: ~8-10 words. Concrete outcome. Example: "Research target accounts. Find decision makers. Write outreach that replies."
- **Subhead**: 1 sentence expanding the hook. "AI pipeline that turns a company name into researched outreach in 4 steps."
- **CTA**: "Start free — no credit card required"
- **Pipeline preview**: Mini horizontal stepper showing 4 stages with tiny output previews

### Pipeline Overview (How it works)
- 4 columns (desktop) / vertical stepper (mobile)
- Each: Stage number, name, 1-line output description, tiny illustration

### Stage Deep-Dives (×4)
Each needs:
- **Stage label** (Research / Pain Points / Decision Makers / Outreach)
- **Input description**: "Give us a company name"
- **Process description**: "AI agents research web, news, job postings, funding data..."
- **Output example**: Illustrated mock of actual JSON/UI output (company summary, pain point cards, contact card, email draft)
- **Key metric/claim**: "30 sec vs 4 hrs manual" / "87% email validity" / etc.

### Trust Section (MVP placeholder)
- "Used by teams at [placeholder logos]" — designed for 5 logo slots
- One metric row: "2,400+ leads researched this month" (placeholder)

### FAQ (6-8 items)
- Is my data used for training?
- What sources do you search?
- How accurate are the emails?
- Can I integrate with my CRM?
- What's the free tier limit?
- Do you support non-English markets?
- Can I export the research?
- How does the AI avoid hallucinations?

### Footer CTA Bar
- Headline: "Your first researched lead is 30 seconds away"
- CTA: "Start free"
- Micro-copy: "No credit card • Cancel anytime • 100 leads/mo free"

## 8. Recommended Implementation References

- `reference/spatial-design.md` — fluid spacing, asymmetric layouts, container queries for stage cards
- `reference/typography.md` — modular scale, display/body pairing, fluid clamp() for hero headline
- `reference/color-and-contrast.md` — OKLCH palette, neutral tinting, 60-30-10 application
- `reference/motion-design.md` — scroll reveals, staggered entrances, reduced motion
- `reference/interaction-design.md` — FAQ accordions, CTA focus states, form navigation

## 9. Open Questions

1. **Route structure**: Should landing page be at `/` (public) with dashboard at `/app`? Current router has `/` as authenticated dashboard. Need to restructure.
2. **Illustration assets**: Who creates the 4 stage output illustrations? (SVG? PNG? Figma export?)
3. **Analytics**: Any event tracking needed on CTA clicks, scroll depth?
4. **SEO**: Meta tags, Open Graph, structured data for SaaS product?
5. **Performance budget**: Target LCP < 2.5s, no heavy JS bundles — keep it mostly static HTML/CSS with minimal Vue hydration?
6. **Copy**: Final headlines/subheads — use placeholder for now or wait for approved copy?

---

**Confirm this brief?** If agreed, I'll proceed to implementation with `/impeccable craft`.