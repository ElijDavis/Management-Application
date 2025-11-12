// app/ClientAuthWrapper.tsx
"use client";

import { AuthProvider, useAuth } from "./AuthContext";
import LoginModal from "./components/modals/loginModal";
import SignupModal from "./components/modals/signupModal";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function AuthGate() {
  const { user, showLogin, setShowLogin, showSignup, setShowSignup } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    const role = user.user_metadata?.role;
    if (role === "admin") router.push("/dashboard/admin");
    if (role === "sales") router.push("/dashboard/sales");
    if (role === "design") router.push("/dashboard/design");
  }, [user]);

  return (
    <>
      {showLogin && ( <LoginModal isOpen={true} onClose={() => setShowLogin(false)} onSwitchToSignup={() => { setShowLogin(false); setShowSignup(true);}}/>
      )}
      {showSignup && ( <SignupModal isOpen={true} onClose={() => setShowSignup(false)} onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }}/>
      )}
    </>
  );
}

export default function ClientAuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <AuthGate />
    </AuthProvider>
  );
}
