'use client'

const SettingsModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="relative p-6 bg-white rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={onClose}>
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Account Settings</h2>
        <p>Welcome, you're logged in!</p>
        {/* Add logout, change password, etc. here */}
      </div>
    </div>
  )
}

export default SettingsModal