import { beforeEach, describe, expect, mock, test } from "bun:test";
import { Warehouse } from "../../domain/entities/warehouse.entity";
import { Coordinates } from "../../domain/value-objects/coordinates.vo";
import { DeleteWarehouseUseCase } from "./delete-warehouse.use-case";

describe("DeleteWarehouseUseCase", () => {
  const existingWarehouse = new Warehouse(
    "123e4567-e89b-12d3-a456-426614174000",
    "Seattle Warehouse",
    Coordinates.fromObject({ latitude: 47.6062, longitude: -122.3321 }),
    100,
  );

  const mockWarehouseRepository = {
    findById: mock(() => Promise.resolve(existingWarehouse)),
    delete: mock(() => Promise.resolve()),
    create: mock(() => Promise.resolve({} as Warehouse)),
    findAll: mock(() => Promise.resolve([])),
    update: mock(() => Promise.resolve({} as Warehouse)),
    updateStockBatch: mock(() => Promise.resolve()),
  } as any;

  const useCase = new DeleteWarehouseUseCase(mockWarehouseRepository);

  beforeEach(() => {
    mockWarehouseRepository.findById.mockClear();
    mockWarehouseRepository.delete.mockClear();
  });

  test("deletes warehouse successfully", async () => {
    await useCase.execute("123e4567-e89b-12d3-a456-426614174000");

    expect(mockWarehouseRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockWarehouseRepository.delete).toHaveBeenCalledTimes(1);
    expect(mockWarehouseRepository.delete).toHaveBeenCalledWith("123e4567-e89b-12d3-a456-426614174000");
  });

  test("throws error when warehouse not found", async () => {
    mockWarehouseRepository.findById = mock(() => Promise.resolve(null));

    await expect(useCase.execute("non-existent-id")).rejects.toThrow("Warehouse not found: non-existent-id");

    expect(mockWarehouseRepository.delete).not.toHaveBeenCalled();
  });
});
