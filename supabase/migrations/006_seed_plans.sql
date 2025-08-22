-- PromptForge Database Migration 006
-- Seed canonical plans with feature flags
-- Run this after migration 003 (billing_entitlements)

-- Clear existing plans first (for re-runs)
DELETE FROM plans;

-- Pilot Plan - Basic features for getting started
INSERT INTO public.plans(code, name, flags, retention_days)
VALUES ('pilot', 'Pilot', '{
  "canUseAllModules": false,
  "canExportMD": true,
  "canExportPDF": false,
  "canExportJSON": false,
  "canUseGptTestReal": false,
  "hasCloudHistory": false,
  "hasEvaluatorAI": false,
  "hasAPI": false,
  "hasWhiteLabel": false,
  "canExportBundleZip": false,
  "hasSeatsGT1": false,
  "maxRunsPerDay": 10,
  "maxSeats": 1
}', 30)
ON CONFLICT (code) DO UPDATE SET 
  flags = EXCLUDED.flags,
  retention_days = EXCLUDED.retention_days,
  updated_at = NOW();

-- Pro Plan - Full featured for professionals
INSERT INTO public.plans(code, name, flags, retention_days)
VALUES ('pro', 'Pro', '{
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
  "hasSeatsGT1": false,
  "maxRunsPerDay": 100,
  "maxSeats": 1
}', 90)
ON CONFLICT (code) DO UPDATE SET 
  flags = EXCLUDED.flags,
  retention_days = EXCLUDED.retention_days,
  updated_at = NOW();

-- Enterprise Plan - Everything + team features
INSERT INTO public.plans(code, name, flags, retention_days)
VALUES ('enterprise', 'Enterprise', '{
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
  "hasSeatsGT1": true,
  "maxRunsPerDay": 1000,
  "maxSeats": 999
}', 365)
ON CONFLICT (code) DO UPDATE SET 
  flags = EXCLUDED.flags,
  retention_days = EXCLUDED.retention_days,
  updated_at = NOW();

-- Verify the seed
SELECT 
  code,
  name,
  retention_days,
  flags->'canUseGptTestReal' as can_use_gpt_test,
  flags->'canExportPDF' as can_export_pdf,
  flags->'hasAPI' as has_api,
  flags->'maxRunsPerDay' as max_runs_per_day
FROM plans 
ORDER BY 
  CASE code 
    WHEN 'pilot' THEN 1 
    WHEN 'pro' THEN 2 
    WHEN 'enterprise' THEN 3 
  END;

SELECT 'Migration 006 completed: Plans seeded with canonical feature flags' as status;
