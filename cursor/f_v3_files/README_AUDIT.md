# Promptforge™ Licensing Audit – Kit

## 1) Fișiere în pachet
- `pf-license-verify.js` – verifică licența + watermark-urile (__pf_wm) și badge-urile MD
- `license.json` – exemplu de licență (DEMO); semnătură = MOCK (by-pass semnătură)
- `pubkey_demo.pem` – cheie publică exemplu (nu e folosită când semnătura e MOCK)

## 2) Cum rulezi verificarea
```bash
node pf-license-verify.js --zip ./module_pack_sales_accelerator.zip --pub ./pubkey_demo.pem
```
- Caută `license.json` în .zip și validează:
  - semnătura licenței (sare peste dacă `signature=MOCK`)
  - perioada de valabilitate (`expires_at` + 7 zile grace)
  - alinierea `pack` și `modules` între licență și watermark-urile JSON
  - prezența badge-ului **Promptforge™ Verified** în fișiere `.md`

### Coduri de ieșire
- **0** = OK (totul e valid)
- **2** = FAIL (orice abatere)

## 3) Integrare în pipeline
- **UI Export**: blochează exportul dacă lipsește `license.json`
- **CI/CD**: rulează verificatorul pe .zip înainte de publicare
- **Onboarding Client**: rulează verificatorul local cu cheia publică oficială
- **Reînnoire**: livrați `license.json` nou; vechiul .zip rămâne valid 7 zile (grace)

## 4) În producție (semnătură reală)
- Înlocuiți `license.json` (semnat Ed25519) și `pubkey_demo.pem` cu cheia publică reală
- Verificatorul va bloca pachetele cu licență expirată, badge lipsă sau watermark lipsă/mismatch

## 5) Watermark & Badge
- JSON: nod `__pf_wm` în fiecare fișier (run_id, timestamp, pack, modules, signature)
- MD: bloc vizibil „Promptforge™ Verified” + comentariu invizibil cu metadate

---

**Notă:** acest kit este pentru audit intern și demo. Pentru producție, utilizați semnătură Ed25519 reală (vezi `create-license.js` din documentație).
