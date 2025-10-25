
// FIX: Import `ChangeEvent` from `react` to resolve namespace error.
import type { ChangeEvent } from 'react';

export interface Owner {
  id: number;
  nombre: string;
  telefono: string;
  dni: string;
  email: string;
}

export interface FormData {
  ref: string;
  fecha: string;
  agente: string;
  agente_otro: string;
  categoria: 'normal' | 'A';
  owners_count: string;
  owners: Owner[];
  
  tipo_vivienda: string;
  refcat: string;
  dir: string;
  ubic_link: string;

  // Residential
  num_habitaciones: string;
  num_banos: string;
  num_cocinas: string;
  res_asc: string;
  res_ext: string;
  res_ori: string;
  res_gar: string;
  res_tras: string;
  res_t1: string;
  res_t2: string;
  res_t3: string;
  res_patio: string;
  res_parcela: string;

  // Land
  ter_clas: string;
  ter_m2: string;
  ter_edi: string;

  // Local
  loc_fach: string;
  loc_alt: string;
  loc_humo: string;
  loc_m2_util: string;
  loc_m2_const: string;
  loc_banos: string;
  loc_plantas: string;
  loc_escaparates: string;
  loc_esquina: string;
  loc_oficina: string;
  loc_extras: string[];

  // Garage
  gar_capacidad: string;
  gar_m2: string;
  gar_extras: string[];
  
  // Trastero
  tras_m2_util: string;
  tras_m2_const: string;
  tras_extras: string[];

  // Expenses
  com_mes: string;
  com_der: string;
  com_obs: string;
  ibi_anual: string;
  basura: string;
  agua_act: string;
  luz_act: string;

  // Occupancy & Keys
  ocup: string;
  ocupantes: string;
  llaves: string;
  llaves_contacto: string;
  llaves_tel: string;
  llaves_instr: string;

  // Economic
  precio: string;

  // Observations
  vistas: string[];
  servicios: string[];
  obs_otro: string;
}

// FIX: Use `ChangeEvent` type instead of `React.ChangeEvent`.
export type FormFieldChangeEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
