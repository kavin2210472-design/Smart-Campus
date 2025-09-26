
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/overview');
  }, [router]);

  return (
     <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Redirecting to dashboard...</p>
     </div>
  );
}
