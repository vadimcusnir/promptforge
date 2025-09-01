import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'success' | 'error';
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const icons = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle,
    error: XCircle,
  };

  const colors = {
    info: {
      bg: 'bg-[#1a1a1a]',
      border: 'border-[#5a5a5a]/30',
      icon: 'text-[#d1a954]',
      title: 'text-white',
      text: 'text-[#a0a0a0]',
    },
    warning: {
      bg: 'bg-[#2a1a0a]',
      border: 'border-[#d1a954]/50',
      icon: 'text-[#d1a954]',
      title: 'text-[#d1a954]',
      text: 'text-[#a0a0a0]',
    },
    success: {
      bg: 'bg-[#0a1a0a]',
      border: 'border-[#4ade80]/50',
      icon: 'text-[#4ade80]',
      title: 'text-[#4ade80]',
      text: 'text-[#a0a0a0]',
    },
    error: {
      bg: 'bg-[#1a0a0a]',
      border: 'border-[#ef4444]/50',
      icon: 'text-[#ef4444]',
      title: 'text-[#ef4444]',
      text: 'text-[#a0a0a0]',
    },
  };

  const Icon = icons[type];
  const colorScheme = colors[type];

  return (
    <div className={`${colorScheme.bg} ${colorScheme.border} border rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${colorScheme.icon} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          {title && (
            <h3 className={`font-sans font-medium ${colorScheme.title} mb-2`}>
              {title}
            </h3>
          )}
          <div className={`font-sans text-sm ${colorScheme.text}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
