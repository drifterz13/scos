import { getApiUrl } from "../../../lib/api/config";
import type { SubmitResponse, VerifyResponse } from "../types/order";
import type { OrderResponse, VerifyOrderData, VerifyOrderResponse } from "./orderSchemas";
import { OrderResponseSchema, VerifyOrderResponseSchema } from "./orderSchemas";

function transformVerifyResponse(data: VerifyOrderResponse): VerifyResponse {
  const { orderPreview, isValid, validationMessage } = data;

  return {
    unitPrice: orderPreview.unitPrice,
    subtotal: orderPreview.unitPrice * orderPreview.quantity,
    discountPercentage: orderPreview.discountPercentage,
    discountAmount: orderPreview.totalDiscountAmount,
    totalAfterDiscount: orderPreview.totalPrice - orderPreview.totalShippingCost,
    shippingCost: orderPreview.totalShippingCost,
    totalPrice: orderPreview.totalPrice,
    isValid,
    invalidReason: validationMessage,
  };
}

function transformSubmitResponse(data: OrderResponse): SubmitResponse {
  return {
    success: true,
    orderNumber: data.orderNumber,
    orderId: data.id,
    totalPrice: data.totalPrice,
    discountAmount: data.totalDiscountAmount,
    shippingCost: data.totalShippingCost,
  };
}

export async function verifyOrder(data: VerifyOrderData): Promise<VerifyResponse> {
  const response = await fetch(getApiUrl("/orders/verify"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to verify order: ${response.statusText}`);
  }

  const rawData = await response.json();
  const validatedData = VerifyOrderResponseSchema.parse(rawData);
  return transformVerifyResponse(validatedData);
}

export async function submitOrder(data: VerifyOrderData): Promise<SubmitResponse> {
  const response = await fetch(getApiUrl("/orders/submit"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit order: ${response.statusText}`);
  }

  const rawData = await response.json();
  const validatedData = OrderResponseSchema.parse(rawData);
  return transformSubmitResponse(validatedData);
}
