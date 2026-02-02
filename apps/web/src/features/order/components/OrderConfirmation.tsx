import { CheckCircle } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { SummaryRow } from "../../../components/ui/SummaryRow";
import type { SubmitResponse } from "../types/order";

interface OrderConfirmationProps {
  data: SubmitResponse;
  onNewOrder: () => void;
}

export function OrderConfirmation({ data, onNewOrder }: OrderConfirmationProps) {
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border-2 border-green-500 p-10 text-center">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
      </div>

      <h2 className="text-3xl font-sora font-bold text-green-600 mb-2">Order Confirmed!</h2>

      <p className="text-tertiary font-lato mb-2">Order Number</p>
      <div className="text-5xl font-sora font-bold text-secondary mb-8">#{data.orderNumber}</div>

      {/* Order Details Card */}
      <div className="bg-tertiary-light rounded-lg p-6 mb-8 text-left">
        <h3 className="text-lg font-sora font-semibold text-secondary mb-4">Order Summary</h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 font-lato">
            <span className="text-tertiary">Order ID:</span>
            <span className="font-mono text-sm text-secondary bg-white px-3 py-1 rounded border border-tertiary-border">
              {data.orderId}
            </span>
          </div>

          <SummaryRow
            label="Discount Applied:"
            value={formatCurrency(data.discountAmount)}
            valueClassName="font-semibold text-green-600"
            className="border-t border-tertiary-border"
          />

          <SummaryRow label="Shipping Cost:" value={formatCurrency(data.shippingCost)} />

          <SummaryRow label="Total Paid:" value={formatCurrency(data.totalPrice)} isTotal />
        </div>
      </div>

      <Button variant="primary" onClick={onNewOrder}>
        Create New Order
      </Button>
    </div>
  );
}
