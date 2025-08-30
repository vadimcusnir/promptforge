"use client";

import { Motion } from "@/components/Motion";
import { CheckCircle, AlertCircle, XCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

interface ToastProps {
  type: "success" | "error" | "warning";
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

// Export the interface for compatibility
export type { ToastProps };

export function Toast({
  type,
  message,
  visible,
  onClose,
  duration = 3000,
}: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onClose, 200); // Allow exit animation to complete
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible && !isExiting) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-900/20 border-green-500/30";
      case "error":
        return "bg-red-900/20 border-red-500/30";
      case "warning":
        return "bg-yellow-900/20 border-yellow-500/30";
    }
  };

  return (
    <Motion
      intent="state"
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm ${getBgColor()} ${
        visible && !isExiting ? "toast-enter-active" : "toast-exit-active"
      }`}
    >
      <Motion intent="state" className={type === "success" ? "success" : ""}>
        {getIcon()}
      </Motion>

      <span className="text-sm font-medium text-white">{message}</span>

      <Motion
        is="button"
        intent="guide"
        onClick={() => {
          setIsExiting(true);
          setTimeout(onClose, 200);
        }}
        className="p-1 hover:bg-white/10 rounded transition-colors"
      >
        <X className="w-4 h-4 text-gray-400" />
      </Motion>
    </Motion>
  );
}

// Toast manager hook
export function useToast() {
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      type: "success" | "error" | "warning";
      message: string;
      visible: boolean;
    }>
  >([]);

  const showToast = (
    type: "success" | "error" | "warning",
    message: string,
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message, visible: true }]);
  };

  const hideToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const ToastContainer = () => (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          visible={toast.visible}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </>
  );

  return {
    success: (message: string) => showToast("success", message),
    error: (message: string) => showToast("error", message),
    warning: (message: string) => showToast("warning", message),
    ToastContainer,
  };
}

// Additional toast components for compatibility
export function ToastClose({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600"
      {...props}
    />
  );
}

export function ToastDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className="text-sm opacity-90"
      {...props}
    />
  );
}

export function ToastProvider({ children, ...props }: React.ComponentProps<"div">) {
  return <div {...props}>{children}</div>;
}

export function ToastTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className="text-sm font-semibold"
      {...props}
    />
  );
}

export function ToastViewport({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
      {...props}
    />
  );
}

export type ToastActionElement = React.ReactElement<typeof ToastClose>;
