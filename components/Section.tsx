
import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <div className="p-4 sm:p-6 border-t border-slate-200">
      <h2 className="text-base font-bold text-slate-800 mb-4">{title}</h2>
      {children}
    </div>
  );
};
