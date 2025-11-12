'use client';
import {useState} from 'react';
import {supabase} from '@/lib/supabaseClient';

const loginModal = ({ isOpen, onClose, onSwitchToSignup }: {isOpen: boolean; onClose: () => void; onSwitchToSignup: () => void}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleLogin = async () => {
    const {error} = await supabase.auth.signInWithPassword({email, password});
    if (error) {
      alert(error.message);
    } else {
      alert("Logged in successfully!");
      onClose();
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
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
        <h2 className="justify-self-center text-black text-xl font-semibold mb-4">Login</h2>
        <input type="email" placeholder="Email" className="w-full border rounded p-2 mb-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full border rounded p-2 mb-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white rounded p-2 hover:bg-blue-700" onClick={handleLogin}>Sign In</button>
        <div className="my-4 text-center text-sm text-gray-500">or sign in with</div>
        <div className="flex gap-2">
          <button onClick={() => handleSocialLogin('google')} className="flex-1 bg-red-500 text-white p-2 rounded">Google</button>
          <button onClick={() => handleSocialLogin('github')} className="flex-1 bg-gray-800 text-white p-2 rounded">GitHub</button>
        </div>
        <button className="mt-4 w-full text-blue-600 hover:underline text-sm" onClick={onSwitchToSignup}>Create an account</button>
        <button className="mt-2 w-full text-gray-600 hover:text-gray-800 text-sm" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );

}

export default loginModal;