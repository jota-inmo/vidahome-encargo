import type { FormData } from '../types';
import { logoBase64 } from '../assets';

declare const jspdf: any;
declare const QRCode: any;

let doc: any;
let y: number;
let m = 48; // margin
let fullW: number;

const checkPageBreak = (increment = 0, margin = m): number => {
    const pageHeight = doc.internal.pageSize.height;
    if (y + increment > pageHeight - margin) {
        doc.addPage();
        return margin;
    }
    return y;
};

const drawSectionTitle = (title: string) => {
    y = checkPageBreak(40);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, m, y);
    y += 20;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
};

const drawKeyValue = (key: string, value: string | undefined | null, widthPercent = 0.5) => {
    if (!value || value === '—') return;
    const keyX = m;
    const valueX = m + fullW * widthPercent;

    doc.setFont('helvetica', 'bold');
    doc.text(key, keyX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value), valueX, y);
    y += 15;
    y = checkPageBreak(0);
}

const drawWrappedText = (text: string | string[], isList = false) => {
  const lines = doc.splitTextToSize(text, fullW);
  lines.forEach((line: string, index: number) => {
    y = checkPageBreak(12);
    if (isList && index === 0) {
      doc.text("•", m, y);
      doc.text(line, m + 15, y);
    } else {
      doc.text(line, isList ? m + 15 : m, y);
    }
    if (index < lines.length - 1) {
        y += 12;
    }
  });
  y += 15;
}

export const generatePdf = (formData: FormData, isPreview = false) => {
  const { jsPDF } = jspdf;
  doc = new jsPDF({ unit: 'pt', format: 'a4' });
  fullW = doc.internal.pageSize.width - m * 2;
  y = m;

  // --- Header ---
  const companyInfo = 'Vida Home Gandia S.L. · CIF B75472027 · C/ Joan XXIII nº1 · 46730 Grau de Gandía · 960 519 214';
  const modeTitle = formData.categoria === 'A' ? 'de alquiler' : 'de venta';
  const titleText = `Encargo de gestión ${modeTitle} SIN EXCLUSIVA`;
  
  try {
    // FIX: jsPDF needs the raw Base64 string, not the full Data URI.
    // We strip the "data:image/png;base64," part.
    const rawImage = logoBase64.split(',')[1];
    doc.addImage(rawImage, 'PNG', m, y, 144, 42.5);
  } catch (e) {
    console.error("Could not add logo:", e);
    doc.setFontSize(10).setFont('helvetica', 'bold').text("Vida Home", m, y + 20);
  }
  doc.setFontSize(14).setFont('helvetica', 'bold').text(titleText, m + 160, y + 20);
  doc.setFontSize(7).setFont('helvetica', 'normal').text(companyInfo, m + 160, y + 35);
  y += 70;

  // --- 1) Datos de gestión ---
  drawSectionTitle('1) Datos de gestión');
  const getAgent = () => formData.agente === 'Otro (especificar)' ? formData.agente_otro : formData.agente;
  drawKeyValue('Referencia:', formData.ref);
  drawKeyValue('Fecha del encargo:', new Date(formData.fecha).toLocaleDateString('es-ES'));
  drawKeyValue('Agente:', getAgent());
  drawKeyValue('Modalidad:', formData.categoria === 'A' ? 'Alquiler (A)' : 'Venta');

  // --- 2) Propietarios ---
  drawSectionTitle('2) Propietarios');
  formData.owners.forEach((owner, index) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`Propietario ${index + 1}:`, m, y); y += 15;
      doc.setFont('helvetica', 'normal');
      drawKeyValue('Nombre:', owner.nombre, 0.2);
      drawKeyValue('Teléfono:', owner.telefono, 0.2);
      drawKeyValue('DNI/NIE:', owner.dni, 0.2);
      if (owner.email) drawKeyValue('Email:', owner.email, 0.2);
      y += 5;
  });

  // --- 3) Inmueble ---
  drawSectionTitle('3) Inmueble');
  drawKeyValue('Tipo:', formData.tipo_vivienda);
  drawKeyValue('Dirección:', formData.dir);
  if (formData.refcat) drawKeyValue('Ref. Catastral:', formData.refcat);
  if (formData.ubic_link) drawKeyValue('Ubicación:', formData.ubic_link);

  y += 10;
  
  const residentialTypes = ['Piso', 'Ático', 'Dúplex', 'Bajo', 'Casa/Chalet', 'Adosado', 'Unifamiliar'];
  const landTypes = ['Terreno urbano', 'Terreno rústico'];

  if (residentialTypes.includes(formData.tipo_vivienda)) {
      doc.setFont('helvetica', 'bold').text('Características - Residencial', m, y); y += 15;
      doc.setFont('helvetica', 'normal');
      drawKeyValue('Habitaciones:', formData.num_habitaciones);
      drawKeyValue('Baños:', formData.num_banos);
      drawKeyValue('Cocinas:', formData.num_cocinas);
      drawKeyValue('Ascensor:', formData.res_asc);
      drawKeyValue('Exterior/Interior:', formData.res_ext);
      drawKeyValue('Orientación:', formData.res_ori);
      drawKeyValue('Garaje:', formData.res_gar);
      drawKeyValue('Trastero:', formData.res_tras);
      if (formData.res_t1) drawKeyValue('Terraza 1 (m²):', formData.res_t1);
      if (formData.res_t2) drawKeyValue('Terraza 2 (m²):', formData.res_t2);
      if (formData.res_t3) drawKeyValue('Terraza 3 (m²):', formData.res_t3);
      if (formData.res_patio) drawKeyValue('Patio (m²):', formData.res_patio);
      if (formData.res_parcela) drawKeyValue('Parcela (m²):', formData.res_parcela);
  } else if (formData.tipo_vivienda === 'Local') {
      doc.setFont('helvetica', 'bold').text('Características - Local', m, y); y += 15;
      doc.setFont('helvetica', 'normal');
      drawKeyValue('Sup. Útil (m²):', formData.loc_m2_util);
      drawKeyValue('Sup. Const. (m²):', formData.loc_m2_const);
      drawKeyValue('Nº Baños:', formData.loc_banos);
      drawKeyValue('Fachada (m):', formData.loc_fach);
      drawKeyValue('Altura (m):', formData.loc_alt);
      drawKeyValue('Nº Plantas:', formData.loc_plantas);
      drawKeyValue('Escaparates:', formData.loc_escaparates);
      drawKeyValue('Hace Esquina:', formData.loc_esquina);
      drawKeyValue('Oficina:', formData.loc_oficina);
      drawKeyValue('Salida Humos:', formData.loc_humo);
      if (formData.loc_extras.length) drawKeyValue('Extras:', formData.loc_extras.join(', '));
  } else if (landTypes.includes(formData.tipo_vivienda)) {
      doc.setFont('helvetica', 'bold').text('Características - Terreno', m, y); y += 15;
      doc.setFont('helvetica', 'normal');
      drawKeyValue('Clasificación:', formData.ter_clas);
      drawKeyValue('Superficie (m²):', formData.ter_m2);
      drawKeyValue('Edificabilidad (%):', formData.ter_edi);
  }
  
  // --- 4) Gastos, Ocupación y Llaves ---
  drawSectionTitle('4) Gastos, Ocupación y Llaves');
  drawKeyValue('Comunidad (€/mes):', formData.com_mes);
  drawKeyValue('Derramas:', formData.com_der);
  if(formData.com_obs) drawKeyValue('Obs. Derramas:', formData.com_obs);
  drawKeyValue('IBI (€/anual):', formData.ibi_anual);
  drawKeyValue('Tasa Basuras (€):', formData.basura);
  drawKeyValue('Agua:', formData.agua_act);
  drawKeyValue('Luz:', formData.luz_act);
  y += 10;
  drawKeyValue('Ocupación:', formData.ocup);
  if(formData.ocupantes) drawKeyValue('Ocupantes:', formData.ocupantes);
  drawKeyValue('Disponemos de llaves:', formData.llaves);
  if(formData.llaves_contacto) drawKeyValue('Contacto llaves:', formData.llaves_contacto);
  if(formData.llaves_tel) drawKeyValue('Teléfono llaves:', formData.llaves_tel);
  if(formData.llaves_instr) drawKeyValue('Instrucciones:', formData.llaves_instr);

  // --- 5) Condiciones ---
  drawSectionTitle('5) Condiciones económicas y cláusulas');
  const precioLabel = formData.categoria === 'A' ? 'Alquiler mensual' : 'Precio estipulado';
  drawKeyValue(`${precioLabel}:`, `${formData.precio} €`);
  
  let honorariosDescription = '';
  if (formData.categoria === 'A') {
      honorariosDescription = 'Importe equivalente a una mensualidad + IVA.';
  } else {
      const precioNum = parseFloat(formData.precio);
      honorariosDescription = !isNaN(precioNum) && precioNum < 100000
          ? '4000€ + IVA, sin incluir impuestos/gastos del comprador (ITP, etc.).'
          : '4% + IVA sobre el precio real de venta que percibe el propietario, sin incluir impuestos/gastos del comprador (ITP, etc.).';
  }
  drawWrappedText(`Honorarios: ${honorariosDescription}`);
  
  const getDynamicClauses = (data: FormData): string[] => {
    const common = [
      "Encargo sin exclusiva: la Propiedad puede gestionar por su cuenta o con terceros la venta o alquiler, siempre que los interesados no hayan sido previamente presentados o identificados por Vida Home (por escrito). Ver cláusulas 5 y 6.",
      "Oferta en firme + depósito en agencia: toda oferta será por escrito y deberá ir acompañada de un depósito en la agencia Vida Home (efectivo o transferencia), siempre con justificante.",
      "Aceptación y arras: una vez aceptada por escrito la oferta por la Propiedad, Vida Home elaborará un borrador de contrato de arras, lo ajustará con las partes hasta su conformidad por escrito y coordinará firma e ingreso de las arras.",
      "Arras – destino del ingreso: las arras de la parte compradora se ingresarán en la cuenta del propietario si tiene cuenta en España; si no, se ingresarán en la cuenta de Vida Home para custodia temporal y posterior transferencia o aplicación según contrato de arras.",
    ];
    let specific = '';
    if (data.categoria === 'A') {
        specific = "Devengo honorarios (alquiler): si Vida Home presenta por escrito un arrendatario que acepta renta/plazo ofrecidos y la Propiedad decide no arrendar en tales términos, se devengan los honorarios pactados. Si se arrienda a ese interesado (o interpuesta) dentro de 24 meses, se devengan.";
    } else {
        const honorarios = !isNaN(parseFloat(data.precio)) && parseFloat(data.precio) < 100000 ? '4000€ + IVA' : '4% + IVA';
        specific = `Devengo honorarios (venta): si Vida Home comunica por escrito un comprador identificado que acepta el precio y la Propiedad decide no transmitir por ese importe, abonará los honorarios pactados (${honorarios}).`;
    }
    const final = [
        "Duración y rescisión: 6 meses iniciales + renovaciones tácitas de 6 meses. Resolución en cualquier momento, sin indemnización, si no existe un proceso de intermediación abierto con interesado presentado por Vida Home (oferta en firme/arras/contrato en preparación).",
        "Obligaciones de la Propiedad: confirmar titularidad y datos, colaborar en visitas y gestiones, aportar la documentación necesaria y nota simple recente (venta y alquiler). En alquiler, además, CEE antes de firmar."
    ];
    return [...common, specific, ...final];
  }

  getDynamicClauses(formData).forEach(clause => drawWrappedText(clause, true));

  // --- 6) Observaciones ---
  drawSectionTitle('6) Observaciones y extras');
  if(formData.vistas.length) drawKeyValue('Vistas:', formData.vistas.join(', '));
  if(formData.servicios.length) drawKeyValue('Zonas/servicios:', formData.servicios.join(', '));
  if(formData.obs_otro) drawWrappedText(formData.obs_otro);

  // --- Signatures ---
  y = checkPageBreak(80);
  const sigBoxWidth = fullW / 2 - 20;
  doc.rect(m, y, sigBoxWidth, 60);
  doc.text('Firma del Propietario/s', m + 10, y + 15);
  doc.rect(m + fullW / 2 + 20, y, sigBoxWidth, 60);
  doc.text('Firma del Agente (Vida Home)', m + fullW / 2 + 30, y + 15);

  // --- QR Code ---
  if(formData.ubic_link) {
    const qrEl = document.getElementById('qr_hidden');
    if (qrEl) {
        qrEl.innerHTML = '';
        new QRCode(qrEl, {
            text: formData.ubic_link,
            width: 60,
            height: 60,
        });
        const qrCanvas = qrEl.querySelector('canvas');
        if (qrCanvas) {
            const qrImg = qrCanvas.toDataURL('image/png');
            doc.addImage(qrImg, 'PNG', doc.internal.pageSize.width - m - 60, doc.internal.pageSize.height - m - 60, 60, 60);
        }
    }
  }

  if (isPreview) {
    doc.output('dataurlnewwindow');
  } else {
    doc.save(`encargo_${formData.ref || 'sin-ref'}.pdf`);
  }
};