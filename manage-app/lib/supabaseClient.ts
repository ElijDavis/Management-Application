// manage-app/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js' //imported from supabase module
const supabaseUrl = 'https://pffrwkcdaocgkfnkzcie.supabase.co' // Your Supabase URL (also in .env file)
const supabaseKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY //imported from .env file
if (!supabaseKey) { // Check if the key is missing
  throw new Error('Missing SUPABASE_KEY environment variable')
}

console.log("supabase key", process.env.SUPABASE_KEY)
export const supabase = createClient(supabaseUrl, supabaseKey);