"use client";

import { Toast, ToastMessage } from "primereact/toast";
import { ReactNode, createContext, useContext, useRef } from "react";

interface ToastContextValue {
  showSuccess: (message: string, showProps?: ToastMessage) => void;
  showError: (message: string, showProps?: ToastMessage) => void;
  showInfo: (message: string, showProps?: ToastMessage) => void;
  showWarning: (message: string, showProps?: ToastMessage) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showError: () => {},
  showSuccess: () => {},
  showInfo: () => {},
  showWarning: () => {},
});

export const useToast = () => useContext(ToastContext);

interface Props {
  children?: ReactNode;
}

const ToastContextProvider = ({ children }: Props) => {
  const toast = useRef<Toast | null>(null);

  const showSuccess = (message: string, showProps?: ToastMessage) => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: message,
      ...showProps,
    });
  };

  const showError = (message: string, showProps?: ToastMessage) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: message,
      ...showProps,
    });
  };

  const showInfo = (message: string, showProps?: ToastMessage) => {
    toast.current?.show({
      severity: "info",
      summary: "Info",
      detail: message,
      ...showProps,
    });
  };

  const showWarning = (message: string, showProps?: ToastMessage) => {
    toast.current?.show({
      severity: "warn",
      summary: "Warning",
      detail: message,
      ...showProps,
    });
  };

  return (
    <>
      <ToastContext.Provider
        value={{ showError, showSuccess, showInfo, showWarning }}
      >
        {children}
      </ToastContext.Provider>

      <Toast ref={toast} />
    </>
  );
};
export default ToastContextProvider;
