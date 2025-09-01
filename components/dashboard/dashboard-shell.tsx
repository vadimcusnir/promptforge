'use client'

import { ReactNode } from 'react'

interface DashboardShellProps {
  children: ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      {children}
    </div>
  )
}
