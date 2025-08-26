# PromptForge v3 - Supabase Backend

## 🏗️ Database Schema

This directory contains the complete Supabase backend implementation for PromptForge v3.

### 📁 Structure

- `migrations/` - Database schema and migrations
- `config.toml` - Supabase configuration
- `README.md` - This file

### 🚀 Quick Start

1. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Start Local Development:**
   ```bash
   supabase start
   ```

3. **Apply Migrations:**
   ```bash
   pnpm migrate
   ```

4. **Seed Database:**
   ```bash
   pnpm seed
   ```

### 📊 Database Tables

- **users** - User profiles and authentication
- **modules** - 50 industrial prompt modules (M01-M50)
- **prompt_runs** - Generated prompts and history
- **exports** - Export tracking and storage
- **entitlements** - Feature gating per plan
- **daily_usage** - Analytics and metrics

### 🔐 Row Level Security (RLS)

All tables have RLS policies ensuring users can only access their own data.

### 🧪 Testing

```bash
# Type check
pnpm type-check

# Lint
pnpm lint

# Build
pnpm build
```

### 🌐 Environment Variables

Required environment variables (see `.env.local`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`

### 📈 Monitoring

- Database performance metrics
- User activity tracking
- Feature usage analytics
- Error monitoring and alerting
