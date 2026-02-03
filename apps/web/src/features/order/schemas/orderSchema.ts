import { z } from "zod";

export const orderSchema = z.object({
  quantity: z
    .string()
    .min(1, "Quantity is required")
    .refine((val) => !Number.isNaN(Number(val)), { message: "Must be a number" })
    .refine((val) => Number.isInteger(Number(val)), { message: "Must be a whole number" })
    .refine((val) => Number(val) > 0, { message: "Must be at least 1" }),
  latitude: z
    .string()
    .min(1, "Latitude is required")
    .refine((val) => !Number.isNaN(Number(val)), { message: "Must be a number" })
    .refine((val) => Number(val) >= -90 && Number(val) <= 90, { message: "Must be between -90 and 90" }),
  longitude: z
    .string()
    .min(1, "Longitude is required")
    .refine((val) => !Number.isNaN(Number(val)), { message: "Must be a number" })
    .refine((val) => Number(val) >= -180 && Number(val) <= 180, { message: "Must be between -180 and 180" }),
});

export type OrderFormData = z.infer<typeof orderSchema>;
