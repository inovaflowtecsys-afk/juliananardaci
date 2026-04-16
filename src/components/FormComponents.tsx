import React from 'react';
import { cn } from '@/lib/utils';

export const FormRow = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("grid grid-cols-12 gap-4 mb-4", className)}>
    {children}
  </div>
);

export const FormField = ({ 
  label, 
  children, 
  colSpan = 4 
}: { 
  label: string; 
  children: React.ReactNode; 
  colSpan?: number 
}) => (
  <div className={cn("flex flex-col gap-1", `col-span-${colSpan}`)}>
    <label className="text-xs font-medium text-slate-500">{label}</label>
    {children}
  </div>
);

export const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    className={cn(
      "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all",
      className
    )}
    {...props}
  />
);
