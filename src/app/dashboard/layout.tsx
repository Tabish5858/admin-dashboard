'use client'

import { Header } from '@/app/dashboard/Header'
import { Sidebar } from '@/app/dashboard/Sidebar'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    const authData = localStorage.getItem('auth-storage');
    if (!authData) {
      router.replace('/login');
      return;
    }

    try {
      const { state } = JSON.parse(authData);
      if (!state.isAuthenticated) {
        router.replace('/login');
      }
    } catch (error) {
      console.error('Error parsing auth data:', error);
      router.replace('/login');
    }
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }


  return (
    <div className="min-h-screen bg-background transition-colors duration-300" suppressHydrationWarning>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
