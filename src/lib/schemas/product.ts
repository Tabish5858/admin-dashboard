// src/lib/schemas/product.ts
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  price: z.number().min(0, "Price must be positive"),
  description: z.string().optional(),
  category: z.string(),
  imageUrl: z.string().optional(),
  salePrice: z.number().optional(),
  saleEndsAt: z.date().optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  isOnSale: z.boolean().default(false),
});

export type ProductFormData = z.infer<typeof productSchema>;
