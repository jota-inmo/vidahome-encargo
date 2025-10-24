
import type { FormData } from '../types';

declare const jspdf: any;
declare const QRCode: any;

const getBase64FromUrl = (url: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    } catch (error) {
      reject(error);
    }
  });
};

export const generatePdf = async (formData: FormData, isPreview = false) => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const m = 48, fullW = 595 - m * 2;
  let y = m;

  const getAgent = () => {
    if (formData.agente === 'Otro (especificar)') return formData.agente_otro || '(indicar)';
    return formData.agente || '(sin agente)';
  };
  
  // Header
  const logoUrl = "https://raw.githubusercontent.com/jota-inmo/vidahome-encargo/main/logo.png";
  const companyInfo = 'Vida Home Gandia S.L. · CIF B75472027 · C/ Joan XXIII nº1 · 46730 Grau de Gandía · 960 519 214';
  const modeTitle = formData.categoria === 'A' ? 'de alquiler' : 'de venta';
  const titleText = `Encargo de gestión ${modeTitle} SIN EXCLUSIVA`;

  // --- Header ---
  try {
    const logoBase64 = await getBase64FromUrl(logoUrl);
    doc.addImage(logoBase64, 'PNG', m, y, 144, 42.5);
  } catch(e) {
    console.error("Error adding logo image:", e);
    // Continue without logo if it fails
  }
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(titleText, m + 160, y + 20);
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(companyInfo, m + 160, y + 35);

  y += 80;
  
  // --- Form data ---
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('1) Datos de gestión', m, y);
  y += 20;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Referencia: ${formData.ref}`, m, y);
  doc.text(`Fecha del encargo: ${new Date(formData.fecha).toLocaleDateString('es-ES')}`, m + fullW / 2, y);
  y += 15;
  doc.text(`Agente: ${getAgent()}`, m, y);
  doc.text(`Modalidad: ${formData.categoria === 'A' ? 'Alquiler (A)' : 'Venta'}`, m + fullW / 2, y);
  y += 25;
  
  // --- More sections can be added here following the same pattern ---
  // Example: doc.text('2) Propietarios', m, y); etc.
  
  if (isPreview) {
    doc.output('dataurlnewwindow');
  } else {
    doc.save(`encargo_${formData.ref || 'sin-ref'}.pdf`);
  }
};
