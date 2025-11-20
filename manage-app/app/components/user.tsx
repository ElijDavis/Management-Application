'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import AuthModal from './modals/authModal'
import { getCurrentUser, getSession } from '@/utils/auth/auth'
import {User as supabaseUser} from '@supabase/supabase-js'

const User = () => {
  const [user, setUser] = useState<supabaseUser | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession()
      if (!session) return

      const user = await getCurrentUser()
      setUser(user)
    }

    fetchUser()
  }, [])

  const handleClick = () => {
    if (!user) setShowModal(true)
    // else open settings modal (future)
  }

  return (
    <>
      <div
        onClick={handleClick}
        className="flex items-center justify-center w-15 h-15 rounded-full bg-white justify-self-end m-4 hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer"
      >
        <Image
          src="/images/default-user.png"
          alt="Profile Picture"
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </>
  )
}

export default User