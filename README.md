# PromptForge v3.0

Industrial Prompt Engineering Platform with 50 modules, 7 vectors, and export capabilities in <60s.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment
cp env.example .env.local

# Start development server
pnpm dev

# Run tests
pnpm test:all
```

## 🏗️ Architecture

PromptForge v3.0 is built with:
- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Styling**: Tailwind CSS with glassmorphism effects
- **Testing**: Jest + Playwright E2E
- **Deployment**: Vercel, Railway, AWS support

## 🔒 Layout Consistency Rules

**⚠️ IMPORTANT: Do not modify global header/footer components directly!**

### Global Layout Protection

The following files are **PROTECTED** and cannot be modified:

- `app/layout.tsx` - Root layout (Header/Footer mounting)
- `components/header.tsx` - Global header component
- `components/footer.tsx` - Global footer component
- `components/nav.tsx` - Navigation components
- `components/navigation.tsx` - Navigation components

### Allowed Modifications

Layout changes are **ONLY** permitted in:

- `app/coming-soon/layout.tsx` - Coming soon page layout
- `app/dashboard/layout.tsx` - Dashboard layout
- `app/generator/layout.tsx` - Generator layout
- Other local page-specific layouts

### Why This Protection?

1. **Single Source of Truth**: Header/Footer are mounted only in `app/layout.tsx`
2. **Consistency**: Ensures uniform navigation across all pages
3. **Maintainability**: Prevents layout fragmentation and duplication
4. **Accessibility**: Maintains proper ARIA roles and semantic structure

### How to Make Layout Changes

1. **Global Changes**: Modify `app/layout.tsx` only
2. **Page-Specific Changes**: Use local layouts in page directories
3. **Component Updates**: Update Header/Footer components, then test thoroughly
4. **Navigation Updates**: Modify navigation logic within existing components

## 🧪 Testing

### Unit Tests
```bash
pnpm test:unit          # Run all unit tests
pnpm test:unit:watch    # Watch mode
pnpm test:unit:coverage # Coverage report
```

### E2E Tests (Layout Consistency)
```bash
pnpm test:e2e           # Run all E2E tests
pnpm test:e2e:ui        # Interactive UI mode
pnpm test:e2e:headed    # Headed browser mode
pnpm test:e2e:debug     # Debug mode
```

### Layout Structure Tests
```bash
pnpm test:layout        # Layout structure validation
pnpm test:all           # All tests (unit + E2E)
```

## 📚 Documentation

- [Setup Guide](README_SETUP.md) - Initial setup and configuration
- [Contributing](CONTRIBUTING.md) - Development guidelines
- [Backup & Recovery](BACKUP_RECOVERY_IMPLEMENTATION.md) - Database backup procedures
- [Security](SECURITY.md) - Security best practices
- [Deployment](DEPLOYMENT_CHECKLIST.md) - Production deployment

## 🔧 Development

### Prerequisites
- Node.js 18+
- pnpm
- PostgreSQL (or Supabase)
- Stripe account (for billing)

### Environment Setup
```bash
# Copy environment template
cp env.example .env.local

# Configure your environment variables
nano .env.local

# Run database migrations
pnpm migrate
```

### Available Scripts
```bash
pnpm dev                 # Development server
pnpm build              # Production build
pnpm start              # Production server
pnpm lint               # Code linting
pnpm type-check         # TypeScript validation
pnpm test:all           # All tests
pnpm security:scan      # Security scanning
pnpm backup:create      # Create database backup
```

## 🚨 Security

- **PII Protection**: Automated scanning and cleanup
- **Layout Protection**: Agent control prevents unauthorized changes
- **Access Control**: Row-level security (RLS) policies
- **Input Validation**: Comprehensive validation and sanitization

## 📊 Monitoring

- **Layout Consistency**: E2E tests on every PR
- **Security Scanning**: Automated vulnerability detection
- **Performance**: Glass effects optimization
- **Backup Health**: Automated backup verification

## 🤝 Contributing

1. **Follow Layout Rules**: Never modify global Header/Footer directly
2. **Test Thoroughly**: Run `pnpm test:all` before submitting PRs
3. **Security First**: Ensure no PII or secrets in code
4. **Document Changes**: Update relevant documentation

## 📄 License

Copyright © 2024 PromptForge. All rights reserved.

---

**Remember**: Layout consistency is critical for user experience and accessibility. Always test your changes and respect the global layout protection rules!
