"use client"

import { COPY } from "@/lib/copy"

export function SkipLink() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const main = document.querySelector('main')
    if (main) {
      main.focus()
      main.scrollIntoView()
    }
  }

  return (
    <a
      href="#main"
      onClick={handleClick}
      className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[1200] focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded focus:outline-2 focus:outline-white focus:outline-offset-2"
    >
      {COPY.skip_to_content}
    </a>
  )
}
