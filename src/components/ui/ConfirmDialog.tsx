import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}

export function ConfirmDialog({
  open, onClose, onConfirm, title, message,
  confirmText = 'Konfirmasi', cancelText = 'Batal', variant = 'danger',
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm"
      footer={
        <>
          <button onClick={onClose}
            className="px-4 py-2.5 rounded-lg text-sm font-semibold text-ink-600 hover:bg-ink-100 transition-colors">
            {cancelText}
          </button>
          <button onClick={() => { onConfirm(); onClose(); }}
            className={`px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors ${
              variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
            }`}>
            {confirmText}
          </button>
        </>
      }
    >
      <div className="flex gap-4">
        <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
          variant === 'danger' ? 'bg-red-100' : 'bg-amber-100'
        }`}>
          <AlertTriangle size={22} className={variant === 'danger' ? 'text-red-600' : 'text-amber-600'} />
        </div>
        <p className="text-sm text-ink-600 leading-relaxed pt-3">{message}</p>
      </div>
    </Modal>
  );
}
