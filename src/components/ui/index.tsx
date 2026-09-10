import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

export { Badge, statusBadge } from './Badge';
export { Modal } from './Modal';
export { ConfirmDialog } from './ConfirmDialog';

export function PageHeader({
  title, subtitle, breadcrumb, actions,
}: {
  title: string;
  subtitle?: string;
  breadcrumb: string[];
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6">
      <nav className="flex items-center gap-1.5 text-xs text-ink-400 mb-2">
        {breadcrumb.map((bc, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={12} className="text-ink-300" />}
            <span className={i === breadcrumb.length - 1 ? 'text-ink-600 font-medium' : ''}>{bc}</span>
          </span>
        ))}
      </nav>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-ink-500 mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-ink-100 shadow-card ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between px-5 py-4 border-b border-ink-100">
      <div>
        <h3 className="font-semibold text-ink-900">{title}</h3>
        {subtitle && <p className="text-xs text-ink-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Button({
  children, variant = 'primary', size = 'md', onClick, type = 'button', className = '', disabled,
}: {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  disabled?: boolean;
}) {
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm',
    secondary: 'bg-white text-ink-700 border border-ink-200 hover:bg-ink-50',
    ghost: 'text-ink-600 hover:bg-ink-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}

export function Input({
  label, value, onChange, type = 'text', placeholder, required, options,
}: {
  label?: string;
  value: string | number;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-ink-600 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {options ? (
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg border border-ink-200 text-sm text-ink-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
        >
          <option value="">Pilih {label}</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 rounded-lg border border-ink-200 text-sm text-ink-800 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
        />
      )}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder = 'Cari...' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-ink-200 text-sm text-ink-800 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all bg-white relative"
    />
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-ink-400">
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function UnderDevelopment() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-600">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-ink-800 mb-1">Modul dalam Pengembangan</h3>
      <p className="text-sm text-ink-500 text-center max-w-md">
        Modul ini sedang dalam tahap pengembangan dan akan segera tersedia pada versi berikutnya.
      </p>
    </div>
  );
}
