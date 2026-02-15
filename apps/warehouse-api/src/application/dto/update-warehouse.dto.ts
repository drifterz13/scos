import { z } from "zod";
import { WarehouseDtoSchema } from "./warehouse.dto";

export const UpdateWarehouseParamsDtoSchema = z.object({
  id: z.string().uuid(),
});

export type UpdateWarehouseParamsDto = z.infer<typeof UpdateWarehouseParamsDtoSchema>;

export const UpdateWarehouseRequestDtoSchema = z
  .object({
    name: z.string().min(1).max(100).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    stockQuantity: z.number().nonnegative().int().optional(),
  })
  .refine((data) => data.name || data.latitude !== undefined || data.stockQuantity !== undefined, {
    message: "At least one field (name, latitude/longitude, or stockQuantity) must be provided",
  });

export type UpdateWarehouseRequestDto = z.infer<typeof UpdateWarehouseRequestDtoSchema>;

export const UpdateWarehouseResponseDtoSchema = z.object({
  data: WarehouseDtoSchema,
});

export type UpdateWarehouseResponseDto = z.infer<typeof UpdateWarehouseResponseDtoSchema>;
