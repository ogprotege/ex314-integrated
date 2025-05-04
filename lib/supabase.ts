import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create a service client for server-side operations that require more privileges
export const getServiceSupabase = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createClient(supabaseUrl, supabaseServiceKey)
}
