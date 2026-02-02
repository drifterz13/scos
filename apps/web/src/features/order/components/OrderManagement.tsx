import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { submitOrder, verifyOrder } from "../services/orderService";
import type { SubmitResponse, VerifyResponse } from "../types/order";
import { OrderConfirmation } from "./OrderConfirmation";
import { OrderForm } from "./OrderForm";
import { PricingBreakdown } from "./PricingBreakdown";

type FormValues = {
  quantity: string;
  latitude: string;
  longitude: string;
};

export function OrderManagement() {
  const form = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      quantity: "",
      latitude: "",
      longitude: "",
    },
  });

  const [verifyResult, setVerifyResult] = useState<VerifyResponse | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { quantity, latitude, longitude } = form.watch();

  const getNumericValues = () => ({
    quantity: parseInt(quantity, 10),
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
  });

  const handleVerify = async () => {
    const numericValues = getNumericValues();

    if (
      Number.isNaN(numericValues.quantity) ||
      Number.isNaN(numericValues.latitude) ||
      Number.isNaN(numericValues.longitude)
    ) {
      toast.error("Please enter valid values");
      return;
    }

    setIsVerifying(true);

    try {
      const result = await verifyOrder(numericValues);
      setVerifyResult(result);
      if (result.isValid) {
        toast.success("Order verified successfully");
      } else {
        toast.error(`Order is invalid: ${result.invalidReason}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to verify order");
      setVerifyResult(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async () => {
    const numericValues = getNumericValues();

    if (!verifyResult?.isValid) {
      toast.error("Please verify the order first");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitOrder(numericValues);
      setSubmitResult(result);
      toast.success("Order submitted successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    form.reset();
    setVerifyResult(null);
    setSubmitResult(null);
  };

  if (submitResult) {
    return (
      <div className="max-w-2xl mx-auto">
        <OrderConfirmation data={submitResult} onNewOrder={handleReset} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <OrderForm
        form={form}
        onVerify={handleVerify}
        onSubmit={handleSubmit}
        isVerifying={isVerifying}
        isSubmitting={isSubmitting}
        isSubmitDisabled={!verifyResult?.isValid}
      />

      {verifyResult && <PricingBreakdown data={verifyResult} />}
    </div>
  );
}
