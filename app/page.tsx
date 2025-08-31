"use client";

import ComingSoonInteractive from "@/components/coming-soon-interactive";
import HomeInteractive from "@/components/home-interactive";
import MainContentInteractive from "@/components/main-content-interactive";

// Flag from environment to toggle the coming soon screen
const COMING_SOON = process.env.NEXT_PUBLIC_COMING_SOON === "true";

export default function HomePage() {
  return COMING_SOON ? (
    <ComingSoonInteractive />
  ) : (
    <>
      <HomeInteractive />
      <MainContentInteractive />
    </>
  );
}