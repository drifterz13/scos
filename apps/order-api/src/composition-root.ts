import { PublishInventoryUpdateUseCase } from "./application/use-cases/publish-inventory-update.use-case";
import { SubmitOrderUseCase } from "./application/use-cases/submit-order.use-case";
import { VerifyOrderUseCase } from "./application/use-cases/verify-order.use-case";
import { WarehouseServiceClient } from "./infrastructure/api/warehouse-service.client";
import { sql } from "./infrastructure/db";
import { QueueService } from "./infrastructure/queue";
import { OrderRepository } from "./infrastructure/repositories/order.repository.impl";
import { OrdersController } from "./presentation/controllers/orders.controller";

// Infrastructure Layer
const orderRepository = new OrderRepository(sql);
const warehouseServiceClient = new WarehouseServiceClient();
const queueService = new QueueService();

// Application Layer
const publishInventoryUpdateUseCase = new PublishInventoryUpdateUseCase(queueService);
const verifyOrderUseCase = new VerifyOrderUseCase(warehouseServiceClient);
const submitOrderUseCase = new SubmitOrderUseCase(orderRepository, publishInventoryUpdateUseCase, verifyOrderUseCase);

// Presentation Layer
export const ordersController = new OrdersController(verifyOrderUseCase, submitOrderUseCase);
