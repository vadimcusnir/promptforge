# Environment Setup Guide

## Step 1: Create .env.local file

Create a new file called `.env.local` in the root directory of your project with the following content:

```bash
# PromptForge Environment Configuration
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://siebamncfgfgbzorkiwo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpZWJhbW5jZmdmZ2J6b3JraXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MDY1NjcsImV4cCI6MjA3MTE4MjU2N30.Fz2Sc3qIVpAauNbtIh0-GS2qUwAlGgd5BL2u0BxJMh4
NEXT_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpZWJhbW5jZmdmZ2J6b3JraXdvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTYwNjU2NywiZXhwIjoyMDcxMTgyNTY3fQ.7h_NRXxvMdKV9Lcme0EDTEzW3nClvgxd9jcDPubyumE

# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_SITE_NAME=PromptForge_v3
NEXT_PUBLIC_ENV=development

# Feature flags
COMING_SOON=false
AGENTS_ENABLED=true
NEXT_PUBLIC_MOTION=on
```

## Step 2: Verify the file

Make sure the `.env.local` file is in your project root and contains the exact content above.

## Step 3: Restart your development server

After creating the `.env.local` file, restart your development server:

```bash
npm run dev
```

## Step 4: Test the authentication

1. Navigate to `/login` - you should see the login form
2. Try creating a new account
3. Test the authentication flow

## Troubleshooting

If you encounter any issues:

1. **Check file location**: Ensure `.env.local` is in the project root (same level as `package.json`)
2. **Check file name**: The file must be exactly `.env.local` (not `.env.local.txt` or similar)
3. **Restart server**: Environment variables are only loaded when the server starts
4. **Check console**: Look for any error messages in the browser console or terminal

## Environment Variables Explained

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL (public, accessible in browser)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key (public, accessible in browser)
- `NEXT_SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (private, server-side only)

The `NEXT_PUBLIC_` prefix makes variables accessible in the browser, which is required for client-side authentication.
