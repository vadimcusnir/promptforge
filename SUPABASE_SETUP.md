# Supabase Setup for PromptForge Waitlist

## Environment Variables

Add these to your `.env.local`:

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE=YOUR_SERVICE_ROLE_KEY
```

## Database Setup

1. Run the SQL in `supabase/schema.sql` in your Supabase SQL editor
2. This will create:
   - `waitlist_signups` table with proper constraints
   - Row Level Security (RLS) policies
   - Public insert policy for anon users
   - Admin read policy for authenticated users

## Table Structure

```sql
waitlist_signups (
    id UUID PRIMARY KEY,
    org_id UUID REFERENCES orgs(id), -- for future multi-tenant support
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)
```

## Security

- RLS is enabled with proper policies
- Anonymous users can INSERT (for public signups)
- Authenticated users can SELECT (for admin access)
- Email uniqueness is enforced at database level
- Duplicate emails are handled gracefully (idempotent UX)

## API Endpoints

- `POST /api/waitlist` - Add new signup
  - Body: `{ email: string, name?: string, org_id?: uuid }`
  - Response: `{ ok: true }` on success
  - Handles duplicates gracefully

## Features

- **Idempotent signups**: Duplicate emails are treated as success
- **Input validation**: Email format validation
- **Multi-tenant ready**: Optional org_id for future use
- **Production ready**: Uses service role for secure server-side operations
