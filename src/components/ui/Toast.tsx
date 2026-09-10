import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useApp } from '@/hooks/useAppStore';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed top-5 right-5 z-[60] flex flex-col gap-2 w-80">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="flex items-center gap-3 bg-white rounded-xl shadow-elevated border border-ink-100 px-4 py-3 animate-slide-in-right"
        >
          {toast.type === 'success' && <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />}
          {toast.type === 'error' && <XCircle size={20} className="text-red-500 shrink-0" />}
          {toast.type === 'info' && <Info size={20} className="text-brand-500 shrink-0" />}
          <p className="text-sm font-medium text-ink-800 flex-1">{toast.message}</p>
          <button onClick={() => removeToast(toast.id)} className="text-ink-300 hover:text-ink-500">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
