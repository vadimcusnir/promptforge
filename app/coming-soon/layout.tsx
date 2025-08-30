import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon - PromptForge Industrial Prompt Engineering",
  description: "PromptForge is launching soon. Join our waitlist to be the first to experience industrial prompt engineering with 50 modules and 7D parameters.",
  keywords: ["prompt engineering", "coming soon", "waitlist", "industrial AI", "launch"],
  authors: [{ name: "PromptForge Team" }],
  creator: "PromptForge",
  publisher: "PromptForge",
  alternates: {
    canonical: "/coming-soon",
  },
  openGraph: {
    title: "Coming Soon - PromptForge Industrial Prompt Engineering",
    description: "PromptForge is launching soon. Join our waitlist to be the first to experience industrial prompt engineering with 50 modules and 7D parameters.",
    type: "website",
    url: "/coming-soon",
    siteName: "PromptForge",
    images: [
      {
        url: "/og/coming-soon.webp",
        width: 1200,
        height: 630,
        alt: "PromptForge Coming Soon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coming Soon - PromptForge Industrial Prompt Engineering",
    description: "PromptForge is launching soon. Join our waitlist to be the first to experience industrial prompt engineering with 50 modules and 7D parameters.",
    images: ["/og/coming-soon.webp"],
    creator: "@promptforge",
  },
  robots: {
    index: false, // noindex for coming soon page
    follow: true,
    googleBot: {
      index: false,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function ComingSoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}