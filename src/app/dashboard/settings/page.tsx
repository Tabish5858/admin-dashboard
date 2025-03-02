'use client'

import { useAuthStore } from '@/lib/store/useAuthStore'
import { motion } from 'framer-motion'

export default function SettingsPage() {
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white shadow-sm rounded-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Account Information</h2>
            <div className="mt-3 space-y-2">
              <p className="text-sm text-gray-600">
                Email: <span className="font-medium text-gray-900">{user?.email}</span>
              </p>
              <p className="text-sm text-gray-600">
                User ID: <span className="font-medium text-gray-900">{user?.id}</span>
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Actions</h2>
            <button
              onClick={() => logout()}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Sign Out
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-3">About</h2>
            <p className="text-sm text-gray-600">
              Admin Dashboard Version 1.0.0
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
