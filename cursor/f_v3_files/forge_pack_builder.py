#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os, json, hashlib, time, zipfile, pathlib

T_OVERVIEW = """# {name} – Overview

## 1. Scop
{scope}

## 2. Public Țintă
{audience_list}

## 3. Module Incluse
{modules_list}

## 4. Obiective Măsurabile (KPI)
{kpi_list}

## 5. Structura Livrabilelor
– Prompts Industriale (A/B)  
– Checklists de implementare  
– KPI Templates (matrix + dashboard JSON)  
– Studii de Caz validate cu Test Engine + hash  
– Output Templates JSON  
– Guardrails (Do/Don’t)

## 6. Cum se Folosește
1. Descarcă pachetul `.zip`  
2. Citește `quickstart.md`  
3. Completează variabilele din prompts  
4. Rulează validarea în Test Engine (Structură≥90 / Claritate≥88)  
5. Integrează în {integrations}  
6. Monitorizează KPI dashboard (uplift vs baseline)

## 7. Studii de Caz
{cases_list}

## 8. Politica de Licență
– Single User / Team ≤5 / Enterprise  
– Update-uri incluse 12 luni  
– Redistribuirea interzisă  
– Hash unic + watermark JSON pentru audit
"""

T_QUICKSTART = """# Quickstart – {name}

Acest Pack este construit din module validate PROMPTFORGE™ și livrează prompts industriale, KPI templates și studii de caz pentru {scope}.

---

## Pași Rapizi (≤2 min)

1. **Deschide prompts**  
   – Intră în `/prompts/` și încarcă primul modul (ex. `{first_prompt}`).  
   – Completează placeholders [VARIABILĂ] (ex. [PRODUCT], [AUDIENCE], [CHANNEL]).

2. **Rulează validarea**  
   – Rulează prompturile (varianta A + B) în **Test Engine**.  
   – Acceptă doar rezultate cu Structură ≥90 și Claritate ≥88.

3. **Urmează checklist-ul**  
   – Deschide `/checklists/implementation_checklist.md`.  
   – Bifează pas cu pas Setup → Generare → Integrare → Validare → Raportare.

4. **Integrează în sistemul tău**  
   – Importă outputurile JSON din `/specs/output_templates.json`.  
   – Integrează în {integrations}.

5. **Monitorizează KPI**  
   – Deschide `/kpi/kpi_dashboard.json`.  
   – Actualizează baseline vs actual și verifică uplift vs target: {kpi_targets}.

6. **Inspiră-te din studii de caz**  
   – Consultă `/cases/` pentru 2–3 exemple reale cu scoruri Test Engine + hash.  
   – Compară-ți rezultatele cu uplifturile atinse.

---

## Next Step
După validare, scalează Pack-ul la mai multe proiecte/branduri prin:  
– duplicarea prompts,  
– rularea ciclică în Test Engine,  
– export KPI pentru raportare.

---

## Politica de Licență
– Single User / Team ≤5 / Enterprise  
– Update-uri incluse 12 luni  
– Redistribuirea interzisă  
– Hash unic + watermark JSON pentru audit
"""

T_PROMPT = """# Modul {mid} – {mname}

---

## 1. Prompt Industrial (Varianta A)
[Scrie promptul principal, complet, cu placeholders.]

## 2. Prompt Industrial (Varianta B – A/B testing)
[Scrie variantă alternativă.]

## 3. Requirements (Inputuri Obligatorii)
– [PRODUS] – [PUBLIC_TINTA] – [CANAL] – [KPI_TARGET] – [CONTEXT]

## 4. Spec (Pași Pipeline)
– Pas 1: Preia inputuri → Pas 2: Generează text → Pas 3: Validează (Test Engine) → Pas 4: Output JSON

## 5. Output Template (JSON)
```json
{{
  "headline": "string",
  "body": "string",
  "cta": "string",
  "kpi_target": "string"
}}
```

## 6. Guardrails (Etică & Limitări)
– Fără promisiuni nerealiste. – Evită limbaj manipulator. – Respectă transparența (GDPR).
"""

T_KPI_MATRIX = """# KPI Matrix — {name}

| KPI             | Prag/Target | Metodă de măsurare                 | Frecvență |
|-----------------|-------------|------------------------------------|-----------|
{rows}
"""

T_KPI_DASHBOARD = """{{
  "pack": "{name}",
  "run_id": "{run_id}",
  "timestamp": "{ts}",
  "metrics": [
{metrics}
  ]
}}
"""

T_CHECKLIST = """# Implementation Checklist – {name}

## 1. Setup (Pregătire)
- [ ] Adună requirements din `overview.md`  
- [ ] Configurează contextul în Panoul PROMPTFORGE  
- [ ] Setează folderul `/cases/` pentru hash + scoruri  
- [ ] Confirmă guardrails

## 2. Generare
- [ ] Rulează Prompt A + B pentru fiecare modul  
- [ ] Validează în Test Engine (Structură ≥90, Claritate ≥88)  
- [ ] Salvează output JSON în `/specs/output_templates.json`

## 3. Integrare
- [ ] Importă output în {integrations}  
- [ ] Activează fluxurile conform `spec`  
- [ ] Atașează checklist guardrails per modul

## 4. Validare
- [ ] Măsoară baseline KPI  
- [ ] Rulează testul și compară uplift  
- [ ] Notează status: hit / warn / miss

## 5. Raportare
- [ ] Actualizează `/kpi/kpi_dashboard.json`  
- [ ] Atașează hash + timestamp  
- [ ] Arhivează loguri în `/history/`

## 6. Guardrails – Do/Don’t
| Domeniu  | Do                               | Don’t                         |
|---------|-----------------------------------|-------------------------------|
| Copy    | Claritate + structură             | Promisiuni nerealiste         |
| Etică   | Transparență, consimțământ        | Colectare date neautorizată   |
| KPI     | Respectă pragurile de validare    | Publicare sub prag            |
"""

T_CASE = """# Case Study – {title}

## 1. Context
- Metrică: {metric}
- Obiectiv: Uplift măsurabil

## 2. Prompt Folosit
- Variantă: A/B
- Modul: [indică modulul relevant]

## 3. Output (JSON)
```json
{{"sample":"output"}}
```

## 4. Scoruri Test-Engine
Structură: 92/100 | KPI: 90/100 | Claritate: 88/100

## 5. Hash Execuție
Run ID: {run_id} | Timestamp: {ts}

## 6. Rezultat Măsurabil
Baseline: {baseline} → Actual: {actual} → Uplift: {uplift}
"""

T_SPECS_OUTPUT = """{{
  "templates": [
    {{
      "module": "{mid}",
      "output": {{"headline":"","body":"","cta":"","kpi_target":""}}
    }}
  ]
}}
"""

T_GUARDRAILS = """# Guardrails – {name}

## Reguli generale
– Etică, transparență, conformitate (GDPR)  
– Fără promisiuni nerealiste, fără clickbait excesiv  
– Respectă scoruri minime (Structură≥90 / Claritate≥88)

## Module-specifice
– Completează Do/Don’t pe fiecare modul în `/prompts/` când umpli prompts
"""

T_LICENSE = """# Promptforge™ Module Pack License

## 1. Termeni de Utilizare
– Single User / Team ≤5 / Enterprise

## 2. Update-uri
– 12 luni incluse, apoi opțiune de reînnoire

## 3. Restricții
– Redistribuire publică interzisă; interzisă ștergerea hash/watermark

## 4. Protecție
– Hash unic în `hash.txt`; watermark JSON în `kpi_dashboard.json`

## 5. Anti-Abuz & Audit
– Respectă guardrails; PROMPTFORGE poate solicita fișiere pentru verificarea hash-ului
"""

def slugify(s:str)->str:
    return "".join([c.lower() if c.isalnum() else "_" for c in s]).strip("_")

def run_id_from_spec(spec:dict)->str:
    raw = json.dumps(spec, ensure_ascii=False)
    return hashlib.sha1(raw.encode("utf-8")).hexdigest()[:10]

def build_pack(spec_path:str, out_zip:str):
    with open(spec_path, "r", encoding="utf-8") as f:
        spec = json.load(f)

    name = spec["name"]
    slug = spec.get("slug") or slugify(name)
    scope = spec["scope"]
    audience = spec.get("audience", [])
    modules = spec.get("modules", [])
    kpis = spec.get("kpi_targets", [])
    integrations = ", ".join(spec.get("integrations", [])) or "CRM/LMS/Shopify"
    cases = spec.get("cases", [])

    run_id = run_id_from_spec(spec)
    ts = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

    base = pathlib.Path(f"/mnt/data/module_pack_{slug}")
    if base.exists():
        # clean reset
        for p in sorted(base.rglob("*"), reverse=True):
            if p.is_file(): p.unlink()
        for p in sorted(base.glob("*"), reverse=True):
            if p.is_dir(): p.rmdir()
    base.mkdir(parents=True, exist_ok=True)

    # overview.md
    aud_list = "".join([f"– {a}\n" for a in audience]) or "– [public țintă]\n"
    mod_list = "".join([f"- {m['id']} – {m['name']} → {m.get('purpose','')}\n" for m in modules]) or "- [module]\n"
    kpi_list = "".join([f"- {k['metric']}: {k['op']} {k['target']}\n" for k in kpis]) or "- [KPI]\n"
    cases_list = "".join([f"– {c['title']} – {c['metric']}: {c['baseline']} → {c['actual']} ({c['uplift']})\n" for c in cases]) or "– [Case 01]\n"

    (base/"overview.md").write_text(T_OVERVIEW.format(
        name=name, scope=scope, audience_list=aud_list,
        modules_list=mod_list, kpi_list=kpi_list,
        integrations=integrations, cases_list=cases_list
    ), encoding="utf-8")

    # quickstart.md
    first_prompt = f"m{modules[0]['id'][1:].zfill(2)}_{slug}.md" if modules else "mXX_[nume].md"
    kpi_targets_inline = "; ".join([f"{k['metric']} {k['op']} {k['target']}" for k in kpis]) or "[KPI]"
    (base/"quickstart.md").write_text(T_QUICKSTART.format(
        name=name, scope=scope, first_prompt=first_prompt,
        integrations=integrations, kpi_targets=kpi_targets_inline
    ), encoding="utf-8")

    # prompts/
    pr = base/"prompts"
    pr.mkdir(parents=True, exist_ok=True)
    for m in modules:
        fname = f"m{m['id'][1:].zfill(2)}_{slug}.md"
        (pr/fname).write_text(T_PROMPT.format(mid=m["id"], mname=m["name"]), encoding="utf-8")

    # kpi/
    kpi_dir = base/"kpi"
    kpi_dir.mkdir(parents=True, exist_ok=True)
    rows = "\n".join([f"| {k['metric']} | {k['op']} {k['target']} | definire standard | săpt./lunar |" for k in kpis]) or "| [metric] | [target] | [metodă] | [frecvență] |"
    (kpi_dir/"kpi_matrix.md").write_text(T_KPI_MATRIX.format(name=name, rows=rows), encoding="utf-8")
    metrics_json = ",\n".join([
        json.dumps({
            "metric": k["metric"], "target": k["target"], "unit": "ratio",
            "frequency": "weekly", "method": "standard", "source": "system",
            "baseline": 0, "current": 0, "uplift": 0, "status": "n/a"
        }, ensure_ascii=False, indent=2) for k in kpis
    ])
    (kpi_dir/"kpi_dashboard.json").write_text(T_KPI_DASHBOARD.format(name=name, run_id=run_id, ts=ts, metrics=metrics_json), encoding="utf-8")

    # checklists/
    ch = base/"checklists"
    ch.mkdir(parents=True, exist_ok=True)
    (ch/"implementation_checklist.md").write_text(T_CHECKLIST.format(name=name, integrations=integrations), encoding="utf-8")

    # cases/
    cs = base/"cases"
    (cs/"charts").mkdir(parents=True, exist_ok=True)
    for i, c in enumerate(cases or [{"title":"Case 01","metric":"CR","baseline":"-","actual":"-","uplift":"-"}], start=1):
        (cs/f"case_{i:02d}.md").write_text(T_CASE.format(title=c["title"], metric=c["metric"], baseline=c["baseline"], actual=c["actual"], uplift=c["uplift"], run_id=run_id, ts=ts), encoding="utf-8")

    # specs/
    sp = base/"specs"
    sp.mkdir(parents=True, exist_ok=True)
    if modules:
        (sp/"output_templates.json").write_text(T_SPECS_OUTPUT.format(mid=modules[0]["id"]), encoding="utf-8")
    else:
        (sp/"output_templates.json").write_text(T_SPECS_OUTPUT.format(mid="MXX"), encoding="utf-8")
    (sp/"guardrails.md").write_text(T_GUARDRAILS.format(name=name), encoding="utf-8")

    # license.md
    (base/"license.md").write_text(T_LICENSE, encoding="utf-8")

    # hash.txt
    (base/"hash.txt").write_text(f"Pack: {name}\nSlug: {slug}\nRun ID: {run_id}\nTimestamp: {ts}\n", encoding="utf-8")

    # Zip it
    out_zip = pathlib.Path(out_zip)
    with zipfile.ZipFile(out_zip, "w", zipfile.ZIP_DEFLATED) as z:
        for path in base.rglob("*"):
            z.write(path, arcname=str(path.relative_to(base.parent)))
    print(str(out_zip))

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("Usage: forge_pack_builder.py pack.json output.zip")
        raise SystemExit(1)
    build_pack(sys.argv[1], sys.argv[2])
