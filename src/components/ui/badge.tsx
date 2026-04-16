import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', {
  variants: {
    variant: {
      default: 'bg-[linear-gradient(135deg,_#13b7a6_0%,_#0ea5e9_100%)] text-white',
      secondary: 'bg-[#f4e8cf] text-[#6f5d3d]',
      destructive: 'bg-red-600 text-white',
      outline: 'border border-[#dcc8a1] text-[#6f5d3d]'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
