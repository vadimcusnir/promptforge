(() => {
  // Respectă ambient / reduce-motion
  if (document.documentElement.getAttribute('data-motion') === 'off' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const SYMS = Array.from("> < | / \\\\ { } [ ] ~ _ - # $ % * + = ^ ; :".split(' '));
  const MAX_FRAMES = 14;             // ~14 cadre ~ 230–350ms la 60fps
  const COOLDOWN_MS = 6000;          // re-play minim

  // PRNG determinist (mulberry32)
  function mulberry32(a){return function(){var t=a+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
  function hashStr(s){let h=1779033703^s.length;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),3432918353);h=h<<13|h>>>19}return()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);h^=h>>>16;return h>>>0}}

  function glitchOnce(node){
    const txtEl = node.querySelector('.kw__text');
    const glEl  = node.querySelector('.kw__glitch');
    if(!txtEl || !glEl) return;

    const original = txtEl.textContent || "";
    if(!original.trim()) return;

    // optional: fixează lățimea overlay-ului ca să eviți CLS
    glEl.style.width = `${original.length}ch`;
    glEl.style.display = 'inline-block';

    // seed din text (determinism)
    const seed = hashStr(original)();
    const rnd  = mulberry32(seed);

    let frame = 0, last = 0, cooling = false;

    function draw(ts){
      if (!last) last = ts;
      const dt = ts - last;
      if (dt < 16) return requestAnimationFrame(draw); // țintește ~60fps
      last = ts;

      const progress = frame / MAX_FRAMES;             // 0..1
      const keepProb = 0.15 + 0.85 * progress;         // tot mai multe litere rămân originale
      const res = original.split('').map(ch => {
        if (/\s/.test(ch)) return ch;                  // păstrează spațiile
        return (rnd() < keepProb) ? ch : SYMS[(rnd()*SYMS.length)|0];
      }).join('');

      glEl.textContent = res;
      frame++;
      if (frame <= MAX_FRAMES) requestAnimationFrame(draw);
      else {
        // finalizează: overlay gol, rămâne doar textul real
        glEl.textContent = "";
        // cooldown pentru re-play
        if (!cooling) {
          cooling = true;
          setTimeout(()=> cooling=false, COOLDOWN_MS);
        }
      }
    }
    requestAnimationFrame(draw);
  }

  // Rulează o singură dată la intrare în viewport; re-play la hover (cu cooldown)
  const els = [...document.querySelectorAll('[data-glitch]')];
  if (!('IntersectionObserver' in window)) { els.forEach(glitchOnce); return; }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(({target,isIntersecting})=>{
      if (!isIntersecting) return;
      glitchOnce(target);
      io.unobserve(target);
      // hover replay
      target.addEventListener('mouseenter', ()=>glitchOnce(target), { passive:true });
    });
  }, { threshold: 0.6 });

  els.forEach(el=> io.observe(el));
})();
