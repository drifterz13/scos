interface SummaryRowProps {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
  className?: string;
  isTotal?: boolean;
}

export function SummaryRow({
  label,
  value,
  valueClassName = "font-semibold text-secondary",
  className = "",
  isTotal = false,
}: SummaryRowProps) {
  return (
    <div
      className={`flex justify-between items-center ${isTotal ? "py-4 text-lg border-t-2 border-secondary mt-4" : "py-2 text-tertiary font-lato"} ${className}`.trim()}
    >
      <span className={isTotal ? "font-sora font-bold text-secondary" : ""}>{label}</span>
      <span className={`${valueClassName} ${isTotal ? "font-sora font-bold text-secondary" : ""}`.trim()}>{value}</span>
    </div>
  );
}
