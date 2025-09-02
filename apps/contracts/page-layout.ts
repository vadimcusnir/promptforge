export interface PageContract {
  meta: {
    title: string
    description: string
    canonical: string
  }
  header: {
    h1: string
    subheading?: string
  }
  sections: Array<{
    id: string
    required: boolean
  }>
}

export interface SubnavContract {
  tabs: Array<{
    id: string
    label: string
    href?: string
    required: boolean
  }>
  variant: "default" | "pills" | "underline"
  height: "fixed" // Must be fixed to prevent layout jumps
}

export function validatePageContract(page: Partial<PageContract>): string[] {
  const errors: string[] = []

  if (!page.meta?.title) {
    errors.push("Page must have meta.title")
  }

  if (!page.meta?.description) {
    errors.push("Page must have meta.description")
  }

  if (!page.header?.h1) {
    errors.push("Page must have header.h1")
  }

  // Validate H1 follows typographic contract
  if (page.header?.h1 && page.header.h1.length > 85) {
    errors.push("H1 must be ≤85 characters for readability")
  }

  return errors
}

export function validateSubnavContract(subnav: Partial<SubnavContract>): string[] {
  const errors: string[] = []

  if (!subnav.tabs || subnav.tabs.length === 0) {
    errors.push("Subnav must have at least one tab")
  }

  if (subnav.height !== "fixed") {
    errors.push("Subnav height must be 'fixed' to prevent layout jumps")
  }

  return errors
}

export function isValidPageContract(page: any): page is PageContract {
  return validatePageContract(page).length === 0
}

export function isValidSubnavContract(subnav: any): subnav is SubnavContract {
  return validateSubnavContract(subnav).length === 0
}
