'use client';

import { supabase } from "@/lib/supabaseClient";
import ThemeToggle from "../themeToggle";

const SettingsModal = ({ user, onClose}: { user: any; onClose: () => void;}) => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onClose();
    window.location.reload();
  };

  return(
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl mx-4">
        <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
        <div className="space-y-4">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.user_metadata?.role || "Not set"}</p>
          <ThemeToggle />
        </div>
        <div className="mt-8 flex flex-col gap-2">
          <button onClick={handleSignOut} className="w-full text-red-600 hover:underline text-sm" > Sign out </button>
          <button onClick={onClose} className="w-full text-gray-600 hover:text-gray-800 text-sm" > Close </button>
        </div>
      </div>
    </div>
  )
};

export default SettingsModal;