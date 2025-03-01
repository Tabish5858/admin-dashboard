// src/components/products/ProductForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { productSchema, ProductFormData } from '@/lib/schemas/product'
import { useProductStore } from '@/lib/store/useProductStore'

export default function ProductForm() {
  const addProduct = useProductStore(state => state.addProduct)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema)
  })

  const onSubmit = async (data: ProductFormData) => {
    try {
      addProduct(data)
      reset()
    } catch (error) {
      console.error('Failed to add product:', error)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 p-6 bg-white rounded-lg shadow-md"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          type="number"
          step="0.01"
          {...register('price', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.price && (
          <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Adding...' : 'Add Product'}
      </button>
    </motion.form>
  )
}
