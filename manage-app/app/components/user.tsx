'use client'

import Image from 'next/image'
import { useState } from 'react'
import AuthModal from './modals/authModal'
import SettingsModal from './modals/settings'
import { useSupabaseUser } from '../hooks/useSupabase'


const User = () => {
  const { user, loading } = useSupabaseUser()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  const handleClick = () => {
    if (!user) {
       setShowAuthModal(true)
    } else {
      setShowSettingsModal(true)
    }
  }

  return (
    <>
      <div onClick={handleClick} className="flex items-center justify-center w-15 h-15 rounded-full bg-white justify-self-end m-4 hover:scale-110 hover:outline-offset-4 transition-transform duration-200 ease-in-out cursor-pointer outline-2 outline-offset-2 outline-foreground">
        <Image src="/images/default-user.png" alt="Profile Picture" width={40} height={40} className="rounded-full"/>
      </div>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showSettingsModal && <SettingsModal onClose={() => setShowSettingsModal(false)} />}
    </>
  )
}

export default User