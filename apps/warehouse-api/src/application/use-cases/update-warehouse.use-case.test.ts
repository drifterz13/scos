import { beforeEach, describe, expect, mock, test } from "bun:test";
import { Warehouse } from "../../domain/entities/warehouse.entity";
import { Coordinates } from "../../domain/value-objects/coordinates.vo";
import { UpdateWarehouseUseCase } from "./update-warehouse.use-case";

describe("UpdateWarehouseUseCase", () => {
  const existingWarehouse = new Warehouse(
    "123e4567-e89b-12d3-a456-426614174000",
    "Seattle Warehouse",
    Coordinates.fromObject({ latitude: 47.6062, longitude: -122.3321 }),
    100,
  );

  const mockWarehouseRepository = {
    findById: mock(() => Promise.resolve(existingWarehouse)),
    update: mock(() => Promise.resolve(existingWarehouse)),
    create: mock(() => Promise.resolve({} as Warehouse)),
    findAll: mock(() => Promise.resolve([])),
    delete: mock(() => Promise.resolve()),
    updateStockBatch: mock(() => Promise.resolve()),
  } as any;

  const useCase = new UpdateWarehouseUseCase(mockWarehouseRepository);

  beforeEach(() => {
    mockWarehouseRepository.findById.mockClear();
    mockWarehouseRepository.update.mockClear();
  });

  test("updates warehouse successfully", async () => {
    const updatedWarehouse = new Warehouse(
      existingWarehouse.id,
      "Updated Seattle Warehouse",
      existingWarehouse.coordinates,
      existingWarehouse.stockQuantity,
    );
    mockWarehouseRepository.update = mock(() => Promise.resolve(updatedWarehouse));

    const result = await useCase.execute("123e4567-e89b-12d3-a456-426614174000", {
      name: "Updated Seattle Warehouse",
    });

    expect(result.data.name).toBe("Updated Seattle Warehouse");
    expect(mockWarehouseRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockWarehouseRepository.update).toHaveBeenCalledTimes(1);
  });

  test("throws error when warehouse not found", async () => {
    mockWarehouseRepository.findById = mock(() => Promise.resolve(null));

    await expect(useCase.execute("non-existent-id", { name: "New Name" })).rejects.toThrow(
      "Warehouse not found: non-existent-id",
    );
  });
});
