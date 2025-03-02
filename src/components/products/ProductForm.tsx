'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { productSchema, ProductFormData } from '@/lib/schemas/product'
import { useProductStore } from '@/lib/store/useProductStore'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { uploadToCloudinary } from '../../lib/cloudinary'

export default function ProductForm() {
  const addProduct = useProductStore(state => state.addProduct)
  const [imageUrl, setImageUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [isOnSale, setIsOnSale] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: 0,
      salePrice: undefined,
      saleEndsAt: undefined,
      description: '',
      imageUrl: ''
    }
  })

  const handleSaleToggle = (checked: boolean) => {
    setIsOnSale(checked)
    if (!checked) {
      setValue('salePrice', undefined)
      setValue('saleEndsAt', undefined)
    }
  }

  const uploadImage = async (file: File) => {
    try {
      setIsUploading(true)
      setUploadError('')

      const uploadedUrl = await uploadToCloudinary(file)
      setImageUrl(uploadedUrl)
      setValue('imageUrl', uploadedUrl)
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setUploadError('Please upload a valid image file (JPG, PNG, or WebP)')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be less than 5MB')
      return
    }

    await uploadImage(file)
  }

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (!imageUrl) {
        setUploadError('Product image is required')
        return
      }

      // Remove sale-related fields if not on sale
      const productData = {
        ...data,
        imageUrl,
        createdAt: new Date()
      }

      // Only include sale fields if the product is on sale
      if (isOnSale && data.salePrice) {
        productData.salePrice = data.salePrice
        if (data.saleEndsAt) {
          productData.saleEndsAt = data.saleEndsAt
        }
      }

      await addProduct(productData)

      reset()
      setImageUrl('')
      setUploadError('')
      setIsOnSale(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Failed to add product:', error)
      setUploadError('Failed to add product. Please try again.')
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6 bg-white rounded-lg shadow-md"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            {...register('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter product name"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Regular Price
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register('price', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="0.00"
          />
          {errors.price && (
            <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>
          )}
        </div>

        {/* Sale Toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isOnSale"
            checked={isOnSale}
            onChange={(e) => handleSaleToggle(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="isOnSale" className="text-sm font-medium text-gray-700">
            Put this product on sale
          </label>
        </div>

        {/* Sale Fields */}
        {isOnSale && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sale Price
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('salePrice', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="0.00"
              />
              {errors.salePrice && (
                <p className="mt-1 text-xs text-red-500">{errors.salePrice.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sale End Date
              </label>
              <input
  type="datetime-local"
  {...register('saleEndsAt')}
  min={new Date().toISOString().slice(0, 16)}
  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
/>
              {errors.saleEndsAt && (
                <p className="mt-1 text-xs text-red-500">{errors.saleEndsAt.message}</p>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter product description"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Image
          </label>
          <div className="space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </button>
            {imageUrl && (
              <div className="relative w-32 h-32">
                <Image
                  src={imageUrl}
                  alt="Product preview"
                  fill
                  className="object-cover rounded-md"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            {uploadError && (
              <p className="mt-1 text-xs text-red-500">{uploadError}</p>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Adding Product...
          </span>
        ) : (
          'Add Product'
        )}
      </button>
    </motion.form>
  )
}
