import { getApiUrl } from "../../../lib/api/config";
import type { Warehouse, WarehousesResponse } from "../types/warehouse";

export async function fetchWarehouses(): Promise<WarehousesResponse> {
  const response = await fetch(getApiUrl("/warehouse/list"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch warehouses: ${response.statusText}`);
  }

  return response.json();
}

export interface CreateWarehouseRequest {
  name: string;
  latitude: number;
  longitude: number;
  stockQuantity?: number;
}

export async function createWarehouse(data: CreateWarehouseRequest): Promise<{ data: Warehouse }> {
  const response = await fetch(getApiUrl("/warehouse/"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create warehouse: ${response.statusText}`);
  }

  return response.json();
}

export interface UpdateWarehouseRequest {
  name?: string;
  latitude?: number;
  longitude?: number;
  stockQuantity?: number;
}

export async function updateWarehouse(id: string, data: UpdateWarehouseRequest): Promise<{ data: Warehouse }> {
  const response = await fetch(getApiUrl(`/warehouse/${id}`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update warehouse: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteWarehouse(id: string): Promise<void> {
  const response = await fetch(getApiUrl(`/warehouse/${id}`), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete warehouse: ${response.statusText}`);
  }
}
