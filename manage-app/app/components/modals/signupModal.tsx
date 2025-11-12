import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const SignupModal = ({ isOpen, onClose, onSwitchToLogin }: { isOpen: boolean; onClose: () => void; onSwitchToLogin: () => void; }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");

    if (!isOpen) return null;

    const handleSignup = async () => {
        //Signup logic here
        const { error } = await supabase.auth.signUp({ 
          email, 
          password, 
          options: {
             data: { role } 
          } 
        });
        if (error) {
            alert(error.message);
        } else {
            alert("Signed up successfully!");
            onClose();
        }
    };

    const handleSocialSignup = async (provider: 'google' | 'github') => {
      await supabase.auth.signInWithOAuth({ 
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        },
      });
    }

  return(
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Create Account</h2>
        <input type="email" placeholder="Email" className="w-full border rounded p-2 mb-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full border rounded p-2 mb-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        <select className="w-full border rounded p-2 mb-4" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="factory">Factory</option>
          <option value="fashion_house">Fashion House</option>
          <option value="admin">Ikeddi Admin</option>
        </select>
        <button className="w-full bg-green-600 text-white rounded p-2 hover:bg-green-700" onClick={handleSignup}>Sign Up</button>
        <div className="my-4 text-center text-sm text-gray-500">or sign up with</div>
        <div className="flex gap-2">
          <button onClick={() => handleSocialSignup('google')} className="flex-1 bg-red-500 text-white p-2 rounded">Google</button>
          <button onClick={() => handleSocialSignup('github')} className="flex-1 bg-gray-800 text-white p-2 rounded">GitHub</button>
        </div>
        <button className="mt-4 w-full text-blue-600 hover:underline text-sm" onClick={onSwitchToLogin}>Already have an account? Sign in</button>
        <button className="mt-2 w-full text-gray-600 hover:text-gray-800 text-sm" onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
};

export default SignupModal;