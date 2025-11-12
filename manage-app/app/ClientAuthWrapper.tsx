// app/ClientAuthWrapper.tsx
"use client";
import { AuthProvider, useAuth } from "./AuthContext";
import LoginModal from "./components/modals/loginModal";

function AuthGate() {
  const { showLogin, setShowLogin } = useAuth();

  return <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />;
}

export default function ClientAuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <AuthGate />
    </AuthProvider>
  );
}
