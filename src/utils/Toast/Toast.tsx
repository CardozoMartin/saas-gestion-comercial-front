import  { useState, useEffect } from "react";
import {
  CircleCheckBig,
  CircleX,
  TriangleAlert,
  Trash,
  SquarePen,
  Info,
  Upload,
  Save,
} from "lucide-react";


const iconMap = {
  success: CircleCheckBig,
  error: CircleX,
  warning: TriangleAlert,
  trash: Trash,
  edit: SquarePen,
  info: Info,
  upload: Upload,
  save: Save,
};

export type IconType = keyof typeof iconMap;

interface ToastProps {
  title: string;
  message: string;
  color?: "red" | "blue" | "green" | "yellow";
  icon?: IconType;
  onClose?: () => void;
  duration?: number; 
}

const Toast = ({
  title,
  message,
  color = "green",
  icon = "success",
  onClose,
  duration = 3000,
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Auto cerrar después de la duración especificada
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const IconComponent = iconMap[icon];

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, 300); 
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`bg-white inline-flex space-x-3 p-3 text-sm rounded border border-gray-200 shadow-lg transition-all duration-300 ${
        isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
      }`}
    >
      <IconComponent
        size={24}
        className={`text-${color}-500 mt-2 flex-shrink-0`}
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-slate-700 font-medium">{title}</h3>
        <p className="text-slate-500">{message}</p>
      </div>
      <button
        type="button"
        aria-label="close"
        onClick={handleClose}
        className="cursor-pointer mb-auto text-slate-400 hover:text-slate-600 active:scale-95 transition"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="12.532"
            width="17.498"
            height="2.1"
            rx="1.05"
            transform="rotate(-45.74 0 12.532)"
            fill="currentColor"
            fillOpacity=".7"
          />
          <rect
            x="12.531"
            y="13.914"
            width="17.498"
            height="2.1"
            rx="1.05"
            transform="rotate(-135.74 12.531 13.914)"
            fill="currentColor"
            fillOpacity=".7"
          />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
