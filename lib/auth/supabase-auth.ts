// Supabase authentication utilities
import { createClient } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthSession {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
}

export class SupabaseAuth {
  private supabase: any;
  
  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
  }
  
  async signIn(email: string, password: string): Promise<AuthSession | null> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return {
        user: data.user,
        access_token: data.session?.access_token || '',
        refresh_token: data.session?.refresh_token || '',
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return null;
    }
  }
  
  async signUp(email: string, password: string): Promise<AuthSession | null> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      return {
        user: data.user,
        access_token: data.session?.access_token || '',
        refresh_token: data.session?.refresh_token || '',
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return null;
    }
  }
  
  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
  }
  
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }
}

export const supabaseAuth = new SupabaseAuth();
