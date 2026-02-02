import type { Order } from "../entities/order.entity";

export interface IOrderRepository {
  save(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  getNextOrderNumber(): Promise<number>;
}
