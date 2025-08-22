# Supabase Setup for PromptForge Waitlist

## Environment Variables

Add these to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Database Setup

1. Run the SQL in `supabase/waitlist_signups.sql` in your Supabase SQL editor
2. This will create:
   - `waitlist_signups` table with proper indexes
   - Row Level Security (RLS) policies
   - Analytics view for reporting
   - Automatic timestamp updates

## Table Structure

```sql
waitlist_signups (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    source TEXT DEFAULT 'coming-soon',
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
)
```

## Security

- RLS is enabled
- Anonymous users can only INSERT (for signups)
- Service role has full access for admin operations
- Email uniqueness is enforced at database level

## API Endpoints

- `POST /api/waitlist` - Add new signup
- `GET /api/waitlist` - Get total signup count

## Analytics

Use the `waitlist_analytics` view for reporting:
- Total signups
- Signups in last 24h/week/month
- Breakdown by source/UTM parameters
- Daily signup trends
