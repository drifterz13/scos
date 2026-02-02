import { CheckCircle, XCircle } from "lucide-react";
import { SummaryRow } from "../../../components/ui/SummaryRow";
import type { VerifyResponse } from "../types/order";

interface PricingBreakdownProps {
  data: VerifyResponse;
}

export function PricingBreakdown({ data }: PricingBreakdownProps) {
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow border border-tertiary-border p-8 mt-6">
      <h3 className="text-2xl font-sora font-semibold text-secondary mb-6">Pricing Summary</h3>

      <div className="space-y-3">
        <SummaryRow label="Unit Price:" value={formatCurrency(data.unitPrice)} />

        <SummaryRow label="Subtotal:" value={formatCurrency(data.subtotal)} />

        <SummaryRow
          label={`Discount (${data.discountPercentage}%):`}
          value={`-${formatCurrency(data.discountAmount)}`}
          valueClassName="font-semibold text-green-600"
          className="border-t border-tertiary-border"
        />

        <SummaryRow label="Total After Discount:" value={formatCurrency(data.totalAfterDiscount)} />

        <SummaryRow
          label="Shipping Cost:"
          value={formatCurrency(data.shippingCost)}
          className="border-t border-tertiary-border"
        />

        <SummaryRow label="Total Price:" value={formatCurrency(data.totalPrice)} isTotal />
      </div>

      <div
        className={`mt-6 px-4 py-3 rounded border-2 font-lato font-semibold flex items-center gap-2 ${
          data.isValid ? "bg-green-50 border-green-500 text-green-700" : "bg-red-50 border-red-500 text-red-700"
        }`}
      >
        {data.isValid ? (
          <>
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>Order is valid and ready to submit</span>
          </>
        ) : (
          <>
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <span>Order is invalid: {data.invalidReason}</span>
          </>
        )}
      </div>
    </div>
  );
}
