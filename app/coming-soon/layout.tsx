import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon - PromptForge v3 | 50 Module 7-D Parameter Engine",
  description:
    "PromptForge v3 se lansează în curând. 50 de module semantice, 7-D Parameter Engine și export bundle deterministic. Înregistrează-te pentru early access.",
  robots: "noindex, nofollow", // Conform documentației - noindex pentru coming-soon
  openGraph: {
    title: "Coming Soon - PromptForge v3",
    description:
      "Prima platformă Cognitive-OS pentru prompts cu 50 module semantice și 7-D Parameter Engine",
    type: "website",
    images: [
      {
        url: "/og-image-coming-soon.png",
        width: 1200,
        height: 630,
        alt: "PromptForge v3 - Coming Soon",
      },
    ],
  },
};

export default function ComingSoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
