# 🛡️ Layout Protection System

⚠️ **SECURITY WARNING**: This documentation contains EXAMPLE data only!
- All sensitive data has been anonymized
- DO NOT use in production without proper sanitization
- This is documentation/example code only

## Overview

The Layout Protection System ensures that the global navigation structure (Header and Footer) is never duplicated across the application. This prevents navigation inconsistencies, accessibility issues, and maintains a clean, maintainable codebase.

## 🎯 Objectives

1. **Prevent Navigation Duplication**: Ensure Header and Footer appear exactly once per page
2. **Protect Global Layout**: Prevent unauthorized modifications to critical layout files
3. **Maintain Accessibility**: Ensure proper ARIA roles and semantic structure
4. **Automated Testing**: CI/CD pipeline prevents regressions
5. **Developer Guidance**: Clear rules and automated checks

## 🏗️ Architecture

### Global Layout Structure

```
app/layout.tsx (Root Layout)
├── Header (role="banner") - SINGLE INSTANCE
├── ComingSoonWrapper
│   └── {children} (Page Content)
└── Footer (role="contentinfo") - SINGLE INSTANCE
```

### Component Hierarchy

- **`app/layout.tsx`**: Global layout with Header and Footer
- **`components/header.tsx`**: Navigation component with `role="banner"`
- **`components/footer.tsx`**: Footer component with `role="contentinfo"`
- **`components/coming-soon-wrapper.tsx`**: Conditional wrapper for coming-soon mode
- **Local layouts**: Page-specific layouts without navigation duplication

## 🔒 Protection Mechanisms

### 1. Cursor Configuration Protection

The `cursor/init.json` file protects critical layout files:

```json
{
  "layout_protection": {
    "global_layout_forbidden": [
      "app/layout.tsx",
      "components/header.tsx", 
      "components/footer.tsx"
    ],
    "local_layouts_allowed": [
      "app/coming-soon/layout.tsx",
      "app/dashboard/layout.tsx",
      "app/generator/layout.tsx"
    ]
  }
}
```

**Protected Files**:
- ❌ `app/layout.tsx` - Global layout (protected)
- ❌ `components/header.tsx` - Header component (protected)
- ❌ `components/footer.tsx` - Footer component (protected)

**Allowed Modifications**:
- ✅ Local page layouts (e.g., `app/coming-soon/layout.tsx`)
- ✅ Page-specific components
- ✅ Content within pages

### 2. Pre-commit Hooks

Git hooks automatically scan for:
- Duplicate Header/Footer imports
- Unauthorized layout modifications
- Missing ARIA roles
- Navigation structure violations

### 3. Automated Testing

Jest tests verify:
- Exactly one `role="banner"` element
- Exactly one `role="contentinfo"` element
- No duplicate navigation components
- Proper HTML structure

## 📋 Rules & Guidelines

### ❌ What's Forbidden

1. **Import Header/Footer outside main layout**:
   ```tsx
   // ❌ DON'T DO THIS
   import { Header } from '@/components/header'
   import { Footer } from '@/components/footer'
   
   export default function SomePage() {
     return (
       <div>
         <Header /> {/* ❌ Duplicate! */}
         <main>Content</main>
         <Footer /> {/* ❌ Duplicate! */}
       </div>
     )
   }
   ```

2. **Use Header/Footer components outside main layout**:
   ```tsx
   // ❌ DON'T DO THIS
   export default function SomePage() {
     return (
       <div>
         <Header /> {/* ❌ Will cause duplication */}
         <main>Content</main>
         <Footer /> {/* ❌ Will cause duplication */}
       </div>
     )
   }
   ```

3. **Modify global layout files directly**:
   - `app/layout.tsx` - Protected
   - `components/header.tsx` - Protected
   - `components/footer.tsx` - Protected

### ✅ What's Allowed

1. **Create local layouts for pages**:
   ```tsx
   // ✅ DO THIS
   // app/coming-soon/layout.tsx
   export default function ComingSoonLayout({ children }) {
     return (
       <div className="coming-soon-layout">
         {children}
       </div>
     )
   }
   ```

2. **Add page-specific navigation elements**:
   ```tsx
   // ✅ DO THIS
   export default function DashboardPage() {
     return (
       <div>
         <nav className="dashboard-nav">
           <Link href="/dashboard">Dashboard</Link>
           <Link href="/settings">Settings</Link>
         </nav>
         <main>Dashboard content</main>
       </div>
     )
   }
   ```

3. **Modify navigation content within components**:
   - Update navigation items in Header
   - Modify footer links in Footer
   - Add conditional navigation logic

## 🧪 Testing & Validation

### Manual Testing

```bash
# Run layout structure tests
npm run test:layout

# Run all unit tests
npm run test:unit

# Run tests with coverage
npm run test:unit:coverage
```

### Automated CI/CD

The GitHub Actions workflow (`/.github/workflows/layout-testing.yml`) automatically:

1. **Runs on every push/PR** that affects layout files
2. **Tests across Node.js versions** (18.x, 20.x)
3. **Scans for duplicate components** using grep
4. **Verifies ARIA roles** are properly set
5. **Checks cursor configuration** protection
6. **Runs security scans** for layout files

### Test Coverage

Tests verify:
- ✅ Single Header instance (`role="banner"`)
- ✅ Single Footer instance (`role="contentinfo"`)
- ✅ No duplicate navigation components
- ✅ Proper HTML structure and accessibility
- ✅ Component isolation and layout integrity

## 🚨 Common Issues & Solutions

### Issue 1: Duplicate Navigation

**Problem**: Header or Footer appears twice on a page

**Solution**: 
1. Remove duplicate imports from page components
2. Ensure only `app/layout.tsx` imports Header/Footer
3. Use local layouts for page-specific structure

### Issue 2: Missing ARIA Roles

**Problem**: Accessibility warnings about missing roles

**Solution**:
1. Verify Header has `role="banner"`
2. Verify Footer has `role="contentinfo"`
3. Run accessibility tests

### Issue 3: Layout Modification Blocked

**Problem**: Can't modify Header or Footer components

**Solution**:
1. Check if you're trying to modify protected files
2. Use local layouts for page-specific changes
3. Contact team lead for global layout changes

### Issue 4: Test Failures

**Problem**: Layout tests failing in CI

**Solution**:
1. Run tests locally: `npm run test:layout`
2. Check for duplicate navigation components
3. Verify ARIA roles are set correctly
4. Ensure no unauthorized layout modifications

## 🔧 Development Workflow

### 1. Adding New Pages

```bash
# Create page directory
mkdir app/new-page

# Create local layout (if needed)
touch app/new-page/layout.tsx

# Create page component
touch app/new-page/page.tsx
```

### 2. Modifying Navigation

```tsx
// ✅ Modify navigation items in Header component
// components/header.tsx
const navigation: NavigationItem[] = [
  { name: "Generator", href: "/generator" },
  { name: "Modules", href: "/modules" },
  { name: "New Page", href: "/new-page" }, // ✅ Add new item
  // ... other items
]
```

### 3. Adding Page-Specific Elements

```tsx
// ✅ Use local layout for page-specific structure
// app/new-page/layout.tsx
export default function NewPageLayout({ children }) {
  return (
    <div className="new-page-layout">
      <aside className="page-sidebar">
        {/* Page-specific navigation */}
      </aside>
      <main>{children}</main>
    </div>
  )
}
```

## 📊 Monitoring & Metrics

### CI/CD Metrics

- **Test Coverage**: Minimum 70% for layout components
- **Build Success Rate**: 100% for layout-related changes
- **Security Scan Results**: No critical issues in layout files

### Performance Metrics

- **Navigation Load Time**: <100ms
- **Layout Shift**: <0.1 (CLS)
- **Accessibility Score**: 100/100

## 🆘 Support & Escalation

### When to Contact Team Lead

1. **Global layout changes** required
2. **Navigation structure** modifications
3. **Accessibility compliance** issues
4. **Performance degradation** in navigation
5. **Security concerns** in layout files

### Emergency Procedures

1. **Critical layout breakage**: Revert to last working commit
2. **Security vulnerability**: Immediate security review
3. **Accessibility violation**: Hotfix deployment
4. **Performance issues**: Performance audit and optimization

## 📚 Additional Resources

- [Next.js Layout Documentation](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- [ARIA Roles Reference](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)
- [Accessibility Testing Guide](https://web.dev/accessibility-testing/)
- [React Testing Best Practices](https://react.dev/learn/testing)

---

**🔒 Remember**: The layout protection system exists to maintain code quality, accessibility, and user experience. Always follow the established patterns and use local layouts for page-specific modifications.
