import { MapPin, Pencil, Trash2 } from "lucide-react";
import type { Warehouse } from "../types/warehouse";

interface WarehouseTableProps {
  warehouses: Warehouse[];
  onEdit?: (warehouse: Warehouse) => void;
  onDelete?: (warehouse: Warehouse) => void;
}

function getStockStatus(quantity: number) {
  if (quantity > 100) return { level: "Healthy", color: "text-emerald-600", bg: "bg-emerald-50" };
  if (quantity > 50) return { level: "Moderate", color: "text-amber-600", bg: "bg-amber-50" };
  return { level: "Low", color: "text-red-600", bg: "bg-red-50" };
}

export function WarehouseTable({ warehouses, onEdit, onDelete }: WarehouseTableProps) {
  if (warehouses.length === 0) {
    return <div className="p-12 text-center text-gray-600">No warehouses found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Warehouse</th>
            <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Location</th>
            <th className="text-right py-4 px-6 font-semibold text-gray-900 text-sm">Stock Level</th>
            <th className="text-center py-4 px-6 font-semibold text-gray-900 text-sm">Status</th>
            {(onEdit || onDelete) && (
              <th className="text-center py-4 px-6 font-semibold text-gray-900 text-sm">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {warehouses.map((warehouse) => {
            const status = getStockStatus(warehouse.stockQuantity);

            return (
              <tr key={warehouse.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="font-semibold text-gray-900">{warehouse.name}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {warehouse.latitude}°{warehouse.latitude >= 0 ? "N" : "S"}, {Math.abs(warehouse.longitude)}°
                    {warehouse.longitude >= 0 ? "E" : "W"}
                  </div>
                </td>

                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>
                      {warehouse.latitude}, {warehouse.longitude}
                    </span>
                  </div>
                </td>

                <td className="py-4 px-6 text-right">
                  <div className={`text-2xl font-bold ${status.color}`}>{warehouse.stockQuantity.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 mt-1">units</div>
                </td>

                <td className="py-4 px-6">
                  <div className="flex items-center justify-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                      {status.level}
                    </span>
                  </div>
                </td>

                {(onEdit || onDelete) && (
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(warehouse)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                          aria-label={`Edit ${warehouse.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(warehouse)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          aria-label={`Delete ${warehouse.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>

        <tfoot>
          <tr className="border-t-2 border-gray-200 bg-gray-50">
            <td colSpan={2} className="py-4 px-6 text-sm text-gray-600">
              <strong>{warehouses.length}</strong> warehouses
            </td>
            <td className="py-4 px-6 text-right text-sm text-gray-600">
              <strong>{warehouses.reduce((sum, w) => sum + w.stockQuantity, 0).toLocaleString()}</strong> total units
            </td>
            <td />
            {(onEdit || onDelete) && <td />}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
