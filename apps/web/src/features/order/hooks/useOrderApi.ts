import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { VerifyOrderData } from "../services/orderSchemas";
import { submitOrder, verifyOrder } from "../services/orderService";
import type { SubmitResponse, VerifyResponse } from "../types/order";

export function useVerifyOrder(
  options?: Omit<UseMutationOptions<VerifyResponse, Error, VerifyOrderData>, "mutationFn">,
) {
  return useMutation({
    mutationFn: (data: VerifyOrderData) => verifyOrder(data),
    ...options,
  });
}

export function useSubmitOrder(
  options?: Omit<UseMutationOptions<SubmitResponse, Error, VerifyOrderData>, "mutationFn">,
) {
  return useMutation({
    mutationFn: (data: VerifyOrderData) => submitOrder(data),
    ...options,
  });
}
