import React from "react";
import { ToastContainer, toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// interface ToastNotificationProps {
//   message: string;
//   type?: "info" | "success" | "warning" | "error";
//   options?: ToastOptions;
// }

const ToastNotification: React.FC = () => {
  return <ToastContainer />;
};

export const showToast = (
  message: string,
  type: "info" | "success" | "warning" | "error" = "info",
  options?: ToastOptions
) => {
  switch (type) {
    case "info":
      toast.info(message, options);
      break;
    case "success":
      toast.success(message, options);
      break;
    case "warning":
      toast.warning(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    default:
      toast(message, options);
  }
};

export default ToastNotification;
