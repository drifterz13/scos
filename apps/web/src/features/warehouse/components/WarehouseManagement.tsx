import { AlertCircle, AlertTriangle, Boxes, Building2, CheckCircle, Package, Plus } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { Modal } from "../../../components/ui/Modal";
import { useWarehouses } from "../hooks/useWarehouseApi";
import { useCreateWarehouse, useDeleteWarehouse, useUpdateWarehouse } from "../hooks/useWarehouseMutations";
import type { CreateWarehouseRequest } from "../services/warehouseService";
import type { Warehouse } from "../types/warehouse";
import { WarehouseForm } from "./WarehouseForm";
import { WarehouseGrid } from "./WarehouseGrid";
import { WarehouseTable } from "./WarehouseTable";

export function WarehouseManagement() {
  const { data = [], isLoading, error } = useWarehouses();
  const createWarehouse = useCreateWarehouse();
  const updateWarehouse = useUpdateWarehouse();
  const deleteWarehouse = useDeleteWarehouse();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [deletingWarehouse, setDeletingWarehouse] = useState<Warehouse | null>(null);

  const totalWarehouses = data.length;
  const totalStock = data.reduce((sum, w) => sum + w.stockQuantity, 0);
  const lowStockCount = data.filter((w) => w.stockQuantity <= 50).length;
  const healthyStockCount = data.filter((w) => w.stockQuantity > 100).length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
        </div>
        <div className="mt-6">
          <span className="text-sm font-medium text-gray-600">Loading warehouses...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-gray-200 bg-gray-50 p-6 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-white flex items-center justify-center border border-gray-200 rounded-lg">
            <AlertCircle className="h-6 w-6 text-gray-900" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg">Connection Failed</h3>
            <p className="text-gray-600 mt-1">{error.message}</p>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleCreate = (data: CreateWarehouseRequest) => {
    createWarehouse.mutate(data);
    setIsCreateModalOpen(false);
  };

  const handleEdit = (data: CreateWarehouseRequest) => {
    if (editingWarehouse) {
      updateWarehouse.mutate({
        id: editingWarehouse.id,
        data: {
          name: data.name,
          latitude: data.latitude,
          longitude: data.longitude,
          stockQuantity: data.stockQuantity,
        },
      });
      setEditingWarehouse(null);
    }
  };

  const handleDelete = () => {
    if (deletingWarehouse) {
      deleteWarehouse.mutate(deletingWarehouse.id);
      setDeletingWarehouse(null);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Warehouses</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl">
            Manage and monitor your global warehouse network. View inventory levels, locations, and stock status across
            all facilities.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-secondary font-sora font-semibold rounded shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <Plus className="h-5 w-5" />
          <span>Add Warehouse</span>
        </button>
      </div>

      {data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
            <Building2 className="h-6 w-6 text-gray-400 mb-3" />
            <div className="text-4xl md:text-5xl font-bold text-gray-900">{totalWarehouses}</div>
            <div className="mt-1 text-sm text-gray-600">Warehouses</div>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
            <Boxes className="h-6 w-6 text-gray-400 mb-3" />
            <div className="text-4xl md:text-5xl font-bold text-gray-900">{totalStock.toLocaleString()}</div>
            <div className="mt-1 text-sm text-gray-600">Total Units</div>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
            <CheckCircle className="h-6 w-6 text-gray-400 mb-3" />
            <div className="text-4xl md:text-5xl font-bold text-gray-900">{healthyStockCount}</div>
            <div className="mt-1 text-sm text-gray-600">Healthy Stock</div>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
            <AlertTriangle className="h-6 w-6 text-gray-400 mb-3" />
            <div className="text-4xl md:text-5xl font-bold text-gray-900">{lowStockCount}</div>
            <div className="mt-1 text-sm text-gray-600">Low Stock Alert</div>
          </div>
        </div>
      )}

      {data.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg p-16 text-center">
          <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No warehouses yet</h3>
          <p className="text-gray-600 mb-6">Create your first warehouse to get started with inventory management.</p>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-secondary font-sora font-semibold rounded shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <Plus className="h-5 w-5" />
            <span>Create Warehouse</span>
          </button>
        </div>
      )}

      {data.length > 0 && (
        <>
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="h-5 w-5 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900">Locations</h2>
            </div>
            <WarehouseGrid warehouses={data} onEdit={setEditingWarehouse} onDelete={setDeletingWarehouse} />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-6">
              <Package className="h-5 w-5 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900">Inventory Details</h2>
            </div>
            <div className="border border-gray-200 bg-white rounded-lg overflow-hidden">
              <WarehouseTable warehouses={data} onEdit={setEditingWarehouse} onDelete={setDeletingWarehouse} />
            </div>
          </div>
        </>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Warehouse"
        size="md"
      >
        <WarehouseForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
          isSubmitting={createWarehouse.isPending}
        />
      </Modal>

      {editingWarehouse && (
        <Modal
          isOpen={!!editingWarehouse}
          onClose={() => setEditingWarehouse(null)}
          title={`Edit ${editingWarehouse.name}`}
          size="md"
        >
          <WarehouseForm
            warehouse={editingWarehouse}
            onSubmit={handleEdit}
            onCancel={() => setEditingWarehouse(null)}
            isSubmitting={updateWarehouse.isPending}
          />
        </Modal>
      )}

      {deletingWarehouse && (
        <ConfirmDialog
          isOpen={!!deletingWarehouse}
          onClose={() => setDeletingWarehouse(null)}
          onConfirm={handleDelete}
          title="Delete Warehouse"
          message={`Are you sure you want to delete "${deletingWarehouse.name}"? This action cannot be undone and will permanently remove this warehouse from the system.`}
          confirmText="Delete Warehouse"
          variant="danger"
        />
      )}
    </div>
  );
}
