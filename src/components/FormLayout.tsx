import React from 'react';
import { cn } from '@/lib/utils';

interface FormCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const FormCard: React.FC<FormCardProps> = ({ title, children, className }) => (
  <div className={cn("bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden", className)}>
    <div className="px-6 py-4 border-b border-slate-100">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

interface FormSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children, className }) => (
  <div className={cn("space-y-4", className)}>
    {title && <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {children}
    </div>
  </div>
);
