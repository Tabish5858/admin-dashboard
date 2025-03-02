import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  price: z.number().min(0, 'Price must be positive'),
  salePrice: z.number().nullable().optional(),
  saleEndsAt: z.date().nullable().optional(),
  description: z.string().optional(),
  imageUrl: z.string().min(1, 'Product image is required')
})
