import { z } from "zod";

export const VerifyOrderDataSchema = z.object({
  quantity: z.number().positive().int(),
  shippingLatitude: z.number().min(-90).max(90),
  shippingLongitude: z.number().min(-180).max(180),
});

export type VerifyOrderData = z.infer<typeof VerifyOrderDataSchema>;

const OrderPreviewSchema = z.object({
  unitPrice: z.number().nonnegative(),
  quantity: z.number().positive().int(),
  discountPercentage: z.number().nonnegative(),
  totalDiscountAmount: z.number().nonnegative(),
  totalShippingCost: z.number().nonnegative(),
  totalPrice: z.number().nonnegative(),
});

const FulfillmentPlanSchema = z.object({
  warehouseId: z.string().uuid(),
  warehouseName: z.string(),
  quantity: z.number().positive().int(),
  distance: z.number().nonnegative(),
  shippingCost: z.number().nonnegative(),
});

export const VerifyOrderResponseSchema = z.object({
  orderPreview: OrderPreviewSchema,
  fulfillmentPlan: z.array(FulfillmentPlanSchema),
  isValid: z.boolean(),
  validationMessage: z.string().optional(),
});

export type VerifyOrderResponse = z.infer<typeof VerifyOrderResponseSchema>;

export const OrderResponseSchema = z.object({
  id: z.string().uuid(),
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

export type OrderResponse = z.infer<typeof OrderResponseSchema>;
