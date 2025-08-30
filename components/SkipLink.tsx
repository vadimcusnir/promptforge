"use client";

import { COPY } from "@/lib/copy";

export function SkipLink() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const main = document.querySelector("main");
    if (main) {
      main.focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href="#main"
      onClick={handleClick}
      className="skip-link absolute -top-10 left-6 bg-[hsl(var(--accent))] text-black px-4 py-2 rounded z-[1200] transition-all duration-300 focus:top-6 focus:outline-2 focus:outline-white focus:outline-offset-2"
      tabIndex={0}
    >
      {COPY.skip_to_content}
    </a>
  );
}
