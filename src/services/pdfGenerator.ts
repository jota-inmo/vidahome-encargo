
import type { FormData, Owner } from '../types/encargo.types';

declare const jspdf: any;
declare const QRCode: any;

const logoBase64 = "data:image/png;base64,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";


export const generatePdf = async (formData: FormData, isPreview = false) => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const m = 40; // margin
  const fullW = doc.internal.pageSize.width - m * 2;
  let y = m;

  const checkPageBreak = (increment = 0) => {
    if (y + increment > doc.internal.pageSize.height - m) {
        doc.addPage();
        y = m;
        // Optionally re-draw header on new pages if needed
    }
  };
  
  const drawHeaderAndFooter = () => {
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        // Header
        doc.addImage(logoBase64, 'PNG', m, m - 10, 100, 34);
        doc.setFont('helvetica', 'bold').setFontSize(14).setTextColor(15, 23, 42);
        const refText = `REF: ${formData.ref || '______'}`;
        const refWidth = doc.getTextWidth(refText);
        doc.text(refText, doc.internal.pageSize.width - m - refWidth, m + 8);
        
        // Footer
        doc.setFont('helvetica', 'normal').setFontSize(8).setTextColor(100, 116, 139);
        const footerText = `Vida Home Gandia S.L. · CIF B75472027 · Página ${i} de ${pageCount}`;
        const footerWidth = doc.getTextWidth(footerText);
        doc.text(footerText, (doc.internal.pageSize.width - footerWidth) / 2, doc.internal.pageSize.height - 20);
    }
    doc.setPage(1); // Return to the first page to continue drawing
  };

  const drawTitle = () => {
    y = m + 40;
    doc.setFont('helvetica', 'bold').setFontSize(16).setTextColor(15, 23, 42);
    const title = formData.categoria === 'A' ? 'Encargo de gestión de alquiler SIN EXCLUSIVA' : 'Encargo de gestión de venta SIN EXCLUSIVA';
    doc.text(title, m, y);
    y += 20;
    doc.setLineWidth(0.5).line(m, y, doc.internal.pageSize.width - m, y);
    y += 25;
  };

  const drawSectionTitle = (title: string) => {
    checkPageBreak(40);
    doc.setFontSize(12).setFont('helvetica', 'bold').setTextColor(15, 23, 42);
    doc.text(title, m, y);
    y += 22;
  };

  const drawKeyValue = (key: string, value: string | undefined | null, options: { width?: number, isFull?: boolean } = {}) => {
    if (!value || value === '—') return;
    const keyWidth = 100;
    const valWidth = options.isFull ? fullW - keyWidth : (options.width || fullW / 2) - keyWidth;
    checkPageBreak(15);
    const lines = doc.splitTextToSize(String(value), valWidth);
    doc.setFont('helvetica', 'bold').setFontSize(9).setTextColor(51, 65, 85);
    doc.text(key, m, y);
    doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(15, 23, 42);
    doc.text(lines, m + keyWidth, y);
    const increment = lines.length * 11 + 4;
    y += increment;
    return increment;
  };

  const drawTwoCols = (k1: string, v1: string, k2: string, v2: string) => {
      const startY = y;
      const h1 = drawKeyValue(k1,v1);
      y = startY;
      doc.text(k2, m + fullW/2, y, {isFull: false});
      const h2 = drawKeyValue(k2,v2);
      y = startY + Math.max(h1,h2);
  }

  const drawWrappedText = (text: string, options: { isListItem?: boolean } = {}) => {
    checkPageBreak(20);
    const indent = options.isListItem ? 15 : 0;
    const lines = doc.splitTextToSize(text, fullW - indent);
    doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(51, 65, 85);
    if (options.isListItem) doc.text("•", m, y, {charSpace: 2});
    doc.text(lines, m + indent, y, { lineHeightFactor: 1.5 });
    y += lines.length * 9 * 1.5 + 4;
  };


  // --- START DOCUMENT ---
  drawTitle();

  // 1. GESTIÓN
  drawSectionTitle('1. Datos de gestión');
  const agent = formData.agente === 'Otro (especificar)' ? formData.agente_otro : formData.agente;
  drawKeyValue('Fecha:', new Date(formData.fecha).toLocaleDateString('es-ES'));
  drawKeyValue('Agente:', agent);
  y += 15;

  // 2. PROPIETARIOS
  drawSectionTitle('2. Propietarios');
  formData.owners.forEach((owner, i) => {
      checkPageBreak(60);
      doc.setFont('helvetica', 'bold').setFontSize(9).text(`Propietario ${i + 1}:`, m, y); y+=4;
      drawKeyValue('Nombre:', owner.nombre);
      drawKeyValue('Teléfono:', owner.telefono);
      drawKeyValue('DNI/NIE:', owner.dni);
      drawKeyValue('Email:', owner.email);
      y += 5;
  });
  y += 15;

  // 3. INMUEBLE
  drawSectionTitle('3. Inmueble');
  drawKeyValue('Tipo:', formData.tipo_vivienda);
  drawKeyValue('Dirección:', formData.dir, {isFull:true});
  drawKeyValue('Ref. Catastral:', formData.refcat);
  
  if (formData.ubic_link) {
    const qrEl = document.getElementById('qr_hidden');
    if (qrEl) {
        qrEl.innerHTML = '';
        new QRCode(qrEl, { text: formData.ubic_link, width: 70, height: 70, correctLevel: QRCode.CorrectLevel.M });
        const qrCanvas = qrEl.querySelector('canvas');
        if (qrCanvas) {
            checkPageBreak(100);
            y += 5;
            doc.addImage(qrCanvas.toDataURL('image/png'), 'PNG', m, y, 70, 70);
            y += 85;
        }
    }
  }
  y += 15;
  
  // FINALLY
  drawHeaderAndFooter();
  
  if (isPreview) {
    doc.output('dataurlnewwindow', {filename: `encargo_preview_${formData.ref || 'sin-ref'}.pdf`});
  } else {
    doc.save(`Encargo_VidaHome_${(formData.ref || 'encargo').replace(/\s+/g,'_')}.pdf`);
  }
};
