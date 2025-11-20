//lib/supabaseServer.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing server Supabase environment variables')
}

export const supabaseServer = createClient(supabaseUrl, supabaseKey)