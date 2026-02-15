import type { SQL } from "bun";
import { Warehouse } from "../../domain/entities/warehouse.entity";
import type { IWarehouseRepository } from "../../domain/repositories/warehouse.repository.interface";
import { Coordinates } from "../../domain/value-objects/coordinates.vo";

export class WarehouseRepository implements IWarehouseRepository {
  constructor(private sql: SQL) {}

  async findAll(): Promise<Warehouse[]> {
    const result = await this.sql`SELECT * FROM warehouses`;
    return result.map(
      (row: { id: string; name: string; latitude: string; longitude: string; stock_quantity: number }) =>
        this.mapToEntity(row),
    );
  }

  async findById(id: string): Promise<Warehouse | null> {
    const result = await this.sql`SELECT * FROM warehouses WHERE id = ${id}`;
    return result.length > 0 ? this.mapToEntity(result[0]) : null;
  }

  async create(warehouse: Warehouse): Promise<Warehouse> {
    const data = {
      name: warehouse.name,
      latitude: warehouse.coordinates.latitude,
      longitude: warehouse.coordinates.longitude,
      stock_quantity: warehouse.stockQuantity,
      last_updated_at: new Date(),
    };

    const result = await this.sql`INSERT INTO warehouses ${this.sql(data)} RETURNING *`;
    return this.mapToEntity(result[0]);
  }

  async update(warehouse: Warehouse): Promise<Warehouse> {
    const updateData = {
      name: warehouse.name,
      latitude: warehouse.coordinates.latitude,
      longitude: warehouse.coordinates.longitude,
      stock_quantity: warehouse.stockQuantity,
      last_updated_at: new Date(),
    };

    const result = await this.sql`UPDATE warehouses SET ${this.sql(updateData)} WHERE id = ${warehouse.id} RETURNING *`;
    return this.mapToEntity(result[0]);
  }

  async delete(id: string): Promise<void> {
    await this.sql`DELETE FROM warehouses WHERE id = ${id}`;
  }

  async updateStockBatch(updates: Array<{ warehouseId: string; quantity: number }>): Promise<void> {
    await this.sql.transaction(async (tx) => {
      for (const update of updates) {
        await tx`
          UPDATE warehouses
          SET stock_quantity = stock_quantity - ${update.quantity},
              last_updated_at = CURRENT_TIMESTAMP
          WHERE id = ${update.warehouseId}
        `;
      }
    });
  }

  private mapToEntity(row: {
    id: string;
    name: string;
    latitude: string;
    longitude: string;
    stock_quantity: number;
  }): Warehouse {
    return new Warehouse(
      row.id,
      row.name,
      Coordinates.fromObject({
        latitude: +row.latitude,
        longitude: +row.longitude,
      }),
      row.stock_quantity,
    );
  }
}
