'use client'

import { useEffect } from 'react'

const Toast = ({ message, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    <div className="fixed bottom-4 right-4 bg-foreground text-background px-4 py-2 rounded shadow-lg z-50 animate-fade-in">
      {message}
    </div>
  )
}

export default Toast