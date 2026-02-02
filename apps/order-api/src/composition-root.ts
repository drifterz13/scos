import { SubmitOrderUseCase } from "./application/use-cases/submit-order.use-case";
import { VerifyOrderUseCase } from "./application/use-cases/verify-order.use-case";
import { sql } from "./infra/db";
import { WarehouseServiceClient } from "./infrastructure/api/warehouse-service.client";
import { OrderRepository } from "./infrastructure/repositories/order.repository.impl";
import { OrdersController } from "./presentation/controllers/orders.controller";

// Infrastructure Layer
const orderRepository = new OrderRepository(sql);
const warehouseServiceClient = new WarehouseServiceClient();

// Application Layer
const verifyOrderUseCase = new VerifyOrderUseCase(warehouseServiceClient);
const submitOrderUseCase = new SubmitOrderUseCase(orderRepository, warehouseServiceClient, verifyOrderUseCase);

// Presentation Layer
export const ordersController = new OrdersController(verifyOrderUseCase, submitOrderUseCase);
