/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { productSchema, ProductFormData } from '@/lib/schemas/product'
import { useProductStore } from '@/lib/store/useProductStore'
import { useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'

export default function ProductForm() {
  const addProduct = useProductStore(state => state.addProduct)
  const [imageUrl, setImageUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
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

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (!imageUrl) {
        setUploadError('Product image is required')
        return
      }

      setIsUploading(true); // Show loading state


      await addProduct({
        ...data,
        imageUrl,
        // saleEndsAt is already a Date object due to setValueAs transform
        saleEndsAt: data.saleEndsAt
      })


      reset()
      setImageUrl('')
      setUploadError('')
    } catch (error) {
      console.error('Failed to add product:', error)
      setUploadError('Failed to add product. Please try again.')
    }
    finally {
      setIsUploading(false);
    }
  }

  const handleImageUpload = async (result: any) => {
    console.log('Upload result:', result); // Debug log

    if (!result?.info?.secure_url) {
      console.error('Upload failed - no secure_url');
      setUploadError('Upload failed - please try again');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError('');

      const uploadedUrl = result.info.secure_url;
      console.log('Successfully uploaded:', uploadedUrl);
      setImageUrl(uploadedUrl);
      setValue('imageUrl', uploadedUrl);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to process uploaded image');
    } finally {
      setIsUploading(false);
    }
  };

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sale Price (Optional)
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
        </div>

{watch('salePrice') && (
  <div>
    <label className="block text-sm font-medium text-gray-700">
      Sale End Date
    </label>
    <input
      type="datetime-local"
      {...register('saleEndsAt', {
        setValueAs: (value: string) => (value ? new Date(value) : undefined)
      })}
      min={new Date().toISOString().slice(0, 16)}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
    />
    {errors.saleEndsAt && (
      <p className="mt-1 text-xs text-red-500">{errors.saleEndsAt.message}</p>
    )}
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
          <CldUploadWidget
  cloudName="doii2gh9d"
  uploadPreset="admindashboard" // Changed from "my_uploads" to match your preset name
  onUpload={handleImageUpload}
  options={{
    maxFiles: 1,
    sources: ["local"],
    multiple: false,
    folder: 'samples/ecommerce', // Added to match your upload preset folder
    resourceType: "image",
    clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
    maxFileSize: 5000000, // 5MB
  }}
>
  {({ open }) => (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => open?.()}
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
  )}
</CldUploadWidget>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isUploading}
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
