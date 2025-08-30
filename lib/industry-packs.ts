export const industryPacks = [];
export const getIndustryPack = (domain: any) => ({ pack: { domain, templates: [] } });
export const getAvailablePacksForUser = (entitlements: any) => ({
  available: [{ domain: 'general', name: 'General Pack' }],
  restricted: [{ pack: { domain: 'premium', name: 'Premium Pack' } }]
});
export const getTemplatesForDomain = (domain: any) => [];
