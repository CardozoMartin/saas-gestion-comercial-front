import { useState } from "react";
import type { IconType } from "../utils/Toast/Toast";

export const useToast = () => {
  const [toasts, setToasts] = useState<Array<{
    id: number;
    title: string;
    message: string;
    color: "red" | "blue" | "green" | "yellow";
    icon: IconType;
    duration?: number;
  }>>([]);

  const showToast = (
    title: string,
    message: string,
    color: "red" | "blue" | "green" | "yellow" = "green",
    icon: IconType = "success",
    duration: number = 3000
  ) => {
    const newToast = {
      id: Date.now(),
      title,
      message,
      color,
      icon,
      duration,
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return { toasts, showToast, removeToast };
};