import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  price: z.number().min(0, 'Price must be positive'),
  salePrice: z.number().optional(),
  saleEndsAt: z.date().optional(),
  description: z.string().optional(),
  imageUrl: z.string().min(1, 'Product image is required')
})

export type ProductFormData = z.infer<typeof productSchema>
