import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[linear-gradient(135deg,_#13b7a6_0%,_#0ea5e9_100%)] text-white shadow-[0_14px_34px_rgba(19,183,166,0.26)] hover:brightness-[1.03]',
        secondary: 'bg-[linear-gradient(135deg,_rgba(19,183,166,0.14)_0%,_rgba(14,165,233,0.12)_100%)] text-teal-900 hover:bg-[linear-gradient(135deg,_rgba(19,183,166,0.20)_0%,_rgba(14,165,233,0.18)_100%)]',
        outline: 'border border-cyan-200 bg-white text-teal-800 hover:bg-cyan-50 hover:border-cyan-300',
        ghost: 'text-teal-800 hover:bg-cyan-50/80 hover:text-sky-700',
        destructive: 'bg-red-600 text-white hover:bg-red-700'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', ...props }, ref) => {
    return <button ref={ref} type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  }
);

Button.displayName = 'Button';
