
import React from 'react';
import { Section } from './Section';
import type { FormData, FormFieldChangeEvent } from '../types/encargo.types';

interface Props {
  formData: FormData;
  handleChange: (e: FormFieldChangeEvent) => void;
}

export const ExpensesSection: React.FC<Props> = ({ formData, handleChange }) => {
  return (
    <Section title="4) Gastos, ocupación y llaves">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-3 space-y-2">
              <b className="text-slate-800">Gastos de la vivienda</b>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Comunidad (€/mes)</label><input type="number" step="0.01" name="com_mes" value={formData.com_mes} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Derramas</label><select name="com_der" value={formData.com_der} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"><option>—</option><option>Sí</option><option>No</option><option>Pendiente</option></select></div>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Observaciones derramas</label><input name="com_obs" value={formData.com_obs} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">IBI (€/anual)</label><input type="number" step="0.01" name="ibi_anual" value={formData.ibi_anual} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Tasa basuras (€)</label><input type="number" step="0.01" name="basura" value={formData.basura} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" /></div>
              </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Agua</label><select name="agua_act" value={formData.agua_act} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"><option>—</option><option>Alta</option><option>Baja</option></select></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Luz</label><select name="luz_act" value={formData.luz_act} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"><option>—</option><option>Alta</option><option>Baja</option></select></div>
              </div>
          </div>
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-3 space-y-2">
                <b className="text-slate-800">Ocupación y llaves</b>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Ocupación actual</label><select name="ocup" value={formData.ocup} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"><option>Libre</option><option>Propietario</option><option>Inquilino</option><option>Okupa</option></select></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">¿Quién vive?</label><input name="ocupantes" value={formData.ocupantes} onChange={handleChange} placeholder="Nombre, parentesco..." className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Disponemos de llaves</label><select name="llaves" value={formData.llaves} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"><option>No</option><option>Sí</option></select></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Contacto para llaves</label><input name="llaves_contacto" value={formData.llaves_contacto} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" /></div>
                </div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label><input name="llaves_tel" value={formData.llaves_tel} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Instrucciones</label><input name="llaves_instr" value={formData.llaves_instr} onChange={handleChange} placeholder="Disponibilidad, preaviso..." className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" /></div>
          </div>
      </div>
    </Section>
  );
};
