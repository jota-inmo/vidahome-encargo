
import React from 'react';
import { Section } from './Section';
import type { FormData } from '../types/encargo.types';

interface Props {
  formData: FormData;
  handleOwnersCountChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleOwnerChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const OwnersSection: React.FC<Props> = ({ formData, handleOwnersCountChange, handleOwnerChange }) => {
  return (
    <Section title="2) Propietarios">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nº propietarios</label>
          <select id="owners_count" name="owners_count" value={formData.owners_count} onChange={handleOwnersCountChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white">
              {[1,2,3,4,5,6].map(n => <option key={n}>{n}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {formData.owners.map((owner, index) => (
          <div key={owner.id} className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-3 space-y-2">
            <b className="text-slate-800">Propietario {index + 1}</b>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre y apellidos *</label>
              <input name={`nombre_${index}`} value={owner.nombre} onChange={(e) => handleOwnerChange(index, e)} required placeholder="Nombre y apellidos" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"/>
            </div>
              <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono *</label>
              <input name={`telefono_${index}`} value={owner.telefono} onChange={(e) => handleOwnerChange(index, e)} required placeholder="+34 ..." className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"/>
            </div>
              <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">DNI/NIE *</label>
              <input name={`dni_${index}`} value={owner.dni} onChange={(e) => handleOwnerChange(index, e)} required placeholder="00000000X / Y0000000Z" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"/>
            </div>
              <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email (opcional)</label>
              <input name={`email_${index}`} type="email" value={owner.email} onChange={(e) => handleOwnerChange(index, e)} placeholder="nombre@correo.com" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"/>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};
