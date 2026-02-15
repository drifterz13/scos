import { z } from "zod";
import { WarehouseDtoSchema } from "./warehouse.dto";

export const CreateWarehouseRequestDtoSchema = z.object({
  name: z.string().min(1).max(100),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  stockQuantity: z.number().nonnegative().int().optional().default(0),
});

export type CreateWarehouseRequestDto = z.infer<typeof CreateWarehouseRequestDtoSchema>;

export const CreateWarehouseResponseDtoSchema = z.object({
  data: WarehouseDtoSchema,
});

export type CreateWarehouseResponseDto = z.infer<typeof CreateWarehouseResponseDtoSchema>;
