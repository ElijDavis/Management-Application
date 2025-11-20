import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/utils/auth/auth'
import type { User } from '@supabase/supabase-js'

export const useSupabaseUser = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser()
      setUser(user)
      setLoading(false)
    }

    fetchUser()
  }, [])

  return { user, loading }
}