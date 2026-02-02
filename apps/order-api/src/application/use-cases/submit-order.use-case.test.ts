import { describe, expect, mock, test } from "bun:test";
import { Order, OrderStatus } from "../../domain/entities/order.entity";
import type { IOrderRepository } from "../../domain/repositories/order.repository.interface";
import { Coordinates } from "../../domain/value-objects/coordinates.vo";
import { Discount } from "../../domain/value-objects/discount.vo";
import { Money } from "../../domain/value-objects/money.vo";
import { Quantity } from "../../domain/value-objects/quantity.vo";
import type { IWarehouseServiceClient } from "../interfaces/warehouse-service.client.interface";
import { SubmitOrderUseCase } from "./submit-order.use-case";
import type { VerifyOrderUseCase } from "./verify-order.use-case";

describe("SubmitOrderUseCase", () => {
  const mockOrderRepository = {
    save: mock(() => Promise.resolve({} as Order)),
    getNextOrderNumber: mock(() => Promise.resolve(1)),
  } as unknown as IOrderRepository;

  const mockWarehouseServiceClient = {
    getAllWarehouses: mock(() => Promise.resolve([])),
    updateInventory: mock(() => Promise.resolve()),
  } as unknown as IWarehouseServiceClient;

  const mockVerifyOrderUseCase = {
    execute: mock(() =>
      Promise.resolve({
        orderPreview: {
          unitPrice: 150,
          quantity: 10,
          discountPercentage: 0,
          totalDiscountAmount: 0,
          totalShippingCost: 50,
          totalPrice: 1550,
        },
        fulfillmentPlan: [
          {
            warehouseId: "la",
            warehouseName: "Los Angeles",
            quantity: 10,
            distance: 50,
            shippingCost: 50,
          },
        ],
        isValid: true,
      }),
    ),
  } as unknown as VerifyOrderUseCase;

  const useCase = new SubmitOrderUseCase(mockOrderRepository, mockWarehouseServiceClient, mockVerifyOrderUseCase);

  describe("execute", () => {
    test("submits valid order successfully", async () => {
      const coords = Coordinates.fromObject({ latitude: 34.05, longitude: -118.25 });
      const quantity = new Quantity(10);
      const unitPrice = Money.fromDollars(150);
      const discount = new Discount(0);
      const shippingCost = Money.fromDollars(50);

      const order = Order.create(coords, quantity, unitPrice, discount, shippingCost);
      order.setOrderNumber(1);
      order.submit();

      mockOrderRepository.save = mock(() => Promise.resolve(order));

      const result = await useCase.execute({
        quantity: 10,
        shippingLatitude: 34.05,
        shippingLongitude: -118.25,
      });

      expect(result.id).toBeDefined();
      expect(result.orderNumber).toBe(1);
      expect(result.status).toBe(OrderStatus.SUBMITTED);
    });

    test("calls warehouse service to update inventory", async () => {
      const coords = Coordinates.fromObject({ latitude: 34.05, longitude: -118.25 });
      const quantity = new Quantity(10);
      const unitPrice = Money.fromDollars(150);
      const discount = new Discount(0);
      const shippingCost = Money.fromDollars(50);

      const order = Order.create(coords, quantity, unitPrice, discount, shippingCost);
      order.setOrderNumber(1);
      order.submit();

      mockOrderRepository.save = mock(() => Promise.resolve(order));

      await useCase.execute({
        quantity: 10,
        shippingLatitude: 34.05,
        shippingLongitude: -118.25,
      });

      expect(mockWarehouseServiceClient.updateInventory).toHaveBeenCalledWith([{ warehouseId: "la", quantity: 10 }]);
    });

    test("rejects invalid order", async () => {
      mockVerifyOrderUseCase.execute = mock(() =>
        Promise.resolve({
          orderPreview: {
            unitPrice: 150,
            quantity: 10,
            discountPercentage: 0,
            totalDiscountAmount: 0,
            totalShippingCost: 500,
            totalPrice: 2000,
          },
          fulfillmentPlan: [],
          isValid: false,
          validationMessage: "Shipping cost exceeds 15% threshold",
        }),
      );

      await expect(
        useCase.execute({
          quantity: 10,
          shippingLatitude: 34.05,
          shippingLongitude: -118.25,
        }),
      ).rejects.toThrow("Shipping cost exceeds 15% threshold");
    });
  });
});
