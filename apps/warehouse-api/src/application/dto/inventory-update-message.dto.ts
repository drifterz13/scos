import { z } from "zod";

export const MESSAGE_TYPE = "INVENTORY_UPDATE" as const;

export const InventoryUpdateMessageSchema = z.object({
  messageType: z.literal(MESSAGE_TYPE),
  messageId: z.uuid(),
  timestamp: z.iso.datetime(),
  orderId: z.uuid(),
  orderNumber: z.string(),
  updates: z.array(
    z.object({
      warehouseId: z.uuid(),
      quantity: z.number().int().positive(),
    }),
  ),
});

export type InventoryUpdateMessageDto = z.infer<typeof InventoryUpdateMessageSchema>;
