import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://chatgpt-prompting.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/*",
          "/dashboard/*",
          "/coming-soon", // Conform documentației - Disallow: /coming-soon
          "/tmp/*",
        ],
        allow: [
          "/docs/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
