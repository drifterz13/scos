import { useQuery } from "@tanstack/react-query";
import { fetchWarehouses } from "../services/warehouseService";

export function useWarehouses() {
  return useQuery({
    queryKey: ["warehouses"],
    queryFn: fetchWarehouses,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: ({ data = [] }) => data,
  });
}
