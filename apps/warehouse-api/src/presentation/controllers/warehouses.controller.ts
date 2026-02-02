import type { GetWarehousesUseCase } from "../../application/use-cases/get-warehouses.use-case";

export class WarehousesController {
  constructor(private getWarehousesUseCase: GetWarehousesUseCase) {}

  async getWarehouses() {
    return await this.getWarehousesUseCase.execute();
  }
}
