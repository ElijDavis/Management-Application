'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Toast from '@/app/components/toast';

export default function AuthCallback() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const role = session?.user?.user_metadata?.role;

      if (role === 'executive') router.push('/dashboard/executive');
      else if (role === 'manager') router.push('/dashboard/manager');
      else if (role === 'graphic') router.push('/dashboard/graphic');
      else if (role === 'print') router.push('/dashboard/print');
      else if (role === 'designer') router.push('/dashboard/designer');
      else if (role === 'sales') router.push('/dashboard/sales');
      else if (role === 'production') router.push('/dashboard/production');
      else router.push('/');
    };

    checkSession();
  }, []);

  return (
    <>
      {showToast && (
        <Toast message="Logged in successfully!" type="success" onClose={() => setShowToast(false)} />
      )}
    </>
  );
}
