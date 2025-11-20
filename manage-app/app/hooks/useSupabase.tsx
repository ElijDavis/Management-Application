import { useEffect, useState } from 'react'
import { getCurrentUser, onAuthChange } from '@/utils/auth/auth'
import type { User } from '@supabase/supabase-js'

export const useSupabaseUser = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {//must be in a function and be called
      const user = await getCurrentUser();//gets the current user (from session or server)
      setUser(user)//set user
      setLoading(false)//if the user is loaded (know from last line), the we don't need to display loading
    }

    fetchUser()

        // 🔁 Listen for login/logout/email confirmation
    const subscription = onAuthChange(setUser)

    // 🧼 Clean up on unmount
    return () => subscription.unsubscribe()

  }, [])

  return { user, loading }
}