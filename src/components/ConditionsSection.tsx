
import React, { useMemo } from 'react';
import { Section } from './Section';
import type { FormData, FormFieldChangeEvent } from '../types/encargo.types';

interface Props {
  formData: FormData;
  handleChange: (e: FormFieldChangeEvent) => void;
}

const ClauseList: React.FC<{categoria: 'normal' | 'A', precio: string}> = ({ categoria, precio}) => {
    const devengoHonorariosVentaText = useMemo(() => {
        const precioNum = parseFloat(precio);
        const honorarios = !isNaN(precioNum) && precioNum < 100000 ? '4000€ + IVA' : '4% + IVA';
        return `si Vida Home comunica por escrito un comprador identificado que acepta el precio y la Propiedad decide no transmitir por ese importe, abonará los honorarios pactados (${honorarios}).`;
    }, [precio]);

    return (
         <ul className="list-none space-y-2">
            <li><b className="font-semibold">- Encargo sin exclusiva:</b> la Propiedad puede gestionar por su cuenta o con terceros la venta o alquiler, siempre que los interesados no hayan sido previamente presentados o identificados por Vida Home (por escrito). Ver cláusulas 5 y 6.</li>
            <li><b className="font-semibold">- Oferta en firme + depósito en agencia:</b> toda oferta será por escrito y deberá ir acompañada de un depósito en la agencia Vida Home (efectivo o transferencia), siempre con justificante.</li>
            <li><b className="font-semibold">- Aceptación y arras:</b> una vez aceptada por escrito la oferta por la Propiedad, Vida Home elaborará un borrador de contrato de arras, lo ajustará con las partes hasta su conformidad por escrito y coordinará firma e ingreso de las arras.</li>
            <li><b className="font-semibold">- Arras – destino del ingreso:</b> las arras de la parte compradora se ingresarán en la cuenta del propietario si tiene cuenta en España; si no, se ingresarán en la cuenta de Vida Home para custodia temporal y posterior transferencia o aplicación según contrato de arras.</li>
            {categoria === 'A' ? (
                <li><b className="font-semibold">- Devengo honorarios (alquiler):</b> si Vida Home presenta por escrito un arrendatario que acepta renta/plazo ofrecidos y la Propiedad decide no arrendar en tales términos, se devengan los honorarios pactados. Si se arrienda a ese interesado (o interposta) dentro de 24 meses, se devengan.</li>
            ) : (
                <li><b className="font-semibold">- Devengo honorarios (venta):</b> {devengoHonorariosVentaText}</li>
            )}
            <li><b className="font-semibold">- Duración y rescisión:</b> 6 meses iniciales + renovaciones tácitas de 6 meses. Resolución en cualquier momento, sin indemnización, si no existe un proceso de intermediación abierto con interesado presentado por Vida Home (oferta en firme/arras/contrato en preparación).</li>
            <li><b className="font-semibold">- Obligaciones de la Propiedad:</b> confirmar titularidad y datos, colaborar en visitas y gestiones, aportar la documentación necesaria y nota simple reciente (venta y alquiler). En alquiler, además, CEE antes de firmar.</li>
        </ul>
    );
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
          <ClauseList categoria={formData.categoria} precio={formData.precio} />
      </div>
    </Section>
  );
};
