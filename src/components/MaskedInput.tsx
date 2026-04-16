import React from 'react';
import { IMaskInput } from 'react-imask';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';

interface MaskedInputProps {
  label: string;
  mask: string | any;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  onAccept?: (value: string) => void;
  onBlur?: () => void;
  className?: string;
}

export const MaskedInput: React.FC<MaskedInputProps> = ({
  label,
  mask,
  value,
  onChange,
  placeholder,
  required,
  error,
  onAccept,
  onBlur,
  className
}) => {
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label className={cn("text-sm font-medium text-slate-700", error ? 'text-destructive' : '')}>
        {label}
      </Label>
      <IMaskInput
        mask={mask}
        value={value}
        unmask={true}
        onAccept={(value: string) => {
          onChange(value);
          if (onAccept) onAccept(value);
        }}
        onBlur={onBlur}
        placeholder={placeholder}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};
