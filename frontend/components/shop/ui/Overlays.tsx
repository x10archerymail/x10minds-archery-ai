import { useEffect, type FC } from "react";
import { motion } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export type NotificationType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
}

export const Toast: FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed bottom-8 right-8 z-[1000] glass-morphism rounded-2xl p-4 pr-12 shadow-2xl flex items-center gap-4 min-w-[300px]"
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};
