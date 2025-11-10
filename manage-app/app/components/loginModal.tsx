'use client';
import {useState} from 'react';
import {supabase} from '@/lib/supabaseClient';

const loginModal = ({ isOpen, onClose }: {isOpen: boolean; onClose: () => void}) => {
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

  return(
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <input type="Email" placeholder="Email" className="w-full border rounded p-2 mb-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="Password" placeholder="Password" className="w-full border rounded p-2 mb-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white rounded p-2 hover:bg-blue-700" onClick={handleLogin}>Sign In</button>
        <button className="mt-2 w-full text-gray-600 hover:text-gray-800" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );

}