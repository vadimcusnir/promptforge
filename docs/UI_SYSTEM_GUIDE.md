# PromptForge UI System Guide

## Overview

The PromptForge UI system provides a comprehensive design system with consistent components, design tokens, and styling patterns. This system ensures uniform styling across all pages and components while maintaining the project's dark theme with gold accent (#d1a954) and glassmorphism effects.

## Design Tokens

### Location
- **File**: `styles/tokens.ts`
- **Usage**: Import tokens in components and Tailwind config

### Color System

#### Foreground Colors
- `fg.primary`: Primary text color (white)
- `fg.secondary`: Secondary text color (muted)
- `fg.tertiary`: Disabled text color
- `fg.accent`: Accent text color (gold)

#### Background Colors
- `bg.primary`: Primary background (dark)
- `bg.secondary`: Card background
- `bg.tertiary`: Elevated background
- `bg.glass`: Glass effect background
- `bg.glassHover`: Glass hover background

#### Accent Colors (Gold Theme)
- `accent.primary`: Primary gold (#d1a954)
- `accent.secondary`: Lighter gold
- `accent.tertiary`: Darker gold
- `accent.contrast`: Dark contrast for gold

#### State Colors
- `state.success`: Success state (green)
- `state.warning`: Warning state (yellow)
- `state.error`: Error state (red)
- `state.info`: Info state (blue)

### Spacing System
Based on 8px grid system:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px
- `4xl`: 96px

### Border Radius
- `sm`: 4px
- `md`: 8px
- `lg`: 12px
- `xl`: 16px
- `2xl`: 24px
- `full`: 9999px

### Z-Index System
- `dropdown`: 1000
- `sticky`: 1100
- `banner`: 1200
- `overlay`: 1300
- `modal`: 1400
- `popover`: 1500
- `toast`: 1700
- `tooltip`: 1800

## Components

### Button Component

#### Variants
1. **Primary** (default): Gold accent with dark contrast
2. **Secondary**: Ghost/outline style with glass effects
3. **Ghost**: Minimal styling
4. **Destructive**: Error state styling
5. **Link**: Text-only styling

#### States
- **Default**: Base styling
- **Hover**: Enhanced styling with shadows/transforms
- **Active**: Pressed state with scale transform
- **Disabled**: Muted colors and disabled pointer events

#### Sizes
- `sm`: 36px height
- `md`: 40px height (default)
- `lg`: 44px height
- `icon`: 40x40px square

#### Usage
```tsx
import { Button } from '@/components/ui/button'

// Primary button with icon
<Button variant="primary" icon={<Shield />} loading={isLoading}>
  Create Account
</Button>

// Secondary button
<Button variant="secondary">Cancel</Button>

// Ghost button
<Button variant="ghost">Skip</Button>
```

### Card Component

#### Variants
1. **Default**: Glass card with hover effects
2. **Elevated**: Prominent shadow and hover lift
3. **Minimal**: Subtle styling
4. **Interactive**: Clickable with scale effects

#### Sizes
- `sm`: 16px padding
- `md`: 24px padding (default)
- `lg`: 32px padding

#### Usage
```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'

<Card variant="default" size="md">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

### Link Component

#### Variants
1. **Default**: Gold accent with hover underline
2. **Muted**: Secondary styling for less prominent links
3. **Ghost**: Minimal styling
4. **Destructive**: Error state styling
5. **Button**: Button-like appearance

#### Features
- Automatic external link detection
- Icon support with positioning
- Consistent focus rings
- Accessibility attributes

#### Usage
```tsx
import { Link } from '@/components/ui/link'

// Internal link
<Link href="/dashboard" variant="default">
  Go to Dashboard
</Link>

// External link with icon
<Link href="https://example.com" external icon={<ExternalLink />}>
  Visit Website
</Link>

// Button-like link
<Link href="/signup" variant="button">
  Sign Up
</Link>
```

## Tailwind Integration

### Custom Utilities

#### Glass Effects
- `.glass`: Base glass effect
- `.glass-hover`: Hover state for glass elements
- `.glass-card`: Card-specific glass styling
- `.glass-card-hover`: Card hover effects

#### Focus Rings
- `.focus-ring`: Standard focus ring
- `.focus-ring-inset`: Inset focus ring

#### Usage in Classes
```tsx
// Glass card
<div className="glass-card hover:glass-card-hover">
  Content
</div>

// Focus ring
<button className="focus-ring">
  Button
</button>
```

### Color Classes
All design token colors are available as Tailwind classes:
- `text-fg-primary`, `bg-bg-primary`, `border-border-primary`
- `text-accent-primary`, `bg-accent-primary`
- `text-state-success`, `bg-state-error`

## Best Practices

### 1. Consistent Component Usage
- Always use the unified Button component instead of custom button styles
- Use Card variants appropriately for different contexts
- Apply Link component for all navigation elements

### 2. Design Token Usage
- Use design token classes instead of hardcoded colors
- Maintain consistent spacing using the spacing system
- Apply proper z-index values for layering

### 3. Accessibility
- All components include proper focus rings
- ARIA attributes are handled automatically
- Color contrast meets WCAG guidelines

### 4. Performance
- Glass effects are optimized for mobile devices
- Transitions use hardware acceleration
- Reduced motion preferences are respected

## Migration Guide

### From Old Components
1. Replace custom button styles with Button component variants
2. Update card styling to use Card component variants
3. Replace Link elements with Link component
4. Update color classes to use design token classes

### Example Migration
```tsx
// Before
<button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded">
  Submit
</button>

// After
<Button variant="primary">
  Submit
</Button>
```

## Browser Support
- Modern browsers with CSS Grid and Flexbox support
- CSS custom properties (CSS variables)
- Backdrop filter support for glass effects
- Graceful degradation for older browsers

## Performance Considerations
- Design tokens are compiled at build time
- Glass effects use optimized backdrop filters
- Transitions are hardware-accelerated
- Mobile-first responsive design
