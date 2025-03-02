'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { productSchema, ProductFormData } from '@/lib/schemas/product'
import { useProductStore } from '@/lib/store/useProductStore'
import { uploadToCloudinary } from '@/lib/cloudinary'
import Image from 'next/image'
import type { Product } from '@/lib/store/useProductStore'

interface EditProductFormProps {
  product: Product
  onClose: () => void
}

export default function EditProductForm({ product, onClose }: EditProductFormProps) {
  const updateProduct = useProductStore(state => state.updateProduct)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUrl, setImageUrl] = useState(product.imageUrl)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [isOnSale, setIsOnSale] = useState(Boolean(product.salePrice))
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
    reset
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      ...product,
      salePrice: product.salePrice || undefined,
      saleEndsAt: product.saleEndsAt ? product.saleEndsAt.toISOString().slice(0, 16) : undefined
    }
  })

  const price = watch('price')

  useEffect(() => {
    reset({
      ...product,
      salePrice: product.salePrice || undefined,
      // Convert Date object to ISO string for datetime-local input
      saleEndsAt: product.saleEndsAt ? product.saleEndsAt.toISOString().slice(0, 16) : undefined
    })
    setImageUrl(product.imageUrl)
    setIsOnSale(Boolean(product.salePrice))
  }, [product, reset])

  const handleSaleToggle = (checked: boolean) => {
    setIsOnSale(checked)
    if (!checked) {
      // When turning off sale, immediately clear the sale fields
      setValue('salePrice', undefined)
      setValue('saleEndsAt', undefined)
      // Mark form as dirty to enable save button
      setValue('name', product.name, { shouldDirty: true })
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

  const validateSalePrice = (salePrice?: number) => {
    if (!isOnSale) return true
    if (!salePrice) return 'Sale price is required when product is on sale'
    if (salePrice >= price) return 'Sale price must be less than regular price'
    return true
  }

  const onSubmit = async (data: ProductFormData) => {
    try {
      // Validate sale price if product is on sale
      const salePriceValidation = validateSalePrice(data.salePrice)
      if (typeof salePriceValidation === 'string') {
        setUploadError(salePriceValidation)
        return
      }

      setIsSubmitting(true)
      await updateProduct(product.id, {
        ...data,
        imageUrl,
        // Explicitly set to undefined when not on sale to remove from database
        salePrice: isOnSale ? data.salePrice : null,
        saleEndsAt: isOnSale && data.saleEndsAt ? new Date(data.saleEndsAt) : null
      })
      onClose()
    } catch (error) {
      console.error('Failed to update product:', error)
      setUploadError('Failed to update product. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-xl font-bold">Edit Product</h2>

      {/* Image Upload Section */}
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
            {isUploading ? 'Uploading...' : 'Change Image'}
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

      <div className="flex gap-4">
        {/* Product Details */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            {...register('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Price</label>
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
      </div>

      {/* Sale Options */}
      <div>
        <div className="flex items-center justify-between mb-4">
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
          {product.salePrice && !isOnSale && (
            <span className="text-xs text-gray-500">
              This will remove the product from sale
            </span>
          )}
        </div>

        {isOnSale && (
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Sale Price
              </label>
              <input
                type="number"
                step="0.01"
                {...register('salePrice', {
                  valueAsNumber: true,
                  validate: validateSalePrice
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.salePrice && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.salePrice.message}
                </p>
              )}
            </div>

            <div className="flex-1">
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
                <p className="mt-1 text-xs text-red-500">
                  {errors.saleEndsAt.message}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isUploading || !isDirty}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </motion.form>
  )
}
