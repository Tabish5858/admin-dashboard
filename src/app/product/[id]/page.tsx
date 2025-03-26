'use client'

import CountdownTimer from '@/components/products/CountdownTimer'
import { Product, useProductStore } from '@/lib/store/useProductStore'
import { useTheme } from '@/lib/ThemeProvider'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const { theme, toggleTheme } = useTheme()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const products = useProductStore(state => state.products)
  const fetchProducts = useProductStore(state => state.fetchProducts)

  useEffect(() => {
    const loadProduct = async () => {
      // If products are not loaded yet, fetch them
      if (products.length === 0) {
        await fetchProducts()
      }

      // Find the product from the store
      const foundProduct = products.find(p => p.id === productId)

      if (foundProduct) {
        setProduct(foundProduct)
      } else {
        console.error('Product not found')
      }

      setLoading(false)
    }

    loadProduct()
  }, [productId, products, fetchProducts])

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} flex items-center justify-center`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${theme === 'dark' ? 'border-blue-400' : 'border-blue-500'}`}></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} p-8`}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6">The product you are looking for does not exist or has been removed.</p>
          <Link href="/" className={`px-6 py-3 ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg transition duration-300`}>
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navigation */}
      <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2">
            <span>Store</span>
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
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
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center text-sm">
          <Link href="/" className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} hover:underline`}>Home</Link>
          <span className="mx-2">›</span>
          <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{product.name}</span>
        </div>
      </div>

      {/* Product Detail */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`rounded-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}
          >
            <div className="relative w-full h-[500px]">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm mb-4">
              {product.category}
            </span>

            <div className="flex items-baseline">
              {product.salePrice ? (
                <>
                  <span className="text-3xl font-bold text-red-600">${product.salePrice.toFixed(2)}</span>
                  <span className={`line-through ml-4 text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>${product.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              )}
            </div>

            {/* Sale countdown timer */}
            {product.salePrice && product.saleEndsAt && (
              <div className="text-red-600 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">
                <p className="font-semibold mb-1">Limited Time Offer!</p>
                <CountdownTimer endDate={product.saleEndsAt} />
              </div>
            )}

            {product.description && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{product.description}</p>
              </div>
            )}

            {/* Buy button */}
            <div className="pt-4">
              <button
                className={`w-full py-4 px-6 text-lg font-semibold text-white ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} rounded-lg transition duration-300`}
              >
                Add to Cart
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`${theme === 'dark' ? 'bg-gray-800 border-t border-gray-700' : 'bg-gray-800'} text-white text-center py-8 mt-12`}>
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
