import { useCallback, useState } from "react";

export type ToastSeverity = "success" | "error" | "info" | "warning";

export interface ToastState {
  open: boolean;
  message: string;
  severity: ToastSeverity;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = useCallback((message: string, severity: ToastSeverity = "success") => {
    setToast({ open: true, message, severity });
  }, []);

  const handleCloseToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    toast,
    showToast,
    handleCloseToast,
  };
}
