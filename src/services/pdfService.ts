import type { FormData } from '../types';
import { logoUrl } from '../assets';

declare const jspdf: any;
declare const QRCode: any;

const getBase64ImageFromUrl = (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            } else {
                reject(new Error('Could not get canvas context'));
            }
        };
        img.onerror = (error) => {
            console.error("Error loading image for PDF:", error);
            reject(new Error('Image load error'));
        };
        img.src = imageUrl;
    });
};


export const generatePdf = async (formData: FormData, isPreview = false) => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const m = 48; // margin
  const fullW = doc.internal.pageSize.width - m * 2;
  let y = m;
  const pageHeight = doc.internal.pageSize.height;

  const checkPageBreak = (increment = 0) => {
    if (y + increment > pageHeight - m) {
        doc.addPage();
        y = m;
    }
  };

  const drawSectionTitle = (title: string) => {
    checkPageBreak(40);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34,197,94); doc.text('✓', m, y); 
    doc.setTextColor(11,13,14); doc.text(title, m + 14, y);
    y += 22;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
  };
  
  const drawKeyValue = (key: string, value: string | undefined | null) => {
    if (!value || value === '—') return;
    checkPageBreak(15);
    const lines = doc.splitTextToSize(String(value), fullW - 160); // Adjust width for value
    doc.setFont('helvetica', 'bold');
    doc.text(key, m, y);
    doc.setFont('helvetica', 'normal');
    doc.text(lines, m + 150, y);
    y += lines.length * 12 + 3;
  };
  
  const drawKeyValueRow = (
    key1: string, value1: string | undefined | null,
    key2: string, value2: string | undefined | null
  ) => {
    checkPageBreak(20);
    
    const col1X = m;
    const col2X = m + fullW / 2;
    const valueOffsetX = 70; // space for the key
    const valueWidth = (fullW / 2) - valueOffsetX - 5; // 5 for padding

    const value1Safe = (value1 && value1 !== '—') ? String(value1) : '';
    const value2Safe = (value2 && value2 !== '—') ? String(value2) : '';

    const lines1 = value1Safe ? doc.splitTextToSize(value1Safe, valueWidth) : [''];
    const lines2 = value2Safe ? doc.splitTextToSize(value2Safe, valueWidth) : [''];
    
    const lineHeight = 12;
    const rowHeight = Math.max(lines1.length, lines2.length) * lineHeight + 5;
    
    if (value1Safe) {
        doc.setFont('helvetica', 'bold');
        doc.text(key1, col1X, y);
        doc.setFont('helvetica', 'normal');
        doc.text(lines1, col1X + valueOffsetX, y);
    }

    if (value2Safe) {
        doc.setFont('helvetica', 'bold');
        doc.text(key2, col2X, y);
        doc.setFont('helvetica', 'normal');
        doc.text(lines2, col2X + valueOffsetX, y);
    }
    
    y += rowHeight;
  };
  
  const drawWrappedText = (text: string) => {
    checkPageBreak(15);
    const lines = doc.splitTextToSize(text, fullW);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(lines, m, y, { lineHeightFactor: 1.4 });
    y += lines.length * 9 * 1.4 + 5;
  };
  
  const drawListText = (items: string[]) => {
      items.forEach(item => {
        checkPageBreak(15);
        const lines = doc.splitTextToSize(item, fullW - 15);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text("•", m, y);
        doc.text(lines, m + 15, y, { lineHeightFactor: 1.4 });
        y += lines.length * 9 * 1.4 + 5;
      });
  }

  // --- Header ---
  const pw = doc.internal.pageSize.getWidth();
  const refTxt = 'REF: ' + (formData.ref || 'REF');
  doc.setFont('helvetica','bold'); doc.setFontSize(18);
  const refW = doc.getTextWidth(refTxt);
  doc.text(refTxt, pw - m - refW, m + 18);
  
  try {
    const logoDataUrl = await getBase64ImageFromUrl(logoUrl);
    doc.addImage(logoDataUrl, 'PNG', m, m, 140, 48);
  } catch (e) {
    doc.setFont('helvetica','bold').setFontSize(12).text("Vida Home", m, y);
    console.error("No se pudo cargar el logo:", e);
  }
  
  doc.setFont('helvetica','bold'); doc.setFontSize(16);
  let title = 'Encargo de gestión de venta SIN EXCLUSIVA';
  const cat = (formData.categoria || 'normal');
  if (cat === 'A') title = 'Encargo de gestión de alquiler SIN EXCLUSIVA';
  doc.text(title, m, m + 78);
  doc.setFont('helvetica','normal'); doc.setFontSize(10);
  doc.text('Vida Home Gandia S.L. - CIF B75472027 - C/ Joan XXIII nº1 - 46730 Grau de Gandía - 960 519 214', m, m + 96);
  doc.setLineWidth(0.5).line(m, m + 106, pw - m, m + 106);
  y = m + 126;


  // --- 1) Datos de gestión ---
  drawSectionTitle('1) Datos de gestión');
  const getAgent = () => formData.agente === 'Otro (especificar)' ? formData.agente_otro : formData.agente;
  const agentName = getAgent();
  
  drawKeyValueRow(
    'Referencia:', formData.ref,
    'Fecha:', new Date(formData.fecha).toLocaleDateString('es-ES')
  );
  drawKeyValueRow(
    'Agente:', agentName,
    'Modalidad:', formData.categoria === 'A' ? 'Alquiler (A)' : 'Venta'
  );

  // --- 2) Propietarios ---
  drawSectionTitle('2) Propietarios');
  formData.owners.forEach((owner, index) => {
      checkPageBreak(60);
      doc.setFont('helvetica', 'bold');
      doc.text(`Propietario ${index + 1}:`, m, y); y += 18;
      doc.setFont('helvetica', 'normal');
      drawKeyValue('Nombre:', owner.nombre);
      drawKeyValue('Teléfono:', owner.telefono);
      drawKeyValue('DNI/NIE:', owner.dni);
      if (owner.email) drawKeyValue('Email:', owner.email);
      y += 5;
  });

  // --- 3) Inmueble ---
  drawSectionTitle('3) Inmueble');
  drawKeyValue('Tipo:', formData.tipo_vivienda);
  drawKeyValue('Dirección:', formData.dir);
  checkPageBreak(15);
  doc.setFont('helvetica', 'bold');
  doc.text('Ref. Catastral:', m, y);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.refcat || '__________________________________', m + 150, y);
  y += 15;

  const residentialTypes = ['Piso', 'Ático', 'Dúplex', 'Bajo', 'Casa/Chalet', 'Adosado', 'Unifamiliar'];
  const landTypes = ['Terreno urbano', 'Terreno rústico'];
  const localTypes = ['Local','Garaje','Trastero'];

  if (residentialTypes.includes(formData.tipo_vivienda)) {
      y+=5;
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
  } else if (landTypes.includes(formData.tipo_vivienda)) {
      y+=5;
      drawKeyValue('Clasificación:', formData.ter_clas);
      drawKeyValue('Superficie (m²):', formData.ter_m2);
      drawKeyValue('Edificabilidad (%):', formData.ter_edi);
  } else if (localTypes.includes(formData.tipo_vivienda)) {
      y+=5;
      if (formData.tipo_vivienda === 'Local') {
        drawKeyValue('Sup. Útil (m²):', formData.loc_m2_util);
        drawKeyValue('Sup. Const. (m²):', formData.loc_m2_const);
        drawKeyValue('Nº Baños:', formData.loc_banos);
        drawKeyValue('Fachada (m):', formData.loc_fach);
        drawKeyValue('Altura (m):', formData.loc_alt);
        drawKeyValue('Plantas:', formData.loc_plantas);
        drawKeyValue('Escaparates:', formData.loc_escaparates);
        drawKeyValue('Hace Esquina:', formData.loc_esquina);
        drawKeyValue('Oficina:', formData.loc_oficina);
        drawKeyValue('Salida Humos:', formData.loc_humo);
        if(formData.loc_extras.length > 0) drawKeyValue('Extras:', formData.loc_extras.join(', '));
      } else if (formData.tipo_vivienda === 'Garaje') {
        drawKeyValue('Capacidad:', formData.gar_capacidad);
        drawKeyValue('Superficie (m²):', formData.gar_m2);
        if(formData.gar_extras.length > 0) drawKeyValue('Extras:', formData.gar_extras.join(', '));
      } else if (formData.tipo_vivienda === 'Trastero') {
        drawKeyValue('Sup. Útil (m²):', formData.tras_m2_util);
        drawKeyValue('Sup. Const. (m²):', formData.tras_m2_const);
        if(formData.tras_extras.length > 0) drawKeyValue('Extras:', formData.tras_extras.join(', '));
      }
  }
  
  // --- QR Code ---
  if(formData.ubic_link) {
    checkPageBreak(120);
    const qrEl = document.getElementById('qr_hidden');
    if (qrEl) {
        qrEl.innerHTML = '';
        new QRCode(qrEl, { text: formData.ubic_link, width: 90, height: 90, correctLevel: QRCode.CorrectLevel.M });
        const qrCanvas = qrEl.querySelector('canvas');
        if (qrCanvas) {
            y += 15;
            const qrImg = qrCanvas.toDataURL('image/png');
            const qrX = m;
            doc.addImage(qrImg, 'PNG', qrX, y, 90, 90);
            doc.setFontSize(8).setFont('helvetica', 'normal');
            doc.text('QR Ubicación', qrX + 45, y + 100, { align: 'center' });
            y += 110;
        }
    }
  }


  // --- 4) Gastos, Ocupación y Llaves ---
  drawSectionTitle('4) Gastos, ocupación y llaves');
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
  if(formData.llaves === 'Sí') {
    if(formData.llaves_contacto) drawKeyValue('Contacto llaves:', formData.llaves_contacto);
    if(formData.llaves_tel) drawKeyValue('Teléfono llaves:', formData.llaves_tel);
    if(formData.llaves_instr) drawKeyValue('Instrucciones:', formData.llaves_instr);
  }

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
        "Obligaciones de la Propiedad: confirmar titularidad y datos, colaborar en visitas y gestiones, aportar la documentación necesaria y nota simple reciente (venta y alquiler). En alquiler, además, CEE antes de firmar."
    ];
    return [...common, specific, ...final];
  }
  y += 5;
  getDynamicClauses(formData).forEach(clause => drawListText([clause]));

  // --- 6) Observaciones ---
  drawSectionTitle('6) Observaciones y extras');
  if(formData.vistas.length) drawKeyValue('Vistas:', formData.vistas.join(', '));
  if(formData.servicios.length) drawKeyValue('Zonas/servicios:', formData.servicios.join(', '));
  if(formData.obs_otro) {
    y += 5;
    drawWrappedText(`Otros: ${formData.obs_otro}`);
  }

  // --- 7) Firmas ---
  doc.addPage();
  y = m;
  drawSectionTitle('7) Firmas');
  y += 10;
  
  const sigBoxWidth = (fullW - 20) / 2;
  const sigBoxHeight = 80;
  const sigYSpacing = sigBoxHeight + 35;
  let currentY = y;
  
  // Agent Signature
  let currentX = m;
  doc.rect(currentX, currentY, sigBoxWidth, sigBoxHeight);
  doc.setFontSize(10).setFont('helvetica', 'normal');
  doc.text(agentName, currentX + 10, currentY + sigBoxHeight + 15);
  doc.setFontSize(8).text('Intermediario (Vida Home Gandia)', currentX + 10, currentY + sigBoxHeight + 25);
  
  // Owner Signatures
  formData.owners.forEach((owner, i) => {
    const position = i + 1; // Agent is position 0
    const row = Math.floor(position / 2);
    const col = position % 2;
    
    currentX = m + col * (sigBoxWidth + 20);
    currentY = y + row * sigYSpacing;

    checkPageBreak(sigYSpacing + m);
    // If a page break happened, reset currentY for the new page
    if (doc.internal.pages.length > 2 && currentY < m) {
        currentY = m;
    }

    doc.rect(currentX, currentY, sigBoxWidth, sigBoxHeight);
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text(
        `${owner.nombre || `Propietario ${i + 1}`} (DNI: ${owner.dni || '---'})`,
        currentX + 10,
        currentY + sigBoxHeight + 15
    );
  });


  // --- 8) Acta de devolución de llaves ---
  doc.addPage();
  y = m;
  drawSectionTitle('8) Acta de devolución de llaves (recibí)');
  doc.setFontSize(10);
  const lines = [
    'Fecha y hora: ____/____/________  ____:____ h',
    'Receptor (propietario/representante): ______________________________  DNI/NIE ________________',
    'Dirección: ' + (formData.dir||'-') + '  -  Ref.: ' + (formData.ref||'-'),
    'Detalle (nº, tipo, accesorios): ________________________________',
    'Motivo: [ ] Fin del encargo   [ ] Venta/arr. por su cuenta   [ ] Retirada temporal   [ ] Otros: _____________'
  ];
  y += 10;
  lines.forEach(line => { doc.text(line, m, y); y += 22; });
  y += 10;
  const note = 'Con la presente, la persona receptora declara haber recibido las llaves en el número y estado indicados, dejando sin efecto cualquier autorización de acceso previamente otorgada a Vida Home, y asumiendo desde este acto la custodia y responsabilidad de las mismas.';
  drawWrappedText(note);
  y += 30;
  doc.text('Firma de quien recibe: _________________________        Firma y sello Vida Home: _________________________', m, y);

  // --- Footer ---
  const addFooter = () => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          const footerText = `Vida Home Gandia S.L. - CIF B75472027 - Ref ${formData.ref || 'REF'} - Página ${i}/${pageCount}`;
          const textWidth = doc.getTextWidth(footerText);
          doc.text(footerText, (doc.internal.pageSize.width - textWidth) / 2, doc.internal.pageSize.height - 20);
      }
  };

  addFooter();
  
  if (isPreview) {
    doc.output('dataurlnewwindow', {filename: `encargo_preview_${formData.ref || 'sin-ref'}.pdf`});
  } else {
    doc.save(`Encargo_VidaHome_v39c_${(formData.owners[0]?.nombre || 'encargo').replace(/\s+/g,'_')}.pdf`);
  }
};