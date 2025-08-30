"use client";

export default function GlitchDemoPage() {
  return (
    <div className="min-h-screen bg-primary text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <section className="text-center">
          <h1 className="text-6xl font-bold mb-4">
            <span className="kw" data-glitch>
              <span className="kw__text">Glitch Protocol</span>
              <span className="kw__glitch" aria-hidden="true"></span>
            </span>{" "}
            v1 Demo
          </h1>
          <p className="text-xl text-foreground/80">
            Deterministic, seed-based glitch effects for keywords
          </p>
        </section>

        {/* Features */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="pf-block p-8">
            <span className="pf-corner tl"></span>
            <span className="pf-corner tr"></span>
            <span className="pf-corner bl"></span>
            <span className="pf-corner br"></span>

            <h2 className="text-3xl font-bold mb-4">
              <span className="kw" data-glitch>
                <span className="kw__text">Deterministic</span>
                <span className="kw__glitch" aria-hidden="true"></span>
              </span>{" "}
              Effects
            </h2>
            <p className="text-foreground/80 mb-4">
              Same text = same glitch pattern every time
            </p>
            <ul className="space-y-2 text-sm">
              <li>• Seed-based PRNG (mulberry32)</li>
              <li>• Hash from text content</li>
              <li>• Consistent across sessions</li>
            </ul>
          </div>

          <div className="pf-block p-8">
            <span className="pf-corner tl"></span>
            <span className="pf-corner tr"></span>
            <span className="pf-corner bl"></span>
            <span className="pf-corner br"></span>

            <h2 className="text-3xl font-bold mb-4">
              <span className="kw" data-glitch>
                <span className="kw__text">Performance</span>
                <span className="kw__glitch" aria-hidden="true"></span>
              </span>{" "}
              First
            </h2>
            <p className="text-foreground/80 mb-4">
              Optimized for 60fps with minimal CLS
            </p>
            <ul className="space-y-2 text-sm">
              <li>• requestAnimationFrame timing</li>
              <li>• Fixed width overlay (ch units)</li>
              <li>• No layout thrashing</li>
            </ul>
          </div>
        </section>

        {/* Glitch Examples */}
        <section className="pf-block p-8">
          <span className="pf-corner tl"></span>
          <span className="pf-corner tr"></span>
          <span className="pf-corner bl"></span>
          <span className="pf-corner br"></span>

          <h2 className="text-3xl font-bold text-center mb-8">
            Live{" "}
            <span className="kw" data-glitch>
              <span className="kw__text">Examples</span>
              <span className="kw__glitch" aria-hidden="true"></span>
            </span>
          </h2>

          <div className="pf-yard-line"></div>

          <div className="space-y-8 text-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                The Future of{" "}
                <span className="kw" data-glitch>
                  <span className="kw__text">AI</span>
                  <span className="kw__glitch" aria-hidden="true"></span>
                </span>{" "}
                Prompting
              </h3>
              <p className="text-foreground/60 text-sm">
                H1 example with single keyword
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-2">
                <span className="kw" data-glitch>
                  <span className="kw__text">50 Modules</span>
                  <span className="kw__glitch" aria-hidden="true"></span>
                </span>{" "}
                ×{" "}
                <span className="kw" data-glitch>
                  <span className="kw__text">7D Engine</span>
                  <span className="kw__glitch" aria-hidden="true"></span>
                </span>{" "}
                →{" "}
                <span className="kw" data-glitch>
                  <span className="kw__text">Export</span>
                  <span className="kw__glitch" aria-hidden="true"></span>
                </span>
              </h3>
              <p className="text-foreground/60 text-sm">
                H2 example with multiple keywords
              </p>
            </div>

            <div>
              <h3 className="text-xl mb-2">
                Experience the{" "}
                <span className="kw" data-glitch>
                  <span className="kw__text">Protocol</span>
                  <span className="kw__glitch" aria-hidden="true"></span>
                </span>{" "}
                in Action
              </h3>
              <p className="text-foreground/60 text-sm">
                Scroll to trigger • Hover to replay (6s cooldown)
              </p>
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section className="pf-block p-8">
          <span className="pf-corner tl"></span>
          <span className="pf-corner tr"></span>
          <span className="pf-corner bl"></span>
          <span className="pf-corner br"></span>

          <h2 className="text-3xl font-bold text-center mb-4">
            <span className="kw" data-glitch>
              <span className="kw__text">Technical</span>
              <span className="kw__glitch" aria-hidden="true"></span>
            </span>{" "}
            Specs
          </h2>

          <div className="pf-yard-line"></div>

          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-bold text-foreground mb-2">Duration</h4>
              <p>280–420ms (14 frames @ 60fps)</p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-2">Symbols</h4>
              <p>&gt; &lt; | / \\ &#123; &#125; [ ] ~ _ - # $ % * + = ^ ; :</p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-2">Accessibility</h4>
              <p>Screen reader friendly, respects reduce-motion</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="text-center text-foreground/60">
          <p>Glitch Protocol v1 • PromptForge Tactical Design System</p>
        </section>
      </div>

      {/* Glitch Protocol v1 Script */}
      <script defer src="/glitch-keywords.js"></script>
    </div>
  );
}
