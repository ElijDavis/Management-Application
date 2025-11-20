'use client'

import { useState } from 'react'
import { logIn, signUp } from '@/utils/auth/auth'

const AuthModal = ({ onClose }: { onClose: () => void }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setError(null)
    const user = { email, password }

    const { data, error } = mode === 'login'
      ? await logIn(user)
      : await signUp(user)

    if (error) {
      setError(error.message)
    } else {
      onClose()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-xl font-bold mb-4">{mode === 'login' ? 'Log In' : 'Create Account'}</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border p-2 m-2 w-full"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border p-2 m-2 w-full"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        className="bg-blue-500 text-white p-2 m-2 rounded w-full"
        onClick={handleSubmit}
      >
        {mode === 'login' ? 'Log In' : 'Sign Up'}
      </button>
      <button
        className="text-sm text-blue-600 mt-2 underline"
        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
      >
        {mode === 'login' ? 'Create an account' : 'Already have an account? Log in'}
      </button>
    </div>
  )
}

export default AuthModal