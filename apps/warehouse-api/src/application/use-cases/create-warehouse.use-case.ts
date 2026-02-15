import { Warehouse } from "../../domain/entities/warehouse.entity";
import type { IWarehouseRepository } from "../../domain/repositories/warehouse.repository.interface";
import { Coordinates } from "../../domain/value-objects/coordinates.vo";
import type { CreateWarehouseRequestDto, CreateWarehouseResponseDto } from "../dto/create-warehouse.dto";
import type { WarehouseDto } from "../dto/warehouse.dto";

export class CreateWarehouseUseCase {
  constructor(private warehouseRepository: IWarehouseRepository) {}

  async execute(request: CreateWarehouseRequestDto): Promise<CreateWarehouseResponseDto> {
    const coordinates = Coordinates.fromObject({
      latitude: request.latitude,
      longitude: request.longitude,
    });

    const warehouse = new Warehouse(crypto.randomUUID(), request.name, coordinates, request.stockQuantity ?? 0);

    const savedWarehouse = await this.warehouseRepository.create(warehouse);

    return {
      data: this.toDto(savedWarehouse),
    };
  }

  private toDto(warehouse: Warehouse): WarehouseDto {
    return {
      id: warehouse.id,
      name: warehouse.name,
      latitude: warehouse.coordinates.latitude,
      longitude: warehouse.coordinates.longitude,
      stockQuantity: warehouse.stockQuantity,
    };
  }
}
