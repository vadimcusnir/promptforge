import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - PromptForge Industrial Prompt Engineering",
  description: "Choose the right plan for your prompt engineering needs. From free tier to enterprise solutions with 50 modules, 7D parameters, and unlimited exports.",
  keywords: ["prompt engineering pricing", "AI tool pricing", "enterprise AI", "prompt generation plans", "industrial automation pricing"],
  authors: [{ name: "PromptForge Team" }],
  creator: "PromptForge",
  publisher: "PromptForge",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing - PromptForge Industrial Prompt Engineering",
    description: "Choose the right plan for your prompt engineering needs. From free tier to enterprise solutions with 50 modules, 7D parameters, and unlimited exports.",
    type: "website",
    url: "/pricing",
    siteName: "PromptForge",
    images: [
      {
        url: "/og/pricing.webp",
        width: 1200,
        height: 630,
        alt: "PromptForge Pricing Plans",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing - PromptForge Industrial Prompt Engineering",
    description: "Choose the right plan for your prompt engineering needs. From free tier to enterprise solutions with 50 modules, 7D parameters, and unlimited exports.",
    images: ["/og/pricing.webp"],
    creator: "@promptforge",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
