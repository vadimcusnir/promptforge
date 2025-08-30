"use client"

// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="pf-ctr" role="main" aria-labelledby="pf-404-title">
      {/* background layers */}
      <div className="pf-bg" aria-hidden="true" />
      <div className="pf-noise" aria-hidden="true" />

      {/* spinner */}
      <div className="pf-spin" aria-hidden="true">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          role="img"
          aria-label="Loading"
        >
          <g>
            {Array.from({ length: 10 }).map((_, i) => (
              <rect
                key={i}
                x="11"
                y="1.25"
                width="2"
                height="5.5"
                rx="1"
                style={{ opacity: i ? i / 10 : 1 }}
                transform={`rotate(${i * 36} 12 12)`}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* title + subtitle */}
      <h1 id="pf-404-title" className="pf-title" data-text="404">
        404
      </h1>
      <p className="pf-sub">
        Page not found. The page you're looking for doesn't exist.
      </p>

      {/* actions */}
      <nav className="pf-actions" aria-label="Quick actions">
        <Link href="/" className="pf-btn pf-btn--primary" aria-label="Back to homepage">
          ← Start Forge
        </Link>
        <Link href="/modules" className="pf-btn pf-btn--ghost" aria-label="View all modules">
          View Modules
        </Link>
        <Link href="/generator" className="pf-btn pf-btn--ghost" aria-label="Open 7-D Generator">
          Open Generator
        </Link>
      </nav>

      {/* small help */}
      <p className="pf-hint">
        If you arrived here from a link, check the address or return to the main pages.
      </p>

      <style jsx>{`
        :root {
          /* brand tokens */
          --pf-bg: #0a0a0a;
          --pf-fg: rgba(255, 255, 255, 0.88);
          --pf-muted: rgba(255, 255, 255, 0.62);
          --pf-accent: #cda434; /* auriu PromptForge™ */
          --pf-teal: #0891b2;
          --pf-crimson: #be123c;
          --pf-card: rgba(255, 255, 255, 0.06);
          --pf-border: rgba(255, 255, 255, 0.16);
        }
        @media (prefers-color-scheme: light) {
          :root {
            --pf-bg: #ffffff;
            --pf-fg: #111111;
            --pf-muted: #4b5563;
            --pf-card: rgba(17, 24, 39, 0.06);
            --pf-border: rgba(17, 24, 39, 0.14);
          }
        }

        .pf-ctr {
          min-height: 100dvh;
          display: grid;
          place-items: center;
          background: var(--pf-bg);
          color: var(--pf-fg);
          position: relative;
          isolation: isolate;
          text-align: center;
          padding: 48px 20px;
          overflow: hidden;
        }

        /* background glow layers */
        .pf-bg {
          position: absolute;
          inset: 0;
          z-index: -2;
          background:
            radial-gradient(60% 35% at 50% 0%,
              color-mix(in oklab, var(--pf-teal) 28%, transparent) 0%,
              transparent 70%),
            radial-gradient(55% 25% at 50% 100%,
              color-mix(in oklab, var(--pf-crimson) 22%, transparent) 0%,
              transparent 70%),
            linear-gradient(0deg, var(--pf-bg), var(--pf-bg));
          filter: saturate(1.1);
        }
        .pf-noise {
          position: absolute;
          inset: -100px;
          z-index: -1;
          opacity: 0.07;
          background-image: url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>\
<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter>\
<rect width='120' height='120' filter='url(%23n)' opacity='1'/>\
</svg>");
          background-size: 300px 300px;
          mix-blend-mode: overlay;
          animation: pf-noise 14s linear infinite;
        }
        @keyframes pf-noise {
          0% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(-25px, 20px, 0); }
          100% { transform: translate3d(0,0,0); }
        }

        /* spinner */
        .pf-spin {
          display: grid;
          place-items: center;
          width: 64px;
          height: 64px;
          border-radius: 14px;
          background: color-mix(in oklab, var(--pf-card) 86%, transparent);
          border: 1px solid var(--pf-border);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.02) inset,
            0 20px 60px rgba(0,0,0,0.35);
          animation: pf-rotate 1s steps(10, end) infinite;
          margin-bottom: 18px;
        }
        .pf-spin svg rect {
          fill: var(--pf-accent);
        }
        @keyframes pf-rotate {
          to { transform: rotate(360deg); }
        }

        /* glitch title */
        .pf-title {
          position: relative;
          display: inline-block;
          font-size: clamp(42px, 10vw, 128px);
          font-weight: 900;
          letter-spacing: 0.04em;
          margin: 0;
          line-height: 1;
          text-shadow: 0 0 18px rgba(205,164,52,0.18);
        }
        .pf-title::before,
        .pf-title::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          pointer-events: none;
          mix-blend-mode: screen;
          clip-path: polygon(0 0,100% 0,100% 45%,0 45%);
        }
        .pf-title::before {
          color: var(--pf-teal);
          transform: translate(2px, 0);
          animation: pf-gl1 2.2s infinite linear;
        }
        .pf-title::after {
          color: var(--pf-crimson);
          transform: translate(-2px, 0);
          animation: pf-gl2 2.2s infinite linear;
        }
        @keyframes pf-gl1 {
          0% { clip-path: inset(0 0 55% 0); }
          50% { clip-path: inset(0 0 35% 0); transform: translate(1px, 0); }
          100% { clip-path: inset(0 0 55% 0); }
        }
        @keyframes pf-gl2 {
          0% { clip-path: inset(55% 0 0 0); }
          50% { clip-path: inset(65% 0 0 0); transform: translate(-1px, 0); }
          100% { clip-path: inset(55% 0 0 0); }
        }

        .pf-sub {
          margin: 10px auto 20px;
          max-width: 720px;
          font-size: clamp(14px, 2vw, 18px);
          color: var(--pf-muted);
        }

        .pf-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
          margin: 8px 0 10px;
        }

        .pf-btn {
          min-height: 44px;
          padding: 10px 16px;
          border-radius: 10px;
          border: 1px solid var(--pf-border);
          background: var(--pf-card);
          color: var(--pf-fg);
          text-decoration: none;
          font-weight: 600;
          transition: transform 180ms ease, box-shadow 180ms ease,
            background 180ms ease, border-color 180ms ease;
          outline: none;
        }
        .pf-btn:focus-visible {
          box-shadow:
            0 0 0 2px color-mix(in oklab, var(--pf-accent) 65%, transparent),
            0 0 0 4px rgba(17,24,39,0.75);
        }
        .pf-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 24px color-mix(in oklab, var(--pf-teal) 30%, transparent);
        }

        .pf-btn--primary {
          background: linear-gradient(
            180deg,
            color-mix(in oklab, var(--pf-accent) 38%, transparent),
            color-mix(in oklab, var(--pf-accent) 14%, transparent)
          );
          border-color: color-mix(in oklab, var(--pf-accent) 50%, var(--pf-border));
        }
        .pf-btn--primary:hover {
          box-shadow:
            0 0 0 1px color-mix(in oklab, var(--pf-accent) 60%, transparent) inset,
            0 16px 50px rgba(205,164,52,0.22);
        }
        .pf-btn--ghost {
          background: transparent;
        }

        .pf-hint {
          margin-top: 10px;
          font-size: 13px;
          color: var(--pf-muted);
        }

        /* accessibility: reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .pf-noise,
          .pf-spin,
          .pf-title::before,
          .pf-title::after {
            animation: none !important;
          }
        }

        /* mobile */
        @media (max-width: 420px) {
          .pf-actions { gap: 10px; }
          .pf-btn { width: 100%; }
        }
      `}</style>
    </main>
  );
}
