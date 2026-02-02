import { describe, expect, mock, test } from "bun:test";
import { Warehouse } from "../../domain/entities/warehouse.entity";
import type { IWarehouseRepository } from "../../domain/repositories/warehouse.repository.interface";
import { Coordinates } from "../../domain/value-objects/coordinates.vo";
import { GetWarehousesUseCase } from "./get-warehouses.use-case";

describe("GetWarehousesUseCase", () => {
  const mockWarehouseRepository = {
    findAll: mock(() => Promise.resolve([])),
  } as unknown as IWarehouseRepository;

  const useCase = new GetWarehousesUseCase(mockWarehouseRepository);

  const warehouses: Warehouse[] = [
    new Warehouse("la-id", "Los Angeles", Coordinates.fromObject({ latitude: 33.9425, longitude: -118.408056 }), 355),
    new Warehouse("ny-id", "New York", Coordinates.fromObject({ latitude: 40.639722, longitude: -73.778889 }), 578),
  ];

  describe("execute", () => {
    test("returns all warehouses with correct DTO format", async () => {
      mockWarehouseRepository.findAll = mock(() => Promise.resolve(warehouses));

      const result = await useCase.execute();

      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toEqual({
        id: "la-id",
        name: "Los Angeles",
        latitude: 33.9425,
        longitude: -118.408056,
        stockQuantity: 355,
      });
      expect(result.data[1]).toEqual({
        id: "ny-id",
        name: "New York",
        latitude: 40.639722,
        longitude: -73.778889,
        stockQuantity: 578,
      });
    });
  });
});
