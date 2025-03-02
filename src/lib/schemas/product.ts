import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.number().min(0, "Price must be positive"),
  salePrice: z.number().optional(),
  saleEndsAt: z.string()
    .transform((str) => str ? new Date(str) : undefined)
    .optional(),
  description: z.string().optional(),
  imageUrl: z.string().min(1, "Product image is required")
});

export type ProductFormData = z.input<typeof productSchema>;
