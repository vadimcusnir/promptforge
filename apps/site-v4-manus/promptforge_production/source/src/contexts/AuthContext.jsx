import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

const supabase = createClient(supabaseUrl, supabaseKey)

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Mock subscription data for demo
          setSubscription({
            plan: 'free',
            status: 'active',
            modules_limit: 10,
            exports_limit: 50,
            api_calls_limit: 0
          })
        }
      } catch (error) {
        console.error('Error getting session:', error)
        // For demo purposes, create a mock user
        setUser({
          id: 'demo-user',
          email: 'demo@chatgpt-prompting.com',
          user_metadata: {
            full_name: 'Demo User'
          }
        })
        setSubscription({
          plan: 'pro',
          status: 'active',
          modules_limit: -1,
          exports_limit: -1,
          api_calls_limit: 1000
        })
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const signUp = async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      // For demo, simulate successful signup
      const mockUser = {
        id: 'demo-user-' + Date.now(),
        email,
        user_metadata: metadata
      }
      setUser(mockUser)
      setSubscription({
        plan: 'free',
        status: 'active',
        modules_limit: 10,
        exports_limit: 50,
        api_calls_limit: 0
      })
      return { data: { user: mockUser }, error: null }
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      // For demo, simulate successful signin
      const mockUser = {
        id: 'demo-user',
        email,
        user_metadata: {
          full_name: 'Demo User'
        }
      }
      setUser(mockUser)
      setSubscription({
        plan: 'pro',
        status: 'active',
        modules_limit: -1,
        exports_limit: -1,
        api_calls_limit: 1000
      })
      return { data: { user: mockUser }, error: null }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setUser(null)
      setSubscription(null)
    }
  }

  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Reset password error:', error)
      return { data: null, error }
    }
  }

  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Update profile error:', error)
      return { data: null, error }
    }
  }

  const value = {
    user,
    subscription,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    supabase
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

