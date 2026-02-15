interface ButtonProps {
  variant: "primary" | "secondary";
  children: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit";
  fullWidth?: boolean;
}

export function Button({
  variant,
  children,
  onClick,
  disabled = false,
  loading = false,
  type = "button",
  fullWidth = false,
}: ButtonProps) {
  const baseClasses =
    "px-6 py-3 rounded font-sora font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200";

  const variantClasses =
    variant === "primary"
      ? "bg-primary hover:bg-primary-hover text-secondary shadow-sm hover:shadow-md"
      : "border-2 border-primary bg-white text-secondary hover:bg-tertiary-light";

  const widthClass = fullWidth ? "flex-1" : "";

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses} ${widthClass}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <span className="spinner"></span> {children}...
        </>
      ) : (
        children
      )}
    </button>
  );
}
