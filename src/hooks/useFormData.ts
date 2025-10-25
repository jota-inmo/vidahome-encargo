
import { useState, useEffect, useCallback, useMemo, ChangeEvent } from 'react';
import type { FormData, Owner, FormFieldChangeEvent } from '../types/encargo.types';
import { initialFormData, initialOwner } from '../constants/formData';
import { getRequiredFields } from '../utils/validators';
import { debounce } from '../utils/debounce';

export const useFormData = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [saveStatus, setSaveStatus] = useState('Guardado automático activo');

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
        try {
            const parsedData: FormData = JSON.parse(savedData);
            setFormData(parsedData);
        } catch (error) {
            console.error("Error al parsear el borrador guardado:", error);
            localStorage.removeItem('vidahome_borrador');
        }
      } else {
        localStorage.removeItem('vidahome_borrador');
      }
    }
  }, []);

  const handleChange = (e: FormFieldChangeEvent) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        const [fieldName, fieldValue] = name.split('-');

        setFormData(prev => {
            const currentValues = prev[fieldName as keyof FormData] as string[];
            const newValues = checked
                ? [...currentValues, fieldValue]
                : currentValues.filter(v => v !== fieldValue);
            return { ...prev, [fieldName]: newValues };
        });
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleOwnersCountChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value, 10);
    setFormData(prev => {
      const newOwners = [...prev.owners];
      while (newOwners.length < count) {
        newOwners.push({ ...initialOwner, id: Date.now() + newOwners.length });
      }
      return { ...prev, owners_count: e.target.value, owners: newOwners.slice(0, count) };
    });
  };

  const handleOwnerChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name.split('_')[0] as keyof Owner;
    setFormData(prev => {
      const newOwners = [...prev.owners];
      newOwners[index] = { ...newOwners[index], [fieldName]: value };
      return { ...prev, owners: newOwners };
    });
  };

  const allRequiredFields = useMemo(() => getRequiredFields(formData), [formData]);

  const { progress, pendingFields } = useMemo(() => {
    let filledCount = 0;
    allRequiredFields.forEach(fieldKey => {
        if (String(fieldKey).startsWith('owners')) {
            const match = String(fieldKey).match(/owners\[(\d+)]\.(\w+)/);
            if (match) {
                const index = parseInt(match[1], 10);
                const key = match[2] as keyof Owner;
                if (formData.owners[index]?.[key] && String(formData.owners[index][key]).trim() !== '') {
                    filledCount++;
                }
            }
        } else {
            if (formData[fieldKey as keyof FormData] && String(formData[fieldKey as keyof FormData]).trim() !== '') {
                filledCount++;
            }
        }
    });

    const total = allRequiredFields.length;
    const progress = total > 0 ? Math.round((filledCount / total) * 100) : 0;
    const pending = total - filledCount;
    return { progress, pendingFields: pending };
  }, [formData, allRequiredFields]);

  return {
    formData,
    setFormData,
    handleChange,
    handleOwnersCountChange,
    handleOwnerChange,
    progress,
    pendingFields,
    saveStatus,
  };
};
