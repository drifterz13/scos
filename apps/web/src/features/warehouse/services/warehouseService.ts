import { getApiUrl } from "../../../lib/api/config";
import type { WarehousesResponse } from "../types/warehouse";

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
