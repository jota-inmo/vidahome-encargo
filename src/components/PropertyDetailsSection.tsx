
import React from 'react';
import { Section } from './Section';
import type { FormData, FormFieldChangeEvent } from '../types/encargo.types';
import { RESIDENTIAL_TYPES, LAND_TYPES, ALL_PROPERTY_TYPES, PARCELA_TYPES } from '../constants/propertyTypes';

interface Props {
  formData: FormData;
  handleChange: (e: FormFieldChangeEvent) => void;
}

export const PropertyDetailsSection: React.FC<Props> = ({ formData, handleChange }) => {
  const showsParcela = PARCELA_TYPES.includes(formData.tipo_vivienda);

  return (
    <Section title="3) Inmueble">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo *</label>
                <select id="tipo_vivienda" name="tipo_vivienda" value={formData.tipo_vivienda} onChange={handleChange} required className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white">
                    {ALL_PROPERTY_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <label className="block text-sm font-medium text-slate-700 mt-2 mb-1">Ref. catastral (opcional)</label>
                <input id="refcat" name="refcat" value={formData.refcat} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Dirección *</label>
                <input id="dir" name="dir" value={formData.dir} onChange={handleChange} required placeholder="Calle, nº, piso/puerta, CP, municipio, provincia" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" />
                <label className="block text-sm font-medium text-slate-700 mt-2 mb-1">Enlace de ubicación (Maps/WhatsApp)</label>
                <input id="ubic_link" name="ubic_link" value={formData.ubic_link} onChange={handleChange} placeholder="Pega aquí el link de ubicación" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" />
            </div>
        </div>
        {RESIDENTIAL_TYPES.includes(formData.tipo_vivienda) && (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-3 mt-4">
                <b className="text-slate-800">Características - Residencial</b>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {/* Campos Residencial */}
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Nº Habitaciones</label><input type="number" name="num_habitaciones" value={formData.num_habitaciones} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Nº Baños</label><input type="number" step="0.5" name="num_banos" value={formData.num_banos} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Nº Cocinas</label><input type="number" name="num_cocinas" value={formData.num_cocinas} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Ascensor</label><select name="res_asc" value={formData.res_asc} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"><option>—</option><option>Sí</option><option>No</option></select></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Exterior/Interior</label><select name="res_ext" value={formData.res_ext} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"><option>—</option><option>Exterior</option><option>Interior</option></select></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Orientación</label><select name="res_ori" value={formData.res_ori} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"><option>—</option><option>N</option><option>S</option><option>E</option><option>O</option><option>NE</option><option>NO</option><option>SE</option><option>SO</option></select></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Garaje</label><select name="res_gar" value={formData.res_gar} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"><option>—</option><option>Incluido</option><option>Opcional</option><option>No</option></select></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Trastero</label><select name="res_tras" value={formData.res_tras} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"><option>—</option><option>Sí</option><option>No</option></select></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Terraza 1 (m²)</label><input type="number" step="0.1" name="res_t1" value={formData.res_t1} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Terraza 2 (m²)</label><input type="number" step="0.1" name="res_t2" value={formData.res_t2} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Terraza 3 (m²)</label><input type="number" step="0.1" name="res_t3" value={formData.res_t3} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Patio interior (m²)</label><input type="number" step="0.1" name="res_patio" value={formData.res_patio} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" /></div>
                    {showsParcela && (<div><label className="block text-sm font-medium text-slate-700 mb-1">Parcela (m²)</label><input type="number" name="res_parcela" value={formData.res_parcela} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" /></div>)}
                </div>
            </div>
        )}
        {/* ... (render other property type forms similarly) ... */}
    </Section>
  );
};
