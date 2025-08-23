-- 0005_seed_data.sql — seed essential data
begin;

-- Only seed on development environment
do $$
declare 
  env text := current_setting('app.env', true);
begin
  if env is null or env = 'dev' then
    -- Seed plans with feature flags
    insert into plans (plan_code, name, flags, module_allowlist, retention_days) values
      (
        'free', 
        'Free', 
        '{
          "canUseAllModules": false,
          "canExportMD": false,
          "canExportPDF": false,
          "canExportJSON": false,
          "canUseGptTestReal": false,
          "hasCloudHistory": false,
          "hasEvaluatorAI": false,
          "hasAPI": false,
          "hasWhiteLabel": false,
          "canExportBundleZip": false,
          "hasSeatsGT1": false
        }'::jsonb,
        array['M01', 'M10', 'M18'],
        7
      ),
      (
        'creator',
        'Creator',
        '{
          "canUseAllModules": true,
          "canExportMD": true,
          "canExportPDF": false,
          "canExportJSON": false,
          "canUseGptTestReal": false,
          "hasCloudHistory": false,
          "hasEvaluatorAI": false,
          "hasAPI": false,
          "hasWhiteLabel": false,
          "canExportBundleZip": false,
          "hasSeatsGT1": false
        }'::jsonb,
        array[]::text[],
        30
      ),
      (
        'pro',
        'Pro',
        '{
          "canUseAllModules": true,
          "canExportMD": true,
          "canExportPDF": true,
          "canExportJSON": true,
          "canUseGptTestReal": true,
          "hasCloudHistory": true,
          "hasEvaluatorAI": true,
          "hasAPI": false,
          "hasWhiteLabel": false,
          "canExportBundleZip": false,
          "hasSeatsGT1": false
        }'::jsonb,
        array[]::text[],
        90
      ),
      (
        'enterprise',
        'Enterprise',
        '{
          "canUseAllModules": true,
          "canExportMD": true,
          "canExportPDF": true,
          "canExportJSON": true,
          "canUseGptTestReal": true,
          "hasCloudHistory": true,
          "hasEvaluatorAI": true,
          "hasAPI": true,
          "hasWhiteLabel": true,
          "canExportBundleZip": true,
          "hasSeatsGT1": true
        }'::jsonb,
        array[]::text[],
        -1
      )
    on conflict (plan_code) do update set
      flags = excluded.flags,
      module_allowlist = excluded.module_allowlist,
      retention_days = excluded.retention_days;

    -- Seed core modules (sample from M01-M50)
    insert into modules (id, title, description, vectors, requirements, spec, kpi, guardrails) values
      (
        'M01',
        'PROMPTFORGE.SOPFORGE™',
        'Pipeline research→validare→SOP',
        array[1,6,5],
        'Subiect/domeniu, nivel detaliu, context business',
        'Role map, pași, fallback, retries (idempotent)',
        'TTI, %steps_passed, defect<2%',
        'no guesswork, citează oficial'
      ),
      (
        'M07',
        'Risk & Trust Reversal',
        'Garanții cuantificate high-ticket',
        array[2,7],
        'Offer profile, obiecții top, proof assets',
        'Map obiecții → tip risc → mecanisme reversare',
        'drop-off -25%',
        'juridic valid'
      ),
      (
        'M10',
        'Zero-Party Data OS',
        'Consimțământ + personalizare',
        array[6,3],
        'Audit current data, compliance requirements',
        'GDPR-first collection + value exchange design',
        'consent_rate >80%, value_perception >4/5',
        'GDPR compliance, transparent value prop'
      ),
      (
        'M12',
        'Diagnostic de Vizibilitate',
        'Score→plan execuție',
        array[1],
        'Current state assessment, goals definition',
        'Chestionar→score→raport→email',
        'completion>70%, reply to plan>25%',
        'data privacy, actionable recommendations'
      ),
      (
        'M13',
        'Pricing Psychology',
        'Ancorare, pachete, decoy',
        array[4],
        'Current pricing, target margins, market position',
        'Experimente pe preț; Stripe Price API',
        'ARPU↑, CR net↑',
        'transparență preț'
      ),
      (
        'M18',
        'Retention & LTV Engine',
        'Anti-churn, expansion, NRR playbook',
        array[4,5],
        'Current churn data, expansion opportunities',
        'Churn prediction + intervention flows',
        'churn_rate <5%, expansion_revenue >20%',
        'ethical retention, value-first approach'
      ),
      (
        'M22',
        'SOP Lead Gen',
        'Make/Notion/Telegram failover',
        array[3,6],
        'Lead sources, qualification criteria, CRM setup',
        'Multi-channel lead capture + nurture sequences',
        'lead_quality_score >7/10, cost_per_lead <target',
        'GDPR consent, anti-spam compliance'
      ),
      (
        'M31',
        'Closed-Loop Telemetry',
        'GA4/Mixpanel→BQ→re-antrenare',
        array[6,7],
        'Current analytics setup, data goals',
        'Event taxonomy + pipeline + ML feedback loop',
        'data_completeness >95%, insight_accuracy >80%',
        'PII protection, data minimization'
      ),
      (
        'M44',
        'Ethical Guardrails în GPT',
        'Policy tests + logs',
        array[7,2],
        'Use cases, risk assessment, compliance requirements',
        'Multi-layer content filtering + audit trail',
        'policy_violation_rate <1%, false_positive_rate <5%',
        'bias detection, transparency requirements'
      ),
      (
        'M50',
        'CUSNIR.OS™',
        'Registry/benchmarks/ontologie comună',
        array[6,7,1],
        'Current systems, integration points, standards',
        'Unified knowledge graph + API layer',
        'integration_success_rate >95%, query_performance <100ms',
        'open standards, interoperability focus'
      )
    on conflict (id) do update set
      title = excluded.title,
      description = excluded.description,
      vectors = excluded.vectors,
      requirements = excluded.requirements,
      spec = excluded.spec,
      kpi = excluded.kpi,
      guardrails = excluded.guardrails;

    -- Seed module versions for the core modules
    insert into module_versions (module_id, semver, changelog, spec_json) values
      ('M01', '1.0.0', 'Initial release', '{"name":"PROMPTFORGE.SOPFORGE™","type":"pipeline"}'::jsonb),
      ('M07', '1.0.0', 'Initial release', '{"name":"Risk & Trust Reversal","type":"conversion"}'::jsonb),
      ('M10', '1.0.0', 'Initial release', '{"name":"Zero-Party Data OS","type":"data"}'::jsonb),
      ('M12', '1.0.0', 'Initial release', '{"name":"Diagnostic de Vizibilitate","type":"assessment"}'::jsonb),
      ('M13', '1.0.0', 'Initial release', '{"name":"Pricing Psychology","type":"optimization"}'::jsonb),
      ('M18', '1.0.0', 'Initial release', '{"name":"Retention & LTV Engine","type":"retention"}'::jsonb),
      ('M22', '1.0.0', 'Initial release', '{"name":"SOP Lead Gen","type":"automation"}'::jsonb),
      ('M31', '1.0.0', 'Initial release', '{"name":"Closed-Loop Telemetry","type":"analytics"}'::jsonb),
      ('M44', '1.0.0', 'Initial release', '{"name":"Ethical Guardrails în GPT","type":"safety"}'::jsonb),
      ('M50', '1.0.0', 'Initial release', '{"name":"CUSNIR.OS™","type":"platform"}'::jsonb)
    on conflict (module_id, semver) do nothing;

    -- Seed industry packs
    insert into industry_packs (slug, title, min_plan, price_eur, modules, domain_config) values
      (
        'fintech',
        'FinTech Pack',
        'pro',
        1990,
        array['M07', 'M13', 'M31', 'M44', 'M50'],
        '{
          "jargon": ["KYC", "AML", "regtech", "sandboxing"],
          "kpis": ["fraud_rate", "KYC_time", "approval_rate"],
          "compliance_notes": "SEC/FCA sensitive; verifiable claims only",
          "style_bias": "analytical, layered, formal",
          "default_output_format": "spec",
          "risk_level": "high"
        }'::jsonb
      ),
      (
        'ecommerce',
        'E-Commerce Pack',
        'pro',
        1490,
        array['M13', 'M18', 'M22', 'M31'],
        '{
          "jargon": ["CR", "AOV", "LTV", "CAC", "RFM segmentation"],
          "kpis": ["conversion_rate", "average_order_value", "lifetime_value"],
          "compliance_notes": "Transparent pricing & returns",
          "style_bias": "operational, test-driven, actionable",
          "default_output_format": "playbook",
          "risk_level": "medium"
        }'::jsonb
      ),
      (
        'education',
        'Education Pack',
        'pro',
        1490,
        array['M01', 'M10', 'M12', 'M31', 'M44'],
        '{
          "jargon": ["LMS", "cohort", "rubric-based", "engagement"],
          "kpis": ["completion_rate", "engagement_rate", "retention_rate"],
          "compliance_notes": "Privacy first; academic integrity",
          "style_bias": "supportive, clear, instructional",
          "default_output_format": "playbook",
          "risk_level": "medium"
        }'::jsonb
      )
    on conflict (slug) do update set
      title = excluded.title,
      min_plan = excluded.min_plan,
      price_eur = excluded.price_eur,
      modules = excluded.modules,
      domain_config = excluded.domain_config;

    raise notice 'Seeded % plans, % modules, % module versions, % industry packs', 
      (select count(*) from plans),
      (select count(*) from modules),
      (select count(*) from module_versions),
      (select count(*) from industry_packs);
  else
    raise notice 'Skipping seed data in % environment', env;
  end if;
end $$;

commit;
