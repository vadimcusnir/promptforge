"use client"

import type React from "react"

type Props = { children?: React.ReactNode }

/** Bară de sub-navigație cu înălțime fixă – elimină "săritul" layoutului */
export default function SubnavSlot({ children }: Props) {
  return (
    <div
      role="navigation"
      aria-label="Section navigation"
      className="sticky top-[80px] z-30 border-b border-[var(--pf-border)] bg-[var(--pf-bg)]/85 backdrop-blur"
      style={{ height: 56 }}
    >
      <div className="max-w-[1280px] mx-auto h-full px-6 flex items-center">
        {children /* dacă e null, păstrează înălțimea */}
      </div>
    </div>
  )
}
