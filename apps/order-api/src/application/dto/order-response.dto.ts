import { z } from "zod";

export const OrderResponseDtoSchema = z.object({
  id: z.uuid(),
  orderNumber: z.number().int().positive(),
  shippingLatitude: z.number().min(-90).max(90),
  shippingLongitude: z.number().min(-180).max(180),
  quantity: z.number().positive().int(),
  unitPriceAtTime: z.number().nonnegative(),
  discountPercentage: z.number().nonnegative(),
  totalDiscountAmount: z.number().nonnegative(),
  totalShippingCost: z.number().nonnegative(),
  totalPrice: z.number().nonnegative(),
  status: z.enum(["PENDING", "SUBMITTED", "CANCELLED", "SHIPPED", "DELIVERED"]),
});

export type OrderResponseDto = z.infer<typeof OrderResponseDtoSchema>;
