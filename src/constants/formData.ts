
import type { FormData, Owner } from '../types/encargo.types';

export const initialOwner: Owner = { id: 1, nombre: '', telefono: '', dni: '', email: '' };

const getInitialDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

export const initialFormData: FormData = {
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
  loc_m2_util: '',
  loc_m2_const: '',
  loc_banos: '',
  loc_plantas: '',
  loc_escaparates: '',
  loc_esquina: '—',
  loc_oficina: '—',
  loc_extras: [],
  gar_capacidad: '—',
  gar_m2: '',
  gar_extras: [],
  tras_m2_util: '',
  tras_m2_const: '',
  tras_extras: [],
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
