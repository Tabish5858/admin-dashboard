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
      <div className="bg-card-background shadow-sm rounded-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium text-foreground">Account Information</h2>
            <div className="mt-3 space-y-2">
              <p className="text-sm text-muted-foreground">
                Name: <span className="font-medium text-foreground">{user?.name}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Email: <span className="font-medium text-foreground">{user?.email}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                User ID: <span className="font-medium text-foreground">{user?.id}</span>
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <h2 className="text-lg font-medium text-foreground mb-3">Actions</h2>
            <button
              onClick={() => logout()}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Sign Out
            </button>
          </div>

          <div className="pt-4 border-t border-border">
            <h2 className="text-lg font-medium text-foreground mb-3">About</h2>
            <p className="text-sm text-muted-foreground">
              Admin Dashboard Version 1.0.0
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
