import type { CreateWarehouseRequestDto, CreateWarehouseResponseDto } from "../../application/dto/create-warehouse.dto";
import type { UpdateWarehouseRequestDto, UpdateWarehouseResponseDto } from "../../application/dto/update-warehouse.dto";
import type { CreateWarehouseUseCase } from "../../application/use-cases/create-warehouse.use-case";
import type { DeleteWarehouseUseCase } from "../../application/use-cases/delete-warehouse.use-case";
import type { GetWarehousesUseCase } from "../../application/use-cases/get-warehouses.use-case";
import type { UpdateWarehouseUseCase } from "../../application/use-cases/update-warehouse.use-case";

export class WarehousesController {
  constructor(
    private getWarehousesUseCase: GetWarehousesUseCase,
    private createWarehouseUseCase: CreateWarehouseUseCase,
    private updateWarehouseUseCase: UpdateWarehouseUseCase,
    private deleteWarehouseUseCase: DeleteWarehouseUseCase,
  ) {}

  async getWarehouses() {
    return await this.getWarehousesUseCase.execute();
  }

  async createWarehouse(request: CreateWarehouseRequestDto): Promise<CreateWarehouseResponseDto> {
    return await this.createWarehouseUseCase.execute(request);
  }

  async updateWarehouse(id: string, request: UpdateWarehouseRequestDto): Promise<UpdateWarehouseResponseDto> {
    return await this.updateWarehouseUseCase.execute(id, request);
  }

  async deleteWarehouse(id: string): Promise<void> {
    return await this.deleteWarehouseUseCase.execute(id);
  }
}
