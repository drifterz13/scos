import { z } from "zod";

export const DeleteWarehouseParamsDtoSchema = z.object({
  id: z.string().uuid(),
});

export type DeleteWarehouseParamsDto = z.infer<typeof DeleteWarehouseParamsDtoSchema>;
