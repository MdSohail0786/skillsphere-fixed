import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const variants = {
  default:
    "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100",
  success:
    "bg-green-50 dark:bg-green-900/40 border-green-200 dark:border-green-700 text-green-900 dark:text-green-100",
  error:
    "bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-700 text-red-900 dark:text-red-100",
  warning:
    "bg-yellow-50 dark:bg-yellow-900/40 border-yellow-200 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100",
};
const icons = { success: CheckCircle, error: AlertCircle, default: Info };

export function Toast({
  id,
  title,
  description,
  variant = "default",
  onDismiss,
}) {
  const Icon = icons[variant] || Info;
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg max-w-sm w-full ${variants[variant]}`}
    >
      <Icon className="h-5 w-5 shrink-0 mt-0.5 opacity-70" />
      <div className="flex-1">
        {title && <p className="font-semibold text-sm">{title}</p>}
        {description && (
          <p className="text-sm opacity-80 mt-0.5">{description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="shrink-0 opacity-50 hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, dismiss }) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onDismiss={dismiss} />
      ))}
    </div>
  );
}
