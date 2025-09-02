-- Create waitlist_signups table
CREATE TABLE IF NOT EXISTS waitlist_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES orgs(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create site_settings table for coming soon toggle
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on waitlist_signups
ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;

-- RLS policies for waitlist_signups
CREATE POLICY "select_by_org" ON waitlist_signups
  FOR SELECT USING (org_id = auth.uid());

CREATE POLICY "insert_by_org" ON waitlist_signups
  FOR INSERT WITH CHECK (org_id = auth.uid());

-- Enable RLS on site_settings (admin only)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_only" ON site_settings
  FOR ALL USING (auth.role() = 'service_role');

-- Insert default coming_soon setting
INSERT INTO site_settings (key, value) 
VALUES ('coming_soon', 'off') 
ON CONFLICT (key) DO NOTHING;
