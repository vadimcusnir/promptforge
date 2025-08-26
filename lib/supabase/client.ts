import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================================================
// TYPED SUPABASE CLIENT
// ============================================================================

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          plan: 'pilot' | 'pro' | 'enterprise'
          credits_remaining: number
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          trial_ends_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          plan?: 'pilot' | 'pro' | 'enterprise'
          credits_remaining?: number
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          trial_ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          plan?: 'pilot' | 'pro' | 'enterprise'
          credits_remaining?: number
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          trial_ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      modules: {
        Row: {
          id: string
          title: string
          description: string
          vector: 'strategic' | 'content' | 'technical' | 'sales' | 'operational' | 'creative' | 'analytical'
          difficulty: number
          estimated_tokens: number | null
          input_schema: any
          output_template: string
          guardrails: string[] | null
          kpi_target: string | null
          sample_output: string | null
          is_active: boolean
          requires_plan: 'pilot' | 'pro' | 'enterprise'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          title: string
          description: string
          vector: 'strategic' | 'content' | 'technical' | 'sales' | 'operational' | 'creative' | 'analytical'
          difficulty: number
          estimated_tokens?: number | null
          input_schema?: any
          output_template?: string
          guardrails?: string[] | null
          kpi_target?: string | null
          sample_output?: string | null
          is_active?: boolean
          requires_plan?: 'pilot' | 'pro' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          vector?: 'strategic' | 'content' | 'technical' | 'sales' | 'operational' | 'creative' | 'analytical'
          difficulty?: number
          estimated_tokens?: number | null
          input_schema?: string
          output_template?: string
          guardrails?: string[] | null
          kpi_target?: string | null
          sample_output?: string | null
          is_active?: boolean
          requires_plan?: 'pilot' | 'pro' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
      }
      prompt_runs: {
        Row: {
          id: string
          user_id: string
          module_id: string
          session_config: any
          generated_prompt: string | null
          optimized_prompt: string | null
          ai_score: number | null
          test_result: any | null
          status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
          execution_time_ms: number | null
          token_usage: number | null
          cost_usd: number | null
          error_message: string | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          module_id: string
          session_config: any
          generated_prompt?: string | null
          optimized_prompt?: string | null
          ai_score?: number | null
          test_result?: any | null
          status?: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
          execution_time_ms?: number | null
          token_usage?: number | null
          cost_usd?: number | null
          error_message?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          module_id?: string
          session_config?: any
          generated_prompt?: string | null
          optimized_prompt?: string | null
          ai_score?: number | null
          test_result?: any | null
          status?: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
          execution_time_ms?: number | null
          token_usage?: number | null
          cost_usd?: number | null
          error_message?: string | null
          created_at?: string
          completed_at?: string | null
        }
      }
    }
  }
}

export const typedSupabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
