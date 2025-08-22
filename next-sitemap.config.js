/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://chatgpt-prompting.com",
  generateRobotsTxt: true,
  alternateRefs: [], // fără alternate hreflang non-EN
  transform: async (config, path) => ({
    loc: path,
    changefreq: "weekly",
    priority: 0.7,
    hreflang: "en", // unic
  }),
};
