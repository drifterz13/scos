import type { IWarehouseRepository } from "../../domain/repositories/warehouse.repository.interface";
import type { WarehouseDto, WarehousesResponseDto } from "../dto/warehouse.dto";

export class GetWarehousesUseCase {
  constructor(private warehouseRepository: IWarehouseRepository) {}

  async execute(): Promise<WarehousesResponseDto> {
    const warehouses = await this.warehouseRepository.findAll();
    return {
      data: warehouses.map((w) => this.toDto(w)),
    };
  }

  private toDto(warehouse: {
    id: string;
    name: string;
    coordinates: { latitude: number; longitude: number };
    stockQuantity: number;
  }): WarehouseDto {
    return {
      id: warehouse.id,
      name: warehouse.name,
      latitude: warehouse.coordinates.latitude,
      longitude: warehouse.coordinates.longitude,
      stockQuantity: warehouse.stockQuantity,
    };
  }
}
