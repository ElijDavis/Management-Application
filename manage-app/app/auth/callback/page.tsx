'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Toast from '@/components/Toast';

export default function AuthCallback() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const role = session?.user?.user_metadata?.role;

      if (role === 'factory') router.push('/dashboard/factory');
      else if (role === 'fashion_house') router.push('/dashboard/fashion');
      else if (role === 'admin') router.push('/dashboard/admin');
      else router.push('/');
    };

    checkSession();
  }, []);

  return (
    <>
      {showToast && ( <Toast message="Logged in successfully!" type="success" onClose={() => setShowToast(false)}/> )}
    </>
  );
}
