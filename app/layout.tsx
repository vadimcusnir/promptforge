import "./globals.css";
import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import { AuthProvider } from "@/lib/auth";

// Define font variables for headings and body text.
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "600", "700", "900"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Basic metadata for the site. You can extend this object with
// additional OpenGraph and Twitter metadata as needed.
export const metadata: Metadata = {
  title: "PromptForge — Generatorul Operațional de Prompturi | chatgpt-prompting.com",
  description:
    "Construiești sisteme de prompturi, nu piese unice. 50 module, engine 7‑D și export .md/.json/.pdf.",
  metadataBase: new URL("https://chatgpt-prompting.com"),
  // Additional metadata (icons, OpenGraph, Twitter) can be added here
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full bg-pf-black">
      <body
        className={`${montserrat.variable} ${openSans.variable} font-sans antialiased min-h-screen bg-pf-black`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}