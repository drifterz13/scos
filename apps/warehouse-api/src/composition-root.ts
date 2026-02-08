import { GetWarehousesUseCase } from "./application/use-cases/get-warehouses.use-case";
import { ProcessInventoryUpdateMessageUseCase } from "./application/use-cases/process-inventory-update-message.use-case";
import { sql } from "./infrastructure/db";
import { MessageConsumer } from "./infrastructure/message-consumer";
import { QueueService } from "./infrastructure/queue";
import { WarehouseRepository } from "./infrastructure/repositories/warehouse.repository.impl";
import { WarehousesController } from "./presentation/controllers/warehouses.controller";

// Infrastructure Layer
const warehouseRepository = new WarehouseRepository(sql);
const queueService = new QueueService();

// Application Layer
const getWarehousesUseCase = new GetWarehousesUseCase(warehouseRepository);
const processInventoryUpdateMessageUseCase = new ProcessInventoryUpdateMessageUseCase(warehouseRepository);

// Consumer
const messageConsumer = new MessageConsumer(queueService, processInventoryUpdateMessageUseCase);

// Presentation Layer
export const warehousesController = new WarehousesController(getWarehousesUseCase);
export { messageConsumer };
