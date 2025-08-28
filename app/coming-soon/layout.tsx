import type React from "react"

export default function ComingSoonLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="coming-soon-layout">
      {children}
    </div>
  )
}
