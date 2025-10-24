import React from 'react';
import { logoUrl } from '../assets';

interface HeaderProps {
    categoria: 'normal' | 'A';
}

export const Header: React.FC<HeaderProps> = ({ categoria }) => {
  const modeTitle = categoria === 'A' ? 'de alquiler' : 'de venta';
  
  return (
    <header className="flex flex-col md:flex-row gap-4 items-center p-4 border-b border-slate-200 bg-white rounded-t-2xl">
      <img alt="Vida Home" src={logoUrl} className="w-48 h-auto object-contain" />
      <div className="text-center md:text-left">
        <div className="text-xl font-extrabold text-slate-800">
          Encargo de gestión {modeTitle} SIN EXCLUSIVA
        </div>
        <div className="text-xs text-slate-500 mt-1">
          Vida Home Gandia S.L. · CIF B75472027 · C/ Joan XXIII nº1 · 46730 Grau de Gandía · 960 519 214
        </div>
      </div>
    </header>
  );
};
