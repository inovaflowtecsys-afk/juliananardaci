import React from 'react';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  compact?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className, compact = false }) => {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 shadow-[0_16px_40px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70 backdrop-blur-sm">
        <img
          src="https://www.inovaflowtec.com.br/svg/junadarci.png"
          alt="Logotipo Juna Darci"
          className="h-10 w-10 object-contain"
        />
      </div>
      {!compact && (
        <div className="min-w-0">
          <div className="text-lg font-semibold tracking-tight text-[#214a43]">Juna Darci</div>
          <div className="text-sm text-[#8a7452]">Gestão clínica com fluxo inteligente</div>
        </div>
      )}
    </div>
  );
};
