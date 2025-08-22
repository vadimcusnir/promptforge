"use client"

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface WaitlistSignup {
  id?: string
  email: string
  created_at?: string
  source?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

export async function addToWaitlist(data: Omit<WaitlistSignup, 'id' | 'created_at'>): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('waitlist_signups')
      .insert([{
        email: data.email.toLowerCase().trim(),
        source: data.source || 'coming-soon',
        utm_source: data.utm_source,
        utm_medium: data.utm_medium,
        utm_campaign: data.utm_campaign,
        created_at: new Date().toISOString()
      }])

    if (error) {
      console.error('Supabase waitlist error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('Waitlist signup error:', err)
    return { success: false, error: 'Failed to join waitlist. Please try again.' }
  }
}

export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('waitlist_signups')
      .select('email')
      .eq('email', email.toLowerCase().trim())
      .limit(1)

    if (error) {
      console.error('Email check error:', error)
      return false
    }

    return data && data.length > 0
  } catch (err) {
    console.error('Email exists check error:', err)
    return false
  }
}
