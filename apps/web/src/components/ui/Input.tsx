interface InputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: string;
  disabled?: boolean;
}

export function Input({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  min,
  max,
  step,
  disabled = false,
}: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-sora font-semibold text-secondary mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="w-full px-4 py-3 rounded border-2 border-tertiary-border bg-white text-secondary font-lato focus:outline-none focus:border-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
      />
    </div>
  );
}
