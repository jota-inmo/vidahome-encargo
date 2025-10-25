
import type { FormData, Owner } from '../types/encargo.types';

const BASE_REQUIRED_FIELDS: (keyof FormData)[] = ['ref', 'fecha', 'agente', 'tipo_vivienda', 'dir', 'precio'];

export const getRequiredFields = (formData: FormData): (string | keyof FormData)[] => {
    const fields: (string | keyof FormData)[] = [...BASE_REQUIRED_FIELDS];
    if (formData.agente === 'Otro (especificar)') {
      fields.push('agente_otro');
    }
    const ownerCount = parseInt(formData.owners_count, 10);
    for (let i = 0; i < ownerCount; i++) {
        fields.push(`owners[${i}].nombre`, `owners[${i}].telefono`, `owners[${i}].dni`);
    }
    return fields;
};

export const validateForm = (formData: FormData): { isValid: boolean; message: string } => {
    const requiredFields = getRequiredFields(formData);
    for (const fieldKey of requiredFields) {
        if (String(fieldKey).startsWith('owners')) {
            const match = String(fieldKey).match(/owners\[(\d+)]\.(\w+)/);
            if (match) {
                const index = parseInt(match[1], 10);
                const key = match[2] as keyof Owner;
                if (!formData.owners[index] || !formData.owners[index][key] || String(formData.owners[index][key]).trim() === '') {
                    return { isValid: false, message: `Propietario ${index + 1}: Falta el campo '${key}'` };
                }
            }
        } else {
            if (!formData[fieldKey as keyof FormData] || String(formData[fieldKey as keyof FormData]).trim() === '') {
                return { isValid: false, message: `Falta el campo requerido: '${String(fieldKey)}'` };
            }
        }
    }
    return { isValid: true, message: '' };
};
