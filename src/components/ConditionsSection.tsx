
import React, { useMemo } from 'react';
import { Section } from './Section';
import type { FormData, FormFieldChangeEvent } from '../types/encargo.types';

interface Props {
  formData: FormData;
  handleChange: (e: FormFieldChangeEvent) => void;
}

export const ConditionsSection: React.FC<Props> = ({ formData, handleChange }) => {
    const honorariosText = useMemo(() => {
        if (formData.categoria === 'A') {
          return 'importe equivalente a una mensualidad + IVA.';
        }
        const precioNum = parseFloat(formData.precio);
        if (!isNaN(precioNum) && precioNum < 100000) {
          return '4000€ + IVA, sin incluir impuestos/gastos del comprador (ITP, etc.).';
        }
        return '4% + IVA sobre el precio real de venta que percibe el propietario, sin incluir impuestos/gastos del comprador (ITP, etc.).';
    }, [formData.categoria, formData.precio]);

    const devengoHonorariosVentaText = useMemo(() => {
        const precioNum = parseFloat(formData.precio);
        const honorarios = !isNaN(precioNum) && precioNum < 100000 ? '4000€ + IVA' : '4% + IVA';
        return `si Vida Home comunica por escrito un comprador identificado que acepta el precio y la Propiedad decide no transmitir por ese importe, abonará los honorarios pactados (${honorarios}).`;
    }, [formData.precio]);

  return (
    <Section title="5) Condiciones económicas y cláusulas">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{formData.categoria === 'A' ? 'Alquiler mensual (€) *' : 'Precio estipulado (€) *'}</label>
            <input id="precio" name="precio" type="number" value={formData.precio} onChange={handleChange} required className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" />
          </div>
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-3 text-sm text-slate-600">
            <p>
                <b className="text-slate-800 font-semibold">Honorarios:</b>
                {' '}{honorariosText}
            </p>
          </div>
        </div>
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-3 text-sm text-slate-600 h-full">
          <b className="text-slate-800 font-semibold">Protección de datos (RGPD)</b><br />
          De conformidad con RGPD y LOPDGDD, Vida Home tratará los datos para gestionar este encargo, con base en la ejecución del contrato y obligaciones legales. Conservación por plazos legales. Cesiones a notaría/registro/AA.PP. cuando proceda. Derechos a disposición del interesado a través del canal de contacto de Vida Home.
        </div>
      </div>
       <div className="mt-4 text-sm text-slate-600">
          <ul className="list-none space-y-2">
              {/* Clauses */}
          </ul>
      </div>
    </Section>
  );
};
