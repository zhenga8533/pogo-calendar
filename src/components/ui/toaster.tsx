import type { ToastState } from '../../hooks/useToast';
import { Toast, ToastClose, ToastProvider, ToastTitle, ToastViewport } from './toast';

const severityToVariant: Record<ToastState['severity'], 'default' | 'success' | 'destructive' | 'warning'> = {
  success: 'success',
  error: 'destructive',
  info: 'default',
  warning: 'warning',
};

interface ToasterProps {
  toast: ToastState;
  onClose: () => void;
}

export function Toaster({ toast, onClose }: ToasterProps) {
  return (
    <ToastProvider swipeDirection="right" duration={4000}>
      <Toast
        open={toast.open}
        onOpenChange={(open) => !open && onClose()}
        variant={severityToVariant[toast.severity]}
      >
        <ToastTitle>{toast.message}</ToastTitle>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}
