'use client'

import { useProductStore } from '@/lib/store/useProductStore'
import { useTheme } from '@/lib/ThemeProvider'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const fetchProducts = useProductStore(state => state.fetchProducts)
  const products = useProductStore(state => state.products)
  const isLoading = useProductStore(state => state.loading)
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`)
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <div className={`${theme === 'dark' ? 'bg-gradient-to-r from-blue-700 to-purple-800' : 'bg-gradient-to-r from-blue-500 to-purple-600'} relative text-white`}>
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Welcome to Our Store
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl max-w-2xl mx-auto mb-8"
          >
            Discover our amazing products at competitive prices
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/login" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition mr-4">
              Sign In
            </Link>
            <a href="#products" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition">
              View Products
            </a>
          </motion.div>

          {/* Theme Toggle Button */}
          <motion.div
            className="absolute top-4 right-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Products Section */}
      <div id="products" className="container mx-auto px-4 py-12">
        <h2 className={`text-3xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Our Products</h2>

        {isLoading ? (
          <div className="flex justify-center">
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${theme === 'dark' ? 'border-blue-400' : 'border-blue-500'}`}></div>
          </div>
        ) : products.length === 0 ? (
          <p className={`text-center text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>No products available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleProductClick(product.id)}
                className={`${theme === 'dark' ? 'bg-gray-800 shadow-gray-900/50' : 'bg-white'} rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer transform hover:scale-[1.02] transition-transform`}
              >
                {product.imageUrl && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{product.name}</h3>
                  {product.description && (
                    <p className={`text-sm mb-3 line-clamp-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{product.description}</p>
                  )}
                  <div className="flex items-baseline">
                    {product.salePrice ? (
                      <>
                        <span className="text-red-600 font-bold text-lg">${product.salePrice.toFixed(2)}</span>
                        <span className={`line-through ml-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>${product.price.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className={`font-bold text-lg ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>${product.price.toFixed(2)}</span>
                    )}
                  </div>
                  {product.saleEndsAt && (
                    <div className="mt-2 text-sm text-red-600">
                      Sale ends: {new Date(product.saleEndsAt).toLocaleDateString()}
                    </div>
                  )}
                  <div className="mt-3 text-center">
                    <Link href={`/product/${product.id}`}
                      className={`${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 text-sm rounded transition-colors inline-block w-full`}
                      onClick={(e) => e.stopPropagation()}>
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={`${theme === 'dark' ? 'bg-gray-900 border-t border-gray-800' : 'bg-gray-800'} text-white text-center py-8 mt-12`}>
        <p>&copy; {new Date().getFullYear()} Your Store. All rights reserved.</p>
        <div className="mt-2">
          <Link href="/login" className="text-blue-300 hover:text-blue-200 mx-2">
            Admin Login
          </Link>
        </div>
      </footer>
    </div>
  )
}
