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
  error?: string;
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
  error,
}: InputProps) {
  const inputClassName = `w-full px-4 py-3 rounded border-2 bg-white text-secondary font-lato focus:outline-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
    error ? "border-red-500 focus:border-red-700" : "border-tertiary-border focus:border-primary"
  }`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-sora font-semibold text-secondary mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className={inputClassName}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-lato text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
