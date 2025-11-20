'use client'

import { logOut } from "@/utils/auth/auth"

const SettingsModal = ({ onClose }: { onClose: () => void }) => {

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="w-[50%] relative p-6 bg-white rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={onClose}>
          ✕
        </button>
        <h2 className="flex justfiy-self-center text-xl font-bold mb-4">Account Settings</h2>
        <p>Welcome, you're logged in!</p>
        {/* Add logout, change password, etc. here */}
        <div className="flex justify-center space-2">
          <button className="flex items-center justify-center bg-red-500" onClick={logOut}>Log Out</button>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal