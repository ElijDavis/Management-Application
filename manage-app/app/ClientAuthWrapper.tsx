// app/ClientAuthWrapper.tsx
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import LoginModal from "./components/loginModal";

export default function ClientAuthWrapper({ children }: { children: React.ReactNode }) {
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) setShowLogin(true);
    });
  }, []);

  return (
    <>
      {children}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
