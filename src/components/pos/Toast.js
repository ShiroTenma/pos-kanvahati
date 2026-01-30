"use client"
import { CheckCircle, AlertCircle } from 'lucide-react';

export function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div className="toast toast-top toast-end z-50">
      <div className={`alert ${toast.type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg text-white rounded-xl animate-bounce`}>
        {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
