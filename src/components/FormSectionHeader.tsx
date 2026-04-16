import React from 'react';

interface FormSectionHeaderProps {
  title: string;
  className?: string;
}

export const FormSectionHeader: React.FC<FormSectionHeaderProps> = ({ title, className }) => {
  return (
    <div className={className}>
      <h3 className="text-sm font-bold tracking-[0.08em] text-[#6f5d3d]">{title}</h3>
      <div className="mt-2 h-px bg-[#e7d7b8]"></div>
    </div>
  );
};
