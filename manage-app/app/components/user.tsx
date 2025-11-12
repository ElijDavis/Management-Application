'use client';

import { useAuth } from "@/app/AuthContext";
import Image from "next/image";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ThemeToggle from "./themeToggle";

const User = () => {
  const { user, setShowLogin } = useAuth();
  const [showProfileInfo, setShowProfileInfo] = useState(false);

  const handleClick = () => {
    if (!user) {
      setShowLogin(true);
    } else {
      setShowProfileInfo((prev) => !prev);
    }
  };

  return (
    <div
      className="flex items-center justify-center w-15 h-15 rounded-full bg-white justify-self-end m-4 hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer" onClick={handleClick}>
      <Image src={user?.user_metadata?.avatar_url || "/images/default-user.png"} alt="Profile Picture" width={40} height={40} className="rounded-full" />
      {showProfileInfo && (
        <div className="absolute top-16 right-4 bg-white shadow-lg rounded p-4 z-50 w-64">
          <p className="font-semibold">{user.email}</p>
          <ThemeToggle />
          <button onClick={async () => { await supabase.auth.signOut(); setShowProfileInfo(false); window.location.reload();}} className="mt-4 text-sm text-red-600 hover:underline">Sign out</button>
        </div>
      )}
    </div>
  );
};


export default User;