'use client'

import { useAuthStore } from '@/lib/store/useAuthStore'
import { useTheme } from '@/lib/ThemeProvider'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function Header() {
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="bg-card-background shadow-sm dark:shadow-slate-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <span className="text-foreground">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-foreground hover:text-primary transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
