import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Organization, Profile } from '@/types/supabase'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  organization: Organization | null
  session: Session | null
  isLoading: boolean
  isConfigured: boolean
  isDemoMode: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  createOrganization: (name: string) => Promise<Organization>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo account mock data
const DEMO_USER: User = {
  id: 'demo-user-id',
  email: 'admin@demo.com',
  aud: 'authenticated',
  role: 'authenticated',
  created_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: { full_name: 'Demo Admin' },
} as User

const DEMO_PROFILE: Profile = {
  id: 'demo-user-id',
  email: 'admin@demo.com',
  full_name: 'Demo Admin',
  organization_id: 'demo-org-id',
  role: 'owner',
  created_at: new Date().toISOString(),
}

const DEMO_ORGANIZATION: Organization = {
  id: 'demo-org-id',
  name: 'Demo Organization',
  slug: 'demo-organization',
  created_at: new Date().toISOString(),
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // Profile might not exist yet for new users
        if (error.code === 'PGRST116') {
          setProfile(null)
          setOrganization(null)
          return
        }
        throw error
      }

      setProfile(profileData)

      if (profileData?.organization_id) {
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', profileData.organization_id)
          .single()

        if (!orgError && orgData) {
          setOrganization(orgData)
        }
      } else {
        setOrganization(null)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setProfile(null)
      setOrganization(null)
    }
  }

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id).finally(() => setIsLoading(false))
      } else {
        setIsLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setOrganization(null)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })
    if (error) throw error

    // Create profile for new user
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        full_name: fullName,
      })
      if (profileError) {
        console.error('Error creating profile:', profileError)
      }
    }
  }

  const signIn = async (email: string, password: string) => {
    // Check for demo credentials
    if (email === 'admin' && password === 'admin') {
      setUser(DEMO_USER)
      setProfile(DEMO_PROFILE)
      setOrganization(DEMO_ORGANIZATION)
      setIsDemoMode(true)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signOut = async () => {
    if (isDemoMode) {
      setUser(null)
      setProfile(null)
      setOrganization(null)
      setSession(null)
      setIsDemoMode(false)
      return
    }

    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setProfile(null)
    setOrganization(null)
    setSession(null)
  }

  const createOrganization = async (name: string): Promise<Organization> => {
    if (!user) throw new Error('Must be logged in to create an organization')

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({ name, slug })
      .select()
      .single()

    if (orgError) throw orgError

    // Update profile with organization and owner role
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ organization_id: org.id, role: 'owner' })
      .eq('id', user.id)

    if (profileError) throw profileError

    setOrganization(org)
    if (profile) {
      setProfile({ ...profile, organization_id: org.id, role: 'owner' })
    }

    return org
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        organization,
        session,
        isLoading,
        isConfigured: isSupabaseConfigured,
        isDemoMode,
        signUp,
        signIn,
        signOut,
        createOrganization,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
