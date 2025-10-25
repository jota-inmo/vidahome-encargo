
import React, { useState } from 'react';
import { useFormData } from './hooks/useFormData';
import { generatePdf } from './services/pdfGenerator';
import { validateForm } from './utils/validators';

import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { GestionSection } from './components/GestionSection';
import { OwnersSection } from './components/OwnersSection';
import { PropertyDetailsSection } from './components/PropertyDetailsSection';
import { ExpensesSection } from './components/ExpensesSection';
import { ConditionsSection } from './components/ConditionsSection';
import { ObservationsSection } from './components/ObservationsSection';
import { ActionButtons } from './components/ActionButtons';

const App: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { 
    formData, 
    handleChange, 
    handleOwnerChange, 
    handleOwnersCountChange, 
    progress, 
    pendingFields, 
    saveStatus 
  } = useFormData();

  const handleGeneratePdf = async (isPreview = false) => {
    if (!isPreview) {
      const { isValid, message } = validateForm(formData);
      if (!isValid) {
        alert(message);
        return;
      }
    }
    
    setIsGenerating(true);
    try {
        await generatePdf(formData, isPreview);
    } catch(e) {
        console.error("Error generating PDF:", e);
        alert("Ocurrió un error al generar el PDF. Revisa la consola para más detalles.");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <ProgressBar progress={progress} pendingFields={pendingFields} saveStatus={saveStatus} />
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
          <Header categoria={formData.categoria} />
          
          <GestionSection formData={formData} handleChange={handleChange} />
          <OwnersSection formData={formData} handleOwnerChange={handleOwnerChange} handleOwnersCountChange={handleOwnersCountChange} />
          <PropertyDetailsSection formData={formData} handleChange={handleChange} />
          <ExpensesSection formData={formData} handleChange={handleChange} />
          <ConditionsSection formData={formData} handleChange={handleChange} />
          <ObservationsSection formData={formData} handleChange={handleChange} />

          <ActionButtons isGenerating={isGenerating} onGenerate={handleGeneratePdf} />
        </div>
      </div>
    </div>
  );
};

export default App;
