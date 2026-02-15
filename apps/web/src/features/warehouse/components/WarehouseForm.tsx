import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/Button";
import type { CreateWarehouseRequest } from "../services/warehouseService";
import type { Warehouse } from "../types/warehouse";

interface WarehouseFormProps {
  warehouse?: Warehouse;
  onSubmit: (data: CreateWarehouseRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function WarehouseForm({ warehouse, onSubmit, onCancel, isSubmitting }: WarehouseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWarehouseRequest>({
    defaultValues: warehouse
      ? {
          name: warehouse.name,
          latitude: warehouse.latitude,
          longitude: warehouse.longitude,
          stockQuantity: warehouse.stockQuantity,
        }
      : {
          name: "",
          latitude: 0,
          longitude: 0,
          stockQuantity: 0,
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5 font-sora">
          Warehouse Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name", {
            required: "Warehouse name is required",
            minLength: { value: 1, message: "Name must be at least 1 character" },
            maxLength: { value: 100, message: "Name must not exceed 100 characters" },
          })}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg font-lato text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          placeholder="Enter warehouse name"
        />
        {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1.5 font-sora">
            Latitude
          </label>
          <input
            id="latitude"
            type="number"
            step="any"
            {...register("latitude", {
              required: "Latitude is required",
              min: { value: -90, message: "Latitude must be between -90 and 90" },
              max: { value: 90, message: "Latitude must be between -90 and 90" },
              valueAsNumber: true,
            })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg font-lato text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="0.00"
          />
          {errors.latitude && <p className="mt-1.5 text-sm text-red-600">{errors.latitude.message}</p>}
        </div>

        <div>
          <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1.5 font-sora">
            Longitude
          </label>
          <input
            id="longitude"
            type="number"
            step="any"
            {...register("longitude", {
              required: "Longitude is required",
              min: { value: -180, message: "Longitude must be between -180 and 180" },
              max: { value: 180, message: "Longitude must be between -180 and 180" },
              valueAsNumber: true,
            })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg font-lato text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="0.00"
          />
          {errors.longitude && <p className="mt-1.5 text-sm text-red-600">{errors.longitude.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-1.5 font-sora">
          Stock Quantity
        </label>
        <input
          id="stockQuantity"
          type="number"
          {...register("stockQuantity", {
            required: "Stock quantity is required",
            min: { value: 0, message: "Stock quantity cannot be negative" },
            valueAsNumber: true,
          })}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg font-lato text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          placeholder="0"
        />
        {errors.stockQuantity && <p className="mt-1.5 text-sm text-red-600">{errors.stockQuantity.message}</p>}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        <Button variant="secondary" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={isSubmitting}>
          {warehouse ? "Update Warehouse" : "Create Warehouse"}
        </Button>
      </div>
    </form>
  );
}
