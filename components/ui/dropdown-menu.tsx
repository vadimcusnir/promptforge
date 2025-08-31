"use client";

import { ReactNode, useState, useRef, useEffect } from "react";

interface DropdownMenuProps {
  children: ReactNode;
  trigger: ReactNode;
  className?: string;
}

export function DropdownMenu({ children, trigger, className = "" }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-pf-surface border border-pf-text-muted/30 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

interface DropdownMenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function DropdownMenuItem({ children, onClick, disabled = false, className = "" }: DropdownMenuItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left px-4 py-2 text-sm text-pf-text hover:bg-pf-text-muted/10 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}
