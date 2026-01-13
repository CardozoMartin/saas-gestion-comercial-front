import  { useState } from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";

interface AlertProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  color?: "red" | "blue" | "green" | "yellow";
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const Alert = ({ 
  title, 
  message, 
  icon, 
  color = "red",
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel"
}: AlertProps) => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = () => {
    setIsCancelled(true);
    if (onCancel) {
      onCancel();
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      if (onConfirm) {
        await onConfirm();
      }
      setShowSuccess(true);
      setTimeout(() => {
        setIsCancelled(true);
      }, 2000);
    } catch (error) {
      console.error("Error al confirmar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCancelled) {
    return null;
  }

  // Modal de éxito
  if (showSuccess) {
    return (
      <div className="flex flex-col items-center bg-white shadow-md rounded-xl py-6 px-5 md:w-[460px] w-[370px] border border-gray-200">
        <div className="flex items-center justify-center p-4 bg-green-100 rounded-full">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-gray-900 font-semibold mt-4 text-xl">¡Éxito!</h2>
        <p className="text-sm text-gray-600 mt-2 text-center">
          La acción se completó correctamente
        </p>
      </div>
    );
  }

  // Modal de confirmación
  return (
    <div className="flex flex-col items-center bg-white shadow-md rounded-xl py-6 px-5 md:w-[460px] w-[370px] border border-gray-200">
      <div
        className={`flex items-center justify-center p-4 bg-${color}-100 rounded-full`}
      >
        {icon}
      </div>
      <h2 className="text-gray-900 font-semibold mt-4 text-xl">{title}</h2>
      <p className="text-sm text-gray-600 mt-2 text-center">{message}</p>
      <div className="flex items-center justify-center gap-4 mt-5 w-full">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          className="w-full md:w-36 h-10 rounded-md border border-gray-300 bg-white text-gray-600 font-medium text-sm hover:bg-gray-100 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isLoading}
          className={`w-full md:w-36 h-10 rounded-md text-white bg-${color}-600 font-medium text-sm hover:bg-${color}-700 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? "Procesando..." : confirmText}
        </button>
      </div>
    </div>
  );
};

export default Alert;