"use client";

interface Toast {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

export function useToast() {
  const toast = ({ title, description, variant = "default" }: Toast) => {
    // Simple console log for now - can be enhanced later
    console.log(`Toast [${variant}]: ${title}${description ? ` - ${description}` : ""}`);
    
    // You could integrate with a proper toast library here
    // For now, we'll just show an alert
    alert(`${title}${description ? `\n${description}` : ""}`);
  };

  return { toast };
}