"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, type, message, visible, onClose, duration, ...props }) {
        return (
          <Toast
            key={id}
            type={type || "success"}
            message={message || "Toast message"}
            visible={visible || true}
            onClose={onClose || (() => {})}
            duration={duration}
            {...props}
          />
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
