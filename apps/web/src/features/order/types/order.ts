// Request/Response types for Order Management API

export interface VerifyRequest {
  quantity: number;
  latitude: number;
  longitude: number;
}

export interface VerifyResponse {
  unitPrice: number;
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  totalAfterDiscount: number;
  shippingCost: number;
  totalPrice: number;
  isValid: boolean;
  invalidReason?: string;
}

export interface SubmitRequest {
  quantity: number;
  latitude: number;
  longitude: number;
}

export interface SubmitResponse {
  success: boolean;
  orderNumber: number;
  orderId: string;
  totalPrice: number;
  discountAmount: number;
  shippingCost: number;
}
