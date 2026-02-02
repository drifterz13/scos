import { MapPin } from "lucide-react";
import type { Warehouse } from "../types/warehouse";

interface WarehouseGridProps {
  warehouses: Warehouse[];
}

function getStockStatus(quantity: number) {
  if (quantity > 100) return { status: "healthy", color: "text-emerald-600", dotColor: "bg-emerald-500" };
  if (quantity > 50) return { status: "moderate", color: "text-amber-600", dotColor: "bg-amber-500" };
  return { status: "low", color: "text-red-600", dotColor: "bg-red-500" };
}

export function WarehouseGrid({ warehouses }: WarehouseGridProps) {
  if (warehouses.length === 0) {
    return (
      <div className="border border-dashed border-gray-300 bg-gray-50 rounded-lg p-12 text-center">
        <p className="text-gray-600">No warehouses found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {warehouses.map((warehouse) => {
        const status = getStockStatus(warehouse.stockQuantity);

        return (
          <div key={warehouse.id} className="border border-gray-200 bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{warehouse.name}</span>
              </div>
              <div className={`w-2 h-2 rounded-full ${status.dotColor}`} />
            </div>

            <div className="mb-4">
              <div className={`text-4xl font-bold ${status.color}`}>{warehouse.stockQuantity.toLocaleString()}</div>
              <div className="mt-1 text-sm text-gray-600">units in stock</div>
            </div>

            <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Latitude</div>
                <div className="text-gray-900 font-medium">{warehouse.latitude}°</div>
              </div>
              <div>
                <div className="text-gray-400">Longitude</div>
                <div className="text-gray-900 font-medium">{warehouse.longitude}°</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
