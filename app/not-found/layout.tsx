import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | PromptForge",
  description: "The requested page could not be found. Return to PromptForge to continue your industrial prompt engineering journey.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFoundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
