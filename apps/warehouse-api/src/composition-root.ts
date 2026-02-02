import { GetWarehousesUseCase } from "./application/use-cases/get-warehouses.use-case";
import { UpdateInventoryUseCase } from "./application/use-cases/update-inventory.use-case";
import { sql } from "./infra/db";
import { WarehouseRepository } from "./infrastructure/repositories/warehouse.repository.impl";
import { WarehousesController } from "./presentation/controllers/warehouses.controller";

// Infrastructure Layer
const warehouseRepository = new WarehouseRepository(sql);

// Application Layer
const getWarehousesUseCase = new GetWarehousesUseCase(warehouseRepository);
const updateInventoryUseCase = new UpdateInventoryUseCase(warehouseRepository);

// Presentation Layer
export const warehousesController = new WarehousesController(getWarehousesUseCase, updateInventoryUseCase);
