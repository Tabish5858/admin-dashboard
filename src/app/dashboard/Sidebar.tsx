// src/app/dashboard/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Products', href: '/dashboard/products' },
  { name: 'Settings', href: '/dashboard/settings' }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <nav className="w-64 bg-white shadow-sm p-4">
      <div className="space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center px-2 py-2 text-sm font-medium rounded-md
                ${isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              {item.name}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
