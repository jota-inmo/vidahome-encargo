
import React from 'react';

interface ProgressBarProps {
  progress: number;
  pendingFields: number;
  saveStatus: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, pendingFields, saveStatus }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-slate-200">
      <div className="w-full bg-slate-200 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between items-center mt-2 text-sm">
        <div className="font-medium text-slate-600">
          {progress}% completado
          {pendingFields > 0 ? (
            <span className="ml-2 text-slate-500 font-normal">({pendingFields} {pendingFields === 1 ? 'campo pendiente' : 'campos pendientes'})</span>
          ) : (
            <span className="ml-2 text-green-600 font-bold">✓ Formulario completo</span>
          )}
        </div>
        <div className="text-xs text-emerald-600 font-medium">
          {saveStatus}
        </div>
      </div>
    </div>
  );
};
