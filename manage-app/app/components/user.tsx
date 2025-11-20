'use client'

import Image from 'next/image'
import { useState } from 'react'
import AuthModal from './modals/authModal'
import { useSupabaseUser } from '../hooks/useSupabase'


const User = () => {
  const { user, loading } = useSupabaseUser()
  const [showModal, setShowModal] = useState(false)

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