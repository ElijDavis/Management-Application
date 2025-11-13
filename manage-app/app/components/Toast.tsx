// components/ui/Toast.tsx
'use client';

import { useEffect } from 'react';

export default function Toast({ message, type = 'success', duration = 3000, onClose}: { message: string; type?: 'success' | 'error' | 'info'; duration?: number; onClose: () => void;}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  }[type];

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-4 py-2 rounded shadow-lg z-50`}>
      {message}
    </div>
  );
}
