import { describe, expect, mock, test } from "bun:test";
import type { IWarehouseServiceClient, WarehouseDto } from "../interfaces/warehouse-service.client.interface";
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
    test("returns correct order preview with all calculations", async () => {
      mockWarehouseServiceClient.getAllWarehouses = mock(() => Promise.resolve(warehouseDtos));

      const result = await useCase.execute({
        quantity: 10,
        shippingLatitude: 34.05,
        shippingLongitude: -118.25,
      });

      expect(result.orderPreview).toEqual({
        unitPrice: 150,
        quantity: 10,
        discountPercentage: 0,
        totalDiscountAmount: 0,
        totalShippingCost: expect.any(Number),
        totalPrice: expect.any(Number),
      });
    });

    test("applies correct volume discount based on quantity", async () => {
      mockWarehouseServiceClient.getAllWarehouses = mock(() => Promise.resolve(warehouseDtos));

      const result = await useCase.execute({
        quantity: 25,
        shippingLatitude: 34.05,
        shippingLongitude: -118.25,
      });

      expect(result.orderPreview.discountPercentage).toBe(5);
    });

    test("returns fulfillment plan prioritizing closest warehouses", async () => {
      mockWarehouseServiceClient.getAllWarehouses = mock(() => Promise.resolve(warehouseDtos));

      const result = await useCase.execute({
        quantity: 10,
        shippingLatitude: 34.05,
        shippingLongitude: -118.25,
      });

      // LA should be closer to this destination than NY
      expect(result.fulfillmentPlan[0]!.warehouseName).toBe("Los Angeles");
    });

    test("returns isValid: true when shipping <= 15% of order amount", async () => {
      mockWarehouseServiceClient.getAllWarehouses = mock(() => Promise.resolve(warehouseDtos));

      const result = await useCase.execute({
        quantity: 10,
        shippingLatitude: 34.05,
        shippingLongitude: -118.25,
      });

      expect(result.isValid).toBe(true);
      expect(result.validationMessage).toBeUndefined();
    });
  });
});
