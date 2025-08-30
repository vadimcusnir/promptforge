# Accessibility Testing Guide

This document describes the accessibility testing setup for PromptForge, including automated CI/CD tests and local development tools.

## Overview

PromptForge implements comprehensive accessibility testing to ensure WCAG 2.1 AA compliance across all pages and components. The testing includes:

- **axe-core**: Automated accessibility testing
- **pa11y**: WCAG compliance validation
- **linkchecker**: Link integrity verification
- **ARIA validation**: Custom checks for proper ARIA usage
- **Color contrast**: Design token compliance

## CI/CD Integration

Accessibility tests run automatically on every push and pull request as part of the CI pipeline. The tests are integrated into the GitHub Actions workflow at `.github/workflows/ci.yml`.

### Test Coverage

The following pages are tested for accessibility:

- Homepage (`/`)
- Modules (`/modules`)
- Pricing (`/pricing`)
- Documentation (`/docs`)
- Guides (`/guides`)
- Generator (`/generator`)

### Test Results

Test results are uploaded as artifacts and include:

- `axe-results-*.json`: Detailed accessibility violations
- `pa11y-results.json`: WCAG compliance results
- `linkchecker-results.json`: Broken link reports

## Local Development

### Prerequisites

Install the required accessibility testing tools:

```bash
npm install -g @axe-core/cli pa11y-ci linkchecker
```

### Running Tests

#### Quick Test
```bash
pnpm test:accessibility:local
```

This runs the comprehensive accessibility test suite locally.

#### Individual Tests
```bash
# Test specific pages with axe-core
pnpm test:a11y:pages

# Test link integrity
pnpm test:links

# Test WCAG compliance with pa11y
pnpm test:pa11y
```

### Test Configuration

#### axe-core Configuration
Tests are configured to use WCAG 2.1 AA standards with JSON output for detailed reporting.

#### pa11y Configuration
Configuration is stored in `.pa11yci.json`:
- Timeout: 30 seconds
- Standard: WCAG2AA
- Chrome flags for CI compatibility

#### Link Checker Configuration
Configuration is stored in `.linkcheckerrc`:
- 10 concurrent threads
- 30-second timeout
- JSON output format

## Accessibility Standards

### WCAG 2.1 AA Compliance

All pages must meet WCAG 2.1 AA standards, including:

- **Perceivable**: Information must be presentable in ways users can perceive
- **Operable**: Interface components must be operable
- **Understandable**: Information and UI operation must be understandable
- **Robust**: Content must be robust enough for various assistive technologies

### Design Token Compliance

The application uses centralized design tokens for consistent accessibility:

- **Color contrast**: Minimum 4.5:1 ratio for normal text
- **Focus indicators**: Visible focus rings on all interactive elements
- **Typography**: Readable font sizes and line heights
- **Spacing**: Consistent spacing using design tokens

### ARIA Best Practices

Components must follow ARIA best practices:

- **Labels**: All interactive elements have proper labels
- **Roles**: Semantic roles for custom components
- **States**: Proper state management for dynamic content
- **Navigation**: Logical tab order and keyboard navigation

## Common Issues and Solutions

### Color Contrast Issues

**Problem**: Text doesn't meet contrast requirements
**Solution**: Use design tokens from `styles/tokens.ts` instead of hardcoded colors

```tsx
// ❌ Bad
<div className="bg-[#123456] text-[#789abc]">

// ✅ Good
<div className="bg-card text-fg-primary">
```

### Missing ARIA Labels

**Problem**: Interactive elements without labels
**Solution**: Add proper ARIA attributes

```tsx
// ❌ Bad
<button onClick={handleClick}>Click me</button>

// ✅ Good
<button onClick={handleClick} aria-label="Submit form">
  Submit
</button>
```

### Heading Hierarchy

**Problem**: Multiple h1 elements or missing headings
**Solution**: Use proper heading hierarchy

```tsx
// ❌ Bad
<h1>Page Title</h1>
<h1>Section Title</h1>

// ✅ Good
<h1>Page Title</h1>
<h2>Section Title</h2>
```

### Form Labels

**Problem**: Form inputs without labels
**Solution**: Associate labels with inputs

```tsx
// ❌ Bad
<input type="text" placeholder="Enter name" />

// ✅ Good
<label htmlFor="name">Name</label>
<input id="name" type="text" />
```

## Testing Tools

### axe-core

Automated accessibility testing with detailed violation reports.

```bash
# Test single page
axe http://localhost:3000

# Test multiple pages
axe http://localhost:3000 http://localhost:3000/modules
```

### pa11y

WCAG compliance testing with configurable standards.

```bash
# Test with default configuration
pa11y-ci --config .pa11yci.json

# Test single page
pa11y http://localhost:3000
```

### linkchecker

Comprehensive link integrity testing.

```bash
# Test with configuration
linkchecker --config=.linkcheckerrc http://localhost:3000

# Test with custom settings
linkchecker --threads=5 --timeout=20 http://localhost:3000
```

## Continuous Improvement

### Monitoring

Accessibility test results are monitored in CI/CD:

- Failed tests block deployments
- Results are archived for trend analysis
- Violations are tracked and prioritized

### Updates

Accessibility testing is regularly updated:

- Tool versions are kept current
- New WCAG guidelines are adopted
- Test coverage is expanded

### Training

Team members are trained on:

- Accessibility best practices
- Testing tool usage
- Common violation patterns
- Remediation techniques

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core Documentation](https://github.com/dequelabs/axe-core)
- [pa11y Documentation](https://github.com/pa11y/pa11y)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Support

For accessibility-related questions or issues:

1. Check the test results in CI/CD artifacts
2. Run local tests to reproduce issues
3. Review this documentation for solutions
4. Consult the resources above for detailed guidance
5. Contact the development team for assistance
