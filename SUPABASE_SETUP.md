# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `promptforge-v3`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your users
6. Click "Create new project"

## 2. Get Your Project Credentials

1. Go to your project dashboard
2. Click on "Settings" → "API"
3. Copy the following values:
   - Project URL
   - Anon (public) key
   - Service role key (keep this secret!)

## 3. Set Up Environment Variables

Create a `.env.local` file in your project root with:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

## 4. Run Database Migrations

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. Run migrations:
   ```bash
   supabase db push
   ```

## 5. Configure Authentication

1. Go to Authentication → Settings in your Supabase dashboard
2. Configure the following:
   - Site URL: `https://your-domain.com`
   - Redirect URLs: `https://your-domain.com/auth/callback`
   - Email confirmation: Enable if desired
   - Email templates: Customize as needed

## 6. Set Up Row Level Security (RLS)

The migrations include RLS policies, but you may need to verify they're active:

1. Go to Authentication → Policies in your Supabase dashboard
2. Ensure RLS is enabled on all tables
3. Review and adjust policies as needed

## 7. Test the Setup

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Test authentication:
   - Try registering a new user
   - Try logging in
   - Check the Supabase dashboard for new users

3. Test modules API:
   - Visit `/api/modules` to see the modules data
   - Test filtering with query parameters

## 8. Deploy to Production

1. Set environment variables in your deployment platform (Vercel, etc.)
2. Deploy your application
3. Update Supabase site URL to your production domain
4. Test all functionality in production

## Troubleshooting

### Common Issues:

1. **Authentication not working**: Check that your environment variables are set correctly
2. **Database connection errors**: Verify your Supabase URL and keys
3. **RLS errors**: Ensure Row Level Security policies are properly configured
4. **CORS issues**: Check your Supabase project settings for allowed origins

### Getting Help:

- Check the [Supabase Documentation](https://supabase.com/docs)
- Join the [Supabase Discord](https://discord.supabase.com)
- Review the project's GitHub issues
