/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/products/EditProductForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { productSchema, ProductFormData } from '@/lib/schemas/product'
import { useProductStore } from '@/lib/store/useProductStore'

interface EditProductFormProps {
  product: ProductFormData & { id: string }
  onClose: () => void
}

export default function EditProductForm({ product, onClose }: EditProductFormProps) {
  const updateProduct = useProductStore(state => state.updateProduct)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
  })

  const onSubmit = async (data: ProductFormData) => {
    try {
      await updateProduct(product.id, data)
      onClose()
    } catch (error) {
      console.error('Failed to update product:', error)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Product</h2>
        {/* Form fields similar to ProductForm */}
        <div className="space-y-4">
          {/* Add form fields here */}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </motion.form>
  )
}
