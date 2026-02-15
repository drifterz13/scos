import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const iconColor = variant === "danger" ? "text-red-500" : "text-amber-500";
  const iconBg = variant === "danger" ? "bg-red-50" : "bg-amber-50";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${iconBg} flex-shrink-0`}>
            <AlertTriangle className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div className="flex-1">
            <p className="text-gray-600 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>
            {cancelText}
          </Button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`px-6 py-3 rounded font-sora font-semibold text-white transition-all duration-200 cursor-pointer ${
              variant === "danger"
                ? "bg-red-500 hover:bg-red-600 shadow-sm hover:shadow-md"
                : "bg-amber-500 hover:bg-amber-600 shadow-sm hover:shadow-md"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
