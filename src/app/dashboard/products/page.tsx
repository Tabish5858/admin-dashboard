'use client'

import ProductForm from '@/components/products/ProductForm'
import ProductList from '@/components/products/ProductList'
import { seedProducts } from '@/lib/seedProducts'
import { useProductStore } from '@/lib/store/useProductStore'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function ProductsPage() {
  const fetchProducts = useProductStore(state => state.fetchProducts)
  const isLoading = useProductStore(state => state.loading)
  const products = useProductStore(state => state.products)
  const [isSeeding, setIsSeeding] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleSeed = async () => {
    try {
      setIsSeeding(true)
      await seedProducts()
      await fetchProducts()
    } catch (error) {
      console.error('Error seeding products:', error)
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-2xl font-bold text-foreground">Products</h1>
        {products.length === 0 && (
          <button
            onClick={handleSeed}
            disabled={isSeeding}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSeeding ? 'Seeding...' : 'Seed Sample Products'}
          </button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProductForm />
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-64 bg-card-background rounded-lg shadow-sm p-8"
          >
            <svg
              className="w-16 h-16 text-muted-foreground mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Products Found</h3>
            <p className="text-muted-foreground text-center">
              Start by adding your first product using the form on the left, or click the &quot;Seed Sample Products&quot; button above.
            </p>
          </motion.div>
        ) : (
          <ProductList />
        )}
      </div>
    </div>
  )
}
