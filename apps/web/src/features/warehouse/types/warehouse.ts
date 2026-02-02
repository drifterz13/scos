export interface Warehouse {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  stockQuantity: number;
}

export interface WarehousesResponse {
  data: Warehouse[];
}
