import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSubmitOrder, useVerifyOrder } from "../hooks/useOrderApi";
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

  const verifyMutation = useVerifyOrder({
    onSuccess: (data) => {
      setVerifyResult(data);
      if (data.isValid) {
        toast.success("Order verified successfully");
      } else {
        toast.error(`Order is invalid: ${data.invalidReason}`);
      }
    },
    onError: (error) => {
      toast.error(error.message);
      setVerifyResult(null);
    },
  });

  const submitMutation = useSubmitOrder({
    onSuccess: (data) => {
      setSubmitResult(data);
      toast.success("Order submitted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { quantity, latitude, longitude } = form.watch();

  const getVerifyOrderData = () => {
    const qty = parseInt(quantity, 10);
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (Number.isNaN(qty) || Number.isNaN(lat) || Number.isNaN(lng)) {
      return null;
    }

    return {
      quantity: qty,
      shippingLatitude: lat,
      shippingLongitude: lng,
    };
  };

  const handleVerify = () => {
    const data = getVerifyOrderData();
    if (!data) {
      toast.error("Please enter valid values");
      return;
    }
    verifyMutation.mutate(data);
  };

  const handleSubmit = () => {
    const data = getVerifyOrderData();
    if (!data) {
      toast.error("Please enter valid values");
      return;
    }

    if (!verifyResult?.isValid) {
      toast.error("Please verify the order first");
      return;
    }

    submitMutation.mutate(data);
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
        isVerifying={verifyMutation.isPending}
        isSubmitting={submitMutation.isPending}
        isSubmitDisabled={!verifyResult?.isValid}
      />

      {verifyResult && <PricingBreakdown data={verifyResult} />}
    </div>
  );
}
