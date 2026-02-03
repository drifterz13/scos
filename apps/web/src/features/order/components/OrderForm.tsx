import type { UseFormReturn } from "react-hook-form";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

interface OrderFormProps {
  form: UseFormReturn<{
    quantity: string;
    latitude: string;
    longitude: string;
  }>;
  onVerify: () => void;
  onSubmit: () => void;
  isVerifying: boolean;
  isSubmitting: boolean;
  isSubmitDisabled: boolean;
}

export function OrderForm({ form, onVerify, onSubmit, isVerifying, isSubmitting, isSubmitDisabled }: OrderFormProps) {
  const { formState } = form;
  const { errors } = formState;

  return (
    <div className="bg-white rounded-lg shadow border border-tertiary-border p-8">
      <h2 className="text-2xl font-sora font-semibold text-secondary mb-6">Create New Order</h2>

      <div className="space-y-5">
        <Input
          id="quantity"
          label="Quantity"
          type="number"
          value={form.watch("quantity")}
          onChange={(value) => form.setValue("quantity", value, { shouldValidate: true })}
          placeholder="Enter quantity (minimum 1)"
          min={1}
          step="1"
          error={errors.quantity?.message}
        />

        <Input
          id="latitude"
          label="Latitude"
          type="number"
          value={form.watch("latitude")}
          onChange={(value) => form.setValue("latitude", value, { shouldValidate: true })}
          placeholder="Enter latitude (-90 to 90)"
          min={-90}
          max={90}
          step="any"
          error={errors.latitude?.message}
        />

        <Input
          id="longitude"
          label="Longitude"
          type="number"
          value={form.watch("longitude")}
          onChange={(value) => form.setValue("longitude", value, { shouldValidate: true })}
          placeholder="Enter longitude (-180 to 180)"
          min={-180}
          max={180}
          step="any"
          error={errors.longitude?.message}
        />
      </div>

      <div className="flex gap-4 mt-8">
        <Button
          variant="secondary"
          onClick={onVerify}
          disabled={!formState.isValid || isVerifying || isSubmitting}
          loading={isVerifying}
          fullWidth
        >
          Verify Order
        </Button>
        <Button
          variant="primary"
          onClick={onSubmit}
          disabled={isSubmitDisabled || isSubmitting || isVerifying}
          loading={isSubmitting}
          fullWidth
        >
          Submit Order
        </Button>
      </div>
    </div>
  );
}
