import { beforeEach, describe, expect, mock, test } from "bun:test";
import { Warehouse } from "../../domain/entities/warehouse.entity";
import { Coordinates } from "../../domain/value-objects/coordinates.vo";
import { CreateWarehouseUseCase } from "./create-warehouse.use-case";

describe("CreateWarehouseUseCase", () => {
  const mockWarehouseRepository = {
    create: mock(() => Promise.resolve({} as Warehouse)),
    findAll: mock(() => Promise.resolve([])),
    findById: mock(() => Promise.resolve(null)),
    update: mock(() => Promise.resolve({} as Warehouse)),
    delete: mock(() => Promise.resolve()),
    updateStockBatch: mock(() => Promise.resolve()),
  } as any;

  const useCase = new CreateWarehouseUseCase(mockWarehouseRepository);

  beforeEach(() => {
    mockWarehouseRepository.create.mockClear();
  });

  test("creates warehouse successfully", async () => {
    const createdWarehouse = new Warehouse(
      "123e4567-e89b-12d3-a456-426614174000",
      "Seattle Warehouse",
      Coordinates.fromObject({ latitude: 47.6062, longitude: -122.3321 }),
      100,
    );

    mockWarehouseRepository.create = mock(() => Promise.resolve(createdWarehouse));

    const result = await useCase.execute({
      name: "Seattle Warehouse",
      latitude: 47.6062,
      longitude: -122.3321,
      stockQuantity: 100,
    });

    expect(result.data.id).toBe("123e4567-e89b-12d3-a456-426614174000");
    expect(result.data.name).toBe("Seattle Warehouse");
    expect(mockWarehouseRepository.create).toHaveBeenCalledTimes(1);
  });
});
