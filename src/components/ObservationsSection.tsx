
import React from 'react';
import { Section } from './Section';
import type { FormData, FormFieldChangeEvent } from '../types/encargo.types';

interface Props {
  formData: FormData;
  handleChange: (e: FormFieldChangeEvent) => void;
}

const CheckboxGroup: React.FC<{
    name: 'vistas' | 'servicios';
    options: string[];
    selected: string[];
    onChange: (e: FormFieldChangeEvent) => void;
}> = ({ name, options, selected, onChange }) => (
    <div className="flex flex-wrap gap-2">
        {options.map(option => (
            <label key={option} className="flex items-center gap-2 border border-slate-300 rounded-full px-3 py-1.5 bg-white text-sm font-semibold cursor-pointer has-[:checked]:bg-sky-100 has-[:checked]:border-sky-400 transition-colors">
                <input 
                    type="checkbox" 
                    name={`${name}-${option}`} 
                    value={option}
                    checked={selected.includes(option)} 
                    onChange={onChange}
                    className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                />
                {option}
            </label>
        ))}
    </div>
);


export const ObservationsSection: React.FC<Props> = ({ formData, handleChange }) => {
  return (
    <Section title="6) Observaciones y extras">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Vistas</label>
              <CheckboxGroup name="vistas" options={['Mar', 'Montaña', 'Ambas', 'Ninguna']} selected={formData.vistas} onChange={handleChange} />
          </div>
          <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Zonas/servicios</label>
              <CheckboxGroup name="servicios" options={['Piscina', 'Jardines', 'Tenis', 'Pádel', 'Sauna', 'Domótica']} selected={formData.servicios} onChange={handleChange} />
          </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Otros (campo libre)</label>
              <textarea id="obs_otro" name="obs_otro" value={formData.obs_otro} onChange={handleChange} placeholder="Detalles relevantes para la venta/alquiler" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm min-h-[80px]"></textarea>
          </div>
      </div>
    </Section>
  );
};
