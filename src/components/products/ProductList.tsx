/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/products/ProductList.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useProductStore } from '@/lib/store/useProductStore'
import { motion, AnimatePresence } from 'framer-motion'
import CountdownTimer from './CountdownTimer'
import EditProductForm from './EditProductForm'


export default function ProductList() {
  const products = useProductStore(state => state.products)
  const deleteProduct = useProductStore(state => state.deleteProduct)
  const [isLoading, setIsLoading] = useState(false)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true)
      await deleteProduct(id)
    } catch (error) {
      console.error('Failed to delete product:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <AnimatePresence>
          {products.map(product => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {product.imageUrl && (
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover rounded-md"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <h3 className="text-lg font-bold">{product.name}</h3>
              <p className="text-gray-600">
                Price: ${product.price}
              </p>
              {product.salePrice && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500"
                >
                  Sale Price: ${product.salePrice}
                </motion.p>
              )}
              {product.saleEndsAt && (
                <CountdownTimer endDate={product.saleEndsAt} />
              )}
              <div className="mt-4 space-x-2">
                <button
                  onClick={() => setEditingProduct(product.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={isLoading}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {editingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <EditProductForm
                product={products.find(p => p.id === editingProduct)!}
                onClose={() => setEditingProduct(null)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
