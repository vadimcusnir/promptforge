# Mobile UI/UX Audit & Optimization Plan
## chatgpt-prompting.com

### A. Scope & Devices

**Breakpoints to validate:**
- XS/SM (primary): 320px, 360px, 390px, 414px, 430px
- MD (secondary): 480px, 600px, 768px
- Orientation: portrait + landscape
- Safe-area: iPhone (Dynamic Island/notch), Android punch-hole
- DPR: 2× and 3×

**Target platforms:**
- iOS Safari 16–18
- Android Chrome 118+
- Chrome iOS (WebKit)
- Firefox Android (sanity pass)

### B. Acceptance Criteria Checklist

#### 1) Layout & Readability
- [ ] No horizontal scroll; CLS ≤ 0.02
- [ ] Content fits safe-areas (CSS env(safe-area-inset-*))
- [ ] Tap targets ≥ 44×44px; controls have hit-slop
- [ ] Paragraph width 45–75ch; base font ≥ 16px
- [ ] Headings scale via fluid type
- [ ] Spacing rhythm 4/8/12/16/24/32
- [ ] Consistent vertical rhythm and section breathing
- [ ] Sticky elements never obscure content
- [ ] Keyboard overlap handled on forms

#### 2) Navigation & Gestures
- [ ] Header collapses predictably
- [ ] Hamburger is accessible
- [ ] Back doesn't trap
- [ ] Bottom-of-screen primary CTA visible and reachable
- [ ] Modals/Sheets use native-like gestures
- [ ] Avoid accidental page scroll under modal

#### 3) Forms & Inputs
- [ ] Correct input types (email, tel, url, number)
- [ ] Autofill and auto-cap off where needed
- [ ] Labels & errors persist
- [ ] Validation inline
- [ ] Submit disabled until valid
- [ ] Loading states
- [ ] Country code masks for phone
- [ ] Card fields delegated to Stripe (mobile-ready)

#### 4) Media & Performance
- [ ] Responsive images (sizes, srcset / next/image)
- [ ] No layout shift
- [ ] LCP ≤ 2.5s, INP p95 ≤ 200ms, TTI ≤ 3.5s
- [ ] Lazy-load below the fold
- [ ] Defer non-critical JS
- [ ] Avoid heavy GIFs
- [ ] Prefer CSS animation

#### 5) Accessibility (mobile)
- [ ] Contrast ≥ 4.5:1, visible focus
- [ ] prefers-reduced-motion respected
- [ ] Landmarks (header/nav/main/footer)
- [ ] Skip link
- [ ] Semantic form labels
- [ ] VoiceOver/TalkBack linear
- [ ] No hidden traps
- [ ] Actionable names read clearly

#### 6) States & Errors
- [ ] Skeletons for data fetch
- [ ] Timeouts with retry
- [ ] Empty states with helpful CTAs
- [ ] Offline/poor network resilience
- [ ] Show cached/placeholder copy
- [ ] Explain failures
- [ ] Paywall and entitlement errors
- [ ] Clear, non-blocking messaging with upgrade CTA

### C. Critical User Flows to Test

1. **Coming Soon → Waitlist**: open → fill form → submit → thank you → deep-link back
2. **Homepage → Generator**: select module → set 7-D → simulate → (Pro+) run real test → export
3. **Modules → Module detail**: read spec → run sample → return to list (no state loss)
4. **Pricing → Stripe test checkout**: plan select → paywall gating → trial flag reflected in UI
5. **Dashboard**: view runs, tightens prompts <80, export artifacts; no jank on scroll
6. **Docs → API copy**: copy endpoint + keys; long code blocks scroll horizontally only within block

### D. Issues Tracking

**Severity Levels:**
- **P0 (Blocker)**: Navigation broken, text unreadable, tap target <44px, blocking modals, CLS spikes
- **P1 (Major)**: Poor UX, accessibility issues, performance problems
- **P2 (Minor)**: Polish, nice-to-have improvements

### E. Fix Order (strict)

1. **Blockers**: viewport, safe-area, nav traps, tap targets, CLS spikes
2. **Readability**: type scale, paragraph width, spacing rhythm, contrast
3. **Performance**: LCP hero, image sizing, lazyload, bundle defers
4. **A11y**: focus order, labels, motion, screen reader landmarks
5. **Polish**: skeletons, empty/error states, transitions ≤220ms ease-out

### F. Implementation Heuristics

**Tailwind/React patterns:**
- Replace ad-hoc paddings with tokenized utilities (px-4 sm:px-6, py-6 md:py-10)
- Grids: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` for cards/lists
- Buttons: ensure `min-h-[44px]` and `px-4`, hit-slop via wrapper if needed
- Typography: `text-base md:text-[17px]`, headings `clamp()` or responsive classes

**Safe areas:**
```css
:root { 
  padding-top: env(safe-area-inset-top); 
  padding-bottom: env(safe-area-inset-bottom); 
}
.sticky-cta { 
  padding-bottom: calc(env(safe-area-inset-bottom) + 12px); 
}
```

**Motion guard:**
```css
@media (prefers-reduced-motion: reduce) { 
  * { animation: none !important; transition: none !important; } 
}
```

**Forms:** native types, inputmode, autocomplete, visible errors below fields

**Images:** next/image with `sizes="(max-width: 768px) 100vw, 50vw"`; set priority on LCP hero

