import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  registerLabel: (value: string, label: string) => void;
  getLabel: (value: string) => string | undefined;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('Select components must be used within Select');
  return context;
}

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export function Select({ value = '', onValueChange, children }: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [labels, setLabels] = React.useState<Record<string, string>>({});

  const registerLabel = React.useCallback((itemValue: string, label: string) => {
    setLabels(prev => (prev[itemValue] === label ? prev : { ...prev, [itemValue]: label }));
  }, []);

  const contextValue = React.useMemo(
    () => ({
      value,
      onValueChange: (next: string) => {
        onValueChange?.(next);
        setOpen(false);
      },
      open,
      setOpen,
      registerLabel,
      getLabel: (itemValue: string) => labels[itemValue]
    }),
    [value, onValueChange, open, registerLabel, labels]
  );

  return (
    <SelectContext.Provider value={contextValue}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = useSelectContext();

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-left text-[#4f4636]',
          className
        )}
        onClick={() => setOpen(!open)}
        {...props}
      >
        <span className="truncate">{children}</span>
        <ChevronDown size={16} className="text-[#b79d74]" />
      </button>
    );
  }
);
SelectTrigger.displayName = 'SelectTrigger';

interface SelectValueProps {
  placeholder?: string;
}

export function SelectValue({ placeholder = 'Selecione' }: SelectValueProps) {
  const { value, getLabel } = useSelectContext();
  const label = value ? getLabel(value) ?? value : undefined;
  return <span className={cn(!label && 'text-[#b79d74]')}>{label ?? placeholder}</span>;
}

export const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { open } = useSelectContext();
    if (!open) return null;

    return (
      <div
        ref={ref}
        className={cn('absolute z-50 mt-1 w-full rounded-md border border-[#dcc8a1] bg-[#fffdfa] p-1 shadow-[0_18px_34px_rgba(223,198,150,0.22)]', className)}
        {...props}
      />
    );
  }
);
SelectContent.displayName = 'SelectContent';

interface SelectItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const SelectItem = React.forwardRef<HTMLButtonElement, SelectItemProps>(
  ({ className, children, value, onClick, ...props }, ref) => {
    const { onValueChange, registerLabel } = useSelectContext();
    const labelText = typeof children === 'string' ? children : String(value);

    React.useEffect(() => {
      registerLabel(value, labelText);
    }, [registerLabel, value, labelText]);

    return (
      <button
        ref={ref}
        type="button"
        className={cn('w-full rounded-sm px-2 py-1.5 text-left text-sm text-[#5f523d] hover:bg-[#f6ecda]', className)}
        onClick={e => {
          onClick?.(e);
          onValueChange(value);
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);
SelectItem.displayName = 'SelectItem';
