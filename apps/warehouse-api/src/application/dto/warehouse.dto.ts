import { z } from "zod";

export const WarehouseDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  stockQuantity: z.number().nonnegative().int(),
});

export type WarehouseDto = z.infer<typeof WarehouseDtoSchema>;

export const InventoryUpdateDtoSchema = z.object({
  warehouseId: z.string().uuid(),
  quantity: z.number().positive().int(),
});

export type InventoryUpdateDto = z.infer<typeof InventoryUpdateDtoSchema>;

export const WarehousesResponseDtoSchema = z.object({
  data: z.array(WarehouseDtoSchema),
});

export type WarehousesResponseDto = z.infer<typeof WarehousesResponseDtoSchema>;
