# UI Overlay Policy Changes

## Summary

Descrie pe scurt schimbarea (ce rută/efect ai atins) și de ce.

## SSOT Changes

- [ ] Am modificat `cursor/ruleset.yml` (route_class_map / css_vars / diagnostics / performance).
- [ ] Am actualizat `X-PF-Ruleset-Version`.

## Implementation Notes

- [ ] Controller unic: `components/OverlayController.tsx` (fără manipulări directe în alte componente).
- [ ] Focus global: `lib/quote-focus.tsx` / `<QuoteBlock>` unde e cazul.

## Testing

### Local manual:
- [ ] `/` aplică `.route-marketing` în ≤50ms.
- [ ] `/generator` hover pe citat → overlay opacity ↑, `.matrix-tokens` opacity ~0.28.
- [ ] `/dashboard` schimbare clasă fără reziduuri.
- [ ] `prefers-reduced-motion` → fără tranziții.

### E2E:
- [ ] `pnpm test:e2e:overlays` trece.

### Performance:
- [ ] P95 `overlay.apply.ms` ≤ 50ms.
- [ ] P95 `overlay.focus.ms` ≤ 20ms.

### Accessibility:
- [ ] Contrast AA menținut; fără interferențe la focus vizual.

### Diagnostics:
- [ ] Nicio ieșire `console.log` în producție.
- [ ] `NEXT_PUBLIC_OVERLAY_DIAGNOSTICS=0` în prod.

## Telemetry

- [ ] Emit `overlay.apply.ms`, `overlay.cleanup.ok`, `overlay.focus.toggles`, `route`.

## Screens / Evidence

Atașează screenshot-uri / înregistrări scurte (în special la hover + route change).

## Risk & Rollback

- [ ] Plan de rollback (revert `ruleset.yml` / dezactivare `overlays.enabled`).
- [ ] Confirm că schimbarea e no-op dacă `overlays.enabled=false`.

## Checklist final

- [ ] Single route class garantat.
- [ ] Cleanup on unmount validat.
- [ ] Lint rule respectată (fără `querySelector` pe `#bg-overlay` în alte fișiere).
- [ ] Docs actualizate: `docs/ui/overlay-policy-operations.txt`.

---

### Performance Benchmarks

```
Route Transition Times:
/ → /generator: __ms
/generator → /dashboard: __ms
/dashboard → /: __ms

Quote Focus Times:
Hover activate: __ms
Hover deactivate: __ms
```

### Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari
- [ ] Chrome Mobile

### Reduced Motion Testing

- [ ] System preference respected
- [ ] Transitions disabled
- [ ] Functionality maintained

---

**Reviewer Notes:**
- Focus pe SSOT compliance
- Verifică performance benchmarks
- Testează manual pe multiple rute
- Confirmă că nu există memory leaks
