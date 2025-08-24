"use client";

import { createClient } from '@supabase/supabase-js';
import { User, Session, AuthError } from '@supabase/supabase-js';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan_tier: 'free' | 'creator' | 'pro' | 'enterprise';
  created_at: string;
  updated_at: string;
  workspace_members?: WorkspaceMember[];
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  workspace: Workspace | null;
  loading: boolean;
  error: AuthError | null;
}

class SupabaseAuth {
  private supabase: any;
  private authState: AuthState = {
    user: null,
    session: null,
    workspace: null,
    loading: true,
    error: null
  };
  private listeners: Set<(state: AuthState) => void> = new Set();

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseAnonKey) {
      this.supabase = createClient(supabaseUrl, supabaseAnonKey);
      this.initializeAuth();
    } else {
      console.error('Supabase environment variables not configured');
    }
  }

  private async initializeAuth() {
    try {
      // Get initial session
      const { data: { session }, error } = await this.supabase.auth.getSession();
      
      if (error) {
        this.updateAuthState({ error });
        return;
      }

      if (session) {
        await this.handleSessionChange(session);
      }

      // Listen for auth changes
      this.supabase.auth.onAuthStateChange(async (event: string, session: Session | null) => {
        if (event === 'SIGNED_IN' && session) {
          await this.handleSessionChange(session);
        } else if (event === 'SIGNED_OUT') {
          this.updateAuthState({
            user: null,
            session: null,
            workspace: null,
            loading: false,
            error: null
          });
        }
      });

      this.updateAuthState({ loading: false });
    } catch (error) {
      console.error('Auth initialization error:', error);
      this.updateAuthState({ 
        loading: false, 
        error: error as AuthError 
      });
    }
  }

  private async handleSessionChange(session: Session) {
    try {
      const user = session.user;
      
      // Get user's primary workspace
      const { data: workspace, error: workspaceError } = await this.supabase
        .from('workspaces')
        .select(`
          *,
          workspace_members!inner(
            user_id,
            role
          )
        `)
        .eq('workspace_members.user_id', user.id)
        .eq('workspace_members.role', 'owner')
        .single();

      if (workspaceError && workspaceError.code !== 'PGRST116') {
        console.error('Error fetching workspace:', workspaceError);
      }

      this.updateAuthState({
        user,
        session,
        workspace: workspace || null,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Session change error:', error);
      this.updateAuthState({
        user: session.user,
        session,
        workspace: null,
        loading: false,
        error: error as AuthError
      });
    }
  }

  private updateAuthState(updates: Partial<AuthState>) {
    this.authState = { ...this.authState, ...updates };
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.authState));
  }

  // Public methods
  async signUp(email: string, password: string, fullName?: string) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) throw error;

      // Create default workspace for new user
      if (data.user) {
        await this.createDefaultWorkspace(data.user.id, fullName || email);
      }

      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, data: null, error: error as AuthError };
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, data: null, error: error as AuthError };
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as AuthError };
    }
  }

  async resetPassword(email: string) {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as AuthError };
    }
  }

  async updateProfile(updates: Partial<UserProfile>) {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', this.authState.user?.id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, data: null, error: error as AuthError };
    }
  }

  async createWorkspace(name: string, slug: string) {
    try {
      if (!this.authState.user) {
        throw new Error('User not authenticated');
      }

      const { data: workspace, error: workspaceError } = await this.supabase
        .from('workspaces')
        .insert({
          name,
          slug,
          plan_tier: 'free'
        })
        .select()
        .single();

      if (workspaceError) throw workspaceError;

      // Add user as owner
      const { error: memberError } = await this.supabase
        .from('workspace_members')
        .insert({
          workspace_id: workspace.id,
          user_id: this.authState.user.id,
          role: 'owner'
        });

      if (memberError) throw memberError;

      // Update auth state with new workspace
      this.updateAuthState({ workspace });

      return { success: true, data: workspace, error: null };
    } catch (error) {
      return { success: false, data: null, error: error as AuthError };
    }
  }

  async switchWorkspace(workspaceId: string) {
    try {
      const { data: workspace, error } = await this.supabase
        .from('workspaces')
        .select('*')
        .eq('id', workspaceId)
        .single();

      if (error) throw error;

      this.updateAuthState({ workspace });
      return { success: true, data: workspace, error: null };
    } catch (error) {
      return { success: false, data: null, error: error as AuthError };
    }
  }

  private async createDefaultWorkspace(userId: string, name: string) {
    try {
      const { data: workspace, error } = await this.supabase
        .from('workspaces')
        .insert({
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          owner_id: userId,
          plan_tier: 'free'
        })
        .select()
        .single();

      if (error) throw error;
      return workspace;
    } catch (error) {
      console.error('Error creating default workspace:', error);
      return null;
    }
  }

  async getPromptHistory(userId: string, workspaceId: string) {
    try {
      const { data, error } = await this.supabase
        .from('prompt_history')
        .select(`
          id,
          prompt,
          seven_d_config,
          module_id,
          created_at,
          status,
          score,
          exported_formats
        `)
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching prompt history:', error);
      return null;
    }
  }

  // State management
  subscribe(listener: (state: AuthState) => void) {
    this.listeners.add(listener);
    // Return current state immediately
    listener(this.authState);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  getCurrentState(): AuthState {
    return this.authState;
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.authState.user;
  }

  isWorkspaceOwner(): boolean {
    return this.authState.workspace?.workspace_members?.[0]?.role === 'owner';
  }

  getCurrentWorkspace(): Workspace | null {
    return this.authState.workspace;
  }

  getCurrentUser(): User | null {
    return this.authState.user;
  }
}

// Export singleton instance
export const supabaseAuth = new SupabaseAuth();
export default supabaseAuth;
