-- Create waitlist_signups table with RLS
CREATE TABLE IF NOT EXISTS waitlist_signups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    source TEXT DEFAULT 'coming-soon',
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS waitlist_signups_email_idx ON waitlist_signups(email);
CREATE INDEX IF NOT EXISTS waitlist_signups_created_at_idx ON waitlist_signups(created_at);
CREATE INDEX IF NOT EXISTS waitlist_signups_source_idx ON waitlist_signups(source);

-- Enable Row Level Security
ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow anonymous users to INSERT (for signups)
CREATE POLICY "Allow anonymous signups" ON waitlist_signups
    FOR INSERT 
    TO anon
    WITH CHECK (true);

-- Allow service role to SELECT, INSERT, UPDATE, DELETE (for admin access)
CREATE POLICY "Allow service role full access" ON waitlist_signups
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_waitlist_signups_updated_at 
    BEFORE UPDATE ON waitlist_signups 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for analytics (without exposing emails)
CREATE OR REPLACE VIEW waitlist_analytics AS
SELECT 
    COUNT(*) as total_signups,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as signups_last_24h,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as signups_last_week,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as signups_last_month,
    source,
    utm_source,
    utm_medium,
    utm_campaign,
    DATE(created_at) as signup_date
FROM waitlist_signups
GROUP BY source, utm_source, utm_medium, utm_campaign, DATE(created_at)
ORDER BY signup_date DESC;

-- Grant access to the analytics view
GRANT SELECT ON waitlist_analytics TO anon;
GRANT ALL ON waitlist_analytics TO service_role;
