# Authentication Implementation - PromptForge

## Overview

This document describes the authentication system implemented for PromptForge using Supabase Auth with local runs history for MVP.

## Architecture

### Components

1. **Supabase Client** (`lib/supabase-client.ts`)
   - Client-side Supabase configuration
   - Handles authentication state and session management

2. **Authentication Context** (`lib/contexts/auth-context.tsx`)
   - React context for managing authentication state
   - Provides sign in, sign up, sign out, and password reset functions
   - Automatically handles session persistence and auth state changes

3. **Local Runs Context** (`lib/contexts/runs-local-context.tsx`)
   - MVP implementation for storing run history locally
   - Uses localStorage for persistence
   - Provides CRUD operations for runs with automatic cleanup

4. **Login Page** (`app/login/page.tsx`)
   - Combined login/signup form
   - Toggle between authentication modes
   - Error handling and loading states

5. **Forgot Password Page** (`app/forgot-password/page.tsx`)
   - Password reset functionality
   - Email-based reset flow

6. **Dashboard** (`app/dashboard/page.tsx`)
   - Protected route requiring authentication
   - Displays user information and run statistics
   - Integrates with runs history component

7. **Runs History Component** (`components/runs-history.tsx`)
   - Displays local runs with filtering and search
   - Shows scores, modules, and metadata
   - Provides restore functionality for runs

8. **Header Integration** (`components/Header.tsx`)
   - Dynamic navigation based on authentication state
   - User menu with sign out functionality

## Features

### Authentication
- ✅ Email/password authentication
- ✅ User registration
- ✅ Password reset via email
- ✅ Session persistence
- ✅ Protected routes
- ✅ Automatic redirects

### Local Runs History (MVP)
- ✅ Store up to 100 recent runs locally
- ✅ Automatic cleanup of old entries
- ✅ Search and filtering by module
- ✅ Sort by timestamp, score, or module
- ✅ Score breakdown display
- ✅ Restore functionality for generator
- ✅ Tags and metadata support

### User Experience
- ✅ Responsive design following PromptForge UI standards
- ✅ Loading states and error handling
- ✅ Consistent branding and color scheme
- ✅ Mobile-friendly navigation

## Environment Variables

Required environment variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Usage

### Setting up Authentication

1. Configure Supabase project and get credentials
2. Set environment variables
3. Wrap your app with `AuthProvider` and `RunsLocalProvider`

### Using Authentication in Components

```tsx
import { useAuth } from '@/lib/contexts/auth-context';

function MyComponent() {
  const { user, signIn, signOut } = useAuth();
  
  if (!user) {
    return <div>Please sign in</div>;
  }
  
  return (
    <div>
      <p>Welcome, {user.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Using Local Runs History

```tsx
import { useRunsLocal } from '@/lib/contexts/runs-local-context';

function MyComponent() {
  const { runs, addRun, removeRun } = useRunsLocal();
  
  const handleSaveRun = () => {
    addRun({
      moduleId: 'module-1',
      moduleName: 'SaaS Funnel',
      prompt: 'Generate a SaaS funnel...',
      config: { domain: 'SaaS' },
      tags: ['funnel', 'saas']
    });
  };
  
  return (
    <div>
      <button onClick={handleSaveRun}>Save Run</button>
      <p>Total runs: {runs.length}</p>
    </div>
  );
}
```

### Restoring Runs

```tsx
import { useRunsIntegration } from '@/hooks/use-runs-integration';

function GeneratorComponent() {
  const { restoredRun, clearRestoredRun, saveRun } = useRunsIntegration();
  
  useEffect(() => {
    if (restoredRun) {
      // Pre-fill form with restored run data
      setPrompt(restoredRun.prompt);
      setConfig(restoredRun.config);
      // Clear the restored run after use
      clearRestoredRun();
    }
  }, [restoredRun]);
  
  const handleGenerate = async () => {
    // ... generation logic ...
    
    // Save the run after generation
    saveRun({
      moduleId: 'module-1',
      moduleName: 'SaaS Funnel',
      prompt: prompt,
      response: generatedResponse,
      score: { clarity: 85, execution: 90, ambiguity: 15, business_fit: 88, composite: 87 },
      config: config,
      tags: ['funnel', 'saas']
    });
  };
}
```

## Security Considerations

- ✅ Client-side authentication tokens handled securely by Supabase
- ✅ Service role key only used server-side
- ✅ Row-level security (RLS) ready for future database integration
- ✅ Protected routes with automatic redirects
- ✅ Session management with automatic token refresh

## Future Enhancements

### Database Integration
- [ ] Migrate from localStorage to Supabase database
- [ ] Implement RLS policies for user data isolation
- [ ] Add cloud history for Pro+ users
- [ ] Implement data retention policies

### Advanced Features
- [ ] OAuth providers (Google, GitHub, etc.)
- [ ] Two-factor authentication
- [ ] User profile management
- [ ] Team collaboration features
- [ ] API key management

### Performance
- [ ] Implement pagination for large run histories
- [ ] Add caching layer for frequently accessed data
- [ ] Optimize localStorage usage for mobile devices

## Testing

The authentication system can be tested by:

1. Creating a new account
2. Signing in with existing credentials
3. Testing password reset flow
4. Verifying protected route access
5. Testing session persistence across page reloads
6. Verifying local runs storage and retrieval

## Troubleshooting

### Common Issues

1. **Environment variables not set**
   - Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are configured

2. **Authentication not working**
   - Check Supabase project settings and authentication configuration
   - Verify email templates are configured for password reset

3. **Local storage errors**
   - Check browser localStorage support
   - Verify no storage quota exceeded errors

4. **Protected route redirects**
   - Ensure `AuthProvider` wraps the application
   - Check authentication state in browser dev tools

## Dependencies

- `@supabase/supabase-js` - Supabase client library
- `@supabase/auth-helpers-nextjs` - Next.js authentication helpers
- `date-fns` - Date formatting utilities
- `lucide-react` - Icon components
- React Context API for state management
