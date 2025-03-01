// src/app/dashboard/page.tsx
'use client'

import { useAuthStore } from '@/lib/store/useAuthStore'

export default function DashboardPage() {
  const user = useAuthStore(state => state.user)

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome back!</h2>
      <p className="text-gray-600">
        You are logged in as {user?.email}
      </p>
    </div>
  )
}
