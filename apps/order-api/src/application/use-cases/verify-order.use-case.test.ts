import { describe, expect, mock, test } from "bun:test";
import type { WarehouseDto } from "../dto/warehouse.dto";
import type { IWarehouseServiceClient } from "../interfaces/warehouse-service.client.interface";
import { VerifyOrderUseCase } from "./verify-order.use-case";

describe("VerifyOrderUseCase", () => {
  const mockWarehouseServiceClient = {
    getAllWarehouses: mock(() => Promise.resolve([])),
  } as unknown as IWarehouseServiceClient;

  const useCase = new VerifyOrderUseCase(mockWarehouseServiceClient);

  const warehouseDtos: WarehouseDto[] = [
    {
      id: "la",
      name: "Los Angeles",
      latitude: 33.9425,
      longitude: -118.408056,
      stockQuantity: 355,
    },
    {
      id: "ny",
      name: "New York",
      latitude: 40.639722,
      longitude: -73.778889,
      stockQuantity: 578,
    },
  ];

  describe("execute", () => {
    test("returns valid order with preview and fulfillment plan", async () => {
      mockWarehouseServiceClient.getAllWarehouses = mock(() => Promise.resolve(warehouseDtos));

      const result = await useCase.execute({
        quantity: 10,
        shippingLatitude: 34.05,
        shippingLongitude: -118.25,
      });

      expect(result.isValid).toBe(true);
      expect(result.validationMessage).toBeUndefined();
      expect(result.orderPreview).toMatchObject({
        unitPrice: 150,
        quantity: 10,
      });
      expect(result.fulfillmentPlan).toBeDefined();
    });

    test("returns invalid order when shipping cost exceeds 15% threshold", async () => {
      mockWarehouseServiceClient.getAllWarehouses = mock(() => Promise.resolve(warehouseDtos));

      const result = await useCase.execute({
        quantity: 100,
        // Thailand coordinates
        shippingLatitude: 13.75,
        shippingLongitude: 100.5,
      });

      expect(result.isValid).toBe(false);
      expect(result.validationMessage).toBeDefined();
    });
  });
});
