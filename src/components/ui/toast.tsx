'use client';

import { useToast } from './use-toast';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export function Toaster() {
  const { toasts } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'rounded-lg p-4 shadow-lg transition-all animate-in fade-in slide-in-from-bottom-5',
            toast.variant === 'destructive'
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-background text-foreground border'
          )}
        >
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <div className="font-medium">{toast.title}</div>
              {toast.description && (
                <div className="text-sm opacity-90">{toast.description}</div>
              )}
            </div>
            <button
              onClick={() => {
                // Закрытие тоста будет реализовано через useToast
              }}
              className="text-foreground/50 hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
