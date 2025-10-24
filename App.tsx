
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { FormData, Owner, ValidationStatus } from './types';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { Section } from './components/Section';
import { generatePdf } from './services/pdfService';
import { debounce } from './utils/debounce';

const initialOwner: Owner = { id: 1, nombre: '', telefono: '', dni: '', email: '' };

const getInitialDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const initialFormData: FormData = {
  ref: '',
  fecha: getInitialDate(),
  agente: '',
  agente_otro: '',
  categoria: 'normal',
  owners_count: '1',
  owners: [initialOwner],
  tipo_vivienda: '',
  refcat: '',
  dir: '',
  ubic_link: '',
  num_habitaciones: '',
  num_banos: '',
  num_cocinas: '',
  res_asc: '—',
  res_ext: '—',
  res_ori: '—',
  res_gar: '—',
  res_tras: '—',
  res_t1: '',
  res_t2: '',
  res_t3: '',
  res_patio: '',
  res_parcela: '',
  ter_clas: '—',
  ter_m2: '',
  ter_edi: '',
  loc_fach: '',
  loc_alt: '',
  loc_humo: '—',
  com_mes: '',
  com_der: '—',
  com_obs: '',
  ibi_anual: '',
  basura: '',
  agua_act: '—',
  luz_act: '—',
  ocup: 'Libre',
  ocupantes: '',
  llaves: 'No',
  llaves_contacto: '',
  llaves_tel: '',
  llaves_instr: '',
  precio: '',
  vistas: [],
  servicios: [],
  obs_otro: '',
};

const requiredFields: (keyof FormData)[] = ['ref', 'fecha', 'agente', 'tipo_vivienda', 'dir', 'precio'];

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>({});
  const [progress, setProgress] = useState(0);
  const [pendingFields, setPendingFields] = useState(requiredFields.length);
  const [saveStatus, setSaveStatus] = useState('Guardado automático activo');

  const residentialTypes = ['Piso', 'Ático', 'Dúplex', 'Bajo', 'Casa/Chalet', 'Adosado', 'Unifamiliar'];
  const localTypes = ['Local', 'Garaje', 'Trastero'];
  const landTypes = ['Terreno urbano', 'Terreno rústico'];
  const showsParcela = ['Casa/Chalet', 'Adosado', 'Unifamiliar'].includes(formData.tipo_vivienda);

  const debouncedSave = useCallback(
    debounce((data: FormData) => {
      localStorage.setItem('vidahome_borrador', JSON.stringify(data));
      const now = new Date();
      setSaveStatus(`💾 Guardado ${now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`);
    }, 1000),
    []
  );

  useEffect(() => {
    debouncedSave(formData);
  }, [formData, debouncedSave]);

  useEffect(() => {
    const savedData = localStorage.getItem('vidahome_borrador');
    if (savedData) {
      if (window.confirm('Se encontró un borrador guardado. ¿Deseas recuperarlo?')) {
        const parsedData: FormData = JSON.parse(savedData);
        setFormData(parsedData);
      } else {
        localStorage.removeItem('vidahome_borrador');
      }
    }
  }, []);

  const allRequiredFields = useMemo(() => {
    const fields = [...requiredFields];
    if (formData.agente === 'Otro (especificar)') {
      fields.push('agente_otro');
    }
    const ownerCount = parseInt(formData.owners_count, 10);
    for (let i = 0; i < ownerCount; i++) {
        fields.push(`owners[${i}].nombre` as any, `owners[${i}].telefono` as any, `owners[${i}].dni` as any);
    }
    return fields;
  }, [formData.agente, formData.owners_count]);

  useEffect(() => {
    let filledCount = 0;
    allRequiredFields.forEach(fieldKey => {
        if (String(fieldKey).startsWith('owners')) {
            const match = String(fieldKey).match(/owners\[(\d+)]\.(\w+)/);
            if (match) {
                const index = parseInt(match[1], 10);
                const key = match[2] as keyof Owner;
                if (formData.owners[index] && formData.owners[index][key]) {
                    filledCount++;
                }
            }
        } else {
            if (formData[fieldKey as keyof FormData]) {
                filledCount++;
            }
        }
    });

    const total = allRequiredFields.length;
    setProgress(total > 0 ? Math.round((filledCount / total) * 100) : 0);
    setPendingFields(total - filledCount);
  }, [formData, allRequiredFields]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        const [fieldName, fieldValue] = name.split('-');

        setFormData(prev => {
            const currentValues = prev[fieldName as 'vistas' | 'servicios'] as string[];
            const newValues = checked
                ? [...currentValues, fieldValue]
                : currentValues.filter(v => v !== fieldValue);
            return { ...prev, [fieldName]: newValues };
        });
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleOwnersCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value, 10);
    setFormData(prev => {
      const newOwners = [...prev.owners];
      while (newOwners.length < count) {
        newOwners.push({ ...initialOwner, id: Date.now() + newOwners.length });
      }
      return { ...prev, owners_count: e.target.value, owners: newOwners.slice(0, count) };
    });
  };

  const handleOwnerChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name.split('_')[1] as keyof Owner;
    setFormData(prev => {
      const newOwners = [...prev.owners];
      newOwners[index] = { ...newOwners[index], [fieldName]: value };
      return { ...prev, owners: newOwners };
    });
  };
  
  const validateAndGenerate = (isPreview = false) => {
    let isValid = true;
    let alertMessage = '';

    allRequiredFields.forEach(fieldKey => {
      if (String(fieldKey).startsWith('owners')) {
        const match = String(fieldKey).match(/owners\[(\d+)]\.(\w+)/);
        if (match) {
          const index = parseInt(match[1], 10);
          const key = match[2] as keyof Owner;
          if (!formData.owners[index] || !formData.owners[index][key]) {
            isValid = false;
            if (!alertMessage) alertMessage = `Propietario ${index+1}: Falta ${key}`;
          }
        }
      } else {
        if (!formData[fieldKey as keyof FormData]) {
          isValid = false;
          // FIX: Explicitly convert fieldKey to a string to avoid potential runtime errors
          // when using it in a template literal, as it could be a symbol.
          if (!alertMessage) alertMessage = `Falta campo requerido: ${String(fieldKey)}`;
        }
      }
    });

    if (!isValid) {
      alert(alertMessage);
      return;
    }

    try {
        generatePdf(formData, isPreview);
    } catch(e) {
        console.error("Error generating PDF:", e);
        alert("Ocurrió un error al generar el PDF. Revisa la consola para más detalles.");
    }
  };
  
  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <ProgressBar progress={progress} pendingFields={pendingFields} saveStatus={saveStatus} />
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
          <Header categoria={formData.categoria} />

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
          
          <Section title="3) Inmueble">
             {/* Property details form elements go here */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tipo *</label>
                    <select id="tipo_vivienda" name="tipo_vivienda" value={formData.tipo_vivienda} onChange={handleChange} required className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white">
                        <option value="">— Selecciona —</option>
                        <option>Piso</option><option>Ático</option><option>Dúplex</option><option>Bajo</option>
                        <option>Casa/Chalet</option><option>Adosado</option><option>Unifamiliar</option>
                        <option>Local</option><option>Garaje</option><option>Trastero</option>
                        <option>Terreno urbano</option><option>Terreno rústico</option>
                        <option>Edificio</option><option>Hotel</option><option>Otro</option>
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
             {residentialTypes.includes(formData.tipo_vivienda) && (
                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-3 mt-4">
                    <b className="text-slate-800">Características - Residencial</b>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                        {/* Fields like rooms, bathrooms, etc. */}
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
          </Section>

          <Section title="5) Condiciones económicas y cláusulas">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{formData.categoria === 'A' ? 'Alquiler mensual (€) *' : 'Precio estipulado (€) *'}</label>
                    <input id="precio" name="precio" type="number" value={formData.precio} onChange={handleChange} required className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" />
                    <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-3 mt-2 text-sm text-slate-600">
                        Honorarios: 4% + IVA sobre el precio real de venta que percibe el propietario, sin incluir impuestos/gastos del comprador (ITP, etc.).
                    </div>
                 </div>
                 <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-3 text-sm text-slate-600">
                    <b className="text-slate-800">Protección de datos (RGPD)</b><br />
                    De conformidad con RGPD y LOPDGDD, Vida Home tratará los datos para gestionar este encargo...
                 </div>
             </div>
          </Section>

          <Section title="6) Observaciones y extras">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Vistas</label>
                    <div className="flex flex-wrap gap-2">
                        {['Mar', 'Montaña', 'Ambas', 'Ninguna'].map(vista => (
                             <label key={vista} className="flex items-center gap-2 border border-slate-300 rounded-full px-3 py-1.5 bg-white text-sm font-semibold cursor-pointer has-[:checked]:bg-sky-100 has-[:checked]:border-sky-400 transition-colors">
                                <input type="checkbox" name="vistas" value={vista} checked={formData.vistas.includes(vista)} onChange={(e) => handleChange({ target: { name: 'vistas-' + vista, value: vista, type: 'checkbox', checked: e.target.checked } } as any)} className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"/>
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
                                <input type="checkbox" name="servicios" value={srv} checked={formData.servicios.includes(srv)} onChange={(e) => handleChange({ target: { name: 'servicios-' + srv, value: srv, type: 'checkbox', checked: e.target.checked } } as any)} className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"/>
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

          <div className="flex justify-between items-center gap-4 p-4 border-t border-slate-200 bg-slate-50">
            <span className="text-xs text-green-800">v39c · React/Tailwind Edition</span>
            <div className="flex gap-2">
              <button onClick={() => validateAndGenerate(true)} className="bg-white border border-slate-300 text-slate-800 px-4 py-2.5 rounded-lg font-bold hover:bg-slate-100 transition-colors">
                Previsualizar
              </button>
              <button onClick={() => validateAndGenerate(false)} className="bg-slate-800 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-slate-900 transition-colors">
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
