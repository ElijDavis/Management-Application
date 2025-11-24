'use client'

import { logOut } from "@/utils/auth/auth"
import ThemeToggle from "../themeToggle"

const SettingsModal = ({ onClose }: { onClose: () => void }) => {
  const handleLogOut = async () => {
    const { error } = await logOut()
    if(!error) onClose()
    else console.error("Logout failed: ", error)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 bg-opacity-50 z-50" onClick={onClose}>
      <div className="flex flex-col justify-items-center w-[50%] relative p-6 bg-white rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-2 right-2 bg-foreground rounded-full active:bg-foreground/20 text-gray-500 hover:text-gray-800" onClick={onClose}>
          ✕
        </button>
        <div className="flex flex-col items-center">
          <h2 className="mx-auto text-foreground text-xl font-bold mb-4">Account Settings</h2>
          <h3 className="mx-auto text-foreground">Themes:</h3>
          <ThemeToggle></ThemeToggle>
        </div>
        <div className="flex flex-col items-center justify-center space-y-2 *:w-[50%]">{/*logic and buttons in this div*/}
          <input type="email" placeholder="Change Email" className="rounded-full border-2 border-blue-200"/>
          <input type="password" placeholder="Change Password" className="rounded-full border-2 border-blue-200"/>
          <button className="rounded-full text-black p-2 pl-4 pr-4 hover:bg-red-500 bg-red-600" onClick={handleLogOut}>Log Out</button>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal