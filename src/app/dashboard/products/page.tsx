// src/app/dashboard/products/page.tsx
'use client'

import { motion } from 'framer-motion'
import ProductForm from '@/components/products/ProductForm'
import ProductList from '@/components/products/ProductList'
import { useEffect } from 'react'
import { useProductStore } from '@/lib/store/useProductStore'

export default function ProductsPage() {
  const fetchProducts = useProductStore(state => state.fetchProducts)
  const isLoading = useProductStore(state => state.loading)

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProductForm />
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <ProductList />
        )}
      </div>
    </div>
  )
}
