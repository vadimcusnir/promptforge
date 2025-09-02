"use client"

import React from "react"
import SubnavSlot from "./subnav-slot"

interface PageLayoutProps {
  children: React.ReactNode
  subnav?: React.ReactNode
  pageTitle?: string
  pageDescription?: string
  breadcrumb?: Array<{ label: string; href?: string }>
}

export function PageLayout({ children, subnav, pageTitle, pageDescription, breadcrumb }: PageLayoutProps) {
  return (
    <>
      {/* Fixed height subnav slot to prevent layout jumps */}
      <SubnavSlot>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-6">{subnav}</div>

          {breadcrumb && (
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground font-space-grotesk">
              {breadcrumb.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span>/</span>}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-[#00FF7F] focus:ring-offset-2 focus:ring-offset-background rounded"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="text-foreground">{item.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}
        </div>
      </SubnavSlot>

      <section className="max-w-[1280px] px-6 mx-auto py-8">{children}</section>
    </>
  )
}
