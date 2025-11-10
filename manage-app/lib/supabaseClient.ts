// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Use NEXT_PUBLIC_* env vars for client-side access. When importing this
// file from a client component, Next.js will only expose env vars prefixed
// with NEXT_PUBLIC_. Keep any server-only keys out of client bundles.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Prefer the conventional NEXT_PUBLIC_SUPABASE_ANON_KEY name, but allow
// NEXT_PUBLIC_SUPABASE_KEY as a fallback for compatibility.
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
	throw new Error('Missing Supabase env vars. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_KEY) are set.')
}

export const supabase = createClient(supabaseUrl, supabaseKey);