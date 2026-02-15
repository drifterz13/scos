import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CreateWarehouseRequest, UpdateWarehouseRequest } from "../services/warehouseService";
import { createWarehouse, deleteWarehouse, updateWarehouse } from "../services/warehouseService";

export function useCreateWarehouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWarehouseRequest) => createWarehouse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      toast.success("Warehouse created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create warehouse");
    },
  });
}

export function useUpdateWarehouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWarehouseRequest }) => updateWarehouse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      toast.success("Warehouse updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update warehouse");
    },
  });
}

export function useDeleteWarehouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteWarehouse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      toast.success("Warehouse deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete warehouse");
    },
  });
}
