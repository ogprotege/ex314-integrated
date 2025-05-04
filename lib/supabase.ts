import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://muuudtypgfelwfklghwv.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

// Create a service client for server-side operations that require more privileges
export const getServiceSupabase = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createClient(supabaseUrl, supabaseServiceKey)
}
