import type { IWarehouseRepository } from "../../domain/repositories/warehouse.repository.interface";
import { Coordinates } from "../../domain/value-objects/coordinates.vo";
import type { UpdateWarehouseRequestDto, UpdateWarehouseResponseDto } from "../dto/update-warehouse.dto";
import type { WarehouseDto } from "../dto/warehouse.dto";

export class UpdateWarehouseUseCase {
  constructor(private warehouseRepository: IWarehouseRepository) {}

  async execute(id: string, request: UpdateWarehouseRequestDto): Promise<UpdateWarehouseResponseDto> {
    const warehouse = await this.warehouseRepository.findById(id);
    if (!warehouse) {
      throw new Error(`Warehouse not found: ${id}`);
    }

    if (request.name !== undefined) {
      warehouse.setName(request.name);
    }

    if (request.latitude !== undefined && request.longitude !== undefined) {
      warehouse.setCoordinates(
        Coordinates.fromObject({
          latitude: request.latitude,
          longitude: request.longitude,
        }),
      );
    }

    if (request.stockQuantity !== undefined) {
      warehouse.setStockQuantity(request.stockQuantity);
    }

    const updatedWarehouse = await this.warehouseRepository.update(warehouse);

    return {
      data: this.toDto(updatedWarehouse),
    };
  }

  private toDto(warehouse: {
    id: string;
    name: string;
    coordinates: Coordinates;
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
