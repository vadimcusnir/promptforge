'use client';

export default function TacticalTestPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#ECFEFF]">
      <main className="container mx-auto max-w-[1240px] px-6 py-24 space-y-16">
        {/* Hero with Sweep Animation */}
        <section className="pf-block sweep p-8 text-center">
          <span className="pf-corner tl"></span>
          <span className="pf-corner tr"></span>
          <span className="pf-corner bl"></span>
          <span className="pf-corner br"></span>

          <h1 className="text-h1 text-[#ECFEFF] mb-4">
            Tactical{' '}
            <span className="kw" data-glitch>
              <span className="kw__text">Design System</span>
              <span className="kw__glitch" aria-hidden="true"></span>
            </span>{' '}
            Test
          </h1>

          <div className="pf-yard-line"></div>

          <p className="text-body text-[#ECFEFF]/80 mb-8">
            Testing{' '}
            <span className="kw" data-glitch>
              <span className="kw__text">Glitch</span>
              <span className="kw__glitch" aria-hidden="true"></span>
            </span>
            ,{' '}
            <span className="kw" data-glitch>
              <span className="kw__text">Protocol</span>
              <span className="kw__glitch" aria-hidden="true"></span>
            </span>
            , and{' '}
            <span className="kw" data-glitch>
              <span className="kw__text">Sharp Buttons</span>
              <span className="kw__glitch" aria-hidden="true"></span>
            </span>
          </p>

          <div className="flex gap-4 justify-center">
            <button className="btn-notched px-8 py-4">Notched Button</button>
            <button className="btn px-8 py-4">Sharp Button</button>
          </div>
        </section>

        {/* Block System Demo */}
        <section className="pf-block p-8">
          <span className="pf-corner tl"></span>
          <span className="pf-corner tr"></span>
          <span className="pf-corner bl"></span>
          <span className="pf-corner br"></span>

          <h2 className="text-h2 text-[#ECFEFF] mb-4">
            Block System with{' '}
            <span className="kw" data-glitch>
              <span className="kw__text">Corner Markers</span>
              <span className="kw__glitch" aria-hidden="true"></span>
            </span>
          </h2>

          <div className="pf-yard-line"></div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="pf-block p-6">
              <span className="pf-corner tl"></span>
              <span className="pf-corner tr"></span>
              <span className="pf-corner bl"></span>
              <span className="pf-corner br"></span>

              <h3 className="text-h3 text-[#ECFEFF] mb-2">Nested Block</h3>
              <p className="text-micro text-[#ECFEFF]/80">
                This demonstrates nested tactical blocks with corner markers.
              </p>
            </div>

            <div className="pf-block p-6">
              <span className="pf-corner tl"></span>
              <span className="pf-corner tr"></span>
              <span className="pf-corner bl"></span>
              <span className="pf-corner br"></span>

              <h3 className="text-h3 text-[#ECFEFF] mb-2">Another Block</h3>
              <p className="text-micro text-[#ECFEFF]/80">
                Each block has hash marks and tactical styling.
              </p>
            </div>
          </div>
        </section>

        {/* Button Showcase */}
        <section className="pf-block p-8">
          <span className="pf-corner tl"></span>
          <span className="pf-corner tr"></span>
          <span className="pf-corner bl"></span>
          <span className="pf-corner br"></span>

          <h2 className="text-h2 text-[#ECFEFF] text-center mb-4">Sharp Button System</h2>

          <div className="pf-yard-line"></div>

          <div className="grid md:grid-cols-2 gap-8 text-center">
            <div>
              <h3 className="text-h3 text-[#ECFEFF] mb-4">Sharp Edge Buttons</h3>
              <div className="space-y-4">
                <button className="btn w-full">Primary Sharp</button>
                <button className="btn w-full" disabled>
                  Disabled Sharp
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-h3 text-[#ECFEFF] mb-4">Notched Buttons</h3>
              <div className="space-y-4">
                <button className="btn-notched w-full">Primary Notched</button>
                <button className="btn-notched w-full" disabled>
                  Disabled Notched
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Keyword Animation Demo */}
        <section className="pf-block p-8 text-center">
          <span className="pf-corner tl"></span>
          <span className="pf-corner tr"></span>
          <span className="pf-corner bl"></span>
          <span className="pf-corner br"></span>

          <h2 className="text-h2 text-[#ECFEFF] mb-4">
            <span className="kw" data-glitch>
              <span className="kw__text">Glitch Protocol</span>
              <span className="kw__glitch" aria-hidden="true"></span>
            </span>{' '}
            Test
          </h2>

          <div className="pf-yard-line"></div>

          <p className="text-body text-[#ECFEFF]/80 space-y-4">
            <span>Watch these keywords glitch on scroll:</span>
            <br />
            <span className="kw" data-glitch>
              <span className="kw__text">Cognitive OS</span>
              <span className="kw__glitch" aria-hidden="true"></span>
            </span>{' '}
            •
            <span className="kw" data-glitch>
              <span className="kw__text">7D Engine</span>
              <span className="kw__glitch" aria-hidden="true"></span>
            </span>{' '}
            •
            <span className="kw" data-glitch>
              <span className="kw__text">Export</span>
              <span className="kw__glitch" aria-hidden="true"></span>
            </span>{' '}
            •
            <span className="kw" data-glitch>
              <span className="kw__text">Modules</span>
              <span className="kw__glitch" aria-hidden="true"></span>
            </span>
          </p>
        </section>
      </main>

      {/* Glitch Protocol v1 Script */}
      <script defer src="/glitch-keywords.js"></script>
    </div>
  );
}
