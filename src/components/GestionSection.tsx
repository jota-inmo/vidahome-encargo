
import React from 'react';
import { Section } from './Section';
import type { FormData, FormFieldChangeEvent } from '../types/encargo.types';

interface Props {
  formData: FormData;
  handleChange: (e: FormFieldChangeEvent) => void;
}

export const GestionSection: React.FC<Props> = ({ formData, handleChange }) => {
  return (
    <Section title="1) Datos de gestión">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Referencia (manual) *</label>
          <input id="ref" name="ref" value={formData.ref} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Fecha del encargo *</label>
          <input id="fecha" name="fecha" type="date" value={formData.fecha} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Agente *</label>
          <select id="agente" name="agente" value={formData.agente} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white" required>
            <option value="">— Selecciona —</option>
            <option>Fred Diago Ferro</option>
            <option>Evelyne Bala</option>
            <option>Jean-Christophe Duval</option>
            <option>Toni Arribas</option>
            <option>Otro (especificar)</option>
          </select>
          {formData.agente === 'Otro (especificar)' && (
            <>
              <label className="block text-sm font-medium text-slate-700 mt-2 mb-1">Si "Otro", especifica *</label>
              <input id="agente_otro" name="agente_otro" value={formData.agente_otro} onChange={handleChange} placeholder="Nombre completo" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" />
            </>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Modalidad</label>
          <select id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white">
            <option value="normal">Venta</option>
            <option value="A">Alquiler (A)</option>
          </select>
        </div>
      </div>
    </Section>
  );
};
