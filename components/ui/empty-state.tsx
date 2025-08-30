import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Search, BookOpen, Zap } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description: string
  primaryAction?: {
    label: string
    href: string
  }
  secondaryAction?: {
    label: string
    href: string
  }
  className?: string
}

export function EmptyState({ 
  icon: Icon = Search, 
  title, 
  description, 
  primaryAction,
  secondaryAction,
  className 
}: EmptyStateProps) {
  return (
    <Card className={cn("bg-zinc-900/80 border border-zinc-700", className)}>
      <CardContent className="p-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <Icon className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">{description}</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryAction && (
            <Button
              className="bg-yellow-500 hover:bg-yellow-500/80 text-black"
              asChild
            >
              <Link href={primaryAction.href}>
                {primaryAction.label}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          )}
          
          {secondaryAction && (
            <Button
              variant="outline"
              className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
              asChild
            >
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Predefined empty states for common use cases
export function EmptyModulesState() {
  return (
    <EmptyState
      icon={Zap}
      title="No modules found"
      description="No modules match your current filters. Try adjusting your search criteria or explore all available modules."
      primaryAction={{
        label: "View All Modules",
        href: "/modules"
      }}
      secondaryAction={{
        label: "Browse Guides",
        href: "/guides"
      }}
    />
  )
}

export function EmptyGuidesState() {
  return (
    <EmptyState
      icon={BookOpen}
      title="No guides available yet"
      description="Our comprehensive guides are coming soon. In the meantime, explore our modules or start building with the Generator."
      primaryAction={{
        label: "Start Building Now",
        href: "/generator"
      }}
      secondaryAction={{
        label: "Explore Modules",
        href: "/modules"
      }}
    />
  )
}

// Additional empty states for specific use cases
export function NoPromptsEmptyState() {
  return (
    <EmptyState
      icon={Zap}
      title="No prompts yet"
      description="Start creating your first industrial-grade prompt with our Generator."
      primaryAction={{
        label: "Create First Prompt",
        href: "/generator"
      }}
      secondaryAction={{
        label: "Browse Modules",
        href: "/modules"
      }}
    />
  )
}

export function NoTestsEmptyState() {
  return (
    <EmptyState
      icon={Search}
      title="No tests available"
      description="Run some tests to see your results here."
      primaryAction={{
        label: "Run Tests",
        href: "/generator"
      }}
    />
  )
}

export function ErrorEmptyState() {
  return (
    <EmptyState
      icon={Search}
      title="Something went wrong"
      description="We encountered an error. Please try again or contact support if the problem persists."
      primaryAction={{
        label: "Try Again",
        href: "/"
      }}
      secondaryAction={{
        label: "Contact Support",
        href: "/contact"
      }}
    />
  )
}

export function NoHistoryEmptyState() {
  return (
    <EmptyState
      icon={Search}
      title="No history yet"
      description="Your prompt generation history will appear here once you start creating prompts."
      primaryAction={{
        label: "Start Building Now",
        href: "/generator"
      }}
      secondaryAction={{
        label: "Explore Modules",
        href: "/modules"
      }}
    />
  )
}