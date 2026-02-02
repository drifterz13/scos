import { z } from "zod";

export const VerifyOrderSchema = z.object({
  quantity: z.number().positive().int(),
  shippingLatitude: z.number().min(-90).max(90),
  shippingLongitude: z.number().min(-180).max(180),
});

export type VerifyOrderRequestDto = z.infer<typeof VerifyOrderSchema>;

export const FulfillmentPlanDtoSchema = z.object({
  warehouseId: z.string().uuid(),
  warehouseName: z.string(),
  quantity: z.number().positive().int(),
  distance: z.number().nonnegative(),
  shippingCost: z.number().nonnegative(),
});

export type FulfillmentPlanDto = z.infer<typeof FulfillmentPlanDtoSchema>;

export const OrderPreviewDtoSchema = z.object({
  unitPrice: z.number().nonnegative(),
  quantity: z.number().positive().int(),
  discountPercentage: z.number().nonnegative(),
  totalDiscountAmount: z.number().nonnegative(),
  totalShippingCost: z.number().nonnegative(),
  totalPrice: z.number().nonnegative(),
});

export type OrderPreviewDto = z.infer<typeof OrderPreviewDtoSchema>;

export const VerifyOrderResponseDtoSchema = z.object({
  orderPreview: OrderPreviewDtoSchema,
  fulfillmentPlan: z.array(FulfillmentPlanDtoSchema),
  isValid: z.boolean(),
  validationMessage: z.string().optional(),
});

export type VerifyOrderResponseDto = z.infer<typeof VerifyOrderResponseDtoSchema>;
