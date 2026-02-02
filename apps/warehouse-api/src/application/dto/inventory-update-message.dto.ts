import { z } from "zod";

export const MESSAGE_TYPE = "INVENTORY_UPDATE" as const;

export const InventoryUpdateMessageSchema = z.object({
  messageType: z.literal(MESSAGE_TYPE),
  messageId: z.string().uuid(),
  timestamp: z.string().datetime(),
  orderId: z.string().uuid(),
  orderNumber: z.string(),
  updates: z.array(
    z.object({
      warehouseId: z.string().uuid(),
      quantity: z.number().int().positive(),
    }),
  ),
});

export type InventoryUpdateMessageDto = z.infer<typeof InventoryUpdateMessageSchema>;
