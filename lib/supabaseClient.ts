import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Verify required env vars
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('❌ Missing Supabase public environment variables. Check your .env.local file.');
}

// Public client for client-side use
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with elevated permissions
export const getServiceSupabase = () => {
  if (!supabaseServiceKey) {
    console.warn('⚠️ Warning: SUPABASE_SERVICE_ROLE_KEY is not defined.');
  }

  return createClient(supabaseUrl, supabaseServiceKey || '');
};
