export function Footer(){
  return (
    <footer className="mt-24 border-t border-white/10">
      <div className="max-w-screen-xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="mb-3 font-semibold">Product</div>
          <ul className="space-y-2">
            <li><a href="/generator">Generator</a></li>
            <li><a href="/modules">Modules</a></li>
            <li><a href="/pricing">Pricing</a></li>
            <li><a href="/docs/api">Docs</a></li>
          </ul>
        </div>
        <div><div className="mb-3 font-semibold">Docs</div><ul className="space-y-2">
          <li><a href="/docs/api">API Reference</a></li>
          <li><a href="/docs">Guides</a></li>
        </ul></div>
        <div><div className="mb-3 font-semibold">Company</div><ul className="space-y-2">
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul></div>
        <div><div className="mb-3 font-semibold">Legal</div><ul className="space-y-2">
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/terms">Terms of Service</a></li>
        </ul></div>
      </div>
      <div className="max-w-screen-xl mx-auto px-4 pb-8 flex items-center justify-between">
        <div className="text-xs text-white/60">© 2025 PROMPTFORGE™. All rights reserved.</div>
        <div className="flex gap-2">
          <span className="px-2.5 py-1 rounded-md border"
                style={{borderColor:"var(--pf-gold-500)", background:"rgba(199,168,105,.12)"}}>Stripe Verified</span>
          <span className="px-2.5 py-1 rounded-md border"
                style={{borderColor:"var(--pf-gold-500)", background:"rgba(199,168,105,.12)"}}>GDPR Compliant</span>
        </div>
      </div>
    </footer>
  );
}
