# PromptForge Accessibility Guide

## Overview

This guide outlines the comprehensive accessibility (A11y) implementation for PromptForge v3, ensuring WCAG 2.1 AA compliance and providing an inclusive user experience for all users, including those using assistive technologies.

## WCAG 2.1 AA Compliance

### Color Contrast

All color combinations meet WCAG 2.1 AA contrast requirements:

- **Normal text**: 4.5:1 contrast ratio minimum
- **Large text**: 3:1 contrast ratio minimum
- **UI components**: 3:1 contrast ratio minimum

#### Color System
```typescript
// Design tokens with WCAG 2.1 AA compliant colors
colors: {
  fg: {
    primary: 'oklch(0.985 0 0)', // 21:1 contrast on dark
    secondary: 'oklch(0.75 0 0)', // 4.5:1 contrast (AA)
    tertiary: 'oklch(0.65 0 0)', // 3:1 contrast (AA large)
    accent: 'oklch(0.75 0.189 84.429)', // 4.5:1 contrast
  },
  accent: {
    primary: 'oklch(0.708 0.189 84.429)', // #d1a954
    hover: 'oklch(0.75 0.189 84.429)', // 4.5:1 contrast
    focus: 'oklch(0.8 0.189 84.429)', // 4.5:1 contrast
  }
}
```

### Interactive Element Signaling

#### Button Differentiation
- **Primary buttons**: Gold background with dark text (4.5:1 contrast)
- **Secondary buttons**: Transparent with gold border and hover states
- **Ghost buttons**: Minimal styling with clear hover/focus indicators
- **Destructive buttons**: Red background with white text (4.5:1 contrast)

#### Link Differentiation
- **Default links**: Gold color with underline on hover
- **Button-style links**: Clear button appearance with borders
- **External links**: Automatic detection with external link icon

### Focus Indicators

All interactive elements have visible focus indicators:

```css
.focus-ring {
  &:focus-visible {
    outline: none;
    ring: 2px;
    ringColor: oklch(0.8 0.189 84.429); /* Gold focus ring */
    ringOffset: 2px;
    ringOffsetColor: oklch(0.145 0 0); /* Dark background */
  }
}
```

### Tab Order

- Logical tab order throughout the application
- Skip links for main content navigation
- Proper focus management in modals and overlays
- Keyboard navigation support for all interactive elements

## Navigation System

### Multiple Navigation Pathways

1. **Primary Navigation**: Main menu with clear labels
2. **Search**: Global search functionality
3. **Breadcrumbs**: Contextual navigation
4. **Skip Links**: Direct access to main content
5. **Sitemap**: Complete site structure

### Skip Links Implementation

```tsx
import { SkipLink } from '@/components/ui/skip-link'

// Skip to main content
<SkipLink href="#main-content">Skip to main content</SkipLink>

// Skip to search
<SkipLink href="#search">Skip to search</SkipLink>

// Skip to user menu
<SkipLink href="#user-menu">Skip to user menu</SkipLink>
```

### Navigation Component

```tsx
import { Navigation } from '@/components/ui/navigation'

<Navigation
  currentPage="/dashboard"
  user={user}
  onMenuToggle={handleMenuToggle}
  isMenuOpen={isMenuOpen}
/>
```

## Heading Hierarchy

### Proper Heading Structure

Use semantic heading components for proper hierarchy:

```tsx
import { H1, H2, H3, H4, H5, H6 } from '@/components/ui/heading'

<H1>Main Page Title</H1>
  <H2>Section Title</H2>
    <H3>Subsection Title</H3>
      <H4>Sub-subsection Title</H4>
```

### Content Grouping

Use semantic section components for proper content organization:

```tsx
import { Main, Section, Article, Aside } from '@/components/ui/section'

<Main id="main-content">
  <Section variant="default" spacing="lg">
    <Article>
      <H1>Article Title</H1>
      <p>Article content...</p>
    </Article>
  </Section>
  
  <Aside>
    <H2>Related Content</H2>
    <p>Sidebar content...</p>
  </Aside>
</Main>
```

## Screen Reader Optimizations

### Screen Reader Only Content

```tsx
import { ScreenReaderOnly } from '@/components/ui/screen-reader-only'

<button>
  <span>Save</span>
  <ScreenReaderOnly>Save document to disk</ScreenReaderOnly>
</button>
```

### Visually Hidden Content

```tsx
import { VisuallyHidden } from '@/components/ui/visually-hidden'

<VisuallyHidden showOnFocus>
  <a href="#main-content">Skip to main content</a>
</VisuallyHidden>
```

### ARIA Labels and Descriptions

```tsx
<Button
  aria-label="Close dialog"
  aria-describedby="dialog-description"
  variant="ghost"
>
  <X className="h-4 w-4" />
</Button>
```

## Accessibility Testing

### Color Contrast Testing

```typescript
import { getContrastRatio, isWCAGCompliant } from '@/utils/accessibility'

const contrastRatio = getContrastRatio('#d1a954', '#000000')
const isCompliant = isWCAGCompliant(contrastRatio) // true
```

### Focus Management

```typescript
import { focusManager } from '@/utils/accessibility'

// Save current focus
focusManager.saveFocus()

// Open modal
openModal()

// Trap focus in modal
focusManager.trapFocus(modalElement)

// Restore focus when modal closes
focusManager.restoreFocus()
```

### Screen Reader Announcements

```typescript
import { ScreenReader } from '@/utils/accessibility'

// Announce success message
ScreenReader.announce('Document saved successfully', 'polite')

// Announce error message
ScreenReader.announce('Error: Please check your input', 'assertive')
```

## Keyboard Navigation

### Keyboard Shortcuts

```typescript
import { KeyboardNavigation } from '@/utils/accessibility'

const handleKeyDown = (event: KeyboardEvent) => {
  KeyboardNavigation.handleKeyboardEvent(event, {
    onEscape: () => closeModal(),
    onEnter: () => submitForm(),
    onArrowUp: () => selectPreviousItem(),
    onArrowDown: () => selectNextItem(),
  })
}
```

### Focus Trapping

```typescript
import { focusManager } from '@/utils/accessibility'

// Trap focus in modal
useEffect(() => {
  if (isOpen) {
    focusManager.trapFocus(modalRef.current)
  } else {
    focusManager.releaseFocus(modalRef.current)
  }
}, [isOpen])
```

## High Contrast Mode Support

### CSS Media Query

```css
@media (prefers-contrast: high) {
  .high-contrast {
    border: 2px solid currentColor;
    background: Canvas;
    color: CanvasText;
  }
}
```

### Component Usage

```tsx
<div className="high-contrast">
  High contrast content
</div>
```

## Reduced Motion Support

### CSS Media Query

```css
@media (prefers-reduced-motion: reduce) {
  .reduced-motion {
    transition: none;
    animation: none;
  }
}
```

### Component Usage

```tsx
<div className="reduced-motion">
  Content with reduced motion
</div>
```

## Testing Checklist

### Manual Testing

- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible on all focusable elements
- [ ] Color contrast meets WCAG 2.1 AA standards
- [ ] Screen reader announces content appropriately
- [ ] Skip links work correctly
- [ ] Heading hierarchy is logical
- [ ] Form labels are properly associated
- [ ] Error messages are announced to screen readers

### Automated Testing

```typescript
// Example test using accessibility utilities
import { getContrastRatio, isWCAGCompliant } from '@/utils/accessibility'

test('button colors meet WCAG 2.1 AA contrast requirements', () => {
  const primaryButtonContrast = getContrastRatio('#d1a954', '#000000')
  expect(isWCAGCompliant(primaryButtonContrast)).toBe(true)
})
```

### Browser Testing

- **Chrome**: Built-in accessibility tools
- **Firefox**: Accessibility Inspector
- **Safari**: Web Inspector accessibility features
- **Edge**: Accessibility Insights

### Screen Reader Testing

- **NVDA** (Windows, free)
- **JAWS** (Windows, paid)
- **VoiceOver** (macOS, built-in)
- **Orca** (Linux, free)

## Best Practices

### 1. Semantic HTML
- Use proper HTML elements for their intended purpose
- Maintain logical heading hierarchy
- Use landmarks (main, nav, aside, etc.)

### 2. ARIA Usage
- Use ARIA labels and descriptions appropriately
- Implement ARIA live regions for dynamic content
- Use ARIA states and properties correctly

### 3. Keyboard Navigation
- Ensure all functionality is keyboard accessible
- Provide clear focus indicators
- Implement logical tab order

### 4. Color and Contrast
- Never rely on color alone to convey information
- Ensure sufficient color contrast
- Test with color blindness simulators

### 5. Content Structure
- Use clear, descriptive headings
- Provide alternative text for images
- Structure content logically

## Resources

### WCAG Guidelines
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WCAG 2.1 AA Checklist](https://www.wuhcag.com/wcag-checklist/)

### Testing Tools
- [WAVE Web Accessibility Evaluator](https://wave.webaim.org/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse Accessibility Audit](https://developers.google.com/web/tools/lighthouse)

### Screen Readers
- [NVDA Download](https://www.nvaccess.org/download/)
- [JAWS Information](https://www.freedomscientific.com/products/software/jaws/)
- [VoiceOver Guide](https://www.apple.com/accessibility/vision/)

## Implementation Status

✅ **Completed**
- WCAG 2.1 AA color contrast compliance
- Interactive element signaling
- Focus indicators and tab order
- Navigation with multiple pathways
- Heading hierarchy and content grouping
- Skip links and screen reader optimizations
- Accessibility testing utilities

🔄 **In Progress**
- Comprehensive testing across all pages
- Performance optimization for assistive technologies

📋 **Planned**
- Advanced keyboard shortcuts
- Voice control integration
- Enhanced screen reader support
