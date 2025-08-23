import Link from 'next/link';

const BASE = '/demo-bundle/pf_demo_v1';

const files = [
  {
    name: 'prompt.txt',
    path: `${BASE}/prompt.txt`,
    desc: 'Raw prompt instruction',
  },
  { name: 'prompt.md', path: `${BASE}/prompt.md`, desc: 'Readable spec + KPI' },
  {
    name: 'prompt.json',
    path: `${BASE}/prompt.json`,
    desc: 'Config + metadata',
  },
  {
    name: 'prompt.pdf',
    path: `${BASE}/prompt.pdf`,
    desc: 'Branded PDF export',
  },
  {
    name: 'telemetry.json',
    path: `${BASE}/telemetry.json`,
    desc: 'Scores, tokens, timings',
  },
  {
    name: 'manifest.json',
    path: `${BASE}/manifest.json`,
    desc: 'Bundle manifest',
  },
  {
    name: 'checksum.txt',
    path: `${BASE}/checksum.txt`,
    desc: 'SHA256 canonical checksum',
  },
];

export default function DemoBundlePage() {
  return (
    <section className="min-h-screen px-6 py-16 max-w-4xl mx-auto text-white bg-[#0a0a0a]">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Preview Demo Bundle</h1>
        <p className="text-lg opacity-80 leading-relaxed">
          artifacts, or grab everything as a ZIP.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="px-3 py-1 bg-[#d1a954]/20 text-[#d1a954] rounded-full">Module M12</span>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
            Quality: 9.1/10
          </span>
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">Marketing</span>
        </div>
      </div>

      <div className="grid gap-4 mb-8">
        {files.map(f => (
          <div
            key={f.name}
            className="rounded-lg border border-white/15 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-mono text-lg font-semibold text-[#d1a954]">{f.name}</div>
                <div className="text-sm opacity-80">{f.desc}</div>
              </div>
              <a
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors border border-white/20"
                href={f.path}
                download
              ></a>
            </div>

            {f.name.endsWith('.md') && (
              <div className="mt-4">
                <div className="text-xs text-white/60 mb-2">Preview:</div>
                <iframe
                  className="w-full h-64 rounded-md bg-black border border-white/10"
                  src={f.path}
                  title={f.name}
                />
              </div>
            )}

            {f.name === 'prompt.pdf' && (
              <div className="mt-4">
                <div className="text-xs text-white/60 mb-2">PDF Document:</div>
                <Link
                  href={f.path}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg text-sm text-red-300 transition-colors"
                  prefetch={false}
                  target="_blank"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Open PDF in new tab
                </Link>
              </div>
            )}

            {(f.name.endsWith('.json') || f.name.endsWith('.txt')) && (
              <div className="mt-4">
                <div className="text-xs text-white/60 mb-2">Content preview:</div>
                <div className="bg-black/50 rounded-md p-3 text-xs font-mono text-white/70 max-h-32 overflow-y-auto">
                  {f.name === 'prompt.json' &&
                    '{\n  "prompt_id": "pf-demo-v1",\n  "module_id": "M12",\n  "title": "SaaS Email Campaign Generator",\n  ...'}
                  {f.name === 'prompt.txt' &&
                    'SYSTEM: You are PROMPTFORGE™ v3 AI Assistant - a cognitive OS for prompt engineering.\n\nCONTEXT: The user needs to create a high-performing marketing email campaign...'}
                  {f.name === 'telemetry.json' &&
                    '{\n  "run_id": "00000000-0000-0000-0000-000000000000",\n  "bundle_id": "pf-demo-v1",\n  "execution_metadata": {\n    "total_duration_ms": 30245,\n    "status": "success"\n  },\n  ...'}
                  {f.name === 'manifest.json' &&
                    '{\n  "bundle_id": "pf-demo-v1",\n  "module_id": "M12",\n  "version": "1.0.0",\n  "formats": ["txt", "md", "json", "pdf"],\n  ...'}
                  {f.name === 'checksum.txt' &&
                    'SHA256 Checksums - PROMPTFORGE™ v3 Demo Bundle\nGenerated: 2025-01-22T00:00:00Z\nBundle ID: pf-demo-v1\n\na1b2c3d4e5f6789012345678...  prompt.txt\nb2c3d4e5f6789012345678...  prompt.md\n...'}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <a
          href="/api/demo-bundle.zip"
          className="px-6 py-4 rounded-lg bg-[#d1a954] hover:bg-[#d1a954]/90 text-black font-bold text-lg transition-all duration-200 text-center flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </a>
        <Link
          href="/coming-soon"
          className="px-6 py-4 rounded-lg border border-white/20 hover:bg-white/10 text-white font-semibold text-lg transition-all duration-200 text-center"
        >
          Back to Coming Soon
        </Link>
      </div>

      <div className="bg-white/5 rounded-lg border border-white/15 p-6">
        <h3 className="text-xl font-semibold mb-4 text-[#d1a954]">Bundle Specifications</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2 text-white">Technical Details</h4>
            <ul className="space-y-1 text-white/70">
              <li>• Engine: 7D Parameter v3.2.1</li>
              <li>• Processing: 30.2s execution time</li>
              <li>• Efficiency: 94.2% token optimization</li>
              <li>• Coherence: 97.8% semantic alignment</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-white">Expected Performance</h4>
            <ul className="space-y-1 text-white/70">
              <li>• Open Rate: 24-28%</li>
              <li>• Click Rate: 12-15%</li>
              <li>• Trial Conversion: 14-16%</li>
              <li>• Est. ARR Impact: +$45K</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/15">
          <p className="text-sm text-white/70">
            Bundle format & checksum follow the{' '}
            <span className="text-[#d1a954]">PROMPTFORGE export standard</span>.{' '}
            <span className="text-white/90">
              Artifacts: .txt, .md, .json, .pdf, manifest, checksum.
            </span>
          </p>
          <p className="text-xs text-white/50 mt-2">© PROMPTFORGE v3 — Demo License</p>
        </div>
      </div>
    </section>
  );
}
