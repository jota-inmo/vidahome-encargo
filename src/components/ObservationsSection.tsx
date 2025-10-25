
import React from 'react';
import { Section } from './Section';
import type { FormData, FormFieldChangeEvent } from '../types/encargo.types';

interface Props {
  formData: FormData;
  handleChange: (e: FormFieldChangeEvent) => void;
}

export const ObservationsSection: React.FC<Props> = ({ formData, handleChange }) => {
  return (
    <Section title="6) Observaciones y extras">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Vistas</label>
              <div className="flex flex-wrap gap-2">
                  {['Mar', 'Montaña', 'Ambas', 'Ninguna'].map(vista => (
                        <label key={vista} className="flex items-center gap-2 border border-slate-300 rounded-full px-3 py-1.5 bg-white text-sm font-semibold cursor-pointer has-[:checked]:bg-sky-100 has-[:checked]:border-sky-400 transition-colors">
                          <input type="checkbox" name={`vistas-${vista}`} checked={formData.vistas.includes(vista)} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"/>
                          {vista}
                      </label>
                  ))}
              </div>
          </div>
          <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Zonas/servicios</label>
              <div className="flex flex-wrap gap-2">
                    {['Piscina', 'Jardines', 'Tenis', 'Pádel', 'Sauna', 'Domótica'].map(srv => (
                        <label key={srv} className="flex items-center gap-2 border border-slate-300 rounded-full px-3 py-1.5 bg-white text-sm font-semibold cursor-pointer has-[:checked]:bg-sky-100 has-[:checked]:border-sky-400 transition-colors">
                          <input type="checkbox" name={`servicios-${srv}`} checked={formData.servicios.includes(srv)} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"/>
                          {srv}
                      </label>
                  ))}
              </div>
          </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Otros (campo libre)</label>
              <textarea id="obs_otro" name="obs_otro" value={formData.obs_otro} onChange={handleChange} placeholder="Detalles relevantes para la venta/alquiler" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm min-h-[80px]"></textarea>
          </div>
      </div>
    </Section>
  );
};
