/**
 * Report Generator for ICoMa — Intertextuality Collation Machine
 * Exports analysis results as PDF, docx, LaTeX, and TEI XML.
 */
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, TextRun, WidthType, BorderStyle,
  ImageRun,
} from 'docx';
import { saveAs } from 'file-saver';
import { AnalysisResult, AnalysisConfig, Match } from '../types';

export interface ChartImage {
  label: string;       // e.g. "Position Correspondence (Heatmap)"
  dataUrl: string;     // PNG data URL
  width: number;       // original pixel width
  height: number;      // original pixel height
}

export interface ReportData {
  witnessAlphaName: string;
  witnessBetaName: string;
  sourceText: string;
  targetText: string;
  config: AnalysisConfig;
  result: AnalysisResult;
  aiAnalysis?: any;
  date: string;
  chartImages?: ChartImage[];
}

// ── Chart capture ────────────────────────────────────────────────────

/**
 * Recursively inline computed styles from a live SVG onto a cloned SVG.
 * This is necessary because cloneNode does not preserve computed styles,
 * and when we serialize the SVG for off-screen rendering, CSS won't apply.
 */
function inlineAllStyles(source: Element, target: Element): void {
  // Only inline styles that were explicitly set (via D3 .style() or CSS classes).
  // We compare computed style against a blank SVG element to detect non-default values.
  // This avoids overwriting correct SVG attribute-based styling with bogus defaults.
  const SVG_STYLE_PROPS = [
    'fill', 'fill-opacity', 'fill-rule',
    'stroke', 'stroke-width', 'stroke-opacity', 'stroke-dasharray',
    'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit',
    'opacity', 'visibility', 'display',
    'font-family', 'font-size', 'font-weight', 'font-style',
    'text-anchor', 'dominant-baseline', 'text-decoration',
    'color', 'letter-spacing', 'word-spacing',
  ];
  try {
    const computed = window.getComputedStyle(source);
    const sourceEl = source as SVGElement | HTMLElement;
    for (const prop of SVG_STYLE_PROPS) {
      // Only inline if the source has this property set inline or via stylesheet
      // Check inline style first (highest priority)
      const inlineVal = sourceEl.style?.getPropertyValue(prop);
      if (inlineVal) {
        (target as SVGElement).style.setProperty(prop, inlineVal);
        continue;
      }
      // Check if there's an SVG attribute for this property (e.g., fill="red")
      const attrVal = source.getAttribute(prop);
      if (attrVal) {
        // SVG attribute already cloned by cloneNode, no need to inline as CSS
        continue;
      }
      // For text elements, always inline font and fill from computed (CSS class-based)
      const tagName = source.tagName.toLowerCase();
      if (tagName === 'text' || tagName === 'tspan') {
        const val = computed.getPropertyValue(prop);
        if (val && val !== 'auto' && val !== 'normal' && val !== 'inherit') {
          (target as SVGElement).style.setProperty(prop, val);
        }
      }
    }
  } catch { /* some elements may not support getComputedStyle */ }

  const srcChildren = source.children;
  const tgtChildren = target.children;
  for (let i = 0; i < srcChildren.length && i < tgtChildren.length; i++) {
    inlineAllStyles(srcChildren[i], tgtChildren[i]);
  }
}

/**
 * Captures an SVG inside a container as a PNG data URL.
 *
 * Strategy:
 * 1. Find the first <svg> descendant of the container
 * 2. Deep-clone it, inline all computed styles, set explicit pixel dimensions
 * 3. Serialize with XMLSerializer → encode as a data: URI (using encodeURIComponent
 *    for full Unicode safety — no btoa/atob needed)
 * 4. Load into an off-screen Image, draw onto a 2× Canvas, export as PNG
 */
export async function captureChartFromRef(
  container: HTMLElement,
  label: string,
  scaleFactor = 2,
): Promise<ChartImage | null> {
  try {
    // 1. Locate SVG
    const svg = container.querySelector('svg');
    if (!svg) {
      console.warn(`[ICoMa Report] No <svg> found for "${label}"`);
      return null;
    }

    // 2. Measure actual rendered size (works even if element is off-viewport)
    const rect = svg.getBoundingClientRect();
    let w = Math.round(rect.width);
    let h = Math.round(rect.height);

    // Fallback to explicit attributes if getBoundingClientRect returns 0
    if (w <= 0) w = parseInt(svg.getAttribute('width') || '0') || 800;
    if (h <= 0) h = parseInt(svg.getAttribute('height') || '0') || 400;

    // Also check viewBox as a dimension source
    if ((w <= 0 || h <= 0) && svg.getAttribute('viewBox')) {
      const vb = svg.getAttribute('viewBox')!.split(/[\s,]+/).map(Number);
      if (vb.length === 4) { w = w || Math.round(vb[2]); h = h || Math.round(vb[3]); }
    }

    console.log(`[ICoMa Report] "${label}": SVG found, measured ${w}×${h}px`);

    // 3. Clone and prepare
    const clone = svg.cloneNode(true) as SVGSVGElement;

    // Force absolute pixel dimensions (replaces "100%", percentage, etc.)
    clone.setAttribute('width', String(w));
    clone.setAttribute('height', String(h));
    // Ensure viewBox is present for proper scaling
    if (!clone.getAttribute('viewBox')) {
      clone.setAttribute('viewBox', `0 0 ${w} ${h}`);
    }
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

    // Inline computed styles for off-DOM rendering
    inlineAllStyles(svg, clone);

    // Insert white background
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', String(w));
    bg.setAttribute('height', String(h));
    bg.setAttribute('fill', 'white');
    clone.insertBefore(bg, clone.firstChild);

    // 4. Serialize → data URI (encodeURIComponent is Unicode-safe, no btoa needed)
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clone);
    const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);

    // 5. Render to Canvas
    return new Promise<ChartImage | null>((resolve) => {
      const img = new Image();
      // Timeout guard: some browsers silently fail without firing onload/onerror
      const timer = setTimeout(() => {
        console.warn(`[ICoMa Report] Image load timeout for "${label}" (5s)`);
        resolve(null);
      }, 5000);
      img.onload = () => {
        clearTimeout(timer);
        try {
          const canvas = document.createElement('canvas');
          canvas.width = w * scaleFactor;
          canvas.height = h * scaleFactor;
          const ctx = canvas.getContext('2d');
          if (!ctx) { console.error(`[ICoMa Report] No 2D context for "${label}"`); resolve(null); return; }

          // White background on canvas (in case SVG bg fails)
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.scale(scaleFactor, scaleFactor);
          ctx.drawImage(img, 0, 0, w, h);

          const pngDataUrl = canvas.toDataURL('image/png');
          if (!pngDataUrl || pngDataUrl === 'data:,') {
            console.error(`[ICoMa Report] Canvas toDataURL returned empty for "${label}"`);
            resolve(null);
            return;
          }
          console.log(`[ICoMa Report] ✓ Captured "${label}": ${w}×${h}px → PNG (${Math.round(pngDataUrl.length / 1024)}KB)`);
          resolve({ label, dataUrl: pngDataUrl, width: w, height: h });
        } catch (err) {
          console.error(`[ICoMa Report] Canvas export error for "${label}":`, err);
          resolve(null);
        }
      };
      img.onerror = (ev) => {
        clearTimeout(timer);
        console.error(`[ICoMa Report] Image load error for "${label}". DataURL length: ${dataUrl.length}`, ev);
        resolve(null);
      };
      img.src = dataUrl;
    });
  } catch (err) {
    console.error(`[ICoMa Report] captureChartFromRef exception for "${label}":`, err);
    return null;
  }
}

// ── Helpers ──────────────────────────────────────────────────────────

function escapeLatex(text: string): string {
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[&%$#_{}~^]/g, c => `\\${c}`)
    .replace(/</g, '\\textless{}')
    .replace(/>/g, '\\textgreater{}');
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

function topMatches(result: AnalysisResult, max = 50): Match[] {
  return [...result.matches].sort((a, b) => b.similarity - a.similarity).slice(0, max);
}

// ── 1. PDF ──────────────────────────────────────────────────────────

export async function generatePDF(data: ReportData): Promise<Blob> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const { config, result, witnessAlphaName: wA, witnessBetaName: wB } = data;

  // jsPDF default fonts don't support Unicode Greek — use ASCII fallbacks
  const pdfSafe = (s: string) => s.replace(/α/g, '(alpha)').replace(/β/g, '(beta)').replace(/↔/g, '<->').replace(/…/g, '...').replace(/[^\x00-\x7F]/g, '?');
  const pA = pdfSafe(wA), pB = pdfSafe(wB);

  // Title
  doc.setFontSize(20);
  doc.text('ICoMa — Intertextuality Analysis Report', 105, 30, { align: 'center' });
  doc.setFontSize(11);
  doc.text(`Generated: ${data.date}`, 105, 40, { align: 'center' });
  doc.text(`${pA}  <->  ${pB}`, 105, 48, { align: 'center' });

  // Config
  doc.setFontSize(14);
  doc.text('1. Analysis Configuration', 14, 65);
  autoTable(doc, {
    startY: 70,
    head: [['Parameter', 'Value']],
    body: [
      ['Algorithm', config.algorithm],
      ['Window / N-Size', String(config.windowSize)],
      ['Threshold', `${config.threshold}%`],
      ['Script Mode', config.scriptMode],
    ],
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 14, right: 14 },
  });

  // Stats
  const statsY = (doc as any).lastAutoTable?.finalY + 12 || 120;
  doc.setFontSize(14);
  doc.text('2. Statistical Summary', 14, statsY);
  autoTable(doc, {
    startY: statsY + 5,
    head: [['Metric', 'Value']],
    body: [
      ['Mean Similarity', `${result.stats.meanSimilarity.toFixed(1)}%`],
      ['Reuse Coverage', `${result.stats.coverage.toFixed(1)}%`],
      ['Total Alignments', String(result.stats.totalAlignments)],
      ['Unique N-Grams', String(result.stats.uniqueNgrams)],
      ['Tokens (' + pA + ')', String(result.tokensA.length)],
      ['Tokens (' + pB + ')', String(result.tokensB.length)],
      ['Total Matches', String(result.matches.length)],
    ],
    theme: 'grid',
    headStyles: { fillColor: [217, 119, 6] },
    margin: { left: 14, right: 14 },
  });

  // Matches table
  const matchesY = (doc as any).lastAutoTable?.finalY + 12 || 200;
  doc.setFontSize(14);
  doc.text('3. Match Rankings (Top 50)', 14, matchesY);
  const top = topMatches(result);
  autoTable(doc, {
    startY: matchesY + 5,
    head: [['#', 'Sim%', `${pA}`, `${pB}`, '<-> pos', '<-> pos']],
    body: top.map((m, i) => [
      String(i + 1),
      m.similarity.toFixed(1),
      pdfSafe(truncate(m.sourcePhrase, 40)),
      pdfSafe(truncate(m.targetPhrase, 40)),
      String(m.sourcePosition),
      String(m.targetPosition),
    ]),
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235], fontSize: 8 },
    bodyStyles: { fontSize: 7 },
    columnStyles: { 0: { cellWidth: 8 }, 1: { cellWidth: 12 } },
    margin: { left: 14, right: 14 },
  });

  // ── Visualization Charts ──
  if (data.chartImages && data.chartImages.length > 0) {
    doc.addPage();
    doc.setFontSize(14);
    doc.text('4. Visualizations', 14, 20);
    let curY = 30;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxW = pageWidth - 28; // 14mm margin each side

    for (const chart of data.chartImages) {
      // Calculate image dimensions to fit page width
      const aspectRatio = chart.height / chart.width;
      const imgW = maxW;
      const imgH = imgW * aspectRatio;

      // Check if we need a new page
      if (curY + imgH + 12 > doc.internal.pageSize.getHeight() - 14) {
        doc.addPage();
        curY = 20;
      }

      doc.setFontSize(10);
      doc.setTextColor(37, 99, 235);
      doc.text(pdfSafe(chart.label), 14, curY);
      doc.setTextColor(0, 0, 0);
      curY += 4;

      try {
        // Validate data URL before adding
        if (!chart.dataUrl || !chart.dataUrl.startsWith('data:image/png')) {
          throw new Error('Invalid PNG data URL');
        }
        doc.addImage(chart.dataUrl, 'PNG', 14, curY, imgW, imgH);
        console.log(`[ICoMa PDF] Embedded "${chart.label}" at y=${curY}, size=${imgW.toFixed(0)}x${imgH.toFixed(0)}mm`);
      } catch (e) {
        console.error(`[ICoMa PDF] Failed to embed "${chart.label}":`, e);
        doc.setFontSize(8);
        doc.text(`[${pdfSafe(chart.label)}: image could not be embedded]`, 14, curY + 5);
      }
      curY += imgH + 10;
    }
  }

  // ── AI Analysis ──
  if (data.aiAnalysis) {
    const aiY = (data.chartImages && data.chartImages.length > 0)
      ? undefined  // already on a potentially new page
      : (doc as any).lastAutoTable?.finalY + 12;
    if (aiY) {
      if (aiY > doc.internal.pageSize.getHeight() - 40) doc.addPage();
    } else {
      doc.addPage();
    }
    const startAiY = aiY || 20;
    doc.setFontSize(14);
    const sectionNum = (data.chartImages && data.chartImages.length > 0) ? '5' : '4';
    doc.text(`${sectionNum}. AI Intertextuality Analysis`, 14, startAiY);
    doc.setFontSize(9);
    const aiText = typeof data.aiAnalysis === 'string'
      ? data.aiAnalysis
      : JSON.stringify(data.aiAnalysis, null, 2);
    const aiSafe = pdfSafe(aiText);
    const aiMaxW = doc.internal.pageSize.getWidth() - 28;
    const lines = doc.splitTextToSize(aiSafe, aiMaxW);
    doc.text(lines, 14, startAiY + 8);
  }

  return doc.output('blob');
}

// ── 2. DOCX ─────────────────────────────────────────────────────────

function makeCell(text: string, bold = false): TableCell {
  return new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text, bold, size: 18 })],
    })],
    verticalAlign: 'center' as any,
  });
}

export async function generateDocx(data: ReportData): Promise<Blob> {
  const { config, result, witnessAlphaName: wA, witnessBetaName: wB } = data;
  const top = topMatches(result);

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ text: 'ICoMa — Intertextuality Analysis Report', heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }),
        new Paragraph({ text: `${wA}  ↔  ${wB} | ${data.date}`, alignment: AlignmentType.CENTER }),
        new Paragraph({ text: '' }),

        // Config
        new Paragraph({ text: '1. Analysis Configuration', heading: HeadingLevel.HEADING_1 }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({ children: [makeCell('Parameter', true), makeCell('Value', true)] }),
            new TableRow({ children: [makeCell('Algorithm'), makeCell(config.algorithm)] }),
            new TableRow({ children: [makeCell('Window / N-Size'), makeCell(String(config.windowSize))] }),
            new TableRow({ children: [makeCell('Threshold'), makeCell(`${config.threshold}%`)] }),
            new TableRow({ children: [makeCell('Script Mode'), makeCell(config.scriptMode)] }),
          ],
        }),
        new Paragraph({ text: '' }),

        // Stats
        new Paragraph({ text: '2. Statistical Summary', heading: HeadingLevel.HEADING_1 }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({ children: [makeCell('Metric', true), makeCell('Value', true)] }),
            new TableRow({ children: [makeCell('Mean Similarity'), makeCell(`${result.stats.meanSimilarity.toFixed(1)}%`)] }),
            new TableRow({ children: [makeCell('Reuse Coverage'), makeCell(`${result.stats.coverage.toFixed(1)}%`)] }),
            new TableRow({ children: [makeCell('Total Alignments'), makeCell(String(result.stats.totalAlignments))] }),
            new TableRow({ children: [makeCell('Unique N-Grams'), makeCell(String(result.stats.uniqueNgrams))] }),
            new TableRow({ children: [makeCell(`Tokens (${wA})`), makeCell(String(result.tokensA.length))] }),
            new TableRow({ children: [makeCell(`Tokens (${wB})`), makeCell(String(result.tokensB.length))] }),
          ],
        }),
        new Paragraph({ text: '' }),

        // Matches
        new Paragraph({ text: '3. Match Rankings (Top 50)', heading: HeadingLevel.HEADING_1 }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [makeCell('#', true), makeCell('Sim%', true), makeCell(`${wA} (α)`, true), makeCell(`${wB} (β)`, true), makeCell('α pos', true), makeCell('β pos', true)],
            }),
            ...top.map((m, i) => new TableRow({
              children: [
                makeCell(String(i + 1)),
                makeCell(m.similarity.toFixed(1)),
                makeCell(truncate(m.sourcePhrase, 60)),
                makeCell(truncate(m.targetPhrase, 60)),
                makeCell(String(m.sourcePosition)),
                makeCell(String(m.targetPosition)),
              ],
            })),
          ],
        }),

        // Visualization charts
        ...(data.chartImages && data.chartImages.length > 0 ? [
          new Paragraph({ text: '' }),
          new Paragraph({ text: '4. Visualizations', heading: HeadingLevel.HEADING_1 }),
          ...data.chartImages.flatMap(chart => {
            try {
              const base64 = chart.dataUrl.split(',')[1];
              if (!base64) return [new Paragraph({ text: `[${chart.label}: no image data]` })];
              const buf = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
              // Scale to fit ~6 inches wide (576 pixels at 96 DPI)
              const maxPxW = 576;
              const aspectRatio = chart.height / chart.width;
              const pxW = Math.min(maxPxW, chart.width);
              const pxH = Math.round(pxW * aspectRatio);
              return [
                new Paragraph({
                  children: [new TextRun({ text: chart.label, bold: true, size: 20, color: '2563EB' })],
                }),
                new Paragraph({
                  children: [
                    new ImageRun({
                      type: 'png',
                      data: buf,
                      transformation: { width: pxW, height: pxH },
                    }),
                  ],
                }),
                new Paragraph({ text: '' }),
              ];
            } catch (e) {
              console.error(`[ICoMa Report] DOCX image embed failed for "${chart.label}":`, e);
              return [new Paragraph({ text: `[${chart.label}: image could not be embedded]` })];
            }
          }),
        ] : []),

        // AI Analysis
        ...(data.aiAnalysis ? [
          new Paragraph({ text: '' }),
          new Paragraph({
            text: (data.chartImages && data.chartImages.length > 0) ? '5. AI Intertextuality Analysis' : '4. AI Intertextuality Analysis',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [new TextRun({
              text: typeof data.aiAnalysis === 'string' ? data.aiAnalysis : JSON.stringify(data.aiAnalysis, null, 2),
              size: 18,
            })],
          }),
        ] : []),
      ],
    }],
  });

  return Packer.toBlob(doc);
}

// ── 3. LaTeX ────────────────────────────────────────────────────────

export function generateLaTeX(data: ReportData): string {
  const { config, result, witnessAlphaName: wA, witnessBetaName: wB } = data;
  const top = topMatches(result);
  const eA = escapeLatex(wA), eB = escapeLatex(wB);

  const matchRows = top.map((m, i) =>
    `  ${i + 1} & ${m.similarity.toFixed(1)}\\% & ${escapeLatex(truncate(m.sourcePhrase, 50))} & ${escapeLatex(truncate(m.targetPhrase, 50))} & ${m.sourcePosition} & ${m.targetPosition} \\\\`
  ).join('\n');

  return `\\documentclass[a4paper,11pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{booktabs,longtable,hyperref,geometry,graphicx}
\\geometry{margin=2.5cm}
\\title{ICoMa --- Intertextuality Analysis Report\\\\\\large ${eA} $\\leftrightarrow$ ${eB}}
\\author{Generated by ICoMa}
\\date{${escapeLatex(data.date)}}

\\begin{document}
\\maketitle

\\section{Analysis Configuration}
\\begin{tabular}{ll}
\\toprule
\\textbf{Parameter} & \\textbf{Value} \\\\
\\midrule
Algorithm & ${escapeLatex(config.algorithm)} \\\\
Window / N-Size & ${config.windowSize} \\\\
Threshold & ${config.threshold}\\% \\\\
Script Mode & ${escapeLatex(config.scriptMode)} \\\\
\\bottomrule
\\end{tabular}

\\section{Statistical Summary}
\\begin{tabular}{ll}
\\toprule
\\textbf{Metric} & \\textbf{Value} \\\\
\\midrule
Mean Similarity & ${result.stats.meanSimilarity.toFixed(1)}\\% \\\\
Reuse Coverage & ${result.stats.coverage.toFixed(1)}\\% \\\\
Total Alignments & ${result.stats.totalAlignments} \\\\
Unique N-Grams & ${result.stats.uniqueNgrams} \\\\
Tokens (${eA}) & ${result.tokensA.length} \\\\
Tokens (${eB}) & ${result.tokensB.length} \\\\
Total Matches & ${result.matches.length} \\\\
\\bottomrule
\\end{tabular}

\\section{Match Rankings (Top 50)}
\\begin{longtable}{rr p{4.5cm} p{4.5cm} rr}
\\toprule
\\textbf{\\#} & \\textbf{Sim\\%} & \\textbf{${eA} ($\\alpha$)} & \\textbf{${eB} ($\\beta$)} & \\textbf{$\\alpha$ pos} & \\textbf{$\\beta$ pos} \\\\
\\midrule
\\endhead
${matchRows}
\\bottomrule
\\end{longtable}

\\section{Visualizations}
\\textit{Note: Visualization charts (Alignment Flow, Heatmap, Similarity Distribution, Network Graph, Dispersion Plot) are included in the PDF and DOCX versions of this report. To include them in the LaTeX version, export the charts from the ICoMa interface and use \\texttt{\\textbackslash{}includegraphics} commands below.}

% \\begin{figure}[htbp]
%   \\centering
%   \\includegraphics[width=\\textwidth]{icoma-alignment-flow.png}
%   \\caption{Macro-Level Alignment Flow}
% \\end{figure}
%
% \\begin{figure}[htbp]
%   \\centering
%   \\includegraphics[width=\\textwidth]{icoma-heatmap.png}
%   \\caption{Position Correspondence (Heatmap)}
% \\end{figure}
%
% \\begin{figure}[htbp]
%   \\centering
%   \\includegraphics[width=\\textwidth]{icoma-similarity-histogram.png}
%   \\caption{Similarity Distribution}
% \\end{figure}
%
% \\begin{figure}[htbp]
%   \\centering
%   \\includegraphics[width=\\textwidth]{icoma-network-graph.png}
%   \\caption{Cluster View (Network Graph)}
% \\end{figure}
%
% \\begin{figure}[htbp]
%   \\centering
%   \\includegraphics[width=\\textwidth]{icoma-dispersion-plot.png}
%   \\caption{Witness Dispersion}
% \\end{figure}

\\end{document}
`;
}

// ── 4. TEI XML ──────────────────────────────────────────────────────

export function generateTEIXML(data: ReportData): string {
  const { config, result, witnessAlphaName: wA, witnessBetaName: wB } = data;
  const top = topMatches(result);

  const matchEntries = top.map((m, i) => `
      <entry n="${i + 1}">
        <form type="alpha"><mentioned>${escapeXml(m.sourcePhrase)}</mentioned></form>
        <form type="beta"><mentioned>${escapeXml(m.targetPhrase)}</mentioned></form>
        <measure type="similarity" quantity="${m.similarity.toFixed(1)}">${m.similarity.toFixed(1)}%</measure>
        <note type="position-alpha">${m.sourcePosition}</note>
        <note type="position-beta">${m.targetPosition}</note>
      </entry>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-model href="http://www.tei-c.org/release/xml/tei/custom/schema/relaxng/tei_all.rng" type="application/xml"?>
<TEI xmlns="http://www.tei-c.org/ns/1.0">
  <teiHeader>
    <fileDesc>
      <titleStmt>
        <title>ICoMa Intertextuality Analysis Report</title>
        <respStmt>
          <resp>Generated by</resp>
          <name>ICoMa — Intertextuality Collation Machine</name>
        </respStmt>
      </titleStmt>
      <publicationStmt>
        <p>Auto-generated report, ${escapeXml(data.date)}</p>
      </publicationStmt>
      <sourceDesc>
        <bibl>
          <title type="alpha">${escapeXml(wA)}</title>
          <title type="beta">${escapeXml(wB)}</title>
        </bibl>
      </sourceDesc>
    </fileDesc>
    <encodingDesc>
      <appInfo>
        <application ident="ICoMa" version="3.0.0">
          <desc>Intertextuality Collation Machine</desc>
        </application>
      </appInfo>
    </encodingDesc>
  </teiHeader>
  <text>
    <body>
      <div type="configuration">
        <head>Analysis Configuration</head>
        <list>
          <item><label>Algorithm</label> <val>${escapeXml(config.algorithm)}</val></item>
          <item><label>Window / N-Size</label> <val>${config.windowSize}</val></item>
          <item><label>Threshold</label> <val>${config.threshold}%</val></item>
          <item><label>Script Mode</label> <val>${escapeXml(config.scriptMode)}</val></item>
        </list>
      </div>
      <div type="statistics">
        <head>Statistical Summary</head>
        <list>
          <item><label>Mean Similarity</label> <val>${result.stats.meanSimilarity.toFixed(1)}%</val></item>
          <item><label>Reuse Coverage</label> <val>${result.stats.coverage.toFixed(1)}%</val></item>
          <item><label>Total Alignments</label> <val>${result.stats.totalAlignments}</val></item>
          <item><label>Unique N-Grams</label> <val>${result.stats.uniqueNgrams}</val></item>
          <item><label>Tokens (${escapeXml(wA)})</label> <val>${result.tokensA.length}</val></item>
          <item><label>Tokens (${escapeXml(wB)})</label> <val>${result.tokensB.length}</val></item>
          <item><label>Total Matches</label> <val>${result.matches.length}</val></item>
        </list>
      </div>
      <div type="matches">
        <head>Match Rankings (Top 50)</head>
        <listBibl>${matchEntries}
        </listBibl>
      </div>
      <div type="witnesses">
        <head>Full Witness Texts</head>
        <quote type="alpha" xml:id="witness-alpha">
          ${escapeXml(truncate(data.sourceText, 2000))}
        </quote>
        <quote type="beta" xml:id="witness-beta">
          ${escapeXml(truncate(data.targetText, 2000))}
        </quote>
      </div>
    </body>
  </text>
</TEI>
`;
}

// ── Download dispatcher ─────────────────────────────────────────────

export async function downloadReport(
  data: ReportData,
  format: 'pdf' | 'docx' | 'latex' | 'tei-xml',
): Promise<void> {
  const safeName = `${data.witnessAlphaName}-${data.witnessBetaName}`.replace(/[^a-zA-Z0-9_\-\u3000-\u9FFF\u00C0-\u024F]/g, '_').slice(0, 40);
  const ts = new Date().toISOString().slice(0, 10);

  switch (format) {
    case 'pdf': {
      const blob = await generatePDF(data);
      saveAs(blob, `icoma-report-${safeName}-${ts}.pdf`);
      break;
    }
    case 'docx': {
      const blob = await generateDocx(data);
      saveAs(blob, `icoma-report-${safeName}-${ts}.docx`);
      break;
    }
    case 'latex': {
      const tex = generateLaTeX(data);
      const blob = new Blob([tex], { type: 'application/x-tex;charset=utf-8' });
      saveAs(blob, `icoma-report-${safeName}-${ts}.tex`);
      break;
    }
    case 'tei-xml': {
      const xml = generateTEIXML(data);
      const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
      saveAs(blob, `icoma-report-${safeName}-${ts}.xml`);
      break;
    }
  }
}
