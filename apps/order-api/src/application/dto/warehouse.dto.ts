import { z } from "zod";

export const WarehouseDtoSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  stockQuantity: z.number().nonnegative().int(),
});

export type WarehouseDto = z.infer<typeof WarehouseDtoSchema>;

export const WarehousesResponseDtoSchema = z.object({
  data: z.array(WarehouseDtoSchema),
});
