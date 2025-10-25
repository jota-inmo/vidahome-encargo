
import React from 'react';

interface Props {
  isGenerating: boolean;
  onGenerate: (isPreview: boolean) => void;
}

export const ActionButtons: React.FC<Props> = ({ isGenerating, onGenerate }) => {
  return (
    <div className="flex justify-between items-center gap-4 p-4 border-t border-slate-200 bg-slate-50">
      <span className="text-xs text-slate-500">v4.0 · Refactored Edition</span>
      <div className="flex gap-2">
        <button 
          onClick={() => onGenerate(true)} 
          disabled={isGenerating}
          className="bg-white border border-slate-300 text-slate-800 px-4 py-2.5 rounded-lg font-bold hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {isGenerating ? 'Generando...' : 'Previsualizar'}
        </button>
        <button 
          onClick={() => onGenerate(false)} 
          disabled={isGenerating}
          className="bg-slate-800 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {isGenerating ? 'Generando...' : 'Descargar PDF'}
        </button>
      </div>
    </div>
  );
};
