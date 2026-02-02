import type { SubmitRequest, SubmitResponse, VerifyRequest, VerifyResponse } from "../types/order";

// Base API URL - can be configured via environment variables
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://localhost:8080";

/**
 * Verify order pricing without submitting
 */
export async function verifyOrder(data: VerifyRequest): Promise<VerifyResponse> {
  const response = await fetch(`${API_BASE_URL}/api/orders/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to verify order: ${response.statusText}`);
  }

  return response.json() as Promise<VerifyResponse>;
}

/**
 * Submit order and update inventory
 */
export async function submitOrder(data: SubmitRequest): Promise<SubmitResponse> {
  const response = await fetch(`${API_BASE_URL}/api/orders/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit order: ${response.statusText}`);
  }

  return response.json() as Promise<SubmitResponse>;
}
