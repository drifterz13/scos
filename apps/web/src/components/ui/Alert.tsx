interface AlertProps {
  variant: "error" | "success" | "warning";
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function Alert({ variant, children, icon }: AlertProps) {
  const variantClasses = {
    error: "bg-red-50 border-2 border-red-500 text-red-700",
    success: "bg-green-50 border-2 border-green-500 text-green-700",
    warning: "bg-yellow-50 border-2 border-yellow-500 text-yellow-700",
  };

  return (
    <div className={`px-4 py-3 rounded mb-6 font-lato ${variantClasses[variant]} flex items-center gap-2`}>
      {icon}
      <span>{children}</span>
    </div>
  );
}
