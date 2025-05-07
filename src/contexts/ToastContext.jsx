import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Simple toast provider component that just renders the ToastContainer
export const ToastProvider = ({ children }) => {
  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

// Direct export of toast functions
export const useToast = () => {
  return {
    success: (message, options) => toast.success(message, options),
    error: (message, options) => toast.error(message, options),
    info: (message, options) => toast.info(message, options),
    warning: (message, options) => toast.warning(message, options),
    showToast: (message, type, options) => {
      switch (type) {
        case "success":
          return toast.success(message, options);
        case "error":
          return toast.error(message, options);
        case "warning":
          return toast.warning(message, options);
        case "info":
        default:
          return toast.info(message, options);
      }
    },
  };
};
