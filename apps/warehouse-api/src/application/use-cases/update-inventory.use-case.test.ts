import { describe, expect, mock, test } from "bun:test";
import type { IWarehouseRepository } from "../../domain/repositories/warehouse.repository.interface";
import type { InventoryUpdateDto } from "../dto/warehouse.dto";
import { UpdateInventoryUseCase } from "./update-inventory.use-case";

describe("UpdateInventoryUseCase", () => {
  const mockWarehouseRepository = {
    updateStockBatch: mock(() => Promise.resolve()),
  } as unknown as IWarehouseRepository;

  const useCase = new UpdateInventoryUseCase(mockWarehouseRepository);

  describe("execute", () => {
    test("calls repository to update inventory for multiple warehouses", async () => {
      const updates: InventoryUpdateDto[] = [
        { warehouseId: "la-id", quantity: 10 },
        { warehouseId: "ny-id", quantity: 5 },
      ];

      await useCase.execute(updates);

      expect(mockWarehouseRepository.updateStockBatch).toHaveBeenCalledWith(updates);
    });
  });
});
